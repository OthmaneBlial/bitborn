# Roadmap and evidence

Last updated: **2026-10-13**. Every published implementation milestone updates
this file and the README summary. Checkmarks mean implemented and tested;
an idea below is not an advertised feature.

## Milestone ledger

Updated **2026-10-13** after each verified milestone. This detailed ledger powers
website progress; the [README](README.md) keeps a short summary.

| Milestone | Progress |
| --- | --- |
| [Native callable user/kernel gate](docs/architecture/user-gate.md) | ✅ Literal 696-byte fixture passes QEMU: five-word INT/IRETD return, preserved caller registers/DF and TSS stack; one DPL bit denies entry with GP error 0102 and retained six-word frame; flat memory remains shared |
| [Native ring-three privilege research](docs/architecture/user-privilege.md) | ✅ Literal 496-byte fixture and F4→F5 control pass QEMU: outward IRETD, HLT #GP(0), TSS kernel stack, six-word frame, register/DF restoration and returned user stack; no memory isolation, syscall gate or scheduling proof |
| [v0.5.0 distribution](docs/release-v0.5.0.md) | ✅ Main/tag CI passed; clean source archive passes 114 Python tests and three browser engines, with 112 rebuilt hashes and 1,021 unchanged source files; all 89 public attachments re-downloaded anonymously, with 88 listed checksums and 14 primary BIOS images |
| Release staging preserves its recorded revision | ✅ Different version/source commits rejected before writes; same-revision repacking retained, isolated regressions pass and 31 frozen v0.4.0 files remain unchanged |
| 512-byte handwritten boot program and four byte tools | ✅ QEMU-tested, public |
| Linux exit, arithmetic, text, loops and comparisons | ✅ Native execution passed in Linux CI |
| BIOS keyboard and direct VGA memory writes | ✅ QEMU-tested |
| Multi-sector loader and interactive monitor | ✅ QEMU-tested: help, clear, about, reboot, peek |
| Ten example guides and complete byte tables | ✅ Documented, with actual execution checks |
| Real boot screenshot/GIF and architecture tutorial | ✅ Captured from QEMU and reproducible |
| Interactive `.io` website and mobile browser checks | ✅ Live; HTTPS assets and Chrome interactions verified |
| Public v0.1.0 images, source and checksums | ✅ Published; downloaded artifacts and checksums verified |
| [v0.1.1 host-tool patch](https://github.com/OthmaneBlial/bitborn/releases/tag/v0.1.1) | ✅ Published; comment/failed-write checks and downloaded artifacts verified |
| Shared CPU model: flags, calls, stack and segmented memory | ✅ Locally verified; modern PUSH SP semantics checked in real QEMU |
| Full editable 512-byte boot-sector builder | ✅ Chrome-tested; exact downloaded image/source boot the one-bit edit in QEMU |
| Visual CPU lab: registers, flags, stack, memory and breakpoints | ✅ Six literal teaching programs; controls and memory exercise verified in Chrome, Firefox and WebKit |
| 22 challenges across four levels | ✅ Twenty bit-edit puzzles plus two measured optimizations; native and model goals, locked setup, distinct alternatives, size budgets and local completion checks |
| [Measured optimization puzzles](docs/tutorials/optimization.md) | ✅ 14 → 12 and 11 → 10 payload bytes, each with two reviewed encodings; explicit flags/stack tradeoffs, 26 curated QEMU cases and independent byte boundaries |
| Eight dedicated `.io` routes and a size-comparison lab | ✅ Public; expanded Linux CI and live builder checks passed |
| Original 12-byte exit versus 8-byte alternative | ✅ Both return 42 in Linux CI; 132→128-byte ELF sizes, no speed claim |
| New browser GIFs, showcase and contributor issue forms | ✅ Genuine captured states with provenance; contributor files checked |
| Native shell and separately authored disk app | ✅ Nine commands, real RAM/register snapshots, checked disk load and repeated return in QEMU |
| 32-bit protected mode and software interrupt | ✅ GDT, flat memory, IDT gate and IRETD verified in QEMU; native captures recorded |
| Packaging and boundary correctness | ✅ Source aliases/collisions/corrupt derived files rejected; 16-bit IP wrap tested |
| CPU Lab memory-change journal | ✅ Full-memory oracle and Chrome checks pass; whole-RAM copying/scanning removed from each step |
| Binary Time Machine | ✅ Exact recorded-state Back/Forward, forks and halt restoration pass model and three-browser checks |
| Recorded execution timeline | ✅ Select any recorded state; keyboard range controls and net RAM changes pass Chrome/Firefox/WebKit checks |
| Browser/CLI literal source parity | ✅ Seeded cases check identical bytes/error lines, Unicode line boundaries and initial UTF-8 BOM handling |
| Arithmetic flag properties | ✅ Independent ripple-carry oracle, seeded 16-bit arithmetic and exhaustive 8-bit TEST masks; IF/DF and INC/DEC carry preserved |
| Contributor policies and source map | ✅ Conduct contact and private GitHub vulnerability reporting available; focused setup/check commands documented |
| Introductions in eight languages | ✅ Shared literal example/quickstart and English-source freshness checks; detailed guides remain in English |
| Localized `.io` introductions | ✅ Source-generated pages, language links/SEO metadata, mobile and keyboard checks; Arabic prose and LTR code verified in three browsers |
| Reproducible model benchmark | ✅ Fixed reviewed workload, source/environment hashes and measured distributions; no native x86 speed claim |
| Atomic packed-file output | ✅ Injected sync/rename failures preserve previous files and clean staging; source aliases and non-file outputs rejected |
| Mode-aware instruction inspection | ✅ Explicit 16/32/64 context, 66/REX fields and exact imm64; independent disassembly goldens and three-browser checks; simulation remains 16-bit |
| Register-to-register MOV microscope | ✅ Direction/width and ModR/M selectors, 8/16/32/64 operands, REX high-byte rules; 9,728 combinations and 18 independent disassembly goldens; wider forms remain inspection-only |
| [Modeled register copies](docs/architecture/register-mov.md) | ✅ Unprefixed 8-/16-bit forms, aliased byte preservation and history; 2,048 independent oracle cases plus seven native QEMU copy/flag checks |
| [16-bit memory-address microscope](docs/instruction-encoding/memory-addressing.md) | ✅ ModR/M fields, default DS/SS, signed displacements and absolute offsets; 5,888 cases and a native load/store/FLAGS probe; inspection reads no RAM |
| Memory MOV execution and shared exercise | ✅ 2,304 independent load/store cases, exact journals, boundaries and rewind; one canonical 71-byte exercise matches native registers/RAM/defined flags in QEMU |
| [Mode-aware bit diff](docs/bit-diff.md) | ✅ Exact offsets/bit flips, added/removed bytes and unchanged bytes with changed field roles; stops classification at scope errors; 500 seeded oracle comparisons; read-only |
| [Structured source diagnostics](docs/source-diagnostics.md) | ✅ Stable codes and one-based line/token locations agree across Python/JS; optional CLI JSON errors preserve readable defaults and failed-write safety |
| [Native harness failure paths](docs/qemu-harness.md) | ✅ Startup cleanup, absolute QMP deadlines and bounded termination/kill waits; real stderr-flood and termination-resistant child checks |
| [Signed and unsigned comparisons](docs/signed-comparisons.md) | ✅ All 16 short Jcc conditions, 131,072 flag/displacement cases and 3,384 operand-order comparisons; exact 95-byte overflow exercise agrees with QEMU and rewinds/replays |
| [Carry and borrow arithmetic](docs/carry-borrow.md) | ✅ Byte/word ADC and SBB, 270,736 ripple-oracle cases and AH/IF/DF preservation; exact 81-byte multiword exercise plus eight native FLAGS samples |
| [Canonical CPU teaching sources](docs/cpu-lab/README.md) | ✅ All six presets come from `.bits` files; editor/reference identity, original bytes, bounded build inputs and loaded-preset source links verified |
| [Native one-bit self-modification](examples/self-modifying/README.md) | ✅ One writer bit changes one future operand bit and A→a; both literal controls match model/QEMU registers, code RAM, serial and VGA; actual native capture and immutable source/image checks |
| [Native one-bit palette surgery](examples/vga-bitmap/README.md) | ✅ 142 authored bytes draw an 8×8 bitmap; one DAC bit changes all sixteen green pixels while all 64,000 framebuffer indices stay identical; actual screen/GIF proof and explicit browser graphics rejection |
| [Explicit pre-BIOS boot stacks](examples/self-modifying/README.md) | ✅ Seven reviewed boot/control headers establish SS:SP with interrupts masked during setup; self-modifying sources now use 82 bytes and retain native/model one-bit proof at offsets 52/61 |
| [CPU indicator readability](docs/indicator-readability.md) | ✅ Tablet bit rows fit their register cells; bit/flag labels stay at least 9px; 11,072 computed samples per browser across four widths/eight states pass contrast, geometry and non-color change-cue checks |
| [Execution scope and proof](docs/execution-scope.md) | ✅ Contributor guide separates 16/32/64 inspection, bounded 16-bit execution, BIOS/Linux targets and the checks needed for each claim |
| [One-bit debugging lesson](docs/tutorials/repair-direction.md) | ✅ Follow the wrong store addresses, flip CLD→STD, then check the failing seed and repaired literal bytes in both the model and QEMU; genuine browser repair recording |
| [Execution keyboard controls](docs/cpu-lab/keyboard.md) | ✅ Visible shortcut switch preserves state and native buttons; editable/composing/repeated keys are ignored; manual steps report location and automatic ticks keep the live status quiet |
| [Keyboard workflow regression](docs/cpu-lab/keyboard.md) | ✅ Tab/Shift+Tab traversal and Enter activation, timeline Arrow/Home/End with retained focus, invalid-token selection and labeled raw import pass three engines; macOS WebKit uses native Option+Tab; OS picker and live assistive technology remain separate |
| [Literal address references](docs/address-references.md) | ✅ bitinspect checks explicitly declared absolute/far/relative fields, including six original boot references; exhaustive word/displacement/alias checks, bounded reads and no byte rewriting |
| [Experiment reference maps](docs/address-references.md#native-experiments-and-an-independently-loaded-fragment) | ✅ Shared maps check both self-modifying and VGA controls; a 7E00-loaded CALL/RET map accepts the solution and rejects its broken seed |
| [Safe inspection annotations](docs/inspection-annotations.md) | ✅ Typed ranges, non-overlap and literal bits are checked before rows print; bounded JSON, structured errors and escaped terminal controls preserve readable Unicode |
| [Linux syscall instruction fields](docs/instruction-encoding/linux-syscalls.md) | ✅ Seven exact native payload slices, sign-extended 64-bit PUSH and low-register PUSH/POP fields; ABI explanations and independent goldens; browser execution stays disabled |
| [One byte, one word, one branch](docs/tutorials/byte-order.md) | ✅ Interactive learning path connects bit weights, little-endian immediates and signed branch targets from six handwritten bytes; all word/displacement values and three browser engines checked; [actual browser recording](assets/byte-order-demo.gif); inspection only |
| [Guided stack and call lesson](docs/tutorials/stack-and-calls.md) | ✅ Inspect saved values and return addresses through nine verified checkpoints; full RAM/state rewind and replay, retained POP bytes, native challenge load-address differences, browser memory checks and [actual CALL rewind footage](assets/cpu-lab-demo.gif) |
| [Carry, overflow and undefined flags](docs/tutorials/flags.md) | ✅ Guided flag checkpoints, signed/unsigned boundary comparison, low-byte parity and AF=? replay; two reviewed QEMU programs check all six defined ADD flags against expected masks and the model |
| [Guarded native allocator](examples/bounded-allocator/README.md) | ✅ 220 literal bytes, five native-written request logs in each of two boots, exact-fit ownership, zero/exhaustion/wrap rejection, both guards and immutable code/disk checks; same sources agree with the model after 135/137 steps and every RAM/state checkpoint rewinds/replays; one fixed arena, no free or memory isolation |
| [Word-register ADD execution](docs/architecture/register-add.md) | ✅ Both unprefixed register-direct directions, 128 selector combinations, 160,896 independent arithmetic cases and six native result/defined-flags probes; aliases, SP, IF/DF and strict unsupported-form state preservation checked; wider forms remain unsupported |
| [Native timer IRQ and one-bit EOI failure](examples/timer-irq/README.md) | ✅ 568 literal bytes remap PIC/PIT IRQ0 to a protected-mode gate, record actual frames and return with IRETD; controls produce 3/2 entries or one blocked entry with ISR/pending-request proof; guards, unused slots, stack and immutable instructions/images checked; no browser hardware or timing claim |
| [Native paging and exact fault retry](examples/paging/README.md) | ✅ 424 literal bytes build and inspect all 2048 directory/table entries, record #PF error 3 and CR2, repair PTE.RW, use INVLPG and retry the unchanged store; PTE/WP one-bit controls avoid the fault, with retained frames and code/image integrity; no browser paging or isolation claim |
| [Shared legacy exception frames](examples/exception-dispatch/README.md) | ✅ 736 literal bytes normalize error/no-error entry, preserve PUSHAD context and DF, distinguish fault/trap EIP and guard four records; four native vectors, three one-bit controls, twenty mapped slots and actual snapshots; other delivery and general recovery remain unverified |
| [Bit Hunt native text game](examples/bit-hunt/README.md) | ✅ 492 literal bytes, real keyboard movement, walls, star, sticky win, restart and quit; independent VGA/state checks, 260-move saturation, one-bit no-victory control and twenty pixel-exact QEMU frames; browser play and hardware remain unverified |
| [Short branch field microscope](docs/instruction-encoding/short-branches.md) | ✅ Condition group/inversion and signed rel8 roles in 16/32/64 inspection; 12,288 cases and six new independent goldens; runtime state stays unchanged |
| [Keyboard instruction-bit editing](docs/instruction-encoding/keyboard.md) | ✅ One Tab stop, arrows, row/global Home/End, Enter/Space and stable edit focus; fixture shortening preserves selector focus and navigation never executes bytes |
| [Actionable source errors](docs/source-diagnostics.md) | ✅ Exact UTF-16 token/excess-byte ranges, 704 location cases and focused binary/hex selection; invalid drafts preserve loaded state/history and corrections clear stale errors |
| [Bit comparison error recovery](docs/bit-diff.md) | ✅ Both invalid sides are identified; failed notation conversion focuses/selects the first offending token while keeping drafts, notation and the last valid comparison |
| [Clean-checkout reproduction](docs/reproduction.md) | ✅ Fresh remote checkout passes install, 77 Python tests and all site/model checks; all 88 artifact hashes match across two builds with a clean Git tree; macOS native-Linux skip is explicit |
| [Print-friendly lessons](docs/printing.md) | ✅ Manual, learning path and eight introductions use white paper, readable unchanged code, RTL/LTR direction and exact source attribution; print checks and actual PDF QA captures |
| CPU Lab program downloads and imports | ✅ Exact loaded .bits/.bin bytes, 512-byte boundary, self-modification distinction and delayed-import protection pass three-browser checks |
| Share loaded CPU Lab programs | ✅ Versioned URL fragments preserve 1–512 loaded bytes and open paused; 1,000 seeded round trips, malformed-link preservation, history navigation and clipboard fallback verified in three browsers |
| Binary and hexadecimal drafts | ✅ Literal byte views, explicit hex loading and comment preservation; all byte values and 1,000 seeded round trips pass; CLI .bits remains binary |
| ELF anatomy explorer | ✅ Six checksummed files, exact entry/segment mapping, bounded local inspection and 2,000 seeded mutations; three-browser keyboard/mobile checks; no imported code execution |
| Reviewed build preflight | ✅ Manifest types/options, regular source files, source/output aliases and every payload/package checked before writes; malformed later targets preserve previous artifacts |
| [Native divide-fault research](docs/architecture/divide-fault.md) | ✅ 70 literal bytes: real-mode #DE frame, divisor repair and same-instruction retry checked in QEMU; unrepaired divisor faults repeatedly |
| [Protected-mode fault research](docs/architecture/protected-fault.md) | ✅ 200 literal bytes: actual UD2/#UD gate, saved EIP adjustment, IRETD and CPU-managed descriptor accessed bits checked in QEMU; one controlled fault only |
| [Native selector error-code research](docs/architecture/selector-fault.md) | ✅ 256 literal bytes: #GP selector code, extra frame doubleword, preserved DS and correct IRETD stack cleanup checked in QEMU; one invalid load only |
| [v0.3.0 release and provenance](https://github.com/OthmaneBlial/bitborn/releases/tag/v0.3.0) | ✅ Exact-commit CI passed; all 14 public files re-downloaded anonymously, bytes/checksums and source/artifact provenance verified |
| [v0.4.0 release](https://github.com/OthmaneBlial/bitborn/releases/tag/v0.4.0) | ✅ Main/tag CI passed; independent source archive passes 92 tests and three-browser checks; all 31 public files, 30 checksums and 90 artifact hashes verified |
| [v0.2.0 release](https://github.com/OthmaneBlial/bitborn/releases/tag/v0.2.0) | ✅ Public; all 13 files re-downloaded anonymously, exact bytes and checksums verified |
| User-mode isolation, general exception/NMI/APIC handling and physical hardware | Future research; no working claim |


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

- [x] Compare exact program bytes and instruction-field roles in explicit modes.
  Distinguish flipped bits, added/removed bytes and reinterpretation of unchanged
  bytes; stop linear classification at the first scope error. 500 seeded bit-string
  oracle cases and browser keyboard/conversion/preservation/boundary checks pass.

- [x] Execute unprefixed byte/word ModR/M memory MOV with one shared address
  decoder. 2,304 cases cover load-base aliases, byte halves, flags and journals;
  segment-limit errors are atomic and A20/self-modification rewind is checked.
  A canonical 71-byte sixth CPU Lab exercise matches native QEMU state and RAM.

- [x] Inspect 16-bit memory MOV address fields, BP-derived SS versus DS,
  signed disp8/disp16 and absolute r/m6. 5,888 cases and three independent
  disassembly goldens pass; the expanded 70-byte native probe distinguishes
  DS/SS loads, word/high-byte stores and unchanged sampled FLAGS. The model now
  executes unprefixed byte/word forms; wider/overridden addressing remains outside scope.

- [x] Execute unprefixed register-direct 8-/16-bit MOV in the model: 2,048
  independent byte-layout cases, aliased bytes, preserved nullable flags and
  exact undo/replay. A 48-byte native fixture verifies seven copies, actual
  sampled FLAGS preservation, restored stack and literal code identity in QEMU.

- [x] Inspect register-direct MOV 88/89/8A/8B with direction/width bit roles,
  ModR/M selectors, 66/REX precedence and high-byte/REX byte-register names.
  9,728 register/context/prefix combinations and 18 independent NDISASM goldens
  pass. Memory and wider/prefixed execution forms remain outside scope.

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
- [x] Publish stable source diagnostic codes and one-based line/token locations
  across Python and JavaScript, retaining readable errors and unchanged grammar.
  CLI operational errors support optional JSON; parser parity, browser limits and
  failed-write preservation are tested. See [diagnostics](docs/source-diagnostics.md).
- [x] Verify native harness resource ownership on startup/protocol failures;
  bound QMP event/partial-line replies and both process shutdown waits. Real
  child processes prove stderr pipe blockage is avoided and kill/reap works.
  Temporary logs remain uncapped; see [harness scope](docs/qemu-harness.md).
- [x] Execute all sixteen short conditional branches, including signed
  JL/JGE/JLE/JG and unsigned JA/JBE. Exhaust flag/displacement combinations,
  independently compare signed/unsigned operands, check IP wrap and history,
  and run the same 95-byte overflow/equality exercise in QEMU and the CPU Lab.
  Near/prefixed/wider forms remain outside scope; see [lesson](docs/signed-comparisons.md).
- [x] Add byte/word immediate ADC/SBB with incoming carry/borrow, complete status
  flags and byte alias preservation. Exhaust byte operands, seed boundary words,
  and compare the same 81-byte multiword exercise with QEMU. Eight additional
  native FLAGS samples have an independent integer oracle. See [lesson](docs/carry-borrow.md).
- [x] Derive all six CPU presets from canonical `.bits` files, preserving original
  bytes and adding instruction comments. Verify exact text/reference copies and
  bounded regular-file inputs; link loaded byte-identical presets to their source.
  See the [canonical program guide](docs/cpu-lab/README.md).
- [x] Add a reviewed 82-byte native self-modification example and separate literal
  one-bit control. Verify the exact live-code operand change, defined flags,
  registers, serial/VGA and unchanged source/read-only images against the model.
  Capture actual native cells from separate boots and expose source/image guides.
  Current build: 56 reviewed targets, 88 artifacts and 15 gallery entries; immutable
  v0.3 release downloads remain unchanged. See [experiment](examples/self-modifying/README.md).
- [x] Explain short Jcc condition-group, inversion and signed displacement bits
  in 16/32/64 inspection. Check all 12,288 encodings and six independent
  disassembly goldens; browser complement/sign edits preserve runtime state.
  Execution stays 16-bit; see [field guide](docs/instruction-encoding/short-branches.md).
- [x] Add shared roving keyboard focus to the homepage/playground instruction
  editors: one Tab stop, bit/byte arrows, row/global Home/End and native toggle
  keys. Test focus retention, invalid encodings and fixture shortening. Broader
  assistive-technology review remains open; see [keyboard guide](docs/instruction-encoding/keyboard.md).
- [x] Add exact token ranges and CPU Lab editor focus for invalid binary/hex
  loads, including excess bytes and imported newline normalization. Keep inline
  validation non-disruptive, preserve loaded state/history and clear corrected
  errors. 704 range cases complement parser parity; see [diagnostics](docs/source-diagnostics.md).
- [x] Identify both invalid bit-comparison drafts and focus/select the first
  offending token on failed notation conversion. Keep typing focus, original
  drafts/notation and the last valid comparison; corrected sides clear their
  own markers. See [comparison error recovery](docs/bit-diff.md).
- [x] Verify a fresh remote checkout with dependency installation, Python and
  site/model checks, all 88 artifact hashes across two builds, and an unchanged
  tracked source tree. Record source/environment and platform-specific gates in
  the [reproduction recipe](docs/reproduction.md).
- [x] Add print styles for the manual, learning path and eight introductions:
  white paper/margins, unchanged readable code, Arabic RTL/LTR boundaries and
  actual source URLs. Print-media checks and real PDF captures complement visual
  QA; physical printers remain untested. See [printing](docs/printing.md).
- [x] Draw a native VGA bitmap from manually authored pixel and instruction bytes.
  Change one DAC operand bit while preserving all 64,000 framebuffer indices;
  verify complete QEMU screen pixels, initialized registers and immutable source/
  disk. Capture actual native states and keep browser graphics rejection explicit;
  see [palette surgery](examples/vga-bitmap/README.md).
- [x] Establish the self-modifying example's stack before its first BIOS call and
  restore its data segment afterward. Audit all seven reviewed standalone boot/
  control headers from perturbed model entry registers, retain later STI behavior,
  and refresh literal addresses, native/model proof and capture provenance.
- [x] Fix squeezed tablet register-bit rows and check CPU indicator contrast,
  local bounds and non-color change cues at 1440/768/390/320px. Include carry,
  undefined AF, stack/memory writes and timeline overlap. The scoped checks do
  not certify the whole site; see [indicator readability](docs/indicator-readability.md).
- [x] Link a shared [execution-scope guide](docs/execution-scope.md) from the README,
  contributor guide, CPU presets and website manual, with encoding boundaries,
  simplified BIOS/I/O behavior and explicit proof levels.
- [x] Add a [one-bit debugging walkthrough](docs/tutorials/repair-direction.md)
  with the actual failing direction seed, intermediate modeled write addresses,
  both native controls and genuine browser repair frames.
- [x] Add [execution-keyboard guidance](docs/cpu-lab/keyboard.md), a visible
  shortcut switch and editable/composition guards. Preserve native buttons and
  loaded state; report manual-step locations without live-status timer spam.
  Live assistive-technology review remains a separate gate.
- [x] Add [literal address-reference checking](docs/address-references.md) to
  bitinspect: explicit segment/origin assumptions, six original boot fields,
  exhaustive word/displacement/alias tests, bounded read-only inputs and no fixups.
- [x] Harden [inspection annotation metadata](docs/inspection-annotations.md) with
  typed ranges, literal-bit matches, bounded regular JSON, terminal-safe text and
  structured errors before rendering, while preserving all canonical annotations.
- [x] Add explicit [experiment/fragment reference maps](docs/address-references.md)
  for both self-modifying and VGA controls plus the 7E00-loaded CALL/RET solution.
  Reject corrupted operands and the wrong CALL seed without rewriting bytes.
- [x] Explain [Linux syscall setup](docs/instruction-encoding/linux-syscalls.md)
  through seven canonical native payload slices and unprefixed 64-bit stack fields.
  Check sign extension, register selectors and ABI text with independent goldens
  and three-browser state/disabled-execution checks; no 64-bit model added.
- [x] Prepare v0.4 version/notes and explicit staging for all nine BIOS images,
  actual native crops/GIFs, six browser recordings, source/artifact archives and
  deterministic provenance. Older staging archives are rejected without overwrite.
- [x] Publish and re-download [v0.4.0](https://github.com/OthmaneBlial/bitborn/releases/tag/v0.4.0)
  at immutable `c8d151b62ff7c6ec5c6124087f3a3e75f3d9ab6d`, after main CI
  `38344949598` and tag CI `38345402463` passed. Independent archive reproduction
  passes 92 Python/native tests (one macOS Linux skip), site and three-browser
  checks; all 90 rebuilt artifact hashes, 31 anonymous downloads and 30 checksums
  match staged provenance. Preparing the same source twice produces identical bytes.
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

- [x] Add a [flags lesson](docs/tutorials/flags.md) separating carry, signed
  overflow, low-byte parity and undefined AF. Validate all published checkpoints,
  accessible question-mark replay and two native/model ADD condition masks.

- [x] Add a [guided stack/call lesson](docs/tutorials/stack-and-calls.md) using
  the existing 13-byte preset: saved words, instruction-end return addresses,
  retained POP memory and exact recorded RAM rewind/replay. Keep native challenge
  evidence at 7E00 separate from the preset's 7C00 model trace.

- [x] Add a [progressive byte-order lesson](docs/tutorials/byte-order.md) to the
  learning path: linked byte edits, immediate-byte swaps and signed branch targets,
  with complete word/displacement checks and keyboard/browser regression coverage.
  The six-byte learning fragment remains read-only inspection, without native claims.

- [x] A bounded allocator with explicit memory-map evidence: one real-mode arena,
  five requests per native boot, one request-bit control and unchanged guards.
  See [the ownership and scope guide](examples/bounded-allocator/README.md).
- [x] Controlled legacy paging with both complete structures inspected,
  a supervisor write #PF, PTE repair and same-instruction retry in QEMU.
- [ ] User-mode protection and independent process address spaces.
- [x] Controlled PIC/PIT IRQ0 delivery to a protected-mode gate in QEMU,
  with native frame logs, IRETD and a wrong-EOI port control.
- [ ] General exception/NMI/APIC handlers and physical interrupt hardware.
- [ ] Physical-hardware calibration and broader boot compatibility.

These experiments require separate bootable targets, byte explanations and actual
execution tests before appearing as completed capabilities. No hardware, UEFI,
security, performance or production-OS compatibility is promised.
