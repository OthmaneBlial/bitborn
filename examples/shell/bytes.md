# Every byte explained

Generated from canonical `.bits` annotations by `python3 tools/byte_tables.py`.

Instruction names below are disassembly for explanation, never code-generation input.

| Offset | Binary | Hex | Range / byte within it | Encoding explanation |
| --- | --- | --- | --- | --- |
| 0 | `10001000` | `88` | instruction: MOV [0520],DL, byte 1/4 | Save the loader's BIOS boot-drive number before UART setup changes DX. |
| 1 | `00010110` | `16` | instruction: MOV [0520],DL, byte 2/4 | Save the loader's BIOS boot-drive number before UART setup changes DX. |
| 2 | `00100000` | `20` | instruction: MOV [0520],DL, byte 3/4 | Save the loader's BIOS boot-drive number before UART setup changes DX. |
| 3 | `00000101` | `05` | instruction: MOV [0520],DL, byte 4/4 | Save the loader's BIOS boot-drive number before UART setup changes DX. |
| 4 | `10111101` | `BD` | instruction: MOV BP,0, byte 1/3 | Establish a deterministic base pointer for the sampled register display. |
| 5 | `00000000` | `00` | instruction: MOV BP,0, byte 2/3 | Establish a deterministic base pointer for the sampled register display. |
| 6 | `00000000` | `00` | instruction: MOV BP,0, byte 3/3 | Establish a deterministic base pointer for the sampled register display. |
| 7 | `10111111` | `BF` | instruction: MOV DI,0600, byte 1/3 | Select the fixed sixteen-byte RAM experiment window. |
| 8 | `00000000` | `00` | instruction: MOV DI,0600, byte 2/3 | Select the fixed sixteen-byte RAM experiment window. |
| 9 | `00000110` | `06` | instruction: MOV DI,0600, byte 3/3 | Select the fixed sixteen-byte RAM experiment window. |
| 10 | `00110001` | `31` | instruction: XOR AX,AX, byte 1/2 | Clear AX for the initialization stores. |
| 11 | `11000000` | `C0` | instruction: XOR AX,AX, byte 2/2 | Clear AX for the initialization stores. |
| 12 | `10111001` | `B9` | instruction: MOV CX,8, byte 1/3 | Eight word stores initialize sixteen experiment bytes. |
| 13 | `00001000` | `08` | instruction: MOV CX,8, byte 2/3 | Eight word stores initialize sixteen experiment bytes. |
| 14 | `00000000` | `00` | instruction: MOV CX,8, byte 3/3 | Eight word stores initialize sixteen experiment bytes. |
| 15 | `11110011` | `F3` | instruction: REP STOSW, byte 1/2 | F3 repeats AB through ES:DI; the shared loader established ES=0 and DF=0. |
| 16 | `10101011` | `AB` | instruction: REP STOSW, byte 2/2 | F3 repeats AB through ES:DI; the shared loader established ES=0 and DF=0. |
| 17 | `10111000` | `B8` | instruction: MOV AX,0003, byte 1/3 | Select BIOS text mode three. |
| 18 | `00000011` | `03` | instruction: MOV AX,0003, byte 2/3 | Select BIOS text mode three. |
| 19 | `00000000` | `00` | instruction: MOV AX,0003, byte 3/3 | Select BIOS text mode three. |
| 20 | `11001101` | `CD` | instruction: INT 10, byte 1/2 | Clear the VGA screen through the BIOS. |
| 21 | `00010000` | `10` | instruction: INT 10, byte 2/2 | Clear the VGA screen through the BIOS. |
| 22 | `10111010` | `BA` | instruction: MOV DX,03F9, byte 1/3 | Select the COM1 interrupt-enable register. |
| 23 | `11111001` | `F9` | instruction: MOV DX,03F9, byte 2/3 | Select the COM1 interrupt-enable register. |
| 24 | `00000011` | `03` | instruction: MOV DX,03F9, byte 3/3 | Select the COM1 interrupt-enable register. |
| 25 | `10110000` | `B0` | instruction: MOV AL,00, byte 1/2 | Disable UART interrupts. |
| 26 | `00000000` | `00` | instruction: MOV AL,00, byte 2/2 | Disable UART interrupts. |
| 27 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | Write the UART control byte. |
| 28 | `10111010` | `BA` | instruction: MOV DX,03FB, byte 1/3 | Select the line-control register. |
| 29 | `11111011` | `FB` | instruction: MOV DX,03FB, byte 2/3 | Select the line-control register. |
| 30 | `00000011` | `03` | instruction: MOV DX,03FB, byte 3/3 | Select the line-control register. |
| 31 | `10110000` | `B0` | instruction: MOV AL,80, byte 1/2 | Enable divisor-latch access. |
| 32 | `10000000` | `80` | instruction: MOV AL,80, byte 2/2 | Enable divisor-latch access. |
| 33 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | Select the baud divisor registers. |
| 34 | `10111010` | `BA` | instruction: MOV DX,03F8, byte 1/3 | Select the divisor low-byte register. |
| 35 | `11111000` | `F8` | instruction: MOV DX,03F8, byte 2/3 | Select the divisor low-byte register. |
| 36 | `00000011` | `03` | instruction: MOV DX,03F8, byte 3/3 | Select the divisor low-byte register. |
| 37 | `10110000` | `B0` | instruction: MOV AL,01, byte 1/2 | Select divisor one for 115200 baud. |
| 38 | `00000001` | `01` | instruction: MOV AL,01, byte 2/2 | Select divisor one for 115200 baud. |
| 39 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | Write the divisor low byte. |
| 40 | `01000010` | `42` | instruction: INC DX, byte 1/1 | Move to the divisor high-byte register. |
| 41 | `10110000` | `B0` | instruction: MOV AL,00, byte 1/2 | Clear the divisor high byte. |
| 42 | `00000000` | `00` | instruction: MOV AL,00, byte 2/2 | Clear the divisor high byte. |
| 43 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | Write the divisor high byte. |
| 44 | `10111010` | `BA` | instruction: MOV DX,03FB, byte 1/3 | Select UART line control again. |
| 45 | `11111011` | `FB` | instruction: MOV DX,03FB, byte 2/3 | Select UART line control again. |
| 46 | `00000011` | `03` | instruction: MOV DX,03FB, byte 3/3 | Select UART line control again. |
| 47 | `10110000` | `B0` | instruction: MOV AL,03, byte 1/2 | Select eight bits, no parity, one stop bit and clear DLAB. |
| 48 | `00000011` | `03` | instruction: MOV AL,03, byte 2/2 | Select eight bits, no parity, one stop bit and clear DLAB. |
| 49 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | Complete COM1 initialization. |
| 50 | `10111110` | `BE` | instruction: MOV SI,802A, byte 1/3 | Banner starts at stage offset 554, physical 802A. |
| 51 | `00101010` | `2A` | instruction: MOV SI,802A, byte 2/3 | Banner starts at stage offset 554, physical 802A. |
| 52 | `10000000` | `80` | instruction: MOV SI,802A, byte 3/3 | Banner starts at stage offset 554, physical 802A. |
| 53 | `11101000` | `E8` | instruction: CALL puts, byte 1/3 | Next offset 56 plus 416 reaches puts at 472. |
| 54 | `10100000` | `A0` | instruction: CALL puts, byte 2/3 | Next offset 56 plus 416 reaches puts at 472. |
| 55 | `00000001` | `01` | instruction: CALL puts, byte 3/3 | Next offset 56 plus 416 reaches puts at 472. |
| 56 | `10111110` | `BE` | instruction: MOV SI,803A, byte 1/3 | Prompt at offset 570 is greater-than and space. |
| 57 | `00111010` | `3A` | instruction: MOV SI,803A, byte 2/3 | Prompt at offset 570 is greater-than and space. |
| 58 | `10000000` | `80` | instruction: MOV SI,803A, byte 3/3 | Prompt at offset 570 is greater-than and space. |
| 59 | `11101000` | `E8` | instruction: CALL puts, byte 1/3 | Next offset 62 plus 410 reaches puts at 472. |
| 60 | `10011010` | `9A` | instruction: CALL puts, byte 2/3 | Next offset 62 plus 410 reaches puts at 472. |
| 61 | `00000001` | `01` | instruction: CALL puts, byte 3/3 | Next offset 62 plus 410 reaches puts at 472. |
| 62 | `10111111` | `BF` | instruction: MOV DI,8200, byte 1/3 | Input buffer is above the two loaded shell sectors. |
| 63 | `00000000` | `00` | instruction: MOV DI,8200, byte 2/3 | Input buffer is above the two loaded shell sectors. |
| 64 | `10000010` | `82` | instruction: MOV DI,8200, byte 3/3 | Input buffer is above the two loaded shell sectors. |
| 65 | `00110001` | `31` | instruction: XOR CX,CX, byte 1/2 | CX counts accepted printable characters. |
| 66 | `11001001` | `C9` | instruction: XOR CX,CX, byte 2/2 | CX counts accepted printable characters. |
| 67 | `00110001` | `31` | instruction: XOR AX,AX, byte 1/2 | Select BIOS blocking keyboard-read service zero. |
| 68 | `11000000` | `C0` | instruction: XOR AX,AX, byte 2/2 | Select BIOS blocking keyboard-read service zero. |
| 69 | `11001101` | `CD` | instruction: INT 16, byte 1/2 | Read a real BIOS keyboard event into AX. |
| 70 | `00010110` | `16` | instruction: INT 16, byte 2/2 | Read a real BIOS keyboard event into AX. |
| 71 | `00111100` | `3C` | instruction: CMP AL,0D, byte 1/2 | Test Enter before printable filtering. |
| 72 | `00001101` | `0D` | instruction: CMP AL,0D, byte 2/2 | Test Enter before printable filtering. |
| 73 | `01110100` | `74` | instruction: JE dispatch, byte 1/2 | Next offset 75 plus 47 reaches dispatch at 122. |
| 74 | `00101111` | `2F` | instruction: JE dispatch, byte 2/2 | Next offset 75 plus 47 reaches dispatch at 122. |
| 75 | `00111100` | `3C` | instruction: CMP AL,08, byte 1/2 | Test Backspace. |
| 76 | `00001000` | `08` | instruction: CMP AL,08, byte 2/2 | Test Backspace. |
| 77 | `01110100` | `74` | instruction: JE backspace, byte 1/2 | Next offset 79 plus 20 reaches backspace at 99. |
| 78 | `00010100` | `14` | instruction: JE backspace, byte 2/2 | Next offset 79 plus 20 reaches backspace at 99. |
| 79 | `00111100` | `3C` | instruction: CMP AL,20, byte 1/2 | Reject control bytes below ASCII space. |
| 80 | `00100000` | `20` | instruction: CMP AL,20, byte 2/2 | Reject control bytes below ASCII space. |
| 81 | `01110010` | `72` | instruction: JB read, byte 1/2 | Next offset 83 minus 16 returns to keyboard read at 67. |
| 82 | `11110000` | `F0` | instruction: JB read, byte 2/2 | Next offset 83 minus 16 returns to keyboard read at 67. |
| 83 | `00111100` | `3C` | instruction: CMP AL,7E, byte 1/2 | Reject bytes above printable ASCII tilde. |
| 84 | `01111110` | `7E` | instruction: CMP AL,7E, byte 2/2 | Reject bytes above printable ASCII tilde. |
| 85 | `01110111` | `77` | instruction: JA read, byte 1/2 | Next offset 87 minus 20 returns to keyboard read at 67. |
| 86 | `11101100` | `EC` | instruction: JA read, byte 2/2 | Next offset 87 minus 20 returns to keyboard read at 67. |
| 87 | `10000011` | `83` | instruction: CMP CX,15, byte 1/3 | Bound the line to fifteen characters plus a NUL byte. |
| 88 | `11111001` | `F9` | instruction: CMP CX,15, byte 2/3 | Bound the line to fifteen characters plus a NUL byte. |
| 89 | `00001111` | `0F` | instruction: CMP CX,15, byte 3/3 | Bound the line to fifteen characters plus a NUL byte. |
| 90 | `01110011` | `73` | instruction: JAE read, byte 1/2 | Next offset 92 minus 25 ignores a sixteenth printable byte. |
| 91 | `11100111` | `E7` | instruction: JAE read, byte 2/2 | Next offset 92 minus 25 ignores a sixteenth printable byte. |
| 92 | `10101010` | `AA` | instruction: STOSB, byte 1/1 | Append the accepted character through ES:DI. |
| 93 | `01000001` | `41` | instruction: INC CX, byte 1/1 | Count the accepted byte. |
| 94 | `11101000` | `E8` | instruction: CALL putc, byte 1/3 | Next offset 97 plus 386 reaches putc at 483. |
| 95 | `10000010` | `82` | instruction: CALL putc, byte 2/3 | Next offset 97 plus 386 reaches putc at 483. |
| 96 | `00000001` | `01` | instruction: CALL putc, byte 3/3 | Next offset 97 plus 386 reaches putc at 483. |
| 97 | `11101011` | `EB` | instruction: JMP read, byte 1/2 | Next offset 99 minus 32 reaches keyboard read at 67. |
| 98 | `11100000` | `E0` | instruction: JMP read, byte 2/2 | Next offset 99 minus 32 reaches keyboard read at 67. |
| 99 | `10000101` | `85` | instruction: TEST CX,CX, byte 1/2 | Empty Backspace must not move DI before the buffer. |
| 100 | `11001001` | `C9` | instruction: TEST CX,CX, byte 2/2 | Empty Backspace must not move DI before the buffer. |
| 101 | `01110100` | `74` | instruction: JZ read, byte 1/2 | Next offset 103 minus 36 ignores Backspace on an empty line. |
| 102 | `11011100` | `DC` | instruction: JZ read, byte 2/2 | Next offset 103 minus 36 ignores Backspace on an empty line. |
| 103 | `01001111` | `4F` | instruction: DEC DI, byte 1/1 | Remove the last buffered character. |
| 104 | `01001001` | `49` | instruction: DEC CX, byte 1/1 | Decrease the accepted length. |
| 105 | `10110000` | `B0` | instruction: MOV AL,08, byte 1/2 | Move the display cursor left. |
| 106 | `00001000` | `08` | instruction: MOV AL,08, byte 2/2 | Move the display cursor left. |
| 107 | `11101000` | `E8` | instruction: CALL putc, byte 1/3 | Next offset 110 plus 373 reaches putc at 483. |
| 108 | `01110101` | `75` | instruction: CALL putc, byte 2/3 | Next offset 110 plus 373 reaches putc at 483. |
| 109 | `00000001` | `01` | instruction: CALL putc, byte 3/3 | Next offset 110 plus 373 reaches putc at 483. |
| 110 | `10110000` | `B0` | instruction: MOV AL,20, byte 1/2 | Erase the old displayed character with a space. |
| 111 | `00100000` | `20` | instruction: MOV AL,20, byte 2/2 | Erase the old displayed character with a space. |
| 112 | `11101000` | `E8` | instruction: CALL putc, byte 1/3 | Next offset 115 plus 368 reaches putc at 483. |
| 113 | `01110000` | `70` | instruction: CALL putc, byte 2/3 | Next offset 115 plus 368 reaches putc at 483. |
| 114 | `00000001` | `01` | instruction: CALL putc, byte 3/3 | Next offset 115 plus 368 reaches putc at 483. |
| 115 | `10110000` | `B0` | instruction: MOV AL,08, byte 1/2 | Restore the cursor after the erasing space. |
| 116 | `00001000` | `08` | instruction: MOV AL,08, byte 2/2 | Restore the cursor after the erasing space. |
| 117 | `11101000` | `E8` | instruction: CALL putc, byte 1/3 | Next offset 120 plus 363 reaches putc at 483. |
| 118 | `01101011` | `6B` | instruction: CALL putc, byte 2/3 | Next offset 120 plus 363 reaches putc at 483. |
| 119 | `00000001` | `01` | instruction: CALL putc, byte 3/3 | Next offset 120 plus 363 reaches putc at 483. |
| 120 | `11101011` | `EB` | instruction: JMP read, byte 1/2 | Next offset 122 minus 55 returns to keyboard read at 67. |
| 121 | `11001001` | `C9` | instruction: JMP read, byte 2/2 | Next offset 122 minus 55 returns to keyboard read at 67. |
| 122 | `00110000` | `30` | instruction: XOR AL,AL, byte 1/2 | Produce the input line terminator. |
| 123 | `11000000` | `C0` | instruction: XOR AL,AL, byte 2/2 | Produce the input line terminator. |
| 124 | `10101010` | `AA` | instruction: STOSB, byte 1/1 | NUL-terminate the bounded input buffer. |
| 125 | `10111110` | `BE` | instruction: MOV SI,803D, byte 1/3 | Select the shared CR LF NUL string. |
| 126 | `00111101` | `3D` | instruction: MOV SI,803D, byte 2/3 | Select the shared CR LF NUL string. |
| 127 | `10000000` | `80` | instruction: MOV SI,803D, byte 3/3 | Select the shared CR LF NUL string. |
| 128 | `11101000` | `E8` | instruction: CALL puts, byte 1/3 | Next offset 131 plus 341 reaches puts at 472. |
| 129 | `01010101` | `55` | instruction: CALL puts, byte 2/3 | Next offset 131 plus 341 reaches puts at 472. |
| 130 | `00000001` | `01` | instruction: CALL puts, byte 3/3 | Next offset 131 plus 341 reaches puts at 472. |
| 131 | `10111110` | `BE` | instruction: MOV SI,8040, byte 1/3 | Select exact command help at offset 576. |
| 132 | `01000000` | `40` | instruction: MOV SI,8040, byte 2/3 | Select exact command help at offset 576. |
| 133 | `10000000` | `80` | instruction: MOV SI,8040, byte 3/3 | Select exact command help at offset 576. |
| 134 | `11101000` | `E8` | instruction: CALL equal, byte 1/3 | Next offset 137 plus 313 reaches comparison at 450. |
| 135 | `00111001` | `39` | instruction: CALL equal, byte 2/3 | Next offset 137 plus 313 reaches comparison at 450. |
| 136 | `00000001` | `01` | instruction: CALL equal, byte 3/3 | Next offset 137 plus 313 reaches comparison at 450. |
| 137 | `10000100` | `84` | instruction: TEST AL,AL, byte 1/2 | AL is one only for exact NUL-terminated equality. |
| 138 | `11000000` | `C0` | instruction: TEST AL,AL, byte 2/2 | AL is one only for exact NUL-terminated equality. |
| 139 | `01110100` | `74` | instruction: JZ try_about, byte 1/2 | Next offset 141 plus nine reaches the next comparison at 150. |
| 140 | `00001001` | `09` | instruction: JZ try_about, byte 2/2 | Next offset 141 plus nine reaches the next comparison at 150. |
| 141 | `10111110` | `BE` | instruction: MOV SI,8071, byte 1/3 | Select the nine-command help text at offset 625. |
| 142 | `01110001` | `71` | instruction: MOV SI,8071, byte 2/3 | Select the nine-command help text at offset 625. |
| 143 | `10000000` | `80` | instruction: MOV SI,8071, byte 3/3 | Select the nine-command help text at offset 625. |
| 144 | `11101000` | `E8` | instruction: CALL puts, byte 1/3 | Next offset 147 plus 325 reaches puts at 472. |
| 145 | `01000101` | `45` | instruction: CALL puts, byte 2/3 | Next offset 147 plus 325 reaches puts at 472. |
| 146 | `00000001` | `01` | instruction: CALL puts, byte 3/3 | Next offset 147 plus 325 reaches puts at 472. |
| 147 | `11101001` | `E9` | instruction: JMP prompt, byte 1/3 | Next offset 150 minus 94 reaches prompt at 56. |
| 148 | `10100010` | `A2` | instruction: JMP prompt, byte 2/3 | Next offset 150 minus 94 reaches prompt at 56. |
| 149 | `11111111` | `FF` | instruction: JMP prompt, byte 3/3 | Next offset 150 minus 94 reaches prompt at 56. |
| 150 | `10111110` | `BE` | instruction: MOV SI,8045, byte 1/3 | Select exact command about at offset 581. |
| 151 | `01000101` | `45` | instruction: MOV SI,8045, byte 2/3 | Select exact command about at offset 581. |
| 152 | `10000000` | `80` | instruction: MOV SI,8045, byte 3/3 | Select exact command about at offset 581. |
| 153 | `11101000` | `E8` | instruction: CALL equal, byte 1/3 | Next offset 156 plus 294 reaches comparison at 450. |
| 154 | `00100110` | `26` | instruction: CALL equal, byte 2/3 | Next offset 156 plus 294 reaches comparison at 450. |
| 155 | `00000001` | `01` | instruction: CALL equal, byte 3/3 | Next offset 156 plus 294 reaches comparison at 450. |
| 156 | `10000100` | `84` | instruction: TEST AL,AL, byte 1/2 | Test the exact-match result. |
| 157 | `11000000` | `C0` | instruction: TEST AL,AL, byte 2/2 | Test the exact-match result. |
| 158 | `01110100` | `74` | instruction: JZ try_clear, byte 1/2 | Next offset 160 plus nine reaches clear comparison at 169. |
| 159 | `00001001` | `09` | instruction: JZ try_clear, byte 2/2 | Next offset 160 plus nine reaches clear comparison at 169. |
| 160 | `10111110` | `BE` | instruction: MOV SI,80A4, byte 1/3 | About text starts at offset 676. |
| 161 | `10100100` | `A4` | instruction: MOV SI,80A4, byte 2/3 | About text starts at offset 676. |
| 162 | `10000000` | `80` | instruction: MOV SI,80A4, byte 3/3 | About text starts at offset 676. |
| 163 | `11101000` | `E8` | instruction: CALL puts, byte 1/3 | Next offset 166 plus 306 reaches puts at 472. |
| 164 | `00110010` | `32` | instruction: CALL puts, byte 2/3 | Next offset 166 plus 306 reaches puts at 472. |
| 165 | `00000001` | `01` | instruction: CALL puts, byte 3/3 | Next offset 166 plus 306 reaches puts at 472. |
| 166 | `11101001` | `E9` | instruction: JMP prompt, byte 1/3 | Next offset 169 minus 113 reaches prompt at 56. |
| 167 | `10001111` | `8F` | instruction: JMP prompt, byte 2/3 | Next offset 169 minus 113 reaches prompt at 56. |
| 168 | `11111111` | `FF` | instruction: JMP prompt, byte 3/3 | Next offset 169 minus 113 reaches prompt at 56. |
| 169 | `10111110` | `BE` | instruction: MOV SI,804B, byte 1/3 | Select exact command clear at offset 587. |
| 170 | `01001011` | `4B` | instruction: MOV SI,804B, byte 2/3 | Select exact command clear at offset 587. |
| 171 | `10000000` | `80` | instruction: MOV SI,804B, byte 3/3 | Select exact command clear at offset 587. |
| 172 | `11101000` | `E8` | instruction: CALL equal, byte 1/3 | Next offset 175 plus 275 reaches comparison at 450. |
| 173 | `00010011` | `13` | instruction: CALL equal, byte 2/3 | Next offset 175 plus 275 reaches comparison at 450. |
| 174 | `00000001` | `01` | instruction: CALL equal, byte 3/3 | Next offset 175 plus 275 reaches comparison at 450. |
| 175 | `10000100` | `84` | instruction: TEST AL,AL, byte 1/2 | Test the exact-match result. |
| 176 | `11000000` | `C0` | instruction: TEST AL,AL, byte 2/2 | Test the exact-match result. |
| 177 | `01110100` | `74` | instruction: JZ try_reboot, byte 1/2 | Next offset 179 plus eight reaches reboot comparison at 187. |
| 178 | `00001000` | `08` | instruction: JZ try_reboot, byte 2/2 | Next offset 179 plus eight reaches reboot comparison at 187. |
| 179 | `10111000` | `B8` | instruction: MOV AX,0003, byte 1/3 | Select text mode to clear VGA only, retaining serial history. |
| 180 | `00000011` | `03` | instruction: MOV AX,0003, byte 2/3 | Select text mode to clear VGA only, retaining serial history. |
| 181 | `00000000` | `00` | instruction: MOV AX,0003, byte 3/3 | Select text mode to clear VGA only, retaining serial history. |
| 182 | `11001101` | `CD` | instruction: INT 10, byte 1/2 | Clear the actual VGA display. |
| 183 | `00010000` | `10` | instruction: INT 10, byte 2/2 | Clear the actual VGA display. |
| 184 | `11101001` | `E9` | instruction: JMP prompt, byte 1/3 | Next offset 187 minus 131 reaches prompt at 56. |
| 185 | `01111101` | `7D` | instruction: JMP prompt, byte 2/3 | Next offset 187 minus 131 reaches prompt at 56. |
| 186 | `11111111` | `FF` | instruction: JMP prompt, byte 3/3 | Next offset 187 minus 131 reaches prompt at 56. |
| 187 | `10111110` | `BE` | instruction: MOV SI,8051, byte 1/3 | Select exact command reboot at offset 593. |
| 188 | `01010001` | `51` | instruction: MOV SI,8051, byte 2/3 | Select exact command reboot at offset 593. |
| 189 | `10000000` | `80` | instruction: MOV SI,8051, byte 3/3 | Select exact command reboot at offset 593. |
| 190 | `11101000` | `E8` | instruction: CALL equal, byte 1/3 | Next offset 193 plus 257 reaches comparison at 450. |
| 191 | `00000001` | `01` | instruction: CALL equal, byte 2/3 | Next offset 193 plus 257 reaches comparison at 450. |
| 192 | `00000001` | `01` | instruction: CALL equal, byte 3/3 | Next offset 193 plus 257 reaches comparison at 450. |
| 193 | `10000100` | `84` | instruction: TEST AL,AL, byte 1/2 | Test the exact-match result. |
| 194 | `11000000` | `C0` | instruction: TEST AL,AL, byte 2/2 | Test the exact-match result. |
| 195 | `01110100` | `74` | instruction: JZ try_read, byte 1/2 | Next offset 197 plus five reaches read comparison at 202. |
| 196 | `00000101` | `05` | instruction: JZ try_read, byte 2/2 | Next offset 197 plus five reaches read comparison at 202. |
| 197 | `11001101` | `CD` | instruction: INT 19, byte 1/2 | Invoke BIOS bootstrap, not a power cycle. |
| 198 | `00011001` | `19` | instruction: INT 19, byte 2/2 | Invoke BIOS bootstrap, not a power cycle. |
| 199 | `11101001` | `E9` | instruction: JMP prompt, byte 1/3 | If INT 19 returns, next offset 202 minus 146 reaches prompt. |
| 200 | `01101110` | `6E` | instruction: JMP prompt, byte 2/3 | If INT 19 returns, next offset 202 minus 146 reaches prompt. |
| 201 | `11111111` | `FF` | instruction: JMP prompt, byte 3/3 | If INT 19 returns, next offset 202 minus 146 reaches prompt. |
| 202 | `10111110` | `BE` | instruction: MOV SI,8058, byte 1/3 | Select exact command read at offset 600. |
| 203 | `01011000` | `58` | instruction: MOV SI,8058, byte 2/3 | Select exact command read at offset 600. |
| 204 | `10000000` | `80` | instruction: MOV SI,8058, byte 3/3 | Select exact command read at offset 600. |
| 205 | `11101000` | `E8` | instruction: CALL equal, byte 1/3 | Next offset 208 plus 242 reaches comparison at 450. |
| 206 | `11110010` | `F2` | instruction: CALL equal, byte 2/3 | Next offset 208 plus 242 reaches comparison at 450. |
| 207 | `00000000` | `00` | instruction: CALL equal, byte 3/3 | Next offset 208 plus 242 reaches comparison at 450. |
| 208 | `10000100` | `84` | instruction: TEST AL,AL, byte 1/2 | Test the exact-match result. |
| 209 | `11000000` | `C0` | instruction: TEST AL,AL, byte 2/2 | Test the exact-match result. |
| 210 | `01110100` | `74` | instruction: JZ try_write, byte 1/2 | Next offset 212 plus 21 reaches write comparison at 233. |
| 211 | `00010101` | `15` | instruction: JZ try_write, byte 2/2 | Next offset 212 plus 21 reaches write comparison at 233. |
| 212 | `10111110` | `BE` | instruction: MOV SI,80C9, byte 1/3 | Select the physical-address prefix at offset 713. |
| 213 | `11001001` | `C9` | instruction: MOV SI,80C9, byte 2/3 | Select the physical-address prefix at offset 713. |
| 214 | `10000000` | `80` | instruction: MOV SI,80C9, byte 3/3 | Select the physical-address prefix at offset 713. |
| 215 | `11101000` | `E8` | instruction: CALL puts, byte 1/3 | Next offset 218 plus 254 reaches puts at 472. |
| 216 | `11111110` | `FE` | instruction: CALL puts, byte 2/3 | Next offset 218 plus 254 reaches puts at 472. |
| 217 | `00000000` | `00` | instruction: CALL puts, byte 3/3 | Next offset 218 plus 254 reaches puts at 472. |
| 218 | `10100000` | `A0` | instruction: MOV AL,[0600], byte 1/3 | Read the actual experiment byte through segment-zero DS. |
| 219 | `00000000` | `00` | instruction: MOV AL,[0600], byte 2/3 | Read the actual experiment byte through segment-zero DS. |
| 220 | `00000110` | `06` | instruction: MOV AL,[0600], byte 3/3 | Read the actual experiment byte through segment-zero DS. |
| 221 | `11101000` | `E8` | instruction: CALL hex, byte 1/3 | Next offset 224 plus 295 reaches the byte-to-hex procedure at 519. |
| 222 | `00100111` | `27` | instruction: CALL hex, byte 2/3 | Next offset 224 plus 295 reaches the byte-to-hex procedure at 519. |
| 223 | `00000001` | `01` | instruction: CALL hex, byte 3/3 | Next offset 224 plus 295 reaches the byte-to-hex procedure at 519. |
| 224 | `10111110` | `BE` | instruction: MOV SI,803D, byte 1/3 | Select CR LF NUL. |
| 225 | `00111101` | `3D` | instruction: MOV SI,803D, byte 2/3 | Select CR LF NUL. |
| 226 | `10000000` | `80` | instruction: MOV SI,803D, byte 3/3 | Select CR LF NUL. |
| 227 | `11101000` | `E8` | instruction: CALL puts, byte 1/3 | Next offset 230 plus 242 reaches puts at 472. |
| 228 | `11110010` | `F2` | instruction: CALL puts, byte 2/3 | Next offset 230 plus 242 reaches puts at 472. |
| 229 | `00000000` | `00` | instruction: CALL puts, byte 3/3 | Next offset 230 plus 242 reaches puts at 472. |
| 230 | `11101001` | `E9` | instruction: JMP prompt, byte 1/3 | Next offset 233 minus 177 reaches prompt at 56. |
| 231 | `01001111` | `4F` | instruction: JMP prompt, byte 2/3 | Next offset 233 minus 177 reaches prompt at 56. |
| 232 | `11111111` | `FF` | instruction: JMP prompt, byte 3/3 | Next offset 233 minus 177 reaches prompt at 56. |
| 233 | `10111110` | `BE` | instruction: MOV SI,805D, byte 1/3 | Select exact command write at offset 605. |
| 234 | `01011101` | `5D` | instruction: MOV SI,805D, byte 2/3 | Select exact command write at offset 605. |
| 235 | `10000000` | `80` | instruction: MOV SI,805D, byte 3/3 | Select exact command write at offset 605. |
| 236 | `11101000` | `E8` | instruction: CALL equal, byte 1/3 | Next offset 239 plus 211 reaches comparison at 450. |
| 237 | `11010011` | `D3` | instruction: CALL equal, byte 2/3 | Next offset 239 plus 211 reaches comparison at 450. |
| 238 | `00000000` | `00` | instruction: CALL equal, byte 3/3 | Next offset 239 plus 211 reaches comparison at 450. |
| 239 | `10000100` | `84` | instruction: TEST AL,AL, byte 1/2 | Test the exact-match result. |
| 240 | `11000000` | `C0` | instruction: TEST AL,AL, byte 2/2 | Test the exact-match result. |
| 241 | `01110100` | `74` | instruction: JZ try_dump, byte 1/2 | Next offset 243 plus fourteen reaches dump comparison at 257. |
| 242 | `00001110` | `0E` | instruction: JZ try_dump, byte 2/2 | Next offset 243 plus fourteen reaches dump comparison at 257. |
| 243 | `11000110` | `C6` | instruction: MOV byte [0600],2A, byte 1/5 | C6 /0 with direct address 0600 stores one fixed byte; no general writes are exposed. |
| 244 | `00000110` | `06` | instruction: MOV byte [0600],2A, byte 2/5 | C6 /0 with direct address 0600 stores one fixed byte; no general writes are exposed. |
| 245 | `00000000` | `00` | instruction: MOV byte [0600],2A, byte 3/5 | C6 /0 with direct address 0600 stores one fixed byte; no general writes are exposed. |
| 246 | `00000110` | `06` | instruction: MOV byte [0600],2A, byte 4/5 | C6 /0 with direct address 0600 stores one fixed byte; no general writes are exposed. |
| 247 | `00101010` | `2A` | instruction: MOV byte [0600],2A, byte 5/5 | C6 /0 with direct address 0600 stores one fixed byte; no general writes are exposed. |
| 248 | `10111110` | `BE` | instruction: MOV SI,80D0, byte 1/3 | Select the write confirmation at offset 720. |
| 249 | `11010000` | `D0` | instruction: MOV SI,80D0, byte 2/3 | Select the write confirmation at offset 720. |
| 250 | `10000000` | `80` | instruction: MOV SI,80D0, byte 3/3 | Select the write confirmation at offset 720. |
| 251 | `11101000` | `E8` | instruction: CALL puts, byte 1/3 | Next offset 254 plus 218 reaches puts at 472. |
| 252 | `11011010` | `DA` | instruction: CALL puts, byte 2/3 | Next offset 254 plus 218 reaches puts at 472. |
| 253 | `00000000` | `00` | instruction: CALL puts, byte 3/3 | Next offset 254 plus 218 reaches puts at 472. |
| 254 | `11101001` | `E9` | instruction: JMP prompt, byte 1/3 | Next offset 257 minus 201 reaches prompt at 56. |
| 255 | `00110111` | `37` | instruction: JMP prompt, byte 2/3 | Next offset 257 minus 201 reaches prompt at 56. |
| 256 | `11111111` | `FF` | instruction: JMP prompt, byte 3/3 | Next offset 257 minus 201 reaches prompt at 56. |
| 257 | `10111110` | `BE` | instruction: MOV SI,8063, byte 1/3 | Select exact command dump at offset 611. |
| 258 | `01100011` | `63` | instruction: MOV SI,8063, byte 2/3 | Select exact command dump at offset 611. |
| 259 | `10000000` | `80` | instruction: MOV SI,8063, byte 3/3 | Select exact command dump at offset 611. |
| 260 | `11101000` | `E8` | instruction: CALL equal, byte 1/3 | Next offset 263 plus 187 reaches comparison at 450. |
| 261 | `10111011` | `BB` | instruction: CALL equal, byte 2/3 | Next offset 263 plus 187 reaches comparison at 450. |
| 262 | `00000000` | `00` | instruction: CALL equal, byte 3/3 | Next offset 263 plus 187 reaches comparison at 450. |
| 263 | `10000100` | `84` | instruction: TEST AL,AL, byte 1/2 | Test the exact-match result. |
| 264 | `11000000` | `C0` | instruction: TEST AL,AL, byte 2/2 | Test the exact-match result. |
| 265 | `01110100` | `74` | instruction: JZ try_regs, byte 1/2 | Next offset 267 plus 32 reaches register comparison at 299. |
| 266 | `00100000` | `20` | instruction: JZ try_regs, byte 2/2 | Next offset 267 plus 32 reaches register comparison at 299. |
| 267 | `10111110` | `BE` | instruction: MOV SI,80C9, byte 1/3 | Select the physical-address prefix at offset 713. |
| 268 | `11001001` | `C9` | instruction: MOV SI,80C9, byte 2/3 | Select the physical-address prefix at offset 713. |
| 269 | `10000000` | `80` | instruction: MOV SI,80C9, byte 3/3 | Select the physical-address prefix at offset 713. |
| 270 | `11101000` | `E8` | instruction: CALL puts, byte 1/3 | Next offset 273 plus 199 reaches puts at 472. |
| 271 | `11000111` | `C7` | instruction: CALL puts, byte 2/3 | Next offset 273 plus 199 reaches puts at 472. |
| 272 | `00000000` | `00` | instruction: CALL puts, byte 3/3 | Next offset 273 plus 199 reaches puts at 472. |
| 273 | `10111110` | `BE` | instruction: MOV SI,0600, byte 1/3 | Select the actual sixteen-byte RAM window. |
| 274 | `00000000` | `00` | instruction: MOV SI,0600, byte 2/3 | Select the actual sixteen-byte RAM window. |
| 275 | `00000110` | `06` | instruction: MOV SI,0600, byte 3/3 | Select the actual sixteen-byte RAM window. |
| 276 | `10111001` | `B9` | instruction: MOV CX,16, byte 1/3 | Print exactly sixteen bytes. |
| 277 | `00010000` | `10` | instruction: MOV CX,16, byte 2/3 | Print exactly sixteen bytes. |
| 278 | `00000000` | `00` | instruction: MOV CX,16, byte 3/3 | Print exactly sixteen bytes. |
| 279 | `10101100` | `AC` | instruction: LODSB, byte 1/1 | Read the current RAM byte and advance SI. |
| 280 | `11101000` | `E8` | instruction: CALL hex, byte 1/3 | Next offset 283 plus 236 reaches hex at 519. |
| 281 | `11101100` | `EC` | instruction: CALL hex, byte 2/3 | Next offset 283 plus 236 reaches hex at 519. |
| 282 | `00000000` | `00` | instruction: CALL hex, byte 3/3 | Next offset 283 plus 236 reaches hex at 519. |
| 283 | `10110000` | `B0` | instruction: MOV AL,20, byte 1/2 | Separate the displayed hexadecimal bytes. |
| 284 | `00100000` | `20` | instruction: MOV AL,20, byte 2/2 | Separate the displayed hexadecimal bytes. |
| 285 | `11101000` | `E8` | instruction: CALL putc, byte 1/3 | Next offset 288 plus 195 reaches putc at 483. |
| 286 | `11000011` | `C3` | instruction: CALL putc, byte 2/3 | Next offset 288 plus 195 reaches putc at 483. |
| 287 | `00000000` | `00` | instruction: CALL putc, byte 3/3 | Next offset 288 plus 195 reaches putc at 483. |
| 288 | `11100010` | `E2` | instruction: LOOP dump_byte, byte 1/2 | Next offset 290 minus eleven reaches LODSB at 279. |
| 289 | `11110101` | `F5` | instruction: LOOP dump_byte, byte 2/2 | Next offset 290 minus eleven reaches LODSB at 279. |
| 290 | `10111110` | `BE` | instruction: MOV SI,803D, byte 1/3 | Select CR LF NUL. |
| 291 | `00111101` | `3D` | instruction: MOV SI,803D, byte 2/3 | Select CR LF NUL. |
| 292 | `10000000` | `80` | instruction: MOV SI,803D, byte 3/3 | Select CR LF NUL. |
| 293 | `11101000` | `E8` | instruction: CALL puts, byte 1/3 | Next offset 296 plus 176 reaches puts at 472. |
| 294 | `10110000` | `B0` | instruction: CALL puts, byte 2/3 | Next offset 296 plus 176 reaches puts at 472. |
| 295 | `00000000` | `00` | instruction: CALL puts, byte 3/3 | Next offset 296 plus 176 reaches puts at 472. |
| 296 | `11101001` | `E9` | instruction: JMP prompt, byte 1/3 | Next offset 299 minus 243 reaches prompt at 56. |
| 297 | `00001101` | `0D` | instruction: JMP prompt, byte 2/3 | Next offset 299 minus 243 reaches prompt at 56. |
| 298 | `11111111` | `FF` | instruction: JMP prompt, byte 3/3 | Next offset 299 minus 243 reaches prompt at 56. |
| 299 | `10111110` | `BE` | instruction: MOV SI,8068, byte 1/3 | Select exact command regs at offset 616. |
| 300 | `01101000` | `68` | instruction: MOV SI,8068, byte 2/3 | Select exact command regs at offset 616. |
| 301 | `10000000` | `80` | instruction: MOV SI,8068, byte 3/3 | Select exact command regs at offset 616. |
| 302 | `11101000` | `E8` | instruction: CALL equal, byte 1/3 | Next offset 305 plus 145 reaches comparison at 450. |
| 303 | `10010001` | `91` | instruction: CALL equal, byte 2/3 | Next offset 305 plus 145 reaches comparison at 450. |
| 304 | `00000000` | `00` | instruction: CALL equal, byte 3/3 | Next offset 305 plus 145 reaches comparison at 450. |
| 305 | `10000100` | `84` | instruction: TEST AL,AL, byte 1/2 | Flags are sampled after this exact-match test and branch. |
| 306 | `11000000` | `C0` | instruction: TEST AL,AL, byte 2/2 | Flags are sampled after this exact-match test and branch. |
| 307 | `01110100` | `74` | instruction: JZ try_run, byte 1/2 | Next offset 309 plus 84 reaches run comparison at 393. |
| 308 | `01010100` | `54` | instruction: JZ try_run, byte 2/2 | Next offset 309 plus 84 reaches run comparison at 393. |
| 309 | `10100011` | `A3` | instruction: MOV [0500],AX, byte 1/3 | Snapshot sampling starts here, offset 309; stores do not change flags. |
| 310 | `00000000` | `00` | instruction: MOV [0500],AX, byte 2/3 | Snapshot sampling starts here, offset 309; stores do not change flags. |
| 311 | `00000101` | `05` | instruction: MOV [0500],AX, byte 3/3 | Snapshot sampling starts here, offset 309; stores do not change flags. |
| 312 | `10001001` | `89` | instruction: MOV [0502],BX, byte 1/4 | Save actual BX at handler entry. |
| 313 | `00011110` | `1E` | instruction: MOV [0502],BX, byte 2/4 | Save actual BX at handler entry. |
| 314 | `00000010` | `02` | instruction: MOV [0502],BX, byte 3/4 | Save actual BX at handler entry. |
| 315 | `00000101` | `05` | instruction: MOV [0502],BX, byte 4/4 | Save actual BX at handler entry. |
| 316 | `10001001` | `89` | instruction: MOV [0504],CX, byte 1/4 | Save actual CX; it is four after reading regs. |
| 317 | `00001110` | `0E` | instruction: MOV [0504],CX, byte 2/4 | Save actual CX; it is four after reading regs. |
| 318 | `00000100` | `04` | instruction: MOV [0504],CX, byte 3/4 | Save actual CX; it is four after reading regs. |
| 319 | `00000101` | `05` | instruction: MOV [0504],CX, byte 4/4 | Save actual CX; it is four after reading regs. |
| 320 | `10001001` | `89` | instruction: MOV [0506],DX, byte 1/4 | Save actual DX before any reporting calls. |
| 321 | `00010110` | `16` | instruction: MOV [0506],DX, byte 2/4 | Save actual DX before any reporting calls. |
| 322 | `00000110` | `06` | instruction: MOV [0506],DX, byte 3/4 | Save actual DX before any reporting calls. |
| 323 | `00000101` | `05` | instruction: MOV [0506],DX, byte 4/4 | Save actual DX before any reporting calls. |
| 324 | `10001001` | `89` | instruction: MOV [0508],SP, byte 1/4 | Save SP before PUSHF or reporting calls alter the stack. |
| 325 | `00100110` | `26` | instruction: MOV [0508],SP, byte 2/4 | Save SP before PUSHF or reporting calls alter the stack. |
| 326 | `00001000` | `08` | instruction: MOV [0508],SP, byte 3/4 | Save SP before PUSHF or reporting calls alter the stack. |
| 327 | `00000101` | `05` | instruction: MOV [0508],SP, byte 4/4 | Save SP before PUSHF or reporting calls alter the stack. |
| 328 | `10001001` | `89` | instruction: MOV [050A],BP, byte 1/4 | Save actual BP. |
| 329 | `00101110` | `2E` | instruction: MOV [050A],BP, byte 2/4 | Save actual BP. |
| 330 | `00001010` | `0A` | instruction: MOV [050A],BP, byte 3/4 | Save actual BP. |
| 331 | `00000101` | `05` | instruction: MOV [050A],BP, byte 4/4 | Save actual BP. |
| 332 | `10001001` | `89` | instruction: MOV [050C],SI, byte 1/4 | Save SI after the successful command comparison. |
| 333 | `00110110` | `36` | instruction: MOV [050C],SI, byte 2/4 | Save SI after the successful command comparison. |
| 334 | `00001100` | `0C` | instruction: MOV [050C],SI, byte 3/4 | Save SI after the successful command comparison. |
| 335 | `00000101` | `05` | instruction: MOV [050C],SI, byte 4/4 | Save SI after the successful command comparison. |
| 336 | `10001001` | `89` | instruction: MOV [050E],DI, byte 1/4 | Save DI after the NUL input terminator. |
| 337 | `00111110` | `3E` | instruction: MOV [050E],DI, byte 2/4 | Save DI after the NUL input terminator. |
| 338 | `00001110` | `0E` | instruction: MOV [050E],DI, byte 3/4 | Save DI after the NUL input terminator. |
| 339 | `00000101` | `05` | instruction: MOV [050E],DI, byte 4/4 | Save DI after the NUL input terminator. |
| 340 | `10001100` | `8C` | instruction: MOV [0510],CS, byte 1/4 | 8C /r stores the actual code segment. |
| 341 | `00001110` | `0E` | instruction: MOV [0510],CS, byte 2/4 | 8C /r stores the actual code segment. |
| 342 | `00010000` | `10` | instruction: MOV [0510],CS, byte 3/4 | 8C /r stores the actual code segment. |
| 343 | `00000101` | `05` | instruction: MOV [0510],CS, byte 4/4 | 8C /r stores the actual code segment. |
| 344 | `10001100` | `8C` | instruction: MOV [0512],DS, byte 1/4 | Save the actual data segment. |
| 345 | `00011110` | `1E` | instruction: MOV [0512],DS, byte 2/4 | Save the actual data segment. |
| 346 | `00010010` | `12` | instruction: MOV [0512],DS, byte 3/4 | Save the actual data segment. |
| 347 | `00000101` | `05` | instruction: MOV [0512],DS, byte 4/4 | Save the actual data segment. |
| 348 | `10001100` | `8C` | instruction: MOV [0514],ES, byte 1/4 | Save the actual extra segment. |
| 349 | `00000110` | `06` | instruction: MOV [0514],ES, byte 2/4 | Save the actual extra segment. |
| 350 | `00010100` | `14` | instruction: MOV [0514],ES, byte 3/4 | Save the actual extra segment. |
| 351 | `00000101` | `05` | instruction: MOV [0514],ES, byte 4/4 | Save the actual extra segment. |
| 352 | `10001100` | `8C` | instruction: MOV [0516],SS, byte 1/4 | Save the actual stack segment. |
| 353 | `00010110` | `16` | instruction: MOV [0516],SS, byte 2/4 | Save the actual stack segment. |
| 354 | `00010110` | `16` | instruction: MOV [0516],SS, byte 3/4 | Save the actual stack segment. |
| 355 | `00000101` | `05` | instruction: MOV [0516],SS, byte 4/4 | Save the actual stack segment. |
| 356 | `10011100` | `9C` | instruction: PUSHF, byte 1/1 | Push the actual FLAGS word; preceding snapshot stores preserved flags. |
| 357 | `01011000` | `58` | instruction: POP AX, byte 1/1 | Transfer the sampled FLAGS word into AX without changing flags. |
| 358 | `10100011` | `A3` | instruction: MOV [0518],AX, byte 1/3 | Complete the thirteen-word snapshot at 0500 through 0519. |
| 359 | `00011000` | `18` | instruction: MOV [0518],AX, byte 2/3 | Complete the thirteen-word snapshot at 0500 through 0519. |
| 360 | `00000101` | `05` | instruction: MOV [0518],AX, byte 3/3 | Complete the thirteen-word snapshot at 0500 through 0519. |
| 361 | `10111110` | `BE` | instruction: MOV SI,80DF, byte 1/3 | Select the column header at offset 735. |
| 362 | `11011111` | `DF` | instruction: MOV SI,80DF, byte 2/3 | Select the column header at offset 735. |
| 363 | `10000000` | `80` | instruction: MOV SI,80DF, byte 3/3 | Select the column header at offset 735. |
| 364 | `11101000` | `E8` | instruction: CALL puts, byte 1/3 | Next offset 367 plus 105 reaches puts at 472. |
| 365 | `01101001` | `69` | instruction: CALL puts, byte 2/3 | Next offset 367 plus 105 reaches puts at 472. |
| 366 | `00000000` | `00` | instruction: CALL puts, byte 3/3 | Next offset 367 plus 105 reaches puts at 472. |
| 367 | `10111110` | `BE` | instruction: MOV SI,0500, byte 1/3 | Read the real captured register words. |
| 368 | `00000000` | `00` | instruction: MOV SI,0500, byte 2/3 | Read the real captured register words. |
| 369 | `00000101` | `05` | instruction: MOV SI,0500, byte 3/3 | Read the real captured register words. |
| 370 | `10111001` | `B9` | instruction: MOV CX,13, byte 1/3 | Display eight GPRs, four segments and FLAGS. |
| 371 | `00001101` | `0D` | instruction: MOV CX,13, byte 2/3 | Display eight GPRs, four segments and FLAGS. |
| 372 | `00000000` | `00` | instruction: MOV CX,13, byte 3/3 | Display eight GPRs, four segments and FLAGS. |
| 373 | `10101101` | `AD` | instruction: LODSW, byte 1/1 | Read the next actual snapshot word into AX. |
| 374 | `11101000` | `E8` | instruction: CALL wordhex, byte 1/3 | Next offset 377 plus 166 reaches wordhex at 543. |
| 375 | `10100110` | `A6` | instruction: CALL wordhex, byte 2/3 | Next offset 377 plus 166 reaches wordhex at 543. |
| 376 | `00000000` | `00` | instruction: CALL wordhex, byte 3/3 | Next offset 377 plus 166 reaches wordhex at 543. |
| 377 | `10110000` | `B0` | instruction: MOV AL,20, byte 1/2 | Separate the displayed words. |
| 378 | `00100000` | `20` | instruction: MOV AL,20, byte 2/2 | Separate the displayed words. |
| 379 | `11101000` | `E8` | instruction: CALL putc, byte 1/3 | Next offset 382 plus 101 reaches putc at 483. |
| 380 | `01100101` | `65` | instruction: CALL putc, byte 2/3 | Next offset 382 plus 101 reaches putc at 483. |
| 381 | `00000000` | `00` | instruction: CALL putc, byte 3/3 | Next offset 382 plus 101 reaches putc at 483. |
| 382 | `11100010` | `E2` | instruction: LOOP register_word, byte 1/2 | Next offset 384 minus eleven reaches LODSW at 373. |
| 383 | `11110101` | `F5` | instruction: LOOP register_word, byte 2/2 | Next offset 384 minus eleven reaches LODSW at 373. |
| 384 | `10111110` | `BE` | instruction: MOV SI,803D, byte 1/3 | Select CR LF NUL. |
| 385 | `00111101` | `3D` | instruction: MOV SI,803D, byte 2/3 | Select CR LF NUL. |
| 386 | `10000000` | `80` | instruction: MOV SI,803D, byte 3/3 | Select CR LF NUL. |
| 387 | `11101000` | `E8` | instruction: CALL puts, byte 1/3 | Next offset 390 plus 82 reaches puts at 472. |
| 388 | `01010010` | `52` | instruction: CALL puts, byte 2/3 | Next offset 390 plus 82 reaches puts at 472. |
| 389 | `00000000` | `00` | instruction: CALL puts, byte 3/3 | Next offset 390 plus 82 reaches puts at 472. |
| 390 | `11101001` | `E9` | instruction: JMP prompt, byte 1/3 | Next offset 393 minus 337 reaches prompt at 56. |
| 391 | `10101111` | `AF` | instruction: JMP prompt, byte 2/3 | Next offset 393 minus 337 reaches prompt at 56. |
| 392 | `11111110` | `FE` | instruction: JMP prompt, byte 3/3 | Next offset 393 minus 337 reaches prompt at 56. |
| 393 | `10111110` | `BE` | instruction: MOV SI,806D, byte 1/3 | Select exact command run at offset 621. |
| 394 | `01101101` | `6D` | instruction: MOV SI,806D, byte 2/3 | Select exact command run at offset 621. |
| 395 | `10000000` | `80` | instruction: MOV SI,806D, byte 3/3 | Select exact command run at offset 621. |
| 396 | `11101000` | `E8` | instruction: CALL equal, byte 1/3 | Next offset 399 plus 51 reaches comparison at 450. |
| 397 | `00110011` | `33` | instruction: CALL equal, byte 2/3 | Next offset 399 plus 51 reaches comparison at 450. |
| 398 | `00000000` | `00` | instruction: CALL equal, byte 3/3 | Next offset 399 plus 51 reaches comparison at 450. |
| 399 | `10000100` | `84` | instruction: TEST AL,AL, byte 1/2 | Test the exact-match result. |
| 400 | `11000000` | `C0` | instruction: TEST AL,AL, byte 2/2 | Test the exact-match result. |
| 401 | `01110100` | `74` | instruction: JZ unknown, byte 1/2 | Next offset 403 plus 38 skips both disk paths to unknown at 441. |
| 402 | `00100110` | `26` | instruction: JZ unknown, byte 2/2 | Next offset 403 plus 38 skips both disk paths to unknown at 441. |
| 403 | `00110001` | `31` | instruction: XOR AX,AX, byte 1/2 | Prepare segment zero for the disk buffer. |
| 404 | `11000000` | `C0` | instruction: XOR AX,AX, byte 2/2 | Prepare segment zero for the disk buffer. |
| 405 | `10001110` | `8E` | instruction: MOV ES,AX, byte 1/2 | Use ES=0 for the physical 9000 load address. |
| 406 | `11000000` | `C0` | instruction: MOV ES,AX, byte 2/2 | Use ES=0 for the physical 9000 load address. |
| 407 | `10111011` | `BB` | instruction: MOV BX,9000, byte 1/3 | Select a separate two-sector app buffer away from shell, input and stack. |
| 408 | `00000000` | `00` | instruction: MOV BX,9000, byte 2/3 | Select a separate two-sector app buffer away from shell, input and stack. |
| 409 | `10010000` | `90` | instruction: MOV BX,9000, byte 3/3 | Select a separate two-sector app buffer away from shell, input and stack. |
| 410 | `10111000` | `B8` | instruction: MOV AX,0202, byte 1/3 | AH=02 reads disk sectors; AL=02 requests two sectors. |
| 411 | `00000010` | `02` | instruction: MOV AX,0202, byte 2/3 | AH=02 reads disk sectors; AL=02 requests two sectors. |
| 412 | `00000010` | `02` | instruction: MOV AX,0202, byte 3/3 | AH=02 reads disk sectors; AL=02 requests two sectors. |
| 413 | `10111001` | `B9` | instruction: MOV CX,0004, byte 1/3 | Select cylinder zero, CHS sector four, immediately after the shell sectors. |
| 414 | `00000100` | `04` | instruction: MOV CX,0004, byte 2/3 | Select cylinder zero, CHS sector four, immediately after the shell sectors. |
| 415 | `00000000` | `00` | instruction: MOV CX,0004, byte 3/3 | Select cylinder zero, CHS sector four, immediately after the shell sectors. |
| 416 | `10001010` | `8A` | instruction: MOV DL,[0520], byte 1/4 | Restore the real BIOS boot-drive number saved before UART initialization. |
| 417 | `00010110` | `16` | instruction: MOV DL,[0520], byte 2/4 | Restore the real BIOS boot-drive number saved before UART initialization. |
| 418 | `00100000` | `20` | instruction: MOV DL,[0520], byte 3/4 | Restore the real BIOS boot-drive number saved before UART initialization. |
| 419 | `00000101` | `05` | instruction: MOV DL,[0520], byte 4/4 | Restore the real BIOS boot-drive number saved before UART initialization. |
| 420 | `00110000` | `30` | instruction: XOR DH,DH, byte 1/2 | Select disk head zero. |
| 421 | `11110110` | `F6` | instruction: XOR DH,DH, byte 2/2 | Select disk head zero. |
| 422 | `11001101` | `CD` | instruction: INT 13, byte 1/2 | BIOS reads disk sectors four and five into 0000:9000. |
| 423 | `00010011` | `13` | instruction: INT 13, byte 2/2 | BIOS reads disk sectors four and five into 0000:9000. |
| 424 | `01110010` | `72` | instruction: JC disk_error, byte 1/2 | Next offset 426 plus six reaches the error handler at 432; failed reads are never called. |
| 425 | `00000110` | `06` | instruction: JC disk_error, byte 2/2 | Next offset 426 plus six reaches the error handler at 432; failed reads are never called. |
| 426 | `11101000` | `E8` | instruction: CALL 9000, byte 1/3 | Next logical IP 7FAD plus displacement 1053 calls the separately loaded app at 9000. |
| 427 | `01010011` | `53` | instruction: CALL 9000, byte 2/3 | Next logical IP 7FAD plus displacement 1053 calls the separately loaded app at 9000. |
| 428 | `00010000` | `10` | instruction: CALL 9000, byte 3/3 | Next logical IP 7FAD plus displacement 1053 calls the separately loaded app at 9000. |
| 429 | `11101001` | `E9` | instruction: JMP prompt, byte 1/3 | After the app RET, next offset 432 minus 376 returns to the shell prompt. |
| 430 | `10001000` | `88` | instruction: JMP prompt, byte 2/3 | After the app RET, next offset 432 minus 376 returns to the shell prompt. |
| 431 | `11111110` | `FE` | instruction: JMP prompt, byte 3/3 | After the app RET, next offset 432 minus 376 returns to the shell prompt. |
| 432 | `10111110` | `BE` | instruction: MOV SI,8108, byte 1/3 | Disk failure message begins at offset 776. |
| 433 | `00001000` | `08` | instruction: MOV SI,8108, byte 2/3 | Disk failure message begins at offset 776. |
| 434 | `10000001` | `81` | instruction: MOV SI,8108, byte 3/3 | Disk failure message begins at offset 776. |
| 435 | `11101000` | `E8` | instruction: CALL puts, byte 1/3 | Next offset 438 plus 34 reaches puts at 472. |
| 436 | `00100010` | `22` | instruction: CALL puts, byte 2/3 | Next offset 438 plus 34 reaches puts at 472. |
| 437 | `00000000` | `00` | instruction: CALL puts, byte 3/3 | Next offset 438 plus 34 reaches puts at 472. |
| 438 | `11101001` | `E9` | instruction: JMP prompt, byte 1/3 | Next offset 441 minus 385 returns to prompt without executing the failed buffer. |
| 439 | `01111111` | `7F` | instruction: JMP prompt, byte 2/3 | Next offset 441 minus 385 returns to prompt without executing the failed buffer. |
| 440 | `11111110` | `FE` | instruction: JMP prompt, byte 3/3 | Next offset 441 minus 385 returns to prompt without executing the failed buffer. |
| 441 | `10111110` | `BE` | instruction: MOV SI,811B, byte 1/3 | Unknown-command text begins at offset 795. |
| 442 | `00011011` | `1B` | instruction: MOV SI,811B, byte 2/3 | Unknown-command text begins at offset 795. |
| 443 | `10000001` | `81` | instruction: MOV SI,811B, byte 3/3 | Unknown-command text begins at offset 795. |
| 444 | `11101000` | `E8` | instruction: CALL puts, byte 1/3 | Next offset 447 plus 25 reaches puts at 472. |
| 445 | `00011001` | `19` | instruction: CALL puts, byte 2/3 | Next offset 447 plus 25 reaches puts at 472. |
| 446 | `00000000` | `00` | instruction: CALL puts, byte 3/3 | Next offset 447 plus 25 reaches puts at 472. |
| 447 | `11101001` | `E9` | instruction: JMP prompt, byte 1/3 | Next offset 450 minus 394 reaches prompt at 56. |
| 448 | `01110110` | `76` | instruction: JMP prompt, byte 2/3 | Next offset 450 minus 394 reaches prompt at 56. |
| 449 | `11111110` | `FE` | instruction: JMP prompt, byte 3/3 | Next offset 450 minus 394 reaches prompt at 56. |
| 450 | `01010111` | `57` | instruction: PUSH DI, byte 1/1 | Preserve the input cursor during exact command matching. |
| 451 | `10111111` | `BF` | instruction: MOV DI,8200, byte 1/3 | Compare against the beginning of the input buffer. |
| 452 | `00000000` | `00` | instruction: MOV DI,8200, byte 2/3 | Compare against the beginning of the input buffer. |
| 453 | `10000010` | `82` | instruction: MOV DI,8200, byte 3/3 | Compare against the beginning of the input buffer. |
| 454 | `10101100` | `AC` | instruction: LODSB, byte 1/1 | Read a command-table byte and advance SI. |
| 455 | `00111010` | `3A` | instruction: CMP AL,[DI], byte 1/2 | Compare with the actual buffered input byte. |
| 456 | `00000101` | `05` | instruction: CMP AL,[DI], byte 2/2 | Compare with the actual buffered input byte. |
| 457 | `01110101` | `75` | instruction: JNE unequal, byte 1/2 | Next offset 459 plus nine reaches unequal at 468. |
| 458 | `00001001` | `09` | instruction: JNE unequal, byte 2/2 | Next offset 459 plus nine reaches unequal at 468. |
| 459 | `01000111` | `47` | instruction: INC DI, byte 1/1 | Advance to the next input byte. |
| 460 | `10000100` | `84` | instruction: TEST AL,AL, byte 1/2 | NUL matches only if both whole strings ended. |
| 461 | `11000000` | `C0` | instruction: TEST AL,AL, byte 2/2 | NUL matches only if both whole strings ended. |
| 462 | `01110101` | `75` | instruction: JNZ compare_next, byte 1/2 | Next offset 464 minus ten returns to LODSB at 454. |
| 463 | `11110110` | `F6` | instruction: JNZ compare_next, byte 2/2 | Next offset 464 minus ten returns to LODSB at 454. |
| 464 | `01011111` | `5F` | instruction: POP DI, byte 1/1 | Restore the input cursor. |
| 465 | `10110000` | `B0` | instruction: MOV AL,01, byte 1/2 | Return exact-match success. |
| 466 | `00000001` | `01` | instruction: MOV AL,01, byte 2/2 | Return exact-match success. |
| 467 | `11000011` | `C3` | instruction: RET, byte 1/1 | Return to the command dispatcher. |
| 468 | `01011111` | `5F` | instruction: POP DI, byte 1/1 | Restore the cursor on mismatch too. |
| 469 | `00110000` | `30` | instruction: XOR AL,AL, byte 1/2 | Return mismatch as AL=0. |
| 470 | `11000000` | `C0` | instruction: XOR AL,AL, byte 2/2 | Return mismatch as AL=0. |
| 471 | `11000011` | `C3` | instruction: RET, byte 1/1 | Return to the command dispatcher. |
| 472 | `10101100` | `AC` | instruction: LODSB, byte 1/1 | Fetch the next NUL-terminated output byte. |
| 473 | `10000100` | `84` | instruction: TEST AL,AL, byte 1/2 | Test the string terminator. |
| 474 | `11000000` | `C0` | instruction: TEST AL,AL, byte 2/2 | Test the string terminator. |
| 475 | `01110100` | `74` | instruction: JZ puts_done, byte 1/2 | Next offset 477 plus five reaches RET at 482. |
| 476 | `00000101` | `05` | instruction: JZ puts_done, byte 2/2 | Next offset 477 plus five reaches RET at 482. |
| 477 | `11101000` | `E8` | instruction: CALL putc, byte 1/3 | Next offset 480 plus three reaches output at 483. |
| 478 | `00000011` | `03` | instruction: CALL putc, byte 2/3 | Next offset 480 plus three reaches output at 483. |
| 479 | `00000000` | `00` | instruction: CALL putc, byte 3/3 | Next offset 480 plus three reaches output at 483. |
| 480 | `11101011` | `EB` | instruction: JMP puts, byte 1/2 | Next offset 482 minus ten fetches the next byte at 472. |
| 481 | `11110110` | `F6` | instruction: JMP puts, byte 2/2 | Next offset 482 minus ten fetches the next byte at 472. |
| 482 | `11000011` | `C3` | instruction: RET, byte 1/1 | Finish the string procedure. |
| 483 | `01010000` | `50` | instruction: PUSH AX, byte 1/1 | Preserve all general registers used by input, snapshots and output loops. |
| 484 | `01010011` | `53` | instruction: PUSH BX, byte 1/1 | Preserve BX across BIOS output. |
| 485 | `01010001` | `51` | instruction: PUSH CX, byte 1/1 | Preserve loop and input counts. |
| 486 | `01010010` | `52` | instruction: PUSH DX, byte 1/1 | Preserve caller port or disk state. |
| 487 | `01010110` | `56` | instruction: PUSH SI, byte 1/1 | Preserve string and memory pointers. |
| 488 | `01010111` | `57` | instruction: PUSH DI, byte 1/1 | Preserve the input cursor. |
| 489 | `01010000` | `50` | instruction: PUSH AX, byte 1/1 | Preserve the original character for serial output. |
| 490 | `10110100` | `B4` | instruction: MOV AH,0E, byte 1/2 | Select BIOS teletype output. |
| 491 | `00001110` | `0E` | instruction: MOV AH,0E, byte 2/2 | Select BIOS teletype output. |
| 492 | `10111011` | `BB` | instruction: MOV BX,0007, byte 1/3 | Select display page zero and text attribute seven. |
| 493 | `00000111` | `07` | instruction: MOV BX,0007, byte 2/3 | Select display page zero and text attribute seven. |
| 494 | `00000000` | `00` | instruction: MOV BX,0007, byte 3/3 | Select display page zero and text attribute seven. |
| 495 | `11001101` | `CD` | instruction: INT 10, byte 1/2 | Print the actual character on VGA. |
| 496 | `00010000` | `10` | instruction: INT 10, byte 2/2 | Print the actual character on VGA. |
| 497 | `01011000` | `58` | instruction: POP AX, byte 1/1 | Recover the original character. |
| 498 | `01010000` | `50` | instruction: PUSH AX, byte 1/1 | Preserve it while polling COM1 readiness. |
| 499 | `10111010` | `BA` | instruction: MOV DX,03FD, byte 1/3 | Select UART line-status register. |
| 500 | `11111101` | `FD` | instruction: MOV DX,03FD, byte 2/3 | Select UART line-status register. |
| 501 | `00000011` | `03` | instruction: MOV DX,03FD, byte 3/3 | Select UART line-status register. |
| 502 | `11101100` | `EC` | instruction: IN AL,DX, byte 1/1 | Read actual COM1 status. |
| 503 | `10101000` | `A8` | instruction: TEST AL,20, byte 1/2 | Test transmitter-holding-register empty bit five. |
| 504 | `00100000` | `20` | instruction: TEST AL,20, byte 2/2 | Test transmitter-holding-register empty bit five. |
| 505 | `01110100` | `74` | instruction: JZ serial_poll, byte 1/2 | Next offset 507 minus five repeats IN at 502 until ready. |
| 506 | `11111011` | `FB` | instruction: JZ serial_poll, byte 2/2 | Next offset 507 minus five repeats IN at 502 until ready. |
| 507 | `01011000` | `58` | instruction: POP AX, byte 1/1 | Recover the output character after polling. |
| 508 | `10111010` | `BA` | instruction: MOV DX,03F8, byte 1/3 | Select COM1 data register. |
| 509 | `11111000` | `F8` | instruction: MOV DX,03F8, byte 2/3 | Select COM1 data register. |
| 510 | `00000011` | `03` | instruction: MOV DX,03F8, byte 3/3 | Select COM1 data register. |
| 511 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | Emit the same character on serial. |
| 512 | `01011111` | `5F` | instruction: POP DI, byte 1/1 | Restore the input cursor. |
| 513 | `01011110` | `5E` | instruction: POP SI, byte 1/1 | Restore the string pointer. |
| 514 | `01011010` | `5A` | instruction: POP DX, byte 1/1 | Restore DX. |
| 515 | `01011001` | `59` | instruction: POP CX, byte 1/1 | Restore CX. |
| 516 | `01011011` | `5B` | instruction: POP BX, byte 1/1 | Restore BX. |
| 517 | `01011000` | `58` | instruction: POP AX, byte 1/1 | Restore AX. |
| 518 | `11000011` | `C3` | instruction: RET, byte 1/1 | Return to the caller. |
| 519 | `01010000` | `50` | instruction: PUSH AX, byte 1/1 | Preserve the full input byte for its low nibble. |
| 520 | `01010001` | `51` | instruction: PUSH CX, byte 1/1 | Preserve the caller's input or output count. |
| 521 | `10110001` | `B1` | instruction: MOV CL,04, byte 1/2 | Select a four-bit shift. |
| 522 | `00000100` | `04` | instruction: MOV CL,04, byte 2/2 | Select a four-bit shift. |
| 523 | `11010010` | `D2` | instruction: SHR AL,CL, byte 1/2 | Move the high nibble into AL's low four bits. |
| 524 | `11101000` | `E8` | instruction: SHR AL,CL, byte 2/2 | Move the high nibble into AL's low four bits. |
| 525 | `11101000` | `E8` | instruction: CALL nibble, byte 1/3 | Next offset 528 plus four reaches nibble conversion at 532. |
| 526 | `00000100` | `04` | instruction: CALL nibble, byte 2/3 | Next offset 528 plus four reaches nibble conversion at 532. |
| 527 | `00000000` | `00` | instruction: CALL nibble, byte 3/3 | Next offset 528 plus four reaches nibble conversion at 532. |
| 528 | `01011001` | `59` | instruction: POP CX, byte 1/1 | Restore the caller's count. |
| 529 | `01011000` | `58` | instruction: POP AX, byte 1/1 | Restore the original byte. |
| 530 | `00100100` | `24` | instruction: AND AL,0F, byte 1/2 | Select the original low nibble. |
| 531 | `00001111` | `0F` | instruction: AND AL,0F, byte 2/2 | Select the original low nibble. |
| 532 | `00111100` | `3C` | instruction: CMP AL,0A, byte 1/2 | Digits ten through fifteen need alphabetic hex characters. |
| 533 | `00001010` | `0A` | instruction: CMP AL,0A, byte 2/2 | Digits ten through fifteen need alphabetic hex characters. |
| 534 | `01110010` | `72` | instruction: JB decimal_digit, byte 1/2 | Next offset 536 plus two skips the alphabetic adjustment. |
| 535 | `00000010` | `02` | instruction: JB decimal_digit, byte 2/2 | Next offset 536 plus two skips the alphabetic adjustment. |
| 536 | `00000100` | `04` | instruction: ADD AL,07, byte 1/2 | Convert ten through fifteen toward A through F. |
| 537 | `00000111` | `07` | instruction: ADD AL,07, byte 2/2 | Convert ten through fifteen toward A through F. |
| 538 | `00000100` | `04` | instruction: ADD AL,30, byte 1/2 | Add ASCII zero to produce the hex character. |
| 539 | `00110000` | `30` | instruction: ADD AL,30, byte 2/2 | Add ASCII zero to produce the hex character. |
| 540 | `11101001` | `E9` | instruction: JMP putc, byte 1/3 | Tail-call output: next offset 543 minus 60 reaches putc at 483. |
| 541 | `11000100` | `C4` | instruction: JMP putc, byte 2/3 | Tail-call output: next offset 543 minus 60 reaches putc at 483. |
| 542 | `11111111` | `FF` | instruction: JMP putc, byte 3/3 | Tail-call output: next offset 543 minus 60 reaches putc at 483. |
| 543 | `01010000` | `50` | instruction: PUSH AX, byte 1/1 | Preserve the word while displaying its high byte first. |
| 544 | `10001000` | `88` | instruction: MOV AL,AH, byte 1/2 | Select the high byte of the word. |
| 545 | `11100000` | `E0` | instruction: MOV AL,AH, byte 2/2 | Select the high byte of the word. |
| 546 | `11101000` | `E8` | instruction: CALL hex, byte 1/3 | Next offset 549 minus 30 reaches hex at 519. |
| 547 | `11100010` | `E2` | instruction: CALL hex, byte 2/3 | Next offset 549 minus 30 reaches hex at 519. |
| 548 | `11111111` | `FF` | instruction: CALL hex, byte 3/3 | Next offset 549 minus 30 reaches hex at 519. |
| 549 | `01011000` | `58` | instruction: POP AX, byte 1/1 | Restore the original word to select its low byte. |
| 550 | `11101000` | `E8` | instruction: CALL hex, byte 1/3 | Next offset 553 minus 34 reaches hex at 519. |
| 551 | `11011110` | `DE` | instruction: CALL hex, byte 2/3 | Next offset 553 minus 34 reaches hex at 519. |
| 552 | `11111111` | `FF` | instruction: CALL hex, byte 3/3 | Next offset 553 minus 34 reaches hex at 519. |
| 553 | `11000011` | `C3` | instruction: RET, byte 1/1 | Finish the four-digit hexadecimal word. |
| 554 | `01100010` | `62` | data: bitborn shell CR LF NUL, byte 1/16 | Banner begins at offset 554, physical 802A. |
| 555 | `01101001` | `69` | data: bitborn shell CR LF NUL, byte 2/16 | Banner begins at offset 554, physical 802A. |
| 556 | `01110100` | `74` | data: bitborn shell CR LF NUL, byte 3/16 | Banner begins at offset 554, physical 802A. |
| 557 | `01100010` | `62` | data: bitborn shell CR LF NUL, byte 4/16 | Banner begins at offset 554, physical 802A. |
| 558 | `01101111` | `6F` | data: bitborn shell CR LF NUL, byte 5/16 | Banner begins at offset 554, physical 802A. |
| 559 | `01110010` | `72` | data: bitborn shell CR LF NUL, byte 6/16 | Banner begins at offset 554, physical 802A. |
| 560 | `01101110` | `6E` | data: bitborn shell CR LF NUL, byte 7/16 | Banner begins at offset 554, physical 802A. |
| 561 | `00100000` | `20` | data: bitborn shell CR LF NUL, byte 8/16 | Banner begins at offset 554, physical 802A. |
| 562 | `01110011` | `73` | data: bitborn shell CR LF NUL, byte 9/16 | Banner begins at offset 554, physical 802A. |
| 563 | `01101000` | `68` | data: bitborn shell CR LF NUL, byte 10/16 | Banner begins at offset 554, physical 802A. |
| 564 | `01100101` | `65` | data: bitborn shell CR LF NUL, byte 11/16 | Banner begins at offset 554, physical 802A. |
| 565 | `01101100` | `6C` | data: bitborn shell CR LF NUL, byte 12/16 | Banner begins at offset 554, physical 802A. |
| 566 | `01101100` | `6C` | data: bitborn shell CR LF NUL, byte 13/16 | Banner begins at offset 554, physical 802A. |
| 567 | `00001101` | `0D` | data: bitborn shell CR LF NUL, byte 14/16 | Banner begins at offset 554, physical 802A. |
| 568 | `00001010` | `0A` | data: bitborn shell CR LF NUL, byte 15/16 | Banner begins at offset 554, physical 802A. |
| 569 | `00000000` | `00` | data: bitborn shell CR LF NUL, byte 16/16 | Banner begins at offset 554, physical 802A. |
| 570 | `00111110` | `3E` | data: prompt, byte 1/3 | Offset 570, physical 803A. |
| 571 | `00100000` | `20` | data: prompt, byte 2/3 | Offset 570, physical 803A. |
| 572 | `00000000` | `00` | data: prompt, byte 3/3 | Offset 570, physical 803A. |
| 573 | `00001101` | `0D` | data: newline, byte 1/3 | Offset 573, physical 803D. |
| 574 | `00001010` | `0A` | data: newline, byte 2/3 | Offset 573, physical 803D. |
| 575 | `00000000` | `00` | data: newline, byte 3/3 | Offset 573, physical 803D. |
| 576 | `01101000` | `68` | data: help, byte 1/5 | Offset 576, physical 8040. |
| 577 | `01100101` | `65` | data: help, byte 2/5 | Offset 576, physical 8040. |
| 578 | `01101100` | `6C` | data: help, byte 3/5 | Offset 576, physical 8040. |
| 579 | `01110000` | `70` | data: help, byte 4/5 | Offset 576, physical 8040. |
| 580 | `00000000` | `00` | data: help, byte 5/5 | Offset 576, physical 8040. |
| 581 | `01100001` | `61` | data: about, byte 1/6 | Offset 581, physical 8045. |
| 582 | `01100010` | `62` | data: about, byte 2/6 | Offset 581, physical 8045. |
| 583 | `01101111` | `6F` | data: about, byte 3/6 | Offset 581, physical 8045. |
| 584 | `01110101` | `75` | data: about, byte 4/6 | Offset 581, physical 8045. |
| 585 | `01110100` | `74` | data: about, byte 5/6 | Offset 581, physical 8045. |
| 586 | `00000000` | `00` | data: about, byte 6/6 | Offset 581, physical 8045. |
| 587 | `01100011` | `63` | data: clear, byte 1/6 | Offset 587, physical 804B. |
| 588 | `01101100` | `6C` | data: clear, byte 2/6 | Offset 587, physical 804B. |
| 589 | `01100101` | `65` | data: clear, byte 3/6 | Offset 587, physical 804B. |
| 590 | `01100001` | `61` | data: clear, byte 4/6 | Offset 587, physical 804B. |
| 591 | `01110010` | `72` | data: clear, byte 5/6 | Offset 587, physical 804B. |
| 592 | `00000000` | `00` | data: clear, byte 6/6 | Offset 587, physical 804B. |
| 593 | `01110010` | `72` | data: reboot, byte 1/7 | Offset 593, physical 8051. |
| 594 | `01100101` | `65` | data: reboot, byte 2/7 | Offset 593, physical 8051. |
| 595 | `01100010` | `62` | data: reboot, byte 3/7 | Offset 593, physical 8051. |
| 596 | `01101111` | `6F` | data: reboot, byte 4/7 | Offset 593, physical 8051. |
| 597 | `01101111` | `6F` | data: reboot, byte 5/7 | Offset 593, physical 8051. |
| 598 | `01110100` | `74` | data: reboot, byte 6/7 | Offset 593, physical 8051. |
| 599 | `00000000` | `00` | data: reboot, byte 7/7 | Offset 593, physical 8051. |
| 600 | `01110010` | `72` | data: read, byte 1/5 | Offset 600, physical 8058. |
| 601 | `01100101` | `65` | data: read, byte 2/5 | Offset 600, physical 8058. |
| 602 | `01100001` | `61` | data: read, byte 3/5 | Offset 600, physical 8058. |
| 603 | `01100100` | `64` | data: read, byte 4/5 | Offset 600, physical 8058. |
| 604 | `00000000` | `00` | data: read, byte 5/5 | Offset 600, physical 8058. |
| 605 | `01110111` | `77` | data: write, byte 1/6 | Offset 605, physical 805D. |
| 606 | `01110010` | `72` | data: write, byte 2/6 | Offset 605, physical 805D. |
| 607 | `01101001` | `69` | data: write, byte 3/6 | Offset 605, physical 805D. |
| 608 | `01110100` | `74` | data: write, byte 4/6 | Offset 605, physical 805D. |
| 609 | `01100101` | `65` | data: write, byte 5/6 | Offset 605, physical 805D. |
| 610 | `00000000` | `00` | data: write, byte 6/6 | Offset 605, physical 805D. |
| 611 | `01100100` | `64` | data: dump, byte 1/5 | Offset 611, physical 8063. |
| 612 | `01110101` | `75` | data: dump, byte 2/5 | Offset 611, physical 8063. |
| 613 | `01101101` | `6D` | data: dump, byte 3/5 | Offset 611, physical 8063. |
| 614 | `01110000` | `70` | data: dump, byte 4/5 | Offset 611, physical 8063. |
| 615 | `00000000` | `00` | data: dump, byte 5/5 | Offset 611, physical 8063. |
| 616 | `01110010` | `72` | data: regs, byte 1/5 | Offset 616, physical 8068. |
| 617 | `01100101` | `65` | data: regs, byte 2/5 | Offset 616, physical 8068. |
| 618 | `01100111` | `67` | data: regs, byte 3/5 | Offset 616, physical 8068. |
| 619 | `01110011` | `73` | data: regs, byte 4/5 | Offset 616, physical 8068. |
| 620 | `00000000` | `00` | data: regs, byte 5/5 | Offset 616, physical 8068. |
| 621 | `01110010` | `72` | data: run, byte 1/4 | Offset 621, physical 806D. |
| 622 | `01110101` | `75` | data: run, byte 2/4 | Offset 621, physical 806D. |
| 623 | `01101110` | `6E` | data: run, byte 3/4 | Offset 621, physical 806D. |
| 624 | `00000000` | `00` | data: run, byte 4/4 | Offset 621, physical 806D. |
| 625 | `01101000` | `68` | data: help text, byte 1/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 626 | `01100101` | `65` | data: help text, byte 2/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 627 | `01101100` | `6C` | data: help text, byte 3/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 628 | `01110000` | `70` | data: help text, byte 4/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 629 | `00100000` | `20` | data: help text, byte 5/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 630 | `01100001` | `61` | data: help text, byte 6/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 631 | `01100010` | `62` | data: help text, byte 7/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 632 | `01101111` | `6F` | data: help text, byte 8/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 633 | `01110101` | `75` | data: help text, byte 9/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 634 | `01110100` | `74` | data: help text, byte 10/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 635 | `00100000` | `20` | data: help text, byte 11/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 636 | `01100011` | `63` | data: help text, byte 12/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 637 | `01101100` | `6C` | data: help text, byte 13/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 638 | `01100101` | `65` | data: help text, byte 14/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 639 | `01100001` | `61` | data: help text, byte 15/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 640 | `01110010` | `72` | data: help text, byte 16/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 641 | `00100000` | `20` | data: help text, byte 17/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 642 | `01110010` | `72` | data: help text, byte 18/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 643 | `01100101` | `65` | data: help text, byte 19/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 644 | `01100010` | `62` | data: help text, byte 20/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 645 | `01101111` | `6F` | data: help text, byte 21/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 646 | `01101111` | `6F` | data: help text, byte 22/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 647 | `01110100` | `74` | data: help text, byte 23/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 648 | `00100000` | `20` | data: help text, byte 24/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 649 | `01100100` | `64` | data: help text, byte 25/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 650 | `01110101` | `75` | data: help text, byte 26/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 651 | `01101101` | `6D` | data: help text, byte 27/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 652 | `01110000` | `70` | data: help text, byte 28/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 653 | `00100000` | `20` | data: help text, byte 29/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 654 | `01110010` | `72` | data: help text, byte 30/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 655 | `01100101` | `65` | data: help text, byte 31/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 656 | `01100111` | `67` | data: help text, byte 32/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 657 | `01110011` | `73` | data: help text, byte 33/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 658 | `00100000` | `20` | data: help text, byte 34/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 659 | `01110111` | `77` | data: help text, byte 35/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 660 | `01110010` | `72` | data: help text, byte 36/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 661 | `01101001` | `69` | data: help text, byte 37/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 662 | `01110100` | `74` | data: help text, byte 38/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 663 | `01100101` | `65` | data: help text, byte 39/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 664 | `00100000` | `20` | data: help text, byte 40/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 665 | `01110010` | `72` | data: help text, byte 41/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 666 | `01100101` | `65` | data: help text, byte 42/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 667 | `01100001` | `61` | data: help text, byte 43/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 668 | `01100100` | `64` | data: help text, byte 44/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 669 | `00100000` | `20` | data: help text, byte 45/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 670 | `01110010` | `72` | data: help text, byte 46/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 671 | `01110101` | `75` | data: help text, byte 47/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 672 | `01101110` | `6E` | data: help text, byte 48/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 673 | `00001101` | `0D` | data: help text, byte 49/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 674 | `00001010` | `0A` | data: help text, byte 50/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 675 | `00000000` | `00` | data: help text, byte 51/51 | Nine supported exact lowercase commands, starting at offset 625. |
| 676 | `01010010` | `52` | data: about text, byte 1/37 | Offset 676, physical 80A4; truthful scope rather than an OS claim. |
| 677 | `01100001` | `61` | data: about text, byte 2/37 | Offset 676, physical 80A4; truthful scope rather than an OS claim. |
| 678 | `01110111` | `77` | data: about text, byte 3/37 | Offset 676, physical 80A4; truthful scope rather than an OS claim. |
| 679 | `00100000` | `20` | data: about text, byte 4/37 | Offset 676, physical 80A4; truthful scope rather than an OS claim. |
| 680 | `01100010` | `62` | data: about text, byte 5/37 | Offset 676, physical 80A4; truthful scope rather than an OS claim. |
| 681 | `01101001` | `69` | data: about text, byte 6/37 | Offset 676, physical 80A4; truthful scope rather than an OS claim. |
| 682 | `01110100` | `74` | data: about text, byte 7/37 | Offset 676, physical 80A4; truthful scope rather than an OS claim. |
| 683 | `01110011` | `73` | data: about text, byte 8/37 | Offset 676, physical 80A4; truthful scope rather than an OS claim. |
| 684 | `00101110` | `2E` | data: about text, byte 9/37 | Offset 676, physical 80A4; truthful scope rather than an OS claim. |
| 685 | `00100000` | `20` | data: about text, byte 10/37 | Offset 676, physical 80A4; truthful scope rather than an OS claim. |
| 686 | `01000010` | `42` | data: about text, byte 11/37 | Offset 676, physical 80A4; truthful scope rather than an OS claim. |
| 687 | `01001001` | `49` | data: about text, byte 12/37 | Offset 676, physical 80A4; truthful scope rather than an OS claim. |
| 688 | `01001111` | `4F` | data: about text, byte 13/37 | Offset 676, physical 80A4; truthful scope rather than an OS claim. |
| 689 | `01010011` | `53` | data: about text, byte 14/37 | Offset 676, physical 80A4; truthful scope rather than an OS claim. |
| 690 | `00101110` | `2E` | data: about text, byte 15/37 | Offset 676, physical 80A4; truthful scope rather than an OS claim. |
| 691 | `00100000` | `20` | data: about text, byte 16/37 | Offset 676, physical 80A4; truthful scope rather than an OS claim. |
| 692 | `01010011` | `53` | data: about text, byte 17/37 | Offset 676, physical 80A4; truthful scope rather than an OS claim. |
| 693 | `01100101` | `65` | data: about text, byte 18/37 | Offset 676, physical 80A4; truthful scope rather than an OS claim. |
| 694 | `01110000` | `70` | data: about text, byte 19/37 | Offset 676, physical 80A4; truthful scope rather than an OS claim. |
| 695 | `01100001` | `61` | data: about text, byte 20/37 | Offset 676, physical 80A4; truthful scope rather than an OS claim. |
| 696 | `01110010` | `72` | data: about text, byte 21/37 | Offset 676, physical 80A4; truthful scope rather than an OS claim. |
| 697 | `01100001` | `61` | data: about text, byte 22/37 | Offset 676, physical 80A4; truthful scope rather than an OS claim. |
| 698 | `01110100` | `74` | data: about text, byte 23/37 | Offset 676, physical 80A4; truthful scope rather than an OS claim. |
| 699 | `01100101` | `65` | data: about text, byte 24/37 | Offset 676, physical 80A4; truthful scope rather than an OS claim. |
| 700 | `00100000` | `20` | data: about text, byte 25/37 | Offset 676, physical 80A4; truthful scope rather than an OS claim. |
| 701 | `01100100` | `64` | data: about text, byte 26/37 | Offset 676, physical 80A4; truthful scope rather than an OS claim. |
| 702 | `01101001` | `69` | data: about text, byte 27/37 | Offset 676, physical 80A4; truthful scope rather than an OS claim. |
| 703 | `01110011` | `73` | data: about text, byte 28/37 | Offset 676, physical 80A4; truthful scope rather than an OS claim. |
| 704 | `01101011` | `6B` | data: about text, byte 29/37 | Offset 676, physical 80A4; truthful scope rather than an OS claim. |
| 705 | `00100000` | `20` | data: about text, byte 30/37 | Offset 676, physical 80A4; truthful scope rather than an OS claim. |
| 706 | `01100001` | `61` | data: about text, byte 31/37 | Offset 676, physical 80A4; truthful scope rather than an OS claim. |
| 707 | `01110000` | `70` | data: about text, byte 32/37 | Offset 676, physical 80A4; truthful scope rather than an OS claim. |
| 708 | `01110000` | `70` | data: about text, byte 33/37 | Offset 676, physical 80A4; truthful scope rather than an OS claim. |
| 709 | `00101110` | `2E` | data: about text, byte 34/37 | Offset 676, physical 80A4; truthful scope rather than an OS claim. |
| 710 | `00001101` | `0D` | data: about text, byte 35/37 | Offset 676, physical 80A4; truthful scope rather than an OS claim. |
| 711 | `00001010` | `0A` | data: about text, byte 36/37 | Offset 676, physical 80A4; truthful scope rather than an OS claim. |
| 712 | `00000000` | `00` | data: about text, byte 37/37 | Offset 676, physical 80A4; truthful scope rather than an OS claim. |
| 713 | `00110000` | `30` | data: 0600 address prefix, byte 1/7 | Offset 713, physical 80C9. |
| 714 | `00110110` | `36` | data: 0600 address prefix, byte 2/7 | Offset 713, physical 80C9. |
| 715 | `00110000` | `30` | data: 0600 address prefix, byte 3/7 | Offset 713, physical 80C9. |
| 716 | `00110000` | `30` | data: 0600 address prefix, byte 4/7 | Offset 713, physical 80C9. |
| 717 | `00111010` | `3A` | data: 0600 address prefix, byte 5/7 | Offset 713, physical 80C9. |
| 718 | `00100000` | `20` | data: 0600 address prefix, byte 6/7 | Offset 713, physical 80C9. |
| 719 | `00000000` | `00` | data: 0600 address prefix, byte 7/7 | Offset 713, physical 80C9. |
| 720 | `01010010` | `52` | data: RAM[0600]=2A CR LF NUL, byte 1/15 | Offset 720, physical 80D0, confirming the actual fixed write. |
| 721 | `01000001` | `41` | data: RAM[0600]=2A CR LF NUL, byte 2/15 | Offset 720, physical 80D0, confirming the actual fixed write. |
| 722 | `01001101` | `4D` | data: RAM[0600]=2A CR LF NUL, byte 3/15 | Offset 720, physical 80D0, confirming the actual fixed write. |
| 723 | `01011011` | `5B` | data: RAM[0600]=2A CR LF NUL, byte 4/15 | Offset 720, physical 80D0, confirming the actual fixed write. |
| 724 | `00110000` | `30` | data: RAM[0600]=2A CR LF NUL, byte 5/15 | Offset 720, physical 80D0, confirming the actual fixed write. |
| 725 | `00110110` | `36` | data: RAM[0600]=2A CR LF NUL, byte 6/15 | Offset 720, physical 80D0, confirming the actual fixed write. |
| 726 | `00110000` | `30` | data: RAM[0600]=2A CR LF NUL, byte 7/15 | Offset 720, physical 80D0, confirming the actual fixed write. |
| 727 | `00110000` | `30` | data: RAM[0600]=2A CR LF NUL, byte 8/15 | Offset 720, physical 80D0, confirming the actual fixed write. |
| 728 | `01011101` | `5D` | data: RAM[0600]=2A CR LF NUL, byte 9/15 | Offset 720, physical 80D0, confirming the actual fixed write. |
| 729 | `00111101` | `3D` | data: RAM[0600]=2A CR LF NUL, byte 10/15 | Offset 720, physical 80D0, confirming the actual fixed write. |
| 730 | `00110010` | `32` | data: RAM[0600]=2A CR LF NUL, byte 11/15 | Offset 720, physical 80D0, confirming the actual fixed write. |
| 731 | `01000001` | `41` | data: RAM[0600]=2A CR LF NUL, byte 12/15 | Offset 720, physical 80D0, confirming the actual fixed write. |
| 732 | `00001101` | `0D` | data: RAM[0600]=2A CR LF NUL, byte 13/15 | Offset 720, physical 80D0, confirming the actual fixed write. |
| 733 | `00001010` | `0A` | data: RAM[0600]=2A CR LF NUL, byte 14/15 | Offset 720, physical 80D0, confirming the actual fixed write. |
| 734 | `00000000` | `00` | data: RAM[0600]=2A CR LF NUL, byte 15/15 | Offset 720, physical 80D0, confirming the actual fixed write. |
| 735 | `01000001` | `41` | data: AX BX CX DX SP BP SI DI CS DS ES SS FL, byte 1/41 | Offset 735, physical 80DF; columns correspond to captured words 0500 through 0518. |
| 736 | `01011000` | `58` | data: AX BX CX DX SP BP SI DI CS DS ES SS FL, byte 2/41 | Offset 735, physical 80DF; columns correspond to captured words 0500 through 0518. |
| 737 | `00100000` | `20` | data: AX BX CX DX SP BP SI DI CS DS ES SS FL, byte 3/41 | Offset 735, physical 80DF; columns correspond to captured words 0500 through 0518. |
| 738 | `01000010` | `42` | data: AX BX CX DX SP BP SI DI CS DS ES SS FL, byte 4/41 | Offset 735, physical 80DF; columns correspond to captured words 0500 through 0518. |
| 739 | `01011000` | `58` | data: AX BX CX DX SP BP SI DI CS DS ES SS FL, byte 5/41 | Offset 735, physical 80DF; columns correspond to captured words 0500 through 0518. |
| 740 | `00100000` | `20` | data: AX BX CX DX SP BP SI DI CS DS ES SS FL, byte 6/41 | Offset 735, physical 80DF; columns correspond to captured words 0500 through 0518. |
| 741 | `01000011` | `43` | data: AX BX CX DX SP BP SI DI CS DS ES SS FL, byte 7/41 | Offset 735, physical 80DF; columns correspond to captured words 0500 through 0518. |
| 742 | `01011000` | `58` | data: AX BX CX DX SP BP SI DI CS DS ES SS FL, byte 8/41 | Offset 735, physical 80DF; columns correspond to captured words 0500 through 0518. |
| 743 | `00100000` | `20` | data: AX BX CX DX SP BP SI DI CS DS ES SS FL, byte 9/41 | Offset 735, physical 80DF; columns correspond to captured words 0500 through 0518. |
| 744 | `01000100` | `44` | data: AX BX CX DX SP BP SI DI CS DS ES SS FL, byte 10/41 | Offset 735, physical 80DF; columns correspond to captured words 0500 through 0518. |
| 745 | `01011000` | `58` | data: AX BX CX DX SP BP SI DI CS DS ES SS FL, byte 11/41 | Offset 735, physical 80DF; columns correspond to captured words 0500 through 0518. |
| 746 | `00100000` | `20` | data: AX BX CX DX SP BP SI DI CS DS ES SS FL, byte 12/41 | Offset 735, physical 80DF; columns correspond to captured words 0500 through 0518. |
| 747 | `01010011` | `53` | data: AX BX CX DX SP BP SI DI CS DS ES SS FL, byte 13/41 | Offset 735, physical 80DF; columns correspond to captured words 0500 through 0518. |
| 748 | `01010000` | `50` | data: AX BX CX DX SP BP SI DI CS DS ES SS FL, byte 14/41 | Offset 735, physical 80DF; columns correspond to captured words 0500 through 0518. |
| 749 | `00100000` | `20` | data: AX BX CX DX SP BP SI DI CS DS ES SS FL, byte 15/41 | Offset 735, physical 80DF; columns correspond to captured words 0500 through 0518. |
| 750 | `01000010` | `42` | data: AX BX CX DX SP BP SI DI CS DS ES SS FL, byte 16/41 | Offset 735, physical 80DF; columns correspond to captured words 0500 through 0518. |
| 751 | `01010000` | `50` | data: AX BX CX DX SP BP SI DI CS DS ES SS FL, byte 17/41 | Offset 735, physical 80DF; columns correspond to captured words 0500 through 0518. |
| 752 | `00100000` | `20` | data: AX BX CX DX SP BP SI DI CS DS ES SS FL, byte 18/41 | Offset 735, physical 80DF; columns correspond to captured words 0500 through 0518. |
| 753 | `01010011` | `53` | data: AX BX CX DX SP BP SI DI CS DS ES SS FL, byte 19/41 | Offset 735, physical 80DF; columns correspond to captured words 0500 through 0518. |
| 754 | `01001001` | `49` | data: AX BX CX DX SP BP SI DI CS DS ES SS FL, byte 20/41 | Offset 735, physical 80DF; columns correspond to captured words 0500 through 0518. |
| 755 | `00100000` | `20` | data: AX BX CX DX SP BP SI DI CS DS ES SS FL, byte 21/41 | Offset 735, physical 80DF; columns correspond to captured words 0500 through 0518. |
| 756 | `01000100` | `44` | data: AX BX CX DX SP BP SI DI CS DS ES SS FL, byte 22/41 | Offset 735, physical 80DF; columns correspond to captured words 0500 through 0518. |
| 757 | `01001001` | `49` | data: AX BX CX DX SP BP SI DI CS DS ES SS FL, byte 23/41 | Offset 735, physical 80DF; columns correspond to captured words 0500 through 0518. |
| 758 | `00100000` | `20` | data: AX BX CX DX SP BP SI DI CS DS ES SS FL, byte 24/41 | Offset 735, physical 80DF; columns correspond to captured words 0500 through 0518. |
| 759 | `01000011` | `43` | data: AX BX CX DX SP BP SI DI CS DS ES SS FL, byte 25/41 | Offset 735, physical 80DF; columns correspond to captured words 0500 through 0518. |
| 760 | `01010011` | `53` | data: AX BX CX DX SP BP SI DI CS DS ES SS FL, byte 26/41 | Offset 735, physical 80DF; columns correspond to captured words 0500 through 0518. |
| 761 | `00100000` | `20` | data: AX BX CX DX SP BP SI DI CS DS ES SS FL, byte 27/41 | Offset 735, physical 80DF; columns correspond to captured words 0500 through 0518. |
| 762 | `01000100` | `44` | data: AX BX CX DX SP BP SI DI CS DS ES SS FL, byte 28/41 | Offset 735, physical 80DF; columns correspond to captured words 0500 through 0518. |
| 763 | `01010011` | `53` | data: AX BX CX DX SP BP SI DI CS DS ES SS FL, byte 29/41 | Offset 735, physical 80DF; columns correspond to captured words 0500 through 0518. |
| 764 | `00100000` | `20` | data: AX BX CX DX SP BP SI DI CS DS ES SS FL, byte 30/41 | Offset 735, physical 80DF; columns correspond to captured words 0500 through 0518. |
| 765 | `01000101` | `45` | data: AX BX CX DX SP BP SI DI CS DS ES SS FL, byte 31/41 | Offset 735, physical 80DF; columns correspond to captured words 0500 through 0518. |
| 766 | `01010011` | `53` | data: AX BX CX DX SP BP SI DI CS DS ES SS FL, byte 32/41 | Offset 735, physical 80DF; columns correspond to captured words 0500 through 0518. |
| 767 | `00100000` | `20` | data: AX BX CX DX SP BP SI DI CS DS ES SS FL, byte 33/41 | Offset 735, physical 80DF; columns correspond to captured words 0500 through 0518. |
| 768 | `01010011` | `53` | data: AX BX CX DX SP BP SI DI CS DS ES SS FL, byte 34/41 | Offset 735, physical 80DF; columns correspond to captured words 0500 through 0518. |
| 769 | `01010011` | `53` | data: AX BX CX DX SP BP SI DI CS DS ES SS FL, byte 35/41 | Offset 735, physical 80DF; columns correspond to captured words 0500 through 0518. |
| 770 | `00100000` | `20` | data: AX BX CX DX SP BP SI DI CS DS ES SS FL, byte 36/41 | Offset 735, physical 80DF; columns correspond to captured words 0500 through 0518. |
| 771 | `01000110` | `46` | data: AX BX CX DX SP BP SI DI CS DS ES SS FL, byte 37/41 | Offset 735, physical 80DF; columns correspond to captured words 0500 through 0518. |
| 772 | `01001100` | `4C` | data: AX BX CX DX SP BP SI DI CS DS ES SS FL, byte 38/41 | Offset 735, physical 80DF; columns correspond to captured words 0500 through 0518. |
| 773 | `00001101` | `0D` | data: AX BX CX DX SP BP SI DI CS DS ES SS FL, byte 39/41 | Offset 735, physical 80DF; columns correspond to captured words 0500 through 0518. |
| 774 | `00001010` | `0A` | data: AX BX CX DX SP BP SI DI CS DS ES SS FL, byte 40/41 | Offset 735, physical 80DF; columns correspond to captured words 0500 through 0518. |
| 775 | `00000000` | `00` | data: AX BX CX DX SP BP SI DI CS DS ES SS FL, byte 41/41 | Offset 735, physical 80DF; columns correspond to captured words 0500 through 0518. |
| 776 | `01000100` | `44` | data: Disk read failed CR LF NUL, byte 1/19 | Offset 776, physical 8108. |
| 777 | `01101001` | `69` | data: Disk read failed CR LF NUL, byte 2/19 | Offset 776, physical 8108. |
| 778 | `01110011` | `73` | data: Disk read failed CR LF NUL, byte 3/19 | Offset 776, physical 8108. |
| 779 | `01101011` | `6B` | data: Disk read failed CR LF NUL, byte 4/19 | Offset 776, physical 8108. |
| 780 | `00100000` | `20` | data: Disk read failed CR LF NUL, byte 5/19 | Offset 776, physical 8108. |
| 781 | `01110010` | `72` | data: Disk read failed CR LF NUL, byte 6/19 | Offset 776, physical 8108. |
| 782 | `01100101` | `65` | data: Disk read failed CR LF NUL, byte 7/19 | Offset 776, physical 8108. |
| 783 | `01100001` | `61` | data: Disk read failed CR LF NUL, byte 8/19 | Offset 776, physical 8108. |
| 784 | `01100100` | `64` | data: Disk read failed CR LF NUL, byte 9/19 | Offset 776, physical 8108. |
| 785 | `00100000` | `20` | data: Disk read failed CR LF NUL, byte 10/19 | Offset 776, physical 8108. |
| 786 | `01100110` | `66` | data: Disk read failed CR LF NUL, byte 11/19 | Offset 776, physical 8108. |
| 787 | `01100001` | `61` | data: Disk read failed CR LF NUL, byte 12/19 | Offset 776, physical 8108. |
| 788 | `01101001` | `69` | data: Disk read failed CR LF NUL, byte 13/19 | Offset 776, physical 8108. |
| 789 | `01101100` | `6C` | data: Disk read failed CR LF NUL, byte 14/19 | Offset 776, physical 8108. |
| 790 | `01100101` | `65` | data: Disk read failed CR LF NUL, byte 15/19 | Offset 776, physical 8108. |
| 791 | `01100100` | `64` | data: Disk read failed CR LF NUL, byte 16/19 | Offset 776, physical 8108. |
| 792 | `00001101` | `0D` | data: Disk read failed CR LF NUL, byte 17/19 | Offset 776, physical 8108. |
| 793 | `00001010` | `0A` | data: Disk read failed CR LF NUL, byte 18/19 | Offset 776, physical 8108. |
| 794 | `00000000` | `00` | data: Disk read failed CR LF NUL, byte 19/19 | Offset 776, physical 8108. |
| 795 | `01010101` | `55` | data: Unknown command CR LF NUL, byte 1/18 | Offset 795, physical 811B. |
| 796 | `01101110` | `6E` | data: Unknown command CR LF NUL, byte 2/18 | Offset 795, physical 811B. |
| 797 | `01101011` | `6B` | data: Unknown command CR LF NUL, byte 3/18 | Offset 795, physical 811B. |
| 798 | `01101110` | `6E` | data: Unknown command CR LF NUL, byte 4/18 | Offset 795, physical 811B. |
| 799 | `01101111` | `6F` | data: Unknown command CR LF NUL, byte 5/18 | Offset 795, physical 811B. |
| 800 | `01110111` | `77` | data: Unknown command CR LF NUL, byte 6/18 | Offset 795, physical 811B. |
| 801 | `01101110` | `6E` | data: Unknown command CR LF NUL, byte 7/18 | Offset 795, physical 811B. |
| 802 | `00100000` | `20` | data: Unknown command CR LF NUL, byte 8/18 | Offset 795, physical 811B. |
| 803 | `01100011` | `63` | data: Unknown command CR LF NUL, byte 9/18 | Offset 795, physical 811B. |
| 804 | `01101111` | `6F` | data: Unknown command CR LF NUL, byte 10/18 | Offset 795, physical 811B. |
| 805 | `01101101` | `6D` | data: Unknown command CR LF NUL, byte 11/18 | Offset 795, physical 811B. |
| 806 | `01101101` | `6D` | data: Unknown command CR LF NUL, byte 12/18 | Offset 795, physical 811B. |
| 807 | `01100001` | `61` | data: Unknown command CR LF NUL, byte 13/18 | Offset 795, physical 811B. |
| 808 | `01101110` | `6E` | data: Unknown command CR LF NUL, byte 14/18 | Offset 795, physical 811B. |
| 809 | `01100100` | `64` | data: Unknown command CR LF NUL, byte 15/18 | Offset 795, physical 811B. |
| 810 | `00001101` | `0D` | data: Unknown command CR LF NUL, byte 16/18 | Offset 795, physical 811B. |
| 811 | `00001010` | `0A` | data: Unknown command CR LF NUL, byte 17/18 | Offset 795, physical 811B. |
| 812 | `00000000` | `00` | data: Unknown command CR LF NUL, byte 18/18 | Offset 795, physical 811B. |
