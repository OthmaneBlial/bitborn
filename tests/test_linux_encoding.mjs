import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {parseBits} from '../site/binary.mjs';
import {inspectEncoding} from '../site/encoding.mjs';
import {encodingExamples} from '../site/encoding-presets.mjs';

for(let immediate=0;immediate<256;immediate++) {
  const bytes=[0x6A,immediate],original=[...bytes],result=inspectEncoding(bytes,64);
  assert.equal(result.value,BigInt(immediate<128?immediate:immediate-256));
  assert.equal(result.width,64);assert.equal(result.size,2);assert.equal(result.immediateWidth,8);
  assert.equal(result.bitFields[1][7],'Immediate sign bit');assert.deepEqual(bytes,original);
}
let seed=0x74657374;
for(let count=0;count<1000;count++) {
  seed=(Math.imul(seed,1664525)+1013904223)>>>0;
  const raw=new Uint8Array(4),view=new DataView(raw.buffer);view.setUint32(0,seed,true);
  const result=inspectEncoding([0x68,...raw],64);
  assert.equal(result.value,BigInt(view.getInt32(0,true)));assert.equal(result.size,5);assert.equal(result.width,64);
  assert.equal(result.bitFields[4][7],'Immediate sign bit');
}
for(const word of [0,0x7FFFFFFF,0x80000000,0xFFFFFFFF]) {
  const raw=new Uint8Array(4);new DataView(raw.buffer).setUint32(0,word,true);
  assert.equal(inspectEncoding([0x68,...raw],64).value,BigInt(new DataView(raw.buffer).getInt32(0,true)));
}
for(const [index,register] of ['RAX','RCX','RDX','RBX','RSP','RBP','RSI','RDI'].entries()) {
  for(const [opcode,operation] of [[0x50+index,'PUSH'],[0x58+index,'POP']]) {
    const result=inspectEncoding([opcode],64);assert.equal(result.mnemonic,`${operation} ${register}`);assert.equal(result.width,64);
    assert.deepEqual(result.bitFields[0].slice(0,3),Array(3).fill('Register selector'));
  }
}
assert.match(inspectEncoding([0x5C],64).explanation,/loaded RSP replaces/);
const syscall=inspectEncoding([0x0F,0x05],64);
assert.equal(syscall.mnemonic,'SYSCALL');assert.match(syscall.explanation,/RDI, RSI, RDX, R10, R8 and R9/);
assert.match(syscall.explanation,/infers no syscall number/);
for(const bytes of [[0x66,0x6A,1],[0x41,0x58],[0x48,0x68,0,0,0,0],[0x66,0x0F,5],[0x6A],[0x68,1,2,3]])assert.throws(()=>inspectEncoding(bytes,64));
assert.throws(()=>inspectEncoding([0x0F,5],16));assert.throws(()=>inspectEncoding([0x0F,5],32));
const hashes=bytes=>createHash('sha256').update(bytes).digest('hex');
for(const [name,entry] of Object.entries(encodingExamples).filter(([name])=>name.startsWith('linux'))) {
  const source=parseBits(readFileSync(new URL(`../${entry.source}`,import.meta.url),'utf8'));
  assert.equal(hashes(source),entry.sourcePayloadSha256,name);assert.deepEqual([...source.slice(...entry.sourceByteRange)],entry.bytes,name);
  assert.equal(hashes(Uint8Array.from(entry.bytes)),entry.sha256,name);
}
const compact=['linuxPushNumber','linuxPopNumber','linuxPushArgument','linuxPopArgument','linuxSyscall'].flatMap(name=>encodingExamples[name].bytes);
assert.deepEqual(compact,[...parseBits(readFileSync(new URL('../examples/exit-code-small/program.bits',import.meta.url),'utf8'))]);
const baseline=['linuxMovNumber','linuxMovArgument','linuxSyscall'].flatMap(name=>encodingExamples[name].bytes);
assert.deepEqual(baseline,[...parseBits(readFileSync(new URL('../examples/exit-code/program.bits',import.meta.url),'utf8'))]);
console.log('Linux encoding checks passed: all imm8 signs, 1,000 seeded imm32 words plus boundaries, all low-register stack selectors, strict prefixes/modes/truncation, ABI text and exact canonical 8/12-byte payload reconstruction. No execution.');
