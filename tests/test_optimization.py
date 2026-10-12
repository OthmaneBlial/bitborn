import unittest
from tools.bitborn import ROOT, read_bits, bitdiff
from tools.build import elf64


class OptimizationTests(unittest.TestCase):
    def test_real_sizes_and_independent_encodings(self):
        before, _ = read_bits(ROOT / 'examples/exit-code/program.bits')
        after, _ = read_bits(ROOT / 'examples/exit-code-small/program.bits')
        self.assertEqual(before, bytes.fromhex('b8 3c 00 00 00 bf 2a 00 00 00 0f 05'))
        self.assertEqual(after, bytes.fromhex('6a 3c 58 6a 2a 5f 0f 05'))
        self.assertEqual((len(before), len(after)), (12, 8))
        self.assertEqual((len(elf64(before)), len(elf64(after))), (132, 128))
        self.assertEqual(elf64(after)[120:], after)
        self.assertIn('0000  10111000 -> 01101010', bitdiff(before, after))
        self.assertIn('000b  00000101 -> --------', bitdiff(before, after))
