import assert from 'node:assert/strict';
import {programFragment,parseProgramFragment} from '../site/program-link.mjs';

let seed=0xB17A1;
const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed;};
for(let trial=0;trial<1000;trial++) {
  const bytes=Uint8Array.from({length:1+random()%512},()=>random()&255),before=bytes.slice();
  const fragment=programFragment(bytes);
  assert.equal(fragment.length,12+bytes.length*2);
  assert.deepEqual(parseProgramFragment(fragment),before);
  assert.deepEqual(parseProgramFragment(fragment.slice(0,12)+fragment.slice(12).toLowerCase()),before);
  assert.deepEqual(bytes,before,'link encoding does not mutate the loaded program');
}
const all=Uint8Array.from({length:256},(_,index)=>index);
assert.deepEqual(parseProgramFragment(programFragment(all)),all);
assert.deepEqual(parseProgramFragment(programFragment(new Uint8Array(512))),new Uint8Array(512));
for(const value of [[],null,new Uint8Array(0),new Uint8Array(513)])assert.throws(()=>programFragment(value));
for(const hash of ['#program=','#program=v1.','#program=v2.F4','#program=v1.F','#program=v1.FG','#program=v1.F4&x=1','#program=v1.%46%34','#program=v1.F4 ','#program=v1.F4\n','#program=v1.'+'00'.repeat(513)])assert.throws(()=>parseProgramFragment(hash));
for(const hash of ['', '#editor', '#x=F4'])assert.equal(parseProgramFragment(hash),null);
assert.throws(()=>parseProgramFragment(null));
console.log('Program-link checks passed: all byte values, 1–512-byte bounds, 1,000 seeded exact round trips, immutable input and strict version/hex/length rejection.');
