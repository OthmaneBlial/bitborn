#!/usr/bin/env python3
"""Copy real build outputs and source documentation into the portable site."""
import hashlib
import shutil
from bitborn import ROOT


def prepare():
    downloads = ROOT / "site/downloads"
    downloads.mkdir(parents=True, exist_ok=True)
    checksums = []
    for binary in sorted((ROOT / "build").iterdir()):
        if binary.suffix not in {".img", ".bin", ".elf"} or binary.stem == "loader":
            continue
        shutil.copyfile(binary, downloads / binary.name)
        checksums.append(f"{hashlib.sha256(binary.read_bytes()).hexdigest()}  {binary.name}")
    (downloads / "SHA256SUMS").write_text("\n".join(checksums) + "\n")
    reference = ROOT / "site/reference"
    for folder in ("docs", "examples", "boot"):
        shutil.copytree(ROOT / folder, reference / folder, dirs_exist_ok=True)
    for name in ("README.md", "ROADMAP.md", "CONTRIBUTING.md", "CHANGELOG.md", "LICENSE", "targets.json"):
        shutil.copyfile(ROOT / name, reference / name)
    for asset in (ROOT / "assets").iterdir():
        shutil.copyfile(asset, ROOT / "site/assets" / asset.name)
    shutil.copytree(ROOT / "assets", reference / "assets", dirs_exist_ok=True)
    print(f"Portable site: {len(checksums)} verified build artifacts, canonical sources, docs and assets")


if __name__ == "__main__":
    prepare()
