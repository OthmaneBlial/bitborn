# Every byte explained

Generated from canonical `.bits` annotations by `python3 tools/byte_tables.py`.

Instruction names below are disassembly for explanation, never code-generation input.

| Offset | Binary | Hex | Range / byte within it | Encoding explanation |
| --- | --- | --- | --- | --- |
| 0 | `10111000` | `B8` | instruction: MOV AX,0003, byte 1/3 | B8 imm16 selects VGA text mode. |
| 1 | `00000011` | `03` | instruction: MOV AX,0003, byte 2/3 | B8 imm16 selects VGA text mode. |
| 2 | `00000000` | `00` | instruction: MOV AX,0003, byte 3/3 | B8 imm16 selects VGA text mode. |
| 3 | `11001101` | `CD` | instruction: INT 10, byte 1/2 | CD 10 clears and configures the screen. |
| 4 | `00010000` | `10` | instruction: INT 10, byte 2/2 | CD 10 clears and configures the screen. |
| 5 | `10111010` | `BA` | instruction: MOV DX,03F9, byte 1/3 | BA selects COM1 interrupt enable. |
| 6 | `11111001` | `F9` | instruction: MOV DX,03F9, byte 2/3 | BA selects COM1 interrupt enable. |
| 7 | `00000011` | `03` | instruction: MOV DX,03F9, byte 3/3 | BA selects COM1 interrupt enable. |
| 8 | `10110000` | `B0` | instruction: MOV AL,00, byte 1/2 | B0 disables UART interrupts. |
| 9 | `00000000` | `00` | instruction: MOV AL,00, byte 2/2 | B0 disables UART interrupts. |
| 10 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | EE writes the selected register. |
| 11 | `10111010` | `BA` | instruction: MOV DX,03FB, byte 1/3 | BA selects UART line control. |
| 12 | `11111011` | `FB` | instruction: MOV DX,03FB, byte 2/3 | BA selects UART line control. |
| 13 | `00000011` | `03` | instruction: MOV DX,03FB, byte 3/3 | BA selects UART line control. |
| 14 | `10110000` | `B0` | instruction: MOV AL,80, byte 1/2 | B0 enables baud divisor access. |
| 15 | `10000000` | `80` | instruction: MOV AL,80, byte 2/2 | B0 enables baud divisor access. |
| 16 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | EE writes DLAB. |
| 17 | `10111010` | `BA` | instruction: MOV DX,03F8, byte 1/3 | BA selects divisor low byte. |
| 18 | `11111000` | `F8` | instruction: MOV DX,03F8, byte 2/3 | BA selects divisor low byte. |
| 19 | `00000011` | `03` | instruction: MOV DX,03F8, byte 3/3 | BA selects divisor low byte. |
| 20 | `10110000` | `B0` | instruction: MOV AL,01, byte 1/2 | B0 sets divisor one for 115200 baud. |
| 21 | `00000001` | `01` | instruction: MOV AL,01, byte 2/2 | B0 sets divisor one for 115200 baud. |
| 22 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | EE writes divisor low byte. |
| 23 | `01000010` | `42` | instruction: INC DX, byte 1/1 | 42 advances to divisor high-byte port. |
| 24 | `10110000` | `B0` | instruction: MOV AL,00, byte 1/2 | B0 clears the divisor high byte. |
| 25 | `00000000` | `00` | instruction: MOV AL,00, byte 2/2 | B0 clears the divisor high byte. |
| 26 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | EE writes divisor high byte. |
| 27 | `10111010` | `BA` | instruction: MOV DX,03FB, byte 1/3 | BA selects UART line control. |
| 28 | `11111011` | `FB` | instruction: MOV DX,03FB, byte 2/3 | BA selects UART line control. |
| 29 | `00000011` | `03` | instruction: MOV DX,03FB, byte 3/3 | BA selects UART line control. |
| 30 | `10110000` | `B0` | instruction: MOV AL,03, byte 1/2 | B0 selects 8N1 and clears DLAB. |
| 31 | `00000011` | `03` | instruction: MOV AL,03, byte 2/2 | B0 selects 8N1 and clears DLAB. |
| 32 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | EE configures serial framing. |
| 33 | `10111110` | `BE` | instruction: MOV SI,7E48, byte 1/3 | BE loads message pointer, second-stage offset 72. |
| 34 | `01001000` | `48` | instruction: MOV SI,7E48, byte 2/3 | BE loads message pointer, second-stage offset 72. |
| 35 | `01111110` | `7E` | instruction: MOV SI,7E48, byte 3/3 | BE loads message pointer, second-stage offset 72. |
| 36 | `10101100` | `AC` | instruction: LODSB, byte 1/1 | AC reads ASCII and advances SI. |
| 37 | `10000100` | `84` | instruction: TEST AL,AL, byte 1/2 | 84 C0 tests for NUL. |
| 38 | `11000000` | `C0` | instruction: TEST AL,AL, byte 2/2 | 84 C0 tests for NUL. |
| 39 | `01110100` | `74` | instruction: JZ halt, byte 1/2 | 74 rel8; next offset 41 + 27 = halt at 68. |
| 40 | `00011011` | `1B` | instruction: JZ halt, byte 2/2 | 74 rel8; next offset 41 + 27 = halt at 68. |
| 41 | `01010000` | `50` | instruction: PUSH AX, byte 1/1 | 50 preserves the character across BIOS output. |
| 42 | `01010110` | `56` | instruction: PUSH SI, byte 1/1 | 56 preserves the message pointer. |
| 43 | `10110100` | `B4` | instruction: MOV AH,0E, byte 1/2 | B4 selects BIOS teletype. |
| 44 | `00001110` | `0E` | instruction: MOV AH,0E, byte 2/2 | B4 selects BIOS teletype. |
| 45 | `10111011` | `BB` | instruction: MOV BX,0007, byte 1/3 | BB selects page zero and attribute seven. |
| 46 | `00000111` | `07` | instruction: MOV BX,0007, byte 2/3 | BB selects page zero and attribute seven. |
| 47 | `00000000` | `00` | instruction: MOV BX,0007, byte 3/3 | BB selects page zero and attribute seven. |
| 48 | `11001101` | `CD` | instruction: INT 10, byte 1/2 | CD 10 prints the loaded disk-sector message. |
| 49 | `00010000` | `10` | instruction: INT 10, byte 2/2 | CD 10 prints the loaded disk-sector message. |
| 50 | `01011110` | `5E` | instruction: POP SI, byte 1/1 | 5E restores SI. |
| 51 | `01011000` | `58` | instruction: POP AX, byte 1/1 | 58 restores the character. |
| 52 | `01010000` | `50` | instruction: PUSH AX, byte 1/1 | 50 preserves it during UART polling. |
| 53 | `10111010` | `BA` | instruction: MOV DX,03FD, byte 1/3 | BA selects UART line status. |
| 54 | `11111101` | `FD` | instruction: MOV DX,03FD, byte 2/3 | BA selects UART line status. |
| 55 | `00000011` | `03` | instruction: MOV DX,03FD, byte 3/3 | BA selects UART line status. |
| 56 | `11101100` | `EC` | instruction: IN AL,DX, byte 1/1 | EC reads status. |
| 57 | `10101000` | `A8` | instruction: TEST AL,20, byte 1/2 | A8 checks transmitter-ready bit five. |
| 58 | `00100000` | `20` | instruction: TEST AL,20, byte 2/2 | A8 checks transmitter-ready bit five. |
| 59 | `01110100` | `74` | instruction: JZ poll, byte 1/2 | 74 FB loops back to IN until ready. |
| 60 | `11111011` | `FB` | instruction: JZ poll, byte 2/2 | 74 FB loops back to IN until ready. |
| 61 | `01011000` | `58` | instruction: POP AX, byte 1/1 | 58 restores the message byte. |
| 62 | `10111010` | `BA` | instruction: MOV DX,03F8, byte 1/3 | BA selects UART transmit register. |
| 63 | `11111000` | `F8` | instruction: MOV DX,03F8, byte 2/3 | BA selects UART transmit register. |
| 64 | `00000011` | `03` | instruction: MOV DX,03F8, byte 3/3 | BA selects UART transmit register. |
| 65 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | EE prints the message on serial. |
| 66 | `11101011` | `EB` | instruction: JMP print, byte 1/2 | EB E0 returns to LODSB, 32 bytes before the next instruction. |
| 67 | `11100000` | `E0` | instruction: JMP print, byte 2/2 | EB E0 returns to LODSB, 32 bytes before the next instruction. |
| 68 | `11111010` | `FA` | instruction: CLI, byte 1/1 | FA masks interrupts before final halt. |
| 69 | `11110100` | `F4` | instruction: HLT, byte 1/1 | F4 stops the second stage. |
| 70 | `11101011` | `EB` | instruction: JMP halt, byte 1/2 | EB FD returns to HLT if awakened. |
| 71 | `11111101` | `FD` | instruction: JMP halt, byte 2/2 | EB FD returns to HLT if awakened. |
| 72 | `01010011` | `53` | data: Sector 2 loaded! CR LF NUL, byte 1/19 | Literal proof message executes only after the BIOS disk read succeeds. |
| 73 | `01100101` | `65` | data: Sector 2 loaded! CR LF NUL, byte 2/19 | Literal proof message executes only after the BIOS disk read succeeds. |
| 74 | `01100011` | `63` | data: Sector 2 loaded! CR LF NUL, byte 3/19 | Literal proof message executes only after the BIOS disk read succeeds. |
| 75 | `01110100` | `74` | data: Sector 2 loaded! CR LF NUL, byte 4/19 | Literal proof message executes only after the BIOS disk read succeeds. |
| 76 | `01101111` | `6F` | data: Sector 2 loaded! CR LF NUL, byte 5/19 | Literal proof message executes only after the BIOS disk read succeeds. |
| 77 | `01110010` | `72` | data: Sector 2 loaded! CR LF NUL, byte 6/19 | Literal proof message executes only after the BIOS disk read succeeds. |
| 78 | `00100000` | `20` | data: Sector 2 loaded! CR LF NUL, byte 7/19 | Literal proof message executes only after the BIOS disk read succeeds. |
| 79 | `00110010` | `32` | data: Sector 2 loaded! CR LF NUL, byte 8/19 | Literal proof message executes only after the BIOS disk read succeeds. |
| 80 | `00100000` | `20` | data: Sector 2 loaded! CR LF NUL, byte 9/19 | Literal proof message executes only after the BIOS disk read succeeds. |
| 81 | `01101100` | `6C` | data: Sector 2 loaded! CR LF NUL, byte 10/19 | Literal proof message executes only after the BIOS disk read succeeds. |
| 82 | `01101111` | `6F` | data: Sector 2 loaded! CR LF NUL, byte 11/19 | Literal proof message executes only after the BIOS disk read succeeds. |
| 83 | `01100001` | `61` | data: Sector 2 loaded! CR LF NUL, byte 12/19 | Literal proof message executes only after the BIOS disk read succeeds. |
| 84 | `01100100` | `64` | data: Sector 2 loaded! CR LF NUL, byte 13/19 | Literal proof message executes only after the BIOS disk read succeeds. |
| 85 | `01100101` | `65` | data: Sector 2 loaded! CR LF NUL, byte 14/19 | Literal proof message executes only after the BIOS disk read succeeds. |
| 86 | `01100100` | `64` | data: Sector 2 loaded! CR LF NUL, byte 15/19 | Literal proof message executes only after the BIOS disk read succeeds. |
| 87 | `00100001` | `21` | data: Sector 2 loaded! CR LF NUL, byte 16/19 | Literal proof message executes only after the BIOS disk read succeeds. |
| 88 | `00001101` | `0D` | data: Sector 2 loaded! CR LF NUL, byte 17/19 | Literal proof message executes only after the BIOS disk read succeeds. |
| 89 | `00001010` | `0A` | data: Sector 2 loaded! CR LF NUL, byte 18/19 | Literal proof message executes only after the BIOS disk read succeeds. |
| 90 | `00000000` | `00` | data: Sector 2 loaded! CR LF NUL, byte 19/19 | Literal proof message executes only after the BIOS disk read succeeds. |
