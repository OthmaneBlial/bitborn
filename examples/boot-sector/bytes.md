# Every byte explained

Generated from canonical `.bits` annotations by `python3 tools/byte_tables.py`.

Instruction names below are disassembly for explanation, never code-generation input.

| Offset | Binary | Hex | Range / byte within it | Encoding explanation |
| --- | --- | --- | --- | --- |
| 0 | `11111010` | `FA` | instruction: CLI, byte 1/1 | FA disables maskable interrupts during stack setup. |
| 1 | `11101010` | `EA` | instruction: JMP 0000:7C06, byte 1/5 | EA has a little-endian offset 7C06 followed by segment 0000; normalize CS. |
| 2 | `00000110` | `06` | instruction: JMP 0000:7C06, byte 2/5 | EA has a little-endian offset 7C06 followed by segment 0000; normalize CS. |
| 3 | `01111100` | `7C` | instruction: JMP 0000:7C06, byte 3/5 | EA has a little-endian offset 7C06 followed by segment 0000; normalize CS. |
| 4 | `00000000` | `00` | instruction: JMP 0000:7C06, byte 4/5 | EA has a little-endian offset 7C06 followed by segment 0000; normalize CS. |
| 5 | `00000000` | `00` | instruction: JMP 0000:7C06, byte 5/5 | EA has a little-endian offset 7C06 followed by segment 0000; normalize CS. |
| 6 | `00110001` | `31` | instruction: XOR AX,AX, byte 1/2 | 31 /r; ModR/M C0 = register AX XOR register AX, producing zero. |
| 7 | `11000000` | `C0` | instruction: XOR AX,AX, byte 2/2 | 31 /r; ModR/M C0 = register AX XOR register AX, producing zero. |
| 8 | `10001110` | `8E` | instruction: MOV DS,AX, byte 1/2 | 8E /r; D8 selects DS and AX; data addresses use segment zero. |
| 9 | `11011000` | `D8` | instruction: MOV DS,AX, byte 2/2 | 8E /r; D8 selects DS and AX; data addresses use segment zero. |
| 10 | `10001110` | `8E` | instruction: MOV ES,AX, byte 1/2 | 8E /r; C0 selects ES and AX. |
| 11 | `11000000` | `C0` | instruction: MOV ES,AX, byte 2/2 | 8E /r; C0 selects ES and AX. |
| 12 | `10001110` | `8E` | instruction: MOV SS,AX, byte 1/2 | 8E /r; D0 selects SS and AX; stack segment becomes zero. |
| 13 | `11010000` | `D0` | instruction: MOV SS,AX, byte 2/2 | 8E /r; D0 selects SS and AX; stack segment becomes zero. |
| 14 | `10111100` | `BC` | instruction: MOV SP,7C00, byte 1/3 | BC = B8+SP; little-endian 7C00 places stack below the loaded sector. |
| 15 | `00000000` | `00` | instruction: MOV SP,7C00, byte 2/3 | BC = B8+SP; little-endian 7C00 places stack below the loaded sector. |
| 16 | `01111100` | `7C` | instruction: MOV SP,7C00, byte 3/3 | BC = B8+SP; little-endian 7C00 places stack below the loaded sector. |
| 17 | `11111100` | `FC` | instruction: CLD, byte 1/1 | FC clears direction flag; LODSB advances SI. |
| 18 | `11111011` | `FB` | instruction: STI, byte 1/1 | FB enables BIOS keyboard/timer interrupts after stack is ready. |
| 19 | `10111000` | `B8` | instruction: MOV AX,0003, byte 1/3 | B8 loads AX with video mode 3. |
| 20 | `00000011` | `03` | instruction: MOV AX,0003, byte 2/3 | B8 loads AX with video mode 3. |
| 21 | `00000000` | `00` | instruction: MOV AX,0003, byte 3/3 | B8 loads AX with video mode 3. |
| 22 | `11001101` | `CD` | instruction: INT 10, byte 1/2 | CD imm8; BIOS video interrupt selects 80x25 text mode. |
| 23 | `00010000` | `10` | instruction: INT 10, byte 2/2 | CD imm8; BIOS video interrupt selects 80x25 text mode. |
| 24 | `10111010` | `BA` | instruction: MOV DX,03F9, byte 1/3 | BA loads COM1 interrupt-enable port. |
| 25 | `11111001` | `F9` | instruction: MOV DX,03F9, byte 2/3 | BA loads COM1 interrupt-enable port. |
| 26 | `00000011` | `03` | instruction: MOV DX,03F9, byte 3/3 | BA loads COM1 interrupt-enable port. |
| 27 | `10110000` | `B0` | instruction: MOV AL,00, byte 1/2 | B0 loads an 8-bit zero to disable UART interrupts. |
| 28 | `00000000` | `00` | instruction: MOV AL,00, byte 2/2 | B0 loads an 8-bit zero to disable UART interrupts. |
| 29 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | EE writes AL to the I/O port in DX. |
| 30 | `10111010` | `BA` | instruction: MOV DX,03FB, byte 1/3 | BA loads UART line-control port. |
| 31 | `11111011` | `FB` | instruction: MOV DX,03FB, byte 2/3 | BA loads UART line-control port. |
| 32 | `00000011` | `03` | instruction: MOV DX,03FB, byte 3/3 | BA loads UART line-control port. |
| 33 | `10110000` | `B0` | instruction: MOV AL,80, byte 1/2 | B0 selects divisor-latch access (DLAB bit 7). |
| 34 | `10000000` | `80` | instruction: MOV AL,80, byte 2/2 | B0 selects divisor-latch access (DLAB bit 7). |
| 35 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | EE enables the baud divisor registers. |
| 36 | `10111010` | `BA` | instruction: MOV DX,03F8, byte 1/3 | BA loads divisor low-byte port. |
| 37 | `11111000` | `F8` | instruction: MOV DX,03F8, byte 2/3 | BA loads divisor low-byte port. |
| 38 | `00000011` | `03` | instruction: MOV DX,03F8, byte 3/3 | BA loads divisor low-byte port. |
| 39 | `10110000` | `B0` | instruction: MOV AL,01, byte 1/2 | B0 loads divisor 1, giving 115200 baud on a standard 16550. |
| 40 | `00000001` | `01` | instruction: MOV AL,01, byte 2/2 | B0 loads divisor 1, giving 115200 baud on a standard 16550. |
| 41 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | EE writes divisor low byte. |
| 42 | `01000010` | `42` | instruction: INC DX, byte 1/1 | 42 = 40+DX; selects divisor high-byte port. |
| 43 | `10110000` | `B0` | instruction: MOV AL,00, byte 1/2 | B0 clears divisor high byte. |
| 44 | `00000000` | `00` | instruction: MOV AL,00, byte 2/2 | B0 clears divisor high byte. |
| 45 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | EE writes divisor high byte. |
| 46 | `10111010` | `BA` | instruction: MOV DX,03FB, byte 1/3 | BA selects line-control port again. |
| 47 | `11111011` | `FB` | instruction: MOV DX,03FB, byte 2/3 | BA selects line-control port again. |
| 48 | `00000011` | `03` | instruction: MOV DX,03FB, byte 3/3 | BA selects line-control port again. |
| 49 | `10110000` | `B0` | instruction: MOV AL,03, byte 1/2 | B0 selects 8 data bits, no parity, one stop bit; clears DLAB. |
| 50 | `00000011` | `03` | instruction: MOV AL,03, byte 2/2 | B0 selects 8 data bits, no parity, one stop bit; clears DLAB. |
| 51 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | EE writes 8N1 UART configuration. |
| 52 | `10111110` | `BE` | instruction: MOV SI,7C5B, byte 1/3 | BE loads SI; message begins at sector offset 91, physical 7C5B. |
| 53 | `01011011` | `5B` | instruction: MOV SI,7C5B, byte 2/3 | BE loads SI; message begins at sector offset 91, physical 7C5B. |
| 54 | `01111100` | `7C` | instruction: MOV SI,7C5B, byte 3/3 | BE loads SI; message begins at sector offset 91, physical 7C5B. |
| 55 | `10101100` | `AC` | instruction: LODSB, byte 1/1 | AC loads DS:SI into AL and increments SI. |
| 56 | `10000100` | `84` | instruction: TEST AL,AL, byte 1/2 | 84 /r; C0 tests AL against itself and sets ZF at NUL. |
| 57 | `11000000` | `C0` | instruction: TEST AL,AL, byte 2/2 | 84 /r; C0 tests AL against itself and sets ZF at NUL. |
| 58 | `01110100` | `74` | instruction: JZ 7C57, byte 1/2 | 74 rel8; next offset 60 + 27 = 87, the halt path. |
| 59 | `00011011` | `1B` | instruction: JZ 7C57, byte 2/2 | 74 rel8; next offset 60 + 27 = 87, the halt path. |
| 60 | `01010000` | `50` | instruction: PUSH AX, byte 1/1 | 50 preserves the character across BIOS video output. |
| 61 | `01010110` | `56` | instruction: PUSH SI, byte 1/1 | 56 preserves the string pointer across BIOS video output. |
| 62 | `10110100` | `B4` | instruction: MOV AH,0E, byte 1/2 | B4 loads BIOS teletype service number. |
| 63 | `00001110` | `0E` | instruction: MOV AH,0E, byte 2/2 | B4 loads BIOS teletype service number. |
| 64 | `10111011` | `BB` | instruction: MOV BX,0007, byte 1/3 | BB selects display page zero and text attribute 07. |
| 65 | `00000111` | `07` | instruction: MOV BX,0007, byte 2/3 | BB selects display page zero and text attribute 07. |
| 66 | `00000000` | `00` | instruction: MOV BX,0007, byte 3/3 | BB selects display page zero and text attribute 07. |
| 67 | `11001101` | `CD` | instruction: INT 10, byte 1/2 | CD 10 emits the character on the VGA display. |
| 68 | `00010000` | `10` | instruction: INT 10, byte 2/2 | CD 10 emits the character on the VGA display. |
| 69 | `01011110` | `5E` | instruction: POP SI, byte 1/1 | 5E restores the source pointer. |
| 70 | `01011000` | `58` | instruction: POP AX, byte 1/1 | 58 restores the character. |
| 71 | `01010000` | `50` | instruction: PUSH AX, byte 1/1 | 50 saves AL while polling the UART status. |
| 72 | `10111010` | `BA` | instruction: MOV DX,03FD, byte 1/3 | BA selects UART line-status register. |
| 73 | `11111101` | `FD` | instruction: MOV DX,03FD, byte 2/3 | BA selects UART line-status register. |
| 74 | `00000011` | `03` | instruction: MOV DX,03FD, byte 3/3 | BA selects UART line-status register. |
| 75 | `11101100` | `EC` | instruction: IN AL,DX, byte 1/1 | EC reads UART status into AL. |
| 76 | `10101000` | `A8` | instruction: TEST AL,20, byte 1/2 | A8 imm8 checks transmitter holding register empty bit 5. |
| 77 | `00100000` | `20` | instruction: TEST AL,20, byte 2/2 | A8 imm8 checks transmitter holding register empty bit 5. |
| 78 | `01110100` | `74` | instruction: JZ 7C4B, byte 1/2 | 74 rel8; next offset 80 minus 5 = 75, poll until ready. |
| 79 | `11111011` | `FB` | instruction: JZ 7C4B, byte 2/2 | 74 rel8; next offset 80 minus 5 = 75, poll until ready. |
| 80 | `01011000` | `58` | instruction: POP AX, byte 1/1 | 58 restores the character after status polling. |
| 81 | `10111010` | `BA` | instruction: MOV DX,03F8, byte 1/3 | BA selects COM1 transmit data register. |
| 82 | `11111000` | `F8` | instruction: MOV DX,03F8, byte 2/3 | BA selects COM1 transmit data register. |
| 83 | `00000011` | `03` | instruction: MOV DX,03F8, byte 3/3 | BA selects COM1 transmit data register. |
| 84 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | EE emits the same character to COM1 for machine-readable testing. |
| 85 | `11101011` | `EB` | instruction: JMP 7C37, byte 1/2 | EB rel8; next offset 87 minus 32 = 55, fetch the next character. |
| 86 | `11100000` | `E0` | instruction: JMP 7C37, byte 2/2 | EB rel8; next offset 87 minus 32 = 55, fetch the next character. |
| 87 | `11111010` | `FA` | instruction: CLI, byte 1/1 | FA prevents interrupts waking the final halt. |
| 88 | `11110100` | `F4` | instruction: HLT, byte 1/1 | F4 stops instruction execution until NMI/reset. |
| 89 | `11101011` | `EB` | instruction: JMP 7C58, byte 1/2 | EB rel8; next offset 91 minus 3 = 88, halt again if awakened. |
| 90 | `11111101` | `FD` | instruction: JMP 7C58, byte 2/2 | EB rel8; next offset 91 minus 3 = 88, halt again if awakened. |
| 91 | `01100010` | `62` | data: bitborn v0.1 CR LF, byte 1/14 | ASCII greeting; CR LF advances the VGA cursor and serial terminal. |
| 92 | `01101001` | `69` | data: bitborn v0.1 CR LF, byte 2/14 | ASCII greeting; CR LF advances the VGA cursor and serial terminal. |
| 93 | `01110100` | `74` | data: bitborn v0.1 CR LF, byte 3/14 | ASCII greeting; CR LF advances the VGA cursor and serial terminal. |
| 94 | `01100010` | `62` | data: bitborn v0.1 CR LF, byte 4/14 | ASCII greeting; CR LF advances the VGA cursor and serial terminal. |
| 95 | `01101111` | `6F` | data: bitborn v0.1 CR LF, byte 5/14 | ASCII greeting; CR LF advances the VGA cursor and serial terminal. |
| 96 | `01110010` | `72` | data: bitborn v0.1 CR LF, byte 6/14 | ASCII greeting; CR LF advances the VGA cursor and serial terminal. |
| 97 | `01101110` | `6E` | data: bitborn v0.1 CR LF, byte 7/14 | ASCII greeting; CR LF advances the VGA cursor and serial terminal. |
| 98 | `00100000` | `20` | data: bitborn v0.1 CR LF, byte 8/14 | ASCII greeting; CR LF advances the VGA cursor and serial terminal. |
| 99 | `01110110` | `76` | data: bitborn v0.1 CR LF, byte 9/14 | ASCII greeting; CR LF advances the VGA cursor and serial terminal. |
| 100 | `00110000` | `30` | data: bitborn v0.1 CR LF, byte 10/14 | ASCII greeting; CR LF advances the VGA cursor and serial terminal. |
| 101 | `00101110` | `2E` | data: bitborn v0.1 CR LF, byte 11/14 | ASCII greeting; CR LF advances the VGA cursor and serial terminal. |
| 102 | `00110001` | `31` | data: bitborn v0.1 CR LF, byte 12/14 | ASCII greeting; CR LF advances the VGA cursor and serial terminal. |
| 103 | `00001101` | `0D` | data: bitborn v0.1 CR LF, byte 13/14 | ASCII greeting; CR LF advances the VGA cursor and serial terminal. |
| 104 | `00001010` | `0A` | data: bitborn v0.1 CR LF, byte 14/14 | ASCII greeting; CR LF advances the VGA cursor and serial terminal. |
| 105 | `00101101` | `2D` | data: separator CR LF, byte 1/29 | 27 literal ASCII hyphens followed by a line break. |
| 106 | `00101101` | `2D` | data: separator CR LF, byte 2/29 | 27 literal ASCII hyphens followed by a line break. |
| 107 | `00101101` | `2D` | data: separator CR LF, byte 3/29 | 27 literal ASCII hyphens followed by a line break. |
| 108 | `00101101` | `2D` | data: separator CR LF, byte 4/29 | 27 literal ASCII hyphens followed by a line break. |
| 109 | `00101101` | `2D` | data: separator CR LF, byte 5/29 | 27 literal ASCII hyphens followed by a line break. |
| 110 | `00101101` | `2D` | data: separator CR LF, byte 6/29 | 27 literal ASCII hyphens followed by a line break. |
| 111 | `00101101` | `2D` | data: separator CR LF, byte 7/29 | 27 literal ASCII hyphens followed by a line break. |
| 112 | `00101101` | `2D` | data: separator CR LF, byte 8/29 | 27 literal ASCII hyphens followed by a line break. |
| 113 | `00101101` | `2D` | data: separator CR LF, byte 9/29 | 27 literal ASCII hyphens followed by a line break. |
| 114 | `00101101` | `2D` | data: separator CR LF, byte 10/29 | 27 literal ASCII hyphens followed by a line break. |
| 115 | `00101101` | `2D` | data: separator CR LF, byte 11/29 | 27 literal ASCII hyphens followed by a line break. |
| 116 | `00101101` | `2D` | data: separator CR LF, byte 12/29 | 27 literal ASCII hyphens followed by a line break. |
| 117 | `00101101` | `2D` | data: separator CR LF, byte 13/29 | 27 literal ASCII hyphens followed by a line break. |
| 118 | `00101101` | `2D` | data: separator CR LF, byte 14/29 | 27 literal ASCII hyphens followed by a line break. |
| 119 | `00101101` | `2D` | data: separator CR LF, byte 15/29 | 27 literal ASCII hyphens followed by a line break. |
| 120 | `00101101` | `2D` | data: separator CR LF, byte 16/29 | 27 literal ASCII hyphens followed by a line break. |
| 121 | `00101101` | `2D` | data: separator CR LF, byte 17/29 | 27 literal ASCII hyphens followed by a line break. |
| 122 | `00101101` | `2D` | data: separator CR LF, byte 18/29 | 27 literal ASCII hyphens followed by a line break. |
| 123 | `00101101` | `2D` | data: separator CR LF, byte 19/29 | 27 literal ASCII hyphens followed by a line break. |
| 124 | `00101101` | `2D` | data: separator CR LF, byte 20/29 | 27 literal ASCII hyphens followed by a line break. |
| 125 | `00101101` | `2D` | data: separator CR LF, byte 21/29 | 27 literal ASCII hyphens followed by a line break. |
| 126 | `00101101` | `2D` | data: separator CR LF, byte 22/29 | 27 literal ASCII hyphens followed by a line break. |
| 127 | `00101101` | `2D` | data: separator CR LF, byte 23/29 | 27 literal ASCII hyphens followed by a line break. |
| 128 | `00101101` | `2D` | data: separator CR LF, byte 24/29 | 27 literal ASCII hyphens followed by a line break. |
| 129 | `00101101` | `2D` | data: separator CR LF, byte 25/29 | 27 literal ASCII hyphens followed by a line break. |
| 130 | `00101101` | `2D` | data: separator CR LF, byte 26/29 | 27 literal ASCII hyphens followed by a line break. |
| 131 | `00101101` | `2D` | data: separator CR LF, byte 27/29 | 27 literal ASCII hyphens followed by a line break. |
| 132 | `00001101` | `0D` | data: separator CR LF, byte 28/29 | 27 literal ASCII hyphens followed by a line break. |
| 133 | `00001010` | `0A` | data: separator CR LF, byte 29/29 | 27 literal ASCII hyphens followed by a line break. |
| 134 | `01001110` | `4E` | data: NO ASSEMBLY. CR LF, byte 1/14 | Literal ASCII message bytes. |
| 135 | `01001111` | `4F` | data: NO ASSEMBLY. CR LF, byte 2/14 | Literal ASCII message bytes. |
| 136 | `00100000` | `20` | data: NO ASSEMBLY. CR LF, byte 3/14 | Literal ASCII message bytes. |
| 137 | `01000001` | `41` | data: NO ASSEMBLY. CR LF, byte 4/14 | Literal ASCII message bytes. |
| 138 | `01010011` | `53` | data: NO ASSEMBLY. CR LF, byte 5/14 | Literal ASCII message bytes. |
| 139 | `01010011` | `53` | data: NO ASSEMBLY. CR LF, byte 6/14 | Literal ASCII message bytes. |
| 140 | `01000101` | `45` | data: NO ASSEMBLY. CR LF, byte 7/14 | Literal ASCII message bytes. |
| 141 | `01001101` | `4D` | data: NO ASSEMBLY. CR LF, byte 8/14 | Literal ASCII message bytes. |
| 142 | `01000010` | `42` | data: NO ASSEMBLY. CR LF, byte 9/14 | Literal ASCII message bytes. |
| 143 | `01001100` | `4C` | data: NO ASSEMBLY. CR LF, byte 10/14 | Literal ASCII message bytes. |
| 144 | `01011001` | `59` | data: NO ASSEMBLY. CR LF, byte 11/14 | Literal ASCII message bytes. |
| 145 | `00101110` | `2E` | data: NO ASSEMBLY. CR LF, byte 12/14 | Literal ASCII message bytes. |
| 146 | `00001101` | `0D` | data: NO ASSEMBLY. CR LF, byte 13/14 | Literal ASCII message bytes. |
| 147 | `00001010` | `0A` | data: NO ASSEMBLY. CR LF, byte 14/14 | Literal ASCII message bytes. |
| 148 | `01001110` | `4E` | data: NO COMPILER. CR LF, byte 1/14 | Literal ASCII message bytes. |
| 149 | `01001111` | `4F` | data: NO COMPILER. CR LF, byte 2/14 | Literal ASCII message bytes. |
| 150 | `00100000` | `20` | data: NO COMPILER. CR LF, byte 3/14 | Literal ASCII message bytes. |
| 151 | `01000011` | `43` | data: NO COMPILER. CR LF, byte 4/14 | Literal ASCII message bytes. |
| 152 | `01001111` | `4F` | data: NO COMPILER. CR LF, byte 5/14 | Literal ASCII message bytes. |
| 153 | `01001101` | `4D` | data: NO COMPILER. CR LF, byte 6/14 | Literal ASCII message bytes. |
| 154 | `01010000` | `50` | data: NO COMPILER. CR LF, byte 7/14 | Literal ASCII message bytes. |
| 155 | `01001001` | `49` | data: NO COMPILER. CR LF, byte 8/14 | Literal ASCII message bytes. |
| 156 | `01001100` | `4C` | data: NO COMPILER. CR LF, byte 9/14 | Literal ASCII message bytes. |
| 157 | `01000101` | `45` | data: NO COMPILER. CR LF, byte 10/14 | Literal ASCII message bytes. |
| 158 | `01010010` | `52` | data: NO COMPILER. CR LF, byte 11/14 | Literal ASCII message bytes. |
| 159 | `00101110` | `2E` | data: NO COMPILER. CR LF, byte 12/14 | Literal ASCII message bytes. |
| 160 | `00001101` | `0D` | data: NO COMPILER. CR LF, byte 13/14 | Literal ASCII message bytes. |
| 161 | `00001010` | `0A` | data: NO COMPILER. CR LF, byte 14/14 | Literal ASCII message bytes. |
| 162 | `01001010` | `4A` | data: JUST BITS. CR LF CR LF, byte 1/14 | Literal ASCII bytes and one empty line. |
| 163 | `01010101` | `55` | data: JUST BITS. CR LF CR LF, byte 2/14 | Literal ASCII bytes and one empty line. |
| 164 | `01010011` | `53` | data: JUST BITS. CR LF CR LF, byte 3/14 | Literal ASCII bytes and one empty line. |
| 165 | `01010100` | `54` | data: JUST BITS. CR LF CR LF, byte 4/14 | Literal ASCII bytes and one empty line. |
| 166 | `00100000` | `20` | data: JUST BITS. CR LF CR LF, byte 5/14 | Literal ASCII bytes and one empty line. |
| 167 | `01000010` | `42` | data: JUST BITS. CR LF CR LF, byte 6/14 | Literal ASCII bytes and one empty line. |
| 168 | `01001001` | `49` | data: JUST BITS. CR LF CR LF, byte 7/14 | Literal ASCII bytes and one empty line. |
| 169 | `01010100` | `54` | data: JUST BITS. CR LF CR LF, byte 8/14 | Literal ASCII bytes and one empty line. |
| 170 | `01010011` | `53` | data: JUST BITS. CR LF CR LF, byte 9/14 | Literal ASCII bytes and one empty line. |
| 171 | `00101110` | `2E` | data: JUST BITS. CR LF CR LF, byte 10/14 | Literal ASCII bytes and one empty line. |
| 172 | `00001101` | `0D` | data: JUST BITS. CR LF CR LF, byte 11/14 | Literal ASCII bytes and one empty line. |
| 173 | `00001010` | `0A` | data: JUST BITS. CR LF CR LF, byte 12/14 | Literal ASCII bytes and one empty line. |
| 174 | `00001101` | `0D` | data: JUST BITS. CR LF CR LF, byte 13/14 | Literal ASCII bytes and one empty line. |
| 175 | `00001010` | `0A` | data: JUST BITS. CR LF CR LF, byte 14/14 | Literal ASCII bytes and one empty line. |
| 176 | `01001000` | `48` | data: Hello from raw machine code! CR LF CR LF, byte 1/32 | Literal ASCII greeting and one empty line. |
| 177 | `01100101` | `65` | data: Hello from raw machine code! CR LF CR LF, byte 2/32 | Literal ASCII greeting and one empty line. |
| 178 | `01101100` | `6C` | data: Hello from raw machine code! CR LF CR LF, byte 3/32 | Literal ASCII greeting and one empty line. |
| 179 | `01101100` | `6C` | data: Hello from raw machine code! CR LF CR LF, byte 4/32 | Literal ASCII greeting and one empty line. |
| 180 | `01101111` | `6F` | data: Hello from raw machine code! CR LF CR LF, byte 5/32 | Literal ASCII greeting and one empty line. |
| 181 | `00100000` | `20` | data: Hello from raw machine code! CR LF CR LF, byte 6/32 | Literal ASCII greeting and one empty line. |
| 182 | `01100110` | `66` | data: Hello from raw machine code! CR LF CR LF, byte 7/32 | Literal ASCII greeting and one empty line. |
| 183 | `01110010` | `72` | data: Hello from raw machine code! CR LF CR LF, byte 8/32 | Literal ASCII greeting and one empty line. |
| 184 | `01101111` | `6F` | data: Hello from raw machine code! CR LF CR LF, byte 9/32 | Literal ASCII greeting and one empty line. |
| 185 | `01101101` | `6D` | data: Hello from raw machine code! CR LF CR LF, byte 10/32 | Literal ASCII greeting and one empty line. |
| 186 | `00100000` | `20` | data: Hello from raw machine code! CR LF CR LF, byte 11/32 | Literal ASCII greeting and one empty line. |
| 187 | `01110010` | `72` | data: Hello from raw machine code! CR LF CR LF, byte 12/32 | Literal ASCII greeting and one empty line. |
| 188 | `01100001` | `61` | data: Hello from raw machine code! CR LF CR LF, byte 13/32 | Literal ASCII greeting and one empty line. |
| 189 | `01110111` | `77` | data: Hello from raw machine code! CR LF CR LF, byte 14/32 | Literal ASCII greeting and one empty line. |
| 190 | `00100000` | `20` | data: Hello from raw machine code! CR LF CR LF, byte 15/32 | Literal ASCII greeting and one empty line. |
| 191 | `01101101` | `6D` | data: Hello from raw machine code! CR LF CR LF, byte 16/32 | Literal ASCII greeting and one empty line. |
| 192 | `01100001` | `61` | data: Hello from raw machine code! CR LF CR LF, byte 17/32 | Literal ASCII greeting and one empty line. |
| 193 | `01100011` | `63` | data: Hello from raw machine code! CR LF CR LF, byte 18/32 | Literal ASCII greeting and one empty line. |
| 194 | `01101000` | `68` | data: Hello from raw machine code! CR LF CR LF, byte 19/32 | Literal ASCII greeting and one empty line. |
| 195 | `01101001` | `69` | data: Hello from raw machine code! CR LF CR LF, byte 20/32 | Literal ASCII greeting and one empty line. |
| 196 | `01101110` | `6E` | data: Hello from raw machine code! CR LF CR LF, byte 21/32 | Literal ASCII greeting and one empty line. |
| 197 | `01100101` | `65` | data: Hello from raw machine code! CR LF CR LF, byte 22/32 | Literal ASCII greeting and one empty line. |
| 198 | `00100000` | `20` | data: Hello from raw machine code! CR LF CR LF, byte 23/32 | Literal ASCII greeting and one empty line. |
| 199 | `01100011` | `63` | data: Hello from raw machine code! CR LF CR LF, byte 24/32 | Literal ASCII greeting and one empty line. |
| 200 | `01101111` | `6F` | data: Hello from raw machine code! CR LF CR LF, byte 25/32 | Literal ASCII greeting and one empty line. |
| 201 | `01100100` | `64` | data: Hello from raw machine code! CR LF CR LF, byte 26/32 | Literal ASCII greeting and one empty line. |
| 202 | `01100101` | `65` | data: Hello from raw machine code! CR LF CR LF, byte 27/32 | Literal ASCII greeting and one empty line. |
| 203 | `00100001` | `21` | data: Hello from raw machine code! CR LF CR LF, byte 28/32 | Literal ASCII greeting and one empty line. |
| 204 | `00001101` | `0D` | data: Hello from raw machine code! CR LF CR LF, byte 29/32 | Literal ASCII greeting and one empty line. |
| 205 | `00001010` | `0A` | data: Hello from raw machine code! CR LF CR LF, byte 30/32 | Literal ASCII greeting and one empty line. |
| 206 | `00001101` | `0D` | data: Hello from raw machine code! CR LF CR LF, byte 31/32 | Literal ASCII greeting and one empty line. |
| 207 | `00001010` | `0A` | data: Hello from raw machine code! CR LF CR LF, byte 32/32 | Literal ASCII greeting and one empty line. |
| 208 | `00110101` | `35` | data: 512 bytes. 100% handwritten. CR LF NUL, byte 1/31 | Literal ASCII final line; zero terminates the string. |
| 209 | `00110001` | `31` | data: 512 bytes. 100% handwritten. CR LF NUL, byte 2/31 | Literal ASCII final line; zero terminates the string. |
| 210 | `00110010` | `32` | data: 512 bytes. 100% handwritten. CR LF NUL, byte 3/31 | Literal ASCII final line; zero terminates the string. |
| 211 | `00100000` | `20` | data: 512 bytes. 100% handwritten. CR LF NUL, byte 4/31 | Literal ASCII final line; zero terminates the string. |
| 212 | `01100010` | `62` | data: 512 bytes. 100% handwritten. CR LF NUL, byte 5/31 | Literal ASCII final line; zero terminates the string. |
| 213 | `01111001` | `79` | data: 512 bytes. 100% handwritten. CR LF NUL, byte 6/31 | Literal ASCII final line; zero terminates the string. |
| 214 | `01110100` | `74` | data: 512 bytes. 100% handwritten. CR LF NUL, byte 7/31 | Literal ASCII final line; zero terminates the string. |
| 215 | `01100101` | `65` | data: 512 bytes. 100% handwritten. CR LF NUL, byte 8/31 | Literal ASCII final line; zero terminates the string. |
| 216 | `01110011` | `73` | data: 512 bytes. 100% handwritten. CR LF NUL, byte 9/31 | Literal ASCII final line; zero terminates the string. |
| 217 | `00101110` | `2E` | data: 512 bytes. 100% handwritten. CR LF NUL, byte 10/31 | Literal ASCII final line; zero terminates the string. |
| 218 | `00100000` | `20` | data: 512 bytes. 100% handwritten. CR LF NUL, byte 11/31 | Literal ASCII final line; zero terminates the string. |
| 219 | `00110001` | `31` | data: 512 bytes. 100% handwritten. CR LF NUL, byte 12/31 | Literal ASCII final line; zero terminates the string. |
| 220 | `00110000` | `30` | data: 512 bytes. 100% handwritten. CR LF NUL, byte 13/31 | Literal ASCII final line; zero terminates the string. |
| 221 | `00110000` | `30` | data: 512 bytes. 100% handwritten. CR LF NUL, byte 14/31 | Literal ASCII final line; zero terminates the string. |
| 222 | `00100101` | `25` | data: 512 bytes. 100% handwritten. CR LF NUL, byte 15/31 | Literal ASCII final line; zero terminates the string. |
| 223 | `00100000` | `20` | data: 512 bytes. 100% handwritten. CR LF NUL, byte 16/31 | Literal ASCII final line; zero terminates the string. |
| 224 | `01101000` | `68` | data: 512 bytes. 100% handwritten. CR LF NUL, byte 17/31 | Literal ASCII final line; zero terminates the string. |
| 225 | `01100001` | `61` | data: 512 bytes. 100% handwritten. CR LF NUL, byte 18/31 | Literal ASCII final line; zero terminates the string. |
| 226 | `01101110` | `6E` | data: 512 bytes. 100% handwritten. CR LF NUL, byte 19/31 | Literal ASCII final line; zero terminates the string. |
| 227 | `01100100` | `64` | data: 512 bytes. 100% handwritten. CR LF NUL, byte 20/31 | Literal ASCII final line; zero terminates the string. |
| 228 | `01110111` | `77` | data: 512 bytes. 100% handwritten. CR LF NUL, byte 21/31 | Literal ASCII final line; zero terminates the string. |
| 229 | `01110010` | `72` | data: 512 bytes. 100% handwritten. CR LF NUL, byte 22/31 | Literal ASCII final line; zero terminates the string. |
| 230 | `01101001` | `69` | data: 512 bytes. 100% handwritten. CR LF NUL, byte 23/31 | Literal ASCII final line; zero terminates the string. |
| 231 | `01110100` | `74` | data: 512 bytes. 100% handwritten. CR LF NUL, byte 24/31 | Literal ASCII final line; zero terminates the string. |
| 232 | `01110100` | `74` | data: 512 bytes. 100% handwritten. CR LF NUL, byte 25/31 | Literal ASCII final line; zero terminates the string. |
| 233 | `01100101` | `65` | data: 512 bytes. 100% handwritten. CR LF NUL, byte 26/31 | Literal ASCII final line; zero terminates the string. |
| 234 | `01101110` | `6E` | data: 512 bytes. 100% handwritten. CR LF NUL, byte 27/31 | Literal ASCII final line; zero terminates the string. |
| 235 | `00101110` | `2E` | data: 512 bytes. 100% handwritten. CR LF NUL, byte 28/31 | Literal ASCII final line; zero terminates the string. |
| 236 | `00001101` | `0D` | data: 512 bytes. 100% handwritten. CR LF NUL, byte 29/31 | Literal ASCII final line; zero terminates the string. |
| 237 | `00001010` | `0A` | data: 512 bytes. 100% handwritten. CR LF NUL, byte 30/31 | Literal ASCII final line; zero terminates the string. |
| 238 | `00000000` | `00` | data: 512 bytes. 100% handwritten. CR LF NUL, byte 31/31 | Literal ASCII final line; zero terminates the string. |
| 239 | `00000000` | `00` | padding: zero fill, byte 1/16 | Sixteen unused bytes, never executed. |
| 240 | `00000000` | `00` | padding: zero fill, byte 2/16 | Sixteen unused bytes, never executed. |
| 241 | `00000000` | `00` | padding: zero fill, byte 3/16 | Sixteen unused bytes, never executed. |
| 242 | `00000000` | `00` | padding: zero fill, byte 4/16 | Sixteen unused bytes, never executed. |
| 243 | `00000000` | `00` | padding: zero fill, byte 5/16 | Sixteen unused bytes, never executed. |
| 244 | `00000000` | `00` | padding: zero fill, byte 6/16 | Sixteen unused bytes, never executed. |
| 245 | `00000000` | `00` | padding: zero fill, byte 7/16 | Sixteen unused bytes, never executed. |
| 246 | `00000000` | `00` | padding: zero fill, byte 8/16 | Sixteen unused bytes, never executed. |
| 247 | `00000000` | `00` | padding: zero fill, byte 9/16 | Sixteen unused bytes, never executed. |
| 248 | `00000000` | `00` | padding: zero fill, byte 10/16 | Sixteen unused bytes, never executed. |
| 249 | `00000000` | `00` | padding: zero fill, byte 11/16 | Sixteen unused bytes, never executed. |
| 250 | `00000000` | `00` | padding: zero fill, byte 12/16 | Sixteen unused bytes, never executed. |
| 251 | `00000000` | `00` | padding: zero fill, byte 13/16 | Sixteen unused bytes, never executed. |
| 252 | `00000000` | `00` | padding: zero fill, byte 14/16 | Sixteen unused bytes, never executed. |
| 253 | `00000000` | `00` | padding: zero fill, byte 15/16 | Sixteen unused bytes, never executed. |
| 254 | `00000000` | `00` | padding: zero fill, byte 16/16 | Sixteen unused bytes, never executed. |
| 255 | `00000000` | `00` | padding: zero fill, byte 1/16 | Sixteen unused bytes, never executed. |
| 256 | `00000000` | `00` | padding: zero fill, byte 2/16 | Sixteen unused bytes, never executed. |
| 257 | `00000000` | `00` | padding: zero fill, byte 3/16 | Sixteen unused bytes, never executed. |
| 258 | `00000000` | `00` | padding: zero fill, byte 4/16 | Sixteen unused bytes, never executed. |
| 259 | `00000000` | `00` | padding: zero fill, byte 5/16 | Sixteen unused bytes, never executed. |
| 260 | `00000000` | `00` | padding: zero fill, byte 6/16 | Sixteen unused bytes, never executed. |
| 261 | `00000000` | `00` | padding: zero fill, byte 7/16 | Sixteen unused bytes, never executed. |
| 262 | `00000000` | `00` | padding: zero fill, byte 8/16 | Sixteen unused bytes, never executed. |
| 263 | `00000000` | `00` | padding: zero fill, byte 9/16 | Sixteen unused bytes, never executed. |
| 264 | `00000000` | `00` | padding: zero fill, byte 10/16 | Sixteen unused bytes, never executed. |
| 265 | `00000000` | `00` | padding: zero fill, byte 11/16 | Sixteen unused bytes, never executed. |
| 266 | `00000000` | `00` | padding: zero fill, byte 12/16 | Sixteen unused bytes, never executed. |
| 267 | `00000000` | `00` | padding: zero fill, byte 13/16 | Sixteen unused bytes, never executed. |
| 268 | `00000000` | `00` | padding: zero fill, byte 14/16 | Sixteen unused bytes, never executed. |
| 269 | `00000000` | `00` | padding: zero fill, byte 15/16 | Sixteen unused bytes, never executed. |
| 270 | `00000000` | `00` | padding: zero fill, byte 16/16 | Sixteen unused bytes, never executed. |
| 271 | `00000000` | `00` | padding: zero fill, byte 1/16 | Sixteen unused bytes, never executed. |
| 272 | `00000000` | `00` | padding: zero fill, byte 2/16 | Sixteen unused bytes, never executed. |
| 273 | `00000000` | `00` | padding: zero fill, byte 3/16 | Sixteen unused bytes, never executed. |
| 274 | `00000000` | `00` | padding: zero fill, byte 4/16 | Sixteen unused bytes, never executed. |
| 275 | `00000000` | `00` | padding: zero fill, byte 5/16 | Sixteen unused bytes, never executed. |
| 276 | `00000000` | `00` | padding: zero fill, byte 6/16 | Sixteen unused bytes, never executed. |
| 277 | `00000000` | `00` | padding: zero fill, byte 7/16 | Sixteen unused bytes, never executed. |
| 278 | `00000000` | `00` | padding: zero fill, byte 8/16 | Sixteen unused bytes, never executed. |
| 279 | `00000000` | `00` | padding: zero fill, byte 9/16 | Sixteen unused bytes, never executed. |
| 280 | `00000000` | `00` | padding: zero fill, byte 10/16 | Sixteen unused bytes, never executed. |
| 281 | `00000000` | `00` | padding: zero fill, byte 11/16 | Sixteen unused bytes, never executed. |
| 282 | `00000000` | `00` | padding: zero fill, byte 12/16 | Sixteen unused bytes, never executed. |
| 283 | `00000000` | `00` | padding: zero fill, byte 13/16 | Sixteen unused bytes, never executed. |
| 284 | `00000000` | `00` | padding: zero fill, byte 14/16 | Sixteen unused bytes, never executed. |
| 285 | `00000000` | `00` | padding: zero fill, byte 15/16 | Sixteen unused bytes, never executed. |
| 286 | `00000000` | `00` | padding: zero fill, byte 16/16 | Sixteen unused bytes, never executed. |
| 287 | `00000000` | `00` | padding: zero fill, byte 1/16 | Sixteen unused bytes, never executed. |
| 288 | `00000000` | `00` | padding: zero fill, byte 2/16 | Sixteen unused bytes, never executed. |
| 289 | `00000000` | `00` | padding: zero fill, byte 3/16 | Sixteen unused bytes, never executed. |
| 290 | `00000000` | `00` | padding: zero fill, byte 4/16 | Sixteen unused bytes, never executed. |
| 291 | `00000000` | `00` | padding: zero fill, byte 5/16 | Sixteen unused bytes, never executed. |
| 292 | `00000000` | `00` | padding: zero fill, byte 6/16 | Sixteen unused bytes, never executed. |
| 293 | `00000000` | `00` | padding: zero fill, byte 7/16 | Sixteen unused bytes, never executed. |
| 294 | `00000000` | `00` | padding: zero fill, byte 8/16 | Sixteen unused bytes, never executed. |
| 295 | `00000000` | `00` | padding: zero fill, byte 9/16 | Sixteen unused bytes, never executed. |
| 296 | `00000000` | `00` | padding: zero fill, byte 10/16 | Sixteen unused bytes, never executed. |
| 297 | `00000000` | `00` | padding: zero fill, byte 11/16 | Sixteen unused bytes, never executed. |
| 298 | `00000000` | `00` | padding: zero fill, byte 12/16 | Sixteen unused bytes, never executed. |
| 299 | `00000000` | `00` | padding: zero fill, byte 13/16 | Sixteen unused bytes, never executed. |
| 300 | `00000000` | `00` | padding: zero fill, byte 14/16 | Sixteen unused bytes, never executed. |
| 301 | `00000000` | `00` | padding: zero fill, byte 15/16 | Sixteen unused bytes, never executed. |
| 302 | `00000000` | `00` | padding: zero fill, byte 16/16 | Sixteen unused bytes, never executed. |
| 303 | `00000000` | `00` | padding: zero fill, byte 1/16 | Sixteen unused bytes, never executed. |
| 304 | `00000000` | `00` | padding: zero fill, byte 2/16 | Sixteen unused bytes, never executed. |
| 305 | `00000000` | `00` | padding: zero fill, byte 3/16 | Sixteen unused bytes, never executed. |
| 306 | `00000000` | `00` | padding: zero fill, byte 4/16 | Sixteen unused bytes, never executed. |
| 307 | `00000000` | `00` | padding: zero fill, byte 5/16 | Sixteen unused bytes, never executed. |
| 308 | `00000000` | `00` | padding: zero fill, byte 6/16 | Sixteen unused bytes, never executed. |
| 309 | `00000000` | `00` | padding: zero fill, byte 7/16 | Sixteen unused bytes, never executed. |
| 310 | `00000000` | `00` | padding: zero fill, byte 8/16 | Sixteen unused bytes, never executed. |
| 311 | `00000000` | `00` | padding: zero fill, byte 9/16 | Sixteen unused bytes, never executed. |
| 312 | `00000000` | `00` | padding: zero fill, byte 10/16 | Sixteen unused bytes, never executed. |
| 313 | `00000000` | `00` | padding: zero fill, byte 11/16 | Sixteen unused bytes, never executed. |
| 314 | `00000000` | `00` | padding: zero fill, byte 12/16 | Sixteen unused bytes, never executed. |
| 315 | `00000000` | `00` | padding: zero fill, byte 13/16 | Sixteen unused bytes, never executed. |
| 316 | `00000000` | `00` | padding: zero fill, byte 14/16 | Sixteen unused bytes, never executed. |
| 317 | `00000000` | `00` | padding: zero fill, byte 15/16 | Sixteen unused bytes, never executed. |
| 318 | `00000000` | `00` | padding: zero fill, byte 16/16 | Sixteen unused bytes, never executed. |
| 319 | `00000000` | `00` | padding: zero fill, byte 1/16 | Sixteen unused bytes, never executed. |
| 320 | `00000000` | `00` | padding: zero fill, byte 2/16 | Sixteen unused bytes, never executed. |
| 321 | `00000000` | `00` | padding: zero fill, byte 3/16 | Sixteen unused bytes, never executed. |
| 322 | `00000000` | `00` | padding: zero fill, byte 4/16 | Sixteen unused bytes, never executed. |
| 323 | `00000000` | `00` | padding: zero fill, byte 5/16 | Sixteen unused bytes, never executed. |
| 324 | `00000000` | `00` | padding: zero fill, byte 6/16 | Sixteen unused bytes, never executed. |
| 325 | `00000000` | `00` | padding: zero fill, byte 7/16 | Sixteen unused bytes, never executed. |
| 326 | `00000000` | `00` | padding: zero fill, byte 8/16 | Sixteen unused bytes, never executed. |
| 327 | `00000000` | `00` | padding: zero fill, byte 9/16 | Sixteen unused bytes, never executed. |
| 328 | `00000000` | `00` | padding: zero fill, byte 10/16 | Sixteen unused bytes, never executed. |
| 329 | `00000000` | `00` | padding: zero fill, byte 11/16 | Sixteen unused bytes, never executed. |
| 330 | `00000000` | `00` | padding: zero fill, byte 12/16 | Sixteen unused bytes, never executed. |
| 331 | `00000000` | `00` | padding: zero fill, byte 13/16 | Sixteen unused bytes, never executed. |
| 332 | `00000000` | `00` | padding: zero fill, byte 14/16 | Sixteen unused bytes, never executed. |
| 333 | `00000000` | `00` | padding: zero fill, byte 15/16 | Sixteen unused bytes, never executed. |
| 334 | `00000000` | `00` | padding: zero fill, byte 16/16 | Sixteen unused bytes, never executed. |
| 335 | `00000000` | `00` | padding: zero fill, byte 1/16 | Sixteen unused bytes, never executed. |
| 336 | `00000000` | `00` | padding: zero fill, byte 2/16 | Sixteen unused bytes, never executed. |
| 337 | `00000000` | `00` | padding: zero fill, byte 3/16 | Sixteen unused bytes, never executed. |
| 338 | `00000000` | `00` | padding: zero fill, byte 4/16 | Sixteen unused bytes, never executed. |
| 339 | `00000000` | `00` | padding: zero fill, byte 5/16 | Sixteen unused bytes, never executed. |
| 340 | `00000000` | `00` | padding: zero fill, byte 6/16 | Sixteen unused bytes, never executed. |
| 341 | `00000000` | `00` | padding: zero fill, byte 7/16 | Sixteen unused bytes, never executed. |
| 342 | `00000000` | `00` | padding: zero fill, byte 8/16 | Sixteen unused bytes, never executed. |
| 343 | `00000000` | `00` | padding: zero fill, byte 9/16 | Sixteen unused bytes, never executed. |
| 344 | `00000000` | `00` | padding: zero fill, byte 10/16 | Sixteen unused bytes, never executed. |
| 345 | `00000000` | `00` | padding: zero fill, byte 11/16 | Sixteen unused bytes, never executed. |
| 346 | `00000000` | `00` | padding: zero fill, byte 12/16 | Sixteen unused bytes, never executed. |
| 347 | `00000000` | `00` | padding: zero fill, byte 13/16 | Sixteen unused bytes, never executed. |
| 348 | `00000000` | `00` | padding: zero fill, byte 14/16 | Sixteen unused bytes, never executed. |
| 349 | `00000000` | `00` | padding: zero fill, byte 15/16 | Sixteen unused bytes, never executed. |
| 350 | `00000000` | `00` | padding: zero fill, byte 16/16 | Sixteen unused bytes, never executed. |
| 351 | `00000000` | `00` | padding: zero fill, byte 1/16 | Sixteen unused bytes, never executed. |
| 352 | `00000000` | `00` | padding: zero fill, byte 2/16 | Sixteen unused bytes, never executed. |
| 353 | `00000000` | `00` | padding: zero fill, byte 3/16 | Sixteen unused bytes, never executed. |
| 354 | `00000000` | `00` | padding: zero fill, byte 4/16 | Sixteen unused bytes, never executed. |
| 355 | `00000000` | `00` | padding: zero fill, byte 5/16 | Sixteen unused bytes, never executed. |
| 356 | `00000000` | `00` | padding: zero fill, byte 6/16 | Sixteen unused bytes, never executed. |
| 357 | `00000000` | `00` | padding: zero fill, byte 7/16 | Sixteen unused bytes, never executed. |
| 358 | `00000000` | `00` | padding: zero fill, byte 8/16 | Sixteen unused bytes, never executed. |
| 359 | `00000000` | `00` | padding: zero fill, byte 9/16 | Sixteen unused bytes, never executed. |
| 360 | `00000000` | `00` | padding: zero fill, byte 10/16 | Sixteen unused bytes, never executed. |
| 361 | `00000000` | `00` | padding: zero fill, byte 11/16 | Sixteen unused bytes, never executed. |
| 362 | `00000000` | `00` | padding: zero fill, byte 12/16 | Sixteen unused bytes, never executed. |
| 363 | `00000000` | `00` | padding: zero fill, byte 13/16 | Sixteen unused bytes, never executed. |
| 364 | `00000000` | `00` | padding: zero fill, byte 14/16 | Sixteen unused bytes, never executed. |
| 365 | `00000000` | `00` | padding: zero fill, byte 15/16 | Sixteen unused bytes, never executed. |
| 366 | `00000000` | `00` | padding: zero fill, byte 16/16 | Sixteen unused bytes, never executed. |
| 367 | `00000000` | `00` | padding: zero fill, byte 1/16 | Sixteen unused bytes, never executed. |
| 368 | `00000000` | `00` | padding: zero fill, byte 2/16 | Sixteen unused bytes, never executed. |
| 369 | `00000000` | `00` | padding: zero fill, byte 3/16 | Sixteen unused bytes, never executed. |
| 370 | `00000000` | `00` | padding: zero fill, byte 4/16 | Sixteen unused bytes, never executed. |
| 371 | `00000000` | `00` | padding: zero fill, byte 5/16 | Sixteen unused bytes, never executed. |
| 372 | `00000000` | `00` | padding: zero fill, byte 6/16 | Sixteen unused bytes, never executed. |
| 373 | `00000000` | `00` | padding: zero fill, byte 7/16 | Sixteen unused bytes, never executed. |
| 374 | `00000000` | `00` | padding: zero fill, byte 8/16 | Sixteen unused bytes, never executed. |
| 375 | `00000000` | `00` | padding: zero fill, byte 9/16 | Sixteen unused bytes, never executed. |
| 376 | `00000000` | `00` | padding: zero fill, byte 10/16 | Sixteen unused bytes, never executed. |
| 377 | `00000000` | `00` | padding: zero fill, byte 11/16 | Sixteen unused bytes, never executed. |
| 378 | `00000000` | `00` | padding: zero fill, byte 12/16 | Sixteen unused bytes, never executed. |
| 379 | `00000000` | `00` | padding: zero fill, byte 13/16 | Sixteen unused bytes, never executed. |
| 380 | `00000000` | `00` | padding: zero fill, byte 14/16 | Sixteen unused bytes, never executed. |
| 381 | `00000000` | `00` | padding: zero fill, byte 15/16 | Sixteen unused bytes, never executed. |
| 382 | `00000000` | `00` | padding: zero fill, byte 16/16 | Sixteen unused bytes, never executed. |
| 383 | `00000000` | `00` | padding: zero fill, byte 1/16 | Sixteen unused bytes, never executed. |
| 384 | `00000000` | `00` | padding: zero fill, byte 2/16 | Sixteen unused bytes, never executed. |
| 385 | `00000000` | `00` | padding: zero fill, byte 3/16 | Sixteen unused bytes, never executed. |
| 386 | `00000000` | `00` | padding: zero fill, byte 4/16 | Sixteen unused bytes, never executed. |
| 387 | `00000000` | `00` | padding: zero fill, byte 5/16 | Sixteen unused bytes, never executed. |
| 388 | `00000000` | `00` | padding: zero fill, byte 6/16 | Sixteen unused bytes, never executed. |
| 389 | `00000000` | `00` | padding: zero fill, byte 7/16 | Sixteen unused bytes, never executed. |
| 390 | `00000000` | `00` | padding: zero fill, byte 8/16 | Sixteen unused bytes, never executed. |
| 391 | `00000000` | `00` | padding: zero fill, byte 9/16 | Sixteen unused bytes, never executed. |
| 392 | `00000000` | `00` | padding: zero fill, byte 10/16 | Sixteen unused bytes, never executed. |
| 393 | `00000000` | `00` | padding: zero fill, byte 11/16 | Sixteen unused bytes, never executed. |
| 394 | `00000000` | `00` | padding: zero fill, byte 12/16 | Sixteen unused bytes, never executed. |
| 395 | `00000000` | `00` | padding: zero fill, byte 13/16 | Sixteen unused bytes, never executed. |
| 396 | `00000000` | `00` | padding: zero fill, byte 14/16 | Sixteen unused bytes, never executed. |
| 397 | `00000000` | `00` | padding: zero fill, byte 15/16 | Sixteen unused bytes, never executed. |
| 398 | `00000000` | `00` | padding: zero fill, byte 16/16 | Sixteen unused bytes, never executed. |
| 399 | `00000000` | `00` | padding: zero fill, byte 1/16 | Sixteen unused bytes, never executed. |
| 400 | `00000000` | `00` | padding: zero fill, byte 2/16 | Sixteen unused bytes, never executed. |
| 401 | `00000000` | `00` | padding: zero fill, byte 3/16 | Sixteen unused bytes, never executed. |
| 402 | `00000000` | `00` | padding: zero fill, byte 4/16 | Sixteen unused bytes, never executed. |
| 403 | `00000000` | `00` | padding: zero fill, byte 5/16 | Sixteen unused bytes, never executed. |
| 404 | `00000000` | `00` | padding: zero fill, byte 6/16 | Sixteen unused bytes, never executed. |
| 405 | `00000000` | `00` | padding: zero fill, byte 7/16 | Sixteen unused bytes, never executed. |
| 406 | `00000000` | `00` | padding: zero fill, byte 8/16 | Sixteen unused bytes, never executed. |
| 407 | `00000000` | `00` | padding: zero fill, byte 9/16 | Sixteen unused bytes, never executed. |
| 408 | `00000000` | `00` | padding: zero fill, byte 10/16 | Sixteen unused bytes, never executed. |
| 409 | `00000000` | `00` | padding: zero fill, byte 11/16 | Sixteen unused bytes, never executed. |
| 410 | `00000000` | `00` | padding: zero fill, byte 12/16 | Sixteen unused bytes, never executed. |
| 411 | `00000000` | `00` | padding: zero fill, byte 13/16 | Sixteen unused bytes, never executed. |
| 412 | `00000000` | `00` | padding: zero fill, byte 14/16 | Sixteen unused bytes, never executed. |
| 413 | `00000000` | `00` | padding: zero fill, byte 15/16 | Sixteen unused bytes, never executed. |
| 414 | `00000000` | `00` | padding: zero fill, byte 16/16 | Sixteen unused bytes, never executed. |
| 415 | `00000000` | `00` | padding: zero fill, byte 1/16 | Sixteen unused bytes, never executed. |
| 416 | `00000000` | `00` | padding: zero fill, byte 2/16 | Sixteen unused bytes, never executed. |
| 417 | `00000000` | `00` | padding: zero fill, byte 3/16 | Sixteen unused bytes, never executed. |
| 418 | `00000000` | `00` | padding: zero fill, byte 4/16 | Sixteen unused bytes, never executed. |
| 419 | `00000000` | `00` | padding: zero fill, byte 5/16 | Sixteen unused bytes, never executed. |
| 420 | `00000000` | `00` | padding: zero fill, byte 6/16 | Sixteen unused bytes, never executed. |
| 421 | `00000000` | `00` | padding: zero fill, byte 7/16 | Sixteen unused bytes, never executed. |
| 422 | `00000000` | `00` | padding: zero fill, byte 8/16 | Sixteen unused bytes, never executed. |
| 423 | `00000000` | `00` | padding: zero fill, byte 9/16 | Sixteen unused bytes, never executed. |
| 424 | `00000000` | `00` | padding: zero fill, byte 10/16 | Sixteen unused bytes, never executed. |
| 425 | `00000000` | `00` | padding: zero fill, byte 11/16 | Sixteen unused bytes, never executed. |
| 426 | `00000000` | `00` | padding: zero fill, byte 12/16 | Sixteen unused bytes, never executed. |
| 427 | `00000000` | `00` | padding: zero fill, byte 13/16 | Sixteen unused bytes, never executed. |
| 428 | `00000000` | `00` | padding: zero fill, byte 14/16 | Sixteen unused bytes, never executed. |
| 429 | `00000000` | `00` | padding: zero fill, byte 15/16 | Sixteen unused bytes, never executed. |
| 430 | `00000000` | `00` | padding: zero fill, byte 16/16 | Sixteen unused bytes, never executed. |
| 431 | `00000000` | `00` | padding: zero fill, byte 1/16 | Sixteen unused bytes, never executed. |
| 432 | `00000000` | `00` | padding: zero fill, byte 2/16 | Sixteen unused bytes, never executed. |
| 433 | `00000000` | `00` | padding: zero fill, byte 3/16 | Sixteen unused bytes, never executed. |
| 434 | `00000000` | `00` | padding: zero fill, byte 4/16 | Sixteen unused bytes, never executed. |
| 435 | `00000000` | `00` | padding: zero fill, byte 5/16 | Sixteen unused bytes, never executed. |
| 436 | `00000000` | `00` | padding: zero fill, byte 6/16 | Sixteen unused bytes, never executed. |
| 437 | `00000000` | `00` | padding: zero fill, byte 7/16 | Sixteen unused bytes, never executed. |
| 438 | `00000000` | `00` | padding: zero fill, byte 8/16 | Sixteen unused bytes, never executed. |
| 439 | `00000000` | `00` | padding: zero fill, byte 9/16 | Sixteen unused bytes, never executed. |
| 440 | `00000000` | `00` | padding: zero fill, byte 10/16 | Sixteen unused bytes, never executed. |
| 441 | `00000000` | `00` | padding: zero fill, byte 11/16 | Sixteen unused bytes, never executed. |
| 442 | `00000000` | `00` | padding: zero fill, byte 12/16 | Sixteen unused bytes, never executed. |
| 443 | `00000000` | `00` | padding: zero fill, byte 13/16 | Sixteen unused bytes, never executed. |
| 444 | `00000000` | `00` | padding: zero fill, byte 14/16 | Sixteen unused bytes, never executed. |
| 445 | `00000000` | `00` | padding: zero fill, byte 15/16 | Sixteen unused bytes, never executed. |
| 446 | `00000000` | `00` | padding: zero fill, byte 16/16 | Sixteen unused bytes, never executed. |
| 447 | `00000000` | `00` | padding: zero fill, byte 1/16 | Sixteen unused bytes, never executed. |
| 448 | `00000000` | `00` | padding: zero fill, byte 2/16 | Sixteen unused bytes, never executed. |
| 449 | `00000000` | `00` | padding: zero fill, byte 3/16 | Sixteen unused bytes, never executed. |
| 450 | `00000000` | `00` | padding: zero fill, byte 4/16 | Sixteen unused bytes, never executed. |
| 451 | `00000000` | `00` | padding: zero fill, byte 5/16 | Sixteen unused bytes, never executed. |
| 452 | `00000000` | `00` | padding: zero fill, byte 6/16 | Sixteen unused bytes, never executed. |
| 453 | `00000000` | `00` | padding: zero fill, byte 7/16 | Sixteen unused bytes, never executed. |
| 454 | `00000000` | `00` | padding: zero fill, byte 8/16 | Sixteen unused bytes, never executed. |
| 455 | `00000000` | `00` | padding: zero fill, byte 9/16 | Sixteen unused bytes, never executed. |
| 456 | `00000000` | `00` | padding: zero fill, byte 10/16 | Sixteen unused bytes, never executed. |
| 457 | `00000000` | `00` | padding: zero fill, byte 11/16 | Sixteen unused bytes, never executed. |
| 458 | `00000000` | `00` | padding: zero fill, byte 12/16 | Sixteen unused bytes, never executed. |
| 459 | `00000000` | `00` | padding: zero fill, byte 13/16 | Sixteen unused bytes, never executed. |
| 460 | `00000000` | `00` | padding: zero fill, byte 14/16 | Sixteen unused bytes, never executed. |
| 461 | `00000000` | `00` | padding: zero fill, byte 15/16 | Sixteen unused bytes, never executed. |
| 462 | `00000000` | `00` | padding: zero fill, byte 16/16 | Sixteen unused bytes, never executed. |
| 463 | `00000000` | `00` | padding: zero fill, byte 1/16 | Sixteen unused bytes, never executed. |
| 464 | `00000000` | `00` | padding: zero fill, byte 2/16 | Sixteen unused bytes, never executed. |
| 465 | `00000000` | `00` | padding: zero fill, byte 3/16 | Sixteen unused bytes, never executed. |
| 466 | `00000000` | `00` | padding: zero fill, byte 4/16 | Sixteen unused bytes, never executed. |
| 467 | `00000000` | `00` | padding: zero fill, byte 5/16 | Sixteen unused bytes, never executed. |
| 468 | `00000000` | `00` | padding: zero fill, byte 6/16 | Sixteen unused bytes, never executed. |
| 469 | `00000000` | `00` | padding: zero fill, byte 7/16 | Sixteen unused bytes, never executed. |
| 470 | `00000000` | `00` | padding: zero fill, byte 8/16 | Sixteen unused bytes, never executed. |
| 471 | `00000000` | `00` | padding: zero fill, byte 9/16 | Sixteen unused bytes, never executed. |
| 472 | `00000000` | `00` | padding: zero fill, byte 10/16 | Sixteen unused bytes, never executed. |
| 473 | `00000000` | `00` | padding: zero fill, byte 11/16 | Sixteen unused bytes, never executed. |
| 474 | `00000000` | `00` | padding: zero fill, byte 12/16 | Sixteen unused bytes, never executed. |
| 475 | `00000000` | `00` | padding: zero fill, byte 13/16 | Sixteen unused bytes, never executed. |
| 476 | `00000000` | `00` | padding: zero fill, byte 14/16 | Sixteen unused bytes, never executed. |
| 477 | `00000000` | `00` | padding: zero fill, byte 15/16 | Sixteen unused bytes, never executed. |
| 478 | `00000000` | `00` | padding: zero fill, byte 16/16 | Sixteen unused bytes, never executed. |
| 479 | `00000000` | `00` | padding: zero fill, byte 1/16 | Sixteen unused bytes, never executed. |
| 480 | `00000000` | `00` | padding: zero fill, byte 2/16 | Sixteen unused bytes, never executed. |
| 481 | `00000000` | `00` | padding: zero fill, byte 3/16 | Sixteen unused bytes, never executed. |
| 482 | `00000000` | `00` | padding: zero fill, byte 4/16 | Sixteen unused bytes, never executed. |
| 483 | `00000000` | `00` | padding: zero fill, byte 5/16 | Sixteen unused bytes, never executed. |
| 484 | `00000000` | `00` | padding: zero fill, byte 6/16 | Sixteen unused bytes, never executed. |
| 485 | `00000000` | `00` | padding: zero fill, byte 7/16 | Sixteen unused bytes, never executed. |
| 486 | `00000000` | `00` | padding: zero fill, byte 8/16 | Sixteen unused bytes, never executed. |
| 487 | `00000000` | `00` | padding: zero fill, byte 9/16 | Sixteen unused bytes, never executed. |
| 488 | `00000000` | `00` | padding: zero fill, byte 10/16 | Sixteen unused bytes, never executed. |
| 489 | `00000000` | `00` | padding: zero fill, byte 11/16 | Sixteen unused bytes, never executed. |
| 490 | `00000000` | `00` | padding: zero fill, byte 12/16 | Sixteen unused bytes, never executed. |
| 491 | `00000000` | `00` | padding: zero fill, byte 13/16 | Sixteen unused bytes, never executed. |
| 492 | `00000000` | `00` | padding: zero fill, byte 14/16 | Sixteen unused bytes, never executed. |
| 493 | `00000000` | `00` | padding: zero fill, byte 15/16 | Sixteen unused bytes, never executed. |
| 494 | `00000000` | `00` | padding: zero fill, byte 16/16 | Sixteen unused bytes, never executed. |
| 495 | `00000000` | `00` | padding: zero fill, byte 1/15 | Fifteen bytes place the signature at offsets 510 and 511. |
| 496 | `00000000` | `00` | padding: zero fill, byte 2/15 | Fifteen bytes place the signature at offsets 510 and 511. |
| 497 | `00000000` | `00` | padding: zero fill, byte 3/15 | Fifteen bytes place the signature at offsets 510 and 511. |
| 498 | `00000000` | `00` | padding: zero fill, byte 4/15 | Fifteen bytes place the signature at offsets 510 and 511. |
| 499 | `00000000` | `00` | padding: zero fill, byte 5/15 | Fifteen bytes place the signature at offsets 510 and 511. |
| 500 | `00000000` | `00` | padding: zero fill, byte 6/15 | Fifteen bytes place the signature at offsets 510 and 511. |
| 501 | `00000000` | `00` | padding: zero fill, byte 7/15 | Fifteen bytes place the signature at offsets 510 and 511. |
| 502 | `00000000` | `00` | padding: zero fill, byte 8/15 | Fifteen bytes place the signature at offsets 510 and 511. |
| 503 | `00000000` | `00` | padding: zero fill, byte 9/15 | Fifteen bytes place the signature at offsets 510 and 511. |
| 504 | `00000000` | `00` | padding: zero fill, byte 10/15 | Fifteen bytes place the signature at offsets 510 and 511. |
| 505 | `00000000` | `00` | padding: zero fill, byte 11/15 | Fifteen bytes place the signature at offsets 510 and 511. |
| 506 | `00000000` | `00` | padding: zero fill, byte 12/15 | Fifteen bytes place the signature at offsets 510 and 511. |
| 507 | `00000000` | `00` | padding: zero fill, byte 13/15 | Fifteen bytes place the signature at offsets 510 and 511. |
| 508 | `00000000` | `00` | padding: zero fill, byte 14/15 | Fifteen bytes place the signature at offsets 510 and 511. |
| 509 | `00000000` | `00` | padding: zero fill, byte 15/15 | Fifteen bytes place the signature at offsets 510 and 511. |
| 510 | `01010101` | `55` | signature: BIOS boot signature, byte 1/2 | Literal 55 AA bytes; the little-endian word is AA55. These are data, never instructions. |
| 511 | `10101010` | `AA` | signature: BIOS boot signature, byte 2/2 | Literal 55 AA bytes; the little-endian word is AA55. These are data, never instructions. |
