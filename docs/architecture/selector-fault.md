# The extra doubleword in an exception frame

A separate 256-byte literal probe enters 32-bit protected mode and attempts to
load DS with selector `0018`. The GDT has only three descriptors (indices 0, 1,
2), so index 3 lies beyond its limit of 23. The CPU raises general protection,
enters the vector-thirteen gate, and pushes selector error code `0018` before
the saved EIP, CS and EFLAGS.

```sh
python3 -m unittest tests.test_selector_fault -v
```

Every instruction, pointer and gate is in the
[canonical .bits fixture](https://github.com/OthmaneBlial/bitborn/blob/main/tests/fixtures/protected-selector-fault.bits).
The test runs this curated program in QEMU/TCG with a read-only BIOS image and
networking disabled. Host tooling adds only boot padding/signature. Release
artifacts and the existing protected-mode example remain unchanged.

## Read the real frame

| Physical address | CPU-saved value before handler adjustment |
| --- | --- |
| `8FF0` | Error code `00000018` |
| `8FF4` | Fault EIP `00007C42` |
| `8FF8` | Code selector `00000008` |
| `8FFC` | EFLAGS, with IF clear |

The error code identifies GDT index 3 (`18 >> 3`), with EXT, IDT and TI clear.
The handler at `7C4D` first executes literal `5A` (POP EDX), recording that
doubleword at `9004`. Now `[ESP]` addresses the saved EIP. The handler records
the original `7C42` at `9000`, advances that saved EIP by the known two-byte
length of this failed `8E D8` segment-load instruction, and executes IRETD.

If the handler passed the error code directly to IRETD, the frame would be
misaligned. [The no-error-code UD2 probe](protected-fault.md) requires no such
extra pop; these two cases are deliberately distinct.

The [Intel system programming manual, section 6.15, General Protection](https://www.intel.com/content/dam/www/public/us/en/documents/manuals/64-ia-32-architectures-software-developer-vol-3a-part-1-manual.pdf#page=224)
describes selector-bearing error codes and the faulting saved instruction pointer.
This probe tests one specific invalid segment load rather than all #GP causes.

## QEMU evidence and limits

The checks read actual guest RAM and registers: original fault EIP `7C42`, error
code `18`, adjusted frame EIP `7C44`, code selector 8, restored ESP `9000`, and
a controlled halt with next EIP `7C4B`. DS stays `0010` with its valid flat base
and limit: the failed load does not replace it. EDX retains the popped error
code, while EAX/ECX retain the recorded fault address. Two additional one-byte
selector edits verify `0020` produces error code `0020`, while `001B` (the same
index as `0018`, with RPL 3) produces `0018`: the error-code low bits describe
the error source rather than copying the selector's RPL. All bytes in guest code,
gate tables and pointers match source, allowing only CPU-managed descriptor
accessed-bit changes.

There is one present gate, for #GP. This is not a general fault dispatcher or
safe recovery policy for arbitrary instructions. It skips one known two-byte
instruction, keeps maskable interrupts disabled, and supplies no privilege
transition, hardware IRQ, paging or physical-hardware proof.
