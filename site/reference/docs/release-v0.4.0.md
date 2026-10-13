# bitborn v0.4.0 — Change one bit. Prove the difference.

This milestone brings two real native experiments alongside stronger instruction
inspection, modeled execution and host validation. Executable instructions remain
manually authored binary tokens. Host Python packages and checks those bytes;
mnemonic comments and reference-map labels never generate machine code.

## Native experiments

- **Self-modifying code:** two 82-byte controls differ at writer byte 52 bit 5.
  One changes the future operand at byte 61 and prints `a`; the other prints `A`.
  Identical-byte model/QEMU checks cover registers, defined flags, code RAM,
  serial/VGA, unchanged source/disk and exact model rewind/replay.
- **VGA palette surgery:** a 142-byte program draws an 8×8 bitmap. One DAC bit
  changes all sixteen green pixels while all 64,000 framebuffer indices stay
  identical. Native screens and the two-boot GIF are checked against actual
  pixels. The browser model explicitly rejects this graphics experiment.
- Boot/control setup guards check explicit SS:SP initialization before BIOS calls.
  Existing shell, monitor, keyboard and protected-mode examples remain curated
  experiments. Separate literal fault probes have scoped native tests; general
  exception dispatch, paging and hardware IRQ delivery remain research.

## Read the fields and inspect the state

- Register/memory MOV inspection and unprefixed 16-bit model execution, with
  default DS/SS, signed displacement, byte halves, live RAM and native parity.
- All sixteen short Jcc conditions, signed/unsigned comparisons and ADC/SBB carry
  arithmetic, with independent full-domain oracles and identical native fixtures.
- Positional bit-diff explanations, explicit 16/32/64 inspection context,
  keyboard bit editing and canonical `.bits` teaching presets.
- Source errors identify exact invalid/excess token ranges, preserve loaded state
  and drafts, and select the relevant editor without disrupting inline typing.
- Tablet register bits fit their cells. Scoped contrast checks, non-color change
  cues, a visible execution-shortcut switch and quieter atomic status messages
  improve the educational UI. Live assistive-technology review is separate.

## Check the bytes without fixups

`bitinspect --references JSON` validates declared abs16/far16/rel8/rel16 address
fields, with explicit segment/origin assumptions and no rewriting. Maps cover
the original boot, both native experiment controls and a `7E00`-loaded CALL/RET
fragment. Annotation JSON validates typed ranges, non-overlap and optional literal
bits before printing, with bounded reads and structured diagnostics.

Native harness startup waits for QMP readiness under an absolute deadline and
preserves cleanup on failure. Guides separate static declarations, browser
interaction, model execution, native QEMU behavior and actual publication proof.

## Downloads and verification

The prepared distribution includes **nine BIOS images**, a deterministic archive
of **90 derived artifacts from 57 reviewed targets**, the immutable source archive,
native crops/GIFs and capture records, six genuine browser GIFs and their provenance,
`release-provenance.json` and `SHA256SUMS`. The staging list contains 31 files;
30 checksum entries cover every attachment except the checksum list itself.

The original 512-byte boot greeting still says v0.1. Existing release tags/assets
are preserved. Native crops show actual captured cells/pixels; browser recordings
show bounded inspection/model UI rather than native CPU footage.

```sh
sha256sum -c SHA256SUMS
qemu-system-i386 -drive file=boot.img,format=raw,if=floppy -boot a -serial stdio
```

On macOS, use `shasum -a 256 -c SHA256SUMS`. Rebuild from the source archive:

```sh
make test site-test
npm ci
npx playwright install chromium firefox webkit
npm run test:browser
npm run test:cross-browser
```

The source archive has no Git history. Preparing release attachments with
`python3 tools/release.py` requires a clean Git checkout of the exact source commit.
Archive users can rebuild/test the programs with the commands above.

Release preparation requires a clean Git worktree and verifies reviewed bytes
before staging. Provenance ties the exact commit to target source/payload hashes,
all derived artifacts and attachment hashes. It proves integrity, not human-only
authorship or a cryptographic publisher signature. AI assistance is disclosed.

Linux ELF examples require Linux x86-64; BIOS targets are QEMU/SeaBIOS/TCG-tested.
Physical hardware, UEFI, production-OS compatibility, native speed claims and
whole-site accessibility certification are outside the established evidence.

[Website](https://othmaneblial.github.io/bitborn/) ·
[CPU Lab](https://othmaneblial.github.io/bitborn/cpu-lab/) ·
[Native examples](https://othmaneblial.github.io/bitborn/examples/) ·
[Roadmap](../ROADMAP.md) · [Execution/proof guide](execution-scope.md)
