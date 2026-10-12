import json
import tempfile
import unittest
from pathlib import Path
from tools.bitborn import ROOT, bitdiff, digest, inspect, read_bits


class ToolTests(unittest.TestCase):
    def test_whitespace_comments_and_errors(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "source.bits"
            path.write_text("# comment\n 10111000\t00101010 # data | value | two bytes\n")
            self.assertEqual(read_bits(path)[0], bytes.fromhex("b8 2a"))
            path.write_text("10101010 # ordinary trailing comment\n")
            self.assertEqual(read_bits(path)[0], b"\xaa")
            for invalid in ("2", "0000000", "000000000", "0xFA", "", "10101010 # instruction | incomplete"):
                path.write_text(invalid)
                with self.assertRaises(ValueError):
                    read_bits(path)

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
