# Four condition bits and one signed byte

An unprefixed short conditional jump uses two bytes: `70`–`7F` followed by rel8.
The inspector now explains these fields in 16-, 32- and 64-bit contexts. It reads
neither CPU flags nor an instruction address, and does not execute the branch.
The separate teaching model still executes only its documented 16-bit subset.

```text
opcode:  0 1 1 1  g g g  n
bits:    7 6 5 4  3 2 1  0
         fixed     group  inverse
```

The low three selector bits, at positions 3–1, choose a flag-test group. Bit 0
selects the positive test when clear and its inverse when set. Complementary
conditions therefore differ in exactly one opcode bit:

| Group bits | Positive test | Bit 0 clear | Bit 0 set |
| --- | --- | --- | --- |
| `000` | OF | JO (`70`) | JNO (`71`) |
| `001` | CF | JB (`72`) | JAE (`73`) |
| `010` | ZF | JZ (`74`) | JNZ (`75`) |
| `011` | CF or ZF | JBE (`76`) | JA (`77`) |
| `100` | SF | JS (`78`) | JNS (`79`) |
| `101` | PF | JP (`7A`) | JNP (`7B`) |
| `110` | SF xor OF | JL (`7C`) | JGE (`7D`) |
| `111` | ZF or (SF xor OF) | JLE (`7E`) | JG (`7F`) |

These encodings and conditions follow Intel's
[Jcc reference](https://cdrdv2-public.intel.com/835781/325462-sdm-vol-1-2abcd-3abcd-4.pdf).
JE is an alias for JZ; JNL is an alias for JGE. The independent disassembler uses
JNL in the inverse fixture, while the inspector consistently shows JGE.

## Flip the inverse bit and displacement sign

Select **Short JL / condition and rel8** in the
[playground](https://othmaneblial.github.io/bitborn/playground/).
The canonical [fixture](fixtures/short-branch.bits) is `7C FE`: JL -2.
Toggle opcode bit 0 to obtain `7D FE`: JGE -2. SF differing from OF becomes SF
equal to OF. This changes a condition, not the flag values themselves.

Rel8 uses two's complement. Bits 0–6 have positive binary weights; bit 7 has
weight **-128**. FE is -2. Toggle operand bit 7 to turn FE into 7E, or +126.
The displacement is measured from the instruction end, not its first byte.
Switch inspection context to 32 or 64: the same unprefixed short fields remain
valid, and simulation stays disabled. Bit labels expose their roles to keyboard
and screen-reader users. Editing these bits preserves runtime register state.

No absolute target is guessed: the inspector was not given an instruction
address. Its `width` and `displacementWidth` are 8 for these encodings, describing
rel8 rather than a general-purpose register operand. Near `0F 8x`, prefixes and
cross-context execution are not added by this milestone.

## Evidence

```sh
node tests/test_branch_encoding.mjs
node tests/test_branches.mjs
node tests/test_encoding.mjs
```

12,288 inspection cases cover every condition, every rel8 byte and all three
contexts. They compare predicates, bit/byte roles, sizes and signed values,
preserve input bytes and reject truncated/prefixed/near forms. Legacy 40 remains
INC in 16/32 contexts; it is not misread as a branch prefix.

Six newly observed NDISASM goldens independently decode the two literal fixtures
in all three contexts. Origin-zero targets are converted back to relative
displacements for comparison; no target code is executed by disassembly.
The complete corpus now has 34 goldens. Existing 131,072 branch execution cases,
3,384 signed/unsigned comparisons and native overflow exercise remain separate
execution evidence. Browser checks toggle complement/sign bits without execution.
