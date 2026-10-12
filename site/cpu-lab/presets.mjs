// Every instruction comes from canonical .bits source copied by the site build.
import {programSources} from './memory-program.mjs';
export const presets = [
  {
    id: 'immediates', title: '01 / Load an immediate',
    lesson: 'The first byte selects a register. Read the next two bytes from right to left: 2A 00 is the 16-bit value 002A, or 42.',
    ...programSources.immediates,
  },
  {
    id: 'flags', title: '02 / Arithmetic & flags',
    lesson: 'FFFF + 1 wraps AX to zero and sets carry. INC preserves carry. SUB and CMP then reveal the difference between changing a value and comparing it.',
    ...programSources.flags,
  },
  {
    id: 'stack', title: '03 / Stack, CALL & RET',
    lesson: 'PUSH stores 1234 as 34 12 below SP. POP recovers it in BX. CALL saves the next logical IP on the same stack; RET uses that word to return.',
    ...programSources.stack,
  },
  {
    id: 'branch', title: '04 / Follow a branch',
    lesson: 'LOOP decrements CX without changing arithmetic flags and jumps back while CX is nonzero. After three increments, CMP sets ZF and JZ skips the FFFF load.',
    ...programSources.branch,
  },
  {
    id: 'memory', title: '05 / Segment + offset',
    lesson: 'DS and ES become 0010. DS:0020 maps to physical 00120. A word store writes CD AB; STOSW uses ES:DI. LODSB uses DS:SI and STD reverses pointer movement.',
    ...programSources.memory,
  },
  {
    id:'memory-mov',title:'06 / BP, DS and SS',
    lesson:'The same offset 0020 holds 1111 in DS and 2233 in SS. BP-2 selects SS; BX+SI and the absolute form select DS. Word/high-byte stores preserve flags and byte loads preserve the other register half.',
    ...programSources['memory-mov'],
  },
];
