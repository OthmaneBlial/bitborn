import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseBits} from '../site/binary.mjs';
import {createState,step} from '../site/simulator.mjs';

for(const name of ['program','no-star']) {
  const bytes=parseBits(readFileSync(new URL(`../examples/bit-hunt/${name}.bits`,import.meta.url),'utf8'));
  assert.equal(bytes.length,492,'payload fits the import bound');
  const state=createState(bytes);state.SS=0xF000;state.SP=1;state.df=true;
  for(let index=0;index<14;index++)step(bytes,state);
  assert.equal(state.ip,31);assert.equal(state.steps,14);
  assert.deepEqual([state.CS,state.DS,state.SS,state.SP,state.ES,state.df,state.interrupts],[0,0,0,0x7C00,0xB800,false,true]);
  const before=structuredClone(state);
  assert.throws(()=>step(bytes,state),/Encoding 0xC6.*outside/);
  assert.deepEqual(state,before,'unsupported guard store leaves complete model state and RAM unchanged');
}
console.log('Bit Hunt scope: two 492-byte imports stop atomically at the first unsupported C6 memory store after fourteen setup steps; keyboard play and native VGA game behavior are not emulated.');
