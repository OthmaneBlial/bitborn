#!/usr/bin/env python3
"""Prepare deterministic release artifacts from one clean, reviewed commit."""
import gzip
import hashlib
import io
import shutil
import subprocess
import tarfile
if __package__:
    from .bitborn import ROOT, verify
else:
    from bitborn import ROOT, verify


def archive(entries):
    stream = io.BytesIO()
    with tarfile.open(fileobj=stream, mode="w", format=tarfile.USTAR_FORMAT) as tar:
        for name, data in sorted(entries.items()):
            info = tarfile.TarInfo(name)
            info.size = len(data)
            info.mode = 0o755 if name.endswith(".elf") else 0o644
            tar.addfile(info, io.BytesIO(data))
    return gzip.compress(stream.getvalue(), mtime=0)


def prepare():
    if subprocess.check_output(["git", "status", "--porcelain"], cwd=ROOT):
        raise ValueError("release requires a clean worktree")
    print(verify())
    version = (ROOT / "VERSION").read_text().strip()
    destination = ROOT / "build/release"
    destination.mkdir(exist_ok=True)
    files = {path.name: path.read_bytes() for path in (ROOT / "build").iterdir()
             if path.suffix in {".img", ".bin", ".elf"} and path.stem != "loader"}
    files["README.txt"] = (f"bitborn v{version} — Software born from raw bits.\n"
        "BIOS: qemu-system-i386 -drive file=boot.img,format=raw,if=floppy -boot a -serial stdio\n"
        "monitor.img, disk-read.img, keyboard.img and vga.img boot the same way.\n"
        "Type in the QEMU display for keyboard and monitor input.\n"
        "Linux .elf examples require Linux x86-64; expected exits 42, 42, 0, 5, 42.\n"
        "Raw .bin files are payloads, not standalone boot images or ELF executables.\n"
        "Rebuild from source: make test; make site-test. No target assembler/compiler.\n"
        "Educational experiment; no hardware, UEFI or production-OS support.\n"
        "https://othmaneblial.github.io/bitborn/\n").encode()
    (destination / f"bitborn-v{version}-images.tar.gz").write_bytes(archive(files))
    source = subprocess.check_output(["git", "archive", "--format=tar", f"--prefix=bitborn-{version}/", "HEAD"], cwd=ROOT)
    (destination / f"bitborn-v{version}-source.tar.gz").write_bytes(gzip.compress(source, mtime=0))
    for name in ("boot.img", "monitor.img", "disk-read.img", "keyboard.img", "vga.img"):
        shutil.copyfile(ROOT / "build" / name, destination / name)
    checksums = [f"{hashlib.sha256(path.read_bytes()).hexdigest()}  {path.name}" for path in sorted(destination.iterdir()) if path.name != "SHA256SUMS"]
    (destination / "SHA256SUMS").write_text("\n".join(checksums) + "\n")
    print(f"Release artifacts: {destination.relative_to(ROOT)}; commit " + subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=ROOT, text=True).strip())


if __name__ == "__main__":
    prepare()
