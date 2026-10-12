import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {inspectELF,ELF_LIMIT} from '../site/elf.mjs';

const root=new URL('../',import.meta.url),catalog=JSON.parse(readFileSync(new URL('site/elf/catalog.json',root),'utf8'));
assert.equal(catalog.length,6);
for(const item of catalog) {
  const file=readFileSync(new URL('site/downloads/'+item.file,root));
  const model=inspectELF(file),payload=readFileSync(new URL('build/'+item.file.replace(/\.elf$/,'.bin'),root));
  assert.equal(createHash('sha256').update(file).digest('hex'),item.sha256);
  assert.equal(model.entry,0x400078n);assert.equal(model.entryOffset,120);assert.equal(model.entryState,'file-backed executable');
  assert.equal(model.phnum,1);assert.equal(model.shnum,0);assert.equal(model.segments[0].flags,5);assert.equal(model.segments[0].align,4096n);
  assert.deepEqual(file.subarray(120),payload);assert.deepEqual(model.warnings,[]);
}
const original=new Uint8Array(readFileSync(new URL('build/exit-code-small.elf',root)));
const changed=modify=>{const file=original.slice(),view=new DataView(file.buffer);modify(view,file);return file;};
for(const size of [0,1,4,63])assert.throws(()=>inspectELF(original.slice(0,size)),/64 bytes/);
assert.throws(()=>inspectELF(new Uint8Array(ELF_LIMIT+1)),/1 MiB/);
assert.throws(()=>inspectELF([1,2,3]),/file data/);
for(const [offset,value]of [[0,0],[4,1],[5,2],[6,0]])assert.throws(()=>inspectELF(changed((_,file)=>file[offset]=value)));
for(const [offset,value]of [[16,1],[18,3],[52,63],[54,55],[56,129],[62,65535]])assert.throws(()=>inspectELF(changed(view=>view.setUint16(offset,value,true))));
assert.throws(()=>inspectELF(changed(view=>view.setBigUint64(32,0xFFFFFFFFFFFFFFFFn,true))),/beyond file/);
assert.throws(()=>inspectELF(changed(view=>view.setBigUint64(32,1n,true))),/overlaps/);
assert.throws(()=>inspectELF(changed(view=>view.setBigUint64(72,200n,true))),/beyond file/);
assert.throws(()=>inspectELF(changed(view=>view.setBigUint64(104,1n,true))),/exceeds/);
assert.throws(()=>inspectELF(changed(view=>view.setBigUint64(112,3n,true))),/alignment/);
assert.throws(()=>inspectELF(changed(view=>view.setBigUint64(80,0x400001n,true))),/congruent/);
assert.throws(()=>inspectELF(changed(view=>view.setBigUint64(80,0xFFFFFFFFFFFFFFF0n,true))),/overflows/);
assert.throws(()=>inspectELF(changed(view=>view.setBigUint64(40,64n,true))),/Extended/);
assert.throws(()=>inspectELF(changed(view=>{view.setBigUint64(40,64n,true);view.setUint16(58,64,true);view.setUint16(60,2,true);})),/beyond file/);
const high=inspectELF(changed(view=>{view.setBigUint64(80,0xFFFFFFFFFFFF0000n,true);view.setBigUint64(24,0xFFFFFFFFFFFF0078n,true);}));
assert.equal(high.entry,0xFFFFFFFFFFFF0078n);assert.equal(high.entryOffset,120,'high virtual addresses never round through Number');
const zero=inspectELF(changed(view=>{view.setBigUint64(104,160n,true);view.setBigUint64(24,0x400081n,true);}));
assert.equal(zero.entryOffset,null);assert.match(zero.entryState,/zero-filled/);
const noExec=inspectELF(changed(view=>view.setUint32(68,4,true)));assert.equal(noExec.entryOffset,120);assert.match(noExec.entryState,/non-executable/);
const dyn=inspectELF(changed(view=>view.setUint16(16,3,true)));assert.ok(dyn.warnings.some(message=>message.includes('load bias')));
const writable=inspectELF(changed(view=>view.setUint32(68,7,true)));assert.ok(writable.warnings.some(message=>message.includes('write and execute')));
const unmapped=inspectELF(changed(view=>view.setBigUint64(24,0x1000n,true)));assert.equal(unmapped.entryOffset,null);
const absent=inspectELF(changed(view=>view.setBigUint64(24,0n,true)));assert.equal(absent.entryState,'no entry declared');assert.equal(absent.entryOffset,null);
const multi=new Uint8Array(256);multi.set(original);
const multiple=new DataView(multi.buffer);multiple.setUint16(56,2,true);multiple.setBigUint64(96,256n,true);multiple.setBigUint64(104,256n,true);
multi.set(multi.slice(64,120),120);
assert.match(inspectELF(multi).entryState,/ambiguous/);
multiple.setBigUint64(136,0x800000n,true);assert.equal(inspectELF(multi).entryOffset,120);
multiple.setBigUint64(136,0x3FF000n,true);assert.throws(()=>inspectELF(multi),/ordered/);
const nullSegment=inspectELF(changed(view=>{view.setUint32(64,0,true);view.setBigUint64(72,0xFFFFFFFFFFFFFFFFn,true);}));
assert.equal(nullSegment.segments[0].type,0,'PT_NULL members are not checked as load mappings');
const offsetBuffer=new Uint8Array(original.length+10);offsetBuffer.set(original,5);assert.equal(inspectELF(offsetBuffer.subarray(5,-5)).entryOffset,120);
let seed=0xE1F64,accepted=0;
for(let trial=0;trial<2000;trial++) {
  const file=original.slice();
  for(let change=0;change<1+trial%4;change++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;file[seed%120]^=(seed>>>24)||1;}
  const before=file.slice();
  let result;
  try {result=inspectELF(file);}catch(error){assert.equal(error instanceof RangeError,false,'bounds errors are diagnosed before DataView reads');}
  if(result) {
    accepted++;
    if(result.entryOffset!==null)assert.ok(Number.isInteger(result.entryOffset)&&result.entryOffset>=0&&result.entryOffset<file.length);
    for(const field of result.fields)assert.ok(field.offset>=0&&field.offset+field.size<=file.length);
    for(const segment of result.segments.filter(segment=>segment.type===1))assert.ok(segment.offset+segment.fileSize<=BigInt(file.length));
  }
  assert.deepEqual(file,before,'inspection never mutates imported bytes');
}
console.log(`ELF checks passed: six real artifacts, payload identity, exact high addresses, zero fill/permissions/load bias, format/range/limit rejection and 2,000 seeded mutations (${accepted} accepted within scope); no target execution.`);
