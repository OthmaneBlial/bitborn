# Evolution backlog and execution record

This is the working backlog for the autonomous evolution session. It records
possible improvements, not promises or implemented capabilities. Canonical
executable instructions remain literal `.bits`; host tooling never assembles them.

## Current execution record

Permission matrix (2026-10-13): two independent literal ten-byte slots extend
the unchanged 712-byte template with private read and code-write probes. Hosts
copy those exact authored bytes into the declared slot without instruction
generation or relocation. Six actual boots prove denied/permitted private reads,
private writes and code writes. Denied reads report PF(5) and preserve EAX;
permitted reads return DEADBEEF without dirtying the private page. Denied code
writes report PF(7)/CR2 7E00; one writable bit permits exactly four bootstrap-byte
changes, without re-entering that already-executed code. Every case checks all
2,048 entries, dirty/accessed bits, privilege frames/return state, actual user
stack/data, source/TSS/loader RAM and unchanged source files/disk. Three focused
tests pass all six native cases; general process isolation remains unadvertised.
The full native suite passes 121 tests with one expected macOS native-Linux skip.

Page-boundary source `b885eaa` passes CI `38409259011` and deployment
`38410331344`. All five checked public README/roadmap/page-guide/evolution/
progress files match; mirror `9f5a601` changes only nine `bitborn/` paths.

User-page research (2026-10-13): 712 literal bytes build legacy identity paging
with explicit user code/stack/marker pages and a supervisor-only target word.
CPL-three write raises actual PF(7), CR2 B000, captures the six-word privilege
frame, preserves DEADBEEF and returns past only the authored ten-byte store.
A one-bit PTE user-permission control writes 11223344 instead with no PF log.
Both boots actually PUSH/POP the user stack and write user completion storage.
Two focused tests check all 2,048 entries, dirty bits, source/GDT/TSS integrity,
known/retained registers, exact original/repaired frames, CR0/CR3/CR4, kernel
selectors, loader RAM and read-only disk. Code-page read-only and other supervisor
mappings are structurally checked; negative read/code-write probes remain next.
The README roadmap summary is compact again, with detailed evidence kept in the
roadmap and linked guides.
The full native suite passes 120 tests with one expected macOS native-Linux skip;
the full site/model/doc suite and clean diff review pass.

Gate source `cf11316` passes CI `38406310057` and deployment `38407114411`.
All five checked live README/roadmap/gate-guide/evolution/progress files match.
Mirror `489f8e7` changes only nine `bitborn/` paths. This page-permission fixture
is a separate unreleased source milestone.

Ring-three research milestone two (2026-10-13): 696 literal bytes use the shared
loader, TSS and a DPL-three INT 20 gate to enter kernel code, record the actual
five-word privilege frame and selectors, preserve general registers/DF, and
return to the original user stack. One IDT attribute bit lowers gate DPL to two:
native #GP(0102) retains the original INT EIP and six-word frame, enters the
separate kernel stop and prevents the explicitly initialized after-call marker.
Four focused tests pass both gate boots and both prior HLT/CMC boots, independent
encoding/pointer goldens, retained frames/registers, source/TSS/loader RAM and
read-only disk checks. The service only logs its fixed call frame. Flat memory
remains shared; user/supervisor page permissions are the next native boundary.
The complete native suite passes 118 tests with one expected macOS native-Linux
skip; the complete site/model/doc checks and clean diff review pass.

First privilege source `e59c76f` passes CI `38403520153` and deployment
`38404381729`. All five checked live README/roadmap/privilege-guide/evolution/
progress files match that commit. Mirror `ab164e6` changes only eight `bitborn/`
paths. The new gate fixture is a separate unreleased source milestone.

Ring-three research milestone one (2026-10-13): 496 literal bytes enter CPL three
through an outward IRETD frame. HLT raises native #GP(0), selects TSS.SS0:ESP0,
records the actual six-word privilege/error frame and sampled kernel selectors,
then skips only the authored HLT and returns to the original user stack. A
single-bit F4-to-F5 CMC control removes the fault and explicitly changes CF.
Two focused tests pass both actual boots, independent pointer/opcode/descriptor
goldens, known overwritten/restored registers, retained PUSHAD/return frames,
DF/IF/IOPL, TSS busy bit, instruction/TSS RAM integrity and read-only disk.
Flat memory is shared. No syscall, arbitrary recovery or scheduling capability
is advertised; the remaining gate milestone stays open.
The full native suite passes 116 tests with one expected macOS native-Linux
skip; the complete site/model/doc suite and clean diff check also pass.

v0.5 documentation source `eb8ce2b` passes CI `38400548227` and deployment
`38401465173`; all eight checked public README/roadmap/notes/validation/community
draft/progress files match. Mirror `72cf90d` changes only eight `bitborn/` paths.

v0.5 publication (2026-10-13): immutable source `f5b444a` passes main CI
`38397864668` and tag CI `38398890607`. The exact source archive passes 114 Python
tests (one expected macOS native-Linux skip), site/model checks, Chromium and
complete Firefox 157/WebKit 27.2 checks. All 112 rebuilt artifact hashes match;
all 1,021 archived source files remain unchanged. Public release ID `411662730`
contains exactly 89 uploaded assets: each server digest and every anonymous
re-download matches staging. The 88 checksum entries cover all non-checksum
attachments. Tag `66061a3` resolves to the exact source; v0.4.0 remains unchanged.
README, notes, roadmap, validation and the unposted community draft now describe
the verified release. Live documentation publication is checked separately.

v0.5 preparation (2026-10-13): the existing release attachment list stopped at
nine primary BIOS images despite five newer native experiments. The next version
explicitly packages all fourteen primary images and seventy-one evidence files,
including actual registers, PIC state, paging structures, exception logs/stacks
and game captures. Native capture records are checked for missing packaged file
references. Notes retain precise proof boundaries. Public v0.4.0 is unchanged;
source/tag CI, clean-archive reproduction and anonymous download checks remain
required before declaring v0.5.0 published.
Local preparation checks pass 113 Python tests (one expected macOS native-Linux
skip), the complete site/model suite and unchanged capture-source hashes. These
do not substitute for the upcoming exact-archive and Linux/source/tag gates.
The first unpublished staging at `bd0034d` verifies all eighty-eight attachment
checksums and exposes a documentation count error: the release manifest selects
112 artifacts, including nested challenge outputs. Unreviewed root build files
are excluded. Release notes now use the measured manifest count; that initial
staging is retained separately and cannot be overwritten by the corrected source.
The same manifest recheck corrects recent game/dispatch/optimization execution
counts below. A release regression now checks the documented image, artifact,
evidence, total-file and checksum counts against the actual packaging inputs.

Release staging audit (2026-10-13): recognized filenames alone previously allowed
the release packager to overwrite a completed staging directory after source
changed without a version bump. Staging now checks the recorded version and source
commit before writing archives, images, evidence or checksums. An independent
temporary-directory test proves that different commits/versions leave every file
unchanged, while the same recorded revision remains eligible for deterministic
repacking. No published tags, assets, version or frozen staging bytes are changed.

