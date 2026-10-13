# Check the addresses you wrote by hand

This capability is on the current main branch under Unreleased; older release
archives do not include this option or the new reference map.

`bitinspect --references JSON` checks declared numeric fields against expected
locations in the same binary image. It reads the existing bytes and reports a
mismatch; it never resolves names into operands or rewrites source/image bytes.
The ordinary annotated byte inspection remains available.

```sh
make build
./tools/bitinspect build/boot.img --references boot/references.json
```

The report appears after the byte rows. The manually authored
[boot reference map](../boot/references.json) declares six existing fields:

| Operand file offset | Declared field | Expected target file offset | What to inspect |
| --- | --- | --- | --- |
| 2 | far16 | 6 | Far jump normalizes CS before setup |
| 53 | abs16, DS=0 | 91 | SI points to the NUL-terminated message |
| 59 | rel8, origin 60, CS=0 | 87 | Zero terminator selects the halt path |
| 79 | rel8, origin 80, CS=0 | 75 | UART polling branches backward |
| 86 | rel8, origin 87, CS=0 | 55 | The next character iteration |
| 90 | rel8, origin 91, CS=0 | 88 | Return to HLT after a wakeup |

For example, the existing field at byte 86 is `E0`, signed -32. Its declared
origin is file offset 87, so it targets offset 55. The pointer at byte 53 is
`5B 7C`, little-endian 7C5B: with segment zero and image load address 7C00, its
target is file offset 91. Flipping one low operand bit makes the check fail.
These original [literal instruction bytes](../boot/boot.bits) remain unchanged.

## Declare intent explicitly

The map is a UTF-8 JSON object with exactly `loadAddress` and `references`.
`loadAddress` is a numeric physical address; the entire image must fit within
the unwrapped 1 MiB address space. Each entry has a unique printable `name`, a
`kind`, an operand-byte `offset`, and an expected `targetOffset` inside the image.
All numbers are JSON integers, not hexadecimal strings or booleans.

| Kind | Bytes read | Additional required fields |
| --- | --- | --- |
| abs16 | Two little-endian offset bytes | `segment`: the explicitly assumed segment value |
| far16 | Two offset bytes followed by two segment bytes | None; both values come from the binary |
| rel8 | One signed displacement byte | `segment`: assumed CS; `originOffset`: explicit next-IP location |
| rel16 | Two little-endian signed displacement bytes | `segment` and `originOffset` |

Absolute/far addresses use `((segment << 4) + offset) & FFFFF`. Relative fields
start at the declared origin in the declared 16-bit segment, add the signed
displacement, wrap IP to sixteen bits, then apply the same 20-bit address mask.
An origin immediately after offset FFFF wraps to 0000. Origins outside the
declared code-segment window are rejected. This explicitly assumes masked A20;
it does not establish the machine's A20 setting.

`originOffset` is supplied rather than inferred from an opcode. Names are report
labels, not symbols to resolve. A successful report proves the declared address
math; it does not prove that a field is an actual operand, that a target is an
instruction boundary, that DS/CS has the assumed value, or that a branch is taken.
Compare the declarations with annotations and use native tests for execution
claims. See [execution scope and proof levels](execution-scope.md).

## Fail before printing partial inspection

The binary file and reference map must be regular files. Reference mode bounds
these reads to 1 MiB of binary data and 65,536 bytes of map JSON. It accepts
1–256 non-overlapping fields. Duplicate
JSON keys, unknown/missing fields, duplicate/non-printable names, truncated
operands and out-of-range integers are rejected. File descriptors close on both
successful and failed reads; FIFO inputs are rejected without waiting for a writer.

On failure the tool exits with status 1 and prints no byte rows. Add
`--json-errors` for a `REFERENCE_ERROR` diagnostic on stderr. Filesystem errors
retain the existing `IO_ERROR` behavior. `--references` is specific to bitinspect;
it does not add a fixup path to bitpack or bitverify.

```sh
python3 -m unittest tests.test_address_references -v
make test
make site-test
```

Tests cover all 65,536 absolute words, all 65,536 relative words, all 256 short
displacements, and all 65,536 offsets in the FFFF far-segment alias, plus explicit
IP/A20 boundaries, six canonical fields and one-bit failures. Synthetic numeric
arrays are never executed or packaged as target programs. CLI checks prove empty
stdout on a late mismatch, structured errors and unchanged input files.
