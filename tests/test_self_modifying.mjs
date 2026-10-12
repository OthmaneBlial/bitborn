import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseBits} from '../site/binary.mjs';
import {createState,logicalIP} from '../site/simulator.mjs';
import {createHistory,recordStep,rewind,replay} from '../site/history.mjs';

const load=name=>parseBits(readFileSync(new URL(`../examples/self-modifying/${name}.bits`,import.meta.url),'utf8'));
const program=load('program'),control=load('control');
assert.equal(program.length,80);assert.equal(control.length,80);
assert.deepEqual([...program.keys()].filter(index=>program[index]!==control[index]),[50]);
assert.equal(program[50]^control[50],0x20);
for(const [source,character] of [[program,0x61],[control,0x41]]) {
  const original=source.slice(),state=createState(source),initial={...state,memory:state.memory.slice()},history=createHistory(state);
  for(let index=0;index<26;index++)recordStep(history,source);
  assert.equal(state.memory[0x7C3B],0x41);
  const write=recordStep(history,source);
  assert.deepEqual(write.memoryChanges,character===0x61?[{offset:0x7C3B,before:0x41,after:0x61}]:[]);
  assert.equal(state.memory[0x7C3B],character);
  rewind(history);assert.equal(state.memory[0x7C3B],0x41);
  replay(history);assert.equal(state.memory[0x7C3B],character);
  recordStep(history,source);const modified=recordStep(history,source);
  assert.equal(modified.instruction.value,character,'the decoder reads the current code RAM, not original bytes');
  assert.equal(state.AX&255,character);
  while(!state.halted)recordStep(history,source);
  assert.equal(state.steps,39);assert.equal(logicalIP(state),0x7C4E);
  assert.equal(state.serial,String.fromCharCode(character));assert.deepEqual([...state.memory.slice(0xB8000,0xB8002)],[character,0x0F]);
  assert.deepEqual(['AX','BX','CX','DX','SI','DI','BP','SP','CS','DS','SS','ES'].map(name=>state[name]),[0x0F00|character,0x7C3B,0,0x3F8,0,2,0,0x7C00,0,0,0,0xB800]);
  assert.deepEqual(source,original);
  const final={...state,memory:state.memory.slice()};
  while(history.position)rewind(history);
  assert.deepEqual(state,initial);
  while(history.position<history.frames.length)replay(history);
  assert.deepEqual(state,final);
}
console.log('Self-modification checks passed: one source-writer bit, one live code-operand bit, exact no-op control, fresh fetch, serial/VGA, 39 steps, immutable source and whole-state rewind/replay. Native proof is separate.');
