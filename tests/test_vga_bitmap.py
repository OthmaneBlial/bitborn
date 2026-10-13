import tempfile
import unittest
from pathlib import Path
from tools.bitborn import ROOT, read_bits
from tools.build import bios_sector
from tests.qemu import Guest
from tests.vga_bitmap_checks import check_source, check_guest, check_screenshot


class VGABitmapTests(unittest.TestCase):
    def test_one_palette_bit_changes_rgb_but_not_the_native_pixel_indices(self):
        programs = {name: read_bits(ROOT / f'examples/vga-bitmap/{name}.bits')[0] for name in ('program', 'control')}
        self.assertEqual([index for index, (a, b) in enumerate(zip(programs['program'], programs['control'])) if a != b], [41])
        self.assertEqual(programs['program'][41] ^ programs['control'][41], 0x20)
        frames = []
        for name, component in (('program', 63), ('control', 31)):
            with self.subTest(name=name), tempfile.TemporaryDirectory() as directory:
                data = programs[name]; check_source(data, component)
                image = Path(directory) / 'bitmap.img'; packed = bios_sector(data); image.write_bytes(packed)
                ppm = Path(directory) / 'screen.ppm'
                with Guest(image) as guest:
                    framebuffer = check_guest(guest, data, ppm)
                width, height, green = check_screenshot(ppm.read_bytes(), component)
                self.assertEqual(green, 255 if name == 'program' else 127)
                self.assertGreaterEqual(width, 320); self.assertGreaterEqual(height, 200)
                self.assertEqual(framebuffer.count(10), 16)
                frames.append(framebuffer)
                self.assertEqual(image.read_bytes(), packed, 'read-only disk image is unchanged')
                self.assertEqual(read_bits(ROOT / f'examples/vga-bitmap/{name}.bits')[0], data)
        self.assertEqual(frames[0], frames[1], 'palette surgery changes displayed RGB, not pixel indices')
