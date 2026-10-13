"""Independent pixel/register oracle for the curated 142-byte VGA experiment."""
import re

BITMAP = ('01000000', '01000000', '01111000', '01000100',
          '01000100', '01000100', '01111000', '00000000')


def expected_framebuffer():
    pixels = bytearray(320 * 200)
    for y, row in enumerate(BITMAP):
        for x, bit in enumerate(row):
            pixels[(96 + y) * 320 + 156 + x] = 10 if bit == '1' else 0
    return bytes(pixels)


def check_source(data, component):
    assert len(data) == 142 and data[41] == component
    assert data[6:18] == bytes([0x31, 0xC0, 0x8E, 0xD0, 0xBC, 0, 0x7C, 0xB8, 0x13, 0, 0xCD, 0x10]), 'initialize the stack before INT 10h'
    assert data[52:55] == bytes([0xBE, 0x4E, 0x7C]), 'literal source address'
    assert data[61:64] == bytes([0xB9, 8, 0])
    assert data[72:74] == bytes([0x75, 0xF3]) and 74 - 13 == 61
    assert data[75:78] == bytes([0xF4, 0xEB, 0xFD])
    assert data[78:] == bytes(10 if bit == '1' else 0 for row in BITMAP for bit in row)


def check_guest(guest, data, screenshot):
    guest.wait_for(lambda _: 'EIP=00007c4c' in guest.hmp('info registers') and 'HLT=1' in guest.hmp('info registers'))
    guest.command('stop')
    registers = guest.hmp('info registers')
    expected = {'AX': 0xA000, 'BX': 0, 'CX': 0, 'DX': 0x03C9,
                'SI': 0x7C8E, 'DI': 0x829C, 'SP': 0x7C00,
                'CS': 0, 'SS': 0, 'DS': 0, 'ES': 0xA000}
    for name, value in expected.items():
        expression = rf'{name}\s*=([0-9a-f]+)' if name in ('CS', 'SS', 'DS', 'ES') else rf'E{name}=([0-9a-f]+)'
        assert int(re.search(expression, registers).group(1), 16) & 65535 == value, name
    flags = int(re.search(r'EFL=([0-9a-f]+)', registers).group(1), 16)
    assert flags & 0xEC5 == 0x44, 'row counter ends at zero; IF/DF and carry clear'
    framebuffer = guest.memory(0xA0000, 64000)
    assert framebuffer == expected_framebuffer(), 'every native pixel index, including the background'
    assert guest.memory(0x7C00, 142) == data, 'neither code nor bitmap source RAM is modified'
    assert guest.output() == b'', 'this program produces graphics, not serial text'
    guest.screenshot(screenshot)
    return framebuffer


def check_screenshot(ppm, component):
    # QEMU emits P6 PPM: dimensions + max value followed by exact RGB bytes.
    match = re.match(rb'P6\s+(\d+)\s+(\d+)\s+255\s', ppm)
    assert match, 'expected QEMU RGB screen dump'
    width, height = map(int, match.groups()); pixels = ppm[match.end():]
    assert width % 320 == 0 and height % 200 == 0
    sx, sy = width // 320, height // 200
    assert sx > 0 and sy > 0 and len(pixels) == width * height * 3
    # QEMU c6_to_8 repeats bit zero into the two low bits; 31 becomes 127.
    green = (component << 2) | (3 if component & 1 else 0)
    framebuffer = expected_framebuffer()
    for y in range(height):
        expected = b''.join(bytes([0, green, 0]) * sx if value == 10 else bytes(3 * sx)
                            for value in framebuffer[(y // sy) * 320:(y // sy + 1) * 320])
        assert pixels[y * width * 3:(y + 1) * width * 3] == expected, f'screenshot row {y}'
    return width, height, green
