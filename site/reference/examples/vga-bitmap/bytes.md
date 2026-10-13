# Every byte explained

Generated from canonical `.bits` annotations by `python3 tools/byte_tables.py`.

Instruction names below are disassembly for explanation, never code-generation input.

| Offset | Binary | Hex | Range / byte within it | Encoding explanation |
| --- | --- | --- | --- | --- |
| 0 | `11111010` | `FA` | instruction: CLI, byte 1/1 | Mask hardware interrupts before segment setup. |
| 1 | `11101010` | `EA` | instruction: JMP 0000:7C06, byte 1/5 | Normalize CS; physical entry remains 7C06. |
| 2 | `00000110` | `06` | instruction: JMP 0000:7C06, byte 2/5 | Normalize CS; physical entry remains 7C06. |
| 3 | `01111100` | `7C` | instruction: JMP 0000:7C06, byte 3/5 | Normalize CS; physical entry remains 7C06. |
| 4 | `00000000` | `00` | instruction: JMP 0000:7C06, byte 4/5 | Normalize CS; physical entry remains 7C06. |
| 5 | `00000000` | `00` | instruction: JMP 0000:7C06, byte 5/5 | Normalize CS; physical entry remains 7C06. |
| 6 | `00110001` | `31` | instruction: XOR AX,AX, byte 1/2 | Prepare our own stack before calling the BIOS. |
| 7 | `11000000` | `C0` | instruction: XOR AX,AX, byte 2/2 | Prepare our own stack before calling the BIOS. |
| 8 | `10001110` | `8E` | instruction: MOV SS,AX, byte 1/2 | Stack segment zero. |
| 9 | `11010000` | `D0` | instruction: MOV SS,AX, byte 2/2 | Stack segment zero. |
| 10 | `10111100` | `BC` | instruction: MOV SP,7C00, byte 1/3 | Stack below this boot payload. |
| 11 | `00000000` | `00` | instruction: MOV SP,7C00, byte 2/3 | Stack below this boot payload. |
| 12 | `01111100` | `7C` | instruction: MOV SP,7C00, byte 3/3 | Stack below this boot payload. |
| 13 | `10111000` | `B8` | instruction: MOV AX,0013, byte 1/3 | BIOS graphics mode 13h: 320 by 200 indexed pixels. |
| 14 | `00010011` | `13` | instruction: MOV AX,0013, byte 2/3 | BIOS graphics mode 13h: 320 by 200 indexed pixels. |
| 15 | `00000000` | `00` | instruction: MOV AX,0013, byte 3/3 | BIOS graphics mode 13h: 320 by 200 indexed pixels. |
| 16 | `11001101` | `CD` | instruction: INT 10h, byte 1/2 | Enter graphics mode using the initialized stack. |
| 17 | `00010000` | `10` | instruction: INT 10h, byte 2/2 | Enter graphics mode using the initialized stack. |
| 18 | `00110001` | `31` | instruction: XOR AX,AX, byte 1/2 | Restore a known zero source segment after the BIOS call. |
| 19 | `11000000` | `C0` | instruction: XOR AX,AX, byte 2/2 | Restore a known zero source segment after the BIOS call. |
| 20 | `10001110` | `8E` | instruction: MOV DS,AX, byte 1/2 | Source bytes use physical addresses. |
| 21 | `11011000` | `D8` | instruction: MOV DS,AX, byte 2/2 | Source bytes use physical addresses. |
| 22 | `10111010` | `BA` | instruction: MOV DX,03C8, byte 1/3 | VGA DAC palette write-index port. |
| 23 | `11001000` | `C8` | instruction: MOV DX,03C8, byte 2/3 | VGA DAC palette write-index port. |
| 24 | `00000011` | `03` | instruction: MOV DX,03C8, byte 3/3 | VGA DAC palette write-index port. |
| 25 | `00110000` | `30` | instruction: XOR AL,AL, byte 1/2 | Select palette entry zero. |
| 26 | `11000000` | `C0` | instruction: XOR AL,AL, byte 2/2 | Select palette entry zero. |
| 27 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | Begin the black background palette entry. |
| 28 | `01000010` | `42` | instruction: INC DX, byte 1/1 | Palette component data port 03C9. |
| 29 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | Background red component zero. |
| 30 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | Background green component zero. |
| 31 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | Background blue component zero. |
| 32 | `01001010` | `4A` | instruction: DEC DX, byte 1/1 | Return to palette write-index port 03C8. |
| 33 | `10110000` | `B0` | instruction: MOV AL,0A, byte 1/2 | Select the letter's palette entry ten. |
| 34 | `00001010` | `0A` | instruction: MOV AL,0A, byte 2/2 | Select the letter's palette entry ten. |
| 35 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | Begin palette entry ten. |
| 36 | `01000010` | `42` | instruction: INC DX, byte 1/1 | Component data port 03C9. |
| 37 | `00110000` | `30` | instruction: XOR AL,AL, byte 1/2 | Red component zero. |
| 38 | `11000000` | `C0` | instruction: XOR AL,AL, byte 2/2 | Red component zero. |
| 39 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | Write red zero. |
| 40 | `10110000` | `B0` | instruction: MOV AL,3F, byte 1/2 | Offset 41: six-bit green component 63; control clears only bit 5. |
| 41 | `00111111` | `3F` | instruction: MOV AL,3F, byte 2/2 | Offset 41: six-bit green component 63; control clears only bit 5. |
| 42 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | Write the authored green palette component. |
| 43 | `00110000` | `30` | instruction: XOR AL,AL, byte 1/2 | Blue component zero. |
| 44 | `11000000` | `C0` | instruction: XOR AL,AL, byte 2/2 | Blue component zero. |
| 45 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | Write blue zero; entry ten is complete. |
| 46 | `10111000` | `B8` | instruction: MOV AX,A000, byte 1/3 | VGA framebuffer segment. |
| 47 | `00000000` | `00` | instruction: MOV AX,A000, byte 2/3 | VGA framebuffer segment. |
| 48 | `10100000` | `A0` | instruction: MOV AX,A000, byte 3/3 | VGA framebuffer segment. |
| 49 | `10001110` | `8E` | instruction: MOV ES,AX, byte 1/2 | Destination is the packed VGA aperture. |
| 50 | `11000000` | `C0` | instruction: MOV ES,AX, byte 2/2 | Destination is the packed VGA aperture. |
| 51 | `11111100` | `FC` | instruction: CLD, byte 1/1 | Source and destination advance forward. |
| 52 | `10111110` | `BE` | instruction: MOV SI,7C4E, byte 1/3 | The manually authored 64-pixel bitmap begins at payload offset 78. |
| 53 | `01001110` | `4E` | instruction: MOV SI,7C4E, byte 2/3 | The manually authored 64-pixel bitmap begins at payload offset 78. |
| 54 | `01111100` | `7C` | instruction: MOV SI,7C4E, byte 3/3 | The manually authored 64-pixel bitmap begins at payload offset 78. |
| 55 | `10111111` | `BF` | instruction: MOV DI,789C, byte 1/3 | Pixel x=156, y=96: 96 times 320 plus 156. |
| 56 | `10011100` | `9C` | instruction: MOV DI,789C, byte 2/3 | Pixel x=156, y=96: 96 times 320 plus 156. |
| 57 | `01111000` | `78` | instruction: MOV DI,789C, byte 3/3 | Pixel x=156, y=96: 96 times 320 plus 156. |
| 58 | `10111011` | `BB` | instruction: MOV BX,0008, byte 1/3 | Eight bitmap rows; initialize both bytes of BX. |
| 59 | `00001000` | `08` | instruction: MOV BX,0008, byte 2/3 | Eight bitmap rows; initialize both bytes of BX. |
| 60 | `00000000` | `00` | instruction: MOV BX,0008, byte 3/3 | Eight bitmap rows; initialize both bytes of BX. |
| 61 | `10111001` | `B9` | instruction: MOV CX,0008, byte 1/3 | Row loop at offset 61 copies eight authored pixel indices. |
| 62 | `00001000` | `08` | instruction: MOV CX,0008, byte 2/3 | Row loop at offset 61 copies eight authored pixel indices. |
| 63 | `00000000` | `00` | instruction: MOV CX,0008, byte 3/3 | Row loop at offset 61 copies eight authored pixel indices. |
| 64 | `11110011` | `F3` | instruction: REP MOVSB, byte 1/2 | Copy eight bytes from DS:SI to ES:DI; no generated pixel values. |
| 65 | `10100100` | `A4` | instruction: REP MOVSB, byte 2/2 | Copy eight bytes from DS:SI to ES:DI; no generated pixel values. |
| 66 | `10000001` | `81` | instruction: ADD DI,0138, byte 1/4 | Advance 312 more bytes to the next 320-byte framebuffer row. |
| 67 | `11000111` | `C7` | instruction: ADD DI,0138, byte 2/4 | Advance 312 more bytes to the next 320-byte framebuffer row. |
| 68 | `00111000` | `38` | instruction: ADD DI,0138, byte 3/4 | Advance 312 more bytes to the next 320-byte framebuffer row. |
| 69 | `00000001` | `01` | instruction: ADD DI,0138, byte 4/4 | Advance 312 more bytes to the next 320-byte framebuffer row. |
| 70 | `11111110` | `FE` | instruction: DEC BL, byte 1/2 | Count the completed bitmap row. |
| 71 | `11001011` | `CB` | instruction: DEC BL, byte 2/2 | Count the completed bitmap row. |
| 72 | `01110101` | `75` | instruction: JNZ -13, byte 1/2 | Offset 72: next offset 74 minus 13 returns to row loop 61. |
| 73 | `11110011` | `F3` | instruction: JNZ -13, byte 2/2 | Offset 72: next offset 74 minus 13 returns to row loop 61. |
| 74 | `11111010` | `FA` | instruction: CLI, byte 1/1 | Keep the finished native framebuffer still. |
| 75 | `11110100` | `F4` | instruction: HLT, byte 1/1 | Halt at offset 75; sampled instruction pointer is 7C4C. |
| 76 | `11101011` | `EB` | instruction: JMP -3, byte 1/2 | Return to HLT if execution resumes. |
| 77 | `11111101` | `FD` | instruction: JMP -3, byte 2/2 | Return to HLT if execution resumes. |
| 78 | `00000000` | `00` | data: bitmap row 0, byte 1/8 | 01000000: the upper stem, palette indices zero or ten. |
| 79 | `00001010` | `0A` | data: bitmap row 0, byte 2/8 | 01000000: the upper stem, palette indices zero or ten. |
| 80 | `00000000` | `00` | data: bitmap row 0, byte 3/8 | 01000000: the upper stem, palette indices zero or ten. |
| 81 | `00000000` | `00` | data: bitmap row 0, byte 4/8 | 01000000: the upper stem, palette indices zero or ten. |
| 82 | `00000000` | `00` | data: bitmap row 0, byte 5/8 | 01000000: the upper stem, palette indices zero or ten. |
| 83 | `00000000` | `00` | data: bitmap row 0, byte 6/8 | 01000000: the upper stem, palette indices zero or ten. |
| 84 | `00000000` | `00` | data: bitmap row 0, byte 7/8 | 01000000: the upper stem, palette indices zero or ten. |
| 85 | `00000000` | `00` | data: bitmap row 0, byte 8/8 | 01000000: the upper stem, palette indices zero or ten. |
| 86 | `00000000` | `00` | data: bitmap row 1, byte 1/8 | 01000000. |
| 87 | `00001010` | `0A` | data: bitmap row 1, byte 2/8 | 01000000. |
| 88 | `00000000` | `00` | data: bitmap row 1, byte 3/8 | 01000000. |
| 89 | `00000000` | `00` | data: bitmap row 1, byte 4/8 | 01000000. |
| 90 | `00000000` | `00` | data: bitmap row 1, byte 5/8 | 01000000. |
| 91 | `00000000` | `00` | data: bitmap row 1, byte 6/8 | 01000000. |
| 92 | `00000000` | `00` | data: bitmap row 1, byte 7/8 | 01000000. |
| 93 | `00000000` | `00` | data: bitmap row 1, byte 8/8 | 01000000. |
| 94 | `00000000` | `00` | data: bitmap row 2, byte 1/8 | 01111000: top of the bowl. |
| 95 | `00001010` | `0A` | data: bitmap row 2, byte 2/8 | 01111000: top of the bowl. |
| 96 | `00001010` | `0A` | data: bitmap row 2, byte 3/8 | 01111000: top of the bowl. |
| 97 | `00001010` | `0A` | data: bitmap row 2, byte 4/8 | 01111000: top of the bowl. |
| 98 | `00001010` | `0A` | data: bitmap row 2, byte 5/8 | 01111000: top of the bowl. |
| 99 | `00000000` | `00` | data: bitmap row 2, byte 6/8 | 01111000: top of the bowl. |
| 100 | `00000000` | `00` | data: bitmap row 2, byte 7/8 | 01111000: top of the bowl. |
| 101 | `00000000` | `00` | data: bitmap row 2, byte 8/8 | 01111000: top of the bowl. |
| 102 | `00000000` | `00` | data: bitmap row 3, byte 1/8 | 01000100. |
| 103 | `00001010` | `0A` | data: bitmap row 3, byte 2/8 | 01000100. |
| 104 | `00000000` | `00` | data: bitmap row 3, byte 3/8 | 01000100. |
| 105 | `00000000` | `00` | data: bitmap row 3, byte 4/8 | 01000100. |
| 106 | `00000000` | `00` | data: bitmap row 3, byte 5/8 | 01000100. |
| 107 | `00001010` | `0A` | data: bitmap row 3, byte 6/8 | 01000100. |
| 108 | `00000000` | `00` | data: bitmap row 3, byte 7/8 | 01000100. |
| 109 | `00000000` | `00` | data: bitmap row 3, byte 8/8 | 01000100. |
| 110 | `00000000` | `00` | data: bitmap row 4, byte 1/8 | 01000100. |
| 111 | `00001010` | `0A` | data: bitmap row 4, byte 2/8 | 01000100. |
| 112 | `00000000` | `00` | data: bitmap row 4, byte 3/8 | 01000100. |
| 113 | `00000000` | `00` | data: bitmap row 4, byte 4/8 | 01000100. |
| 114 | `00000000` | `00` | data: bitmap row 4, byte 5/8 | 01000100. |
| 115 | `00001010` | `0A` | data: bitmap row 4, byte 6/8 | 01000100. |
| 116 | `00000000` | `00` | data: bitmap row 4, byte 7/8 | 01000100. |
| 117 | `00000000` | `00` | data: bitmap row 4, byte 8/8 | 01000100. |
| 118 | `00000000` | `00` | data: bitmap row 5, byte 1/8 | 01000100. |
| 119 | `00001010` | `0A` | data: bitmap row 5, byte 2/8 | 01000100. |
| 120 | `00000000` | `00` | data: bitmap row 5, byte 3/8 | 01000100. |
| 121 | `00000000` | `00` | data: bitmap row 5, byte 4/8 | 01000100. |
| 122 | `00000000` | `00` | data: bitmap row 5, byte 5/8 | 01000100. |
| 123 | `00001010` | `0A` | data: bitmap row 5, byte 6/8 | 01000100. |
| 124 | `00000000` | `00` | data: bitmap row 5, byte 7/8 | 01000100. |
| 125 | `00000000` | `00` | data: bitmap row 5, byte 8/8 | 01000100. |
| 126 | `00000000` | `00` | data: bitmap row 6, byte 1/8 | 01111000: bottom of the bowl. |
| 127 | `00001010` | `0A` | data: bitmap row 6, byte 2/8 | 01111000: bottom of the bowl. |
| 128 | `00001010` | `0A` | data: bitmap row 6, byte 3/8 | 01111000: bottom of the bowl. |
| 129 | `00001010` | `0A` | data: bitmap row 6, byte 4/8 | 01111000: bottom of the bowl. |
| 130 | `00001010` | `0A` | data: bitmap row 6, byte 5/8 | 01111000: bottom of the bowl. |
| 131 | `00000000` | `00` | data: bitmap row 6, byte 6/8 | 01111000: bottom of the bowl. |
| 132 | `00000000` | `00` | data: bitmap row 6, byte 7/8 | 01111000: bottom of the bowl. |
| 133 | `00000000` | `00` | data: bitmap row 6, byte 8/8 | 01111000: bottom of the bowl. |
| 134 | `00000000` | `00` | data: bitmap row 7, byte 1/8 | 00000000: empty final row. |
| 135 | `00000000` | `00` | data: bitmap row 7, byte 2/8 | 00000000: empty final row. |
| 136 | `00000000` | `00` | data: bitmap row 7, byte 3/8 | 00000000: empty final row. |
| 137 | `00000000` | `00` | data: bitmap row 7, byte 4/8 | 00000000: empty final row. |
| 138 | `00000000` | `00` | data: bitmap row 7, byte 5/8 | 00000000: empty final row. |
| 139 | `00000000` | `00` | data: bitmap row 7, byte 6/8 | 00000000: empty final row. |
| 140 | `00000000` | `00` | data: bitmap row 7, byte 7/8 | 00000000: empty final row. |
| 141 | `00000000` | `00` | data: bitmap row 7, byte 8/8 | 00000000: empty final row. |
