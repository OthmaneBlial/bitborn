#!/usr/bin/env python3
"""Derive per-byte explanations from canonical annotations, never generate code."""
from bitborn import ROOT, read_bits, targets


def generate():
    folders = {ROOT / 'examples/boot-sector'} | { (ROOT / target['source']).parent for target in targets() if target['source'].startswith('examples/') }
    for folder in sorted(folders):
        source = ROOT / "boot/boot.bits" if folder.name == "boot-sector" else folder / "program.bits"
        data, annotations = read_bits(source)
        lines = ["# Every byte explained", "", "Generated from canonical `.bits` annotations by `python3 tools/byte_tables.py`.", "",
                 "Instruction names below are disassembly for explanation, never code-generation input.", "",
                 "| Offset | Binary | Hex | Range / byte within it | Encoding explanation |", "| --- | --- | --- | --- | --- |"]
        for item in annotations:
            for index in range(item["size"]):
                offset = item["offset"] + index
                lines.append(f"| {offset} | `{data[offset]:08b}` | `{data[offset]:02X}` | {item['kind']}: {item['mnemonic']}, byte {index+1}/{item['size']} | {item['explanation']} |")
        (folder / "bytes.md").write_text("\n".join(lines) + "\n")
    print(f"Generated {len(folders)} complete byte tables directly from canonical source annotations")


if __name__ == "__main__":
    generate()
