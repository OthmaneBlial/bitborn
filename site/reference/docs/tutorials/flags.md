# Same result bits, different questions: carry and signed overflow

Open the [CPU lab](https://othmaneblial.github.io/bitborn/cpu-lab/) and select
**02 / Arithmetic & flags**. Reset, then Step through the
[existing literal source](../cpu-lab/flags.bits). The model initializes its
registers and flags deterministically; this is not a BIOS register snapshot.
MOV changes AX without recalculating arithmetic flags.

| Step | AX (hex) | CF | OF | ZF | SF | PF | AF |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | 0000 | 0 | 0 | 0 | 0 | 0 | 0 |
| 1 | FFFF | 0 | 0 | 0 | 0 | 0 | 0 |
| 2 | 0000 | 1 | 0 | 1 | 0 | 1 | 1 |
| 3 | 0001 | 1 | 0 | 0 | 0 | 0 | 0 |
| 4 | FFFF | 1 | 0 | 0 | 1 | 1 | 1 |
| 5 | FFFF | 0 | 0 | 1 | 0 | 1 | 0 |
| 6 | FFFF | 0 | 0 | 1 | 0 | 1 | 0 |

At step 2, `FFFF + 1` exceeds an unsigned word and stores zero: CF=1, ZF=1.
As signed words, the same operands represent −1 + 1 = 0, which fits: OF=0.
Step 3 is INC; it changes AX and arithmetic condition flags while preserving CF.
Step 4 subtracts 2 from 1, producing FFFF and an unsigned borrow (CF=1).
Step 5 is CMP: it leaves AX unchanged but updates flags as if FFFF−FFFF had been
computed. ZF=1 here does not mean the register AX is zero. Step 6 is HLT.

## Observe signed overflow without unsigned carry

The [reviewed signed-overflow solution](../../challenges/signed-overflow/solution.bits)
contains `MOV AX,7FFF` followed by `ADD AX,1`.
[Load its exact bytes in the CPU lab](https://othmaneblial.github.io/bitborn/cpu-lab/#program=v1.FAB8FF7F050100F4)
and press Step three times (CLI, MOV, ADD). AX is 8000:

- Unsigned: 32767 + 1 = 32768 fits, so CF=0.
- Signed: the largest positive word plus one becomes the bit pattern for −32768,
  so OF=1; the stored high bit makes SF=1.

This imported fragment uses the lab's 7C00 model start. The native challenge is
loaded at 7E00; neither the import nor the website executes native machine code.
The failing [challenge seed](../../challenges/signed-overflow/start.bits) starts
with 7FFE. In the [challenges](https://othmaneblial.github.io/bitborn/challenges/),
flip byte 2 bit 0 to reach the signed boundary and Validate.

## Parity looks only at the low byte

PF=1 means the last relevant result's low byte contains an even number of set
bits. Zero has zero set bits, which is even. Both result 0000 and result 8000
have low byte 00 and PF=1, although 8000 contains one set bit in the whole word.
PF is not a count of the entire register, and MOV does not recompute it.

AF describes carry or borrow across bit 3. Both additions above carry across
that nibble boundary and set AF=1. Flag behavior depends on the instruction;
not every flag is meaningful after every operation.

## A question mark is a deliberate boundary

Select **03 / Stack, CALL & RET**, Reset, then Step three times. The third
instruction is XOR AX,AX. The model reports CF=0, OF=0, ZF=1, SF=0, PF=1,
and **AF=?**. XOR leaves AF architecturally undefined. The displayed FLAGS word
encodes that unknown bit as zero for presentation; this does not assert that a
physical CPU must return AF=0. Back restores the preceding recorded flag values;
Forward restores the question mark without executing XOR again.
The [actual browser recording](../../assets/cpu-lab-demo.gif) captures undefined
AF, unsigned wrap, INC's preserved carry and the signed-overflow comparison.

Intel's [instruction-set reference](https://cdrdv2-public.intel.com/789581/325383-sdm-vol-2abcd.pdf)
defines ADD, INC, CMP and XOR flag effects. The model's
[execution boundaries](../execution-scope.md) remain explicit.

## Separate the evidence

`node tests/test_flag_lesson.mjs` checks every published table row, both existing
overflow/carry solutions and the undefined-AF rewind/replay. Browser regression
checks verify the actual displayed flags and accessible undefined label at
desktop and 320px. The existing exhaustive
[flag properties](../../tests/test_flags_properties.mjs) use an independent
integer oracle across 81,691 modeled instructions.

`python3 -m unittest tests.test_flag_lesson_native` boots only the two reviewed
challenge solutions through QEMU. It compares AX and all six **defined** ADD
condition flags with independent expected masks and the model, checks the loaded
source bytes, and preserves the disk image. No undefined native AF value, native
instruction history, physical hardware or general emulator compatibility is claimed.
