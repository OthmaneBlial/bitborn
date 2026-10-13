# Your first program, without an assembler

Use a Linux x86-64 host or macOS with Python 3.10+ and QEMU installed. No compiler
or assembler is needed. On macOS, `brew install qemu` supplies system emulation;
on Ubuntu, install `python3 make qemu-system-x86`. Linux executable examples need
a Linux x86-64 kernel. QEMU TCG handles the BIOS targets even on Apple Silicon.

```sh
git clone https://github.com/OthmaneBlial/bitborn.git
cd bitborn
make test
make run
```

1. Open `boot/boot.bits`. The first literal byte `11111010` is CLI. The next five
   bytes are a far jump. Comments explain the binary; no tool translates them.
2. Run `./tools/bitpack boot/boot.bits boot.img`. It parses bytes, strips whitespace
   and comments, then writes exactly 512 bytes. Invalid tokens fail before writing.
3. Run `./tools/bitverify boot.img --size 512 --bios`. This checks the size and disk
   signature. Run `make verify` for all reviewed hashes and canonical sources.
4. Inspect the file with `./tools/bitinspect boot.img --annotations boot/annotations.json`.
   Offset 0 has FA; offsets 510 and 511 have 55 and AA.
5. Run `make run`. SeaBIOS loads the sector, the CPU executes the manually encoded
   instructions, VGA displays the greeting, and the serial terminal gets a copy.
   Close the QEMU window to stop it.

## A deliberate one-bit change

Make a copy of `.bits`, flip one bit in a **message data byte**, then pack it into
a different image. Use `./tools/bitdiff build/boot.img changed.img` to see which
bit changed. Changing an opcode or branch can crash, hang or run into data;
use a disposable emulator. You do not need to write an image to a physical disk.

## Reproduce all outputs

```sh
make clean
make test
qemu-system-i386 -drive file=build/monitor.img,format=raw,if=floppy -boot a -serial stdio
```

The monitor waits for the emulated keyboard, not serial input. Focus the QEMU
display, type `help` and press Enter. `peek` reads the first boot byte; `clear`
clears VGA; `reboot` reloads through BIOS. The `disk-read.img` target prints
`Sector 2 loaded!` only after the loader has actually read the second stage.

The six `.elf` examples are executable on Linux x86-64 only. Exit statuses 42
or 5 are the expected results, so a shell may label successful demonstrations as
nonzero commands. For example: `./build/exit-code.elf; echo $?` prints 42.

## Troubleshooting

- **No QEMU:** install it and check `qemu-system-i386 --version`. Tests fail rather
  than quietly skipping BIOS execution. Set `QEMU=qemu-system-x86_64` to use that
  installed system emulator for tests.
- **Headless host:** `make test` uses no display and captures serial; `make run`
  expects a graphical display. CI tests real guest behavior through QMP.
- **Native Linux test skipped on macOS:** expected. That test is mandatory on
  Linux x86-64 CI, where all six ELF programs execute.
- **Checksum mismatch after editing:** review your byte changes and independent
  encoding/behavior tests before updating `targets.json`. Never treat a new hash
  as proof that an altered program works.

## What happens next?

Follow the [roadmap](../../ROADMAP.md). Protected mode, custom interrupt handlers,
memory management and executable loading have specific support boundaries in
[execution scope](../execution-scope.md); broader support remains research.
Begin with [one byte, one word, one branch](byte-order.md) and the existing
verified examples.
