"""Shared checks for actual same-ring exception frames and curated literal sources."""
import re
import struct
import subprocess
import tempfile
import time
from pathlib import Path



ERROR_VECTORS = {8, 10, 11, 12, 13, 14, 17}
RESERVED = {9, 15}
CASES = {"program": (4, 0, [0, 3, 6, 13]),
         "divisor-one": (3, 0, [3, 6, 13]),
         "stop-divide": (1, 1, [0]),
         "retry-divide": (4, 1, [0, 0, 0, 0])}


def capture_guest(test, guest, data, name):
    expected_ip = 0x7F3B if CASES[name][1] else 0x7EA2
    deadline = time.monotonic() + 15
    while True:
        registers = guest.hmp("info registers")
        if "HLT=1" in registers and f"EIP={expected_ip:08x}" in registers:
            break
        guest.alive(deadline)
        time.sleep(0.02)
    guest.command("stop")
    result = (registers, guest.memory(0x6000, 144), guest.memory(0x8FCC, 52),
              guest.memory(0x7E00, len(data)), guest.memory(0x8FCB, 1) + guest.memory(0x9000, 1))
    check_snapshot(test, name, data, *result)
    return result


def source_ranges():
    return [(0, 39, 16), (40, 162, 32), (192, 294, 32), (304, 315, 32)] + [
        (320 + 9 * vector, 320 + 9 * vector + (7 if vector in ERROR_VECTORS else 9), 32)
        for vector in range(20) if vector not in RESERVED]


def check_source(test, data, annotations):
    test.assertEqual(len(data), 736)
    test.assertEqual(struct.unpack_from("<HI", data, 536), (23, 0x8000))
    test.assertEqual(struct.unpack_from("<HI", data, 542), (159, 0x8040))
    for vector in range(20):
        gate = struct.unpack_from("<HHBBH", data, 576 + vector * 8)
        stub = 320 + vector * 9
        if vector in RESERVED:
            test.assertEqual(gate, (0, 0, 0, 0, 0))
            test.assertEqual(data[stub:stub + 9], bytes(9))
            continue
        test.assertEqual(gate, (0x7E00 + stub, 8, 0, 0x8E, 0))
        if vector in ERROR_VECTORS:
            test.assertEqual(data[stub:stub + 3], bytes([0x6A, vector, 0xE9]))
            displacement = stub + 3
        else:
            test.assertEqual(data[stub:stub + 5], bytes([0x6A, 0, 0x6A, vector, 0xE9]))
            displacement = stub + 5
        test.assertEqual(displacement + 4 + struct.unpack_from("<i", data, displacement)[0], 192)
    with tempfile.TemporaryDirectory(prefix="bitborn-dispatch-golden-") as temporary:
        path = Path(temporary) / "payload.bin"
        for start, end, mode in source_ranges():
            path.write_bytes(data[start:end])
            rows = []
            for line in subprocess.check_output(["ndisasm", "-b", str(mode), str(path)], text=True).splitlines():
                if line.lstrip().startswith("-"):
                    rows[-1][1] += bytes.fromhex(line.strip()[1:])
                else:
                    offset, encoded = line.split()[:2]
                    rows.append([int(offset, 16) + start, bytes.fromhex(encoded)])
            expected = [item for item in annotations if item["kind"] == "instruction" and start <= item["offset"] < end]
            test.assertEqual(len(rows), len(expected))
            for (offset, encoded), annotation in zip(rows, expected):
                test.assertEqual(offset, annotation["offset"])
                test.assertEqual(encoded, data[offset:offset + annotation["size"]])


def check_snapshot(test, name, data, registers, log, stack, ram, guards):
    count, status, vectors = CASES[name]
    test.assertEqual(len(ram), len(data))
    def register(key):
        return int(re.search(rf"(?:^|\s){key}=([0-9a-fA-F]+)", registers)[1], 16)
    test.assertEqual(register("EIP"), 0x7F3B if status else 0x7EA2)
    test.assertEqual(register("ESP"), 0x8FCC if status else 0x9000)
    test.assertEqual(register("EFL") & 0x600, 0x400, "IF remains zero and caller DF remains one")
    test.assertEqual(register("CR0") & 0x80000001, 1, "protected mode without paging")
    test.assertRegex(registers, r"GDT=\s+00008000\s+00000017")
    test.assertRegex(registers, r"IDT=\s+00008040\s+0000009f")
    for segment, selector in [("CS", 8), ("DS", 16), ("ES", 16), ("FS", 16), ("GS", 16), ("SS", 16)]:
        test.assertRegex(registers, rf"(?:^|\n){segment}\s*={selector:04x}\s+00000000\s+ffffffff")
    test.assertEqual(struct.unpack_from("<II", log, 128), (count, status))
    expected_log = bytearray(144)
    expected_log[112] = 0xA5
    expected_log[116] = 0x5A
    struct.pack_into("<II", expected_log, 128, count, status)
    rows = []
    for index, vector in enumerate(vectors):
        row = struct.unpack_from("<7I", log, index * 28)
        pc = {0: 0x7E90, 3: 0x7E93, 6: 0x7E93, 13: 0x7E9A}[vector]
        resume = pc if status or vector == 3 else pc + 2
        test.assertEqual(row[:3], (vector, 0x18 if vector == 13 else 0, pc))
        test.assertEqual(row[3] & 0xFFFF, 8)
        test.assertEqual(row[4] & 0x602, 0x402)
        test.assertEqual(row[5:], (0x8FEC, resume))
        struct.pack_into("<7I", expected_log, index * 28, *row)
        rows.append(row)
    test.assertEqual(log, expected_log, "all unused log bytes and guards are unchanged")
    test.assertEqual(guards, b"\xa5\x5a")
    last = rows[-1]
    test.assertEqual(struct.unpack_from("<5I", stack, 32), (last[0], last[1], last[6], last[3], last[4]))
    caller = (0x55667788, 0x11223344, 0x99AABBCC, 0x8FEC,
              1 if name == "divisor-one" else 0, 0, 0xDDEEFF00, 42 if status else 0x18)
    test.assertEqual(struct.unpack_from("<8I", stack), caller, "PUSHAD retained the caller's actual context")
    if not status:
        for key, value in {"EAX": 0xD1500004, "EBX": caller[4], "ECX": 0xDDEEFF00,
                           "EDX": 0, "ESI": 0x11223344, "EDI": 0x55667788, "EBP": 0x99AABBCC}.items():
            test.assertEqual(register(key), value)
        test.assertEqual(register("EFL") & 0xED5, last[4] & 0xED5, "IRETD restores the captured arithmetic/IF/DF bits")
    for offset, (original, actual) in enumerate(zip(data, ram)):
        if offset in (525, 533):
            test.assertEqual((original ^ actual) & 0xFE, 0, f"non-access GDT bits changed at {offset}")
        else:
            test.assertEqual(actual, original, f"source RAM changed at {offset}")
