#!/usr/bin/env python3
"""Copy real build outputs and source documentation into the portable site."""
import hashlib
import json
import shutil
from bitborn import ROOT, artifact_paths


def prepare():
    readme = (ROOT / 'README.md').read_text()
    table = readme.split('## Roadmap — visible progress\n', 1)[1].split('\n## ', 1)[0]
    milestones = []
    for line in table.splitlines():
        if line.startswith('| ') and not line.startswith(('| Milestone ', '| ---')):
            _, milestone, progress, _ = line.split('|')
            milestones.append({'milestone': milestone.strip(), 'progress': progress.strip()})
    (ROOT / 'site/progress.json').write_text(json.dumps({'updated': '2026-10-12', 'milestones': milestones}, indent=2) + '\n')
    downloads = ROOT / "site/downloads"
    downloads.mkdir(parents=True, exist_ok=True)
    checksums = []
    reviewed = artifact_paths()
    for path in downloads.rglob('*'):
        if path.is_file() and path.suffix in {'.img', '.bin', '.elf'} and path.relative_to(downloads) not in reviewed:
            path.unlink()
    for relative in reviewed:
        binary = ROOT / 'build' / relative
        destination = downloads / relative
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(binary, destination)
        checksums.append(f"{hashlib.sha256(binary.read_bytes()).hexdigest()}  {relative.as_posix()}")
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
