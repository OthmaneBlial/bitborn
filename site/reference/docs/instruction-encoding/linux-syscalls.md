# Read Linux syscall setup without executing it

Choose **64-bit mode** in the [instruction playground](https://othmaneblial.github.io/bitborn/playground/),
then select a Linux exit preset. Seven presets are exact byte slices from the
existing [eight-byte program](../../examples/exit-code-small/program.bits) and
[twelve-byte program](../../examples/exit-code/program.bits). The site records
their source byte ranges and payload/slice hashes; it does not generate instructions.

| Compact exit source offset | Literal bytes | 64-bit instruction | Role in this curated Linux program |
| --- | --- | --- | --- |
| 0 | 6A 3C | PUSH 60 | Place the syscall number on the stack |
| 2 | 58 | POP RAX | Load the syscall-number register |
| 3 | 6A 2A | PUSH 42 | Place the desired exit status on the stack |
| 5 | 5F | POP RDI | Load the first syscall argument |
| 6 | 0F 05 | SYSCALL | Select the configured kernel entry |

Each PUSH/POP pair returns RSP to its previous value. The twelve-byte alternative
uses `B8 3C 00 00 00` and `BF 2A 00 00 00`: MOV EAX,60 and MOV EDI,42 write
32-bit registers and clear the upper halves of RAX/RDI in 64-bit mode. Both
reviewed Linux ELF programs exit with status 42 in Linux x86-64 CI.

## Follow the fields, not an invented process state

Unprefixed `6A` carries one signed immediate byte; `68` carries four little-endian
immediate bytes. Both sign-extend to a 64-bit stack word. Flip bit 7 of `3C`:
`BC` is -68, whose extended bit pattern is `FFFFFFFFFFFFFFBC`. The immediate
width is not the stack-word width. Register PUSH/POP opcodes use their low three
bits for RAX, RCX, RDX, RBX, RSP, RBP, RSI or RDI. POP RSP's loaded pointer
replaces the incremented stack pointer; the explanation keeps that alias explicit.

The inspector supports these **unprefixed 64-bit stack forms**. REX/66 stack forms,
memory stack operands and 32-bit stack inspection remain outside this addition.
The existing unprefixed 16-bit teaching decoder remains separate. Prefixes are
not silently ignored and truncated immediates stop with an error.

For the Linux x86-64 ABI, the syscall number is supplied through RAX/EAX and
arguments through RDI, RSI, RDX, R10, R8 and R9; a returning result uses RAX.
This differs from ordinary function-call argument passing. The Linux table assigns
60 to `exit` and 1 to `write`. These are OS/ABI conventions, not numbers encoded
inside the two-byte SYSCALL instruction. x32 and other operating systems are
separate conventions; selecting a 64-bit decoding context does not select an OS.

SYSCALL inspection reads no registers and infers no call number, argument value,
return value or control-flow result. All 64-bit execution controls remain disabled.
Changing a bit or a preset leaves the browser model state unchanged; native proof
comes from the curated Linux ELF checks, not from inspection or an imported file.

## Evidence and sources

- [Intel instruction reference, PUSH/POP](https://www.intel.com/content/dam/www/public/us/en/documents/manuals/64-ia-32-architectures-software-developer-vol-2b-manual.pdf).
- [Linux syscall ABI tables](https://man7.org/linux/man-pages/man2/syscall.2.html).
- [Linux x86-64 syscall-number table](https://github.com/torvalds/linux/blob/master/arch/x86/entry/syscalls/syscall_64.tbl).
- Seven additional NDISASM 3.02 [goldens](../../tests/fixtures/encoding-golden.json)
  were compared with actual literal bytes; disassembly performed no execution.
- Tests cover all imm8 values, 1,000 seeded imm32 words and signed boundaries,
  all sixteen low-register PUSH/POP selectors, strict prefixes/truncation and
  exact reconstruction of both canonical native payloads from the seven slices.

```sh
make site-test
node tests/test_linux_encoding.mjs
node tests/browser_site.mjs
npm run test:cross-browser
```

The browser checks select every preset, flip the sign bit and assert disabled
execution, preserved registers and 1440/320px containment. See
[execution scope and proof](../execution-scope.md) before adding another encoding.
