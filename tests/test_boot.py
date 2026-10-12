import unittest
from tools.bitborn import ROOT
from tests.qemu import Guest

EXPECTED = (b"bitborn v0.1\r\n---------------------------\r\nNO ASSEMBLY.\r\nNO COMPILER.\r\nJUST BITS.\r\n\r\n"
            b"Hello from raw machine code!\r\n\r\n512 bytes. 100% handwritten.\r\n")


class BootTests(unittest.TestCase):
    def test_real_bios_boot(self):
        with Guest(ROOT / "build/boot.img") as guest:
            output = guest.wait_for(lambda data: EXPECTED in data)
            self.assertEqual(output, EXPECTED)
            registers = guest.hmp("info registers")
            self.assertIn("HLT=1", registers)
