import copy
import json
import os
import subprocess
import tempfile
import unittest
from pathlib import Path

from tools.bitborn import ROOT, AnnotationError, inspect, read_annotations, read_bits, targets


class InspectionAnnotationTests(unittest.TestCase):
    def test_all_canonical_annotations_and_optional_bits(self):
        for target in targets():
            data, annotations = read_bits(ROOT / target['source'])
            with self.subTest(source=target['source']):
                result = inspect(data, annotations)
                self.assertEqual(len(result.splitlines()), len(data))
                self.assertEqual(inspect(data, list(reversed(annotations))), result)
        data = b'\x90\xf4'
        entries = [{'offset': 0, 'size': 1, 'kind': 'instruction', 'mnemonic': 'NOP', 'explanation': ''}]
        self.assertIn('NOP', inspect(data, entries))
        entries[0]['bits'] = '10010000'
        self.assertIn('NOP', inspect(data, entries))
        entries[0]['bits'] = '11110100'
        with self.assertRaisesRegex(AnnotationError, 'match'):
            inspect(data, entries)

    def test_malformed_metadata_is_rejected_before_rendering(self):
        item = {'offset': 0, 'size': 1, 'kind': 'instruction', 'mnemonic': 'NOP', 'explanation': 'One byte.'}
        cases = [None, {}, 'text', [None], [1], [{}], [{**item, 'extra': 1}], [item, item]]
        for key, values in {'offset': [True, -1, 2, '0'], 'size': [False, 0, 3, 1.5],
                            'kind': [None, [], 'unknown'], 'mnemonic': [None, 1],
                            'explanation': [None, []], 'bits': [None, 'bad', '10010000 11110100']}.items():
            for value in values:
                cases.append([{**item, key: value}])
        for entries in cases:
            with self.subTest(entries=entries), self.assertRaises(AnnotationError):
                inspect(b'\x90\xf4', entries)
        nested = [{**item, 'size': 2}, {**item, 'offset': 1}]
        with self.assertRaisesRegex(AnnotationError, 'overlap'):
            inspect(b'\x90\xf4', nested)

    def test_terminal_controls_are_escaped_without_losing_unicode(self):
        entries = [{'offset': 0, 'size': 1, 'kind': 'data', 'mnemonic': '文字\tlabel',
                    'explanation': 'line\n\x1b[31m\ud800'}]
        result = inspect(b'\x00', entries)
        self.assertIn('文字\\u0009label', result)
        self.assertIn('line\\u000a\\u001b[31m\\ud800', result)
        self.assertEqual(len(result.splitlines()), 1)
        self.assertNotIn('\x1b', result)

    def test_cli_bounded_regular_inputs_and_structured_failures(self):
        data, annotations = read_bits(ROOT / 'boot/boot.bits')
        with tempfile.TemporaryDirectory() as temporary:
            binary, metadata = Path(temporary) / 'boot.bin', Path(temporary) / 'annotations.json'
            binary.write_bytes(data)
            command = [str(ROOT / 'tools/bitinspect'), str(binary), '--annotations', str(metadata), '--json-errors']
            for raw in [b'[null]', b'{}', b'{', b'\xff', b'[]' + b' ' * (1 << 20),
                        b'[{' + b'"offset":0,"offset":1' + b'}]']:
                metadata.write_bytes(raw)
                result = subprocess.run(command, cwd=ROOT, capture_output=True, text=True, timeout=10)
                self.assertEqual(result.returncode, 1, result.stderr)
                self.assertEqual(result.stdout, '')
                self.assertEqual(json.loads(result.stderr)['code'], 'ANNOTATION_ERROR')
                self.assertNotIn('Traceback', result.stderr)
            malformed = copy.deepcopy(annotations)
            malformed[-1]['size'] = 3
            metadata.write_text(json.dumps(malformed))
            result = subprocess.run(command + ['--references', str(ROOT / 'boot/references.json')],
                                    cwd=ROOT, capture_output=True, text=True, timeout=10)
            self.assertEqual(result.returncode, 1)
            self.assertEqual(result.stdout, '', 'late annotation failures cannot print byte/reference rows')
            self.assertEqual(json.loads(result.stderr)['code'], 'ANNOTATION_ERROR')
            if hasattr(os, 'mkfifo'):
                metadata.unlink()
                os.mkfifo(metadata)
                result = subprocess.run(command, cwd=ROOT, capture_output=True, text=True, timeout=10)
                self.assertEqual(result.returncode, 1)
                self.assertEqual(json.loads(result.stderr)['code'], 'ANNOTATION_ERROR')
            self.assertEqual(binary.read_bytes(), data)
