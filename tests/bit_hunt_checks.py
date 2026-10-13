"""Independent coordinate oracle and actual native text-game checks."""
import re
import struct
import subprocess
import tempfile
import time
from pathlib import Path

GRID = ("############", "#          #", "#   #   #  #", "#         *#", "############")
TITLE = b"BIT HUNT | WASD | R | Q "
WIN_PATH = ["w", "a", "z", "d", "d", "d", "s", "d", "s", "s"] + ["d"] * 5


class GameOracle:
    def __init__(self, collects_star=True):
        self.row, self.column, self.moves, self.won, self.events = 1, 1, 0, False, 0
        self.collects_star = collects_star

    def apply(self, key):
        self.events = (self.events + 1) & 0xFFFF
        key = key.lower()
        if key == "r":
            self.row, self.column, self.moves, self.won = 1, 1, 0, False
        elif key in "wasd":
            dr, dc = {"w": (-1, 0), "a": (0, -1), "s": (1, 0), "d": (0, 1)}[key]
            row, column = self.row + dr, self.column + dc
            if 0 <= row < 5 and 0 <= column < 12 and GRID[row][column] != "#":
                self.row, self.column = row, column
                self.moves = min(255, self.moves + 1)
                self.won |= self.collects_star and GRID[row][column] == "*"

    def state(self):
        return struct.pack("<HBBBBH", self.row * 12 + self.column, self.moves, 0, self.won, 0, self.events)

    def status(self):
        return f"WIN: {'Y' if self.won else 'N'} M:{self.moves:02X}".encode()


def check_source(test, data, annotations):
    test.assertEqual(len(data), 492)
    test.assertEqual(data[392:452], "".join(GRID).encode())
    test.assertEqual(data[452:476], TITLE)
    test.assertEqual(data[476:], b"0123456789ABCDEF")
    with tempfile.TemporaryDirectory(prefix="bitborn-game-golden-") as temporary:
        path = Path(temporary) / "payload.bin"
        for start, end in [(0, 168), (176, 183), (224, 389)]:
            path.write_bytes(data[start:end])
            lines = subprocess.check_output(["ndisasm", "-b", "16", str(path)], text=True).splitlines()
            expected = [item for item in annotations if item["kind"] == "instruction" and start <= item["offset"] < end]
            test.assertEqual(len(lines), len(expected))
            for line, item in zip(lines, expected):
                offset, raw = line.split()[:2]
                test.assertEqual(int(offset, 16) + start, item["offset"])
                test.assertEqual(bytes.fromhex(raw), data[item["offset"]:item["offset"] + item["size"]])


def wait_game(guest, oracle):
    deadline = time.monotonic() + 15
    while guest.memory(0x2000, 8) != oracle.state() or guest.memory(0xB8000 + 1828, 22)[::2] != oracle.status():
        guest.alive(deadline)
        time.sleep(0.01)


def check_game(test, guest, data, oracle):
    wait_game(guest, oracle)
    test.assertEqual(guest.memory(0x1FFF, 10), b"\xa5" + oracle.state() + b"\x5a")
    test.assertEqual(guest.memory(0x7C00, len(data)), data, "all instructions and literal map bytes are unchanged")
    screen = guest.memory(0xB8000, 4000)
    for row in range(5):
        expected = bytearray()
        for column, character in enumerate(GRID[row]):
            player = (row, column) == (oracle.row, oracle.column)
            expected.extend((ord("@") if player else ord(character), 0x0F if player else 0x0A))
        offset = 868 + row * 160
        test.assertEqual(screen[offset:offset + 24], expected, f"actual VGA row {row}")
    test.assertEqual(screen[540:588], b"".join(bytes((character, 15)) for character in TITLE))
    test.assertEqual(screen[1828:1850:2], oracle.status())
    return screen


def quit_game(test, guest, oracle):
    guest.key("q")
    oracle.apply("q")
    deadline = time.monotonic() + 15
    while True:
        registers = guest.hmp("info registers")
        if "EIP=00007cb5" in registers and "HLT=1" in registers:
            break
        guest.alive(deadline)
        time.sleep(0.01)
    guest.command("stop")
    test.assertEqual(int(re.search(r"EAX=([0-9a-f]+)", registers)[1], 16) & 0xFFFF, 0xBEEF)
    test.assertEqual(int(re.search(r"ESP=([0-9a-f]+)", registers)[1], 16) & 0xFFFF, 0x7C00)
    test.assertFalse(int(re.search(r"EFL=([0-9a-f]+)", registers)[1], 16) & 0x200)
    return registers
