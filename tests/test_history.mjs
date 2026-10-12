import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createState} from '../site/simulator.mjs';
import {createHistory,recordStep,rewind,replay,seek} from '../site/history.mjs';
import {parseBits} from '../site/binary.mjs';
import {presets} from '../site/cpu-lab/presets.mjs';

const saved=state=>({...state,memory:state.memory.slice()});
function roundTrip(bytes,initialize=()=>{}) {
  const state=createState(bytes);initialize(state);
  const history=createHistory(state),initial=saved(state),states=[];
  assert.equal(rewind(history),null);assert.equal(replay(history),null);
  while(!state.halted){recordStep(history,bytes);states.push(saved(state));}
  const final=saved(state),length=history.frames.length;
  assert.ok(length<=4096);
  assert.ok(history.frames.every(frame=>!Object.hasOwn(frame.before,'memory')&&!Object.hasOwn(frame.after,'memory')),'recorded states never contain RAM snapshots');
  assert.equal(recordStep(history,bytes),null);assert.equal(history.frames.length,length);
  for(let index=states.length-1;index>=0;index--){rewind(history);assert.deepEqual(state,index?states[index-1]:initial);}
  assert.equal(history.position,0);assert.equal(rewind(history),null);
  for(const expected of states){replay(history);assert.deepEqual(state,expected);}
  assert.deepEqual(state,final);assert.equal(replay(history),null);
  for(const position of [0,length,Math.floor(length/2),0,length]) {
    const origin=saved(state),result=seek(history,position);
    assert.deepEqual(state,position ? states[position-1] : initial);
    if(result) {
      const expected=[];
      for(let offset=0;offset<state.memory.length;offset++)if(origin.memory[offset]!==state.memory[offset])expected.push({offset,before:origin.memory[offset],after:state.memory[offset]});
      assert.deepEqual(result.memoryChanges.sort((a,b)=>a.offset-b.offset),expected,'seeking reports net RAM changes, including repeated writes');
      const {memory:_memory,...scalar}=origin;
      assert.deepEqual(result.before,scalar,'comparison starts at the state left by the user');
    }
  }
  const stable=saved(state);
  assert.equal(seek(history,length),null);
  for(const invalid of [-1,length+1,0.5,NaN,Infinity,'0'])assert.throws(()=>seek(history,invalid),/integer within the timeline/);
  assert.deepEqual(state,stable,'invalid seeks leave state unchanged');
  return history;
}
for(const preset of presets)roundTrip(parseBits(preset.source),state=>{state.SP=0x7C00;});
roundTrip([0xB0,0xF4,0xA2,5,0x7C,0x90]); // Undo restores NOP after self-modification.
roundTrip([0xA3,15,0,0xF4],state=>{state.DS=0xFFFF;state.AX=0x1234;});
roundTrip([0xB4,0x0E,0xB0,65,0xCD,0x10,0xB0,66,0xE6,0xE9,0xB8,3,0,0xCD,0x10,0xF4]); // Output append and screen clear.
roundTrip([0xBA,0xFB,3,0xB0,0x80,0xEE,0xF4]); // UART divisor-latch state.
roundTrip([0xB0,65,0xA2,0,0x90,0xB0,0,0xA2,0,0x90,0xF4]); // Repeated writes can have no net RAM change.
const branchBytes=[0xB8,1,0,0x40,0xF4],branch=roundTrip(branchBytes);
rewind(branch);rewind(branch);
const abandoned=branch.frames[1];recordStep(branch,branchBytes);
assert.equal(branch.frames.length,2);assert.notEqual(branch.frames[1],abandoned,'new execution replaces the future after a rewind');
assert.equal(replay(branch),null);
const bad=[0x90,0xFF],badState=createState(bad),badHistory=createHistory(badState);
recordStep(badHistory,bad);const before=saved(badState);
assert.throws(()=>recordStep(badHistory,bad),/outside this limited/);
assert.deepEqual(badState,before);assert.equal(badHistory.position,1);assert.equal(badHistory.frames.length,1);
const loop=[0xEB,0xFE],loopState=createState(loop),loopHistory=createHistory(loopState);
for(let index=0;index<4096;index++)recordStep(loopHistory,loop);
assert.throws(()=>recordStep(loopHistory,loop),/4,096/);assert.equal(loopHistory.frames.length,4096);
while(rewind(loopHistory)){}assert.equal(loopState.steps,0);
while(replay(loopHistory)){}assert.equal(loopState.steps,4096);
seek(loopHistory,0);assert.equal(loopState.steps,0);
seek(loopHistory,4096);assert.equal(loopState.steps,4096);
const boot=JSON.parse(readFileSync(new URL('../site/boot.json',import.meta.url))).bytes;
const bootState=createState(boot),bootHistory=createHistory(bootState),initial=saved(bootState);
while(!bootState.halted)recordStep(bootHistory,boot);
const final=saved(bootState);assert.equal(bootHistory.frames.length,2825);
while(rewind(bootHistory)){}assert.deepEqual(bootState,initial);
while(replay(bootHistory)){}assert.deepEqual(bootState,final);
seek(bootHistory,0);assert.deepEqual(bootState,initial);
seek(bootHistory,2825);assert.deepEqual(bootState,final);
console.log('History checks passed: exact register/flag/RAM/output restoration, arbitrary timeline seeks and net-write oracles, stack/calls, branches, self-modification, A20, UART, forks, failures, 4,096-step bounds and full-boot rewind/replay without RAM snapshots.');
