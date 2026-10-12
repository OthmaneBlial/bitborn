#!/usr/bin/env python3
"""Capture native QEMU screens and verified guest actions; never composite output."""
import json
import os
import re
import struct
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from tests.qemu import Guest
from tools.bitborn import read_bits, digest
from tools.build import bios_sector

FPS = 10


def source(path):
    data, _ = read_bits(ROOT / path)
    return data, {"source": path, "size": len(data), "literal_bytes_sha256": digest(data),
                  "source_file_sha256": digest((ROOT / path).read_bytes())}


def capture(guest, directory, frames, started, action=None):
    time.sleep(max(0, started + len(frames) / FPS - time.monotonic()))
    path = directory / f"{len(frames):04}.ppm"
    guest.screenshot(path)
    frame = {"file": str(path.relative_to(ROOT)), "sha256": digest(path.read_bytes()),
             "captured_at_seconds": round(time.monotonic() - started, 4)}
    if action:
        frame["action"] = action
    frames.append(frame)


def encode(name, directory, frames):
    assert frames, "A recording needs actual QEMU screendumps."
    # Probe every input frame before encoding: VGA changes from 640x480 to 720x400 during boot.
    dimensions = set()
    for frame in frames:
        probe = json.loads(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries",
            "stream=width,height", "-of", "json", str(ROOT / frame["file"])], text=True))
        stream = probe["streams"][0]
        dimensions.add((stream["width"], stream["height"]))
    assert dimensions.issubset({(640, 480), (720, 400)}), f"Unexpected native VGA modes: {dimensions}"
    assets = ROOT / "assets"
    gif, png = assets / f"{name}-demo.gif", assets / f"{name}-demo.png"
    normalized = directory / "normalized"
    normalized.mkdir(exist_ok=True)
    # Normalize before the buffered palette pass so BIOS resolution changes cannot drop earlier frames.
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-framerate", str(FPS), "-i", str(directory / "%04d.ppm"),
        "-frames:v", str(len(frames)), "-vf", "scale=720:400:flags=neighbor", "-fps_mode", "passthrough",
        "-start_number", "0", str(normalized / "%04d.png")], check=True)
    assert all((normalized / f"{index:04}.png").exists() for index in range(len(frames)))
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-framerate", str(FPS), "-i", str(normalized / "%04d.png"),
        "-frames:v", str(len(frames)), "-filter_complex",
        "split[a][b];[a]palettegen[p];[b][p]paletteuse", "-loop", "0", str(gif)], check=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(ROOT / frames[-1]["file"]), "-frames:v", "1", str(png)], check=True)
    probe = json.loads(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries",
        "stream=width,height,nb_frames:format=duration", "-of", "json", str(gif)], text=True))
    stream = probe["streams"][0]
    assert int(stream["nb_frames"]) == len(frames), "Encoded frame count must match captured frames."
    assert (stream["width"], stream["height"]) == (720, 400)
    duration = float(probe["format"]["duration"])
    assert abs(duration - len(frames) / FPS) < 0.05, "GIF timing must match the recorded presentation rate."
    final_pixels = subprocess.check_output(["ffmpeg", "-v", "error", "-i", str(ROOT / frames[-1]["file"]),
        "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"])
    png_pixels = subprocess.check_output(["ffmpeg", "-v", "error", "-i", str(png),
        "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"])
    gif_pixels = subprocess.check_output(["ffmpeg", "-v", "error", "-i", str(gif),
        "-vf", f"select='eq(n,{len(frames)-1})'", "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"])
    assert final_pixels == png_pixels == gif_pixels, "Final PNG and GIF pixels must match the real guest screen exactly."
    return {"gif": str(gif.relative_to(ROOT)), "gif_sha256": digest(gif.read_bytes()),
            "png": str(png.relative_to(ROOT)), "png_sha256": digest(png.read_bytes()),
            "captured_frames": len(frames), "encoded_frames": int(stream["nb_frames"]),
            "duration_seconds": duration, "capture_elapsed_seconds": frames[-1]["captured_at_seconds"],
            "fps": FPS, "output_dimensions": [720, 400],
            "native_frame_dimensions": [list(size) for size in sorted(dimensions)],
            "final_png_and_gif_pixels_match_native_frame": True, "frames": frames}


