#!/usr/bin/env python3
"""Capture actual native bitmap pixels from two curated boots; no synthesized glyphs."""
import hashlib
import json
import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from tools.bitborn import read_bits
from tools.build import bios_sector
from tests.qemu import Guest
from tests.vga_bitmap_checks import check_source, check_guest, check_screenshot


def run(*args):
    return subprocess.run(args, check=True, capture_output=True, timeout=30).stdout


def sha(data):
    return hashlib.sha256(data).hexdigest()


def record():
    directory = ROOT / 'build/vga-bitmap-recording'; directory.mkdir(parents=True, exist_ok=True)
    programs = {name: read_bits(ROOT / f'examples/vga-bitmap/{name}.bits')[0] for name in ('control', 'program')}
    assert [offset for offset, (a, b) in enumerate(zip(programs['control'], programs['program'])) if a != b] == [41]
    assert programs['control'][41] ^ programs['program'][41] == 0x20
    captures = []; frame_pixels = []
    for index, (name, component) in enumerate((('control', 31), ('program', 63))):
        relative = f'examples/vga-bitmap/{name}.bits'; source = ROOT / relative
        data = programs[name]; check_source(data, component); packed = bios_sector(data)
        image = directory / f'{name}.img'; image.write_bytes(packed); ppm = directory / f'{name}.ppm'
        with Guest(image) as guest:
            framebuffer = check_guest(guest, data, ppm)
        width, height, green = check_screenshot(ppm.read_bytes(), component)
        assert image.read_bytes() == packed and read_bits(source)[0] == data
        full = ROOT / f'assets/vga-bitmap-{name}.png'
        run('ffmpeg', '-v', 'error', '-y', '-i', str(ppm), '-frames:v', '1', str(full))
        sx, sy = width // 320, height // 200
        crop = [156 * sx, 96 * sy, 8 * sx, 8 * sy]
        frame = directory / f'{index:04d}.png'
        run('ffmpeg', '-v', 'error', '-y', '-i', str(ppm), '-vf',
            f'crop={crop[2]}:{crop[3]}:{crop[0]}:{crop[1]},scale=512:512:flags=neighbor', '-frames:v', '1', str(frame))
        pixels = run('ffmpeg', '-v', 'error', '-i', str(frame), '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-')
        assert len(pixels) == 512 * 512 * 3
        frame_pixels.append(pixels)
        captures.append({'source': relative, 'sourceSha256': sha(source.read_bytes()), 'payloadSha256': sha(data),
                         'imageSha256': sha(packed), 'framebufferSha256': sha(framebuffer), 'foregroundPixels': framebuffer.count(10),
                         'dacGreen': component, 'capturedRGB': [0, green, 0], 'dimensions': [width, height], 'crop': crop,
                         'screenshot': str(full.relative_to(ROOT)), 'screenshotSha256': sha(full.read_bytes()),
                         'ppmSha256': sha(ppm.read_bytes()), 'frameSha256': sha(frame.read_bytes())})
    assert captures[0]['framebufferSha256'] == captures[1]['framebufferSha256'] and frame_pixels[0] != frame_pixels[1]
    gif = ROOT / 'assets/vga-bitmap-demo.gif'
    run('ffmpeg', '-v', 'error', '-y', '-framerate', '1/2', '-i', str(directory / '%04d.png'), '-frames:v', '2',
        '-filter_complex', 'split[a][b];[a]palettegen[p];[b][p]paletteuse', '-loop', '0', str(gif))
    probe = json.loads(run('ffprobe', '-v', 'error', '-show_entries', 'stream=nb_frames:format=duration', '-of', 'json', str(gif)))
    assert int(probe['streams'][0]['nb_frames']) == 2 and float(probe['format']['duration']) == 4
    decoded = run('ffmpeg', '-v', 'error', '-i', str(gif), '-fps_mode', 'passthrough', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-')
    assert decoded == b''.join(frame_pixels), 'GIF must preserve every actual captured pixel'
    metadata = {'kind': 'Actual QEMU/SeaBIOS VGA bitmap pixels from two separate curated boots; not browser simulation or native palette animation',
                'qemu': run(os.environ.get('QEMU', 'qemu-system-i386'), '--version').decode().splitlines()[0],
                'alterations': 'Native 8x8 letter crop, nearest-neighbor scale to 512x512, then lossless-for-these-colors GIF palette encoding; no synthetic pixels or overlays',
                'sourcePaletteOffset': 41, 'changedBit': 5, 'bitmapSourceOffset': 78, 'presentationSecondsPerFrame': 2,
                'captures': captures, 'gif': str(gif.relative_to(ROOT)), 'gifSha256': sha(gif.read_bytes()),
                'toolSha256': sha(Path(__file__).read_bytes()), 'harnessSha256': sha((ROOT / 'tests/qemu.py').read_bytes()),
                'oracleSha256': sha((ROOT / 'tests/vga_bitmap_checks.py').read_bytes()),
                'reproduce': 'make build && python3 tools/record_vga_bitmap.py'}
    (ROOT / 'assets/vga-bitmap-recording.json').write_text(json.dumps(metadata, indent=2) + '\n')
    print('Recorded two actual native palette states, identical whole framebuffers, full screens and exact source/frame/GIF hashes.')


if __name__ == '__main__':
    record()
