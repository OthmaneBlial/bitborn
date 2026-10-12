# Read an instruction one byte at a time

Binary is a **notation**, not an extra execution format. Writing `10111000`
instead of `B8` does not change the byte the CPU receives. The CPU decodes bytes
in the selected execution mode; source comments and whitespace are absent.

## Immediate operands

```text
10111000 00101010 00000000 00000000 00000000
   B8       2A       00       00       00
```

In x86-64's default 32-bit operand size this is `MOV EAX,42`: opcode `B8+register`
selects EAX and four following bytes hold the little-endian immediate `0000002A`.
Writing EAX also clears the upper 32 bits of RAX. In 16-bit real mode the same
opcode consumes **two** immediate bytes, so instruction interpretation depends
on the mode. Our BIOS code uses `B8 03 00` for `MOV AX,3`.

## Mode-aware inspection

The [live playground](https://othmaneblial.github.io/bitborn/playground/) now
lets you select an explicit decoding context. Choose the four-byte immediate
fixture, then change 16 → 32 → 64: `B8` selects AX with two operand bytes in the
first context, and EAX with four in the others. The simulation button stays
disabled for 32-/64-bit contexts because inspection adds no execution support.

Choose the REX fixture in 64-bit context. `49` is `0100 W R X B`: W=1 chooses
64-bit operands and B=1 extends the register selector, giving R8. Flip B to select
RAX; clear W to inspect EAX and a four-byte immediate. In legacy contexts the
same prefix-range bytes are one-byte INC/DEC instructions. With REX.W set, it
takes precedence over the supported 66 operand-size override. The inspector
limits prefix handling rather than guessing repeated or reordered prefixes.

See the [literal fixtures and exact inspection scope](fixtures/README.md).
Register/opcode/ModR/M/immediate roles are exposed in each bit's accessible label
and tooltip. The 64-bit immediate is kept as BigInt, including
`FFFFFFFFFFFFFFFF` = `18446744073709551615` without floating-point rounding.

## ModR/M fields

`31 C0` is `XOR AX,AX` in real mode. `31` selects XOR register into register/memory;
the next byte `11000000` splits into `11 | 000 | 000`: register addressing, source
AX, destination AX. `8E D8` selects a segment-register MOV, with `11 | 011 | 000`
meaning register addressing, DS, AX. These fields change with the opcode; a bit
position has no universal meaning across all instructions.

## Signed relative branches

In the boot output loop, `74 1B` at offset 58 means jump when ZF=1. The CPU adds
the signed displacement to the address **after** the instruction: `60+27=87`.
`EB E0` at offset 85 branches backward: `E0` is −32, so `87−32=55`.
Near `E8` and `E9` in real mode have signed 16-bit displacements. Monitor calls
and branches are manually encoded and tested to land on instruction boundaries.

## Addresses and byte order

`BE 5B 7C` loads SI with `7C5B`: the message starts at physical `7C00+91`.
The low byte comes first in the instruction. `A0 00 7C` in the monitor loads AL
from memory at DS:`7C00`, with DS=0. This is different from an immediate constant.

## Stack and procedures

`50` pushes AX, `58` pops AX, `E8 xx xx` calls a relative procedure and pushes
the return IP, and `C3` returns by popping IP. The monitor's output helper saves
and restores AX/BX/CX/DX/SI/DI. Missing one pop would corrupt the return address;
real command tests exercise repeated procedure calls.

## Code, data and padding

Printable bytes are not automatically instructions. The final message, NUL,
padding and BIOS signature occupy byte ranges that control flow never reaches.
`bitinspect` uses known source annotations; it does not guess a full disassembly
from arbitrary data. The visual explorer displays those boundaries separately.

Every canonical instruction is explained inline in its `.bits` source. The
generated [boot annotation table](../../boot/annotations.json) maps all 512 bytes
back to these ranges. Gallery walkthroughs contain per-byte tables too.

For authoritative definitions, use the [Intel instruction reference](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html).
