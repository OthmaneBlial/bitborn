# bitborn — software born from raw bits

[Try the website](https://othmaneblial.github.io/bitborn/) · [Full README](../../../README.md) · [Languages](../README.md)

Write the actual bytes of an x86 program as 0s and 1s. Bitborn's target instructions
are handwritten in `.bits` files: no assembler or compiler chooses the opcodes,
operands or branch displacements. Instruction names in comments explain bytes;
they do not generate them. Python packages bytes and adds file headers or sector
framing. JavaScript powers the educational website.

## Read your first instruction

```text
10111000 00101010 00000000
```

In a 16-bit operand-size context, these three bytes mean `MOV AX,42`. `B8` selects
the register; `2A 00` stores 42 with the low byte first. Execution mode matters:
in a 32-bit operand-size context, `B8` needs four immediate bytes instead of two.
The browser CPU Lab executes only its documented 16-bit subset.

## Try it

Open the [CPU Lab](https://othmaneblial.github.io/bitborn/cpu-lab/) to step through
a program, inspect registers, flags, stack and memory, or restore recorded states
with Back and Forward. The [Boot Sector Builder](https://othmaneblial.github.io/bitborn/boot-builder/)
lets you edit and export a complete 512-byte image. Challenges teach changes to
literal bytes; your progress stays in your browser.

To build and test the actual boot programs, install Python 3.10+, Make and QEMU.
On macOS use `brew install qemu`; on Ubuntu use
`sudo apt-get install python3 make qemu-system-x86`.

```sh
git clone https://github.com/OthmaneBlial/bitborn.git
cd bitborn
make test
make run
```

`make test` checks reviewed bytes and guest behavior in headless QEMU. `make run`
opens the BIOS boot image. BIOS examples work in QEMU on Apple Silicon; native
ELF examples need Linux x86-64. Browser development checks additionally need Node.js
and Playwright; see the contribution guide.

## Scope and progress

The repository includes BIOS boot programs, keyboard/VGA/disk experiments, an
interactive shell, a separate protected-mode interrupt experiment, and Linux ELF
examples. The browser is a bounded teaching model with 1 MiB of memory and a
4,096-step limit, not a complete CPU or BIOS. Imported programs are interpreted,
never executed as host-native code. Hardware, UEFI and production OS support are
not established. Use disposable emulators for native experiments.

[Current roadmap and evidence](../../../ROADMAP.md) · [Live progress](https://othmaneblial.github.io/bitborn/roadmap/) · [Changelog](../../../CHANGELOG.md)

Learn with the [beginner tutorial](../../tutorials/from-bits-to-boot.md) and
[architecture guide](../../architecture/README.md). Contributions follow the
[source rules](../../../CONTRIBUTING.md) and [code of conduct](../../../CODE_OF_CONDUCT.md).
Report vulnerabilities [privately](../../../SECURITY.md). Code and documentation
use the [MIT license](../../../LICENSE). The English introduction is the maintained
translation source; detailed technical guides currently remain in English.
