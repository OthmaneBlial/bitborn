import json
import os
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
from tools.bitborn import digest, targets
from tools import build


class ManifestTests(unittest.TestCase):
    def test_invalid_types_paths_options_and_references(self):
        good = {'source':'a.bits', 'output':'a.bin', 'size':1, 'sha256':digest(b'\xf4')}
        invalid = [None, {}, 'targets', [None], [{**good, 'unknown':1}]]
        for key, values in {
            'source':[None, 1, '', 'a.bin', '../a.bits', './a.bits', 'a//b.bits', '/a.bits', 'a\\b.bits', 'a\0.bits'],
            'output':[[], '', 'a/../b.bin'], 'size':[True, 0, -1, 1.5, '1'],
            'sha256':[None, '0'*63, 'A'*64], 'bios':[1, 'false'], 'bootable':['true'],
            'environment':['linux', None], 'loader':['unknown.bits'], 'disk_payloads':[[], {}, None],
        }.items():
            invalid.extend([[{**good, key:value}] for value in values])
        invalid.extend([[{**good, **options}] for options in [
            {'environment':'linux-x86_64', 'bootable':True}, {'bios':True},
            {'loader':'a.bits', 'bootable':True},
            {'loader':'a.bits', 'disk_payloads':[{'source':'a.bits','sectors':True,'first_sector':4}]},
            {'loader':'a.bits', 'disk_payloads':[{'source':'a.bits','sectors':1,'first_sector':True}]},
            {'loader':'a.bits', 'disk_payloads':[{'source':'a.bits','sectors':1,'first_sector':5}]},
            {'loader':'a.bits', 'disk_payloads':[{'source':'a.bits','sectors':1,'first_sector':4,'load_address':True}]},
            {'loader':'a.bits', 'disk_payloads':[{'source':'unknown.bits','sectors':1,'first_sector':4}]},
        ]])
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            for value in invalid:
                with self.subTest(manifest=value):
                    (root/'targets.json').write_text(json.dumps(value))
                    with self.assertRaises(ValueError): targets(root)
                    self.assertFalse((root/'build').exists())
            (root/'targets.json').write_text(json.dumps([good]))
            self.assertEqual(targets(root), [good])
            (root/'challenges').mkdir()
            (root/'challenges/targets.json').write_text('{}')
            with self.assertRaisesRegex(ValueError, 'JSON list'): targets(root)

    def test_symlinks_hardlinks_and_output_directories(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory); (root/'build').mkdir()
            (root/'a.bits').write_text('11110100')
            good = {'source':'a.bits','output':'a.bin','size':1,'sha256':digest(b'\xf4')}
            (root/'targets.json').write_text(json.dumps([good]))
            output = root/'build/a.bin'
            for kind in ('symlink', 'hardlink', 'directory'):
                if kind == 'symlink': output.symlink_to(root/'a.bits')
                elif kind == 'hardlink': os.link(root/'a.bits',output)
                else: output.mkdir()
                with self.subTest(kind=kind), self.assertRaises(ValueError): targets(root)
                output.rmdir() if kind == 'directory' else output.unlink()
                self.assertEqual((root/'a.bits').read_text(),'11110100')
            (root/'b.bits').write_text('11110100')
            (root/'targets.json').write_text(json.dumps([good,{**good,'source':'b.bits','output':'b.bin'}]))
            output.write_bytes(b'previous'); os.link(output,root/'build/b.bin')
            with self.assertRaisesRegex(ValueError,'alias each other'): targets(root)
            (root/'build/b.bin').unlink(); output.unlink()
            with tempfile.TemporaryDirectory() as outside:
                output.symlink_to(Path(outside)/'outside.bin')
                with self.assertRaisesRegex(ValueError,'escape build'): targets(root)
                output.unlink()
                (root/'a.bits').unlink(); (root/'a.bits').symlink_to(Path(outside)/'outside.bits')
                with self.assertRaisesRegex(ValueError,'sources must resolve'): targets(root)
                (root/'a.bits').unlink(); (root/'a.bits').write_text('11110100')
                (root/'build').rmdir(); (root/'build').symlink_to(outside, target_is_directory=True)
                with self.assertRaisesRegex(ValueError,'Build directory'): targets(root)

    def test_all_sources_and_packages_are_checked_before_writes(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory); (root/'build').mkdir()
            (root/'a.bits').write_text('11110100'); (root/'b.bits').write_text('11110100')
            previous = root/'build/a.bin'; previous.write_bytes(b'previous')
            good = {'source':'a.bits','output':'a.bin','size':1,'sha256':digest(b'\xf4')}
            for failure in ({'sha256':'0'*64}, {'size':511,'bootable':True}):
                bad = {**good,'source':'b.bits','output':'b.bin',**failure}
                if failure.get('bootable'): (root/'b.bits').write_text(' '.join(['11110100']*511)); bad['sha256']=digest(b'\xf4'*511)
                (root/'targets.json').write_text(json.dumps([good,bad]))
                with patch.object(build,'ROOT',root), self.assertRaises(ValueError): build.build()
                self.assertEqual(previous.read_bytes(),b'previous')
                self.assertFalse((root/'build/b.bin').exists())
