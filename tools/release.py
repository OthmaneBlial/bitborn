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

IMAGES = ('boot.img', 'monitor.img', 'disk-read.img', 'keyboard.img', 'vga.img',
          'shell.img', 'protected-mode.img', 'self-modifying.img', 'vga-bitmap.img',
          'bounded-allocator.img', 'timer-irq.img', 'paging.img', 'exception-dispatch.img', 'bit-hunt.img')
EVIDENCE = ('shell-demo.png', 'protected-mode-demo.png', 'system-recording.json',
            'self-modifying-program.png', 'self-modifying-control.png', 'self-modifying-demo.gif', 'self-modifying-recording.json',
            'vga-bitmap-program.png', 'vga-bitmap-control.png', 'vga-bitmap-demo.gif', 'vga-bitmap-recording.json',
            'elf-demo.gif', 'bit-diff-demo.gif', 'encoding-demo.gif', 'boot-builder-demo.gif', 'cpu-lab-demo.gif', 'challenges-demo.gif',
            'browser-demo-recording.json',
            'bounded-allocator-control-disassembly.txt', 'bounded-allocator-control-registers.txt',
            'bounded-allocator-program-disassembly.txt', 'bounded-allocator-program-registers.txt',
            'bounded-allocator-recording.json',
            'timer-irq-control-disassembly.txt', 'timer-irq-control-pic.txt', 'timer-irq-control-registers.txt',
            'timer-irq-no-eoi-disassembly.txt', 'timer-irq-no-eoi-pic.txt', 'timer-irq-no-eoi-registers.txt',
            'timer-irq-program-disassembly.txt', 'timer-irq-program-pic.txt', 'timer-irq-program-registers.txt',
            'timer-irq-recording.json',
            'paging-program-directory.bin', 'paging-program-disassembly.txt', 'paging-program-registers.txt', 'paging-program-table.bin',
            'paging-recording.json',
            'paging-wp-off-directory.bin', 'paging-wp-off-disassembly.txt', 'paging-wp-off-registers.txt', 'paging-wp-off-table.bin',
            'paging-writable-directory.bin', 'paging-writable-disassembly.txt', 'paging-writable-registers.txt', 'paging-writable-table.bin',
            'exception-dispatch-divisor-one-disassembly.txt', 'exception-dispatch-divisor-one-log.bin',
            'exception-dispatch-divisor-one-ram.bin', 'exception-dispatch-divisor-one-registers.txt', 'exception-dispatch-divisor-one-stack.bin',
            'exception-dispatch-program-disassembly.txt', 'exception-dispatch-program-log.bin',
            'exception-dispatch-program-ram.bin', 'exception-dispatch-program-registers.txt', 'exception-dispatch-program-stack.bin',
            'exception-dispatch-recording.json',
            'exception-dispatch-retry-divide-disassembly.txt', 'exception-dispatch-retry-divide-log.bin',
            'exception-dispatch-retry-divide-ram.bin', 'exception-dispatch-retry-divide-registers.txt', 'exception-dispatch-retry-divide-stack.bin',
            'exception-dispatch-stop-divide-disassembly.txt', 'exception-dispatch-stop-divide-log.bin',
            'exception-dispatch-stop-divide-ram.bin', 'exception-dispatch-stop-divide-registers.txt', 'exception-dispatch-stop-divide-stack.bin',
            'bit-hunt-demo.gif', 'bit-hunt-no-star.png', 'bit-hunt-program.png', 'bit-hunt-recording.json')


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


def check_staging(destination, version, commit):
    allowed = {f'bitborn-v{version}-images.tar.gz', f'bitborn-v{version}-source.tar.gz',
               *IMAGES, *EVIDENCE, 'release-provenance.json', 'SHA256SUMS'}
    if destination.is_symlink():
        raise ValueError('release staging must not be a symlink')
    if destination.exists():
        for path in destination.iterdir():
            if path.name not in allowed or path.is_symlink() or not path.is_file():
                raise ValueError(f'unexpected release staging entry: {path.name}; nothing was overwritten')
        manifest = destination / 'release-provenance.json'
        if manifest.exists():
            recorded = json.loads(manifest.read_text())
            if not isinstance(recorded, dict) or recorded.get('version') != version or recorded.get('sourceCommit') != commit:
                raise ValueError('release staging belongs to a different version or source commit; nothing was overwritten')


