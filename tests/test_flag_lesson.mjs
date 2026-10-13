import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseBits} from '../site/binary.mjs';
import {createState, step, flagsWord} from '../site/simulator.mjs';
import {createHistory, recordStep, rewind, replay} from '../site/history.mjs';
import {programSources} from '../site/cpu-lab/memory-program.mjs';
import {programFragment} from '../site/program-link.mjs';

const source = path => readFileSync(new URL('../'+path,import.meta.url),'utf8');
const keys = ['cf','of','zf','sf','pf','af'];
const values = state => [state.AX,...keys.map(key=>state[key]===null?'?':Number(state[key]))];
const rows = [[0,0,0,0,0,0,0],[0xFFFF,0,0,0,0,0,0],[0,1,0,1,0,1,1],
  [1,1,0,0,0,0,0],[0xFFFF,1,0,0,1,1,1],[0xFFFF,0,0,1,0,1,0],[0xFFFF,0,0,1,0,1,0]];
const guide = source('docs/tutorials/flags.md');
const table = guide.split('\n').filter(line=>/^\| [0-6] \|/.test(line)).map(line=>{
  const cells=line.split('|').map(cell=>cell.trim());
  return [parseInt(cells[2],16),...cells.slice(3,9).map(Number)];
});
assert.deepEqual(table,rows);
assert.equal(programSources.flags.source,source('docs/cpu-lab/flags.bits'));
const bytes=parseBits(programSources.flags.source),state=createState(bytes);
assert.deepEqual(values(state),rows[0]);
for(let index=1;index<rows.length;index++){step(bytes,state);assert.deepEqual(values(state),rows[index]);}
assert.equal(state.halted,true);
for(const [slug,ax,mask] of [['signed-overflow',0x8000,0x894],['carry-branch',0,0x55]]) {
  const program=parseBits(source(`challenges/${slug}/solution.bits`)),machine=createState(program,0x7E00);
  while(!machine.halted)step(program,machine);
  assert.equal(machine.AX,ax);assert.equal(flagsWord(machine)&0x8D5,mask);
  assert.deepEqual(Array.from(machine.memory.slice(0x7E00,0x7E00+program.length)),Array.from(program));
  if(slug==='signed-overflow')assert.ok(guide.includes(programFragment(program)),'import link preserves every canonical byte');
}
const stack=parseBits(programSources.stack.source),machine=createState(stack);machine.SP=0x7C00;
const history=createHistory(machine);
for(let count=0;count<3;count++)recordStep(history,stack);
assert.deepEqual(values(machine),[0,0,0,1,0,1,'?']);
assert.equal(flagsWord(machine)&16,0,'unknown AF display encoding is not an architectural promise');
rewind(history);assert.equal(machine.af,false);replay(history);assert.equal(machine.af,null);
console.log('flag lesson: all seven published states, canonical overflow import, both defined ADD masks, preserved source and undefined-AF rewind/replay pass');
