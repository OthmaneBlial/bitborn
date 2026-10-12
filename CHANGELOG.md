# Changelog

## Unreleased

- Add a reproducible host-model benchmark for interpretation, history recording
  and full rewind/replay, with environment/source/workload hashes, semantic checks,
  retained CI JSON and an actual dated local sample. No native performance claim.

- Render all eight maintained introductions as localized website pages with
  language navigation, canonical/hreflang metadata, sitemap entries, escaped
  literal code and Arabic RTL layout. Three-browser mobile/keyboard checks and
  canonical documentation-copy checks run in CI.

- Add a recorded execution timeline to the CPU Lab. Select any state without
  executing instructions; show nearby recorded instructions and net register,
  flag and RAM changes. Arrow/Home/End keyboard controls work in three browsers.

- Add concise introductions in English, Simplified Chinese, Spanish, French,
  Japanese, Portuguese, German and Arabic; preserve shared literal examples and
  quickstart commands, with an English-source freshness manifest and link checks.

- Add conduct and security policies, enable private GitHub vulnerability reporting,
  route sensitive reports away from public issue forms and document a contributor
  source map. Verify published root reference files match canonical documents.

- Check arithmetic flags with an independent ripple-carry oracle, seeded ADD/SUB/CMP
  cases, all INC/DEC registers and exhaustive 8-bit TEST masks. Preserve IF/DF;
  represent undefined logical AF explicitly. These checks run in site CI.

- Align browser and host source parsing for initial UTF-8 BOMs, Unicode whitespace
  and comment-ending line boundaries; reject embedded BOMs consistently. Add
  658 seeded round-trip/rejection and cross-language diagnostic cases.

- Add exact recorded-state Back/Forward to the CPU Lab. Restore registers, flags,
  changed RAM, screen/serial output, UART state, instruction pointer and halt state;
  execution after a rewind replaces the old future. History uses scalar snapshots
  and byte deltas, with no per-frame full-RAM copy.

- Record exact changed model RAM bytes and consume that journal in the CPU Lab
  instead of copying/scanning 1 MiB on every instruction. Target binaries are unchanged.

## 0.2.0 — 2026-10-12

- Add an 813-byte native shell with nine exact commands, real memory experiments,
  handler-entry register/flag snapshots and checked loading of a returning
  150-byte disk app. Preserve the original monitor.
- Add a 568-byte 32-bit protected-mode/GDT/IDT software-interrupt experiment,
  independent success/failure QEMU checks and authentic native capture provenance.

- Add an editable 512-byte Boot Sector Builder with live byte fields, safe
  unsupported-encoding handling and exact image/source downloads.
- Add the Visual CPU Lab with full modeled 16-bit state, memory, stack, controls
  and breakpoints; 20 four-level challenges with hints and local progress.
- Add eight dedicated Pages routes and a source-generated roadmap feed.
- Add an eight-byte Linux exit size comparison while preserving the original;
  three genuine browser demo GIFs, contributor guides and issue forms.

- Correct modern real-mode `PUSH SP` in the bounded browser model and verify
  stack/flags/call/segmented-memory behavior with an independent QEMU probe.
- Add modeled arithmetic flags, CS/logical IP, near calls/returns, direct memory,
  string direction and memory-based instruction fetch for edited programs.
- Add strict, bounded literal `.bits` parsing, exact formatting, image framing
  validation and per-bit change descriptions shared by new browser instruments.
- Restrict public downloads and release archives to reviewed manifest outputs;
  browser test exports or other temporary images cannot enter published artifacts.
- Reject in-place packing and source aliases, packaged-output collisions and
  corrupted derived images/ELFs before publication. Honor 16-bit IP wrap in the
  teaching model and CPU Lab sequential preview.

## 0.1.1 — 2026-10-12

- Accept arbitrary `#` comment prose, including pipe separators, without changing
  the packed bytes. Structured annotations remain separate from byte syntax;
  malformed target metadata still fails source verification.
- Verify failed CLI packing leaves an existing output file intact.
- Isolate release artifacts by version so checksums cannot include older archives.
- Target instruction bytes and all boot images match v0.1.0 exactly.

## 0.1.0 — 2026-10-12

- Handwritten 512-byte x86 BIOS boot program with VGA/COM1 greeting and halt.
- Strict binary packer, annotated byte inspector, verifier and bit-level diff.
- Linux x86-64 exit, arithmetic, text, loop and comparison payloads with ELF
  header packaging; native Linux CI execution.
- BIOS keyboard and VGA demonstrations; checked two-sector disk loader.
- Interactive monitor with exact commands, bounded editable input and real
  boot-memory inspection.
- Ten per-byte guides, architecture and reproduction tutorials; real QEMU boot
  capture with provenance.
- Published interactive website with editable instruction fields, all 512
  annotated boot bytes, bounded boot simulation and responsive keyboard controls.
- Verified CI, automatic Pages deployment, repository topics and social preview.
- Public v0.1.0 release with five independently bootable images, full image/source
  archives and externally re-downloaded SHA-256-verified artifacts.
