# bitborn v0.1.1 — Comments stay comments

This patch improves the host tools. **Every handwritten target byte and boot
image is identical to v0.1.0.**

- `bitpack` accepts arbitrary `#` comment prose, including pipe separators.
  Optional structured annotations never become target instruction inputs.
- Invalid byte input gives a source-line diagnostic and leaves existing output
  intact. Regression tests exercise the actual command-line tool.
- Version-specific release directories prevent stale archives from entering
  a new release's checksum list.

The release includes the five bootable images, all gallery payloads and Linux
executables in `bitborn-v0.1.1-images.tar.gz`, the immutable source archive
`bitborn-v0.1.1-source.tar.gz`, and `SHA256SUMS` for uploaded artifacts.

```sh
sha256sum -c SHA256SUMS
qemu-system-i386 -drive file=boot.img,format=raw,if=floppy -boot a -serial stdio
```

On macOS use `shasum -a 256 -c SHA256SUMS`. From source, `make test` and
`make site-test` reproduce and validate the targets. Linux ELF examples require
Linux x86-64. BIOS images are QEMU/SeaBIOS-tested; no physical hardware, native
UEFI or production-OS compatibility is claimed. The browser model remains a
bounded teaching tool. Source/docs editing is AI-assisted, with instructions
authored directly as binary digits rather than assembler/compiler output.

[Website](https://othmaneblial.github.io/bitborn/) · [Docs](https://othmaneblial.github.io/bitborn/docs.html) ·
[v0.1.0 foundation](https://github.com/OthmaneBlial/bitborn/releases/tag/v0.1.0) ·
[Changelog](https://github.com/OthmaneBlial/bitborn/blob/main/CHANGELOG.md) ·
[Roadmap](https://github.com/OthmaneBlial/bitborn/blob/main/ROADMAP.md)
