"""Curated native UD2 fault injection, exact gate/frame, and IRETD evidence."""
import re
import struct
import tempfile
import unittest
from pathlib import Path
from tools.bitborn import ROOT, read_bits
from tools.build import bios_sector
from tests.qemu import Guest


class ProtectedFaultTests(unittest.TestCase):
    def test_literal_gate_pointers_and_fault_instruction(self):
        data, annotations = read_bits(ROOT/'tests/fixtures/protected-fault.bits')
        self.assertEqual(len(data),200)
        offsets = {item['mnemonic']:item['offset'] for item in annotations}
        self.assertEqual(offsets['UD2'],61)
        self.assertEqual(offsets['MOV EAX,[ESP]'],72)
        self.assertEqual(data[25:33],bytes.fromhex('66 ea 28 7c 00 00 08 00'))
        self.assertEqual(data[61:63],bytes.fromhex('0f 0b'))
        self.assertEqual(data[80:85],bytes.fromhex('83 04 24 02 cf'))
        self.assertEqual(struct.unpack_from('<HI',data,128),(23,0x7C68))
        self.assertEqual(struct.unpack_from('<HI',data,134),(55,0x7C90))
        self.assertEqual(data[144:192],bytes(48))
        self.assertEqual(data[192:200],bytes.fromhex('48 7c 08 00 00 8e 00 00'))

    def test_native_fault_entry_saved_eip_adjustment_and_iretd(self):
        data, _ = read_bits(ROOT/'tests/fixtures/protected-fault.bits')
        with tempfile.TemporaryDirectory() as directory:
            image = Path(directory)/'protected-fault.img'; image.write_bytes(bios_sector(data))
            with Guest(image) as guest:
                guest.wait_for(lambda _: 'EIP=00007c46' in guest.hmp('info registers') and 'HLT=1' in guest.hmp('info registers'))
                guest.command('stop')
                registers = guest.hmp('info registers')
                for value in ('EAX=00007c3d','ECX=00007c3d','ESP=00009000'):
                    self.assertIn(value,registers)
                cr0 = int(re.search(r'CR0=([0-9a-f]+)',registers).group(1),16)
                self.assertEqual(cr0&1,1); self.assertEqual(cr0&0x80000000,0)
                self.assertRegex(registers,r'CS\s*=0008 .*CS32')
                for segment in ('DS','SS'):
                    self.assertRegex(registers,rf'{segment}\s*=0010 00000000 ffffffff')
                self.assertEqual(guest.memory(0x9000,4),struct.pack('<I',0x7C3D),'the handler recorded the original UD2 EIP')
                eip, cs, flags = struct.unpack('<III',guest.memory(0x8FF4,12))
                self.assertEqual((eip,cs),(0x7C3F,8),'only saved EIP advanced by the known UD2 length')
                self.assertEqual(flags&0x200,0)
                self.assertEqual(int(re.search(r'EFL=([0-9a-f]+)',registers).group(1),16)&0x200,0)
                actual = bytearray(guest.memory(0x7C00,200))
                self.assertEqual(actual[125]&1,1,'loading DS/SS sets the data descriptor accessed bit')
                for offset in (117,125): actual[offset]&=0xFE
                self.assertEqual(actual,data,'only CPU-managed descriptor accessed bits may change; all instruction bytes remain literal')
