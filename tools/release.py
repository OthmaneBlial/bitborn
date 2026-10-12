#!/usr/bin/env python3
"""Prepare deterministic release artifacts from one clean, reviewed commit."""
import gzip
import hashlib
import io
import shutil
import subprocess
import tarfile
import json
if __package__:
    from .bitborn import ROOT, verify, artifact_paths, targets, digest
else:
    from bitborn import ROOT, verify, artifact_paths, targets, digest


def archive(entries):
    stream = io.BytesIO()
    with tarfile.open(fileobj=stream, mode="w", format=tarfile.USTAR_FORMAT) as tar:
        for name, data in sorted(entries.items()):
            info = tarfile.TarInfo(name)
            info.size = len(data)
            info.mode = 0o755 if name.endswith(".elf") else 0o644
            tar.addfile(info, io.BytesIO(data))
    return gzip.compress(stream.getvalue(), mtime=0)


def provenance(root, version, commit, destination):
    reviewed = targets(root)
    return {'schema': 1, 'version': version, 'sourceCommit': commit,
            'instructionSource': 'Literal handwritten .bits; packaging never assembles instructions.',
            'sourceFiles': {target['source']: digest((root / target['source']).read_bytes()) for target in reviewed},
            'reviewedPayloads': {target['source']: target['sha256'] for target in reviewed},
            'artifacts': {path.as_posix(): digest((root / 'build' / path).read_bytes()) for path in artifact_paths(root)},
            'releaseFiles': {path.name: digest(path.read_bytes()) for path in sorted(destination.iterdir())
                             if path.name not in {'SHA256SUMS', 'release-provenance.json'}}}


def check_staging(destination, version):
    allowed = {f'bitborn-v{version}-images.tar.gz', f'bitborn-v{version}-source.tar.gz',
               'boot.img', 'monitor.img', 'disk-read.img', 'keyboard.img', 'vga.img',
               'shell.img', 'protected-mode.img', 'shell-demo.png', 'protected-mode-demo.png',
               'system-recording.json', 'release-provenance.json', 'SHA256SUMS'}
    if destination.is_symlink():
        raise ValueError('release staging must not be a symlink')
    if destination.exists():
        for path in destination.iterdir():
            if path.name not in allowed or path.is_symlink() or not path.is_file():
                raise ValueError(f'unexpected release staging entry: {path.name}; nothing was overwritten')


def prepare():
    if subprocess.check_output(["git", "status", "--porcelain"], cwd=ROOT):
        raise ValueError("release requires a clean worktree")
    print(verify())
    version = (ROOT / "VERSION").read_text().strip()
    commit = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip()
    destination = ROOT / "build" / f"release-v{version}"
    if not destination.resolve().is_relative_to(ROOT.resolve()):
        raise ValueError('release staging must remain inside the project')
    check_staging(destination, version)
    destination.mkdir(exist_ok=True)
    files = {path.as_posix(): (ROOT / 'build' / path).read_bytes() for path in artifact_paths()}
    files["README.txt"] = (f"bitborn v{version} — Software born from raw bits.\n"
        "BIOS: qemu-system-i386 -drive file=boot.img,format=raw,if=floppy -boot a -serial stdio\n"
        "monitor.img, disk-read.img, keyboard.img, vga.img, shell.img and protected-mode.img boot the same way.\n"
        "Type in the QEMU display for keyboard and monitor input.\n"
        "Linux x86-64: exit-code/exit-code-small/arithmetic/compare-values exit42; loop-count exits5; print-text exits0.\n"
        "Raw .bin files are payloads, not standalone boot images or ELF executables.\n"
        "Challenge start.bin files intentionally contain broken puzzles; curated solution.img files are QEMU-tested.\n"
        "Shell launches its returning disk app from sectors4-5; use the complete shell.img.\n"
        "Protected mode provides one software-interrupt experiment; no paging, exception or hardware IRQ support.\n"
        "Rebuild from source: make test; make site-test. No target assembler/compiler.\n"
        "Educational experiment; no hardware, UEFI or production-OS support.\n"
        "https://othmaneblial.github.io/bitborn/\n").encode()
    (destination / f"bitborn-v{version}-images.tar.gz").write_bytes(archive(files))
    source = subprocess.check_output(["git", "archive", "--format=tar", f"--prefix=bitborn-{version}/", "HEAD"], cwd=ROOT)
    (destination / f"bitborn-v{version}-source.tar.gz").write_bytes(gzip.compress(source, mtime=0))
    for name in ("boot.img", "monitor.img", "disk-read.img", "keyboard.img", "vga.img", 'shell.img', 'protected-mode.img'):
        shutil.copyfile(ROOT / "build" / name, destination / name)
    for name in ('shell-demo.png','protected-mode-demo.png','system-recording.json'):
        shutil.copyfile(ROOT / 'assets' / name, destination / name)
    (destination / 'release-provenance.json').write_text(json.dumps(provenance(ROOT, version, commit, destination), sort_keys=True, indent=2) + '\n')
    checksums = [f"{hashlib.sha256(path.read_bytes()).hexdigest()}  {path.name}" for path in sorted(destination.iterdir()) if path.name != "SHA256SUMS"]
    (destination / "SHA256SUMS").write_text("\n".join(checksums) + "\n")
    print(f"Release artifacts: {destination.relative_to(ROOT)}; commit {commit}")


if __name__ == "__main__":
    prepare()
