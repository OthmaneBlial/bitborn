#!/usr/bin/env python3
"""Host-side byte packaging. This module never assembles target instructions."""
import argparse
import hashlib
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def target_output_paths(target):
    output = Path(target['output'])
    paths = {output}
    if target.get('environment') == 'linux-x86_64':
        executable = output.with_suffix('.elf')
        if executable == output:
            raise ValueError('ELF packaging needs a distinct raw output path')
        paths.add(executable)
    if target.get('bootable') or target.get('loader'):
        image = output.with_suffix('.img')
        if image == output and not target.get('bios'):
            raise ValueError('BIOS framing needs a distinct raw output path')
        paths.add(image)
    return paths


def targets(root=ROOT):
    manifest = json.loads((root / 'targets.json').read_text())
    for relative in ('challenges/targets.json', 'examples/shell/targets.json'):
        extra = root / relative
        if extra.exists():
            manifest += json.loads(extra.read_text())
    sources, outputs = [target['source'] for target in manifest], [target['output'] for target in manifest]
    if len(set(sources)) != len(sources) or len(set(outputs)) != len(outputs):
        raise ValueError('Reviewed targets must have unique sources and outputs')
    for name in sources + outputs:
        if Path(name).is_absolute() or '..' in Path(name).parts:
            raise ValueError('Reviewed target paths must stay inside the project')
    emitted = set()
    for target in manifest:
        paths = target_output_paths(target)
        if emitted & paths:
            raise ValueError('Reviewed targets have colliding raw or packaged output paths')
        emitted |= paths
    return manifest


def artifact_paths(root=ROOT):
    """Only reviewed target outputs belong in public downloads or releases."""
    paths = set()
    for target in targets(root):
        if target['source'] == 'boot/loader.bits':
            continue
        paths |= target_output_paths(target)
    return sorted(paths)


def read_bits(path):
    data = bytearray()
    annotations = []
    for number, line in enumerate(Path(path).read_text(encoding="utf-8").splitlines(), 1):
        source, _, comment = line.partition("#")
        tokens = source.split()
        if not tokens:
            continue
        for token in tokens:
            if not re.fullmatch(r"[01]{8}", token):
                raise ValueError(f"{path}:{number}: expected eight binary digits, got {token!r}")
        parts = [part.strip() for part in comment.split("|")]
        annotated = len(parts) == 3 and parts[0] in {"instruction", "data", "padding", "signature"}
        annotations.append({"offset": len(data), "size": len(tokens), "kind": parts[0] if annotated else "data",
                            "mnemonic": parts[1] if annotated else "unannotated bytes",
                            "explanation": parts[2] if annotated else "", "bits": " ".join(tokens)})
        data.extend(int(token, 2) for token in tokens)
    if not data:
        raise ValueError(f"{path}: no bytes")
    return bytes(data), annotations


def digest(data):
    return hashlib.sha256(data).hexdigest()


def inspect(data, annotations=()):
    starts = {item["offset"]: item for item in annotations}
    rows = []
    for offset, byte in enumerate(data):
        item = starts.get(offset)
        note = f"  [{item['kind']}, {item['size']} bytes] {item['mnemonic']}: {item['explanation']}" if item else ""
        rows.append(f"{offset:04x}  {byte:08b}  {byte:02x}{note}")
    return "\n".join(rows)


def bitdiff(before, after):
    rows = []
    for offset in range(max(len(before), len(after))):
        a = before[offset] if offset < len(before) else None
        b = after[offset] if offset < len(after) else None
        if a != b:
            left = f"{a:08b}" if a is not None else "--------"
            right = f"{b:08b}" if b is not None else "--------"
            mask = "".join("^" if x != y else "." for x, y in zip(left, right))
            rows.append(f"{offset:04x}  {left} -> {right}  {mask}")
    return "\n".join(rows) or "identical"


def verify(root=ROOT):
    if __package__:
        from .build import package_target
    else:
        from build import package_target
    manifest = targets(root)
    failures = []
    for target in manifest:
        source = root / target["source"]
        data, annotations = read_bits(source)
        if len(data) != target["size"]:
            failures.append(f"{source}: {len(data)} bytes, expected {target['size']}")
        if digest(data) != target["sha256"]:
            failures.append(f"{source}: SHA-256 differs from reviewed targets.json")
        if target.get("bios") and data[510:512] != b"\x55\xaa":
            failures.append(f"{source}: missing BIOS signature")
        if any(not a["explanation"] or a["kind"] not in {"instruction", "data", "padding", "signature"} for a in annotations):
            failures.append(f"{source}: every byte range needs a valid explanation")
        if read_bits(source)[0] != data:
            failures.append(f"{source}: non-reproducible packing")
        for path, expected in package_target(target, data, root, manifest).items():
            binary = root / 'build' / path
            if not binary.exists() or binary.read_bytes() != expected:
                failures.append(f"{binary}: missing or different packaged artifact; run make build")
    allowed = {".bits", ".json", ".md"}
    for directory in (root / "boot", root / "examples", root / 'challenges'):
        failures.extend(f"unauthorized target file: {p}" for p in directory.rglob("*") if p.is_file() and p.suffix.lower() not in allowed)
    if failures:
        raise ValueError("\n".join(failures))
    return f"verified {len(manifest)} handwritten targets: sizes, signatures, annotations, hashes and every packed artifact"


def main(command=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("args", nargs="*")
    parser.add_argument("--annotations", type=Path)
    parser.add_argument("--size", type=int)
    parser.add_argument("--sha256")
    parser.add_argument("--bios", action="store_true")
    parsed = parser.parse_args()
    args = parsed.args
    try:
        if command == "bitpack" and len(args) == 2:
            data, _ = read_bits(args[0])
            source, output = Path(args[0]), Path(args[1])
            if source.resolve() == output.resolve() or output.exists() and source.samefile(output):
                raise ValueError('cannot overwrite the literal input source; choose a different output file')
            output.write_bytes(data)
            print(f"{len(data)} bytes → {args[1]} · sha256 {digest(data)}")
        elif command == "bitinspect" and len(args) == 1:
            annotations = json.loads(parsed.annotations.read_text()) if parsed.annotations else []
            print(inspect(Path(args[0]).read_bytes(), annotations))
        elif command == "bitdiff" and len(args) == 2:
            print(bitdiff(Path(args[0]).read_bytes(), Path(args[1]).read_bytes()))
        elif command == "bitverify" and not args:
            print(verify())
        elif command == "bitverify" and len(args) == 1:
            data = Path(args[0]).read_bytes()
            if parsed.size is not None and len(data) != parsed.size:
                raise ValueError(f"expected {parsed.size} bytes, got {len(data)}")
            if parsed.bios and (len(data) < 512 or data[510:512] != b"\x55\xaa"):
                raise ValueError("missing BIOS signature at offsets 510–511")
            if parsed.sha256 and digest(data) != parsed.sha256:
                raise ValueError("SHA-256 mismatch")
            print(f"verified {len(data)} bytes · sha256 {digest(data)}")
        else:
            parser.error(f"usage: {command} " + {"bitpack": "SOURCE OUTPUT", "bitinspect": "BINARY [--annotations JSON]", "bitdiff": "BEFORE AFTER", "bitverify": "[BINARY --size N --bios --sha256 HASH]"}[command])
    except (ValueError, OSError, json.JSONDecodeError) as error:
        print(f"{command}: {error}", file=sys.stderr)
        return 1
    return 0
