#!/usr/bin/env python3
"""Copy real build outputs and source documentation into the portable site."""
import hashlib
import json
import re
import shutil
from pathlib import Path
from bitborn import ROOT, artifact_paths, read_bits, digest, targets, verify
from introduction_pages import build_introductions


def prepare():
    print(verify())
    readme = (ROOT / 'README.md').read_text()
    table = readme.split('## Roadmap — visible progress\n', 1)[1].split('\n## ', 1)[0]
    milestones = []
    for line in table.splitlines():
        if line.startswith('| ') and not line.startswith(('| Milestone ', '| ---')):
            _, milestone, progress, _ = line.split('|')
            milestones.append({'milestone': re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', milestone.strip()), 'progress': progress.strip()})
    updated = re.search(r'Updated \*\*(\d{4}-\d{2}-\d{2})\*\*', table)[1]
    (ROOT / 'site/progress.json').write_text(json.dumps({'updated': updated, 'milestones': milestones}, indent=2) + '\n')
    comparison = {}
    for role, slug in (('before', 'exit-code'), ('after', 'exit-code-small')):
        source = f'examples/{slug}/program.bits'
        data, annotations = read_bits(ROOT / source)
        comparison[role] = {'source': source, 'bytes': list(data), 'annotations': annotations,
                            'sha256': digest(data), 'payloadSize': len(data), 'elfSize': 120 + len(data)}
    (ROOT / 'site/optimization.json').write_text(json.dumps(comparison, indent=2) + '\n')
    encoding = {}
    for name, filename in (('mov32', 'mov32.bits'), ('mov64', 'mov64.bits')):
        source = 'docs/instruction-encoding/fixtures/' + filename
        data, _ = read_bits(ROOT / source)
        encoding[name] = {'source': source, 'bytes': list(data), 'sha256': digest(data)}
    (ROOT / 'site/encoding-presets.mjs').write_text('export const encodingExamples = ' + json.dumps(encoding, indent=2) + ';\n')
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
    for folder in ("docs", "boot", 'challenges'):
        shutil.copytree(ROOT / folder, reference / folder, dirs_exist_ok=True)
    example_folders = {'boot-sector'} | {Path(target['source']).parent.name for target in targets() if target['source'].startswith('examples/')}
    for folder in sorted(example_folders):
        shutil.copytree(ROOT / 'examples' / folder, reference / 'examples' / folder, dirs_exist_ok=True)
    shutil.copyfile(ROOT / 'examples/README.md', reference / 'examples/README.md')
    for name in ("README.md", "ROADMAP.md", "CONTRIBUTING.md", "CODE_OF_CONDUCT.md", "SECURITY.md", "CHANGELOG.md", "LICENSE", "targets.json", 'SHOWCASE.md', 'GOOD_FIRST_ISSUES.md'):
        shutil.copyfile(ROOT / name, reference / name)
    for asset in (ROOT / "assets").iterdir():
        shutil.copyfile(asset, ROOT / "site/assets" / asset.name)
    shutil.copytree(ROOT / "assets", reference / "assets", dirs_exist_ok=True)
    print(f"Localized introductions: {build_introductions(ROOT)} source-generated pages")
    print(f"Portable site: {len(checksums)} verified build artifacts, canonical sources, docs and assets")


if __name__ == "__main__":
    prepare()