Setup audit (2026-10-13): the original mission requires executable, synchronized
quickstarts. The README, beginner guide and eight introductions ran `make test`
but installed only QEMU, omitting read-only NDISASM and native GIF pixel decoding.
Install commands now include NASM/FFmpeg, with each introduction explaining that
those host tools do not generate target instructions. English source tracking is
updated after reviewing the same technical change in all eight introductions.
Translation freshness/shared byte examples, complete byte tables and local links
pass. The real introduction browser check passes all eight pages, desktop/320px,
Arabic RTL prose/LTR code, keyboard navigation and assets. Native-speaker review
remains separate. The correction changes no target bytes or capture inputs.
The documentation regression check now compares the README, contributor setup,
beginner guide and all eight introductions against the native CI install packages,
including their macOS package equivalents. The beginner Ubuntu recipe is a complete
copyable install command; contributor setup installs the same tools together.
Setup source `c277229` passes CI `38394601310` and deployment `38395334429`;
all twenty-one checked live introduction/source/setup files match. Live Chrome
also passes all eight introductions, desktop/320px, RTL/LTR and keyboard checks.

Game publication `0bc0296` passes corrected CI `38391619063` and deployment
`38392408626`. All eighteen checked live source/image/GIF/screenshot/guide/progress
files match, and Chrome passes actual GIF dimensions, exact downloads, native-only
scope and both C6-stopping imports at 1440/320px. Dependency-fix mirror `8100237`
changes only three paths under `bitborn/`.

Bit Hunt native game (2026-10-13): 492 literal bytes implement a five-row maze
with BIOS keyboard input, bounds/wall checks, immutable map, sticky star victory,
restart and deliberate quit. An independent coordinate oracle verifies every
VGA cell/attribute, title/status, eight state bytes and guards. Native tests cover
collisions, unknown input, a complete route, sticky victory, reset/quit and 260
moves proving saturation at FF. One literal operand bit changes star to colon:
the same route reaches cell 46 after eleven moves but WIN remains N. Twenty actual
QEMU frames from two boots have raw state/VGA/source/frame/image hashes; every
decoded GIF pixel matches the cropped/enlarged native capture. No overlays,
inferred frames, browser play or timing claims are introduced. Both model imports
stop atomically at C6 after fourteen setup steps. Counts become 68 reviewed targets,
112 manifest-reviewed artifacts, fourteen primary BIOS images and twenty-one gallery entries.
The full native suite passes 110 tests with one expected macOS native-Linux skip;
site/model/doc checks, Chrome routes and complete Firefox 157/WebKit 27.2 suites
pass. Browser checks verify exact source/image/GIF/record bytes, 1440/320px layout
and both actual imports stopping before native game behavior. The first Chrome
check compared transient change highlights; the corrected assertion compares
machine values, RAM and output, while the core check covers all state and RAM.
Publication remains pending.

Initial game publication `6e69633` failed CI `38391009677`: the new pixel-exact
capture test required FFmpeg, but the Ubuntu setup did not install it. All other
native checks had passed; gated deployment `38391140840` was skipped. The fix
installs the existing host recording tool in CI and documents the native test
dependency, retaining the full pixel comparison. Central mirror `a6f2dd3` changes
only 26 paths under `bitborn/`; project deployment remains the live publication gate.

Dispatcher publication `71dfda2` passes CI `38386015517` and deployment
`38386797951`. All 33 checked public source/image/guide/capture/progress files
match, and live Chrome passes exact downloads, native scope and 1440/320px layout.
One initial capture request differed transiently; its unchanged retry matches.
Central mirror `4311a98` changes only 62 paths under `bitborn/`.

Shared native exception dispatch (2026-10-13): 736 literal bytes map eighteen
legacy gates and normalize hardware-error/synthetic-zero frames through one
handler. Native DE, BP, UD and GP verify actual frame shape, selector error 18,
fault/trap EIPs, preserved PUSHAD context and DF, balanced return stack and source
RAM integrity. Three literal one-bit controls remove DE, capture then halt, or
retry DE until the fifth entry takes the four-record capacity stop. All gates,
stub routes and mixed-mode instruction bytes/boundaries are independently checked.
Four QEMU captures contain actual final registers, guest-written logs, retained
stack and source RAM; metadata and twenty assets are revalidated against their
hashes and raw fields. No instruction trace, arbitrary recovery or isolation is
claimed. The full 736-byte stage exceeds the model import limit; four prefixes
stop atomically at LGDT after seven setup instructions. Counts become 67 reviewed
targets, 110 manifest-reviewed artifacts, thirteen primary BIOS images and twenty gallery entries.
The full native suite passes 106 tests with one expected macOS native-Linux skip;
site/model/doc checks, Chrome routes and complete Firefox 157/WebKit 27.2 suites
pass. Browser checks verify exact image/source/capture/guide bytes, 1440/320px
layout and the native-only scope. Publication remains pending.
Other mapped delivery, modern vectors, nested/privilege-changing
frames and general recovery remain open.

Optimization publication `cc48b9a` passes CI `38376453864` and deployment
`38377287455`. All 29 checked public files match the verified code, sources,
images, guide, recording and progress. Live Chrome passes both distinct encodings,
measured budgets, locked setup, wrong-goal rejection and 1440/320px layout. Central
mirror `eb76fbe` changes only 42 paths under `bitborn/`.

Measured optimization challenges (2026-10-13): six new literal sources establish
different nonzero registers in seven locked bytes. Two reviewed encodings clear
AX/BX in 12 bytes rather than 14; two transfer AX=42 into BX in 10 rather than 11.
The evaluator measures all payload bytes, including unreachable trailing data,
and checks halt, registers and balanced SP instead of preferred-byte equality.
Existing fixed-length bit budgets remain enforced. Alternate sources stay in
their canonical folders and have reviewed hashes, size/prefix checks and distinct
bytes. All 26 curated QEMU cases and independent boundaries pass, including
unchanged instruction RAM and PUSH/POP's actual 2A 00 stack word. Node and Chrome
checks pass; complete Firefox 157 and WebKit 27.2 suites also pass. The full
native suite passes 103 tests with one expected macOS native-Linux skip. Its
first run hit a ten-second Node timeout in the unchanged signed-branch fixture;
the immediate unchanged repeat passed in 0.27 seconds, and the full repeat
passes without timeout or assertion changes. Publication remains pending.
The refreshed seven GIFs contain 133 actual browser frames, with 23 challenge
frames. All 79 source hashes, seven GIF hashes and 133 raw PNG hashes match.
A committed-manifest recheck counts 66 reviewed targets and 108 packaged artifacts,
including twelve primary BIOS images and 26 challenge images. At `273096a`,
the same manifest check yields 96 artifacts, matching the paging entry below.
The six new sources add twelve packaged files. Earlier root-build tallies
incorrectly included files outside the public artifact manifest.

