import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {inspectEncoding} from '../site/encoding.mjs';
import {encodingExamples} from '../site/encoding-presets.mjs';

const fixture=(bytes,mode,mnemonic,size,width)=>{
  const result=inspectEncoding(bytes,mode);
  assert.equal(result.mnemonic,mnemonic);assert.equal(result.size,size);assert.equal(result.width,width);
  assert.equal(result.fields.length,size);assert.equal(result.bitFields.length,size);
  assert.ok(result.bitFields.every(bits=>bits.length===8&&bits.every(bit=>typeof bit==='string')));
  return result;
};
fixture([0xB8,42,0],16,'MOV AX, 42',3,16);
fixture([0xB8,42,0,0,0],32,'MOV EAX, 42',5,32);
fixture([0xB8,42,0,0,0],64,'MOV EAX, 42',5,32);
fixture([0x66,0xB8,42,0,0,0],16,'MOV EAX, 42',6,32);
fixture([0x66,0xB8,42,0],32,'MOV AX, 42',4,16);
fixture([0x66,0xB8,42,0],64,'MOV AX, 42',4,16);
fixture([0x66,0x49,0xB8,42,0,0,0,0,0,0,0],64,'MOV R8, 42',11,64);
fixture([0x41,0xB8,42,0,0,0],64,'MOV R8D, 42',6,32);
fixture([0x66,0x41,0xB8,42,0],64,'MOV R8W, 42',5,16);
fixture([0x49],16,'DEC CX',1,16);fixture([0x49],32,'DEC ECX',1,32);
assert.throws(()=>inspectEncoding([0x49],64),/prefix needs/);
const wide=fixture(encodingExamples.mov64.bytes,64,'MOV R8, 18446744073709551615',10,64);
assert.equal(wide.value,0xFFFFFFFFFFFFFFFFn);assert.equal(wide.bitFields[0][0],'B: register extension');
assert.equal(wide.bitFields[0][3],'W: 64-bit operand');assert.equal(wide.bitFields[9][7],'Immediate bit 63');
for(const example of Object.values(encodingExamples))assert.equal(createHash('sha256').update(Uint8Array.from(example.bytes)).digest('hex'),example.sha256);
const registers=['AX','CX','DX','BX','SP','BP','SI','DI'];
const golden=JSON.parse(readFileSync(new URL('./fixtures/encoding-golden.json',import.meta.url),'utf8'));
for(const entry of golden.cases) {
  const expected=entry.disassembly.toUpperCase().replace(/0X([0-9A-F]+)/g,(_,value)=>BigInt(`0x${value}`).toString()).replace(/,\s*/g,', ');
  const result=inspectEncoding(encodingExamples[entry.source].bytes,entry.mode);
  assert.equal(result.mnemonic,expected,'independent disassembly golden');assert.equal(result.size,entry.size);
}
for(const mode of [16,32,64])for(const prefix of [[],[0x66]])for(let index=0;index<8;index++) {
  const width=prefix.length?(mode===16?32:16):mode===16?16:32;
  const name=(width===16?'':'E')+registers[index];
  fixture([...prefix,0xB8+index,...Array(width/8).fill(0xFF)],mode,`MOV ${name}, ${(1n<<BigInt(width))-1n}`,prefix.length+1+width/8,width);
}
for(let rex=0x40;rex<=0x4F;rex++)for(let opcode=0xB8;opcode<=0xBF;opcode++) {
  const width=rex&8?64:32,index=opcode-0xB8+(rex&1?8:0);
  const name=index<8?(width===64?'R':'E')+registers[index]:`R${index}${width===32?'D':''}`;
  fixture([rex,opcode,...Array(width/8).fill(255)],64,`MOV ${name}, ${(1n<<BigInt(width))-1n}`,2+width/8,width);
}
fixture([0x31,0xC0],32,'XOR EAX, EAX',2,32);
fixture([0x4D,0x31,0xC8],64,'XOR R8, R9',3,64);
fixture([0x66,0x31,0xC0],32,'XOR AX, AX',3,16);
assert.equal(inspectEncoding([0x0F,5],64).mnemonic,'SYSCALL');
for(const [bytes,mode] of [[[0x66,0x66,0xB8,0,0],16],[[0x48,0x66,0xB8,0,0],64],[[0x41,0x90],64],[[0x31,0],64],[[0x66,0x48],64]])assert.throws(()=>inspectEncoding(bytes,mode));
for(const invalid of [[],[256],[-1],[1.5],[NaN],Array(65).fill(0),null,'bits'])assert.throws(()=>inspectEncoding(invalid,16),/valid bytes/);
for(const invalid of [0,8,'16',128,null])assert.throws(()=>inspectEncoding([0x90],invalid),/explicit/);
const complete=[0x49,0xB8,...Array(8).fill(255)];
for(let size=1;size<complete.length;size++)assert.throws(()=>inspectEncoding(complete.slice(0,size),64),/Truncated/);
console.log('Encoding checks passed: explicit 16/32/64 contexts, 66/REX precedence, every MOV register/REX combination, exact imm64, XOR ModR/M extensions, byte/bit roles, truncated and unsupported scopes. Inspection never executes target code.');
