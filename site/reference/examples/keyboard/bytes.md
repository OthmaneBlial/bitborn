# Every byte explained

Generated from canonical `.bits` annotations by `python3 tools/byte_tables.py`.

Instruction names below are disassembly for explanation, never code-generation input.

| Offset | Binary | Hex | Range / byte within it | Encoding explanation |
| --- | --- | --- | --- | --- |
| 0 | `11111010` | `FA` | instruction: CLI, byte 1/1 | FA disables interrupts while establishing a stack. |
| 1 | `11101010` | `EA` | instruction: JMP 0000:7C06, byte 1/5 | EA offset 7C06, segment 0000; normalize CS. |
| 2 | `00000110` | `06` | instruction: JMP 0000:7C06, byte 2/5 | EA offset 7C06, segment 0000; normalize CS. |
| 3 | `01111100` | `7C` | instruction: JMP 0000:7C06, byte 3/5 | EA offset 7C06, segment 0000; normalize CS. |
| 4 | `00000000` | `00` | instruction: JMP 0000:7C06, byte 4/5 | EA offset 7C06, segment 0000; normalize CS. |
| 5 | `00000000` | `00` | instruction: JMP 0000:7C06, byte 5/5 | EA offset 7C06, segment 0000; normalize CS. |
| 6 | `00110001` | `31` | instruction: XOR AX,AX, byte 1/2 | 31 /r C0 clears AX. |
| 7 | `11000000` | `C0` | instruction: XOR AX,AX, byte 2/2 | 31 /r C0 clears AX. |
| 8 | `10001110` | `8E` | instruction: MOV DS,AX, byte 1/2 | 8E D8 sets DS=0. |
| 9 | `11011000` | `D8` | instruction: MOV DS,AX, byte 2/2 | 8E D8 sets DS=0. |
| 10 | `10001110` | `8E` | instruction: MOV ES,AX, byte 1/2 | 8E C0 sets ES=0. |
| 11 | `11000000` | `C0` | instruction: MOV ES,AX, byte 2/2 | 8E C0 sets ES=0. |
| 12 | `10001110` | `8E` | instruction: MOV SS,AX, byte 1/2 | 8E D0 sets SS=0. |
| 13 | `11010000` | `D0` | instruction: MOV SS,AX, byte 2/2 | 8E D0 sets SS=0. |
| 14 | `10111100` | `BC` | instruction: MOV SP,7C00, byte 1/3 | BC imm16 sets stack below the boot sector. |
| 15 | `00000000` | `00` | instruction: MOV SP,7C00, byte 2/3 | BC imm16 sets stack below the boot sector. |
| 16 | `01111100` | `7C` | instruction: MOV SP,7C00, byte 3/3 | BC imm16 sets stack below the boot sector. |
| 17 | `11111100` | `FC` | instruction: CLD, byte 1/1 | FC sets forward string direction. |
| 18 | `11111011` | `FB` | instruction: STI, byte 1/1 | FB enables BIOS keyboard interrupts. |
| 19 | `10111000` | `B8` | instruction: MOV AX,0003, byte 1/3 | B8 imm16 selects VGA text mode. |
| 20 | `00000011` | `03` | instruction: MOV AX,0003, byte 2/3 | B8 imm16 selects VGA text mode. |
| 21 | `00000000` | `00` | instruction: MOV AX,0003, byte 3/3 | B8 imm16 selects VGA text mode. |
| 22 | `11001101` | `CD` | instruction: INT 10, byte 1/2 | CD 10 initializes the display. |
| 23 | `00010000` | `10` | instruction: INT 10, byte 2/2 | CD 10 initializes the display. |
| 24 | `10111010` | `BA` | instruction: MOV DX,03F9, byte 1/3 | BA selects COM1 interrupt-enable register. |
| 25 | `11111001` | `F9` | instruction: MOV DX,03F9, byte 2/3 | BA selects COM1 interrupt-enable register. |
| 26 | `00000011` | `03` | instruction: MOV DX,03F9, byte 3/3 | BA selects COM1 interrupt-enable register. |
| 27 | `10110000` | `B0` | instruction: MOV AL,00, byte 1/2 | B0 imm8 disables UART interrupts. |
| 28 | `00000000` | `00` | instruction: MOV AL,00, byte 2/2 | B0 imm8 disables UART interrupts. |
| 29 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | EE writes the UART register. |
| 30 | `10111010` | `BA` | instruction: MOV DX,03FB, byte 1/3 | BA selects line-control register. |
| 31 | `11111011` | `FB` | instruction: MOV DX,03FB, byte 2/3 | BA selects line-control register. |
| 32 | `00000011` | `03` | instruction: MOV DX,03FB, byte 3/3 | BA selects line-control register. |
| 33 | `10110000` | `B0` | instruction: MOV AL,80, byte 1/2 | B0 imm8 enables divisor-latch access. |
| 34 | `10000000` | `80` | instruction: MOV AL,80, byte 2/2 | B0 imm8 enables divisor-latch access. |
| 35 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | EE writes DLAB. |
| 36 | `10111010` | `BA` | instruction: MOV DX,03F8, byte 1/3 | BA selects divisor low byte. |
| 37 | `11111000` | `F8` | instruction: MOV DX,03F8, byte 2/3 | BA selects divisor low byte. |
| 38 | `00000011` | `03` | instruction: MOV DX,03F8, byte 3/3 | BA selects divisor low byte. |
| 39 | `10110000` | `B0` | instruction: MOV AL,01, byte 1/2 | B0 imm8 sets 115200 baud divisor low byte. |
| 40 | `00000001` | `01` | instruction: MOV AL,01, byte 2/2 | B0 imm8 sets 115200 baud divisor low byte. |
| 41 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | EE writes divisor low byte. |
| 42 | `01000010` | `42` | instruction: INC DX, byte 1/1 | 42 advances to divisor high-byte port. |
| 43 | `10110000` | `B0` | instruction: MOV AL,00, byte 1/2 | B0 clears divisor high byte. |
| 44 | `00000000` | `00` | instruction: MOV AL,00, byte 2/2 | B0 clears divisor high byte. |
| 45 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | EE writes divisor high byte. |
| 46 | `10111010` | `BA` | instruction: MOV DX,03FB, byte 1/3 | BA selects line-control register. |
| 47 | `11111011` | `FB` | instruction: MOV DX,03FB, byte 2/3 | BA selects line-control register. |
| 48 | `00000011` | `03` | instruction: MOV DX,03FB, byte 3/3 | BA selects line-control register. |
| 49 | `10110000` | `B0` | instruction: MOV AL,03, byte 1/2 | B0 imm8 selects 8N1 and clears DLAB. |
| 50 | `00000011` | `03` | instruction: MOV AL,03, byte 2/2 | B0 imm8 selects 8N1 and clears DLAB. |
| 51 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | EE configures UART framing. |
| 52 | `10111010` | `BA` | instruction: MOV DX,03F8, byte 1/3 | BA selects serial transmit register. |
| 53 | `11111000` | `F8` | instruction: MOV DX,03F8, byte 2/3 | BA selects serial transmit register. |
| 54 | `00000011` | `03` | instruction: MOV DX,03F8, byte 3/3 | BA selects serial transmit register. |
| 55 | `10110000` | `B0` | instruction: MOV AL,3E, byte 1/2 | B0 imm8 loads the ASCII ready marker, greater-than sign. |
| 56 | `00111110` | `3E` | instruction: MOV AL,3E, byte 2/2 | B0 imm8 loads the ASCII ready marker, greater-than sign. |
| 57 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | EE sends readiness before blocking for a key. |
| 58 | `00110001` | `31` | instruction: XOR AX,AX, byte 1/2 | 31 C0 selects BIOS keyboard service zero. |
| 59 | `11000000` | `C0` | instruction: XOR AX,AX, byte 2/2 | 31 C0 selects BIOS keyboard service zero. |
| 60 | `11001101` | `CD` | instruction: INT 16, byte 1/2 | CD 16 waits for one BIOS keyboard character, returned in AL. |
| 61 | `00010110` | `16` | instruction: INT 16, byte 2/2 | CD 16 waits for one BIOS keyboard character, returned in AL. |
| 62 | `01010000` | `50` | instruction: PUSH AX, byte 1/1 | 50 preserves the returned character. |
| 63 | `10110100` | `B4` | instruction: MOV AH,0E, byte 1/2 | B4 selects BIOS teletype. |
| 64 | `00001110` | `0E` | instruction: MOV AH,0E, byte 2/2 | B4 selects BIOS teletype. |
| 65 | `10111011` | `BB` | instruction: MOV BX,0007, byte 1/3 | BB selects VGA page zero, attribute seven. |
| 66 | `00000111` | `07` | instruction: MOV BX,0007, byte 2/3 | BB selects VGA page zero, attribute seven. |
| 67 | `00000000` | `00` | instruction: MOV BX,0007, byte 3/3 | BB selects VGA page zero, attribute seven. |
| 68 | `11001101` | `CD` | instruction: INT 10, byte 1/2 | CD 10 echoes the character on screen. |
| 69 | `00010000` | `10` | instruction: INT 10, byte 2/2 | CD 10 echoes the character on screen. |
| 70 | `01011000` | `58` | instruction: POP AX, byte 1/1 | 58 restores the character. |
| 71 | `01010000` | `50` | instruction: PUSH AX, byte 1/1 | 50 saves it during UART polling. |
| 72 | `10111010` | `BA` | instruction: MOV DX,03FD, byte 1/3 | BA selects UART line-status register. |
| 73 | `11111101` | `FD` | instruction: MOV DX,03FD, byte 2/3 | BA selects UART line-status register. |
| 74 | `00000011` | `03` | instruction: MOV DX,03FD, byte 3/3 | BA selects UART line-status register. |
| 75 | `11101100` | `EC` | instruction: IN AL,DX, byte 1/1 | EC reads line status. |
| 76 | `10101000` | `A8` | instruction: TEST AL,20, byte 1/2 | A8 imm8 tests transmitter-ready bit. |
| 77 | `00100000` | `20` | instruction: TEST AL,20, byte 2/2 | A8 imm8 tests transmitter-ready bit. |
| 78 | `01110100` | `74` | instruction: JZ poll, byte 1/2 | 74 FB branches five bytes back to IN. |
| 79 | `11111011` | `FB` | instruction: JZ poll, byte 2/2 | 74 FB branches five bytes back to IN. |
| 80 | `01011000` | `58` | instruction: POP AX, byte 1/1 | 58 restores the keyboard byte. |
| 81 | `10111010` | `BA` | instruction: MOV DX,03F8, byte 1/3 | BA selects transmit register. |
| 82 | `11111000` | `F8` | instruction: MOV DX,03F8, byte 2/3 | BA selects transmit register. |
| 83 | `00000011` | `03` | instruction: MOV DX,03F8, byte 3/3 | BA selects transmit register. |
| 84 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | EE echoes the keyboard byte to serial. |
| 85 | `11111010` | `FA` | instruction: CLI, byte 1/1 | FA disables maskable interrupts for final halt. |
| 86 | `11110100` | `F4` | instruction: HLT, byte 1/1 | F4 safely stops execution. |
| 87 | `11101011` | `EB` | instruction: JMP halt, byte 1/2 | EB FD branches three bytes back to HLT if awakened. |
| 88 | `11111101` | `FD` | instruction: JMP halt, byte 2/2 | EB FD branches three bytes back to HLT if awakened. |