Keyboard publication `97e90ad` passes CI `38370707697` and deployment
`38371502894`. All six checked public progress/README/roadmap/changelog/guide
files match that commit, and live Chrome passes the keyboard workflow at 320px.
The central mirror `3baaf05` changes only six paths under `bitborn/`.

Keyboard workflow regression (2026-10-13): the shared execution check reaches
Step, Back, Forward, Reset, timeline, binary editor and import through native
Tab/Shift+Tab traversal. Enter activates controls; Arrow/Home/End restore the
recorded timeline without losing focus, and its accessible value follows the
selected state. Invalid keyboard submission selects the bad token and preserves
loaded registers/history. The labeled import retains a visible focus ring;
valid raw bytes clear the error and reset the program. Targeted Chromium,
Firefox and WebKit checks pass. macOS WebKit uses native Option+Tab rather than
changing browser preferences. Playwright supplies the selected file; native OS
picker, speech input and screen-reader speech remain unverified.
Complete Firefox 157 and WebKit 27.2 suites pass, as do the Chrome CPU-lab
suite, site build, routes and documentation checks. The keyboard regression
preserves the existing displayed-change checks; timeline replay compares actual
register values because change markers describe the state just left.

Native paging (2026-10-13): 424 literal bytes build the directory and table as
runtime data, identity map the low 4 MiB, enable PG/WP and record one native #PF
with error 3, EIP=7C99 and CR2=B000. The handler repairs PTE.RW, uses INVLPG,
discards only the error slot and retries the unchanged store. One PTE bit or
one WP bit avoids that fault. Every entry in both 4 KiB structures, target value,
retained frame, balanced stack and instruction/source/image integrity is checked.
Captures contain actual structures and register/frame RAM with independent
mixed-mode goldens and hashes. Counts become 60 reviewed targets, 96 artifacts,
twelve BIOS images and 19 gallery entries. The model stops at LGDT after seven
setup instructions; user-mode isolation and general fault handling remain open.
The full native suite passes 102 tests with one expected macOS native-Linux skip;
site/model/doc checks and complete Chrome, Firefox 157 and WebKit 27.2 routes
pass locally. Browser checks verify the three literal imports, unchanged state
at the unsupported LGDT boundary, exact native downloads and gallery layout.
Publication `273096a` passes CI `38368375348`. The first Pages run
`38369071559` could not see its uploaded artifact; retrying that job exposed
duplicate artifact names. Fresh deployment `38369452074` succeeds without
source changes. All 17 checked public files match the verified bytes, and live
Chrome passes the three imports, native downloads and 1440/320px gallery checks.
The central Pages mirror `38924f7` changes only 45 paths under `bitborn/`.

Native timer IRQ (2026-10-13): 568 literal bytes remap PIC/PIT IRQ0, install one
32-bit interrupt gate and record CPU-generated frames. Three separate QEMU boots
show counts 3/2 for a one-bit limit change, and one entry with ISR0 set plus a
later pending request for a one-bit EOI port failure. Native checks cover saved
EIP/CS, saved IF=1 and the handler PUSHFD image's IF=0, preserved arithmetic/DF,
untouched IRETD frames, balanced stack, log guards/unused slots and unchanged
instructions/source/images. Mixed-mode disassembly and actual QMP/PIC snapshots
are hashed; asynchronous flags are not forced to repeat across boots.
Counts become 59 reviewed targets, 94 derived artifacts, eleven BIOS images and
18 gallery entries. Paging, general handlers, APIC and physical hardware remain
open. The CPU lab cannot import the full 568-byte stage; a separate prefix check
stops at LGDT after seven setup instructions, before mode/device work.
The full native suite passes 99 tests with one expected macOS native-Linux skip;
site/model/doc checks pass. Chrome routes and targeted Firefox 157/WebKit 27.2
checks verify exact source/image/provenance bytes and 1440/320px timer layout.
One initial Chrome run timed out on the unchanged learning-page load under high
host load; the fresh-browser repeat passed without changing timeouts or source.
Initial publication `1d32487` failed CI `38362521510`: the new timer gallery
check left the cross-engine page outside the CPU lab, so the following indicator
check waited for a nonexistent preset control. The correction orders the timer
check before the existing VGA check, which deliberately returns to the CPU lab.
Native and Chrome CI checks had passed; the gated project deployment was skipped.
The corrected complete Firefox 157 and WebKit 27.2 suites pass locally, including
all routes, timer downloads/scope, CPU indicators and existing interactions.

Previous register-ADD publication `15252da` passed CI `38356560057` and deployment
`38357183331`; mirror `b13d77d` changes only 16 `bitborn/` paths. Public module,
gallery, guides, README/ROADMAP, progress and the 57-frame CPU GIF match; both
live allocator links pass 135/137 steps, register/log/guard display, timeline
restoration and 320px checks.

Register ADD (2026-10-13): both unprefixed word-register directions execute
through the shared decoder and existing arithmetic flags. All 128 selector
combinations, 160,896 independent cases and six native result/defined-flags
probes cover aliases, SP and strict scope. The unchanged allocator sources halt
after 135/137 model steps; every full RAM/state checkpoint rewinds/replays and
the final logs/guards/registers/flags agree with native captures. Browser links
in the gallery load those exact bytes; memory/prefixed/wider ADD is unsupported.
The refreshed browser recording has 73 source hashes, seven GIFs and 121 actual
PNG frames (57 CPU-lab states), with zero source/GIF/frame hash mismatches.
The full native suite passes 96 tests with the expected macOS native-Linux skip;
native agreement covers AX/BX/DI/SP, CS/DS/SS, halt IP and defined flags.
Chrome, Firefox 157 and WebKit 27.2 pass the actual allocator-link runs, displayed
logs/guards, timeline restoration and 320px layout checks. Next research is the
native timer/PIC/PIT interrupt experiment already tracked as backlog item 57.

Native publication `1d43eb7` passed CI `38354429025` and deployment `38354835984`;
mirror `43bbd6b` changes only 29 `bitborn/` paths. Public source/control, payload,
512-byte image, guide, capture record, README, ROADMAP and progress bytes match.
The earlier compact README commit `4e92c4c` passed CI `38353424581` and deployment
`38353919733`, with its two new SVGs and public progress source verified live.

Native allocator (2026-10-13): 220 literal real-mode bytes own one fixed
sixteen-byte arena. Two QEMU boots verify five native-written request logs each,
zero/exact-fit/exhaustion/wrap behavior, both guards, balanced calls and unchanged
code/source/images. Byte 103 bit 0 changes the third request from 13 to 12,
leaving the final byte for the next call. Final QMP snapshots and independent
disassembly are committed with hashes; they are not a native instruction trace.
At its first native publication the model stopped at offset 202 after 65 steps.
The subsequent register ADD milestone above completes model execution. Counts become
58 reviewed targets, 92 derived artifacts, ten BIOS images and 17 gallery entries.
Paging, free/reuse, isolation and physical hardware remain separate research.

