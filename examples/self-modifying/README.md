# One writer bit changes the next instruction

This 82-byte handwritten BIOS program stores a new value into an upcoming MOV
operand, transfers control to that instruction, and emits the value it actually
loads. The source contains uppercase `A`; the native guest prints lowercase `a`
on COM1 and writes `61 0F` into the first VGA text cell.

![Actual QEMU VGA cells from two separate boots: control A, then self-modified a](../../assets/self-modifying-demo.gif)

The GIF crops and enlarges the actual first text cell. It compares two separate
QEMU boots, not a native rewind. Full screenshots and source/frame/image hashes
are recorded alongside it. No synthetic glyph or browser output is substituted.

## Literal source and the control

| Property | [program.bits](program.bits) | [control.bits](control.bits) |
| --- | --- | --- |
| Writer immediate, source byte 52 | `61` / `01100001` | `41` / `01000001` |
| Original future operand, source byte 61 | `41` | `41` |
| Code RAM after the store | Byte 61 becomes `61` | Byte 61 remains `41` |
| Character emitted by live MOV fetch | `a` | `A` |
| First VGA word | `61 0F` | `41 0F` |

The executable sources differ only at writer byte 52, bit 5 (`20` in hex).
In the modified guest, code RAM differs from the original source only at byte 61,
also bit 5. The control performs the same store but writes the existing value.
Comments do not participate in either comparison.

`MOV BX,7C3D` points to that future operand: `7C00 + 61 = 7C3D`.
`MOV [BX],AL` uses DS zero, while instruction fetch uses normalized CS zero.
Both therefore refer to the same physical address. An unconditional `JMP +0`
follows the store before the modified MOV executes. This follows Intel's
[same-thread store/jump/execute guidance](https://www.intel.com/content/dam/www/public/us/en/documents/manuals/64-ia-32-architectures-software-developer-vol-3a-part-1-manual.pdf)
in section 8.1.3. Tests establish the stated QEMU behavior; they do not validate
physical instruction caches, cross-thread modification or multiprocessor ordering.

## Run and inspect

```sh
make build
./tools/bitverify build/self-modifying.bin --size 82 --sha256 39682d778b4924ef7c8c2843b3c8dff9d9d6d9254320d7099e8d33e8b2dbb9af
./tools/bitverify build/self-modifying.img --size 512 --bios
qemu-system-i386 -machine pc,accel=tcg -drive file=build/self-modifying.img,format=raw,if=floppy,readonly=on -serial stdio
```

The reviewed build publishes the main raw `.bin` and bootable `.img`. The control
is a separate literal verification source, framed only for the controlled tests
and recording. Both images are read-only; source and disk bytes remain unchanged
when guest RAM changes. Existing release tags/assets are untouched.

For step-by-step viewing, import the main `.bits` file into the
[CPU Lab](https://othmaneblial.github.io/bitborn/cpu-lab/). After 27 modeled steps,
byte `07C3D` still holds `41`. Step once: it becomes `61`. Back restores `41`;
Forward restores `61` without re-executing the store. Two more steps jump and
fetch the modified MOV. Step 32 emits `a`; the final state at step 40 has
AX=`0F61`, BX=`7C3D`, DX=`03F8`, DI=`0002`, SP=`7C00` and next logical IP `7C50`.
The VGA byte pair is at physical `B8000`.

The current source establishes `SS:SP=0000:7C00` with hardware interrupts masked
before its first BIOS call, then restores a known data segment afterward. This
removes the earlier 80-byte fixture's reliance on the firmware-provided stack.
All literal addresses, reviewed hashes and capture provenance track the current
82-byte source; historical commits and release artifacts are not rewritten.

The model uses its limited BIOS mode hook and UART rules, not a full BIOS/device
implementation. Native QEMU checks compare all eight general-purpose words,
configured segments, IP, defined modeled flags, code RAM, serial and the VGA word.
AF remains undefined after XOR and is excluded from the native flag comparison.
Complete model rewind/replay also restores RAM, output and the original source.

```sh
node tests/test_self_modifying.mjs
python3 -m unittest tests.test_self_modifying_native
python3 tools/record_self_modifying.py
```

The [complete byte table](bytes.md) explains every literal byte. This is an
v0.4.0 native experiment, with actual emulator evidence and no performance
or physical-hardware claim.

The [literal reference map](references.json) checks the future operand pointer
and code transfers for both controls; see the
[reference guide](../../docs/address-references.md) for the declared assumptions.

```sh
./tools/bitinspect build/self-modifying.bin --references examples/self-modifying/references.json
```
