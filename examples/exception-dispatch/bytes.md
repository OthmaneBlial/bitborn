# Every byte explained

Generated from canonical `.bits` annotations by `python3 tools/byte_tables.py`.

Instruction names below are disassembly for explanation, never code-generation input.

| Offset | Binary | Hex | Range / byte within it | Encoding explanation |
| --- | --- | --- | --- | --- |
| 0 | `11111010` | `FA` | instruction: CLI, byte 1/1 | Keep external maskable interrupts disabled. |
| 1 | `11101010` | `EA` | instruction: JMP 0000:7E06, byte 1/5 | Normalize real-mode CS. |
| 2 | `00000110` | `06` | instruction: JMP 0000:7E06, byte 2/5 | Normalize real-mode CS. |
| 3 | `01111110` | `7E` | instruction: JMP 0000:7E06, byte 3/5 | Normalize real-mode CS. |
| 4 | `00000000` | `00` | instruction: JMP 0000:7E06, byte 4/5 | Normalize real-mode CS. |
| 5 | `00000000` | `00` | instruction: JMP 0000:7E06, byte 5/5 | Normalize real-mode CS. |
| 6 | `00110001` | `31` | instruction: XOR AX,AX, byte 1/2 | Prepare zero segment selectors. |
| 7 | `11000000` | `C0` | instruction: XOR AX,AX, byte 2/2 | Prepare zero segment selectors. |
| 8 | `10001110` | `8E` | instruction: MOV DS,AX, byte 1/2 | Address literal pointers through segment zero. |
| 9 | `11011000` | `D8` | instruction: MOV DS,AX, byte 2/2 | Address literal pointers through segment zero. |
| 10 | `10001110` | `8E` | instruction: MOV SS,AX, byte 1/2 | Establish the real-mode stack segment. |
| 11 | `11010000` | `D0` | instruction: MOV SS,AX, byte 2/2 | Establish the real-mode stack segment. |
| 12 | `10111100` | `BC` | instruction: MOV SP,7C00, byte 1/3 | Establish the real-mode stack pointer. |
| 13 | `00000000` | `00` | instruction: MOV SP,7C00, byte 2/3 | Establish the real-mode stack pointer. |
| 14 | `01111100` | `7C` | instruction: MOV SP,7C00, byte 3/3 | Establish the real-mode stack pointer. |
| 15 | `11111100` | `FC` | instruction: CLD, byte 1/1 | Initialize the log forwards before the deliberate DF test. |
| 16 | `00001111` | `0F` | instruction: LGDT [8018], byte 1/5 | Load the GDT pointer at source offset 536. |
| 17 | `00000001` | `01` | instruction: LGDT [8018], byte 2/5 | Load the GDT pointer at source offset 536. |
| 18 | `00010110` | `16` | instruction: LGDT [8018], byte 3/5 | Load the GDT pointer at source offset 536. |
| 19 | `00011000` | `18` | instruction: LGDT [8018], byte 4/5 | Load the GDT pointer at source offset 536. |
| 20 | `10000000` | `80` | instruction: LGDT [8018], byte 5/5 | Load the GDT pointer at source offset 536. |
| 21 | `00001111` | `0F` | instruction: MOV EAX,CR0, byte 1/3 | Preserve existing control bits. |
| 22 | `00100000` | `20` | instruction: MOV EAX,CR0, byte 2/3 | Preserve existing control bits. |
| 23 | `11000000` | `C0` | instruction: MOV EAX,CR0, byte 3/3 | Preserve existing control bits. |
| 24 | `01100110` | `66` | instruction: OR EAX,1, byte 1/4 | Enable protection with a 32-bit operand. |
| 25 | `10000011` | `83` | instruction: OR EAX,1, byte 2/4 | Enable protection with a 32-bit operand. |
| 26 | `11001000` | `C8` | instruction: OR EAX,1, byte 3/4 | Enable protection with a 32-bit operand. |
| 27 | `00000001` | `01` | instruction: OR EAX,1, byte 4/4 | Enable protection with a 32-bit operand. |
| 28 | `00001111` | `0F` | instruction: MOV CR0,EAX, byte 1/3 | Enable PE while leaving paging off. |
| 29 | `00100010` | `22` | instruction: MOV CR0,EAX, byte 2/3 | Enable PE while leaving paging off. |
| 30 | `11000000` | `C0` | instruction: MOV CR0,EAX, byte 3/3 | Enable PE while leaving paging off. |
| 31 | `01100110` | `66` | instruction: JMP 0008:00007E28, byte 1/8 | Enter flat 32-bit code at source offset 40. |
| 32 | `11101010` | `EA` | instruction: JMP 0008:00007E28, byte 2/8 | Enter flat 32-bit code at source offset 40. |
| 33 | `00101000` | `28` | instruction: JMP 0008:00007E28, byte 3/8 | Enter flat 32-bit code at source offset 40. |
| 34 | `01111110` | `7E` | instruction: JMP 0008:00007E28, byte 4/8 | Enter flat 32-bit code at source offset 40. |
| 35 | `00000000` | `00` | instruction: JMP 0008:00007E28, byte 5/8 | Enter flat 32-bit code at source offset 40. |
| 36 | `00000000` | `00` | instruction: JMP 0008:00007E28, byte 6/8 | Enter flat 32-bit code at source offset 40. |
| 37 | `00001000` | `08` | instruction: JMP 0008:00007E28, byte 7/8 | Enter flat 32-bit code at source offset 40. |
| 38 | `00000000` | `00` | instruction: JMP 0008:00007E28, byte 8/8 | Enter flat 32-bit code at source offset 40. |
| 39 | `00000000` | `00` | padding: ALIGN, byte 1/1 | Fill the byte before the protected entry. |
| 40 | `10111000` | `B8` | instruction: MOV EAX,10, byte 1/5 | Select flat writable data. |
| 41 | `00010000` | `10` | instruction: MOV EAX,10, byte 2/5 | Select flat writable data. |
| 42 | `00000000` | `00` | instruction: MOV EAX,10, byte 3/5 | Select flat writable data. |
| 43 | `00000000` | `00` | instruction: MOV EAX,10, byte 4/5 | Select flat writable data. |
| 44 | `00000000` | `00` | instruction: MOV EAX,10, byte 5/5 | Select flat writable data. |
| 45 | `10001110` | `8E` | instruction: MOV DS,AX, byte 1/2 | Reload DS from the protected descriptor. |
| 46 | `11011000` | `D8` | instruction: MOV DS,AX, byte 2/2 | Reload DS from the protected descriptor. |
| 47 | `10001110` | `8E` | instruction: MOV ES,AX, byte 1/2 | Reload ES for log initialization. |
| 48 | `11000000` | `C0` | instruction: MOV ES,AX, byte 2/2 | Reload ES for log initialization. |
| 49 | `10001110` | `8E` | instruction: MOV FS,AX, byte 1/2 | Give FS the same flat descriptor. |
| 50 | `11100000` | `E0` | instruction: MOV FS,AX, byte 2/2 | Give FS the same flat descriptor. |
| 51 | `10001110` | `8E` | instruction: MOV GS,AX, byte 1/2 | Give GS the same flat descriptor. |
| 52 | `11101000` | `E8` | instruction: MOV GS,AX, byte 2/2 | Give GS the same flat descriptor. |
| 53 | `10001110` | `8E` | instruction: MOV SS,AX, byte 1/2 | Use a flat 32-bit stack. |
| 54 | `11010000` | `D0` | instruction: MOV SS,AX, byte 2/2 | Use a flat 32-bit stack. |
| 55 | `10111100` | `BC` | instruction: MOV ESP,9000, byte 1/5 | Establish the protected stack. |
| 56 | `00000000` | `00` | instruction: MOV ESP,9000, byte 2/5 | Establish the protected stack. |
| 57 | `10010000` | `90` | instruction: MOV ESP,9000, byte 3/5 | Establish the protected stack. |
| 58 | `00000000` | `00` | instruction: MOV ESP,9000, byte 4/5 | Establish the protected stack. |
| 59 | `00000000` | `00` | instruction: MOV ESP,9000, byte 5/5 | Establish the protected stack. |
| 60 | `00001111` | `0F` | instruction: LIDT [801E], byte 1/7 | Load twenty legacy vector slots at physical 8040. |
| 61 | `00000001` | `01` | instruction: LIDT [801E], byte 2/7 | Load twenty legacy vector slots at physical 8040. |
| 62 | `00011101` | `1D` | instruction: LIDT [801E], byte 3/7 | Load twenty legacy vector slots at physical 8040. |
| 63 | `00011110` | `1E` | instruction: LIDT [801E], byte 4/7 | Load twenty legacy vector slots at physical 8040. |
| 64 | `10000000` | `80` | instruction: LIDT [801E], byte 5/7 | Load twenty legacy vector slots at physical 8040. |
| 65 | `00000000` | `00` | instruction: LIDT [801E], byte 6/7 | Load twenty legacy vector slots at physical 8040. |
| 66 | `00000000` | `00` | instruction: LIDT [801E], byte 7/7 | Load twenty legacy vector slots at physical 8040. |
| 67 | `00110001` | `31` | instruction: XOR EAX,EAX, byte 1/2 | Prepare zeroed log and counters. |
| 68 | `11000000` | `C0` | instruction: XOR EAX,EAX, byte 2/2 | Prepare zeroed log and counters. |
| 69 | `10111111` | `BF` | instruction: MOV EDI,6000, byte 1/5 | Begin the bounded log region. |
| 70 | `00000000` | `00` | instruction: MOV EDI,6000, byte 2/5 | Begin the bounded log region. |
| 71 | `01100000` | `60` | instruction: MOV EDI,6000, byte 3/5 | Begin the bounded log region. |
| 72 | `00000000` | `00` | instruction: MOV EDI,6000, byte 4/5 | Begin the bounded log region. |
| 73 | `00000000` | `00` | instruction: MOV EDI,6000, byte 5/5 | Begin the bounded log region. |
| 74 | `10111001` | `B9` | instruction: MOV ECX,36, byte 1/5 | Clear 144 bytes including counters and spare slots. |
| 75 | `00100100` | `24` | instruction: MOV ECX,36, byte 2/5 | Clear 144 bytes including counters and spare slots. |
| 76 | `00000000` | `00` | instruction: MOV ECX,36, byte 3/5 | Clear 144 bytes including counters and spare slots. |
| 77 | `00000000` | `00` | instruction: MOV ECX,36, byte 4/5 | Clear 144 bytes including counters and spare slots. |
| 78 | `00000000` | `00` | instruction: MOV ECX,36, byte 5/5 | Clear 144 bytes including counters and spare slots. |
| 79 | `11110011` | `F3` | instruction: REP STOSD, byte 1/2 | Initialize log RAM as data, not instructions. |
| 80 | `10101011` | `AB` | instruction: REP STOSD, byte 2/2 | Initialize log RAM as data, not instructions. |
| 81 | `11000110` | `C6` | instruction: MOV byte [6070],A5, byte 1/7 | Guard the end of four 28-byte records. |
| 82 | `00000101` | `05` | instruction: MOV byte [6070],A5, byte 2/7 | Guard the end of four 28-byte records. |
| 83 | `01110000` | `70` | instruction: MOV byte [6070],A5, byte 3/7 | Guard the end of four 28-byte records. |
| 84 | `01100000` | `60` | instruction: MOV byte [6070],A5, byte 4/7 | Guard the end of four 28-byte records. |
| 85 | `00000000` | `00` | instruction: MOV byte [6070],A5, byte 5/7 | Guard the end of four 28-byte records. |
| 86 | `00000000` | `00` | instruction: MOV byte [6070],A5, byte 6/7 | Guard the end of four 28-byte records. |
| 87 | `10100101` | `A5` | instruction: MOV byte [6070],A5, byte 7/7 | Guard the end of four 28-byte records. |
| 88 | `11000110` | `C6` | instruction: MOV byte [6074],5A, byte 1/7 | Keep a second log guard. |
| 89 | `00000101` | `05` | instruction: MOV byte [6074],5A, byte 2/7 | Keep a second log guard. |
| 90 | `01110100` | `74` | instruction: MOV byte [6074],5A, byte 3/7 | Keep a second log guard. |
| 91 | `01100000` | `60` | instruction: MOV byte [6074],5A, byte 4/7 | Keep a second log guard. |
| 92 | `00000000` | `00` | instruction: MOV byte [6074],5A, byte 5/7 | Keep a second log guard. |
| 93 | `00000000` | `00` | instruction: MOV byte [6074],5A, byte 6/7 | Keep a second log guard. |
| 94 | `01011010` | `5A` | instruction: MOV byte [6074],5A, byte 7/7 | Keep a second log guard. |
| 95 | `11000110` | `C6` | instruction: MOV byte [8FCB],A5, byte 1/7 | Guard below the deepest normalized PUSHAD frame. |
| 96 | `00000101` | `05` | instruction: MOV byte [8FCB],A5, byte 2/7 | Guard below the deepest normalized PUSHAD frame. |
| 97 | `11001011` | `CB` | instruction: MOV byte [8FCB],A5, byte 3/7 | Guard below the deepest normalized PUSHAD frame. |
| 98 | `10001111` | `8F` | instruction: MOV byte [8FCB],A5, byte 4/7 | Guard below the deepest normalized PUSHAD frame. |
| 99 | `00000000` | `00` | instruction: MOV byte [8FCB],A5, byte 5/7 | Guard below the deepest normalized PUSHAD frame. |
| 100 | `00000000` | `00` | instruction: MOV byte [8FCB],A5, byte 6/7 | Guard below the deepest normalized PUSHAD frame. |
| 101 | `10100101` | `A5` | instruction: MOV byte [8FCB],A5, byte 7/7 | Guard below the deepest normalized PUSHAD frame. |
| 102 | `11000110` | `C6` | instruction: MOV byte [9000],5A, byte 1/7 | Guard above the protected stack. |
| 103 | `00000101` | `05` | instruction: MOV byte [9000],5A, byte 2/7 | Guard above the protected stack. |
| 104 | `00000000` | `00` | instruction: MOV byte [9000],5A, byte 3/7 | Guard above the protected stack. |
| 105 | `10010000` | `90` | instruction: MOV byte [9000],5A, byte 4/7 | Guard above the protected stack. |
| 106 | `00000000` | `00` | instruction: MOV byte [9000],5A, byte 5/7 | Guard above the protected stack. |
| 107 | `00000000` | `00` | instruction: MOV byte [9000],5A, byte 6/7 | Guard above the protected stack. |
| 108 | `01011010` | `5A` | instruction: MOV byte [9000],5A, byte 7/7 | Guard above the protected stack. |
| 109 | `10111110` | `BE` | instruction: MOV ESI,11223344, byte 1/5 | Seed a register that the dispatcher must preserve. |
| 110 | `01000100` | `44` | instruction: MOV ESI,11223344, byte 2/5 | Seed a register that the dispatcher must preserve. |
| 111 | `00110011` | `33` | instruction: MOV ESI,11223344, byte 3/5 | Seed a register that the dispatcher must preserve. |
| 112 | `00100010` | `22` | instruction: MOV ESI,11223344, byte 4/5 | Seed a register that the dispatcher must preserve. |
| 113 | `00010001` | `11` | instruction: MOV ESI,11223344, byte 5/5 | Seed a register that the dispatcher must preserve. |
| 114 | `10111111` | `BF` | instruction: MOV EDI,55667788, byte 1/5 | Seed the caller's destination register. |
| 115 | `10001000` | `88` | instruction: MOV EDI,55667788, byte 2/5 | Seed the caller's destination register. |
| 116 | `01110111` | `77` | instruction: MOV EDI,55667788, byte 3/5 | Seed the caller's destination register. |
| 117 | `01100110` | `66` | instruction: MOV EDI,55667788, byte 4/5 | Seed the caller's destination register. |
| 118 | `01010101` | `55` | instruction: MOV EDI,55667788, byte 5/5 | Seed the caller's destination register. |
| 119 | `10111101` | `BD` | instruction: MOV EBP,99AABBCC, byte 1/5 | Seed the caller's frame register. |
| 120 | `11001100` | `CC` | instruction: MOV EBP,99AABBCC, byte 2/5 | Seed the caller's frame register. |
| 121 | `10111011` | `BB` | instruction: MOV EBP,99AABBCC, byte 3/5 | Seed the caller's frame register. |
| 122 | `10101010` | `AA` | instruction: MOV EBP,99AABBCC, byte 4/5 | Seed the caller's frame register. |
| 123 | `10011001` | `99` | instruction: MOV EBP,99AABBCC, byte 5/5 | Seed the caller's frame register. |
| 124 | `10111001` | `B9` | instruction: MOV ECX,DDEEFF00, byte 1/5 | Seed the caller's count register. |
| 125 | `00000000` | `00` | instruction: MOV ECX,DDEEFF00, byte 2/5 | Seed the caller's count register. |
| 126 | `11111111` | `FF` | instruction: MOV ECX,DDEEFF00, byte 3/5 | Seed the caller's count register. |
| 127 | `11101110` | `EE` | instruction: MOV ECX,DDEEFF00, byte 4/5 | Seed the caller's count register. |
| 128 | `11011101` | `DD` | instruction: MOV ECX,DDEEFF00, byte 5/5 | Seed the caller's count register. |
| 129 | `10111000` | `B8` | instruction: MOV EAX,42, byte 1/5 | Prepare the dividend. |
| 130 | `00101010` | `2A` | instruction: MOV EAX,42, byte 2/5 | Prepare the dividend. |
| 131 | `00000000` | `00` | instruction: MOV EAX,42, byte 3/5 | Prepare the dividend. |
| 132 | `00000000` | `00` | instruction: MOV EAX,42, byte 4/5 | Prepare the dividend. |
| 133 | `00000000` | `00` | instruction: MOV EAX,42, byte 5/5 | Prepare the dividend. |
| 134 | `10111011` | `BB` | instruction: MOV EBX,0, byte 1/5 | Deliberately select divide by zero; one immediate bit makes the divisor one. |
| 135 | `00000000` | `00` | instruction: MOV EBX,0, byte 2/5 | Deliberately select divide by zero; one immediate bit makes the divisor one. |
| 136 | `00000000` | `00` | instruction: MOV EBX,0, byte 3/5 | Deliberately select divide by zero; one immediate bit makes the divisor one. |
| 137 | `00000000` | `00` | instruction: MOV EBX,0, byte 4/5 | Deliberately select divide by zero; one immediate bit makes the divisor one. |
| 138 | `00000000` | `00` | instruction: MOV EBX,0, byte 5/5 | Deliberately select divide by zero; one immediate bit makes the divisor one. |
| 139 | `00110001` | `31` | instruction: XOR EDX,EDX, byte 1/2 | Use a zero high dividend. |
| 140 | `11010010` | `D2` | instruction: XOR EDX,EDX, byte 2/2 | Use a zero high dividend. |
| 141 | `00111001` | `39` | instruction: CMP EAX,EAX, byte 1/2 | Establish defined arithmetic flags before the fault sequence. |
| 142 | `11000000` | `C0` | instruction: CMP EAX,EAX, byte 2/2 | Establish defined arithmetic flags before the fault sequence. |
| 143 | `11111101` | `FD` | instruction: STD, byte 1/1 | Verify that exception return preserves the caller's direction flag. |
| 144 | `11110111` | `F7` | instruction: DIV EBX, byte 1/2 | Raise native divide error at source offset 144. |
| 145 | `11110011` | `F3` | instruction: DIV EBX, byte 2/2 | Raise native divide error at source offset 144. |
| 146 | `11001100` | `CC` | instruction: INT3, byte 1/1 | Raise a breakpoint trap whose saved EIP is the following instruction. |
| 147 | `00001111` | `0F` | instruction: UD2, byte 1/2 | Raise invalid opcode at source offset 147. |
| 148 | `00001011` | `0B` | instruction: UD2, byte 2/2 | Raise invalid opcode at source offset 147. |
| 149 | `10111000` | `B8` | instruction: MOV EAX,18, byte 1/5 | Choose the nonexistent fourth GDT descriptor. |
| 150 | `00011000` | `18` | instruction: MOV EAX,18, byte 2/5 | Choose the nonexistent fourth GDT descriptor. |
| 151 | `00000000` | `00` | instruction: MOV EAX,18, byte 3/5 | Choose the nonexistent fourth GDT descriptor. |
| 152 | `00000000` | `00` | instruction: MOV EAX,18, byte 4/5 | Choose the nonexistent fourth GDT descriptor. |
| 153 | `00000000` | `00` | instruction: MOV EAX,18, byte 5/5 | Choose the nonexistent fourth GDT descriptor. |
| 154 | `10001110` | `8E` | instruction: MOV DS,AX, byte 1/2 | Raise general protection at offset 154 with selector error 18. |
| 155 | `11011000` | `D8` | instruction: MOV DS,AX, byte 2/2 | Raise general protection at offset 154 with selector error 18. |
| 156 | `10111000` | `B8` | instruction: MOV EAX,D1500004, byte 1/5 | Mark completion of the controlled sequence; RAM at 6080 records the actual entry count. |
| 157 | `00000100` | `04` | instruction: MOV EAX,D1500004, byte 2/5 | Mark completion of the controlled sequence; RAM at 6080 records the actual entry count. |
| 158 | `00000000` | `00` | instruction: MOV EAX,D1500004, byte 3/5 | Mark completion of the controlled sequence; RAM at 6080 records the actual entry count. |
| 159 | `01010000` | `50` | instruction: MOV EAX,D1500004, byte 4/5 | Mark completion of the controlled sequence; RAM at 6080 records the actual entry count. |
| 160 | `11010001` | `D1` | instruction: MOV EAX,D1500004, byte 5/5 | Mark completion of the controlled sequence; RAM at 6080 records the actual entry count. |
| 161 | `11110100` | `F4` | instruction: HLT, byte 1/1 | Halt at source offset 161 with balanced ESP and DF preserved. |
| 162 | `00000000` | `00` | padding: ALIGN, byte 1/16 | Begin the common handler at offset 192. |
| 163 | `00000000` | `00` | padding: ALIGN, byte 2/16 | Begin the common handler at offset 192. |
| 164 | `00000000` | `00` | padding: ALIGN, byte 3/16 | Begin the common handler at offset 192. |
| 165 | `00000000` | `00` | padding: ALIGN, byte 4/16 | Begin the common handler at offset 192. |
| 166 | `00000000` | `00` | padding: ALIGN, byte 5/16 | Begin the common handler at offset 192. |
| 167 | `00000000` | `00` | padding: ALIGN, byte 6/16 | Begin the common handler at offset 192. |
| 168 | `00000000` | `00` | padding: ALIGN, byte 7/16 | Begin the common handler at offset 192. |
| 169 | `00000000` | `00` | padding: ALIGN, byte 8/16 | Begin the common handler at offset 192. |
| 170 | `00000000` | `00` | padding: ALIGN, byte 9/16 | Begin the common handler at offset 192. |
| 171 | `00000000` | `00` | padding: ALIGN, byte 10/16 | Begin the common handler at offset 192. |
| 172 | `00000000` | `00` | padding: ALIGN, byte 11/16 | Begin the common handler at offset 192. |
| 173 | `00000000` | `00` | padding: ALIGN, byte 12/16 | Begin the common handler at offset 192. |
| 174 | `00000000` | `00` | padding: ALIGN, byte 13/16 | Begin the common handler at offset 192. |
| 175 | `00000000` | `00` | padding: ALIGN, byte 14/16 | Begin the common handler at offset 192. |
| 176 | `00000000` | `00` | padding: ALIGN, byte 15/16 | Begin the common handler at offset 192. |
| 177 | `00000000` | `00` | padding: ALIGN, byte 16/16 | Begin the common handler at offset 192. |
| 178 | `00000000` | `00` | padding: ALIGN, byte 1/14 | Complete thirty bytes of padding. |
| 179 | `00000000` | `00` | padding: ALIGN, byte 2/14 | Complete thirty bytes of padding. |
| 180 | `00000000` | `00` | padding: ALIGN, byte 3/14 | Complete thirty bytes of padding. |
| 181 | `00000000` | `00` | padding: ALIGN, byte 4/14 | Complete thirty bytes of padding. |
| 182 | `00000000` | `00` | padding: ALIGN, byte 5/14 | Complete thirty bytes of padding. |
| 183 | `00000000` | `00` | padding: ALIGN, byte 6/14 | Complete thirty bytes of padding. |
| 184 | `00000000` | `00` | padding: ALIGN, byte 7/14 | Complete thirty bytes of padding. |
| 185 | `00000000` | `00` | padding: ALIGN, byte 8/14 | Complete thirty bytes of padding. |
| 186 | `00000000` | `00` | padding: ALIGN, byte 9/14 | Complete thirty bytes of padding. |
| 187 | `00000000` | `00` | padding: ALIGN, byte 10/14 | Complete thirty bytes of padding. |
| 188 | `00000000` | `00` | padding: ALIGN, byte 11/14 | Complete thirty bytes of padding. |
| 189 | `00000000` | `00` | padding: ALIGN, byte 12/14 | Complete thirty bytes of padding. |
| 190 | `00000000` | `00` | padding: ALIGN, byte 13/14 | Complete thirty bytes of padding. |
| 191 | `00000000` | `00` | padding: ALIGN, byte 14/14 | Complete thirty bytes of padding. |
| 192 | `01100000` | `60` | instruction: PUSHAD, byte 1/1 | Preserve all general registers above the normalized frame. |
| 193 | `10100001` | `A1` | instruction: MOV EAX,[6080], byte 1/5 | Read the completed-record count. |
| 194 | `10000000` | `80` | instruction: MOV EAX,[6080], byte 2/5 | Read the completed-record count. |
| 195 | `01100000` | `60` | instruction: MOV EAX,[6080], byte 3/5 | Read the completed-record count. |
| 196 | `00000000` | `00` | instruction: MOV EAX,[6080], byte 4/5 | Read the completed-record count. |
| 197 | `00000000` | `00` | instruction: MOV EAX,[6080], byte 5/5 | Read the completed-record count. |
| 198 | `10000011` | `83` | instruction: CMP EAX,4, byte 1/3 | Bound the log to four records. |
| 199 | `11111000` | `F8` | instruction: CMP EAX,4, byte 2/3 | Bound the log to four records. |
| 200 | `00000100` | `04` | instruction: CMP EAX,4, byte 3/3 | Bound the log to four records. |
| 201 | `01110011` | `73` | instruction: JAE stop, byte 1/2 | Stop at offset 304 instead of overflowing the log. |
| 202 | `01100101` | `65` | instruction: JAE stop, byte 2/2 | Stop at offset 304 instead of overflowing the log. |
| 203 | `01101011` | `6B` | instruction: IMUL EDI,[6080],28, byte 1/7 | Select the next 28-byte record. |
| 204 | `00111101` | `3D` | instruction: IMUL EDI,[6080],28, byte 2/7 | Select the next 28-byte record. |
| 205 | `10000000` | `80` | instruction: IMUL EDI,[6080],28, byte 3/7 | Select the next 28-byte record. |
| 206 | `01100000` | `60` | instruction: IMUL EDI,[6080],28, byte 4/7 | Select the next 28-byte record. |
| 207 | `00000000` | `00` | instruction: IMUL EDI,[6080],28, byte 5/7 | Select the next 28-byte record. |
| 208 | `00000000` | `00` | instruction: IMUL EDI,[6080],28, byte 6/7 | Select the next 28-byte record. |
| 209 | `00011100` | `1C` | instruction: IMUL EDI,[6080],28, byte 7/7 | Select the next 28-byte record. |
| 210 | `10000001` | `81` | instruction: ADD EDI,6000, byte 1/6 | Address the bounded record. |
| 211 | `11000111` | `C7` | instruction: ADD EDI,6000, byte 2/6 | Address the bounded record. |
| 212 | `00000000` | `00` | instruction: ADD EDI,6000, byte 3/6 | Address the bounded record. |
| 213 | `01100000` | `60` | instruction: ADD EDI,6000, byte 4/6 | Address the bounded record. |
| 214 | `00000000` | `00` | instruction: ADD EDI,6000, byte 5/6 | Address the bounded record. |
| 215 | `00000000` | `00` | instruction: ADD EDI,6000, byte 6/6 | Address the bounded record. |
| 216 | `10001011` | `8B` | instruction: MOV EBX,[ESP+32], byte 1/4 | Read the normalized vector number. |
| 217 | `01011100` | `5C` | instruction: MOV EBX,[ESP+32], byte 2/4 | Read the normalized vector number. |
| 218 | `00100100` | `24` | instruction: MOV EBX,[ESP+32], byte 3/4 | Read the normalized vector number. |
| 219 | `00100000` | `20` | instruction: MOV EBX,[ESP+32], byte 4/4 | Read the normalized vector number. |
| 220 | `10001001` | `89` | instruction: MOV [EDI],EBX, byte 1/2 | Record the actual vector. |
| 221 | `00011111` | `1F` | instruction: MOV [EDI],EBX, byte 2/2 | Record the actual vector. |
| 222 | `10001011` | `8B` | instruction: MOV EAX,[ESP+36], byte 1/4 | Read the CPU error or synthetic zero. |
| 223 | `01000100` | `44` | instruction: MOV EAX,[ESP+36], byte 2/4 | Read the CPU error or synthetic zero. |
| 224 | `00100100` | `24` | instruction: MOV EAX,[ESP+36], byte 3/4 | Read the CPU error or synthetic zero. |
| 225 | `00100100` | `24` | instruction: MOV EAX,[ESP+36], byte 4/4 | Read the CPU error or synthetic zero. |
| 226 | `10001001` | `89` | instruction: MOV [EDI+4],EAX, byte 1/3 | Record the normalized error slot. |
| 227 | `01000111` | `47` | instruction: MOV [EDI+4],EAX, byte 2/3 | Record the normalized error slot. |
| 228 | `00000100` | `04` | instruction: MOV [EDI+4],EAX, byte 3/3 | Record the normalized error slot. |
| 229 | `10001011` | `8B` | instruction: MOV EAX,[ESP+40], byte 1/4 | Read the CPU-generated saved EIP. |
| 230 | `01000100` | `44` | instruction: MOV EAX,[ESP+40], byte 2/4 | Read the CPU-generated saved EIP. |
| 231 | `00100100` | `24` | instruction: MOV EAX,[ESP+40], byte 3/4 | Read the CPU-generated saved EIP. |
| 232 | `00101000` | `28` | instruction: MOV EAX,[ESP+40], byte 4/4 | Read the CPU-generated saved EIP. |
| 233 | `10001001` | `89` | instruction: MOV [EDI+8],EAX, byte 1/3 | Preserve the original saved EIP in the log. |
| 234 | `01000111` | `47` | instruction: MOV [EDI+8],EAX, byte 2/3 | Preserve the original saved EIP in the log. |
| 235 | `00001000` | `08` | instruction: MOV [EDI+8],EAX, byte 3/3 | Preserve the original saved EIP in the log. |
| 236 | `10001001` | `89` | instruction: MOV [EDI+24],EAX, byte 1/3 | Initialize the recorded return EIP before policy selection. |
| 237 | `01000111` | `47` | instruction: MOV [EDI+24],EAX, byte 2/3 | Initialize the recorded return EIP before policy selection. |
| 238 | `00011000` | `18` | instruction: MOV [EDI+24],EAX, byte 3/3 | Initialize the recorded return EIP before policy selection. |
| 239 | `10001011` | `8B` | instruction: MOV EAX,[ESP+44], byte 1/4 | Read the saved code selector. |
| 240 | `01000100` | `44` | instruction: MOV EAX,[ESP+44], byte 2/4 | Read the saved code selector. |
| 241 | `00100100` | `24` | instruction: MOV EAX,[ESP+44], byte 3/4 | Read the saved code selector. |
| 242 | `00101100` | `2C` | instruction: MOV EAX,[ESP+44], byte 4/4 | Read the saved code selector. |
| 243 | `10001001` | `89` | instruction: MOV [EDI+12],EAX, byte 1/3 | Record the CPU-generated CS slot. |
| 244 | `01000111` | `47` | instruction: MOV [EDI+12],EAX, byte 2/3 | Record the CPU-generated CS slot. |
| 245 | `00001100` | `0C` | instruction: MOV [EDI+12],EAX, byte 3/3 | Record the CPU-generated CS slot. |
| 246 | `10001011` | `8B` | instruction: MOV EAX,[ESP+48], byte 1/4 | Read the unmodified saved EFLAGS image. |
| 247 | `01000100` | `44` | instruction: MOV EAX,[ESP+48], byte 2/4 | Read the unmodified saved EFLAGS image. |
| 248 | `00100100` | `24` | instruction: MOV EAX,[ESP+48], byte 3/4 | Read the unmodified saved EFLAGS image. |
| 249 | `00110000` | `30` | instruction: MOV EAX,[ESP+48], byte 4/4 | Read the unmodified saved EFLAGS image. |
| 250 | `10001001` | `89` | instruction: MOV [EDI+16],EAX, byte 1/3 | Record flags without forcing undefined values. |
| 251 | `01000111` | `47` | instruction: MOV [EDI+16],EAX, byte 2/3 | Record flags without forcing undefined values. |
| 252 | `00010000` | `10` | instruction: MOV [EDI+16],EAX, byte 3/3 | Record flags without forcing undefined values. |
| 253 | `10001101` | `8D` | instruction: LEA EAX,[ESP+32], byte 1/4 | Recover the normalized entry stack pointer. |
| 254 | `01000100` | `44` | instruction: LEA EAX,[ESP+32], byte 2/4 | Recover the normalized entry stack pointer. |
| 255 | `00100100` | `24` | instruction: LEA EAX,[ESP+32], byte 3/4 | Recover the normalized entry stack pointer. |
| 256 | `00100000` | `20` | instruction: LEA EAX,[ESP+32], byte 4/4 | Recover the normalized entry stack pointer. |
| 257 | `10001001` | `89` | instruction: MOV [EDI+20],EAX, byte 1/3 | Record the same entry ESP for both error classes. |
| 258 | `01000111` | `47` | instruction: MOV [EDI+20],EAX, byte 2/3 | Record the same entry ESP for both error classes. |
| 259 | `00010100` | `14` | instruction: MOV [EDI+20],EAX, byte 3/3 | Record the same entry ESP for both error classes. |
| 260 | `11111111` | `FF` | instruction: INC dword [6080], byte 1/6 | Count the captured entry. |
| 261 | `00000101` | `05` | instruction: INC dword [6080], byte 2/6 | Count the captured entry. |
| 262 | `10000000` | `80` | instruction: INC dword [6080], byte 3/6 | Count the captured entry. |
| 263 | `01100000` | `60` | instruction: INC dword [6080], byte 4/6 | Count the captured entry. |
| 264 | `00000000` | `00` | instruction: INC dword [6080], byte 5/6 | Count the captured entry. |
| 265 | `00000000` | `00` | instruction: INC dword [6080], byte 6/6 | Count the captured entry. |
| 266 | `00001111` | `0F` | instruction: MOVZX ECX,byte [EBX+8024], byte 1/7 | Read literal recovery policy data by vector. |
| 267 | `10110110` | `B6` | instruction: MOVZX ECX,byte [EBX+8024], byte 2/7 | Read literal recovery policy data by vector. |
| 268 | `10001011` | `8B` | instruction: MOVZX ECX,byte [EBX+8024], byte 3/7 | Read literal recovery policy data by vector. |
| 269 | `00100100` | `24` | instruction: MOVZX ECX,byte [EBX+8024], byte 4/7 | Read literal recovery policy data by vector. |
| 270 | `10000000` | `80` | instruction: MOVZX ECX,byte [EBX+8024], byte 5/7 | Read literal recovery policy data by vector. |
| 271 | `00000000` | `00` | instruction: MOVZX ECX,byte [EBX+8024], byte 6/7 | Read literal recovery policy data by vector. |
| 272 | `00000000` | `00` | instruction: MOVZX ECX,byte [EBX+8024], byte 7/7 | Read literal recovery policy data by vector. |
| 273 | `11110110` | `F6` | instruction: TEST CL,80, byte 1/3 | Distinguish default stop from the four controlled recovery policies. |
| 274 | `11000001` | `C1` | instruction: TEST CL,80, byte 2/3 | Distinguish default stop from the four controlled recovery policies. |
| 275 | `10000000` | `80` | instruction: TEST CL,80, byte 3/3 | Distinguish default stop from the four controlled recovery policies. |
| 276 | `01110101` | `75` | instruction: JNZ stop, byte 1/2 | Capture then halt when the policy's stop bit is set. |
| 277 | `00011010` | `1A` | instruction: JNZ stop, byte 2/2 | Capture then halt when the policy's stop bit is set. |
| 278 | `00000001` | `01` | instruction: ADD [ESP+40],ECX, byte 1/4 | Advance two-byte faults; the breakpoint policy adds zero. |
| 279 | `01001100` | `4C` | instruction: ADD [ESP+40],ECX, byte 2/4 | Advance two-byte faults; the breakpoint policy adds zero. |
| 280 | `00100100` | `24` | instruction: ADD [ESP+40],ECX, byte 3/4 | Advance two-byte faults; the breakpoint policy adds zero. |
| 281 | `00101000` | `28` | instruction: ADD [ESP+40],ECX, byte 4/4 | Advance two-byte faults; the breakpoint policy adds zero. |
| 282 | `10001011` | `8B` | instruction: MOV EAX,[ESP+40], byte 1/4 | Read the actual return EIP after policy application. |
| 283 | `01000100` | `44` | instruction: MOV EAX,[ESP+40], byte 2/4 | Read the actual return EIP after policy application. |
| 284 | `00100100` | `24` | instruction: MOV EAX,[ESP+40], byte 3/4 | Read the actual return EIP after policy application. |
| 285 | `00101000` | `28` | instruction: MOV EAX,[ESP+40], byte 4/4 | Read the actual return EIP after policy application. |
| 286 | `10001001` | `89` | instruction: MOV [EDI+24],EAX, byte 1/3 | Record the chosen return address. |
| 287 | `01000111` | `47` | instruction: MOV [EDI+24],EAX, byte 2/3 | Record the chosen return address. |
| 288 | `00011000` | `18` | instruction: MOV [EDI+24],EAX, byte 3/3 | Record the chosen return address. |
| 289 | `01100001` | `61` | instruction: POPAD, byte 1/1 | Restore the caller's general registers. |
| 290 | `10000011` | `83` | instruction: ADD ESP,8, byte 1/3 | Discard only vector and normalized error slots. |
| 291 | `11000100` | `C4` | instruction: ADD ESP,8, byte 2/3 | Discard only vector and normalized error slots. |
| 292 | `00001000` | `08` | instruction: ADD ESP,8, byte 3/3 | Discard only vector and normalized error slots. |
| 293 | `11001111` | `CF` | instruction: IRETD, byte 1/1 | Restore CPU-generated EIP, CS and flags in 32-bit mode. |
| 294 | `00000000` | `00` | padding: ALIGN, byte 1/10 | Begin the default stop at offset 304. |
| 295 | `00000000` | `00` | padding: ALIGN, byte 2/10 | Begin the default stop at offset 304. |
| 296 | `00000000` | `00` | padding: ALIGN, byte 3/10 | Begin the default stop at offset 304. |
| 297 | `00000000` | `00` | padding: ALIGN, byte 4/10 | Begin the default stop at offset 304. |
| 298 | `00000000` | `00` | padding: ALIGN, byte 5/10 | Begin the default stop at offset 304. |
| 299 | `00000000` | `00` | padding: ALIGN, byte 6/10 | Begin the default stop at offset 304. |
| 300 | `00000000` | `00` | padding: ALIGN, byte 7/10 | Begin the default stop at offset 304. |
| 301 | `00000000` | `00` | padding: ALIGN, byte 8/10 | Begin the default stop at offset 304. |
| 302 | `00000000` | `00` | padding: ALIGN, byte 9/10 | Begin the default stop at offset 304. |
| 303 | `00000000` | `00` | padding: ALIGN, byte 10/10 | Begin the default stop at offset 304. |
| 304 | `11000111` | `C7` | instruction: MOV dword [6084],1, byte 1/10 | Report a captured unhandled or capacity-limited entry. |
| 305 | `00000101` | `05` | instruction: MOV dword [6084],1, byte 2/10 | Report a captured unhandled or capacity-limited entry. |
| 306 | `10000100` | `84` | instruction: MOV dword [6084],1, byte 3/10 | Report a captured unhandled or capacity-limited entry. |
| 307 | `01100000` | `60` | instruction: MOV dword [6084],1, byte 4/10 | Report a captured unhandled or capacity-limited entry. |
| 308 | `00000000` | `00` | instruction: MOV dword [6084],1, byte 5/10 | Report a captured unhandled or capacity-limited entry. |
| 309 | `00000000` | `00` | instruction: MOV dword [6084],1, byte 6/10 | Report a captured unhandled or capacity-limited entry. |
| 310 | `00000001` | `01` | instruction: MOV dword [6084],1, byte 7/10 | Report a captured unhandled or capacity-limited entry. |
| 311 | `00000000` | `00` | instruction: MOV dword [6084],1, byte 8/10 | Report a captured unhandled or capacity-limited entry. |
| 312 | `00000000` | `00` | instruction: MOV dword [6084],1, byte 9/10 | Report a captured unhandled or capacity-limited entry. |
| 313 | `00000000` | `00` | instruction: MOV dword [6084],1, byte 10/10 | Report a captured unhandled or capacity-limited entry. |
| 314 | `11110100` | `F4` | instruction: HLT, byte 1/1 | Retain PUSHAD and the normalized frame for diagnosis. |
| 315 | `00000000` | `00` | padding: ALIGN, byte 1/5 | Begin nine-byte legacy stub slots at offset 320. |
| 316 | `00000000` | `00` | padding: ALIGN, byte 2/5 | Begin nine-byte legacy stub slots at offset 320. |
| 317 | `00000000` | `00` | padding: ALIGN, byte 3/5 | Begin nine-byte legacy stub slots at offset 320. |
| 318 | `00000000` | `00` | padding: ALIGN, byte 4/5 | Begin nine-byte legacy stub slots at offset 320. |
| 319 | `00000000` | `00` | padding: ALIGN, byte 5/5 | Begin nine-byte legacy stub slots at offset 320. |
| 320 | `01101010` | `6A` | instruction: PUSH 0, byte 1/2 | Vector zero has no hardware error; insert zero. |
| 321 | `00000000` | `00` | instruction: PUSH 0, byte 2/2 | Vector zero has no hardware error; insert zero. |
| 322 | `01101010` | `6A` | instruction: PUSH 0, byte 1/2 | Identify divide error. |
| 323 | `00000000` | `00` | instruction: PUSH 0, byte 2/2 | Identify divide error. |
| 324 | `11101001` | `E9` | instruction: JMP common, byte 1/5 | Route to source offset 192. |
| 325 | `01110111` | `77` | instruction: JMP common, byte 2/5 | Route to source offset 192. |
| 326 | `11111111` | `FF` | instruction: JMP common, byte 3/5 | Route to source offset 192. |
| 327 | `11111111` | `FF` | instruction: JMP common, byte 4/5 | Route to source offset 192. |
| 328 | `11111111` | `FF` | instruction: JMP common, byte 5/5 | Route to source offset 192. |
| 329 | `01101010` | `6A` | instruction: PUSH 0, byte 1/2 | Debug exceptions have no hardware error slot. |
| 330 | `00000000` | `00` | instruction: PUSH 0, byte 2/2 | Debug exceptions have no hardware error slot. |
| 331 | `01101010` | `6A` | instruction: PUSH 1, byte 1/2 | Identify debug exception. |
| 332 | `00000001` | `01` | instruction: PUSH 1, byte 2/2 | Identify debug exception. |
| 333 | `11101001` | `E9` | instruction: JMP common, byte 1/5 | Share the normalized handler. |
| 334 | `01101110` | `6E` | instruction: JMP common, byte 2/5 | Share the normalized handler. |
| 335 | `11111111` | `FF` | instruction: JMP common, byte 3/5 | Share the normalized handler. |
| 336 | `11111111` | `FF` | instruction: JMP common, byte 4/5 | Share the normalized handler. |
| 337 | `11111111` | `FF` | instruction: JMP common, byte 5/5 | Share the normalized handler. |
| 338 | `01101010` | `6A` | instruction: PUSH 0, byte 1/2 | NMI has no hardware error slot. |
| 339 | `00000000` | `00` | instruction: PUSH 0, byte 2/2 | NMI has no hardware error slot. |
| 340 | `01101010` | `6A` | instruction: PUSH 2, byte 1/2 | Identify NMI; native delivery is not exercised here. |
| 341 | `00000010` | `02` | instruction: PUSH 2, byte 2/2 | Identify NMI; native delivery is not exercised here. |
| 342 | `11101001` | `E9` | instruction: JMP common, byte 1/5 | Share the normalized handler. |
| 343 | `01100101` | `65` | instruction: JMP common, byte 2/5 | Share the normalized handler. |
| 344 | `11111111` | `FF` | instruction: JMP common, byte 3/5 | Share the normalized handler. |
| 345 | `11111111` | `FF` | instruction: JMP common, byte 4/5 | Share the normalized handler. |
| 346 | `11111111` | `FF` | instruction: JMP common, byte 5/5 | Share the normalized handler. |
| 347 | `01101010` | `6A` | instruction: PUSH 0, byte 1/2 | Breakpoint has no hardware error slot. |
| 348 | `00000000` | `00` | instruction: PUSH 0, byte 2/2 | Breakpoint has no hardware error slot. |
| 349 | `01101010` | `6A` | instruction: PUSH 3, byte 1/2 | Identify the controlled breakpoint trap. |
| 350 | `00000011` | `03` | instruction: PUSH 3, byte 2/2 | Identify the controlled breakpoint trap. |
| 351 | `11101001` | `E9` | instruction: JMP common, byte 1/5 | Preserve the trap's already-advanced saved EIP. |
| 352 | `01011100` | `5C` | instruction: JMP common, byte 2/5 | Preserve the trap's already-advanced saved EIP. |
| 353 | `11111111` | `FF` | instruction: JMP common, byte 3/5 | Preserve the trap's already-advanced saved EIP. |
| 354 | `11111111` | `FF` | instruction: JMP common, byte 4/5 | Preserve the trap's already-advanced saved EIP. |
| 355 | `11111111` | `FF` | instruction: JMP common, byte 5/5 | Preserve the trap's already-advanced saved EIP. |
| 356 | `01101010` | `6A` | instruction: PUSH 0, byte 1/2 | Overflow has no hardware error slot. |
| 357 | `00000000` | `00` | instruction: PUSH 0, byte 2/2 | Overflow has no hardware error slot. |
| 358 | `01101010` | `6A` | instruction: PUSH 4, byte 1/2 | Identify overflow. |
| 359 | `00000100` | `04` | instruction: PUSH 4, byte 2/2 | Identify overflow. |
| 360 | `11101001` | `E9` | instruction: JMP common, byte 1/5 | Default policy captures and stops. |
| 361 | `01010011` | `53` | instruction: JMP common, byte 2/5 | Default policy captures and stops. |
| 362 | `11111111` | `FF` | instruction: JMP common, byte 3/5 | Default policy captures and stops. |
| 363 | `11111111` | `FF` | instruction: JMP common, byte 4/5 | Default policy captures and stops. |
| 364 | `11111111` | `FF` | instruction: JMP common, byte 5/5 | Default policy captures and stops. |
| 365 | `01101010` | `6A` | instruction: PUSH 0, byte 1/2 | Bound range has no hardware error slot. |
| 366 | `00000000` | `00` | instruction: PUSH 0, byte 2/2 | Bound range has no hardware error slot. |
| 367 | `01101010` | `6A` | instruction: PUSH 5, byte 1/2 | Identify bound-range exception. |
| 368 | `00000101` | `05` | instruction: PUSH 5, byte 2/2 | Identify bound-range exception. |
| 369 | `11101001` | `E9` | instruction: JMP common, byte 1/5 | Default policy captures and stops. |
| 370 | `01001010` | `4A` | instruction: JMP common, byte 2/5 | Default policy captures and stops. |
| 371 | `11111111` | `FF` | instruction: JMP common, byte 3/5 | Default policy captures and stops. |
| 372 | `11111111` | `FF` | instruction: JMP common, byte 4/5 | Default policy captures and stops. |
| 373 | `11111111` | `FF` | instruction: JMP common, byte 5/5 | Default policy captures and stops. |
| 374 | `01101010` | `6A` | instruction: PUSH 0, byte 1/2 | Invalid opcode has no hardware error slot. |
| 375 | `00000000` | `00` | instruction: PUSH 0, byte 2/2 | Invalid opcode has no hardware error slot. |
| 376 | `01101010` | `6A` | instruction: PUSH 6, byte 1/2 | Identify the controlled UD2 fault. |
| 377 | `00000110` | `06` | instruction: PUSH 6, byte 2/2 | Identify the controlled UD2 fault. |
| 378 | `11101001` | `E9` | instruction: JMP common, byte 1/5 | Share the normalized handler. |
| 379 | `01000001` | `41` | instruction: JMP common, byte 2/5 | Share the normalized handler. |
| 380 | `11111111` | `FF` | instruction: JMP common, byte 3/5 | Share the normalized handler. |
| 381 | `11111111` | `FF` | instruction: JMP common, byte 4/5 | Share the normalized handler. |
| 382 | `11111111` | `FF` | instruction: JMP common, byte 5/5 | Share the normalized handler. |
| 383 | `01101010` | `6A` | instruction: PUSH 0, byte 1/2 | Device unavailable has no hardware error slot. |
| 384 | `00000000` | `00` | instruction: PUSH 0, byte 2/2 | Device unavailable has no hardware error slot. |
| 385 | `01101010` | `6A` | instruction: PUSH 7, byte 1/2 | Identify device-unavailable exception. |
| 386 | `00000111` | `07` | instruction: PUSH 7, byte 2/2 | Identify device-unavailable exception. |
| 387 | `11101001` | `E9` | instruction: JMP common, byte 1/5 | Default policy captures and stops. |
| 388 | `00111000` | `38` | instruction: JMP common, byte 2/5 | Default policy captures and stops. |
| 389 | `11111111` | `FF` | instruction: JMP common, byte 3/5 | Default policy captures and stops. |
| 390 | `11111111` | `FF` | instruction: JMP common, byte 4/5 | Default policy captures and stops. |
| 391 | `11111111` | `FF` | instruction: JMP common, byte 5/5 | Default policy captures and stops. |
| 392 | `01101010` | `6A` | instruction: PUSH 8, byte 1/2 | Double fault supplies its own error slot; add only the vector. |
| 393 | `00001000` | `08` | instruction: PUSH 8, byte 2/2 | Double fault supplies its own error slot; add only the vector. |
| 394 | `11101001` | `E9` | instruction: JMP common, byte 1/5 | Normalize the hardware-error frame. |
| 395 | `00110001` | `31` | instruction: JMP common, byte 2/5 | Normalize the hardware-error frame. |
| 396 | `11111111` | `FF` | instruction: JMP common, byte 3/5 | Normalize the hardware-error frame. |
| 397 | `11111111` | `FF` | instruction: JMP common, byte 4/5 | Normalize the hardware-error frame. |
| 398 | `11111111` | `FF` | instruction: JMP common, byte 5/5 | Normalize the hardware-error frame. |
| 399 | `10010000` | `90` | padding: ALIGN, byte 1/2 | Fill this nine-byte stub slot after the jump. |
| 400 | `10010000` | `90` | padding: ALIGN, byte 2/2 | Fill this nine-byte stub slot after the jump. |
| 401 | `00000000` | `00` | padding: RESERVED, byte 1/9 | Vector nine has no present gate or executable stub. |
| 402 | `00000000` | `00` | padding: RESERVED, byte 2/9 | Vector nine has no present gate or executable stub. |
| 403 | `00000000` | `00` | padding: RESERVED, byte 3/9 | Vector nine has no present gate or executable stub. |
| 404 | `00000000` | `00` | padding: RESERVED, byte 4/9 | Vector nine has no present gate or executable stub. |
| 405 | `00000000` | `00` | padding: RESERVED, byte 5/9 | Vector nine has no present gate or executable stub. |
| 406 | `00000000` | `00` | padding: RESERVED, byte 6/9 | Vector nine has no present gate or executable stub. |
| 407 | `00000000` | `00` | padding: RESERVED, byte 7/9 | Vector nine has no present gate or executable stub. |
| 408 | `00000000` | `00` | padding: RESERVED, byte 8/9 | Vector nine has no present gate or executable stub. |
| 409 | `00000000` | `00` | padding: RESERVED, byte 9/9 | Vector nine has no present gate or executable stub. |
| 410 | `01101010` | `6A` | instruction: PUSH 10, byte 1/2 | Invalid TSS supplies its own error slot. |
| 411 | `00001010` | `0A` | instruction: PUSH 10, byte 2/2 | Invalid TSS supplies its own error slot. |
| 412 | `11101001` | `E9` | instruction: JMP common, byte 1/5 | Normalize vector ten. |
| 413 | `00011111` | `1F` | instruction: JMP common, byte 2/5 | Normalize vector ten. |
| 414 | `11111111` | `FF` | instruction: JMP common, byte 3/5 | Normalize vector ten. |
| 415 | `11111111` | `FF` | instruction: JMP common, byte 4/5 | Normalize vector ten. |
| 416 | `11111111` | `FF` | instruction: JMP common, byte 5/5 | Normalize vector ten. |
| 417 | `10010000` | `90` | padding: ALIGN, byte 1/2 | Fill the fixed stub slot. |
| 418 | `10010000` | `90` | padding: ALIGN, byte 2/2 | Fill the fixed stub slot. |
| 419 | `01101010` | `6A` | instruction: PUSH 11, byte 1/2 | Segment not present supplies its own error slot. |
| 420 | `00001011` | `0B` | instruction: PUSH 11, byte 2/2 | Segment not present supplies its own error slot. |
| 421 | `11101001` | `E9` | instruction: JMP common, byte 1/5 | Normalize vector eleven. |
| 422 | `00010110` | `16` | instruction: JMP common, byte 2/5 | Normalize vector eleven. |
| 423 | `11111111` | `FF` | instruction: JMP common, byte 3/5 | Normalize vector eleven. |
| 424 | `11111111` | `FF` | instruction: JMP common, byte 4/5 | Normalize vector eleven. |
| 425 | `11111111` | `FF` | instruction: JMP common, byte 5/5 | Normalize vector eleven. |
| 426 | `10010000` | `90` | padding: ALIGN, byte 1/2 | Fill the fixed stub slot. |
| 427 | `10010000` | `90` | padding: ALIGN, byte 2/2 | Fill the fixed stub slot. |
| 428 | `01101010` | `6A` | instruction: PUSH 12, byte 1/2 | Stack fault supplies its own error slot. |
| 429 | `00001100` | `0C` | instruction: PUSH 12, byte 2/2 | Stack fault supplies its own error slot. |
| 430 | `11101001` | `E9` | instruction: JMP common, byte 1/5 | Normalize vector twelve. |
| 431 | `00001101` | `0D` | instruction: JMP common, byte 2/5 | Normalize vector twelve. |
| 432 | `11111111` | `FF` | instruction: JMP common, byte 3/5 | Normalize vector twelve. |
| 433 | `11111111` | `FF` | instruction: JMP common, byte 4/5 | Normalize vector twelve. |
| 434 | `11111111` | `FF` | instruction: JMP common, byte 5/5 | Normalize vector twelve. |
| 435 | `10010000` | `90` | padding: ALIGN, byte 1/2 | Fill the fixed stub slot. |
| 436 | `10010000` | `90` | padding: ALIGN, byte 2/2 | Fill the fixed stub slot. |
| 437 | `01101010` | `6A` | instruction: PUSH 13, byte 1/2 | General protection supplies the actual selector error slot. |
| 438 | `00001101` | `0D` | instruction: PUSH 13, byte 2/2 | General protection supplies the actual selector error slot. |
| 439 | `11101001` | `E9` | instruction: JMP common, byte 1/5 | Route the tested hardware-error frame to the same handler. |
| 440 | `00000100` | `04` | instruction: JMP common, byte 2/5 | Route the tested hardware-error frame to the same handler. |
| 441 | `11111111` | `FF` | instruction: JMP common, byte 3/5 | Route the tested hardware-error frame to the same handler. |
| 442 | `11111111` | `FF` | instruction: JMP common, byte 4/5 | Route the tested hardware-error frame to the same handler. |
| 443 | `11111111` | `FF` | instruction: JMP common, byte 5/5 | Route the tested hardware-error frame to the same handler. |
| 444 | `10010000` | `90` | padding: ALIGN, byte 1/2 | Fill the fixed stub slot. |
| 445 | `10010000` | `90` | padding: ALIGN, byte 2/2 | Fill the fixed stub slot. |
| 446 | `01101010` | `6A` | instruction: PUSH 14, byte 1/2 | Page fault supplies its own error slot; paging is disabled in this probe. |
| 447 | `00001110` | `0E` | instruction: PUSH 14, byte 2/2 | Page fault supplies its own error slot; paging is disabled in this probe. |
| 448 | `11101001` | `E9` | instruction: JMP common, byte 1/5 | Provide structural legacy page-fault dispatch only. |
| 449 | `11111011` | `FB` | instruction: JMP common, byte 2/5 | Provide structural legacy page-fault dispatch only. |
| 450 | `11111110` | `FE` | instruction: JMP common, byte 3/5 | Provide structural legacy page-fault dispatch only. |
| 451 | `11111111` | `FF` | instruction: JMP common, byte 4/5 | Provide structural legacy page-fault dispatch only. |
| 452 | `11111111` | `FF` | instruction: JMP common, byte 5/5 | Provide structural legacy page-fault dispatch only. |
| 453 | `10010000` | `90` | padding: ALIGN, byte 1/2 | Fill the fixed stub slot. |
| 454 | `10010000` | `90` | padding: ALIGN, byte 2/2 | Fill the fixed stub slot. |
| 455 | `00000000` | `00` | padding: RESERVED, byte 1/9 | Vector fifteen has no present gate or executable stub. |
| 456 | `00000000` | `00` | padding: RESERVED, byte 2/9 | Vector fifteen has no present gate or executable stub. |
| 457 | `00000000` | `00` | padding: RESERVED, byte 3/9 | Vector fifteen has no present gate or executable stub. |
| 458 | `00000000` | `00` | padding: RESERVED, byte 4/9 | Vector fifteen has no present gate or executable stub. |
| 459 | `00000000` | `00` | padding: RESERVED, byte 5/9 | Vector fifteen has no present gate or executable stub. |
| 460 | `00000000` | `00` | padding: RESERVED, byte 6/9 | Vector fifteen has no present gate or executable stub. |
| 461 | `00000000` | `00` | padding: RESERVED, byte 7/9 | Vector fifteen has no present gate or executable stub. |
| 462 | `00000000` | `00` | padding: RESERVED, byte 8/9 | Vector fifteen has no present gate or executable stub. |
| 463 | `00000000` | `00` | padding: RESERVED, byte 9/9 | Vector fifteen has no present gate or executable stub. |
| 464 | `01101010` | `6A` | instruction: PUSH 0, byte 1/2 | x87 floating-point error has no hardware error slot. |
| 465 | `00000000` | `00` | instruction: PUSH 0, byte 2/2 | x87 floating-point error has no hardware error slot. |
| 466 | `01101010` | `6A` | instruction: PUSH 16, byte 1/2 | Identify x87 exception. |
| 467 | `00010000` | `10` | instruction: PUSH 16, byte 2/2 | Identify x87 exception. |
| 468 | `11101001` | `E9` | instruction: JMP common, byte 1/5 | Default policy captures and stops. |
| 469 | `11100111` | `E7` | instruction: JMP common, byte 2/5 | Default policy captures and stops. |
| 470 | `11111110` | `FE` | instruction: JMP common, byte 3/5 | Default policy captures and stops. |
| 471 | `11111111` | `FF` | instruction: JMP common, byte 4/5 | Default policy captures and stops. |
| 472 | `11111111` | `FF` | instruction: JMP common, byte 5/5 | Default policy captures and stops. |
| 473 | `01101010` | `6A` | instruction: PUSH 17, byte 1/2 | Alignment check supplies its own error slot. |
| 474 | `00010001` | `11` | instruction: PUSH 17, byte 2/2 | Alignment check supplies its own error slot. |
| 475 | `11101001` | `E9` | instruction: JMP common, byte 1/5 | Normalize vector seventeen. |
| 476 | `11100000` | `E0` | instruction: JMP common, byte 2/5 | Normalize vector seventeen. |
| 477 | `11111110` | `FE` | instruction: JMP common, byte 3/5 | Normalize vector seventeen. |
| 478 | `11111111` | `FF` | instruction: JMP common, byte 4/5 | Normalize vector seventeen. |
| 479 | `11111111` | `FF` | instruction: JMP common, byte 5/5 | Normalize vector seventeen. |
| 480 | `10010000` | `90` | padding: ALIGN, byte 1/2 | Fill the fixed stub slot. |
| 481 | `10010000` | `90` | padding: ALIGN, byte 2/2 | Fill the fixed stub slot. |
| 482 | `01101010` | `6A` | instruction: PUSH 0, byte 1/2 | Machine check has no hardware error slot. |
| 483 | `00000000` | `00` | instruction: PUSH 0, byte 2/2 | Machine check has no hardware error slot. |
| 484 | `01101010` | `6A` | instruction: PUSH 18, byte 1/2 | Identify machine check; recovery is not claimed. |
| 485 | `00010010` | `12` | instruction: PUSH 18, byte 2/2 | Identify machine check; recovery is not claimed. |
| 486 | `11101001` | `E9` | instruction: JMP common, byte 1/5 | Default policy captures and stops. |
| 487 | `11010101` | `D5` | instruction: JMP common, byte 2/5 | Default policy captures and stops. |
| 488 | `11111110` | `FE` | instruction: JMP common, byte 3/5 | Default policy captures and stops. |
| 489 | `11111111` | `FF` | instruction: JMP common, byte 4/5 | Default policy captures and stops. |
| 490 | `11111111` | `FF` | instruction: JMP common, byte 5/5 | Default policy captures and stops. |
| 491 | `01101010` | `6A` | instruction: PUSH 0, byte 1/2 | SIMD floating-point error has no hardware error slot. |
| 492 | `00000000` | `00` | instruction: PUSH 0, byte 2/2 | SIMD floating-point error has no hardware error slot. |
| 493 | `01101010` | `6A` | instruction: PUSH 19, byte 1/2 | Identify SIMD floating-point exception. |
| 494 | `00010011` | `13` | instruction: PUSH 19, byte 2/2 | Identify SIMD floating-point exception. |
| 495 | `11101001` | `E9` | instruction: JMP common, byte 1/5 | Default policy captures and stops. |
| 496 | `11001100` | `CC` | instruction: JMP common, byte 2/5 | Default policy captures and stops. |
| 497 | `11111110` | `FE` | instruction: JMP common, byte 3/5 | Default policy captures and stops. |
| 498 | `11111111` | `FF` | instruction: JMP common, byte 4/5 | Default policy captures and stops. |
| 499 | `11111111` | `FF` | instruction: JMP common, byte 5/5 | Default policy captures and stops. |
| 500 | `00000000` | `00` | padding: ALIGN, byte 1/12 | Place the literal GDT at offset 512. |
| 501 | `00000000` | `00` | padding: ALIGN, byte 2/12 | Place the literal GDT at offset 512. |
| 502 | `00000000` | `00` | padding: ALIGN, byte 3/12 | Place the literal GDT at offset 512. |
| 503 | `00000000` | `00` | padding: ALIGN, byte 4/12 | Place the literal GDT at offset 512. |
| 504 | `00000000` | `00` | padding: ALIGN, byte 5/12 | Place the literal GDT at offset 512. |
| 505 | `00000000` | `00` | padding: ALIGN, byte 6/12 | Place the literal GDT at offset 512. |
| 506 | `00000000` | `00` | padding: ALIGN, byte 7/12 | Place the literal GDT at offset 512. |
| 507 | `00000000` | `00` | padding: ALIGN, byte 8/12 | Place the literal GDT at offset 512. |
| 508 | `00000000` | `00` | padding: ALIGN, byte 9/12 | Place the literal GDT at offset 512. |
| 509 | `00000000` | `00` | padding: ALIGN, byte 10/12 | Place the literal GDT at offset 512. |
| 510 | `00000000` | `00` | padding: ALIGN, byte 11/12 | Place the literal GDT at offset 512. |
| 511 | `00000000` | `00` | padding: ALIGN, byte 12/12 | Place the literal GDT at offset 512. |
| 512 | `00000000` | `00` | data: GDT NULL, byte 1/8 | Reserve selector zero. |
| 513 | `00000000` | `00` | data: GDT NULL, byte 2/8 | Reserve selector zero. |
| 514 | `00000000` | `00` | data: GDT NULL, byte 3/8 | Reserve selector zero. |
| 515 | `00000000` | `00` | data: GDT NULL, byte 4/8 | Reserve selector zero. |
| 516 | `00000000` | `00` | data: GDT NULL, byte 5/8 | Reserve selector zero. |
| 517 | `00000000` | `00` | data: GDT NULL, byte 6/8 | Reserve selector zero. |
| 518 | `00000000` | `00` | data: GDT NULL, byte 7/8 | Reserve selector zero. |
| 519 | `00000000` | `00` | data: GDT NULL, byte 8/8 | Reserve selector zero. |
| 520 | `11111111` | `FF` | data: GDT CODE, byte 1/8 | Flat present ring-zero 32-bit executable descriptor. |
| 521 | `11111111` | `FF` | data: GDT CODE, byte 2/8 | Flat present ring-zero 32-bit executable descriptor. |
| 522 | `00000000` | `00` | data: GDT CODE, byte 3/8 | Flat present ring-zero 32-bit executable descriptor. |
| 523 | `00000000` | `00` | data: GDT CODE, byte 4/8 | Flat present ring-zero 32-bit executable descriptor. |
| 524 | `00000000` | `00` | data: GDT CODE, byte 5/8 | Flat present ring-zero 32-bit executable descriptor. |
| 525 | `10011010` | `9A` | data: GDT CODE, byte 6/8 | Flat present ring-zero 32-bit executable descriptor. |
| 526 | `11001111` | `CF` | data: GDT CODE, byte 7/8 | Flat present ring-zero 32-bit executable descriptor. |
| 527 | `00000000` | `00` | data: GDT CODE, byte 8/8 | Flat present ring-zero 32-bit executable descriptor. |
| 528 | `11111111` | `FF` | data: GDT DATA, byte 1/8 | Flat present writable descriptor with 32-bit stack addressing. |
| 529 | `11111111` | `FF` | data: GDT DATA, byte 2/8 | Flat present writable descriptor with 32-bit stack addressing. |
| 530 | `00000000` | `00` | data: GDT DATA, byte 3/8 | Flat present writable descriptor with 32-bit stack addressing. |
| 531 | `00000000` | `00` | data: GDT DATA, byte 4/8 | Flat present writable descriptor with 32-bit stack addressing. |
| 532 | `00000000` | `00` | data: GDT DATA, byte 5/8 | Flat present writable descriptor with 32-bit stack addressing. |
| 533 | `10010010` | `92` | data: GDT DATA, byte 6/8 | Flat present writable descriptor with 32-bit stack addressing. |
| 534 | `11001111` | `CF` | data: GDT DATA, byte 7/8 | Flat present writable descriptor with 32-bit stack addressing. |
| 535 | `00000000` | `00` | data: GDT DATA, byte 8/8 | Flat present writable descriptor with 32-bit stack addressing. |
| 536 | `00010111` | `17` | data: GDTR, byte 1/6 | Limit 23 and physical base 8000. |
| 537 | `00000000` | `00` | data: GDTR, byte 2/6 | Limit 23 and physical base 8000. |
| 538 | `00000000` | `00` | data: GDTR, byte 3/6 | Limit 23 and physical base 8000. |
| 539 | `10000000` | `80` | data: GDTR, byte 4/6 | Limit 23 and physical base 8000. |
| 540 | `00000000` | `00` | data: GDTR, byte 5/6 | Limit 23 and physical base 8000. |
| 541 | `00000000` | `00` | data: GDTR, byte 6/6 | Limit 23 and physical base 8000. |
| 542 | `10011111` | `9F` | data: IDTR, byte 1/6 | Limit 159 and physical base 8040. |
| 543 | `00000000` | `00` | data: IDTR, byte 2/6 | Limit 159 and physical base 8040. |
| 544 | `01000000` | `40` | data: IDTR, byte 3/6 | Limit 159 and physical base 8040. |
| 545 | `10000000` | `80` | data: IDTR, byte 4/6 | Limit 159 and physical base 8040. |
| 546 | `00000000` | `00` | data: IDTR, byte 5/6 | Limit 159 and physical base 8040. |
| 547 | `00000000` | `00` | data: IDTR, byte 6/6 | Limit 159 and physical base 8040. |
| 548 | `00000010` | `02` | data: RECOVERY POLICY, byte 1/20 | Advance two bytes for DE, UD and GP; preserve BP trap EIP; stop for all other legacy entries. |
| 549 | `10000000` | `80` | data: RECOVERY POLICY, byte 2/20 | Advance two bytes for DE, UD and GP; preserve BP trap EIP; stop for all other legacy entries. |
| 550 | `10000000` | `80` | data: RECOVERY POLICY, byte 3/20 | Advance two bytes for DE, UD and GP; preserve BP trap EIP; stop for all other legacy entries. |
| 551 | `00000000` | `00` | data: RECOVERY POLICY, byte 4/20 | Advance two bytes for DE, UD and GP; preserve BP trap EIP; stop for all other legacy entries. |
| 552 | `10000000` | `80` | data: RECOVERY POLICY, byte 5/20 | Advance two bytes for DE, UD and GP; preserve BP trap EIP; stop for all other legacy entries. |
| 553 | `10000000` | `80` | data: RECOVERY POLICY, byte 6/20 | Advance two bytes for DE, UD and GP; preserve BP trap EIP; stop for all other legacy entries. |
| 554 | `00000010` | `02` | data: RECOVERY POLICY, byte 7/20 | Advance two bytes for DE, UD and GP; preserve BP trap EIP; stop for all other legacy entries. |
| 555 | `10000000` | `80` | data: RECOVERY POLICY, byte 8/20 | Advance two bytes for DE, UD and GP; preserve BP trap EIP; stop for all other legacy entries. |
| 556 | `10000000` | `80` | data: RECOVERY POLICY, byte 9/20 | Advance two bytes for DE, UD and GP; preserve BP trap EIP; stop for all other legacy entries. |
| 557 | `10000000` | `80` | data: RECOVERY POLICY, byte 10/20 | Advance two bytes for DE, UD and GP; preserve BP trap EIP; stop for all other legacy entries. |
| 558 | `10000000` | `80` | data: RECOVERY POLICY, byte 11/20 | Advance two bytes for DE, UD and GP; preserve BP trap EIP; stop for all other legacy entries. |
| 559 | `10000000` | `80` | data: RECOVERY POLICY, byte 12/20 | Advance two bytes for DE, UD and GP; preserve BP trap EIP; stop for all other legacy entries. |
| 560 | `10000000` | `80` | data: RECOVERY POLICY, byte 13/20 | Advance two bytes for DE, UD and GP; preserve BP trap EIP; stop for all other legacy entries. |
| 561 | `00000010` | `02` | data: RECOVERY POLICY, byte 14/20 | Advance two bytes for DE, UD and GP; preserve BP trap EIP; stop for all other legacy entries. |
| 562 | `10000000` | `80` | data: RECOVERY POLICY, byte 15/20 | Advance two bytes for DE, UD and GP; preserve BP trap EIP; stop for all other legacy entries. |
| 563 | `10000000` | `80` | data: RECOVERY POLICY, byte 16/20 | Advance two bytes for DE, UD and GP; preserve BP trap EIP; stop for all other legacy entries. |
| 564 | `10000000` | `80` | data: RECOVERY POLICY, byte 17/20 | Advance two bytes for DE, UD and GP; preserve BP trap EIP; stop for all other legacy entries. |
| 565 | `10000000` | `80` | data: RECOVERY POLICY, byte 18/20 | Advance two bytes for DE, UD and GP; preserve BP trap EIP; stop for all other legacy entries. |
| 566 | `10000000` | `80` | data: RECOVERY POLICY, byte 19/20 | Advance two bytes for DE, UD and GP; preserve BP trap EIP; stop for all other legacy entries. |
| 567 | `10000000` | `80` | data: RECOVERY POLICY, byte 20/20 | Advance two bytes for DE, UD and GP; preserve BP trap EIP; stop for all other legacy entries. |
| 568 | `00000000` | `00` | padding: ALIGN, byte 1/8 | Place twenty literal IDT gates at offset 576. |
| 569 | `00000000` | `00` | padding: ALIGN, byte 2/8 | Place twenty literal IDT gates at offset 576. |
| 570 | `00000000` | `00` | padding: ALIGN, byte 3/8 | Place twenty literal IDT gates at offset 576. |
| 571 | `00000000` | `00` | padding: ALIGN, byte 4/8 | Place twenty literal IDT gates at offset 576. |
| 572 | `00000000` | `00` | padding: ALIGN, byte 5/8 | Place twenty literal IDT gates at offset 576. |
| 573 | `00000000` | `00` | padding: ALIGN, byte 6/8 | Place twenty literal IDT gates at offset 576. |
| 574 | `00000000` | `00` | padding: ALIGN, byte 7/8 | Place twenty literal IDT gates at offset 576. |
| 575 | `00000000` | `00` | padding: ALIGN, byte 8/8 | Place twenty literal IDT gates at offset 576. |
| 576 | `01000000` | `40` | data: IDT 0, byte 1/8 | Present ring-zero interrupt gate to stub 7F40. |
| 577 | `01111111` | `7F` | data: IDT 0, byte 2/8 | Present ring-zero interrupt gate to stub 7F40. |
| 578 | `00001000` | `08` | data: IDT 0, byte 3/8 | Present ring-zero interrupt gate to stub 7F40. |
| 579 | `00000000` | `00` | data: IDT 0, byte 4/8 | Present ring-zero interrupt gate to stub 7F40. |
| 580 | `00000000` | `00` | data: IDT 0, byte 5/8 | Present ring-zero interrupt gate to stub 7F40. |
| 581 | `10001110` | `8E` | data: IDT 0, byte 6/8 | Present ring-zero interrupt gate to stub 7F40. |
| 582 | `00000000` | `00` | data: IDT 0, byte 7/8 | Present ring-zero interrupt gate to stub 7F40. |
| 583 | `00000000` | `00` | data: IDT 0, byte 8/8 | Present ring-zero interrupt gate to stub 7F40. |
| 584 | `01001001` | `49` | data: IDT 1, byte 1/8 | Present interrupt gate to stub 7F49. |
| 585 | `01111111` | `7F` | data: IDT 1, byte 2/8 | Present interrupt gate to stub 7F49. |
| 586 | `00001000` | `08` | data: IDT 1, byte 3/8 | Present interrupt gate to stub 7F49. |
| 587 | `00000000` | `00` | data: IDT 1, byte 4/8 | Present interrupt gate to stub 7F49. |
| 588 | `00000000` | `00` | data: IDT 1, byte 5/8 | Present interrupt gate to stub 7F49. |
| 589 | `10001110` | `8E` | data: IDT 1, byte 6/8 | Present interrupt gate to stub 7F49. |
| 590 | `00000000` | `00` | data: IDT 1, byte 7/8 | Present interrupt gate to stub 7F49. |
| 591 | `00000000` | `00` | data: IDT 1, byte 8/8 | Present interrupt gate to stub 7F49. |
| 592 | `01010010` | `52` | data: IDT 2, byte 1/8 | Present interrupt gate to stub 7F52. |
| 593 | `01111111` | `7F` | data: IDT 2, byte 2/8 | Present interrupt gate to stub 7F52. |
| 594 | `00001000` | `08` | data: IDT 2, byte 3/8 | Present interrupt gate to stub 7F52. |
| 595 | `00000000` | `00` | data: IDT 2, byte 4/8 | Present interrupt gate to stub 7F52. |
| 596 | `00000000` | `00` | data: IDT 2, byte 5/8 | Present interrupt gate to stub 7F52. |
| 597 | `10001110` | `8E` | data: IDT 2, byte 6/8 | Present interrupt gate to stub 7F52. |
| 598 | `00000000` | `00` | data: IDT 2, byte 7/8 | Present interrupt gate to stub 7F52. |
| 599 | `00000000` | `00` | data: IDT 2, byte 8/8 | Present interrupt gate to stub 7F52. |
| 600 | `01011011` | `5B` | data: IDT 3, byte 1/8 | Present interrupt gate to stub 7F5B. |
| 601 | `01111111` | `7F` | data: IDT 3, byte 2/8 | Present interrupt gate to stub 7F5B. |
| 602 | `00001000` | `08` | data: IDT 3, byte 3/8 | Present interrupt gate to stub 7F5B. |
| 603 | `00000000` | `00` | data: IDT 3, byte 4/8 | Present interrupt gate to stub 7F5B. |
| 604 | `00000000` | `00` | data: IDT 3, byte 5/8 | Present interrupt gate to stub 7F5B. |
| 605 | `10001110` | `8E` | data: IDT 3, byte 6/8 | Present interrupt gate to stub 7F5B. |
| 606 | `00000000` | `00` | data: IDT 3, byte 7/8 | Present interrupt gate to stub 7F5B. |
| 607 | `00000000` | `00` | data: IDT 3, byte 8/8 | Present interrupt gate to stub 7F5B. |
| 608 | `01100100` | `64` | data: IDT 4, byte 1/8 | Present interrupt gate to stub 7F64. |
| 609 | `01111111` | `7F` | data: IDT 4, byte 2/8 | Present interrupt gate to stub 7F64. |
| 610 | `00001000` | `08` | data: IDT 4, byte 3/8 | Present interrupt gate to stub 7F64. |
| 611 | `00000000` | `00` | data: IDT 4, byte 4/8 | Present interrupt gate to stub 7F64. |
| 612 | `00000000` | `00` | data: IDT 4, byte 5/8 | Present interrupt gate to stub 7F64. |
| 613 | `10001110` | `8E` | data: IDT 4, byte 6/8 | Present interrupt gate to stub 7F64. |
| 614 | `00000000` | `00` | data: IDT 4, byte 7/8 | Present interrupt gate to stub 7F64. |
| 615 | `00000000` | `00` | data: IDT 4, byte 8/8 | Present interrupt gate to stub 7F64. |
| 616 | `01101101` | `6D` | data: IDT 5, byte 1/8 | Present interrupt gate to stub 7F6D. |
| 617 | `01111111` | `7F` | data: IDT 5, byte 2/8 | Present interrupt gate to stub 7F6D. |
| 618 | `00001000` | `08` | data: IDT 5, byte 3/8 | Present interrupt gate to stub 7F6D. |
| 619 | `00000000` | `00` | data: IDT 5, byte 4/8 | Present interrupt gate to stub 7F6D. |
| 620 | `00000000` | `00` | data: IDT 5, byte 5/8 | Present interrupt gate to stub 7F6D. |
| 621 | `10001110` | `8E` | data: IDT 5, byte 6/8 | Present interrupt gate to stub 7F6D. |
| 622 | `00000000` | `00` | data: IDT 5, byte 7/8 | Present interrupt gate to stub 7F6D. |
| 623 | `00000000` | `00` | data: IDT 5, byte 8/8 | Present interrupt gate to stub 7F6D. |
| 624 | `01110110` | `76` | data: IDT 6, byte 1/8 | Present interrupt gate to stub 7F76. |
| 625 | `01111111` | `7F` | data: IDT 6, byte 2/8 | Present interrupt gate to stub 7F76. |
| 626 | `00001000` | `08` | data: IDT 6, byte 3/8 | Present interrupt gate to stub 7F76. |
| 627 | `00000000` | `00` | data: IDT 6, byte 4/8 | Present interrupt gate to stub 7F76. |
| 628 | `00000000` | `00` | data: IDT 6, byte 5/8 | Present interrupt gate to stub 7F76. |
| 629 | `10001110` | `8E` | data: IDT 6, byte 6/8 | Present interrupt gate to stub 7F76. |
| 630 | `00000000` | `00` | data: IDT 6, byte 7/8 | Present interrupt gate to stub 7F76. |
| 631 | `00000000` | `00` | data: IDT 6, byte 8/8 | Present interrupt gate to stub 7F76. |
| 632 | `01111111` | `7F` | data: IDT 7, byte 1/8 | Present interrupt gate to stub 7F7F. |
| 633 | `01111111` | `7F` | data: IDT 7, byte 2/8 | Present interrupt gate to stub 7F7F. |
| 634 | `00001000` | `08` | data: IDT 7, byte 3/8 | Present interrupt gate to stub 7F7F. |
| 635 | `00000000` | `00` | data: IDT 7, byte 4/8 | Present interrupt gate to stub 7F7F. |
| 636 | `00000000` | `00` | data: IDT 7, byte 5/8 | Present interrupt gate to stub 7F7F. |
| 637 | `10001110` | `8E` | data: IDT 7, byte 6/8 | Present interrupt gate to stub 7F7F. |
| 638 | `00000000` | `00` | data: IDT 7, byte 7/8 | Present interrupt gate to stub 7F7F. |
| 639 | `00000000` | `00` | data: IDT 7, byte 8/8 | Present interrupt gate to stub 7F7F. |
| 640 | `10001000` | `88` | data: IDT 8, byte 1/8 | Present hardware-error gate to stub 7F88. |
| 641 | `01111111` | `7F` | data: IDT 8, byte 2/8 | Present hardware-error gate to stub 7F88. |
| 642 | `00001000` | `08` | data: IDT 8, byte 3/8 | Present hardware-error gate to stub 7F88. |
| 643 | `00000000` | `00` | data: IDT 8, byte 4/8 | Present hardware-error gate to stub 7F88. |
| 644 | `00000000` | `00` | data: IDT 8, byte 5/8 | Present hardware-error gate to stub 7F88. |
| 645 | `10001110` | `8E` | data: IDT 8, byte 6/8 | Present hardware-error gate to stub 7F88. |
| 646 | `00000000` | `00` | data: IDT 8, byte 7/8 | Present hardware-error gate to stub 7F88. |
| 647 | `00000000` | `00` | data: IDT 8, byte 8/8 | Present hardware-error gate to stub 7F88. |
| 648 | `00000000` | `00` | data: IDT 9, byte 1/8 | Keep reserved vector nine absent. |
| 649 | `00000000` | `00` | data: IDT 9, byte 2/8 | Keep reserved vector nine absent. |
| 650 | `00000000` | `00` | data: IDT 9, byte 3/8 | Keep reserved vector nine absent. |
| 651 | `00000000` | `00` | data: IDT 9, byte 4/8 | Keep reserved vector nine absent. |
| 652 | `00000000` | `00` | data: IDT 9, byte 5/8 | Keep reserved vector nine absent. |
| 653 | `00000000` | `00` | data: IDT 9, byte 6/8 | Keep reserved vector nine absent. |
| 654 | `00000000` | `00` | data: IDT 9, byte 7/8 | Keep reserved vector nine absent. |
| 655 | `00000000` | `00` | data: IDT 9, byte 8/8 | Keep reserved vector nine absent. |
| 656 | `10011010` | `9A` | data: IDT 10, byte 1/8 | Present hardware-error gate to stub 7F9A. |
| 657 | `01111111` | `7F` | data: IDT 10, byte 2/8 | Present hardware-error gate to stub 7F9A. |
| 658 | `00001000` | `08` | data: IDT 10, byte 3/8 | Present hardware-error gate to stub 7F9A. |
| 659 | `00000000` | `00` | data: IDT 10, byte 4/8 | Present hardware-error gate to stub 7F9A. |
| 660 | `00000000` | `00` | data: IDT 10, byte 5/8 | Present hardware-error gate to stub 7F9A. |
| 661 | `10001110` | `8E` | data: IDT 10, byte 6/8 | Present hardware-error gate to stub 7F9A. |
| 662 | `00000000` | `00` | data: IDT 10, byte 7/8 | Present hardware-error gate to stub 7F9A. |
| 663 | `00000000` | `00` | data: IDT 10, byte 8/8 | Present hardware-error gate to stub 7F9A. |
| 664 | `10100011` | `A3` | data: IDT 11, byte 1/8 | Present hardware-error gate to stub 7FA3. |
| 665 | `01111111` | `7F` | data: IDT 11, byte 2/8 | Present hardware-error gate to stub 7FA3. |
| 666 | `00001000` | `08` | data: IDT 11, byte 3/8 | Present hardware-error gate to stub 7FA3. |
| 667 | `00000000` | `00` | data: IDT 11, byte 4/8 | Present hardware-error gate to stub 7FA3. |
| 668 | `00000000` | `00` | data: IDT 11, byte 5/8 | Present hardware-error gate to stub 7FA3. |
| 669 | `10001110` | `8E` | data: IDT 11, byte 6/8 | Present hardware-error gate to stub 7FA3. |
| 670 | `00000000` | `00` | data: IDT 11, byte 7/8 | Present hardware-error gate to stub 7FA3. |
| 671 | `00000000` | `00` | data: IDT 11, byte 8/8 | Present hardware-error gate to stub 7FA3. |
| 672 | `10101100` | `AC` | data: IDT 12, byte 1/8 | Present hardware-error gate to stub 7FAC. |
| 673 | `01111111` | `7F` | data: IDT 12, byte 2/8 | Present hardware-error gate to stub 7FAC. |
| 674 | `00001000` | `08` | data: IDT 12, byte 3/8 | Present hardware-error gate to stub 7FAC. |
| 675 | `00000000` | `00` | data: IDT 12, byte 4/8 | Present hardware-error gate to stub 7FAC. |
| 676 | `00000000` | `00` | data: IDT 12, byte 5/8 | Present hardware-error gate to stub 7FAC. |
| 677 | `10001110` | `8E` | data: IDT 12, byte 6/8 | Present hardware-error gate to stub 7FAC. |
| 678 | `00000000` | `00` | data: IDT 12, byte 7/8 | Present hardware-error gate to stub 7FAC. |
| 679 | `00000000` | `00` | data: IDT 12, byte 8/8 | Present hardware-error gate to stub 7FAC. |
| 680 | `10110101` | `B5` | data: IDT 13, byte 1/8 | Present tested GP gate to stub 7FB5. |
| 681 | `01111111` | `7F` | data: IDT 13, byte 2/8 | Present tested GP gate to stub 7FB5. |
| 682 | `00001000` | `08` | data: IDT 13, byte 3/8 | Present tested GP gate to stub 7FB5. |
| 683 | `00000000` | `00` | data: IDT 13, byte 4/8 | Present tested GP gate to stub 7FB5. |
| 684 | `00000000` | `00` | data: IDT 13, byte 5/8 | Present tested GP gate to stub 7FB5. |
| 685 | `10001110` | `8E` | data: IDT 13, byte 6/8 | Present tested GP gate to stub 7FB5. |
| 686 | `00000000` | `00` | data: IDT 13, byte 7/8 | Present tested GP gate to stub 7FB5. |
| 687 | `00000000` | `00` | data: IDT 13, byte 8/8 | Present tested GP gate to stub 7FB5. |
| 688 | `10111110` | `BE` | data: IDT 14, byte 1/8 | Present structural page-fault gate to stub 7FBE. |
| 689 | `01111111` | `7F` | data: IDT 14, byte 2/8 | Present structural page-fault gate to stub 7FBE. |
| 690 | `00001000` | `08` | data: IDT 14, byte 3/8 | Present structural page-fault gate to stub 7FBE. |
| 691 | `00000000` | `00` | data: IDT 14, byte 4/8 | Present structural page-fault gate to stub 7FBE. |
| 692 | `00000000` | `00` | data: IDT 14, byte 5/8 | Present structural page-fault gate to stub 7FBE. |
| 693 | `10001110` | `8E` | data: IDT 14, byte 6/8 | Present structural page-fault gate to stub 7FBE. |
| 694 | `00000000` | `00` | data: IDT 14, byte 7/8 | Present structural page-fault gate to stub 7FBE. |
| 695 | `00000000` | `00` | data: IDT 14, byte 8/8 | Present structural page-fault gate to stub 7FBE. |
| 696 | `00000000` | `00` | data: IDT 15, byte 1/8 | Keep reserved vector fifteen absent. |
| 697 | `00000000` | `00` | data: IDT 15, byte 2/8 | Keep reserved vector fifteen absent. |
| 698 | `00000000` | `00` | data: IDT 15, byte 3/8 | Keep reserved vector fifteen absent. |
| 699 | `00000000` | `00` | data: IDT 15, byte 4/8 | Keep reserved vector fifteen absent. |
| 700 | `00000000` | `00` | data: IDT 15, byte 5/8 | Keep reserved vector fifteen absent. |
| 701 | `00000000` | `00` | data: IDT 15, byte 6/8 | Keep reserved vector fifteen absent. |
| 702 | `00000000` | `00` | data: IDT 15, byte 7/8 | Keep reserved vector fifteen absent. |
| 703 | `00000000` | `00` | data: IDT 15, byte 8/8 | Keep reserved vector fifteen absent. |
| 704 | `11010000` | `D0` | data: IDT 16, byte 1/8 | Present interrupt gate to stub 7FD0. |
| 705 | `01111111` | `7F` | data: IDT 16, byte 2/8 | Present interrupt gate to stub 7FD0. |
| 706 | `00001000` | `08` | data: IDT 16, byte 3/8 | Present interrupt gate to stub 7FD0. |
| 707 | `00000000` | `00` | data: IDT 16, byte 4/8 | Present interrupt gate to stub 7FD0. |
| 708 | `00000000` | `00` | data: IDT 16, byte 5/8 | Present interrupt gate to stub 7FD0. |
| 709 | `10001110` | `8E` | data: IDT 16, byte 6/8 | Present interrupt gate to stub 7FD0. |
| 710 | `00000000` | `00` | data: IDT 16, byte 7/8 | Present interrupt gate to stub 7FD0. |
| 711 | `00000000` | `00` | data: IDT 16, byte 8/8 | Present interrupt gate to stub 7FD0. |
| 712 | `11011001` | `D9` | data: IDT 17, byte 1/8 | Present hardware-error gate to stub 7FD9. |
| 713 | `01111111` | `7F` | data: IDT 17, byte 2/8 | Present hardware-error gate to stub 7FD9. |
| 714 | `00001000` | `08` | data: IDT 17, byte 3/8 | Present hardware-error gate to stub 7FD9. |
| 715 | `00000000` | `00` | data: IDT 17, byte 4/8 | Present hardware-error gate to stub 7FD9. |
| 716 | `00000000` | `00` | data: IDT 17, byte 5/8 | Present hardware-error gate to stub 7FD9. |
| 717 | `10001110` | `8E` | data: IDT 17, byte 6/8 | Present hardware-error gate to stub 7FD9. |
| 718 | `00000000` | `00` | data: IDT 17, byte 7/8 | Present hardware-error gate to stub 7FD9. |
| 719 | `00000000` | `00` | data: IDT 17, byte 8/8 | Present hardware-error gate to stub 7FD9. |
| 720 | `11100010` | `E2` | data: IDT 18, byte 1/8 | Present machine-check gate to stub 7FE2; no recovery claim. |
| 721 | `01111111` | `7F` | data: IDT 18, byte 2/8 | Present machine-check gate to stub 7FE2; no recovery claim. |
| 722 | `00001000` | `08` | data: IDT 18, byte 3/8 | Present machine-check gate to stub 7FE2; no recovery claim. |
| 723 | `00000000` | `00` | data: IDT 18, byte 4/8 | Present machine-check gate to stub 7FE2; no recovery claim. |
| 724 | `00000000` | `00` | data: IDT 18, byte 5/8 | Present machine-check gate to stub 7FE2; no recovery claim. |
| 725 | `10001110` | `8E` | data: IDT 18, byte 6/8 | Present machine-check gate to stub 7FE2; no recovery claim. |
| 726 | `00000000` | `00` | data: IDT 18, byte 7/8 | Present machine-check gate to stub 7FE2; no recovery claim. |
| 727 | `00000000` | `00` | data: IDT 18, byte 8/8 | Present machine-check gate to stub 7FE2; no recovery claim. |
| 728 | `11101011` | `EB` | data: IDT 19, byte 1/8 | Present SIMD exception gate to stub 7FEB. |
| 729 | `01111111` | `7F` | data: IDT 19, byte 2/8 | Present SIMD exception gate to stub 7FEB. |
| 730 | `00001000` | `08` | data: IDT 19, byte 3/8 | Present SIMD exception gate to stub 7FEB. |
| 731 | `00000000` | `00` | data: IDT 19, byte 4/8 | Present SIMD exception gate to stub 7FEB. |
| 732 | `00000000` | `00` | data: IDT 19, byte 5/8 | Present SIMD exception gate to stub 7FEB. |
| 733 | `10001110` | `8E` | data: IDT 19, byte 6/8 | Present SIMD exception gate to stub 7FEB. |
| 734 | `00000000` | `00` | data: IDT 19, byte 7/8 | Present SIMD exception gate to stub 7FEB. |
| 735 | `00000000` | `00` | data: IDT 19, byte 8/8 | Present SIMD exception gate to stub 7FEB. |
