# One offset, two default segments

In 16-bit addressing, `8B 46 FE` is MOV AX,[BP-2]. The ModR/M byte `01 | 000 | 110`
selects an eight-bit displacement, destination AX and base BP. `FE` is signed -2.
Because BP participates in this address, the default segment is SS.

`8B 08` is MOV CX,[BX+SI], defaulting to DS. `8B 16 20 00` is MOV DX,[32], also
defaulting to DS: r/m=110 with mod=00 denotes an absolute disp16, not BP. Segment
selection therefore depends on the addressing form, not the r/m bits alone.

Try these literal fixtures in the
[instruction playground](https://othmaneblial.github.io/bitborn/playground/). Select
**8B 46 FE / BP and SS** in 16-bit context and flip displacement bit 7. FE becomes
7E (+126), while BP still selects SS. The inspector explains the symbolic effective
offset and each address/displacement bit; it reads no registers or RAM.

## The supported address table

| r/m | mod=00 | mod=01/10 | Default segment |
| --- | --- | --- | --- |
| 000 | BX+SI | BX+SI+displacement | DS |
| 001 | BX+DI | BX+DI+displacement | DS |
| 010 | BP+SI | BP+SI+displacement | SS |
| 011 | BP+DI | BP+DI+displacement | SS |
| 100 | SI | SI+displacement | DS |
| 101 | DI | DI+displacement | DS |
| 110 | absolute disp16 | BP+displacement | DS for absolute; SS for BP |
| 111 | BX | BX+displacement | DS |

mod=01 supplies a sign-extended disp8; mod=10 supplies a signed disp16. Absolute
disp16 is unsigned. Words are little-endian, and the effective offset wraps modulo
65536. A 66 prefix changes word MOV's operand size to 32 bits in this context;
it does not change the 16-bit address table. Byte MOV ignores that operand prefix.

The [Intel instruction-format reference, Table 2-1](https://cdrdv2-public.intel.com/812389/325383-sdm-vol-2abcd.pdf)
defines the 16-bit ModR/M address forms. This viewer supports 88/89/8A/8B in this
addressing context only: 32-/64-bit memory addressing, 67 address-size overrides,
segment overrides, SIB and RIP-relative forms remain explicit scope errors.
The bounded model executes unprefixed byte/word forms. Inspection and execution
share `site/address16.mjs`; inspection itself still reads no registers or RAM.
Effective offsets wrap to 16 bits and physical model addresses mask A20. A word
crossing offset FFFF is an explicit model scope error before any write or state
advance; the model does not deliver CPU faults.

## Independent checks and native evidence

```sh
node tests/test_memory_encoding.mjs
node tests/test_memory_mov.mjs
python3 -m unittest tests.test_memory_segment -v
python3 -m unittest tests.test_memory_parity -v
```

5,888 cases cover all memory ModR/M/register/opcode combinations, signed
displacement extrema, absolute offsets, operand-size prefixes, exact byte/bit
fields and truncation. Three new literal fixtures have independent NDISASM 3.02
goldens within the complete encoding fixture set of 28 cases. These are
read-only disassembly checks, not native execution.

The expanded [70-byte native probe](https://github.com/OthmaneBlial/bitborn/blob/main/tests/fixtures/memory-segment.bits)
sets DS=`1000` and SS=`2000`, writes `1111` at physical `10020` and `2233` at
`20020`, and sets BP=`0022`, BX=`0020`, SI=0. Actual QEMU/TCG results distinguish
the default segment at the same effective offset:

| Literal load | Default segment | Physical address | Native result |
| --- | --- | --- | --- |
| 8B 46 FE: MOV AX,[BP-2] | SS | `20020` | AX=`2233` |
| 8B 08: MOV CX,[BX+SI] | DS | `10020` | CX=`1111` |
| 8B 16 20 00: MOV DX,[32] | DS | `10020` | Word result saved as SI=`1111` |

The probe also stores CX as a word at `10030`, stores AH at `10032`, and loads DL
from that byte, producing DX=`1122`. AX=`2233` distinguishes AH=22 from AL=33.
Actual FLAGS sampled before/after all copies match, including deliberately set
CF/DF. Tests read guest segment bases/registers/RAM, check all 70 instruction bytes
against source, and wait for the controlled halt with next IP `7C44`.
The probe uses a literal SS override to initialize its second word; that setup
instruction is not presented as a supported inspector form. Host tools add only
BIOS padding/signature. QEMU uses read-only disks with networking disabled.
No arbitrary imported code runs natively, and physical hardware is unverified.

## Identical model/native exercise

Choose **BP, DS and SS** in the CPU Lab. Its
[canonical 71-byte source](fixtures/memory-mov-program.bits) initializes words
with existing A3/STOSW forms, then performs the new memory copies. Both the model
and curated QEMU test execute these identical bytes. Final general registers,
configured segments, defined flags and three RAM ranges match. AF remains
undefined after XOR; it has no architectural value to compare, and MOV preserves
the model's unknown status. The model records seven changed RAM bytes in 28 steps.

2,304 independent byte-layout/address cases check loads using the old base-register
value, high/low aliases, signed offsets, unchanged flags and exact write journals.
Full-memory oracles check the exercise's journals, while dedicated cases cover
byte offset FFFF, atomic word-limit rejection, A20 wrapping and live code changes.
Rewind restores the original NOP byte before a memory store; replay restores HLT.
Original loaded bytes remain unchanged for exports and links.
