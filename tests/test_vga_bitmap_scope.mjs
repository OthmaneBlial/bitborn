import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseBits} from '../site/binary.mjs';
import {createState,step,logicalIP} from '../site/simulator.mjs';

for(const name of ['program','control']) {
  const bytes=parseBits(readFileSync(new URL(`../examples/vga-bitmap/${name}.bits`,import.meta.url),'utf8'));
  assert.equal(bytes.length,142);
  const state=createState(bytes);
  for(let count=0;count<6;count++)step(bytes,state);
  assert.equal(state.SS,0);assert.equal(state.SP,0x7C00);assert.equal(state.AX,0x13);
  assert.equal(logicalIP(state),0x7C10);assert.equal(state.steps,6);
  assert.throws(()=>step(bytes,state),/needs BIOS services outside this model/);
  assert.equal(logicalIP(state),0x7C10);assert.equal(state.steps,6);
  assert.equal(state.output,'');assert.equal(state.serial,'');
  assert.ok(state.memory.slice(0xA0000,0xA0000+64000).every(value=>value===0),'the text-mode model does not fabricate native graphics');
}
console.log('VGA bitmap scope checks passed: both literal native programs initialize their stack, then stop at unsupported BIOS graphics mode; the browser model emits no invented graphics or text.');
