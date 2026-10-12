// Target instructions are authored here as literal binary digits, never assembled.
export const presets = [
  {
    id: 'immediates', title: '01 / Load an immediate',
    lesson: 'The first byte selects a register. Read the next two bytes from right to left: 2A 00 is the 16-bit value 002A, or 42.',
    source: `10111000 00101010 00000000
10111011 01100001 00000000
10111001 00110100 00010010
11110100`,
  },
  {
    id: 'flags', title: '02 / Arithmetic & flags',
    lesson: 'FFFF + 1 wraps AX to zero and sets carry. INC preserves carry. SUB and CMP then reveal the difference between changing a value and comparing it.',
    source: `10111000 11111111 11111111
00000101 00000001 00000000
01000000
00101101 00000010 00000000
00111101 11111111 11111111
11110100`,
  },
  {
    id: 'stack', title: '03 / Stack, CALL & RET',
    lesson: 'PUSH stores 1234 as 34 12 below SP. POP recovers it in BX. CALL saves the next logical IP on the same stack; RET uses that word to return.',
    source: `10111000 00110100 00010010
01010000
00110001 11000000
01011011
11101000 00000001 00000000
11110100
01000000
11000011`,
  },
  {
    id: 'branch', title: '04 / Follow a branch',
    lesson: 'LOOP decrements CX without changing arithmetic flags and jumps back while CX is nonzero. After three increments, CMP sets ZF and JZ skips the FFFF load.',
    source: `10111001 00000011 00000000
10111000 00000000 00000000
01000000
11100010 11111101
00111101 00000011 00000000
01110100 00000011
10111000 11111111 11111111
11110100`,
  },
  {
    id: 'memory', title: '05 / Segment + offset',
    lesson: 'DS and ES become 0010. DS:0020 maps to physical 00120. A word store writes CD AB; STOSW uses ES:DI. LODSB uses DS:SI and STD reverses pointer movement.',
    source: `10111000 00010000 00000000
10001110 11011000
10001110 11000000
10111000 11001101 10101011
10100011 00100000 00000000
00110001 11000000
10100001 00100000 00000000
10111111 00100010 00000000
10101011
10111110 00100000 00000000
10101100
11111101
10101100
11111100
11110100`,
  },
];
