# Compare values

**Environment:** Linux x86-64. **Expected:** equality branch, exit 42.

[program.bits](program.bits) sets EDI=42, compares it with 42 using `83 FF 2A`,
and uses `74 05` to skip the five-byte unequal status assignment. Equal means
exit 42; unequal would mean exit 1. [Byte table](bytes.md).

Run `make build`, then `./build/compare-values.elf; echo $?` on Linux x86-64.
The unchanged payload is `build/compare-values.bin` (22 bytes). Native CI runs
the equality path; independent tests also check the branch and alternate result.
