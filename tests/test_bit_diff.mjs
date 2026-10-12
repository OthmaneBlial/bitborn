import assert from 'node:assert/strict';
import {comparePrograms} from '../site/bit-diff.mjs';

const bytes=values=>Uint8Array.from(values);
const direction=comparePrograms(bytes([0x89,0xD8]),bytes([0x8B,0xD8]));
assert.deepEqual(direction.totals,{modified:1,added:0,removed:0,flippedBits:1,reinterpreted:1});
assert.equal(direction.rows[1].kind,'reinterpreted');assert.equal(direction.rows[1].bits.length,0);assert.equal(direction.rows[1].roleChanges.length,6);
assert.equal(direction.rows[0].bits[0].bit,1);assert.match(direction.rows[0].bits[0].beforeRole,/Direction/);
assert.equal(direction.before.instructions[0].mnemonic,'MOV AX, BX');assert.equal(direction.after.instructions[0].mnemonic,'MOV BX, AX');
const sign=comparePrograms(bytes([0x8B,0x46,0xFE]),bytes([0x8B,0x46,0x7E]));
assert.equal(sign.rows[0].bits[0].bit,7);assert.equal(sign.rows[0].bits[0].beforeRole,'Displacement sign bit');
const changedRole=comparePrograms(bytes([0xB8,0x90,0,0xF4]),bytes([0x90,0x90,0,0xF4]));
assert.equal(changedRole.before.map[1].field,'immediate 1/2');assert.equal(changedRole.after.map[1].mnemonic,'NOP');
assert.equal(changedRole.after.error.offset,2);assert.equal(changedRole.after.map[3],null,'classification never resynchronizes after an unsupported byte');
const added=comparePrograms(bytes([0xF4]),bytes([0xF4,0]));
assert.deepEqual(added.totals,{modified:0,added:1,removed:0,flippedBits:0,reinterpreted:0});assert.ok(added.rows[0].bits.every(bit=>bit.before===null));
const removed=comparePrograms(bytes([0xF4,0]),bytes([0xF4]));assert.equal(removed.totals.removed,1);assert.equal(removed.totals.flippedBits,0);
const context16=comparePrograms(bytes([0xB8,42,0,0,0]),bytes([0xB8,43,0,0,0]),16);
const context32=comparePrograms(bytes([0xB8,42,0,0,0]),bytes([0xB8,43,0,0,0]),32);
assert.equal(context16.before.instructions[0].end,3);assert.equal(context32.before.instructions[0].end,5);
let seed=0xB17D1FF;
const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed;};
for(let trial=0;trial<500;trial++) {
  const a=Uint8Array.from({length:1+random()%64},()=>random()&255),b=Uint8Array.from({length:1+random()%64},()=>random()&255),before=a.slice(),after=b.slice();
  const result=comparePrograms(a,b,[16,32,64][trial%3]);let changed=0,flips=0;
  for(let offset=0;offset<Math.min(a.length,b.length);offset++) {
    if(a[offset]!==b[offset])changed++;
    const left=a[offset].toString(2).padStart(8,'0'),right=b[offset].toString(2).padStart(8,'0');
    for(let bit=0;bit<8;bit++)if(left[bit]!==right[bit])flips++;
  }
  assert.equal(result.totals.modified,changed);assert.equal(result.totals.flippedBits,flips);
  assert.equal(result.totals.added,Math.max(0,b.length-a.length));assert.equal(result.totals.removed,Math.max(0,a.length-b.length));
  assert.deepEqual(a,before);assert.deepEqual(b,after);
  for(const side of [result.before,result.after])for(let index=1;index<side.instructions.length;index++)assert.equal(side.instructions[index].start,side.instructions[index-1].end);
}
const maximum=new Uint8Array(512).fill(0x90);assert.equal(comparePrograms(maximum,maximum).before.instructions.length,512);
for(const invalid of [null,[],new Uint8Array(0),new Uint8Array(513)])assert.throws(()=>comparePrograms(invalid,bytes([0x90])));
for(const mode of [0,8,'16',null])assert.throws(()=>comparePrograms(bytes([0x90]),bytes([0x90]),mode));
console.log('Bit diff checks passed: exact offsets/bit counts, missing bytes distinct from zeros, direction/sign field roles, mode-dependent boundaries, stop-on-scope-error, immutable inputs and 500 seeded bit-string oracle comparisons. No execution.');
