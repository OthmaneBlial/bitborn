# Follow a word onto the stack, then follow a return address

Open the [CPU lab](https://othmaneblial.github.io/bitborn/cpu-lab/), select
**03 / Stack, CALL & RET**, and press Reset. The lab initializes `CS:IP` and
`SS:SP` to `0000:7C00`. The [13-byte source](../cpu-lab/stack.bits) is a teaching
fragment that relies on this model setup, not a standalone bootable image.
Every instruction already exists in the shared decoder and model.

## Predict before pressing Step

Use the register panel, Stack panel and **SS:SP** memory shortcut together.
The table shows the state **after** each press. Hexadecimal values have no `0x`
prefix here; the two stack bytes are at physical addresses `07BFE`, `07BFF`.

| Step | Instruction just executed | AX | BX | SP | Next logical IP | Bytes at 07BFE / 07BFF |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | Initialized model state | 0000 | 0000 | 7C00 | 7C00 | 00 / 00 |
| 1 | MOV AX,1234 | 1234 | 0000 | 7C00 | 7C03 | 00 / 00 |
| 2 | PUSH AX | 1234 | 0000 | 7BFE | 7C04 | 34 / 12 |
| 3 | XOR AX,AX | 0000 | 0000 | 7BFE | 7C06 | 34 / 12 |
| 4 | POP BX | 0000 | 1234 | 7C00 | 7C07 | 34 / 12 |
| 5 | CALL +1 | 0000 | 1234 | 7BFE | 7C0B | 0A / 7C |
| 6 | INC AX | 0001 | 1234 | 7BFE | 7C0C | 0A / 7C |
| 7 | RET | 0001 | 1234 | 7C00 | 7C0A | 0A / 7C |
| 8 | HLT | 0001 | 1234 | 7C00 | 7C0B | 0A / 7C |

PUSH first decreases SP by two, then stores the word low byte first. XOR changes
AX without changing its saved word. POP reads that word into BX and increases SP
by two. **Popping does not erase RAM.** At step 4, use the physical memory address
`07BFE` to inspect the retained `34 12`; the Stack panel now starts at `7C00`.

## Why CALL saves 7C0A, not 7C0B

CALL starts at offset 7 and occupies three bytes, `E8 01 00`. Its return address
is therefore the instruction end: logical IP `7C0A`. The signed displacement +1
selects the helper at `7C0B`. CALL pushes the return address, not the destination
and not the source array offset 10. That push overwrites the old saved `1234` word.
RET later reads `7C0A` back into IP and restores SP. HLT is at that return address;
the model advances its IP past HLT, then reports a halted state at `7C0B`.

The helper's local contract is simple: increment AX, keep BX, and return with the
same SP the caller had before CALL. CALL/RET do not automatically save every
register. This example passes no arguments and establishes no operating-system
ABI, far-call protocol, privilege transition or 64-bit calling convention.
Intel's [instruction-set reference](https://cdrdv2-public.intel.com/789581/325383-sdm-vol-2abcd.pdf)
describes near CALL/RET; the supported teaching subset is in
[execution scope](../execution-scope.md).

## Rewind the overwrite

At step 5, press **Back** once. SP returns to `7C00`, and the memory microscope at
`07BFE` restores `34 12`. Press **Forward**: SP becomes `7BFE` and RAM is `0A 7C`
again. Back/Forward restore recorded model snapshots and RAM journals. They do
not reverse a physical CPU or QEMU guest, and Forward replays the recorded state
without executing CALL again. Reset clears the lesson state.
The [actual browser recording](../../assets/cpu-lab-demo.gif) includes both sides
of this CALL overwrite and the complete eight-instruction sequence.

## Repair the independently loaded native challenge

Select **Find the helper and return** in the
[challenges](https://othmaneblial.github.io/bitborn/challenges/). Its
[starting source](../../challenges/call-return/start.bits) calls HLT directly
with displacement `00 00`: AX stays 41 and SP stays at `7BFE`, because RET never
runs. Flip byte 8's bit 0 to make displacement `01 00`, then Validate. The
[reviewed solution](../../challenges/call-return/solution.bits) returns with AX=42
and SP=`7C00`. This challenge starts at **7E00**, so its saved return bytes are
`0A 7E`, not this preset's `0A 7C`. The declared
[address map](../../challenges/call-return/references.json) checks the CALL field.

`node tests/test_stack_lesson.mjs` verifies every table row, the exact source and
independent disassembly, retained stack bytes, and complete model RAM/state
rewind/replay. Browser checks inspect the actual stack and memory controls at
desktop and 320px. `python3 -m unittest tests.test_challenges.ChallengeTests.test_all_curated_solutions_on_real_qemu`
boots the existing curated solutions and checks their final registers and return
words through QMP. That native evidence is separate from the preset's model
trace; it does not establish a native instruction-by-instruction history.
