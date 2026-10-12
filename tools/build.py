#!/usr/bin/env python3
"""Package already-authored bytes; create metadata, never instructions."""
import json
from bitborn import ROOT, digest, read_bits


def build():
    manifest = json.loads((ROOT / "targets.json").read_text())
    (ROOT / "build").mkdir(exist_ok=True)
    for target in manifest:
        data, annotations = read_bits(ROOT / target["source"])
        output = ROOT / "build" / target["output"]
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_bytes(data)
        if target["source"] == "boot/boot.bits":
            (ROOT / "boot/annotations.json").write_text(json.dumps(annotations, indent=2) + "\n")
            (ROOT / "site").mkdir(exist_ok=True)
            payload = {"bytes": list(data), "annotations": annotations, "sha256": digest(data), "size": len(data),
                       "architecture": "x86 real mode / BIOS", "source": "boot/boot.bits"}
            (ROOT / "site/boot.json").write_text(json.dumps(payload, indent=2) + "\n")
        print(f"{target['source']} → build/{target['output']} ({len(data)} bytes)")


if __name__ == "__main__":
    build()
