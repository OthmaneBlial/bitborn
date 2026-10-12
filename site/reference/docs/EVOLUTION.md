# Evolution backlog and execution record

This is the working backlog for the autonomous evolution session. It records
possible improvements, not promises or implemented capabilities. Canonical
executable instructions remain literal `.bits`; host tooling never assembles them.

## Current execution record

Baseline: clean `main` at `8c0ae14`; 37 Python tests (one macOS native-Linux skip),
55 reviewed targets and 86 public build artifacts. Native instruction bytes
remain unchanged throughout these host/browser milestones.

| Improvement | Pushed commit | Verification |
| --- | --- | --- |
| Changed-RAM journal | `94e6026` | Independent full-memory oracle, full boot and presets |
| Exact Back/Forward and forks | `cebcd95` | Registers, flags, RAM, outputs, halt, A20 and self-modification round trips |
| Browser/CLI parser parity | `ada41c5` | 658 seeded accepted/rejected sources and identical error lines |
| Arithmetic properties | `6e73fa0` | 81,691 instructions; independent bitwise flags oracle |
| Contributor policies/source map | `f0cef18`, `e940885` | First CI caught a stale copy; correction CI/Pages passed; private reporting enabled |
| Eight maintained introductions | `8d73fa5` | Source hashes, identical code/commands and links |
| Recorded timeline | `634f036` | Net-RAM/state oracles, keyboard and three browsers |
| Localized website pages | `1628dda` | Arabic RTL/LTR code, metadata, keyboard and 320px checks in three browsers |
| Reproducible model benchmark | `771eed8` | Source/environment/workload hashes, checked outputs and retained CI JSON |
| Atomic packed-file output | `5fc5482` | Injected sync/rename failures, cleanup, links and modes |
| Scoped 16/32/64 inspection | `09f5f2c` | Exact imm64, independent NDISASM goldens, three-browser context/bit changes |
| Exact program download/import | `810182a` | Actual bytes, state/history preservation, 512-byte boundary and reproduced stale-read/error cancellation |

All corrected milestones above passed exact-commit CI and Pages. The current
46 Python tests pass locally with one expected macOS skip. Generated documents,
literal sources and assets are checked byte-for-byte. Four browser GIFs carry
actual frame/source hashes, including loaded HTML/CSS and literal fixtures.

Public checkpoint `810182a`: CPU Lab, its module, playground, inspector, Arabic
introduction and progress feed match anonymous HTTPS downloads exactly. Live
Chrome repeats actual program downloads/imports and delayed-read checks. The
shared Pages mirror `f812c119` changed only 60 paths under `bitborn/`; its deployment
passed. Twenty relevant repository topics and the canonical homepage are verified.

Binary/hex drafts are pushed in `c836b9e`: every byte value, 1,000 seeded round
trips and three-browser draft/loading/state checks pass. Binary comments are
retained until explicit hex loading. CLI binary syntax remains unchanged.

Published v0.3 at `8bc0797d6f8ef97126e0fcba652ed25a20b07fe6` after exact-commit CI
`38301698299`. Repeated preparation is byte-identical; all 14 public assets were
anonymously downloaded and match staged bytes, all 13 checksums pass, and source/
artifact provenance matches. All 55 native source files and seven BIOS images are
identical to immutable v0.2. Staging rejects unknown files and aliases before writing.

