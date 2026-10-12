// Fixed reviewed workload, no DOM and no native execution of target bytes.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {cpus,release} from 'node:os';
import {fileURLToPath} from 'node:url';
import {performance} from 'node:perf_hooks';
import {createState,step} from '../site/simulator.mjs';
import {createHistory,recordStep,seek} from '../site/history.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
const boot=JSON.parse(readFileSync(new URL('../site/boot.json',import.meta.url),'utf8'));
const sha256=data=>createHash('sha256').update(data).digest('hex');
assert.equal(boot.bytes.length,512);assert.equal(sha256(Uint8Array.from(boot.bytes)),boot.sha256);
const reviewed=JSON.parse(readFileSync(new URL('../targets.json',import.meta.url),'utf8')).find(target=>target.source==='boot/boot.bits');
assert.equal(boot.sha256,reviewed.sha256);
const warmups=5,trials=25,expectedSteps=2825;
const modes=['execute','record','record-rewind-replay'];
const measurements=[];
for(const mode of modes) {
  const samples=[];
  for(let trial=-warmups;trial<trials;trial++) {
    // Allocation/loading are outside the timer; measured history allocation is inside.
    const state=createState(boot.bytes),history=createHistory(state);
    const start=performance.now();
    while(!state.halted) {
      if(mode==='execute')step(boot.bytes,state);
      else recordStep(history,boot.bytes);
    }
    if(mode==='record-rewind-replay'){seek(history,0);seek(history,history.frames.length);}
    const elapsed=performance.now()-start;
    assert.equal(state.steps,expectedSteps);assert.equal(state.halted,true);
    assert.equal(state.output,state.serial);assert.match(state.output,/Hello from raw machine code!/);
    if(mode!=='execute')assert.equal(history.frames.length,expectedSteps);
    if(trial>=0)samples.push(elapsed);
  }
  samples.sort((a,b)=>a-b);
  const value=index=>Number(samples[index].toFixed(3));
  measurements.push({mode,executedInstructions:expectedSteps,restoredStates:mode==='record-rewind-replay'?expectedSteps*2:0,
    medianMs:value(Math.floor(trials/2)),p95Ms:value(Math.ceil(trials*.95)-1),minMs:value(0),maxMs:value(trials-1)});
}
const sources={};
for(const path of ['tools/benchmark_model.mjs','site/simulator.mjs','site/history.mjs','site/boot.json','boot/boot.bits','targets.json'])sources[path]=sha256(readFileSync(new URL(`../${path}`,import.meta.url)));
console.log(JSON.stringify({schema:1,measuredAt:new Date().toISOString(),
  modelBaseCommit:execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),
  environment:{node:process.version,platform:process.platform,architecture:process.arch,osRelease:release(),cpu:cpus()[0]?.model??'unknown'},
  workload:{source:'boot/boot.bits',sha256:boot.sha256,bytes:512,expectedSteps,warmups,trials},
  timing:'Monotonic wall time; excludes initial state/RAM allocation and loading, includes interpretation and per-frame history allocation. No DOM, I/O or native x86 timing.',
  sources,measurements},null,2));
