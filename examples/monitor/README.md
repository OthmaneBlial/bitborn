# A tiny interactive monitor

**Environment:** x86 real-mode BIOS, loader at 7C00 and monitor at 7E00.
**Expected:** welcome plus prompt; exact lowercase commands `help`, `clear`,
`about`, `reboot`, `peek` after Enter.

[program.bits](program.bits) implements a bounded 15-character printable ASCII
line, Backspace editing, exact NUL-terminated comparison, procedure calls, real
boot-memory reads and hexadecimal output. [Byte table](bytes.md).

Run `make build`, then `qemu-system-i386 -drive file=build/monitor.img,format=raw,if=floppy -boot a -serial stdio`.
Type in the QEMU display. `monitor.bin` is the 462-byte stage; `.img` combines
the handwritten loader with two padded stage sectors (1,536 bytes total).

`peek` reads only physical 7C00. `clear` clears VGA, not serial history. `reboot`
invokes BIOS bootstrap, not a power cycle. Tests exercise every command, bounds,
empty Backspace, exact matching, editing, guest memory and the alternate peek
operand. General addresses, filesystems and executable loading are future work.
