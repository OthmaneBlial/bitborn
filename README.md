# bitborn

### Software born from raw bits.

**No C. No Rust. No Assembly. No compiler. Just 0s and 1s.**

A real BIOS boot program, written directly as binary digits. Every opcode,
operand and message byte lives in [boot/boot.bits](boot/boot.bits). Python packs
those already-authored bytes. No assembler or compiler creates the target code.

```sh
make test  # Python 3.10+ and QEMU are required
make run   # boots the 512-byte image; VGA plus serial output
```

The first target prints the bitborn greeting and enters a controlled halt loop.
This is an educational x86 real-mode experiment, not a production operating
system. It uses legacy BIOS services, not UEFI. Host tooling uses Python; target
source uses only literal binary byte tokens. Disassembly in comments explains
the encodings; it is never an input to a code generator.

```sh
./tools/bitpack boot/boot.bits boot.img
./tools/bitinspect boot.img --annotations boot/annotations.json
./tools/bitverify boot.img --size 512 --bios
./tools/bitdiff build/boot.img boot.img
```

The source is 512 bytes when packed, with `55 AA` at offsets 510–511. Automated
tests check instruction encodings, branch displacements, the reviewed SHA-256,
and actual QEMU serial output.

## Roadmap — current progress

Updated **2026-10-12** with each verified milestone. See [ROADMAP.md](ROADMAP.md)
for the evidence and remaining gates.

| Milestone | Progress |
| --- | --- |
| 512-byte handwritten boot program and four byte tools | ✅ QEMU-tested, public |
| Linux exit, arithmetic, text, loops and comparisons | ✅ Native execution passed in Linux CI |
| BIOS keyboard and direct VGA memory writes | ✅ QEMU-tested |
| Multi-sector disk loading and interactive monitor | ✅ QEMU-tested: help, clear, about, reboot, peek |
| Interactive `.io` website and visual boot explorer | In progress |
| Real boot recording, complete tutorials and v0.1.0 release | In progress |
| Protected mode, interrupts and executable loading | Future research; no working claim |

Run the monitor with `qemu-system-i386 -drive file=build/monitor.img,format=raw,if=floppy -boot a -serial stdio`.
Type a command and Enter. Commands are exact lowercase words, input is bounded
to 15 printable ASCII characters, Backspace edits the line, and `peek` reads the
actual byte at physical address `7C00`. This is deliberately a small monitor.
