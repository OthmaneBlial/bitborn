import gzip
import io
import tarfile
import json
import tempfile
from pathlib import Path
import unittest
from tools.release import archive
from tools.bitborn import artifact_paths


class ReleaseTests(unittest.TestCase):
    def test_only_manifest_artifacts_can_be_published(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'build').mkdir()
            (root / 'build/unreviewed.img').write_bytes(b'untrusted test download')
            (root / 'targets.json').write_text(json.dumps([
                {'source':'boot/boot.bits','output':'boot.img'},
                {'source':'examples/exit-code/program.bits','output':'exit.bin','environment':'linux-x86_64'},
                {'source':'boot/loader.bits','output':'loader.bin'},
                {'source':'examples/monitor/program.bits','output':'monitor.bin','loader':'boot/loader.bits'},
            ]))
            self.assertEqual([str(path) for path in artifact_paths(root)],['boot.img','exit.bin','exit.elf','monitor.bin','monitor.img'])
            (root / 'targets.json').write_text(json.dumps([{'source':'x.bits','output':'../outside.img'}]))
            with self.assertRaisesRegex(ValueError,'inside build'):
                artifact_paths(root)

    def test_deterministic_archive_and_executable_mode(self):
        files = {"boot.img": b"\xfa", "example.elf": b"\x7fELF"}
        first = archive(files)
        self.assertEqual(first, archive(dict(reversed(list(files.items())))))
        with tarfile.open(fileobj=io.BytesIO(gzip.decompress(first)), mode="r:") as tar:
            self.assertEqual(tar.extractfile("boot.img").read(), b"\xfa")
            self.assertEqual(tar.getmember("example.elf").mode, 0o755)
            self.assertEqual(tar.getmember("boot.img").mtime, 0)
