# Eight-byte Linux exit: a measured size tradeoff

The original [exit-code](../exit-code/README.md) uses 12 executable bytes.
This separately authored payload uses **8 bytes**, saving four bytes (33⅓%).
Both ask Linux x86-64 to exit with status 42. Host ELF headers stay 120 bytes:
the distributed ELF therefore shrinks from **132 to 128 bytes**, about 3%.

| Program | Instruction bytes | Instructions | Stack data traffic |
| --- | --- | --- | --- |
| Original: MOV EAX,60; MOV EDI,42; SYSCALL | 12 | 3 | None |
| Smaller: PUSH 60; POP RAX; PUSH 42; POP RDI; SYSCALL | 8 | 5 | Two pushes and two pops |

The short immediate encoding sign-extends its operand. The POP opcodes select
64-bit registers in this execution mode. Each push/pop pair restores RSP and
leaves a positive constant in the selected register. In 16-bit real mode these
same bytes would operate on AX/DI and use an unsupported interrupt mechanism;
the BIOS teaching model must not be used as native proof for this payload.

This is a **size optimization**, with more instructions and memory traffic.
No faster-runtime claim or benchmark is made: process startup dominates such a
tiny exit program. The existing original remains available for comparison.

```sh
make test
./tools/bitdiff build/exit-code.bin build/exit-code-small.bin
# On Linux x86-64:
./build/exit-code.elf; echo $?
./build/exit-code-small.elf; echo $?
# Both statuses must be 42.
```

[Literal source](program.bits) · [Every byte](bytes.md) ·
[Interactive size comparison](https://othmaneblial.github.io/bitborn/examples/optimization/)

The independent encoding/size test runs everywhere. Actual native execution of
both curated programs runs in Linux CI; macOS reports that check as skipped.
