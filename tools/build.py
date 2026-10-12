#!/usr/bin/env python3
"""Package already-authored bytes; create metadata, never instructions."""
import json
import struct
if __package__:
    from .bitborn import ROOT, digest, read_bits
else:
    from bitborn import ROOT, digest, read_bits


def elf64(payload):
    # One RX load segment; headers contain no target machine instructions.
    base, entry = 0x400000, 0x400078
    size = 120 + len(payload)
    ident = b"\x7fELF\x02\x01\x01" + bytes(9)
    header = ident + struct.pack("<HHIQQQIHHHHHH", 2, 62, 1, entry, 64, 0, 0, 64, 56, 1, 0, 0, 0)
    segment = struct.pack("<IIQQQQQQ", 1, 5, 0, base, base, size, size, 0x1000)
    return header + segment + payload


def build():
    manifest = json.loads((ROOT / "targets.json").read_text())
    (ROOT / "build").mkdir(exist_ok=True)
    for target in manifest:
        data, annotations = read_bits(ROOT / target["source"])
        output = ROOT / "build" / target["output"]
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_bytes(data)
        if target.get("environment") == "linux-x86_64":
            executable = output.with_suffix(".elf")
            executable.write_bytes(elf64(data))
            executable.chmod(0o755)
        if target["source"] == "boot/boot.bits":
            (ROOT / "boot/annotations.json").write_text(json.dumps(annotations, indent=2) + "\n")
            (ROOT / "site").mkdir(exist_ok=True)
            payload = {"bytes": list(data), "annotations": annotations, "sha256": digest(data), "size": len(data),
                       "architecture": "x86 real mode / BIOS", "source": "boot/boot.bits"}
            (ROOT / "site/boot.json").write_text(json.dumps(payload, indent=2) + "\n")
        print(f"{target['source']} → build/{target['output']} ({len(data)} bytes)")


if __name__ == "__main__":
    build()
