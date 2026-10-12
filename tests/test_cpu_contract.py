import tempfile
import unittest
from pathlib import Path
from tools.bitborn import ROOT, read_bits
from tools.build import bios_sector
from tests.qemu import Guest


class CPUContractTests(unittest.TestCase):
    def test_real_stack_flags_call_and_segmented_memory(self):
        data, _ = read_bits(ROOT / 'tests/fixtures/cpu-contract.bits')
        self.assertEqual(len(data), 56)
        self.assertEqual(data[18:28], bytes.fromhex('54 5b b8 ff 7f 05 01 00 9c 59'))
        self.assertEqual(data[47:50], bytes.fromhex('e8 04 00'))
        with tempfile.TemporaryDirectory(prefix='bitborn-contract-') as directory:
            image = Path(directory) / 'contract.img'
            image.write_bytes(bios_sector(data))
            with Guest(image) as guest:
                guest.wait_for(lambda _: 'EIP=00007c34' in guest.hmp('info registers') and 'HLT=1' in guest.hmp('info registers'))
                registers = guest.hmp('info registers')
                for expected in ('EAX=00001234', 'EBX=00007c00', 'ECX=00000896', 'ESP=00007c00', 'EDI=00000001'):
                    self.assertIn(expected, registers)
                self.assertEqual(guest.memory(0x10020, 2), bytes.fromhex('34 12'))
                self.assertEqual(guest.memory(0x7BFE, 2), bytes.fromhex('32 7c'))
