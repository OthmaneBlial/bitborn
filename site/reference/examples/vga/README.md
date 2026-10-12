# Write directly to VGA text memory

**Environment:** x86 real-mode BIOS, boot at 7C00. **Expected:** bright green `B`
in the first VGA text cell, then halt.

[program.bits](program.bits) sets video mode three, ES=B800, DI=0, AX=0A42.
`AB` (`STOSW`) writes character byte 42 and attribute 0A to physical B8000.
This is a memory write, rather than BIOS teletype output. [Byte table](bytes.md).

Run `make build`, then `qemu-system-i386 -drive file=build/vga.img,format=raw,if=floppy -boot a`.
The raw 36-byte payload is `vga.bin`; `vga.img` adds non-executable framing to
512 bytes. `test_direct_vga_memory_write` reads the actual guest VGA cell.
