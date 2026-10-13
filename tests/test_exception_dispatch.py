"""Curated native same-ring exception frames; no imported host execution."""
import tempfile
import unittest
import json
import struct
import re
from pathlib import Path
from tools.bitborn import ROOT, read_bits, digest
from tools.build import bios_sector
from tests.qemu import Guest
from tests.exception_dispatch_checks import CASES, check_source, check_snapshot, capture_guest


class ExceptionDispatchTests(unittest.TestCase):
    def test_actual_capture_provenance_and_snapshot_replay(self):
        record = json.loads((ROOT / "assets/exception-dispatch-recording.json").read_text())
        self.assertEqual(len(record["captures"]), 4)
        self.assertIn("not an instruction trace", record["kind"])
        for source, expected in record["sourceSha256"].items():
            self.assertEqual(digest((ROOT / source).read_bytes()), expected, source)
        loader, _ = read_bits(ROOT / "boot/loader.bits")
        for capture in record["captures"]:
            name = Path(capture["source"]).stem
            data, annotations = read_bits(ROOT / capture["source"])
            image = bios_sector(loader) + data + bytes(1024 - len(data))
            self.assertEqual(capture["payloadSize"], len(data))
            self.assertEqual(capture["payloadSha256"], digest(data))
            self.assertEqual(capture["imageSize"], len(image))
            self.assertEqual(capture["imageSha256"], digest(image))
            assets = {}
            for label, item in capture["assets"].items():
                value = (ROOT / item["file"]).read_bytes()
                self.assertEqual(len(value), item["size"])
                self.assertEqual(digest(value), item["sha256"])
                assets[label] = value
            snapshot = capture["snapshot"]
            for key, value in snapshot["registers"].items():
                self.assertEqual(value, int(re.search(rf"(?:^|\s){key}=([0-9a-fA-F]+)", assets["registers.txt"].decode())[1], 16))
            check_snapshot(self, name, data, assets["registers.txt"].decode(), assets["log.bin"],
                           assets["stack.bin"], assets["ram.bin"], bytes(snapshot["stackGuards"]))
            keys = ["vector", "error", "savedEIP", "savedCS", "savedFlags", "entryESP", "returnEIP"]
            self.assertEqual(snapshot["records"], [dict(zip(keys, struct.unpack_from("<7I", assets["log.bin"], i * 28)))
                                                 for i in range(snapshot["count"])])
            self.assertEqual((snapshot["count"], snapshot["stopStatus"]), struct.unpack_from("<II", assets["log.bin"], 128))
            self.assertEqual(snapshot["normalizedFrame"], list(struct.unpack_from("<5I", assets["stack.bin"], 32)))
            self.assertEqual(snapshot["pushadContext"], list(struct.unpack_from("<8I", assets["stack.bin"])))
            rows = []
            for line in assets["disassembly.txt"].decode().splitlines():
                if line.lstrip().startswith("-"):
                    rows[-1][1] += bytes.fromhex(line.strip()[1:])
                else:
                    offset, encoded = line.split()[:2]
                    rows.append([int(offset, 16), bytes.fromhex(encoded)])
            expected = [item for item in annotations if item["kind"] == "instruction"]
            self.assertEqual(len(rows), len(expected))
            for (offset, encoded), annotation in zip(rows, expected):
                self.assertEqual(offset, annotation["offset"])
                self.assertEqual(encoded, data[offset:offset + annotation["size"]])

    def test_literal_layout_gates_stubs_controls_and_independent_boundaries(self):
        base, _ = read_bits(ROOT / "examples/exception-dispatch/program.bits")
        for name in CASES:
            data, annotations = read_bits(ROOT / f"examples/exception-dispatch/{name}.bits")
            check_source(self, data, annotations)
            if name != "program":
                expected = {"divisor-one": (135, 1), "stop-divide": (548, 128), "retry-divide": (548, 2)}[name]
                self.assertEqual([(i, a ^ b) for i, (a, b) in enumerate(zip(base, data)) if a != b], [expected])

    def test_four_curated_native_sequences_and_retained_frames(self):
        loader, _ = read_bits(ROOT / "boot/loader.bits")
        with tempfile.TemporaryDirectory(prefix="bitborn-dispatch-native-") as temporary:
            for name in CASES:
                with self.subTest(case=name):
                    data, _ = read_bits(ROOT / f"examples/exception-dispatch/{name}.bits")
                    image = Path(temporary) / (name + ".img")
                    image.write_bytes(bios_sector(loader) + data + bytes(1024 - len(data)))
                    with Guest(image) as guest:
                        capture_guest(self, guest, data, name)


if __name__ == "__main__":
    unittest.main()
