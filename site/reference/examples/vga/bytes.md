# Every byte explained

Generated from canonical `.bits` annotations by `python3 tools/byte_tables.py`.

Instruction names below are disassembly for explanation, never code-generation input.

| Offset | Binary | Hex | Range / byte within it | Encoding explanation |
| --- | --- | --- | --- | --- |
| 0 | `11111010` | `FA` | instruction: CLI, byte 1/1 | FA prevents interrupts during segment/stack initialization. |
| 1 | `11101010` | `EA` | instruction: JMP 0000:7C06, byte 1/5 | EA little-endian offset and segment normalize CS. |
| 2 | `00000110` | `06` | instruction: JMP 0000:7C06, byte 2/5 | EA little-endian offset and segment normalize CS. |
| 3 | `01111100` | `7C` | instruction: JMP 0000:7C06, byte 3/5 | EA little-endian offset and segment normalize CS. |
| 4 | `00000000` | `00` | instruction: JMP 0000:7C06, byte 4/5 | EA little-endian offset and segment normalize CS. |
| 5 | `00000000` | `00` | instruction: JMP 0000:7C06, byte 5/5 | EA little-endian offset and segment normalize CS. |
| 6 | `00110001` | `31` | instruction: XOR AX,AX, byte 1/2 | 31 C0 clears AX. |
| 7 | `11000000` | `C0` | instruction: XOR AX,AX, byte 2/2 | 31 C0 clears AX. |
| 8 | `10001110` | `8E` | instruction: MOV DS,AX, byte 1/2 | 8E D8 sets DS=0. |
| 9 | `11011000` | `D8` | instruction: MOV DS,AX, byte 2/2 | 8E D8 sets DS=0. |
| 10 | `10001110` | `8E` | instruction: MOV SS,AX, byte 1/2 | 8E D0 sets SS=0. |
| 11 | `11010000` | `D0` | instruction: MOV SS,AX, byte 2/2 | 8E D0 sets SS=0. |
| 12 | `10111100` | `BC` | instruction: MOV SP,7C00, byte 1/3 | BC places stack below the boot image. |
| 13 | `00000000` | `00` | instruction: MOV SP,7C00, byte 2/3 | BC places stack below the boot image. |
| 14 | `01111100` | `7C` | instruction: MOV SP,7C00, byte 3/3 | BC places stack below the boot image. |
| 15 | `11111100` | `FC` | instruction: CLD, byte 1/1 | FC advances DI on STOSW. |
| 16 | `10111000` | `B8` | instruction: MOV AX,0003, byte 1/3 | B8 selects VGA text mode. |
| 17 | `00000011` | `03` | instruction: MOV AX,0003, byte 2/3 | B8 selects VGA text mode. |
| 18 | `00000000` | `00` | instruction: MOV AX,0003, byte 3/3 | B8 selects VGA text mode. |
| 19 | `11001101` | `CD` | instruction: INT 10, byte 1/2 | CD 10 establishes 80x25 VGA text mode. |
| 20 | `00010000` | `10` | instruction: INT 10, byte 2/2 | CD 10 establishes 80x25 VGA text mode. |
| 21 | `10111000` | `B8` | instruction: MOV AX,B800, byte 1/3 | B8 loads VGA text-memory segment. |
| 22 | `00000000` | `00` | instruction: MOV AX,B800, byte 2/3 | B8 loads VGA text-memory segment. |
| 23 | `10111000` | `B8` | instruction: MOV AX,B800, byte 3/3 | B8 loads VGA text-memory segment. |
| 24 | `10001110` | `8E` | instruction: MOV ES,AX, byte 1/2 | 8E C0 makes ES address physical B8000. |
| 25 | `11000000` | `C0` | instruction: MOV ES,AX, byte 2/2 | 8E C0 makes ES address physical B8000. |
| 26 | `00110001` | `31` | instruction: XOR DI,DI, byte 1/2 | 31 FF sets the first screen-cell offset to zero. |
| 27 | `11111111` | `FF` | instruction: XOR DI,DI, byte 2/2 | 31 FF sets the first screen-cell offset to zero. |
| 28 | `10111000` | `B8` | instruction: MOV AX,0A42, byte 1/3 | B8 loads character B in AL and bright green attribute 0A in AH. |
| 29 | `01000010` | `42` | instruction: MOV AX,0A42, byte 2/3 | B8 loads character B in AL and bright green attribute 0A in AH. |
| 30 | `00001010` | `0A` | instruction: MOV AX,0A42, byte 3/3 | B8 loads character B in AL and bright green attribute 0A in AH. |
| 31 | `10101011` | `AB` | instruction: STOSW, byte 1/1 | AB writes AX to ES:DI, producing a real green VGA character. |
| 32 | `11111010` | `FA` | instruction: CLI, byte 1/1 | FA disables interrupts before halting. |
| 33 | `11110100` | `F4` | instruction: HLT, byte 1/1 | F4 stops execution after the visible write. |
| 34 | `11101011` | `EB` | instruction: JMP halt, byte 1/2 | EB FD returns to HLT if awakened. |
| 35 | `11111101` | `FD` | instruction: JMP halt, byte 2/2 | EB FD returns to HLT if awakened. |
