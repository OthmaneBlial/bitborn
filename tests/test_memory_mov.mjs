import assert from 'node:assert/strict';
import {createState,step,decode} from '../site/simulator.mjs';
import {decodeAddress16} from '../site/address16.mjs';
import {createHistory,recordStep,rewind,replay} from '../site/history.mjs';

const names=['AX','CX','DX','BX','SP','BP','SI','DI'],mapping=[[3,6],[3,7],[5,6],[5,7],[6],[7],[5],[3]],flags=['cf','pf','af','zf','sf','interrupts','df','of'];
const state=createState([0,0,0,0]),view=new DataView(new ArrayBuffer(16));let cases=0;
for(const opcode of [0x88,0x89,0x8A,0x8B])for(let mod=0;mod<3;mod++)for(let rm=0;rm<8;rm++)for(let reg=0;reg<8;reg++)for(const trial of [0,1,2]) {
  const words=[0xABCD,0x5678,0x9ABC,0x2345,0x1234,0x3456,0x4567,0x5678];
  words.forEach((value,index)=>{state[names[index]]=value;view.setUint16(index*2,value,true);});
  state.DS=0x1000;state.SS=0x2000;state.ip=0;state.steps=0;state.halted=false;
  flags.forEach((name,index)=>state[name]=name==='af'&&trial===2?null:Boolean((index+trial)%2));
  const beforeFlags=flags.map(name=>state[name]),absolute=mod===0&&rm===6,count=absolute||mod===2?2:mod===1?1:0;
  const encoded=count===1?[0,127,128][trial]:count===2?[0x20,0x7FFF,0x8000][trial]:0;
  const displacement=absolute?encoded:count===1&&encoded>=128?encoded-256:count===2&&encoded>=32768?encoded-65536:encoded;
  const indexes=absolute?[]:mapping[rm],offset=(indexes.reduce((sum,index)=>sum+words[index],0)+displacement)%65536;
  const wrapped=offset<0?offset+65536:offset,segment=indexes.includes(5)?0x2000:0x1000,physical=segment*16+wrapped;
  const width=opcode%2===0?1:2,bytes=Uint8Array.from([opcode,mod*64+reg*8+rm,...(count===1?[encoded]:count===2?[encoded%256,Math.floor(encoded/256)]:[])]);
  state.memory.set(bytes,state.loadAddress);state.memory[physical]=0xE1;state.memory[physical+1]=0x72;
  const wordIndex=width===2?reg:reg%4,byteIndex=[0,2,4,6,1,3,5,7][reg],expectedWords=words.slice();
  let expectedChanges=[];
  if(opcode>=0x8A) {
    if(width===2)expectedWords[wordIndex]=0x72E1;
    else {view.setUint8(byteIndex,0xE1);expectedWords[wordIndex]=view.getUint16(wordIndex*2,true);}
  }else {
    const value=width===2?words[reg]:view.getUint8(byteIndex);
    for(let part=0;part<width;part++) {
      const old=part?0x72:0xE1,next=Math.floor(value/(256**part))%256;
      if(old!==next)expectedChanges.push({offset:physical+part,before:old,after:next});
    }
  }
  const result=step(bytes,state);
  names.forEach((name,index)=>assert.equal(state[name],expectedWords[index],`${result.mnemonic} register ${name}`));
  assert.deepEqual(result.memoryChanges,expectedChanges);assert.deepEqual(flags.map(name=>state[name]),beforeFlags);
  if(opcode>=0x8A)assert.deepEqual([state.memory[physical],state.memory[physical+1]],[0xE1,0x72]);
  else {const value=width===2?words[reg]:view.getUint8(byteIndex);assert.equal(state.memory[physical],value%256);if(width===2)assert.equal(state.memory[physical+1],Math.floor(value/256));}
  assert.equal(state.ip,bytes.length);cases++;
}
for(const opcode of [0x89,0x8B]) {
  const bytes=Uint8Array.from([opcode,0x06,0xFF,0xFF]),cpu=createState(bytes);cpu.AX=0x1234;
  const before=cpu.memory.slice();assert.throws(()=>step(bytes,cpu),/segment limit/);
  assert.deepEqual(cpu.memory,before);assert.equal(cpu.AX,0x1234);assert.equal(cpu.ip,0);assert.equal(cpu.steps,0);
}
for(const opcode of [0x88,0x8A]) {
  const bytes=Uint8Array.from([opcode,0x06,0xFF,0xFF]),cpu=createState(bytes);cpu.AX=0x1234;cpu.memory[0xFFFF]=0xE1;
  step(bytes,cpu);
  if(opcode===0x8A)assert.equal(cpu.AX,0x12E1);else assert.equal(cpu.memory[0xFFFF],0x34);
}
for(const opcode of [0x89,0x8B]) {
  const bytes=Uint8Array.from([opcode,0x07]),cpu=createState(bytes);cpu.DS=0xFFFF;cpu.BX=15;cpu.AX=0x1234;
  cpu.memory[0xFFFFF]=0xCD;cpu.memory[0]=0xAB;
  const result=step(bytes,cpu);
  if(opcode===0x8B)assert.equal(cpu.AX,0xABCD);
  else assert.deepEqual(result.memoryChanges,[{offset:0xFFFFF,before:0xCD,after:0x34},{offset:0,before:0xAB,after:0x12}]);
}
const program=Uint8Array.from([0xB0,0xF4,0xBB,7,0x7C,0x88,7,0x90]),cpu=createState(program),history=createHistory(cpu);
for(let index=0;index<4;index++)recordStep(history,program,cpu);
assert.equal(cpu.halted,true);assert.equal(cpu.memory[0x7C07],0xF4);
for(let index=0;index<4;index++)rewind(history,cpu);
assert.equal(cpu.memory[0x7C07],0x90);assert.equal(cpu.AX,0);assert.equal(cpu.BX,0);
for(let index=0;index<4;index++)replay(history,cpu);
assert.equal(cpu.memory[0x7C07],0xF4);assert.equal(cpu.halted,true);assert.equal(program[7],0x90,'original loaded bytes remain distinct from runtime code');
const first=decodeAddress16([0x8B,0]);first.bases[0]='AX';assert.deepEqual(decodeAddress16([0x8B,0]).bases,['BX','SI']);
for(const [bytes,index] of [[null,1],[[0x8B,0xC0],1],[[0x8B,0x46],1],[[0x8B,0x46,256],1],[[0x8B,0],-1]])assert.throws(()=>decodeAddress16(bytes,index));
for(const bytes of [[0x66,0x8B,0],[0x67,0x8B,0],[0x36,0x8B,0]])assert.throws(()=>decode(bytes),/outside this limited/);
console.log(`Memory MOV checks passed: ${cases} independent register/address/data/flag cases, old-base load aliases, byte halves, exact RAM journals, atomic word-limit errors, A20 wrap, live code modification and full undo/replay.`);
