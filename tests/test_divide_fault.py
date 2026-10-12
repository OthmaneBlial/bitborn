"""Real CPU exception-frame and retry evidence for handwritten binary bytes."""
import struct
import tempfile
import unittest
from pathlib import Path
from tools.bitborn import ROOT, read_bits
from tools.build import bios_sector
from tests.qemu import Guest


class DivideFaultTests(unittest.TestCase):
    def test_native_fault_frame_and_repaired_instruction_retry(self):
        data, annotations = read_bits(ROOT/'tests/fixtures/divide-fault.bits')
        self.assertEqual(len(data),70)
        offsets = {item['mnemonic']:item['offset'] for item in annotations}
        self.assertEqual(offsets['DIV BX'],37)
        self.assertEqual(offsets['PUSH AX'],49)
        self.assertEqual(data[25:37],bytes.fromhex('c7 06 00 00 31 7c c7 06 02 00 00 00'))
        self.assertEqual(data[37:39],bytes.fromhex('f7 f3'))
        self.assertEqual(data[53:56],bytes.fromhex('8b 4e 04'))
        self.assertEqual(data[60:63],bytes.fromhex('bb 01 00'))
        self.assertEqual(data[-1],0xCF)
        for divisor in (1,2):
            altered = bytearray(data); altered[61] = divisor
            with self.subTest(divisor=divisor), tempfile.TemporaryDirectory() as directory:
                image = Path(directory)/'divide.img'; image.write_bytes(bios_sector(altered))
                with Guest(image) as guest:
                    guest.wait_for(lambda _: 'EIP=00007c2f' in guest.hmp('info registers') and 'HLT=1' in guest.hmp('info registers'))
                    guest.command('stop')
                    registers = guest.hmp('info registers')
                    self.assertIn('ESP=00007c00',registers,'IRET restores the six-byte exception frame and both handler pushes')
                    self.assertEqual(struct.unpack('<HHHH',guest.memory(0x9000,8)),(1,0x7C25,42//divisor,0))
                    saved_ip, saved_cs, saved_flags = struct.unpack('<HHH',guest.memory(0x7BFA,6))
                    self.assertEqual((saved_ip,saved_cs),(0x7C25,0),'the fault saves DIV itself, not its successor')
                    self.assertEqual(saved_flags&0x200,0,'IF remains clear')
                    self.assertEqual(guest.memory(0,4),bytes.fromhex('31 7c 00 00'))
                    self.assertEqual(guest.memory(0x7C00,70),altered,'the CPU executed the literal imported sector bytes')

    def test_unrepaired_divisor_reenters_fault_handler(self):
        data, _ = read_bits(ROOT/'tests/fixtures/divide-fault.bits')
        altered = bytearray(data); altered[61] = 0
        with tempfile.TemporaryDirectory() as directory:
            image = Path(directory)/'unrepaired.img'; image.write_bytes(bios_sector(altered))
            with Guest(image) as guest:
                guest.wait_for(lambda _: int.from_bytes(guest.memory(0x9000,2),'little')>=2)
                guest.command('stop')
                self.assertEqual(guest.memory(0x9002,2),bytes.fromhex('25 7c'))
                self.assertNotIn('HLT=1',guest.hmp('info registers'),'an unchanged zero divisor retries and faults again')
