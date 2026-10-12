// Inspection only. Execution remains in the separate bounded 16-bit model.
import {decode,hex} from './simulator.mjs';

const registers=['AX','CX','DX','BX','SP','BP','SI','DI'];
const registerName=(index,width)=>index<8 ? (width===16?'':width===32?'E':'R')+registers[index] : `R${index}${width===16?'W':width===32?'D':''}`;
const byteRegisterName=(index,rex)=>index>=8?`R${index}B`:rex!==null&&index>=4?['SPL','BPL','SIL','DIL'][index-4]:['AL','CL','DL','BL','AH','CH','DH','BH'][index];
const bitNames=name=>Array(8).fill(name);

export function inspectEncoding(bytes,mode=16) {
  if(![16,32,64].includes(mode))throw new Error('Choose an explicit 16-, 32- or 64-bit decoding context.');
  if(!(Array.isArray(bytes)||bytes instanceof Uint8Array)||!bytes.length||bytes.length>64||Array.from(bytes).some(value=>!Number.isInteger(value)||value<0||value>255))throw new Error('Inspection requires 1–64 valid bytes.');
  let offset=0,override=false,rex=null;
  const fields=[],bitFields=[];
  if(bytes[offset]===0x66) {
    override=true;fields.push('operand-size prefix');bitFields.push(bitNames('Operand-size override'));offset++;
  }
  if(mode===64&&bytes[offset]>=0x40&&bytes[offset]<=0x4F) {
    rex=bytes[offset++];fields.push('REX prefix');
    bitFields.push(['B: register extension','X: index extension','R: register extension','W: 64-bit operand','REX marker','REX marker','REX marker','REX marker']);
  }
  if(offset===bytes.length)throw new Error('Truncated instruction: a prefix needs a following opcode.');
  const opcode=bytes[offset],width=rex!==null&&(rex&8)?64:override?(mode===16?32:16):mode===16?16:32;
  const finish=(size,mnemonic,explanation,extra={})=>({size,mnemonic,explanation,mode,width,fields,bitFields,...extra});
  if(opcode>=0xB8&&opcode<=0xBF) {
    const count=width/8;
    if(bytes.length<offset+1+count)throw new Error(`Truncated MOV: ${width}-bit operand needs ${count} immediate bytes after the opcode.`);
    const register=registerName(opcode-0xB8+(rex!==null&&(rex&1)?8:0),width);
    fields.push('opcode + register');bitFields.push(['Register selector','Register selector','Register selector','MOV opcode','MOV opcode','MOV opcode','MOV opcode','MOV opcode']);
    let value=0n;
    for(let index=0;index<count;index++) {
      value|=BigInt(bytes[offset+1+index])<<BigInt(index*8);
      fields.push(`immediate ${index+1}/${count}`);
      bitFields.push(Array.from({length:8},(_,bit)=>`Immediate bit ${index*8+bit}`));
    }
    if(rex!==null){bitFields[override?1:0][1]='X: unused by this MOV';bitFields[override?1:0][2]='R: unused by this MOV';}
    const effect=mode===64?(width===32?'Writing this 32-bit register clears its upper 32 bits.':width===16?'Writing 16 bits preserves the upper register bits.':'The full 64-bit register is written.'):'MOV copies the immediate bit pattern without changing flags.';
    return finish(offset+1+count,`MOV ${register}, ${value}`,`Context ${mode}; operand width ${width}. Opcode bits 2–0 select ${register}${rex!==null&&(rex&1)?' with REX.B extending the selector':''}. The ${count} immediate bytes are little-endian. ${effect}`,{register,value});
  }
  if(opcode>=0x88&&opcode<=0x8B) {
    const modrm=bytes[offset+1];
    if(modrm===undefined)throw new Error('Truncated MOV: a ModR/M byte is missing.');
    const operandWidth=opcode&1?width:8,direction=Boolean(opcode&2);
    if(modrm<0xC0) {
      if(mode!==16)throw new Error('Memory-form MOV inspection supports 16-bit addressing context only. No addressing mode was guessed.');
      const mod=modrm>>6,rm=modrm&7,absolute=mod===0&&rm===6;
      const bases=absolute?[]:[['BX','SI'],['BX','DI'],['BP','SI'],['BP','DI'],['SI'],['DI'],['BP'],['BX']][rm];
      const count=absolute||mod===2?2:mod===1?1:0;
      if(bytes.length<offset+2+count)throw new Error('Truncated MOV: address displacement bytes are missing.');
      let displacement=count?bytes[offset+2]|(count===2?bytes[offset+3]<<8:0):0;
      if(!absolute&&count&&displacement>=(count===1?128:32768))displacement-=count===1?256:65536;
      const segment=bases.includes('BP')?'SS':'DS',reg=(modrm>>3)&7;
      const register=operandWidth===8?byteRegisterName(reg,null):registerName(reg,operandWidth);
      const expression=absolute?String(displacement):bases.join('+')+(count?(displacement<0?String(displacement):'+'+displacement):'');
      const memoryOperand=`[${expression}]`,destination=direction?register:memoryOperand,source=direction?memoryOperand:register;
      fields.push('opcode: direction + width','ModR/M');
      bitFields.push(['Width: byte or default operand','Direction: reg or r/m destination',...Array(6).fill('MOV opcode')],['Memory-address selector','Memory-address selector','Memory-address selector',...Array(3).fill(direction?'Destination register':'Source register'),'Address displacement mode','Address displacement mode']);
      for(let index=0;index<count;index++) {
        fields.push(`${absolute?'absolute offset':'signed displacement'} ${index+1}/${count}`);
        bitFields.push(Array.from({length:8},(_,bit)=>!absolute&&index===count-1&&bit===7?'Displacement sign bit':`Address bit ${index*8+bit}`));
      }
      if(override&&operandWidth===8){fields[0]='ignored operand-size prefix';bitFields[0]=bitNames('Operand-size prefix: unused by byte MOV');}
      return finish(offset+2+count,`MOV ${destination}, ${source}`,`Context 16; operand width ${operandWidth}, address size 16. Default ${segment}${segment==='SS'?' because BP participates in the address':'; no BP base is present'}. The effective offset is (${expression}) modulo 65536. Displacement bytes are little-endian; relative displacement is sign-extended. No registers or RAM were read; memory execution is unavailable.`,{width:operandWidth,register:destination,source,memory:{segment,bases,displacement,absolute,addressBits:16}});
    }
    const regIndex=((modrm>>3)&7)+(rex!==null&&(rex&4)?8:0),rmIndex=(modrm&7)+(rex!==null&&(rex&1)?8:0);
    const name=index=>operandWidth===8?byteRegisterName(index,rex):registerName(index,operandWidth);
    const destination=name(direction?regIndex:rmIndex),source=name(direction?rmIndex:regIndex);
    const regRole=direction?'Destination register':'Source register',rmRole=direction?'Source register':'Destination register';
    fields.push('opcode: direction + width','ModR/M');
    bitFields.push(['Width: byte or default operand','Direction: reg or r/m destination',...Array(6).fill('MOV opcode')],[rmRole,rmRole,rmRole,regRole,regRole,regRole,'Register-direct mode','Register-direct mode']);
    if(rex!==null) {
      const roles=bitFields[override?1:0];roles[0]='B: r/m register extension';roles[1]='X: unused by register-direct MOV';roles[2]='R: reg register extension';
      if(operandWidth===8)roles[3]='W: unused by byte MOV';
    }
    if(override&&operandWidth===8){fields[0]='ignored operand-size prefix';bitFields[0]=bitNames('Operand-size prefix: unused by byte MOV');}
    const effect=mode===64&&operandWidth===32?' Writing a 32-bit destination clears its upper 32 bits.':operandWidth<32?' Other destination register bits are preserved.':'';
    const byteRule=operandWidth===8&&mode===64?' Any REX prefix replaces AH/CH/DH/BH selectors with SPL/BPL/SIL/DIL; REX.W and 66 do not widen a byte MOV.':'';
    return finish(offset+2,`MOV ${destination}, ${source}`,`Context ${mode}; operand width ${operandWidth}. ModR/M mode is 11 (register-direct). Direction bit ${Number(direction)} makes the ${direction?'reg':'r/m'} field the destination; the other is the source. MOV leaves flags unchanged.${effect}${byteRule}`,{width:operandWidth,register:destination,source});
  }
  if(opcode===0x31) {
    const modrm=bytes[offset+1];
    if(modrm===undefined)throw new Error('Truncated XOR: a ModR/M byte is missing.');
    if(modrm<0xC0)throw new Error('Memory-form XOR is outside this inspector. No addressing mode was guessed.');
    const destination=registerName((modrm&7)+(rex!==null&&(rex&1)?8:0),width);
    const source=registerName(((modrm>>3)&7)+(rex!==null&&(rex&4)?8:0),width);
    fields.push('opcode','ModR/M');bitFields.push(bitNames('XOR opcode'),['Destination register','Destination register','Destination register','Source register','Source register','Source register','Register-direct mode','Register-direct mode']);
    if(rex!==null)bitFields[override?1:0][1]='X: unused by register-direct XOR';
    return finish(offset+2,`XOR ${destination}, ${source}`,`Context ${mode}; operand width ${width}. ModR/M bits 7–6 are 11 (register-direct), bits 5–3 choose the source, and bits 2–0 choose the destination. REX.R/B extend those selectors in 64-bit mode. XOR changes arithmetic flags; AF is undefined.`,{register:destination,source});
  }
  if(mode!==64&&opcode>=0x40&&opcode<=0x4F) {
    const operation=opcode<0x48?'INC':'DEC',register=registerName(opcode%8,width);
    fields.push('opcode + register');bitFields.push(['Register selector','Register selector','Register selector',...Array(5).fill(`${operation} opcode`)]);
    return finish(offset+1,`${operation} ${register}`,`Context ${mode}; operand width ${width}. The low three opcode bits select the register. INC/DEC preserve CF. In 64-bit mode, 40–4F are REX prefixes instead of these one-byte instructions.`,{register});
  }
  if(offset===0&&mode===16) {
    const instruction=decode(bytes);
    return {...instruction,mode,width,bitFields:instruction.fields.map(field=>bitNames(field))};
  }
  if(offset===0&&[0x90,0xF4].includes(opcode)) {
    fields.push('opcode');bitFields.push(bitNames('Opcode'));
    return finish(1,opcode===0x90?'NOP':'HLT',opcode===0x90?'Unprefixed NOP changes no general-purpose registers or flags; execution advances the instruction pointer.':'HLT is privileged; decoding it does not establish that it may execute in a user process.');
  }
  if(offset===0&&mode===64&&opcode===0x0F&&bytes[1]===0x05) {
    fields.push('opcode escape','opcode');bitFields.push(bitNames('Two-byte opcode escape'),bitNames('SYSCALL opcode'));
    return finish(2,'SYSCALL','The configured supervisor entry is selected by the processor. Linux x86-64 assigns the syscall number to RAX; this inspector performs no system call.');
  }
  throw new Error(`Encoding 0x${hex(opcode)} is outside this inspector in the selected ${mode}-bit context. No instruction was executed.`);
}
