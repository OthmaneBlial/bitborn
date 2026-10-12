# Cross into 32-bit protected mode

**Environment:** BIOS real mode on entry, ring-zero 32-bit protected mode after
the far jump. The existing [two-sector loader](../../boot/loader.bits) loads
the stage at physical `7E00`. **Expected:** green `PM` in the first two VGA
text cells, `ECX=4B4F4D50` (`PMOK`), and a controlled halt.

The [568-byte source](program.bits) contains literal binary digits, including
every executable instruction, GDT descriptor, IDT entry and padding byte.
Mnemonics in comments explain the bytes; they are never assembly input.
[Every byte explained](bytes.md). Development and review were AI-assisted.

Build the integrated target with `make build`, then run:

```sh
qemu-system-i386 -drive file=build/protected-mode.img,format=raw,if=floppy -boot a
```

Run the native assertions with `python3 -m unittest tests.test_protected_mode -v`.
The tests package the unchanged literal stage with the existing loader in a
temporary image, so they also run before the target is added to a build.

## The transition, byte by byte

1. `CLI` clears IF. Writes of `FF` to PIC mask ports `21` and `A1` mask the
   external IRQ lines. DS and SS are zero and the real-mode stack is at `7C00`.
2. `LGDT [7F18]` loads the base and limit of three descriptors: a null entry,
   flat 32-bit code, and flat writable data. The selector `0008` chooses entry
   one; `0010` chooses entry two. Both are ring zero.
3. `MOV EAX,CR0`, `OR EAX,1`, `MOV CR0,EAX` set **PE**, preserving the other
   control bits. Paging stays disabled. The `66` on OR chooses a 32-bit operand
   while the old code segment still has 16-bit defaults.
4. `66 EA 40 7E 00 00 08 00` is a far jump to `0008:00007E40`. Loading CS from
   the code descriptor makes its **D** bit select 32-bit default instruction
   operands and addresses. The jump also replaces the old segment cache.
5. DS, ES, FS, GS and SS become `0010`. ESP becomes `00009000`. The descriptors
   have base zero and inclusive limit `FFFFFFFF`: their 20-bit limit `FFFFF`
   combines with granularity **G=1**, while the data descriptor's **B=1** makes
   stack addressing use ESP. No paging translation is involved.

The layout is deliberately fixed so the addresses can be checked by hand:

| Physical address | Source offset | Meaning |
| --- | --- | --- |
| `7E00` | 0 | Real-mode entry |
| `7E40` | 64 | First instruction with 32-bit defaults |
| `7E6B` | 107 | `INT 20h` |
| `7E6D` | 109 | Return address after the software interrupt |
| `7E92` | 146 | Success HLT; QEMU reports EIP `7E93` |
| `7E95` | 149 | Controlled failure path |
| `7E9A` | 154 | Failure HLT; QEMU reports EIP `7E9B` |
| `7EA0` | 160 | Interrupt handler |
| `7F00` | 256 | GDT, three eight-byte descriptors |
| `7F18` | 280 | Six-byte GDTR pointer |
| `7F1E` | 286 | Six-byte IDTR pointer |
| `7F30` | 304 | IDT, 33 eight-byte slots |
| `8030` | 560 | IDT vector `20h` gate |

## Flat memory and a software interrupt

`EAX=11223344` is stored at linear and physical address `9000`. EBX reads it
back, giving the RAM bytes `44 33 22 11`. These are 32-bit operands and addresses,
not 16-bit instructions with a new label.

`LIDT [7F1E]` loads an inclusive limit of 263 and base `7F30`. The sole present
gate is vector `20h`: `A0 7E 08 00 00 8E 00 00`. Its split handler offset is
`00007EA0`, code selector is `0008`, and attributes `8E` mean a present ring-zero
32-bit interrupt gate. IF does not block the explicit software instruction
`INT 20h`.

The processor saves a 12-byte same-privilege interrupt frame below ESP: return
EIP `7E6D` at `8FF4`, CS `0008` at `8FF8`, and EFLAGS at `8FFC`. The handler
writes `C0DEC0DE` to RAM `9004`, then executes `CF`, **IRETD** under 32-bit
defaults. EIP, CS, EFLAGS and ESP are restored. EDX reads the handler marker
after the return. Two comparisons select `PMOK` or `FAIL`; both paths halt
with IF clear and have a backward jump to HLT if execution resumes.

The native QEMU tests assert CR0.PE, disabled paging, CS32, all flat segment
selectors, 32-bit general registers, the actual loaded instruction bytes,
the interrupt frame, restored ESP, handler RAM marker, VGA bytes and `HLT=1`.
A one-bit change to the EAX immediate proves the failed-readback branch reaches
its separate controlled halt. This is QEMU/TCG guest execution, separate from
the browser's limited 16-bit teaching model.

## Deliberate limits

This is a mode-transition demonstration, not an operating system. IDT vectors
`00h`–`1Fh` are null: exceptions and NMI are not handled. External PIC IRQs
are masked and IF remains clear. There is no paging, user mode, task switching,
hardware interrupt driver or BIOS service call after the transition. All
accessed addresses are below 1 MiB, so the example does not need an A20 change.
The processor can set descriptor accessed bits at runtime; those mutable
data bytes do not change the canonical instruction source.

The encoding and transition reference is Intel's
[Software Developer's Manual](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html),
Volume 2 (LGDT/LIDT, MOV control registers, JMP, INT and IRET) and Volume 3A
(protected-mode initialization, descriptors and interrupt gates).
