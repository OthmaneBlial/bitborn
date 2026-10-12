# Loop and count

**Environment:** Linux x86-64. **Expected:** increment five times, exit 5.

[program.bits](program.bits) initializes EDI=0 and ECX=5. `FF C7` increments EDI,
`FF C9` decrements ECX, and `75 FA` jumps from next offset 16 back to 10 until
zero. In 64-bit mode single-byte 40–4F encodings are REX prefixes, so this example
uses the correct FF instruction forms. [Byte table](bytes.md).

Run `make build`, then `./build/loop-count.elf; echo $?` on Linux x86-64.
The raw payload is `build/loop-count.bin` (23 bytes). Native CI asserts exit 5.