def record_protected_mode(image, payload):
    directory = ROOT / "build/system-recording/protected-mode"
    directory.mkdir(parents=True, exist_ok=True)
    frames, started = [], time.monotonic()
    with Guest(image, paused=True) as guest:
        take = lambda action=None: capture(guest, directory, frames, started, action)
        take("QEMU paused before BIOS execution.")
        guest.command("cont")
        for frame in range(30):
            take("Resumed the real BIOS boot and protected-mode stage." if frame == 0 else None)
        registers = guest.hmp("info registers")
        assert "EIP=00007e93" in registers and "HLT=1" in registers
        cr0 = int(re.search(r"CR0=([0-9a-f]+)", registers).group(1), 16)
        assert cr0 & 1 and not cr0 & 0x80000000
        assert re.search(r"CS\s*=0008 .*CS32", registers)
        assert "ECX=4b4f4d50" in registers and "ESP=00009000" in registers
        assert guest.memory(0x9000, 8) == b"\x44\x33\x22\x11\xde\xc0\xde\xc0"
        assert guest.memory(0xB8000, 4) == b"P\x0aM\x0a"
        assert guest.memory(0x7E00, 256) == payload[:256]
        assert guest.output() == b"", "This target does not claim serial output."
        probes = {"CR0": f"{cr0:08X}", "CS": "0008 / CS32", "ECX": "4B4F4D50 / PMOK", "ESP": "00009000",
                  "EIP": "00007E93", "HLT": True, "RAM_9000": guest.memory(0x9000, 8).hex().upper(),
                  "VGA_B8000": guest.memory(0xB8000, 4).hex().upper(),
                  "literal_instruction_bytes_loaded": True, "serial_text": ""}
    result = encode("protected-mode", directory, frames)
    result.update({"name": "protected-mode", "image_sha256": digest(image.read_bytes()),
                   "key_actions": [], "native_probes": probes})
    return result


