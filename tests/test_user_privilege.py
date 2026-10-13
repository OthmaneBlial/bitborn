"""Curated CPL3 HLT fault, TSS kernel stack, and outward IRETD proof."""
import re
import struct
import tempfile
import unittest
from pathlib import Path
from tools.bitborn import ROOT, read_bits, digest
from tools.build import bios_sector
from tests.qemu import Guest


class UserPrivilegeTests(unittest.TestCase):
    def test_literal_entry_tss_and_privilege_frame_layout(self):
        data, _ = read_bits(ROOT / 'tests/fixtures/user-privilege.bits')
        self.assertEqual(len(data), 496)
        self.assertEqual(digest(data), '827f314cf5f326184b8a08d87334b20e428dd120da43aeb1d215173c95dadabe')
        self.assertEqual(data[30:38], bytes.fromhex('66 ea 28 7c 00 00 08 00'))
        self.assertEqual(data[67:70], bytes.fromhex('0f 00 d8'), 'LTR AX')
        self.assertEqual(data[89:109], bytes.fromhex('6a 23 68 00 a0 00 00 68 02 04 00 00 6a 1b 68 70 7c 00 00 cf'))
        self.assertEqual(data[127], 0xF4)
        self.assertEqual(data[138:140], bytes.fromhex('eb fe'))
        self.assertEqual(data[194:204], bytes.fromhex('61 83 44 24 04 01 83 c4 04 cf'))
        self.assertEqual(data[248:256], bytes.fromhex('67 00 10 7d 00 89 00 00'))
        self.assertEqual(struct.unpack_from('<HI', data, 256), (47, 0x7CD0))
        self.assertEqual(struct.unpack_from('<HI', data, 262), (111, 0x7D80))
        self.assertEqual(struct.unpack_from('<II', data, 276), (0x9000, 0x10))
        self.assertEqual(data[284:374], bytes(90))
        self.assertEqual(data[374:376], bytes.fromhex('68 00'))
        self.assertEqual(data[384:488], bytes(104))
        self.assertEqual(data[488:496], bytes.fromhex('90 7c 08 00 00 8e 00 00'))

    def test_native_fault_and_one_bit_cmc_control_return_to_user(self):
        source_text = (ROOT / 'tests/fixtures/user-privilege.bits').read_bytes()
        source, _ = read_bits(ROOT / 'tests/fixtures/user-privilege.bits')
        for control in (False, True):
            with self.subTest(cmc=control), tempfile.TemporaryDirectory() as directory:
                data = bytearray(source)
                if control:
                    data[127] ^= 1  # Authored bit-surgery control: HLT becomes CMC.
                image = Path(directory) / 'user-privilege.img'
                expected_disk = bios_sector(data)
                image.write_bytes(expected_disk)
                with Guest(image) as guest:
                    guest.wait_for(lambda _: guest.memory(0x6080, 8) == struct.pack('<II', 0x11223344, 0x55667788))
                    guest.command('stop')
                    registers = guest.hmp('info registers')
                    def value(name):
                        return int(re.search(rf'\b{name}=([0-9a-f]+)', registers).group(1), 16)
                    self.assertEqual(value('EIP'), 0x7C8A)
                    self.assertEqual(value('ESP'), 0xA000)
                    self.assertEqual(value('EAX'), 0x23)
                    self.assertEqual(value('ECX'), 0x13579BDF)
                    self.assertEqual(value('ESI'), 0x11223344)
                    self.assertEqual(value('EDI'), 0x55667788)
                    self.assertIn('CPL=3', registers)
                    self.assertIn('HLT=0', registers)
                    self.assertRegex(registers, r'CS\s*=001b 00000000 ffffffff.*CS32')
                    for segment in ('DS', 'ES', 'SS'):
                        self.assertRegex(registers, rf'{segment}\s*=0023 00000000 ffffffff')
                    self.assertRegex(registers, r'TR\s*=0028 00007d10 00000067')
                    self.assertEqual(value('CR0') & 0x80000001, 1, 'PE set, paging off')
                    self.assertEqual(value('EFL') & 0x3601, 0x400 | int(control), 'DF restored, IF/IOPL zero; CMC toggles CF')
                    self.assertEqual(guest.memory(0x6020, 1), bytes([not control]))
                    if not control:
                        error, eip, cs, flags, esp, ss = struct.unpack('<6I', guest.memory(0x6000, 24))
                        self.assertEqual((error, eip, cs, esp, ss), (0, 0x7C7F, 0x1B, 0xA000, 0x23))
                        self.assertEqual(flags & 0x3601, 0x400)
                        self.assertEqual(struct.unpack('<HHI', guest.memory(0x6018, 8)), (8, 0x10, 0x9000))
                        retained = struct.unpack('<8I', guest.memory(0x8FC8, 32))
                        self.assertEqual(retained, tuple(value(name) for name in ('EDI', 'ESI', 'EBP')) +
                                         (0x8FE8,) + tuple(value(name) for name in ('EBX', 'EDX', 'ECX', 'EAX')))
                        self.assertEqual(struct.unpack('<6I', guest.memory(0x8FE8, 24)),
                                         (error, eip + 1, cs, flags, esp, ss), 'only the authored saved EIP changes')
                    actual = bytearray(guest.memory(0x7C00, len(data)))
                    self.assertEqual(actual[253], 0x8B, 'LTR marks the actual TSS descriptor busy')
                    for offset in (221, 229, 237, 245):
                        actual[offset] &= 0xFE
                    actual[253] &= 0xFD
                    self.assertEqual(actual, data, 'only CPU-managed GDT access/busy bits may change')
                self.assertEqual(image.read_bytes(), expected_disk, 'guest disk is read-only')
        self.assertEqual((ROOT / 'tests/fixtures/user-privilege.bits').read_bytes(), source_text)
