# Every byte explained

Generated from canonical `.bits` annotations by `python3 tools/byte_tables.py`.

Instruction names below are disassembly for explanation, never code-generation input.

| Offset | Binary | Hex | Range / byte within it | Encoding explanation |
| --- | --- | --- | --- | --- |
| 0 | `11111010` | `FA` | instruction: CLI, byte 1/1 | Disable hardware interrupts for the controlled experiment. |
| 1 | `11101010` | `EA` | instruction: JMP 0000:7C06, byte 1/5 | Normalize CS before BIOS calls and code-address calculations. |
| 2 | `00000110` | `06` | instruction: JMP 0000:7C06, byte 2/5 | Normalize CS before BIOS calls and code-address calculations. |
| 3 | `01111100` | `7C` | instruction: JMP 0000:7C06, byte 3/5 | Normalize CS before BIOS calls and code-address calculations. |
| 4 | `00000000` | `00` | instruction: JMP 0000:7C06, byte 4/5 | Normalize CS before BIOS calls and code-address calculations. |
| 5 | `00000000` | `00` | instruction: JMP 0000:7C06, byte 5/5 | Normalize CS before BIOS calls and code-address calculations. |
| 6 | `10111000` | `B8` | instruction: MOV AX,0003, byte 1/3 | Select the standard 80-column text mode. |
| 7 | `00000011` | `03` | instruction: MOV AX,0003, byte 2/3 | Select the standard 80-column text mode. |
| 8 | `00000000` | `00` | instruction: MOV AX,0003, byte 3/3 | Select the standard 80-column text mode. |
| 9 | `11001101` | `CD` | instruction: INT 10, byte 1/2 | Clear the native text display through the BIOS mode call. |
| 10 | `00010000` | `10` | instruction: INT 10, byte 2/2 | Clear the native text display through the BIOS mode call. |
| 11 | `00110001` | `31` | instruction: XOR AX,AX, byte 1/2 | Prepare zero for the data and stack segments. |
| 12 | `11000000` | `C0` | instruction: XOR AX,AX, byte 2/2 | Prepare zero for the data and stack segments. |
| 13 | `10001110` | `8E` | instruction: MOV DS,AX, byte 1/2 | DS zero makes BX a physical code address below 64 KiB. |
| 14 | `11011000` | `D8` | instruction: MOV DS,AX, byte 2/2 | DS zero makes BX a physical code address below 64 KiB. |
| 15 | `10001110` | `8E` | instruction: MOV SS,AX, byte 1/2 | Initialize the stack segment. |
| 16 | `11010000` | `D0` | instruction: MOV SS,AX, byte 2/2 | Initialize the stack segment. |
| 17 | `10111100` | `BC` | instruction: MOV SP,7C00, byte 1/3 | Initialize the stack pointer. |
| 18 | `00000000` | `00` | instruction: MOV SP,7C00, byte 2/3 | Initialize the stack pointer. |
| 19 | `01111100` | `7C` | instruction: MOV SP,7C00, byte 3/3 | Initialize the stack pointer. |
| 20 | `11111100` | `FC` | instruction: CLD, byte 1/1 | Make string stores advance DI. |
| 21 | `00110001` | `31` | instruction: XOR CX,CX, byte 1/2 | Define the otherwise unused word for native/model comparison. |
| 22 | `11001001` | `C9` | instruction: XOR CX,CX, byte 2/2 | Define the otherwise unused word for native/model comparison. |
| 23 | `00110001` | `31` | instruction: XOR SI,SI, byte 1/2 | Define SI without touching the loaded code. |
| 24 | `11110110` | `F6` | instruction: XOR SI,SI, byte 2/2 | Define SI without touching the loaded code. |
| 25 | `00110001` | `31` | instruction: XOR BP,BP, byte 1/2 | Define BP for complete register comparison. |
| 26 | `11101101` | `ED` | instruction: XOR BP,BP, byte 2/2 | Define BP for complete register comparison. |
| 27 | `10111010` | `BA` | instruction: MOV DX,03FB, byte 1/3 | Select the UART line-control register. |
| 28 | `11111011` | `FB` | instruction: MOV DX,03FB, byte 2/3 | Select the UART line-control register. |
| 29 | `00000011` | `03` | instruction: MOV DX,03FB, byte 3/3 | Select the UART line-control register. |
| 30 | `10110000` | `B0` | instruction: MOV AL,80, byte 1/2 | Enable the divisor latch. |
| 31 | `10000000` | `80` | instruction: MOV AL,80, byte 2/2 | Enable the divisor latch. |
| 32 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | Set UART DLAB. |
| 33 | `10111010` | `BA` | instruction: MOV DX,03F8, byte 1/3 | Select divisor-low while DLAB is set. |
| 34 | `11111000` | `F8` | instruction: MOV DX,03F8, byte 2/3 | Select divisor-low while DLAB is set. |
| 35 | `00000011` | `03` | instruction: MOV DX,03F8, byte 3/3 | Select divisor-low while DLAB is set. |
| 36 | `10110000` | `B0` | instruction: MOV AL,01, byte 1/2 | Divisor low byte one. |
| 37 | `00000001` | `01` | instruction: MOV AL,01, byte 2/2 | Divisor low byte one. |
| 38 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | Store the low divisor byte; this is not character output. |
| 39 | `01000010` | `42` | instruction: INC DX, byte 1/1 | Select divisor-high at 03F9. |
| 40 | `00110001` | `31` | instruction: XOR AX,AX, byte 1/2 | Divisor high byte zero; AF becomes undefined. |
| 41 | `11000000` | `C0` | instruction: XOR AX,AX, byte 2/2 | Divisor high byte zero; AF becomes undefined. |
| 42 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | Store the high divisor byte. |
| 43 | `10111010` | `BA` | instruction: MOV DX,03FB, byte 1/3 | Return to UART line control. |
| 44 | `11111011` | `FB` | instruction: MOV DX,03FB, byte 2/3 | Return to UART line control. |
| 45 | `00000011` | `03` | instruction: MOV DX,03FB, byte 3/3 | Return to UART line control. |
| 46 | `10110000` | `B0` | instruction: MOV AL,03, byte 1/2 | Configure eight data bits, no parity and one stop bit; clear DLAB. |
| 47 | `00000011` | `03` | instruction: MOV AL,03, byte 2/2 | Configure eight data bits, no parity and one stop bit; clear DLAB. |
| 48 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | Enable ordinary character output at 03F8. |
| 49 | `10110000` | `B0` | instruction: MOV AL,61, byte 1/2 | Writer immediate at source byte 50: lowercase a differs from A by bit 5. |
| 50 | `01100001` | `61` | instruction: MOV AL,61, byte 2/2 | Writer immediate at source byte 50: lowercase a differs from A by bit 5. |
| 51 | `10111011` | `BB` | instruction: MOV BX,7C3B, byte 1/3 | Point to source byte 59, the upcoming MOV immediate operand. |
| 52 | `00111011` | `3B` | instruction: MOV BX,7C3B, byte 2/3 | Point to source byte 59, the upcoming MOV immediate operand. |
| 53 | `01111100` | `7C` | instruction: MOV BX,7C3B, byte 3/3 | Point to source byte 59, the upcoming MOV immediate operand. |
| 54 | `10001000` | `88` | instruction: MOV [BX],AL, byte 1/2 | Change the future operand from 41 to 61 in RAM; the source file stays unchanged. |
| 55 | `00000111` | `07` | instruction: MOV [BX],AL, byte 2/2 | Change the future operand from 41 to 61 in RAM; the source file stays unchanged. |
| 56 | `11101011` | `EB` | instruction: JMP +0, byte 1/2 | Transfer control to the modified instruction after the store. |
| 57 | `00000000` | `00` | instruction: JMP +0, byte 2/2 | Transfer control to the modified instruction after the store. |
| 58 | `10110000` | `B0` | instruction: MOV AL,41, byte 1/2 | The literal file contains A; live instruction fetch sees the stored lowercase a. |
| 59 | `01000001` | `41` | instruction: MOV AL,41, byte 2/2 | The literal file contains A; live instruction fetch sees the stored lowercase a. |
| 60 | `10111010` | `BA` | instruction: MOV DX,03F8, byte 1/3 | Select ordinary UART character output. |
| 61 | `11111000` | `F8` | instruction: MOV DX,03F8, byte 2/3 | Select ordinary UART character output. |
| 62 | `00000011` | `03` | instruction: MOV DX,03F8, byte 3/3 | Select ordinary UART character output. |
| 63 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | Emit the value actually loaded by the modified instruction. |
| 64 | `01010000` | `50` | instruction: PUSH AX, byte 1/1 | Preserve the character while selecting the VGA segment. |
| 65 | `10111000` | `B8` | instruction: MOV AX,B800, byte 1/3 | Standard color text framebuffer segment. |
| 66 | `00000000` | `00` | instruction: MOV AX,B800, byte 2/3 | Standard color text framebuffer segment. |
| 67 | `10111000` | `B8` | instruction: MOV AX,B800, byte 3/3 | Standard color text framebuffer segment. |
| 68 | `10001110` | `8E` | instruction: MOV ES,AX, byte 1/2 | ES now selects physical B8000. |
| 69 | `11000000` | `C0` | instruction: MOV ES,AX, byte 2/2 | ES now selects physical B8000. |
| 70 | `01011000` | `58` | instruction: POP AX, byte 1/1 | Recover the character emitted on COM1. |
| 71 | `10110100` | `B4` | instruction: MOV AH,0F, byte 1/2 | Bright-white-on-black attribute without changing AL. |
| 72 | `00001111` | `0F` | instruction: MOV AH,0F, byte 2/2 | Bright-white-on-black attribute without changing AL. |
| 73 | `10111111` | `BF` | instruction: MOV DI,0000, byte 1/3 | Select the first VGA text cell. |
| 74 | `00000000` | `00` | instruction: MOV DI,0000, byte 2/3 | Select the first VGA text cell. |
| 75 | `00000000` | `00` | instruction: MOV DI,0000, byte 3/3 | Select the first VGA text cell. |
| 76 | `10101011` | `AB` | instruction: STOSW, byte 1/1 | Store character and attribute at B8000 and B8001. |
| 77 | `11110100` | `F4` | instruction: HLT, byte 1/1 | Expected next logical IP is 7C4E after 39 modeled instructions. |
| 78 | `11101011` | `EB` | instruction: JMP -3, byte 1/2 | Return to HLT if resumed. |
| 79 | `11111101` | `FD` | instruction: JMP -3, byte 2/2 | Return to HLT if resumed. |