def record_shell(image, shell, app):
    directory = ROOT / "build/system-recording/shell"
    directory.mkdir(parents=True, exist_ok=True)
    frames, actions, started = [], [], time.monotonic()
    with Guest(image, paused=True) as guest:
        take = lambda action=None: capture(guest, directory, frames, started, action)
        take("QEMU paused before BIOS execution.")
        guest.command("cont")
        for frame in range(10):
            take("Resumed the real BIOS boot and shell stage." if frame == 0 else None)
        expected = b"bitborn shell\r\n> "
        assert guest.wait_for(lambda data: data.endswith(b"> ")) == expected
        assert guest.memory(0x7E00, len(shell)) == shell
        take("The native shell reached its prompt; loaded bytes match the canonical source.")
        register_sample = None
        for command in ["write", "read", "dump", "regs", "run"]:
            first_frame = len(frames)
            for char in command:
                before = len(guest.output())
                guest.key(char)
                guest.wait_for(lambda data: len(data) > before)
                assert guest.output()[before:] == char.encode("ascii"), "Typed keys must be echoed by the guest."
                take(f"Sent real QEMU key {char} for the {command} command.")
            before = len(guest.output())
            guest.key("ret")
            actual = guest.wait_for(lambda data: len(data) > before and data.endswith(b"> "))[before:]
            if command == "regs":
                register_sample = struct.unpack("<13H", guest.memory(0x0500, 26))
                assert register_sample[4] == 0x7C00 and register_sample[8:12] == (0, 0, 0, 0)
                response = b"\r\nAX BX CX DX SP BP SI DI CS DS ES SS FL\r\n" + (
                    " ".join(f"{word:04X}" for word in register_sample) + " \r\n> ").encode("ascii")
            else:
                response = {"write": b"\r\nRAM[0600]=2A\r\n> ", "read": b"\r\n0600: 2A\r\n> ",
                    "dump": b"\r\n0600: 2A " + b"00 " * 15 + b"\r\n> ",
                    "run": b"\r\nDISK APP: 7 x 6 = 2A hex; RAM[0601]=2A\r\n> "}[command]
            assert actual == response, f"Unexpected native response to {command}: {actual!r}"
            expected += command.encode("ascii") + response
            assert guest.output() == expected, "The complete serial transcript must match actual typed actions."
            take(f"{command} executed natively and returned to the shell prompt.")
            for _ in range(7):
                take()
            actions.append({"command": command, "qcodes": list(command) + ["ret"], "first_frame": first_frame,
                            "last_frame": len(frames) - 1, "response_text": actual.decode("ascii")})
        assert guest.memory(0x0600, 16) == b"\x2a\x2a" + bytes(14)
        assert guest.memory(0x9000, 1024) == app + bytes(1024 - len(app))
        assert guest.output().endswith(b"> ")
        take("Verified computed RAM[0601]=2A, app disk-byte identity at 9000, and the returned prompt.")
        for _ in range(15):
            take()
        probes = {"RAM_0600": guest.memory(0x0600, 16).hex().upper(), "RAM_0601": "2A",
                  "app_loaded_at_9000_sha256": digest(guest.memory(0x9000, len(app))),
                  "app_loaded_from_disk_matches_literal_source": True, "returned_prompt": True,
                  "sampled_registers": dict(zip(["AX", "BX", "CX", "DX", "SP", "BP", "SI", "DI", "CS", "DS", "ES", "SS", "FLAGS"],
                                                [f"{word:04X}" for word in register_sample])),
                  "serial_text": guest.output().decode("ascii"), "serial_sha256": digest(guest.output())}
    result = encode("shell", directory, frames)
    result.update({"name": "shell", "image_sha256": digest(image.read_bytes()), "key_actions": actions, "native_probes": probes})
    return result


def record():
    loader, loader_metadata = source("boot/loader.bits")
    protected, protected_metadata = source("examples/protected-mode/program.bits")
    shell, shell_metadata = source("examples/shell/program.bits")
    app, app_metadata = source("examples/shell-app/program.bits")
    protected_image, shell_image = ROOT / "build/protected-mode.img", ROOT / "build/shell.img"
    assert protected_image.exists() and shell_image.exists(), "Run make build before recording native targets."
    assert protected_image.read_bytes() == bios_sector(loader) + protected + bytes(1024 - len(protected))
    assert shell_image.read_bytes() == bios_sector(loader) + shell + bytes(1024 - len(shell)) + app + bytes(1024 - len(app))
    (ROOT / "assets").mkdir(exist_ok=True)
    captures = [record_protected_mode(protected_image, protected), record_shell(shell_image, shell, app)]
    executable = os.environ.get("QEMU", "qemu-system-i386")
    metadata = {"kind": "Actual QEMU/TCG native guest VGA screendumps, not browser simulation",
                "qemu": subprocess.check_output([executable, "--version"], text=True).splitlines()[0],
                "ffmpeg": subprocess.check_output(["ffmpeg", "-version"], text=True).splitlines()[0],
                "recording_script_sha256": digest(Path(__file__).read_bytes()),
                "sources": [loader_metadata, protected_metadata, shell_metadata, app_metadata], "captures": captures,
                "alterations": "GIF palette encoding and nearest-neighbor 720x400 normalization of BIOS resolution changes only; PNGs are unchanged final native screens. No overlays, invented text or composited output.",
                "timing": "10 fps presentation of actual screendumps paced at 100 ms; capture timestamps record QMP/key-processing overhead. Not a performance benchmark.",
                "reproduce": "make build && python3 tools/record_system.py"}
    (ROOT / "assets/system-recording.json").write_text(json.dumps(metadata, indent=2) + "\n")
    for capture in captures:
        print(f"Recorded {capture['name']}: {capture['captured_frames']} native frames, {capture['duration_seconds']}s; GIF/PNG and guest probes verified.")


if __name__ == "__main__":
    record()
