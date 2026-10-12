# Architecture: bytes all the way down

bitborn is an educational experiment. It is not a production operating system,
and its lack of a compiler says nothing about safety, speed or usefulness.

## The source boundary

`boot/*.bits` and `examples/*/program.bits` are canonical target sources. Each
token is **exactly eight literal binary digits**, representing one byte. All
instruction encodings, branch displacements, addresses, strings and constants
were authored directly in this notation. Instruction names in comments are
disassembly for humans; they are never parsed into machine code.

`tools/`, `tests/` and `site/` are **host-side software**, written in Python or
JavaScript. They package, explain, verify and simulate the target bytes. The
browser's JavaScript is not itself a raw-bit target. It does not run native x86.

The packer accepts whitespace and `#` comments, rejects everything except full
binary byte tokens, and copies those byte values to an output file. It has no
instruction table, assembler, macro language, label resolver or compiler.

There are two kinds of packaging:

1. `boot/boot.bits` already contains all 512 bytes, including explicit padding
   and the signature. `bitpack` alone produces the boot image unchanged.
2. Gallery payloads contain their authored instructions and data. Python adds
   **non-executable** sector padding/signatures or ELF headers. Multi-sector
   images concatenate the separately handwritten loader and second-stage bytes.
   No packaging step creates an instruction.

## BIOS target

SeaBIOS in QEMU loads the first sector at physical address `7C00` and transfers
control in x86 real mode. We do not rely on its initial CS representation:
`EA 06 7C 00 00` jumps to `0000:7C06`, establishing CS=0. Interrupts are masked
until DS, ES, SS and SP are configured. DS=ES=SS=0, SP=`7C00`; pushes grow down
below the loaded program. `CLD` makes string instructions advance.

The boot program uses BIOS `INT 10h` mode three and teletype output. It initializes
an emulated COM1 16550-compatible UART to 115200 baud, 8N1, and polls line-status
bit five before transmitting. Output is mirrored to serial so tests can inspect
guest behavior without OCR. The final `CLI; HLT; JMP` loop prevents a fall-through
into data. The UART poll has no guest timeout; a missing or incompatible UART can
stall it. The test runner has a bounded deadline and terminates failed guests.

The 512-byte source has these exact regions:

| Offsets (decimal) | Purpose |
| --- | --- |
| 0–18 | Segment/stack setup and interrupt/direction flags |
| 19–51 | VGA mode and UART initialization |
| 52–86 | String output with BIOS and UART readiness polling |
| 87–90 | Controlled halt |
| 91–238 | Literal ASCII message, line breaks and NUL |
| 239–509 | Explicit zero padding |
| 510–511 | Signature bytes `55 AA` |

`55 AA` is the disk byte order; the corresponding little-endian word is `AA55`.
The signature is data, not two final executed instructions. Files are 512 bytes;
the number of executed instructions is much smaller.

## Disk loader and monitor

The 79-byte handwritten loader uses BIOS `INT 13h`, AH=2, AL=2, CHS cylinder 0,
head 0, sector 2, and the BIOS-supplied boot drive DL. It reads two sectors to
`0000:7E00`, checks carry, and jumps only on success. On failure it prints a VGA
message and halts. It performs one read attempt; retries, EDD/LBA, partition
tables and filesystems are outside this experiment.

`build/disk-read.img` and `build/monitor.img` are 1,536-byte images: one loader
sector and two second-stage sectors. The second stage is padded with zeros.
Its instructions are canonical `.bits`, independently tested in a boot image.

The 462-byte monitor supports exact lowercase `help`, `clear`, `about`, `reboot`
and `peek`. The command buffer is 16 bytes at physical `8200`, immediately after
the loaded sectors. At most 15 printable ASCII bytes are accepted; NUL occupies
the final byte. Backspace cannot move before the buffer. Matching compares every
byte including NUL, so `helpful` does not invoke `help`.

`clear` resets VGA mode but leaves the serial transcript intact. `reboot` invokes
BIOS bootstrap (`INT 19h`), not a hardware power cycle. `peek` is intentionally
fixed: it loads the byte at physical `7C00` and prints uppercase hex. It is a
memory-inspection demonstration, not an arbitrary-address debugger. Output
helpers preserve registers needed by input, comparison and caller state.

## Linux executable examples

Five payloads use x86-64 Linux syscalls, independent of BIOS. Python prepends a
120-byte ELF64 header/program-header pair. One load segment at `400000` is
readable/executable and contains the bytes unchanged. Entry is `400078`.
There is no linker, runtime library or dynamically generated instruction.

Linux x86-64 uses syscall number in EAX and first arguments in RDI, RSI and RDX;
`SYSCALL` is `0F 05`. These files cannot be executed directly on macOS or ARM
Linux. Native execution is required in Ubuntu x86-64 CI; local macOS tests
explicitly skip that one test while still checking headers and payloads.

## Verification and its limits

`targets.json` records reviewed sizes and SHA-256 checksums for every source.
Tests also check independent known encodings and branch destinations rather than
trusting hashes alone. QEMU tests check actual serial bytes, halt state, VGA memory,
loaded disk bytes, command behavior, input bounds, editing, reboot, and a forced
disk error. A mutated peek operand demonstrates that output comes from memory.

Tests cannot establish the human authorship of any project. Source transparency,
reviewable commits, no assembler pipeline, and explicit encoding explanations
make our method inspectable. A hash proves byte identity, not correctness or
authorship. QEMU proves emulator behavior, not physical-hardware compatibility.

The browser simulator is a bounded educational subset. It models only the
documented instruction forms, simplified flags/BIOS/COM1, and bounded memory.
Unknown or unsupported instructions stop with a diagnostic; it is not a complete
x86 emulator, a security sandbox or evidence of native execution.

## Technical references

- [Intel Software Developer's Manuals](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html): instruction encodings, real mode and flags.
- [QEMU invocation reference](https://www.qemu.org/docs/master/system/invocation.html): floppy, serial, TCG and QMP options.
- [QEMU monitor reference](https://www.qemu.org/docs/master/system/monitor.html): register/memory inspection and real screendumps.
- [Linux syscall table](https://github.com/torvalds/linux/blob/master/arch/x86/entry/syscalls/syscall_64.tbl): x86-64 write=1 and exit=60.
- [ELF generic ABI](https://gabi.xinuos.com/elf/): executable format and program headers.
- [UEFI specifications](https://uefi.org/specifications): modern UEFI boot uses a different executable/protocol interface; this BIOS image is not a UEFI application.
