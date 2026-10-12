# Literal source diagnostics

The parser accepts literal byte tokens and `#` comments. Diagnostics describe
the source text; they do not decode instructions or prove that bytes are safe
to execute. Binary grammar, Unicode whitespace, line boundaries and initial
UTF-8 BOM handling are unchanged.

## Readable CLI and JSON errors

Ordinary errors retain their readable format. To consume an operational error
without parsing its message:

```sh
./tools/bitpack input.bits output.bin --json-errors
```

Failures return status 1 and one JSON object on stderr, with no success output:

```json
{"command":"bitpack","code":"INVALID_TOKEN","message":"input.bits:2: expected eight binary digits, got 'bad'","line":2,"tokenIndex":3}
```

That example refers to the third non-comment token on line 2. Line and token
indices start at **1**; blank/comment lines still count as lines. Token indices
restart on each line and ignore whitespace and comments. Locations are `null`
when no source token applies. They are not byte offsets or character columns.
Default error messages remain compatible; message wording is not a stable API.

All four CLI tools accept `--json-errors`. Argument/usage errors still use
argparse's text and status 2. Success output is unchanged. Invalid source is
checked before packing and does not replace an existing output file.

## Codes and parser APIs

| Code | Meaning | Location |
| --- | --- | --- |
| `INVALID_TOKEN` | Token does not match the selected literal notation | Line and token |
| `EMPTY_SOURCE` | No bytes remain after whitespace and comments | None |
| `SOURCE_TYPE` | Browser parser received a value other than text | None |
| `SOURCE_TOO_LONG` | Browser source exceeds 65,536 UTF-16 code units | None |
| `INVALID_LIMIT` | Browser byte limit is not an integer from 1 through 4,096 | None |
| `BYTE_LIMIT` | Browser parsed bytes exceed the requested limit | First excess token |
| `IO_ERROR` | CLI filesystem operation failed | None |
| `TOOL_ERROR` | Other CLI operational validation failed | None |

Python `read_bits(path)` raises `SourceError`, a `ValueError` subclass, with
`code`, `line` and `token_index`. Its existing string message is preserved.
Python packs binary notation without the browser's text or byte limits.
UTF-8 decode errors remain `ValueError` instances and use `TOOL_ERROR` in the
CLI; no token location is fabricated.

JavaScript `parseBits(source, maxBytes)` and `parseHex(source, maxBytes)` raise
`SourceDiagnosticError`, an `Error` subclass, with `code`, `line` and
`tokenIndex`. Existing `error.message` UI handlers continue to work. Both
parsers default to 512 bytes and retain their text/byte limits.

The 658-case seeded Python/JavaScript corpus compares accepted binary bytes
and rejected-source codes/locations. Separate tests cover hexadecimal input,
browser limits, CLI JSON and preservation of existing output on failure:

```sh
python3 -m unittest tests.test_parser_properties tests.test_tools
node tests/test_hex.mjs
```
