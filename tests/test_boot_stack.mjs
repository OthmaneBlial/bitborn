import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseBits} from '../site/binary.mjs';
import {createState,step} from '../site/simulator.mjs';

const root=new URL('../',import.meta.url),targets=JSON.parse(readFileSync(new URL('targets.json',root),'utf8'));
const sources=targets.filter(target=>target.bios||target.bootable).map(target=>target.source);
sources.push('examples/self-modifying/control.bits','examples/bounded-allocator/control.bits','examples/bit-hunt/no-star.bits');
let checked=0;
for(const source of sources) {
  const bytes=parseBits(readFileSync(new URL(source,root),'utf8')),state=createState(bytes);
  state.SS=0xF000;state.SP=1;state.AX=0xBEEF;state.interrupts=true;
  let established=false;
  while(!established&&bytes[state.ip]!==0xCD&&!state.halted&&state.steps<64) {
    step(bytes,state);
    if(!established&&state.SP===0x7C00) {
      assert.equal(state.SS,0,`${source}: establish SS before SP`);
      assert.equal(state.interrupts,false,`${source}: mask interrupts while establishing the stack`);
      established=true;
    }
  }
  assert.equal(established,true,`${source}: replace the inherited stack`);
  assert.equal(state.SS,0,`${source}: establish SS before calling BIOS`);
  assert.equal(state.SP,0x7C00,`${source}: establish SP before calling BIOS`);
  checked++;
}
assert.equal(checked,12);
console.log('Boot-stack checks passed: twelve reviewed standalone boot/control headers establish SS:SP with interrupts masked during setup, before their first BIOS call or near call, from deliberately perturbed model entry registers. Later STI remains allowed. This checks setup ordering, not BIOS emulation or physical hardware.');
