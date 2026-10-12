"""Boot only curated reviewed solutions; browser edits never run on the host."""
import json
import re
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
        self.assertEqual(len(first), 20)
        self.assertEqual(first, build_challenges())
        reviewed = json.loads((ROOT / "challenges/targets.json").read_text())
        self.assertEqual(len(reviewed), 40)
        for target in reviewed:
            with self.subTest(source=target["source"]):
                data, annotations = read_bits(ROOT / target["source"])
                self.assertEqual(len(data), target["size"])
                self.assertEqual(digest(data), target["sha256"])
                self.assertTrue(all(annotation["explanation"] for annotation in annotations))
        boot, _ = read_bits(ROOT / "boot/boot.bits")
        solution, _ = read_bits(ROOT / "challenges/repair-boot/solution.bits")
        self.assertEqual(boot, solution)

    def test_all_twenty_solutions_on_real_qemu(self):
        catalog = build_challenges()
        loader, _ = read_bits(ROOT / "boot/loader.bits")
        with tempfile.TemporaryDirectory(prefix="bitborn-challenge-proof-") as temporary:
            for challenge in catalog:
                with self.subTest(challenge=challenge["id"]):
                    data, _ = read_bits(ROOT / challenge["solution"])
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


if __name__ == "__main__":
    unittest.main()
