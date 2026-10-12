import json
import tempfile
import subprocess
import unittest
import io
import os
from contextlib import redirect_stderr
from unittest.mock import patch
from pathlib import Path
from tools.bitborn import ROOT, atomic_write, bitdiff, digest, inspect, main, read_bits, verify


class ToolTests(unittest.TestCase):
    def test_whitespace_comments_and_errors(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "source.bits"
            path.write_text("# comment\n 10111000\t00101010 # data | value | two bytes\n")
            self.assertEqual(read_bits(path)[0], bytes.fromhex("b8 2a"))
            for comment in ("ordinary trailing comment", "text | separator", "text | two | separators", "instruction | incomplete"):
                path.write_text(f"10101010 # {comment}\n")
                self.assertEqual(read_bits(path)[0], b"\xaa")
            for invalid in ("2", "0000000", "000000000", "0xFA", ""):
                path.write_text(invalid)
                with self.assertRaises(ValueError):
                    read_bits(path)

    def test_cli_comments_and_failed_pack_preserves_output(self):
        with tempfile.TemporaryDirectory() as tmp:
            source, output = Path(tmp) / "source.bits", Path(tmp) / "out.bin"
            source.write_text("10101010 # prose | with | arbitrary | separators\n")
            result = subprocess.run([str(ROOT / "tools/bitpack"), str(source), str(output)], capture_output=True)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(output.read_bytes(), b"\xaa")
            source.write_text("1010101X # invalid source byte\n")
            result = subprocess.run([str(ROOT / "tools/bitpack"), str(source), str(output)], capture_output=True)
            self.assertEqual(result.returncode, 1)
            self.assertIn(b":1: expected eight binary digits", result.stderr)
            self.assertEqual(output.read_bytes(), b"\xaa")

    def test_packing_cannot_destroy_source_through_aliases(self):
        with tempfile.TemporaryDirectory() as temporary:
            source = Path(temporary) / 'source.bits'
            original = '10111000 00101010 00000000\n'
            source.write_text(original)
            hardlink, symlink = Path(temporary) / 'hardlink.bin', Path(temporary) / 'symlink.bin'
            hardlink.hardlink_to(source)
            symlink.symlink_to(source)
            for output in (source, hardlink, symlink):
                result = subprocess.run([str(ROOT / 'tools/bitpack'), str(source), str(output)], capture_output=True)
                self.assertEqual(result.returncode, 1)
                self.assertIn(b'cannot overwrite the literal input source', result.stderr)
                self.assertEqual(source.read_text(), original)
                self.assertEqual(output.read_text(), original)

    def test_failed_io_preserves_output_and_cleans_staging(self):
        with tempfile.TemporaryDirectory() as temporary:
            directory = Path(temporary)
            source, output = directory / 'input.bits', directory / 'out.bin'
            source.write_text('10101010\n')
            for stage in ('fsync', 'replace'):
                for existing in (False, True):
                    with self.subTest(stage=stage, existing=existing):
                        if existing:
                            output.write_bytes(b'previous complete file')
                        else:
                            output.unlink(missing_ok=True)
                        error = io.StringIO()
                        with patch('sys.argv', ['bitpack', str(source), str(output)]), patch(f'tools.bitborn.os.{stage}', side_effect=OSError('injected I/O failure')), redirect_stderr(error):
                            self.assertEqual(main('bitpack'), 1)
                        self.assertIn('injected I/O failure', error.getvalue())
                        self.assertEqual(output.exists(), existing)
                        if existing:
                            self.assertEqual(output.read_bytes(), b'previous complete file')
                        self.assertEqual(sorted(path.name for path in directory.iterdir()), ['input.bits', 'out.bin'] if existing else ['input.bits'])

    def test_atomic_outputs_links_permissions_and_nonfiles(self):
        with tempfile.TemporaryDirectory() as temporary:
            directory = Path(temporary)
            target, symlink, hardlink = [directory / name for name in ('target.bin', 'symbolic.bin', 'hard.bin')]
            atomic_write(target, b'old')
            if os.name == 'posix':
                self.assertEqual(target.stat().st_mode & 0o777, 0o600)
                target.chmod(0o754)
            symlink.symlink_to(target)
            hardlink.hardlink_to(target)
            atomic_write(symlink, b'complete new bytes')
            self.assertTrue(symlink.is_symlink())
            self.assertEqual(target.read_bytes(), b'complete new bytes')
            self.assertEqual(hardlink.read_bytes(), b'old', 'atomic replacement leaves other hard-linked entries intact')
            if os.name == 'posix':
                self.assertEqual(target.stat().st_mode & 0o777, 0o754)
            with self.assertRaisesRegex(ValueError, 'regular file'):
                atomic_write(directory, b'never written')

    def test_target_annotations_are_verified_separately(self):
        data, _ = read_bits(ROOT / "boot/boot.bits")
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            for name in ("boot", "examples", "build"):
                (root / name).mkdir()
            source = (ROOT / "boot/boot.bits").read_text().replace(
                "11111010 # instruction | CLI | FA disables maskable interrupts during stack setup.",
                "11111010 # instruction | incomplete")
            (root / "boot/boot.bits").write_text(source)
            self.assertEqual(read_bits(root / "boot/boot.bits")[0], data)
            (root / "build/boot.img").write_bytes(data)
            manifest = json.loads((ROOT / "targets.json").read_text())[:1]
            (root / "targets.json").write_text(json.dumps(manifest))
            with self.assertRaisesRegex(ValueError, "every byte range needs a valid explanation"):
                verify(root)

    def test_boot_known_encodings_and_branches(self):
        data, annotations = read_bits(ROOT / "boot/boot.bits")
        self.assertEqual(data[:19], bytes.fromhex("fa ea 06 7c 00 00 31 c0 8e d8 8e c0 8e d0 bc 00 7c fc fb"))
        self.assertEqual(data[52:60], bytes.fromhex("be 5b 7c ac 84 c0 74 1b"))
        self.assertEqual(data[87:91], bytes.fromhex("fa f4 eb fd"))
        self.assertEqual(data[510:], b"\x55\xaa")
        self.assertEqual(len(data), 512)
        for offset, target in [(58, 87), (78, 75), (85, 55), (89, 88)]:
            self.assertEqual(offset + 2 + int.from_bytes(data[offset+1:offset+2], "little", signed=True), target)
        self.assertEqual(sum(a["size"] for a in annotations), 512)
        self.assertTrue(all(a["explanation"] for a in annotations))

    def test_inspect_and_diff(self):
        self.assertIn("0000  10111000  b8", inspect(b"\xb8"))
        self.assertEqual(bitdiff(b"\x00", b"\x01"), "0000  00000000 -> 00000001  .......^")
        self.assertIn("-------- -> 00000001", bitdiff(b"", b"\x01"))
        self.assertIn("00000001 -> --------", bitdiff(b"\x01", b""))
        self.assertEqual(bitdiff(b"\x00", b"\x00"), "identical")

    def test_reviewed_hashes(self):
        for target in json.loads((ROOT / "targets.json").read_text()):
            with self.subTest(source=target["source"]):
                data, _ = read_bits(ROOT / target["source"])
                self.assertEqual(len(data), target["size"])
                self.assertEqual(digest(data), target["sha256"])
