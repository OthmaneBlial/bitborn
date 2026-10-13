"""Native software INT gate DPL, TSS stack selection and return-frame proof."""
import re
import struct
import tempfile
import unittest
from pathlib import Path
from tools.bitborn import ROOT, read_bits, digest
from tools.build import bios_sector
from tests.qemu import Guest


class UserGateTests(unittest.TestCase):
    def test_literal_gate_tss_and_no_error_return_layout(self):
        data, _ = read_bits(ROOT / 'tests/fixtures/user-gate.bits')
        self.assertEqual(len(data), 696)
        self.assertEqual(digest(data), '79911997c213036e2ad24ef4adacf81eb66f0a783c2bca0a4cb324d63aec467a')
        self.assertEqual(data[30:38], bytes.fromhex('66 ea 28 7e 00 00 08 00'))
        self.assertEqual(data[67:70], bytes.fromhex('0f 00 d8'))
        self.assertEqual(data[127:129], bytes.fromhex('cd 20'))
        self.assertEqual(data[194:196], bytes.fromhex('61 cf'), 'POPAD then IRETD; no error word is removed')
        self.assertEqual(data[248:251], bytes.fromhex('f4 eb fd'))
        self.assertEqual(struct.unpack_from('<HI', data, 304), (47, 0x7F00))
        self.assertEqual(struct.unpack_from('<HI', data, 310), (263, 0x7FB0))
        self.assertEqual(data[296:304], bytes.fromhex('67 00 40 7f 00 89 00 00'))
        self.assertEqual(struct.unpack_from('<II', data, 324), (0x9000, 0x10))
        self.assertEqual(data[332:422], bytes(90))
        self.assertEqual(data[422:424], bytes.fromhex('68 00'))
        self.assertEqual(data[432:536], bytes(104))
        self.assertEqual(data[536:544], bytes.fromhex('d0 7e 08 00 00 8e 00 00'))
        self.assertEqual(data[544:688], bytes(144))
        self.assertEqual(data[688:696], bytes.fromhex('90 7e 08 00 00 ee 00 00'))

    def test_native_permitted_return_and_one_bit_denied_gate(self):
        path = ROOT / 'tests/fixtures/user-gate.bits'
        source_text = path.read_bytes()
        source, _ = read_bits(path)
        loader, _ = read_bits(ROOT / 'boot/loader.bits')
        for denied in (False, True):
            with self.subTest(dpl_two=denied), tempfile.TemporaryDirectory() as directory:
                data = bytearray(source)
                if denied:
                    data[693] ^= 0x20  # Authored control: gate DPL three becomes two.
                self.assertEqual(data[693], 0xCE if denied else 0xEE)
                expected_disk = bios_sector(loader) + data + bytes(1024 - len(data))
                self.assertEqual(len(expected_disk), 1536)
                image = Path(directory) / 'user-gate.img'
                image.write_bytes(expected_disk)
                with Guest(image) as guest:
                    if denied:
                        guest.wait_for(lambda _: guest.memory(0x6020, 1) == b'\x02' and
                                       'HLT=1' in guest.hmp('info registers'))
                    else:
                        guest.wait_for(lambda _: guest.memory(0x6080, 8) == struct.pack('<II', 0x11223344, 0x55667788))
                    guest.command('stop')
                    registers = guest.hmp('info registers')
                    def value(name):
                        return int(re.search(rf'\b{name}=([0-9a-f]+)', registers).group(1), 16)
                    self.assertEqual(value('CR0') & 0x80000001, 1)
                    self.assertRegex(registers, r'TR\s*=0028 00007f40 00000067')
                    self.assertEqual(guest.memory(0x6020, 1), bytes([2 if denied else 1]))
                    if denied:
                        self.assertIn('CPL=0', registers)
                        self.assertIn('HLT=1', registers)
                        self.assertEqual(value('EIP'), 0x7EF9)
                        self.assertEqual(value('ESP'), 0x8FE8)
                        self.assertRegex(registers, r'CS\s*=0008 .*CS32')
                        self.assertRegex(registers, r'SS\s*=0010 00000000 ffffffff')
                        error, eip, cs, flags, esp, ss = struct.unpack('<6I', guest.memory(0x6040, 24))
                        self.assertEqual((error, eip, cs, esp, ss), (0x102, 0x7E7F, 0x1B, 0xA000, 0x23))
                        self.assertEqual(flags & 0x3601, 0x400)
                        self.assertEqual(guest.memory(0x8FE8, 24), guest.memory(0x6040, 24), 'denied frame retained unchanged')
                        self.assertEqual(struct.unpack('<HH', guest.memory(0x6058, 4)), (8, 0x10))
                        self.assertEqual(struct.unpack('<II', guest.memory(0x6080, 8)), (0x11223344, 0),
                                         'permission fault prevents after-call user marker')
                    else:
                        self.assertIn('CPL=3', registers)
                        self.assertIn('HLT=0', registers)
                        self.assertEqual(value('EIP'), 0x7E8B)
                        self.assertEqual(value('ESP'), 0xA000)
                        for name, expected in [('EAX', 0x23), ('ECX', 0x13579BDF), ('ESI', 0x11223344), ('EDI', 0)]:
                            self.assertEqual(value(name), expected)
                        self.assertRegex(registers, r'CS\s*=001b .*CS32')
                        for segment in ('DS', 'ES', 'SS'):
                            self.assertRegex(registers, rf'{segment}\s*=0023 00000000 ffffffff')
                        self.assertEqual(value('EFL') & 0x3601, 0x400)
                        eip, cs, flags, esp, ss = struct.unpack('<5I', guest.memory(0x6000, 20))
                        self.assertEqual((eip, cs, esp, ss), (0x7E81, 0x1B, 0xA000, 0x23), 'INT saves the following EIP')
                        self.assertEqual(flags & 0x3601, 0x400)
                        self.assertEqual(guest.memory(0x8FEC, 20), guest.memory(0x6000, 20), 'service leaves return frame unchanged')
                        self.assertEqual(struct.unpack('<HHI', guest.memory(0x6014, 8)), (8, 0x10, 0x9000))
                        retained = struct.unpack('<8I', guest.memory(0x8FCC, 32))
                        self.assertEqual(retained, tuple(value(name) for name in ('EDI', 'ESI', 'EBP')) +
                                         (0x8FEC,) + tuple(value(name) for name in ('EBX', 'EDX', 'ECX', 'EAX')))
                    actual = bytearray(guest.memory(0x7E00, len(data)))
                    self.assertEqual(actual[301], 0x8B)
                    for offset in (269, 277, 285, 293):
                        actual[offset] &= 0xFE
                    actual[301] &= 0xFD
                    self.assertEqual(actual, data, 'only CPU-managed descriptor access/busy bits may change')
                    self.assertEqual(guest.memory(0x7C00, 512), expected_disk[:512], 'literal loader remains unchanged')
                self.assertEqual(image.read_bytes(), expected_disk, 'guest disk is read-only')
        self.assertEqual(path.read_bytes(), source_text)
