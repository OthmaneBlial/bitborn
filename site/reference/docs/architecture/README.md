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

Six payloads use x86-64 Linux syscalls, independent of BIOS. Python prepends a
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
Unprefixed register-direct MOV byte/word copies have independent byte-layout,
history and [native sampled-flags evidence](register-mov.md). Wider and prefixed
forms remain outside model execution. Unprefixed memory MOV
uses the shared 16-bit address decoder and native/model checks.

## Native indexed pixels

The [native VGA bitmap](../../examples/vga-bitmap/README.md) uses BIOS graphics
mode 13h, the A000 framebuffer aperture and explicit DAC palette writes. A
one-bit source control changes displayed RGB while all 64,000 stored indices
stay identical. Full QEMU framebuffer/screen checks accompany genuine captures;
graphics-mode BIOS, REP MOVSB and palette hardware are outside the browser model.

## Native guarded allocation

The [guarded allocator](../../examples/bounded-allocator/README.md) demonstrates
real-mode byte ownership in one fixed sixteen-byte arena. QMP reads five
native-written request logs and both guards after each boot halts. Carry rejects
address wrap before the upper-bound comparison; the caller checks CF before
writing a marker. This cooperative bump allocation has no free or memory
isolation. Both sources also halt in the model with the same logs, guards and
defined flags; [word-register ADD](register-add.md) has independent arithmetic
and sampled native evidence. Model RAM/state rewind is checked separately.

## Native timer delivery

The [native timer experiment](../../examples/timer-irq/README.md) remaps legacy
PIC/PIT IRQ0 to one protected-mode interrupt gate. It records actual saved frames,
compares saved IF with the handler's PUSHFD image, sends EOI and returns with
IRETD. One count bit changes three entries to two; one port bit leaves an IRQ
in service with another request pending. It has no general interrupt driver,
APIC or browser hardware model, and makes no timing claim.

## Native paging and fault repair

The [native paging experiment](../../examples/paging/README.md) builds a legacy
directory/table in RAM, enables supervisor write protection and faults on a
read-only page. It records error 3 and CR2, repairs the PTE, uses INVLPG and
retries the original store with IRETD. Both complete structures and the retained
frame are inspected in QEMU. PTE/WP controls distinguish permission from
supervisor behavior; browser paging and user-mode isolation remain outside scope.

## Shared legacy exception frames

The [exception dispatcher](../../examples/exception-dispatch/README.md) maps
eighteen of twenty legacy vector slots to one shared handler. No-error stubs
insert zero before the vector; hardware-error stubs add only the vector. Native
DE, BP, UD and GP delivery yields the same five-DWORD layout. PUSHAD preserves
general registers, the log records original and return EIP, and IRETD discards
only the two normalized software slots. The authored fault sites advance two
bytes; the breakpoint trap retains its already-advanced EIP. Other policies stop
after capture. One-bit controls remove DE, retain one diagnostic context or retry
DE until the four-record capacity guard stops a fifth entry. Exact logs, contexts,
guards, source RAM and mixed-mode goldens are captured and revalidated. Other
native delivery, general recovery, privilege transitions and modern vectors
remain unverified; the bounded model stops before protection at LGDT.

## Native text-game state

[Bit Hunt](../../examples/bit-hunt/README.md) keeps eight initialized state bytes
between A5/5A guards. Candidates are bounded before immutable map reads and wall
tests. The player overlays sixty literal cells in actual VGA RAM; it never
rewrites the map. Movement saturates at FF, victory is sticky until reset, and
the processed-key word wraps intentionally without indexing memory. A coordinate
oracle verifies native input/state/display, including 260 moves; a one-bit goal
predicate changes only victory on the identical route. Twenty actual QEMU screens
are cropped/enlarged and encoded with every GIF pixel checked against its source
capture. The 492-byte payload fits the model input limit but stops atomically at
the first C6 store before keyboard play.

## Technical references

The [ring-three privilege research fixture](user-privilege.md) proves outward
IRETD, a native HLT privilege fault, TSS-selected kernel stack and return to user
code. Its flat memory remains shared; syscall gates and scheduling are separate.

- [Intel Software Developer's Manuals](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html): instruction encodings, real mode and flags.
- [QEMU invocation reference](https://www.qemu.org/docs/master/system/invocation.html): floppy, serial, TCG and QMP options.
- [QEMU monitor reference](https://www.qemu.org/docs/master/system/monitor.html): register/memory inspection and real screendumps.
- [Linux syscall table](https://github.com/torvalds/linux/blob/master/arch/x86/entry/syscalls/syscall_64.tbl): x86-64 write=1 and exit=60.
- [ELF generic ABI](https://gabi.xinuos.com/elf/): executable format and program headers.
- [UEFI specifications](https://uefi.org/specifications): modern UEFI boot uses a different executable/protocol interface; this BIOS image is not a UEFI application.
