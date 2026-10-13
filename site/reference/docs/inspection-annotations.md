# Validate inspection annotations before printing

Current main validates `bitinspect --annotations JSON` before printing byte rows.
Malformed entries produce a readable error or an `ANNOTATION_ERROR` diagnostic
with `--json-errors`, rather than an uncaught type/key traceback. This host-tool
change is included in v0.4.0; target source and executable bytes are unchanged.

```sh
make build
./tools/bitinspect build/boot.img --annotations boot/annotations.json
./tools/bitinspect build/boot.img --annotations boot/annotations.json --references boot/references.json
```

The JSON must be an array. Each entry has exactly these required fields:

| Field | Contract |
| --- | --- |
| offset | Integer byte offset, at least zero |
| size | Positive integer; the whole range fits the binary |
| kind | instruction, data, padding or signature |
| mnemonic | Text, including an empty label for unannotated source |
| explanation | Text, including an empty explanation |
| bits (optional) | Whitespace-separated eight-digit binary tokens matching that exact byte range |

Booleans are not byte offsets or sizes. Unknown/missing fields, duplicate JSON
keys, overlapping ranges and stale/malformed bits are rejected. Entries may be
unsorted and may annotate only selected ranges; full coverage is a separate
reviewed-target verification rule. The generated boot annotations and all current
canonical target annotations pass, including their existing `bits` fields.

Readable Unicode stays readable. Non-printing characters in labels/explanations
are displayed as literal escapes such as `\u000a` or `\u001b`, so a label cannot
insert terminal control sequences or extra report lines. The tool still does not
decode instructions from these names or turn them into bytes.

The annotation file must be regular and no larger than 1 MiB. Reads are bounded
on the opened descriptor, and FIFO input is rejected without waiting for a
writer. Filesystem failures retain `IO_ERROR`; annotation parsing/schema/range
failures use `ANNOTATION_ERROR`. A later invalid entry prints no partial byte or
reference rows. `--annotations` is specific to bitinspect.

This validates annotation structure and optional literal bits, not the truth of
mnemonic prose or an instruction boundary. Keep source explanations accurate and
use [native/model proof](execution-scope.md) for behavior. The separate
[address-reference check](address-references.md) validates declared numeric
targets without generating fixups.

```sh
python3 -m unittest tests.test_inspection_annotations tests.test_address_references -v
make test
make site-test
```

Checks cover all canonical targets, reversed/partial annotations, optional and
stale bits, malformed types/ranges/overlaps, escaped terminal controls, bounded
JSON and FIFO rejection, combined reference failures and unchanged binary input.
