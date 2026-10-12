import platform
import struct
import subprocess
import tempfile
import unittest
from pathlib import Path
from tools.bitborn import ROOT, read_bits
from tools.build import elf64
from tests.qemu import Guest


class ExampleTests(unittest.TestCase):
    def test_bios_keyboard(self):
        with Guest(ROOT / "build/keyboard.img") as guest:
            guest.wait_for(lambda data: data == b">")
            guest.key("a")
            self.assertEqual(guest.wait_for(lambda data: data == b">a"), b">a")

    def test_direct_vga_memory_write(self):
        with Guest(ROOT / "build/vga.img") as guest:
            guest.wait_for(lambda _: "0x42 0x0a" in guest.hmp("xp /2bx 0xb8000"))
            memory = guest.hmp("xp /2bx 0xb8000")
            self.assertIn("0x42", memory)
            self.assertIn("0x0a", memory)

    def test_elf_is_only_headers_plus_literal_payload(self):
        payload, _ = read_bits(ROOT / "examples/exit-code/program.bits")
        image = elf64(payload)
        self.assertEqual(image[120:], payload)
        self.assertEqual(image[:7], b"\x7fELF\x02\x01\x01")
        self.assertEqual(struct.unpack_from("<Q", image, 24)[0], 0x400078)
        self.assertEqual(struct.unpack_from("<Q", image, 96)[0], len(image))
        self.assertEqual(struct.unpack_from("<I", image, 68)[0], 5)  # RX, never writable

    @unittest.skipUnless(platform.system() == "Linux" and platform.machine() == "x86_64", "native Linux x86-64 execution runs in CI")
    def test_native_linux_examples(self):
        for slug, status, stdout in [("exit-code", 42, b""), ("exit-code-small", 42, b""), ("arithmetic", 42, b""),
                                     ("print-text", 0, b"Hello from raw bits!\n"), ("loop-count", 5, b""), ("compare-values", 42, b"")]:
            with self.subTest(example=slug):
                result = subprocess.run([str(ROOT / f"build/{slug}.elf")], capture_output=True, timeout=5)
                self.assertEqual(result.returncode, status)
                self.assertEqual(result.stdout, stdout)
                self.assertEqual(result.stderr, b"")
        # Change the comparison input, proving that the unequal control-flow path executes.
        image = bytearray((ROOT / "build/compare-values.elf").read_bytes())
        image[121] = 41
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "unequal.elf"
            path.write_bytes(image)
            path.chmod(0o755)
            self.assertEqual(subprocess.run([str(path)], timeout=5).returncode, 1)
