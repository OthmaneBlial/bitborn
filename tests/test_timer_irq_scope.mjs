import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseBits} from '../site/binary.mjs';
import {createState,step} from '../site/simulator.mjs';

for(const name of ['program','control','no-eoi']) {
  const source=readFileSync(new URL(`../examples/timer-irq/${name}.bits`,import.meta.url),'utf8');
  assert.throws(()=>parseBits(source),error=>error.code==='BYTE_LIMIT','the UI parser does not accept a 568-byte payload');
  const bytes=parseBits(source,1024),state=createState(bytes,0x7E00);
  state.SS=0xF000;state.SP=1;state.interrupts=true;state.df=true;
  for(let count=0;count<7;count++)step(bytes,state);
  assert.equal(state.ip,16);assert.equal(state.steps,7);
  assert.deepEqual([state.CS,state.DS,state.SS,state.SP,state.interrupts,state.df],[0,0,0,0x7C00,false,false]);
  const before=structuredClone(state);
  assert.throws(()=>step(bytes,state),/Encoding 0x0F.*outside/);
  assert.deepEqual(state,before,'unsupported LGDT preserves all registers, flags and RAM');
}
console.log('Timer scope: all three 568-byte native stages exceed the CPU lab input bound; a separate prefix check establishes the stack and stops after seven steps at unsupported LGDT, before PIC/PIT setup or 32-bit execution.');
