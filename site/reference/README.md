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

What if you could build a real bootable computer program without writing a
single instruction in a programming language?

bitborn explores that question by encoding machine instructions directly as
binary digits. Every opcode. Every operand. Every branch displacement. No
assembler translates the target code: we author the bytes themselves.

**A real 512-byte BIOS boot program, ten working examples, four byte tools,
and an interactive explorer.** This is an educational experiment, not a
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
Ubuntu CI executes all five.

## Roadmap — visible progress

Updated **2026-10-12** after each verified milestone. See [ROADMAP.md](ROADMAP.md)
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
| v0.1.1 host-tool patch | ✅ Comments/failed-write regression checks pass; patch publication in progress |
| Protected mode, interrupts and executable loading | Future research; no working claim |

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
./tools/bitverify boot.img --size 512 --bios
./tools/bitdiff build/boot.img boot.img
```

| Tool | What it does |
| --- | --- |
| `bitpack` | Strictly packs binary byte tokens; useful source-line errors |
| `bitinspect` | Offsets, binary, hex and known annotated instruction boundaries |
| `bitverify` | Sizes, BIOS signature, reviewed hashes, annotations, source audit and reproduction |
| `bitdiff` | Marks each changed bit, including added or removed bytes |

The host tools are Python. The browser explorer is JavaScript. The **target
machine instructions** are authored directly in `.bits`. Packaging gallery
payloads adds non-executable zero fill, BIOS signatures or ELF headers; it never
generates an instruction. The main boot source already contains all 512 bytes.

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

Each guide links its canonical source, per-byte table, generated binary path,
expected behavior and automated test. `make build` produces the artifacts.
The five ELF programs consist of the unchanged payload plus 120-byte host-packed
headers; they use Linux syscalls with no runtime library or linker.

```sh
qemu-system-i386 -drive file=build/monitor.img,format=raw,if=floppy -boot a -serial stdio
```

Type in the QEMU display and press Enter. The monitor supports exact lowercase
`help`, `clear`, `about`, `reboot` and `peek`; a 15-character input bound and
Backspace editing. `peek` loads the actual byte at physical `7C00`. The monitor
and disk-read images use a separately handwritten loader and two padded sectors.

## Explore and contribute

The static website has an editable instruction playground, all 512 annotated
boot bytes, keyboard navigation, and a step-by-step **bounded educational
simulator**. It never claims native browser execution. `make site-test` builds
the portable site and checks its decoder, simulation, source hashes and links.

```sh
npm ci                         # development-only browser test dependency
npx playwright install chromium
npm run test:browser            # real Chrome interactions and mobile layouts
python3 -m http.server 8000 --directory site
```

[Beginner tutorial](docs/tutorials/from-bits-to-boot.md) · [Contributing](CONTRIBUTING.md) ·
[Changelog](CHANGELOG.md) · [Roadmap](ROADMAP.md) ·
[v0.1.0 release](https://github.com/OthmaneBlial/bitborn/releases/tag/v0.1.0)

## What the tests establish

Independent encoding assertions and branch checks supplement reviewed SHA-256
hashes. QEMU tests verify exact serial output, halt state, actual VGA/loaded-disk
memory, every monitor command, editing, buffer bounds, reboot, and a forced BIOS
disk-read failure. Native Linux CI runs all five ELF payloads. Browser tests
exercise bit edits, opcode changes, unsupported encodings, signature inspection,
full simulated boot, copy controls, reduced-motion mode and mobile layouts.

Hashes prove byte identity, not correctness or authorship. QEMU proves emulated
behavior, not physical-hardware support. CI status is linked above.

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
