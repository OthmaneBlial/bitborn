# A real CPU fault retries the instruction

This 70-byte handwritten binary research probe deliberately divides by zero in
286+ real mode. Vector zero enters a handler that repairs BX, keeps the saved IP
unchanged, and executes IRET. The CPU retries the same two-byte DIV instruction.
This is native QEMU/TCG execution, separate from the browser CPU model.

The [literal source](https://github.com/OthmaneBlial/bitborn/blob/main/tests/fixtures/divide-fault.bits)
contains every instruction byte and its explanation. Python only adds zero
padding and the `55 AA` BIOS signature around those bytes. No assembler or
compiler generates instructions. Run the exact evidence checks with:

```sh
python3 -m unittest tests.test_divide_fault -v
```

The fixture is a test probe, not a new release artifact or gallery executable.
The reviewed target manifest and existing native downloads are unchanged.

## Follow the fault frame

The program normalizes CS, DS and SS to zero, sets SP to `7C00`, keeps IF clear,
and writes the vector-zero pointer `0000:7C31` into physical bytes `0000–0003`.
AX is 42, DX and BX are zero. At `0000:7C25`, literal bytes `F7 F3` request
unsigned division of DX:AX by BX.

The native exception frame contains three 16-bit words:

| Physical address | Value | Meaning |
| --- | --- | --- |
| `7BFA` | `7C25` | Saved IP identifies DIV itself |
| `7BFC` | `0000` | Saved code segment |
| `7BFE` | FLAGS | Saved flags; IF is clear |

The handler pushes AX and BP. With BP equal to the resulting SP (`7BF6`),
`[BP+4]` reads the saved IP using SS. It records that value at `9002`, increments
the entry counter at `9000`, sets BX to 1, restores BP/AX, and returns. It neither
advances the saved IP nor invents a successful division result.

The [Intel system programming manual, section 6.15, Divide Error](https://www.intel.com/content/dam/www/public/us/en/documents/manuals/64-ia-32-architectures-software-developer-vol-3a-part-1-manual.pdf#page=206)
classifies #DE as a fault, with no error code, whose saved instruction pointer
identifies the faulting instruction. This probe targets that 286+ behavior; it
makes no original-8086 claim.

## Native evidence

Tests read actual guest RAM and registers through QMP after a controlled halt.
They verify the vector, unchanged loaded bytes, six-byte saved frame, recorded
fault IP, restored SP and resulting quotient/remainder.

| Handler divisor | Handler entries | Saved IP | Quotient | Remainder | Outcome |
| --- | --- | --- | --- | --- | --- |
| 1 | 1 | `7C25` | 42 | 0 | HLT, next IP `7C2F`, SP `7C00` |
| 2 (one literal-byte edit) | 1 | `7C25` | 21 | 0 | Same controlled halt and restored stack |
| 0 (repair removed) | At least 2 | `7C25` | No completion claim | No completion claim | Repeated faults; test stops the guest |

The zero-divisor negative case has a bounded wait and terminates QEMU. All guest
disks are read-only, networking is disabled, and only this curated fixture is
executed. No arbitrary imported machine code runs on the host.

This probe overwrites vector zero and halts rather than restoring BIOS state.
It is not a general exception dispatcher. Protected-mode fault gates, error-code
frames, hardware interrupts, paging and physical hardware remain separate work.
