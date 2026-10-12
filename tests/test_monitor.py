import tempfile
import unittest
from pathlib import Path
from tools.bitborn import ROOT, read_bits
from tools.build import bios_sector
from tests.qemu import Guest


def type_text(guest, text):
    for char in text:
        before = len(guest.output())
        guest.key("spc" if char == " " else char)
        guest.wait_for(lambda data: len(data) > before)


def command(guest, text):
    type_text(guest, text)
    before = len(guest.output())
    guest.key("ret")
    return guest.wait_for(lambda data: len(data) > before and data.endswith(b"> "))[before:]


class MonitorTests(unittest.TestCase):
    def test_actual_disk_read_and_loaded_bytes(self):
        with Guest(ROOT / "build/disk-read.img") as guest:
            self.assertEqual(guest.wait_for(lambda data: b"Sector 2 loaded!\r\n" in data), b"Sector 2 loaded!\r\n")
            stage, _ = read_bits(ROOT / "examples/disk-read/program.bits")
            self.assertEqual(guest.memory(0x7E00, len(stage)), stage)

    def test_disk_error_stops_without_executing_stage(self):
        loader, _ = read_bits(ROOT / "boot/loader.bits")
        invalid = bytearray(loader)
        invalid[26] = 0  # Invalid CHS sector zero forces the actual BIOS error path.
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "bad-disk.img"
            path.write_bytes(bios_sector(invalid) + bytes(1024))
            with Guest(path) as guest:
                guest.wait_for(lambda _: b"Disk read failed" in guest.memory(0xB8000, 4000)[::2])
                self.assertIn("HLT=1", guest.hmp("info registers"))
                self.assertEqual(guest.output(), b"")

    def test_monitor_commands_and_keyboard_editing(self):
        with Guest(ROOT / "build/monitor.img") as guest:
            guest.wait_for(lambda data: data == b"bitborn monitor\r\n> ")
            self.assertEqual(command(guest, "help"), b"\r\nhelp clear about reboot peek\r\n> ")
            self.assertEqual(command(guest, "about"), b"\r\nHandwritten x86. BIOS. Raw bits.\r\n> ")
            self.assertEqual(command(guest, "peek"), b"\r\n7C00: FA\r\n> ")
            self.assertEqual(command(guest, "helpful"), b"\r\nUnknown command\r\n> ")
            self.assertEqual(command(guest, ""), b"\r\nUnknown command\r\n> ")
            type_text(guest, "helx")
            before = len(guest.output())
            guest.key("backspace")
            guest.wait_for(lambda data: len(data) == before + 3)
            type_text(guest, "p")
            before = len(guest.output())
            guest.key("ret")
            guest.wait_for(lambda data: len(data) > before and data.endswith(b"help clear about reboot peek\r\n> "))
            self.assertEqual(command(guest, "clear"), b"\r\n> ")
            self.assertEqual(guest.memory(0xB8000, 8)[::2], b">   ")
            output = command(guest, "reboot")
            self.assertIn(b"bitborn monitor\r\n> ", output)

    def test_peek_reads_actual_memory(self):
        image = bytearray((ROOT / "build/monitor.img").read_bytes())
        image[512 + 202] = 1  # Change only the moffs16 operand from 7C00 to 7C01.
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "alternate-peek.img"
            path.write_bytes(image)
            with Guest(path) as guest:
                guest.wait_for(lambda data: data.endswith(b"> "))
                self.assertEqual(command(guest, "peek"), b"\r\n7C00: EA\r\n> ")

    def test_bounded_input_and_empty_backspace(self):
        with Guest(ROOT / "build/monitor.img") as guest:
            guest.wait_for(lambda data: data.endswith(b"> "))
            guest.key("backspace")
            type_text(guest, "abcdefghijklmno")
            guest.key("p")  # This sixteenth printable character must be ignored.
            guest.key("ret")
            guest.wait_for(lambda data: data.endswith(b"Unknown command\r\n> "))
            self.assertEqual(guest.memory(0x8200, 16), b"abcdefghijklmno\x00")

    def test_all_handwritten_branches_land_on_instructions(self):
        for source in ["boot/loader.bits", "examples/disk-read/program.bits", "examples/monitor/program.bits"]:
            data, annotations = read_bits(ROOT / source)
            starts = {a["offset"] for a in annotations if a["kind"] == "instruction"}
            for a in annotations:
                i = a["offset"]
                if a["kind"] == "instruction" and data[i] in {0xE8, 0xE9, 0xEB, 0x72, 0x73, 0x74, 0x75, 0x77}:
                    size = 3 if data[i] in {0xE8, 0xE9} else 2
                    target = i + size + int.from_bytes(data[i+1:i+size], "little", signed=True)
                    self.assertIn(target, starts, f"{source}:{i} branches to {target}")
