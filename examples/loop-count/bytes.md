# Every byte explained

Generated from canonical `.bits` annotations by `python3 tools/byte_tables.py`.

Instruction names below are disassembly for explanation, never code-generation input.

| Offset | Binary | Hex | Range / byte within it | Encoding explanation |
| --- | --- | --- | --- | --- |
| 0 | `10111111` | `BF` | instruction: MOV EDI,0, byte 1/5 | BF clears the accumulated count. |
| 1 | `00000000` | `00` | instruction: MOV EDI,0, byte 2/5 | BF clears the accumulated count. |
| 2 | `00000000` | `00` | instruction: MOV EDI,0, byte 3/5 | BF clears the accumulated count. |
| 3 | `00000000` | `00` | instruction: MOV EDI,0, byte 4/5 | BF clears the accumulated count. |
| 4 | `00000000` | `00` | instruction: MOV EDI,0, byte 5/5 | BF clears the accumulated count. |
| 5 | `10111001` | `B9` | instruction: MOV ECX,5, byte 1/5 | B9 = B8+ECX; five iterations. |
| 6 | `00000101` | `05` | instruction: MOV ECX,5, byte 2/5 | B9 = B8+ECX; five iterations. |
| 7 | `00000000` | `00` | instruction: MOV ECX,5, byte 3/5 | B9 = B8+ECX; five iterations. |
| 8 | `00000000` | `00` | instruction: MOV ECX,5, byte 4/5 | B9 = B8+ECX; five iterations. |
| 9 | `00000000` | `00` | instruction: MOV ECX,5, byte 5/5 | B9 = B8+ECX; five iterations. |
| 10 | `11111111` | `FF` | instruction: INC EDI, byte 1/2 | FF /0; C7 selects register EDI. In 64-bit mode 47 would be a REX prefix, not INC. |
| 11 | `11000111` | `C7` | instruction: INC EDI, byte 2/2 | FF /0; C7 selects register EDI. In 64-bit mode 47 would be a REX prefix, not INC. |
| 12 | `11111111` | `FF` | instruction: DEC ECX, byte 1/2 | FF /1; C9 selects register ECX and sets ZF when count reaches zero. |
| 13 | `11001001` | `C9` | instruction: DEC ECX, byte 2/2 | FF /1; C9 selects register ECX and sets ZF when count reaches zero. |
| 14 | `01110101` | `75` | instruction: JNZ offset 10, byte 1/2 | 75 rel8; next offset 16 minus 6 = 10, the increment instruction. |
| 15 | `11111010` | `FA` | instruction: JNZ offset 10, byte 2/2 | 75 rel8; next offset 16 minus 6 = 10, the increment instruction. |
| 16 | `10111000` | `B8` | instruction: MOV EAX,60, byte 1/5 | B8 loads Linux exit syscall number. |
| 17 | `00111100` | `3C` | instruction: MOV EAX,60, byte 2/5 | B8 loads Linux exit syscall number. |
| 18 | `00000000` | `00` | instruction: MOV EAX,60, byte 3/5 | B8 loads Linux exit syscall number. |
| 19 | `00000000` | `00` | instruction: MOV EAX,60, byte 4/5 | B8 loads Linux exit syscall number. |
| 20 | `00000000` | `00` | instruction: MOV EAX,60, byte 5/5 | B8 loads Linux exit syscall number. |
| 21 | `00001111` | `0F` | instruction: SYSCALL, byte 1/2 | 0F 05 exits with the accumulated count, 5. |
| 22 | `00000101` | `05` | instruction: SYSCALL, byte 2/2 | 0F 05 exits with the accumulated count, 5. |
