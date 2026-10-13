#!/usr/bin/env python3
"""Record real native game screens; no synthesized pixels or input timing claim."""
import hashlib
import json
import os
import struct
import subprocess
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from tools.bitborn import read_bits
from tools.build import bios_sector
from tests.qemu import Guest
from tests.bit_hunt_checks import GameOracle, WIN_PATH, check_source, check_game, quit_game


def run(*arguments):
    return subprocess.run(arguments, capture_output=True, check=True, timeout=30).stdout


def sha(data):
    return hashlib.sha256(data).hexdigest()


def main():
    directory = ROOT / "build/bit-hunt-recording"
    directory.mkdir(parents=True, exist_ok=True)
    validator = unittest.TestCase()
    captures, pixels = [], []
    actions = {0: "Initial maze, star and controls", 3: "Border collisions and unknown key ignored",
               6: "Three moves right", 7: "Interior wall blocks downward movement",
               10: "Path reaches the bottom corridor", 15: "Player reaches the star",
               16: "Right border blocks movement on the goal", 17: "Leaving the star preserves collected state",
               18: "Restart clears position, moves and win", 19: "Quit retains state with IF clear and AX=BEEF"}
    for name in ["program", "no-star"]:
        source = f"examples/bit-hunt/{name}.bits"
        data, annotations = read_bits(ROOT / source)
        check_source(validator, data, annotations)
        image_bytes = bios_sector(data)
        image = directory / f"{name}.img"
        image.write_bytes(image_bytes)
        oracle = GameOracle(name == "program")
        with Guest(image) as guest:
            check_game(validator, guest, data, oracle)
            sequence = WIN_PATH + ["d", "a", "r", "q"]
            for index in range(len(sequence) + 1):
                if index:
                    key = sequence[index - 1]
                    if key == "q":
                        quit_game(validator, guest, oracle)
                    else:
                        guest.key(key)
                        oracle.apply(key)
                screen = check_game(validator, guest, data, oracle)
                if index not in actions:
                    continue
                frame_index = len(captures)
                ppm = directory / f"{frame_index:04d}.ppm"
                guest.screenshot(ppm)
                probe = json.loads(run("ffprobe", "-v", "error", "-show_streams", "-of", "json", str(ppm)))
                dimensions = [probe["streams"][0]["width"], probe["streams"][0]["height"]]
                assert dimensions == [720, 400], "The text-cell crop assumes the observed QEMU mode-3 geometry"
                frame = directory / f"{frame_index:04d}.png"
                run("ffmpeg", "-v", "error", "-y", "-i", str(ppm), "-vf",
                    "crop=216:144:270:48,scale=648:432:flags=neighbor", "-frames:v", "1", str(frame))
                rgb = run("ffmpeg", "-v", "error", "-i", str(frame), "-f", "rawvideo", "-pix_fmt", "rgb24", "-")
                assert len(rgb) == 648 * 432 * 3
                pixels.append(rgb)
                state = guest.memory(0x2000, 8)
                actual_position, moves, spare, won, spare2, events = struct.unpack("<HBBBBH", state)
                captures.append({"case": name, "source": source, "action": actions[index],
                                 "keys": sequence[:index], "keyCount": index,
                                 "stateBytes": list(state), "position": actual_position, "moves": moves,
                                 "won": bool(won), "events": events, "status": screen[1828:1850:2].decode(),
                                 "vgaSha256": sha(screen), "sourceRamSha256": sha(guest.memory(0x7C00, len(data))),
                                 "dimensions": dimensions, "ppmSha256": sha(ppm.read_bytes()),
                                 "frameSha256": sha(frame.read_bytes()), "rgbSha256": sha(rgb)})
                if index == 15:
                    full = ROOT / f"assets/bit-hunt-{name}.png"
                    run("ffmpeg", "-v", "error", "-y", "-i", str(ppm), "-frames:v", "1", str(full))
                    captures[-1]["fullScreenshot"] = str(full.relative_to(ROOT))
                    captures[-1]["fullScreenshotSha256"] = sha(full.read_bytes())
        assert image.read_bytes() == image_bytes
    gif = ROOT / "assets/bit-hunt-demo.gif"
    run("ffmpeg", "-v", "error", "-y", "-framerate", "1", "-i", str(directory / "%04d.png"),
        "-frames:v", str(len(captures)), "-filter_complex", "split[a][b];[a]palettegen[p];[b][p]paletteuse",
        "-gifflags", "0", "-loop", "0", str(gif))
    probe = json.loads(run("ffprobe", "-v", "error", "-show_entries", "stream=nb_frames:format=duration", "-of", "json", str(gif)))
    assert int(probe["streams"][0]["nb_frames"]) == len(captures)
    decoded = run("ffmpeg", "-v", "error", "-i", str(gif), "-fps_mode", "passthrough", "-f", "rawvideo", "-pix_fmt", "rgb24", "-")
    assert decoded == b"".join(pixels), "Every GIF pixel must equal an actual cropped native capture"
    inputs = ["tools/record_bit_hunt.py", "tools/build.py", "tests/qemu.py", "tests/bit_hunt_checks.py",
              "examples/bit-hunt/program.bits", "examples/bit-hunt/no-star.bits"]
    record = {"kind": "Actual QEMU BIOS text-game screens from two separate curated boots with real keyboard input; not browser emulation, native timing or physical hardware proof",
              "qemu": run(os.environ.get("QEMU", "qemu-system-i386"), "--version").decode().splitlines()[0],
              "alterations": "Crop the observed 720x400 native screen to 216x144 at 270,48; nearest-neighbor scale to 648x432; pixel-exact GIF palette encoding; no overlays or synthetic pixels",
              "crop": [270, 48, 216, 144], "encodedDimensions": [648, 432], "presentationSecondsPerFrame": 1,
              "controls": {"no-star": {"changedByte": 155, "mask": 16, "effect": "Colon predicate prevents star collection on the identical route"}},
              "sourceSha256": {source: sha((ROOT / source).read_bytes()) for source in inputs},
              "programs": {name: {"payloadSize": len(read_bits(ROOT / f'examples/bit-hunt/{name}.bits')[0]),
                                   "payloadSha256": sha(read_bits(ROOT / f'examples/bit-hunt/{name}.bits')[0]),
                                   "imageSha256": sha((directory / f'{name}.img').read_bytes())} for name in ["program", "no-star"]},
              "captures": captures, "gif": str(gif.relative_to(ROOT)), "gifSha256": sha(gif.read_bytes()),
              "encodedFrames": len(captures), "durationSeconds": float(probe["format"]["duration"]),
              "reproduce": "python3 tools/record_bit_hunt.py"}
    (ROOT / "assets/bit-hunt-recording.json").write_text(json.dumps(record, indent=2) + "\n")
    print("Recorded twenty actual native game frames from two boots: collisions, route, one-bit victory control, sticky win, reset and quit; all GIF pixels match captured frames.")


if __name__ == "__main__":
    main()
