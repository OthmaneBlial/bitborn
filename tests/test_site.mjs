import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {binary,hex,decode,createState,step,validateBootData} from '../site/simulator.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)),'..');
const boot = validateBootData(JSON.parse(readFileSync(resolve(root,'site/boot.json'),'utf8')));
assert.equal(binary(0xB8),'10111000'); assert.equal(hex(0x7C00,4),'7C00');
assert.equal(decode([0xB8,0x2A,0]).mnemonic,'MOV AX, 42');
assert.equal(decode([0xB9,0x2A,0]).mnemonic,'MOV CX, 42');
assert.equal(decode([0xEB,0xE0]).displacement,-32);
assert.throws(() => decode([0xB8,0x2A]),/Truncated/);
assert.throws(() => decode([0xFF]),/outside this limited simulator/);
assert.throws(() => validateBootData({...boot,bytes:boot.bytes.slice(1)}),/512/);
assert.throws(() => validateBootData({...boot,bytes:boot.bytes.map((b,i) => i === 510 ? 0 : b)}),/signature/);
assert.throws(() => validateBootData({...boot,annotations:boot.annotations.slice(1)}),/without gaps/);
assert.throws(() => validateBootData({...boot,bytes:boot.bytes.map((b,i) => i === 0 ? 256 : b)}),/valid bytes/);
assert.equal(createHash('sha256').update(Uint8Array.from(boot.bytes)).digest('hex'),boot.sha256);

const cpu = createState();
// The one-instruction editor replaces its loaded bytes while retaining registers.
const execute = bytes => { cpu.memory.set(bytes, cpu.loadAddress); return step(bytes, cpu); };
execute([0xB8,0xFF,0xFF]); assert.equal(cpu.AX,65535);
cpu.ip=0; execute([0x05,1,0]); assert.equal(cpu.AX,0); assert.equal(cpu.zf,true); assert.equal(cpu.cf,true);
cpu.ip=0; execute([0x40]); assert.equal(cpu.AX,1); assert.equal(cpu.cf,true);
cpu.ip=0; execute([0x3D,1,0]); assert.equal(cpu.AX,1); assert.equal(cpu.zf,true);
cpu.ip=0; execute([0x31,0xC0]); assert.equal(cpu.AX,0); assert.equal(cpu.cf,false);
cpu.ip=0; execute([0xB4,0x0E]); assert.equal(cpu.AX,0x0E00);
cpu.ip=0; execute([0xB0,0x41]); assert.equal(cpu.AX,0x0E41);
cpu.SP=0x7C00; cpu.ip=0; execute([0x50]); assert.equal(cpu.SP,0x7BFE);
cpu.AX=0; cpu.ip=0; execute([0x58]); assert.equal(cpu.AX,0x0E41); assert.equal(cpu.SP,0x7C00);
cpu.ip=0; execute([0xCD,0x10]); assert.equal(cpu.output,'A');
cpu.ip=0; assert.throws(() => execute([0xCD,0x16]),/outside this model/);
cpu.ip=0; cpu.steps=4096; assert.throws(() => execute([0x90]),/4,096/);

for (const annotation of boot.annotations.filter(item => item.kind === 'instruction')) assert.equal(decode(boot.bytes,annotation.offset).size,annotation.size,`decoder boundary at ${annotation.offset}`);
const machine = createState(boot.bytes);
while (!machine.halted) step(boot.bytes,machine);
const message = boot.annotations.find(item => item.kind === 'data');
const expected = String.fromCharCode(...boot.bytes.slice(message.offset,boot.bytes.indexOf(0,message.offset)));
assert.equal(machine.output,expected); assert.equal(machine.serial,expected); assert.ok(machine.steps < 4096);
assert.match(expected,/Hello from raw machine code!/); assert.equal(machine.SP,0x7C00);

for (const page of ['index.html','docs.html']) {
  const source = readFileSync(resolve(root,'site',page),'utf8');
  assert.match(source,/<html lang="en">/); assert.match(source,/rel="canonical"/);
  assert.match(source,/property="og:image"/); assert.match(source,/Skip to/);
  const ids = [...source.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size,ids.length,`unique IDs in ${page}`);
  for (const [,url] of source.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|data:)/.test(url)) continue;
    const [path,fragment] = url.split('#');
    assert.ok(!path.startsWith('/'),`portable URL ${url}`);
    const file = resolve(root,'site',path || page);
    assert.ok(existsSync(file),`local link exists: ${page} → ${url}`);
    if (fragment) assert.match(readFileSync(file,'utf8'),new RegExp(`id="${fragment}"`),`fragment exists: ${url}`);
  }
}
for (const file of ['robots.txt','sitemap.xml','favicon.svg','assets/boot.png','assets/boot.gif','assets/social-preview.png']) assert.ok(existsSync(resolve(root,'site',file)),`site artifact ${file}`);
console.log(`site checks passed: decoder edge cases, simulator flags/stack/limits, ${machine.steps}-step real-image simulation, identical screen/serial message, SHA-256, portable local links and metadata`);