def prepare():
    if subprocess.check_output(["git", "status", "--porcelain"], cwd=ROOT):
        raise ValueError("release requires a clean worktree")
    print(verify())
    version = (ROOT / "VERSION").read_text().strip()
    commit = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip()
    destination = ROOT / "build" / f"release-v{version}"
    if not destination.resolve().is_relative_to(ROOT.resolve()):
        raise ValueError('release staging must remain inside the project')
    check_staging(destination, version, commit)
    destination.mkdir(exist_ok=True)
    files = {path.as_posix(): (ROOT / 'build' / path).read_bytes() for path in artifact_paths()}
    files["README.txt"] = (f"bitborn v{version} — Software born from raw bits.\n"
        "BIOS: qemu-system-i386 -drive file=boot.img,format=raw,if=floppy -boot a -serial stdio\n"
        f"All {len(IMAGES)} .img attachments boot the same way; use the complete images, including multi-sector experiments.\n"
        "Type in the QEMU display for keyboard and monitor input.\n"
        "Linux x86-64: exit-code/exit-code-small/arithmetic/compare-values exit42; loop-count exits5; print-text exits0.\n"
        "Raw .bin files are payloads, not standalone boot images or ELF executables.\n"
        "Challenge start.bin files intentionally contain broken puzzles; curated solution.img files are QEMU-tested.\n"
        "Shell launches its returning disk app from sectors4-5; use the complete shell.img.\n"
        "The protected-mode image exercises one software interrupt; separate source fixtures test specific faults.\n"
        "Bounded allocator: a guarded 16-byte arena and one-bit rejection control.\n"
        "Timer IRQ: legacy IRQ0/PIC/PIT, three native cases; not concurrent task scheduling.\n"
        "Paging: legacy identity map, supervisor write fault repair, read/write and WP controls; not user isolation.\n"
        "Exception dispatch: DE/BP/UD/GP normalized frames and authored recovery sites; not arbitrary fault recovery.\n"
        "Bit Hunt: native WASD maze, R restart, Q quit; one operand bit disables star collection.\n"
        "Self-modifying code changes one future operand; VGA bitmap changes one DAC bit. Their controls and captures are in source.\n"
        "Browser GIFs show bounded model/inspection controls, not native CPU execution. Native GIFs show separate actual boots.\n"
        "Rebuild from source: make test; make site-test. No target assembler/compiler.\n"
        "Educational experiment; no hardware, UEFI or production-OS support.\n"
        "https://othmaneblial.github.io/bitborn/\n").encode()
    (destination / f"bitborn-v{version}-images.tar.gz").write_bytes(archive(files))
    source = subprocess.check_output(["git", "archive", "--format=tar", f"--prefix=bitborn-{version}/", "HEAD"], cwd=ROOT)
    (destination / f"bitborn-v{version}-source.tar.gz").write_bytes(gzip.compress(source, mtime=0))
    for name in IMAGES:
        shutil.copyfile(ROOT / "build" / name, destination / name)
    for name in EVIDENCE:
        shutil.copyfile(ROOT / 'assets' / name, destination / name)
    (destination / 'release-provenance.json').write_text(json.dumps(provenance(ROOT, version, commit, destination), sort_keys=True, indent=2) + '\n')
    checksums = [f"{hashlib.sha256(path.read_bytes()).hexdigest()}  {path.name}" for path in sorted(destination.iterdir()) if path.name != "SHA256SUMS"]
    (destination / "SHA256SUMS").write_text("\n".join(checksums) + "\n")
    print(f"Release artifacts: {destination.relative_to(ROOT)}; commit {commit}")


if __name__ == "__main__":
    prepare()
