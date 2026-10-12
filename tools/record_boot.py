#!/usr/bin/env python3
"""Record actual QEMU VGA frames, without compositing or invented boot output."""
import hashlib
import json
import shutil
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from tests.qemu import Guest
from tests.test_boot import EXPECTED


def record():
    directory = ROOT / "build/recording"
    directory.mkdir(parents=True, exist_ok=True)
    assets = ROOT / "assets"
    assets.mkdir(exist_ok=True)
    with Guest(ROOT / "build/boot.img", paused=True) as guest:
        guest.screenshot(directory / "0000.ppm")
        guest.command("cont")
        for frame in range(1, 41):
            time.sleep(0.1)
            guest.screenshot(directory / f"{frame:04}.ppm")
        assert guest.output() == EXPECTED, "recording must contain the actual verified guest output"
        guest.screenshot(directory / "final.ppm")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(directory / "final.ppm"), "-frames:v", "1",
                    str(assets / "boot.png")], check=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-framerate", "10", "-i", str(directory / "%04d.ppm"),
                    "-filter_complex", "split[a][b];[a]palettegen[p];[b][p]paletteuse", "-loop", "0",
                    str(assets / "boot.gif")], check=True)
    probe = json.loads(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "stream=nb_frames:format=duration",
                                                "-of", "json", str(assets / "boot.gif")], text=True))
    metadata = {"kind": "actual QEMU VGA screendump sequence", "captured_frames": 41,
                "encoded_frames": int(probe["streams"][0]["nb_frames"]), "duration_seconds": float(probe["format"]["duration"]), "fps": 10,
                "source": "boot/boot.bits", "boot_sha256": hashlib.sha256((ROOT / "build/boot.img").read_bytes()).hexdigest(),
                "qemu": subprocess.check_output(["qemu-system-i386", "--version"], text=True).splitlines()[0],
                "reproduce": "make build && python3 tools/record_boot.py", "alterations": "palette encoding only; no overlays or invented output"}
    (assets / "boot-recording.json").write_text(json.dumps(metadata, indent=2) + "\n")
    (ROOT / "site/assets").mkdir(parents=True, exist_ok=True)
    for name in ("boot.png", "boot.gif", "boot-recording.json"):
        shutil.copyfile(assets / name, ROOT / "site/assets" / name)
    print("Recorded 41 actual VGA frames → assets/boot.gif and assets/boot.png")


if __name__ == "__main__":
    record()
