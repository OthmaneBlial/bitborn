import assert from 'node:assert/strict';
import {parseBits,formatBits,parseHex,formatHex} from '../site/binary.mjs';

const values=Uint8Array.from({length:256},(_,value)=>value);
assert.deepEqual(parseHex(formatHex(values)),values);
assert.deepEqual(parseBits(formatBits(parseHex(formatHex(values)))),values);
assert.match(formatHex(values),/^00 01 02/);assert.ok(formatHex(values).includes('FD FE FF\n'));
assert.deepEqual([...parseHex('\ufeffb8\u00852a # 中文 | شرح\r00\u00a0FF')],[0xB8,42,0,255]);
for(const [source,line] of [['FF\nGG',2],['# comment\r\nF',2],['FF\x1E0xAA',2],['FF\u2028\ufeffAA',2]]) {
  assert.throws(()=>parseHex(source),new RegExp(`Line ${line}: expected a two-digit hexadecimal token`));
}
for(const source of ['F','FFF','0xFF','11111111','-1','ＦＦ','\ufeff\ufeffFF','FF\u200bAA','FF;AA'])assert.throws(()=>parseHex(source));
for(const source of ['', '# only a comment'])assert.throws(()=>parseHex(source),/contains no bytes/);
for(const input of [null,{},'F'.repeat(65537)])assert.throws(()=>parseHex(input),/under 64 KiB/);
assert.equal(parseHex('00 '.repeat(512)).length,512);
assert.throws(()=>parseHex('00 '.repeat(513)),/512-byte limit/);
assert.equal(parseHex('FF '.repeat(4096),4096).length,4096);
for(const limit of [0,-1,4097,1.5,NaN,'512'])assert.throws(()=>parseHex('FF',limit),/Invalid byte limit/);
for(const input of [[256],[-1],[NaN],'FF',Array(4097).fill(0)])assert.throws(()=>formatHex(input),/byte values/);
let seed=0xB17B0A;
for(let trial=0;trial<1000;trial++) {
  const bytes=Uint8Array.from({length:1+trial%256},()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed>>>24;});
  assert.deepEqual(parseHex(formatHex(bytes)),bytes);
  assert.deepEqual(parseBits(formatBits(parseHex(formatHex(bytes)))),bytes);
}
console.log('Hex checks passed: all byte values, 1,000 seeded binary/hex round trips, shared Unicode/BOM/comment boundaries, exact diagnostics, strict two-digit tokens and text/byte limits; no instruction generation.');
