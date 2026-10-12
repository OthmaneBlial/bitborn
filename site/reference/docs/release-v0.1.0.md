# bitborn v0.1.0 — Software born from raw bits

A real 512-byte x86 BIOS boot image, written directly as literal binary digits.
No assembler or target compiler creates its instructions. Python packages bytes;
JavaScript provides the educational website and bounded simulator.

## Included

- Boot greeting on actual VGA and COM1, with a controlled halt.
- Four host tools: strict packing, annotated inspection, verification and bit diff.
- Ten documented examples with complete byte tables: Linux exit/arithmetic/text/
  loop/compare and BIOS keyboard/VGA/boot/monitor/disk reads.
- A checked multi-sector loader and an editable, bounded command monitor.
- Source, reproducible builds, real QEMU capture, interactive website and tutorials.

## Downloads and reproduction

- `boot.img`: exactly 512 bytes, signature `55 AA` at offsets 510–511.
- `keyboard.img`, `vga.img`: independently bootable one-sector demonstrations.
- `monitor.img`, `disk-read.img`: independently bootable 1,536-byte disk images.
- `bitborn-v0.1.0-images.tar.gz`: all images, raw payloads, Linux ELF examples and
  reproduction instructions.
- `bitborn-v0.1.0-source.tar.gz`: tracked source from the immutable release commit.
- `SHA256SUMS`: SHA-256 checksums for every uploaded artifact.

```sh
sha256sum -c SHA256SUMS
qemu-system-i386 -drive file=boot.img,format=raw,if=floppy -boot a -serial stdio
```

macOS can verify hashes with `shasum -a 256 -c SHA256SUMS`. From source, run
`make test`, `make site-test`, and optionally `npm ci && npx playwright install chromium && npm run test:browser`.

## Supported environment and limits

BIOS images are tested in QEMU's x86 system emulator with SeaBIOS/TCG. Linux ELF
examples require Linux x86-64; their meaningful nonzero exit codes are documented.
No physical hardware or UEFI compatibility is claimed. This is an educational
real-mode environment, not a production OS. COM1 polling assumes a working UART;
the CHS loader makes one read attempt and stops on failure. The monitor's memory
inspection is fixed to 7C00 and reboot uses BIOS bootstrap.

Source editing and documentation are AI-assisted. “Handwritten” identifies direct
authorship of binary instruction bytes, not unassisted human authorship. Host
tools, BIOS, Linux and QEMU are conventional software; the target source boundary
is explicit. No telemetry or network behavior exists in the target programs.

CI executes real BIOS and Linux targets and checks source syntax, hashes,
encodings, branch boundaries, reproducibility, docs and real browser interactions.
The browser simulator is deliberately limited and does not prove native execution.

[Website](https://othmaneblial.github.io/bitborn/) · [Docs](https://othmaneblial.github.io/bitborn/docs.html) ·
[Source](https://github.com/OthmaneBlial/bitborn) · [Changelog](https://github.com/OthmaneBlial/bitborn/blob/main/CHANGELOG.md) ·
[Roadmap](https://github.com/OthmaneBlial/bitborn/blob/main/ROADMAP.md)
