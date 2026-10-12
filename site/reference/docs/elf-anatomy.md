# File bytes, virtual addresses and literal instructions

Open the [ELF anatomy explorer](https://othmaneblial.github.io/bitborn/elf/).
Choose a reviewed file, select a header field and inspect its bytes. The entry
button follows the declared virtual address back to a file offset.

Bitborn's six Linux executables use the layout defined in `tools/build.py`:

| File range | Meaning |
| --- | --- |
| 0–63 | ELF64 header: format, architecture, entry and table locations |
| 64–119 | One PT_LOAD program header: RX mapping, lengths and alignment |
| 120 onward | Unchanged literal `.bits` payload |

The load mapping starts at file offset zero and virtual address `400000`.
The declared entry is `400078`, so the first instruction comes from file offset
120. The original exit program has 12 payload bytes and a 132-byte container;
its eight-byte alternative has a 128-byte container. Headers describe those
bytes; they do not select or assemble instructions. Reviewed presets are
checksum-verified before inspection.

## What this reader checks

The supported scope is ELF64 little-endian, version 1, x86-64, ET_EXEC/ET_DYN,
up to 1 MiB and 128 program headers. It bounds table/file ranges before reading,
keeps virtual addresses as exact BigInt values, and checks PT_LOAD sizes,
alignment, address overflow and ordering. Entry mapping distinguishes executable
file bytes, non-executable bytes, zero-filled memory, absent/unmapped entries
and ambiguous overlaps. A zero-filled location has no corresponding file byte.

Extended numbering is rejected. Section contents, symbols, relocations, dynamic
linking and interpreter resolution are not decoded. Other program-header types
are listed without treating their members as load mappings. ET_DYN values need
a runtime load bias. Structural acceptance is not a complete ELF conformance,
loader compatibility or code-safety certificate.

Imports are read-only: no code is executed, no virtual address space is allocated
and no imported bytes are changed. Invalid or oversized files keep the previous
inspected file. The map shows at most 256 file bytes; paging, arrows and Home/End
work without adding an entire megabyte of buttons. On mobile, the byte map uses
eight columns. File names and field values render as text.

## Reproduce

```sh
make site-test
node tests/test_elf.mjs
node tests/browser_elf.mjs
npm run test:cross-browser
```

The unit checks use all six real generated artifacts and their raw payloads,
synthetic mapping edge cases and 2,000 seeded header mutations. Browser checks
cover actual fields, local imports, high addresses, zero fill, invalid-file
preservation, byte paging, keyboard navigation and 320px layout in three engines.
Linux CI separately runs the curated native programs; this inspection feature
does not execute imported programs on the host.

Independent read-only inspection with installed LLVM objdump shows the eight-byte
example's RX segment at `400000`, file/memory size `80` hex, and alignment `2**12`:

```sh
objdump -p build/exit-code-small.elf
```

Authoritative definitions: [ELF header](https://gabi.xinuos.com/elf/02-eheader.html)
and [program header](https://osr600doc.xinuos.com/en/SDK_cprog/OF_ProgHeader.html).
These source facts are separate from Bitborn's packaging conventions and its
actual QEMU/Linux execution evidence.
