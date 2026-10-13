"""Native CPL3 page permission, exact page tables and retained PF frame proof."""
import re
import struct
import tempfile
import unittest
from pathlib import Path
from tools.bitborn import ROOT, read_bits, digest
from tools.build import bios_sector
from tests.qemu import Guest


class UserPageTests(unittest.TestCase):
    def test_literal_permissions_tss_and_fault_site(self):
        data, _ = read_bits(ROOT / 'tests/fixtures/user-page.bits')
        self.assertEqual(len(data), 712)
        self.assertEqual(digest(data), 'ea2f4c2cae715588a7a39ef0b2128706b11fc546f089f3221042ec4a21ecdf99')
        self.assertEqual(data[143:150], bytes.fromhex('c6052c50000003'))
        self.assertEqual(data[273:283], bytes.fromhex('c70500b0000044332211'))
        self.assertEqual(data[293:295], bytes.fromhex('eb fe'))
        self.assertEqual(data[372:382], bytes.fromhex('61 83 44 24 04 0a 83 c4 04 cf'))
        self.assertEqual(struct.unpack_from('<HI', data, 464), (47, 0x7FA0))
        self.assertEqual(struct.unpack_from('<HI', data, 470), (119, 0x8050))
        self.assertEqual(data[456:464], bytes.fromhex('67 00 e0 7f 00 89 00 00'))
        self.assertEqual(struct.unpack_from('<II', data, 484), (0x9000, 0x10))
        for offset in (429, 437, 445, 453):
            self.assertEqual(data[offset] & 1, 1, 'descriptor accessed bits are preset before read-only paging')
        self.assertEqual(data[592:704], bytes(112))
        self.assertEqual(data[704:712], bytes.fromhex('40 7f 08 00 00 8e 00 00'))

    def test_native_denied_write_and_one_bit_user_permission(self):
        path = ROOT / 'tests/fixtures/user-page.bits'
        source_text = path.read_bytes()
        source, _ = read_bits(path)
        loader, _ = read_bits(ROOT / 'boot/loader.bits')
        for permitted in (False, True):
            with self.subTest(user_permission=permitted), tempfile.TemporaryDirectory() as directory:
                data = bytearray(source)
                if permitted:
                    data[149] ^= 4  # Authored control: PTE user/supervisor bit zero becomes one.
                image = Path(directory) / 'user-page.img'
                expected_disk = bios_sector(loader) + data + bytes(1024 - len(data))
                self.assertEqual(len(expected_disk), 1536)
                image.write_bytes(expected_disk)
                with Guest(image) as guest:
                    guest.wait_for(lambda _: guest.memory(0x20000, 4) == struct.pack('<I', 0x55667788))
                    guest.command('stop')
                    registers = guest.hmp('info registers')
                    def value(name):
                        return int(re.search(rf'\b{name}=([0-9a-f]+)', registers).group(1), 16)
                    self.assertIn('CPL=3', registers)
                    self.assertIn('HLT=0', registers)
                    self.assertEqual(value('EIP'), 0x7F25)
                    self.assertEqual(value('ESP'), 0xA800)
                    for name, expected in [('EAX', 0x23), ('ECX', 0x13579BDF), ('ESI', 0x11223344),
                                           ('EDI', 0x55667788), ('EDX', 0x11223344)]:
                        self.assertEqual(value(name), expected)
                    self.assertEqual(value('EFL') & 0x3601, 0x400)
                    self.assertRegex(registers, r'CS\s*=001b .*CS32')
                    for segment in ('DS', 'ES', 'SS'):
                        self.assertRegex(registers, rf'{segment}\s*=0023 00000000 ffffffff')
                    self.assertRegex(registers, r'TR\s*=0028 00007fe0 00000067')
                    self.assertEqual(value('CR0') & 0x80010001, 0x80010001)
                    self.assertEqual(value('CR3'), 0x4000)
                    self.assertEqual(value('CR4') & 0x20, 0, 'legacy non-PAE paging')
                    self.assertEqual(guest.memory(0xA7FC, 4), struct.pack('<I', 0x11223344), 'user PUSH/POP actually use writable page A')
                    self.assertEqual(guest.memory(0xB000, 4), struct.pack('<I', 0x11223344 if permitted else 0xDEADBEEF))
                    self.assertEqual(guest.memory(0x6020, 1), bytes([not permitted]))
                    log = guest.memory(0x6000, 32)
                    if permitted:
                        self.assertEqual(log, bytes(32), 'no PF handler delivery in the permission control')
                    else:
                        error, eip, cs, flags, esp, ss, cr2, kernel_cs, kernel_ss = struct.unpack('<7IHH', log)
                        self.assertEqual((error, eip, cs, esp, ss, cr2, kernel_cs, kernel_ss),
                                         (7, 0x7F11, 0x1B, 0xA800, 0x23, 0xB000, 8, 0x10))
                        self.assertEqual(value('CR2'), 0xB000)
                        self.assertEqual(flags & 0x3601, 0x400)
                        self.assertEqual(struct.unpack('<6I', guest.memory(0x8FE8, 24)),
                                         (error, eip + 10, cs, flags, esp, ss), 'only the authored store EIP is skipped')
                        retained = struct.unpack('<8I', guest.memory(0x8FC8, 32))
                        self.assertEqual(retained, tuple(value(name) for name in ('EDI', 'ESI', 'EBP')) +
                                         (0x8FE8,) + tuple(value(name) for name in ('EBX', 'EDX', 'ECX', 'EAX')))
                    directory_words = struct.unpack('<1024I', guest.memory(0x4000, 4096))
                    self.assertEqual(directory_words[0] & ~0x60, 0x5007)
                    self.assertTrue(directory_words[0] & 0x20)
                    self.assertEqual(directory_words[1:], (0,) * 1023)
                    pages = struct.unpack('<1024I', guest.memory(0x5000, 4096))
                    for index, actual in enumerate(pages):
                        permissions = {7: 5, 10: 7, 32: 7, 11: 7 if permitted else 3}.get(index, 3)
                        self.assertEqual(actual & ~0x60, index * 4096 | permissions, (index, actual))
                    self.assertTrue(pages[7] & 0x20)
                    self.assertFalse(pages[7] & 0x40, 'read-only code/GDT page stays clean')
                    self.assertEqual(pages[10] & 0x60, 0x60)
                    self.assertEqual(pages[32] & 0x60, 0x60)
                    self.assertEqual(bool(pages[11] & 0x40), permitted, 'denied store never dirties the protected target page')
                    actual = bytearray(guest.memory(0x7E00, len(data)))
                    self.assertEqual(actual[461], 0x8B)
                    actual[461] &= 0xFD
                    self.assertEqual(actual, data, 'only the pre-paging TSS busy bit may change in loaded source')
                    self.assertEqual(guest.memory(0x7C00, 512), expected_disk[:512])
                self.assertEqual(image.read_bytes(), expected_disk)
        self.assertEqual(path.read_bytes(), source_text)
