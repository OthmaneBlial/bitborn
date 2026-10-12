# Print text

**Environment:** Linux x86-64. **Expected:** `Hello from raw bits!` plus LF, exit 0.

[program.bits](program.bits) uses Linux write with EAX=1, EDI=1, EDX=21 and
RIP-relative RSI pointing to the literal text. `48 8D 35 10 00 00 00` means REX.W,
LEA, RIP-relative RSI, and a displacement of 16 after offset 17 to data at 33.
The text is also literal binary. See the [byte table](bytes.md).

Run `make build`, then `./build/print-text.elf` on Linux x86-64.
`build/print-text.bin` is the unchanged 54-byte payload. Native CI verifies exact
stdout, exit 0 and empty stderr; the demonstration does not promise general
short-write recovery or error reporting.
