import json
import tempfile
import unittest
from pathlib import Path
from tools.bitborn import digest, targets, verify
from tools.build import bios_sector, elf64, package_target


class PackagingTests(unittest.TestCase):
    def test_corrupted_derived_images_and_elf_are_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            for name in ('boot','examples','build'):
                (root / name).mkdir()
            source = root / 'examples/probe.bits'
            source.write_text('11111010 # instruction | CLI | Disable interrupts.\n11110100 # instruction | HLT | Halt.\n')
            data = bytes.fromhex('fa f4')
            for packaging, suffix, good in [({'bootable':True},'.img',bios_sector(data)), ({'environment':'linux-x86_64'},'.elf',elf64(data))]:
                target = {'source':'examples/probe.bits','output':'probe.bin','size':2,'sha256':digest(data),**packaging}
                (root / 'targets.json').write_text(json.dumps([target]))
                (root / 'build/probe.bin').write_bytes(data)
                derived = root / ('build/probe' + suffix)
                derived.write_bytes(good)
                self.assertIn('every packed artifact',verify(root))
                derived.write_bytes(b'BROKEN PACKAGE')
                with self.assertRaisesRegex(ValueError,'different packaged artifact'):
                    verify(root)

    def test_raw_and_packaged_name_collisions_fail_before_build(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            for packaging, suffix in [({'environment':'linux-x86_64'},'.elf'), ({'bootable':True},'.img')]:
                manifest = [{'source':'a.bits','output':'same.bin','size':1,'sha256':digest(b'x'),**packaging}, {'source':'b.bits','output':'same'+suffix,'size':1,'sha256':digest(b'x')}]
                (root / 'targets.json').write_text(json.dumps(manifest))
                with self.assertRaisesRegex(ValueError,'colliding'):
                    targets(root)
            (root / 'targets.json').write_text(json.dumps([{'source':'boot.bits','output':'boot.img','size':512,'sha256':digest(bytes(512)),'bios':True,'bootable':True}]))
            self.assertEqual(len(targets(root)),1)

    def test_disk_layout_and_reviewed_payload_limits(self):
        with tempfile.TemporaryDirectory() as directory:
            root=Path(directory)
            (root/'loader.bits').write_text('11111010 11110100')
            (root/'app.bits').write_text('11000011')
            reviewed=[{'source':'loader.bits'}, {'source':'app.bits','size':1,'sha256':digest(b'\xc3')}]
            payload={'source':'app.bits','sectors':2,'first_sector':4}
            target={'source':'stage.bits','output':'stage.bin','loader':'loader.bits','disk_payloads':[payload]}
            result=package_target(target,b'\xfa\xf4',root,reviewed)
            image=result[Path('stage.img')]
            self.assertEqual(len(image),2560)
            self.assertEqual(image[1536:1539],b'\xc3\0\0')
            for patch in ({'first_sector':5},{'sectors':0},{'sectors':True},{'source':'outside.bits'}):
                invalid={**target,'disk_payloads':[{**payload,**patch}]}
                with self.assertRaises(ValueError):package_target(invalid,b'\xfa\xf4',root,reviewed)
            with self.assertRaisesRegex(ValueError,'two-sector read'):package_target(target,bytes(1025),root,reviewed)