Completed next: read-only ELF64 anatomy, six actual artifacts/payloads, exact
entry/segment mapping, 2,000 seeded mutations and three-browser import/mobile
checks. Manifest validation now checks types/options, references and resolved
output aliases, and preflights every source/package before writes. The ELF
milestone is committed as `c9c0bf4`; CI `38304983340`, deployment `38305254803`
and actual public browser checks pass. Website bytes match that commit. Build
preflight is committed as `c8418f8` (49 Python tests, one expected macOS skip;
native output hashes unchanged). A 70-byte real-mode divide-fault probe now verifies
the real saved frame and repaired-instruction retry with divisors 1/2, plus repeated
faults without repair (`422e21b`, 51 Python tests, one expected macOS skip).
A separate 200-byte protected-mode UD2 fixture now proves vector-six fault entry,
original/adjusted saved EIP, IRETD, stack restoration and CPU-managed descriptor
accessed bits (`85ccc5d`, 53 Python tests, one expected macOS skip). A separate
256-byte selector #GP fixture verifies the CPU-pushed error code, unchanged DS,
four-doubleword frame and error-code removal before IRETD. Next: bounded general
dispatch; skipping two specific known instructions is not general recovery.
Source directories and FIFOs are now rejected before opening data, preventing
named-pipe stalls in build preflight.
CPU Lab links now encode 1–512 original loaded bytes in strict versioned fragments
and open paused. Independent seeded round trips and three-browser checks verify
malformed-link preservation, actual network requests, navigation, self-modification,
clipboard fallback and newer-link cancellation of an older delayed import.
The new module passes all byte values and 1,000 seeded round trips. CPU browser
checks pass Chromium, Firefox 157 and WebKit 27.2, including 320px controls; the
recaptured CPU demo has 20 actual frames with current source/frame/GIF hashes.
The full 55-test Python suite and all site checks pass locally (one expected
native-Linux skip on macOS). Program-link commit `8bbacf0` passed exact CI
`38308109352` and deployment `38308406221`; its public module, CPU HTML and app
match committed bytes. Register-direct MOV inspection now covers direction/width,
8/16/32/64 operands, REX extensions and high-byte remapping: 9,728 combinations
and 18 independent NDISASM goldens pass. Native payloads remain unchanged.
Chromium, Firefox 157 and WebKit 27.2 verify direction-bit edits, REX register
extensions, high-byte names, read-only state and 320px layout. The encoding demo
has 12 actual frames; source/frame/GIF hashes match current files. Local full
Python/site checks pass. MOV inspection commit `3c10777` passed CI `38309158481`
and deployment `38309496687`; public encoding module, presets and playground
match exact source bytes.
Unprefixed register-direct byte/word MOV now executes in the model. 2,048
independent byte-layout cases, full-RAM journal checks and undo/replay pass; a
48-byte literal QEMU fixture verifies seven word/byte copies, actual FLAGS
preservation and guest code identity. Wider/prefixed and memory forms remain
outside execution scope. Native release payloads are unchanged.
All three browsers also verify modeled copies and preserved displayed flags;
the CPU Lab rewinds/replays an aliased-byte copy. The full Python suite now has
56 tests (one expected macOS native-Linux skip), and all site/module checks pass.
Encoding/CPU recordings contain 13/24 actual frames, with current source/GIF
hashes including the capture script. Publication of the execution milestone is pending.
Current local validation: 55 Python tests, one expected native-Linux skip on
macOS, plus all site/module checks. Protected-fault commit `85ccc5d` passed CI
`38306047118` and deployment `38306395884`; public progress, README and its guide
match exact source bytes. Selector-fault commit `489cf88` passed CI `38306524717`.
Regular-source preflight commit `8edbc4c` passed CI `38306711217`; deployment
`38306948327` actually checked out that exact source commit (workflow-run display
heads can instead identify the default branch at trigger time). Eleven public
files match local bytes: progress, README, roadmap, changelog, binary-format guide,
all three exception guides and the ELF page/module/catalog. Website mirror
`2014270` changes only the protected `bitborn/` child folder; repository metadata
still has 20 relevant topics and the canonical `.io` homepage.
The six native ELF payloads and
seven BIOS images have not changed; these exception fixtures are research tests.
Risks: inspection supports a documented subset; execution remains the bounded
16-bit model. Native-speaker review, hardware, paging and general interrupts
require separate evidence. Detailed technical guides remain English.

## Prioritized ideas

Impact and feasibility are H/M/L. Priority 0 protects correctness; priority 1
adds useful capability; priority 2 improves education and contribution; priority 3
is deeper research. Dependencies name earlier idea numbers or existing components.

