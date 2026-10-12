import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createState,decode,step,logicalIP} from '../site/simulator.mjs';
import {parseBits} from '../site/binary.mjs';
import {inspectEncoding} from '../site/encoding.mjs';
import {createHistory,recordStep,rewind,replay} from '../site/history.mjs';

// Independent ripple adder: subtract adds complemented bits with inverted borrow-in.
function oracle(left,right,subtract,incoming,width) {
  let carry=subtract?1-incoming:incoming,result=0,half=0,signCarry=0;
  for(let bit=0;bit<width;bit++) {
    if(bit===width-1)signCarry=carry;
    const sum=((left>>>bit)&1)+(((right>>>bit)&1)^Number(subtract))+carry;
    result|=(sum%2)<<bit;carry=Math.floor(sum/2);
    if(bit===3)half=carry;
  }
  const ones=(result&255).toString(2).split('1').length-1;
  return {result,cf:Boolean(carry^Number(subtract)),af:Boolean(half^Number(subtract)),of:signCarry!==carry,
    zf:result===0,sf:Boolean(result&(1<<(width-1))),pf:ones%2===0};
}
const bytes=Uint8Array.of(0,0,0),cpu=createState(bytes);let count=0;
function check(left,right,subtract,incoming,width) {
  const opcode=(subtract?0x1C:0x14)+(width===16?1:0),expected=oracle(left,right,subtract,incoming,width);
  cpu.ip=0;cpu.steps=0;cpu.AX=width===8?0xAB00|left:left;
  cpu.memory.set([opcode,right&255,right>>8],cpu.loadAddress);
  Object.assign(cpu,{cf:Boolean(incoming),pf:false,af:null,zf:true,sf:true,of:true,df:true,interrupts:true});
  const instruction=step(bytes,cpu);
  assert.equal(cpu.AX,width===8?0xAB00|expected.result:expected.result);
  for(const name of ['cf','af','of','zf','sf','pf'])assert.equal(cpu[name],expected[name],`${name}: ${left}, ${right}, borrow=${subtract}, in=${incoming}, width=${width}`);
  assert.equal(cpu.df,true);assert.equal(cpu.interrupts,true);
  assert.deepEqual(instruction.memoryChanges,[]);assert.equal(instruction.size,width===8?2:3);
  count++;
}
for(let left=0;left<256;left++)for(let right=0;right<256;right++)for(const subtract of [false,true])for(let incoming=0;incoming<2;incoming++)check(left,right,subtract,incoming,8);
const borders=[0,1,0x0F,0x10,0x7FFE,0x7FFF,0x8000,0x8001,0xFFFE,0xFFFF];
const pairs=borders.flatMap(left=>borders.map(right=>[left,right]));let seed=0xADC5BB;
for(let trial=0;trial<2048;trial++) {
  seed=(Math.imul(seed,1664525)+1013904223)>>>0;const left=seed&65535;
  seed=(Math.imul(seed,1664525)+1013904223)>>>0;pairs.push([left,seed&65535]);
}
for(const [left,right] of pairs)for(const subtract of [false,true])for(let incoming=0;incoming<2;incoming++)check(left,right,subtract,incoming,16);
assert.equal(count,270736);
for(const opcode of [0x14,0x15,0x1C,0x1D]) {
  assert.throws(()=>decode([opcode]),/Truncated/);
  if(opcode&1)assert.throws(()=>decode([opcode,0]),/Truncated/);
  assert.throws(()=>decode([0x66,opcode,0,0]),/outside/);
  assert.equal(inspectEncoding([opcode,0,0],16).operation,opcode&8?'sbb':'adc');
  for(const mode of [32,64])assert.throws(()=>inspectEncoding([opcode,0,0],mode),/outside/);
}
const source=parseBits(readFileSync(new URL('../docs/instruction-encoding/fixtures/carry-borrow.bits',import.meta.url),'utf8'));
assert.equal(source.length,81);
const state=createState(source),history=createHistory(state);
while(!state.halted)recordStep(history,source);
assert.equal(logicalIP(state),0x7C4F);assert.equal(state.steps,32);
assert.deepEqual(['AX','BX','CX','DX','SI','DI','BP','SP'].map(name=>state[name]),[0xAB00,0,0,1,0xFFFF,0xFFFF,0xFFFF,0x7C00]);
assert.deepEqual([...state.memory.slice(0x2000,0x2004)],[0,0xAB,0,0xAB]);
const final={...state,memory:state.memory.slice()};
while(history.position)rewind(history);
assert.deepEqual([...state.memory.slice(0x2000,0x2004)],[0,0,0,0]);
while(history.position<history.frames.length)replay(history);
assert.deepEqual(state,final);
console.log(`Carry checks passed: ${count} independent ripple-carry/borrow cases, all byte operands and incoming CF, seeded/boundary words, AH/IF/DF preservation, strict encodings and exact 81-byte multiword/history exercise.`);
