import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseBits} from '../site/binary.mjs';
import {createState,step} from '../site/simulator.mjs';

for(const name of ['program','control']) {
  const bytes=parseBits(readFileSync(new URL(`../examples/bounded-allocator/${name}.bits`,import.meta.url),'utf8'));
  const state=createState(bytes),original=Array.from(bytes);
  for(let count=0;count<65;count++)step(bytes,state);
  assert.equal(state.ip,202);assert.equal(state.steps,65);assert.equal(state.halted,false);
  const before={AX:state.AX,BX:state.BX,DI:state.DI,SP:state.SP,ip:state.ip,steps:state.steps};
  assert.throws(()=>step(bytes,state),/Encoding 0x01.*outside/);
  assert.deepEqual({AX:state.AX,BX:state.BX,DI:state.DI,SP:state.SP,ip:state.ip,steps:state.steps},before);
  assert.deepEqual(before,{AX:3,BX:0x2000,DI:0x2000,SP:0x7BFE,ip:202,steps:65});
  assert.deepEqual(Array.from(state.memory.slice(0x2100,0x2106)),[255,255,0,32,1,0]);
  assert.deepEqual(Array.from(state.memory.slice(0x1FFF,0x2011)),[0xA5,...Array(16).fill(0),0x5A]);
  assert.deepEqual(Array.from(state.memory.slice(0x7C00,0x7C00+bytes.length)),original);
}
console.log('allocator scope: both native fixtures stop honestly at unsupported register ADD after 65 model steps; zero rejection log, guards, active call stack, state and source remain intact');
