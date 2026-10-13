#!/usr/bin/env python3
"""Capture six curated native permission states; never infer an instruction trace."""
import json
import os
import platform
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from tools.bitborn import digest
from tests.qemu import Guest
from tests.user_page_checks import CASES, SOURCE_FILES, make_case, capture_guest, check_snapshot


def main():
    sources = {name: digest((ROOT / name).read_bytes()) for name in SOURCE_FILES}
    captures = []
    for probe, permitted in CASES:
        name = f'{probe}-{"permitted" if permitted else "denied"}'
        data, image_bytes = make_case(probe, permitted)
        with tempfile.TemporaryDirectory(prefix='bitborn-user-page-capture-') as directory:
            image = Path(directory) / 'user-page.img'
            image.write_bytes(image_bytes)
            with Guest(image) as guest:
                captured = capture_guest(guest)
                check_snapshot(unittest.TestCase(), data, image_bytes, probe, permitted, captured)
            assert image.read_bytes() == image_bytes
        assets = {}
        for label, value in captured.items():
            path = f'assets/user-page-{name}-{label}'
            (ROOT / path).write_bytes(value)
            assets[label] = {'file': path, 'size': len(value), 'sha256': digest(value)}
        captures.append({'name': name, 'probe': probe, 'permitted': permitted,
                         'payloadSize': len(data), 'payloadSha256': digest(data),
                         'imageSize': len(image_bytes), 'imageSha256': digest(image_bytes),
                         'stackKind': 'retained PF return frame and PUSHAD' if not permitted else
                                      'initial outward-IRETD residue; no page fault frame',
                         'assets': assets})
    assert sources == {name: digest((ROOT / name).read_bytes()) for name in SOURCE_FILES}, 'capture inputs changed'
    version = subprocess.run([os.environ.get('QEMU', 'qemu-system-i386'), '--version'],
                             capture_output=True, text=True, check=True, timeout=10).stdout.splitlines()[0]
    record = {'schema': 1,
              'kind': 'Actual final QMP/HMP register and physical-memory snapshots from six independent QEMU boots; not an instruction trace or arbitrary-process isolation claim',
              'qemu': version, 'host': {'system': platform.system(), 'machine': platform.machine()},
              'registerTextFormat': 'Native HMP output, LF endings and trailing whitespace removed',
              'sourceSha256': sources, 'captures': captures,
              'reproduce': 'python3 tools/record_user_page.py'}
    (ROOT / 'assets/user-page-recording.json').write_text(json.dumps(record, indent=2) + '\n')
    print('Captured six native permission boots, 66 actual register/memory files, complete paging structures, fault/initial-stack distinctions and source/payload/image hashes.')


if __name__ == '__main__':
    main()
