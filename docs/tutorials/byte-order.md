# One byte, one word, one branch

Try the [interactive lesson](https://othmaneblial.github.io/bitborn/learn/#byte-order-title).
Its entire starting program is [six handwritten bytes](byte-order.bits):

```text
10010000 10111000 00110100 00010010 11101011 11111010
   90       B8       34       12       EB       FA
```

The lesson inspects a fixed 16-bit context at logical start IP `0x7C00`.
These are a learning fragment, not a BIOS boot sector or a native executable.
There is no stack setup, boot signature or operating-system entry point.
The page never executes bytes or reads CPU lab registers. Reload or Reset restores
the source; edits are neither saved nor shared. JavaScript is optional for reading
this guide, and the controls use ordinary keyboard-focusable buttons.

## 1. Read one byte

`00110100` is binary notation for `0x34`, decimal 52. The bit weights from left
to right are 128, 64, 32, 16, 8, 4, 2, 1. Flipping the rightmost bit changes
`00110100` to `00110101`, or 53. The byte is an immediate value here, not an opcode.
The exact same numeric byte could mean something different in another position.

## 2. Combine a little-endian word

`B8 34 12` is `MOV AX, 0x1234` in this context. B8 selects the instruction and
register. The next two bytes form the immediate: `0x34 + 256 × 0x12 = 4660`.
The low byte appears first **in the file**. Bit notation within each byte still
prints the most significant bit on the left; little-endian does not reverse bits.

Swap the two immediate bytes: `B8 12 34` now loads `0x3412`, decimal 13330.
The opcode and three-byte instruction length remain the same. A low-bit edit
from the first section also changes the immediate in this section, so Reset
before comparing these original values.

## 3. Interpret a signed branch byte

The program starts with a one-byte NOP and the three-byte MOV. `EB FA` therefore
begins at offset 4 and ends at offset 6, logical IP `0x7C06`.
FA is unsigned 250, but the branch displacement is signed: `250 − 256 = −6`.
The destination is measured from the **instruction end**: `0x7C06 − 6 = 0x7C00`.
It returns to the NOP. There is no HLT; running this unchanged fragment would loop.

The sign bit has weight −128 for this signed interpretation. Flipping it turns
FA into 7A, or +122. The destination becomes `0x7C80`, offset 128, outside the
six-byte fragment. That address calculation proves neither that memory is loaded
there nor that a valid instruction begins there. The lesson also wraps logical
IP at 16 bits, matching the existing model's real-mode teaching context.

## Check the reasoning

`node tests/test_byte_order.mjs` checks the canonical source hash, independently
disassembles its three instructions, covers all 65,536 immediate words and all
256 branch displacements, and compares each branch target with one model step.
Browser checks cover linked byte/word edits, swaps, the sign change, Reset,
keyboard operation, reload and desktop/320px layout in Chrome, Firefox and WebKit.
These are decoder/model/browser checks; no native execution or hardware proof
is claimed for this learning fragment.

Continue with the [instruction playground](https://othmaneblial.github.io/bitborn/playground/),
[CPU lab](https://othmaneblial.github.io/bitborn/cpu-lab/) and
[your first bootable program](from-bits-to-boot.md). The decoder's supported
instruction set and environment boundaries are in [execution scope](../execution-scope.md).
