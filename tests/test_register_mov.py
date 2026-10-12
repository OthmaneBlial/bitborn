import re
import tempfile
import unittest
from pathlib import Path
from tools.bitborn import ROOT, read_bits
from tools.build import bios_sector
from tests.qemu import Guest


class RegisterMovTests(unittest.TestCase):
    def test_native_word_byte_aliases_and_unchanged_flags(self):
        data, annotations=read_bits(ROOT/'tests/fixtures/register-mov.bits')
        self.assertEqual(len(data),48)
        self.assertEqual(data[31:45],bytes.fromhex('89 de 8b e9 88 e0 8a e3 88 f1 8a f0 88 df'))
        self.assertEqual(next(item['offset'] for item in annotations if item['mnemonic']=='MOV SI,BX'),31)
        with tempfile.TemporaryDirectory() as directory:
            image=Path(directory)/'register-mov.img';image.write_bytes(bios_sector(data))
            with Guest(image) as guest:
                guest.wait_for(lambda _: 'EIP=00007c2e' in guest.hmp('info registers') and 'HLT=1' in guest.hmp('info registers'))
                guest.command('stop');registers=guest.hmp('info registers')
                for name,value in [('EAX',0x34AB),('EBX',0x3434),('ECX',0x569A),('EDX',0xABBC),('ESI',0x1234),('EBP',0x5678),('ESP',0x7C00)]:
                    self.assertEqual(int(re.search(rf'{name}=([0-9a-f]+)',registers).group(1),16)&65535,value,'16-bit writes do not imply cleared upper register bits')
                before=int(re.search(r'EDI=([0-9a-f]+)',registers).group(1),16)&65535
                after=int(re.search(r'EFL=([0-9a-f]+)',registers).group(1),16)&65535
                self.assertEqual(before,after,'all sampled native flags survived every MOV unchanged')
                self.assertEqual(after&0x401,0x401,'carry and direction are deliberately set')
                self.assertEqual(after&0x200,0,'IF remains clear')
                self.assertEqual(guest.memory(0x7BFE,2),before.to_bytes(2,'little'))
                self.assertEqual(guest.memory(0x7C00,48),data,'guest instruction bytes match the literal fixture')