| ID | Priority | Improvement and completion evidence | Impact | Feasibility | Dependencies | Risk | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 01 | 0 | Record changed RAM bytes; compare with an independent full-memory oracle | H | H | Existing model | Low | Complete |
| 02 | 1 | Binary Time Machine: undo/redo every recorded register, flag, RAM and output transition | H | H | 01 | Medium | Complete |
| 03 | 0 | Seeded binary parser properties and Python/JS token-syntax parity | H | H | Existing parsers | Low | Complete |
| 04 | 0 | Arithmetic flags fuzzing against independent signed/unsigned oracles | H | H | Existing model | Medium | Complete |
| 05 | 1 | Opcode microscope with explicit 16/32/64-bit context and mode-specific fixtures | H | M | Intel references | Medium | Complete: scoped inspection; model execution stays 16-bit |
| 06 | 1 | Synchronize binary and hexadecimal input without generating instructions | H | H | Existing parser | Low | Complete: valid binary views and explicit hex loading |
| 07 | 1 | Explain opcode, register, ModR/M and immediate fields bit by bit | H | H | 05 | Medium | Complete for documented MOV/XOR/prefix subset |
| 08 | 1 | Export and re-import exact CPU Lab programs with cross-browser download proof | H | H | Existing builder export | Low | Complete |
| 09 | 1 | Share bounded CPU Lab programs through validated URLs | H | M | 03,08 | Medium | Complete: loaded bytes only, paused model, strict versioned fragment |
| 10 | 1 | Rewind branches and CALL/RET; verify stack and logical IP restoration | H | H | 02 | Medium | Complete |
| 11 | 1 | Rewind self-modifying code; restore the fetched instruction bytes | H | H | 02 | Medium | Complete |
| 12 | 1 | Visual execution timeline with keyboard selection and recorded-step replay | H | M | 02 | Medium | Complete |
| 13 | 0 | Replace failed file writes atomically so existing packed outputs survive I/O errors | H | M | Existing CLI | Medium | Complete |
| 14 | 0 | Validate manifest types, output aliases and packaging options before writing | H | H | Existing manifest | Medium | Complete: all-source/package preflight; no multi-file I/O transaction |
| 15 | 0 | Structured source diagnostics with stable error codes and source-line locations | H | M | 03 | Medium | Open |
| 16 | 1 | Address-reference inspector that checks literal pointers without resolving labels into code | H | M | Annotations | Medium | Open |
| 17 | 1 | Register-to-register MOV encodings with independent ModR/M fixtures | H | M | 05 | Medium | Complete: scoped inspection, 9,728 combinations and 18 disassembly goldens |
| 18 | 1 | Curated indirect memory operands with explicit segment-selection explanations | H | M | 17 | High | Open |
| 19 | 1 | Signed conditional branches and overflow examples with native QEMU proof | H | M | 04 | Medium | Open |
| 20 | 1 | Carry-aware arithmetic examples and native/model differential checks | H | M | 04 | Medium | Open |
| 21 | 1 | ELF anatomy viewer: headers, entry point, segment permissions and payload bytes | H | H | Existing ELF packaging | Medium | Complete: bounded ELF64 scope; no imported-code execution |
| 22 | 1 | Explain Linux syscall encodings in 64-bit inspection mode without host execution | H | H | 05 | Medium | Open |
| 23 | 1 | Literal native self-modification experiment with controlled halt and RAM proof | H | M | Existing BIOS loader | Medium | Open |
| 24 | 1 | Program gallery presets derived from canonical .bits instead of duplicated source | H | M | Site packaging | Medium | Open |
| 25 | 2 | Progressive interactive byte-order lesson: one byte, one word, one branch | H | H | Existing playground | Low | Open |
| 26 | 2 | Guided stack/calling-convention lesson with return-address inspection | H | H | 02,10 | Low | Open |
| 27 | 2 | Flags lesson separating signed overflow, carry, parity and undefined AF | H | H | 04 | Medium | Open |
| 28 | 2 | Meaningful bit-diff explanations tied to instruction boundaries and execution mode | H | M | 05,07 | Medium | Open |
| 29 | 2 | New optimization challenges with alternate valid solutions and actual size measurements | H | M | Challenge evaluator | Medium | Open |
| 30 | 2 | Curated broken-program debugging walkthrough with recorded repair and native proof | H | H | 02 | Low | Open |
| 31 | 2 | Stable English introduction as the maintained translation source | H | H | Existing README | Low | Complete |
| 32 | 2 | Simplified Chinese README/introduction and working command/link checks | H | H | 31 | Medium | Complete |
| 33 | 2 | Spanish README/introduction and working command/link checks | H | H | 31 | Medium | Complete |
| 34 | 2 | French README/introduction and working command/link checks | H | H | 31 | Medium | Complete |
| 35 | 2 | Japanese README/introduction and working command/link checks | H | H | 31 | Medium | Complete |
| 36 | 2 | Portuguese README/introduction and working command/link checks | H | H | 31 | Medium | Complete |
| 37 | 2 | German README/introduction and working command/link checks | H | H | 31 | Medium | Complete |
| 38 | 2 | Arabic README/introduction; preserve left-to-right code and verify RTL layout | H | M | 31 | Medium | Complete |
| 39 | 0 | Translation freshness manifest with explicit source revisions and consistency checks | H | H | 31–38 | Medium | Complete |
| 40 | 2 | Localized introductory site routes with lang/dir/canonical/hreflang metadata | H | M | 31–39 | Medium | Complete |
| 41 | 2 | Print-friendly lessons with readable code and source attribution | M | H | 25–27 | Low | Open |
| 42 | 0 | Keyboard accessibility regression for timeline, imports, controls and error focus | H | H | 12 | Low | Open |
| 43 | 0 | Contrast and narrow-screen checks for changed-bit and flag indicators | H | H | Existing CSS | Low | Open |
| 44 | 2 | Explicit shortcuts guide and screen-reader-friendly execution announcements | M | H | 12,42 | Low | Open |
| 45 | 2 | CODE_OF_CONDUCT with real, usable reporting paths | H | H | Maintainer/profile evidence | Low | Complete |
| 46 | 0 | SECURITY policy with scoped supported versions and verified private reporting | H | H | GitHub repository settings | Medium | Complete |
| 47 | 2 | Contributor source map and focused per-component development commands | H | H | Existing CONTRIBUTING | Low | Complete |
| 48 | 0 | Verify every generated documentation/source copy, including translation and trace fixtures | H | H | Site build | Low | Complete |
| 49 | 2 | Genuine Time Machine capture with source/frame provenance | H | H | 02,12 | Low | Complete |
| 50 | 0 | Reproducible host-model benchmark; distinguish rendering, interpretation and native execution | H | M | 01,02 | Medium | Complete |
| 51 | 0 | Release-provenance manifest tying reviewed source, packaged output and commit | H | H | Existing releases | Medium | Complete: v0.3 public bytes, checksums and commit verified |
| 52 | 0 | Clean-checkout reproduction and platform-specific validation documentation | H | H | CI | Low | Open |
| 53 | 3 | Real VGA bitmap experiment with manually authored pixel/instruction bytes | H | M | BIOS target | High | Open |
| 54 | 3 | Tiny text-mode game with deterministic input and genuine QEMU recording | H | M | Shell keyboard helpers | High | Open |
| 55 | 3 | Bounded native allocator with memory-map, ownership and overflow evidence | H | M | Protected-mode target | High | Open |
| 56 | 3 | Protected-mode exception handlers with controlled fault injection | H | M | IDT target | High | Partial: native #UD and selector #GP/error-code fixtures; general dispatch open |
| 57 | 3 | Timer IRQ experiment with explicit PIC setup and deterministic QEMU assertions | H | M | 56 | High | Open |
| 58 | 3 | Paging experiment with inspected page tables and deliberate page-fault evidence | H | L | 55,56 | High | Open |
| 59 | 0 | QEMU runner resource/error-path checks and bounded process cleanup | H | H | Existing Guest harness | Medium | Open |
| 60 | 2 | Accurate release/community draft showing actual new capabilities; no automatic posting | M | H | Verified release | Low | Complete: release published; community draft remains unposted |
| 61 | 0 | Cancel delayed file imports/errors after a newer source choice or editor draft | H | H | CPU Lab import | Medium | Complete: race reproduced and checked in three browsers |

Large tasks are divided into useful verified milestones. Native experiments only
become capabilities after literal source review and real QEMU checks; hardware
claims require hardware evidence. A backlog idea does not change the source rules.
