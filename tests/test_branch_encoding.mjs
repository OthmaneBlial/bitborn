import assert from 'node:assert/strict';
import {inspectEncoding} from '../site/encoding.mjs';
import {decode} from '../site/simulator.mjs';

const names=['JO','JNO','JB','JAE','JZ','JNZ','JBE','JA','JS','JNS','JP','JNP','JL','JGE','JLE','JG'];
const conditions=['OF = 1','OF = 0','CF = 1','CF = 0','ZF = 1','ZF = 0','CF = 1 or ZF = 1','CF = 0 and ZF = 0','SF = 1','SF = 0','PF = 1','PF = 0','SF != OF','SF = OF','ZF = 1 or SF != OF','ZF = 0 and SF = OF'];
let count=0;
for(const mode of [16,32,64])for(let selector=0;selector<16;selector++)for(let byte=0;byte<256;byte++) {
  const source=Uint8Array.of(0x70+selector,byte),before=source.slice(),result=inspectEncoding(source,mode),displacement=byte<128?byte:byte-256;
  assert.equal(result.size,2);assert.equal(result.mode,mode);assert.equal(result.width,8);assert.equal(result.displacementWidth,8);
  assert.equal(result.conditionCode,selector);assert.equal(result.condition,conditions[selector]);assert.equal(result.displacement,displacement);
  assert.equal(result.mnemonic,`${names[selector]} ${displacement>=0?'+':''}${displacement}`);
  assert.deepEqual(result.fields,['opcode + condition','signed relative displacement']);
  assert.match(result.bitFields[0][0],/Condition inversion/);
  for(const bit of [1,2,3])assert.equal(result.bitFields[0][bit],'Condition group selector');
  for(const bit of [4,5,6,7])assert.equal(result.bitFields[0][bit],'Short Jcc opcode');
  for(let bit=0;bit<7;bit++)assert.equal(result.bitFields[1][bit],`Relative displacement bit ${bit}`);
  assert.equal(result.bitFields[1][7],'Signed rel8 sign (-128)');
  assert.equal('target' in result,false,'an absolute instruction address was not supplied');
  assert.deepEqual(source,before);
  assert.equal(decode(source).condition,conditions[selector]);count++;
}
assert.equal(count,12288);
for(const mode of [16,32,64])for(let opcode=0x70;opcode<=0x7F;opcode++) {
  assert.throws(()=>inspectEncoding([opcode],mode),/Truncated/);
  assert.throws(()=>inspectEncoding([0x66,opcode,0],mode),/outside/);
  assert.throws(()=>inspectEncoding([0x0F,opcode+0x10,0,0,0,0],mode),/outside/);
}
for(const mode of [16,32])assert.equal(inspectEncoding([0x40,0x7C,0],mode).size,1,'40 is legacy INC, not a prefix in these contexts');
assert.throws(()=>inspectEncoding([0x40,0x7C,0],64),/outside/);
console.log(`Branch-field checks passed: ${count} mode/condition/rel8 combinations, flag predicates, inversion/group/opcode roles, signed displacement bits, immutable input and strict prefix/near scope. No execution or guessed absolute targets.`);
