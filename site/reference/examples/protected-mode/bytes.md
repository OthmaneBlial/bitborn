# Every byte explained

Generated from canonical `.bits` annotations by `python3 tools/byte_tables.py`.

Instruction names below are disassembly for explanation, never code-generation input.

| Offset | Binary | Hex | Range / byte within it | Encoding explanation |
| --- | --- | --- | --- | --- |
| 0 | `11111010` | `FA` | instruction: CLI, byte 1/1 | FA clears IF before changing mode; no external IRQs are handled. |
| 1 | `00110001` | `31` | instruction: XOR AX,AX, byte 1/2 | 31 C0 selects real-mode segment base zero. |
| 2 | `11000000` | `C0` | instruction: XOR AX,AX, byte 2/2 | 31 C0 selects real-mode segment base zero. |
| 3 | `10001110` | `8E` | instruction: MOV DS,AX, byte 1/2 | 8E D8 makes the descriptor pointers addressable through DS=0000. |
| 4 | `11011000` | `D8` | instruction: MOV DS,AX, byte 2/2 | 8E D8 makes the descriptor pointers addressable through DS=0000. |
| 5 | `10001110` | `8E` | instruction: MOV SS,AX, byte 1/2 | 8E D0 selects the initial real-mode stack segment. |
| 6 | `11010000` | `D0` | instruction: MOV SS,AX, byte 2/2 | 8E D0 selects the initial real-mode stack segment. |
| 7 | `10111100` | `BC` | instruction: MOV SP,7C00, byte 1/3 | BC imm16 puts the initial stack below the loader. |
| 8 | `00000000` | `00` | instruction: MOV SP,7C00, byte 2/3 | BC imm16 puts the initial stack below the loader. |
| 9 | `01111100` | `7C` | instruction: MOV SP,7C00, byte 3/3 | BC imm16 puts the initial stack below the loader. |
| 10 | `11111100` | `FC` | instruction: CLD, byte 1/1 | FC clears direction for a deterministic initial flag. |
| 11 | `10110000` | `B0` | instruction: MOV AL,FF, byte 1/2 | B0 FF prepares all eight PIC mask bits. |
| 12 | `11111111` | `FF` | instruction: MOV AL,FF, byte 2/2 | B0 FF prepares all eight PIC mask bits. |
| 13 | `11100110` | `E6` | instruction: OUT 21,AL, byte 1/2 | E6 21 masks all eight master PIC IRQ lines. |
| 14 | `00100001` | `21` | instruction: OUT 21,AL, byte 2/2 | E6 21 masks all eight master PIC IRQ lines. |
| 15 | `11100110` | `E6` | instruction: OUT A1,AL, byte 1/2 | E6 A1 masks all eight slave PIC IRQ lines. |
| 16 | `10100001` | `A1` | instruction: OUT A1,AL, byte 2/2 | E6 A1 masks all eight slave PIC IRQ lines. |
| 17 | `00001111` | `0F` | instruction: LGDT [7F18], byte 1/5 | 0F 01 /2 with real-mode ModRM 16 and disp16 loads the six-byte GDTR pointer. |
| 18 | `00000001` | `01` | instruction: LGDT [7F18], byte 2/5 | 0F 01 /2 with real-mode ModRM 16 and disp16 loads the six-byte GDTR pointer. |
| 19 | `00010110` | `16` | instruction: LGDT [7F18], byte 3/5 | 0F 01 /2 with real-mode ModRM 16 and disp16 loads the six-byte GDTR pointer. |
| 20 | `00011000` | `18` | instruction: LGDT [7F18], byte 4/5 | 0F 01 /2 with real-mode ModRM 16 and disp16 loads the six-byte GDTR pointer. |
| 21 | `01111111` | `7F` | instruction: LGDT [7F18], byte 5/5 | 0F 01 /2 with real-mode ModRM 16 and disp16 loads the six-byte GDTR pointer. |
| 22 | `00001111` | `0F` | instruction: MOV EAX,CR0, byte 1/3 | 0F 20 /r C0 reads the control register into a 32-bit general register. |
| 23 | `00100000` | `20` | instruction: MOV EAX,CR0, byte 2/3 | 0F 20 /r C0 reads the control register into a 32-bit general register. |
| 24 | `11000000` | `C0` | instruction: MOV EAX,CR0, byte 3/3 | 0F 20 /r C0 reads the control register into a 32-bit general register. |
| 25 | `01100110` | `66` | instruction: OR EAX,1, byte 1/4 | 66 selects a 32-bit operand; 83 /1 C8 sign-extends imm8 01 to set only CR0.PE. |
| 26 | `10000011` | `83` | instruction: OR EAX,1, byte 2/4 | 66 selects a 32-bit operand; 83 /1 C8 sign-extends imm8 01 to set only CR0.PE. |
| 27 | `11001000` | `C8` | instruction: OR EAX,1, byte 3/4 | 66 selects a 32-bit operand; 83 /1 C8 sign-extends imm8 01 to set only CR0.PE. |
| 28 | `00000001` | `01` | instruction: OR EAX,1, byte 4/4 | 66 selects a 32-bit operand; 83 /1 C8 sign-extends imm8 01 to set only CR0.PE. |
| 29 | `00001111` | `0F` | instruction: MOV CR0,EAX, byte 1/3 | 0F 22 /r C0 enables protected mode while preserving the other CR0 bits. |
| 30 | `00100010` | `22` | instruction: MOV CR0,EAX, byte 2/3 | 0F 22 /r C0 enables protected mode while preserving the other CR0 bits. |
| 31 | `11000000` | `C0` | instruction: MOV CR0,EAX, byte 3/3 | 0F 22 /r C0 enables protected mode while preserving the other CR0 bits. |
| 32 | `01100110` | `66` | instruction: JMP 0008:00007E40, byte 1/8 | 66 EA ptr16:32 supplies offset 00007E40 then selector 0008, loading the GDT code descriptor. |
| 33 | `11101010` | `EA` | instruction: JMP 0008:00007E40, byte 2/8 | 66 EA ptr16:32 supplies offset 00007E40 then selector 0008, loading the GDT code descriptor. |
| 34 | `01000000` | `40` | instruction: JMP 0008:00007E40, byte 3/8 | 66 EA ptr16:32 supplies offset 00007E40 then selector 0008, loading the GDT code descriptor. |
| 35 | `01111110` | `7E` | instruction: JMP 0008:00007E40, byte 4/8 | 66 EA ptr16:32 supplies offset 00007E40 then selector 0008, loading the GDT code descriptor. |
| 36 | `00000000` | `00` | instruction: JMP 0008:00007E40, byte 5/8 | 66 EA ptr16:32 supplies offset 00007E40 then selector 0008, loading the GDT code descriptor. |
| 37 | `00000000` | `00` | instruction: JMP 0008:00007E40, byte 6/8 | 66 EA ptr16:32 supplies offset 00007E40 then selector 0008, loading the GDT code descriptor. |
| 38 | `00001000` | `08` | instruction: JMP 0008:00007E40, byte 7/8 | 66 EA ptr16:32 supplies offset 00007E40 then selector 0008, loading the GDT code descriptor. |
| 39 | `00000000` | `00` | instruction: JMP 0008:00007E40, byte 8/8 | 66 EA ptr16:32 supplies offset 00007E40 then selector 0008, loading the GDT code descriptor. |
| 40 | `00000000` | `00` | padding: Entry alignment part 1, byte 1/16 | Far JMP skips these bytes; they are not executed. |
| 41 | `00000000` | `00` | padding: Entry alignment part 1, byte 2/16 | Far JMP skips these bytes; they are not executed. |
| 42 | `00000000` | `00` | padding: Entry alignment part 1, byte 3/16 | Far JMP skips these bytes; they are not executed. |
| 43 | `00000000` | `00` | padding: Entry alignment part 1, byte 4/16 | Far JMP skips these bytes; they are not executed. |
| 44 | `00000000` | `00` | padding: Entry alignment part 1, byte 5/16 | Far JMP skips these bytes; they are not executed. |
| 45 | `00000000` | `00` | padding: Entry alignment part 1, byte 6/16 | Far JMP skips these bytes; they are not executed. |
| 46 | `00000000` | `00` | padding: Entry alignment part 1, byte 7/16 | Far JMP skips these bytes; they are not executed. |
| 47 | `00000000` | `00` | padding: Entry alignment part 1, byte 8/16 | Far JMP skips these bytes; they are not executed. |
| 48 | `00000000` | `00` | padding: Entry alignment part 1, byte 9/16 | Far JMP skips these bytes; they are not executed. |
| 49 | `00000000` | `00` | padding: Entry alignment part 1, byte 10/16 | Far JMP skips these bytes; they are not executed. |
| 50 | `00000000` | `00` | padding: Entry alignment part 1, byte 11/16 | Far JMP skips these bytes; they are not executed. |
| 51 | `00000000` | `00` | padding: Entry alignment part 1, byte 12/16 | Far JMP skips these bytes; they are not executed. |
| 52 | `00000000` | `00` | padding: Entry alignment part 1, byte 13/16 | Far JMP skips these bytes; they are not executed. |
| 53 | `00000000` | `00` | padding: Entry alignment part 1, byte 14/16 | Far JMP skips these bytes; they are not executed. |
| 54 | `00000000` | `00` | padding: Entry alignment part 1, byte 15/16 | Far JMP skips these bytes; they are not executed. |
| 55 | `00000000` | `00` | padding: Entry alignment part 1, byte 16/16 | Far JMP skips these bytes; they are not executed. |
| 56 | `00000000` | `00` | padding: Entry alignment part 2, byte 1/8 | Eight more bytes put the 32-bit entry at source offset 64, physical 7E40. |
| 57 | `00000000` | `00` | padding: Entry alignment part 2, byte 2/8 | Eight more bytes put the 32-bit entry at source offset 64, physical 7E40. |
| 58 | `00000000` | `00` | padding: Entry alignment part 2, byte 3/8 | Eight more bytes put the 32-bit entry at source offset 64, physical 7E40. |
| 59 | `00000000` | `00` | padding: Entry alignment part 2, byte 4/8 | Eight more bytes put the 32-bit entry at source offset 64, physical 7E40. |
| 60 | `00000000` | `00` | padding: Entry alignment part 2, byte 5/8 | Eight more bytes put the 32-bit entry at source offset 64, physical 7E40. |
| 61 | `00000000` | `00` | padding: Entry alignment part 2, byte 6/8 | Eight more bytes put the 32-bit entry at source offset 64, physical 7E40. |
| 62 | `00000000` | `00` | padding: Entry alignment part 2, byte 7/8 | Eight more bytes put the 32-bit entry at source offset 64, physical 7E40. |
| 63 | `00000000` | `00` | padding: Entry alignment part 2, byte 8/8 | Eight more bytes put the 32-bit entry at source offset 64, physical 7E40. |
| 64 | `10111000` | `B8` | instruction: MOV EAX,00000010, byte 1/5 | B8 imm32 selects GDT entry two, the writable flat data descriptor. |
| 65 | `00010000` | `10` | instruction: MOV EAX,00000010, byte 2/5 | B8 imm32 selects GDT entry two, the writable flat data descriptor. |
| 66 | `00000000` | `00` | instruction: MOV EAX,00000010, byte 3/5 | B8 imm32 selects GDT entry two, the writable flat data descriptor. |
| 67 | `00000000` | `00` | instruction: MOV EAX,00000010, byte 4/5 | B8 imm32 selects GDT entry two, the writable flat data descriptor. |
| 68 | `00000000` | `00` | instruction: MOV EAX,00000010, byte 5/5 | B8 imm32 selects GDT entry two, the writable flat data descriptor. |
| 69 | `10001110` | `8E` | instruction: MOV DS,AX, byte 1/2 | 8E D8 loads data selector 0010 from AX; this instruction uses a 16-bit selector in 32-bit code. |
| 70 | `11011000` | `D8` | instruction: MOV DS,AX, byte 2/2 | 8E D8 loads data selector 0010 from AX; this instruction uses a 16-bit selector in 32-bit code. |
| 71 | `10001110` | `8E` | instruction: MOV ES,AX, byte 1/2 | 8E C0 loads the same flat data descriptor into ES. |
| 72 | `11000000` | `C0` | instruction: MOV ES,AX, byte 2/2 | 8E C0 loads the same flat data descriptor into ES. |
| 73 | `10001110` | `8E` | instruction: MOV FS,AX, byte 1/2 | 8E E0 loads the flat data descriptor into FS. |
| 74 | `11100000` | `E0` | instruction: MOV FS,AX, byte 2/2 | 8E E0 loads the flat data descriptor into FS. |
| 75 | `10001110` | `8E` | instruction: MOV GS,AX, byte 1/2 | 8E E8 loads the flat data descriptor into GS. |
| 76 | `11101000` | `E8` | instruction: MOV GS,AX, byte 2/2 | 8E E8 loads the flat data descriptor into GS. |
| 77 | `10001110` | `8E` | instruction: MOV SS,AX, byte 1/2 | 8E D0 loads the writable flat 32-bit stack descriptor. |
| 78 | `11010000` | `D0` | instruction: MOV SS,AX, byte 2/2 | 8E D0 loads the writable flat 32-bit stack descriptor. |
| 79 | `10111100` | `BC` | instruction: MOV ESP,00009000, byte 1/5 | BC imm32 places the downward-growing stack below physical 9000. |
| 80 | `00000000` | `00` | instruction: MOV ESP,00009000, byte 2/5 | BC imm32 places the downward-growing stack below physical 9000. |
| 81 | `10010000` | `90` | instruction: MOV ESP,00009000, byte 3/5 | BC imm32 places the downward-growing stack below physical 9000. |
| 82 | `00000000` | `00` | instruction: MOV ESP,00009000, byte 4/5 | BC imm32 places the downward-growing stack below physical 9000. |
| 83 | `00000000` | `00` | instruction: MOV ESP,00009000, byte 5/5 | BC imm32 places the downward-growing stack below physical 9000. |
| 84 | `00001111` | `0F` | instruction: LIDT [00007F1E], byte 1/7 | 0F 01 /3 with ModRM 1D and disp32 loads the six-byte IDTR pointer. |
| 85 | `00000001` | `01` | instruction: LIDT [00007F1E], byte 2/7 | 0F 01 /3 with ModRM 1D and disp32 loads the six-byte IDTR pointer. |
| 86 | `00011101` | `1D` | instruction: LIDT [00007F1E], byte 3/7 | 0F 01 /3 with ModRM 1D and disp32 loads the six-byte IDTR pointer. |
| 87 | `00011110` | `1E` | instruction: LIDT [00007F1E], byte 4/7 | 0F 01 /3 with ModRM 1D and disp32 loads the six-byte IDTR pointer. |
| 88 | `01111111` | `7F` | instruction: LIDT [00007F1E], byte 5/7 | 0F 01 /3 with ModRM 1D and disp32 loads the six-byte IDTR pointer. |
| 89 | `00000000` | `00` | instruction: LIDT [00007F1E], byte 6/7 | 0F 01 /3 with ModRM 1D and disp32 loads the six-byte IDTR pointer. |
| 90 | `00000000` | `00` | instruction: LIDT [00007F1E], byte 7/7 | 0F 01 /3 with ModRM 1D and disp32 loads the six-byte IDTR pointer. |
| 91 | `10111000` | `B8` | instruction: MOV EAX,11223344, byte 1/5 | B8 imm32 demonstrates all four little-endian immediate bytes in 32-bit mode. |
| 92 | `01000100` | `44` | instruction: MOV EAX,11223344, byte 2/5 | B8 imm32 demonstrates all four little-endian immediate bytes in 32-bit mode. |
| 93 | `00110011` | `33` | instruction: MOV EAX,11223344, byte 3/5 | B8 imm32 demonstrates all four little-endian immediate bytes in 32-bit mode. |
| 94 | `00100010` | `22` | instruction: MOV EAX,11223344, byte 4/5 | B8 imm32 demonstrates all four little-endian immediate bytes in 32-bit mode. |
| 95 | `00010001` | `11` | instruction: MOV EAX,11223344, byte 5/5 | B8 imm32 demonstrates all four little-endian immediate bytes in 32-bit mode. |
| 96 | `10100011` | `A3` | instruction: MOV [00009000],EAX, byte 1/5 | A3 moffs32 stores 44 33 22 11 through flat DS into physical RAM 9000. |
| 97 | `00000000` | `00` | instruction: MOV [00009000],EAX, byte 2/5 | A3 moffs32 stores 44 33 22 11 through flat DS into physical RAM 9000. |
| 98 | `10010000` | `90` | instruction: MOV [00009000],EAX, byte 3/5 | A3 moffs32 stores 44 33 22 11 through flat DS into physical RAM 9000. |
| 99 | `00000000` | `00` | instruction: MOV [00009000],EAX, byte 4/5 | A3 moffs32 stores 44 33 22 11 through flat DS into physical RAM 9000. |
| 100 | `00000000` | `00` | instruction: MOV [00009000],EAX, byte 5/5 | A3 moffs32 stores 44 33 22 11 through flat DS into physical RAM 9000. |
| 101 | `10001011` | `8B` | instruction: MOV EBX,[00009000], byte 1/6 | 8B /r ModRM 1D selects EBX and an absolute disp32, reading the stored doubleword back. |
| 102 | `00011101` | `1D` | instruction: MOV EBX,[00009000], byte 2/6 | 8B /r ModRM 1D selects EBX and an absolute disp32, reading the stored doubleword back. |
| 103 | `00000000` | `00` | instruction: MOV EBX,[00009000], byte 3/6 | 8B /r ModRM 1D selects EBX and an absolute disp32, reading the stored doubleword back. |
| 104 | `10010000` | `90` | instruction: MOV EBX,[00009000], byte 4/6 | 8B /r ModRM 1D selects EBX and an absolute disp32, reading the stored doubleword back. |
| 105 | `00000000` | `00` | instruction: MOV EBX,[00009000], byte 5/6 | 8B /r ModRM 1D selects EBX and an absolute disp32, reading the stored doubleword back. |
| 106 | `00000000` | `00` | instruction: MOV EBX,[00009000], byte 6/6 | 8B /r ModRM 1D selects EBX and an absolute disp32, reading the stored doubleword back. |
| 107 | `11001101` | `CD` | instruction: INT 20, byte 1/2 | CD 20 dispatches through IDT vector 32, a present ring-zero 32-bit interrupt gate. |
| 108 | `00100000` | `20` | instruction: INT 20, byte 2/2 | CD 20 dispatches through IDT vector 32, a present ring-zero 32-bit interrupt gate. |
| 109 | `10001011` | `8B` | instruction: MOV EDX,[00009004], byte 1/6 | 8B /r ModRM 15 reads the marker left by the returned interrupt handler. |
| 110 | `00010101` | `15` | instruction: MOV EDX,[00009004], byte 2/6 | 8B /r ModRM 15 reads the marker left by the returned interrupt handler. |
| 111 | `00000100` | `04` | instruction: MOV EDX,[00009004], byte 3/6 | 8B /r ModRM 15 reads the marker left by the returned interrupt handler. |
| 112 | `10010000` | `90` | instruction: MOV EDX,[00009004], byte 4/6 | 8B /r ModRM 15 reads the marker left by the returned interrupt handler. |
| 113 | `00000000` | `00` | instruction: MOV EDX,[00009004], byte 5/6 | 8B /r ModRM 15 reads the marker left by the returned interrupt handler. |
| 114 | `00000000` | `00` | instruction: MOV EDX,[00009004], byte 6/6 | 8B /r ModRM 15 reads the marker left by the returned interrupt handler. |
| 115 | `10000001` | `81` | instruction: CMP EBX,11223344, byte 1/6 | 81 /7 FB compares the flat-memory readback against the known 32-bit value. |
| 116 | `11111011` | `FB` | instruction: CMP EBX,11223344, byte 2/6 | 81 /7 FB compares the flat-memory readback against the known 32-bit value. |
| 117 | `01000100` | `44` | instruction: CMP EBX,11223344, byte 3/6 | 81 /7 FB compares the flat-memory readback against the known 32-bit value. |
| 118 | `00110011` | `33` | instruction: CMP EBX,11223344, byte 4/6 | 81 /7 FB compares the flat-memory readback against the known 32-bit value. |
| 119 | `00100010` | `22` | instruction: CMP EBX,11223344, byte 5/6 | 81 /7 FB compares the flat-memory readback against the known 32-bit value. |
| 120 | `00010001` | `11` | instruction: CMP EBX,11223344, byte 6/6 | 81 /7 FB compares the flat-memory readback against the known 32-bit value. |
| 121 | `01110101` | `75` | instruction: JNE failure_from_ram, byte 1/2 | 75 rel8; next address 7E7B plus 1A reaches the controlled failure path at 7E95. |
| 122 | `00011010` | `1A` | instruction: JNE failure_from_ram, byte 2/2 | 75 rel8; next address 7E7B plus 1A reaches the controlled failure path at 7E95. |
| 123 | `10000001` | `81` | instruction: CMP EDX,C0DEC0DE, byte 1/6 | 81 /7 FA checks that the software interrupt handler executed and returned. |
| 124 | `11111010` | `FA` | instruction: CMP EDX,C0DEC0DE, byte 2/6 | 81 /7 FA checks that the software interrupt handler executed and returned. |
| 125 | `11011110` | `DE` | instruction: CMP EDX,C0DEC0DE, byte 3/6 | 81 /7 FA checks that the software interrupt handler executed and returned. |
| 126 | `11000000` | `C0` | instruction: CMP EDX,C0DEC0DE, byte 4/6 | 81 /7 FA checks that the software interrupt handler executed and returned. |
| 127 | `11011110` | `DE` | instruction: CMP EDX,C0DEC0DE, byte 5/6 | 81 /7 FA checks that the software interrupt handler executed and returned. |
| 128 | `11000000` | `C0` | instruction: CMP EDX,C0DEC0DE, byte 6/6 | 81 /7 FA checks that the software interrupt handler executed and returned. |
| 129 | `01110101` | `75` | instruction: JNE failure_from_handler, byte 1/2 | 75 rel8; next address 7E83 plus 12 reaches the controlled failure path at 7E95. |
| 130 | `00010010` | `12` | instruction: JNE failure_from_handler, byte 2/2 | 75 rel8; next address 7E83 plus 12 reaches the controlled failure path at 7E95. |
| 131 | `10111001` | `B9` | instruction: MOV ECX,4B4F4D50, byte 1/5 | B9 imm32 records ASCII PMOK in ECX, a success predicate independent of screen output. |
| 132 | `01010000` | `50` | instruction: MOV ECX,4B4F4D50, byte 2/5 | B9 imm32 records ASCII PMOK in ECX, a success predicate independent of screen output. |
| 133 | `01001101` | `4D` | instruction: MOV ECX,4B4F4D50, byte 3/5 | B9 imm32 records ASCII PMOK in ECX, a success predicate independent of screen output. |
| 134 | `01001111` | `4F` | instruction: MOV ECX,4B4F4D50, byte 4/5 | B9 imm32 records ASCII PMOK in ECX, a success predicate independent of screen output. |
| 135 | `01001011` | `4B` | instruction: MOV ECX,4B4F4D50, byte 5/5 | B9 imm32 records ASCII PMOK in ECX, a success predicate independent of screen output. |
| 136 | `11000111` | `C7` | instruction: MOV dword [000B8000],0A4D0A50, byte 1/10 | C7 /0 ModRM 05 writes P and M with green attributes directly to VGA text memory. |
| 137 | `00000101` | `05` | instruction: MOV dword [000B8000],0A4D0A50, byte 2/10 | C7 /0 ModRM 05 writes P and M with green attributes directly to VGA text memory. |
| 138 | `00000000` | `00` | instruction: MOV dword [000B8000],0A4D0A50, byte 3/10 | C7 /0 ModRM 05 writes P and M with green attributes directly to VGA text memory. |
| 139 | `10000000` | `80` | instruction: MOV dword [000B8000],0A4D0A50, byte 4/10 | C7 /0 ModRM 05 writes P and M with green attributes directly to VGA text memory. |
| 140 | `00001011` | `0B` | instruction: MOV dword [000B8000],0A4D0A50, byte 5/10 | C7 /0 ModRM 05 writes P and M with green attributes directly to VGA text memory. |
| 141 | `00000000` | `00` | instruction: MOV dword [000B8000],0A4D0A50, byte 6/10 | C7 /0 ModRM 05 writes P and M with green attributes directly to VGA text memory. |
| 142 | `01010000` | `50` | instruction: MOV dword [000B8000],0A4D0A50, byte 7/10 | C7 /0 ModRM 05 writes P and M with green attributes directly to VGA text memory. |
| 143 | `00001010` | `0A` | instruction: MOV dword [000B8000],0A4D0A50, byte 8/10 | C7 /0 ModRM 05 writes P and M with green attributes directly to VGA text memory. |
| 144 | `01001101` | `4D` | instruction: MOV dword [000B8000],0A4D0A50, byte 9/10 | C7 /0 ModRM 05 writes P and M with green attributes directly to VGA text memory. |
| 145 | `00001010` | `0A` | instruction: MOV dword [000B8000],0A4D0A50, byte 10/10 | C7 /0 ModRM 05 writes P and M with green attributes directly to VGA text memory. |
| 146 | `11110100` | `F4` | instruction: HLT success, byte 1/1 | F4 halts at 7E92 with IF=0; EIP becomes 7E93 and the guest remains halted. |
| 147 | `11101011` | `EB` | instruction: JMP success_halt, byte 1/2 | EB FD returns to the preceding HLT if execution is resumed. |
| 148 | `11111101` | `FD` | instruction: JMP success_halt, byte 2/2 | EB FD returns to the preceding HLT if execution is resumed. |
| 149 | `10111001` | `B9` | instruction: MOV ECX,4C494146, byte 1/5 | B9 imm32 records ASCII FAIL for a failed RAM or handler comparison. |
| 150 | `01000110` | `46` | instruction: MOV ECX,4C494146, byte 2/5 | B9 imm32 records ASCII FAIL for a failed RAM or handler comparison. |
| 151 | `01000001` | `41` | instruction: MOV ECX,4C494146, byte 3/5 | B9 imm32 records ASCII FAIL for a failed RAM or handler comparison. |
| 152 | `01001001` | `49` | instruction: MOV ECX,4C494146, byte 4/5 | B9 imm32 records ASCII FAIL for a failed RAM or handler comparison. |
| 153 | `01001100` | `4C` | instruction: MOV ECX,4C494146, byte 5/5 | B9 imm32 records ASCII FAIL for a failed RAM or handler comparison. |
| 154 | `11110100` | `F4` | instruction: HLT failure, byte 1/1 | F4 provides a separate controlled failure halt at 7E9A, with EIP=7E9B. |
| 155 | `11101011` | `EB` | instruction: JMP failure_halt, byte 1/2 | EB FD returns to the failure HLT if execution is resumed. |
| 156 | `11111101` | `FD` | instruction: JMP failure_halt, byte 2/2 | EB FD returns to the failure HLT if execution is resumed. |
| 157 | `00000000` | `00` | padding: Handler alignment, byte 1/3 | Three skipped bytes place the handler at source offset 160, physical 7EA0. |
| 158 | `00000000` | `00` | padding: Handler alignment, byte 2/3 | Three skipped bytes place the handler at source offset 160, physical 7EA0. |
| 159 | `00000000` | `00` | padding: Handler alignment, byte 3/3 | Three skipped bytes place the handler at source offset 160, physical 7EA0. |
| 160 | `11000111` | `C7` | instruction: MOV dword [00009004],C0DEC0DE, byte 1/10 | C7 /0 ModRM 05 writes a unique marker without clobbering a general register or arithmetic flags. |
| 161 | `00000101` | `05` | instruction: MOV dword [00009004],C0DEC0DE, byte 2/10 | C7 /0 ModRM 05 writes a unique marker without clobbering a general register or arithmetic flags. |
| 162 | `00000100` | `04` | instruction: MOV dword [00009004],C0DEC0DE, byte 3/10 | C7 /0 ModRM 05 writes a unique marker without clobbering a general register or arithmetic flags. |
| 163 | `10010000` | `90` | instruction: MOV dword [00009004],C0DEC0DE, byte 4/10 | C7 /0 ModRM 05 writes a unique marker without clobbering a general register or arithmetic flags. |
| 164 | `00000000` | `00` | instruction: MOV dword [00009004],C0DEC0DE, byte 5/10 | C7 /0 ModRM 05 writes a unique marker without clobbering a general register or arithmetic flags. |
| 165 | `00000000` | `00` | instruction: MOV dword [00009004],C0DEC0DE, byte 6/10 | C7 /0 ModRM 05 writes a unique marker without clobbering a general register or arithmetic flags. |
| 166 | `11011110` | `DE` | instruction: MOV dword [00009004],C0DEC0DE, byte 7/10 | C7 /0 ModRM 05 writes a unique marker without clobbering a general register or arithmetic flags. |
| 167 | `11000000` | `C0` | instruction: MOV dword [00009004],C0DEC0DE, byte 8/10 | C7 /0 ModRM 05 writes a unique marker without clobbering a general register or arithmetic flags. |
| 168 | `11011110` | `DE` | instruction: MOV dword [00009004],C0DEC0DE, byte 9/10 | C7 /0 ModRM 05 writes a unique marker without clobbering a general register or arithmetic flags. |
| 169 | `11000000` | `C0` | instruction: MOV dword [00009004],C0DEC0DE, byte 10/10 | C7 /0 ModRM 05 writes a unique marker without clobbering a general register or arithmetic flags. |
| 170 | `11001111` | `CF` | instruction: IRETD, byte 1/1 | CF in 32-bit code restores the saved EIP, CS and EFLAGS, returning ESP to 9000. |
| 171 | `00000000` | `00` | padding: GDT alignment part 1, byte 1/16 | Zero padding; control flow never enters it. |
| 172 | `00000000` | `00` | padding: GDT alignment part 1, byte 2/16 | Zero padding; control flow never enters it. |
| 173 | `00000000` | `00` | padding: GDT alignment part 1, byte 3/16 | Zero padding; control flow never enters it. |
| 174 | `00000000` | `00` | padding: GDT alignment part 1, byte 4/16 | Zero padding; control flow never enters it. |
| 175 | `00000000` | `00` | padding: GDT alignment part 1, byte 5/16 | Zero padding; control flow never enters it. |
| 176 | `00000000` | `00` | padding: GDT alignment part 1, byte 6/16 | Zero padding; control flow never enters it. |
| 177 | `00000000` | `00` | padding: GDT alignment part 1, byte 7/16 | Zero padding; control flow never enters it. |
| 178 | `00000000` | `00` | padding: GDT alignment part 1, byte 8/16 | Zero padding; control flow never enters it. |
| 179 | `00000000` | `00` | padding: GDT alignment part 1, byte 9/16 | Zero padding; control flow never enters it. |
| 180 | `00000000` | `00` | padding: GDT alignment part 1, byte 10/16 | Zero padding; control flow never enters it. |
| 181 | `00000000` | `00` | padding: GDT alignment part 1, byte 11/16 | Zero padding; control flow never enters it. |
| 182 | `00000000` | `00` | padding: GDT alignment part 1, byte 12/16 | Zero padding; control flow never enters it. |
| 183 | `00000000` | `00` | padding: GDT alignment part 1, byte 13/16 | Zero padding; control flow never enters it. |
| 184 | `00000000` | `00` | padding: GDT alignment part 1, byte 14/16 | Zero padding; control flow never enters it. |
| 185 | `00000000` | `00` | padding: GDT alignment part 1, byte 15/16 | Zero padding; control flow never enters it. |
| 186 | `00000000` | `00` | padding: GDT alignment part 1, byte 16/16 | Zero padding; control flow never enters it. |
| 187 | `00000000` | `00` | padding: GDT alignment part 2, byte 1/16 | Zero padding; control flow never enters it. |
| 188 | `00000000` | `00` | padding: GDT alignment part 2, byte 2/16 | Zero padding; control flow never enters it. |
| 189 | `00000000` | `00` | padding: GDT alignment part 2, byte 3/16 | Zero padding; control flow never enters it. |
| 190 | `00000000` | `00` | padding: GDT alignment part 2, byte 4/16 | Zero padding; control flow never enters it. |
| 191 | `00000000` | `00` | padding: GDT alignment part 2, byte 5/16 | Zero padding; control flow never enters it. |
| 192 | `00000000` | `00` | padding: GDT alignment part 2, byte 6/16 | Zero padding; control flow never enters it. |
| 193 | `00000000` | `00` | padding: GDT alignment part 2, byte 7/16 | Zero padding; control flow never enters it. |
| 194 | `00000000` | `00` | padding: GDT alignment part 2, byte 8/16 | Zero padding; control flow never enters it. |
| 195 | `00000000` | `00` | padding: GDT alignment part 2, byte 9/16 | Zero padding; control flow never enters it. |
| 196 | `00000000` | `00` | padding: GDT alignment part 2, byte 10/16 | Zero padding; control flow never enters it. |
| 197 | `00000000` | `00` | padding: GDT alignment part 2, byte 11/16 | Zero padding; control flow never enters it. |
| 198 | `00000000` | `00` | padding: GDT alignment part 2, byte 12/16 | Zero padding; control flow never enters it. |
| 199 | `00000000` | `00` | padding: GDT alignment part 2, byte 13/16 | Zero padding; control flow never enters it. |
| 200 | `00000000` | `00` | padding: GDT alignment part 2, byte 14/16 | Zero padding; control flow never enters it. |
| 201 | `00000000` | `00` | padding: GDT alignment part 2, byte 15/16 | Zero padding; control flow never enters it. |
| 202 | `00000000` | `00` | padding: GDT alignment part 2, byte 16/16 | Zero padding; control flow never enters it. |
| 203 | `00000000` | `00` | padding: GDT alignment part 3, byte 1/16 | Zero padding; control flow never enters it. |
| 204 | `00000000` | `00` | padding: GDT alignment part 3, byte 2/16 | Zero padding; control flow never enters it. |
| 205 | `00000000` | `00` | padding: GDT alignment part 3, byte 3/16 | Zero padding; control flow never enters it. |
| 206 | `00000000` | `00` | padding: GDT alignment part 3, byte 4/16 | Zero padding; control flow never enters it. |
| 207 | `00000000` | `00` | padding: GDT alignment part 3, byte 5/16 | Zero padding; control flow never enters it. |
| 208 | `00000000` | `00` | padding: GDT alignment part 3, byte 6/16 | Zero padding; control flow never enters it. |
| 209 | `00000000` | `00` | padding: GDT alignment part 3, byte 7/16 | Zero padding; control flow never enters it. |
| 210 | `00000000` | `00` | padding: GDT alignment part 3, byte 8/16 | Zero padding; control flow never enters it. |
| 211 | `00000000` | `00` | padding: GDT alignment part 3, byte 9/16 | Zero padding; control flow never enters it. |
| 212 | `00000000` | `00` | padding: GDT alignment part 3, byte 10/16 | Zero padding; control flow never enters it. |
| 213 | `00000000` | `00` | padding: GDT alignment part 3, byte 11/16 | Zero padding; control flow never enters it. |
| 214 | `00000000` | `00` | padding: GDT alignment part 3, byte 12/16 | Zero padding; control flow never enters it. |
| 215 | `00000000` | `00` | padding: GDT alignment part 3, byte 13/16 | Zero padding; control flow never enters it. |
| 216 | `00000000` | `00` | padding: GDT alignment part 3, byte 14/16 | Zero padding; control flow never enters it. |
| 217 | `00000000` | `00` | padding: GDT alignment part 3, byte 15/16 | Zero padding; control flow never enters it. |
| 218 | `00000000` | `00` | padding: GDT alignment part 3, byte 16/16 | Zero padding; control flow never enters it. |
| 219 | `00000000` | `00` | padding: GDT alignment part 4, byte 1/16 | Zero padding; control flow never enters it. |
| 220 | `00000000` | `00` | padding: GDT alignment part 4, byte 2/16 | Zero padding; control flow never enters it. |
| 221 | `00000000` | `00` | padding: GDT alignment part 4, byte 3/16 | Zero padding; control flow never enters it. |
| 222 | `00000000` | `00` | padding: GDT alignment part 4, byte 4/16 | Zero padding; control flow never enters it. |
| 223 | `00000000` | `00` | padding: GDT alignment part 4, byte 5/16 | Zero padding; control flow never enters it. |
| 224 | `00000000` | `00` | padding: GDT alignment part 4, byte 6/16 | Zero padding; control flow never enters it. |
| 225 | `00000000` | `00` | padding: GDT alignment part 4, byte 7/16 | Zero padding; control flow never enters it. |
| 226 | `00000000` | `00` | padding: GDT alignment part 4, byte 8/16 | Zero padding; control flow never enters it. |
| 227 | `00000000` | `00` | padding: GDT alignment part 4, byte 9/16 | Zero padding; control flow never enters it. |
| 228 | `00000000` | `00` | padding: GDT alignment part 4, byte 10/16 | Zero padding; control flow never enters it. |
| 229 | `00000000` | `00` | padding: GDT alignment part 4, byte 11/16 | Zero padding; control flow never enters it. |
| 230 | `00000000` | `00` | padding: GDT alignment part 4, byte 12/16 | Zero padding; control flow never enters it. |
| 231 | `00000000` | `00` | padding: GDT alignment part 4, byte 13/16 | Zero padding; control flow never enters it. |
| 232 | `00000000` | `00` | padding: GDT alignment part 4, byte 14/16 | Zero padding; control flow never enters it. |
| 233 | `00000000` | `00` | padding: GDT alignment part 4, byte 15/16 | Zero padding; control flow never enters it. |
| 234 | `00000000` | `00` | padding: GDT alignment part 4, byte 16/16 | Zero padding; control flow never enters it. |
| 235 | `00000000` | `00` | padding: GDT alignment part 5, byte 1/16 | Zero padding; control flow never enters it. |
| 236 | `00000000` | `00` | padding: GDT alignment part 5, byte 2/16 | Zero padding; control flow never enters it. |
| 237 | `00000000` | `00` | padding: GDT alignment part 5, byte 3/16 | Zero padding; control flow never enters it. |
| 238 | `00000000` | `00` | padding: GDT alignment part 5, byte 4/16 | Zero padding; control flow never enters it. |
| 239 | `00000000` | `00` | padding: GDT alignment part 5, byte 5/16 | Zero padding; control flow never enters it. |
| 240 | `00000000` | `00` | padding: GDT alignment part 5, byte 6/16 | Zero padding; control flow never enters it. |
| 241 | `00000000` | `00` | padding: GDT alignment part 5, byte 7/16 | Zero padding; control flow never enters it. |
| 242 | `00000000` | `00` | padding: GDT alignment part 5, byte 8/16 | Zero padding; control flow never enters it. |
| 243 | `00000000` | `00` | padding: GDT alignment part 5, byte 9/16 | Zero padding; control flow never enters it. |
| 244 | `00000000` | `00` | padding: GDT alignment part 5, byte 10/16 | Zero padding; control flow never enters it. |
| 245 | `00000000` | `00` | padding: GDT alignment part 5, byte 11/16 | Zero padding; control flow never enters it. |
| 246 | `00000000` | `00` | padding: GDT alignment part 5, byte 12/16 | Zero padding; control flow never enters it. |
| 247 | `00000000` | `00` | padding: GDT alignment part 5, byte 13/16 | Zero padding; control flow never enters it. |
| 248 | `00000000` | `00` | padding: GDT alignment part 5, byte 14/16 | Zero padding; control flow never enters it. |
| 249 | `00000000` | `00` | padding: GDT alignment part 5, byte 15/16 | Zero padding; control flow never enters it. |
| 250 | `00000000` | `00` | padding: GDT alignment part 5, byte 16/16 | Zero padding; control flow never enters it. |
| 251 | `00000000` | `00` | padding: GDT alignment part 6, byte 1/5 | Five final bytes put the GDT at source offset 256, physical 7F00. |
| 252 | `00000000` | `00` | padding: GDT alignment part 6, byte 2/5 | Five final bytes put the GDT at source offset 256, physical 7F00. |
| 253 | `00000000` | `00` | padding: GDT alignment part 6, byte 3/5 | Five final bytes put the GDT at source offset 256, physical 7F00. |
| 254 | `00000000` | `00` | padding: GDT alignment part 6, byte 4/5 | Five final bytes put the GDT at source offset 256, physical 7F00. |
| 255 | `00000000` | `00` | padding: GDT alignment part 6, byte 5/5 | Five final bytes put the GDT at source offset 256, physical 7F00. |
| 256 | `00000000` | `00` | data: GDT null descriptor, byte 1/8 | Selector zero is deliberately unusable in protected mode. |
| 257 | `00000000` | `00` | data: GDT null descriptor, byte 2/8 | Selector zero is deliberately unusable in protected mode. |
| 258 | `00000000` | `00` | data: GDT null descriptor, byte 3/8 | Selector zero is deliberately unusable in protected mode. |
| 259 | `00000000` | `00` | data: GDT null descriptor, byte 4/8 | Selector zero is deliberately unusable in protected mode. |
| 260 | `00000000` | `00` | data: GDT null descriptor, byte 5/8 | Selector zero is deliberately unusable in protected mode. |
| 261 | `00000000` | `00` | data: GDT null descriptor, byte 6/8 | Selector zero is deliberately unusable in protected mode. |
| 262 | `00000000` | `00` | data: GDT null descriptor, byte 7/8 | Selector zero is deliberately unusable in protected mode. |
| 263 | `00000000` | `00` | data: GDT null descriptor, byte 8/8 | Selector zero is deliberately unusable in protected mode. |
| 264 | `11111111` | `FF` | data: GDT flat 32-bit code descriptor, byte 1/8 | Base zero, limit FFFFF, access 9A, flags C; granularity expands the inclusive limit to FFFFFFFF, D=1 selects 32-bit code. |
| 265 | `11111111` | `FF` | data: GDT flat 32-bit code descriptor, byte 2/8 | Base zero, limit FFFFF, access 9A, flags C; granularity expands the inclusive limit to FFFFFFFF, D=1 selects 32-bit code. |
| 266 | `00000000` | `00` | data: GDT flat 32-bit code descriptor, byte 3/8 | Base zero, limit FFFFF, access 9A, flags C; granularity expands the inclusive limit to FFFFFFFF, D=1 selects 32-bit code. |
| 267 | `00000000` | `00` | data: GDT flat 32-bit code descriptor, byte 4/8 | Base zero, limit FFFFF, access 9A, flags C; granularity expands the inclusive limit to FFFFFFFF, D=1 selects 32-bit code. |
| 268 | `00000000` | `00` | data: GDT flat 32-bit code descriptor, byte 5/8 | Base zero, limit FFFFF, access 9A, flags C; granularity expands the inclusive limit to FFFFFFFF, D=1 selects 32-bit code. |
| 269 | `10011010` | `9A` | data: GDT flat 32-bit code descriptor, byte 6/8 | Base zero, limit FFFFF, access 9A, flags C; granularity expands the inclusive limit to FFFFFFFF, D=1 selects 32-bit code. |
| 270 | `11001111` | `CF` | data: GDT flat 32-bit code descriptor, byte 7/8 | Base zero, limit FFFFF, access 9A, flags C; granularity expands the inclusive limit to FFFFFFFF, D=1 selects 32-bit code. |
| 271 | `00000000` | `00` | data: GDT flat 32-bit code descriptor, byte 8/8 | Base zero, limit FFFFF, access 9A, flags C; granularity expands the inclusive limit to FFFFFFFF, D=1 selects 32-bit code. |
| 272 | `11111111` | `FF` | data: GDT flat 32-bit data descriptor, byte 1/8 | Base zero, limit FFFFF, access 92, flags C; writable ring-zero data, with B=1 for a 32-bit stack. |
| 273 | `11111111` | `FF` | data: GDT flat 32-bit data descriptor, byte 2/8 | Base zero, limit FFFFF, access 92, flags C; writable ring-zero data, with B=1 for a 32-bit stack. |
| 274 | `00000000` | `00` | data: GDT flat 32-bit data descriptor, byte 3/8 | Base zero, limit FFFFF, access 92, flags C; writable ring-zero data, with B=1 for a 32-bit stack. |
| 275 | `00000000` | `00` | data: GDT flat 32-bit data descriptor, byte 4/8 | Base zero, limit FFFFF, access 92, flags C; writable ring-zero data, with B=1 for a 32-bit stack. |
| 276 | `00000000` | `00` | data: GDT flat 32-bit data descriptor, byte 5/8 | Base zero, limit FFFFF, access 92, flags C; writable ring-zero data, with B=1 for a 32-bit stack. |
| 277 | `10010010` | `92` | data: GDT flat 32-bit data descriptor, byte 6/8 | Base zero, limit FFFFF, access 92, flags C; writable ring-zero data, with B=1 for a 32-bit stack. |
| 278 | `11001111` | `CF` | data: GDT flat 32-bit data descriptor, byte 7/8 | Base zero, limit FFFFF, access 92, flags C; writable ring-zero data, with B=1 for a 32-bit stack. |
| 279 | `00000000` | `00` | data: GDT flat 32-bit data descriptor, byte 8/8 | Base zero, limit FFFFF, access 92, flags C; writable ring-zero data, with B=1 for a 32-bit stack. |
| 280 | `00010111` | `17` | data: GDTR pointer, byte 1/6 | Limit 0017 is 24 descriptor bytes minus one; base is little-endian 00007F00. |
| 281 | `00000000` | `00` | data: GDTR pointer, byte 2/6 | Limit 0017 is 24 descriptor bytes minus one; base is little-endian 00007F00. |
| 282 | `00000000` | `00` | data: GDTR pointer, byte 3/6 | Limit 0017 is 24 descriptor bytes minus one; base is little-endian 00007F00. |
| 283 | `01111111` | `7F` | data: GDTR pointer, byte 4/6 | Limit 0017 is 24 descriptor bytes minus one; base is little-endian 00007F00. |
| 284 | `00000000` | `00` | data: GDTR pointer, byte 5/6 | Limit 0017 is 24 descriptor bytes minus one; base is little-endian 00007F00. |
| 285 | `00000000` | `00` | data: GDTR pointer, byte 6/6 | Limit 0017 is 24 descriptor bytes minus one; base is little-endian 00007F00. |
| 286 | `00000111` | `07` | data: IDTR pointer, byte 1/6 | Limit 0107 is 33 eight-byte entries minus one; base is little-endian 00007F30. |
| 287 | `00000001` | `01` | data: IDTR pointer, byte 2/6 | Limit 0107 is 33 eight-byte entries minus one; base is little-endian 00007F30. |
| 288 | `00110000` | `30` | data: IDTR pointer, byte 3/6 | Limit 0107 is 33 eight-byte entries minus one; base is little-endian 00007F30. |
| 289 | `01111111` | `7F` | data: IDTR pointer, byte 4/6 | Limit 0107 is 33 eight-byte entries minus one; base is little-endian 00007F30. |
| 290 | `00000000` | `00` | data: IDTR pointer, byte 5/6 | Limit 0107 is 33 eight-byte entries minus one; base is little-endian 00007F30. |
| 291 | `00000000` | `00` | data: IDTR pointer, byte 6/6 | Limit 0107 is 33 eight-byte entries minus one; base is little-endian 00007F30. |
| 292 | `00000000` | `00` | padding: IDT alignment, byte 1/12 | Twelve skipped bytes place the IDT at physical 7F30. |
| 293 | `00000000` | `00` | padding: IDT alignment, byte 2/12 | Twelve skipped bytes place the IDT at physical 7F30. |
| 294 | `00000000` | `00` | padding: IDT alignment, byte 3/12 | Twelve skipped bytes place the IDT at physical 7F30. |
| 295 | `00000000` | `00` | padding: IDT alignment, byte 4/12 | Twelve skipped bytes place the IDT at physical 7F30. |
| 296 | `00000000` | `00` | padding: IDT alignment, byte 5/12 | Twelve skipped bytes place the IDT at physical 7F30. |
| 297 | `00000000` | `00` | padding: IDT alignment, byte 6/12 | Twelve skipped bytes place the IDT at physical 7F30. |
| 298 | `00000000` | `00` | padding: IDT alignment, byte 7/12 | Twelve skipped bytes place the IDT at physical 7F30. |
| 299 | `00000000` | `00` | padding: IDT alignment, byte 8/12 | Twelve skipped bytes place the IDT at physical 7F30. |
| 300 | `00000000` | `00` | padding: IDT alignment, byte 9/12 | Twelve skipped bytes place the IDT at physical 7F30. |
| 301 | `00000000` | `00` | padding: IDT alignment, byte 10/12 | Twelve skipped bytes place the IDT at physical 7F30. |
| 302 | `00000000` | `00` | padding: IDT alignment, byte 11/12 | Twelve skipped bytes place the IDT at physical 7F30. |
| 303 | `00000000` | `00` | padding: IDT alignment, byte 12/12 | Twelve skipped bytes place the IDT at physical 7F30. |
| 304 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 1/16 | Null gates: this minimal target does not implement exception handling. |
| 305 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 2/16 | Null gates: this minimal target does not implement exception handling. |
| 306 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 3/16 | Null gates: this minimal target does not implement exception handling. |
| 307 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 4/16 | Null gates: this minimal target does not implement exception handling. |
| 308 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 5/16 | Null gates: this minimal target does not implement exception handling. |
| 309 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 6/16 | Null gates: this minimal target does not implement exception handling. |
| 310 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 7/16 | Null gates: this minimal target does not implement exception handling. |
| 311 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 8/16 | Null gates: this minimal target does not implement exception handling. |
| 312 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 9/16 | Null gates: this minimal target does not implement exception handling. |
| 313 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 10/16 | Null gates: this minimal target does not implement exception handling. |
| 314 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 11/16 | Null gates: this minimal target does not implement exception handling. |
| 315 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 12/16 | Null gates: this minimal target does not implement exception handling. |
| 316 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 13/16 | Null gates: this minimal target does not implement exception handling. |
| 317 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 14/16 | Null gates: this minimal target does not implement exception handling. |
| 318 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 15/16 | Null gates: this minimal target does not implement exception handling. |
| 319 | `00000000` | `00` | data: IDT vectors 00 and 01, byte 16/16 | Null gates: this minimal target does not implement exception handling. |
| 320 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 1/16 | Null gates; no NMI or breakpoint handler is provided. |
| 321 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 2/16 | Null gates; no NMI or breakpoint handler is provided. |
| 322 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 3/16 | Null gates; no NMI or breakpoint handler is provided. |
| 323 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 4/16 | Null gates; no NMI or breakpoint handler is provided. |
| 324 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 5/16 | Null gates; no NMI or breakpoint handler is provided. |
| 325 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 6/16 | Null gates; no NMI or breakpoint handler is provided. |
| 326 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 7/16 | Null gates; no NMI or breakpoint handler is provided. |
| 327 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 8/16 | Null gates; no NMI or breakpoint handler is provided. |
| 328 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 9/16 | Null gates; no NMI or breakpoint handler is provided. |
| 329 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 10/16 | Null gates; no NMI or breakpoint handler is provided. |
| 330 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 11/16 | Null gates; no NMI or breakpoint handler is provided. |
| 331 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 12/16 | Null gates; no NMI or breakpoint handler is provided. |
| 332 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 13/16 | Null gates; no NMI or breakpoint handler is provided. |
| 333 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 14/16 | Null gates; no NMI or breakpoint handler is provided. |
| 334 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 15/16 | Null gates; no NMI or breakpoint handler is provided. |
| 335 | `00000000` | `00` | data: IDT vectors 02 and 03, byte 16/16 | Null gates; no NMI or breakpoint handler is provided. |
| 336 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 1/16 | Null gates outside the software interrupt demonstration. |
| 337 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 2/16 | Null gates outside the software interrupt demonstration. |
| 338 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 3/16 | Null gates outside the software interrupt demonstration. |
| 339 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 4/16 | Null gates outside the software interrupt demonstration. |
| 340 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 5/16 | Null gates outside the software interrupt demonstration. |
| 341 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 6/16 | Null gates outside the software interrupt demonstration. |
| 342 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 7/16 | Null gates outside the software interrupt demonstration. |
| 343 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 8/16 | Null gates outside the software interrupt demonstration. |
| 344 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 9/16 | Null gates outside the software interrupt demonstration. |
| 345 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 10/16 | Null gates outside the software interrupt demonstration. |
| 346 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 11/16 | Null gates outside the software interrupt demonstration. |
| 347 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 12/16 | Null gates outside the software interrupt demonstration. |
| 348 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 13/16 | Null gates outside the software interrupt demonstration. |
| 349 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 14/16 | Null gates outside the software interrupt demonstration. |
| 350 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 15/16 | Null gates outside the software interrupt demonstration. |
| 351 | `00000000` | `00` | data: IDT vectors 04 and 05, byte 16/16 | Null gates outside the software interrupt demonstration. |
| 352 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 1/16 | Null gates outside the software interrupt demonstration. |
| 353 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 2/16 | Null gates outside the software interrupt demonstration. |
| 354 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 3/16 | Null gates outside the software interrupt demonstration. |
| 355 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 4/16 | Null gates outside the software interrupt demonstration. |
| 356 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 5/16 | Null gates outside the software interrupt demonstration. |
| 357 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 6/16 | Null gates outside the software interrupt demonstration. |
| 358 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 7/16 | Null gates outside the software interrupt demonstration. |
| 359 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 8/16 | Null gates outside the software interrupt demonstration. |
| 360 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 9/16 | Null gates outside the software interrupt demonstration. |
| 361 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 10/16 | Null gates outside the software interrupt demonstration. |
| 362 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 11/16 | Null gates outside the software interrupt demonstration. |
| 363 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 12/16 | Null gates outside the software interrupt demonstration. |
| 364 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 13/16 | Null gates outside the software interrupt demonstration. |
| 365 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 14/16 | Null gates outside the software interrupt demonstration. |
| 366 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 15/16 | Null gates outside the software interrupt demonstration. |
| 367 | `00000000` | `00` | data: IDT vectors 06 and 07, byte 16/16 | Null gates outside the software interrupt demonstration. |
| 368 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 1/16 | Null gates outside the software interrupt demonstration. |
| 369 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 2/16 | Null gates outside the software interrupt demonstration. |
| 370 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 3/16 | Null gates outside the software interrupt demonstration. |
| 371 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 4/16 | Null gates outside the software interrupt demonstration. |
| 372 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 5/16 | Null gates outside the software interrupt demonstration. |
| 373 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 6/16 | Null gates outside the software interrupt demonstration. |
| 374 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 7/16 | Null gates outside the software interrupt demonstration. |
| 375 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 8/16 | Null gates outside the software interrupt demonstration. |
| 376 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 9/16 | Null gates outside the software interrupt demonstration. |
| 377 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 10/16 | Null gates outside the software interrupt demonstration. |
| 378 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 11/16 | Null gates outside the software interrupt demonstration. |
| 379 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 12/16 | Null gates outside the software interrupt demonstration. |
| 380 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 13/16 | Null gates outside the software interrupt demonstration. |
| 381 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 14/16 | Null gates outside the software interrupt demonstration. |
| 382 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 15/16 | Null gates outside the software interrupt demonstration. |
| 383 | `00000000` | `00` | data: IDT vectors 08 and 09, byte 16/16 | Null gates outside the software interrupt demonstration. |
| 384 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 1/16 | Null gates outside the software interrupt demonstration. |
| 385 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 2/16 | Null gates outside the software interrupt demonstration. |
| 386 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 3/16 | Null gates outside the software interrupt demonstration. |
| 387 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 4/16 | Null gates outside the software interrupt demonstration. |
| 388 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 5/16 | Null gates outside the software interrupt demonstration. |
| 389 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 6/16 | Null gates outside the software interrupt demonstration. |
| 390 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 7/16 | Null gates outside the software interrupt demonstration. |
| 391 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 8/16 | Null gates outside the software interrupt demonstration. |
| 392 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 9/16 | Null gates outside the software interrupt demonstration. |
| 393 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 10/16 | Null gates outside the software interrupt demonstration. |
| 394 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 11/16 | Null gates outside the software interrupt demonstration. |
| 395 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 12/16 | Null gates outside the software interrupt demonstration. |
| 396 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 13/16 | Null gates outside the software interrupt demonstration. |
| 397 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 14/16 | Null gates outside the software interrupt demonstration. |
| 398 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 15/16 | Null gates outside the software interrupt demonstration. |
| 399 | `00000000` | `00` | data: IDT vectors 0A and 0B, byte 16/16 | Null gates outside the software interrupt demonstration. |
| 400 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 1/16 | Null gates outside the software interrupt demonstration. |
| 401 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 2/16 | Null gates outside the software interrupt demonstration. |
| 402 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 3/16 | Null gates outside the software interrupt demonstration. |
| 403 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 4/16 | Null gates outside the software interrupt demonstration. |
| 404 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 5/16 | Null gates outside the software interrupt demonstration. |
| 405 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 6/16 | Null gates outside the software interrupt demonstration. |
| 406 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 7/16 | Null gates outside the software interrupt demonstration. |
| 407 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 8/16 | Null gates outside the software interrupt demonstration. |
| 408 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 9/16 | Null gates outside the software interrupt demonstration. |
| 409 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 10/16 | Null gates outside the software interrupt demonstration. |
| 410 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 11/16 | Null gates outside the software interrupt demonstration. |
| 411 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 12/16 | Null gates outside the software interrupt demonstration. |
| 412 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 13/16 | Null gates outside the software interrupt demonstration. |
| 413 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 14/16 | Null gates outside the software interrupt demonstration. |
| 414 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 15/16 | Null gates outside the software interrupt demonstration. |
| 415 | `00000000` | `00` | data: IDT vectors 0C and 0D, byte 16/16 | Null gates outside the software interrupt demonstration. |
| 416 | `00000000` | `00` | data: IDT vectors 0E and 0F, byte 1/16 | Null gates outside the software interrupt demonstration. |
| 417 | `00000000` | `00` | data: IDT vectors 0E and 0F, byte 2/16 | Null gates outside the software interrupt demonstration. |
| 418 | `00000000` | `00` | data: IDT vectors 0E and 0F, byte 3/16 | Null gates outside the software interrupt demonstration. |
| 419 | `00000000` | `00` | data: IDT vectors 0E and 0F, byte 4/16 | Null gates outside the software interrupt demonstration. |
| 420 | `00000000` | `00` | data: IDT vectors 0E and 0F, byte 5/16 | Null gates outside the software interrupt demonstration. |
| 421 | `00000000` | `00` | data: IDT vectors 0E and 0F, byte 6/16 | Null gates outside the software interrupt demonstration. |
| 422 | `00000000` | `00` | data: IDT vectors 0E and 0F, byte 7/16 | Null gates outside the software interrupt demonstration. |
| 423 | `00000000` | `00` | data: IDT vectors 0E and 0F, byte 8/16 | Null gates outside the software interrupt demonstration. |
| 424 | `00000000` | `00` | data: IDT vectors 0E and 0F, byte 9/16 | Null gates outside the software interrupt demonstration. |
| 425 | `00000000` | `00` | data: IDT vectors 0E and 0F, byte 10/16 | Null gates outside the software interrupt demonstration. |
| 426 | `00000000` | `00` | data: IDT vectors 0E and 0F, byte 11/16 | Null gates outside the software interrupt demonstration. |
| 427 | `00000000` | `00` | data: IDT vectors 0E and 0F, byte 12/16 | Null gates outside the software interrupt demonstration. |
| 428 | `00000000` | `00` | data: IDT vectors 0E and 0F, byte 13/16 | Null gates outside the software interrupt demonstration. |
| 429 | `00000000` | `00` | data: IDT vectors 0E and 0F, byte 14/16 | Null gates outside the software interrupt demonstration. |
| 430 | `00000000` | `00` | data: IDT vectors 0E and 0F, byte 15/16 | Null gates outside the software interrupt demonstration. |
| 431 | `00000000` | `00` | data: IDT vectors 0E and 0F, byte 16/16 | Null gates outside the software interrupt demonstration. |
| 432 | `00000000` | `00` | data: IDT vectors 10 and 11, byte 1/16 | Null gates outside the software interrupt demonstration. |
| 433 | `00000000` | `00` | data: IDT vectors 10 and 11, byte 2/16 | Null gates outside the software interrupt demonstration. |
| 434 | `00000000` | `00` | data: IDT vectors 10 and 11, byte 3/16 | Null gates outside the software interrupt demonstration. |
| 435 | `00000000` | `00` | data: IDT vectors 10 and 11, byte 4/16 | Null gates outside the software interrupt demonstration. |
| 436 | `00000000` | `00` | data: IDT vectors 10 and 11, byte 5/16 | Null gates outside the software interrupt demonstration. |
| 437 | `00000000` | `00` | data: IDT vectors 10 and 11, byte 6/16 | Null gates outside the software interrupt demonstration. |
| 438 | `00000000` | `00` | data: IDT vectors 10 and 11, byte 7/16 | Null gates outside the software interrupt demonstration. |
| 439 | `00000000` | `00` | data: IDT vectors 10 and 11, byte 8/16 | Null gates outside the software interrupt demonstration. |
| 440 | `00000000` | `00` | data: IDT vectors 10 and 11, byte 9/16 | Null gates outside the software interrupt demonstration. |
| 441 | `00000000` | `00` | data: IDT vectors 10 and 11, byte 10/16 | Null gates outside the software interrupt demonstration. |
| 442 | `00000000` | `00` | data: IDT vectors 10 and 11, byte 11/16 | Null gates outside the software interrupt demonstration. |
| 443 | `00000000` | `00` | data: IDT vectors 10 and 11, byte 12/16 | Null gates outside the software interrupt demonstration. |
| 444 | `00000000` | `00` | data: IDT vectors 10 and 11, byte 13/16 | Null gates outside the software interrupt demonstration. |
| 445 | `00000000` | `00` | data: IDT vectors 10 and 11, byte 14/16 | Null gates outside the software interrupt demonstration. |
| 446 | `00000000` | `00` | data: IDT vectors 10 and 11, byte 15/16 | Null gates outside the software interrupt demonstration. |
| 447 | `00000000` | `00` | data: IDT vectors 10 and 11, byte 16/16 | Null gates outside the software interrupt demonstration. |
| 448 | `00000000` | `00` | data: IDT vectors 12 and 13, byte 1/16 | Null gates outside the software interrupt demonstration. |
| 449 | `00000000` | `00` | data: IDT vectors 12 and 13, byte 2/16 | Null gates outside the software interrupt demonstration. |
| 450 | `00000000` | `00` | data: IDT vectors 12 and 13, byte 3/16 | Null gates outside the software interrupt demonstration. |
| 451 | `00000000` | `00` | data: IDT vectors 12 and 13, byte 4/16 | Null gates outside the software interrupt demonstration. |
| 452 | `00000000` | `00` | data: IDT vectors 12 and 13, byte 5/16 | Null gates outside the software interrupt demonstration. |
| 453 | `00000000` | `00` | data: IDT vectors 12 and 13, byte 6/16 | Null gates outside the software interrupt demonstration. |
| 454 | `00000000` | `00` | data: IDT vectors 12 and 13, byte 7/16 | Null gates outside the software interrupt demonstration. |
| 455 | `00000000` | `00` | data: IDT vectors 12 and 13, byte 8/16 | Null gates outside the software interrupt demonstration. |
| 456 | `00000000` | `00` | data: IDT vectors 12 and 13, byte 9/16 | Null gates outside the software interrupt demonstration. |
| 457 | `00000000` | `00` | data: IDT vectors 12 and 13, byte 10/16 | Null gates outside the software interrupt demonstration. |
| 458 | `00000000` | `00` | data: IDT vectors 12 and 13, byte 11/16 | Null gates outside the software interrupt demonstration. |
| 459 | `00000000` | `00` | data: IDT vectors 12 and 13, byte 12/16 | Null gates outside the software interrupt demonstration. |
| 460 | `00000000` | `00` | data: IDT vectors 12 and 13, byte 13/16 | Null gates outside the software interrupt demonstration. |
| 461 | `00000000` | `00` | data: IDT vectors 12 and 13, byte 14/16 | Null gates outside the software interrupt demonstration. |
| 462 | `00000000` | `00` | data: IDT vectors 12 and 13, byte 15/16 | Null gates outside the software interrupt demonstration. |
| 463 | `00000000` | `00` | data: IDT vectors 12 and 13, byte 16/16 | Null gates outside the software interrupt demonstration. |
| 464 | `00000000` | `00` | data: IDT vectors 14 and 15, byte 1/16 | Null gates outside the software interrupt demonstration. |
| 465 | `00000000` | `00` | data: IDT vectors 14 and 15, byte 2/16 | Null gates outside the software interrupt demonstration. |
| 466 | `00000000` | `00` | data: IDT vectors 14 and 15, byte 3/16 | Null gates outside the software interrupt demonstration. |
| 467 | `00000000` | `00` | data: IDT vectors 14 and 15, byte 4/16 | Null gates outside the software interrupt demonstration. |
| 468 | `00000000` | `00` | data: IDT vectors 14 and 15, byte 5/16 | Null gates outside the software interrupt demonstration. |
| 469 | `00000000` | `00` | data: IDT vectors 14 and 15, byte 6/16 | Null gates outside the software interrupt demonstration. |
| 470 | `00000000` | `00` | data: IDT vectors 14 and 15, byte 7/16 | Null gates outside the software interrupt demonstration. |
| 471 | `00000000` | `00` | data: IDT vectors 14 and 15, byte 8/16 | Null gates outside the software interrupt demonstration. |
| 472 | `00000000` | `00` | data: IDT vectors 14 and 15, byte 9/16 | Null gates outside the software interrupt demonstration. |
| 473 | `00000000` | `00` | data: IDT vectors 14 and 15, byte 10/16 | Null gates outside the software interrupt demonstration. |
| 474 | `00000000` | `00` | data: IDT vectors 14 and 15, byte 11/16 | Null gates outside the software interrupt demonstration. |
| 475 | `00000000` | `00` | data: IDT vectors 14 and 15, byte 12/16 | Null gates outside the software interrupt demonstration. |
| 476 | `00000000` | `00` | data: IDT vectors 14 and 15, byte 13/16 | Null gates outside the software interrupt demonstration. |
| 477 | `00000000` | `00` | data: IDT vectors 14 and 15, byte 14/16 | Null gates outside the software interrupt demonstration. |
| 478 | `00000000` | `00` | data: IDT vectors 14 and 15, byte 15/16 | Null gates outside the software interrupt demonstration. |
| 479 | `00000000` | `00` | data: IDT vectors 14 and 15, byte 16/16 | Null gates outside the software interrupt demonstration. |
| 480 | `00000000` | `00` | data: IDT vectors 16 and 17, byte 1/16 | Null gates outside the software interrupt demonstration. |
| 481 | `00000000` | `00` | data: IDT vectors 16 and 17, byte 2/16 | Null gates outside the software interrupt demonstration. |
| 482 | `00000000` | `00` | data: IDT vectors 16 and 17, byte 3/16 | Null gates outside the software interrupt demonstration. |
| 483 | `00000000` | `00` | data: IDT vectors 16 and 17, byte 4/16 | Null gates outside the software interrupt demonstration. |
| 484 | `00000000` | `00` | data: IDT vectors 16 and 17, byte 5/16 | Null gates outside the software interrupt demonstration. |
| 485 | `00000000` | `00` | data: IDT vectors 16 and 17, byte 6/16 | Null gates outside the software interrupt demonstration. |
| 486 | `00000000` | `00` | data: IDT vectors 16 and 17, byte 7/16 | Null gates outside the software interrupt demonstration. |
| 487 | `00000000` | `00` | data: IDT vectors 16 and 17, byte 8/16 | Null gates outside the software interrupt demonstration. |
| 488 | `00000000` | `00` | data: IDT vectors 16 and 17, byte 9/16 | Null gates outside the software interrupt demonstration. |
| 489 | `00000000` | `00` | data: IDT vectors 16 and 17, byte 10/16 | Null gates outside the software interrupt demonstration. |
| 490 | `00000000` | `00` | data: IDT vectors 16 and 17, byte 11/16 | Null gates outside the software interrupt demonstration. |
| 491 | `00000000` | `00` | data: IDT vectors 16 and 17, byte 12/16 | Null gates outside the software interrupt demonstration. |
| 492 | `00000000` | `00` | data: IDT vectors 16 and 17, byte 13/16 | Null gates outside the software interrupt demonstration. |
| 493 | `00000000` | `00` | data: IDT vectors 16 and 17, byte 14/16 | Null gates outside the software interrupt demonstration. |
| 494 | `00000000` | `00` | data: IDT vectors 16 and 17, byte 15/16 | Null gates outside the software interrupt demonstration. |
| 495 | `00000000` | `00` | data: IDT vectors 16 and 17, byte 16/16 | Null gates outside the software interrupt demonstration. |
| 496 | `00000000` | `00` | data: IDT vectors 18 and 19, byte 1/16 | Null gates outside the software interrupt demonstration. |
| 497 | `00000000` | `00` | data: IDT vectors 18 and 19, byte 2/16 | Null gates outside the software interrupt demonstration. |
| 498 | `00000000` | `00` | data: IDT vectors 18 and 19, byte 3/16 | Null gates outside the software interrupt demonstration. |
| 499 | `00000000` | `00` | data: IDT vectors 18 and 19, byte 4/16 | Null gates outside the software interrupt demonstration. |
| 500 | `00000000` | `00` | data: IDT vectors 18 and 19, byte 5/16 | Null gates outside the software interrupt demonstration. |
| 501 | `00000000` | `00` | data: IDT vectors 18 and 19, byte 6/16 | Null gates outside the software interrupt demonstration. |
| 502 | `00000000` | `00` | data: IDT vectors 18 and 19, byte 7/16 | Null gates outside the software interrupt demonstration. |
| 503 | `00000000` | `00` | data: IDT vectors 18 and 19, byte 8/16 | Null gates outside the software interrupt demonstration. |
| 504 | `00000000` | `00` | data: IDT vectors 18 and 19, byte 9/16 | Null gates outside the software interrupt demonstration. |
| 505 | `00000000` | `00` | data: IDT vectors 18 and 19, byte 10/16 | Null gates outside the software interrupt demonstration. |
| 506 | `00000000` | `00` | data: IDT vectors 18 and 19, byte 11/16 | Null gates outside the software interrupt demonstration. |
| 507 | `00000000` | `00` | data: IDT vectors 18 and 19, byte 12/16 | Null gates outside the software interrupt demonstration. |
| 508 | `00000000` | `00` | data: IDT vectors 18 and 19, byte 13/16 | Null gates outside the software interrupt demonstration. |
| 509 | `00000000` | `00` | data: IDT vectors 18 and 19, byte 14/16 | Null gates outside the software interrupt demonstration. |
| 510 | `00000000` | `00` | data: IDT vectors 18 and 19, byte 15/16 | Null gates outside the software interrupt demonstration. |
| 511 | `00000000` | `00` | data: IDT vectors 18 and 19, byte 16/16 | Null gates outside the software interrupt demonstration. |
| 512 | `00000000` | `00` | data: IDT vectors 1A and 1B, byte 1/16 | Null gates outside the software interrupt demonstration. |
| 513 | `00000000` | `00` | data: IDT vectors 1A and 1B, byte 2/16 | Null gates outside the software interrupt demonstration. |
| 514 | `00000000` | `00` | data: IDT vectors 1A and 1B, byte 3/16 | Null gates outside the software interrupt demonstration. |
| 515 | `00000000` | `00` | data: IDT vectors 1A and 1B, byte 4/16 | Null gates outside the software interrupt demonstration. |
| 516 | `00000000` | `00` | data: IDT vectors 1A and 1B, byte 5/16 | Null gates outside the software interrupt demonstration. |
| 517 | `00000000` | `00` | data: IDT vectors 1A and 1B, byte 6/16 | Null gates outside the software interrupt demonstration. |
| 518 | `00000000` | `00` | data: IDT vectors 1A and 1B, byte 7/16 | Null gates outside the software interrupt demonstration. |
| 519 | `00000000` | `00` | data: IDT vectors 1A and 1B, byte 8/16 | Null gates outside the software interrupt demonstration. |
| 520 | `00000000` | `00` | data: IDT vectors 1A and 1B, byte 9/16 | Null gates outside the software interrupt demonstration. |
| 521 | `00000000` | `00` | data: IDT vectors 1A and 1B, byte 10/16 | Null gates outside the software interrupt demonstration. |
| 522 | `00000000` | `00` | data: IDT vectors 1A and 1B, byte 11/16 | Null gates outside the software interrupt demonstration. |
| 523 | `00000000` | `00` | data: IDT vectors 1A and 1B, byte 12/16 | Null gates outside the software interrupt demonstration. |
| 524 | `00000000` | `00` | data: IDT vectors 1A and 1B, byte 13/16 | Null gates outside the software interrupt demonstration. |
| 525 | `00000000` | `00` | data: IDT vectors 1A and 1B, byte 14/16 | Null gates outside the software interrupt demonstration. |
| 526 | `00000000` | `00` | data: IDT vectors 1A and 1B, byte 15/16 | Null gates outside the software interrupt demonstration. |
| 527 | `00000000` | `00` | data: IDT vectors 1A and 1B, byte 16/16 | Null gates outside the software interrupt demonstration. |
| 528 | `00000000` | `00` | data: IDT vectors 1C and 1D, byte 1/16 | Null gates outside the software interrupt demonstration. |
| 529 | `00000000` | `00` | data: IDT vectors 1C and 1D, byte 2/16 | Null gates outside the software interrupt demonstration. |
| 530 | `00000000` | `00` | data: IDT vectors 1C and 1D, byte 3/16 | Null gates outside the software interrupt demonstration. |
| 531 | `00000000` | `00` | data: IDT vectors 1C and 1D, byte 4/16 | Null gates outside the software interrupt demonstration. |
| 532 | `00000000` | `00` | data: IDT vectors 1C and 1D, byte 5/16 | Null gates outside the software interrupt demonstration. |
| 533 | `00000000` | `00` | data: IDT vectors 1C and 1D, byte 6/16 | Null gates outside the software interrupt demonstration. |
| 534 | `00000000` | `00` | data: IDT vectors 1C and 1D, byte 7/16 | Null gates outside the software interrupt demonstration. |
| 535 | `00000000` | `00` | data: IDT vectors 1C and 1D, byte 8/16 | Null gates outside the software interrupt demonstration. |
| 536 | `00000000` | `00` | data: IDT vectors 1C and 1D, byte 9/16 | Null gates outside the software interrupt demonstration. |
| 537 | `00000000` | `00` | data: IDT vectors 1C and 1D, byte 10/16 | Null gates outside the software interrupt demonstration. |
| 538 | `00000000` | `00` | data: IDT vectors 1C and 1D, byte 11/16 | Null gates outside the software interrupt demonstration. |
| 539 | `00000000` | `00` | data: IDT vectors 1C and 1D, byte 12/16 | Null gates outside the software interrupt demonstration. |
| 540 | `00000000` | `00` | data: IDT vectors 1C and 1D, byte 13/16 | Null gates outside the software interrupt demonstration. |
| 541 | `00000000` | `00` | data: IDT vectors 1C and 1D, byte 14/16 | Null gates outside the software interrupt demonstration. |
| 542 | `00000000` | `00` | data: IDT vectors 1C and 1D, byte 15/16 | Null gates outside the software interrupt demonstration. |
| 543 | `00000000` | `00` | data: IDT vectors 1C and 1D, byte 16/16 | Null gates outside the software interrupt demonstration. |
| 544 | `00000000` | `00` | data: IDT vectors 1E and 1F, byte 1/16 | Null gates outside the software interrupt demonstration. |
| 545 | `00000000` | `00` | data: IDT vectors 1E and 1F, byte 2/16 | Null gates outside the software interrupt demonstration. |
| 546 | `00000000` | `00` | data: IDT vectors 1E and 1F, byte 3/16 | Null gates outside the software interrupt demonstration. |
| 547 | `00000000` | `00` | data: IDT vectors 1E and 1F, byte 4/16 | Null gates outside the software interrupt demonstration. |
| 548 | `00000000` | `00` | data: IDT vectors 1E and 1F, byte 5/16 | Null gates outside the software interrupt demonstration. |
| 549 | `00000000` | `00` | data: IDT vectors 1E and 1F, byte 6/16 | Null gates outside the software interrupt demonstration. |
| 550 | `00000000` | `00` | data: IDT vectors 1E and 1F, byte 7/16 | Null gates outside the software interrupt demonstration. |
| 551 | `00000000` | `00` | data: IDT vectors 1E and 1F, byte 8/16 | Null gates outside the software interrupt demonstration. |
| 552 | `00000000` | `00` | data: IDT vectors 1E and 1F, byte 9/16 | Null gates outside the software interrupt demonstration. |
| 553 | `00000000` | `00` | data: IDT vectors 1E and 1F, byte 10/16 | Null gates outside the software interrupt demonstration. |
| 554 | `00000000` | `00` | data: IDT vectors 1E and 1F, byte 11/16 | Null gates outside the software interrupt demonstration. |
| 555 | `00000000` | `00` | data: IDT vectors 1E and 1F, byte 12/16 | Null gates outside the software interrupt demonstration. |
| 556 | `00000000` | `00` | data: IDT vectors 1E and 1F, byte 13/16 | Null gates outside the software interrupt demonstration. |
| 557 | `00000000` | `00` | data: IDT vectors 1E and 1F, byte 14/16 | Null gates outside the software interrupt demonstration. |
| 558 | `00000000` | `00` | data: IDT vectors 1E and 1F, byte 15/16 | Null gates outside the software interrupt demonstration. |
| 559 | `00000000` | `00` | data: IDT vectors 1E and 1F, byte 16/16 | Null gates outside the software interrupt demonstration. |
| 560 | `10100000` | `A0` | data: IDT vector 20 interrupt gate, byte 1/8 | Offset 00007EA0 split low and high, selector 0008, reserved byte zero, attributes 8E: present DPL0 32-bit interrupt gate. |
| 561 | `01111110` | `7E` | data: IDT vector 20 interrupt gate, byte 2/8 | Offset 00007EA0 split low and high, selector 0008, reserved byte zero, attributes 8E: present DPL0 32-bit interrupt gate. |
| 562 | `00001000` | `08` | data: IDT vector 20 interrupt gate, byte 3/8 | Offset 00007EA0 split low and high, selector 0008, reserved byte zero, attributes 8E: present DPL0 32-bit interrupt gate. |
| 563 | `00000000` | `00` | data: IDT vector 20 interrupt gate, byte 4/8 | Offset 00007EA0 split low and high, selector 0008, reserved byte zero, attributes 8E: present DPL0 32-bit interrupt gate. |
| 564 | `00000000` | `00` | data: IDT vector 20 interrupt gate, byte 5/8 | Offset 00007EA0 split low and high, selector 0008, reserved byte zero, attributes 8E: present DPL0 32-bit interrupt gate. |
| 565 | `10001110` | `8E` | data: IDT vector 20 interrupt gate, byte 6/8 | Offset 00007EA0 split low and high, selector 0008, reserved byte zero, attributes 8E: present DPL0 32-bit interrupt gate. |
| 566 | `00000000` | `00` | data: IDT vector 20 interrupt gate, byte 7/8 | Offset 00007EA0 split low and high, selector 0008, reserved byte zero, attributes 8E: present DPL0 32-bit interrupt gate. |
| 567 | `00000000` | `00` | data: IDT vector 20 interrupt gate, byte 8/8 | Offset 00007EA0 split low and high, selector 0008, reserved byte zero, attributes 8E: present DPL0 32-bit interrupt gate. |
