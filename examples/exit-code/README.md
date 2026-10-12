# Return an exit code

**Environment:** Linux x86-64. **Expected:** process exits with status 42.

The [canonical source](program.bits) has 12 bytes: `B8` plus imm32 loads EAX=60,
`BF` plus imm32 loads EDI=42, and `0F 05` invokes Linux exit. The comments explain
every operand byte and its little-endian order. [Full byte table](bytes.md).

Run `make build` from the project root, then `./build/exit-code.elf; echo $?`.
The unchanged payload is `build/exit-code.bin`; ELF headers add 120 host-authored
metadata bytes. `test_native_linux_examples` validates the exit status in CI.
