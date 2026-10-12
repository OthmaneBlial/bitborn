# Every byte explained

Generated from canonical `.bits` annotations by `python3 tools/byte_tables.py`.

Instruction names below are disassembly for explanation, never code-generation input.

| Offset | Binary | Hex | Range / byte within it | Encoding explanation |
| --- | --- | --- | --- | --- |
| 0 | `10111111` | `BF` | instruction: MOV EDI,42, byte 1/5 | BF loads the value to compare. |
| 1 | `00101010` | `2A` | instruction: MOV EDI,42, byte 2/5 | BF loads the value to compare. |
| 2 | `00000000` | `00` | instruction: MOV EDI,42, byte 3/5 | BF loads the value to compare. |
| 3 | `00000000` | `00` | instruction: MOV EDI,42, byte 4/5 | BF loads the value to compare. |
| 4 | `00000000` | `00` | instruction: MOV EDI,42, byte 5/5 | BF loads the value to compare. |
| 5 | `10000011` | `83` | instruction: CMP EDI,42, byte 1/3 | 83 /7; FF selects EDI, imm8 42 is sign-extended; equality sets ZF. |
| 6 | `11111111` | `FF` | instruction: CMP EDI,42, byte 2/3 | 83 /7; FF selects EDI, imm8 42 is sign-extended; equality sets ZF. |
| 7 | `00101010` | `2A` | instruction: CMP EDI,42, byte 3/3 | 83 /7; FF selects EDI, imm8 42 is sign-extended; equality sets ZF. |
| 8 | `01110100` | `74` | instruction: JE offset 15, byte 1/2 | 74 rel8; next offset 10 + 5 = 15, skipping the unequal status. |
| 9 | `00000101` | `05` | instruction: JE offset 15, byte 2/2 | 74 rel8; next offset 10 + 5 = 15, skipping the unequal status. |
| 10 | `10111111` | `BF` | instruction: MOV EDI,1, byte 1/5 | BF assigns exit status 1 on inequality. |
| 11 | `00000001` | `01` | instruction: MOV EDI,1, byte 2/5 | BF assigns exit status 1 on inequality. |
| 12 | `00000000` | `00` | instruction: MOV EDI,1, byte 3/5 | BF assigns exit status 1 on inequality. |
| 13 | `00000000` | `00` | instruction: MOV EDI,1, byte 4/5 | BF assigns exit status 1 on inequality. |
| 14 | `00000000` | `00` | instruction: MOV EDI,1, byte 5/5 | BF assigns exit status 1 on inequality. |
| 15 | `10111000` | `B8` | instruction: MOV EAX,60, byte 1/5 | B8 selects Linux exit; the equal branch retains EDI=42. |
| 16 | `00111100` | `3C` | instruction: MOV EAX,60, byte 2/5 | B8 selects Linux exit; the equal branch retains EDI=42. |
| 17 | `00000000` | `00` | instruction: MOV EAX,60, byte 3/5 | B8 selects Linux exit; the equal branch retains EDI=42. |
| 18 | `00000000` | `00` | instruction: MOV EAX,60, byte 4/5 | B8 selects Linux exit; the equal branch retains EDI=42. |
| 19 | `00000000` | `00` | instruction: MOV EAX,60, byte 5/5 | B8 selects Linux exit; the equal branch retains EDI=42. |
| 20 | `00001111` | `0F` | instruction: SYSCALL, byte 1/2 | 0F 05 exits with 42 when equal, or 1 when unequal. |
| 21 | `00000101` | `05` | instruction: SYSCALL, byte 2/2 | 0F 05 exits with 42 when equal, or 1 when unequal. |
