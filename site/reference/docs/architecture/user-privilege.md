# Enter ring three. Fault. Return.

This **496-byte literal research fixture** proves a curated legacy protected-mode
privilege path in QEMU/TCG. Kernel code builds an outward IRETD frame, enters
CPL three, and attempts HLT. The processor raises #GP(0), switches to the kernel
stack named by the loaded TSS, and delivers a real six-word error/privilege frame.
The handler records it, advances only the saved EIP past this authored one-byte
fault site, discards the error code and returns to the original user stack.

```sh
python3 -m unittest tests.test_user_privilege -v
```

The [canonical source](https://github.com/OthmaneBlial/bitborn/blob/main/tests/fixtures/user-privilege.bits) contains every
instruction, descriptor and TSS byte. Host packaging adds only BIOS padding and
the boot signature. This fixture is outside the release/download manifest; it
does not change the frozen v0.5.0 distribution. It is not browser CPU emulation.

## Selectors and exact addresses

| Item | Value |
| --- | --- |
| Protected entry | `7C28`, kernel CS `0008` |
| Kernel data/stack | Selector `0010`, stack top `9000` |
| User entry and stack | `7C70`, CS `001B`, SS/DS/ES `0023`, ESP `A000` |
| User EFLAGS on entry | `0402`: DF one, IF zero, IOPL zero |
| Authored user HLT | `7C7F`, source byte 127, `F4` |
| Returned instruction | `7C80`; writes the second user marker |
| Stable user checkpoint | `7C8A`, `EB FE`; CPL three and HLT zero |
| Kernel handler | `7C90`, hardware vector 13 through a DPL-zero interrupt gate |
| GDT and pointers | `7CD0`, 48 bytes; GDTR `7D00`, IDTR `7D06` |
| TSS | `7D10`, selector `0028`, inclusive limit `0067` |
| TSS stack fields | ESP0 `9000` at TSS offset 4; SS0 `0010` at offset 8 |
| I/O map base | TSS offset 102 contains `0068`, beyond the TSS limit |
| IDT | `7D80`, 14 entries; vectors 0–12 absent, vector 13 present |

GDT entries use separate flat DPL-zero and DPL-three code/data descriptors. LTR
loads the available 32-bit TSS descriptor and marks it busy. This is stack
selection for an interrupt privilege change, not a hardware task switch.

## Read the actual privilege frame

The #GP entry uses TSS.SS0:ESP0. The processor's six words occupy `8FE8–8FFF`:

| Address | Captured word |
| --- | --- |
| `8FE8` | Error code `00000000` |
| `8FEC` | Fault EIP `00007C7F` |
| `8FF0` | User CS `0000001B` |
| `8FF4` | Saved EFLAGS: DF retained, IF/IOPL zero |
| `8FF8` | Old user ESP `0000A000` |
| `8FFC` | Old user SS `00000023` |

PUSHAD saves general registers immediately below that frame at `8FC8–8FE7`.
The handler copies the six original hardware words to `6000–6017`, samples its
actual CS/SS as `0008/0010` at `6018/601A`, and records the frame-copy end `9000`
at `601C`. Its delivery marker at `6020` changes from zero to one.

The actual return frame differs from the captured frame only in saved EIP:
`7C7F → 7C80`. ADD ESP,4 removes the real error word before IRETD restores the
outer CS/EFLAGS/SS/ESP. The tests independently check both the original and
modified frames, known ECX/ESI/EDI values, retained PUSHAD words, returned segments,
DF/IF/IOPL, busy TSS descriptor, unchanged instruction/TSS RAM and read-only disk.
Only processor-managed GDT accessed/busy bits may change in the loaded source.

## One bit removes the fault

The curated control toggles source byte 127 bit zero: `F4` (HLT) becomes `F5`
(CMC). Both cases write `11223344` to `6080`, then `55667788` to `6084`, and reach
the same non-halting user checkpoint with ESP `A000`. The CMC control leaves
the handler marker zero and flips CF to one. The HLT case records #GP and returns
with CF zero. This comparison explicitly includes the differing carry flag.

## What this does not prove

The flat user descriptors deliberately share the address space: user code can
write the markers also read by the kernel. There is **no memory isolation** here.
Only one authored privilege fault is handled; other IDT entries are absent.
There is no syscall gate, scheduler, arbitrary recovery, user I/O execution,
modern long-mode TSS, physical-hardware result or UEFI support in this fixture.
The final checkpoint spins until the test stops the guest through QMP.

The next milestone is a separately proved callable user/kernel gate and a
gate-permission control. See [the roadmap](../../ROADMAP.md).

Normative reference: [Intel SDM Volume 3A, revision 093](https://cdrdv2-public.intel.com/929359/253668-093-sdm-vol-3a.pdf),
sections 6.9 (privileged instructions), 7.12.1 (exception-handler procedures)
and 10.2.1 (32-bit TSS). The [official download index](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html)
identifies that revision. These manuals explain the architecture; the literal
source and actual QEMU tests establish this fixture's particular result.
