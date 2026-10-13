# Compare bytes and their instruction roles

The [bit-diff workbench](https://othmaneblial.github.io/bitborn/bit-diff/) compares
two literal programs, 1–512 bytes each, without executing either. It accepts the
shared binary/hex token syntax, comments and text limits. Valid notation changes
preserve bytes and omit comments; invalid drafts/conversions retain the last
valid comparison and identify that state explicitly.

Invalid drafts name the **Before** or **After** side and mark each invalid editor.
Typing keeps the current input focus. A failed notation change focuses the first
invalid side and selects its exact invalid/excess token; both drafts, notation,
selected comparison row and last valid results are kept. Both sides are checked,
so correcting one clears its marker even if the other remains invalid. Empty
sources have an editor-level error without an invented token selection. Choosing
a valid preset clears stale errors. See [source diagnostic ranges](source-diagnostics.md).

Byte positions are compared directly. The tool reports modified shared bytes,
flipped bits at those shared offsets, added bytes and removed bytes separately.
Missing bytes are not zeros: adding `00` does not count as eight flipped bits.
It does not align insertions or infer that shifted bytes belong to matching
semantic instructions.

## One changed bit can change an unchanged field

Choose **Register direction**. Literal `89 D8` becomes `8B D8`: opcode bit 1
changes from 0 to 1, reversing MOV AX,BX to MOV BX,AX in 16-bit context. D8 itself
does not change, but its r/m and reg selectors swap source/destination roles.
The second row exposes that reinterpretation without counting extra bit flips.

**Displacement sign** compares `8B 46 FE` with `8B 46 7E`. Only displacement
bit 7 changes: BP-2 becomes BP+126, with default SS unchanged. **Immediate value**
compares the literal 42/43 fixtures. An explicit 16/32/64 context controls the
instruction boundaries; it is not an execution-mode switch.

Select a row to inspect both eight-bit patterns, per-bit roles and each side's
instruction range/field. Arrow Up/Down, Home and End move the single keyboard
target. All untrusted source/error text is rendered as text, not HTML.

## Honest classification boundaries

Each side is inspected linearly using the existing scoped instruction inspector.
Classification stops at the first unsupported or truncated encoding and never
resynchronizes past it. Remaining bytes are unclassified. Reinterpreted rows
describe changes in candidate instruction boundaries, operand widths or field
roles, including a transition to unclassified bytes.

Linear inspection cannot discover control flow or distinguish program data from
code. A valid-looking byte sequence may be data; a complete classification is
not evidence of safety or native behavior. Field roles belong to the selected
mode and instruction context, not to a universal bit position. Register values,
RAM, runtime output and history are not compared.

## Reproduce the checks

```sh
node tests/test_bit_diff.mjs
node tests/browser_bit_diff.mjs
npm run test:cross-browser
```

Unit checks use an independent bit-string oracle over 500 seeded comparisons,
all length/change categories, scope stops, context-dependent boundaries and
immutable inputs. Browser checks exercise actual selectors, field/byte roles,
keyboard rows, binary/hex conversion, both-side invalid markers and focused
token/excess-byte selection, corrected and empty drafts, preserved results, safe text,
512-byte boundaries and 320px layouts. Preset bytes come from canonical `.bits`
fixtures through generated metadata, not from assembling instruction names.

The self-writing-letter preset compares the two literal 82-byte native
[self-modification sources](../examples/self-modifying/README.md). Only writer
byte 52, bit 5 changes from 41 to 61. The future operand at byte 61 is identical
in both source files; its runtime change is proven separately by the model/QEMU
experiment. The diff workbench does not execute or infer that write.
