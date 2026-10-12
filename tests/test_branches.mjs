import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createState,decode,step,logicalIP} from '../site/simulator.mjs';
import {inspectEncoding} from '../site/encoding.mjs';
import {parseBits} from '../site/binary.mjs';
import {createHistory,recordStep,rewind,replay} from '../site/history.mjs';

const bytes=Uint8Array.of(0x70,0),state=createState(bytes,0);
const names=['jo','jno','jb','jae','jz','jnz','jbe','ja','js','jns','jp','jnp','jl','jge','jle','jg'];
let cases=0;
for(let flags=0;flags<32;flags++) {
  const cf=flags&1,pf=(flags>>1)&1,zf=(flags>>2)&1,sf=(flags>>3)&1,of=(flags>>4)&1,less=sf^of;
  const conditions=[of,1-of,cf,1-cf,zf,1-zf,cf|zf,1-(cf|zf),sf,1-sf,pf,1-pf,less,1-less,zf|less,1-(zf|less)];
  for(let selector=0;selector<16;selector++)for(let displacement=0;displacement<256;displacement++) {
    state.ip=0;state.steps=0;state.memory[0]=0x70+selector;state.memory[1]=displacement;
    Object.assign(state,{cf:Boolean(cf),pf:Boolean(pf),zf:Boolean(zf),sf:Boolean(sf),of:Boolean(of),af:null,df:true,interrupts:false});
    const instruction=step(bytes,state),signed=displacement<128?displacement:displacement-256;
    assert.equal(instruction.operation,names[selector]);
    assert.equal(state.ip,conditions[selector]?(2+signed+65536)%65536:2);
    assert.deepEqual([state.cf,state.pf,state.zf,state.sf,state.of,state.af,state.df,state.interrupts],[Boolean(cf),Boolean(pf),Boolean(zf),Boolean(sf),Boolean(of),null,true,false]);
    assert.deepEqual(instruction.memoryChanges,[]);
    cases++;
  }
}
assert.equal(cases,131072);

// Compare actual operands independently of the model's flag implementation.
const signed=value=>value<32768?value:value-65536;
const relations=[(a,b)=>a<=b,(a,b)=>a>b,(a,b)=>signed(a)<signed(b),(a,b)=>signed(a)>=signed(b),(a,b)=>signed(a)<=signed(b),(a,b)=>signed(a)>signed(b)];
const opcodes=[0x76,0x77,0x7C,0x7D,0x7E,0x7F],program=Uint8Array.of(0x3D,0,0,0x76,3),compare=createState(program,0);
const values=[0,1,0x7FFE,0x7FFF,0x8000,0x8001,0xFFFE,0xFFFF],pairs=values.flatMap(a=>values.map(b=>[a,b]));
let seed=0xC0FFEE;
for(let index=0;index<500;index++) {
  seed=(Math.imul(seed,1664525)+1013904223)>>>0;const a=seed&65535;
  seed=(Math.imul(seed,1664525)+1013904223)>>>0;pairs.push([a,seed&65535]);
}
for(const [a,b] of pairs)for(let index=0;index<opcodes.length;index++) {
  compare.ip=0;compare.steps=0;compare.AX=a;
  compare.memory.set([0x3D,b&255,b>>8,opcodes[index],3]);
  step(program,compare);const before=[compare.cf,compare.pf,compare.af,compare.zf,compare.sf,compare.of];
  step(program,compare);
  assert.equal(compare.ip,relations[index](a,b)?8:5,`${a} compared to ${b}, opcode ${opcodes[index]}`);
  assert.deepEqual([compare.cf,compare.pf,compare.af,compare.zf,compare.sf,compare.of],before);
  assert.equal(compare.AX,a);
}
for(const opcode of opcodes) {
  assert.throws(()=>decode([opcode]),/Truncated/);
  assert.throws(()=>decode([0x66,opcode,0]),/outside/);
  assert.equal(inspectEncoding([opcode,0x80],16).size,2);
  for(const mode of [32,64])assert.throws(()=>inspectEncoding([opcode,0x80],mode),/outside/);
}
for(const displacement of [0x80,0x7F,0,0xFE]) {
  const wrapBytes=Uint8Array.of(0x7C,displacement),wrap=createState(wrapBytes,0xFFFE);wrap.sf=true;wrap.of=false;
  step(wrapBytes,wrap);
  assert.equal(logicalIP(wrap),(displacement<128?displacement:displacement-256)+65536&65535);
}
const source=parseBits(readFileSync(new URL('../docs/instruction-encoding/fixtures/signed-branches.bits',import.meta.url),'utf8'));
assert.equal(source.length,95);
const execution=createState(source),history=createHistory(execution);
while(!execution.halted)recordStep(history,source);
assert.equal(logicalIP(execution),0x7C5D);
assert.equal(execution.steps,31);
assert.deepEqual(['AX','BX','CX','DX','SI','DI','BP','SP'].map(name=>execution[name]),[0x1234,0,0x1111,0x2222,0x3333,0x4444,0x5555,0x7C00]);
const final={...execution,memory:execution.memory.slice()};
while(history.position)rewind(history);
assert.equal(execution.steps,0);assert.deepEqual(execution.memory.slice(0x7C00,0x7C00+95),source);
while(history.position<history.frames.length)replay(history);
assert.deepEqual(execution,final);
console.log(`Short-branch checks passed: ${cases} complete condition/rel8 combinations, ${pairs.length*6} independent signed/unsigned operand comparisons, IP wrap, strict scope, exact literal overflow exercise and rewind/replay. Native proof is separate.`);
