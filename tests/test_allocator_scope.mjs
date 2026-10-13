import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseBits} from '../site/binary.mjs';
import {createState,step,flagsWord,logicalIP} from '../site/simulator.mjs';
import {createHistory,recordStep,rewind,replay} from '../site/history.mjs';

const captures=JSON.parse(readFileSync(new URL('../assets/bounded-allocator-recording.json',import.meta.url),'utf8')).captures;
for(const [index,name] of ['program','control'].entries()) {
  const bytes=parseBits(readFileSync(new URL(`../examples/bounded-allocator/${name}.bits`,import.meta.url),'utf8'));
  const state=createState(bytes),original=Array.from(bytes),history=createHistory(state);
  const snapshot=()=>{const {memory,...values}=state;return {values,memory:Buffer.from(memory)};};
  const snapshots=[snapshot()];
  while(!state.halted){recordStep(history,bytes);snapshots.push(snapshot());}
  const capture=captures[index].snapshot;
  assert.equal(state.steps,name==='program'?135:137);assert.equal(state.ip,193);
  for(const [register,value] of Object.entries({...capture.registers,...capture.segments}))assert.equal(state[register],value,register);
  assert.equal(logicalIP(state),capture.haltIP);
  assert.equal(flagsWord(state)&capture.definedFlagsMask,capture.flags&capture.definedFlagsMask);
  assert.equal(Buffer.from(state.memory.slice(0x2100,0x211E)).toString('hex'),capture.nativeLogHex);
  assert.equal(Buffer.from(state.memory.slice(0x1FFF,0x2011)).toString('hex'),capture.arenaAndGuardsHex);
  assert.deepEqual(Array.from(state.memory.slice(0x7C00,0x7C00+bytes.length)),original);
  const memory=Buffer.from(state.memory.buffer,state.memory.byteOffset,state.memory.byteLength);
  const compare=expected=>{const {memory:_,...values}=state;assert.deepEqual(values,expected.values);assert.deepEqual(memory,expected.memory);};
  for(let position=snapshots.length-2;position>=0;position--){rewind(history);compare(snapshots[position]);}
  for(let position=1;position<snapshots.length;position++){replay(history);compare(snapshots[position]);}
  assert.deepEqual(Array.from(bytes),original,'literal input never changes');
}
for(const bytes of [[0x01],[0x03],[0x01,0],[0x03,0],[0x00,0xD8],[0x02,0xD8],[0x66,0x01,0xD8]]) {
  const state=createState(bytes),before=structuredClone(state);
  assert.throws(()=>step(bytes,state),/Truncated|outside/);
  assert.deepEqual(state,before,'unsupported forms preserve all state and RAM');
}
console.log('allocator model/native agreement: both literal fixtures halt after 135/137 steps with exact five-entry logs, guards, code RAM, registers and defined flags; every full RAM/state checkpoint rewinds/replays, and unsupported ADD forms preserve state');
