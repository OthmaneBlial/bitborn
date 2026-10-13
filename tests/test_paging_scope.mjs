import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseBits} from '../site/binary.mjs';
import {createState,step} from '../site/simulator.mjs';

for(const name of ['program','writable','wp-off']) {
  const bytes=parseBits(readFileSync(new URL(`../examples/paging/${name}.bits`,import.meta.url),'utf8'));
  assert.equal(bytes.length,424);
  const state=createState(bytes);state.SS=0xF000;state.SP=1;state.interrupts=true;state.df=true;
  for(let count=0;count<7;count++)step(bytes,state);
  assert.equal(state.ip,16);assert.equal(state.steps,7);
  assert.deepEqual([state.CS,state.DS,state.SS,state.SP,state.interrupts,state.df],[0,0,0,0x7C00,false,false]);
  const before=structuredClone(state);
  assert.throws(()=>step(bytes,state),/Encoding 0x0F.*outside/);
  assert.deepEqual(state,before,'unsupported LGDT preserves all state and RAM before paging setup');
}
console.log('Paging scope: three literal 424-byte programs fit the import bound but stop after seven setup instructions at LGDT; no protected-mode, paging, TLB or native fault behavior is simulated.');
