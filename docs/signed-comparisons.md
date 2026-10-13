# Signed comparisons: why the sign flag is not enough

The same 16-bit pattern can be interpreted as a signed or unsigned value.
`8000` means unsigned 32768 or signed -32768. `FFFF` means unsigned 65535 or
signed -1. `CMP AX, imm16` computes subtraction flags without changing AX.
The following branch chooses the interpretation.

The model now executes all sixteen unprefixed short `Jcc` conditions in its
16-bit subset. Displacements are signed eight-bit offsets from the next
instruction. The inspector explains unprefixed short Jcc fields in 16/32/64
contexts; execution remains the separately tested 16-bit subset. Near `0F 8x`
and prefixed variants remain outside the current scope.

| Opcode | Branch | Condition | Interpretation after CMP |
| --- | --- | --- | --- |
| `72` | JB | CF = 1 | Unsigned below |
| `73` | JAE | CF = 0 | Unsigned above or equal |
| `76` | JBE | CF = 1 or ZF = 1 | Unsigned below or equal |
| `77` | JA | CF = 0 and ZF = 0 | Unsigned above |
| `7C` | JL | SF differs from OF | Signed less |
| `7D` | JGE | SF equals OF | Signed greater or equal |
| `7E` | JLE | ZF = 1 or SF differs from OF | Signed less or equal |
| `7F` | JG | ZF = 0 and SF equals OF | Signed greater |

These conditions and relative encodings follow Intel's
[Jcc instruction reference](https://www.intel.com/content/dam/www/public/us/en/documents/manuals/64-ia-32-architectures-software-developer-vol-2a-manual.pdf).
Branching preserves registers and flags; only the instruction pointer changes.
The model wraps the logical instruction pointer at 16 bits and preserves exact
recorded state when moving backward/forward.

## Two overflow examples

- **-32768 compared with 1:** subtraction wraps to `7FFF`, clearing SF while
  setting OF. JL takes the branch because SF differs from OF. JB does not: as
  unsigned values, 32768 is greater than 1.
- **32767 compared with -1:** subtraction wraps to `8000`, setting both SF and
  OF. JG takes the branch because SF equals OF and ZF is clear. JA does not:
  as unsigned values, 32767 is below 65535.

Checking SF alone would make the wrong signed decision in both cases.
Equality sets ZF and is included by JLE/JGE and JBE, while JL/JG stay false.

## Try the exact literal exercise

Download [signed-branches.bits](instruction-encoding/fixtures/signed-branches.bits)
and import it in the [CPU Lab](https://othmaneblial.github.io/bitborn/cpu-lab/),
or paste its literal contents into the binary editor and choose **Load program**.
The CPU Lab also links directly to this source. Loading stays paused.

After eleven steps, the first CMP has SF=0 and OF=1. Step once more to watch JL
skip the `BX=DEAD` write. Back/Forward restores that branch exactly. At step
sixteen, the second CMP has SF=1 and OF=1; JG skips `BX=BEEF`. Run through the
equality examples to HLT at next logical IP `7C5D`.

Final word values are AX=`1234`, BX=`0000`, CX=`1111`, DX=`2222`, SI=`3333`,
DI=`4444`, BP=`5555`, SP=`7C00`. The 95-byte source executes 31 instructions.
It is a teaching/verification fixture, separate from the reviewed release
artifact manifest; the existing release images are unchanged.

## Evidence

```sh
node tests/test_branches.mjs
python3 -m unittest tests.test_signed_branches
```

The model checks every one of the 16 conditions over all 32 relevant flag
combinations and all 256 rel8 bytes: 131,072 cases. Another 3,384 comparisons
derive signed/unsigned ordering directly from operand values, independently of
modeled flags. Tests cover logical-IP wrap, unchanged flags/RAM, truncation,
strict context/prefix limits and complete rewind/replay.

The native test runs the exact same 95 bytes under QEMU/SeaBIOS and compares
all eight general-purpose words, configured segments, logical IP and all
CMP-defined arithmetic flags against the model. It checks IF remains clear and
code RAM still matches the source. It does not assume a value for untouched
native DF, or claim physical-hardware behavior.
