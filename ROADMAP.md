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
- [x] Build the full editable 512-byte Boot Sector Builder. The downloaded image
  and `.bits` match exactly; real QEMU prints the one-bit-edited lowercase greeting.
- [x] Build the Visual CPU Lab with register bits, flags, stack and memory,
  Step/Run/Pause/Reset, speed, pre-execution breakpoints and literal-source import.
- [x] Build 20 binary challenges, five per difficulty level. All reviewed solutions
  pass deterministic model and actual QEMU goals; all unchanged seeds fail.
  Alternative answers, byte budgets, loops, malformed input and local-storage
  failure are checked. Progress stays in the browser; no account or analytics.
- [x] Build all eight dedicated routes plus a binary size lab; generated progress
  reflects README at every build. Chrome checks desktop, tablet and 320px layouts.
- [x] Add a 12→8-byte Linux exit comparison with independent encodings and sizes.
  ELF sizes are 132→128; instructions increase 3→5. No speed claim is made.
- [x] Capture actual browser GIFs with source/frame hashes and explicit model
  labeling; add SHOWCASE, GOOD_FIRST_ISSUES and four contributor issue forms.
- [x] Firefox 157 and WebKit 27.2 pass all routes, 320px layouts, real downloads,
  CPU controls, memory, breakpoints, challenge edits/progress and the roadmap.
  Firefox exposed a detached-download-anchor bug; connecting the anchor fixes
  the actual image and source downloads, now covered by both engines.
- [x] Expanded [Linux CI at 8dad62b](https://github.com/OthmaneBlial/bitborn/actions/runs/38221372210)
  passes all six ELF programs, three browser engines, twenty challenge solutions
  in QEMU and the actual downloaded image boot.
- [x] [Pages deployment at 8dad62b](https://github.com/OthmaneBlial/bitborn/actions/runs/38221582708)
  passed. Live builder interactions/downloads and public source/assets match.
- [x] Add the native nine-command shell, handler-entry register snapshot, actual
  memory read/write/dump and a separately handwritten disk app returning to the
  prompt. Five QEMU tests cover disk failure, command/edit bounds and repeat runs.
- [x] Add the 568-byte protected-mode target: GDT, CR0.PE, 32-bit flat segments,
  memory write/read, IDT software interrupt gate, IRETD and controlled success/fail
  halts. Three independent QEMU tests and genuine native recordings pass locally.
- [x] Reject source aliases, output collisions and corrupted packaged artifacts;
  fix logical-IP wrap and its CPU Lab preview. Regression tests cover each bug.
- [x] Native additions passed [exact-commit Linux CI](https://github.com/OthmaneBlial/bitborn/actions/runs/38223386652)
  and [v0.2.0 tag CI](https://github.com/OthmaneBlial/bitborn/actions/runs/38223865244):
  all 37 Python tests, six ELFs, QEMU checks, three engines and deterministic builds.
- [x] [Native milestone Pages deployment](https://github.com/OthmaneBlial/bitborn/actions/runs/38223692480)
  passed. All 135 live runtime files match local bytes, including 86 reviewed
  downloads. Detailed Chrome interactions were repeated against the live site.
- [x] Synchronize the central Pages mirror at `7f25d05`; its
  [deployment](https://github.com/OthmaneBlial/OthmaneBlial.github.io/actions/runs/38223873350)
  passed, and all 180 changed paths are contained in `bitborn/`.
- [x] Publish [v0.2.0](https://github.com/OthmaneBlial/bitborn/releases/tag/v0.2.0)
  at immutable commit `4706efeeab9133f53b2b9e80089f144d9983ff89`.
  All 13 authenticated and anonymous public re-downloads match the prepared files;
  all 12 checksummed files pass. The image archive contains 86 reviewed artifacts
  plus its README, and the source archive equals the exact release commit.

The v0.2 milestone is published and verified. The following research remains open.
- [x] Refresh the main documentation's example counts, latest-release links and
  protected-mode status; preserve the original boot image and its v0.1 greeting.

## Further research

- [ ] Paging or a bounded allocator with explicit memory-map evidence.
- [ ] General exception handlers and hardware interrupt delivery.
- [ ] Physical-hardware calibration and broader boot compatibility.

These experiments require separate bootable targets, byte explanations and actual
execution tests before appearing as completed capabilities. No hardware, UEFI,
security, performance or production-OS compatibility is promised.
