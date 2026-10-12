// A bounded 286+ real-mode teaching model; it does not model CPU faults or a BIOS.
import {decodeAddress16} from './address16.mjs';
const registers = ['AX', 'CX', 'DX', 'BX', 'SP', 'BP', 'SI', 'DI'];
const signed = value => value < 128 ? value : value - 256;
export const binary = value => value.toString(2).padStart(8, '0');
export const hex = (value, width = 2) => value.toString(16).toUpperCase().padStart(width, '0');
export const physicalAddress = (segment, offset) => ((segment << 4) + offset) & 0xFFFFF;
export const logicalIP = state => (state.loadAddress + state.ip - (state.CS << 4)) & 65535;
// Undefined AF is omitted from the displayed word; the UI must also show AF as ?.
export const flagsWord = state => 2 | Number(state.cf) | (Number(state.pf) << 2) | (Number(state.af === true) << 4) | (Number(state.zf) << 6) | (Number(state.sf) << 7) | (Number(state.interrupts) << 9) | (Number(state.df) << 10) | (Number(state.of) << 11);

export function validateBootData(data) {
  if (!Array.isArray(data.bytes) || data.bytes.length !== 512 || data.bytes.some(value => !Number.isInteger(value) || value < 0 || value > 255)) throw new Error('The boot explorer requires exactly 512 valid bytes.');
  if (data.bytes[510] !== 0x55 || data.bytes[511] !== 0xAA) throw new Error('The boot image has no valid 55 AA signature.');
  if (!Array.isArray(data.annotations)) throw new Error('Boot annotations are missing.');
  let offset = 0;
  for (const annotation of data.annotations) {
    if (annotation.offset !== offset || !Number.isInteger(annotation.size) || annotation.size < 1 || !['instruction','data','padding','signature'].includes(annotation.kind) || typeof annotation.explanation !== 'string') throw new Error('Boot annotations must cover the image in order, without gaps or overlap.');
    offset += annotation.size;
  }
  if (offset !== 512 || !/^[a-f0-9]{64}$/i.test(data.sha256)) throw new Error('Boot image metadata is incomplete.');
  return data;
}

