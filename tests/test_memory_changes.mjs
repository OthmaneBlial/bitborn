import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createState,step} from '../site/simulator.mjs';
import {parseBits} from '../site/binary.mjs';
import {presets} from '../site/cpu-lab/presets.mjs';

function check(bytes, initialize = () => {}) {
  const state=createState(bytes);initialize(state);
  while (!state.halted) {
    const before=state.memory.slice(), instruction=step(bytes,state), expected=[];
    for(let offset=0;offset<before.length;offset++)if(before[offset]!==state.memory[offset])expected.push({offset,before:before[offset],after:state.memory[offset]});
    assert.deepEqual([...instruction.memoryChanges].sort((a,b)=>a.offset-b.offset),expected,`${instruction.mnemonic} journal matches an independent full-memory comparison`);
    assert.ok(instruction.memoryChanges.length<=2,'each supported instruction changes at most two memory bytes');
  }
  return state;
}
for(const preset of presets)check(parseBits(preset.source),state=>{state.SP=0x7C00;});
check([0xB8,0xCD,0xAB,0x88,0xE0,0x8A,0xE0,0x89,0xC3,0xF4]);
const wrap=check([0xA3,15,0,0xF4],state=>{state.DS=0xFFFF;state.AX=0x1234;});
assert.deepEqual([wrap.memory[0xFFFFF],wrap.memory[0]],[0x34,0x12]);
check([0xA3,0,0x82,0xF4]); // Writing zero over zero has no changed bytes.
const modified=check([0xB0,0xF4,0xA2,5,0x7C,0x90]);assert.equal(modified.steps,3);
const boot=JSON.parse(readFileSync(new URL('../site/boot.json',import.meta.url))).bytes;
const state=check(boot);assert.equal(state.steps,2825,'the full boot includes transient stack writes while printing');
console.log('Memory-change checks passed: independent full-memory oracle, all presets, unchanged stores, stack/calls, A20 boundary, self-modification and the full boot.');
