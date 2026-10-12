# Literal binary source format

The browser and host CLI use the same token, comment and line-boundary rules.
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
