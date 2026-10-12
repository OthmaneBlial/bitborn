#!/usr/bin/env python3
"""Boot only the exact curated one-bit image exported by the browser test."""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from tools.bitborn import read_bits
from tests.qemu import Guest
from tests.test_boot import EXPECTED


def verify_export():
    original, _ = read_bits(ROOT / 'boot/boot.bits')
    expected_image = bytearray(original)
    expected_image[176] = 104
    image = ROOT / 'build/builder-edited.img'
    source, _ = read_bits(ROOT / 'build/builder-edited.bits')
    assert image.read_bytes() == source == expected_image, 'Export must match the reviewed image with only H→h changed'
    expected_output = EXPECTED.replace(b'Hello from raw', b'hello from raw')
    with Guest(image) as guest:
        assert guest.wait_for(lambda output: expected_output in output) == expected_output
        assert 'HLT=1' in guest.hmp('info registers')
    print('Real QEMU passed: downloaded .img/.bits are identical and print the exact one-bit-edited greeting')


if __name__ == '__main__':
    verify_export()
