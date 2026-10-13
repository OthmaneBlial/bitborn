![bitborn — Software born from raw bits](assets/social-preview.svg)

# bitborn

### Software born from raw bits.

**No C. No Rust. No Assembly. No compiler. Just 0s and 1s.**

[![Verify raw bits](https://github.com/OthmaneBlial/bitborn/actions/workflows/test.yml/badge.svg)](https://github.com/OthmaneBlial/bitborn/actions/workflows/test.yml)
[![Deploy website](https://github.com/OthmaneBlial/bitborn/actions/workflows/pages.yml/badge.svg)](https://github.com/OthmaneBlial/bitborn/actions/workflows/pages.yml)
[![Latest release](https://img.shields.io/github/v/release/OthmaneBlial/bitborn)](https://github.com/OthmaneBlial/bitborn/releases/latest)
[![MIT license](https://img.shields.io/badge/license-MIT-71ff8b)](LICENSE)

**[Explore the live website →](https://othmaneblial.github.io/bitborn/)** ·
[Documentation](https://othmaneblial.github.io/bitborn/docs.html) ·
[Download the 512-byte image](https://othmaneblial.github.io/bitborn/downloads/boot.img)

Introductions: [English](docs/i18n/en/README.md) · [简体中文](docs/i18n/zh-CN/README.md) ·
[Español](docs/i18n/es/README.md) · [Français](docs/i18n/fr/README.md) ·
[日本語](docs/i18n/ja/README.md) · [Português](docs/i18n/pt/README.md) ·
[Deutsch](docs/i18n/de/README.md) · [العربية](docs/i18n/ar/README.md).
These cover the same example, quickstart and boundaries; detailed guides remain in English.
Read them as [localized website pages](https://othmaneblial.github.io/bitborn/intro/en/).

What if you could build a real bootable computer program without writing a
single instruction in a programming language?

bitborn explores that question by encoding machine instructions directly as
binary digits. Every opcode. Every operand. Every branch displacement. No
assembler translates the target code: we author the bytes themselves.

**A real 512-byte BIOS boot program, sixteen reviewed examples, four byte tools,
an editable boot builder, a visual CPU lab, and 20 binary challenges.** This is an educational experiment, not a
production operating system.

![Real QEMU boot recording, captured from guest VGA frames](assets/boot.gif)

*Actual QEMU/SeaBIOS boot, not a simulated terminal. [Capture provenance](assets/boot-recording.json).*

## Start with the real machine

You need **Python 3.10+, Make and QEMU**. On macOS: `brew install qemu`.
On Ubuntu: `sudo apt-get install python3 make qemu-system-x86`.

```sh
git clone https://github.com/OthmaneBlial/bitborn.git
cd bitborn
make test
make run
```

`make run` boots the image in a graphical QEMU window and mirrors its text to
the serial terminal. `make test` uses headless QEMU and checks real guest behavior.
The BIOS examples also work under TCG emulation on Apple Silicon. Linux ELF
examples require a **Linux x86-64 kernel**; macOS skips their native test and
Ubuntu CI executes all six.

## Roadmap — visible progress

Updated **2026-10-13** after each verified milestone. See [ROADMAP.md](ROADMAP.md)
for exact evidence and remaining gates.

| Milestone | Progress |
| --- | --- |
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
| 20 challenges across four levels | ✅ All solutions pass model and QEMU goals; seeds fail; local progress and sharing tested |
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
| [Literal address references](docs/address-references.md) | ✅ bitinspect checks explicitly declared absolute/far/relative fields, including six original boot references; exhaustive word/displacement/alias checks, bounded reads and no byte rewriting |
| [Experiment reference maps](docs/address-references.md#native-experiments-and-an-independently-loaded-fragment) | ✅ Shared maps check both self-modifying and VGA controls; a 7E00-loaded CALL/RET map accepts the solution and rejects its broken seed |
| [Safe inspection annotations](docs/inspection-annotations.md) | ✅ Typed ranges, non-overlap and literal bits are checked before rows print; bounded JSON, structured errors and escaped terminal controls preserve readable Unicode |
| [Linux syscall instruction fields](docs/instruction-encoding/linux-syscalls.md) | ✅ Seven exact native payload slices, sign-extended 64-bit PUSH and low-register PUSH/POP fields; ABI explanations and independent goldens; browser execution stays disabled |
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
| Paging, exception/hardware interrupt handling and physical hardware | Future research; no working claim |

## From text bits to CPU instructions

```text
10111000 00101010 00000000
   B8       2A       00
```

In 16-bit real mode, this means `MOV AX,42`: one opcode byte followed by the
little-endian immediate operand. The instruction name here is an explanation,
never an input to a code generator. In a 32-bit operand-size context, the same
opcode consumes four immediate bytes. **Execution mode matters.**

The `.bits` file is human-readable notation; `bitpack` removes comments and
whitespace and turns each eight-digit token into exactly one byte. BIOS loads
those bytes at physical `7C00`. The x86 CPU decodes and executes them.

```sh
./tools/bitpack boot/boot.bits boot.img
./tools/bitinspect boot.img --annotations boot/annotations.json
./tools/bitinspect boot.img --references boot/references.json
./tools/bitverify boot.img --size 512 --bios
./tools/bitdiff build/boot.img boot.img
```

| Tool | What it does |
| --- | --- |
| `bitpack` | Strictly packs binary byte tokens; source-line/token diagnostics and optional `--json-errors` |
| `bitinspect` | Offsets, binary, hex, known annotated boundaries and optional declared address-reference checks |
| `bitverify` | Sizes, BIOS signature, reviewed hashes, annotations, source audit and reproduction |
| `bitdiff` | Marks each changed bit, including added or removed bytes |

The host tools are Python. The browser explorer is JavaScript. The **target
machine instructions** are authored directly in `.bits`. Packaging gallery
payloads adds non-executable zero fill, BIOS signatures or ELF headers; it never
generates an instruction. The main boot source already contains all 512 bytes.

The [literal source format](docs/binary-format.md) is shared by the browser and
CLI, including comment boundaries and an optional initial UTF-8 BOM. A seeded
cross-language corpus checks exact accepted bytes and malformed-token line numbers.

## Inside one sector

![Real QEMU screenshot of the handwritten boot sector](assets/boot.png)

The program normalizes CS, sets data/stack segments, selects VGA text mode,
initializes COM1 to 115200 baud/8N1, and prints the exact greeting to both outputs.
It then disables interrupts and enters a controlled halt loop.

| Region | Bytes |
| --- | --- |
| Handwritten instructions | 91 |
| Literal greeting, line breaks and NUL | 148 |
| Explicit zero padding | 271 |
| BIOS signature `55 AA` | 2 |
| **Total** | **512** |

[Read the canonical source](boot/boot.bits) · [Every boot byte explained](examples/boot-sector/bytes.md) ·
[Architecture](docs/architecture/README.md) · [Encoding guide](docs/instruction-encoding/README.md)

## The example collection

| Example | Actual result | Environment |
| --- | --- | --- |
| [Return an exit code](examples/exit-code/README.md) | Exit 42 | Linux x86-64 |
| [Arithmetic](examples/arithmetic/README.md) | 6×7 → exit 42 | Linux x86-64 |
| [Print text](examples/print-text/README.md) | Hello from raw bits! | Linux x86-64 |
| [Loop and count](examples/loop-count/README.md) | Five iterations → exit 5 | Linux x86-64 |
| [Compare values](examples/compare-values/README.md) | Equality branch → exit 42 | Linux x86-64 |
| [Keyboard input](examples/keyboard/README.md) | Real key echoed to VGA/COM1 | BIOS |
| [VGA memory](examples/vga/README.md) | Bright green B at B8000 | BIOS |
| [512-byte boot sector](examples/boot-sector/README.md) | Greeting and halt | BIOS |
| [Interactive monitor](examples/monitor/README.md) | Five exact commands and edited input | BIOS |
| [Disk reads](examples/disk-read/README.md) | Load and execute additional sectors | BIOS |
| [Eight-byte exit](examples/exit-code-small/README.md) | Same exit 42; smaller payload, more stack traffic | Linux x86-64 |
| [Binary shell](examples/shell/README.md) | Nine commands, real memory, register snapshot and disk app | BIOS |
| [Returning disk app](examples/shell-app/README.md) | Computes 7×6, stores 2A in RAM, returns to shell | BIOS payload |
| [Protected mode](examples/protected-mode/README.md) | 32-bit flat memory, IDT software interrupt and IRETD | BIOS → protected mode |
| [Native VGA bitmap](examples/vga-bitmap/README.md) | Authored pixel rows and one-bit palette surgery; unchanged framebuffer indices | BIOS / native QEMU |

Each guide links its canonical source, per-byte table, generated binary path,
expected behavior and automated test. `make build` produces the artifacts.
The six ELF programs consist of the unchanged payload plus 120-byte host-packed
headers; they use Linux syscalls with no runtime library or linker.

```sh
qemu-system-i386 -drive file=build/monitor.img,format=raw,if=floppy -boot a -serial stdio
```

Type in the QEMU display and press Enter. The monitor supports exact lowercase
`help`, `clear`, `about`, `reboot` and `peek`; a 15-character input bound and
Backspace editing. `peek` loads the actual byte at physical `7C00`. The monitor
and disk-read images use a separately handwritten loader and two padded sectors.

The new shell adds `dump`, `regs`, `write`, `read` and `run` alongside help,
about, clear and reboot. Its five-sector disk loads a separately authored app
at `9000`; BIOS carry errors stop the launch. `regs` samples the actual CPU at
handler entry. The memory experiment and app calculation are checked against
guest RAM. The separate protected-mode target enters 32-bit ring zero, loads a
GDT and one software-interrupt gate, then verifies memory and interrupt return.
Neither experiment supplies paging, general exception handling or a full OS.

## Explore and contribute

The [ELF explorer](https://othmaneblial.github.io/bitborn/elf/) shows how the
64-byte ELF header and 56-byte load header wrap unchanged instruction bytes.
Select a field, inspect its little-endian bytes, or follow `400078` to file offset
120. Import bounded ELF64 files for read-only inspection of segments, permissions,
zero fill and entry mappings. See the [precise scope and reproduction](docs/elf-anatomy.md);
the viewer does not execute imported programs or certify their safety.

The [instruction playground](https://othmaneblial.github.io/bitborn/playground/)
inspects selected encodings in an explicit 16-, 32- or 64-bit context. The same
`B8` fixture consumes two or four immediate bytes; `49` is DEC CX/ECX in legacy
contexts and a REX prefix in 64-bit mode. Flip REX.B to change R8 to RAX, or REX.W
to change operand width. Bit buttons explain their opcode/register/ModR/M/immediate
roles, and 64-bit values stay exact with BigInt. This is
[scoped inspection](docs/instruction-encoding/fixtures/README.md); execution remains
the separately tested 16-bit model.

Start with the [Boot Sector Builder](https://othmaneblial.github.io/bitborn/boot-builder/):
all 512 bytes are editable, current decoding explains fields, and `.bits`/`.img`
exports preserve your exact bytes. Change offset 176 from `01001000` to
`01101000`, then boot the downloaded image: “Hello” becomes “hello”.

The [CPU Lab](https://othmaneblial.github.io/bitborn/cpu-lab/) shows all modeled
16-bit registers, flags, changed register bits, stack and memory. Step, run,
pause, adjust speed, set breakpoints or inspect a bounded literal program.
Back and Forward restore recorded registers, flags, memory, output and halt state
without executing an instruction. New execution after rewinding replaces the
abandoned future; Reset and loading a program clear history.
Export the loaded program as `.bits` or raw `.bin`, then import either format.
Exports preserve the original loaded bytes before self-modification and omit
comments or pending editor edits. They leave execution and history unchanged;
raw programs have no BIOS framing or ELF headers. A newer source choice or editor
draft cancels an older asynchronous import.
Valid binary drafts update an equivalent hexadecimal view while retaining their
comments. Edit two-digit hex byte tokens and choose **Load hex & reset** to replace
the binary draft and loaded program; that explicit conversion omits comments.
Draft edits alone leave execution/history unchanged. Hex input never chooses
instructions from names; canonical `.bits` files still contain binary digits.
The recorded timeline selects any state with a slider or Arrow/Home/End keys.
Changed bits and RAM compare the state you left with the selected state, including
multiple recorded instructions; revisiting states consumes no new execution steps.
The [20 challenges](https://othmaneblial.github.io/bitborn/challenges/) provide
four difficulty levels, hints, semantic goals, share links and progress stored
only in your browser. Every reviewed solution also runs in QEMU; success is
based on the behavior goals rather than equality with one answer.

Browser execution is a **bounded educational model**, with a 4,096-step ceiling,
1 MiB modeled memory and explicit unsupported-encoding errors. It does not run
native browser code. `make site-test` verifies source hashes, execution and links.
[Learning paths](https://othmaneblial.github.io/bitborn/learn/),
[architecture](https://othmaneblial.github.io/bitborn/architecture/),
[examples](https://othmaneblial.github.io/bitborn/examples/) and the
[live roadmap](https://othmaneblial.github.io/bitborn/roadmap/) have dedicated pages.
The roadmap and homepage progress feed are rebuilt from the table above.
The website documentation links all sixteen current examples and the latest
release. The original 512-byte boot message still reports v0.1; its exact bytes
are preserved while v0.2 adds separate instruments and native targets.

```sh
npm ci                         # development-only browser test dependency
npx playwright install chromium
npm run test:browser            # real Chrome interactions and mobile layouts
npx playwright install firefox webkit
npm run test:cross-browser      # Firefox/WebKit interactions and exact downloads
python3 tools/verify_browser_export.py # actual QEMU boot of the browser download
python3 -m http.server 8000 --directory site
```

[Beginner tutorial](docs/tutorials/from-bits-to-boot.md) · [Contributing](CONTRIBUTING.md) ·
[Code of conduct](CODE_OF_CONDUCT.md) · [Security reporting](SECURITY.md) ·
[Reproducible showcase](SHOWCASE.md) · [Good first contributions](GOOD_FIRST_ISSUES.md) ·
[Changelog](CHANGELOG.md) · [Roadmap](ROADMAP.md) ·
[Latest release](https://github.com/OthmaneBlial/bitborn/releases/latest) ·
[Dated public metrics](docs/metrics.md)

The [evolution backlog](docs/EVOLUTION.md) records the next engineering,
interactive, documentation and research tasks with dependencies and risk.
Run `npm run benchmark` after `make site` for [reproducible host-model measurements](docs/benchmarks.md).
The report separates interpretation, history recording and state restoration;
it excludes DOM rendering and native CPU timing.

## What the tests establish

Independent encoding assertions and branch checks supplement reviewed SHA-256
hashes. QEMU tests verify exact serial output, halt state, actual VGA/loaded-disk
memory, every monitor command, editing, buffer bounds, reboot, and a forced BIOS
disk-read failure. Native Linux CI runs all six ELF payloads. Browser tests
exercise bit edits, opcode changes, unsupported encodings, signature inspection,
full simulated boot, copy controls, reduced-motion mode and mobile layouts.
New checks cover every challenge's positive and negative case, exact bit-edit
budgets, local storage failures, downloaded image/source identity, lab calls and
flags, live memory fetch, breakpoints, and source-derived roadmap rendering.

Hashes prove byte identity, not correctness or authorship. QEMU proves emulated
behavior, not physical-hardware support. CI status is linked above.
The [v0.2.0 exact-commit CI](https://github.com/OthmaneBlial/bitborn/actions/runs/38223386652)
and [tag CI](https://github.com/OthmaneBlial/bitborn/actions/runs/38223865244)
both passed all 37 Python tests, browser checks and artifact reproduction.
At the v0.2 checkpoint, all 135 live runtime files matched local bytes, including
86 curated downloads; the published interactions were repeated in Chrome.
The Unreleased build now has 57 reviewed targets and 90 derived artifacts, adding
the native self-modifying and VGA bitmap raw payloads/images. Later milestone evidence is recorded
in [ROADMAP.md](ROADMAP.md); existing release downloads remain unchanged.

## FAQ and limits

**Isn't machine code just Assembly?** Assembly is a symbolic language; an
assembler encodes it. Here the bytes themselves are the source. Mnemonics only
explain the bytes. Binary versus hex changes notation, not machine behavior.

**Is everything in this repo written in binary?** The target instructions and
data are. Host packaging, tests, docs and website use ordinary tools and languages.
This project does not remove languages from the host environment or from QEMU.

**Was AI used?** Yes. Source editing, explanations, host tools and site creation
were AI-assisted. “Handwritten” describes direct authorship of literal target
instruction bytes, rather than an assembler/compiler output; it does not claim
unassisted human authorship. Inspect the sources, build pipeline and history.

**Does it boot with UEFI?** It targets legacy BIOS and x86 real mode. It is not
an EFI executable, a protected-mode kernel, a filesystem or a production OS.

**Can I use real hardware?** No hardware validation is claimed. The UART poll
can stall on absent hardware; the loader makes one CHS read without retries.
Use a disposable emulator. No physical disk writes are needed to reproduce it.

**Is the browser a complete x86 emulator?** No. It supports documented instruction
forms with simplified flags, BIOS and UART behavior. Unsupported bytes stop;
execution is bounded. Native proof comes from QEMU and Linux CI.

**Why do this?** To make instruction encoding, byte order, control flow, the
stack, firmware and executable formats concrete enough to inspect one bit at a time.

## Credits

Created for [OthmaneBlial](https://github.com/OthmaneBlial). MIT licensed. Intel's
instruction manuals, QEMU, SeaBIOS, Linux and the ELF ABI provide the underlying
interfaces; [technical references](docs/architecture/README.md#technical-references)
link to their primary documentation. No upstream executable blob is embedded
or presented as our target source.
