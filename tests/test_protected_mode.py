"""Literal protected-mode instructions, independently checked on real QEMU/TCG."""
import re
import struct
import tempfile
import unittest
from pathlib import Path
from tools.bitborn import ROOT, read_bits
from tools.build import bios_sector
from tests.qemu import Guest


class ProtectedModeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.payload, cls.annotations = read_bits(ROOT / "examples/protected-mode/program.bits")
        cls.loader, _ = read_bits(ROOT / "boot/loader.bits")

    def image(self, directory, payload=None):
        stage = self.payload if payload is None else payload
        path = Path(directory) / "protected-mode.img"
        path.write_bytes(bios_sector(self.loader) + stage + bytes(1024 - len(stage)))
        return path

    def test_literal_layout_and_descriptor_encodings(self):
        data = self.payload
        self.assertEqual(len(data), 568)
        offsets = {item["mnemonic"]: item["offset"] for item in self.annotations}
        expected = {"MOV EAX,00000010": 64, "HLT success": 146, "HLT failure": 154,
                    "MOV dword [00009004],C0DEC0DE": 160, "IRETD": 170,
                    "GDT null descriptor": 256, "GDTR pointer": 280,
                    "IDTR pointer": 286, "IDT vectors 00 and 01": 304,
                    "IDT vector 20 interrupt gate": 560}
        for name, offset in expected.items():
            self.assertEqual(offsets[name], offset, name)
        # These expectations verify handwritten encodings; they never generate target bytes.
        self.assertEqual(data[17:22], b"\x0f\x01\x16\x18\x7f")
        self.assertEqual(data[22:32], b"\x0f\x20\xc0\x66\x83\xc8\x01\x0f\x22\xc0")
        self.assertEqual(data[32:40], b"\x66\xea\x40\x7e\x00\x00\x08\x00")
        self.assertEqual(data[84:91], b"\x0f\x01\x1d\x1e\x7f\x00\x00")
        self.assertEqual(data[107:109], b"\xcd\x20")
        self.assertEqual(data[170], 0xCF)
        self.assertEqual(data[264:272], b"\xff\xff\x00\x00\x00\x9a\xcf\x00")
        self.assertEqual(data[272:280], b"\xff\xff\x00\x00\x00\x92\xcf\x00")
        self.assertEqual(struct.unpack_from("<HI", data, 280), (23, 0x7F00))
        self.assertEqual(struct.unpack_from("<HI", data, 286), (263, 0x7F30))
        self.assertEqual(data[304:560], bytes(256))
        self.assertEqual(data[560:568], b"\xa0\x7e\x08\x00\x00\x8e\x00\x00")
        self.assertEqual(0x7E7B + data[122], 0x7E95)
        self.assertEqual(0x7E83 + data[130], 0x7E95)
        table = (ROOT / "examples/protected-mode/bytes.md").read_text()
        rows = re.findall(r"^\| (\d+) \| `([01]{8})` \| `([0-9A-F]{2})` \|", table, re.MULTILINE)
        self.assertEqual(len(rows), len(data), "the byte table covers the complete canonical stage")
        for offset, binary, hexadecimal in rows:
            self.assertEqual(int(binary, 2), data[int(offset)])
            self.assertEqual(int(hexadecimal, 16), data[int(offset)])

    def assert_mode_and_halt(self, guest, eip):
        guest.wait_for(lambda _: f"EIP={eip:08x}" in guest.hmp("info registers"))
        guest.command("stop")
        registers = guest.hmp("info registers")
        self.assertIn("HLT=1", registers)
        cr0 = int(re.search(r"CR0=([0-9a-f]+)", registers).group(1), 16)
        self.assertEqual(cr0 & 1, 1, "CR0.PE is set")
        self.assertEqual(cr0 & 0x80000000, 0, "paging remains disabled")
        self.assertRegex(registers, r"CS\s*=0008 .*CS32")
        for segment in ["DS", "ES", "FS", "GS", "SS"]:
            self.assertRegex(registers, rf"{segment}\s*=0010 00000000 ffffffff")
        self.assertIn("ESP=00009000", registers, "IRETD restores the original 32-bit stack pointer")
        flags = int(re.search(r"EFL=([0-9a-f]+)", registers).group(1), 16)
        self.assertEqual(flags & 0x200, 0, "maskable interrupts stay disabled")
        pic = guest.hmp("info pic")
        for controller in ["pic0", "pic1"]:
            self.assertRegex(pic, rf"{controller}: [^\r\n]*imr=ff", "external PIC IRQs are masked")
        self.assertEqual(guest.memory(0x9004, 4), b"\xde\xc0\xde\xc0", "the IDT handler executed")
        return registers

    def test_native_protected_mode_memory_interrupt_and_return(self):
        with tempfile.TemporaryDirectory() as directory:
            with Guest(self.image(directory)) as guest:
                registers = self.assert_mode_and_halt(guest, 0x7E93)
                for register, value in [("EAX", "11223344"), ("EBX", "11223344"),
                                        ("ECX", "4b4f4d50"), ("EDX", "c0dec0de")]:
                    self.assertIn(f"{register}={value}", registers)
                self.assertEqual(guest.memory(0x9000, 8), b"\x44\x33\x22\x11\xde\xc0\xde\xc0")
                self.assertEqual(guest.memory(0xB8000, 4), b"P\x0aM\x0a")
                self.assertEqual(guest.memory(0x7E00, 256), self.payload[:256], "loader delivered the literal instruction bytes")
                self.assertEqual(guest.memory(0x7F30, 264), self.payload[304:568])
                frame = struct.unpack("<III", guest.memory(0x8FF4, 12))
                self.assertEqual(frame[0], 0x7E6D, "INT pushed the return EIP")
                self.assertEqual(frame[1], 8, "INT pushed the code selector")
                self.assertEqual(frame[2] & 0x200, 0, "saved EFLAGS kept IF clear")

    def test_native_failed_readback_uses_controlled_failure_halt(self):
        altered = bytearray(self.payload)
        altered[92] ^= 1  # Change the literal EAX immediate, while keeping the expected CMP constant.
        with tempfile.TemporaryDirectory() as directory:
            with Guest(self.image(directory, altered)) as guest:
                registers = self.assert_mode_and_halt(guest, 0x7E9B)
                self.assertIn("ECX=4c494146", registers)
                self.assertEqual(guest.memory(0x9000, 4), b"\x45\x33\x22\x11")


if __name__ == "__main__":
    unittest.main()
