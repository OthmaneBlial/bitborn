# Call the kernel through literal gate bits

This **696-byte research fixture** runs a curated user/kernel call in QEMU/TCG.
User code at CPL three executes `INT 0x20`. A DPL-three 32-bit IDT interrupt gate
targets ring-zero code; the processor selects TSS.SS0:ESP0, records the outer
user context, and executes the service. That service records its actual hardware
frame and kernel selectors, preserves general registers and returns with IRETD.

```sh
python3 -m unittest tests.test_user_gate tests.test_user_privilege -v
```

Every instruction and descriptor is in the
[literal source](https://github.com/OthmaneBlial/bitborn/blob/main/tests/fixtures/user-gate.bits).
The existing handwritten loader reads two sectors and enters `0000:7E00`.
Host packaging adds only sector padding/signature: the complete test image is
1,536 bytes. This fixture is outside the release/download manifest and does not
change the frozen v0.5.0 assets. The browser model does not implement this path.

## Follow the actual call

| Item | Value |
| --- | --- |
| Protected entry | `7E28`, kernel CS `0008` |
| User entry | `7E70`, CS `001B`, DS/ES/SS `0023`, ESP `A000` |
| User flags | `0402`: DF one, IF and IOPL zero |
| Software INT | `7E7F`, bytes `CD 20` |
| Return instruction | `7E81`; writes the after-call marker |
| User checkpoint | `7E8B`, `EB FE`, CPL three and HLT zero |
| Service and denied-gate stop | `7E90` / `7ED0` |
| Kernel stack | SS `0010`, TSS.ESP0 `9000` |
| GDT / TSS / IDT | `7F00` / `7F40` / `7FB0` |
| Loaded TSS | Selector `0028`, inclusive limit `0067` |
| Gate entry | Source bytes 688–695: `90 7E 08 00 00 EE 00 00` |

The normal software INT adds five hardware words, with **no error-code word**:

| Kernel stack address | Word |
| --- | --- |
| `8FEC` | Following user EIP `00007E81` |
| `8FF0` | User CS `0000001B` |
| `8FF4` | Saved user EFLAGS |
| `8FF8` | Old user ESP `0000A000` |
| `8FFC` | Old user SS `00000023` |

PUSHAD stores the caller registers at `8FCC–8FEB`. The service copies the five
original words to `6000–6013`, samples actual kernel CS/SS at `6014/6016`, and
records the frame-copy end `9000` at `6018`. Marker `6020` becomes one.
POPAD/IRETD leaves the return frame unchanged and restores the user stack.

Tests check ECX `13579BDF`, ESI `11223344`, EDI zero and EAX `23`, as well as
retained register words, DF/IF/IOPL, segments and ESP. The after-call marker
becomes `55667788`; the before-call marker is `11223344`. Both native snapshots
check the loaded source/TSS and unchanged loader/disk. Only CPU-managed GDT
accessed/busy bits may change in the loaded source.

## One permission bit denies the call

Gate attribute byte 693 is `EE`: present, DPL three, 32-bit interrupt gate. Toggle
bit five and it becomes `CE`, DPL two. The instruction bytes and target handler
are identical, but CPL three cannot invoke that software gate.

The processor raises #GP with error `0102`: IDT entry 32 (`32 × 8`) plus the IDT
indicator bit (`2`), with no external indicator. Its saved EIP is the **original
INT address `7E7F`**, rather than the following instruction. The six hardware
words at `8FE8–8FFF` are copied to `6040–6057` and retained unchanged. Actual
kernel CS/SS are captured at `6058/605A`; marker `6020` becomes two. The GP handler
halts deliberately at CPL zero, next EIP `7EF9`, with ESP `8FE8`.

The before-call marker is present; the explicitly initialized after-call marker
remains zero. This proves that the denied call neither reaches the permitted
service nor resumes the user's after-call instruction. The stop handler does not
attempt arbitrary recovery or promise to preserve registers for a later return.

## Scope

This is one fixed software-interrupt service that logs its frame. It establishes
the native gate-permission and return path, rather than an operating-system API.
Flat user and kernel memory is shared; **memory isolation is not established**.
Only GP and vector 32 gates are present. There is no Linux syscall ABI, scheduler,
hardware IRQ handling, general fault recovery, long-mode TSS, physical-hardware
result or UEFI support in this fixture.

Pair it with the [user HLT privilege fault](user-privilege.md): hardware-generated
GP delivery can enter a DPL-zero exception gate, while this software INT is
checked against its gate DPL. Both use the loaded TSS for the kernel stack.

Normative reference: [Intel SDM Volume 3A, revision 093](https://cdrdv2-public.intel.com/929359/253668-093-sdm-vol-3a.pdf),
section 7.12.1 for legacy handler privilege rules and section 10.2.1 for the TSS.
The literal source and actual QEMU tests prove this fixture's particular frames.
