#!/usr/bin/env python3
"""Capture actual native exception logs and retained frames, not a trace."""
import json
import os
import re
import struct
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from tools.bitborn import read_bits, digest
from tools.build import bios_sector
from tests.qemu import Guest
from tests.exception_dispatch_checks import CASES, source_ranges, check_source, capture_guest


def main():
    validator = unittest.TestCase()
    loader, _ = read_bits(ROOT / "boot/loader.bits")
    captures = []
    for name in CASES:
        source = f"examples/exception-dispatch/{name}.bits"
        data, annotations = read_bits(ROOT / source)
        check_source(validator, data, annotations)
        golden = b"".join(subprocess.run(["ndisasm", "-b", str(mode), "-o", str(start), "-"],
                                         input=data[start:end], capture_output=True, check=True, timeout=10).stdout
                          for start, end, mode in source_ranges())
        image_bytes = bios_sector(loader) + data + bytes(1024 - len(data))
        with tempfile.TemporaryDirectory(prefix="bitborn-dispatch-capture-") as temporary:
            image = Path(temporary) / "dispatch.img"
            image.write_bytes(image_bytes)
            with Guest(image) as guest:
                registers, log, stack, ram, guards = capture_guest(validator, guest, data, name)
            assert image.read_bytes() == image_bytes
        normalized_text = "\n".join(line.rstrip() for line in registers.strip().splitlines()) + "\n"
        assets = {}
        for label, value in [("registers.txt", normalized_text.encode()), ("disassembly.txt", golden),
                             ("log.bin", log), ("stack.bin", stack), ("ram.bin", ram)]:
            path = f"assets/exception-dispatch-{name}-{label}"
            (ROOT / path).write_bytes(value)
            assets[label] = {"file": path, "size": len(value), "sha256": digest(value)}
        actual_count, actual_status = struct.unpack_from("<II", log, 128)
        keys = ["vector", "error", "savedEIP", "savedCS", "savedFlags", "entryESP", "returnEIP"]
        snapshot = {"count": actual_count, "stopStatus": actual_status,
                    "registers": {key: int(re.search(rf"(?:^|\s){key}=([0-9a-fA-F]+)", registers)[1], 16)
                                  for key in ["EAX", "EBX", "ECX", "EDX", "ESI", "EDI", "EBP", "ESP", "EIP", "EFL", "CR0"]},
                    "records": [dict(zip(keys, struct.unpack_from("<7I", log, index * 28))) for index in range(actual_count)],
                    "stackGuards": list(guards), "normalizedFrame": list(struct.unpack_from("<5I", stack, 32)),
                    "pushadContext": list(struct.unpack_from("<8I", stack))}
        captures.append({"source": source, "payloadSize": len(data), "payloadSha256": digest(data),
                         "imageSize": len(image_bytes), "imageSha256": digest(image_bytes),
                         "snapshot": snapshot, "assets": assets})
    inputs = ["tools/record_exception_dispatch.py", "tools/build.py", "tools/bitborn.py", "tests/qemu.py",
              "tests/exception_dispatch_checks.py", "boot/loader.bits"] + [capture["source"] for capture in captures]
    version = subprocess.run([os.environ.get("QEMU", "qemu-system-i386"), "--version"],
                             capture_output=True, text=True, check=True, timeout=10).stdout.splitlines()[0]
    record = {"kind": "Actual final QMP snapshots, native-written normalized exception logs and retained stack/RAM from four curated QEMU boots; not an instruction trace, arbitrary recovery or isolation proof",
              "qemu": version, "textFormat": "Native HMP register output with LF endings and trailing whitespace removed",
              "goldenFormat": "Independent instruction-only NDISASM blocks with explicit 16/32-bit context and source-relative offsets",
              "scope": {"legacyVectorSlots": 20, "presentGates": 18, "reservedAbsent": [9, 15],
                        "nativeExercisedVectors": [0, 3, 6, 13], "hardwareErrorVectorsWithinScope": [8, 10, 11, 12, 13, 14, 17],
                        "privilegeLevel": 0, "paging": False, "modernVectorsAbove19": False},
              "memoryMap": {"loadAddress": 0x7E00, "log": 0x6000, "logRegionSize": 144,
                            "recordSize": 28, "capacity": 4, "count": 0x6080, "stopStatus": 0x6084,
                            "stackTop": 0x9000, "retainedContext": 0x8FCC, "retainedContextSize": 52},
              "controls": {"divisor-one": {"changedByte": 135, "mask": 1, "effect": "DIV succeeds; no divide-error entry"},
                           "stop-divide": {"changedByte": 548, "mask": 128, "effect": "Capture one divide error then retain the diagnostic frame"},
                           "retry-divide": {"changedByte": 548, "mask": 2, "effect": "Retry the same divide fault; fifth entry stops before overflowing four records"}},
              "sourceSha256": {source: digest((ROOT / source).read_bytes()) for source in inputs},
              "captures": captures, "reproduce": "python3 tools/record_exception_dispatch.py"}
    (ROOT / "assets/exception-dispatch-recording.json").write_text(json.dumps(record, indent=2) + "\n")
    print("Captured four native exception-dispatch boots: shared error/no-error frames, trap/fault EIPs, three one-bit controls, retained contexts, bounded logs and independent goldens.")


if __name__ == "__main__":
    main()
