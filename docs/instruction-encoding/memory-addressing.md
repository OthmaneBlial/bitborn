# One offset, two default segments

In 16-bit addressing, `8B 46 FE` is MOV AX,[BP-2]. The ModR/M byte `01 | 000 | 110`
selects an eight-bit displacement, destination AX and base BP. `FE` is signed -2.
Because BP participates in this address, the default segment is SS.

`8B 08` is MOV CX,[BX+SI], defaulting to DS. `8B 16 20 00` is MOV DX,[32], also
defaulting to DS: r/m=110 with mod=00 denotes an absolute disp16, not BP. Segment
selection therefore depends on the addressing form, not the r/m bits alone.

Try these literal fixtures in the
[instruction playground](https://othmaneblial.github.io/bitborn/playground/). Select
**8B 46 FE / BP and SS** in 16-bit context and flip displacement bit 7. FE becomes
7E (+126), while BP still selects SS. The inspector explains the symbolic effective
offset and each address/displacement bit; it reads no registers or RAM.

## The supported address table

| r/m | mod=00 | mod=01/10 | Default segment |
| --- | --- | --- | --- |
| 000 | BX+SI | BX+SI+displacement | DS |
| 001 | BX+DI | BX+DI+displacement | DS |
| 010 | BP+SI | BP+SI+displacement | SS |
| 011 | BP+DI | BP+DI+displacement | SS |
| 100 | SI | SI+displacement | DS |
| 101 | DI | DI+displacement | DS |
| 110 | absolute disp16 | BP+displacement | DS for absolute; SS for BP |
| 111 | BX | BX+displacement | DS |

mod=01 supplies a sign-extended disp8; mod=10 supplies a signed disp16. Absolute
disp16 is unsigned. Words are little-endian, and the effective offset wraps modulo
65536. A 66 prefix changes word MOV's operand size to 32 bits in this context;
it does not change the 16-bit address table. Byte MOV ignores that operand prefix.

The [Intel instruction-format reference, Table 2-1](https://cdrdv2-public.intel.com/812389/325383-sdm-vol-2abcd.pdf)
defines the 16-bit ModR/M address forms. This viewer supports 88/89/8A/8B in this
addressing context only: 32-/64-bit memory addressing, 67 address-size overrides,
segment overrides, SIB and RIP-relative forms remain explicit scope errors.
The bounded model still rejects execution of these memory forms.

## Independent checks and native evidence

```sh
node tests/test_memory_encoding.mjs
python3 -m unittest tests.test_memory_segment -v
```

5,888 cases cover all memory ModR/M/register/opcode combinations, signed
displacement extrema, absolute offsets, operand-size prefixes, exact byte/bit
fields and truncation. Three new literal fixtures have independent NDISASM 3.02
goldens, bringing the complete encoding fixture set to 21 cases. These are
read-only disassembly checks, not native execution.

The separate [52-byte native probe](https://github.com/OthmaneBlial/bitborn/blob/main/tests/fixtures/memory-segment.bits)
sets DS=`1000` and SS=`2000`, writes `1111` at physical `10020` and `2222` at
`20020`, and sets BP=`0022`, BX=`0020`, SI=0. Actual QEMU/TCG results distinguish
the default segment at the same effective offset:

| Literal load | Default segment | Physical address | Native result |
| --- | --- | --- | --- |
| 8B 46 FE: MOV AX,[BP-2] | SS | `20020` | AX=`2222` |
| 8B 08: MOV CX,[BX+SI] | DS | `10020` | CX=`1111` |
| 8B 16 20 00: MOV DX,[32] | DS | `10020` | DX=`1111` |

Tests read actual guest segment bases, registers and RAM, check all 52 instruction
bytes against source, and wait for the controlled halt with next IP `7C32`.
The probe uses a literal SS override to initialize its second word; that setup
instruction is not presented as a supported inspector form. Host tools add only
BIOS padding/signature. QEMU uses read-only disks with networking disabled.
No arbitrary imported code runs natively, and physical hardware is unverified.
