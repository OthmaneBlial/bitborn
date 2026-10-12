# Read additional sectors from disk

**Environment:** x86 real-mode BIOS. Loader at 7C00, second stage at 7E00.
**Expected:** `Sector 2 loaded!` on VGA and COM1, then halt.

The separately handwritten [loader](../../boot/loader.bits) reads two CHS
sectors through `INT 13h` and checks carry before jumping. [program.bits](program.bits)
contains only the second stage. [Second-stage byte table](bytes.md).

Run `make build`, then `qemu-system-i386 -drive file=build/disk-read.img,format=raw,if=floppy -boot a -serial stdio`.
`disk-read.bin` is the 91-byte stage; `.img` is a 1,536-byte framed loader plus
two padded sectors. Tests compare loaded guest memory with canonical bytes and
force an invalid-sector BIOS error to prove it stops safely.
