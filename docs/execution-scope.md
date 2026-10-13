# Choose an execution environment and its proof

Start here before adding an instruction or reporting an unsupported program.
Binary tokens become literal bytes; selecting an inspection context does not
change those bytes or provide a CPU for that context.

| Tool or target | What it does | Where to check the boundary |
| --- | --- | --- |
| [Instruction playground](https://othmaneblial.github.io/bitborn/playground/) | Inspects selected bytes in explicit 16/32/64-bit contexts, without execution | [Literal inspection fixtures](instruction-encoding/fixtures/README.md), `site/encoding.mjs` |
| [CPU Lab](https://othmaneblial.github.io/bitborn/cpu-lab/) | Steps a bounded 16-bit model, including live code RAM and rewind | [Canonical presets](cpu-lab/README.md), `site/simulator.mjs`, `site/history.mjs` |
| [Boot builder](https://othmaneblial.github.io/bitborn/boot-builder/) | Edits and exports a 512-byte BIOS image; browser feedback uses the same bounded model | [Architecture](architecture/README.md); validate exported bytes with QEMU |
| [BIOS examples](../SHOWCASE.md) | Execute reviewed handwritten bytes inside QEMU, including device and protected-mode experiments beyond the model | Each example's README and native test |
| [Linux ELF examples](elf-anatomy.md) | Package reviewed payloads for Linux x86-64; the browser viewer inspects their layout | Linux x86-64 CI and example-specific native checks |

## Instruction support is specific to an encoding

The inspector handles immediate word/dword/qword register MOV, register-direct
byte/default-width MOV and XOR, legacy one-byte INC/DEC, and bare short Jcc,
NOP and HLT. Bare SYSCALL is recognized in 64-bit context. Memory MOV inspection
uses the 16-bit address table. Other unprefixed 16-bit forms use the teaching
decoder. Prefix handling is bounded: at most one `66`, then at most one REX in
64-bit context, for the explicitly implemented forms. See the fixture guide for
operand-size, byte-register and unsupported-prefix details.

The execution model accepts unprefixed 16-bit forms only:

- MOV register immediates, register copies, 16-bit-address ModR/M memory copies,
  accumulator absolute loads/stores, and register-to-ES/SS/DS segment loads.
- Register-direct word XOR; ADD/SUB/CMP AX immediates; ADC/SBB AL/AX immediates;
  INC/DEC word registers; TEST AL,AL and TEST AL immediates.
- Word register/immediate PUSH, register POP, near CALL/RET, short/near JMP,
  immediate far JMP, all sixteen short Jcc conditions and LOOP.
- Unprefixed LODSB/LODSW/STOSB/STOSW; NOP, CLI/STI, CLD/STD, CLC/STC and HLT.
- Simplified INT 10h text-mode reset (`AX=0003`) and teletype (`AH=0E`). COM1
  line-status reads return a ready value; serial data and port E9 debug writes
  are recorded. Other port writes do not supply hardware behavior.

This list does not imply other encodings of the same mnemonic work. For example,
memory XOR, REP MOVSB, near `0F 8x` conditional branches, PUSHF and graphics BIOS
services are outside this model. The [VGA bitmap](../examples/vga-bitmap/README.md)
has actual QEMU graphics proof while its mode-13h call is rejected by the model.
The [protected-mode target](../examples/protected-mode/README.md) has separate
native tests; selecting 32-bit inspection does not execute it in CPU Lab.

Model memory uses 20-bit physical-address wrapping and explicit segment offsets.
Words crossing an offset of FFFF are rejected. BIOS timing, interrupt delivery,
general processor faults, paging and device emulation are separate work. HLT
ends stepping; it does not simulate hardware waking a processor.

## Pick evidence that proves the claim

| Claim | Relevant check | What it does not prove |
| --- | --- | --- |
| Text packs into the intended bytes | `make build`, `./tools/bitverify` | CPU behavior or portability |
| Instruction fields decode correctly | `node tests/test_encoding.mjs`, `node tests/test_memory_encoding.mjs`, `node tests/test_branch_encoding.mjs` | Native execution |
| State changes and rewind are correct in the model | `make site-test`; focused model tests in [CONTRIBUTING](../CONTRIBUTING.md) | General x86 or BIOS conformance |
| Controls work in real browser engines | `npm run test:browser`, `npm run test:cross-browser` | QEMU execution or physical hardware |
| A reviewed native target behaves as asserted | `make test`; identical-byte parity tests for MOV, branches, carry and self-modification | Untested machines, UEFI or arbitrary edited bytes |
| Public files match the tested source revision | Compare deployed files with that exact commit; inspect its CI/deploy runs | Proof that a newer local revision is published |

Read the [clean-checkout recipe](reproduction.md) for build identity and the
[dated acceptance record](validation.md) for release-specific evidence. Current
work is in the [roadmap](../ROADMAP.md) and [evolution log](EVOLUTION.md);
historical release counts are not the current checkout's inventory.

For a bug report, include the exact bytes or canonical source, inspection mode,
loaded address, steps, expected state and actual error. For an instruction
addition, follow [contribution rules](../CONTRIBUTING.md): scope the encoding,
add independent byte/state assertions, and use native evidence for native claims.
