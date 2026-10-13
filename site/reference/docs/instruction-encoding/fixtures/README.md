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
- [mov-register.bits](mov-register.bits): `89 D8` copies BX to AX in 16-bit
  context. Flipping opcode bit 1 gives `8B D8`, reversing source/destination.
- [mov-register64.bits](mov-register64.bits): `49 89 D8` copies RBX to R8 in
  64-bit context; REX.B/R extend the r/m/reg selectors independently.
- [mov-byte.bits](mov-byte.bits): `88 E0` copies AH to AL, including in 64-bit
  mode without REX. [mov-byte-rex.bits](mov-byte-rex.bits), `40 88 E0`, selects
  SPL instead of AH in 64-bit mode solely from REX presence. REX.W/66 do not
  widen this byte form. Legacy contexts decode its initial 40 as INC AX/EAX.
- [mov-memory-bp.bits](mov-memory-bp.bits): `8B 46 FE` selects BP-2 in default SS.
  [mov-memory-pair.bits](mov-memory-pair.bits): `8B 08` selects BX+SI in DS.
  [mov-memory-absolute.bits](mov-memory-absolute.bits): `8B 16 20 00` selects
  absolute offset32 in DS, not BP. See [address fields and native evidence](../memory-addressing.md).

The site build copies the literal parsed bytes into `encoding-presets.mjs`.
It does not assemble the explanatory instruction names. The inspector supports
MOV register immediates and register-direct 88/89/8A/8B forms, register-direct
XOR, legacy one-byte INC/DEC and bare
NOP/HLT; it recognizes bare SYSCALL only in the selected 64-bit context. Other
16-bit forms retain the existing teaching decoder. At most one 66 prefix followed
by at most one REX prefix is supported; repeated/reordered prefixes and other
addressing forms stop with an explicit scope error. Memory MOV inspection supports
the 16-bit ModR/M address table only; default DS/SS and signed displacements are
explained without reading RAM. The model executes unprefixed byte/word forms;
wider/overridden addressing is rejected. [memory-mov-program.bits](memory-mov-program.bits)
is the complete sixth CPU Lab exercise, copied without assembling its comments
and independently compared with native QEMU using identical literal bytes.

The bit-diff pairs also use canonical [mov-register-reverse.bits](mov-register-reverse.bits),
[mov-memory-positive.bits](mov-memory-positive.bits) and [mov32-next.bits](mov32-next.bits).
They differ from their counterparts by one literal bit, not by assembly input.

References: Intel SDM [instruction formats and INC/DEC](https://www.intel.com/content/dam/www/public/us/en/documents/manuals/64-ia-32-architectures-software-developer-vol-2a-manual.pdf),
[MOV encodings](https://www.intel.com/content/dam/www/public/us/en/documents/manuals/64-ia-32-architectures-software-developer-vol-2b-manual.pdf).
Decoding context does not grant execution support: browser simulation remains
the documented 16-bit subset.

The context goldens were compared with installed NDISASM 3.02 using
`ndisasm -b CONTEXT -` on literal parsed fixture bytes; the disassembler only
read them. [Recorded results](https://github.com/OthmaneBlial/bitborn/blob/main/tests/fixtures/encoding-golden.json)
are checked without adding a runtime disassembler dependency. These are
disassembly checks, not native CPU execution evidence.

Seven [Linux syscall setup presets](../linux-syscalls.md) are literal byte slices
of the existing native 8-/12-byte exit programs, rather than new generated target
instructions. Their source ranges and hashes are exported with the presets.
Unprefixed 64-bit register PUSH/POP and sign-extended imm8/imm32 PUSH are inspected;
64-bit simulation remains unavailable. Seven additional independent goldens check
the native payload slices.
