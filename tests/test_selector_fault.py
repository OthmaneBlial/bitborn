"""Native general-protection error-code evidence from a literal invalid selector."""
import struct
import tempfile
import unittest
from pathlib import Path
from tools.bitborn import ROOT, read_bits
from tools.build import bios_sector
from tests.qemu import Guest


class SelectorFaultTests(unittest.TestCase):
    def test_native_error_code_frame_and_failed_segment_load(self):
        data, annotations = read_bits(ROOT/'tests/fixtures/protected-selector-fault.bits')
        self.assertEqual(len(data),256)
        offsets = {item['mnemonic']:item['offset'] for item in annotations}
        self.assertEqual(offsets['MOV DS,AX invalid'],66)
        self.assertEqual(offsets['POP EDX'],77)
        self.assertEqual(data[61:68],bytes.fromhex('b8 18 00 00 00 8e d8'))
        self.assertEqual(data[77:84],bytes.fromhex('5a 89 15 04 90 00 00'))
        self.assertEqual(struct.unpack_from('<HI',data,134),(111,0x7C90))
        self.assertEqual(data[144:248],bytes(104))
        self.assertEqual(data[248:256],bytes.fromhex('4d 7c 08 00 00 8e 00 00'))
        for selector, error_code in ((0x18,0x18),(0x20,0x20),(0x1B,0x18)):
            with self.subTest(selector=selector), tempfile.TemporaryDirectory() as directory:
                altered = bytearray(data); altered[62] = selector
                image = Path(directory)/'selector-fault.img'; image.write_bytes(bios_sector(altered))
                with Guest(image) as guest:
                    guest.wait_for(lambda _: 'EIP=00007c4b' in guest.hmp('info registers') and 'HLT=1' in guest.hmp('info registers'))
                    guest.command('stop'); registers = guest.hmp('info registers')
                    for value in ('EAX=00007c42','ECX=00007c42',f'EDX={error_code:08x}','ESP=00009000'):
                        self.assertIn(value,registers)
                    self.assertRegex(registers,r'DS\s*=0010 00000000 ffffffff','failed selector load preserves DS')
                    self.assertRegex(registers,r'SS\s*=0010 00000000 ffffffff')
                    self.assertRegex(registers,r'CS\s*=0008 .*CS32')
                    self.assertEqual(struct.unpack('<II',guest.memory(0x9000,8)),(0x7C42,error_code))
                    code, eip, cs, flags = struct.unpack('<IIII',guest.memory(0x8FF0,16))
                    self.assertEqual((code,eip,cs),(error_code,0x7C44,8),'POP removes the real error code; the handler advances only saved EIP')
                    self.assertEqual(flags&0x200,0)
                    actual = bytearray(guest.memory(0x7C00,256))
                    for offset in (117,125): actual[offset]&=0xFE
                    self.assertEqual(actual,altered,'only descriptor accessed bits may change')
