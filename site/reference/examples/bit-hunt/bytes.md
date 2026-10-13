# Every byte explained

Generated from canonical `.bits` annotations by `python3 tools/byte_tables.py`.

Instruction names below are disassembly for explanation, never code-generation input.

| Offset | Binary | Hex | Range / byte within it | Encoding explanation |
| --- | --- | --- | --- | --- |
| 0 | `11111010` | `FA` | instruction: CLI, byte 1/1 | Establish a stack before enabling BIOS keyboard interrupts. |
| 1 | `11101010` | `EA` | instruction: JMP 0000:7C06, byte 1/5 | Normalize the code segment. |
| 2 | `00000110` | `06` | instruction: JMP 0000:7C06, byte 2/5 | Normalize the code segment. |
| 3 | `01111100` | `7C` | instruction: JMP 0000:7C06, byte 3/5 | Normalize the code segment. |
| 4 | `00000000` | `00` | instruction: JMP 0000:7C06, byte 4/5 | Normalize the code segment. |
| 5 | `00000000` | `00` | instruction: JMP 0000:7C06, byte 5/5 | Normalize the code segment. |
| 6 | `00110001` | `31` | instruction: XOR AX,AX, byte 1/2 | Prepare segment zero. |
| 7 | `11000000` | `C0` | instruction: XOR AX,AX, byte 2/2 | Prepare segment zero. |
| 8 | `10001110` | `8E` | instruction: MOV DS,AX, byte 1/2 | Address game state and literal map through DS zero. |
| 9 | `11011000` | `D8` | instruction: MOV DS,AX, byte 2/2 | Address game state and literal map through DS zero. |
| 10 | `10001110` | `8E` | instruction: MOV SS,AX, byte 1/2 | Establish the stack segment. |
| 11 | `11010000` | `D0` | instruction: MOV SS,AX, byte 2/2 | Establish the stack segment. |
| 12 | `10111100` | `BC` | instruction: MOV SP,7C00, byte 1/3 | Place the stack below the boot source. |
| 13 | `00000000` | `00` | instruction: MOV SP,7C00, byte 2/3 | Place the stack below the boot source. |
| 14 | `01111100` | `7C` | instruction: MOV SP,7C00, byte 3/3 | Place the stack below the boot source. |
| 15 | `11111100` | `FC` | instruction: CLD, byte 1/1 | Establish forward rendering. |
| 16 | `11111011` | `FB` | instruction: STI, byte 1/1 | Enable firmware keyboard interrupts. |
| 17 | `10111000` | `B8` | instruction: MOV AX,3, byte 1/3 | Select VGA text mode. |
| 18 | `00000011` | `03` | instruction: MOV AX,3, byte 2/3 | Select VGA text mode. |
| 19 | `00000000` | `00` | instruction: MOV AX,3, byte 3/3 | Select VGA text mode. |
| 20 | `11001101` | `CD` | instruction: INT 10, byte 1/2 | Initialize the actual text display. |
| 21 | `00010000` | `10` | instruction: INT 10, byte 2/2 | Initialize the actual text display. |
| 22 | `00110001` | `31` | instruction: XOR AX,AX, byte 1/2 | Reestablish data segment zero after firmware setup. |
| 23 | `11000000` | `C0` | instruction: XOR AX,AX, byte 2/2 | Reestablish data segment zero after firmware setup. |
| 24 | `10001110` | `8E` | instruction: MOV DS,AX, byte 1/2 | Address the bounded game state. |
| 25 | `11011000` | `D8` | instruction: MOV DS,AX, byte 2/2 | Address the bounded game state. |
| 26 | `10111000` | `B8` | instruction: MOV AX,B800, byte 1/3 | Address VGA text memory. |
| 27 | `00000000` | `00` | instruction: MOV AX,B800, byte 2/3 | Address VGA text memory. |
| 28 | `10111000` | `B8` | instruction: MOV AX,B800, byte 3/3 | Address VGA text memory. |
| 29 | `10001110` | `8E` | instruction: MOV ES,AX, byte 1/2 | Select actual display RAM. |
| 30 | `11000000` | `C0` | instruction: MOV ES,AX, byte 2/2 | Select actual display RAM. |
| 31 | `11000110` | `C6` | instruction: MOV byte [1FFF],A5, byte 1/5 | Guard below the eight-byte game state. |
| 32 | `00000110` | `06` | instruction: MOV byte [1FFF],A5, byte 2/5 | Guard below the eight-byte game state. |
| 33 | `11111111` | `FF` | instruction: MOV byte [1FFF],A5, byte 3/5 | Guard below the eight-byte game state. |
| 34 | `00011111` | `1F` | instruction: MOV byte [1FFF],A5, byte 4/5 | Guard below the eight-byte game state. |
| 35 | `10100101` | `A5` | instruction: MOV byte [1FFF],A5, byte 5/5 | Guard below the eight-byte game state. |
| 36 | `11000110` | `C6` | instruction: MOV byte [2008],5A, byte 1/5 | Guard above the game state. |
| 37 | `00000110` | `06` | instruction: MOV byte [2008],5A, byte 2/5 | Guard above the game state. |
| 38 | `00001000` | `08` | instruction: MOV byte [2008],5A, byte 3/5 | Guard above the game state. |
| 39 | `00100000` | `20` | instruction: MOV byte [2008],5A, byte 4/5 | Guard above the game state. |
| 40 | `01011010` | `5A` | instruction: MOV byte [2008],5A, byte 5/5 | Guard above the game state. |
| 41 | `11000111` | `C7` | instruction: MOV word [2006],0, byte 1/6 | Initialize the modulo-65536 processed-key counter. |
| 42 | `00000110` | `06` | instruction: MOV word [2006],0, byte 2/6 | Initialize the modulo-65536 processed-key counter. |
| 43 | `00000110` | `06` | instruction: MOV word [2006],0, byte 3/6 | Initialize the modulo-65536 processed-key counter. |
| 44 | `00100000` | `20` | instruction: MOV word [2006],0, byte 4/6 | Initialize the modulo-65536 processed-key counter. |
| 45 | `00000000` | `00` | instruction: MOV word [2006],0, byte 5/6 | Initialize the modulo-65536 processed-key counter. |
| 46 | `00000000` | `00` | instruction: MOV word [2006],0, byte 6/6 | Initialize the modulo-65536 processed-key counter. |
| 47 | `11000111` | `C7` | instruction: MOV word [2000],13, byte 1/6 | Reset the player to row one, column one. |
| 48 | `00000110` | `06` | instruction: MOV word [2000],13, byte 2/6 | Reset the player to row one, column one. |
| 49 | `00000000` | `00` | instruction: MOV word [2000],13, byte 3/6 | Reset the player to row one, column one. |
| 50 | `00100000` | `20` | instruction: MOV word [2000],13, byte 4/6 | Reset the player to row one, column one. |
| 51 | `00001101` | `0D` | instruction: MOV word [2000],13, byte 5/6 | Reset the player to row one, column one. |
| 52 | `00000000` | `00` | instruction: MOV word [2000],13, byte 6/6 | Reset the player to row one, column one. |
| 53 | `11000111` | `C7` | instruction: MOV word [2002],0, byte 1/6 | Clear the saturating move count and its spare byte. |
| 54 | `00000110` | `06` | instruction: MOV word [2002],0, byte 2/6 | Clear the saturating move count and its spare byte. |
| 55 | `00000010` | `02` | instruction: MOV word [2002],0, byte 3/6 | Clear the saturating move count and its spare byte. |
| 56 | `00100000` | `20` | instruction: MOV word [2002],0, byte 4/6 | Clear the saturating move count and its spare byte. |
| 57 | `00000000` | `00` | instruction: MOV word [2002],0, byte 5/6 | Clear the saturating move count and its spare byte. |
| 58 | `00000000` | `00` | instruction: MOV word [2002],0, byte 6/6 | Clear the saturating move count and its spare byte. |
| 59 | `11000111` | `C7` | instruction: MOV word [2004],0, byte 1/6 | Clear the win flag and its spare byte. |
| 60 | `00000110` | `06` | instruction: MOV word [2004],0, byte 2/6 | Clear the win flag and its spare byte. |
| 61 | `00000100` | `04` | instruction: MOV word [2004],0, byte 3/6 | Clear the win flag and its spare byte. |
| 62 | `00100000` | `20` | instruction: MOV word [2004],0, byte 4/6 | Clear the win flag and its spare byte. |
| 63 | `00000000` | `00` | instruction: MOV word [2004],0, byte 5/6 | Clear the win flag and its spare byte. |
| 64 | `00000000` | `00` | instruction: MOV word [2004],0, byte 6/6 | Clear the win flag and its spare byte. |
| 65 | `11101000` | `E8` | instruction: CALL render, byte 1/3 | Render at source offset 224. |
| 66 | `10011100` | `9C` | instruction: CALL render, byte 2/3 | Render at source offset 224. |
| 67 | `00000000` | `00` | instruction: CALL render, byte 3/3 | Render at source offset 224. |
| 68 | `00110001` | `31` | instruction: XOR AX,AX, byte 1/2 | Select BIOS keyboard service zero. |
| 69 | `11000000` | `C0` | instruction: XOR AX,AX, byte 2/2 | Select BIOS keyboard service zero. |
| 70 | `00011110` | `1E` | instruction: PUSH DS, byte 1/1 | Preserve data addressing across firmware input. |
| 71 | `00000110` | `06` | instruction: PUSH ES, byte 1/1 | Preserve display addressing across firmware input. |
| 72 | `11001101` | `CD` | instruction: INT 16, byte 1/2 | Read one actual keyboard character. |
| 73 | `00010110` | `16` | instruction: INT 16, byte 2/2 | Read one actual keyboard character. |
| 74 | `00000111` | `07` | instruction: POP ES, byte 1/1 | Restore VGA addressing. |
| 75 | `00011111` | `1F` | instruction: POP DS, byte 1/1 | Restore game-state addressing. |
| 76 | `00100100` | `24` | instruction: AND AL,DF, byte 1/2 | Accept upper and lower ASCII letters through one comparison path. |
| 77 | `11011111` | `DF` | instruction: AND AL,DF, byte 2/2 | Accept upper and lower ASCII letters through one comparison path. |
| 78 | `11111111` | `FF` | instruction: INC word [2006], byte 1/4 | Count every processed key, including collisions and unknown input. |
| 79 | `00000110` | `06` | instruction: INC word [2006], byte 2/4 | Count every processed key, including collisions and unknown input. |
| 80 | `00000110` | `06` | instruction: INC word [2006], byte 3/4 | Count every processed key, including collisions and unknown input. |
| 81 | `00100000` | `20` | instruction: INC word [2006], byte 4/4 | Count every processed key, including collisions and unknown input. |
| 82 | `00111100` | `3C` | instruction: CMP AL,Q, byte 1/2 | Recognize quit. |
| 83 | `01010001` | `51` | instruction: CMP AL,Q, byte 2/2 | Recognize quit. |
| 84 | `01110100` | `74` | instruction: JE quit, byte 1/2 | Branch to the controlled halt at offset 176. |
| 85 | `01011010` | `5A` | instruction: JE quit, byte 2/2 | Branch to the controlled halt at offset 176. |
| 86 | `00111100` | `3C` | instruction: CMP AL,R, byte 1/2 | Recognize restart. |
| 87 | `01010010` | `52` | instruction: CMP AL,R, byte 2/2 | Recognize restart. |
| 88 | `01110100` | `74` | instruction: JE reset, byte 1/2 | Restore position, move count and win flag at offset 47. |
| 89 | `11010101` | `D5` | instruction: JE reset, byte 2/2 | Restore position, move count and win flag at offset 47. |
| 90 | `10001011` | `8B` | instruction: MOV BX,[2000], byte 1/4 | Begin a candidate move from the current map index. |
| 91 | `00011110` | `1E` | instruction: MOV BX,[2000], byte 2/4 | Begin a candidate move from the current map index. |
| 92 | `00000000` | `00` | instruction: MOV BX,[2000], byte 3/4 | Begin a candidate move from the current map index. |
| 93 | `00100000` | `20` | instruction: MOV BX,[2000], byte 4/4 | Begin a candidate move from the current map index. |
| 94 | `00111100` | `3C` | instruction: CMP AL,W, byte 1/2 | Recognize upward movement. |
| 95 | `01010111` | `57` | instruction: CMP AL,W, byte 2/2 | Recognize upward movement. |
| 96 | `01110101` | `75` | instruction: JNE left, byte 1/2 | Try the next direction when this is not W. |
| 97 | `00000101` | `05` | instruction: JNE left, byte 2/2 | Try the next direction when this is not W. |
| 98 | `10000011` | `83` | instruction: SUB BX,12, byte 1/3 | Move up one twelve-cell row. |
| 99 | `11101011` | `EB` | instruction: SUB BX,12, byte 2/3 | Move up one twelve-cell row. |
| 100 | `00001100` | `0C` | instruction: SUB BX,12, byte 3/3 | Move up one twelve-cell row. |
| 101 | `11101011` | `EB` | instruction: JMP validate, byte 1/2 | Validate the candidate index before any map access. |
| 102 | `00010101` | `15` | instruction: JMP validate, byte 2/2 | Validate the candidate index before any map access. |
| 103 | `00111100` | `3C` | instruction: CMP AL,A, byte 1/2 | Recognize left movement. |
| 104 | `01000001` | `41` | instruction: CMP AL,A, byte 2/2 | Recognize left movement. |
| 105 | `01110101` | `75` | instruction: JNE down, byte 1/2 | Try the next direction when this is not A. |
| 106 | `00000011` | `03` | instruction: JNE down, byte 2/2 | Try the next direction when this is not A. |
| 107 | `01001011` | `4B` | instruction: DEC BX, byte 1/1 | Move left by one cell. |
| 108 | `11101011` | `EB` | instruction: JMP validate, byte 1/2 | Share bounds and wall checks. |
| 109 | `00001110` | `0E` | instruction: JMP validate, byte 2/2 | Share bounds and wall checks. |
| 110 | `00111100` | `3C` | instruction: CMP AL,S, byte 1/2 | Recognize downward movement. |
| 111 | `01010011` | `53` | instruction: CMP AL,S, byte 2/2 | Recognize downward movement. |
| 112 | `01110101` | `75` | instruction: JNE right, byte 1/2 | Try the next direction when this is not S. |
| 113 | `00000101` | `05` | instruction: JNE right, byte 2/2 | Try the next direction when this is not S. |
| 114 | `10000011` | `83` | instruction: ADD BX,12, byte 1/3 | Move down one twelve-cell row. |
| 115 | `11000011` | `C3` | instruction: ADD BX,12, byte 2/3 | Move down one twelve-cell row. |
| 116 | `00001100` | `0C` | instruction: ADD BX,12, byte 3/3 | Move down one twelve-cell row. |
| 117 | `11101011` | `EB` | instruction: JMP validate, byte 1/2 | Share bounds and wall checks. |
| 118 | `00000101` | `05` | instruction: JMP validate, byte 2/2 | Share bounds and wall checks. |
| 119 | `00111100` | `3C` | instruction: CMP AL,D, byte 1/2 | Recognize right movement. |
| 120 | `01000100` | `44` | instruction: CMP AL,D, byte 2/2 | Recognize right movement. |
| 121 | `01110101` | `75` | instruction: JNE read, byte 1/2 | Ignore unknown input without changing position. |
| 122 | `11001001` | `C9` | instruction: JNE read, byte 2/2 | Ignore unknown input without changing position. |
| 123 | `01000011` | `43` | instruction: INC BX, byte 1/1 | Move right by one cell. |
| 124 | `10000011` | `83` | instruction: CMP BX,60, byte 1/3 | Bound the candidate to the sixty-byte map. |
| 125 | `11111011` | `FB` | instruction: CMP BX,60, byte 2/3 | Bound the candidate to the sixty-byte map. |
| 126 | `00111100` | `3C` | instruction: CMP BX,60, byte 3/3 | Bound the candidate to the sixty-byte map. |
| 127 | `01110011` | `73` | instruction: JAE read, byte 1/2 | Reject out-of-range or wrapped candidates before reading map RAM. |
| 128 | `11000011` | `C3` | instruction: JAE read, byte 2/2 | Reject out-of-range or wrapped candidates before reading map RAM. |
| 129 | `10000000` | `80` | instruction: CMP byte [BX+7D88],23, byte 1/5 | Check the immutable literal wall character. |
| 130 | `10111111` | `BF` | instruction: CMP byte [BX+7D88],23, byte 2/5 | Check the immutable literal wall character. |
| 131 | `10001000` | `88` | instruction: CMP byte [BX+7D88],23, byte 3/5 | Check the immutable literal wall character. |
| 132 | `01111101` | `7D` | instruction: CMP byte [BX+7D88],23, byte 4/5 | Check the immutable literal wall character. |
| 133 | `00100011` | `23` | instruction: CMP byte [BX+7D88],23, byte 5/5 | Check the immutable literal wall character. |
| 134 | `01110100` | `74` | instruction: JE read, byte 1/2 | Leave game state unchanged on collision. |
| 135 | `10111100` | `BC` | instruction: JE read, byte 2/2 | Leave game state unchanged on collision. |
| 136 | `10001001` | `89` | instruction: MOV [2000],BX, byte 1/4 | Commit an in-bounds non-wall candidate. |
| 137 | `00011110` | `1E` | instruction: MOV [2000],BX, byte 2/4 | Commit an in-bounds non-wall candidate. |
| 138 | `00000000` | `00` | instruction: MOV [2000],BX, byte 3/4 | Commit an in-bounds non-wall candidate. |
| 139 | `00100000` | `20` | instruction: MOV [2000],BX, byte 4/4 | Commit an in-bounds non-wall candidate. |
| 140 | `10000000` | `80` | instruction: CMP byte [2002],FF, byte 1/5 | Saturate the visible move counter at 255. |
| 141 | `00111110` | `3E` | instruction: CMP byte [2002],FF, byte 2/5 | Saturate the visible move counter at 255. |
| 142 | `00000010` | `02` | instruction: CMP byte [2002],FF, byte 3/5 | Saturate the visible move counter at 255. |
| 143 | `00100000` | `20` | instruction: CMP byte [2002],FF, byte 4/5 | Saturate the visible move counter at 255. |
| 144 | `11111111` | `FF` | instruction: CMP byte [2002],FF, byte 5/5 | Saturate the visible move counter at 255. |
| 145 | `01110100` | `74` | instruction: JE goal, byte 1/2 | Do not wrap the move counter. |
| 146 | `00000100` | `04` | instruction: JE goal, byte 2/2 | Do not wrap the move counter. |
| 147 | `11111110` | `FE` | instruction: INC byte [2002], byte 1/4 | Count a successful move. |
| 148 | `00000110` | `06` | instruction: INC byte [2002], byte 2/4 | Count a successful move. |
| 149 | `00000010` | `02` | instruction: INC byte [2002], byte 3/4 | Count a successful move. |
| 150 | `00100000` | `20` | instruction: INC byte [2002], byte 4/4 | Count a successful move. |
| 151 | `10000000` | `80` | instruction: CMP byte [BX+7D88],2A, byte 1/5 | Recognize the actual star goal; one immediate bit changes this predicate. |
| 152 | `10111111` | `BF` | instruction: CMP byte [BX+7D88],2A, byte 2/5 | Recognize the actual star goal; one immediate bit changes this predicate. |
| 153 | `10001000` | `88` | instruction: CMP byte [BX+7D88],2A, byte 3/5 | Recognize the actual star goal; one immediate bit changes this predicate. |
| 154 | `01111101` | `7D` | instruction: CMP byte [BX+7D88],2A, byte 4/5 | Recognize the actual star goal; one immediate bit changes this predicate. |
| 155 | `00101010` | `2A` | instruction: CMP byte [BX+7D88],2A, byte 5/5 | Recognize the actual star goal; one immediate bit changes this predicate. |
| 156 | `01110101` | `75` | instruction: JNE redraw, byte 1/2 | Preserve the sticky win flag for ordinary cells. |
| 157 | `00000101` | `05` | instruction: JNE redraw, byte 2/2 | Preserve the sticky win flag for ordinary cells. |
| 158 | `11000110` | `C6` | instruction: MOV byte [2004],1, byte 1/5 | Mark that the star has been collected. |
| 159 | `00000110` | `06` | instruction: MOV byte [2004],1, byte 2/5 | Mark that the star has been collected. |
| 160 | `00000100` | `04` | instruction: MOV byte [2004],1, byte 3/5 | Mark that the star has been collected. |
| 161 | `00100000` | `20` | instruction: MOV byte [2004],1, byte 4/5 | Mark that the star has been collected. |
| 162 | `00000001` | `01` | instruction: MOV byte [2004],1, byte 5/5 | Mark that the star has been collected. |
| 163 | `11101000` | `E8` | instruction: CALL render, byte 1/3 | Redraw the map, player and status. |
| 164 | `00111010` | `3A` | instruction: CALL render, byte 2/3 | Redraw the map, player and status. |
| 165 | `00000000` | `00` | instruction: CALL render, byte 3/3 | Redraw the map, player and status. |
| 166 | `11101011` | `EB` | instruction: JMP read, byte 1/2 | Wait for the next key at offset 68. |
| 167 | `10011100` | `9C` | instruction: JMP read, byte 2/2 | Wait for the next key at offset 68. |
| 168 | `00000000` | `00` | padding: ALIGN, byte 1/8 | Begin quit at offset 176. |
| 169 | `00000000` | `00` | padding: ALIGN, byte 2/8 | Begin quit at offset 176. |
| 170 | `00000000` | `00` | padding: ALIGN, byte 3/8 | Begin quit at offset 176. |
| 171 | `00000000` | `00` | padding: ALIGN, byte 4/8 | Begin quit at offset 176. |
| 172 | `00000000` | `00` | padding: ALIGN, byte 5/8 | Begin quit at offset 176. |
| 173 | `00000000` | `00` | padding: ALIGN, byte 6/8 | Begin quit at offset 176. |
| 174 | `00000000` | `00` | padding: ALIGN, byte 7/8 | Begin quit at offset 176. |
| 175 | `00000000` | `00` | padding: ALIGN, byte 8/8 | Begin quit at offset 176. |
| 176 | `11111010` | `FA` | instruction: CLI, byte 1/1 | Keep the final halt stopped. |
| 177 | `10111000` | `B8` | instruction: MOV AX,BEEF, byte 1/3 | Mark deliberate quit. |
| 178 | `11101111` | `EF` | instruction: MOV AX,BEEF, byte 2/3 | Mark deliberate quit. |
| 179 | `10111110` | `BE` | instruction: MOV AX,BEEF, byte 3/3 | Mark deliberate quit. |
| 180 | `11110100` | `F4` | instruction: HLT, byte 1/1 | Halt at offset 180 with state retained for inspection. |
| 181 | `11101011` | `EB` | instruction: JMP halt, byte 1/2 | Return to the controlled halt if execution resumes. |
| 182 | `11111101` | `FD` | instruction: JMP halt, byte 2/2 | Return to the controlled halt if execution resumes. |
| 183 | `00000000` | `00` | padding: ALIGN, byte 1/16 | Place rendering at offset 224. |
| 184 | `00000000` | `00` | padding: ALIGN, byte 2/16 | Place rendering at offset 224. |
| 185 | `00000000` | `00` | padding: ALIGN, byte 3/16 | Place rendering at offset 224. |
| 186 | `00000000` | `00` | padding: ALIGN, byte 4/16 | Place rendering at offset 224. |
| 187 | `00000000` | `00` | padding: ALIGN, byte 5/16 | Place rendering at offset 224. |
| 188 | `00000000` | `00` | padding: ALIGN, byte 6/16 | Place rendering at offset 224. |
| 189 | `00000000` | `00` | padding: ALIGN, byte 7/16 | Place rendering at offset 224. |
| 190 | `00000000` | `00` | padding: ALIGN, byte 8/16 | Place rendering at offset 224. |
| 191 | `00000000` | `00` | padding: ALIGN, byte 9/16 | Place rendering at offset 224. |
| 192 | `00000000` | `00` | padding: ALIGN, byte 10/16 | Place rendering at offset 224. |
| 193 | `00000000` | `00` | padding: ALIGN, byte 11/16 | Place rendering at offset 224. |
| 194 | `00000000` | `00` | padding: ALIGN, byte 12/16 | Place rendering at offset 224. |
| 195 | `00000000` | `00` | padding: ALIGN, byte 13/16 | Place rendering at offset 224. |
| 196 | `00000000` | `00` | padding: ALIGN, byte 14/16 | Place rendering at offset 224. |
| 197 | `00000000` | `00` | padding: ALIGN, byte 15/16 | Place rendering at offset 224. |
| 198 | `00000000` | `00` | padding: ALIGN, byte 16/16 | Place rendering at offset 224. |
| 199 | `00000000` | `00` | padding: ALIGN, byte 1/16 | Continue fixed-layout padding. |
| 200 | `00000000` | `00` | padding: ALIGN, byte 2/16 | Continue fixed-layout padding. |
| 201 | `00000000` | `00` | padding: ALIGN, byte 3/16 | Continue fixed-layout padding. |
| 202 | `00000000` | `00` | padding: ALIGN, byte 4/16 | Continue fixed-layout padding. |
| 203 | `00000000` | `00` | padding: ALIGN, byte 5/16 | Continue fixed-layout padding. |
| 204 | `00000000` | `00` | padding: ALIGN, byte 6/16 | Continue fixed-layout padding. |
| 205 | `00000000` | `00` | padding: ALIGN, byte 7/16 | Continue fixed-layout padding. |
| 206 | `00000000` | `00` | padding: ALIGN, byte 8/16 | Continue fixed-layout padding. |
| 207 | `00000000` | `00` | padding: ALIGN, byte 9/16 | Continue fixed-layout padding. |
| 208 | `00000000` | `00` | padding: ALIGN, byte 10/16 | Continue fixed-layout padding. |
| 209 | `00000000` | `00` | padding: ALIGN, byte 11/16 | Continue fixed-layout padding. |
| 210 | `00000000` | `00` | padding: ALIGN, byte 12/16 | Continue fixed-layout padding. |
| 211 | `00000000` | `00` | padding: ALIGN, byte 13/16 | Continue fixed-layout padding. |
| 212 | `00000000` | `00` | padding: ALIGN, byte 14/16 | Continue fixed-layout padding. |
| 213 | `00000000` | `00` | padding: ALIGN, byte 15/16 | Continue fixed-layout padding. |
| 214 | `00000000` | `00` | padding: ALIGN, byte 16/16 | Continue fixed-layout padding. |
| 215 | `00000000` | `00` | padding: ALIGN, byte 1/9 | Complete forty-one padding bytes. |
| 216 | `00000000` | `00` | padding: ALIGN, byte 2/9 | Complete forty-one padding bytes. |
| 217 | `00000000` | `00` | padding: ALIGN, byte 3/9 | Complete forty-one padding bytes. |
| 218 | `00000000` | `00` | padding: ALIGN, byte 4/9 | Complete forty-one padding bytes. |
| 219 | `00000000` | `00` | padding: ALIGN, byte 5/9 | Complete forty-one padding bytes. |
| 220 | `00000000` | `00` | padding: ALIGN, byte 6/9 | Complete forty-one padding bytes. |
| 221 | `00000000` | `00` | padding: ALIGN, byte 7/9 | Complete forty-one padding bytes. |
| 222 | `00000000` | `00` | padding: ALIGN, byte 8/9 | Complete forty-one padding bytes. |
| 223 | `00000000` | `00` | padding: ALIGN, byte 9/9 | Complete forty-one padding bytes. |
| 224 | `01100000` | `60` | instruction: PUSHA, byte 1/1 | Preserve the sixteen-bit caller registers while rendering. |
| 225 | `00011110` | `1E` | instruction: PUSH DS, byte 1/1 | Preserve data segment state. |
| 226 | `00000110` | `06` | instruction: PUSH ES, byte 1/1 | Preserve display segment state. |
| 227 | `00110001` | `31` | instruction: XOR AX,AX, byte 1/2 | Select the literal source's data segment. |
| 228 | `11000000` | `C0` | instruction: XOR AX,AX, byte 2/2 | Select the literal source's data segment. |
| 229 | `10001110` | `8E` | instruction: MOV DS,AX, byte 1/2 | Read the immutable map and game state. |
| 230 | `11011000` | `D8` | instruction: MOV DS,AX, byte 2/2 | Read the immutable map and game state. |
| 231 | `10111000` | `B8` | instruction: MOV AX,B800, byte 1/3 | Select VGA text RAM. |
| 232 | `00000000` | `00` | instruction: MOV AX,B800, byte 2/3 | Select VGA text RAM. |
| 233 | `10111000` | `B8` | instruction: MOV AX,B800, byte 3/3 | Select VGA text RAM. |
| 234 | `10001110` | `8E` | instruction: MOV ES,AX, byte 1/2 | Write actual character/attribute words. |
| 235 | `11000000` | `C0` | instruction: MOV ES,AX, byte 2/2 | Write actual character/attribute words. |
| 236 | `11111100` | `FC` | instruction: CLD, byte 1/1 | Render forward independent of incoming direction. |
| 237 | `10111110` | `BE` | instruction: MOV SI,7D88, byte 1/3 | Read sixty literal map bytes at offset 392. |
| 238 | `10001000` | `88` | instruction: MOV SI,7D88, byte 2/3 | Read sixty literal map bytes at offset 392. |
| 239 | `01111101` | `7D` | instruction: MOV SI,7D88, byte 3/3 | Read sixty literal map bytes at offset 392. |
| 240 | `10111111` | `BF` | instruction: MOV DI,0364, byte 1/3 | Place the map at display row five, column thirty-four. |
| 241 | `01100100` | `64` | instruction: MOV DI,0364, byte 2/3 | Place the map at display row five, column thirty-four. |
| 242 | `00000011` | `03` | instruction: MOV DI,0364, byte 3/3 | Place the map at display row five, column thirty-four. |
| 243 | `10111010` | `BA` | instruction: MOV DX,5, byte 1/3 | Render five rows. |
| 244 | `00000101` | `05` | instruction: MOV DX,5, byte 2/3 | Render five rows. |
| 245 | `00000000` | `00` | instruction: MOV DX,5, byte 3/3 | Render five rows. |
| 246 | `10111001` | `B9` | instruction: MOV CX,12, byte 1/3 | Render twelve characters in this row. |
| 247 | `00001100` | `0C` | instruction: MOV CX,12, byte 2/3 | Render twelve characters in this row. |
| 248 | `00000000` | `00` | instruction: MOV CX,12, byte 3/3 | Render twelve characters in this row. |
| 249 | `10101100` | `AC` | instruction: LODSB, byte 1/1 | Read the next immutable map cell. |
| 250 | `10110100` | `B4` | instruction: MOV AH,0A, byte 1/2 | Use green text on black. |
| 251 | `00001010` | `0A` | instruction: MOV AH,0A, byte 2/2 | Use green text on black. |
| 252 | `10101011` | `AB` | instruction: STOSW, byte 1/1 | Write the map character and attribute. |
| 253 | `11100010` | `E2` | instruction: LOOP cell, byte 1/2 | Render every cell in the row. |
| 254 | `11111010` | `FA` | instruction: LOOP cell, byte 2/2 | Render every cell in the row. |
| 255 | `10000001` | `81` | instruction: ADD DI,136, byte 1/4 | Skip the remaining sixty-eight screen columns. |
| 256 | `11000111` | `C7` | instruction: ADD DI,136, byte 2/4 | Skip the remaining sixty-eight screen columns. |
| 257 | `10001000` | `88` | instruction: ADD DI,136, byte 3/4 | Skip the remaining sixty-eight screen columns. |
| 258 | `00000000` | `00` | instruction: ADD DI,136, byte 4/4 | Skip the remaining sixty-eight screen columns. |
| 259 | `01001010` | `4A` | instruction: DEC DX, byte 1/1 | Count the completed row. |
| 260 | `01110101` | `75` | instruction: JNZ row, byte 1/2 | Render the next row with a fresh twelve-cell count. |
| 261 | `11110000` | `F0` | instruction: JNZ row, byte 2/2 | Render the next row with a fresh twelve-cell count. |
| 262 | `10100001` | `A1` | instruction: MOV AX,[2000], byte 1/3 | Read the committed player index. |
| 263 | `00000000` | `00` | instruction: MOV AX,[2000], byte 2/3 | Read the committed player index. |
| 264 | `00100000` | `20` | instruction: MOV AX,[2000], byte 3/3 | Read the committed player index. |
| 265 | `00110001` | `31` | instruction: XOR DX,DX, byte 1/2 | Prepare the unsigned row/column division. |
| 266 | `11010010` | `D2` | instruction: XOR DX,DX, byte 2/2 | Prepare the unsigned row/column division. |
| 267 | `10111011` | `BB` | instruction: MOV BX,12, byte 1/3 | Divide the index by map width. |
| 268 | `00001100` | `0C` | instruction: MOV BX,12, byte 2/3 | Divide the index by map width. |
| 269 | `00000000` | `00` | instruction: MOV BX,12, byte 3/3 | Divide the index by map width. |
| 270 | `11110111` | `F7` | instruction: DIV BX, byte 1/2 | AX becomes row and DX becomes column. |
| 271 | `11110011` | `F3` | instruction: DIV BX, byte 2/2 | AX becomes row and DX becomes column. |
| 272 | `01101001` | `69` | instruction: IMUL DI,AX,160, byte 1/4 | Convert the row to an eighty-column text offset. |
| 273 | `11111000` | `F8` | instruction: IMUL DI,AX,160, byte 2/4 | Convert the row to an eighty-column text offset. |
| 274 | `10100000` | `A0` | instruction: IMUL DI,AX,160, byte 3/4 | Convert the row to an eighty-column text offset. |
| 275 | `00000000` | `00` | instruction: IMUL DI,AX,160, byte 4/4 | Convert the row to an eighty-column text offset. |
| 276 | `11010001` | `D1` | instruction: SHL DX,1, byte 1/2 | Convert the column to a character/attribute byte offset. |
| 277 | `11100010` | `E2` | instruction: SHL DX,1, byte 2/2 | Convert the column to a character/attribute byte offset. |
| 278 | `00000001` | `01` | instruction: ADD DI,DX, byte 1/2 | Combine row and column offsets. |
| 279 | `11010111` | `D7` | instruction: ADD DI,DX, byte 2/2 | Combine row and column offsets. |
| 280 | `10000001` | `81` | instruction: ADD DI,0364, byte 1/4 | Add the fixed map origin. |
| 281 | `11000111` | `C7` | instruction: ADD DI,0364, byte 2/4 | Add the fixed map origin. |
| 282 | `01100100` | `64` | instruction: ADD DI,0364, byte 3/4 | Add the fixed map origin. |
| 283 | `00000011` | `03` | instruction: ADD DI,0364, byte 4/4 | Add the fixed map origin. |
| 284 | `10111000` | `B8` | instruction: MOV AX,0F40, byte 1/3 | Select a bright-white player character. |
| 285 | `01000000` | `40` | instruction: MOV AX,0F40, byte 2/3 | Select a bright-white player character. |
| 286 | `00001111` | `0F` | instruction: MOV AX,0F40, byte 3/3 | Select a bright-white player character. |
| 287 | `10101011` | `AB` | instruction: STOSW, byte 1/1 | Overlay the player without modifying the map source. |
| 288 | `10111110` | `BE` | instruction: MOV SI,7DC4, byte 1/3 | Read the twenty-four literal title bytes. |
| 289 | `11000100` | `C4` | instruction: MOV SI,7DC4, byte 2/3 | Read the twenty-four literal title bytes. |
| 290 | `01111101` | `7D` | instruction: MOV SI,7DC4, byte 3/3 | Read the twenty-four literal title bytes. |
| 291 | `10111111` | `BF` | instruction: MOV DI,021C, byte 1/3 | Place the control legend above the map. |
| 292 | `00011100` | `1C` | instruction: MOV DI,021C, byte 2/3 | Place the control legend above the map. |
| 293 | `00000010` | `02` | instruction: MOV DI,021C, byte 3/3 | Place the control legend above the map. |
| 294 | `10111001` | `B9` | instruction: MOV CX,24, byte 1/3 | Render the complete fixed-length title. |
| 295 | `00011000` | `18` | instruction: MOV CX,24, byte 2/3 | Render the complete fixed-length title. |
| 296 | `00000000` | `00` | instruction: MOV CX,24, byte 3/3 | Render the complete fixed-length title. |
| 297 | `10101100` | `AC` | instruction: LODSB, byte 1/1 | Read the next title character. |
| 298 | `10110100` | `B4` | instruction: MOV AH,0F, byte 1/2 | Use bright-white title text. |
| 299 | `00001111` | `0F` | instruction: MOV AH,0F, byte 2/2 | Use bright-white title text. |
| 300 | `10101011` | `AB` | instruction: STOSW, byte 1/1 | Write the title character and attribute. |
| 301 | `11100010` | `E2` | instruction: LOOP title, byte 1/2 | Render all twenty-four characters. |
| 302 | `11111010` | `FA` | instruction: LOOP title, byte 2/2 | Render all twenty-four characters. |
| 303 | `10111111` | `BF` | instruction: MOV DI,0724, byte 1/3 | Place the status below the map. |
| 304 | `00100100` | `24` | instruction: MOV DI,0724, byte 2/3 | Place the status below the map. |
| 305 | `00000111` | `07` | instruction: MOV DI,0724, byte 3/3 | Place the status below the map. |
| 306 | `10111000` | `B8` | instruction: MOV AX,0A57, byte 1/3 | Begin the WIN label. |
| 307 | `01010111` | `57` | instruction: MOV AX,0A57, byte 2/3 | Begin the WIN label. |
| 308 | `00001010` | `0A` | instruction: MOV AX,0A57, byte 3/3 | Begin the WIN label. |
| 309 | `10101011` | `AB` | instruction: STOSW, byte 1/1 | Write W and its attribute. |
| 310 | `10111000` | `B8` | instruction: MOV AX,0A49, byte 1/3 | Select I. |
| 311 | `01001001` | `49` | instruction: MOV AX,0A49, byte 2/3 | Select I. |
| 312 | `00001010` | `0A` | instruction: MOV AX,0A49, byte 3/3 | Select I. |
| 313 | `10101011` | `AB` | instruction: STOSW, byte 1/1 | Write I and its attribute. |
| 314 | `10111000` | `B8` | instruction: MOV AX,0A4E, byte 1/3 | Select N. |
| 315 | `01001110` | `4E` | instruction: MOV AX,0A4E, byte 2/3 | Select N. |
| 316 | `00001010` | `0A` | instruction: MOV AX,0A4E, byte 3/3 | Select N. |
| 317 | `10101011` | `AB` | instruction: STOSW, byte 1/1 | Write N and its attribute. |
| 318 | `10111000` | `B8` | instruction: MOV AX,0A3A, byte 1/3 | Select the colon. |
| 319 | `00111010` | `3A` | instruction: MOV AX,0A3A, byte 2/3 | Select the colon. |
| 320 | `00001010` | `0A` | instruction: MOV AX,0A3A, byte 3/3 | Select the colon. |
| 321 | `10101011` | `AB` | instruction: STOSW, byte 1/1 | Write the status separator. |
| 322 | `10111000` | `B8` | instruction: MOV AX,0A20, byte 1/3 | Select a space. |
| 323 | `00100000` | `20` | instruction: MOV AX,0A20, byte 2/3 | Select a space. |
| 324 | `00001010` | `0A` | instruction: MOV AX,0A20, byte 3/3 | Select a space. |
| 325 | `10101011` | `AB` | instruction: STOSW, byte 1/1 | Leave room before the state marker. |
| 326 | `10110000` | `B0` | instruction: MOV AL,N, byte 1/2 | Select the not-yet-collected marker. |
| 327 | `01001110` | `4E` | instruction: MOV AL,N, byte 2/2 | Select the not-yet-collected marker. |
| 328 | `10000000` | `80` | instruction: CMP byte [2004],0, byte 1/5 | Read the sticky win flag. |
| 329 | `00111110` | `3E` | instruction: CMP byte [2004],0, byte 2/5 | Read the sticky win flag. |
| 330 | `00000100` | `04` | instruction: CMP byte [2004],0, byte 3/5 | Read the sticky win flag. |
| 331 | `00100000` | `20` | instruction: CMP byte [2004],0, byte 4/5 | Read the sticky win flag. |
| 332 | `00000000` | `00` | instruction: CMP byte [2004],0, byte 5/5 | Read the sticky win flag. |
| 333 | `01110100` | `74` | instruction: JE marker, byte 1/2 | Keep N before collecting the star. |
| 334 | `00000010` | `02` | instruction: JE marker, byte 2/2 | Keep N before collecting the star. |
| 335 | `10110000` | `B0` | instruction: MOV AL,Y, byte 1/2 | Select the collected marker. |
| 336 | `01011001` | `59` | instruction: MOV AL,Y, byte 2/2 | Select the collected marker. |
| 337 | `10110100` | `B4` | instruction: MOV AH,0F, byte 1/2 | Use bright-white status text. |
| 338 | `00001111` | `0F` | instruction: MOV AH,0F, byte 2/2 | Use bright-white status text. |
| 339 | `10101011` | `AB` | instruction: STOSW, byte 1/1 | Write the actual win state. |
| 340 | `10111000` | `B8` | instruction: MOV AX,0A20, byte 1/3 | Separate the move counter. |
| 341 | `00100000` | `20` | instruction: MOV AX,0A20, byte 2/3 | Separate the move counter. |
| 342 | `00001010` | `0A` | instruction: MOV AX,0A20, byte 3/3 | Separate the move counter. |
| 343 | `10101011` | `AB` | instruction: STOSW, byte 1/1 | Write a space. |
| 344 | `10111000` | `B8` | instruction: MOV AX,0A4D, byte 1/3 | Begin the M label. |
| 345 | `01001101` | `4D` | instruction: MOV AX,0A4D, byte 2/3 | Begin the M label. |
| 346 | `00001010` | `0A` | instruction: MOV AX,0A4D, byte 3/3 | Begin the M label. |
| 347 | `10101011` | `AB` | instruction: STOSW, byte 1/1 | Write M. |
| 348 | `10111000` | `B8` | instruction: MOV AX,0A3A, byte 1/3 | Select the counter separator. |
| 349 | `00111010` | `3A` | instruction: MOV AX,0A3A, byte 2/3 | Select the counter separator. |
| 350 | `00001010` | `0A` | instruction: MOV AX,0A3A, byte 3/3 | Select the counter separator. |
| 351 | `10101011` | `AB` | instruction: STOSW, byte 1/1 | Write the colon. |
| 352 | `10100000` | `A0` | instruction: MOV AL,[2002], byte 1/3 | Read the saturating move count. |
| 353 | `00000010` | `02` | instruction: MOV AL,[2002], byte 2/3 | Read the saturating move count. |
| 354 | `00100000` | `20` | instruction: MOV AL,[2002], byte 3/3 | Read the saturating move count. |
| 355 | `00110001` | `31` | instruction: XOR BX,BX, byte 1/2 | Clear the hexadecimal lookup index. |
| 356 | `11011011` | `DB` | instruction: XOR BX,BX, byte 2/2 | Clear the hexadecimal lookup index. |
| 357 | `10001000` | `88` | instruction: MOV BL,AL, byte 1/2 | Copy the counter into the lookup register. |
| 358 | `11000011` | `C3` | instruction: MOV BL,AL, byte 2/2 | Copy the counter into the lookup register. |
| 359 | `11000000` | `C0` | instruction: SHR BL,4, byte 1/3 | Select the high hexadecimal nibble. |
| 360 | `11101011` | `EB` | instruction: SHR BL,4, byte 2/3 | Select the high hexadecimal nibble. |
| 361 | `00000100` | `04` | instruction: SHR BL,4, byte 3/3 | Select the high hexadecimal nibble. |
| 362 | `10001010` | `8A` | instruction: MOV AL,[BX+7DDC], byte 1/4 | Read a literal hexadecimal glyph. |
| 363 | `10000111` | `87` | instruction: MOV AL,[BX+7DDC], byte 2/4 | Read a literal hexadecimal glyph. |
| 364 | `11011100` | `DC` | instruction: MOV AL,[BX+7DDC], byte 3/4 | Read a literal hexadecimal glyph. |
| 365 | `01111101` | `7D` | instruction: MOV AL,[BX+7DDC], byte 4/4 | Read a literal hexadecimal glyph. |
| 366 | `10110100` | `B4` | instruction: MOV AH,0F, byte 1/2 | Use bright-white counter text. |
| 367 | `00001111` | `0F` | instruction: MOV AH,0F, byte 2/2 | Use bright-white counter text. |
| 368 | `10101011` | `AB` | instruction: STOSW, byte 1/1 | Write the high counter digit. |
| 369 | `10100000` | `A0` | instruction: MOV AL,[2002], byte 1/3 | Read the counter again for its low nibble. |
| 370 | `00000010` | `02` | instruction: MOV AL,[2002], byte 2/3 | Read the counter again for its low nibble. |
| 371 | `00100000` | `20` | instruction: MOV AL,[2002], byte 3/3 | Read the counter again for its low nibble. |
| 372 | `00100100` | `24` | instruction: AND AL,0F, byte 1/2 | Select the low hexadecimal nibble. |
| 373 | `00001111` | `0F` | instruction: AND AL,0F, byte 2/2 | Select the low hexadecimal nibble. |
| 374 | `00110001` | `31` | instruction: XOR BX,BX, byte 1/2 | Clear the lookup index. |
| 375 | `11011011` | `DB` | instruction: XOR BX,BX, byte 2/2 | Clear the lookup index. |
| 376 | `10001000` | `88` | instruction: MOV BL,AL, byte 1/2 | Address the low-nibble glyph. |
| 377 | `11000011` | `C3` | instruction: MOV BL,AL, byte 2/2 | Address the low-nibble glyph. |
| 378 | `10001010` | `8A` | instruction: MOV AL,[BX+7DDC], byte 1/4 | Read the literal low-digit glyph. |
| 379 | `10000111` | `87` | instruction: MOV AL,[BX+7DDC], byte 2/4 | Read the literal low-digit glyph. |
| 380 | `11011100` | `DC` | instruction: MOV AL,[BX+7DDC], byte 3/4 | Read the literal low-digit glyph. |
| 381 | `01111101` | `7D` | instruction: MOV AL,[BX+7DDC], byte 4/4 | Read the literal low-digit glyph. |
| 382 | `10110100` | `B4` | instruction: MOV AH,0F, byte 1/2 | Use bright-white counter text. |
| 383 | `00001111` | `0F` | instruction: MOV AH,0F, byte 2/2 | Use bright-white counter text. |
| 384 | `10101011` | `AB` | instruction: STOSW, byte 1/1 | Write the low counter digit. |
| 385 | `00000111` | `07` | instruction: POP ES, byte 1/1 | Restore the caller's display segment. |
| 386 | `00011111` | `1F` | instruction: POP DS, byte 1/1 | Restore the caller's data segment. |
| 387 | `01100001` | `61` | instruction: POPA, byte 1/1 | Restore caller registers after rendering. |
| 388 | `11000011` | `C3` | instruction: RET, byte 1/1 | Return to the keyboard loop or reset path. |
| 389 | `00000000` | `00` | padding: ALIGN, byte 1/3 | Place the map at source offset 392. |
| 390 | `00000000` | `00` | padding: ALIGN, byte 2/3 | Place the map at source offset 392. |
| 391 | `00000000` | `00` | padding: ALIGN, byte 3/3 | Place the map at source offset 392. |
| 392 | `00100011` | `23` | data: MAP ROW 0, byte 1/12 | Twelve immutable border walls. |
| 393 | `00100011` | `23` | data: MAP ROW 0, byte 2/12 | Twelve immutable border walls. |
| 394 | `00100011` | `23` | data: MAP ROW 0, byte 3/12 | Twelve immutable border walls. |
| 395 | `00100011` | `23` | data: MAP ROW 0, byte 4/12 | Twelve immutable border walls. |
| 396 | `00100011` | `23` | data: MAP ROW 0, byte 5/12 | Twelve immutable border walls. |
| 397 | `00100011` | `23` | data: MAP ROW 0, byte 6/12 | Twelve immutable border walls. |
| 398 | `00100011` | `23` | data: MAP ROW 0, byte 7/12 | Twelve immutable border walls. |
| 399 | `00100011` | `23` | data: MAP ROW 0, byte 8/12 | Twelve immutable border walls. |
| 400 | `00100011` | `23` | data: MAP ROW 0, byte 9/12 | Twelve immutable border walls. |
| 401 | `00100011` | `23` | data: MAP ROW 0, byte 10/12 | Twelve immutable border walls. |
| 402 | `00100011` | `23` | data: MAP ROW 0, byte 11/12 | Twelve immutable border walls. |
| 403 | `00100011` | `23` | data: MAP ROW 0, byte 12/12 | Twelve immutable border walls. |
| 404 | `00100011` | `23` | data: MAP ROW 1, byte 1/12 | Start at column one inside the border. |
| 405 | `00100000` | `20` | data: MAP ROW 1, byte 2/12 | Start at column one inside the border. |
| 406 | `00100000` | `20` | data: MAP ROW 1, byte 3/12 | Start at column one inside the border. |
| 407 | `00100000` | `20` | data: MAP ROW 1, byte 4/12 | Start at column one inside the border. |
| 408 | `00100000` | `20` | data: MAP ROW 1, byte 5/12 | Start at column one inside the border. |
| 409 | `00100000` | `20` | data: MAP ROW 1, byte 6/12 | Start at column one inside the border. |
| 410 | `00100000` | `20` | data: MAP ROW 1, byte 7/12 | Start at column one inside the border. |
| 411 | `00100000` | `20` | data: MAP ROW 1, byte 8/12 | Start at column one inside the border. |
| 412 | `00100000` | `20` | data: MAP ROW 1, byte 9/12 | Start at column one inside the border. |
| 413 | `00100000` | `20` | data: MAP ROW 1, byte 10/12 | Start at column one inside the border. |
| 414 | `00100000` | `20` | data: MAP ROW 1, byte 11/12 | Start at column one inside the border. |
| 415 | `00100011` | `23` | data: MAP ROW 1, byte 12/12 | Start at column one inside the border. |
| 416 | `00100011` | `23` | data: MAP ROW 2, byte 1/12 | Interior walls at columns four and eight. |
| 417 | `00100000` | `20` | data: MAP ROW 2, byte 2/12 | Interior walls at columns four and eight. |
| 418 | `00100000` | `20` | data: MAP ROW 2, byte 3/12 | Interior walls at columns four and eight. |
| 419 | `00100000` | `20` | data: MAP ROW 2, byte 4/12 | Interior walls at columns four and eight. |
| 420 | `00100011` | `23` | data: MAP ROW 2, byte 5/12 | Interior walls at columns four and eight. |
| 421 | `00100000` | `20` | data: MAP ROW 2, byte 6/12 | Interior walls at columns four and eight. |
| 422 | `00100000` | `20` | data: MAP ROW 2, byte 7/12 | Interior walls at columns four and eight. |
| 423 | `00100000` | `20` | data: MAP ROW 2, byte 8/12 | Interior walls at columns four and eight. |
| 424 | `00100011` | `23` | data: MAP ROW 2, byte 9/12 | Interior walls at columns four and eight. |
| 425 | `00100000` | `20` | data: MAP ROW 2, byte 10/12 | Interior walls at columns four and eight. |
| 426 | `00100000` | `20` | data: MAP ROW 2, byte 11/12 | Interior walls at columns four and eight. |
| 427 | `00100011` | `23` | data: MAP ROW 2, byte 12/12 | Interior walls at columns four and eight. |
| 428 | `00100011` | `23` | data: MAP ROW 3, byte 1/12 | The star at column ten is the goal. |
| 429 | `00100000` | `20` | data: MAP ROW 3, byte 2/12 | The star at column ten is the goal. |
| 430 | `00100000` | `20` | data: MAP ROW 3, byte 3/12 | The star at column ten is the goal. |
| 431 | `00100000` | `20` | data: MAP ROW 3, byte 4/12 | The star at column ten is the goal. |
| 432 | `00100000` | `20` | data: MAP ROW 3, byte 5/12 | The star at column ten is the goal. |
| 433 | `00100000` | `20` | data: MAP ROW 3, byte 6/12 | The star at column ten is the goal. |
| 434 | `00100000` | `20` | data: MAP ROW 3, byte 7/12 | The star at column ten is the goal. |
| 435 | `00100000` | `20` | data: MAP ROW 3, byte 8/12 | The star at column ten is the goal. |
| 436 | `00100000` | `20` | data: MAP ROW 3, byte 9/12 | The star at column ten is the goal. |
| 437 | `00100000` | `20` | data: MAP ROW 3, byte 10/12 | The star at column ten is the goal. |
| 438 | `00101010` | `2A` | data: MAP ROW 3, byte 11/12 | The star at column ten is the goal. |
| 439 | `00100011` | `23` | data: MAP ROW 3, byte 12/12 | The star at column ten is the goal. |
| 440 | `00100011` | `23` | data: MAP ROW 4, byte 1/12 | Twelve immutable bottom walls. |
| 441 | `00100011` | `23` | data: MAP ROW 4, byte 2/12 | Twelve immutable bottom walls. |
| 442 | `00100011` | `23` | data: MAP ROW 4, byte 3/12 | Twelve immutable bottom walls. |
| 443 | `00100011` | `23` | data: MAP ROW 4, byte 4/12 | Twelve immutable bottom walls. |
| 444 | `00100011` | `23` | data: MAP ROW 4, byte 5/12 | Twelve immutable bottom walls. |
| 445 | `00100011` | `23` | data: MAP ROW 4, byte 6/12 | Twelve immutable bottom walls. |
| 446 | `00100011` | `23` | data: MAP ROW 4, byte 7/12 | Twelve immutable bottom walls. |
| 447 | `00100011` | `23` | data: MAP ROW 4, byte 8/12 | Twelve immutable bottom walls. |
| 448 | `00100011` | `23` | data: MAP ROW 4, byte 9/12 | Twelve immutable bottom walls. |
| 449 | `00100011` | `23` | data: MAP ROW 4, byte 10/12 | Twelve immutable bottom walls. |
| 450 | `00100011` | `23` | data: MAP ROW 4, byte 11/12 | Twelve immutable bottom walls. |
| 451 | `00100011` | `23` | data: MAP ROW 4, byte 12/12 | Twelve immutable bottom walls. |
| 452 | `01000010` | `42` | data: TITLE, byte 1/24 | BIT HUNT, movement, reset and quit controls with a trailing space. |
| 453 | `01001001` | `49` | data: TITLE, byte 2/24 | BIT HUNT, movement, reset and quit controls with a trailing space. |
| 454 | `01010100` | `54` | data: TITLE, byte 3/24 | BIT HUNT, movement, reset and quit controls with a trailing space. |
| 455 | `00100000` | `20` | data: TITLE, byte 4/24 | BIT HUNT, movement, reset and quit controls with a trailing space. |
| 456 | `01001000` | `48` | data: TITLE, byte 5/24 | BIT HUNT, movement, reset and quit controls with a trailing space. |
| 457 | `01010101` | `55` | data: TITLE, byte 6/24 | BIT HUNT, movement, reset and quit controls with a trailing space. |
| 458 | `01001110` | `4E` | data: TITLE, byte 7/24 | BIT HUNT, movement, reset and quit controls with a trailing space. |
| 459 | `01010100` | `54` | data: TITLE, byte 8/24 | BIT HUNT, movement, reset and quit controls with a trailing space. |
| 460 | `00100000` | `20` | data: TITLE, byte 9/24 | BIT HUNT, movement, reset and quit controls with a trailing space. |
| 461 | `01111100` | `7C` | data: TITLE, byte 10/24 | BIT HUNT, movement, reset and quit controls with a trailing space. |
| 462 | `00100000` | `20` | data: TITLE, byte 11/24 | BIT HUNT, movement, reset and quit controls with a trailing space. |
| 463 | `01010111` | `57` | data: TITLE, byte 12/24 | BIT HUNT, movement, reset and quit controls with a trailing space. |
| 464 | `01000001` | `41` | data: TITLE, byte 13/24 | BIT HUNT, movement, reset and quit controls with a trailing space. |
| 465 | `01010011` | `53` | data: TITLE, byte 14/24 | BIT HUNT, movement, reset and quit controls with a trailing space. |
| 466 | `01000100` | `44` | data: TITLE, byte 15/24 | BIT HUNT, movement, reset and quit controls with a trailing space. |
| 467 | `00100000` | `20` | data: TITLE, byte 16/24 | BIT HUNT, movement, reset and quit controls with a trailing space. |
| 468 | `01111100` | `7C` | data: TITLE, byte 17/24 | BIT HUNT, movement, reset and quit controls with a trailing space. |
| 469 | `00100000` | `20` | data: TITLE, byte 18/24 | BIT HUNT, movement, reset and quit controls with a trailing space. |
| 470 | `01010010` | `52` | data: TITLE, byte 19/24 | BIT HUNT, movement, reset and quit controls with a trailing space. |
| 471 | `00100000` | `20` | data: TITLE, byte 20/24 | BIT HUNT, movement, reset and quit controls with a trailing space. |
| 472 | `01111100` | `7C` | data: TITLE, byte 21/24 | BIT HUNT, movement, reset and quit controls with a trailing space. |
| 473 | `00100000` | `20` | data: TITLE, byte 22/24 | BIT HUNT, movement, reset and quit controls with a trailing space. |
| 474 | `01010001` | `51` | data: TITLE, byte 23/24 | BIT HUNT, movement, reset and quit controls with a trailing space. |
| 475 | `00100000` | `20` | data: TITLE, byte 24/24 | BIT HUNT, movement, reset and quit controls with a trailing space. |
| 476 | `00110000` | `30` | data: HEX DIGITS, byte 1/16 | Literal hexadecimal glyphs for the move counter. |
| 477 | `00110001` | `31` | data: HEX DIGITS, byte 2/16 | Literal hexadecimal glyphs for the move counter. |
| 478 | `00110010` | `32` | data: HEX DIGITS, byte 3/16 | Literal hexadecimal glyphs for the move counter. |
| 479 | `00110011` | `33` | data: HEX DIGITS, byte 4/16 | Literal hexadecimal glyphs for the move counter. |
| 480 | `00110100` | `34` | data: HEX DIGITS, byte 5/16 | Literal hexadecimal glyphs for the move counter. |
| 481 | `00110101` | `35` | data: HEX DIGITS, byte 6/16 | Literal hexadecimal glyphs for the move counter. |
| 482 | `00110110` | `36` | data: HEX DIGITS, byte 7/16 | Literal hexadecimal glyphs for the move counter. |
| 483 | `00110111` | `37` | data: HEX DIGITS, byte 8/16 | Literal hexadecimal glyphs for the move counter. |
| 484 | `00111000` | `38` | data: HEX DIGITS, byte 9/16 | Literal hexadecimal glyphs for the move counter. |
| 485 | `00111001` | `39` | data: HEX DIGITS, byte 10/16 | Literal hexadecimal glyphs for the move counter. |
| 486 | `01000001` | `41` | data: HEX DIGITS, byte 11/16 | Literal hexadecimal glyphs for the move counter. |
| 487 | `01000010` | `42` | data: HEX DIGITS, byte 12/16 | Literal hexadecimal glyphs for the move counter. |
| 488 | `01000011` | `43` | data: HEX DIGITS, byte 13/16 | Literal hexadecimal glyphs for the move counter. |
| 489 | `01000100` | `44` | data: HEX DIGITS, byte 14/16 | Literal hexadecimal glyphs for the move counter. |
| 490 | `01000101` | `45` | data: HEX DIGITS, byte 15/16 | Literal hexadecimal glyphs for the move counter. |
| 491 | `01000110` | `46` | data: HEX DIGITS, byte 16/16 | Literal hexadecimal glyphs for the move counter. |
