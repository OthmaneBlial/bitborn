import gzip
import io
import tarfile
import unittest
from tools.release import archive


class ReleaseTests(unittest.TestCase):
    def test_deterministic_archive_and_executable_mode(self):
        files = {"boot.img": b"\xfa", "example.elf": b"\x7fELF"}
        first = archive(files)
        self.assertEqual(first, archive(dict(reversed(list(files.items())))))
        with tarfile.open(fileobj=io.BytesIO(gzip.decompress(first)), mode="r:") as tar:
            self.assertEqual(tar.extractfile("boot.img").read(), b"\xfa")
            self.assertEqual(tar.getmember("example.elf").mode, 0o755)
            self.assertEqual(tar.getmember("boot.img").mtime, 0)
