# Every byte explained

Generated from canonical `.bits` annotations by `python3 tools/byte_tables.py`.

Instruction names below are disassembly for explanation, never code-generation input.

| Offset | Binary | Hex | Range / byte within it | Encoding explanation |
| --- | --- | --- | --- | --- |
| 0 | `11111010` | `FA` | instruction: CLI, byte 1/1 | Keep external interrupts masked throughout this controlled page fault. |
| 1 | `11101010` | `EA` | instruction: JMP 0000:7C06, byte 1/5 | Normalize the real-mode code segment. |
| 2 | `00000110` | `06` | instruction: JMP 0000:7C06, byte 2/5 | Normalize the real-mode code segment. |
| 3 | `01111100` | `7C` | instruction: JMP 0000:7C06, byte 3/5 | Normalize the real-mode code segment. |
| 4 | `00000000` | `00` | instruction: JMP 0000:7C06, byte 4/5 | Normalize the real-mode code segment. |
| 5 | `00000000` | `00` | instruction: JMP 0000:7C06, byte 5/5 | Normalize the real-mode code segment. |
| 6 | `00110001` | `31` | instruction: XOR AX,AX, byte 1/2 | Prepare segment zero. |
| 7 | `11000000` | `C0` | instruction: XOR AX,AX, byte 2/2 | Prepare segment zero. |
| 8 | `10001110` | `8E` | instruction: MOV DS,AX, byte 1/2 | Address the literal descriptor pointers. |
| 9 | `11011000` | `D8` | instruction: MOV DS,AX, byte 2/2 | Address the literal descriptor pointers. |
| 10 | `10001110` | `8E` | instruction: MOV SS,AX, byte 1/2 | Establish the stack segment first. |
| 11 | `11010000` | `D0` | instruction: MOV SS,AX, byte 2/2 | Establish the stack segment first. |
| 12 | `10111100` | `BC` | instruction: MOV SP,7C00, byte 1/3 | Define the initial real-mode stack. |
| 13 | `00000000` | `00` | instruction: MOV SP,7C00, byte 2/3 | Define the initial real-mode stack. |
| 14 | `01111100` | `7C` | instruction: MOV SP,7C00, byte 3/3 | Define the initial real-mode stack. |
| 15 | `11111100` | `FC` | instruction: CLD, byte 1/1 | Make the later table stores advance. |
| 16 | `00001111` | `0F` | instruction: LGDT [7D18], byte 1/5 | Load the literal GDT pointer at offset 280. |
| 17 | `00000001` | `01` | instruction: LGDT [7D18], byte 2/5 | Load the literal GDT pointer at offset 280. |
| 18 | `00010110` | `16` | instruction: LGDT [7D18], byte 3/5 | Load the literal GDT pointer at offset 280. |
| 19 | `00011000` | `18` | instruction: LGDT [7D18], byte 4/5 | Load the literal GDT pointer at offset 280. |
| 20 | `01111101` | `7D` | instruction: LGDT [7D18], byte 5/5 | Load the literal GDT pointer at offset 280. |
| 21 | `00001111` | `0F` | instruction: MOV EAX,CR0, byte 1/3 | Preserve existing control-register bits. |
| 22 | `00100000` | `20` | instruction: MOV EAX,CR0, byte 2/3 | Preserve existing control-register bits. |
| 23 | `11000000` | `C0` | instruction: MOV EAX,CR0, byte 3/3 | Preserve existing control-register bits. |
| 24 | `01100110` | `66` | instruction: OR EAX,1, byte 1/4 | Enable protected mode with a 32-bit operand. |
| 25 | `10000011` | `83` | instruction: OR EAX,1, byte 2/4 | Enable protected mode with a 32-bit operand. |
| 26 | `11001000` | `C8` | instruction: OR EAX,1, byte 3/4 | Enable protected mode with a 32-bit operand. |
| 27 | `00000001` | `01` | instruction: OR EAX,1, byte 4/4 | Enable protected mode with a 32-bit operand. |
| 28 | `00001111` | `0F` | instruction: MOV CR0,EAX, byte 1/3 | Set PE without enabling paging yet. |
| 29 | `00100010` | `22` | instruction: MOV CR0,EAX, byte 2/3 | Set PE without enabling paging yet. |
| 30 | `11000000` | `C0` | instruction: MOV CR0,EAX, byte 3/3 | Set PE without enabling paging yet. |
| 31 | `01100110` | `66` | instruction: JMP 0008:00007C28, byte 1/8 | Enter flat 32-bit code at offset 40. |
| 32 | `11101010` | `EA` | instruction: JMP 0008:00007C28, byte 2/8 | Enter flat 32-bit code at offset 40. |
| 33 | `00101000` | `28` | instruction: JMP 0008:00007C28, byte 3/8 | Enter flat 32-bit code at offset 40. |
| 34 | `01111100` | `7C` | instruction: JMP 0008:00007C28, byte 4/8 | Enter flat 32-bit code at offset 40. |
| 35 | `00000000` | `00` | instruction: JMP 0008:00007C28, byte 5/8 | Enter flat 32-bit code at offset 40. |
| 36 | `00000000` | `00` | instruction: JMP 0008:00007C28, byte 6/8 | Enter flat 32-bit code at offset 40. |
| 37 | `00001000` | `08` | instruction: JMP 0008:00007C28, byte 7/8 | Enter flat 32-bit code at offset 40. |
| 38 | `00000000` | `00` | instruction: JMP 0008:00007C28, byte 8/8 | Enter flat 32-bit code at offset 40. |
| 39 | `00000000` | `00` | padding: Protected entry alignment, byte 1/1 | One skipped byte. |
| 40 | `10111000` | `B8` | instruction: MOV EAX,10, byte 1/5 | Select the flat data descriptor. |
| 41 | `00010000` | `10` | instruction: MOV EAX,10, byte 2/5 | Select the flat data descriptor. |
| 42 | `00000000` | `00` | instruction: MOV EAX,10, byte 3/5 | Select the flat data descriptor. |
| 43 | `00000000` | `00` | instruction: MOV EAX,10, byte 4/5 | Select the flat data descriptor. |
| 44 | `00000000` | `00` | instruction: MOV EAX,10, byte 5/5 | Select the flat data descriptor. |
| 45 | `10001110` | `8E` | instruction: MOV DS,AX, byte 1/2 | Use flat data addresses. |
| 46 | `11011000` | `D8` | instruction: MOV DS,AX, byte 2/2 | Use flat data addresses. |
| 47 | `10001110` | `8E` | instruction: MOV ES,AX, byte 1/2 | STOSD writes through flat ES. |
| 48 | `11000000` | `C0` | instruction: MOV ES,AX, byte 2/2 | STOSD writes through flat ES. |
| 49 | `10001110` | `8E` | instruction: MOV SS,AX, byte 1/2 | Use a flat 32-bit stack. |
| 50 | `11010000` | `D0` | instruction: MOV SS,AX, byte 2/2 | Use a flat 32-bit stack. |
| 51 | `10111100` | `BC` | instruction: MOV ESP,9000, byte 1/5 | Reserve the native exception frame below 9000. |
| 52 | `00000000` | `00` | instruction: MOV ESP,9000, byte 2/5 | Reserve the native exception frame below 9000. |
| 53 | `10010000` | `90` | instruction: MOV ESP,9000, byte 3/5 | Reserve the native exception frame below 9000. |
| 54 | `00000000` | `00` | instruction: MOV ESP,9000, byte 4/5 | Reserve the native exception frame below 9000. |
| 55 | `00000000` | `00` | instruction: MOV ESP,9000, byte 5/5 | Reserve the native exception frame below 9000. |
| 56 | `00001111` | `0F` | instruction: LIDT [00007D1E], byte 1/7 | Install fifteen gates with only vector 0E present. |
| 57 | `00000001` | `01` | instruction: LIDT [00007D1E], byte 2/7 | Install fifteen gates with only vector 0E present. |
| 58 | `00011101` | `1D` | instruction: LIDT [00007D1E], byte 3/7 | Install fifteen gates with only vector 0E present. |
| 59 | `00011110` | `1E` | instruction: LIDT [00007D1E], byte 4/7 | Install fifteen gates with only vector 0E present. |
| 60 | `01111101` | `7D` | instruction: LIDT [00007D1E], byte 5/7 | Install fifteen gates with only vector 0E present. |
| 61 | `00000000` | `00` | instruction: LIDT [00007D1E], byte 6/7 | Install fifteen gates with only vector 0E present. |
| 62 | `00000000` | `00` | instruction: LIDT [00007D1E], byte 7/7 | Install fifteen gates with only vector 0E present. |
| 63 | `00110001` | `31` | instruction: XOR EAX,EAX, byte 1/2 | Prepare zero log and directory doublewords. |
| 64 | `11000000` | `C0` | instruction: XOR EAX,EAX, byte 2/2 | Prepare zero log and directory doublewords. |
| 65 | `10111111` | `BF` | instruction: MOV EDI,6000, byte 1/5 | Start the six-doubleword fault log. |
| 66 | `00000000` | `00` | instruction: MOV EDI,6000, byte 2/5 | Start the six-doubleword fault log. |
| 67 | `01100000` | `60` | instruction: MOV EDI,6000, byte 3/5 | Start the six-doubleword fault log. |
| 68 | `00000000` | `00` | instruction: MOV EDI,6000, byte 4/5 | Start the six-doubleword fault log. |
| 69 | `00000000` | `00` | instruction: MOV EDI,6000, byte 5/5 | Start the six-doubleword fault log. |
| 70 | `10111001` | `B9` | instruction: MOV ECX,6, byte 1/5 | Initialize all log fields, including the fault count. |
| 71 | `00000110` | `06` | instruction: MOV ECX,6, byte 2/5 | Initialize all log fields, including the fault count. |
| 72 | `00000000` | `00` | instruction: MOV ECX,6, byte 3/5 | Initialize all log fields, including the fault count. |
| 73 | `00000000` | `00` | instruction: MOV ECX,6, byte 4/5 | Initialize all log fields, including the fault count. |
| 74 | `00000000` | `00` | instruction: MOV ECX,6, byte 5/5 | Initialize all log fields, including the fault count. |
| 75 | `11110011` | `F3` | instruction: REP STOSD, byte 1/2 | Clear exactly 24 log bytes as runtime data, not target instruction generation. |
| 76 | `10101011` | `AB` | instruction: REP STOSD, byte 2/2 | Clear exactly 24 log bytes as runtime data, not target instruction generation. |
| 77 | `10111111` | `BF` | instruction: MOV EDI,4000, byte 1/5 | Start the page-aligned directory. |
| 78 | `00000000` | `00` | instruction: MOV EDI,4000, byte 2/5 | Start the page-aligned directory. |
| 79 | `01000000` | `40` | instruction: MOV EDI,4000, byte 3/5 | Start the page-aligned directory. |
| 80 | `00000000` | `00` | instruction: MOV EDI,4000, byte 4/5 | Start the page-aligned directory. |
| 81 | `00000000` | `00` | instruction: MOV EDI,4000, byte 5/5 | Start the page-aligned directory. |
| 82 | `10111001` | `B9` | instruction: MOV ECX,1024, byte 1/5 | Clear every directory entry. |
| 83 | `00000000` | `00` | instruction: MOV ECX,1024, byte 2/5 | Clear every directory entry. |
| 84 | `00000100` | `04` | instruction: MOV ECX,1024, byte 3/5 | Clear every directory entry. |
| 85 | `00000000` | `00` | instruction: MOV ECX,1024, byte 4/5 | Clear every directory entry. |
| 86 | `00000000` | `00` | instruction: MOV ECX,1024, byte 5/5 | Clear every directory entry. |
| 87 | `11110011` | `F3` | instruction: REP STOSD, byte 1/2 | Zero the 4 KiB directory and leave EDI at 5000. |
| 88 | `10101011` | `AB` | instruction: REP STOSD, byte 2/2 | Zero the 4 KiB directory and leave EDI at 5000. |
| 89 | `10111001` | `B9` | instruction: MOV ECX,1024, byte 1/5 | Build 1024 page-table entries for the low 4 MiB. |
| 90 | `00000000` | `00` | instruction: MOV ECX,1024, byte 2/5 | Build 1024 page-table entries for the low 4 MiB. |
| 91 | `00000100` | `04` | instruction: MOV ECX,1024, byte 3/5 | Build 1024 page-table entries for the low 4 MiB. |
| 92 | `00000000` | `00` | instruction: MOV ECX,1024, byte 4/5 | Build 1024 page-table entries for the low 4 MiB. |
| 93 | `00000000` | `00` | instruction: MOV ECX,1024, byte 5/5 | Build 1024 page-table entries for the low 4 MiB. |
| 94 | `10111000` | `B8` | instruction: MOV EAX,3, byte 1/5 | Physical page zero, present and supervisor writable. |
| 95 | `00000011` | `03` | instruction: MOV EAX,3, byte 2/5 | Physical page zero, present and supervisor writable. |
| 96 | `00000000` | `00` | instruction: MOV EAX,3, byte 3/5 | Physical page zero, present and supervisor writable. |
| 97 | `00000000` | `00` | instruction: MOV EAX,3, byte 4/5 | Physical page zero, present and supervisor writable. |
| 98 | `00000000` | `00` | instruction: MOV EAX,3, byte 5/5 | Physical page zero, present and supervisor writable. |
| 99 | `10101011` | `AB` | instruction: STOSD, byte 1/1 | Store one identity-mapping entry through ES:EDI. |
| 100 | `00000101` | `05` | instruction: ADD EAX,1000, byte 1/5 | Advance the physical page base while retaining P and RW bits. |
| 101 | `00000000` | `00` | instruction: ADD EAX,1000, byte 2/5 | Advance the physical page base while retaining P and RW bits. |
| 102 | `00010000` | `10` | instruction: ADD EAX,1000, byte 3/5 | Advance the physical page base while retaining P and RW bits. |
| 103 | `00000000` | `00` | instruction: ADD EAX,1000, byte 4/5 | Advance the physical page base while retaining P and RW bits. |
| 104 | `00000000` | `00` | instruction: ADD EAX,1000, byte 5/5 | Advance the physical page base while retaining P and RW bits. |
| 105 | `11100010` | `E2` | instruction: LOOP -8, byte 1/2 | Repeat the table store at offset 99. |
| 106 | `11111000` | `F8` | instruction: LOOP -8, byte 2/2 | Repeat the table store at offset 99. |
| 107 | `11000111` | `C7` | instruction: MOV dword [4000],5003, byte 1/10 | Directory entry zero points to the supervisor writable table at 5000. |
| 108 | `00000101` | `05` | instruction: MOV dword [4000],5003, byte 2/10 | Directory entry zero points to the supervisor writable table at 5000. |
| 109 | `00000000` | `00` | instruction: MOV dword [4000],5003, byte 3/10 | Directory entry zero points to the supervisor writable table at 5000. |
| 110 | `01000000` | `40` | instruction: MOV dword [4000],5003, byte 4/10 | Directory entry zero points to the supervisor writable table at 5000. |
| 111 | `00000000` | `00` | instruction: MOV dword [4000],5003, byte 5/10 | Directory entry zero points to the supervisor writable table at 5000. |
| 112 | `00000000` | `00` | instruction: MOV dword [4000],5003, byte 6/10 | Directory entry zero points to the supervisor writable table at 5000. |
| 113 | `00000011` | `03` | instruction: MOV dword [4000],5003, byte 7/10 | Directory entry zero points to the supervisor writable table at 5000. |
| 114 | `01010000` | `50` | instruction: MOV dword [4000],5003, byte 8/10 | Directory entry zero points to the supervisor writable table at 5000. |
| 115 | `00000000` | `00` | instruction: MOV dword [4000],5003, byte 9/10 | Directory entry zero points to the supervisor writable table at 5000. |
| 116 | `00000000` | `00` | instruction: MOV dword [4000],5003, byte 10/10 | Directory entry zero points to the supervisor writable table at 5000. |
| 117 | `11000110` | `C6` | instruction: MOV byte [502C],1, byte 1/7 | Make linear page B000 present but read-only; byte 123 bit one is the writable control. |
| 118 | `00000101` | `05` | instruction: MOV byte [502C],1, byte 2/7 | Make linear page B000 present but read-only; byte 123 bit one is the writable control. |
| 119 | `00101100` | `2C` | instruction: MOV byte [502C],1, byte 3/7 | Make linear page B000 present but read-only; byte 123 bit one is the writable control. |
| 120 | `01010000` | `50` | instruction: MOV byte [502C],1, byte 4/7 | Make linear page B000 present but read-only; byte 123 bit one is the writable control. |
| 121 | `00000000` | `00` | instruction: MOV byte [502C],1, byte 5/7 | Make linear page B000 present but read-only; byte 123 bit one is the writable control. |
| 122 | `00000000` | `00` | instruction: MOV byte [502C],1, byte 6/7 | Make linear page B000 present but read-only; byte 123 bit one is the writable control. |
| 123 | `00000001` | `01` | instruction: MOV byte [502C],1, byte 7/7 | Make linear page B000 present but read-only; byte 123 bit one is the writable control. |
| 124 | `11000111` | `C7` | instruction: MOV dword [B000],0, byte 1/10 | Initialize the target before paging is active. |
| 125 | `00000101` | `05` | instruction: MOV dword [B000],0, byte 2/10 | Initialize the target before paging is active. |
| 126 | `00000000` | `00` | instruction: MOV dword [B000],0, byte 3/10 | Initialize the target before paging is active. |
| 127 | `10110000` | `B0` | instruction: MOV dword [B000],0, byte 4/10 | Initialize the target before paging is active. |
| 128 | `00000000` | `00` | instruction: MOV dword [B000],0, byte 5/10 | Initialize the target before paging is active. |
| 129 | `00000000` | `00` | instruction: MOV dword [B000],0, byte 6/10 | Initialize the target before paging is active. |
| 130 | `00000000` | `00` | instruction: MOV dword [B000],0, byte 7/10 | Initialize the target before paging is active. |
| 131 | `00000000` | `00` | instruction: MOV dword [B000],0, byte 8/10 | Initialize the target before paging is active. |
| 132 | `00000000` | `00` | instruction: MOV dword [B000],0, byte 9/10 | Initialize the target before paging is active. |
| 133 | `00000000` | `00` | instruction: MOV dword [B000],0, byte 10/10 | Initialize the target before paging is active. |
| 134 | `10111000` | `B8` | instruction: MOV EAX,4000, byte 1/5 | Select the aligned directory physical address. |
| 135 | `00000000` | `00` | instruction: MOV EAX,4000, byte 2/5 | Select the aligned directory physical address. |
| 136 | `01000000` | `40` | instruction: MOV EAX,4000, byte 3/5 | Select the aligned directory physical address. |
| 137 | `00000000` | `00` | instruction: MOV EAX,4000, byte 4/5 | Select the aligned directory physical address. |
| 138 | `00000000` | `00` | instruction: MOV EAX,4000, byte 5/5 | Select the aligned directory physical address. |
| 139 | `00001111` | `0F` | instruction: MOV CR3,EAX, byte 1/3 | Install the actual page-directory root. |
| 140 | `00100010` | `22` | instruction: MOV CR3,EAX, byte 2/3 | Install the actual page-directory root. |
| 141 | `11011000` | `D8` | instruction: MOV CR3,EAX, byte 3/3 | Install the actual page-directory root. |
| 142 | `00001111` | `0F` | instruction: MOV EAX,CR0, byte 1/3 | Retain the existing protected-mode settings. |
| 143 | `00100000` | `20` | instruction: MOV EAX,CR0, byte 2/3 | Retain the existing protected-mode settings. |
| 144 | `11000000` | `C0` | instruction: MOV EAX,CR0, byte 3/3 | Retain the existing protected-mode settings. |
| 145 | `00001101` | `0D` | instruction: OR EAX,80010000, byte 1/5 | Enable paging and supervisor write protection; byte 148 bit zero is the WP-off control. |
| 146 | `00000000` | `00` | instruction: OR EAX,80010000, byte 2/5 | Enable paging and supervisor write protection; byte 148 bit zero is the WP-off control. |
| 147 | `00000000` | `00` | instruction: OR EAX,80010000, byte 3/5 | Enable paging and supervisor write protection; byte 148 bit zero is the WP-off control. |
| 148 | `00000001` | `01` | instruction: OR EAX,80010000, byte 4/5 | Enable paging and supervisor write protection; byte 148 bit zero is the WP-off control. |
| 149 | `10000000` | `80` | instruction: OR EAX,80010000, byte 5/5 | Enable paging and supervisor write protection; byte 148 bit zero is the WP-off control. |
| 150 | `00001111` | `0F` | instruction: MOV CR0,EAX, byte 1/3 | Turn on PG and WP while code and stack remain identity mapped. |
| 151 | `00100010` | `22` | instruction: MOV CR0,EAX, byte 2/3 | Turn on PG and WP while code and stack remain identity mapped. |
| 152 | `11000000` | `C0` | instruction: MOV CR0,EAX, byte 3/3 | Turn on PG and WP while code and stack remain identity mapped. |
| 153 | `11000111` | `C7` | instruction: MOV dword [B000],2A, byte 1/10 | The protected write faults here at 7C99, then retries this same instruction after repair. |
| 154 | `00000101` | `05` | instruction: MOV dword [B000],2A, byte 2/10 | The protected write faults here at 7C99, then retries this same instruction after repair. |
| 155 | `00000000` | `00` | instruction: MOV dword [B000],2A, byte 3/10 | The protected write faults here at 7C99, then retries this same instruction after repair. |
| 156 | `10110000` | `B0` | instruction: MOV dword [B000],2A, byte 4/10 | The protected write faults here at 7C99, then retries this same instruction after repair. |
| 157 | `00000000` | `00` | instruction: MOV dword [B000],2A, byte 5/10 | The protected write faults here at 7C99, then retries this same instruction after repair. |
| 158 | `00000000` | `00` | instruction: MOV dword [B000],2A, byte 6/10 | The protected write faults here at 7C99, then retries this same instruction after repair. |
| 159 | `00101010` | `2A` | instruction: MOV dword [B000],2A, byte 7/10 | The protected write faults here at 7C99, then retries this same instruction after repair. |
| 160 | `00000000` | `00` | instruction: MOV dword [B000],2A, byte 8/10 | The protected write faults here at 7C99, then retries this same instruction after repair. |
| 161 | `00000000` | `00` | instruction: MOV dword [B000],2A, byte 9/10 | The protected write faults here at 7C99, then retries this same instruction after repair. |
| 162 | `00000000` | `00` | instruction: MOV dword [B000],2A, byte 10/10 | The protected write faults here at 7C99, then retries this same instruction after repair. |
| 163 | `11110100` | `F4` | instruction: HLT, byte 1/1 | Halt only after the attempted store completes; next EIP is 7CA4. |
| 164 | `11101011` | `EB` | instruction: JMP -3, byte 1/2 | Return to the final halt if resumed. |
| 165 | `11111101` | `FD` | instruction: JMP -3, byte 2/2 | Return to the final halt if resumed. |
| 166 | `00000000` | `00` | padding: Handler alignment, byte 1/10 | Put the page-fault entry at offset 176. |
| 167 | `00000000` | `00` | padding: Handler alignment, byte 2/10 | Put the page-fault entry at offset 176. |
| 168 | `00000000` | `00` | padding: Handler alignment, byte 3/10 | Put the page-fault entry at offset 176. |
| 169 | `00000000` | `00` | padding: Handler alignment, byte 4/10 | Put the page-fault entry at offset 176. |
| 170 | `00000000` | `00` | padding: Handler alignment, byte 5/10 | Put the page-fault entry at offset 176. |
| 171 | `00000000` | `00` | padding: Handler alignment, byte 6/10 | Put the page-fault entry at offset 176. |
| 172 | `00000000` | `00` | padding: Handler alignment, byte 7/10 | Put the page-fault entry at offset 176. |
| 173 | `00000000` | `00` | padding: Handler alignment, byte 8/10 | Put the page-fault entry at offset 176. |
| 174 | `00000000` | `00` | padding: Handler alignment, byte 9/10 | Put the page-fault entry at offset 176. |
| 175 | `00000000` | `00` | padding: Handler alignment, byte 10/10 | Put the page-fault entry at offset 176. |
| 176 | `10001011` | `8B` | instruction: MOV EAX,[ESP], byte 1/3 | Read the actual page-fault error code pushed before EIP. |
| 177 | `00000100` | `04` | instruction: MOV EAX,[ESP], byte 2/3 | Read the actual page-fault error code pushed before EIP. |
| 178 | `00100100` | `24` | instruction: MOV EAX,[ESP], byte 3/3 | Read the actual page-fault error code pushed before EIP. |
| 179 | `10100011` | `A3` | instruction: MOV [6004],EAX, byte 1/5 | Record the native error word; 3 means supervisor write to a present protected page. |
| 180 | `00000100` | `04` | instruction: MOV [6004],EAX, byte 2/5 | Record the native error word; 3 means supervisor write to a present protected page. |
| 181 | `01100000` | `60` | instruction: MOV [6004],EAX, byte 3/5 | Record the native error word; 3 means supervisor write to a present protected page. |
| 182 | `00000000` | `00` | instruction: MOV [6004],EAX, byte 4/5 | Record the native error word; 3 means supervisor write to a present protected page. |
| 183 | `00000000` | `00` | instruction: MOV [6004],EAX, byte 5/5 | Record the native error word; 3 means supervisor write to a present protected page. |
| 184 | `10001011` | `8B` | instruction: MOV EAX,[ESP+4], byte 1/4 | Read the unchanged saved EIP. |
| 185 | `01000100` | `44` | instruction: MOV EAX,[ESP+4], byte 2/4 | Read the unchanged saved EIP. |
| 186 | `00100100` | `24` | instruction: MOV EAX,[ESP+4], byte 3/4 | Read the unchanged saved EIP. |
| 187 | `00000100` | `04` | instruction: MOV EAX,[ESP+4], byte 4/4 | Read the unchanged saved EIP. |
| 188 | `10100011` | `A3` | instruction: MOV [6008],EAX, byte 1/5 | Record the faulting store address 7C99. |
| 189 | `00001000` | `08` | instruction: MOV [6008],EAX, byte 2/5 | Record the faulting store address 7C99. |
| 190 | `01100000` | `60` | instruction: MOV [6008],EAX, byte 3/5 | Record the faulting store address 7C99. |
| 191 | `00000000` | `00` | instruction: MOV [6008],EAX, byte 4/5 | Record the faulting store address 7C99. |
| 192 | `00000000` | `00` | instruction: MOV [6008],EAX, byte 5/5 | Record the faulting store address 7C99. |
| 193 | `00001111` | `0F` | instruction: MOV EAX,CR2, byte 1/3 | Read the CPU's actual faulting linear address. |
| 194 | `00100000` | `20` | instruction: MOV EAX,CR2, byte 2/3 | Read the CPU's actual faulting linear address. |
| 195 | `11010000` | `D0` | instruction: MOV EAX,CR2, byte 3/3 | Read the CPU's actual faulting linear address. |
| 196 | `10100011` | `A3` | instruction: MOV [600C],EAX, byte 1/5 | Record CR2=B000. |
| 197 | `00001100` | `0C` | instruction: MOV [600C],EAX, byte 2/5 | Record CR2=B000. |
| 198 | `01100000` | `60` | instruction: MOV [600C],EAX, byte 3/5 | Record CR2=B000. |
| 199 | `00000000` | `00` | instruction: MOV [600C],EAX, byte 4/5 | Record CR2=B000. |
| 200 | `00000000` | `00` | instruction: MOV [600C],EAX, byte 5/5 | Record CR2=B000. |
| 201 | `10001011` | `8B` | instruction: MOV EAX,[ESP+8], byte 1/4 | Read the saved code selector doubleword. |
| 202 | `01000100` | `44` | instruction: MOV EAX,[ESP+8], byte 2/4 | Read the saved code selector doubleword. |
| 203 | `00100100` | `24` | instruction: MOV EAX,[ESP+8], byte 3/4 | Read the saved code selector doubleword. |
| 204 | `00001000` | `08` | instruction: MOV EAX,[ESP+8], byte 4/4 | Read the saved code selector doubleword. |
| 205 | `10100011` | `A3` | instruction: MOV [6010],EAX, byte 1/5 | Record the original code selector. |
| 206 | `00010000` | `10` | instruction: MOV [6010],EAX, byte 2/5 | Record the original code selector. |
| 207 | `01100000` | `60` | instruction: MOV [6010],EAX, byte 3/5 | Record the original code selector. |
| 208 | `00000000` | `00` | instruction: MOV [6010],EAX, byte 4/5 | Record the original code selector. |
| 209 | `00000000` | `00` | instruction: MOV [6010],EAX, byte 5/5 | Record the original code selector. |
| 210 | `10001011` | `8B` | instruction: MOV EAX,[ESP+12], byte 1/4 | Read the CPU-saved flags with their original system bits. |
| 211 | `01000100` | `44` | instruction: MOV EAX,[ESP+12], byte 2/4 | Read the CPU-saved flags with their original system bits. |
| 212 | `00100100` | `24` | instruction: MOV EAX,[ESP+12], byte 3/4 | Read the CPU-saved flags with their original system bits. |
| 213 | `00001100` | `0C` | instruction: MOV EAX,[ESP+12], byte 4/4 | Read the CPU-saved flags with their original system bits. |
| 214 | `10100011` | `A3` | instruction: MOV [6014],EAX, byte 1/5 | Keep the complete saved flags for forensic inspection. |
| 215 | `00010100` | `14` | instruction: MOV [6014],EAX, byte 2/5 | Keep the complete saved flags for forensic inspection. |
| 216 | `01100000` | `60` | instruction: MOV [6014],EAX, byte 3/5 | Keep the complete saved flags for forensic inspection. |
| 217 | `00000000` | `00` | instruction: MOV [6014],EAX, byte 4/5 | Keep the complete saved flags for forensic inspection. |
| 218 | `00000000` | `00` | instruction: MOV [6014],EAX, byte 5/5 | Keep the complete saved flags for forensic inspection. |
| 219 | `11111111` | `FF` | instruction: INC dword [6000], byte 1/6 | Count this real exception entry. |
| 220 | `00000101` | `05` | instruction: INC dword [6000], byte 2/6 | Count this real exception entry. |
| 221 | `00000000` | `00` | instruction: INC dword [6000], byte 3/6 | Count this real exception entry. |
| 222 | `01100000` | `60` | instruction: INC dword [6000], byte 4/6 | Count this real exception entry. |
| 223 | `00000000` | `00` | instruction: INC dword [6000], byte 5/6 | Count this real exception entry. |
| 224 | `00000000` | `00` | instruction: INC dword [6000], byte 6/6 | Count this real exception entry. |
| 225 | `10000000` | `80` | instruction: OR byte [502C],2, byte 1/7 | Repair only the target page's writable permission. |
| 226 | `00001101` | `0D` | instruction: OR byte [502C],2, byte 2/7 | Repair only the target page's writable permission. |
| 227 | `00101100` | `2C` | instruction: OR byte [502C],2, byte 3/7 | Repair only the target page's writable permission. |
| 228 | `01010000` | `50` | instruction: OR byte [502C],2, byte 4/7 | Repair only the target page's writable permission. |
| 229 | `00000000` | `00` | instruction: OR byte [502C],2, byte 5/7 | Repair only the target page's writable permission. |
| 230 | `00000000` | `00` | instruction: OR byte [502C],2, byte 6/7 | Repair only the target page's writable permission. |
| 231 | `00000010` | `02` | instruction: OR byte [502C],2, byte 7/7 | Repair only the target page's writable permission. |
| 232 | `00001111` | `0F` | instruction: INVLPG [B000], byte 1/7 | Invalidate the target page's cached translation after changing its entry. |
| 233 | `00000001` | `01` | instruction: INVLPG [B000], byte 2/7 | Invalidate the target page's cached translation after changing its entry. |
| 234 | `00111101` | `3D` | instruction: INVLPG [B000], byte 3/7 | Invalidate the target page's cached translation after changing its entry. |
| 235 | `00000000` | `00` | instruction: INVLPG [B000], byte 4/7 | Invalidate the target page's cached translation after changing its entry. |
| 236 | `10110000` | `B0` | instruction: INVLPG [B000], byte 5/7 | Invalidate the target page's cached translation after changing its entry. |
| 237 | `00000000` | `00` | instruction: INVLPG [B000], byte 6/7 | Invalidate the target page's cached translation after changing its entry. |
| 238 | `00000000` | `00` | instruction: INVLPG [B000], byte 7/7 | Invalidate the target page's cached translation after changing its entry. |
| 239 | `10000011` | `83` | instruction: ADD ESP,4, byte 1/3 | Discard only the hardware error-code slot. |
| 240 | `11000100` | `C4` | instruction: ADD ESP,4, byte 2/3 | Discard only the hardware error-code slot. |
| 241 | `00000100` | `04` | instruction: ADD ESP,4, byte 3/3 | Discard only the hardware error-code slot. |
| 242 | `11001111` | `CF` | instruction: IRETD, byte 1/1 | Restore the original EIP, CS and EFLAGS so the exact store retries. |
| 243 | `00000000` | `00` | padding: GDT alignment, byte 1/13 | Put the descriptors at offset 256. |
| 244 | `00000000` | `00` | padding: GDT alignment, byte 2/13 | Put the descriptors at offset 256. |
| 245 | `00000000` | `00` | padding: GDT alignment, byte 3/13 | Put the descriptors at offset 256. |
| 246 | `00000000` | `00` | padding: GDT alignment, byte 4/13 | Put the descriptors at offset 256. |
| 247 | `00000000` | `00` | padding: GDT alignment, byte 5/13 | Put the descriptors at offset 256. |
| 248 | `00000000` | `00` | padding: GDT alignment, byte 6/13 | Put the descriptors at offset 256. |
| 249 | `00000000` | `00` | padding: GDT alignment, byte 7/13 | Put the descriptors at offset 256. |
| 250 | `00000000` | `00` | padding: GDT alignment, byte 8/13 | Put the descriptors at offset 256. |
| 251 | `00000000` | `00` | padding: GDT alignment, byte 9/13 | Put the descriptors at offset 256. |
| 252 | `00000000` | `00` | padding: GDT alignment, byte 10/13 | Put the descriptors at offset 256. |
| 253 | `00000000` | `00` | padding: GDT alignment, byte 11/13 | Put the descriptors at offset 256. |
| 254 | `00000000` | `00` | padding: GDT alignment, byte 12/13 | Put the descriptors at offset 256. |
| 255 | `00000000` | `00` | padding: GDT alignment, byte 13/13 | Put the descriptors at offset 256. |
| 256 | `00000000` | `00` | data: GDT null, byte 1/8 | Selector zero is unusable. |
| 257 | `00000000` | `00` | data: GDT null, byte 2/8 | Selector zero is unusable. |
| 258 | `00000000` | `00` | data: GDT null, byte 3/8 | Selector zero is unusable. |
| 259 | `00000000` | `00` | data: GDT null, byte 4/8 | Selector zero is unusable. |
| 260 | `00000000` | `00` | data: GDT null, byte 5/8 | Selector zero is unusable. |
| 261 | `00000000` | `00` | data: GDT null, byte 6/8 | Selector zero is unusable. |
| 262 | `00000000` | `00` | data: GDT null, byte 7/8 | Selector zero is unusable. |
| 263 | `00000000` | `00` | data: GDT null, byte 8/8 | Selector zero is unusable. |
| 264 | `11111111` | `FF` | data: GDT code, byte 1/8 | Flat present ring-zero 32-bit code. |
| 265 | `11111111` | `FF` | data: GDT code, byte 2/8 | Flat present ring-zero 32-bit code. |
| 266 | `00000000` | `00` | data: GDT code, byte 3/8 | Flat present ring-zero 32-bit code. |
| 267 | `00000000` | `00` | data: GDT code, byte 4/8 | Flat present ring-zero 32-bit code. |
| 268 | `00000000` | `00` | data: GDT code, byte 5/8 | Flat present ring-zero 32-bit code. |
| 269 | `10011010` | `9A` | data: GDT code, byte 6/8 | Flat present ring-zero 32-bit code. |
| 270 | `11001111` | `CF` | data: GDT code, byte 7/8 | Flat present ring-zero 32-bit code. |
| 271 | `00000000` | `00` | data: GDT code, byte 8/8 | Flat present ring-zero 32-bit code. |
| 272 | `11111111` | `FF` | data: GDT data, byte 1/8 | Flat writable data and a 32-bit stack. |
| 273 | `11111111` | `FF` | data: GDT data, byte 2/8 | Flat writable data and a 32-bit stack. |
| 274 | `00000000` | `00` | data: GDT data, byte 3/8 | Flat writable data and a 32-bit stack. |
| 275 | `00000000` | `00` | data: GDT data, byte 4/8 | Flat writable data and a 32-bit stack. |
| 276 | `00000000` | `00` | data: GDT data, byte 5/8 | Flat writable data and a 32-bit stack. |
| 277 | `10010010` | `92` | data: GDT data, byte 6/8 | Flat writable data and a 32-bit stack. |
| 278 | `11001111` | `CF` | data: GDT data, byte 7/8 | Flat writable data and a 32-bit stack. |
| 279 | `00000000` | `00` | data: GDT data, byte 8/8 | Flat writable data and a 32-bit stack. |
| 280 | `00010111` | `17` | data: GDTR, byte 1/6 | Limit 23 and base 00007D00. |
| 281 | `00000000` | `00` | data: GDTR, byte 2/6 | Limit 23 and base 00007D00. |
| 282 | `00000000` | `00` | data: GDTR, byte 3/6 | Limit 23 and base 00007D00. |
| 283 | `01111101` | `7D` | data: GDTR, byte 4/6 | Limit 23 and base 00007D00. |
| 284 | `00000000` | `00` | data: GDTR, byte 5/6 | Limit 23 and base 00007D00. |
| 285 | `00000000` | `00` | data: GDTR, byte 6/6 | Limit 23 and base 00007D00. |
| 286 | `01110111` | `77` | data: IDTR, byte 1/6 | Limit 119 and base 00007D30. |
| 287 | `00000000` | `00` | data: IDTR, byte 2/6 | Limit 119 and base 00007D30. |
| 288 | `00110000` | `30` | data: IDTR, byte 3/6 | Limit 119 and base 00007D30. |
| 289 | `01111101` | `7D` | data: IDTR, byte 4/6 | Limit 119 and base 00007D30. |
| 290 | `00000000` | `00` | data: IDTR, byte 5/6 | Limit 119 and base 00007D30. |
| 291 | `00000000` | `00` | data: IDTR, byte 6/6 | Limit 119 and base 00007D30. |
| 292 | `00000000` | `00` | padding: IDT alignment, byte 1/12 | Put vector zero at offset 304. |
| 293 | `00000000` | `00` | padding: IDT alignment, byte 2/12 | Put vector zero at offset 304. |
| 294 | `00000000` | `00` | padding: IDT alignment, byte 3/12 | Put vector zero at offset 304. |
| 295 | `00000000` | `00` | padding: IDT alignment, byte 4/12 | Put vector zero at offset 304. |
| 296 | `00000000` | `00` | padding: IDT alignment, byte 5/12 | Put vector zero at offset 304. |
| 297 | `00000000` | `00` | padding: IDT alignment, byte 6/12 | Put vector zero at offset 304. |
| 298 | `00000000` | `00` | padding: IDT alignment, byte 7/12 | Put vector zero at offset 304. |
| 299 | `00000000` | `00` | padding: IDT alignment, byte 8/12 | Put vector zero at offset 304. |
| 300 | `00000000` | `00` | padding: IDT alignment, byte 9/12 | Put vector zero at offset 304. |
| 301 | `00000000` | `00` | padding: IDT alignment, byte 10/12 | Put vector zero at offset 304. |
| 302 | `00000000` | `00` | padding: IDT alignment, byte 11/12 | Put vector zero at offset 304. |
| 303 | `00000000` | `00` | padding: IDT alignment, byte 12/12 | Put vector zero at offset 304. |
| 304 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 1/16 | Null gates outside this controlled page fault. |
| 305 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 2/16 | Null gates outside this controlled page fault. |
| 306 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 3/16 | Null gates outside this controlled page fault. |
| 307 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 4/16 | Null gates outside this controlled page fault. |
| 308 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 5/16 | Null gates outside this controlled page fault. |
| 309 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 6/16 | Null gates outside this controlled page fault. |
| 310 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 7/16 | Null gates outside this controlled page fault. |
| 311 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 8/16 | Null gates outside this controlled page fault. |
| 312 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 9/16 | Null gates outside this controlled page fault. |
| 313 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 10/16 | Null gates outside this controlled page fault. |
| 314 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 11/16 | Null gates outside this controlled page fault. |
| 315 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 12/16 | Null gates outside this controlled page fault. |
| 316 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 13/16 | Null gates outside this controlled page fault. |
| 317 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 14/16 | Null gates outside this controlled page fault. |
| 318 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 15/16 | Null gates outside this controlled page fault. |
| 319 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 16/16 | Null gates outside this controlled page fault. |
| 320 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 1/16 | Null gates outside this controlled page fault. |
| 321 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 2/16 | Null gates outside this controlled page fault. |
| 322 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 3/16 | Null gates outside this controlled page fault. |
| 323 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 4/16 | Null gates outside this controlled page fault. |
| 324 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 5/16 | Null gates outside this controlled page fault. |
| 325 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 6/16 | Null gates outside this controlled page fault. |
| 326 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 7/16 | Null gates outside this controlled page fault. |
| 327 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 8/16 | Null gates outside this controlled page fault. |
| 328 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 9/16 | Null gates outside this controlled page fault. |
| 329 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 10/16 | Null gates outside this controlled page fault. |
| 330 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 11/16 | Null gates outside this controlled page fault. |
| 331 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 12/16 | Null gates outside this controlled page fault. |
| 332 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 13/16 | Null gates outside this controlled page fault. |
| 333 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 14/16 | Null gates outside this controlled page fault. |
| 334 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 15/16 | Null gates outside this controlled page fault. |
| 335 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 16/16 | Null gates outside this controlled page fault. |
| 336 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 1/16 | Null gates outside this controlled page fault. |
| 337 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 2/16 | Null gates outside this controlled page fault. |
| 338 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 3/16 | Null gates outside this controlled page fault. |
| 339 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 4/16 | Null gates outside this controlled page fault. |
| 340 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 5/16 | Null gates outside this controlled page fault. |
| 341 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 6/16 | Null gates outside this controlled page fault. |
| 342 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 7/16 | Null gates outside this controlled page fault. |
| 343 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 8/16 | Null gates outside this controlled page fault. |
| 344 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 9/16 | Null gates outside this controlled page fault. |
| 345 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 10/16 | Null gates outside this controlled page fault. |
| 346 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 11/16 | Null gates outside this controlled page fault. |
| 347 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 12/16 | Null gates outside this controlled page fault. |
| 348 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 13/16 | Null gates outside this controlled page fault. |
| 349 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 14/16 | Null gates outside this controlled page fault. |
| 350 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 15/16 | Null gates outside this controlled page fault. |
| 351 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 16/16 | Null gates outside this controlled page fault. |
| 352 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 1/16 | Null gates outside this controlled page fault. |
| 353 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 2/16 | Null gates outside this controlled page fault. |
| 354 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 3/16 | Null gates outside this controlled page fault. |
| 355 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 4/16 | Null gates outside this controlled page fault. |
| 356 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 5/16 | Null gates outside this controlled page fault. |
| 357 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 6/16 | Null gates outside this controlled page fault. |
| 358 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 7/16 | Null gates outside this controlled page fault. |
| 359 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 8/16 | Null gates outside this controlled page fault. |
| 360 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 9/16 | Null gates outside this controlled page fault. |
| 361 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 10/16 | Null gates outside this controlled page fault. |
| 362 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 11/16 | Null gates outside this controlled page fault. |
| 363 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 12/16 | Null gates outside this controlled page fault. |
| 364 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 13/16 | Null gates outside this controlled page fault. |
| 365 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 14/16 | Null gates outside this controlled page fault. |
| 366 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 15/16 | Null gates outside this controlled page fault. |
| 367 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 16/16 | Null gates outside this controlled page fault. |
| 368 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 1/16 | Null gates outside this controlled page fault. |
| 369 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 2/16 | Null gates outside this controlled page fault. |
| 370 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 3/16 | Null gates outside this controlled page fault. |
| 371 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 4/16 | Null gates outside this controlled page fault. |
| 372 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 5/16 | Null gates outside this controlled page fault. |
| 373 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 6/16 | Null gates outside this controlled page fault. |
| 374 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 7/16 | Null gates outside this controlled page fault. |
| 375 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 8/16 | Null gates outside this controlled page fault. |
| 376 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 9/16 | Null gates outside this controlled page fault. |
| 377 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 10/16 | Null gates outside this controlled page fault. |
| 378 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 11/16 | Null gates outside this controlled page fault. |
| 379 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 12/16 | Null gates outside this controlled page fault. |
| 380 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 13/16 | Null gates outside this controlled page fault. |
| 381 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 14/16 | Null gates outside this controlled page fault. |
| 382 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 15/16 | Null gates outside this controlled page fault. |
| 383 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 16/16 | Null gates outside this controlled page fault. |
| 384 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 1/16 | Null gates outside this controlled page fault. |
| 385 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 2/16 | Null gates outside this controlled page fault. |
| 386 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 3/16 | Null gates outside this controlled page fault. |
| 387 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 4/16 | Null gates outside this controlled page fault. |
| 388 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 5/16 | Null gates outside this controlled page fault. |
| 389 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 6/16 | Null gates outside this controlled page fault. |
| 390 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 7/16 | Null gates outside this controlled page fault. |
| 391 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 8/16 | Null gates outside this controlled page fault. |
| 392 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 9/16 | Null gates outside this controlled page fault. |
| 393 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 10/16 | Null gates outside this controlled page fault. |
| 394 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 11/16 | Null gates outside this controlled page fault. |
| 395 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 12/16 | Null gates outside this controlled page fault. |
| 396 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 13/16 | Null gates outside this controlled page fault. |
| 397 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 14/16 | Null gates outside this controlled page fault. |
| 398 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 15/16 | Null gates outside this controlled page fault. |
| 399 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 16/16 | Null gates outside this controlled page fault. |
| 400 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 1/16 | Null gates outside this controlled page fault. |
| 401 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 2/16 | Null gates outside this controlled page fault. |
| 402 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 3/16 | Null gates outside this controlled page fault. |
| 403 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 4/16 | Null gates outside this controlled page fault. |
| 404 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 5/16 | Null gates outside this controlled page fault. |
| 405 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 6/16 | Null gates outside this controlled page fault. |
| 406 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 7/16 | Null gates outside this controlled page fault. |
| 407 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 8/16 | Null gates outside this controlled page fault. |
| 408 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 9/16 | Null gates outside this controlled page fault. |
| 409 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 10/16 | Null gates outside this controlled page fault. |
| 410 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 11/16 | Null gates outside this controlled page fault. |
| 411 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 12/16 | Null gates outside this controlled page fault. |
| 412 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 13/16 | Null gates outside this controlled page fault. |
| 413 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 14/16 | Null gates outside this controlled page fault. |
| 414 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 15/16 | Null gates outside this controlled page fault. |
| 415 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 16/16 | Null gates outside this controlled page fault. |
| 416 | `10110000` | `B0` | data: IDT vector 0E, byte 1/8 | Present DPL0 interrupt gate to selector 0008, offset 00007CB0. |
| 417 | `01111100` | `7C` | data: IDT vector 0E, byte 2/8 | Present DPL0 interrupt gate to selector 0008, offset 00007CB0. |
| 418 | `00001000` | `08` | data: IDT vector 0E, byte 3/8 | Present DPL0 interrupt gate to selector 0008, offset 00007CB0. |
| 419 | `00000000` | `00` | data: IDT vector 0E, byte 4/8 | Present DPL0 interrupt gate to selector 0008, offset 00007CB0. |
| 420 | `00000000` | `00` | data: IDT vector 0E, byte 5/8 | Present DPL0 interrupt gate to selector 0008, offset 00007CB0. |
| 421 | `10001110` | `8E` | data: IDT vector 0E, byte 6/8 | Present DPL0 interrupt gate to selector 0008, offset 00007CB0. |
| 422 | `00000000` | `00` | data: IDT vector 0E, byte 7/8 | Present DPL0 interrupt gate to selector 0008, offset 00007CB0. |
| 423 | `00000000` | `00` | data: IDT vector 0E, byte 8/8 | Present DPL0 interrupt gate to selector 0008, offset 00007CB0. |
