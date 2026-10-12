# Boot from a 512-byte sector

**Environment:** x86 real-mode BIOS, loaded at 7C00. **Expected:** full bitborn
greeting on VGA and COM1; safe halt.

The [canonical source](../../boot/boot.bits) includes all 512 bytes: 91 code
bytes, 148 message bytes, 271 explicit padding bytes, and the two signature
bytes. It is reused here instead of duplicating it. [Byte table](bytes.md).

Run `./tools/bitpack boot/boot.bits boot.img` from the root, or `make build` for
`build/boot.img`. `make run` starts QEMU. `test_real_bios_boot` asserts the exact
serial greeting and guest HLT state, while encoding tests check branches and
the signature independently. [Architecture walkthrough](../../docs/architecture/README.md).
