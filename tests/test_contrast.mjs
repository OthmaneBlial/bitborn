import assert from 'node:assert/strict';
import {rgba,composite,contrast} from './contrast.mjs';

assert.deepEqual(rgba('rgb(12, 34, 56)'),[12,34,56,1]);
assert.deepEqual(rgba('rgba(255, 0, 0, 0.5)'),[255,0,0,0.5]);
assert.deepEqual(composite([255,0,0,0.5],[0,0,255]),[127.5,0,127.5]);
assert.deepEqual(composite([200,50,100,0],[20,30,40]),[20,30,40]);
assert.equal(contrast([0,0,0],[255,255,255]),21);
assert.equal(contrast([123,45,67],[123,45,67]),1);
assert.ok(contrast([119,119,119],[255,255,255])<4.5,'#777 fails without rounding its ratio');
assert.ok(contrast([118,118,118],[255,255,255])>4.5,'#767676 passes');
for(const invalid of ['red','color(display-p3 1 0 0)','rgb(256, 0, 0)','rgba(0, 0, 0, 2)'])assert.throws(()=>rgba(invalid));
let seed=0xC010;
const next=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed>>>24;};
for(let i=0;i<1000;i++) {
  const first=[next(),next(),next()],second=[next(),next(),next()],ratio=contrast(first,second);
  assert.equal(ratio,contrast(second,first));assert.ok(ratio>=1&&ratio<=21);
}
console.log('Contrast math passed: published black/white bounds, near-threshold gray examples, alpha compositing, invalid computed-color rejection and 1,000 seeded symmetric ratios.');
