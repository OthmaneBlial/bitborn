# Every byte explained

Generated from canonical `.bits` annotations by `python3 tools/byte_tables.py`.

Instruction names below are disassembly for explanation, never code-generation input.

| Offset | Binary | Hex | Range / byte within it | Encoding explanation |
| --- | --- | --- | --- | --- |
| 0 | `01100000` | `60` | instruction: PUSHA, byte 1/1 | Preserve all eight caller GPRs, including the original SP slot. |
| 1 | `00011110` | `1E` | instruction: PUSH DS, byte 1/1 | Preserve the caller data segment. |
| 2 | `00000110` | `06` | instruction: PUSH ES, byte 1/1 | Preserve the caller extra segment. |
| 3 | `10011100` | `9C` | instruction: PUSHF, byte 1/1 | Preserve caller flags, including interrupt and direction state. |
| 4 | `11111100` | `FC` | instruction: CLD, byte 1/1 | String traversal inside this app runs forward. |
| 5 | `10111110` | `BE` | instruction: MOV SI,906E, byte 1/3 | Prefix begins at app offset 110. |
| 6 | `01101110` | `6E` | instruction: MOV SI,906E, byte 2/3 | Prefix begins at app offset 110. |
| 7 | `10010000` | `90` | instruction: MOV SI,906E, byte 3/3 | Prefix begins at app offset 110. |
| 8 | `11101000` | `E8` | instruction: CALL puts, byte 1/3 | Next offset 11 plus 28 reaches puts at 39. |
| 9 | `00011100` | `1C` | instruction: CALL puts, byte 2/3 | Next offset 11 plus 28 reaches puts at 39. |
| 10 | `00000000` | `00` | instruction: CALL puts, byte 3/3 | Next offset 11 plus 28 reaches puts at 39. |
| 11 | `10111000` | `B8` | instruction: MOV AX,0, byte 1/3 | Begin the actual arithmetic result at zero. |
| 12 | `00000000` | `00` | instruction: MOV AX,0, byte 2/3 | Begin the actual arithmetic result at zero. |
| 13 | `00000000` | `00` | instruction: MOV AX,0, byte 3/3 | Begin the actual arithmetic result at zero. |
| 14 | `10111001` | `B9` | instruction: MOV CX,7, byte 1/3 | Execute seven additions of six. |
| 15 | `00000111` | `07` | instruction: MOV CX,7, byte 2/3 | Execute seven additions of six. |
| 16 | `00000000` | `00` | instruction: MOV CX,7, byte 3/3 | Execute seven additions of six. |
| 17 | `00000101` | `05` | instruction: ADD AX,6, byte 1/3 | Add six to the actual 16-bit result. |
| 18 | `00000110` | `06` | instruction: ADD AX,6, byte 2/3 | Add six to the actual 16-bit result. |
| 19 | `00000000` | `00` | instruction: ADD AX,6, byte 3/3 | Add six to the actual 16-bit result. |
| 20 | `11100010` | `E2` | instruction: LOOP add_six, byte 1/2 | Next offset 22 minus five returns to ADD at 17 until CX becomes zero. |
| 21 | `11111011` | `FB` | instruction: LOOP add_six, byte 2/2 | Next offset 22 minus five returns to ADD at 17 until CX becomes zero. |
| 22 | `10100010` | `A2` | instruction: MOV [0601],AL, byte 1/3 | Store the actual result 2A into a second fixed RAM experiment byte. |
| 23 | `00000001` | `01` | instruction: MOV [0601],AL, byte 2/3 | Store the actual result 2A into a second fixed RAM experiment byte. |
| 24 | `00000110` | `06` | instruction: MOV [0601],AL, byte 3/3 | Store the actual result 2A into a second fixed RAM experiment byte. |
| 25 | `11101000` | `E8` | instruction: CALL hex, byte 1/3 | Next offset 28 plus 58 reaches hexadecimal output at 86. |
| 26 | `00111010` | `3A` | instruction: CALL hex, byte 2/3 | Next offset 28 plus 58 reaches hexadecimal output at 86. |
| 27 | `00000000` | `00` | instruction: CALL hex, byte 3/3 | Next offset 28 plus 58 reaches hexadecimal output at 86. |
| 28 | `10111110` | `BE` | instruction: MOV SI,9081, byte 1/3 | Suffix begins at app offset 129. |
| 29 | `10000001` | `81` | instruction: MOV SI,9081, byte 2/3 | Suffix begins at app offset 129. |
| 30 | `10010000` | `90` | instruction: MOV SI,9081, byte 3/3 | Suffix begins at app offset 129. |
| 31 | `11101000` | `E8` | instruction: CALL puts, byte 1/3 | Next offset 34 plus five reaches puts at 39. |
| 32 | `00000101` | `05` | instruction: CALL puts, byte 2/3 | Next offset 34 plus five reaches puts at 39. |
| 33 | `00000000` | `00` | instruction: CALL puts, byte 3/3 | Next offset 34 plus five reaches puts at 39. |
| 34 | `10011101` | `9D` | instruction: POPF, byte 1/1 | Restore caller flags after app output. |
| 35 | `00000111` | `07` | instruction: POP ES, byte 1/1 | Restore the caller extra segment. |
| 36 | `00011111` | `1F` | instruction: POP DS, byte 1/1 | Restore the caller data segment. |
| 37 | `01100001` | `61` | instruction: POPA, byte 1/1 | Restore caller GPRs; the saved SP slot is discarded as specified by x86. |
| 38 | `11000011` | `C3` | instruction: RET, byte 1/1 | Return to the shell's near-call return IP, 7FAD. |
| 39 | `10101100` | `AC` | instruction: LODSB, byte 1/1 | Fetch the next NUL-terminated output byte through DS:SI. |
| 40 | `10000100` | `84` | instruction: TEST AL,AL, byte 1/2 | Test for the terminator. |
| 41 | `11000000` | `C0` | instruction: TEST AL,AL, byte 2/2 | Test for the terminator. |
| 42 | `01110100` | `74` | instruction: JZ puts_done, byte 1/2 | Next offset 44 plus five reaches RET at 49. |
| 43 | `00000101` | `05` | instruction: JZ puts_done, byte 2/2 | Next offset 44 plus five reaches RET at 49. |
| 44 | `11101000` | `E8` | instruction: CALL putc, byte 1/3 | Next offset 47 plus three reaches putc at 50. |
| 45 | `00000011` | `03` | instruction: CALL putc, byte 2/3 | Next offset 47 plus three reaches putc at 50. |
| 46 | `00000000` | `00` | instruction: CALL putc, byte 3/3 | Next offset 47 plus three reaches putc at 50. |
| 47 | `11101011` | `EB` | instruction: JMP puts, byte 1/2 | Next offset 49 minus ten returns to LODSB at 39. |
| 48 | `11110110` | `F6` | instruction: JMP puts, byte 2/2 | Next offset 49 minus ten returns to LODSB at 39. |
| 49 | `11000011` | `C3` | instruction: RET, byte 1/1 | Return after the complete string. |
| 50 | `01010000` | `50` | instruction: PUSH AX, byte 1/1 | Preserve the original character and caller value. |
| 51 | `01010011` | `53` | instruction: PUSH BX, byte 1/1 | Preserve caller BX across BIOS output. |
| 52 | `01010001` | `51` | instruction: PUSH CX, byte 1/1 | Preserve the arithmetic loop counter. |
| 53 | `01010010` | `52` | instruction: PUSH DX, byte 1/1 | Preserve caller DX across UART polling. |
| 54 | `01010110` | `56` | instruction: PUSH SI, byte 1/1 | Preserve the string pointer. |
| 55 | `01010111` | `57` | instruction: PUSH DI, byte 1/1 | Preserve the input cursor. |
| 56 | `01010000` | `50` | instruction: PUSH AX, byte 1/1 | Keep the character across the video BIOS call. |
| 57 | `10110100` | `B4` | instruction: MOV AH,0E, byte 1/2 | Select BIOS teletype output. |
| 58 | `00001110` | `0E` | instruction: MOV AH,0E, byte 2/2 | Select BIOS teletype output. |
| 59 | `10111011` | `BB` | instruction: MOV BX,0007, byte 1/3 | Select page zero and text attribute seven. |
| 60 | `00000111` | `07` | instruction: MOV BX,0007, byte 2/3 | Select page zero and text attribute seven. |
| 61 | `00000000` | `00` | instruction: MOV BX,0007, byte 3/3 | Select page zero and text attribute seven. |
| 62 | `11001101` | `CD` | instruction: INT 10, byte 1/2 | Print the actual character on VGA. |
| 63 | `00010000` | `10` | instruction: INT 10, byte 2/2 | Print the actual character on VGA. |
| 64 | `01011000` | `58` | instruction: POP AX, byte 1/1 | Recover the original character. |
| 65 | `01010000` | `50` | instruction: PUSH AX, byte 1/1 | Preserve the character while polling readiness. |
| 66 | `10111010` | `BA` | instruction: MOV DX,03FD, byte 1/3 | Select COM1 line-status port. |
| 67 | `11111101` | `FD` | instruction: MOV DX,03FD, byte 2/3 | Select COM1 line-status port. |
| 68 | `00000011` | `03` | instruction: MOV DX,03FD, byte 3/3 | Select COM1 line-status port. |
| 69 | `11101100` | `EC` | instruction: IN AL,DX, byte 1/1 | Read actual UART status. |
| 70 | `10101000` | `A8` | instruction: TEST AL,20, byte 1/2 | Test the transmit-ready bit. |
| 71 | `00100000` | `20` | instruction: TEST AL,20, byte 2/2 | Test the transmit-ready bit. |
| 72 | `01110100` | `74` | instruction: JZ poll_serial, byte 1/2 | Next offset 74 minus five returns to IN at 69. |
| 73 | `11111011` | `FB` | instruction: JZ poll_serial, byte 2/2 | Next offset 74 minus five returns to IN at 69. |
| 74 | `01011000` | `58` | instruction: POP AX, byte 1/1 | Recover the character after polling. |
| 75 | `10111010` | `BA` | instruction: MOV DX,03F8, byte 1/3 | Select COM1 data port. |
| 76 | `11111000` | `F8` | instruction: MOV DX,03F8, byte 2/3 | Select COM1 data port. |
| 77 | `00000011` | `03` | instruction: MOV DX,03F8, byte 3/3 | Select COM1 data port. |
| 78 | `11101110` | `EE` | instruction: OUT DX,AL, byte 1/1 | Emit the actual character to serial. |
| 79 | `01011111` | `5F` | instruction: POP DI, byte 1/1 | Restore DI. |
| 80 | `01011110` | `5E` | instruction: POP SI, byte 1/1 | Restore SI. |
| 81 | `01011010` | `5A` | instruction: POP DX, byte 1/1 | Restore DX. |
| 82 | `01011001` | `59` | instruction: POP CX, byte 1/1 | Restore CX. |
| 83 | `01011011` | `5B` | instruction: POP BX, byte 1/1 | Restore BX. |
| 84 | `01011000` | `58` | instruction: POP AX, byte 1/1 | Restore AX. |
| 85 | `11000011` | `C3` | instruction: RET, byte 1/1 | Return from output. |
| 86 | `01010000` | `50` | instruction: PUSH AX, byte 1/1 | Preserve the input byte for its low nibble. |
| 87 | `01010001` | `51` | instruction: PUSH CX, byte 1/1 | Preserve the caller count. |
| 88 | `10110001` | `B1` | instruction: MOV CL,04, byte 1/2 | Select a four-bit shift. |
| 89 | `00000100` | `04` | instruction: MOV CL,04, byte 2/2 | Select a four-bit shift. |
| 90 | `11010010` | `D2` | instruction: SHR AL,CL, byte 1/2 | Select the high nibble. |
| 91 | `11101000` | `E8` | instruction: SHR AL,CL, byte 2/2 | Select the high nibble. |
| 92 | `11101000` | `E8` | instruction: CALL nibble, byte 1/3 | Next offset 95 plus four reaches nibble conversion at 99. |
| 93 | `00000100` | `04` | instruction: CALL nibble, byte 2/3 | Next offset 95 plus four reaches nibble conversion at 99. |
| 94 | `00000000` | `00` | instruction: CALL nibble, byte 3/3 | Next offset 95 plus four reaches nibble conversion at 99. |
| 95 | `01011001` | `59` | instruction: POP CX, byte 1/1 | Restore the caller count. |
| 96 | `01011000` | `58` | instruction: POP AX, byte 1/1 | Recover the input byte. |
| 97 | `00100100` | `24` | instruction: AND AL,0F, byte 1/2 | Select its low nibble. |
| 98 | `00001111` | `0F` | instruction: AND AL,0F, byte 2/2 | Select its low nibble. |
| 99 | `00111100` | `3C` | instruction: CMP AL,0A, byte 1/2 | Test whether the hex digit needs alphabetic adjustment. |
| 100 | `00001010` | `0A` | instruction: CMP AL,0A, byte 2/2 | Test whether the hex digit needs alphabetic adjustment. |
| 101 | `01110010` | `72` | instruction: JB decimal_digit, byte 1/2 | Next offset 103 plus two skips the alphabetic adjustment. |
| 102 | `00000010` | `02` | instruction: JB decimal_digit, byte 2/2 | Next offset 103 plus two skips the alphabetic adjustment. |
| 103 | `00000100` | `04` | instruction: ADD AL,07, byte 1/2 | Adjust ten through fifteen toward A through F. |
| 104 | `00000111` | `07` | instruction: ADD AL,07, byte 2/2 | Adjust ten through fifteen toward A through F. |
| 105 | `00000100` | `04` | instruction: ADD AL,30, byte 1/2 | Convert the nibble to an ASCII hex digit. |
| 106 | `00110000` | `30` | instruction: ADD AL,30, byte 2/2 | Convert the nibble to an ASCII hex digit. |
| 107 | `11101001` | `E9` | instruction: JMP putc, byte 1/3 | Tail-call output; next offset 110 minus 60 reaches putc at 50. |
| 108 | `11000100` | `C4` | instruction: JMP putc, byte 2/3 | Tail-call output; next offset 110 minus 60 reaches putc at 50. |
| 109 | `11111111` | `FF` | instruction: JMP putc, byte 3/3 | Tail-call output; next offset 110 minus 60 reaches putc at 50. |
| 110 | `01000100` | `44` | data: DISK APP: 7 x 6 = space NUL, byte 1/19 | Literal prefix at offset 110, physical 906E; the following hex digits come from computed AX. |
| 111 | `01001001` | `49` | data: DISK APP: 7 x 6 = space NUL, byte 2/19 | Literal prefix at offset 110, physical 906E; the following hex digits come from computed AX. |
| 112 | `01010011` | `53` | data: DISK APP: 7 x 6 = space NUL, byte 3/19 | Literal prefix at offset 110, physical 906E; the following hex digits come from computed AX. |
| 113 | `01001011` | `4B` | data: DISK APP: 7 x 6 = space NUL, byte 4/19 | Literal prefix at offset 110, physical 906E; the following hex digits come from computed AX. |
| 114 | `00100000` | `20` | data: DISK APP: 7 x 6 = space NUL, byte 5/19 | Literal prefix at offset 110, physical 906E; the following hex digits come from computed AX. |
| 115 | `01000001` | `41` | data: DISK APP: 7 x 6 = space NUL, byte 6/19 | Literal prefix at offset 110, physical 906E; the following hex digits come from computed AX. |
| 116 | `01010000` | `50` | data: DISK APP: 7 x 6 = space NUL, byte 7/19 | Literal prefix at offset 110, physical 906E; the following hex digits come from computed AX. |
| 117 | `01010000` | `50` | data: DISK APP: 7 x 6 = space NUL, byte 8/19 | Literal prefix at offset 110, physical 906E; the following hex digits come from computed AX. |
| 118 | `00111010` | `3A` | data: DISK APP: 7 x 6 = space NUL, byte 9/19 | Literal prefix at offset 110, physical 906E; the following hex digits come from computed AX. |
| 119 | `00100000` | `20` | data: DISK APP: 7 x 6 = space NUL, byte 10/19 | Literal prefix at offset 110, physical 906E; the following hex digits come from computed AX. |
| 120 | `00110111` | `37` | data: DISK APP: 7 x 6 = space NUL, byte 11/19 | Literal prefix at offset 110, physical 906E; the following hex digits come from computed AX. |
| 121 | `00100000` | `20` | data: DISK APP: 7 x 6 = space NUL, byte 12/19 | Literal prefix at offset 110, physical 906E; the following hex digits come from computed AX. |
| 122 | `01111000` | `78` | data: DISK APP: 7 x 6 = space NUL, byte 13/19 | Literal prefix at offset 110, physical 906E; the following hex digits come from computed AX. |
| 123 | `00100000` | `20` | data: DISK APP: 7 x 6 = space NUL, byte 14/19 | Literal prefix at offset 110, physical 906E; the following hex digits come from computed AX. |
| 124 | `00110110` | `36` | data: DISK APP: 7 x 6 = space NUL, byte 15/19 | Literal prefix at offset 110, physical 906E; the following hex digits come from computed AX. |
| 125 | `00100000` | `20` | data: DISK APP: 7 x 6 = space NUL, byte 16/19 | Literal prefix at offset 110, physical 906E; the following hex digits come from computed AX. |
| 126 | `00111101` | `3D` | data: DISK APP: 7 x 6 = space NUL, byte 17/19 | Literal prefix at offset 110, physical 906E; the following hex digits come from computed AX. |
| 127 | `00100000` | `20` | data: DISK APP: 7 x 6 = space NUL, byte 18/19 | Literal prefix at offset 110, physical 906E; the following hex digits come from computed AX. |
| 128 | `00000000` | `00` | data: DISK APP: 7 x 6 = space NUL, byte 19/19 | Literal prefix at offset 110, physical 906E; the following hex digits come from computed AX. |
| 129 | `00100000` | `20` | data: space hex; RAM[0601]=2A CR LF NUL, byte 1/21 | Literal suffix at offset 129, physical 9081; the RAM store is separately verified. |
| 130 | `01101000` | `68` | data: space hex; RAM[0601]=2A CR LF NUL, byte 2/21 | Literal suffix at offset 129, physical 9081; the RAM store is separately verified. |
| 131 | `01100101` | `65` | data: space hex; RAM[0601]=2A CR LF NUL, byte 3/21 | Literal suffix at offset 129, physical 9081; the RAM store is separately verified. |
| 132 | `01111000` | `78` | data: space hex; RAM[0601]=2A CR LF NUL, byte 4/21 | Literal suffix at offset 129, physical 9081; the RAM store is separately verified. |
| 133 | `00111011` | `3B` | data: space hex; RAM[0601]=2A CR LF NUL, byte 5/21 | Literal suffix at offset 129, physical 9081; the RAM store is separately verified. |
| 134 | `00100000` | `20` | data: space hex; RAM[0601]=2A CR LF NUL, byte 6/21 | Literal suffix at offset 129, physical 9081; the RAM store is separately verified. |
| 135 | `01010010` | `52` | data: space hex; RAM[0601]=2A CR LF NUL, byte 7/21 | Literal suffix at offset 129, physical 9081; the RAM store is separately verified. |
| 136 | `01000001` | `41` | data: space hex; RAM[0601]=2A CR LF NUL, byte 8/21 | Literal suffix at offset 129, physical 9081; the RAM store is separately verified. |
| 137 | `01001101` | `4D` | data: space hex; RAM[0601]=2A CR LF NUL, byte 9/21 | Literal suffix at offset 129, physical 9081; the RAM store is separately verified. |
| 138 | `01011011` | `5B` | data: space hex; RAM[0601]=2A CR LF NUL, byte 10/21 | Literal suffix at offset 129, physical 9081; the RAM store is separately verified. |
| 139 | `00110000` | `30` | data: space hex; RAM[0601]=2A CR LF NUL, byte 11/21 | Literal suffix at offset 129, physical 9081; the RAM store is separately verified. |
| 140 | `00110110` | `36` | data: space hex; RAM[0601]=2A CR LF NUL, byte 12/21 | Literal suffix at offset 129, physical 9081; the RAM store is separately verified. |
| 141 | `00110000` | `30` | data: space hex; RAM[0601]=2A CR LF NUL, byte 13/21 | Literal suffix at offset 129, physical 9081; the RAM store is separately verified. |
| 142 | `00110001` | `31` | data: space hex; RAM[0601]=2A CR LF NUL, byte 14/21 | Literal suffix at offset 129, physical 9081; the RAM store is separately verified. |
| 143 | `01011101` | `5D` | data: space hex; RAM[0601]=2A CR LF NUL, byte 15/21 | Literal suffix at offset 129, physical 9081; the RAM store is separately verified. |
| 144 | `00111101` | `3D` | data: space hex; RAM[0601]=2A CR LF NUL, byte 16/21 | Literal suffix at offset 129, physical 9081; the RAM store is separately verified. |
| 145 | `00110010` | `32` | data: space hex; RAM[0601]=2A CR LF NUL, byte 17/21 | Literal suffix at offset 129, physical 9081; the RAM store is separately verified. |
| 146 | `01000001` | `41` | data: space hex; RAM[0601]=2A CR LF NUL, byte 18/21 | Literal suffix at offset 129, physical 9081; the RAM store is separately verified. |
| 147 | `00001101` | `0D` | data: space hex; RAM[0601]=2A CR LF NUL, byte 19/21 | Literal suffix at offset 129, physical 9081; the RAM store is separately verified. |
| 148 | `00001010` | `0A` | data: space hex; RAM[0601]=2A CR LF NUL, byte 20/21 | Literal suffix at offset 129, physical 9081; the RAM store is separately verified. |
| 149 | `00000000` | `00` | data: space hex; RAM[0601]=2A CR LF NUL, byte 21/21 | Literal suffix at offset 129, physical 9081; the RAM store is separately verified. |
