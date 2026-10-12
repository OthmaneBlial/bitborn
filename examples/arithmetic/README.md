# Perform arithmetic

**Environment:** Linux x86-64. **Expected:** compute 6×7 and exit with status 42.

[program.bits](program.bits) loads EDI=6, uses `6B FF 07` for signed multiply by
seven, and invokes exit. ModR/M FF selects EDI as both operands. The 15 payload
bytes are explained inline and in the [byte table](bytes.md).

Run `make build`, then `./build/arithmetic.elf; echo $?` on Linux x86-64.
`build/arithmetic.bin` is the exact packed source; `test_native_linux_examples`
checks the computed status through actual execution in CI.
