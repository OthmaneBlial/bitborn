# Every byte explained

Generated from canonical `.bits` annotations by `python3 tools/byte_tables.py`.

Instruction names below are disassembly for explanation, never code-generation input.

| Offset | Binary | Hex | Range / byte within it | Encoding explanation |
| --- | --- | --- | --- | --- |
| 0 | `11111010` | `FA` | instruction: CLI, byte 1/1 | Mask interrupts before setting up the stack. |
| 1 | `11101010` | `EA` | instruction: JMP 0000:7C06, byte 1/5 | Normalize CS using the literal far pointer. |
| 2 | `00000110` | `06` | instruction: JMP 0000:7C06, byte 2/5 | Normalize CS using the literal far pointer. |
| 3 | `01111100` | `7C` | instruction: JMP 0000:7C06, byte 3/5 | Normalize CS using the literal far pointer. |
| 4 | `00000000` | `00` | instruction: JMP 0000:7C06, byte 4/5 | Normalize CS using the literal far pointer. |
| 5 | `00000000` | `00` | instruction: JMP 0000:7C06, byte 5/5 | Normalize CS using the literal far pointer. |
| 6 | `00110001` | `31` | instruction: XOR AX,AX, byte 1/2 | Prepare segment zero and the arena's zero word. |
| 7 | `11000000` | `C0` | instruction: XOR AX,AX, byte 2/2 | Prepare segment zero and the arena's zero word. |
| 8 | `10001110` | `8E` | instruction: MOV SS,AX, byte 1/2 | Use stack segment zero. |
| 9 | `11010000` | `D0` | instruction: MOV SS,AX, byte 2/2 | Use stack segment zero. |
| 10 | `10001110` | `8E` | instruction: MOV DS,AX, byte 1/2 | All arena and log addresses use segment zero. |
| 11 | `11011000` | `D8` | instruction: MOV DS,AX, byte 2/2 | All arena and log addresses use segment zero. |
| 12 | `10111100` | `BC` | instruction: MOV SP,7C00, byte 1/3 | Initialize the near-call stack below the source. |
| 13 | `00000000` | `00` | instruction: MOV SP,7C00, byte 2/3 | Initialize the near-call stack below the source. |
| 14 | `01111100` | `7C` | instruction: MOV SP,7C00, byte 3/3 | Initialize the near-call stack below the source. |
| 15 | `11111100` | `FC` | instruction: CLD, byte 1/1 | Keep direction deterministic; this program uses explicit stores. |
| 16 | `10111111` | `BF` | instruction: MOV DI,2000, byte 1/3 | Start the sixteen-byte arena. |
| 17 | `00000000` | `00` | instruction: MOV DI,2000, byte 2/3 | Start the sixteen-byte arena. |
| 18 | `00100000` | `20` | instruction: MOV DI,2000, byte 3/3 | Start the sixteen-byte arena. |
| 19 | `10111001` | `B9` | instruction: MOV CX,8, byte 1/3 | Eight explicit word stores clear the arena. |
| 20 | `00001000` | `08` | instruction: MOV CX,8, byte 2/3 | Eight explicit word stores clear the arena. |
| 21 | `00000000` | `00` | instruction: MOV CX,8, byte 3/3 | Eight explicit word stores clear the arena. |
| 22 | `10001001` | `89` | instruction: MOV [DI],AX, byte 1/2 | Store a zero word through DS:DI. |
| 23 | `00000101` | `05` | instruction: MOV [DI],AX, byte 2/2 | Store a zero word through DS:DI. |
| 24 | `01000111` | `47` | instruction: INC DI, byte 1/1 | Advance the low byte address. |
| 25 | `01000111` | `47` | instruction: INC DI, byte 1/1 | Advance to the next word. |
| 26 | `11100010` | `E2` | instruction: LOOP -6, byte 1/2 | Repeat the store at offset 22 until all sixteen bytes are zero. |
| 27 | `11111010` | `FA` | instruction: LOOP -6, byte 2/2 | Repeat the store at offset 22 until all sixteen bytes are zero. |
| 28 | `10110000` | `B0` | instruction: MOV AL,5A, byte 1/2 | Set the upper guard marker. |
| 29 | `01011010` | `5A` | instruction: MOV AL,5A, byte 2/2 | Set the upper guard marker. |
| 30 | `10001000` | `88` | instruction: MOV [DI],AL, byte 1/2 | DI is 2010, just beyond the exclusive arena end. |
| 31 | `00000101` | `05` | instruction: MOV [DI],AL, byte 2/2 | DI is 2010, just beyond the exclusive arena end. |
| 32 | `10111111` | `BF` | instruction: MOV DI,1FFF, byte 1/3 | Select the byte just below the arena. |
| 33 | `11111111` | `FF` | instruction: MOV DI,1FFF, byte 2/3 | Select the byte just below the arena. |
| 34 | `00011111` | `1F` | instruction: MOV DI,1FFF, byte 3/3 | Select the byte just below the arena. |
| 35 | `10110000` | `B0` | instruction: MOV AL,A5, byte 1/2 | Set the lower guard marker. |
| 36 | `10100101` | `A5` | instruction: MOV AL,A5, byte 2/2 | Set the lower guard marker. |
| 37 | `10001000` | `88` | instruction: MOV [DI],AL, byte 1/2 | Record the lower guard without touching the arena. |
| 38 | `00000101` | `05` | instruction: MOV [DI],AL, byte 2/2 | Record the lower guard without touching the arena. |
| 39 | `10111011` | `BB` | instruction: MOV BX,2000, byte 1/3 | BX owns the bump cursor, initially the arena start. |
| 40 | `00000000` | `00` | instruction: MOV BX,2000, byte 2/3 | BX owns the bump cursor, initially the arena start. |
| 41 | `00100000` | `20` | instruction: MOV BX,2000, byte 3/3 | BX owns the bump cursor, initially the arena start. |
| 42 | `10111000` | `B8` | instruction: MOV AX,0, byte 1/3 | A zero-size request must fail without advancing BX. |
| 43 | `00000000` | `00` | instruction: MOV AX,0, byte 2/3 | A zero-size request must fail without advancing BX. |
| 44 | `00000000` | `00` | instruction: MOV AX,0, byte 3/3 | A zero-size request must fail without advancing BX. |
| 45 | `11101000` | `E8` | instruction: CALL +147, byte 1/3 | From offset 48 enter the allocator at offset 195. |
| 46 | `10010011` | `93` | instruction: CALL +147, byte 2/3 | From offset 48 enter the allocator at offset 195. |
| 47 | `00000000` | `00` | instruction: CALL +147, byte 3/3 | From offset 48 enter the allocator at offset 195. |
| 48 | `01110010` | `72` | instruction: JB +4, byte 1/2 | A failed allocation must skip the caller's marker store. |
| 49 | `00000100` | `04` | instruction: JB +4, byte 2/2 | A failed allocation must skip the caller's marker store. |
| 50 | `10110000` | `B0` | instruction: MOV AL,41, byte 1/2 | The unused zero-size marker would be A. |
| 51 | `01000001` | `41` | instruction: MOV AL,41, byte 2/2 | The unused zero-size marker would be A. |
| 52 | `10001000` | `88` | instruction: MOV [DI],AL, byte 1/2 | Write a marker only after a successful allocation. |
| 53 | `00000101` | `05` | instruction: MOV [DI],AL, byte 2/2 | Write a marker only after a successful allocation. |
| 54 | `10111000` | `B8` | instruction: MOV AX,0, byte 1/3 | MOV preserves the allocator's returned carry flag. |
| 55 | `00000000` | `00` | instruction: MOV AX,0, byte 2/3 | MOV preserves the allocator's returned carry flag. |
| 56 | `00000000` | `00` | instruction: MOV AX,0, byte 3/3 | MOV preserves the allocator's returned carry flag. |
| 57 | `00010101` | `15` | instruction: ADC AX,0, byte 1/3 | Capture returned CF as an exact zero-or-one failure word. |
| 58 | `00000000` | `00` | instruction: ADC AX,0, byte 2/3 | Capture returned CF as an exact zero-or-one failure word. |
| 59 | `00000000` | `00` | instruction: ADC AX,0, byte 3/3 | Capture returned CF as an exact zero-or-one failure word. |
| 60 | `10001001` | `89` | instruction: MOV [2100],DI, byte 1/4 | Log returned pointer; FFFF is the failure sentinel. |
| 61 | `00111110` | `3E` | instruction: MOV [2100],DI, byte 2/4 | Log returned pointer; FFFF is the failure sentinel. |
| 62 | `00000000` | `00` | instruction: MOV [2100],DI, byte 3/4 | Log returned pointer; FFFF is the failure sentinel. |
| 63 | `00100001` | `21` | instruction: MOV [2100],DI, byte 4/4 | Log returned pointer; FFFF is the failure sentinel. |
| 64 | `10001001` | `89` | instruction: MOV [2102],BX, byte 1/4 | Log the retained or advanced cursor. |
| 65 | `00011110` | `1E` | instruction: MOV [2102],BX, byte 2/4 | Log the retained or advanced cursor. |
| 66 | `00000010` | `02` | instruction: MOV [2102],BX, byte 3/4 | Log the retained or advanced cursor. |
| 67 | `00100001` | `21` | instruction: MOV [2102],BX, byte 4/4 | Log the retained or advanced cursor. |
| 68 | `10001001` | `89` | instruction: MOV [2104],AX, byte 1/4 | Log failure status after consuming CF. |
| 69 | `00000110` | `06` | instruction: MOV [2104],AX, byte 2/4 | Log failure status after consuming CF. |
| 70 | `00000100` | `04` | instruction: MOV [2104],AX, byte 3/4 | Log failure status after consuming CF. |
| 71 | `00100001` | `21` | instruction: MOV [2104],AX, byte 4/4 | Log failure status after consuming CF. |
| 72 | `10111000` | `B8` | instruction: MOV AX,3, byte 1/3 | Allocate the first three arena bytes. |
| 73 | `00000011` | `03` | instruction: MOV AX,3, byte 2/3 | Allocate the first three arena bytes. |
| 74 | `00000000` | `00` | instruction: MOV AX,3, byte 3/3 | Allocate the first three arena bytes. |
| 75 | `11101000` | `E8` | instruction: CALL +117, byte 1/3 | From offset 78 enter the same allocator. |
| 76 | `01110101` | `75` | instruction: CALL +117, byte 2/3 | From offset 78 enter the same allocator. |
| 77 | `00000000` | `00` | instruction: CALL +117, byte 3/3 | From offset 78 enter the same allocator. |
| 78 | `01110010` | `72` | instruction: JB +4, byte 1/2 | Skip the marker if the call fails. |
| 79 | `00000100` | `04` | instruction: JB +4, byte 2/2 | Skip the marker if the call fails. |
| 80 | `10110000` | `B0` | instruction: MOV AL,42, byte 1/2 | Caller marker B identifies the first successful allocation. |
| 81 | `01000010` | `42` | instruction: MOV AL,42, byte 2/2 | Caller marker B identifies the first successful allocation. |
| 82 | `10001000` | `88` | instruction: MOV [DI],AL, byte 1/2 | Store B at its returned start address. |
| 83 | `00000101` | `05` | instruction: MOV [DI],AL, byte 2/2 | Store B at its returned start address. |
| 84 | `10111000` | `B8` | instruction: MOV AX,0, byte 1/3 | Preserve returned carry while preparing its capture. |
| 85 | `00000000` | `00` | instruction: MOV AX,0, byte 2/3 | Preserve returned carry while preparing its capture. |
| 86 | `00000000` | `00` | instruction: MOV AX,0, byte 3/3 | Preserve returned carry while preparing its capture. |
| 87 | `00010101` | `15` | instruction: ADC AX,0, byte 1/3 | Capture the call's failure status. |
| 88 | `00000000` | `00` | instruction: ADC AX,0, byte 2/3 | Capture the call's failure status. |
| 89 | `00000000` | `00` | instruction: ADC AX,0, byte 3/3 | Capture the call's failure status. |
| 90 | `10001001` | `89` | instruction: MOV [2106],DI, byte 1/4 | Log first successful pointer. |
| 91 | `00111110` | `3E` | instruction: MOV [2106],DI, byte 2/4 | Log first successful pointer. |
| 92 | `00000110` | `06` | instruction: MOV [2106],DI, byte 3/4 | Log first successful pointer. |
| 93 | `00100001` | `21` | instruction: MOV [2106],DI, byte 4/4 | Log first successful pointer. |
| 94 | `10001001` | `89` | instruction: MOV [2108],BX, byte 1/4 | Log cursor 2003. |
| 95 | `00011110` | `1E` | instruction: MOV [2108],BX, byte 2/4 | Log cursor 2003. |
| 96 | `00001000` | `08` | instruction: MOV [2108],BX, byte 3/4 | Log cursor 2003. |
| 97 | `00100001` | `21` | instruction: MOV [2108],BX, byte 4/4 | Log cursor 2003. |
| 98 | `10001001` | `89` | instruction: MOV [210A],AX, byte 1/4 | Log success as zero. |
| 99 | `00000110` | `06` | instruction: MOV [210A],AX, byte 2/4 | Log success as zero. |
| 100 | `00001010` | `0A` | instruction: MOV [210A],AX, byte 3/4 | Log success as zero. |
| 101 | `00100001` | `21` | instruction: MOV [210A],AX, byte 4/4 | Log success as zero. |
| 102 | `10111000` | `B8` | instruction: MOV AX,13, byte 1/3 | Thirteen bytes consume the exact remaining capacity. |
| 103 | `00001101` | `0D` | instruction: MOV AX,13, byte 2/3 | Thirteen bytes consume the exact remaining capacity. |
| 104 | `00000000` | `00` | instruction: MOV AX,13, byte 3/3 | Thirteen bytes consume the exact remaining capacity. |
| 105 | `11101000` | `E8` | instruction: CALL +87, byte 1/3 | From offset 108 enter the allocator. |
| 106 | `01010111` | `57` | instruction: CALL +87, byte 2/3 | From offset 108 enter the allocator. |
| 107 | `00000000` | `00` | instruction: CALL +87, byte 3/3 | From offset 108 enter the allocator. |
| 108 | `01110010` | `72` | instruction: JB +4, byte 1/2 | A failed request must never dereference FFFF. |
| 109 | `00000100` | `04` | instruction: JB +4, byte 2/2 | A failed request must never dereference FFFF. |
| 110 | `10110000` | `B0` | instruction: MOV AL,43, byte 1/2 | Caller marker C identifies the second successful allocation. |
| 111 | `01000011` | `43` | instruction: MOV AL,43, byte 2/2 | Caller marker C identifies the second successful allocation. |
| 112 | `10001000` | `88` | instruction: MOV [DI],AL, byte 1/2 | Write C at 2003, within the second allocation. |
| 113 | `00000101` | `05` | instruction: MOV [DI],AL, byte 2/2 | Write C at 2003, within the second allocation. |
| 114 | `10111000` | `B8` | instruction: MOV AX,0, byte 1/3 | Preserve returned CF for the log. |
| 115 | `00000000` | `00` | instruction: MOV AX,0, byte 2/3 | Preserve returned CF for the log. |
| 116 | `00000000` | `00` | instruction: MOV AX,0, byte 3/3 | Preserve returned CF for the log. |
| 117 | `00010101` | `15` | instruction: ADC AX,0, byte 1/3 | Convert returned failure status to a word. |
| 118 | `00000000` | `00` | instruction: ADC AX,0, byte 2/3 | Convert returned failure status to a word. |
| 119 | `00000000` | `00` | instruction: ADC AX,0, byte 3/3 | Convert returned failure status to a word. |
| 120 | `10001001` | `89` | instruction: MOV [210C],DI, byte 1/4 | Log the second returned pointer. |
| 121 | `00111110` | `3E` | instruction: MOV [210C],DI, byte 2/4 | Log the second returned pointer. |
| 122 | `00001100` | `0C` | instruction: MOV [210C],DI, byte 3/4 | Log the second returned pointer. |
| 123 | `00100001` | `21` | instruction: MOV [210C],DI, byte 4/4 | Log the second returned pointer. |
| 124 | `10001001` | `89` | instruction: MOV [210E],BX, byte 1/4 | Log exact-end cursor 2010. |
| 125 | `00011110` | `1E` | instruction: MOV [210E],BX, byte 2/4 | Log exact-end cursor 2010. |
| 126 | `00001110` | `0E` | instruction: MOV [210E],BX, byte 3/4 | Log exact-end cursor 2010. |
| 127 | `00100001` | `21` | instruction: MOV [210E],BX, byte 4/4 | Log exact-end cursor 2010. |
| 128 | `10001001` | `89` | instruction: MOV [2110],AX, byte 1/4 | Log the exact fit's success. |
| 129 | `00000110` | `06` | instruction: MOV [2110],AX, byte 2/4 | Log the exact fit's success. |
| 130 | `00010000` | `10` | instruction: MOV [2110],AX, byte 3/4 | Log the exact fit's success. |
| 131 | `00100001` | `21` | instruction: MOV [2110],AX, byte 4/4 | Log the exact fit's success. |
| 132 | `10111000` | `B8` | instruction: MOV AX,1, byte 1/3 | An exhausted arena cannot supply another byte. |
| 133 | `00000001` | `01` | instruction: MOV AX,1, byte 2/3 | An exhausted arena cannot supply another byte. |
| 134 | `00000000` | `00` | instruction: MOV AX,1, byte 3/3 | An exhausted arena cannot supply another byte. |
| 135 | `11101000` | `E8` | instruction: CALL +57, byte 1/3 | From offset 138 enter the allocator. |
| 136 | `00111001` | `39` | instruction: CALL +57, byte 2/3 | From offset 138 enter the allocator. |
| 137 | `00000000` | `00` | instruction: CALL +57, byte 3/3 | From offset 138 enter the allocator. |
| 138 | `01110010` | `72` | instruction: JB +4, byte 1/2 | Failure skips the write beyond the arena. |
| 139 | `00000100` | `04` | instruction: JB +4, byte 2/2 | Failure skips the write beyond the arena. |
| 140 | `10110000` | `B0` | instruction: MOV AL,44, byte 1/2 | Marker D is written only if this request fits. |
| 141 | `01000100` | `44` | instruction: MOV AL,44, byte 2/2 | Marker D is written only if this request fits. |
| 142 | `10001000` | `88` | instruction: MOV [DI],AL, byte 1/2 | The one-bit control permits D at the last arena byte. |
| 143 | `00000101` | `05` | instruction: MOV [DI],AL, byte 2/2 | The one-bit control permits D at the last arena byte. |
| 144 | `10111000` | `B8` | instruction: MOV AX,0, byte 1/3 | Retain carry until it has been captured. |
| 145 | `00000000` | `00` | instruction: MOV AX,0, byte 2/3 | Retain carry until it has been captured. |
| 146 | `00000000` | `00` | instruction: MOV AX,0, byte 3/3 | Retain carry until it has been captured. |
| 147 | `00010101` | `15` | instruction: ADC AX,0, byte 1/3 | Log the one-byte request's outcome. |
| 148 | `00000000` | `00` | instruction: ADC AX,0, byte 2/3 | Log the one-byte request's outcome. |
| 149 | `00000000` | `00` | instruction: ADC AX,0, byte 3/3 | Log the one-byte request's outcome. |
| 150 | `10001001` | `89` | instruction: MOV [2112],DI, byte 1/4 | Log failure sentinel or the control's final-byte pointer. |
| 151 | `00111110` | `3E` | instruction: MOV [2112],DI, byte 2/4 | Log failure sentinel or the control's final-byte pointer. |
| 152 | `00010010` | `12` | instruction: MOV [2112],DI, byte 3/4 | Log failure sentinel or the control's final-byte pointer. |
| 153 | `00100001` | `21` | instruction: MOV [2112],DI, byte 4/4 | Log failure sentinel or the control's final-byte pointer. |
| 154 | `10001001` | `89` | instruction: MOV [2114],BX, byte 1/4 | Cursor stays within the exclusive end. |
| 155 | `00011110` | `1E` | instruction: MOV [2114],BX, byte 2/4 | Cursor stays within the exclusive end. |
| 156 | `00010100` | `14` | instruction: MOV [2114],BX, byte 3/4 | Cursor stays within the exclusive end. |
| 157 | `00100001` | `21` | instruction: MOV [2114],BX, byte 4/4 | Cursor stays within the exclusive end. |
| 158 | `10001001` | `89` | instruction: MOV [2116],AX, byte 1/4 | Failure is one; the control logs zero. |
| 159 | `00000110` | `06` | instruction: MOV [2116],AX, byte 2/4 | Failure is one; the control logs zero. |
| 160 | `00010110` | `16` | instruction: MOV [2116],AX, byte 3/4 | Failure is one; the control logs zero. |
| 161 | `00100001` | `21` | instruction: MOV [2116],AX, byte 4/4 | Failure is one; the control logs zero. |
| 162 | `10111000` | `B8` | instruction: MOV AX,FFFF, byte 1/3 | A huge request would wrap the candidate sum. |
| 163 | `11111111` | `FF` | instruction: MOV AX,FFFF, byte 2/3 | A huge request would wrap the candidate sum. |
| 164 | `11111111` | `FF` | instruction: MOV AX,FFFF, byte 3/3 | A huge request would wrap the candidate sum. |
| 165 | `11101000` | `E8` | instruction: CALL +27, byte 1/3 | From offset 168 enter the allocator. |
| 166 | `00011011` | `1B` | instruction: CALL +27, byte 2/3 | From offset 168 enter the allocator. |
| 167 | `00000000` | `00` | instruction: CALL +27, byte 3/3 | From offset 168 enter the allocator. |
| 168 | `01110010` | `72` | instruction: JB +4, byte 1/2 | Arithmetic carry must reject this request before any marker write. |
| 169 | `00000100` | `04` | instruction: JB +4, byte 2/2 | Arithmetic carry must reject this request before any marker write. |
| 170 | `10110000` | `B0` | instruction: MOV AL,45, byte 1/2 | Marker E must never be written for this failing request. |
| 171 | `01000101` | `45` | instruction: MOV AL,45, byte 2/2 | Marker E must never be written for this failing request. |
| 172 | `10001000` | `88` | instruction: MOV [DI],AL, byte 1/2 | Conditional caller store, skipped on failure. |
| 173 | `00000101` | `05` | instruction: MOV [DI],AL, byte 2/2 | Conditional caller store, skipped on failure. |
| 174 | `10111000` | `B8` | instruction: MOV AX,0, byte 1/3 | Capture the final return carry without altering it first. |
| 175 | `00000000` | `00` | instruction: MOV AX,0, byte 2/3 | Capture the final return carry without altering it first. |
| 176 | `00000000` | `00` | instruction: MOV AX,0, byte 3/3 | Capture the final return carry without altering it first. |
| 177 | `00010101` | `15` | instruction: ADC AX,0, byte 1/3 | Final failure word is one. |
| 178 | `00000000` | `00` | instruction: ADC AX,0, byte 2/3 | Final failure word is one. |
| 179 | `00000000` | `00` | instruction: ADC AX,0, byte 3/3 | Final failure word is one. |
| 180 | `10001001` | `89` | instruction: MOV [2118],DI, byte 1/4 | Log the wraparound failure sentinel. |
| 181 | `00111110` | `3E` | instruction: MOV [2118],DI, byte 2/4 | Log the wraparound failure sentinel. |
| 182 | `00011000` | `18` | instruction: MOV [2118],DI, byte 3/4 | Log the wraparound failure sentinel. |
| 183 | `00100001` | `21` | instruction: MOV [2118],DI, byte 4/4 | Log the wraparound failure sentinel. |
| 184 | `10001001` | `89` | instruction: MOV [211A],BX, byte 1/4 | Log unchanged final cursor 2010. |
| 185 | `00011110` | `1E` | instruction: MOV [211A],BX, byte 2/4 | Log unchanged final cursor 2010. |
| 186 | `00011010` | `1A` | instruction: MOV [211A],BX, byte 3/4 | Log unchanged final cursor 2010. |
| 187 | `00100001` | `21` | instruction: MOV [211A],BX, byte 4/4 | Log unchanged final cursor 2010. |
| 188 | `10001001` | `89` | instruction: MOV [211C],AX, byte 1/4 | Log failure without writing through the sentinel. |
| 189 | `00000110` | `06` | instruction: MOV [211C],AX, byte 2/4 | Log failure without writing through the sentinel. |
| 190 | `00011100` | `1C` | instruction: MOV [211C],AX, byte 3/4 | Log failure without writing through the sentinel. |
| 191 | `00100001` | `21` | instruction: MOV [211C],AX, byte 4/4 | Log failure without writing through the sentinel. |
| 192 | `11110100` | `F4` | instruction: HLT, byte 1/1 | Halt after five requests; QMP observes next IP 7CC1. |
| 193 | `11101011` | `EB` | instruction: JMP -3, byte 1/2 | Defensive return to HLT if resumed. |
| 194 | `11111101` | `FD` | instruction: JMP -3, byte 2/2 | Defensive return to HLT if resumed. |
| 195 | `00111101` | `3D` | instruction: CMP AX,0, byte 1/3 | Reject zero without changing the unsigned requested size. |
| 196 | `00000000` | `00` | instruction: CMP AX,0, byte 2/3 | Reject zero without changing the unsigned requested size. |
| 197 | `00000000` | `00` | instruction: CMP AX,0, byte 3/3 | Reject zero without changing the unsigned requested size. |
| 198 | `01110100` | `74` | instruction: JZ +15, byte 1/2 | From offset 200 jump to the shared failure path at 215. |
| 199 | `00001111` | `0F` | instruction: JZ +15, byte 2/2 | From offset 200 jump to the shared failure path at 215. |
| 200 | `10001001` | `89` | instruction: MOV DI,BX, byte 1/2 | Preserve the old cursor as the returned start pointer. |
| 201 | `11011111` | `DF` | instruction: MOV DI,BX, byte 2/2 | Preserve the old cursor as the returned start pointer. |
| 202 | `00000001` | `01` | instruction: ADD AX,BX, byte 1/2 | Calculate the candidate end; carry catches unsigned wraparound. |
| 203 | `11011000` | `D8` | instruction: ADD AX,BX, byte 2/2 | Calculate the candidate end; carry catches unsigned wraparound. |
| 204 | `01110010` | `72` | instruction: JB +9, byte 1/2 | Reject arithmetic carry before testing the arena bound. |
| 205 | `00001001` | `09` | instruction: JB +9, byte 2/2 | Reject arithmetic carry before testing the arena bound. |
| 206 | `00111101` | `3D` | instruction: CMP AX,2010, byte 1/3 | Compare against the exclusive arena end. |
| 207 | `00010000` | `10` | instruction: CMP AX,2010, byte 2/3 | Compare against the exclusive arena end. |
| 208 | `00100000` | `20` | instruction: CMP AX,2010, byte 3/3 | Compare against the exclusive arena end. |
| 209 | `01110111` | `77` | instruction: JA +4, byte 1/2 | Reject an end beyond 2010; equality is an exact fit. |
| 210 | `00000100` | `04` | instruction: JA +4, byte 2/2 | Reject an end beyond 2010; equality is an exact fit. |
| 211 | `10001001` | `89` | instruction: MOV BX,AX, byte 1/2 | Commit the candidate only on success. |
| 212 | `11000011` | `C3` | instruction: MOV BX,AX, byte 2/2 | Commit the candidate only on success. |
| 213 | `11111000` | `F8` | instruction: CLC, byte 1/1 | Return CF zero; other arithmetic flags are scratch state. |
| 214 | `11000011` | `C3` | instruction: RET, byte 1/1 | Restore the caller's logical return IP. |
| 215 | `10111111` | `BF` | instruction: MOV DI,FFFF, byte 1/3 | Return a failure sentinel without changing the cursor. |
| 216 | `11111111` | `FF` | instruction: MOV DI,FFFF, byte 2/3 | Return a failure sentinel without changing the cursor. |
| 217 | `11111111` | `FF` | instruction: MOV DI,FFFF, byte 3/3 | Return a failure sentinel without changing the cursor. |
| 218 | `11111001` | `F9` | instruction: STC, byte 1/1 | Return CF one for zero, exhaustion or arithmetic wrap. |
| 219 | `11000011` | `C3` | instruction: RET, byte 1/1 | Balance the same near-call stack on failure. |
