# Every byte explained

Generated from canonical `.bits` annotations by `python3 tools/byte_tables.py`.

Instruction names below are disassembly for explanation, never code-generation input.

| Offset | Binary | Hex | Range / byte within it | Encoding explanation |
| --- | --- | --- | --- | --- |
| 0 | `11111010` | `FA` | instruction: CLI, byte 1/1 | Mask external interrupts during descriptor and device setup. |
| 1 | `11101010` | `EA` | instruction: JMP 0000:7E06, byte 1/5 | Normalize the real-mode code segment. |
| 2 | `00000110` | `06` | instruction: JMP 0000:7E06, byte 2/5 | Normalize the real-mode code segment. |
| 3 | `01111110` | `7E` | instruction: JMP 0000:7E06, byte 3/5 | Normalize the real-mode code segment. |
| 4 | `00000000` | `00` | instruction: JMP 0000:7E06, byte 4/5 | Normalize the real-mode code segment. |
| 5 | `00000000` | `00` | instruction: JMP 0000:7E06, byte 5/5 | Normalize the real-mode code segment. |
| 6 | `00110001` | `31` | instruction: XOR AX,AX, byte 1/2 | Prepare segment zero. |
| 7 | `11000000` | `C0` | instruction: XOR AX,AX, byte 2/2 | Prepare segment zero. |
| 8 | `10001110` | `8E` | instruction: MOV DS,AX, byte 1/2 | Address the descriptor pointers through DS zero. |
| 9 | `11011000` | `D8` | instruction: MOV DS,AX, byte 2/2 | Address the descriptor pointers through DS zero. |
| 10 | `10001110` | `8E` | instruction: MOV SS,AX, byte 1/2 | Establish the initial stack segment. |
| 11 | `11010000` | `D0` | instruction: MOV SS,AX, byte 2/2 | Establish the initial stack segment. |
| 12 | `10111100` | `BC` | instruction: MOV SP,7C00, byte 1/3 | Use a defined stack before changing modes. |
| 13 | `00000000` | `00` | instruction: MOV SP,7C00, byte 2/3 | Use a defined stack before changing modes. |
| 14 | `01111100` | `7C` | instruction: MOV SP,7C00, byte 3/3 | Use a defined stack before changing modes. |
| 15 | `11111100` | `FC` | instruction: CLD, byte 1/1 | Clear direction in both saved and handler flags. |
| 16 | `00001111` | `0F` | instruction: LGDT [7F18], byte 1/5 | Load the literal GDT pointer at payload offset 280. |
| 17 | `00000001` | `01` | instruction: LGDT [7F18], byte 2/5 | Load the literal GDT pointer at payload offset 280. |
| 18 | `00010110` | `16` | instruction: LGDT [7F18], byte 3/5 | Load the literal GDT pointer at payload offset 280. |
| 19 | `00011000` | `18` | instruction: LGDT [7F18], byte 4/5 | Load the literal GDT pointer at payload offset 280. |
| 20 | `01111111` | `7F` | instruction: LGDT [7F18], byte 5/5 | Load the literal GDT pointer at payload offset 280. |
| 21 | `00001111` | `0F` | instruction: MOV EAX,CR0, byte 1/3 | Preserve existing control-register bits. |
| 22 | `00100000` | `20` | instruction: MOV EAX,CR0, byte 2/3 | Preserve existing control-register bits. |
| 23 | `11000000` | `C0` | instruction: MOV EAX,CR0, byte 3/3 | Preserve existing control-register bits. |
| 24 | `01100110` | `66` | instruction: OR EAX,1, byte 1/4 | Set protected-mode enable with 32-bit operand size. |
| 25 | `10000011` | `83` | instruction: OR EAX,1, byte 2/4 | Set protected-mode enable with 32-bit operand size. |
| 26 | `11001000` | `C8` | instruction: OR EAX,1, byte 3/4 | Set protected-mode enable with 32-bit operand size. |
| 27 | `00000001` | `01` | instruction: OR EAX,1, byte 4/4 | Set protected-mode enable with 32-bit operand size. |
| 28 | `00001111` | `0F` | instruction: MOV CR0,EAX, byte 1/3 | Enable protection without enabling paging. |
| 29 | `00100010` | `22` | instruction: MOV CR0,EAX, byte 2/3 | Enable protection without enabling paging. |
| 30 | `11000000` | `C0` | instruction: MOV CR0,EAX, byte 3/3 | Enable protection without enabling paging. |
| 31 | `01100110` | `66` | instruction: JMP 0008:00007E28, byte 1/8 | Enter the flat 32-bit code descriptor at offset 40. |
| 32 | `11101010` | `EA` | instruction: JMP 0008:00007E28, byte 2/8 | Enter the flat 32-bit code descriptor at offset 40. |
| 33 | `00101000` | `28` | instruction: JMP 0008:00007E28, byte 3/8 | Enter the flat 32-bit code descriptor at offset 40. |
| 34 | `01111110` | `7E` | instruction: JMP 0008:00007E28, byte 4/8 | Enter the flat 32-bit code descriptor at offset 40. |
| 35 | `00000000` | `00` | instruction: JMP 0008:00007E28, byte 5/8 | Enter the flat 32-bit code descriptor at offset 40. |
| 36 | `00000000` | `00` | instruction: JMP 0008:00007E28, byte 6/8 | Enter the flat 32-bit code descriptor at offset 40. |
| 37 | `00001000` | `08` | instruction: JMP 0008:00007E28, byte 7/8 | Enter the flat 32-bit code descriptor at offset 40. |
| 38 | `00000000` | `00` | instruction: JMP 0008:00007E28, byte 8/8 | Enter the flat 32-bit code descriptor at offset 40. |
| 39 | `00000000` | `00` | padding: Protected entry alignment, byte 1/1 | One skipped byte. |
| 40 | `10111000` | `B8` | instruction: MOV EAX,10, byte 1/5 | Select the flat data descriptor. |
| 41 | `00010000` | `10` | instruction: MOV EAX,10, byte 2/5 | Select the flat data descriptor. |
| 42 | `00000000` | `00` | instruction: MOV EAX,10, byte 3/5 | Select the flat data descriptor. |
| 43 | `00000000` | `00` | instruction: MOV EAX,10, byte 4/5 | Select the flat data descriptor. |
| 44 | `00000000` | `00` | instruction: MOV EAX,10, byte 5/5 | Select the flat data descriptor. |
| 45 | `10001110` | `8E` | instruction: MOV DS,AX, byte 1/2 | Load flat data selector 0010. |
| 46 | `11011000` | `D8` | instruction: MOV DS,AX, byte 2/2 | Load flat data selector 0010. |
| 47 | `10001110` | `8E` | instruction: MOV SS,AX, byte 1/2 | Load the flat 32-bit stack descriptor. |
| 48 | `11010000` | `D0` | instruction: MOV SS,AX, byte 2/2 | Load the flat 32-bit stack descriptor. |
| 49 | `10111100` | `BC` | instruction: MOV ESP,9000, byte 1/5 | Put the actual IRQ frame below physical 9000. |
| 50 | `00000000` | `00` | instruction: MOV ESP,9000, byte 2/5 | Put the actual IRQ frame below physical 9000. |
| 51 | `10010000` | `90` | instruction: MOV ESP,9000, byte 3/5 | Put the actual IRQ frame below physical 9000. |
| 52 | `00000000` | `00` | instruction: MOV ESP,9000, byte 4/5 | Put the actual IRQ frame below physical 9000. |
| 53 | `00000000` | `00` | instruction: MOV ESP,9000, byte 5/5 | Put the actual IRQ frame below physical 9000. |
| 54 | `00001111` | `0F` | instruction: LIDT [00007F1E], byte 1/7 | Load the 33-gate table through its literal pointer. |
| 55 | `00000001` | `01` | instruction: LIDT [00007F1E], byte 2/7 | Load the 33-gate table through its literal pointer. |
| 56 | `00011101` | `1D` | instruction: LIDT [00007F1E], byte 3/7 | Load the 33-gate table through its literal pointer. |
| 57 | `00011110` | `1E` | instruction: LIDT [00007F1E], byte 4/7 | Load the 33-gate table through its literal pointer. |
| 58 | `01111111` | `7F` | instruction: LIDT [00007F1E], byte 5/7 | Load the 33-gate table through its literal pointer. |
| 59 | `00000000` | `00` | instruction: LIDT [00007F1E], byte 6/7 | Load the 33-gate table through its literal pointer. |
| 60 | `00000000` | `00` | instruction: LIDT [00007F1E], byte 7/7 | Load the 33-gate table through its literal pointer. |
| 61 | `11000111` | `C7` | instruction: MOV dword [4000],0, byte 1/10 | Initialize the native IRQ count. |
| 62 | `00000101` | `05` | instruction: MOV dword [4000],0, byte 2/10 | Initialize the native IRQ count. |
| 63 | `00000000` | `00` | instruction: MOV dword [4000],0, byte 3/10 | Initialize the native IRQ count. |
| 64 | `01000000` | `40` | instruction: MOV dword [4000],0, byte 4/10 | Initialize the native IRQ count. |
| 65 | `00000000` | `00` | instruction: MOV dword [4000],0, byte 5/10 | Initialize the native IRQ count. |
| 66 | `00000000` | `00` | instruction: MOV dword [4000],0, byte 6/10 | Initialize the native IRQ count. |
| 67 | `00000000` | `00` | instruction: MOV dword [4000],0, byte 7/10 | Initialize the native IRQ count. |
| 68 | `00000000` | `00` | instruction: MOV dword [4000],0, byte 8/10 | Initialize the native IRQ count. |
| 69 | `00000000` | `00` | instruction: MOV dword [4000],0, byte 9/10 | Initialize the native IRQ count. |
| 70 | `00000000` | `00` | instruction: MOV dword [4000],0, byte 10/10 | Initialize the native IRQ count. |
| 71 | `10111111` | `BF` | instruction: MOV EDI,4100, byte 1/5 | Start the three-entry native frame log. |
| 72 | `00000000` | `00` | instruction: MOV EDI,4100, byte 2/5 | Start the three-entry native frame log. |
| 73 | `01000001` | `41` | instruction: MOV EDI,4100, byte 3/5 | Start the three-entry native frame log. |
| 74 | `00000000` | `00` | instruction: MOV EDI,4100, byte 4/5 | Start the three-entry native frame log. |
| 75 | `00000000` | `00` | instruction: MOV EDI,4100, byte 5/5 | Start the three-entry native frame log. |
| 76 | `10111011` | `BB` | instruction: MOV EBX,3, byte 1/5 | Accept exactly three IRQ entries; the control changes byte 77 bit zero to two. |
| 77 | `00000011` | `03` | instruction: MOV EBX,3, byte 2/5 | Accept exactly three IRQ entries; the control changes byte 77 bit zero to two. |
| 78 | `00000000` | `00` | instruction: MOV EBX,3, byte 3/5 | Accept exactly three IRQ entries; the control changes byte 77 bit zero to two. |
| 79 | `00000000` | `00` | instruction: MOV EBX,3, byte 4/5 | Accept exactly three IRQ entries; the control changes byte 77 bit zero to two. |
| 80 | `00000000` | `00` | instruction: MOV EBX,3, byte 5/5 | Accept exactly three IRQ entries; the control changes byte 77 bit zero to two. |
| 81 | `10111001` | `B9` | instruction: MOV ECX,12, byte 1/5 | Clear twelve log doublewords. |
| 82 | `00001100` | `0C` | instruction: MOV ECX,12, byte 2/5 | Clear twelve log doublewords. |
| 83 | `00000000` | `00` | instruction: MOV ECX,12, byte 3/5 | Clear twelve log doublewords. |
| 84 | `00000000` | `00` | instruction: MOV ECX,12, byte 4/5 | Clear twelve log doublewords. |
| 85 | `00000000` | `00` | instruction: MOV ECX,12, byte 5/5 | Clear twelve log doublewords. |
| 86 | `00110001` | `31` | instruction: XOR EAX,EAX, byte 1/2 | Prepare the log's zero value. |
| 87 | `11000000` | `C0` | instruction: XOR EAX,EAX, byte 2/2 | Prepare the log's zero value. |
| 88 | `10001001` | `89` | instruction: MOV [EDI],EAX, byte 1/2 | Initialize one doubleword of the log. |
| 89 | `00000111` | `07` | instruction: MOV [EDI],EAX, byte 2/2 | Initialize one doubleword of the log. |
| 90 | `10000011` | `83` | instruction: ADD EDI,4, byte 1/3 | Advance within the 48-byte log. |
| 91 | `11000111` | `C7` | instruction: ADD EDI,4, byte 2/3 | Advance within the 48-byte log. |
| 92 | `00000100` | `04` | instruction: ADD EDI,4, byte 3/3 | Advance within the 48-byte log. |
| 93 | `11100010` | `E2` | instruction: LOOP -7, byte 1/2 | Repeat at offset 88 until all three entries are zero. |
| 94 | `11111001` | `F9` | instruction: LOOP -7, byte 2/2 | Repeat at offset 88 until all three entries are zero. |
| 95 | `10111111` | `BF` | instruction: MOV EDI,4100, byte 1/5 | Reset the handler-owned log cursor. |
| 96 | `00000000` | `00` | instruction: MOV EDI,4100, byte 2/5 | Reset the handler-owned log cursor. |
| 97 | `01000001` | `41` | instruction: MOV EDI,4100, byte 3/5 | Reset the handler-owned log cursor. |
| 98 | `00000000` | `00` | instruction: MOV EDI,4100, byte 4/5 | Reset the handler-owned log cursor. |
| 99 | `00000000` | `00` | instruction: MOV EDI,4100, byte 5/5 | Reset the handler-owned log cursor. |
| 100 | `11000110` | `C6` | instruction: MOV byte [40FF],A5, byte 1/7 | Guard the byte before the log. |
| 101 | `00000101` | `05` | instruction: MOV byte [40FF],A5, byte 2/7 | Guard the byte before the log. |
| 102 | `11111111` | `FF` | instruction: MOV byte [40FF],A5, byte 3/7 | Guard the byte before the log. |
| 103 | `01000000` | `40` | instruction: MOV byte [40FF],A5, byte 4/7 | Guard the byte before the log. |
| 104 | `00000000` | `00` | instruction: MOV byte [40FF],A5, byte 5/7 | Guard the byte before the log. |
| 105 | `00000000` | `00` | instruction: MOV byte [40FF],A5, byte 6/7 | Guard the byte before the log. |
| 106 | `10100101` | `A5` | instruction: MOV byte [40FF],A5, byte 7/7 | Guard the byte before the log. |
| 107 | `11000110` | `C6` | instruction: MOV byte [4130],5A, byte 1/7 | Guard the byte after the third entry. |
| 108 | `00000101` | `05` | instruction: MOV byte [4130],5A, byte 2/7 | Guard the byte after the third entry. |
| 109 | `00110000` | `30` | instruction: MOV byte [4130],5A, byte 3/7 | Guard the byte after the third entry. |
| 110 | `01000001` | `41` | instruction: MOV byte [4130],5A, byte 4/7 | Guard the byte after the third entry. |
| 111 | `00000000` | `00` | instruction: MOV byte [4130],5A, byte 5/7 | Guard the byte after the third entry. |
| 112 | `00000000` | `00` | instruction: MOV byte [4130],5A, byte 6/7 | Guard the byte after the third entry. |
| 113 | `01011010` | `5A` | instruction: MOV byte [4130],5A, byte 7/7 | Guard the byte after the third entry. |
| 114 | `10110000` | `B0` | instruction: MOV AL,11, byte 1/2 | Start edge-triggered cascaded PIC initialization, requesting ICW4. |
| 115 | `00010001` | `11` | instruction: MOV AL,11, byte 2/2 | Start edge-triggered cascaded PIC initialization, requesting ICW4. |
| 116 | `11100110` | `E6` | instruction: OUT 20,AL, byte 1/2 | Initialize the master PIC command register. |
| 117 | `00100000` | `20` | instruction: OUT 20,AL, byte 2/2 | Initialize the master PIC command register. |
| 118 | `11100110` | `E6` | instruction: OUT A0,AL, byte 1/2 | Initialize the slave PIC command register. |
| 119 | `10100000` | `A0` | instruction: OUT A0,AL, byte 2/2 | Initialize the slave PIC command register. |
| 120 | `10110000` | `B0` | instruction: MOV AL,20, byte 1/2 | Map master IRQ0 through IRQ7 to vectors 20 through 27. |
| 121 | `00100000` | `20` | instruction: MOV AL,20, byte 2/2 | Map master IRQ0 through IRQ7 to vectors 20 through 27. |
| 122 | `11100110` | `E6` | instruction: OUT 21,AL, byte 1/2 | Write master ICW2. |
| 123 | `00100001` | `21` | instruction: OUT 21,AL, byte 2/2 | Write master ICW2. |
| 124 | `10110000` | `B0` | instruction: MOV AL,28, byte 1/2 | Map slave IRQs to vectors 28 through 2F. |
| 125 | `00101000` | `28` | instruction: MOV AL,28, byte 2/2 | Map slave IRQs to vectors 28 through 2F. |
| 126 | `11100110` | `E6` | instruction: OUT A1,AL, byte 1/2 | Write slave ICW2. |
| 127 | `10100001` | `A1` | instruction: OUT A1,AL, byte 2/2 | Write slave ICW2. |
| 128 | `10110000` | `B0` | instruction: MOV AL,04, byte 1/2 | Declare the slave on master IRQ2. |
| 129 | `00000100` | `04` | instruction: MOV AL,04, byte 2/2 | Declare the slave on master IRQ2. |
| 130 | `11100110` | `E6` | instruction: OUT 21,AL, byte 1/2 | Write master ICW3. |
| 131 | `00100001` | `21` | instruction: OUT 21,AL, byte 2/2 | Write master ICW3. |
| 132 | `10110000` | `B0` | instruction: MOV AL,02, byte 1/2 | Identify the slave's cascade input. |
| 133 | `00000010` | `02` | instruction: MOV AL,02, byte 2/2 | Identify the slave's cascade input. |
| 134 | `11100110` | `E6` | instruction: OUT A1,AL, byte 1/2 | Write slave ICW3. |
| 135 | `10100001` | `A1` | instruction: OUT A1,AL, byte 2/2 | Write slave ICW3. |
| 136 | `10110000` | `B0` | instruction: MOV AL,01, byte 1/2 | Select 8086 mode with explicit EOI, not automatic EOI. |
| 137 | `00000001` | `01` | instruction: MOV AL,01, byte 2/2 | Select 8086 mode with explicit EOI, not automatic EOI. |
| 138 | `11100110` | `E6` | instruction: OUT 21,AL, byte 1/2 | Write master ICW4. |
| 139 | `00100001` | `21` | instruction: OUT 21,AL, byte 2/2 | Write master ICW4. |
| 140 | `11100110` | `E6` | instruction: OUT A1,AL, byte 1/2 | Write slave ICW4. |
| 141 | `10100001` | `A1` | instruction: OUT A1,AL, byte 2/2 | Write slave ICW4. |
| 142 | `10110000` | `B0` | instruction: MOV AL,FF, byte 1/2 | Keep every slave IRQ masked. |
| 143 | `11111111` | `FF` | instruction: MOV AL,FF, byte 2/2 | Keep every slave IRQ masked. |
| 144 | `11100110` | `E6` | instruction: OUT A1,AL, byte 1/2 | Install the slave mask. |
| 145 | `10100001` | `A1` | instruction: OUT A1,AL, byte 2/2 | Install the slave mask. |
| 146 | `10110000` | `B0` | instruction: MOV AL,36, byte 1/2 | PIT counter zero, low then high byte, binary mode three. |
| 147 | `00110110` | `36` | instruction: MOV AL,36, byte 2/2 | PIT counter zero, low then high byte, binary mode three. |
| 148 | `11100110` | `E6` | instruction: OUT 43,AL, byte 1/2 | Program the PIT control word. |
| 149 | `01000011` | `43` | instruction: OUT 43,AL, byte 2/2 | Program the PIT control word. |
| 150 | `10110000` | `B0` | instruction: MOV AL,9C, byte 1/2 | Low byte of the literal reload value 2E9C. |
| 151 | `10011100` | `9C` | instruction: MOV AL,9C, byte 2/2 | Low byte of the literal reload value 2E9C. |
| 152 | `11100110` | `E6` | instruction: OUT 40,AL, byte 1/2 | Write counter zero's low reload byte first. |
| 153 | `01000000` | `40` | instruction: OUT 40,AL, byte 2/2 | Write counter zero's low reload byte first. |
| 154 | `10110000` | `B0` | instruction: MOV AL,2E, byte 1/2 | High reload byte; no measured timing claim. |
| 155 | `00101110` | `2E` | instruction: MOV AL,2E, byte 2/2 | High reload byte; no measured timing claim. |
| 156 | `11100110` | `E6` | instruction: OUT 40,AL, byte 1/2 | Complete counter zero's reload. |
| 157 | `01000000` | `40` | instruction: OUT 40,AL, byte 2/2 | Complete counter zero's reload. |
| 158 | `10110000` | `B0` | instruction: MOV AL,FE, byte 1/2 | Unmask only master IRQ0. |
| 159 | `11111110` | `FE` | instruction: MOV AL,FE, byte 2/2 | Unmask only master IRQ0. |
| 160 | `11100110` | `E6` | instruction: OUT 21,AL, byte 1/2 | Install the master mask while CPU IF is still zero. |
| 161 | `00100001` | `21` | instruction: OUT 21,AL, byte 2/2 | Install the master mask while CPU IF is still zero. |
| 162 | `11111010` | `FA` | instruction: CLI, byte 1/1 | Begin the wait loop with interrupts masked, preventing a check-to-HLT race. |
| 163 | `00111001` | `39` | instruction: CMP [4000],EBX, byte 1/6 | Compare the completed native count with the literal limit. |
| 164 | `00011101` | `1D` | instruction: CMP [4000],EBX, byte 2/6 | Compare the completed native count with the literal limit. |
| 165 | `00000000` | `00` | instruction: CMP [4000],EBX, byte 3/6 | Compare the completed native count with the literal limit. |
| 166 | `01000000` | `40` | instruction: CMP [4000],EBX, byte 4/6 | Compare the completed native count with the literal limit. |
| 167 | `00000000` | `00` | instruction: CMP [4000],EBX, byte 5/6 | Compare the completed native count with the literal limit. |
| 168 | `00000000` | `00` | instruction: CMP [4000],EBX, byte 6/6 | Compare the completed native count with the literal limit. |
| 169 | `01110011` | `73` | instruction: JAE +4, byte 1/2 | Skip STI, wait HLT and the loop jump when the count has reached its limit. |
| 170 | `00000100` | `04` | instruction: JAE +4, byte 2/2 | Skip STI, wait HLT and the loop jump when the count has reached its limit. |
| 171 | `11111011` | `FB` | instruction: STI, byte 1/1 | Enable delivery; the following HLT is inside the architectural interrupt shadow. |
| 172 | `11110100` | `F4` | instruction: HLT wait, byte 1/1 | Wait for a real emulated device interrupt, not a software INT instruction. |
| 173 | `11101011` | `EB` | instruction: JMP -13, byte 1/2 | Recheck the count with CLI at offset 162 after returning. |
| 174 | `11110011` | `F3` | instruction: JMP -13, byte 2/2 | Recheck the count with CLI at offset 162 after returning. |
| 175 | `11110100` | `F4` | instruction: HLT done, byte 1/1 | Finish with IF zero and the timer line masked. |
| 176 | `11101011` | `EB` | instruction: JMP -3, byte 1/2 | Return to the final halt if resumed. |
| 177 | `11111101` | `FD` | instruction: JMP -3, byte 2/2 | Return to the final halt if resumed. |
| 178 | `00000000` | `00` | padding: Handler alignment, byte 1/14 | Place the IRQ entry at offset 192. |
| 179 | `00000000` | `00` | padding: Handler alignment, byte 2/14 | Place the IRQ entry at offset 192. |
| 180 | `00000000` | `00` | padding: Handler alignment, byte 3/14 | Place the IRQ entry at offset 192. |
| 181 | `00000000` | `00` | padding: Handler alignment, byte 4/14 | Place the IRQ entry at offset 192. |
| 182 | `00000000` | `00` | padding: Handler alignment, byte 5/14 | Place the IRQ entry at offset 192. |
| 183 | `00000000` | `00` | padding: Handler alignment, byte 6/14 | Place the IRQ entry at offset 192. |
| 184 | `00000000` | `00` | padding: Handler alignment, byte 7/14 | Place the IRQ entry at offset 192. |
| 185 | `00000000` | `00` | padding: Handler alignment, byte 8/14 | Place the IRQ entry at offset 192. |
| 186 | `00000000` | `00` | padding: Handler alignment, byte 9/14 | Place the IRQ entry at offset 192. |
| 187 | `00000000` | `00` | padding: Handler alignment, byte 10/14 | Place the IRQ entry at offset 192. |
| 188 | `00000000` | `00` | padding: Handler alignment, byte 11/14 | Place the IRQ entry at offset 192. |
| 189 | `00000000` | `00` | padding: Handler alignment, byte 12/14 | Place the IRQ entry at offset 192. |
| 190 | `00000000` | `00` | padding: Handler alignment, byte 13/14 | Place the IRQ entry at offset 192. |
| 191 | `00000000` | `00` | padding: Handler alignment, byte 14/14 | Place the IRQ entry at offset 192. |
| 192 | `10001011` | `8B` | instruction: MOV EAX,[ESP], byte 1/3 | Read the actual hardware-saved EIP, with no error code for IRQ0. |
| 193 | `00000100` | `04` | instruction: MOV EAX,[ESP], byte 2/3 | Read the actual hardware-saved EIP, with no error code for IRQ0. |
| 194 | `00100100` | `24` | instruction: MOV EAX,[ESP], byte 3/3 | Read the actual hardware-saved EIP, with no error code for IRQ0. |
| 195 | `10001001` | `89` | instruction: MOV [EDI],EAX, byte 1/2 | Copy saved EIP into this log entry. |
| 196 | `00000111` | `07` | instruction: MOV [EDI],EAX, byte 2/2 | Copy saved EIP into this log entry. |
| 197 | `10001011` | `8B` | instruction: MOV EAX,[ESP+4], byte 1/4 | Read the hardware-saved code selector doubleword. |
| 198 | `01000100` | `44` | instruction: MOV EAX,[ESP+4], byte 2/4 | Read the hardware-saved code selector doubleword. |
| 199 | `00100100` | `24` | instruction: MOV EAX,[ESP+4], byte 3/4 | Read the hardware-saved code selector doubleword. |
| 200 | `00000100` | `04` | instruction: MOV EAX,[ESP+4], byte 4/4 | Read the hardware-saved code selector doubleword. |
| 201 | `10001001` | `89` | instruction: MOV [EDI+4],EAX, byte 1/3 | Record saved CS. |
| 202 | `01000111` | `47` | instruction: MOV [EDI+4],EAX, byte 2/3 | Record saved CS. |
| 203 | `00000100` | `04` | instruction: MOV [EDI+4],EAX, byte 3/3 | Record saved CS. |
| 204 | `10001011` | `8B` | instruction: MOV EAX,[ESP+8], byte 1/4 | Read saved EFLAGS before changing arithmetic flags. |
| 205 | `01000100` | `44` | instruction: MOV EAX,[ESP+8], byte 2/4 | Read saved EFLAGS before changing arithmetic flags. |
| 206 | `00100100` | `24` | instruction: MOV EAX,[ESP+8], byte 3/4 | Read saved EFLAGS before changing arithmetic flags. |
| 207 | `00001000` | `08` | instruction: MOV EAX,[ESP+8], byte 4/4 | Read saved EFLAGS before changing arithmetic flags. |
| 208 | `10001001` | `89` | instruction: MOV [EDI+8],EAX, byte 1/3 | Record the interrupted flags, including IF one. |
| 209 | `01000111` | `47` | instruction: MOV [EDI+8],EAX, byte 2/3 | Record the interrupted flags, including IF one. |
| 210 | `00001000` | `08` | instruction: MOV [EDI+8],EAX, byte 3/3 | Record the interrupted flags, including IF one. |
| 211 | `10011100` | `9C` | instruction: PUSHFD, byte 1/1 | Capture handler flags before any flag-changing instruction. |
| 212 | `01011000` | `58` | instruction: POP EAX, byte 1/1 | Balance this temporary push and retrieve entry flags. |
| 213 | `10001001` | `89` | instruction: MOV [EDI+12],EAX, byte 1/3 | Record entry flags; the interrupt gate clears IF. |
| 214 | `01000111` | `47` | instruction: MOV [EDI+12],EAX, byte 2/3 | Record entry flags; the interrupt gate clears IF. |
| 215 | `00001100` | `0C` | instruction: MOV [EDI+12],EAX, byte 3/3 | Record entry flags; the interrupt gate clears IF. |
| 216 | `10000011` | `83` | instruction: ADD EDI,16, byte 1/3 | Advance the persistent log cursor by one complete entry. |
| 217 | `11000111` | `C7` | instruction: ADD EDI,16, byte 2/3 | Advance the persistent log cursor by one complete entry. |
| 218 | `00010000` | `10` | instruction: ADD EDI,16, byte 3/3 | Advance the persistent log cursor by one complete entry. |
| 219 | `11111111` | `FF` | instruction: INC dword [4000], byte 1/6 | Count this actual gate entry. |
| 220 | `00000101` | `05` | instruction: INC dword [4000], byte 2/6 | Count this actual gate entry. |
| 221 | `00000000` | `00` | instruction: INC dword [4000], byte 3/6 | Count this actual gate entry. |
| 222 | `01000000` | `40` | instruction: INC dword [4000], byte 4/6 | Count this actual gate entry. |
| 223 | `00000000` | `00` | instruction: INC dword [4000], byte 5/6 | Count this actual gate entry. |
| 224 | `00000000` | `00` | instruction: INC dword [4000], byte 6/6 | Count this actual gate entry. |
| 225 | `00111001` | `39` | instruction: CMP [4000],EBX, byte 1/6 | Decide whether this is the last accepted timer entry. |
| 226 | `00011101` | `1D` | instruction: CMP [4000],EBX, byte 2/6 | Decide whether this is the last accepted timer entry. |
| 227 | `00000000` | `00` | instruction: CMP [4000],EBX, byte 3/6 | Decide whether this is the last accepted timer entry. |
| 228 | `01000000` | `40` | instruction: CMP [4000],EBX, byte 4/6 | Decide whether this is the last accepted timer entry. |
| 229 | `00000000` | `00` | instruction: CMP [4000],EBX, byte 5/6 | Decide whether this is the last accepted timer entry. |
| 230 | `00000000` | `00` | instruction: CMP [4000],EBX, byte 6/6 | Decide whether this is the last accepted timer entry. |
| 231 | `01110010` | `72` | instruction: JB +4, byte 1/2 | Retain the timer mask until the limit is reached. |
| 232 | `00000100` | `04` | instruction: JB +4, byte 2/2 | Retain the timer mask until the limit is reached. |
| 233 | `10110000` | `B0` | instruction: MOV AL,FF, byte 1/2 | Mask all master lines on the final entry. |
| 234 | `11111111` | `FF` | instruction: MOV AL,FF, byte 2/2 | Mask all master lines on the final entry. |
| 235 | `11100110` | `E6` | instruction: OUT 21,AL, byte 1/2 | Prevent any fourth log entry. |
| 236 | `00100001` | `21` | instruction: OUT 21,AL, byte 2/2 | Prevent any fourth log entry. |
| 237 | `10110000` | `B0` | instruction: MOV AL,20, byte 1/2 | Non-specific end of interrupt for the master IRQ0. |
| 238 | `00100000` | `20` | instruction: MOV AL,20, byte 2/2 | Non-specific end of interrupt for the master IRQ0. |
| 239 | `11100110` | `E6` | instruction: OUT 20,AL, byte 1/2 | Clear the master's in-service bit; a port-bit control deliberately omits this EOI. |
| 240 | `00100000` | `20` | instruction: OUT 20,AL, byte 2/2 | Clear the master's in-service bit; a port-bit control deliberately omits this EOI. |
| 241 | `11001111` | `CF` | instruction: IRETD, byte 1/1 | Restore the untouched hardware EIP, CS and EFLAGS frame. |
| 242 | `00000000` | `00` | padding: GDT alignment, byte 1/14 | Put the descriptor table at offset 256. |
| 243 | `00000000` | `00` | padding: GDT alignment, byte 2/14 | Put the descriptor table at offset 256. |
| 244 | `00000000` | `00` | padding: GDT alignment, byte 3/14 | Put the descriptor table at offset 256. |
| 245 | `00000000` | `00` | padding: GDT alignment, byte 4/14 | Put the descriptor table at offset 256. |
| 246 | `00000000` | `00` | padding: GDT alignment, byte 5/14 | Put the descriptor table at offset 256. |
| 247 | `00000000` | `00` | padding: GDT alignment, byte 6/14 | Put the descriptor table at offset 256. |
| 248 | `00000000` | `00` | padding: GDT alignment, byte 7/14 | Put the descriptor table at offset 256. |
| 249 | `00000000` | `00` | padding: GDT alignment, byte 8/14 | Put the descriptor table at offset 256. |
| 250 | `00000000` | `00` | padding: GDT alignment, byte 9/14 | Put the descriptor table at offset 256. |
| 251 | `00000000` | `00` | padding: GDT alignment, byte 10/14 | Put the descriptor table at offset 256. |
| 252 | `00000000` | `00` | padding: GDT alignment, byte 11/14 | Put the descriptor table at offset 256. |
| 253 | `00000000` | `00` | padding: GDT alignment, byte 12/14 | Put the descriptor table at offset 256. |
| 254 | `00000000` | `00` | padding: GDT alignment, byte 13/14 | Put the descriptor table at offset 256. |
| 255 | `00000000` | `00` | padding: GDT alignment, byte 14/14 | Put the descriptor table at offset 256. |
| 256 | `00000000` | `00` | data: GDT null, byte 1/8 | Selector zero is unusable. |
| 257 | `00000000` | `00` | data: GDT null, byte 2/8 | Selector zero is unusable. |
| 258 | `00000000` | `00` | data: GDT null, byte 3/8 | Selector zero is unusable. |
| 259 | `00000000` | `00` | data: GDT null, byte 4/8 | Selector zero is unusable. |
| 260 | `00000000` | `00` | data: GDT null, byte 5/8 | Selector zero is unusable. |
| 261 | `00000000` | `00` | data: GDT null, byte 6/8 | Selector zero is unusable. |
| 262 | `00000000` | `00` | data: GDT null, byte 7/8 | Selector zero is unusable. |
| 263 | `00000000` | `00` | data: GDT null, byte 8/8 | Selector zero is unusable. |
| 264 | `11111111` | `FF` | data: GDT code, byte 1/8 | Flat present ring-zero 32-bit code; the CPU may set its accessed bit. |
| 265 | `11111111` | `FF` | data: GDT code, byte 2/8 | Flat present ring-zero 32-bit code; the CPU may set its accessed bit. |
| 266 | `00000000` | `00` | data: GDT code, byte 3/8 | Flat present ring-zero 32-bit code; the CPU may set its accessed bit. |
| 267 | `00000000` | `00` | data: GDT code, byte 4/8 | Flat present ring-zero 32-bit code; the CPU may set its accessed bit. |
| 268 | `00000000` | `00` | data: GDT code, byte 5/8 | Flat present ring-zero 32-bit code; the CPU may set its accessed bit. |
| 269 | `10011010` | `9A` | data: GDT code, byte 6/8 | Flat present ring-zero 32-bit code; the CPU may set its accessed bit. |
| 270 | `11001111` | `CF` | data: GDT code, byte 7/8 | Flat present ring-zero 32-bit code; the CPU may set its accessed bit. |
| 271 | `00000000` | `00` | data: GDT code, byte 8/8 | Flat present ring-zero 32-bit code; the CPU may set its accessed bit. |
| 272 | `11111111` | `FF` | data: GDT data, byte 1/8 | Flat writable data and a 32-bit stack. |
| 273 | `11111111` | `FF` | data: GDT data, byte 2/8 | Flat writable data and a 32-bit stack. |
| 274 | `00000000` | `00` | data: GDT data, byte 3/8 | Flat writable data and a 32-bit stack. |
| 275 | `00000000` | `00` | data: GDT data, byte 4/8 | Flat writable data and a 32-bit stack. |
| 276 | `00000000` | `00` | data: GDT data, byte 5/8 | Flat writable data and a 32-bit stack. |
| 277 | `10010010` | `92` | data: GDT data, byte 6/8 | Flat writable data and a 32-bit stack. |
| 278 | `11001111` | `CF` | data: GDT data, byte 7/8 | Flat writable data and a 32-bit stack. |
| 279 | `00000000` | `00` | data: GDT data, byte 8/8 | Flat writable data and a 32-bit stack. |
| 280 | `00010111` | `17` | data: GDTR, byte 1/6 | Limit 23 and physical base 00007F00. |
| 281 | `00000000` | `00` | data: GDTR, byte 2/6 | Limit 23 and physical base 00007F00. |
| 282 | `00000000` | `00` | data: GDTR, byte 3/6 | Limit 23 and physical base 00007F00. |
| 283 | `01111111` | `7F` | data: GDTR, byte 4/6 | Limit 23 and physical base 00007F00. |
| 284 | `00000000` | `00` | data: GDTR, byte 5/6 | Limit 23 and physical base 00007F00. |
| 285 | `00000000` | `00` | data: GDTR, byte 6/6 | Limit 23 and physical base 00007F00. |
| 286 | `00000111` | `07` | data: IDTR, byte 1/6 | Limit 263 and physical base 00007F30. |
| 287 | `00000001` | `01` | data: IDTR, byte 2/6 | Limit 263 and physical base 00007F30. |
| 288 | `00110000` | `30` | data: IDTR, byte 3/6 | Limit 263 and physical base 00007F30. |
| 289 | `01111111` | `7F` | data: IDTR, byte 4/6 | Limit 263 and physical base 00007F30. |
| 290 | `00000000` | `00` | data: IDTR, byte 5/6 | Limit 263 and physical base 00007F30. |
| 291 | `00000000` | `00` | data: IDTR, byte 6/6 | Limit 263 and physical base 00007F30. |
| 292 | `00000000` | `00` | padding: IDT alignment, byte 1/12 | Place vector zero at offset 304. |
| 293 | `00000000` | `00` | padding: IDT alignment, byte 2/12 | Place vector zero at offset 304. |
| 294 | `00000000` | `00` | padding: IDT alignment, byte 3/12 | Place vector zero at offset 304. |
| 295 | `00000000` | `00` | padding: IDT alignment, byte 4/12 | Place vector zero at offset 304. |
| 296 | `00000000` | `00` | padding: IDT alignment, byte 5/12 | Place vector zero at offset 304. |
| 297 | `00000000` | `00` | padding: IDT alignment, byte 6/12 | Place vector zero at offset 304. |
| 298 | `00000000` | `00` | padding: IDT alignment, byte 7/12 | Place vector zero at offset 304. |
| 299 | `00000000` | `00` | padding: IDT alignment, byte 8/12 | Place vector zero at offset 304. |
| 300 | `00000000` | `00` | padding: IDT alignment, byte 9/12 | Place vector zero at offset 304. |
| 301 | `00000000` | `00` | padding: IDT alignment, byte 10/12 | Place vector zero at offset 304. |
| 302 | `00000000` | `00` | padding: IDT alignment, byte 11/12 | Place vector zero at offset 304. |
| 303 | `00000000` | `00` | padding: IDT alignment, byte 12/12 | Place vector zero at offset 304. |
| 304 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 1/16 | Null gates outside this timer probe. |
| 305 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 2/16 | Null gates outside this timer probe. |
| 306 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 3/16 | Null gates outside this timer probe. |
| 307 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 4/16 | Null gates outside this timer probe. |
| 308 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 5/16 | Null gates outside this timer probe. |
| 309 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 6/16 | Null gates outside this timer probe. |
| 310 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 7/16 | Null gates outside this timer probe. |
| 311 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 8/16 | Null gates outside this timer probe. |
| 312 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 9/16 | Null gates outside this timer probe. |
| 313 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 10/16 | Null gates outside this timer probe. |
| 314 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 11/16 | Null gates outside this timer probe. |
| 315 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 12/16 | Null gates outside this timer probe. |
| 316 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 13/16 | Null gates outside this timer probe. |
| 317 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 14/16 | Null gates outside this timer probe. |
| 318 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 15/16 | Null gates outside this timer probe. |
| 319 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 16/16 | Null gates outside this timer probe. |
| 320 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 1/16 | Null gates outside this timer probe. |
| 321 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 2/16 | Null gates outside this timer probe. |
| 322 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 3/16 | Null gates outside this timer probe. |
| 323 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 4/16 | Null gates outside this timer probe. |
| 324 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 5/16 | Null gates outside this timer probe. |
| 325 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 6/16 | Null gates outside this timer probe. |
| 326 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 7/16 | Null gates outside this timer probe. |
| 327 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 8/16 | Null gates outside this timer probe. |
| 328 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 9/16 | Null gates outside this timer probe. |
| 329 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 10/16 | Null gates outside this timer probe. |
| 330 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 11/16 | Null gates outside this timer probe. |
| 331 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 12/16 | Null gates outside this timer probe. |
| 332 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 13/16 | Null gates outside this timer probe. |
| 333 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 14/16 | Null gates outside this timer probe. |
| 334 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 15/16 | Null gates outside this timer probe. |
| 335 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 16/16 | Null gates outside this timer probe. |
| 336 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 1/16 | Null gates outside this timer probe. |
| 337 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 2/16 | Null gates outside this timer probe. |
| 338 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 3/16 | Null gates outside this timer probe. |
| 339 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 4/16 | Null gates outside this timer probe. |
| 340 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 5/16 | Null gates outside this timer probe. |
| 341 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 6/16 | Null gates outside this timer probe. |
| 342 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 7/16 | Null gates outside this timer probe. |
| 343 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 8/16 | Null gates outside this timer probe. |
| 344 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 9/16 | Null gates outside this timer probe. |
| 345 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 10/16 | Null gates outside this timer probe. |
| 346 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 11/16 | Null gates outside this timer probe. |
| 347 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 12/16 | Null gates outside this timer probe. |
| 348 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 13/16 | Null gates outside this timer probe. |
| 349 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 14/16 | Null gates outside this timer probe. |
| 350 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 15/16 | Null gates outside this timer probe. |
| 351 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 16/16 | Null gates outside this timer probe. |
| 352 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 1/16 | Null gates outside this timer probe. |
| 353 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 2/16 | Null gates outside this timer probe. |
| 354 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 3/16 | Null gates outside this timer probe. |
| 355 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 4/16 | Null gates outside this timer probe. |
| 356 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 5/16 | Null gates outside this timer probe. |
| 357 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 6/16 | Null gates outside this timer probe. |
| 358 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 7/16 | Null gates outside this timer probe. |
| 359 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 8/16 | Null gates outside this timer probe. |
| 360 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 9/16 | Null gates outside this timer probe. |
| 361 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 10/16 | Null gates outside this timer probe. |
| 362 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 11/16 | Null gates outside this timer probe. |
| 363 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 12/16 | Null gates outside this timer probe. |
| 364 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 13/16 | Null gates outside this timer probe. |
| 365 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 14/16 | Null gates outside this timer probe. |
| 366 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 15/16 | Null gates outside this timer probe. |
| 367 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 16/16 | Null gates outside this timer probe. |
| 368 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 1/16 | Null gates outside this timer probe. |
| 369 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 2/16 | Null gates outside this timer probe. |
| 370 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 3/16 | Null gates outside this timer probe. |
| 371 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 4/16 | Null gates outside this timer probe. |
| 372 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 5/16 | Null gates outside this timer probe. |
| 373 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 6/16 | Null gates outside this timer probe. |
| 374 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 7/16 | Null gates outside this timer probe. |
| 375 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 8/16 | Null gates outside this timer probe. |
| 376 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 9/16 | Null gates outside this timer probe. |
| 377 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 10/16 | Null gates outside this timer probe. |
| 378 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 11/16 | Null gates outside this timer probe. |
| 379 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 12/16 | Null gates outside this timer probe. |
| 380 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 13/16 | Null gates outside this timer probe. |
| 381 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 14/16 | Null gates outside this timer probe. |
| 382 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 15/16 | Null gates outside this timer probe. |
| 383 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 16/16 | Null gates outside this timer probe. |
| 384 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 1/16 | Null gates outside this timer probe. |
| 385 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 2/16 | Null gates outside this timer probe. |
| 386 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 3/16 | Null gates outside this timer probe. |
| 387 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 4/16 | Null gates outside this timer probe. |
| 388 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 5/16 | Null gates outside this timer probe. |
| 389 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 6/16 | Null gates outside this timer probe. |
| 390 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 7/16 | Null gates outside this timer probe. |
| 391 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 8/16 | Null gates outside this timer probe. |
| 392 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 9/16 | Null gates outside this timer probe. |
| 393 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 10/16 | Null gates outside this timer probe. |
| 394 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 11/16 | Null gates outside this timer probe. |
| 395 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 12/16 | Null gates outside this timer probe. |
| 396 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 13/16 | Null gates outside this timer probe. |
| 397 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 14/16 | Null gates outside this timer probe. |
| 398 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 15/16 | Null gates outside this timer probe. |
| 399 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 16/16 | Null gates outside this timer probe. |
| 400 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 1/16 | Null gates outside this timer probe. |
| 401 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 2/16 | Null gates outside this timer probe. |
| 402 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 3/16 | Null gates outside this timer probe. |
| 403 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 4/16 | Null gates outside this timer probe. |
| 404 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 5/16 | Null gates outside this timer probe. |
| 405 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 6/16 | Null gates outside this timer probe. |
| 406 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 7/16 | Null gates outside this timer probe. |
| 407 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 8/16 | Null gates outside this timer probe. |
| 408 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 9/16 | Null gates outside this timer probe. |
| 409 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 10/16 | Null gates outside this timer probe. |
| 410 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 11/16 | Null gates outside this timer probe. |
| 411 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 12/16 | Null gates outside this timer probe. |
| 412 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 13/16 | Null gates outside this timer probe. |
| 413 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 14/16 | Null gates outside this timer probe. |
| 414 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 15/16 | Null gates outside this timer probe. |
| 415 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 16/16 | Null gates outside this timer probe. |
| 416 | `00000000` | `00` | data: IDT vectors 0E and 0F, byte 1/16 | Null gates outside this timer probe. |
| 417 | `00000000` | `00` | data: IDT vectors 0E and 0F, byte 2/16 | Null gates outside this timer probe. |
| 418 | `00000000` | `00` | data: IDT vectors 0E and 0F, byte 3/16 | Null gates outside this timer probe. |
| 419 | `00000000` | `00` | data: IDT vectors 0E and 0F, byte 4/16 | Null gates outside this timer probe. |
| 420 | `00000000` | `00` | data: IDT vectors 0E and 0F, byte 5/16 | Null gates outside this timer probe. |
| 421 | `00000000` | `00` | data: IDT vectors 0E and 0F, byte 6/16 | Null gates outside this timer probe. |
| 422 | `00000000` | `00` | data: IDT vectors 0E and 0F, byte 7/16 | Null gates outside this timer probe. |
| 423 | `00000000` | `00` | data: IDT vectors 0E and 0F, byte 8/16 | Null gates outside this timer probe. |
| 424 | `00000000` | `00` | data: IDT vectors 0E and 0F, byte 9/16 | Null gates outside this timer probe. |
| 425 | `00000000` | `00` | data: IDT vectors 0E and 0F, byte 10/16 | Null gates outside this timer probe. |
| 426 | `00000000` | `00` | data: IDT vectors 0E and 0F, byte 11/16 | Null gates outside this timer probe. |
| 427 | `00000000` | `00` | data: IDT vectors 0E and 0F, byte 12/16 | Null gates outside this timer probe. |
| 428 | `00000000` | `00` | data: IDT vectors 0E and 0F, byte 13/16 | Null gates outside this timer probe. |
| 429 | `00000000` | `00` | data: IDT vectors 0E and 0F, byte 14/16 | Null gates outside this timer probe. |
| 430 | `00000000` | `00` | data: IDT vectors 0E and 0F, byte 15/16 | Null gates outside this timer probe. |
| 431 | `00000000` | `00` | data: IDT vectors 0E and 0F, byte 16/16 | Null gates outside this timer probe. |
| 432 | `00000000` | `00` | data: IDT vectors 10 and 11, byte 1/16 | Null gates outside this timer probe. |
| 433 | `00000000` | `00` | data: IDT vectors 10 and 11, byte 2/16 | Null gates outside this timer probe. |
| 434 | `00000000` | `00` | data: IDT vectors 10 and 11, byte 3/16 | Null gates outside this timer probe. |
| 435 | `00000000` | `00` | data: IDT vectors 10 and 11, byte 4/16 | Null gates outside this timer probe. |
| 436 | `00000000` | `00` | data: IDT vectors 10 and 11, byte 5/16 | Null gates outside this timer probe. |
| 437 | `00000000` | `00` | data: IDT vectors 10 and 11, byte 6/16 | Null gates outside this timer probe. |
| 438 | `00000000` | `00` | data: IDT vectors 10 and 11, byte 7/16 | Null gates outside this timer probe. |
| 439 | `00000000` | `00` | data: IDT vectors 10 and 11, byte 8/16 | Null gates outside this timer probe. |
| 440 | `00000000` | `00` | data: IDT vectors 10 and 11, byte 9/16 | Null gates outside this timer probe. |
| 441 | `00000000` | `00` | data: IDT vectors 10 and 11, byte 10/16 | Null gates outside this timer probe. |
| 442 | `00000000` | `00` | data: IDT vectors 10 and 11, byte 11/16 | Null gates outside this timer probe. |
| 443 | `00000000` | `00` | data: IDT vectors 10 and 11, byte 12/16 | Null gates outside this timer probe. |
| 444 | `00000000` | `00` | data: IDT vectors 10 and 11, byte 13/16 | Null gates outside this timer probe. |
| 445 | `00000000` | `00` | data: IDT vectors 10 and 11, byte 14/16 | Null gates outside this timer probe. |
| 446 | `00000000` | `00` | data: IDT vectors 10 and 11, byte 15/16 | Null gates outside this timer probe. |
| 447 | `00000000` | `00` | data: IDT vectors 10 and 11, byte 16/16 | Null gates outside this timer probe. |
| 448 | `00000000` | `00` | data: IDT vectors 12 and 13, byte 1/16 | Null gates outside this timer probe. |
| 449 | `00000000` | `00` | data: IDT vectors 12 and 13, byte 2/16 | Null gates outside this timer probe. |
| 450 | `00000000` | `00` | data: IDT vectors 12 and 13, byte 3/16 | Null gates outside this timer probe. |
| 451 | `00000000` | `00` | data: IDT vectors 12 and 13, byte 4/16 | Null gates outside this timer probe. |
| 452 | `00000000` | `00` | data: IDT vectors 12 and 13, byte 5/16 | Null gates outside this timer probe. |
| 453 | `00000000` | `00` | data: IDT vectors 12 and 13, byte 6/16 | Null gates outside this timer probe. |
| 454 | `00000000` | `00` | data: IDT vectors 12 and 13, byte 7/16 | Null gates outside this timer probe. |
| 455 | `00000000` | `00` | data: IDT vectors 12 and 13, byte 8/16 | Null gates outside this timer probe. |
| 456 | `00000000` | `00` | data: IDT vectors 12 and 13, byte 9/16 | Null gates outside this timer probe. |
| 457 | `00000000` | `00` | data: IDT vectors 12 and 13, byte 10/16 | Null gates outside this timer probe. |
| 458 | `00000000` | `00` | data: IDT vectors 12 and 13, byte 11/16 | Null gates outside this timer probe. |
| 459 | `00000000` | `00` | data: IDT vectors 12 and 13, byte 12/16 | Null gates outside this timer probe. |
| 460 | `00000000` | `00` | data: IDT vectors 12 and 13, byte 13/16 | Null gates outside this timer probe. |
| 461 | `00000000` | `00` | data: IDT vectors 12 and 13, byte 14/16 | Null gates outside this timer probe. |
| 462 | `00000000` | `00` | data: IDT vectors 12 and 13, byte 15/16 | Null gates outside this timer probe. |
| 463 | `00000000` | `00` | data: IDT vectors 12 and 13, byte 16/16 | Null gates outside this timer probe. |
| 464 | `00000000` | `00` | data: IDT vectors 14 and 15, byte 1/16 | Null gates outside this timer probe. |
| 465 | `00000000` | `00` | data: IDT vectors 14 and 15, byte 2/16 | Null gates outside this timer probe. |
| 466 | `00000000` | `00` | data: IDT vectors 14 and 15, byte 3/16 | Null gates outside this timer probe. |
| 467 | `00000000` | `00` | data: IDT vectors 14 and 15, byte 4/16 | Null gates outside this timer probe. |
| 468 | `00000000` | `00` | data: IDT vectors 14 and 15, byte 5/16 | Null gates outside this timer probe. |
| 469 | `00000000` | `00` | data: IDT vectors 14 and 15, byte 6/16 | Null gates outside this timer probe. |
| 470 | `00000000` | `00` | data: IDT vectors 14 and 15, byte 7/16 | Null gates outside this timer probe. |
| 471 | `00000000` | `00` | data: IDT vectors 14 and 15, byte 8/16 | Null gates outside this timer probe. |
| 472 | `00000000` | `00` | data: IDT vectors 14 and 15, byte 9/16 | Null gates outside this timer probe. |
| 473 | `00000000` | `00` | data: IDT vectors 14 and 15, byte 10/16 | Null gates outside this timer probe. |
| 474 | `00000000` | `00` | data: IDT vectors 14 and 15, byte 11/16 | Null gates outside this timer probe. |
| 475 | `00000000` | `00` | data: IDT vectors 14 and 15, byte 12/16 | Null gates outside this timer probe. |
| 476 | `00000000` | `00` | data: IDT vectors 14 and 15, byte 13/16 | Null gates outside this timer probe. |
| 477 | `00000000` | `00` | data: IDT vectors 14 and 15, byte 14/16 | Null gates outside this timer probe. |
| 478 | `00000000` | `00` | data: IDT vectors 14 and 15, byte 15/16 | Null gates outside this timer probe. |
| 479 | `00000000` | `00` | data: IDT vectors 14 and 15, byte 16/16 | Null gates outside this timer probe. |
| 480 | `00000000` | `00` | data: IDT vectors 16 and 17, byte 1/16 | Null gates outside this timer probe. |
| 481 | `00000000` | `00` | data: IDT vectors 16 and 17, byte 2/16 | Null gates outside this timer probe. |
| 482 | `00000000` | `00` | data: IDT vectors 16 and 17, byte 3/16 | Null gates outside this timer probe. |
| 483 | `00000000` | `00` | data: IDT vectors 16 and 17, byte 4/16 | Null gates outside this timer probe. |
| 484 | `00000000` | `00` | data: IDT vectors 16 and 17, byte 5/16 | Null gates outside this timer probe. |
| 485 | `00000000` | `00` | data: IDT vectors 16 and 17, byte 6/16 | Null gates outside this timer probe. |
| 486 | `00000000` | `00` | data: IDT vectors 16 and 17, byte 7/16 | Null gates outside this timer probe. |
| 487 | `00000000` | `00` | data: IDT vectors 16 and 17, byte 8/16 | Null gates outside this timer probe. |
| 488 | `00000000` | `00` | data: IDT vectors 16 and 17, byte 9/16 | Null gates outside this timer probe. |
| 489 | `00000000` | `00` | data: IDT vectors 16 and 17, byte 10/16 | Null gates outside this timer probe. |
| 490 | `00000000` | `00` | data: IDT vectors 16 and 17, byte 11/16 | Null gates outside this timer probe. |
| 491 | `00000000` | `00` | data: IDT vectors 16 and 17, byte 12/16 | Null gates outside this timer probe. |
| 492 | `00000000` | `00` | data: IDT vectors 16 and 17, byte 13/16 | Null gates outside this timer probe. |
| 493 | `00000000` | `00` | data: IDT vectors 16 and 17, byte 14/16 | Null gates outside this timer probe. |
| 494 | `00000000` | `00` | data: IDT vectors 16 and 17, byte 15/16 | Null gates outside this timer probe. |
| 495 | `00000000` | `00` | data: IDT vectors 16 and 17, byte 16/16 | Null gates outside this timer probe. |
| 496 | `00000000` | `00` | data: IDT vectors 18 and 19, byte 1/16 | Null gates outside this timer probe. |
| 497 | `00000000` | `00` | data: IDT vectors 18 and 19, byte 2/16 | Null gates outside this timer probe. |
| 498 | `00000000` | `00` | data: IDT vectors 18 and 19, byte 3/16 | Null gates outside this timer probe. |
| 499 | `00000000` | `00` | data: IDT vectors 18 and 19, byte 4/16 | Null gates outside this timer probe. |
| 500 | `00000000` | `00` | data: IDT vectors 18 and 19, byte 5/16 | Null gates outside this timer probe. |
| 501 | `00000000` | `00` | data: IDT vectors 18 and 19, byte 6/16 | Null gates outside this timer probe. |
| 502 | `00000000` | `00` | data: IDT vectors 18 and 19, byte 7/16 | Null gates outside this timer probe. |
| 503 | `00000000` | `00` | data: IDT vectors 18 and 19, byte 8/16 | Null gates outside this timer probe. |
| 504 | `00000000` | `00` | data: IDT vectors 18 and 19, byte 9/16 | Null gates outside this timer probe. |
| 505 | `00000000` | `00` | data: IDT vectors 18 and 19, byte 10/16 | Null gates outside this timer probe. |
| 506 | `00000000` | `00` | data: IDT vectors 18 and 19, byte 11/16 | Null gates outside this timer probe. |
| 507 | `00000000` | `00` | data: IDT vectors 18 and 19, byte 12/16 | Null gates outside this timer probe. |
| 508 | `00000000` | `00` | data: IDT vectors 18 and 19, byte 13/16 | Null gates outside this timer probe. |
| 509 | `00000000` | `00` | data: IDT vectors 18 and 19, byte 14/16 | Null gates outside this timer probe. |
| 510 | `00000000` | `00` | data: IDT vectors 18 and 19, byte 15/16 | Null gates outside this timer probe. |
| 511 | `00000000` | `00` | data: IDT vectors 18 and 19, byte 16/16 | Null gates outside this timer probe. |
| 512 | `00000000` | `00` | data: IDT vectors 1A and 1B, byte 1/16 | Null gates outside this timer probe. |
| 513 | `00000000` | `00` | data: IDT vectors 1A and 1B, byte 2/16 | Null gates outside this timer probe. |
| 514 | `00000000` | `00` | data: IDT vectors 1A and 1B, byte 3/16 | Null gates outside this timer probe. |
| 515 | `00000000` | `00` | data: IDT vectors 1A and 1B, byte 4/16 | Null gates outside this timer probe. |
| 516 | `00000000` | `00` | data: IDT vectors 1A and 1B, byte 5/16 | Null gates outside this timer probe. |
| 517 | `00000000` | `00` | data: IDT vectors 1A and 1B, byte 6/16 | Null gates outside this timer probe. |
| 518 | `00000000` | `00` | data: IDT vectors 1A and 1B, byte 7/16 | Null gates outside this timer probe. |
| 519 | `00000000` | `00` | data: IDT vectors 1A and 1B, byte 8/16 | Null gates outside this timer probe. |
| 520 | `00000000` | `00` | data: IDT vectors 1A and 1B, byte 9/16 | Null gates outside this timer probe. |
| 521 | `00000000` | `00` | data: IDT vectors 1A and 1B, byte 10/16 | Null gates outside this timer probe. |
| 522 | `00000000` | `00` | data: IDT vectors 1A and 1B, byte 11/16 | Null gates outside this timer probe. |
| 523 | `00000000` | `00` | data: IDT vectors 1A and 1B, byte 12/16 | Null gates outside this timer probe. |
| 524 | `00000000` | `00` | data: IDT vectors 1A and 1B, byte 13/16 | Null gates outside this timer probe. |
| 525 | `00000000` | `00` | data: IDT vectors 1A and 1B, byte 14/16 | Null gates outside this timer probe. |
| 526 | `00000000` | `00` | data: IDT vectors 1A and 1B, byte 15/16 | Null gates outside this timer probe. |
| 527 | `00000000` | `00` | data: IDT vectors 1A and 1B, byte 16/16 | Null gates outside this timer probe. |
| 528 | `00000000` | `00` | data: IDT vectors 1C and 1D, byte 1/16 | Null gates outside this timer probe. |
| 529 | `00000000` | `00` | data: IDT vectors 1C and 1D, byte 2/16 | Null gates outside this timer probe. |
| 530 | `00000000` | `00` | data: IDT vectors 1C and 1D, byte 3/16 | Null gates outside this timer probe. |
| 531 | `00000000` | `00` | data: IDT vectors 1C and 1D, byte 4/16 | Null gates outside this timer probe. |
| 532 | `00000000` | `00` | data: IDT vectors 1C and 1D, byte 5/16 | Null gates outside this timer probe. |
| 533 | `00000000` | `00` | data: IDT vectors 1C and 1D, byte 6/16 | Null gates outside this timer probe. |
| 534 | `00000000` | `00` | data: IDT vectors 1C and 1D, byte 7/16 | Null gates outside this timer probe. |
| 535 | `00000000` | `00` | data: IDT vectors 1C and 1D, byte 8/16 | Null gates outside this timer probe. |
| 536 | `00000000` | `00` | data: IDT vectors 1C and 1D, byte 9/16 | Null gates outside this timer probe. |
| 537 | `00000000` | `00` | data: IDT vectors 1C and 1D, byte 10/16 | Null gates outside this timer probe. |
| 538 | `00000000` | `00` | data: IDT vectors 1C and 1D, byte 11/16 | Null gates outside this timer probe. |
| 539 | `00000000` | `00` | data: IDT vectors 1C and 1D, byte 12/16 | Null gates outside this timer probe. |
| 540 | `00000000` | `00` | data: IDT vectors 1C and 1D, byte 13/16 | Null gates outside this timer probe. |
| 541 | `00000000` | `00` | data: IDT vectors 1C and 1D, byte 14/16 | Null gates outside this timer probe. |
| 542 | `00000000` | `00` | data: IDT vectors 1C and 1D, byte 15/16 | Null gates outside this timer probe. |
| 543 | `00000000` | `00` | data: IDT vectors 1C and 1D, byte 16/16 | Null gates outside this timer probe. |
| 544 | `00000000` | `00` | data: IDT vectors 1E and 1F, byte 1/16 | Null gates outside this timer probe. |
| 545 | `00000000` | `00` | data: IDT vectors 1E and 1F, byte 2/16 | Null gates outside this timer probe. |
| 546 | `00000000` | `00` | data: IDT vectors 1E and 1F, byte 3/16 | Null gates outside this timer probe. |
| 547 | `00000000` | `00` | data: IDT vectors 1E and 1F, byte 4/16 | Null gates outside this timer probe. |
| 548 | `00000000` | `00` | data: IDT vectors 1E and 1F, byte 5/16 | Null gates outside this timer probe. |
| 549 | `00000000` | `00` | data: IDT vectors 1E and 1F, byte 6/16 | Null gates outside this timer probe. |
| 550 | `00000000` | `00` | data: IDT vectors 1E and 1F, byte 7/16 | Null gates outside this timer probe. |
| 551 | `00000000` | `00` | data: IDT vectors 1E and 1F, byte 8/16 | Null gates outside this timer probe. |
| 552 | `00000000` | `00` | data: IDT vectors 1E and 1F, byte 9/16 | Null gates outside this timer probe. |
| 553 | `00000000` | `00` | data: IDT vectors 1E and 1F, byte 10/16 | Null gates outside this timer probe. |
| 554 | `00000000` | `00` | data: IDT vectors 1E and 1F, byte 11/16 | Null gates outside this timer probe. |
| 555 | `00000000` | `00` | data: IDT vectors 1E and 1F, byte 12/16 | Null gates outside this timer probe. |
| 556 | `00000000` | `00` | data: IDT vectors 1E and 1F, byte 13/16 | Null gates outside this timer probe. |
| 557 | `00000000` | `00` | data: IDT vectors 1E and 1F, byte 14/16 | Null gates outside this timer probe. |
| 558 | `00000000` | `00` | data: IDT vectors 1E and 1F, byte 15/16 | Null gates outside this timer probe. |
| 559 | `00000000` | `00` | data: IDT vectors 1E and 1F, byte 16/16 | Null gates outside this timer probe. |
| 560 | `11000000` | `C0` | data: IDT vector 20, byte 1/8 | Present DPL0 interrupt gate, selector 0008, entry 00007EC0; external IRQ0 supplies this vector. |
| 561 | `01111110` | `7E` | data: IDT vector 20, byte 2/8 | Present DPL0 interrupt gate, selector 0008, entry 00007EC0; external IRQ0 supplies this vector. |
| 562 | `00001000` | `08` | data: IDT vector 20, byte 3/8 | Present DPL0 interrupt gate, selector 0008, entry 00007EC0; external IRQ0 supplies this vector. |
| 563 | `00000000` | `00` | data: IDT vector 20, byte 4/8 | Present DPL0 interrupt gate, selector 0008, entry 00007EC0; external IRQ0 supplies this vector. |
| 564 | `00000000` | `00` | data: IDT vector 20, byte 5/8 | Present DPL0 interrupt gate, selector 0008, entry 00007EC0; external IRQ0 supplies this vector. |
| 565 | `10001110` | `8E` | data: IDT vector 20, byte 6/8 | Present DPL0 interrupt gate, selector 0008, entry 00007EC0; external IRQ0 supplies this vector. |
| 566 | `00000000` | `00` | data: IDT vector 20, byte 7/8 | Present DPL0 interrupt gate, selector 0008, entry 00007EC0; external IRQ0 supplies this vector. |
| 567 | `00000000` | `00` | data: IDT vector 20, byte 8/8 | Present DPL0 interrupt gate, selector 0008, entry 00007EC0; external IRQ0 supplies this vector. |
