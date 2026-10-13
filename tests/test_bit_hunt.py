"""Only curated literal game images receive native keyboard input."""
import tempfile
import unittest
import json
import hashlib
import subprocess
from pathlib import Path
from tools.bitborn import ROOT, read_bits
from tools.build import bios_sector
from tests.qemu import Guest
from tests.bit_hunt_checks import GameOracle, WIN_PATH, check_source, check_game, quit_game


class BitHuntTests(unittest.TestCase):
    def test_actual_capture_provenance_and_pixel_exact_gif(self):
        record = json.loads((ROOT / "assets/bit-hunt-recording.json").read_text())
        self.assertEqual(record["encodedFrames"], 20)
        self.assertEqual(len(record["captures"]), 20)
        self.assertEqual(record["encodedDimensions"], [648, 432])
        self.assertEqual(record["durationSeconds"], 20)
        for source, expected in record["sourceSha256"].items():
            self.assertEqual(hashlib.sha256((ROOT / source).read_bytes()).hexdigest(), expected, source)
        for name, item in record["programs"].items():
            data, _ = read_bits(ROOT / f"examples/bit-hunt/{name}.bits")
            self.assertEqual(item["payloadSize"], len(data))
            self.assertEqual(item["payloadSha256"], hashlib.sha256(data).hexdigest())
            self.assertEqual(item["imageSha256"], hashlib.sha256(bios_sector(data)).hexdigest())
        for capture in record["captures"]:
            oracle = GameOracle(capture["case"] == "program")
            for key in capture["keys"]:
                oracle.apply(key)
            self.assertEqual(capture["keyCount"], len(capture["keys"]))
            self.assertEqual(bytes(capture["stateBytes"]), oracle.state())
            self.assertEqual(capture["status"], oracle.status().decode())
            self.assertEqual(capture["sourceRamSha256"], record["programs"][capture["case"]]["payloadSha256"])
            if "fullScreenshot" in capture:
                self.assertEqual(hashlib.sha256((ROOT / capture["fullScreenshot"]).read_bytes()).hexdigest(), capture["fullScreenshotSha256"])
        goals = [capture for capture in record["captures"] if capture["keyCount"] == 15]
        self.assertEqual([(c["case"], c["position"], c["moves"], c["won"]) for c in goals],
                         [("program", 46, 11, True), ("no-star", 46, 11, False)])
        gif = ROOT / record["gif"]
        self.assertEqual(hashlib.sha256(gif.read_bytes()).hexdigest(), record["gifSha256"])
        decoded = subprocess.check_output(["ffmpeg", "-v", "error", "-i", str(gif), "-fps_mode", "passthrough",
                                           "-f", "rawvideo", "-pix_fmt", "rgb24", "-"])
        size = 648 * 432 * 3
        self.assertEqual(len(decoded), size * 20)
        for index, capture in enumerate(record["captures"]):
            self.assertEqual(hashlib.sha256(decoded[index * size:(index + 1) * size]).hexdigest(), capture["rgbSha256"])

    def test_literal_map_independent_boundaries_and_one_bit_goal_control(self):
        base, _ = read_bits(ROOT / "examples/bit-hunt/program.bits")
        for name in ["program", "no-star"]:
            data, annotations = read_bits(ROOT / f"examples/bit-hunt/{name}.bits")
            check_source(self, data, annotations)
            self.assertEqual(len(bios_sector(data)), 512)
            self.assertEqual(bios_sector(data)[510:], b"\x55\xaa")
            if name == "no-star":
                self.assertEqual([(i, a ^ b) for i, (a, b) in enumerate(zip(base, data)) if a != b], [(155, 16)])

    def test_native_maze_collision_win_sticky_reset_quit_and_control(self):
        with tempfile.TemporaryDirectory(prefix="bitborn-game-native-") as temporary:
            for name in ["program", "no-star"]:
                with self.subTest(case=name):
                    data, _ = read_bits(ROOT / f"examples/bit-hunt/{name}.bits")
                    image = Path(temporary) / (name + ".img")
                    image_bytes = bios_sector(data)
                    image.write_bytes(image_bytes)
                    oracle = GameOracle(name == "program")
                    with Guest(image) as guest:
                        check_game(self, guest, data, oracle)
                        for key in WIN_PATH + ["d", "s", "a", "d", "r", "z"]:
                            guest.key(key)
                            oracle.apply(key)
                            check_game(self, guest, data, oracle)
                        quit_game(self, guest, oracle)
                        check_game(self, guest, data, oracle)
                    self.assertEqual(image.read_bytes(), image_bytes, "read-only image remains unchanged")

    def test_native_move_counter_saturates_without_state_or_display_overflow(self):
        data, _ = read_bits(ROOT / "examples/bit-hunt/program.bits")
        with tempfile.TemporaryDirectory(prefix="bitborn-game-counter-") as temporary:
            image = Path(temporary) / "game.img"
            image.write_bytes(bios_sector(data))
            oracle = GameOracle()
            with Guest(image) as guest:
                check_game(self, guest, data, oracle)
                for index in range(260):
                    key = "d" if index % 2 == 0 else "a"
                    guest.key(key)
                    oracle.apply(key)
                    check_game(self, guest, data, oracle)
                self.assertEqual(oracle.moves, 255)
                self.assertEqual(oracle.events, 260)
                self.assertFalse(oracle.won)
                quit_game(self, guest, oracle)
                check_game(self, guest, data, oracle)


if __name__ == "__main__":
    unittest.main()
