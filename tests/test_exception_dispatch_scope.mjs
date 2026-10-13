import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseBits} from '../site/binary.mjs';
import {createState,step} from '../site/simulator.mjs';

for(const name of ['program','divisor-one','stop-divide','retry-divide']) {
  const source=readFileSync(new URL(`../examples/exception-dispatch/${name}.bits`,import.meta.url),'utf8');
  const bytes=parseBits(source,1024);assert.equal(bytes.length,736);
  assert.throws(()=>parseBits(source,512),/512/,'the full native stage exceeds the CPU-lab import bound');
  const prefix=bytes.slice(0,40),state=createState(prefix,0x7E00);
  state.SS=0xF000;state.SP=1;state.interrupts=true;state.df=true;
  for(let count=0;count<7;count++)step(prefix,state);
  assert.equal(state.ip,16);assert.equal(state.steps,7);
  assert.deepEqual([state.CS,state.DS,state.SS,state.SP,state.interrupts,state.df],[0,0,0,0x7C00,false,false]);
  const before=structuredClone(state);
  assert.throws(()=>step(prefix,state),/Encoding 0x0F.*outside/);
  assert.deepEqual(state,before,'unsupported LGDT preserves complete model state and RAM');
}
console.log('Exception-dispatch scope: four native stages exceed the import bound; their literal prefixes normalize state then stop at LGDT after seven steps. Native frames and protected-mode dispatch are not simulated.');
