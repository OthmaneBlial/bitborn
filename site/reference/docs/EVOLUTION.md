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
four-doubleword frame and error-code removal before IRETD. Bounded general
dispatch remains open; skipping two specific known instructions is not general recovery.
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
hashes including the capture script. Execution commit `2214a4e` passed exact CI
`38310949876` and deployment `38311259747`; the public simulator, README, roadmap
and native register-copy guide match committed bytes.
16-bit memory MOV inspection now exposes the address table, default DS/SS,
signed displacement extrema and absolute r/m6. 5,888 cases and three additional
independent disassembly goldens pass; a 52-byte native probe verifies three
default-segment loads. Execution of these ModR/M memory MOV forms and wider
addressing remain outside scope; existing memory instructions are unchanged.
All three browsers verify displacement sign-bit edits, DS/SS explanations,
read-only state and narrow layouts. The full suite has 57 Python tests (one
expected macOS native-Linux skip); all site/module checks pass. The encoding
capture has 17 actual frames with current input/GIF hashes. Memory inspection
commit `b9c6bfc` passed CI `38313258408` and deployment `38313976017`; seven public
files match exact source bytes, including encoding/presets, playground, progress,
README, roadmap and the address guide. Its Pages mirror `d31f179` changes only
23 `bitborn/` paths; concurrent unrelated project commits were preserved.
The 13 October checkpoint records four shipped engineering milestones:
program links (`8bbacf0`), register inspection (`3c10777`), register execution
(`2214a4e`) and memory inspection (`b9c6bfc`). All exact-commit CI runs and live
site checks pass. Next: unprefixed 16-bit memory MOV execution, sharing one
address decoder and retaining journal/rewind/source identity guarantees; wider
addressing and general protected-mode fault dispatch remain separate work.
Unprefixed memory MOV execution now uses `site/address16.mjs` for the same address
table as inspection. 2,304 independent load/store/flag/journal cases cover old-base
aliases and byte halves; boundary tests cover A20, byte/word segment limits and
self-modifying code rewind/replay. The expanded 70-byte native probe samples all
FLAGS before/after memory copies with distinct high/low bytes. One canonical
71-byte program is copied into the sixth CPU Lab preset and run identically in
the model and native QEMU; all general/configured-segment words, RAM ranges and
defined flags match. Undefined AF is preserved as unknown, not compared as a value.
Local full validation passes 58 Python tests (one expected macOS native-Linux
skip) and all model/site checks. Chromium, Firefox 157 and WebKit 27.2 verify the
sixth preset, actual model RAM stores/loads, unchanged displayed flags and exact
memory rewind/replay. The CPU demo now has 29 actual frames with current source,
frame and GIF hashes. Memory execution commit `212ce77` passed CI `38316581716`
and deployment `38316847011`; its address decoder, simulator, canonical-preset
module and public README match exact committed bytes.
The new bit-diff workbench compares positional raw changes and mode-dependent
candidate instruction roles. Unchanged ModR/M bytes can be reinterpreted after
one direction-bit flip; additions/removals are not invented zero-byte flips.
Classification stops at the first scope error. 500 seeded bit-string oracle
cases and actual browser keyboard/notation/preservation/boundary checks pass.
Chromium, Firefox 157 and WebKit 27.2 all pass; 512-byte and 320px layouts are
verified. The new read-only diff demo has six actual frames. All six browser GIFs
have current source/frame/GIF hashes; full Python/site checks pass locally.
The encoding fixture corpus now includes 28 independent NDISASM goldens.
Bit-diff commit `fa6a377` passed CI `38318473918` and deployment `38318785744`;
the public homepage, diff route and comparison module match committed bytes.
Its Pages mirror `3dabda6` preserves the exact `bitborn/` folder boundary.
Structured parser diagnostics now preserve readable messages and existing error
types while exposing stable codes and one-based line/token positions. The seeded
658-case corpus compares byte results and structured rejection locations across
Python/JS. Optional CLI JSON, notation-specific/browser bounds and preservation
of output on parse failures are verified. Local full validation passes 59 Python
tests (one expected macOS native-Linux skip) and all site/module checks; actual
browser recordings were refreshed against current parser source hashes.
Diagnostics commit `8c90d86` passed exact CI `38319202525`; its Pages mirror is
`227c51c`. Anonymous live-file propagation is checked separately from the push.
The native harness now owns startup resources through an `ExitStack`, keeps
stderr out of a blocking pipe, bounds diagnostic excerpts and QMP response lines,
and applies absolute command deadlines even with events or fragmented replies.
Ten focused cases include real stderr-flood and termination-resistant host test
children; both are reaped. Terminate/kill waits are each bounded to five seconds.
All 69 Python tests pass locally (one expected macOS native-Linux skip), including
the native boot/fault/segment/memory probes, and all site/module checks pass.
Temporary logs remain uncapped; this harness is for curated verification.
Harness commit `470fa50` passed CI `38319571404` and deployment `38319844653`.
Its Pages mirror is `6aa899e`; the public parser, diagnostic guide and harness
guide were anonymously fetched and match committed bytes.
Signed and unsigned short branches now cover all sixteen Jcc conditions. An
independent flags/displacement oracle checks 131,072 cases; 3,384 operand-order
comparisons derive signed/unsigned relations without trusting model flags. The
same manually authored 95-byte overflow/equality exercise runs in the model and
QEMU, matching general/configured-segment words, IP and CMP-defined flags. Exact
history rewind/replay preserves the source and both taken/fallthrough paths.
The CPU Lab links its source and the recording adds five actual overflow frames;
all six GIFs retain current source/frame/GIF hashes. Wider/prefixed/near Jcc
variants remain outside scope. Full local validation passes 70 Python tests (one
expected macOS native-Linux skip), all site/model modules, and Chromium, Firefox
157 and WebKit 27.2 exercise checks. Next: carry-aware arithmetic and native/model proof.
Short-branch commit `dd917f5` passed CI `38320194131` and deployment `38320535844`.
Its Pages mirror is `37302bd`; the public simulator, CPU Lab, lesson and literal
exercise were anonymously fetched and match that exact committed milestone.
Byte/word immediate ADC/SBB now consume incoming CF without prematurely wrapping
the immediate plus borrow. Shared arithmetic flag handling retains existing
ADD/SUB/CMP/INC/DEC behavior. An independent ripple oracle checks 270,736 cases,
including all byte operands and both incoming bits; AH/IF/DF are preserved.
The same manually authored 81-byte program propagates carry/borrow across words,
stores byte-alias results, and matches QEMU general/configured-segment words,
IP, RAM and modeled flags. A separate native-only source uses PUSHF for eight
result/FLAGS pairs checked by an independent integer oracle; model PUSHF support
is not claimed. Local full validation passes 72 Python tests (one expected macOS
native-Linux skip), all site/model modules and Chromium/Firefox157/WebKit27.2
exercise checks. The CPU recording has 38 actual frames, including four new
carry/borrow states, with all six GIF/source hashes verified. Next: canonical
sources for every CPU teaching preset.
Carry commit `ddeff03` passed CI `38320950179` and deployment `38321242519`;
its Pages mirror is `f9e2b67`. The public simulator, lesson and literal exercise
were anonymously fetched and match exact committed bytes. GitHub retains 20
relevant topics and the canonical `.io` homepage link.
All six CPU presets now come from canonical `.bits` sources. The remaining five
inline programs retain their original bytes and add instruction comments. The
site build captures/validates one source snapshot, enforces file/text/byte bounds,
and writes identical module/reference text. Pure text parsing reuses the original
CLI grammar without changing readable errors. Source tests cover missing/FIFO/
external-alias inputs, Unicode limits and an edit between capture and validation.
Loaded byte-identical presets expose canonical source downloads; custom programs
hide them and invalid drafts retain the existing loaded source. Existing model
states, byte goldens and three-browser links/loads pass; recording provenance
includes every canonical preset source. All 76 Python tests pass locally (one
expected macOS native-Linux skip), along with all site/model checks. Next: a native one-bit self-modification
experiment with model/native RAM and output evidence.
Canonical-source commit `c189504` passed CI `38322149937` and deployment
`38322506173`; its Pages mirror is `bf7b4c7`. The existing native release
artifacts remained unchanged during that preset-source migration.
The new self-modification experiment has two manually authored 80-byte sources
differing only at writer byte 50, bit 5. One guest changes future operand byte 59
from 41 to 61, jumps and emits a; the control preserves 41 and emits A. Model and
QEMU match all general/configured-segment words, defined flags, code RAM, serial
and the VGA word; source and read-only disk images stay unchanged. Model history
restores exact code/output/RAM state. Native capture uses actual first VGA cells
from two separate boots, with full screenshots and source/image/frame/GIF hashes.
The reviewed manifest now has 56 targets and 88 artifacts; the gallery has 15
entries. The CPU Lab source download and bit-diff writer pair share those literal
files. Browser recording has 42 CPU frames and seven diff frames, explicitly
labeled as simulation/inspection. All 77 Python tests pass locally (one expected
macOS native-Linux skip), all site/model checks pass, and Chromium/Firefox/WebKit
verify live code writes, fresh fetch, output and exact undo/replay. Native GIF
self-checks verify visible/different frames and duration; hardware/SMP cache and
performance claims remain outside scope. Next: accessibility and precise
instruction-field explanations for changed code and source links.
Earlier protected-fault checkpoint: 55 Python tests, one expected native-Linux
skip on macOS, plus all site/module checks. Commit `85ccc5d` passed CI
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
| 15 | 0 | Structured source diagnostics with stable error codes and source-line locations | H | M | 03 | Medium | Complete: shared codes/line/token positions, optional CLI JSON and failed-write proof |
| 16 | 1 | Address-reference inspector that checks literal pointers without resolving labels into code | H | M | Annotations | Medium | Open |
| 17 | 1 | Register-to-register MOV encodings with independent ModR/M fixtures | H | M | 05 | Medium | Complete: scoped inspection, 9,728 combinations and 18 disassembly goldens |
| 18 | 1 | Curated indirect memory operands with explicit segment-selection explanations | H | M | 17 | High | Complete: 16-bit addressing inspection; default DS/SS verified natively; no memory execution |
| 19 | 1 | Signed conditional branches and overflow examples with native QEMU proof | H | M | 04 | Medium | Complete: all short conditions, full rel8/flag oracle and identical 95-byte native/model exercise |
| 20 | 1 | Carry-aware arithmetic examples and native/model differential checks | H | M | 04 | Medium | Complete: byte/word immediate ADC/SBB, 270,736 ripple cases, same 81-byte native/model program and eight native FLAGS samples |
| 21 | 1 | ELF anatomy viewer: headers, entry point, segment permissions and payload bytes | H | H | Existing ELF packaging | Medium | Complete: bounded ELF64 scope; no imported-code execution |
| 22 | 1 | Explain Linux syscall encodings in 64-bit inspection mode without host execution | H | H | 05 | Medium | Open |
| 23 | 1 | Literal native self-modification experiment with controlled halt and RAM proof | H | M | Existing BIOS loader | Medium | Complete: two literal 80-byte cases, one input/live operand bit, native/model state and serial/VGA proof; source/image unchanged |
| 24 | 1 | Program gallery presets derived from canonical .bits instead of duplicated source | H | M | Site packaging | Medium | Complete: all six CPU presets from canonical files, exact source/byte identity and loaded-source downloads |
| 25 | 2 | Progressive interactive byte-order lesson: one byte, one word, one branch | H | H | Existing playground | Low | Open |
| 26 | 2 | Guided stack/calling-convention lesson with return-address inspection | H | H | 02,10 | Low | Open |
| 27 | 2 | Flags lesson separating signed overflow, carry, parity and undefined AF | H | H | 04 | Medium | Open |
| 28 | 2 | Meaningful bit-diff explanations tied to instruction boundaries and execution mode | H | M | 05,07 | Medium | Complete: positional changes and linear field roles; no execution/control-flow/alignment claim |
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
| 59 | 0 | QEMU runner resource/error-path checks and bounded process cleanup | H | H | Existing Guest harness | Medium | Complete: resource unwind, QMP bounds/deadlines and actual child kill/reap; disk quotas remain outside scope |
| 60 | 2 | Accurate release/community draft showing actual new capabilities; no automatic posting | M | H | Verified release | Low | Complete: release published; community draft remains unposted |
| 61 | 0 | Cancel delayed file imports/errors after a newer source choice or editor draft | H | H | CPU Lab import | Medium | Complete: race reproduced and checked in three browsers |
| 62 | 1 | Execute unprefixed 16-bit ModR/M memory MOV using one shared address decoder and native/journal/boundary proof | H | M | 18,01,02 | High | Complete: 2,304 cases and identical model/native 71-byte exercise |

Large tasks are divided into useful verified milestones. Native experiments only
become capabilities after literal source review and real QEMU checks; hardware
claims require hardware evidence. A backlog idea does not change the source rules.