export function decode(bytes, offset = 0) {
  if (!Number.isInteger(offset) || offset < 0 || offset >= bytes.length) throw new Error('Instruction pointer left the loaded program.');
  const opcode = bytes[offset];
  const byte = n => {
    if (offset + n >= bytes.length) throw new Error('Truncated instruction: an operand byte is missing.');
    return bytes[offset + n];
  };
  const word = n => byte(n) | (byte(n + 1) << 8);
  const instruction = (size, mnemonic, explanation, operation, operands = {}) => ({
    size, mnemonic, explanation, operation, ...operands,
    fields: Array.from({length: size}, (_, i) => i === 0 ? 'opcode' : 'operand'),
  });
  if (opcode >= 0xB8 && opcode <= 0xBF) return instruction(3, `MOV ${registers[opcode - 0xB8]}, ${word(1)}`, 'The opcode chooses a 16-bit register. The next two bytes hold the immediate, least significant byte first.', 'mov16', {register: registers[opcode - 0xB8], value: word(1)});
  if (opcode >= 0xB0 && opcode <= 0xB7) return instruction(2, `MOV ${['AL','CL','DL','BL','AH','CH','DH','BH'][opcode - 0xB0]}, ${byte(1)}`, 'The opcode chooses an 8-bit register; the following byte is the immediate.', 'mov8', {register: registers[(opcode - 0xB0) % 4], high: opcode >= 0xB4, value: byte(1)});
  if (opcode >= 0x88 && opcode <= 0x8B) {
    const modrm=byte(1);
    const width=opcode&1?2:1,reg=(modrm>>3)&7,rm=modrm&7;
    if(modrm<0xC0) {
      const memory=decodeAddress16(bytes,offset+1),name=width===2?registers[reg]:['AL','CL','DL','BL','AH','CH','DH','BH'][reg],operand=`[${memory.expression}]`,load=Boolean(opcode&2);
      const result=instruction(2+memory.displacementBytes,`MOV ${load?name+', '+operand:operand+', '+name}`,'Copy a byte or word through 16-bit addressing. BP-based forms default to SS; other forms use DS. Flags are unchanged.',load?'loadRegisterMemory':'storeRegisterMemory',
        {width,register:registers[width===2?reg:reg%4],high:width===1&&reg>=4,memory});
      result.fields[1]='ModR/M';return result;
    }
    const destination=opcode&2?reg:rm,source=opcode&2?rm:reg;
    const names=width===2?registers:['AL','CL','DL','BL','AH','CH','DH','BH'];
    const result=instruction(2,`MOV ${names[destination]}, ${names[source]}`,'Copy a register word or byte without changing flags. Byte aliases preserve the other half of their word register.','movRegister',
      {width,register:registers[width===2?destination:destination%4],source:registers[width===2?source:source%4],high:width===1&&destination>=4,sourceHigh:width===1&&source>=4});
    result.fields[1]='ModR/M';return result;
  }
  if ([0x05, 0x2D, 0x3D].includes(opcode)) return instruction(3, `${({5:'ADD',45:'SUB',61:'CMP'})[opcode]} AX, ${word(1)}`, 'A 16-bit immediate follows the opcode in little-endian order. CMP updates flags without changing AX.', ({5:'add',45:'sub',61:'cmp'})[opcode], {value: word(1)});
  if ([0x14,0x15,0x1C,0x1D].includes(opcode)) {
    const subtract=Boolean(opcode&8),width=opcode&1?16:8,value=width===16?word(1):byte(1),name=subtract?'SBB':'ADC';
    return instruction(width===16?3:2,`${name} ${width===16?'AX':'AL'}, ${value}`,`${name} ${subtract?'subtracts the immediate and incoming CF borrow from':'adds the immediate and incoming CF carry to'} ${width===16?'AX':'AL'}. CF reports outgoing ${subtract?'borrow':'carry'}; OF reports signed overflow. ${width===8?'AH is preserved. ':''}All arithmetic status flags are updated.`,subtract?'sbb':'adc',{width,value});
  }
  if (opcode >= 0x40 && opcode <= 0x4F) return instruction(1, `${opcode < 0x48 ? 'INC' : 'DEC'} ${registers[opcode % 8]}`, 'The register is encoded in the low three opcode bits. INC and DEC preserve the carry flag.', opcode < 0x48 ? 'inc' : 'dec', {register: registers[opcode % 8]});
  if (opcode >= 0x50 && opcode <= 0x5F) return instruction(1, `${opcode < 0x58 ? 'PUSH' : 'POP'} ${registers[opcode % 8]}`, 'A 16-bit register is saved to or restored from SS:SP. The stack grows downward by two bytes.', opcode < 0x58 ? 'push' : 'pop', {register: registers[opcode % 8]});
  if (opcode === 0x68 || opcode === 0x6A) return instruction(opcode === 0x68 ? 3 : 2, `PUSH ${opcode === 0x68 ? word(1) : signed(byte(1))}`, 'A word is pushed onto SS:SP. An 8-bit immediate is sign-extended to a 16-bit word.', 'pushImmediate', {value: opcode === 0x68 ? word(1) : signed(byte(1)) & 65535});
  if (opcode === 0x31 && byte(1) >= 0xC0) {
    const destination = registers[byte(1) % 8], source = registers[(byte(1) >> 3) & 7];
    const result = instruction(2, `XOR ${destination}, ${source}`, 'The ModR/M byte selects two registers. XOR of a register with itself produces zero.', 'xor', {register: destination, source});
    result.fields[1] = 'ModR/M'; return result;
  }
  if (opcode === 0x8E && byte(1) >= 0xC0 && [0,2,3].includes((byte(1) >> 3) & 7)) {
    const segment = ['ES','CS','SS','DS'][(byte(1) >> 3) & 7], source = registers[byte(1) % 8];
    const result = instruction(2, `MOV ${segment}, ${source}`, 'The ModR/M byte selects a segment register and a 16-bit source register.', 'segment', {segment, source});
    result.fields[1] = 'ModR/M'; return result;
  }
  if (opcode === 0x84 && byte(1) === 0xC0) return instruction(2, 'TEST AL, AL', 'A bitwise AND updates ZF. AL itself is unchanged; ZF becomes 1 when AL is zero.', 'test');
  if (opcode === 0xA8) return instruction(2, `TEST AL, 0x${hex(byte(1))}`, 'Test the bits of AL against an 8-bit mask without changing AL. ZF reports whether any selected bit is set.', 'testImmediate', {value: byte(1)});
  if (opcode === 0xEA) return instruction(5, `JMP 0x${hex(word(3),4)}:0x${hex(word(1),4)}`, 'A far jump stores the little-endian offset first and the segment second. This boot image normalizes CS to zero.', 'farJump', {value: word(1), segment: word(3)});
  const branches = {0xEB:'jmp',0x70:'jo',0x71:'jno',0x72:'jb',0x73:'jae',0x74:'jz',0x75:'jnz',0x76:'jbe',0x77:'ja',0x78:'js',0x79:'jns',0x7A:'jp',0x7B:'jnp',0x7C:'jl',0x7D:'jge',0x7E:'jle',0x7F:'jg',0xE2:'loop'};
  if (branches[opcode]) {
    const conditions={jbe:'Unsigned below or equal: CF or ZF is set.',ja:'Unsigned above: CF and ZF are clear.',jl:'Signed less: SF differs from OF.',jge:'Signed greater or equal: SF equals OF.',jle:'Signed less or equal: ZF is set or SF differs from OF.',jg:'Signed greater: ZF is clear and SF equals OF.'};
    return instruction(2, `${branches[opcode].toUpperCase()} ${signed(byte(1)) >= 0 ? '+' : ''}${signed(byte(1))}`, `${conditions[branches[opcode]]?conditions[branches[opcode]]+' ':''}The signed 8-bit displacement is measured from the end of this instruction.`, branches[opcode], {displacement: signed(byte(1))});
  }
  if (opcode === 0xE9 || opcode === 0xE8) {
    const displacement = word(1) > 32767 ? word(1) - 65536 : word(1);
    return instruction(3, `${opcode === 0xE8 ? 'CALL' : 'JMP'} ${displacement}`, 'A signed 16-bit displacement is relative to the next instruction. CALL first saves the logical return IP on SS:SP.', opcode === 0xE8 ? 'call' : 'jmp', {displacement});
  }
  if (opcode === 0xC3) return instruction(1, 'RET', 'Pop the logical return IP from SS:SP. CS is unchanged by this near return.', 'ret');
  if (opcode >= 0xA0 && opcode <= 0xA3) {
    const register = opcode & 1 ? 'AX' : 'AL', memory = `[DS:0x${hex(word(1),4)}]`;
    return instruction(3, `MOV ${opcode < 0xA2 ? `${register}, ${memory}` : `${memory}, ${register}`}`, 'A little-endian 16-bit offset addresses memory in DS. The opcode selects an 8-bit or 16-bit read or write.', opcode < 0xA2 ? 'loadMemory' : 'storeMemory', {value: word(1), width: opcode & 1 ? 2 : 1});
  }
  if (opcode === 0xCD) return instruction(2, `INT 0x${hex(byte(1))}`, 'The immediate identifies a BIOS interrupt. This teaching model only represents teletype output and the explicitly described BIOS calls.', 'interrupt', {value: byte(1)});
  if (opcode === 0xAC) return instruction(1, 'LODSB', 'Read the byte at DS:SI into AL, then advance SI when the direction flag is clear.', 'lodsb');
  if (opcode === 0xAD) return instruction(1, 'LODSW', 'Read a word at DS:SI into AX; DF selects whether SI advances or retreats by two.', 'lodsw');
  if (opcode === 0xAA || opcode === 0xAB) return instruction(1, opcode === 0xAA ? 'STOSB' : 'STOSW', 'Store AL or AX at ES:DI; DF selects whether DI advances or retreats.', 'stos', {width: opcode === 0xAA ? 1 : 2});
  if (opcode === 0xEE) return instruction(1, 'OUT DX, AL', 'Write AL to the I/O port in DX. The model records COM1 data writes separately from screen output.', 'out');
  if (opcode === 0xEC) return instruction(1, 'IN AL, DX', 'Read an I/O port. This bounded model only supplies the ready flag for the COM1 line-status register.', 'in');
  if (opcode === 0xE6) return instruction(2, `OUT 0x${hex(byte(1))}, AL`, 'Write AL to the immediate I/O port. Port 0xE9 is a QEMU debug-console convention.', 'outImmediate', {value: byte(1)});
  const simple = {0x90:['NOP','Do nothing.','nop'],0xFA:['CLI','Clear the interrupt-enable flag.','cli'],0xFB:['STI','Set the interrupt-enable flag.','sti'],0xFC:['CLD','Clear the direction flag so string operations advance.','cld'],0xFD:['STD','Set the direction flag so string operations retreat.','std'],0xF8:['CLC','Clear the carry flag.','clc'],0xF9:['STC','Set the carry flag.','stc'],0xF4:['HLT','Stop stepping. A real CPU can wake from HLT on an interrupt.','halt']};
  if (simple[opcode]) return instruction(1, ...simple[opcode]);
  throw new Error(`Encoding 0x${hex(opcode ?? 0)} is outside this limited simulator. No instruction was executed.`);
}

