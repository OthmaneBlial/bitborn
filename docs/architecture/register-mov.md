# Copy registers without changing flags

The bounded 16-bit model executes unprefixed register-direct MOV opcodes 88/89/8A/8B.
Word forms copy all 16 bits. Byte forms select AL/CL/DL/BL/AH/CH/DH/BH, preserving
the other half of the destination word. A source byte is read before the destination
is changed, including when both aliases refer to the same word register.

In the [instruction playground](https://othmaneblial.github.io/bitborn/playground/),
execute MOV AX,42, then choose **89 D8 / register direction** and flip opcode bit 1.
The displayed instruction becomes MOV BX,AX. Simulate it: BX becomes 42 while
AX and flags stay unchanged. The CPU Lab also accepts these raw instruction bytes,
records register changes, and restores them through its history controls.

## Independent model checks

```sh
node tests/test_register_mov.mjs
```

2,048 cases cover all 64 register pairs for each of four opcodes, with eight
input/flag patterns. An independent little-endian byte array supplies the expected
result rather than calling the model's register-writing code. It covers SP/BP/SI/DI,
high/low aliases, same-register copies, nullable AF and all other modeled flags.
Memory journals remain empty; the existing full-RAM oracle independently checks a
register-copy program. History checks undo and replay the exact words and HLT state.

## Curated native evidence

```sh
python3 -m unittest tests.test_register_mov -v
```

The [48-byte literal fixture](https://github.com/OthmaneBlial/bitborn/blob/main/tests/fixtures/register-mov.bits)
normalizes the real-mode code/data/stack segments, initializes registers, sets CF
and DF, and saves native FLAGS in DI with PUSHF/POP. It then executes seven literal
register-copy instructions and halts. QMP reads actual registers, guest instruction
bytes and the saved stack word.

| Instruction sequence | Result checked in real QEMU/TCG |
| --- | --- |
| MOV SI,BX | SI=`1234` |
| MOV BP,CX | BP=`5678` |
| MOV AL,AH; MOV AH,BL | AX=`34AB` |
| MOV CL,DH | CX=`569A` |
| MOV DH,AL | DX=`ABBC` |
| MOV BH,BL | BX=`3434` |
| All seven copies | Sampled FLAGS before/after match; CF/DF remain set, IF clear |
| Controlled halt | SP=`7C00`, next IP=`7C2E`; all 48 code bytes match source |

Python adds only BIOS zero padding and the 55 AA signature; it never assembles
instruction names. The flag-sampling PUSHF in this native probe is outside the
browser model, so the complete probe is not presented as a CPU Lab preset.
The probe is a curated research test, not a new release download or arbitrary
imported-code execution. QEMU disks are read-only and networking is disabled.

Execution also supports unprefixed 16-bit-addressed memory MOV, with
[shared address decoding and native parity](../instruction-encoding/memory-addressing.md).
Operand/address-size and segment-override prefixes remain outside execution scope.
32-/64-bit and REX interpretation remains available in the read-only inspector;
it does not grant execution support. No fault, hardware IRQ or physical-hardware
compatibility follows from these register-copy checks.
