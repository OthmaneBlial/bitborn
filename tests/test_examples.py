import platform
import struct
import subprocess
import unittest
from tools.bitborn import ROOT, read_bits
from tools.build import elf64


class ExampleTests(unittest.TestCase):
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
        for slug, status, stdout in [("exit-code", 42, b""), ("arithmetic", 42, b""),
                                     ("print-text", 0, b"Hello from raw bits!\n"), ("loop-count", 5, b""), ("compare-values", 42, b"")]:
            with self.subTest(example=slug):
                result = subprocess.run([str(ROOT / f"build/{slug}.elf")], capture_output=True, timeout=5)
                self.assertEqual(result.returncode, status)
                self.assertEqual(result.stdout, stdout)
                self.assertEqual(result.stderr, b"")
