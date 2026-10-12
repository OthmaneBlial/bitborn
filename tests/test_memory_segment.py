import re
import tempfile
import unittest
from pathlib import Path
from tools.bitborn import ROOT, read_bits
from tools.build import bios_sector
from tests.qemu import Guest


class MemorySegmentTests(unittest.TestCase):
    def test_native_bp_pair_and_absolute_default_segments(self):
        data, annotations=read_bits(ROOT/'tests/fixtures/memory-segment.bits')
        self.assertEqual(len(data),70)
        self.assertEqual(data[44:53],bytes.fromhex('8b 46 fe 8b 08 8b 16 20 00'))
        self.assertEqual(data[53:67],bytes.fromhex('89 d6 89 0e 30 00 88 26 32 00 8a 16 32 00'))
        with tempfile.TemporaryDirectory() as directory:
            image=Path(directory)/'memory-segment.img';image.write_bytes(bios_sector(data))
            with Guest(image) as guest:
                guest.wait_for(lambda _: 'EIP=00007c44' in guest.hmp('info registers') and 'HLT=1' in guest.hmp('info registers'))
                guest.command('stop');registers=guest.hmp('info registers')
                for name,value in [('EAX',0x2233),('ECX',0x1111),('EDX',0x1122),('EBX',0x20),('EBP',0x22),('ESI',0x1111),('ESP',0x7C00)]:
                    self.assertEqual(int(re.search(rf'{name}=([0-9a-f]+)',registers).group(1),16)&65535,value)
                self.assertRegex(registers,r'DS\s*=1000 00010000')
                self.assertRegex(registers,r'SS\s*=2000 00020000')
                self.assertEqual(guest.memory(0x10020,2),bytes.fromhex('11 11'))
                self.assertEqual(guest.memory(0x20020,2),bytes.fromhex('33 22'))
                self.assertEqual(guest.memory(0x10030,3),bytes.fromhex('11 11 22'))
                before=int(re.search(r'EDI=([0-9a-f]+)',registers).group(1),16)&65535
                after=int(re.search(r'EFL=([0-9a-f]+)',registers).group(1),16)&65535
                self.assertEqual(before,after,'memory loads/stores preserve every sampled native flag')
                self.assertEqual(after&0x401,0x401)
                self.assertEqual(guest.memory(0x27BFE,2),before.to_bytes(2,'little'))
                self.assertEqual(guest.memory(0x7C00,70),data)
