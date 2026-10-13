#!/usr/bin/env python3
"""Record actual QEMU VGA cells from two curated literal sources, never render fake output."""
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


def run(*args):
    return subprocess.run(args, check=True, capture_output=True, timeout=30).stdout


def sha(data):
    return hashlib.sha256(data).hexdigest()


def record():
    directory = ROOT / 'build/self-modifying-recording'
    directory.mkdir(parents=True, exist_ok=True)
    captures = []
    for index, (name, character) in enumerate((('control', 0x41), ('program', 0x61))):
        relative = f'examples/self-modifying/{name}.bits'
        source = ROOT / relative
        data, _ = read_bits(source)
        assert len(data) == 82 and data[52] == character and data[61] == 0x41
        packed = bios_sector(data)
        image = directory / f'{name}.img'
        image.write_bytes(packed)
        ppm = directory / f'{name}.ppm'
        with Guest(image) as guest:
            guest.wait_for(lambda output: output == bytes([character]) and 'EIP=00007c50' in guest.hmp('info registers') and 'HLT=1' in guest.hmp('info registers'))
            guest.command('stop')
            assert guest.memory(0xB8000, 2) == bytes([character, 0x0F])
            code = guest.memory(0x7C00, 82)
            assert [offset for offset, (a, b) in enumerate(zip(data, code)) if a != b] == ([61] if name == 'program' else [])
            guest.screenshot(ppm)
        assert image.read_bytes() == packed
        full = ROOT / f'assets/self-modifying-{name}.png'
        run('ffmpeg', '-v', 'error', '-y', '-i', str(ppm), '-frames:v', '1', str(full))
        probe = json.loads(run('ffprobe', '-v', 'error', '-show_entries', 'stream=width,height', '-of', 'json', str(ppm)))['streams'][0]
        width, height = probe['width'], probe['height']
        assert width % 80 == 0 and height % 25 == 0, 'the source selects 80x25 text mode'
        frame = directory / f'{index:04d}.png'
        run('ffmpeg', '-v', 'error', '-y', '-i', str(ppm), '-vf', f'crop={width//80}:{height//25}:0:0,scale=288:512:flags=neighbor', '-frames:v', '1', str(frame))
        pixels = run('ffmpeg', '-v', 'error', '-i', str(frame), '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-')
        assert len(pixels) == 288 * 512 * 3 and len(set(pixels)) > 1, 'recorded cell must contain actual visible pixels'
        captures.append({'source': relative, 'sourceSha256': sha(source.read_bytes()), 'payloadSha256': sha(data), 'imageSha256': sha(packed),
                         'serial': chr(character), 'vga': [character, 0x0F], 'originalOperand': data[61], 'liveOperand': code[61],
                         'screenshot': str(full.relative_to(ROOT)), 'screenshotSha256': sha(full.read_bytes()), 'ppmSha256': sha(ppm.read_bytes()),
                         'dimensions': [width, height], 'crop': [0, 0, width//80, height//25], 'frameSha256': sha(frame.read_bytes())})
    gif = ROOT / 'assets/self-modifying-demo.gif'
    run('ffmpeg', '-v', 'error', '-y', '-framerate', '1/2', '-i', str(directory / '%04d.png'), '-frames:v', '2',
        '-filter_complex', 'split[a][b];[a]palettegen[p];[b][p]paletteuse', '-loop', '0', str(gif))
    probe = json.loads(run('ffprobe', '-v', 'error', '-show_entries', 'stream=nb_frames:format=duration', '-of', 'json', str(gif)))
    assert int(probe['streams'][0]['nb_frames']) == 2
    assert float(probe['format']['duration']) == 4
    pixels = run('ffmpeg', '-v', 'error', '-i', str(gif), '-fps_mode', 'passthrough', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-')
    assert len(pixels) == 2 * 288 * 512 * 3
    assert pixels[:len(pixels)//2] != pixels[len(pixels)//2:], 'the encoded native cells must remain different'
    metadata = {'kind': 'Actual QEMU/SeaBIOS VGA cells from two separate curated boot runs; not native rewind or browser simulation',
                'qemu': run(os.environ.get('QEMU', 'qemu-system-i386'), '--version').decode().splitlines()[0],
                'alterations': 'First VGA text cell cropped, nearest-neighbor scaled to 288x512, then GIF palette encoding; no synthetic glyphs or overlays',
                'presentationSecondsPerFrame': 2, 'writerSourceOffset': 52, 'runtimeOperandOffset': 61, 'changedBit': 5,
                'captures': captures, 'gif': str(gif.relative_to(ROOT)), 'gifSha256': sha(gif.read_bytes()),
                'toolSha256': sha(Path(__file__).read_bytes()), 'harnessSha256': sha((ROOT / 'tests/qemu.py').read_bytes()),
                'reproduce': 'make build && python3 tools/record_self_modifying.py'}
    (ROOT / 'assets/self-modifying-recording.json').write_text(json.dumps(metadata, indent=2) + '\n')
    print('Recorded two actual QEMU VGA cells, full screenshots and source/image/frame/GIF hashes; separate boots, no native rewind claim.')


if __name__ == '__main__':
    record()
