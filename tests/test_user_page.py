"""Native CPL3 page permission, exact page tables and retained PF frame proof."""
import json
import struct
import tempfile
import unittest
from pathlib import Path
from tools.bitborn import ROOT, read_bits, digest
from tests.qemu import Guest
from tests.user_page_checks import CASES, SOURCE_FILES, MEMORY, make_case, capture_guest, check_snapshot


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

    def test_literal_read_and_code_write_slots(self):
        read, annotations = read_bits(ROOT / 'tests/fixtures/user-page-read-slot.bits')
        write, _ = read_bits(ROOT / 'tests/fixtures/user-page-code-write-slot.bits')
        self.assertEqual(read, bytes.fromhex('a1 00 b0 00 00 90 90 90 90 90'))
        self.assertEqual([(item['offset'], item['size']) for item in annotations],
                         [(0, 5), (5, 1), (6, 1), (7, 1), (8, 1), (9, 1)])
        self.assertEqual(write, bytes.fromhex('c7 05 00 7e 00 00 44 33 22 11'))
        source, _ = read_bits(ROOT / 'tests/fixtures/user-page.bits')
        data = source[113:123]
        self.assertEqual(data, bytes.fromhex('c7051c50000005700000'))
        self.assertEqual(data[6] ^ 2, 7, 'the code-page writable control is one permission bit')

    def test_native_permission_probe_matrix(self):
        paths = [ROOT / name for name in SOURCE_FILES if name.endswith('.bits')]
        source_text = {item: item.read_bytes() for item in paths}
        for probe, permitted in CASES:
            with self.subTest(probe=probe, permitted=permitted), tempfile.TemporaryDirectory() as directory:
                data, expected_disk = make_case(probe, permitted)
                self.assertEqual(len(expected_disk), 1536)
                image = Path(directory) / 'user-page.img'
                image.write_bytes(expected_disk)
                with Guest(image) as guest:
                    capture = capture_guest(guest)
                    check_snapshot(self, data, expected_disk, probe, permitted, capture)
                self.assertEqual(image.read_bytes(), expected_disk)
        for item, original in source_text.items():
            self.assertEqual(item.read_bytes(), original)

    def test_actual_capture_sources_assets_and_snapshot_replay(self):
        record = json.loads((ROOT / 'assets/user-page-recording.json').read_text())
        self.assertEqual(record['schema'], 1)
        self.assertIn('not an instruction trace', record['kind'])
        self.assertEqual(set(record['sourceSha256']), set(SOURCE_FILES))
        for source in SOURCE_FILES:
            self.assertEqual(record['sourceSha256'][source], digest((ROOT / source).read_bytes()), source)
        self.assertEqual([(item['probe'], item['permitted']) for item in record['captures']], list(CASES))
        for item in record['captures']:
            probe, permitted = item['probe'], item['permitted']
            name = f'{probe}-{"permitted" if permitted else "denied"}'
            self.assertEqual(item['name'], name)
            data, image = make_case(probe, permitted)
            self.assertEqual(item['payloadSize'], len(data))
            self.assertEqual(item['payloadSha256'], digest(data))
            self.assertEqual(item['imageSize'], len(image))
            self.assertEqual(item['imageSha256'], digest(image))
            self.assertEqual(item['stackKind'], 'retained PF return frame and PUSHAD' if not permitted else
                             'initial outward-IRETD residue; no page fault frame')
            self.assertEqual(set(item['assets']), {'registers.txt', *MEMORY})
            capture = {}
            for label, asset in item['assets'].items():
                expected_path = f'assets/user-page-{name}-{label}'
                self.assertEqual(asset['file'], expected_path)
                capture[label] = (ROOT / expected_path).read_bytes()
                self.assertEqual(asset['size'], len(capture[label]))
                self.assertEqual(asset['sha256'], digest(capture[label]))
            check_snapshot(self, data, image, probe, permitted, capture)

    def test_snapshot_replay_rejects_wrong_permission_and_frame(self):
        record = json.loads((ROOT / 'assets/user-page-recording.json').read_text())
        item = next(value for value in record['captures'] if value['name'] == 'read-denied')
        captured = {label: (ROOT / asset['file']).read_bytes() for label, asset in item['assets'].items()}
        data, image = make_case('read', False)
        for label, offset, replacement in [('table.bin', 12, 7), ('log.bin', 0, 7), ('ram.bin', 300, 0xFF)]:
            with self.subTest(label=label):
                malformed = dict(captured)
                value = bytearray(malformed[label])
                value[offset] = replacement
                malformed[label] = bytes(value)
                with self.assertRaises(AssertionError):
                    check_snapshot(self, data, image, 'read', False, malformed)
