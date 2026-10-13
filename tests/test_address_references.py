import copy
import json
import os
import subprocess
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from tools.address_references import AddressReferenceError, MAP_LIMIT, inspect_references, read_reference_map
from tools.bitborn import ROOT, read_bits


class AddressReferenceTests(unittest.TestCase):
    def test_canonical_boot_fields_and_one_bit_regressions(self):
        data, annotations = read_bits(ROOT / "boot/boot.bits")
        mapping = read_reference_map(ROOT / "boot/references.json")
        result = inspect_references(data, mapping)
        self.assertIn("6 declared fields", result)
        self.assertEqual([(e["offset"], e["targetOffset"]) for e in mapping["references"]],
                         [(2, 6), (53, 91), (59, 87), (79, 75), (86, 55), (90, 88)])
        self.assertEqual(data[2:6], b"\x06\x7c\x00\x00")
        self.assertEqual(data[53:55], b"\x5b\x7c")
        self.assertEqual([data[i] for i in (59, 79, 86, 90)], [27, 251, 224, 253])
        self.assertTrue(all(e["targetOffset"] in {a["offset"] for a in annotations} for e in mapping["references"]))
        for entry in mapping["references"]:
            changed = bytearray(data)
            changed[entry["offset"]] ^= 1
            with self.subTest(name=entry["name"]), self.assertRaises(AddressReferenceError):
                inspect_references(changed, mapping)
        self.assertEqual(read_bits(ROOT / "boot/boot.bits")[0], data)

    def test_all_word_values_and_signed_relative_fields(self):
        # Synthetic numeric fields only: these arrays are never executed or packaged.
        data = bytearray(65536)
        for kind in ("abs16", "rel16"):
            entry = {"name": "field", "kind": kind, "offset": 0, "segment": 0, "targetOffset": 0}
            if kind == "rel16":
                entry["originOffset"] = 32768
            mapping = {"loadAddress": 0, "references": [entry]}
            for word in range(65536):
                data[:2] = bytes((word & 255, word >> 8))
                # Adding a signed word to 8000 flips only the result's high bit.
                entry["targetOffset"] = word if kind == "abs16" else word ^ 32768
                self.assertIn(f"-> {entry['targetOffset']:05X}", inspect_references(data, mapping))
        entry = {"name": "short", "kind": "rel8", "offset": 0, "segment": 0, "originOffset": 128, "targetOffset": 0}
        for value in range(256):
            data[0] = value
            entry["targetOffset"] = value ^ 128
            self.assertIn("1 declared fields", inspect_references(data, {"loadAddress": 0, "references": [entry]}))

    def test_far_aliases_a20_and_ip_wrap(self):
        data = bytearray(1 << 20)
        entry = {"name": "far alias", "kind": "far16", "offset": 0, "targetOffset": 0}
        mapping = {"loadAddress": 0, "references": [entry]}
        for offset in range(65536):
            data[:4] = bytes((offset & 255, offset >> 8, 255, 255))
            entry["targetOffset"] = offset - 16 if offset >= 16 else 1048560 + offset
            self.assertIn(f"(file +{entry['targetOffset']:04X})", inspect_references(data, mapping))
        small = bytes([0x20, 0])
        self.assertIn("-> 00010", inspect_references(small, {"loadAddress": 16, "references": [
            {"name": "absolute alias", "kind": "abs16", "offset": 0, "segment": 65535, "targetOffset": 0}]}))
        wrapped = bytearray(65536)
        for origin, raw in [(65535, b"\x01\x00"), (65536, b"\x00\x00")]:
            wrapped[-2:] = raw
            self.assertIn("-> 00000", inspect_references(wrapped, {"loadAddress": 0, "references": [
                {"name": "IP wrap", "kind": "rel16", "offset": 65534, "segment": 0, "originOffset": origin, "targetOffset": 0}]}))

    def test_strict_schema_bounds_names_overlap_and_assumptions(self):
        data, _ = read_bits(ROOT / "boot/boot.bits")
        valid = read_reference_map(ROOT / "boot/references.json")
        cases = [None, [], {}, {**valid, "extra": 1}, {**valid, "loadAddress": True},
                 {**valid, "loadAddress": -1}, {**valid, "loadAddress": 1 << 20},
                 {**valid, "references": []}, {**valid, "references": valid["references"] * 50}]
        for field, value in [("offset", True), ("offset", -1), ("offset", 512), ("offset", 511),
                             ("targetOffset", 512), ("kind", []), ("kind", "abs32"),
                             ("name", ""), ("name", "\x1b[31m"), ("name", "x" * 81)]:
            changed = copy.deepcopy(valid)
            changed["references"][0][field] = value
            cases.append(changed)
        for key in ("segment", "originOffset"):
            changed = copy.deepcopy(valid)
            changed["references"][2][key] = True
            cases.append(changed)
        overlap = copy.deepcopy(valid)
        overlap["references"][1]["offset"] = 3
        cases.append(overlap)
        duplicate = copy.deepcopy(valid)
        duplicate["references"][1]["name"] = duplicate["references"][0]["name"]
        cases.append(duplicate)
        wrong_segment = copy.deepcopy(valid)
        wrong_segment["references"][2]["segment"] = 0x9000
        cases.append(wrong_segment)
        for mapping in cases:
            with self.subTest(mapping=mapping), self.assertRaises(AddressReferenceError):
                inspect_references(data, mapping)
        for binary in (b"", "bytes", bytes((1 << 20) + 1)):
            with self.assertRaises(AddressReferenceError):
                inspect_references(binary, valid)

    def test_bounded_regular_json_and_resource_cleanup(self):
        with tempfile.TemporaryDirectory() as temporary:
            path = Path(temporary) / "references.json"
            for raw in [b"{}" + b" " * MAP_LIMIT, b"\xff", b"{", b'{"loadAddress":0,"loadAddress":1}']:
                path.write_bytes(raw)
                with self.assertRaises(AddressReferenceError):
                    read_reference_map(path)
            path.write_bytes(b"[" * 2000 + b"]" * 2000)
            with self.assertRaises(AddressReferenceError):
                inspect_references(bytes(2), read_reference_map(path))
            path.write_text('{"loadAddress":0,"references":[]}')
            real_close = os.close
            with patch("tools.address_references.os.close", wraps=real_close) as close:
                self.assertEqual(read_reference_map(path)["loadAddress"], 0)
                self.assertEqual(close.call_count, 1)
            if hasattr(os, "mkfifo"):
                fifo = Path(temporary) / "fifo"
                os.mkfifo(fifo)
                with patch("tools.address_references.os.close", wraps=real_close) as close:
                    with self.assertRaisesRegex(AddressReferenceError, "regular"):
                        read_reference_map(fifo)
                    self.assertEqual(close.call_count, 1)
            with self.assertRaisesRegex(AddressReferenceError, "regular"):
                read_reference_map(Path(temporary))

    def test_cli_atomic_diagnostics_and_read_only_inputs(self):
        data, _ = read_bits(ROOT / "boot/boot.bits")
        mapping = read_reference_map(ROOT / "boot/references.json")
        with tempfile.TemporaryDirectory() as temporary:
            binary, reference = Path(temporary) / "boot.bin", Path(temporary) / "refs.json"
            binary.write_bytes(data)
            reference.write_text(json.dumps(mapping))
            command = [str(ROOT / "tools/bitinspect"), str(binary), "--references", str(reference)]
            result = subprocess.run(command, cwd=ROOT, capture_output=True, text=True, timeout=10)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertIn("6 declared fields", result.stdout)
            mapping["references"][-1]["targetOffset"] += 1
            reference.write_text(json.dumps(mapping))
            before = reference.read_bytes()
            result = subprocess.run(command + ["--json-errors"], cwd=ROOT, capture_output=True, text=True, timeout=10)
            self.assertEqual(result.returncode, 1)
            self.assertEqual(result.stdout, "", "a later failed reference cannot print partial byte inspection")
            self.assertEqual(json.loads(result.stderr)["code"], "REFERENCE_ERROR")
            self.assertEqual(binary.read_bytes(), data)
            self.assertEqual(reference.read_bytes(), before)
            result = subprocess.run([str(ROOT / "tools/bitpack"), "--references", str(reference), str(binary), str(binary)],
                                    cwd=ROOT, capture_output=True, text=True, timeout=10)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("only valid with bitinspect", result.stderr)
            binary.write_bytes(bytes((1 << 20) + 1))
            result = subprocess.run(command + ["--json-errors"], cwd=ROOT, capture_output=True, text=True, timeout=10)
            self.assertEqual(result.returncode, 1)
            self.assertEqual(result.stdout, "")
            self.assertEqual(json.loads(result.stderr)["code"], "REFERENCE_ERROR")
            if hasattr(os, "mkfifo"):
                binary.unlink()
                os.mkfifo(binary)
                result = subprocess.run(command, cwd=ROOT, capture_output=True, text=True, timeout=10)
                self.assertEqual(result.returncode, 1)
                self.assertIn("regular", result.stderr)
