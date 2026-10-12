# Read a keyboard character

**Environment:** x86 real-mode BIOS, boot at 7C00. **Expected:** serial `>`, then
one key echoed to VGA and COM1, followed by halt.

[program.bits](program.bits) establishes segments/stack, initializes VGA and
COM1, signals readiness, then invokes BIOS `INT 16h`, AH=0. The returned AL is
preserved across VGA output and UART polling. [Byte table](bytes.md).

Run `make build`, then `qemu-system-i386 -drive file=build/keyboard.img,format=raw,if=floppy -boot a -serial stdio`.
Type in the QEMU display, not the serial terminal. `keyboard.bin` is the 89-byte
payload; packaging adds zero fill and a signature to make a 512-byte image.
`test_bios_keyboard` injects a real QEMU key and checks exact serial echo.
