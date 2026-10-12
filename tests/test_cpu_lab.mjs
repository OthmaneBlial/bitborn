import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {presets} from '../site/cpu-lab/presets.mjs';
import {parseBits} from '../site/binary.mjs';
import {createState,step,decode,physicalAddress,logicalIP,flagsWord} from '../site/simulator.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
assert.equal(presets.length,5);
const results=new Map();
for (const preset of presets) {
  assert.match(preset.source,/^[01\s]+$/,'preset target instructions are literal binary digits');
  const bytes=parseBits(preset.source), state=createState(bytes); state.SP=0x7C00;
  for (let offset=0; offset<bytes.length;) offset+=decode(bytes,offset).size;
  while (!state.halted) step(bytes,state);
  assert.ok(state.steps<40,`${preset.id} finishes within its small teaching program`);
  assert.equal(state.memory.length,1<<20);
  results.set(preset.id,state);
}
assert.equal(results.get('immediates').AX,42); assert.equal(results.get('immediates').BX,97); assert.equal(results.get('immediates').CX,0x1234);
assert.equal(results.get('flags').AX,0xFFFF); assert.equal(results.get('flags').zf,true); assert.equal(results.get('flags').cf,false); assert.equal(results.get('flags').sf,false);
assert.equal(results.get('stack').AX,1); assert.equal(results.get('stack').BX,0x1234); assert.equal(results.get('stack').SP,0x7C00); assert.equal(results.get('stack').steps,8);
assert.equal(results.get('branch').AX,3); assert.equal(results.get('branch').CX,0); assert.equal(results.get('branch').steps,11);
const memory=results.get('memory');
assert.equal(memory.DS,0x10); assert.equal(memory.ES,0x10); assert.equal(memory.AX,0xABAB); assert.equal(memory.DI,0x24); assert.equal(memory.SI,0x20); assert.equal(memory.df,false);
assert.deepEqual([...memory.memory.slice(0x120,0x124)],[0xCD,0xAB,0xCD,0xAB]);
assert.equal(physicalAddress(0xFFFF,0xFFFF),0x0FFEF); assert.ok(flagsWord(memory)&2); assert.equal(logicalIP(createState()),0x7C00);
const bounded=createState(parseBits('11101011 11111110'));
bounded.steps=4096; assert.throws(()=>step(parseBits('11101011 11111110'),bounded),/4,096-step/); assert.equal(bounded.steps,4096);
const html=readFileSync(resolve(root,'site/cpu-lab/index.html'),'utf8');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]); assert.equal(new Set(ids).size,ids.length,'unique lab IDs');
for (const id of ['step','back','forward','history-position','timeline','timeline-value','timeline-steps','run','pause','reset','speed','registers','flags','stack','memory','program-listing','binary-editor','import-program','export-source','export-raw','download-status']) assert.ok(ids.includes(id),`${id} control exists`);
for (const [,url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
  if (/^(https?:|data:|#)/.test(url)) continue;
  const target=resolve(root,'site/cpu-lab',url);
  assert.ok(existsSync(target),`lab link exists: ${url}`);
}
assert.match(html,/not a complete emulator or native CPU/); assert.match(html,/A20 is masked/); assert.match(html,/not a BIOS register snapshot/);
console.log('CPU lab checks passed: five literal-binary programs, exact register/flag/stack/memory results, 4,096-step boundary, unique controls, links and model disclosure.');