export function createState(bytes = [], loadAddress = 0x7C00) {
  if (!(Array.isArray(bytes) || bytes instanceof Uint8Array) || bytes.length > 4096 || Array.from(bytes).some(value => !Number.isInteger(value) || value < 0 || value > 255)) throw new Error('The loaded program must contain at most 4,096 valid bytes.');
  if (!Number.isInteger(loadAddress) || loadAddress < 0 || loadAddress + bytes.length > (1 << 20)) throw new Error('The loaded program must fit in the 1 MiB model memory.');
  const memory = new Uint8Array(1 << 20);
  memory.set(bytes, loadAddress);
  return {AX:0,CX:0,DX:0,BX:0,SP:0,BP:0,SI:0,DI:0,CS:loadAddress > 65535 ? loadAddress >>> 4 : 0,DS:0,ES:0,SS:0,ip:0,loadAddress,zf:false,cf:false,sf:false,of:false,pf:false,af:false,df:false,interrupts:false,halted:false,steps:0,output:'',serial:'',uartDLAB:false,memory};
}

function resultFlags(state, result, width) {
  state.zf = result === 0;
  state.sf = Boolean(result & (width === 8 ? 0x80 : 0x8000));
  let bits = result & 255, parity = 0;
  while (bits) { parity ^= bits & 1; bits >>>= 1; }
  state.pf = parity === 0;
}

