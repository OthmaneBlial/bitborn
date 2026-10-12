# Every byte explained

Generated from canonical `.bits` annotations by `python3 tools/byte_tables.py`.

Instruction names below are disassembly for explanation, never code-generation input.

| Offset | Binary | Hex | Range / byte within it | Encoding explanation |
| --- | --- | --- | --- | --- |
| 0 | `10111000` | `B8` | instruction: MOV AX,0003, byte 1/3 | B8 selects BIOS VGA text mode. |
| 1 | `00000011` | `03` | instruction: MOV AX,0003, byte 2/3 | B8 selects BIOS VGA text mode. |
| 2 | `00000000` | `00` | instruction: MOV AX,0003, byte 3/3 | B8 selects BIOS VGA text mode. |
| 3 | `11001101` | `CD` | instruction: INT 10, byte 1/2 | CD 10 clears and configures the display. |
| 4 | `00010000` | `10` | instruction: INT 10, byte 2/2 | CD 10 clears and configures the display. |
| 5 | `10111010` | `BA` | instruction: MOV DX,03F9, byte 1/3 | BA selects UART interrupt-enable port. |
| 6 | `11111001` | `F9` | instruction: MOV DX,03F9, byte 2/3 | BA selects UART interrupt-enable port. |
| 7 | `00000011` | `03` | instruction: MOV DX,03F9, byte 3/3 | BA selects UART interrupt-enable port. |
| 8 | `10110000` | `B0` | instruction: MOV AL,00, byte 1/2 | B0 disables serial interrupts. |
| 9 | `00000000` | `00` | instruction: MOV AL,00, byte 2/2 | B0 disables serial interrupts. |
| 10 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | EE writes UART interrupt enable. |
| 11 | `10111010` | `BA` | instruction: MOV DX,03FB, byte 1/3 | BA selects UART line control. |
| 12 | `11111011` | `FB` | instruction: MOV DX,03FB, byte 2/3 | BA selects UART line control. |
| 13 | `00000011` | `03` | instruction: MOV DX,03FB, byte 3/3 | BA selects UART line control. |
| 14 | `10110000` | `B0` | instruction: MOV AL,80, byte 1/2 | B0 enables divisor latch. |
| 15 | `10000000` | `80` | instruction: MOV AL,80, byte 2/2 | B0 enables divisor latch. |
| 16 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | EE sets DLAB. |
| 17 | `10111010` | `BA` | instruction: MOV DX,03F8, byte 1/3 | BA selects divisor low-byte register. |
| 18 | `11111000` | `F8` | instruction: MOV DX,03F8, byte 2/3 | BA selects divisor low-byte register. |
| 19 | `00000011` | `03` | instruction: MOV DX,03F8, byte 3/3 | BA selects divisor low-byte register. |
| 20 | `10110000` | `B0` | instruction: MOV AL,01, byte 1/2 | B0 sets divisor one, 115200 baud. |
| 21 | `00000001` | `01` | instruction: MOV AL,01, byte 2/2 | B0 sets divisor one, 115200 baud. |
| 22 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | EE writes divisor low byte. |
| 23 | `01000010` | `42` | instruction: INC DX, byte 1/1 | 42 advances to divisor high-byte port. |
| 24 | `10110000` | `B0` | instruction: MOV AL,00, byte 1/2 | B0 clears divisor high byte. |
| 25 | `00000000` | `00` | instruction: MOV AL,00, byte 2/2 | B0 clears divisor high byte. |
| 26 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | EE writes divisor high byte. |
| 27 | `10111010` | `BA` | instruction: MOV DX,03FB, byte 1/3 | BA selects UART line control again. |
| 28 | `11111011` | `FB` | instruction: MOV DX,03FB, byte 2/3 | BA selects UART line control again. |
| 29 | `00000011` | `03` | instruction: MOV DX,03FB, byte 3/3 | BA selects UART line control again. |
| 30 | `10110000` | `B0` | instruction: MOV AL,03, byte 1/2 | B0 selects 8N1, clearing divisor access. |
| 31 | `00000011` | `03` | instruction: MOV AL,03, byte 2/2 | B0 selects 8N1, clearing divisor access. |
| 32 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | EE configures UART framing. |
| 33 | `10111110` | `BE` | instruction: MOV SI,7F3E, byte 1/3 | BE loads welcome text at stage offset 318. |
| 34 | `00111110` | `3E` | instruction: MOV SI,7F3E, byte 2/3 | BE loads welcome text at stage offset 318. |
| 35 | `01111111` | `7F` | instruction: MOV SI,7F3E, byte 3/3 | BE loads welcome text at stage offset 318. |
| 36 | `11101000` | `E8` | instruction: CALL puts, byte 1/3 | E8 rel16; next offset 39 + 208 = puts at 247. |
| 37 | `11010000` | `D0` | instruction: CALL puts, byte 2/3 | E8 rel16; next offset 39 + 208 = puts at 247. |
| 38 | `00000000` | `00` | instruction: CALL puts, byte 3/3 | E8 rel16; next offset 39 + 208 = puts at 247. |
| 39 | `10111110` | `BE` | instruction: MOV SI,7F50, byte 1/3 | BE loads the prompt at offset 336. |
| 40 | `01010000` | `50` | instruction: MOV SI,7F50, byte 2/3 | BE loads the prompt at offset 336. |
| 41 | `01111111` | `7F` | instruction: MOV SI,7F50, byte 3/3 | BE loads the prompt at offset 336. |
| 42 | `11101000` | `E8` | instruction: CALL puts, byte 1/3 | E8; next offset 45 + 202 = 247. |
| 43 | `11001010` | `CA` | instruction: CALL puts, byte 2/3 | E8; next offset 45 + 202 = 247. |
| 44 | `00000000` | `00` | instruction: CALL puts, byte 3/3 | E8; next offset 45 + 202 = 247. |
| 45 | `10111111` | `BF` | instruction: MOV DI,8200, byte 1/3 | BF selects a 16-byte command buffer beyond the loaded sectors. |
| 46 | `00000000` | `00` | instruction: MOV DI,8200, byte 2/3 | BF selects a 16-byte command buffer beyond the loaded sectors. |
| 47 | `10000010` | `82` | instruction: MOV DI,8200, byte 3/3 | BF selects a 16-byte command buffer beyond the loaded sectors. |
| 48 | `00110001` | `31` | instruction: XOR CX,CX, byte 1/2 | 31 C9 clears command length. |
| 49 | `11001001` | `C9` | instruction: XOR CX,CX, byte 2/2 | 31 C9 clears command length. |
| 50 | `00110001` | `31` | instruction: XOR AX,AX, byte 1/2 | 31 C0 selects BIOS keyboard service zero. |
| 51 | `11000000` | `C0` | instruction: XOR AX,AX, byte 2/2 | 31 C0 selects BIOS keyboard service zero. |
| 52 | `11001101` | `CD` | instruction: INT 16, byte 1/2 | CD 16 waits for a real BIOS keyboard character. |
| 53 | `00010110` | `16` | instruction: INT 16, byte 2/2 | CD 16 waits for a real BIOS keyboard character. |
| 54 | `00111100` | `3C` | instruction: CMP AL,0D, byte 1/2 | 3C compares the character with carriage return. |
| 55 | `00001101` | `0D` | instruction: CMP AL,0D, byte 2/2 | 3C compares the character with carriage return. |
| 56 | `01110100` | `74` | instruction: JE dispatch, byte 1/2 | 74 rel8; next offset 58 + 47 = 105. |
| 57 | `00101111` | `2F` | instruction: JE dispatch, byte 2/2 | 74 rel8; next offset 58 + 47 = 105. |
| 58 | `00111100` | `3C` | instruction: CMP AL,08, byte 1/2 | 3C checks the backspace character. |
| 59 | `00001000` | `08` | instruction: CMP AL,08, byte 2/2 | 3C checks the backspace character. |
| 60 | `01110100` | `74` | instruction: JE backspace, byte 1/2 | 74; next offset 62 + 20 = 82. |
| 61 | `00010100` | `14` | instruction: JE backspace, byte 2/2 | 74; next offset 62 + 20 = 82. |
| 62 | `00111100` | `3C` | instruction: CMP AL,20, byte 1/2 | 3C rejects control characters below ASCII space. |
| 63 | `00100000` | `20` | instruction: CMP AL,20, byte 2/2 | 3C rejects control characters below ASCII space. |
| 64 | `01110010` | `72` | instruction: JB read, byte 1/2 | 72; next offset 66 minus 16 = 50. |
| 65 | `11110000` | `F0` | instruction: JB read, byte 2/2 | 72; next offset 66 minus 16 = 50. |
| 66 | `00111100` | `3C` | instruction: CMP AL,7E, byte 1/2 | 3C restricts input to printable ASCII. |
| 67 | `01111110` | `7E` | instruction: CMP AL,7E, byte 2/2 | 3C restricts input to printable ASCII. |
| 68 | `01110111` | `77` | instruction: JA read, byte 1/2 | 77; next offset 70 minus 20 = 50. |
| 69 | `11101100` | `EC` | instruction: JA read, byte 2/2 | 77; next offset 70 minus 20 = 50. |
| 70 | `10000011` | `83` | instruction: CMP CX,15, byte 1/3 | 83 /7, F9 selects CX; reserve one of sixteen bytes for NUL. |
| 71 | `11111001` | `F9` | instruction: CMP CX,15, byte 2/3 | 83 /7, F9 selects CX; reserve one of sixteen bytes for NUL. |
| 72 | `00001111` | `0F` | instruction: CMP CX,15, byte 3/3 | 83 /7, F9 selects CX; reserve one of sixteen bytes for NUL. |
| 73 | `01110011` | `73` | instruction: JAE read, byte 1/2 | 73; next offset 75 minus 25 = 50; ignore characters at the bound. |
| 74 | `11100111` | `E7` | instruction: JAE read, byte 2/2 | 73; next offset 75 minus 25 = 50; ignore characters at the bound. |
| 75 | `10101010` | `AA` | instruction: STOSB, byte 1/1 | AA writes AL to ES:DI and advances DI. |
| 76 | `01000001` | `41` | instruction: INC CX, byte 1/1 | 41 increments the bounded input length in 16-bit mode. |
| 77 | `11101000` | `E8` | instruction: CALL putc, byte 1/3 | E8; next offset 80 + 178 = character output at 258. |
| 78 | `10110010` | `B2` | instruction: CALL putc, byte 2/3 | E8; next offset 80 + 178 = character output at 258. |
| 79 | `00000000` | `00` | instruction: CALL putc, byte 3/3 | E8; next offset 80 + 178 = character output at 258. |
| 80 | `11101011` | `EB` | instruction: JMP read, byte 1/2 | EB; next offset 82 minus 32 = 50. |
| 81 | `11100000` | `E0` | instruction: JMP read, byte 2/2 | EB; next offset 82 minus 32 = 50. |
| 82 | `10000101` | `85` | instruction: TEST CX,CX, byte 1/2 | 85 C9 prevents backspace before the buffer starts. |
| 83 | `11001001` | `C9` | instruction: TEST CX,CX, byte 2/2 | 85 C9 prevents backspace before the buffer starts. |
| 84 | `01110100` | `74` | instruction: JZ read, byte 1/2 | 74; next offset 86 minus 36 = 50. |
| 85 | `11011100` | `DC` | instruction: JZ read, byte 2/2 | 74; next offset 86 minus 36 = 50. |
| 86 | `01001111` | `4F` | instruction: DEC DI, byte 1/1 | 4F retreats the write pointer by one byte. |
| 87 | `01001001` | `49` | instruction: DEC CX, byte 1/1 | 49 decrements input length. |
| 88 | `10110000` | `B0` | instruction: MOV AL,08, byte 1/2 | B0 loads backspace for cursor movement. |
| 89 | `00001000` | `08` | instruction: MOV AL,08, byte 2/2 | B0 loads backspace for cursor movement. |
| 90 | `11101000` | `E8` | instruction: CALL putc, byte 1/3 | E8; next offset 93 + 165 = 258. |
| 91 | `10100101` | `A5` | instruction: CALL putc, byte 2/3 | E8; next offset 93 + 165 = 258. |
| 92 | `00000000` | `00` | instruction: CALL putc, byte 3/3 | E8; next offset 93 + 165 = 258. |
| 93 | `10110000` | `B0` | instruction: MOV AL,20, byte 1/2 | B0 loads a space to erase the character. |
| 94 | `00100000` | `20` | instruction: MOV AL,20, byte 2/2 | B0 loads a space to erase the character. |
| 95 | `11101000` | `E8` | instruction: CALL putc, byte 1/3 | E8; next offset 98 + 160 = 258. |
| 96 | `10100000` | `A0` | instruction: CALL putc, byte 2/3 | E8; next offset 98 + 160 = 258. |
| 97 | `00000000` | `00` | instruction: CALL putc, byte 3/3 | E8; next offset 98 + 160 = 258. |
| 98 | `10110000` | `B0` | instruction: MOV AL,08, byte 1/2 | B0 loads backspace to restore the erased cursor position. |
| 99 | `00001000` | `08` | instruction: MOV AL,08, byte 2/2 | B0 loads backspace to restore the erased cursor position. |
| 100 | `11101000` | `E8` | instruction: CALL putc, byte 1/3 | E8; next offset 103 + 155 = 258. |
| 101 | `10011011` | `9B` | instruction: CALL putc, byte 2/3 | E8; next offset 103 + 155 = 258. |
| 102 | `00000000` | `00` | instruction: CALL putc, byte 3/3 | E8; next offset 103 + 155 = 258. |
| 103 | `11101011` | `EB` | instruction: JMP read, byte 1/2 | EB; next offset 105 minus 55 = 50. |
| 104 | `11001001` | `C9` | instruction: JMP read, byte 2/2 | EB; next offset 105 minus 55 = 50. |
| 105 | `00110000` | `30` | instruction: XOR AL,AL, byte 1/2 | 30 C0 creates the command terminator. |
| 106 | `11000000` | `C0` | instruction: XOR AL,AL, byte 2/2 | 30 C0 creates the command terminator. |
| 107 | `10101010` | `AA` | instruction: STOSB, byte 1/1 | AA appends NUL within the bounded buffer. |
| 108 | `10111110` | `BE` | instruction: MOV SI,7F53, byte 1/3 | BE loads CR LF at offset 339. |
| 109 | `01010011` | `53` | instruction: MOV SI,7F53, byte 2/3 | BE loads CR LF at offset 339. |
| 110 | `01111111` | `7F` | instruction: MOV SI,7F53, byte 3/3 | BE loads CR LF at offset 339. |
| 111 | `11101000` | `E8` | instruction: CALL puts, byte 1/3 | E8; next offset 114 + 133 = 247. |
| 112 | `10000101` | `85` | instruction: CALL puts, byte 2/3 | E8; next offset 114 + 133 = 247. |
| 113 | `00000000` | `00` | instruction: CALL puts, byte 3/3 | E8; next offset 114 + 133 = 247. |
| 114 | `10111110` | `BE` | instruction: MOV SI,7F56, byte 1/3 | BE loads exact command help at offset 342. |
| 115 | `01010110` | `56` | instruction: MOV SI,7F56, byte 2/3 | BE loads exact command help at offset 342. |
| 116 | `01111111` | `7F` | instruction: MOV SI,7F56, byte 3/3 | BE loads exact command help at offset 342. |
| 117 | `11101000` | `E8` | instruction: CALL equal, byte 1/3 | E8; next offset 120 + 105 = string comparison at 225. |
| 118 | `01101001` | `69` | instruction: CALL equal, byte 2/3 | E8; next offset 120 + 105 = string comparison at 225. |
| 119 | `00000000` | `00` | instruction: CALL equal, byte 3/3 | E8; next offset 120 + 105 = string comparison at 225. |
| 120 | `10000100` | `84` | instruction: TEST AL,AL, byte 1/2 | 84 C0 tests the Boolean equality result. |
| 121 | `11000000` | `C0` | instruction: TEST AL,AL, byte 2/2 | 84 C0 tests the Boolean equality result. |
| 122 | `01110100` | `74` | instruction: JZ try_clear, byte 1/2 | 74; next offset 124 + 9 = 133. |
| 123 | `00001001` | `09` | instruction: JZ try_clear, byte 2/2 | 74; next offset 124 + 9 = 133. |
| 124 | `10111110` | `BE` | instruction: MOV SI,7F73, byte 1/3 | BE loads help text at offset 371. |
| 125 | `01110011` | `73` | instruction: MOV SI,7F73, byte 2/3 | BE loads help text at offset 371. |
| 126 | `01111111` | `7F` | instruction: MOV SI,7F73, byte 3/3 | BE loads help text at offset 371. |
| 127 | `11101000` | `E8` | instruction: CALL puts, byte 1/3 | E8; next offset 130 + 117 = 247. |
| 128 | `01110101` | `75` | instruction: CALL puts, byte 2/3 | E8; next offset 130 + 117 = 247. |
| 129 | `00000000` | `00` | instruction: CALL puts, byte 3/3 | E8; next offset 130 + 117 = 247. |
| 130 | `11101001` | `E9` | instruction: JMP prompt, byte 1/3 | E9 rel16; next offset 133 minus 94 = 39. |
| 131 | `10100010` | `A2` | instruction: JMP prompt, byte 2/3 | E9 rel16; next offset 133 minus 94 = 39. |
| 132 | `11111111` | `FF` | instruction: JMP prompt, byte 3/3 | E9 rel16; next offset 133 minus 94 = 39. |
| 133 | `10111110` | `BE` | instruction: MOV SI,7F5B, byte 1/3 | BE loads exact command clear at offset 347. |
| 134 | `01011011` | `5B` | instruction: MOV SI,7F5B, byte 2/3 | BE loads exact command clear at offset 347. |
| 135 | `01111111` | `7F` | instruction: MOV SI,7F5B, byte 3/3 | BE loads exact command clear at offset 347. |
| 136 | `11101000` | `E8` | instruction: CALL equal, byte 1/3 | E8; next offset 139 + 86 = 225. |
| 137 | `01010110` | `56` | instruction: CALL equal, byte 2/3 | E8; next offset 139 + 86 = 225. |
| 138 | `00000000` | `00` | instruction: CALL equal, byte 3/3 | E8; next offset 139 + 86 = 225. |
| 139 | `10000100` | `84` | instruction: TEST AL,AL, byte 1/2 | 84 C0 tests command equality. |
| 140 | `11000000` | `C0` | instruction: TEST AL,AL, byte 2/2 | 84 C0 tests command equality. |
| 141 | `01110100` | `74` | instruction: JZ try_about, byte 1/2 | 74; next offset 143 + 8 = 151. |
| 142 | `00001000` | `08` | instruction: JZ try_about, byte 2/2 | 74; next offset 143 + 8 = 151. |
| 143 | `10111000` | `B8` | instruction: MOV AX,0003, byte 1/3 | B8 selects VGA mode three to clear the screen. |
| 144 | `00000011` | `03` | instruction: MOV AX,0003, byte 2/3 | B8 selects VGA mode three to clear the screen. |
| 145 | `00000000` | `00` | instruction: MOV AX,0003, byte 3/3 | B8 selects VGA mode three to clear the screen. |
| 146 | `11001101` | `CD` | instruction: INT 10, byte 1/2 | CD 10 resets the VGA screen; serial history remains a transcript. |
| 147 | `00010000` | `10` | instruction: INT 10, byte 2/2 | CD 10 resets the VGA screen; serial history remains a transcript. |
| 148 | `11101001` | `E9` | instruction: JMP prompt, byte 1/3 | E9; next offset 151 minus 112 = 39. |
| 149 | `10010000` | `90` | instruction: JMP prompt, byte 2/3 | E9; next offset 151 minus 112 = 39. |
| 150 | `11111111` | `FF` | instruction: JMP prompt, byte 3/3 | E9; next offset 151 minus 112 = 39. |
| 151 | `10111110` | `BE` | instruction: MOV SI,7F61, byte 1/3 | BE loads exact command about at offset 353. |
| 152 | `01100001` | `61` | instruction: MOV SI,7F61, byte 2/3 | BE loads exact command about at offset 353. |
| 153 | `01111111` | `7F` | instruction: MOV SI,7F61, byte 3/3 | BE loads exact command about at offset 353. |
| 154 | `11101000` | `E8` | instruction: CALL equal, byte 1/3 | E8; next offset 157 + 68 = 225. |
| 155 | `01000100` | `44` | instruction: CALL equal, byte 2/3 | E8; next offset 157 + 68 = 225. |
| 156 | `00000000` | `00` | instruction: CALL equal, byte 3/3 | E8; next offset 157 + 68 = 225. |
| 157 | `10000100` | `84` | instruction: TEST AL,AL, byte 1/2 | 84 C0 tests command equality. |
| 158 | `11000000` | `C0` | instruction: TEST AL,AL, byte 2/2 | 84 C0 tests command equality. |
| 159 | `01110100` | `74` | instruction: JZ try_reboot, byte 1/2 | 74; next offset 161 + 9 = 170. |
| 160 | `00001001` | `09` | instruction: JZ try_reboot, byte 2/2 | 74; next offset 161 + 9 = 170. |
| 161 | `10111110` | `BE` | instruction: MOV SI,7F92, byte 1/3 | BE loads about text at offset 402. |
| 162 | `10010010` | `92` | instruction: MOV SI,7F92, byte 2/3 | BE loads about text at offset 402. |
| 163 | `01111111` | `7F` | instruction: MOV SI,7F92, byte 3/3 | BE loads about text at offset 402. |
| 164 | `11101000` | `E8` | instruction: CALL puts, byte 1/3 | E8; next offset 167 + 80 = 247. |
| 165 | `01010000` | `50` | instruction: CALL puts, byte 2/3 | E8; next offset 167 + 80 = 247. |
| 166 | `00000000` | `00` | instruction: CALL puts, byte 3/3 | E8; next offset 167 + 80 = 247. |
| 167 | `11101001` | `E9` | instruction: JMP prompt, byte 1/3 | E9; next offset 170 minus 131 = 39. |
| 168 | `01111101` | `7D` | instruction: JMP prompt, byte 2/3 | E9; next offset 170 minus 131 = 39. |
| 169 | `11111111` | `FF` | instruction: JMP prompt, byte 3/3 | E9; next offset 170 minus 131 = 39. |
| 170 | `10111110` | `BE` | instruction: MOV SI,7F67, byte 1/3 | BE loads exact command reboot at offset 359. |
| 171 | `01100111` | `67` | instruction: MOV SI,7F67, byte 2/3 | BE loads exact command reboot at offset 359. |
| 172 | `01111111` | `7F` | instruction: MOV SI,7F67, byte 3/3 | BE loads exact command reboot at offset 359. |
| 173 | `11101000` | `E8` | instruction: CALL equal, byte 1/3 | E8; next offset 176 + 49 = 225. |
| 174 | `00110001` | `31` | instruction: CALL equal, byte 2/3 | E8; next offset 176 + 49 = 225. |
| 175 | `00000000` | `00` | instruction: CALL equal, byte 3/3 | E8; next offset 176 + 49 = 225. |
| 176 | `10000100` | `84` | instruction: TEST AL,AL, byte 1/2 | 84 C0 tests command equality. |
| 177 | `11000000` | `C0` | instruction: TEST AL,AL, byte 2/2 | 84 C0 tests command equality. |
| 178 | `01110100` | `74` | instruction: JZ try_peek, byte 1/2 | 74; next offset 180 + 5 = 185. |
| 179 | `00000101` | `05` | instruction: JZ try_peek, byte 2/2 | 74; next offset 180 + 5 = 185. |
| 180 | `11001101` | `CD` | instruction: INT 19, byte 1/2 | CD 19 invokes legacy BIOS bootstrap to reload the boot disk. |
| 181 | `00011001` | `19` | instruction: INT 19, byte 2/2 | CD 19 invokes legacy BIOS bootstrap to reload the boot disk. |
| 182 | `11101001` | `E9` | instruction: JMP prompt, byte 1/3 | E9; next offset 185 minus 146 = 39 if BIOS bootstrap returns. |
| 183 | `01101110` | `6E` | instruction: JMP prompt, byte 2/3 | E9; next offset 185 minus 146 = 39 if BIOS bootstrap returns. |
| 184 | `11111111` | `FF` | instruction: JMP prompt, byte 3/3 | E9; next offset 185 minus 146 = 39 if BIOS bootstrap returns. |
| 185 | `10111110` | `BE` | instruction: MOV SI,7F6E, byte 1/3 | BE loads exact command peek at offset 366. |
| 186 | `01101110` | `6E` | instruction: MOV SI,7F6E, byte 2/3 | BE loads exact command peek at offset 366. |
| 187 | `01111111` | `7F` | instruction: MOV SI,7F6E, byte 3/3 | BE loads exact command peek at offset 366. |
| 188 | `11101000` | `E8` | instruction: CALL equal, byte 1/3 | E8; next offset 191 + 34 = 225. |
| 189 | `00100010` | `22` | instruction: CALL equal, byte 2/3 | E8; next offset 191 + 34 = 225. |
| 190 | `00000000` | `00` | instruction: CALL equal, byte 3/3 | E8; next offset 191 + 34 = 225. |
| 191 | `10000100` | `84` | instruction: TEST AL,AL, byte 1/2 | 84 C0 tests command equality. |
| 192 | `11000000` | `C0` | instruction: TEST AL,AL, byte 2/2 | 84 C0 tests command equality. |
| 193 | `01110100` | `74` | instruction: JZ unknown, byte 1/2 | 74; next offset 195 + 21 = 216. |
| 194 | `00010101` | `15` | instruction: JZ unknown, byte 2/2 | 74; next offset 195 + 21 = 216. |
| 195 | `10111110` | `BE` | instruction: MOV SI,7FB5, byte 1/3 | BE loads the fixed memory label at offset 437. |
| 196 | `10110101` | `B5` | instruction: MOV SI,7FB5, byte 2/3 | BE loads the fixed memory label at offset 437. |
| 197 | `01111111` | `7F` | instruction: MOV SI,7FB5, byte 3/3 | BE loads the fixed memory label at offset 437. |
| 198 | `11101000` | `E8` | instruction: CALL puts, byte 1/3 | E8; next offset 201 + 46 = 247. |
| 199 | `00101110` | `2E` | instruction: CALL puts, byte 2/3 | E8; next offset 201 + 46 = 247. |
| 200 | `00000000` | `00` | instruction: CALL puts, byte 3/3 | E8; next offset 201 + 46 = 247. |
| 201 | `10100000` | `A0` | instruction: MOV AL,[7C00], byte 1/3 | A0 moffs16 loads the real first byte of the boot sector from memory, not a hardcoded answer. |
| 202 | `00000000` | `00` | instruction: MOV AL,[7C00], byte 2/3 | A0 moffs16 loads the real first byte of the boot sector from memory, not a hardcoded answer. |
| 203 | `01111100` | `7C` | instruction: MOV AL,[7C00], byte 3/3 | A0 moffs16 loads the real first byte of the boot sector from memory, not a hardcoded answer. |
| 204 | `11101000` | `E8` | instruction: CALL hex, byte 1/3 | E8; next offset 207 + 87 = byte-to-hex at 294. |
| 205 | `01010111` | `57` | instruction: CALL hex, byte 2/3 | E8; next offset 207 + 87 = byte-to-hex at 294. |
| 206 | `00000000` | `00` | instruction: CALL hex, byte 3/3 | E8; next offset 207 + 87 = byte-to-hex at 294. |
| 207 | `10111110` | `BE` | instruction: MOV SI,7F53, byte 1/3 | BE loads the newline string. |
| 208 | `01010011` | `53` | instruction: MOV SI,7F53, byte 2/3 | BE loads the newline string. |
| 209 | `01111111` | `7F` | instruction: MOV SI,7F53, byte 3/3 | BE loads the newline string. |
| 210 | `11101000` | `E8` | instruction: CALL puts, byte 1/3 | E8; next offset 213 + 34 = 247. |
| 211 | `00100010` | `22` | instruction: CALL puts, byte 2/3 | E8; next offset 213 + 34 = 247. |
| 212 | `00000000` | `00` | instruction: CALL puts, byte 3/3 | E8; next offset 213 + 34 = 247. |
| 213 | `11101001` | `E9` | instruction: JMP prompt, byte 1/3 | E9; next offset 216 minus 177 = 39. |
| 214 | `01001111` | `4F` | instruction: JMP prompt, byte 2/3 | E9; next offset 216 minus 177 = 39. |
| 215 | `11111111` | `FF` | instruction: JMP prompt, byte 3/3 | E9; next offset 216 minus 177 = 39. |
| 216 | `10111110` | `BE` | instruction: MOV SI,7FBC, byte 1/3 | BE loads unknown-command text at offset 444. |
| 217 | `10111100` | `BC` | instruction: MOV SI,7FBC, byte 2/3 | BE loads unknown-command text at offset 444. |
| 218 | `01111111` | `7F` | instruction: MOV SI,7FBC, byte 3/3 | BE loads unknown-command text at offset 444. |
| 219 | `11101000` | `E8` | instruction: CALL puts, byte 1/3 | E8; next offset 222 + 25 = 247. |
| 220 | `00011001` | `19` | instruction: CALL puts, byte 2/3 | E8; next offset 222 + 25 = 247. |
| 221 | `00000000` | `00` | instruction: CALL puts, byte 3/3 | E8; next offset 222 + 25 = 247. |
| 222 | `11101001` | `E9` | instruction: JMP prompt, byte 1/3 | E9; next offset 225 minus 186 = 39. |
| 223 | `01000110` | `46` | instruction: JMP prompt, byte 2/3 | E9; next offset 225 minus 186 = 39. |
| 224 | `11111111` | `FF` | instruction: JMP prompt, byte 3/3 | E9; next offset 225 minus 186 = 39. |
| 225 | `01010111` | `57` | instruction: PUSH DI, byte 1/1 | 57 preserves the caller's write pointer during string comparison. |
| 226 | `10111111` | `BF` | instruction: MOV DI,8200, byte 1/3 | BF points to the command buffer. |
| 227 | `00000000` | `00` | instruction: MOV DI,8200, byte 2/3 | BF points to the command buffer. |
| 228 | `10000010` | `82` | instruction: MOV DI,8200, byte 3/3 | BF points to the command buffer. |
| 229 | `10101100` | `AC` | instruction: LODSB, byte 1/1 | AC fetches the next expected command byte. |
| 230 | `00111010` | `3A` | instruction: CMP AL,[DI], byte 1/2 | 3A /r, ModR/M 05 selects AL and 16-bit memory at DS:DI. |
| 231 | `00000101` | `05` | instruction: CMP AL,[DI], byte 2/2 | 3A /r, ModR/M 05 selects AL and 16-bit memory at DS:DI. |
| 232 | `01110101` | `75` | instruction: JNE unequal, byte 1/2 | 75; next offset 234 + 9 = 243. |
| 233 | `00001001` | `09` | instruction: JNE unequal, byte 2/2 | 75; next offset 234 + 9 = 243. |
| 234 | `01000111` | `47` | instruction: INC DI, byte 1/1 | 47 advances the command-buffer comparison pointer. |
| 235 | `10000100` | `84` | instruction: TEST AL,AL, byte 1/2 | 84 C0 checks that matching included the terminating NUL. |
| 236 | `11000000` | `C0` | instruction: TEST AL,AL, byte 2/2 | 84 C0 checks that matching included the terminating NUL. |
| 237 | `01110101` | `75` | instruction: JNZ compare_next, byte 1/2 | 75; next offset 239 minus 10 = 229. |
| 238 | `11110110` | `F6` | instruction: JNZ compare_next, byte 2/2 | 75; next offset 239 minus 10 = 229. |
| 239 | `01011111` | `5F` | instruction: POP DI, byte 1/1 | 5F restores the caller's pointer. |
| 240 | `10110000` | `B0` | instruction: MOV AL,01, byte 1/2 | B0 returns true only for whole-string equality. |
| 241 | `00000001` | `01` | instruction: MOV AL,01, byte 2/2 | B0 returns true only for whole-string equality. |
| 242 | `11000011` | `C3` | instruction: RET, byte 1/1 | C3 returns to the command dispatcher. |
| 243 | `01011111` | `5F` | instruction: POP DI, byte 1/1 | 5F restores DI on the mismatch path too. |
| 244 | `00110000` | `30` | instruction: XOR AL,AL, byte 1/2 | 30 C0 returns false on any mismatched byte. |
| 245 | `11000000` | `C0` | instruction: XOR AL,AL, byte 2/2 | 30 C0 returns false on any mismatched byte. |
| 246 | `11000011` | `C3` | instruction: RET, byte 1/1 | C3 returns from unequal comparison. |
| 247 | `10101100` | `AC` | instruction: LODSB, byte 1/1 | AC fetches a string byte in puts. |
| 248 | `10000100` | `84` | instruction: TEST AL,AL, byte 1/2 | 84 C0 checks the NUL terminator. |
| 249 | `11000000` | `C0` | instruction: TEST AL,AL, byte 2/2 | 84 C0 checks the NUL terminator. |
| 250 | `01110100` | `74` | instruction: JZ puts_done, byte 1/2 | 74; next offset 252 + 5 = RET at 257. |
| 251 | `00000101` | `05` | instruction: JZ puts_done, byte 2/2 | 74; next offset 252 + 5 = RET at 257. |
| 252 | `11101000` | `E8` | instruction: CALL putc, byte 1/3 | E8; next offset 255 + 3 = 258. |
| 253 | `00000011` | `03` | instruction: CALL putc, byte 2/3 | E8; next offset 255 + 3 = 258. |
| 254 | `00000000` | `00` | instruction: CALL putc, byte 3/3 | E8; next offset 255 + 3 = 258. |
| 255 | `11101011` | `EB` | instruction: JMP puts, byte 1/2 | EB; next offset 257 minus 10 = 247. |
| 256 | `11110110` | `F6` | instruction: JMP puts, byte 2/2 | EB; next offset 257 minus 10 = 247. |
| 257 | `11000011` | `C3` | instruction: RET, byte 1/1 | C3 returns after the complete string. |
| 258 | `01010000` | `50` | instruction: PUSH AX, byte 1/1 | 50 preserves caller AX in putc. |
| 259 | `01010011` | `53` | instruction: PUSH BX, byte 1/1 | 53 preserves caller BX. |
| 260 | `01010001` | `51` | instruction: PUSH CX, byte 1/1 | 51 preserves bounded keyboard length. |
| 261 | `01010010` | `52` | instruction: PUSH DX, byte 1/1 | 52 preserves caller DX. |
| 262 | `01010110` | `56` | instruction: PUSH SI, byte 1/1 | 56 preserves string pointer across BIOS calls. |
| 263 | `01010111` | `57` | instruction: PUSH DI, byte 1/1 | 57 preserves keyboard write pointer. |
| 264 | `01010000` | `50` | instruction: PUSH AX, byte 1/1 | 50 separately saves the character during BIOS video output. |
| 265 | `10110100` | `B4` | instruction: MOV AH,0E, byte 1/2 | B4 selects BIOS teletype. |
| 266 | `00001110` | `0E` | instruction: MOV AH,0E, byte 2/2 | B4 selects BIOS teletype. |
| 267 | `10111011` | `BB` | instruction: MOV BX,0007, byte 1/3 | BB selects page zero and attribute seven. |
| 268 | `00000111` | `07` | instruction: MOV BX,0007, byte 2/3 | BB selects page zero and attribute seven. |
| 269 | `00000000` | `00` | instruction: MOV BX,0007, byte 3/3 | BB selects page zero and attribute seven. |
| 270 | `11001101` | `CD` | instruction: INT 10, byte 1/2 | CD 10 prints the character on VGA. |
| 271 | `00010000` | `10` | instruction: INT 10, byte 2/2 | CD 10 prints the character on VGA. |
| 272 | `01011000` | `58` | instruction: POP AX, byte 1/1 | 58 restores the character after BIOS output. |
| 273 | `01010000` | `50` | instruction: PUSH AX, byte 1/1 | 50 saves the character during UART polling. |
| 274 | `10111010` | `BA` | instruction: MOV DX,03FD, byte 1/3 | BA selects UART line status. |
| 275 | `11111101` | `FD` | instruction: MOV DX,03FD, byte 2/3 | BA selects UART line status. |
| 276 | `00000011` | `03` | instruction: MOV DX,03FD, byte 3/3 | BA selects UART line status. |
| 277 | `11101100` | `EC` | instruction: IN AL,DX, byte 1/1 | EC reads UART status. |
| 278 | `10101000` | `A8` | instruction: TEST AL,20, byte 1/2 | A8 tests transmitter-ready bit. |
| 279 | `00100000` | `20` | instruction: TEST AL,20, byte 2/2 | A8 tests transmitter-ready bit. |
| 280 | `01110100` | `74` | instruction: JZ serial_poll, byte 1/2 | 74 FB loops to IN, five bytes before the next instruction. |
| 281 | `11111011` | `FB` | instruction: JZ serial_poll, byte 2/2 | 74 FB loops to IN, five bytes before the next instruction. |
| 282 | `01011000` | `58` | instruction: POP AX, byte 1/1 | 58 restores the character. |
| 283 | `10111010` | `BA` | instruction: MOV DX,03F8, byte 1/3 | BA selects serial transmit port. |
| 284 | `11111000` | `F8` | instruction: MOV DX,03F8, byte 2/3 | BA selects serial transmit port. |
| 285 | `00000011` | `03` | instruction: MOV DX,03F8, byte 3/3 | BA selects serial transmit port. |
| 286 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | EE writes the character to COM1. |
| 287 | `01011111` | `5F` | instruction: POP DI, byte 1/1 | 5F restores DI. |
| 288 | `01011110` | `5E` | instruction: POP SI, byte 1/1 | 5E restores SI. |
| 289 | `01011010` | `5A` | instruction: POP DX, byte 1/1 | 5A restores DX. |
| 290 | `01011001` | `59` | instruction: POP CX, byte 1/1 | 59 restores CX. |
| 291 | `01011011` | `5B` | instruction: POP BX, byte 1/1 | 5B restores BX. |
| 292 | `01011000` | `58` | instruction: POP AX, byte 1/1 | 58 restores AX. |
| 293 | `11000011` | `C3` | instruction: RET, byte 1/1 | C3 returns from putc with the caller registers restored. |
| 294 | `01010000` | `50` | instruction: PUSH AX, byte 1/1 | 50 saves the full input byte for the low nibble. |
| 295 | `01010001` | `51` | instruction: PUSH CX, byte 1/1 | 51 preserves caller's shift count. |
| 296 | `10110001` | `B1` | instruction: MOV CL,04, byte 1/2 | B1 sets a four-bit shift count. |
| 297 | `00000100` | `04` | instruction: MOV CL,04, byte 2/2 | B1 sets a four-bit shift count. |
| 298 | `11010010` | `D2` | instruction: SHR AL,CL, byte 1/2 | D2 /5; E8 selects AL; obtains the high nibble. |
| 299 | `11101000` | `E8` | instruction: SHR AL,CL, byte 2/2 | D2 /5; E8 selects AL; obtains the high nibble. |
| 300 | `11101000` | `E8` | instruction: CALL nibble, byte 1/3 | E8; next offset 303 + 4 = nibble encoder at 307. |
| 301 | `00000100` | `04` | instruction: CALL nibble, byte 2/3 | E8; next offset 303 + 4 = nibble encoder at 307. |
| 302 | `00000000` | `00` | instruction: CALL nibble, byte 3/3 | E8; next offset 303 + 4 = nibble encoder at 307. |
| 303 | `01011001` | `59` | instruction: POP CX, byte 1/1 | 59 restores caller CX. |
| 304 | `01011000` | `58` | instruction: POP AX, byte 1/1 | 58 restores the original byte. |
| 305 | `00100100` | `24` | instruction: AND AL,0F, byte 1/2 | 24 imm8 masks the low nibble; fall through to its encoder. |
| 306 | `00001111` | `0F` | instruction: AND AL,0F, byte 2/2 | 24 imm8 masks the low nibble; fall through to its encoder. |
| 307 | `00111100` | `3C` | instruction: CMP AL,0A, byte 1/2 | 3C distinguishes digits 0–9 from hexadecimal A–F. |
| 308 | `00001010` | `0A` | instruction: CMP AL,0A, byte 2/2 | 3C distinguishes digits 0–9 from hexadecimal A–F. |
| 309 | `01110010` | `72` | instruction: JB decimal_digit, byte 1/2 | 72; next offset 311 + 2 = ASCII digit addition at 313. |
| 310 | `00000010` | `02` | instruction: JB decimal_digit, byte 2/2 | 72; next offset 311 + 2 = ASCII digit addition at 313. |
| 311 | `00000100` | `04` | instruction: ADD AL,07, byte 1/2 | 04 imm8 skips ASCII punctuation between 9 and A. |
| 312 | `00000111` | `07` | instruction: ADD AL,07, byte 2/2 | 04 imm8 skips ASCII punctuation between 9 and A. |
| 313 | `00000100` | `04` | instruction: ADD AL,30, byte 1/2 | 04 imm8 adds ASCII zero, yielding uppercase hexadecimal. |
| 314 | `00110000` | `30` | instruction: ADD AL,30, byte 2/2 | 04 imm8 adds ASCII zero, yielding uppercase hexadecimal. |
| 315 | `11101001` | `E9` | instruction: JMP putc, byte 1/3 | E9; next offset 318 minus 60 = 258; tail call returns to hex caller. |
| 316 | `11000100` | `C4` | instruction: JMP putc, byte 2/3 | E9; next offset 318 minus 60 = 258; tail call returns to hex caller. |
| 317 | `11111111` | `FF` | instruction: JMP putc, byte 3/3 | E9; next offset 318 minus 60 = 258; tail call returns to hex caller. |
| 318 | `01100010` | `62` | data: bitborn monitor CR LF NUL, byte 1/18 | Literal welcome text at offset 318. |
| 319 | `01101001` | `69` | data: bitborn monitor CR LF NUL, byte 2/18 | Literal welcome text at offset 318. |
| 320 | `01110100` | `74` | data: bitborn monitor CR LF NUL, byte 3/18 | Literal welcome text at offset 318. |
| 321 | `01100010` | `62` | data: bitborn monitor CR LF NUL, byte 4/18 | Literal welcome text at offset 318. |
| 322 | `01101111` | `6F` | data: bitborn monitor CR LF NUL, byte 5/18 | Literal welcome text at offset 318. |
| 323 | `01110010` | `72` | data: bitborn monitor CR LF NUL, byte 6/18 | Literal welcome text at offset 318. |
| 324 | `01101110` | `6E` | data: bitborn monitor CR LF NUL, byte 7/18 | Literal welcome text at offset 318. |
| 325 | `00100000` | `20` | data: bitborn monitor CR LF NUL, byte 8/18 | Literal welcome text at offset 318. |
| 326 | `01101101` | `6D` | data: bitborn monitor CR LF NUL, byte 9/18 | Literal welcome text at offset 318. |
| 327 | `01101111` | `6F` | data: bitborn monitor CR LF NUL, byte 10/18 | Literal welcome text at offset 318. |
| 328 | `01101110` | `6E` | data: bitborn monitor CR LF NUL, byte 11/18 | Literal welcome text at offset 318. |
| 329 | `01101001` | `69` | data: bitborn monitor CR LF NUL, byte 12/18 | Literal welcome text at offset 318. |
| 330 | `01110100` | `74` | data: bitborn monitor CR LF NUL, byte 13/18 | Literal welcome text at offset 318. |
| 331 | `01101111` | `6F` | data: bitborn monitor CR LF NUL, byte 14/18 | Literal welcome text at offset 318. |
| 332 | `01110010` | `72` | data: bitborn monitor CR LF NUL, byte 15/18 | Literal welcome text at offset 318. |
| 333 | `00001101` | `0D` | data: bitborn monitor CR LF NUL, byte 16/18 | Literal welcome text at offset 318. |
| 334 | `00001010` | `0A` | data: bitborn monitor CR LF NUL, byte 17/18 | Literal welcome text at offset 318. |
| 335 | `00000000` | `00` | data: bitborn monitor CR LF NUL, byte 18/18 | Literal welcome text at offset 318. |
| 336 | `00111110` | `3E` | data: prompt, byte 1/3 | Literal greater-than sign, space and NUL at offset 336. |
| 337 | `00100000` | `20` | data: prompt, byte 2/3 | Literal greater-than sign, space and NUL at offset 336. |
| 338 | `00000000` | `00` | data: prompt, byte 3/3 | Literal greater-than sign, space and NUL at offset 336. |
| 339 | `00001101` | `0D` | data: newline, byte 1/3 | Literal CR LF NUL at offset 339. |
| 340 | `00001010` | `0A` | data: newline, byte 2/3 | Literal CR LF NUL at offset 339. |
| 341 | `00000000` | `00` | data: newline, byte 3/3 | Literal CR LF NUL at offset 339. |
| 342 | `01101000` | `68` | data: help, byte 1/5 | Exact lowercase command string and NUL at offset 342. |
| 343 | `01100101` | `65` | data: help, byte 2/5 | Exact lowercase command string and NUL at offset 342. |
| 344 | `01101100` | `6C` | data: help, byte 3/5 | Exact lowercase command string and NUL at offset 342. |
| 345 | `01110000` | `70` | data: help, byte 4/5 | Exact lowercase command string and NUL at offset 342. |
| 346 | `00000000` | `00` | data: help, byte 5/5 | Exact lowercase command string and NUL at offset 342. |
| 347 | `01100011` | `63` | data: clear, byte 1/6 | Exact lowercase command and NUL at offset 347. |
| 348 | `01101100` | `6C` | data: clear, byte 2/6 | Exact lowercase command and NUL at offset 347. |
| 349 | `01100101` | `65` | data: clear, byte 3/6 | Exact lowercase command and NUL at offset 347. |
| 350 | `01100001` | `61` | data: clear, byte 4/6 | Exact lowercase command and NUL at offset 347. |
| 351 | `01110010` | `72` | data: clear, byte 5/6 | Exact lowercase command and NUL at offset 347. |
| 352 | `00000000` | `00` | data: clear, byte 6/6 | Exact lowercase command and NUL at offset 347. |
| 353 | `01100001` | `61` | data: about, byte 1/6 | Exact lowercase command and NUL at offset 353. |
| 354 | `01100010` | `62` | data: about, byte 2/6 | Exact lowercase command and NUL at offset 353. |
| 355 | `01101111` | `6F` | data: about, byte 3/6 | Exact lowercase command and NUL at offset 353. |
| 356 | `01110101` | `75` | data: about, byte 4/6 | Exact lowercase command and NUL at offset 353. |
| 357 | `01110100` | `74` | data: about, byte 5/6 | Exact lowercase command and NUL at offset 353. |
| 358 | `00000000` | `00` | data: about, byte 6/6 | Exact lowercase command and NUL at offset 353. |
| 359 | `01110010` | `72` | data: reboot, byte 1/7 | Exact lowercase command and NUL at offset 359. |
| 360 | `01100101` | `65` | data: reboot, byte 2/7 | Exact lowercase command and NUL at offset 359. |
| 361 | `01100010` | `62` | data: reboot, byte 3/7 | Exact lowercase command and NUL at offset 359. |
| 362 | `01101111` | `6F` | data: reboot, byte 4/7 | Exact lowercase command and NUL at offset 359. |
| 363 | `01101111` | `6F` | data: reboot, byte 5/7 | Exact lowercase command and NUL at offset 359. |
| 364 | `01110100` | `74` | data: reboot, byte 6/7 | Exact lowercase command and NUL at offset 359. |
| 365 | `00000000` | `00` | data: reboot, byte 7/7 | Exact lowercase command and NUL at offset 359. |
| 366 | `01110000` | `70` | data: peek, byte 1/5 | Exact lowercase command and NUL at offset 366. |
| 367 | `01100101` | `65` | data: peek, byte 2/5 | Exact lowercase command and NUL at offset 366. |
| 368 | `01100101` | `65` | data: peek, byte 3/5 | Exact lowercase command and NUL at offset 366. |
| 369 | `01101011` | `6B` | data: peek, byte 4/5 | Exact lowercase command and NUL at offset 366. |
| 370 | `00000000` | `00` | data: peek, byte 5/5 | Exact lowercase command and NUL at offset 366. |
| 371 | `01101000` | `68` | data: help clear about reboot peek CR LF NUL, byte 1/31 | Literal supported-command list at offset 371. |
| 372 | `01100101` | `65` | data: help clear about reboot peek CR LF NUL, byte 2/31 | Literal supported-command list at offset 371. |
| 373 | `01101100` | `6C` | data: help clear about reboot peek CR LF NUL, byte 3/31 | Literal supported-command list at offset 371. |
| 374 | `01110000` | `70` | data: help clear about reboot peek CR LF NUL, byte 4/31 | Literal supported-command list at offset 371. |
| 375 | `00100000` | `20` | data: help clear about reboot peek CR LF NUL, byte 5/31 | Literal supported-command list at offset 371. |
| 376 | `01100011` | `63` | data: help clear about reboot peek CR LF NUL, byte 6/31 | Literal supported-command list at offset 371. |
| 377 | `01101100` | `6C` | data: help clear about reboot peek CR LF NUL, byte 7/31 | Literal supported-command list at offset 371. |
| 378 | `01100101` | `65` | data: help clear about reboot peek CR LF NUL, byte 8/31 | Literal supported-command list at offset 371. |
| 379 | `01100001` | `61` | data: help clear about reboot peek CR LF NUL, byte 9/31 | Literal supported-command list at offset 371. |
| 380 | `01110010` | `72` | data: help clear about reboot peek CR LF NUL, byte 10/31 | Literal supported-command list at offset 371. |
| 381 | `00100000` | `20` | data: help clear about reboot peek CR LF NUL, byte 11/31 | Literal supported-command list at offset 371. |
| 382 | `01100001` | `61` | data: help clear about reboot peek CR LF NUL, byte 12/31 | Literal supported-command list at offset 371. |
| 383 | `01100010` | `62` | data: help clear about reboot peek CR LF NUL, byte 13/31 | Literal supported-command list at offset 371. |
| 384 | `01101111` | `6F` | data: help clear about reboot peek CR LF NUL, byte 14/31 | Literal supported-command list at offset 371. |
| 385 | `01110101` | `75` | data: help clear about reboot peek CR LF NUL, byte 15/31 | Literal supported-command list at offset 371. |
| 386 | `01110100` | `74` | data: help clear about reboot peek CR LF NUL, byte 16/31 | Literal supported-command list at offset 371. |
| 387 | `00100000` | `20` | data: help clear about reboot peek CR LF NUL, byte 17/31 | Literal supported-command list at offset 371. |
| 388 | `01110010` | `72` | data: help clear about reboot peek CR LF NUL, byte 18/31 | Literal supported-command list at offset 371. |
| 389 | `01100101` | `65` | data: help clear about reboot peek CR LF NUL, byte 19/31 | Literal supported-command list at offset 371. |
| 390 | `01100010` | `62` | data: help clear about reboot peek CR LF NUL, byte 20/31 | Literal supported-command list at offset 371. |
| 391 | `01101111` | `6F` | data: help clear about reboot peek CR LF NUL, byte 21/31 | Literal supported-command list at offset 371. |
| 392 | `01101111` | `6F` | data: help clear about reboot peek CR LF NUL, byte 22/31 | Literal supported-command list at offset 371. |
| 393 | `01110100` | `74` | data: help clear about reboot peek CR LF NUL, byte 23/31 | Literal supported-command list at offset 371. |
| 394 | `00100000` | `20` | data: help clear about reboot peek CR LF NUL, byte 24/31 | Literal supported-command list at offset 371. |
| 395 | `01110000` | `70` | data: help clear about reboot peek CR LF NUL, byte 25/31 | Literal supported-command list at offset 371. |
| 396 | `01100101` | `65` | data: help clear about reboot peek CR LF NUL, byte 26/31 | Literal supported-command list at offset 371. |
| 397 | `01100101` | `65` | data: help clear about reboot peek CR LF NUL, byte 27/31 | Literal supported-command list at offset 371. |
| 398 | `01101011` | `6B` | data: help clear about reboot peek CR LF NUL, byte 28/31 | Literal supported-command list at offset 371. |
| 399 | `00001101` | `0D` | data: help clear about reboot peek CR LF NUL, byte 29/31 | Literal supported-command list at offset 371. |
| 400 | `00001010` | `0A` | data: help clear about reboot peek CR LF NUL, byte 30/31 | Literal supported-command list at offset 371. |
| 401 | `00000000` | `00` | data: help clear about reboot peek CR LF NUL, byte 31/31 | Literal supported-command list at offset 371. |
| 402 | `01001000` | `48` | data: Handwritten x86. BIOS. Raw bits. CR LF NUL, byte 1/35 | Literal architecture summary at offset 402. |
| 403 | `01100001` | `61` | data: Handwritten x86. BIOS. Raw bits. CR LF NUL, byte 2/35 | Literal architecture summary at offset 402. |
| 404 | `01101110` | `6E` | data: Handwritten x86. BIOS. Raw bits. CR LF NUL, byte 3/35 | Literal architecture summary at offset 402. |
| 405 | `01100100` | `64` | data: Handwritten x86. BIOS. Raw bits. CR LF NUL, byte 4/35 | Literal architecture summary at offset 402. |
| 406 | `01110111` | `77` | data: Handwritten x86. BIOS. Raw bits. CR LF NUL, byte 5/35 | Literal architecture summary at offset 402. |
| 407 | `01110010` | `72` | data: Handwritten x86. BIOS. Raw bits. CR LF NUL, byte 6/35 | Literal architecture summary at offset 402. |
| 408 | `01101001` | `69` | data: Handwritten x86. BIOS. Raw bits. CR LF NUL, byte 7/35 | Literal architecture summary at offset 402. |
| 409 | `01110100` | `74` | data: Handwritten x86. BIOS. Raw bits. CR LF NUL, byte 8/35 | Literal architecture summary at offset 402. |
| 410 | `01110100` | `74` | data: Handwritten x86. BIOS. Raw bits. CR LF NUL, byte 9/35 | Literal architecture summary at offset 402. |
| 411 | `01100101` | `65` | data: Handwritten x86. BIOS. Raw bits. CR LF NUL, byte 10/35 | Literal architecture summary at offset 402. |
| 412 | `01101110` | `6E` | data: Handwritten x86. BIOS. Raw bits. CR LF NUL, byte 11/35 | Literal architecture summary at offset 402. |
| 413 | `00100000` | `20` | data: Handwritten x86. BIOS. Raw bits. CR LF NUL, byte 12/35 | Literal architecture summary at offset 402. |
| 414 | `01111000` | `78` | data: Handwritten x86. BIOS. Raw bits. CR LF NUL, byte 13/35 | Literal architecture summary at offset 402. |
| 415 | `00111000` | `38` | data: Handwritten x86. BIOS. Raw bits. CR LF NUL, byte 14/35 | Literal architecture summary at offset 402. |
| 416 | `00110110` | `36` | data: Handwritten x86. BIOS. Raw bits. CR LF NUL, byte 15/35 | Literal architecture summary at offset 402. |
| 417 | `00101110` | `2E` | data: Handwritten x86. BIOS. Raw bits. CR LF NUL, byte 16/35 | Literal architecture summary at offset 402. |
| 418 | `00100000` | `20` | data: Handwritten x86. BIOS. Raw bits. CR LF NUL, byte 17/35 | Literal architecture summary at offset 402. |
| 419 | `01000010` | `42` | data: Handwritten x86. BIOS. Raw bits. CR LF NUL, byte 18/35 | Literal architecture summary at offset 402. |
| 420 | `01001001` | `49` | data: Handwritten x86. BIOS. Raw bits. CR LF NUL, byte 19/35 | Literal architecture summary at offset 402. |
| 421 | `01001111` | `4F` | data: Handwritten x86. BIOS. Raw bits. CR LF NUL, byte 20/35 | Literal architecture summary at offset 402. |
| 422 | `01010011` | `53` | data: Handwritten x86. BIOS. Raw bits. CR LF NUL, byte 21/35 | Literal architecture summary at offset 402. |
| 423 | `00101110` | `2E` | data: Handwritten x86. BIOS. Raw bits. CR LF NUL, byte 22/35 | Literal architecture summary at offset 402. |
| 424 | `00100000` | `20` | data: Handwritten x86. BIOS. Raw bits. CR LF NUL, byte 23/35 | Literal architecture summary at offset 402. |
| 425 | `01010010` | `52` | data: Handwritten x86. BIOS. Raw bits. CR LF NUL, byte 24/35 | Literal architecture summary at offset 402. |
| 426 | `01100001` | `61` | data: Handwritten x86. BIOS. Raw bits. CR LF NUL, byte 25/35 | Literal architecture summary at offset 402. |
| 427 | `01110111` | `77` | data: Handwritten x86. BIOS. Raw bits. CR LF NUL, byte 26/35 | Literal architecture summary at offset 402. |
| 428 | `00100000` | `20` | data: Handwritten x86. BIOS. Raw bits. CR LF NUL, byte 27/35 | Literal architecture summary at offset 402. |
| 429 | `01100010` | `62` | data: Handwritten x86. BIOS. Raw bits. CR LF NUL, byte 28/35 | Literal architecture summary at offset 402. |
| 430 | `01101001` | `69` | data: Handwritten x86. BIOS. Raw bits. CR LF NUL, byte 29/35 | Literal architecture summary at offset 402. |
| 431 | `01110100` | `74` | data: Handwritten x86. BIOS. Raw bits. CR LF NUL, byte 30/35 | Literal architecture summary at offset 402. |
| 432 | `01110011` | `73` | data: Handwritten x86. BIOS. Raw bits. CR LF NUL, byte 31/35 | Literal architecture summary at offset 402. |
| 433 | `00101110` | `2E` | data: Handwritten x86. BIOS. Raw bits. CR LF NUL, byte 32/35 | Literal architecture summary at offset 402. |
| 434 | `00001101` | `0D` | data: Handwritten x86. BIOS. Raw bits. CR LF NUL, byte 33/35 | Literal architecture summary at offset 402. |
| 435 | `00001010` | `0A` | data: Handwritten x86. BIOS. Raw bits. CR LF NUL, byte 34/35 | Literal architecture summary at offset 402. |
| 436 | `00000000` | `00` | data: Handwritten x86. BIOS. Raw bits. CR LF NUL, byte 35/35 | Literal architecture summary at offset 402. |
| 437 | `00110111` | `37` | data: 7C00: space NUL, byte 1/7 | Label for the fixed boot-memory inspection at offset 437. |
| 438 | `01000011` | `43` | data: 7C00: space NUL, byte 2/7 | Label for the fixed boot-memory inspection at offset 437. |
| 439 | `00110000` | `30` | data: 7C00: space NUL, byte 3/7 | Label for the fixed boot-memory inspection at offset 437. |
| 440 | `00110000` | `30` | data: 7C00: space NUL, byte 4/7 | Label for the fixed boot-memory inspection at offset 437. |
| 441 | `00111010` | `3A` | data: 7C00: space NUL, byte 5/7 | Label for the fixed boot-memory inspection at offset 437. |
| 442 | `00100000` | `20` | data: 7C00: space NUL, byte 6/7 | Label for the fixed boot-memory inspection at offset 437. |
| 443 | `00000000` | `00` | data: 7C00: space NUL, byte 7/7 | Label for the fixed boot-memory inspection at offset 437. |
| 444 | `01010101` | `55` | data: Unknown command CR LF NUL, byte 1/18 | Literal error text at offset 444. |
| 445 | `01101110` | `6E` | data: Unknown command CR LF NUL, byte 2/18 | Literal error text at offset 444. |
| 446 | `01101011` | `6B` | data: Unknown command CR LF NUL, byte 3/18 | Literal error text at offset 444. |
| 447 | `01101110` | `6E` | data: Unknown command CR LF NUL, byte 4/18 | Literal error text at offset 444. |
| 448 | `01101111` | `6F` | data: Unknown command CR LF NUL, byte 5/18 | Literal error text at offset 444. |
| 449 | `01110111` | `77` | data: Unknown command CR LF NUL, byte 6/18 | Literal error text at offset 444. |
| 450 | `01101110` | `6E` | data: Unknown command CR LF NUL, byte 7/18 | Literal error text at offset 444. |
| 451 | `00100000` | `20` | data: Unknown command CR LF NUL, byte 8/18 | Literal error text at offset 444. |
| 452 | `01100011` | `63` | data: Unknown command CR LF NUL, byte 9/18 | Literal error text at offset 444. |
| 453 | `01101111` | `6F` | data: Unknown command CR LF NUL, byte 10/18 | Literal error text at offset 444. |
| 454 | `01101101` | `6D` | data: Unknown command CR LF NUL, byte 11/18 | Literal error text at offset 444. |
| 455 | `01101101` | `6D` | data: Unknown command CR LF NUL, byte 12/18 | Literal error text at offset 444. |
| 456 | `01100001` | `61` | data: Unknown command CR LF NUL, byte 13/18 | Literal error text at offset 444. |
| 457 | `01101110` | `6E` | data: Unknown command CR LF NUL, byte 14/18 | Literal error text at offset 444. |
| 458 | `01100100` | `64` | data: Unknown command CR LF NUL, byte 15/18 | Literal error text at offset 444. |
| 459 | `00001101` | `0D` | data: Unknown command CR LF NUL, byte 16/18 | Literal error text at offset 444. |
| 460 | `00001010` | `0A` | data: Unknown command CR LF NUL, byte 17/18 | Literal error text at offset 444. |
| 461 | `00000000` | `00` | data: Unknown command CR LF NUL, byte 18/18 | Literal error text at offset 444. |
