# Roadmap and evidence

Last updated: **2026-10-12**. Every published implementation milestone updates
this file and the README progress table. Checkmarks mean implemented and tested;
an idea below is not an advertised feature.

## Complete

- [x] Authentic handwritten target instructions: canonical `.bits` byte tokens
  with per-instruction encoding explanations, no assembler or target compiler.
- [x] `bitpack`, `bitinspect`, `bitverify`, `bitdiff`; syntax, annotations,
  immutable reviewed hashes, sizes, signatures and reproducibility checks.
- [x] Exactly 512-byte BIOS boot sector; full greeting appears on VGA and COM1,
  final halt confirmed by QEMU register inspection.
- [x] Five Linux x86-64 examples: exit 42, arithmetic 6×7, text output, count loop
  and equality branch. ELF headers are host packaging. Native execution passed
  in [CI for d5bf8e6](https://github.com/OthmaneBlial/bitborn/actions/runs/38210590077).
- [x] BIOS keyboard echo and direct green VGA character; actual keyboard injection
  and VGA memory verified in QEMU.
- [x] Two-sector BIOS read and execution at `7E00`; loaded guest memory compared
  with canonical bytes. Invalid CHS sector exercises the safe disk-failure path.
- [x] Interactive monitor: exact `help`, `clear`, `about`, `reboot`, `peek`, bounded
  keyboard input, Backspace, unknown-command rejection. `peek` is an actual
  memory load, including an alternate-address execution test.

## Publication gates complete

- [x] Complete beginner tutorial, architecture guide and ten per-example walkthroughs
  with complete per-byte tables.
- [x] Genuine QEMU screenshot and boot GIF, with source checksum and capture provenance.
- [x] Interactive browser bit editor and annotated 512-byte visual explorer.
- [x] Local Chrome interactions, copy controls, reduced-motion setting, 1440/390/320px
  layouts and keyboard navigation. Live validation remains a publication gate.
- [x] Live website interactions repeated successfully in Chrome; deployed boot,
  monitor, disk-read, annotations, GIF and social image match local bytes exactly.
- [x] Official [website](https://othmaneblial.github.io/bitborn/) and repository
  homepage; twenty relevant topics and a custom repository social preview.
- [x] Website/documentation/browser CI and clean-checkout reproduction proof:
  [ede398e verification](https://github.com/OthmaneBlial/bitborn/actions/runs/38212231354)
  and [successful deployment](https://github.com/OthmaneBlial/bitborn/actions/runs/38212311862).
- [x] Public [v0.1.0 release](https://github.com/OthmaneBlial/bitborn/releases/tag/v0.1.0)
  at immutable commit `d2c0434c186c33c8a70f3bf8c708c4983522f4cd`, after its
  [exact-commit CI](https://github.com/OthmaneBlial/bitborn/actions/runs/38212701098) passed.
  All eight public files were re-downloaded and matched the prepared artifacts;
  all seven checksummed images/archives passed SHA-256 verification.

The v0.1 foundation is complete. Future experiments below remain open research,
not release requirements or advertised capabilities.

## v0.1.1 maintenance

- [x] General `#` comments, including arbitrary pipe separators, do not alter
  packing. Annotation validation remains part of target-source verification.
- [x] Invalid binary input fails with a line number and preserves existing output.
- [x] Release staging is isolated by version to keep checksum lists correct.
- [x] Publish and re-download the verified [v0.1.1 host-tool patch](https://github.com/OthmaneBlial/bitborn/releases/tag/v0.1.1).
  [Exact-commit CI](https://github.com/OthmaneBlial/bitborn/actions/runs/38213753618)
  passed all 20 Python tests, browser checks and reproduction. All eight public
  assets match the prepared files and all checksums pass; the five boot images
  are byte-for-byte identical to v0.1.0.

## v0.2 evolution — work in progress

- [x] Audit the v0.1.1 foundation: existing 20 Python tests and site checks pass.
- [x] Fix the bounded simulator's `PUSH SP` behavior for 286+ real-mode x86.
  Independent real QEMU execution checks the saved SP, signed-overflow flags,
  little-endian segmented memory and a near call/return.
- [x] Extend the shared teaching model with CS, logical IP, arithmetic flags,
  near calls/returns, direct memory, string direction and live instruction fetch.
  Literal source parsing and exports have explicit input limits.
- [ ] Publish the full editable 512-byte Boot Sector Builder after browser
  downloads and actual QEMU execution of an edited image pass.
- [ ] Publish the Visual CPU Lab with register, flag, stack and memory inspection.
- [ ] Publish 20 binary challenges with deterministic goals and native checks.
- [ ] Publish dedicated playground, examples, learning, architecture and roadmap
  routes. The website roadmap must reflect this source progress at each build.
- [ ] Add a verified before/after byte-size optimization example.
- [ ] Publish a meaningful v0.2 release and independently verify its downloads.

## Future experiments

- [ ] Protected-mode transition and explicit GDT explanation.
- [ ] Interrupt handling beyond BIOS services.
- [ ] Basic memory management and executable loading.

These experiments require separate bootable targets, byte explanations and actual
execution tests before appearing as completed capabilities. No hardware, UEFI,
security, performance or production-OS compatibility is promised.
