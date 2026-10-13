# Literal binary source format

Browser and host CLI `.bits` input use the same token, comment and line-boundary rules.
This is byte notation, not a language that selects or generates instructions.

```text
10111000 00101010 00000000 # three literal bytes: B8 2A 00
```

Each token contains exactly eight ASCII `0` or `1` digits. Whitespace separates
tokens. `#` starts a comment ending at a recognized line boundary. Unicode
comment text and whitespace are accepted; digits remain ASCII. A UTF-8 BOM is
allowed only at the start of the file and is not an executable byte. An embedded
or repeated BOM in code is rejected rather than silently removed. Browser file
imports decode UTF-8 strictly and preserve the header for the parser to validate
once, so text decoding cannot accidentally strip a second BOM.

Line boundaries include LF, CR, CRLF, vertical tab, form feed, the file/group/
record separators, next-line (`0085`), and Unicode line/paragraph separators.
This follows the host's [Python splitlines definition](https://docs.python.org/3.12/library/stdtypes.html#str.splitlines).
Whitespace follows [Python's Unicode whitespace definition](https://docs.python.org/3.12/library/stdtypes.html#str.isspace);
the browser specifies that same set explicitly, because JavaScript's default
[whitespace rules](https://tc39.es/ecma262/multipage/text-processing.html#sec-characterclassescape) differ.

Instruction names and pipe-separated annotations are explanations. The packer
never translates them. Only tokens before comments become bytes. Browser input
retains its 64 KiB text and selected byte-count limits; host target packaging
separately enforces reviewed sizes and BIOS/ELF/disk-layout requirements.

Seeded properties exercise valid bytes, every supported whitespace/line boundary,
non-ASCII comments, malformed tokens, embedded BOMs and identical source-line
diagnostics across the Python and JavaScript parsers:

```sh
python3 -m unittest tests.test_parser_properties -v
```

## Hexadecimal drafts in the CPU Lab

The optional hex editor accepts two ASCII hexadecimal digits per byte, such as
`B8 2A 00`, with the same whitespace, comment, BOM and line rules as browser binary
input. `0x` prefixes, incomplete bytes and instruction names are rejected. It
uses the same 64 KiB text and selected byte limits. This is an explicit alternate
byte notation; host `.bits` parsing remains eight binary digits per token.

Valid binary drafts update the hex view and retain their comments. Hex edits stay
pending until **Load hex & reset**, which replaces binary source/comments with
equivalent literal bytes and resets the model. Invalid input preserves the loaded
program and the other source field. No parser selects an opcode from a mnemonic.

## CPU Lab program links

**Copy program link** shares the original loaded bytes, just like `.bits`/`.bin`
exports, before self-modification. The selectable link field is available when
the browser denies clipboard access. Use this generated link after editing or
changing presets; it describes the current loaded program, while an existing
address-bar fragment can still describe the program originally opened.

The strict format is `#program=v1.B82A00F4`: two ASCII hex digits per byte,
1–512 bytes, with no whitespace, comments, encoded characters or extra fields.
Generated hex is uppercase; decoding accepts either hex case. Empty, odd-length,
oversized and unknown-version program links are rejected. Other page anchors are
ignored. This notation preserves bytes; it never resolves instruction names.

Opening a valid fragment resets the bounded 16-bit model and leaves it paused.
Hash navigation uses the same validation; an invalid link preserves the current
program, draft, registers and recorded history. A newer valid link cancels an
older delayed file import. Registers, flags, output, history, runtime memory,
breakpoints, binary comments and pending editor drafts are not shared.

The fragment contains readable program bytes. Real-browser reload checks verify
that those bytes are absent from network request URLs; anyone given the full link
can still decode it. No file upload, storage service or native execution is added.

```sh
node tests/test_program_link.mjs
npm run test:browser
npm run test:cross-browser
```

## Publishing packed output

`make build` validates every manifest before opening outputs: required types,
reviewed hashes/sizes, canonical relative paths, known packaging options, loader
references and contiguous disk payloads. Resolved paths must stay in the project
and build directory; existing sources must be regular files, rejecting directories
and named pipes before they can be opened. Output symlinks/hard links cannot alias source files or other
outputs. Existing output directories are rejected. All literal sources and
derived packages are checked before the first output write, so a bad later target
keeps earlier artifacts intact. This preflight is not a multi-file transaction
for I/O failures or concurrent filesystem changes.

Regression checks: `python3 -m unittest tests.test_manifest -v`.

`bitpack SOURCE OUTPUT` rejects paths that alias the source. It stages the
complete bytes in the resolved output directory, flushes/syncs the staging file,
then atomically replaces the output. Parsing, staging or rename failures preserve
an existing output and remove the staging file. Existing non-file outputs are
rejected before writing.

An output symlink is retained and its resolved target is replaced; other hard-link
entries retain their old inode/data. Existing basic read/write/execute mode bits
are preserved; new outputs start private (`0600` on POSIX). This is file-replacement
atomicity, not a guarantee of directory metadata durability after power loss.

`bitinspect --references JSON` optionally checks declared numeric operand fields
against target offsets in the same image. The [reference guide](address-references.md)
defines explicit segment/origin assumptions, bounded regular inputs and failure
diagnostics. This validates existing bytes; it does not change source notation,
resolve labels or generate replacement operands.

The optional [inspection annotation JSON](inspection-annotations.md) is validated
before rows print, including ranges, non-overlap and any supplied literal bits.
Malformed metadata uses `ANNOTATION_ERROR` diagnostics; non-printing label text
is escaped while readable Unicode remains intact.
