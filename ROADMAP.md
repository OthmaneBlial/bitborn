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

## v0.2 completed evolution

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

## Evolution session

- [x] Inspect register-direct MOV 88/89/8A/8B with direction/width bit roles,
  ModR/M selectors, 66/REX precedence and high-byte/REX byte-register names.
  9,728 register/context/prefix combinations and 18 independent NDISASM goldens
  pass. Memory forms and execution of these new forms remain outside scope.

- [x] Share 1–512 loaded CPU Lab bytes through strict versioned URL fragments.
  Links open paused and omit drafts/comments/history; malformed links keep state.
  Exact round trips, self-modification, navigation, clipboard fallback, 320px
  controls and delayed-import cancellation pass three-browser checks.

- [x] Verify one protected-mode selector #GP with its CPU-pushed error code:
  exact four-doubleword frame, removal of the code before IRETD, preserved DS,
  saved-EIP adjustment and restored stack. General fault dispatch remains open.

- [x] Verify one controlled protected-mode UD2/#UD in a separate 200-byte literal
  research fixture: exact vector-six gate/frame, original EIP, saved-EIP adjustment,
  IRETD, restored stack, flat selectors and descriptor accessed-bit behavior.
  General dispatch, error-code exceptions and hardware IRQs remain unfinished.

- [x] Verify a handwritten 70-byte real-mode divide-fault probe in QEMU: actual
  saved fault IP/frame, repaired divisors 1/2, restored stack and repeated faults
  without repair. This does not complete protected-mode exception handling.

- [x] Validate manifest types, canonical paths, packaging combinations and reviewed
  references; reject source directories/pipes and symlink/hard-link output aliases. Check all source hashes,
  sizes and derived packages before writing; invalid later targets preserve outputs.

- [x] Add an ELF64 anatomy explorer with checksummed native examples, field/byte
  selection, exact entry-to-file mapping, segments and zero-fill classification.
  Six real artifacts, payload identity, 2,000 seeded mutations and three-browser
  import, invalid-file, keyboard and mobile checks pass. Imported code never runs.

- [x] Prepare v0.3 version/notes and deterministic provenance tying the reviewed
  source commit, target source files, payloads, packaged outputs and release assets.
  Reject unexpected/aliased staging entries before writing.
- [x] Publish [v0.3.0](https://github.com/OthmaneBlial/bitborn/releases/tag/v0.3.0)
  at immutable commit `8bc0797d6f8ef97126e0fcba652ed25a20b07fe6`, after
  [exact-commit CI](https://github.com/OthmaneBlial/bitborn/actions/runs/38301698299)
  passed. All 14 public files were anonymously re-downloaded and match staged
  bytes; all 13 checksum entries and commit/source/artifact provenance pass.
  Seven BIOS images also match the immutable v0.2 downloads exactly.

- [x] Synchronize valid binary drafts with a literal hexadecimal view; explicit
  hex loading replaces notation/comments and resets the model. All byte values,
  1,000 seeded round trips, Unicode boundaries, input limits and three-browser
  draft/state behavior pass; CLI `.bits` syntax remains binary-only.

- [x] Export/import exact loaded CPU Lab programs as literal `.bits` or raw `.bin`.
  Three browsers check actual downloads, unchanged execution/history, empty/513-byte
  rejection, the 512-byte boundary, original bytes before self-modification and
  cancellation of delayed reads/errors after a newer preset or editor draft.

- [x] Publish packed output atomically; injected sync/rename failures preserve
  existing bytes, leave absent outputs absent and clean temporary files. Source
  aliases, symlink destinations, hard-link isolation, permissions and non-files
  are checked. Canonical instruction bytes and packaged targets are unchanged.

- [x] Add a reproducible Node model benchmark: fixed reviewed boot workload,
  semantic assertions, warmups/trials, environment and source hashes, measured
  median/p95 and retained CI evidence. No native/DOM speed claim or timing gate.

- [x] Replace whole-memory copies/scans during CPU Lab stepping with actual
  write journals. An independent full-memory oracle checks every step of the
  2,825-step boot, five presets, unchanged writes, stack/calls, A20 wrapping and
  self-modification. Chrome memory, stack, flag and breakpoint interactions pass.
- [x] Add exact Back/Forward model execution: recorded registers, flags, changed
  RAM, outputs, UART and halt state restore without executing another instruction.
  Stack/calls, output clearing, self-modification, A20, failures and the full boot
  have independent round-trip checks. Chrome, Firefox and WebKit controls pass.
- [x] Add direct recorded-timeline navigation with nearby instruction states,
  native keyboard range controls and net register/RAM comparisons. Independent
  state and full-memory oracles, 4,096-state bounds and three-browser checks pass.
- [x] Check 81,691 modeled arithmetic/logical instructions against independent
  ripple-carry and parity oracles; seed 16-bit ADD/SUB/CMP, preserve CF for every
  INC/DEC register and exhaust all 8-bit TEST masks. IF/DF stay unchanged.
- [x] Add explicit 16/32/64 context for scoped instruction inspection: MOV
  immediates, register-direct XOR, 66/REX fields, legacy INC/DEC and selected bare
  encodings. Exact imm64, independent NDISASM goldens and three-browser bit/context
  changes are checked. Simulation remains the separately tested 16-bit subset.
- [x] Align browser/CLI source parsing: accept only an initial UTF-8 BOM, use the
  same Unicode whitespace and line boundaries, and keep exact comment scope.
  658 seeded valid/invalid cases compare bytes and source-line diagnostics.
- [x] Add introductory documentation in English, Simplified Chinese, Spanish,
  French, Japanese, Portuguese, German and Arabic. Source-revision hashes, identical
  literal code/quickstart blocks and local links are checked. Native-speaker review
  remains welcome; detailed guides and interactive controls currently use English.
- [x] Publish source-generated introductory routes for all eight languages, with
  canonical/hreflang metadata and sitemap entries. Desktop/320px and keyboard
  navigation pass in Chrome/Firefox/WebKit; Arabic prose stays RTL and code LTR.
- [x] Add contributor conduct/security policies with usable reporting contacts;
  verify GitHub private reporting is enabled. Document setup and a focused source
  map, and check canonical policy/reference copies during website validation.

The [working improvement backlog](docs/EVOLUTION.md) records prioritization,
dependencies, risks and the current execution record. It is not a feature list.

## Further research

- [ ] Paging or a bounded allocator with explicit memory-map evidence.
- [ ] General exception handlers and hardware interrupt delivery.
- [ ] Physical-hardware calibration and broader boot compatibility.

These experiments require separate bootable targets, byte explanations and actual
execution tests before appearing as completed capabilities. No hardware, UEFI,
security, performance or production-OS compatibility is promised.
