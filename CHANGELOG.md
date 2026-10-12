# Changelog

## Unreleased

- Correct modern real-mode `PUSH SP` in the bounded browser model and verify
  stack/flags/call/segmented-memory behavior with an independent QEMU probe.
- Add modeled arithmetic flags, CS/logical IP, near calls/returns, direct memory,
  string direction and memory-based instruction fetch for edited programs.
- Add strict, bounded literal `.bits` parsing, exact formatting, image framing
  validation and per-bit change descriptions shared by new browser instruments.
- Restrict public downloads and release archives to reviewed manifest outputs;
  browser test exports or other temporary images cannot enter published artifacts.

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
