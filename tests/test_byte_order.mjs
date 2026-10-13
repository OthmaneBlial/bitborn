import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {parseBits} from '../site/binary.mjs';
import {createState, step} from '../site/simulator.mjs';
import {readByteOrder} from '../site/learn/byte-order.mjs';
import {byteOrderSource} from '../site/learn/byte-order-source.mjs';

const source = readFileSync(new URL('../' + byteOrderSource.source, import.meta.url), 'utf8');
const bytes = parseBits(source);
assert.deepEqual(Array.from(bytes), byteOrderSource.bytes);
assert.equal(createHash('sha256').update(Uint8Array.from(bytes)).digest('hex'), byteOrderSource.sha256);
assert.deepEqual(Array.from(bytes), [0x90, 0xB8, 0x34, 0x12, 0xEB, 0xFA]);
const disassembly = spawnSync('ndisasm', ['-b', '16', '-'], {input: Uint8Array.from(bytes), encoding: 'utf8'});
assert.ifError(disassembly.error);
assert.equal(disassembly.status, 0, disassembly.stderr);
const lines = disassembly.stdout.trim().split('\n').map(line => line.trim().split(/\s+/).slice(2).join(' ').replace(/^jmp short /, 'jmp '));
assert.deepEqual(lines, ['nop', 'mov ax,0x1234', 'jmp 0x0']);
const edited = [...bytes];
for (let value = 0; value <= 65535; value++) {
  edited[2] = value & 255; edited[3] = value >>> 8;
  const before = [...edited], actual = readByteOrder(edited);
  assert.equal(actual.word, value); assert.equal(actual.byte, value & 255);
  assert.deepEqual(edited, before, 'inspection leaves literal bytes unchanged');
}
edited.splice(0, edited.length, ...bytes);
for (let value = 0; value < 256; value++) {
  edited[5] = value;
  const actual = readByteOrder(edited), displacement = value < 128 ? value : value - 256;
  assert.equal(actual.displacement, displacement);
  assert.equal(actual.target, (0x7C06 + displacement) & 65535);
  const state = createState(edited); state.ip = 4;
  step(edited, state);
  assert.equal((state.loadAddress + state.ip) & 65535, actual.target);
  assert.equal(state.AX, 0, 'branch leaves registers unchanged');
}
const state = createState(bytes);
for (let count = 0; count < 3; count++) step(bytes, state);
assert.equal(state.AX, 0x1234); assert.equal(state.ip, 0); assert.equal(state.halted, false);
console.log('byte-order lesson: canonical source/hash, independent NDISASM, 65,536 words, 256 signed branches/model targets, unchanged bytes and a complete bounded loop pass');
