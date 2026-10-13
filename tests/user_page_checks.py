"""Shared native capture/replay checks for the six curated literal permission probes."""
import re
import struct
from tools.bitborn import ROOT, read_bits
from tools.build import bios_sector

CASES = tuple((probe, allowed) for probe in ('write', 'read', 'code-write') for allowed in (False, True))
SOURCE_FILES = ('tools/record_user_page.py', 'tools/build.py', 'tools/bitborn.py',
                'tests/qemu.py', 'tests/user_page_checks.py', 'boot/loader.bits',
                'tests/fixtures/user-page.bits', 'tests/fixtures/user-page-read-slot.bits',
                'tests/fixtures/user-page-code-write-slot.bits')
MEMORY = {'log.bin': (0x6000, 32), 'stack.bin': (0x8FC8, 56),
          'directory.bin': (0x4000, 4096), 'table.bin': (0x5000, 4096),
          'ram.bin': (0x7E00, 712), 'loader.bin': (0x7C00, 512),
          'user-stack.bin': (0xA7FC, 4), 'target.bin': (0xB000, 4),
          'completion.bin': (0x20000, 4), 'fault-marker.bin': (0x6020, 1)}


def make_case(probe, permitted):
    if probe not in ('write', 'read', 'code-write') or type(permitted) is not bool:
        raise ValueError('Only the six curated permission cases are supported')
    data = bytearray(read_bits(ROOT / 'tests/fixtures/user-page.bits')[0])
    if probe != 'write':
        slot = read_bits(ROOT / f'tests/fixtures/user-page-{probe}-slot.bits')[0]
        if len(slot) != 10:
            raise ValueError('Literal probe slot must be exactly ten bytes')
        data[273:283] = slot
    if permitted:
        data[119 if probe == 'code-write' else 149] ^= 2 if probe == 'code-write' else 4
    loader = bios_sector(read_bits(ROOT / 'boot/loader.bits')[0])
    if len(data) != 712:
        raise ValueError('Reviewed permission template must be 712 bytes')
    return bytes(data), loader + data + bytes(1024 - len(data))


def capture_guest(guest):
    guest.wait_for(lambda _: guest.memory(0x20000, 4) == struct.pack('<I', 0x55667788))
    guest.command('stop')
    registers = guest.hmp('info registers')
    text = '\n'.join(line.rstrip() for line in registers.strip().splitlines()) + '\n'
    return {'registers.txt': text.encode(), **{name: guest.memory(address, size)
                                             for name, (address, size) in MEMORY.items()}}


def check_snapshot(test, data, image, probe, permitted, capture):
    test.assertEqual(set(capture), {'registers.txt', *MEMORY})
    for name, (_, size) in MEMORY.items():
        test.assertEqual(len(capture[name]), size, name)
    registers = capture['registers.txt'].decode()
    def value(name):
        return int(re.search(rf'\b{name}=([0-9a-f]+)', registers).group(1), 16)
    code_permission = probe == 'code-write' and permitted
    private_permission = probe != 'code-write' and permitted
    target = 0x7E00 if probe == 'code-write' else 0xB000
    test.assertIn('CPL=3', registers)
    test.assertIn('HLT=0', registers)
    test.assertEqual(value('EIP'), 0x7F25)
    test.assertEqual(value('ESP'), 0xA800)
    expected_ax = 0xDEADBEEF if probe == 'read' and permitted else 0x23
    for name, expected in [('EAX', expected_ax), ('ECX', 0x13579BDF), ('ESI', 0x11223344),
                           ('EDI', 0x55667788), ('EDX', 0x11223344)]:
        test.assertEqual(value(name), expected)
    test.assertEqual(value('EFL') & 0x3601, 0x400)
    test.assertRegex(registers, r'CS\s*=001b .*CS32')
    for segment in ('DS', 'ES', 'SS'):
        test.assertRegex(registers, rf'{segment}\s*=0023 00000000 ffffffff')
    test.assertRegex(registers, r'TR\s*=0028 00007fe0 00000067')
    test.assertEqual(value('CR0') & 0x80010001, 0x80010001)
    test.assertEqual(value('CR3'), 0x4000)
    test.assertEqual(value('CR4') & 0x20, 0, 'legacy non-PAE paging')
    test.assertEqual(capture['user-stack.bin'], struct.pack('<I', 0x11223344))
    test.assertEqual(capture['completion.bin'], struct.pack('<I', 0x55667788))
    test.assertEqual(capture['target.bin'], struct.pack('<I',
                     0x11223344 if probe == 'write' and permitted else 0xDEADBEEF))
    test.assertEqual(capture['fault-marker.bin'], bytes([not permitted]))
    log, stack = capture['log.bin'], capture['stack.bin']
    if permitted:
        test.assertEqual(log, bytes(32), 'no PF handler delivery')
    else:
        error, eip, cs, flags, esp, ss, cr2, kernel_cs, kernel_ss = struct.unpack('<7IHH', log)
        test.assertEqual((error, eip, cs, esp, ss, cr2, kernel_cs, kernel_ss),
                         (5 if probe == 'read' else 7, 0x7F11, 0x1B, 0xA800, 0x23, target, 8, 0x10))
        test.assertEqual(value('CR2'), target)
        test.assertEqual(flags & 0x3601, 0x400)
        test.assertEqual(struct.unpack('<6I', stack[32:]),
                         (error, eip + 10, cs, flags, esp, ss), 'only the authored probe slot is skipped')
        test.assertEqual(struct.unpack('<8I', stack[:32]),
                         tuple(value(name) for name in ('EDI', 'ESI', 'EBP')) + (0x8FE8,) +
                         tuple(value(name) for name in ('EBX', 'EDX', 'ECX', 'EAX')))
    directory_words = struct.unpack('<1024I', capture['directory.bin'])
    test.assertEqual(directory_words[0] & ~0x60, 0x5007)
    test.assertTrue(directory_words[0] & 0x20)
    test.assertEqual(directory_words[1:], (0,) * 1023)
    pages = struct.unpack('<1024I', capture['table.bin'])
    for index, actual in enumerate(pages):
        permissions = {7: 7 if code_permission else 5, 10: 7, 32: 7,
                       11: 7 if private_permission else 3}.get(index, 3)
        test.assertEqual(actual & ~0x60, index * 4096 | permissions, (index, actual))
    test.assertTrue(pages[7] & 0x20)
    test.assertEqual(bool(pages[7] & 0x40), code_permission)
    test.assertEqual(pages[10] & 0x60, 0x60)
    test.assertEqual(pages[32] & 0x60, 0x60)
    test.assertEqual(bool(pages[11] & 0x40), probe == 'write' and permitted)
    if private_permission:
        test.assertTrue(pages[11] & 0x20)
    actual = bytearray(capture['ram.bin'])
    test.assertEqual(actual[461], 0x8B)
    actual[461] &= 0xFD
    expected_ram = bytearray(data)
    if code_permission:
        expected_ram[:4] = struct.pack('<I', 0x11223344)
    test.assertEqual(actual, expected_ram, 'only TSS busy and the allowed four-byte code write may change source RAM')
    test.assertEqual(capture['loader.bin'], image[:512])
