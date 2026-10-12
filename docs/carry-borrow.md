# Carry and borrow across literal words

One word cannot represent every result. `FFFF + 1` wraps to zero and sets CF.
ADC includes that incoming carry in the next operation. SBB similarly includes
an incoming borrow in subtraction. MOV preserves CF, so it can save/load words
between arithmetic operations without losing the chain.

| Literal opcode | Supported operation | Calculation |
| --- | --- | --- |
| `14 ib` | ADC AL, imm8 | AL + immediate + incoming CF |
| `15 iw` | ADC AX, imm16 | AX + immediate + incoming CF |
| `1C ib` | SBB AL, imm8 | AL - immediate - incoming CF |
| `1D iw` | SBB AX, imm16 | AX - immediate - incoming CF |

These unprefixed immediate encodings follow Intel's
[ADC and SBB instruction reference](https://cdrdv2-public.intel.com/774492/325383-sdm-vol-2abcd.pdf).
The inspector and bounded model use their 16-bit context. Memory/register forms,
prefixes and wider-context execution remain outside the current support.

Results wrap at the selected width. CF reports outgoing unsigned carry or borrow;
OF reports signed overflow. SF/ZF/PF/AF describe the actual byte/word result.
Byte operations preserve AH; both widths preserve IF and DF. Arithmetic makes
AF known again even when a preceding logical operation left it undefined.

Do not truncate **immediate + CF** before subtracting. With AL=0, immediate FF
and incoming CF=1, the subtrahend is 256. The byte result is zero but outgoing
borrow is still set. Signed overflow is based on the original operands and the
incoming bit, not on a prematurely wrapped immediate.

## Try the exact 81-byte exercise

Download [carry-borrow.bits](instruction-encoding/fixtures/carry-borrow.bits)
from the [CPU Lab](https://othmaneblial.github.io/bitborn/cpu-lab/), then import
or paste it into the binary editor. Loading stays paused.

- The low word of `FFFFFFFF + 1` wraps to zero. ADC propagates carry through the
  high word and into an extension: DX:CX:BX becomes `0001:0000:0000`.
- Subtracting 1 from three zero words propagates borrow: BP:DI:SI becomes
  `FFFF:FFFF:FFFF`, with outgoing borrow still set.
- ADC AL and SBB AL preserve AH=`AB`. Both resulting AX=`AB00` words are saved
  at DS:2000 and DS:2002, giving raw RAM bytes `00 AB 00 AB`.

After twelve steps AX is zero and CF is set. Back restores AX=`FFFF`; Forward
restores the exact recorded arithmetic state. At step sixteen DX is 1. At step
twenty-five all three subtraction result words are `FFFF`. Step twenty-eight
shows byte wrapping with AH intact. The program halts after 32 instructions at
next logical IP `7C4F`.

This canonical teaching fixture is separate from the reviewed release artifact
manifest; immutable release images are unchanged.

## Evidence and reproduction

```sh
node tests/test_carry.mjs
node tests/test_flags_properties.mjs
python3 -m unittest tests.test_carry_native
```

An independent bit-by-bit adder checks 270,736 operations: every pair of byte
operands with both incoming bits and both operations, plus boundary/seeded word
pairs. It independently derives carry, half carry and sign-bit carry/overflow.
Existing ADD/SUB/CMP/INC/DEC checks continue to pass. Tests also verify AH/IF/DF
preservation, strict encoding boundaries and complete RAM/history restoration.

QEMU runs the exact same 81-byte program as the model. All general-purpose words,
configured segments, IP, modeled status/IF/DF flags, stored RAM and unchanged code
bytes match. A separate literal native-only fixture samples eight result/FLAGS
pairs with PUSHF, including byte/word signed boundaries, both incoming carry
states and the immediate-plus-borrow overflow edge. Python's independent integer
oracle checks every defined arithmetic flag. PUSHF is **not** added to the model.
This proves emulator agreement for the curated programs, not physical hardware.