README priority (2026-10-13): keep a short progress summary and roadmap link,
with playful static SVGs and emoji navigation. The detailed milestone ledger
now lives in ROADMAP.md and drives website progress; route checks enforce that
the complete ledger survives README edits. Executable source bytes are unchanged.

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
Native self-modification commit `52450b1` passed CI `38324997986` and deployment
`38325367364`; Pages mirror `7c3af60` changes only `bitborn/`. Public gallery,
bootable image, native GIF and literal source were anonymously fetched and match
that exact milestone. GitHub topics now include self-modifying-code within 20
relevant topics; the homepage remains the canonical `.io` route.
Short-Jcc inspection now explains condition-group/inversion and signed-rel8 bit
roles in 16/32/64 contexts. The model and inspector share exact predicates for
all sixteen conditions; runtime execution remains the 16-bit subset. A 12,288-case
inspection oracle covers every mode/condition/displacement without modifying
inputs or reading flags. Six actual NDISASM observations bring the independent
golden corpus to 34; relative targets and JNL/JGE aliases are handled explicitly.
Browser complement/sign edits preserve runtime state and disable wider simulation.
Full local Python/site/model checks pass; recording source/GIF hashes are refreshed.
Next: roving keyboard focus and row navigation in the instruction bit editor.
Short-Jcc commit `84c8986` passed CI `38325985772` and deployment `38326306281`;
its Pages mirror is `71e646b`. Public inspector, field guide and literal fixture
match exact committed bytes. The encoding recording contains 21 actual frames.
The homepage/playground bit matrices now use one active Tab stop with arrows,
row/global Home/End, Ctrl/Cmd variants and native Enter/Space toggles. Focus
survives re-rendered invalid encodings; shortened fixtures reset the coordinate
without stealing selector focus. A labeled group describes the visible keyboard
help. Chromium, Firefox and WebKit verify both editor pages, boundaries, Tab
exit/return, no byte changes during navigation and no runtime execution.
The first simultaneous site-test run ended with signal 9 under observed memory
compression while browser jobs were active; a sequential rerun verifies the
completed module/link checks. Live assistive-technology sessions and broader
error-focus review remain open. Next: program-source error focus and actionable
locations in the CPU Lab.
Keyboard commit `1aa5539` passed CI `38327216070` and deployment `38327569900`;
its isolated Pages mirror is `0c8e006`. The public homepage progress and roadmap
match the committed source.
Source diagnostics now include full-token UTF-16 ranges for invalid tokens and
the first excess byte, retaining existing grammar, messages and CLI locations.
The CPU Lab focuses/selects failed binary/hex loads, keeps inline input focus,
validates imported textarea-normalized newlines and clears corrected errors.
704 range cases cover both notations, every host line boundary, Unicode spacing,
BOMs and supplementary characters. Chromium, Firefox and WebKit verify selection,
invalid markers and preservation of registers, history and share links.
The 77-test Python suite passes with one expected macOS native-Linux skip;
all site/module checks pass. Six browser recordings were recaptured with source
and frame hashes; the CPU recording has 45 actual frames, including three error
and correction states. Live assistive-technology review remains open.
Source-error commit `dbd0236` is pushed; its Pages mirror `e19610f` changes only
14 paths inside `bitborn/`. CI `38328762513` and deployment `38329115442` passed;
public parser, CPU module/page, progress and source-diagnostics guide match exact
committed bytes.
The bit-diff workbench now checks both drafts independently, identifies invalid
Before/After sides and selects the first offending token on failed notation
conversion. Typing focus, drafts, notation, selected row/roles and last valid
results remain intact. Correcting one side clears its marker while retaining the
other error; empty sources have no fabricated token range. Chromium, Firefox
and WebKit cover both notations, Unicode token ranges, both-invalid/one-corrected
recovery, excess bytes, empty drafts and preset reset. All site/module checks
pass. Its genuine browser recording now contains ten frames, including three
error/recovery states. Assistive-technology review remains separate.
Comparison commit `accecee` is pushed; its Pages mirror `704c071` changes only
15 `bitborn/` paths. CI `38329145675` and deployment `38329520716` passed; the
deployment actually checked out `accecee` even though the workflow-run display
head reflects the later default branch. Public comparison module/page, guide and
progress match exact source bytes.
A fresh remote clone at that exact source revision passed `npm ci`, 77 Python
tests (one expected macOS native-Linux skip), and all site/model/generated-copy
checks. Every one of the 88 reviewed artifact hashes matches across two builds;
the Git tree remains clean. The reproduction guide records the actual source,
environment, map fingerprint, commands and distinct Linux/browser/native gates.
Reproduction commit `0b58b21` passed CI `38329421110` and deployment
`38329709932`; mirror `160bff3` changes only seven `bitborn/` paths. Public README,
roadmap, progress and reproduction guide match the committed source.
Print-only styles now cover the manual, learning path and eight introductions.
Actual PDF QA caught dark page margins despite a white body; the print root now
forces a light color scheme and white background. Literal code stays unchanged,
Arabic prose stays RTL, code/URLs stay LTR and exact source attribution appears
on paper. Chromium, Firefox and WebKit verify print media on all ten pages;
three focused introduction/translation tests and all site/module checks pass.
The four actual Chromium PDF QA captures contain 13 pages (manual seven;
learning path, English and Arabic two each). All final pages were rendered and
visually inspected; corner pixels are white and extracted source URLs/literal
tokens are preserved. Monospaced code and paragraph widow/orphan controls improve
paper readability; the stale fourteen-example manual link now correctly says
fifteen. Physical printers and live assistive technology remain separate gates.
Print commit `20dc57c` passed CI `38330611051` and deployment `38330974534`;
its Pages mirror `e455a54` changes only 18 `bitborn/` paths. Public print CSS,
manual, Arabic introduction, print guide and progress match exact source bytes.
The next native experiment is a manually authored 142-byte VGA bitmap with 64
pixel-index bytes. It initializes its own stack before the BIOS graphics call.
Two complete literal controls differ only at byte 41, bit 5: green DAC 63 versus
31. Independent native checks match all 64,000 framebuffer indices and every
captured RGB pixel; indices remain identical while displayed green is 255/127.
Initialized registers, source/code RAM and read-only image checks pass. Two actual
native captures produce a GIF whose decoded pixels exactly match the source
crops; separate boots are explicit. The browser model rejects mode 13h after
six setup instructions. Chromium, Firefox and WebKit verify the native gallery
image, exact 512-byte download (payload, zero fill and signature), 1440/320px
layout and the CPU Lab's explicit graphics rejection with empty output. The full
78-test Python suite passes (one expected macOS native-Linux skip), as do all
site/module/source-copy checks. Current targets/artifacts are 57/90 and gallery
entries 16; tagged releases remain unchanged.
The standalone boot-source annotation audit confirms explicit pre-BIOS stack
setup in boot, keyboard, VGA text, loader and the new bitmap. The self-modifying
example still calls the BIOS first; its existing QEMU proof does not establish
independence from firmware stack state. Next: review and correct that fixture's
literal source, addresses, one-bit control and complete native/model provenance.
VGA bitmap commit `2c8b25c` passed CI `38333063253` and deployment `38333409584`;
its Pages mirror is `33633e8` (26 changed paths, all `bitborn/`). Public gallery,
image, actual GIF/capture record, literal source, guide and progress match exact
committed bytes. Repository metadata retains 20 topics, now including VGA.
The self-modifying sources now explicitly establish the stack before their first
BIOS call and restore DS afterward. Both are 82 literal bytes; writer/future
operand offsets are 52/61, physical operand address 7C3D and final logical IP
7C50 after 40 modeled steps. Native/model register, defined-flag, code RAM,
serial/VGA and whole-model rewind/replay checks pass. Seven reviewed boot/control
headers establish SS:SP from perturbed model entry registers with interrupts
masked during setup. Later STI remains permitted; setup ordering is not full
BIOS emulation or hardware proof. The old 80-byte source fails the same perturbed
entry-register guard before its first INT, establishing a concrete regression.
Native captures and all six browser demos were refreshed; all 92 browser frame
hashes and the current native writer/operand coordinates are verified. The full
78-test Python suite passes with one expected macOS native-Linux skip, together
with all site/module checks. Chromium, Firefox and WebKit verify updated source,
40-step execution, exact code-write rewind/replay, bit-diff offsets and gallery
downloads. The new VGA capture source/provenance remains unchanged.
Next: accessibility/contrast checks and contributor-facing scope clarity, while
physical hardware and live assistive-technology sessions remain separate gates.
Stack fix `449ae06` passed CI `38335257216` and deployment `38335638368`; mirror
`47473dd` changes only 25 `bitborn/` paths. Public generated source metadata,
raw payload, capture record, source/guide and progress match exact committed bytes.
Computed indicator auditing exposed 768px register bits extending beyond their
cells despite no page overflow. Tablet layouts now use two register columns and
bit/flag labels retain a 9px project floor. Chromium, Firefox and WebKit each
verify 11,072 visible text samples across four widths and eight states, with a
6.742:1 minimum computed contrast. Local containment, underlines, carry/zero,
preserved carry, stack/memory stores, undefined AF and current/changed timeline
overlap are covered. sRGB math checks include thresholds without rounding, alpha
compositing and 1,000 seeded ratios. Actual tablet screenshot review confirms
readable contained rows. This is scoped reduced-motion/flat-background evidence,
not a whole-site accessibility certification or live AT session.
Next: contributor-facing supported-instruction and proof-level navigation.
Indicator commit `1c1cd36` passed CI `38337292451`. Deployment `38337760575`
checked out that exact source despite its displayed trigger head being newer.
Mirror `80f6102` changes only twelve `bitborn/` paths; public CSS, progress,
README, roadmap and the indicator guide match the committed bytes exactly.
The shared execution-scope guide now maps tools, encoding families, BIOS/I/O
limits and proof levels to existing checks. README, contributor and preset guides
link it; the website manual exposes it at the browser-simulation boundary.
The guide was checked against the actual inspector and execution switch, including
the distinction between rejected BIOS calls and port writes without device behavior.
Next: a curated broken-program repair lesson with literal controls and native proof.
Scope guide `a1d0cee` passed CI `38337555976` and deployment `38337966576`.
Mirror `b08ea76` changes only nine `bitborn/` paths. Public manual, progress,
scope guide, README and roadmap match that exact commit byte-for-byte.
The direction-flag lesson reuses both existing fourteen-byte challenge sources.
Only byte 7 bit 0 changes FC to FD. A focused parity check boots both the broken seed
and reviewed repair behind the same loader, compares final AX/DI/SP/DF, zero
segments, halt address and stored bytes, and verifies unchanged guest code/image
and empty serial output. Model journals independently check both write addresses
and intermediate DI/DF across nine steps. The lesson explains why final DF=0
alone hides the error and distinguishes CPU Lab's 7C00 from native loading at 7E00.
Actual challenge capture frames show the failed seed, editable byte, one-bit repair
and solved result. The instruction sources and released artifacts are unchanged.
Capture review exposed an original CLD annotation beneath an edited FD byte.
Editable-byte captions now explicitly say Starting source; browser assertions
prevent these immutable annotations from masquerading as a current decode.
The full 79-test Python/native suite passes with one expected macOS Linux skip.
Chromium checks all twenty solutions and the starting-source captions. Refreshed
capture provenance verifies all 64 source hashes, six GIFs and 96 actual PNG
frame hashes, including the four direction seed/edit/repair frames.
Firefox and WebKit also verify the failing direction seed, actual one-bit button
repair, starting-source caption and all successful goal checks.
Next: remaining keyboard execution shortcuts and screen-reader announcements.
Debugging lesson `6ccb6a3` passed CI `38338290145` and deployment `38338697338`.
Mirror `cc28126` changes only fourteen `bitborn/` paths. Public challenge module,
GIF/provenance, lesson, README, roadmap and progress match that exact commit.
CPU Lab now exposes a visible execution-shortcut switch, with all five key
actions listed beside it and a linked guide. Disabling keys preserves loaded
state/history and native buttons. Contenteditable text, composition, consumed
events, key repeats and modifiers cannot invoke execution commands. The atomic
status reports manual-step numbers and next CS:IP; automatic ticks update the
machine without per-instruction status messages, retaining pause/halt/errors
and breakpoint outcomes. Chromium exercises the switch through native keyboard
activation, all disabled/enabled actions, source/contenteditable typing from a
nonzero recorded state, event guards and quiet Run ticks. This is DOM/key evidence;
live speech-input and screen-reader review remains separate.
Firefox and WebKit pass the same execution-keyboard/status checks, including
native checkbox/button activation and protected editing from a nonzero state.
Refreshed genuine browser captures include the disabled-S and manual-step
states; all 64 source hashes, six GIF hashes and 98 actual PNG frame hashes
match. The CPU recording has 47 frames. Tablet/mobile checks and actual frame
review retain readable controls; canonical instruction sources remain unchanged.
Next: explicit literal pointer/reference inspection without generating target bytes.
Keyboard controls `1df3b0f` passed CI `38339849829` and deployment `38340339750`.
Mirror `be01a17` changes only fifteen `bitborn/` paths. Public CPU page/module/CSS,
capture record, keyboard guide, README and progress match the exact commit.
The host address-reference inspector now checks explicitly declared abs16/far16/
rel8/rel16 fields before printing byte rows. A manually written JSON map covers
six original boot code/data references without editing any instruction bytes. Numeric
segment/origin assumptions are explicit; labels are descriptive and no operand
is generated or rewritten. Independent full-domain checks cover 196,864 synthetic
word/displacement/far-alias values, plus IP/A20 boundaries and one-bit failures.
Strict metadata, bounded descriptor-based reads, FIFO rejection, resource cleanup,
late-failure empty stdout, structured diagnostics and unchanged inputs are checked.
The full 85-test Python/native suite passes, with the expected macOS native-Linux
skip. Existing capture provenance reports no changed dependencies; executable
sources and derived target bytes remain unchanged.
Next: validate the legacy optional annotation JSON before rendering inspection,
then add reference maps for independently loaded experiments and clean CLI proof.
Reference checker `a7add2b` passed CI `38342489892` and deployment `38342843640`.
Mirror `5a27ba3` changes only ten `bitborn/` paths. Public manual, canonical map,
reference guide, README, roadmap and progress match the exact committed bytes.
The legacy annotation path now rejects malformed shape/types, invalid byte ranges,
overlaps and stale optional bits before rendering. All current target annotations
pass, including generated bits and reversed ordering; partial ranges remain valid.
Shared bounded descriptor reads reject FIFO/oversized JSON, duplicate keys are
rejected and non-printing label text is escaped without losing readable Unicode.
CLI failures use ANNOTATION_ERROR, produce no partial byte/reference rows and keep
input bytes unchanged. No target instruction source or byte-generation path changed.
Full-suite validation exposed a QMP socket-file/readiness race in a native VGA
boot. Startup now retries temporary refusal/missing paths under the same absolute
deadline, recomputing the remaining socket timeout. A mock regression covers
refusal, disappearance and eventual readiness; deadline failures still unwind
the socket, process, logs and temporary directory. Native comparison requires
both controls before indexing frames, avoiding a secondary indexing error.
The full 90-test Python/native suite passes with one expected macOS native-Linux
skip. Self-modifying and VGA bitmap captures were recreated through the corrected
harness; their records match its current hash and retain actual native pixel,
memory, source/image and GIF assertions. Browser runtime inputs are unchanged.
Next: reference maps for independently loaded experiments and a coherent new release.
Three manually authored reference maps now check self-modifying and VGA bitmap
code/data addresses in both controls, plus the CALL/RET fragment loaded at 7E00.
The four experiment sources share their maps without hiding the writer/palette
bit change. Every mapped experiment field rejects a one-bit mutation. CALL's
literal rel16 operand targets physical 7E0B from declared origin 7E0A; the broken
seed fails the same map. Tests cover all five sources and raw payload reproduction
commands. These are declared address contracts, not native device emulation or
generated fixups; target bytes and native capture dependencies remain unchanged.
The full 91-test Python/native suite passes, with one expected macOS Linux skip.
Next: coherent release preparation from a clean tested source snapshot.
Version 0.4 preparation expands the explicit release staging set to nine BIOS
images, actual native crops/GIFs and six browser recordings, with capture records,
source/artifact archives and exact-commit provenance. The 31-file plan keeps old
tags/assets intact and rejects stale version archives before writing. Publication
remains pending exact-commit CI, clean reproduction and public re-download checks.
Map commit `227f902` passed CI `38344180742` and deployment `38344549223`.
Mirror `9a6f2db` changes only eleven `bitborn/` paths. Public experiment/challenge
maps, reference guide and progress match that exact source. The full 92-test
Python/native suite passes locally with one expected macOS native-Linux skip.
v0.4.0 is public at immutable `c8d151b62ff7c6ec5c6124087f3a3e75f3d9ab6d`.
Main CI `38344949598` and tag CI `38345402463` pass. Independent source extraction
outside any Git repository passes 92 Python/native checks (one expected macOS
Linux skip), site checks and complete Chrome/Firefox/WebKit suites. All 90 rebuilt
artifact hashes match staged provenance, and preparing the same clean source
twice yields identical 31-file staging. Authenticated draft and anonymous public
downloads match every attachment; all 30 checksum entries pass. Public requests
disable curl configuration to avoid inherited authentication. The 13 actual A4
QA pages were rendered and visually reviewed, including Arabic RTL/LTR code.
Older public releases and tags remain intact; no hardware or full-AT claim added.
Next: resume native/model research after the verified release and public progress sync.
Release proof `95d539a` passed CI `38346115009` and deployment `38346531351`;
mirror `9f1f91c` changes only eight `bitborn/` paths. Public README, roadmap,
changelog, evolution record and progress match the verified release state.
The Linux instruction lesson adds unprefixed 64-bit stack inspection and seven
exact slices of the original 8-/12-byte exit programs. It labels source ranges,
sign-extension and register selectors, explains the Linux ABI and leaves all
64-bit execution disabled. All imm8 values, 1,000 seeded imm32 words/boundaries,
sixteen low-register stack forms, exact payload reconstruction and seven new
NDISASM goldens pass. Chrome, Firefox and WebKit verify every preset and the sign
bit flip at desktop/320px with unchanged model registers. No native target bytes
or released artifacts change. Next: progressive byte-order and syscall lessons.
Actual browser captures now include the seven Linux setup slices and signed-bit
change. All 66 source hashes, six GIFs and 106 actual PNG frame hashes match;
the encoding recording has 29 frames. Visual capture review shows readable fields
and the disabled simulation control, with existing model registers preserved.
Linux inspection commit `fdddcdd` passed CI `38347405113` and deployment
`38347839473`; mirror `27a5410` changes only 18 `bitborn/` paths. Public
README, roadmap, evolution record, progress and decoder match that exact source.
The repository retains 20 relevant topics and its canonical `.io` homepage.
The progressive byte-order lesson uses six canonical handwritten bytes and the
shared decoder: linked low-bit changes, a word-byte swap, signed branch targets
and Reset. All 65,536 immediate words and 256 signed branch targets pass, including
one-step model agreement and independent NDISASM; a bounded original loop check
does not pretend the fragment halts. Chrome, Firefox and WebKit pass linked edits,
keyboard focus, reset/reload and 1440/320px checks; final buttons use the existing
46px site style. Genuine five-frame browser footage is added to the showcase.
The completed browser recording set has 70 current source hashes, seven GIFs
and 111 actual PNG frames; every source/GIF/frame hash is rechecked.
No native executable, boot target or release asset changes. Native execution and
live assistive-technology speech are separate evidence. Next: a stack/call lesson.
Byte-order commit `fc5a715` passed local checks but CI `38348552085` failed because
the new NDISASM subprocess was absent from the runner; deployment `38348637922`
was correctly skipped. Mirror `ec617ff` changes only 20 `bitborn/` paths. Both
validation and Pages jobs now explicitly install the inspection package, and
the contributor guide records it. This is a test dependency, not target assembly;
the fresh exact-commit CI/deployment result remains pending verification.
The guided stack/call lesson reuses the original 13-byte preset. Its published
nine-state table is checked against independent disassembly and actual model
states, including POP's retained RAM and CALL's saved return-word overwrite.
Every recorded state and all 1 MiB of RAM rewind/replay exactly; source bytes
remain unchanged. Chrome's complete CPU suite and targeted Firefox/WebKit tests
check all checkpoints, visible stack bytes and physical memory at 1440/320px.
All twenty curated solutions were freshly booted through QEMU/QMP, including the
7E00 call/return solution; that final native result is separate from the preset's
7C00 model trace. No new target instructions, native formats or general ABI are
claimed. Next: distinguish signed/unsigned flag behavior in the learning path.
Actual CPU footage adds Back/Forward around CALL's saved-word overwrite and
shows the guided source link. All 70 source hashes, seven GIFs and 113 actual
PNG frames match; the CPU recording now has 49 frames. The captured memory
microscope visibly restores 34 12 below SP, without claiming native reversal.
The CI dependency fix `787fcb5` passed `38348964402`; deployment `38349446294`
actually checked out that exact fix despite displaying the newer default head.
The live byte-order lesson, canonical import module, README, roadmap, contributor
guide, progress and recording match the fix. Stack commit `d7d4005` passed CI
`38349440352` and deployment `38349877536`; mirror `9f93693` changes only 13
`bitborn/` paths. Public CPU markup, stack guide, README, roadmap, progress and
CALL recording match that exact source. The earlier failed CI was corrected,
not hidden or bypassed.
The flags lesson reuses existing sources to separate CF from OF, low-byte parity,
INC's preserved carry, CMP's unchanged destination and deliberately undefined AF.
All seven published table states, the exact overflow import and unknown-AF
rewind/replay pass. Two reviewed challenge boots compare all six defined ADD
flags with independent expected masks and the model; loaded source RAM and disk
images remain unchanged. The full local Python suite passes 93 tests with the
one expected native-Linux skip on macOS. Chrome's complete CPU suite and targeted
Firefox/WebKit tests check the actual flag displays, accessible undefined label,
history and 1440/320px layouts. No physical hardware, native undefined-AF value
or native instruction trace is claimed. Next: resume a bounded native experiment.
The genuine browser footage now includes AF=?, unsigned carry, INC's preserved
carry and the signed-overflow counterexample. All 71 source hashes, seven GIFs
and 117 actual PNG frames match; the CPU GIF has 53 frames. Visual review shows
AX=8000 with CF=0/OF=1 and the guided reference, without labeling it native footage.
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
| 16 | 1 | Address-reference inspector that checks literal pointers without resolving labels into code | H | M | Annotations | Medium | Complete: explicit abs16/far16/rel8/rel16 maps, six boot fields, exhaustive numeric checks and read-only bounded diagnostics; metadata assumptions are not instruction decoding |
| 17 | 1 | Register-to-register MOV encodings with independent ModR/M fixtures | H | M | 05 | Medium | Complete: scoped inspection, 9,728 combinations and 18 disassembly goldens |
| 18 | 1 | Curated indirect memory operands with explicit segment-selection explanations | H | M | 17 | High | Complete: 16-bit addressing inspection; default DS/SS verified natively; no memory execution |
| 19 | 1 | Signed conditional branches and overflow examples with native QEMU proof | H | M | 04 | Medium | Complete: all short conditions, full rel8/flag oracle and identical 95-byte native/model exercise |
| 20 | 1 | Carry-aware arithmetic examples and native/model differential checks | H | M | 04 | Medium | Complete: byte/word immediate ADC/SBB, 270,736 ripple cases, same 81-byte native/model program and eight native FLAGS samples |
| 21 | 1 | ELF anatomy viewer: headers, entry point, segment permissions and payload bytes | H | H | Existing ELF packaging | Medium | Complete: bounded ELF64 scope; no imported-code execution |
| 22 | 1 | Explain Linux syscall encodings in 64-bit inspection mode without host execution | H | H | 05 | Medium | Complete: canonical setup slices, stack fields/sign extension, Linux ABI text and three-browser read-only proof; no 64-bit execution |
| 23 | 1 | Literal native self-modification experiment with controlled halt and RAM proof | H | M | Existing BIOS loader | Medium | Complete: current two literal 82-byte cases, one input/live operand bit and native/model proof; original 80-byte checkpoint preserved in history |
| 24 | 1 | Program gallery presets derived from canonical .bits instead of duplicated source | H | M | Site packaging | Medium | Complete: all six CPU presets from canonical files, exact source/byte identity and loaded-source downloads |
| 25 | 2 | Progressive interactive byte-order lesson: one byte, one word, one branch | H | H | Existing playground | Low | Complete: six-byte source, shared decoding, exhaustive word/branch and keyboard/browser checks |
| 26 | 2 | Guided stack/calling-convention lesson with return-address inspection | H | H | 02,10 | Low | Complete: original preset checkpoints, return-word overwrite/retention, full recorded RAM rewind/replay and separate native challenge proof |
| 27 | 2 | Flags lesson separating signed overflow, carry, parity and undefined AF | H | H | 04 | Medium | Complete: canonical checkpoint table, six defined native/model ADD flags, low-byte parity and accessible unknown-AF history |
| 28 | 2 | Meaningful bit-diff explanations tied to instruction boundaries and execution mode | H | M | 05,07 | Medium | Complete: positional changes and linear field roles; no execution/control-flow/alignment claim |
| 29 | 2 | New optimization challenges with alternate valid solutions and actual size measurements | H | M | Challenge evaluator | Medium | Complete: two puzzles, distinct reviewed encodings, locked setup and measured 14-to-12/11-to-10 payload sizes; curated QEMU, independent boundaries and three-browser workflows |
| 30 | 2 | Curated broken-program debugging walkthrough with recorded repair and native proof | H | H | 02 | Low | Complete: direction-flag seed/repair, intermediate model journals, both native controls and genuine browser repair frames |
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
| 41 | 2 | Print-friendly lessons with readable code and source attribution | M | H | 25–27 | Low | Complete: ten pages in three browser print modes, actual 13-page Chromium PDF QA, RTL/LTR code and source URLs; physical printers untested |
| 42 | 0 | Keyboard accessibility regression for timeline, imports, controls and error focus | H | H | 12 | Low | Complete: three-engine native Tab/Shift+Tab and Enter workflow, focused timeline Arrow/Home/End, invalid-token selection and labeled import focus; OS picker and live AT remain separate |
| 43 | 0 | Contrast and narrow-screen checks for changed-bit and flag indicators | H | H | Existing CSS | Low | Complete: real tablet overflow fixed; four widths/eight states, 11,072 samples per browser, contrast/local geometry and non-color cues; full-site/animated/live AT review separate |
| 44 | 2 | Explicit shortcuts guide and screen-reader-friendly execution announcements | M | H | 12,42 | Low | Complete: switch, editable/event guards, atomic manual status and quiet Run ticks; live AT review remains separate |
| 45 | 2 | CODE_OF_CONDUCT with real, usable reporting paths | H | H | Maintainer/profile evidence | Low | Complete |
| 46 | 0 | SECURITY policy with scoped supported versions and verified private reporting | H | H | GitHub repository settings | Medium | Complete |
| 47 | 2 | Contributor source map and focused per-component development commands | H | H | Existing CONTRIBUTING | Low | Complete |
| 48 | 0 | Verify every generated documentation/source copy, including translation and trace fixtures | H | H | Site build | Low | Complete |
| 49 | 2 | Genuine Time Machine capture with source/frame provenance | H | H | 02,12 | Low | Complete |
| 50 | 0 | Reproducible host-model benchmark; distinguish rendering, interpretation and native execution | H | M | 01,02 | Medium | Complete |
| 51 | 0 | Release-provenance manifest tying reviewed source, packaged output and commit | H | H | Existing releases | Medium | Complete: v0.3 public bytes, checksums and commit verified |
| 52 | 0 | Clean-checkout reproduction and platform-specific validation documentation | H | H | CI | Low | Complete: fresh remote accecee install, 77 Python/site checks, all 88 hashes across two builds and clean tracked tree; platform gates explicit |
| 53 | 3 | Real VGA bitmap experiment with manually authored pixel/instruction bytes | H | M | BIOS target | High | Complete: 142 authored bytes, full native index/RGB proof, exact actual GIF pixels and three-browser download/model-boundary checks; hardware remains untested |
| 54 | 3 | Tiny text-mode game with deterministic input and genuine QEMU recording | H | M | Shell keyboard helpers | High | Complete: 492-byte maze, real WASD/collision/victory/reset/quit, guarded state and 260-move saturation, one-bit goal control and twenty pixel-exact native frames; browser game and hardware remain unverified |
| 55 | 3 | Bounded native allocator with memory-map, ownership and overflow evidence | H | M | Reviewed BIOS target | High | Complete: fixed real-mode arena, two native five-request logs, one-bit ownership control, zero/exact-fit/exhaustion/wrap checks and guarded immutable code/disk proof; free, isolation and paging remain open |
| 56 | 3 | Protected-mode exception handlers with controlled fault injection | H | M | IDT target | High | Complete: shared legacy dispatcher, native DE/BP/UD/GP error/no-error frames, trap/fault EIP and three one-bit controls; other delivery and arbitrary recovery remain open |
| 57 | 3 | Timer IRQ experiment with explicit PIC setup and deterministic QEMU assertions | H | M | 56 | High | Complete: explicit PIC/PIT setup, 3/2 native frame logs, guarded untouched IRETD frames, wrong-EOI pending/ISR proof and source/image integrity; timing, general handlers and physical hardware remain open |
| 58 | 3 | Paging experiment with inspected page tables and deliberate page-fault evidence | H | L | 55,56 | High | Complete: full 2048-entry structure inspection, native #PF error/CR2/frame, PTE repair, INVLPG and unchanged store retry; independent PTE/WP controls, code/image integrity and explicit model boundary; user-mode isolation remains open |
| 59 | 0 | QEMU runner resource/error-path checks and bounded process cleanup | H | H | Existing Guest harness | Medium | Complete: resource unwind, QMP bounds/deadlines and actual child kill/reap; disk quotas remain outside scope |
| 60 | 2 | Accurate release/community draft showing actual new capabilities; no automatic posting | M | H | Verified release | Low | Complete: release published; community draft remains unposted |
| 61 | 0 | Cancel delayed file imports/errors after a newer source choice or editor draft | H | H | CPU Lab import | Medium | Complete: race reproduced and checked in three browsers |
| 62 | 1 | Execute unprefixed 16-bit ModR/M memory MOV using one shared address decoder and native/journal/boundary proof | H | M | 18,01,02 | High | Complete: 2,304 cases and identical model/native 71-byte exercise |
| 63 | 0 | Roving keyboard focus for instruction-bit editors, field-aware labels and stable edits | H | H | 05,07 | Low | Complete: shared root/playground one-stop navigation and invalid/shortened fixture focus checks; full AT review remains open |
| 64 | 0 | Exact source error ranges, relevant editor focus and preserved invalid-load state | H | H | 15,42 | Low | Complete: UTF-16 token spans, normalized imports, binary/hex focus and corrected-error cleanup; live AT review open |
| 65 | 0 | Identify both invalid comparison sides and focus failed notation conversion without losing drafts/results | H | H | 15,64 | Low | Complete: independent invalid markers, full token/excess selection and partial correction in three browsers; live AT review open |
| 66 | 0 | Audit native boot fixtures for explicit stack initialization before their first BIOS call | H | H | Native boot fixtures | Medium | Complete: seven reviewed boot/control setup guards, prior-source regression, corrected 82-byte fixture, native/model and three-browser proof, refreshed captures; hardware and full BIOS emulation remain separate |
| 67 | 0 | Validate optional bitinspect annotation metadata and preserve structured errors before rendering | H | H | Existing host inspection | Medium | Complete: bounded JSON, typed non-overlapping ranges, literal-bit matches, terminal-safe labels and structured late-failure diagnostics; canonical targets remain valid |
| 68 | 0 | Align executable quickstart dependencies across README, beginner guide and eight introductions | H | H | Native capture test | Low | Complete: NASM/FFmpeg install commands, localized host-tool roles, English source tracking and eight-page browser/link checks; native-speaker review remains separate |
| 69 | 0 | Preserve recorded release staging when source advances without a version bump | H | H | Release provenance | Low | Complete: reject different revision/version before writes; isolated preservation regressions and all 31 frozen v0.4.0 staging files verified unchanged |
| 70 | 1 | Publish the five newer native experiments as a verified v0.5 distribution | H | H | 68,69 and native proofs | Medium | Complete: main/tag CI, clean-source 114-test/three-engine reproduction, 112 exact artifacts and all 89 anonymous attachment downloads verified; precise scope and publication notes updated |
| 71 | 1 | Prove a curated protected-mode user/kernel privilege transition with explicit native frames and controls | H | M | GDT, exception frames, IRETD | High | Complete: ring-three entry, TSS-selected HLT/GP return and CMC control; callable INT gate/IRETD and one-bit DPL denial pass four native cases with exact frames; no memory-isolation, Linux ABI or scheduling claim |
| 72 | 1 | Prove a bounded user/supervisor page-permission boundary with native PF frames and a one-bit control | H | M | 71, native paging | High | Complete: native denied write PF(7)/CR2, protected word, privilege-frame return and one-bit user permission; all entries, user stack/data, dirty bits and source integrity checked; no general sandbox claim |
| 73 | 1 | Extend the bounded permission proof with actual negative user-read and code-write probes | H | M | 72 | High | Complete: two literal slots and six native denied/permitted cases; PF 5/7, exact CR2/frames, explicit read EAX and four-byte code control, all tables/dirty bits and source/disk integrity; no general isolation claim |
| 74 | 1 | Record all six native permission snapshots with source/frame/table hashes and replayable provenance | H | H | 73, native recorder patterns | Medium | Pending: actual registers, logs, stack, directory/table and source RAM; independently recheck stored captures and distinguish native data from browser emulation |

Large tasks are divided into useful verified milestones. Native experiments only
become capabilities after literal source review and real QEMU checks; hardware
claims require hardware evidence. A backlog idea does not change the source rules.
