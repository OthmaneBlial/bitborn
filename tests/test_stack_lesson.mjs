import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {parseBits} from '../site/binary.mjs';
import {createState, logicalIP} from '../site/simulator.mjs';
import {createHistory, recordStep, rewind, replay} from '../site/history.mjs';
import {programSources} from '../site/cpu-lab/memory-program.mjs';

const source = readFileSync(new URL('../docs/cpu-lab/stack.bits', import.meta.url), 'utf8');
assert.equal(programSources.stack.source, source);
const bytes = parseBits(source), original = [...bytes];
assert.equal(bytes.length, 13);
const disassembly = spawnSync('ndisasm', ['-b', '16', '-'], {input: Uint8Array.from(bytes), encoding: 'utf8'});
assert.ifError(disassembly.error);
assert.equal(disassembly.status, 0, disassembly.stderr);
assert.deepEqual(disassembly.stdout.trim().split('\n').map(line => line.trim().split(/\s+/).slice(2).join(' ')),
  ['mov ax,0x1234', 'push ax', 'xor ax,ax', 'pop bx', 'call 0xb', 'hlt', 'inc ax', 'ret']);
const rows = [
  [0,0,0x7C00,0x7C00,0,0], [0x1234,0,0x7C00,0x7C03,0,0],
  [0x1234,0,0x7BFE,0x7C04,0x34,0x12], [0,0,0x7BFE,0x7C06,0x34,0x12],
  [0,0x1234,0x7C00,0x7C07,0x34,0x12], [0,0x1234,0x7BFE,0x7C0B,0x0A,0x7C],
  [1,0x1234,0x7BFE,0x7C0C,0x0A,0x7C], [1,0x1234,0x7C00,0x7C0A,0x0A,0x7C],
  [1,0x1234,0x7C00,0x7C0B,0x0A,0x7C],
];
const guide = readFileSync(new URL('../docs/tutorials/stack-and-calls.md', import.meta.url), 'utf8');
const table = guide.split('\n').filter(line => /^\| [0-8] \|/.test(line)).map(line => {
  const cells = line.split('|').map(cell => cell.trim());
  return [...cells.slice(3,7), ...cells[7].split('/').map(cell => cell.trim())].map(value => parseInt(value,16));
});
assert.deepEqual(table,rows,'published checkpoint table stays synchronized');
const state = createState(bytes); state.SP = 0x7C00;
const history = createHistory(state), snapshots = [];
const snapshot = () => { const {memory, ...values} = state; return {values, memory: memory.slice()}; };
const check = index => {
  assert.deepEqual([state.AX,state.BX,state.SP,logicalIP(state),state.memory[0x7BFE],state.memory[0x7BFF]],rows[index]);
  assert.equal(state.halted,index===8);
  assert.deepEqual(Array.from(state.memory.slice(0x7C00,0x7C0D)),original);
};
check(0); snapshots.push(snapshot());
for(let index=1;index<rows.length;index++){recordStep(history,bytes);check(index);snapshots.push(snapshot());}
assert.equal(history.frames.length,8);
for(let index=7;index>=0;index--){rewind(history);check(index);assert.deepEqual(snapshot(),snapshots[index]);}
assert.equal(rewind(history),null);
for(let index=1;index<rows.length;index++){replay(history);check(index);assert.deepEqual(snapshot(),snapshots[index]);}
assert.equal(replay(history),null);
assert.deepEqual(Array.from(bytes),original);
console.log('stack lesson: original 13-byte source, independent NDISASM, all nine checkpoints, retained/overwritten words, exact full RAM/state rewind/replay and immutable source pass');
