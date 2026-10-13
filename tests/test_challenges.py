"""Boot only curated reviewed solutions; browser edits never run on the host."""
import json
import re
import shutil
import subprocess
import tempfile
import time
import unittest
from pathlib import Path

from tools.bitborn import ROOT, digest, read_bits
from tools.build import bios_sector
from tools.build_challenges import build_challenges
from tests.qemu import Guest


class ChallengeTests(unittest.TestCase):
    def test_packaging_is_reproducible_and_reviewed(self):
        first = build_challenges()
        self.assertEqual(len(first), 22)
        self.assertEqual(first, build_challenges())
        reviewed = json.loads((ROOT / "challenges/targets.json").read_text())
        self.assertEqual(len(reviewed), 46)
        for target in reviewed:
            with self.subTest(source=target["source"]):
                data, annotations = read_bits(ROOT / target["source"])
                self.assertEqual(len(data), target["size"])
                self.assertEqual(digest(data), target["sha256"])
                self.assertTrue(all(annotation["explanation"] for annotation in annotations))
        boot, _ = read_bits(ROOT / "boot/boot.bits")
        solution, _ = read_bits(ROOT / "challenges/repair-boot/solution.bits")
        self.assertEqual(boot, solution)

    def test_optimization_packaging_and_independent_boundaries(self):
        catalog = build_challenges()
        for challenge in catalog:
            if not challenge.get("optimization"):
                continue
            for source in [challenge["source"], challenge["solution"]] + [item["source"] for item in challenge["alternatives"]]:
                data, annotations = read_bits(ROOT / source)
                with tempfile.TemporaryDirectory(prefix="bitborn-optimization-golden-") as temporary:
                    path = Path(temporary) / "payload.bin"
                    path.write_bytes(data)
                    lines = subprocess.check_output(["ndisasm", "-b", "16", str(path)], text=True).splitlines()
                self.assertEqual(len(lines), len(annotations))
                for line, annotation in zip(lines, annotations):
                    offset, encoded = line.split()[:2]
                    self.assertEqual(int(offset, 16), annotation["offset"])
                    self.assertEqual(bytes.fromhex(encoded), data[annotation["offset"]:annotation["offset"] + annotation["size"]])
        with tempfile.TemporaryDirectory(prefix="bitborn-optimization-rules-") as temporary:
            root = Path(temporary)
            shutil.copytree(ROOT / "challenges", root / "challenges")
            original = json.loads((root / "challenges/catalog.json").read_text())
            for mutation in [
                {"optimization": {"editableFrom": 7, "maxBytes": 14}},
                {"optimization": {"editableFrom": 8, "maxBytes": 12}},
                {"optimization": {"editableFrom": 7, "maxBytes": True}},
                {"alternatives": ["challenges/clear-smaller/solution.bits"]},
                {"alternatives": ["../boot/boot.bits"]},
            ]:
                with self.subTest(mutation=mutation):
                    catalog = json.loads(json.dumps(original))
                    next(item for item in catalog if item["id"] == "clear-smaller").update(mutation)
                    (root / "challenges/catalog.json").write_text(json.dumps(catalog))
                    with self.assertRaises(ValueError):
                        build_challenges(root)

    def test_all_curated_solutions_on_real_qemu(self):
        catalog = build_challenges()
        cases = []
        for challenge in catalog:
            sources = [challenge["solution"]] + [item["source"] for item in challenge.get("alternatives", [])]
            if challenge.get("optimization"):
                sources.append(challenge["source"])
            cases.extend((challenge, source) for source in sources)
        loader, _ = read_bits(ROOT / "boot/loader.bits")
        with tempfile.TemporaryDirectory(prefix="bitborn-challenge-proof-") as temporary:
            for challenge, source in cases:
                with self.subTest(challenge=challenge["id"], source=source):
                    data, _ = read_bits(ROOT / source)
                    if challenge["id"] == "repair-boot":
                        image = data
                    else:
                        image = bios_sector(loader) + data + bytes(1024-len(data))
                    path = Path(temporary) / (challenge["id"] + ".img")
                    path.write_bytes(image)
                    with Guest(path) as guest:
                        deadline = time.monotonic() + 15
                        while True:
                            registers = guest.hmp("info registers")
                            ip = re.search(r"EIP=([0-9a-fA-F]+)", registers)
                            if "HLT=1" in registers and ip and challenge["loadAddress"] <= int(ip[1],16) <= challenge["loadAddress"] + len(data):
                                break
                            guest.alive(deadline)
                            time.sleep(0.02)
                        for name, expected in challenge["goals"].get("registers", {}).items():
                            pattern = rf"(?:^|\s)E{name}=([0-9a-fA-F]+)" if name not in ("CS", "DS", "ES", "SS") else rf"(?:^|\s){name}\s*=([0-9a-fA-F]+)"
                            match = re.search(pattern, registers)
                            self.assertIsNotNone(match, registers)
                            self.assertEqual(int(match[1],16) & 0xFFFF, expected, name)
                        flags = re.search(r"EFL=([0-9a-fA-F]+)", registers)
                        for name, expected in challenge["goals"].get("flags", {}).items():
                            position = {"cf":0,"pf":2,"af":4,"zf":6,"sf":7,"df":10,"of":11}[name]
                            self.assertEqual(bool(int(flags[1],16) & (1 << position)), expected, name)
                        for memory in challenge["goals"].get("memory", []):
                            self.assertEqual(guest.memory(memory["address"], len(memory["bytes"])), bytes(memory["bytes"]))
                        if "serial" in challenge["goals"]:
                            self.assertEqual(guest.output(), challenge["goals"]["serial"].encode("ascii"))
                        if "output" in challenge["goals"]:
                            screen = guest.memory(0xB8000, 80*25*2)[::2]
                            for row, line in enumerate(challenge["goals"]["output"].splitlines()):
                                self.assertEqual(screen[row*80:row*80+len(line)], line.encode("ascii"))
                        if challenge.get("optimization"):
                            self.assertFalse(int(flags[1], 16) & (1 << 9), "CLI keeps the native halt stopped")
                            self.assertEqual(guest.memory(0x7E00, len(data)), data, "instruction RAM is unchanged")
                            if source == "challenges/transfer-smaller/alternative.bits":
                                self.assertEqual(guest.memory(0x7BFE, 2), b"\x2a\x00", "balanced PUSH/POP leaves its documented stack-RAM effect")


if __name__ == "__main__":
    unittest.main()
