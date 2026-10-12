# bitborn v0.3.0 — Rewind the machine. Read every bit.

The Binary Time Machine restores recorded registers, flags, changed RAM, outputs
and halt state. Select any recorded state with the timeline, step backward, or
replay without executing another instruction. New execution replaces an abandoned
future. History uses scalar snapshots and changed-byte journals.

The instruction playground adds explicit 16/32/64-bit inspection for a documented
subset. Read 66/REX and ModR/M fields, flip register/width bits and inspect an exact
64-bit immediate. Simulation remains the tested 16-bit teaching model. Actual
browser recordings distinguish inspection, model execution and real QEMU footage.

## Included in this milestone

- CPU Lab `.bits`/raw `.bin` downloads and imports, preserving loaded bytes before
  self-modification. Delayed imports cannot overwrite newer source choices/drafts.
- Binary/hex drafts with explicit loading, shared input boundaries and checked
  literal-byte round trips. Canonical target source remains binary `.bits`.
- Browser/CLI Unicode/BOM/line-boundary parity and 658 seeded diagnostic cases.
  Independent flags properties check 81,691 modeled instructions.
- Concise introductions in eight languages and corresponding website routes,
  with source freshness, link/code consistency, RTL/LTR and mobile checks.
- Contributor conduct/security policies and a source map; private vulnerability
  reporting is enabled. Detailed technical guides and instruments remain English.
- Atomic `bitpack` output with injected failure checks, a reproducible host-model
  benchmark, and deterministic release provenance tied to the exact source commit.

**The 55 reviewed native targets and their instruction bytes are unchanged from
v0.2.0.** The seven BIOS images, six Linux ELF examples, shell and protected-mode
experiment retain their earlier payloads. The original boot greeting still says
v0.1. This release expands host/browser capabilities, not native OS support.

## Downloads and verification

The release contains seven BIOS images; the reviewed images/payloads/ELFs archive;
the immutable source archive; two genuine native screenshots and their capture
record; `release-provenance.json`; and `SHA256SUMS`.

The provenance manifest records the commit, reviewed target source-file and payload
hashes, all packaged-artifact hashes and the release archive/evidence hashes.
The checksum list includes the provenance manifest. It is an integrity record,
not a cryptographic publisher signature. Unexpected or aliased release staging
entries are rejected before writing. Repeating preparation on the same reviewed
commit produces the same staged bytes.

```sh
sha256sum -c SHA256SUMS
qemu-system-i386 -drive file=boot.img,format=raw,if=floppy -boot a -serial stdio
```

On macOS, use `shasum -a 256 -c SHA256SUMS`. From source:

```sh
make test site-test
npm ci
npx playwright install chromium firefox webkit
npm run test:browser
npm run test:cross-browser
npm run benchmark
```

The browser is bounded and does not execute imported bytes as host-native code.
Linux ELF examples need Linux x86-64; BIOS targets are QEMU/SeaBIOS/TCG-tested.
Paging, general exceptions, hardware IRQs, physical hardware, UEFI and production
OS compatibility remain outside the established support boundary. Benchmarks
measure JavaScript interpretation/history, excluding DOM and native CPU timing.
Translations welcome native-speaker review. Source/docs editing is AI-assisted;
“handwritten” means direct instruction-byte authorship, not unassisted authorship.

[Website](https://othmaneblial.github.io/bitborn/) ·
[Time Machine](https://othmaneblial.github.io/bitborn/cpu-lab/) ·
[Instruction playground](https://othmaneblial.github.io/bitborn/playground/) ·
[International introductions](https://othmaneblial.github.io/bitborn/intro/en/) ·
[Roadmap](https://github.com/OthmaneBlial/bitborn/blob/main/ROADMAP.md)