function arithmeticFlags(state, left, right, subtract, carry = 0, width = 16) {
  const mask=(1<<width)-1,full=subtract?left-right-carry:left+right+carry,result=full&mask;
  state.cf = subtract ? full < 0 : full > mask;
  state.of = Boolean((subtract ? (left ^ right) : ~(left ^ right)) & (left ^ result) & (1<<(width-1)));
  state.af = Boolean((left ^ right ^ result) & 16);
  resultFlags(state, result, width);
  return result;
}

export function step(bytes, state) {
  if (state.halted) return null;
  if (state.steps >= 4096) throw new Error('The 4,096-step educational limit was reached. Reset to continue.');
  if (state.ip < 0 || state.ip >= bytes.length) throw new Error('Instruction pointer left the loaded program.');
  const instruction = decode(state.memory.subarray(state.loadAddress, state.loadAddress + bytes.length), state.ip);
  instruction.memoryChanges = [];
  let next;
  const low = value => { state.AX = (state.AX & 0xFF00) | (value & 255); };
  const registerByte=(name,high,value)=>{state[name]=high?(state[name]&255)|((value&255)<<8):(state[name]&0xFF00)|(value&255);};
  const address = (segment, offset, width = 1) => {
    if (width === 2 && offset === 65535) throw new Error('A word crossing a segment limit is outside this model.');
    return physicalAddress(segment, offset);
  };
  const read = (segment, offset, width) => {
    const start = address(segment, offset, width);
    return state.memory[start] | (width === 2 ? state.memory[(start + 1) & 0xFFFFF] << 8 : 0);
  };
  const write = (segment, offset, width, value) => {
    const start = address(segment, offset, width);
    for (let index = 0; index < width; index++) {
      const offset = (start + index) & 0xFFFFF, before = state.memory[offset], after = (value >> (index * 8)) & 255;
      state.memory[offset] = after;
      if (before !== after) instruction.memoryChanges.push({offset,before,after});
    }
  };
  const push = value => { const sp = (state.SP - 2) & 65535; write(state.SS, sp, 2, value); state.SP = sp; };
  const pop = () => { const value = read(state.SS, state.SP, 2); state.SP = (state.SP + 2) & 65535; return value; };
  const toProgramIP = ip => physicalAddress(state.CS, ip & 65535) - state.loadAddress;
  const branch = () => { next = toProgramIP(logicalIP(state) + instruction.size + instruction.displacement); };
  const logicFlags = (value, width) => { resultFlags(state, value, width); state.cf = false; state.of = false; state.af = null; };
  next = toProgramIP(logicalIP(state) + instruction.size);
  switch (instruction.operation) {
    case 'mov16': state[instruction.register] = instruction.value; break;
    case 'mov8': registerByte(instruction.register,instruction.high,instruction.value);break;
    case 'movRegister': {
      const source=state[instruction.source];
      if(instruction.width===2)state[instruction.register]=source;
      else {
        registerByte(instruction.register,instruction.high,source>>(instruction.sourceHigh?8:0));
      }
      break;
    }
    case 'loadRegisterMemory': case 'storeRegisterMemory': {
      const memory=instruction.memory,offset=(memory.bases.reduce((sum,name)=>sum+state[name],0)+memory.displacement)&65535;
      if(instruction.operation==='loadRegisterMemory') {
        const value=read(state[memory.segment],offset,instruction.width);
        if(instruction.width===2)state[instruction.register]=value;else registerByte(instruction.register,instruction.high,value);
      }else {
        const value=instruction.width===2?state[instruction.register]:(state[instruction.register]>>(instruction.high?8:0))&255;
        write(state[memory.segment],offset,instruction.width,value);
      }
      break;
    }
    case 'segment': state[instruction.segment] = state[instruction.source]; break;
    case 'xor': state[instruction.register] ^= state[instruction.source]; logicFlags(state[instruction.register], 16); break;
    case 'add': state.AX = arithmeticFlags(state, state.AX, instruction.value, false); break;
    case 'adc': case 'sbb': {
      const result=arithmeticFlags(state,instruction.width===8?state.AX&255:state.AX,instruction.value,instruction.operation==='sbb',Number(state.cf),instruction.width);
      if(instruction.width===8)low(result);else state.AX=result;
      break;
    }
    case 'sub': case 'cmp': { const result = arithmeticFlags(state, state.AX, instruction.value, true); if (instruction.operation === 'sub') state.AX = result; break; }
    case 'inc': case 'dec': { const carry = state.cf; state[instruction.register] = arithmeticFlags(state, state[instruction.register], 1, instruction.operation === 'dec'); state.cf = carry; break; }
    case 'push': push(state[instruction.register]); break;
    case 'pushImmediate': push(instruction.value); break;
    case 'pop': state[instruction.register] = pop(); break;
    case 'test': logicFlags(state.AX & 255, 8); break;
    case 'testImmediate': logicFlags((state.AX & 255) & instruction.value, 8); break;
    case 'farJump': state.CS = instruction.segment; next = physicalAddress(state.CS, instruction.value) - state.loadAddress; break;
    case 'call': push((logicalIP(state) + instruction.size) & 65535); branch(); break;
    case 'ret': next = toProgramIP(pop()); break;
    case 'jmp': branch(); break;
    case 'jz': if (state.zf) branch(); break;
    case 'jnz': if (!state.zf) branch(); break;
    case 'jb': if (state.cf) branch(); break;
    case 'jae': if (!state.cf) branch(); break;
    case 'jbe': if (state.cf || state.zf) branch(); break;
    case 'ja': if (!state.cf && !state.zf) branch(); break;
    case 'jl': if (state.sf !== state.of) branch(); break;
    case 'jge': if (state.sf === state.of) branch(); break;
    case 'jle': if (state.zf || state.sf !== state.of) branch(); break;
    case 'jg': if (!state.zf && state.sf === state.of) branch(); break;
    case 'jo': if (state.of) branch(); break;
    case 'jno': if (!state.of) branch(); break;
    case 'js': if (state.sf) branch(); break;
    case 'jns': if (!state.sf) branch(); break;
    case 'jp': if (state.pf) branch(); break;
    case 'jnp': if (!state.pf) branch(); break;
    case 'loop': state.CX = (state.CX - 1) & 65535; if (state.CX !== 0) branch(); break;
    case 'loadMemory': { const value = read(state.DS, instruction.value, instruction.width); if (instruction.width === 1) low(value); else state.AX = value; break; }
    case 'storeMemory': write(state.DS, instruction.value, instruction.width, state.AX); break;
    case 'lodsb': case 'lodsw': { const width = instruction.operation === 'lodsb' ? 1 : 2, value = read(state.DS, state.SI, width); if (width === 1) low(value); else state.AX = value; state.SI = (state.SI + (state.df ? -width : width)) & 65535; break; }
    case 'stos': write(state.ES, state.DI, instruction.width, state.AX); state.DI = (state.DI + (state.df ? -instruction.width : instruction.width)) & 65535; break;
    case 'cli': state.interrupts = false; break;
    case 'sti': state.interrupts = true; break;
    case 'cld': state.df = false; break;
    case 'std': state.df = true; break;
    case 'clc': state.cf = false; break;
    case 'stc': state.cf = true; break;
    case 'halt': state.halted = true; break;
    case 'interrupt':
      if (instruction.value === 0x10 && (state.AX >> 8) === 0x0E) state.output += String.fromCharCode(state.AX & 255);
      else if (instruction.value === 0x10 && state.AX === 3) state.output = '';
      else throw new Error(`INT 0x${hex(instruction.value)} with AH=0x${hex(state.AX >> 8)} needs BIOS services outside this model.`);
      break;
    case 'out': if (state.DX === 0x3FB) state.uartDLAB = Boolean(state.AX & 0x80); else if (state.DX === 0x3F8 && !state.uartDLAB) state.serial += String.fromCharCode(state.AX & 255); break;
    case 'outImmediate': if (instruction.value === 0xE9) state.serial += String.fromCharCode(state.AX & 255); break;
    case 'in': if (state.DX !== 0x3FD) throw new Error('Only COM1 line-status reads are modeled.'); low(0x20); break;
    case 'nop': break;
    default: throw new Error('Unsupported operation.');
  }
  state.ip = next; state.steps += 1;
  return instruction;
}
