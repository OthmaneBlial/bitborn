import gzip
import io
import tarfile
import json
import tempfile
from pathlib import Path
import unittest
from tools.release import archive, provenance, check_staging
from tools.bitborn import artifact_paths, digest


class ReleaseTests(unittest.TestCase):
    def test_staging_rejects_unreviewed_files_and_aliases_without_overwriting(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            destination = root / 'release'
            destination.mkdir()
            unknown = destination / 'unreviewed.img'
            unknown.write_bytes(b'preserve me')
            with self.assertRaisesRegex(ValueError, 'unexpected release staging'):
                check_staging(destination, '0.3.0')
            self.assertEqual(unknown.read_bytes(), b'preserve me')
            unknown.unlink()
            protected = root / 'protected.txt'
            protected.write_bytes(b'outside the release')
            (destination / 'boot.img').symlink_to(protected)
            with self.assertRaisesRegex(ValueError, 'unexpected release staging'):
                check_staging(destination, '0.3.0')
            self.assertEqual(protected.read_bytes(), b'outside the release')
            alias = root / 'alias'
            alias.symlink_to(destination, target_is_directory=True)
            with self.assertRaisesRegex(ValueError, 'must not be a symlink'):
                check_staging(alias, '0.3.0')

    def test_provenance_ties_sources_outputs_and_release_files_to_commit(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            for folder in ('boot', 'build', 'release'):
                (root / folder).mkdir()
            source, payload = b'11111010\n', b'\xfa'
            (root / 'boot/boot.bits').write_bytes(source)
            (root / 'build/boot.img').write_bytes(payload)
            (root / 'build/unreviewed.bin').write_bytes(b'not reviewed')
            (root / 'targets.json').write_text(json.dumps([{'source':'boot/boot.bits','output':'boot.img','size':1,'sha256':digest(payload)}]))
            (root / 'release/source.tar.gz').write_bytes(b'fixed source archive')
            (root / 'release/SHA256SUMS').write_bytes(b'not self-hashed')
            (root / 'release/release-provenance.json').write_bytes(b'previous manifest')
            expected = provenance(root, '0.3.0', 'a' * 40, root / 'release')
            self.assertEqual(expected['sourceCommit'], 'a' * 40)
            self.assertEqual(expected['sourceFiles'], {'boot/boot.bits':digest(source)})
            self.assertEqual(expected['reviewedPayloads'], {'boot/boot.bits':digest(payload)})
            self.assertEqual(expected['artifacts'], {'boot.img':digest(payload)})
            self.assertEqual(expected['releaseFiles'], {'source.tar.gz':digest(b'fixed source archive')})
            self.assertEqual(expected, provenance(root, '0.3.0', 'a' * 40, root / 'release'))

    def test_only_manifest_artifacts_can_be_published(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'build').mkdir()
            (root / 'build/unreviewed.img').write_bytes(b'untrusted test download')
            (root / 'targets.json').write_text(json.dumps([
                {'source':'boot/boot.bits','output':'boot.img','size':512,'sha256':digest(bytes(512))},
                {'source':'examples/exit-code/program.bits','output':'exit.bin','size':1,'sha256':digest(b'x'),'environment':'linux-x86_64'},
                {'source':'boot/loader.bits','output':'loader.bin','size':1,'sha256':digest(b'x')},
                {'source':'examples/monitor/program.bits','output':'monitor.bin','size':1,'sha256':digest(b'x'),'loader':'boot/loader.bits'},
            ]))
            self.assertEqual([str(path) for path in artifact_paths(root)],['boot.img','exit.bin','exit.elf','monitor.bin','monitor.img'])
            (root / 'targets.json').write_text(json.dumps([{'source':'x.bits','output':'../outside.img','size':1,'sha256':digest(b'x')}]))
            with self.assertRaisesRegex(ValueError,'relative project paths'):
                artifact_paths(root)

    def test_deterministic_archive_and_executable_mode(self):
        files = {"boot.img": b"\xfa", "example.elf": b"\x7fELF"}
        first = archive(files)
        self.assertEqual(first, archive(dict(reversed(list(files.items())))))
        with tarfile.open(fileobj=io.BytesIO(gzip.decompress(first)), mode="r:") as tar:
            self.assertEqual(tar.extractfile("boot.img").read(), b"\xfa")
            self.assertEqual(tar.getmember("example.elf").mode, 0o755)
            self.assertEqual(tar.getmember("boot.img").mtime, 0)
