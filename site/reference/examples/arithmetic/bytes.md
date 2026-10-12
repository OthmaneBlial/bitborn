# Every byte explained

Generated from canonical `.bits` annotations by `python3 tools/byte_tables.py`.

Instruction names below are disassembly for explanation, never code-generation input.

| Offset | Binary | Hex | Range / byte within it | Encoding explanation |
| --- | --- | --- | --- | --- |
| 0 | `10111111` | `BF` | instruction: MOV EDI,6, byte 1/5 | BF loads the first arithmetic operand. |
| 1 | `00000110` | `06` | instruction: MOV EDI,6, byte 2/5 | BF loads the first arithmetic operand. |
| 2 | `00000000` | `00` | instruction: MOV EDI,6, byte 3/5 | BF loads the first arithmetic operand. |
| 3 | `00000000` | `00` | instruction: MOV EDI,6, byte 4/5 | BF loads the first arithmetic operand. |
| 4 | `00000000` | `00` | instruction: MOV EDI,6, byte 5/5 | BF loads the first arithmetic operand. |
| 5 | `01101011` | `6B` | instruction: IMUL EDI,EDI,7, byte 1/3 | 6B /r imm8; ModR/M FF means EDI times sign-extended 7; result is 42. |
| 6 | `11111111` | `FF` | instruction: IMUL EDI,EDI,7, byte 2/3 | 6B /r imm8; ModR/M FF means EDI times sign-extended 7; result is 42. |
| 7 | `00000111` | `07` | instruction: IMUL EDI,EDI,7, byte 3/3 | 6B /r imm8; ModR/M FF means EDI times sign-extended 7; result is 42. |
| 8 | `10111000` | `B8` | instruction: MOV EAX,60, byte 1/5 | B8 loads Linux exit syscall number without changing EDI. |
| 9 | `00111100` | `3C` | instruction: MOV EAX,60, byte 2/5 | B8 loads Linux exit syscall number without changing EDI. |
| 10 | `00000000` | `00` | instruction: MOV EAX,60, byte 3/5 | B8 loads Linux exit syscall number without changing EDI. |
| 11 | `00000000` | `00` | instruction: MOV EAX,60, byte 4/5 | B8 loads Linux exit syscall number without changing EDI. |
| 12 | `00000000` | `00` | instruction: MOV EAX,60, byte 5/5 | B8 loads Linux exit syscall number without changing EDI. |
| 13 | `00001111` | `0F` | instruction: SYSCALL, byte 1/2 | 0F 05 exits with the computed result, 42. |
| 14 | `00000101` | `05` | instruction: SYSCALL, byte 2/2 | 0F 05 exits with the computed result, 42. |
