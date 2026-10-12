# Literal inspection fixtures

These byte sequences explain operand-size context. They are inspected, not
executed as host-native programs, and are not additional bootable targets.

- [mov32.bits](mov32.bits): `B8 2A 00 00 00` selects `MOV EAX,42` with 32-bit
  default operands. With 16-bit defaults, the first instruction is `MOV AX,42`
  and consumes only three bytes.
- [mov64.bits](mov64.bits): `49 B8 FF FF FF FF FF FF FF FF` selects a 64-bit
  immediate into R8 in 64-bit mode. The same initial `49` is `DEC CX` or
  `DEC ECX` in legacy 16-/32-bit contexts. A register value is displayed exactly,
  rather than rounded through a JavaScript Number.

The site build copies the literal parsed bytes into `encoding-presets.mjs`.
It does not assemble the explanatory instruction names. The inspector supports
MOV register immediates, register-direct XOR, legacy one-byte INC/DEC and bare
NOP/HLT; it recognizes bare SYSCALL only in the selected 64-bit context. Other
16-bit forms retain the existing teaching decoder. At most one 66 prefix followed
by at most one REX prefix is supported; repeated/reordered prefixes and other
addressing forms stop with an explicit scope error.

References: Intel SDM [instruction formats and INC/DEC](https://www.intel.com/content/dam/www/public/us/en/documents/manuals/64-ia-32-architectures-software-developer-vol-2a-manual.pdf),
[MOV encodings](https://www.intel.com/content/dam/www/public/us/en/documents/manuals/64-ia-32-architectures-software-developer-vol-2b-manual.pdf).
Decoding context does not grant execution support: browser simulation remains
the documented 16-bit subset.

The six context goldens were compared with installed NDISASM 3.02 using
`ndisasm -b CONTEXT -` on literal parsed fixture bytes; the disassembler only
read them. [Recorded results](https://github.com/OthmaneBlial/bitborn/blob/main/tests/fixtures/encoding-golden.json)
are checked without adding a runtime disassembler dependency. These are
disassembly checks, not native CPU execution evidence.
