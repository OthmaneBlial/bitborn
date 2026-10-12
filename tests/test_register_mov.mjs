import assert from 'node:assert/strict';
import {decode,createState,step} from '../site/simulator.mjs';
import {inspectEncoding} from '../site/encoding.mjs';
import {createHistory,recordStep,rewind,replay} from '../site/history.mjs';

const registers=['AX','CX','DX','BX','SP','BP','SI','DI'],bytePositions=[0,2,4,6,1,3,5,7];
const flags=['cf','pf','af','zf','sf','interrupts','df','of'];
const cpu=createState([0x90,0x90]);let cases=0;
let seed=0x16B17;
const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed;};
for(const opcode of [0x88,0x89,0x8A,0x8B])for(let reg=0;reg<8;reg++)for(let rm=0;rm<8;rm++)for(let trial=0;trial<8;trial++) {
  const bytes=Uint8Array.from([opcode,0xC0+reg*8+rm]);
  const before=new Uint8Array(16),view=new DataView(before.buffer);
  for(let index=0;index<8;index++){const value=random()&65535;cpu[registers[index]]=value;view.setUint16(index*2,value,true);}
  for(let index=0;index<flags.length;index++)cpu[flags[index]]=flags[index]==='af'&&trial%3===0?null:Boolean(trial&(1<<(index%3)));
  const priorFlags=flags.map(name=>cpu[name]),oracle=before.slice(),src=opcode<0x8A?reg:rm,dst=opcode<0x8A?rm:reg;
  if(opcode%2===0)oracle[bytePositions[dst]]=before[bytePositions[src]];
  else {oracle[dst*2]=before[src*2];oracle[dst*2+1]=before[src*2+1];}
  cpu.ip=0;cpu.steps=0;cpu.halted=false;cpu.memory.set(bytes,cpu.loadAddress);
  const result=step(bytes,cpu),expected=new DataView(oracle.buffer);
  for(let index=0;index<8;index++)assert.equal(cpu[registers[index]],expected.getUint16(index*2,true));
  assert.deepEqual(flags.map(name=>cpu[name]),priorFlags,'all defined/undefined modeled flags are preserved');
  assert.deepEqual(result.memoryChanges,[]);assert.equal(cpu.ip,2);assert.equal(cpu.steps,1);
  assert.equal(result.mnemonic,inspectEncoding(bytes,16).mnemonic,'execution and inspection agree on the unprefixed 16-bit form');cases++;
}
for(const opcode of [0x88,0x89,0x8A,0x8B]) {
  assert.throws(()=>decode([opcode]),/Truncated/);
  for(let modrm=0;modrm<0xC0;modrm++)assert.throws(()=>decode([opcode,modrm]),/Memory-form MOV/);
}
assert.throws(()=>decode([0x66,0x89,0xD8]),/outside this limited/);
const program=Uint8Array.from([0xB8,0xCD,0xAB,0x88,0xE0,0x8A,0xE0,0x89,0xC3,0xF4]);
const state=createState(program),history=createHistory(state);
for(let index=0;index<5;index++)recordStep(history,program,state);
assert.equal(state.AX,0xABAB);assert.equal(state.BX,0xABAB);assert.equal(state.halted,true);
for(let index=0;index<5;index++)rewind(history,state);
assert.equal(state.AX,0);assert.equal(state.BX,0);assert.equal(state.ip,0);
for(let index=0;index<5;index++)replay(history,state);
assert.equal(state.BX,0xABAB);assert.equal(state.halted,true);
console.log(`Register MOV checks passed: ${cases} independent byte-layout oracle cases, aliased high/low byte copies, all word registers including SP, preserved nullable flags, strict scope and exact history rewind/replay.`);
