import assert from 'node:assert/strict';
import {createState, step, decode, logicalIP, physicalAddress, flagsWord} from '../site/simulator.mjs';
import {parseBits, formatBits, validateImage, bitChanges} from '../site/binary.mjs';

function run(bytes, loadAddress = 0x7C00) {
  const state = createState(bytes, loadAddress);
  while (!state.halted) step(bytes, state);
  return state;
}
const overflow = run([0xB8,0xFF,0x7F,0x05,1,0,0xF4]);
assert.equal(overflow.AX,0x8000);
assert.deepEqual([overflow.cf,overflow.of,overflow.sf,overflow.zf,overflow.pf,overflow.af],[false,true,true,false,true,true]);
const wrap = run([0xB8,0xFF,0xFF,0x05,1,0,0xF4]);
assert.deepEqual([wrap.AX,wrap.cf,wrap.of,wrap.zf,wrap.af],[0,true,false,true,true]);
const borrow = run([0xB8,0,0x80,0x2D,1,0,0xF4]);
assert.deepEqual([borrow.AX,borrow.cf,borrow.of,borrow.sf],[0x7FFF,false,true,false]);
const cmp = run([0xB8,0,0,0x3D,1,0,0xF4]);
assert.deepEqual([cmp.AX,cmp.cf,cmp.sf,cmp.pf,cmp.af],[0,true,true,true,true]);
const inc = run([0xF9,0xB8,0xFF,0x7F,0x40,0x48,0xF4]);
assert.deepEqual([inc.AX,inc.cf,inc.of],[0x7FFF,true,true]);
const logic = run([0xB8,0x80,0,0x84,0xC0,0xF4]);
assert.deepEqual([logic.sf,logic.pf,logic.zf,logic.cf,logic.of,logic.af],[true,false,false,false,false,null]);
assert.equal(flagsWord(logic),0x82);
assert.equal(physicalAddress(0xFFFF,0x10),0);

// Modern real-mode PUSH SP saves the value before decrementing, unlike an 8086.
const stack = run([0xBC,0,0x7C,0x54,0x5B,0xF4]);
assert.equal(stack.BX,0x7C00); assert.equal(stack.SP,0x7C00);
assert.deepEqual(Array.from(stack.memory.slice(0x7BFE,0x7C00)),[0,0x7C]);
const popSP = run([0xBC,0,0x7C,0x68,0x34,0x12,0x5C,0xF4]);
assert.equal(popSP.SP,0x1234);
const call = run([0xBC,0,0x7C,0xE8,1,0,0xF4,0xB8,0x2A,0,0xC3],0x7E00);
assert.equal(call.AX,42); assert.equal(call.SP,0x7C00);
assert.deepEqual(Array.from(call.memory.slice(0x7BFE,0x7C00)),[6,0x7E]);
assert.equal(logicalIP(call),0x7E07);
const alias = run([0xEA,5,0,0xC0,7,0xF4]);
assert.equal(alias.CS,0x7C0); assert.equal(logicalIP(alias),6);
const segment = run([0xB8,0,0x10,0x8E,0xD8,0xB8,0x34,0x12,0xA3,0x20,0,0xB8,0,0,0xA1,0x20,0,0xF4]);
assert.equal(segment.AX,0x1234); assert.deepEqual(Array.from(segment.memory.slice(0x10020,0x10022)),[0x34,0x12]);
const string = run([0xBF,0,0x82,0xB8,0x34,0x12,0xFD,0xAB,0xBE,0,0x82,0xAD,0xF4]);
assert.equal(string.DI,0x81FE); assert.equal(string.SI,0x81FE); assert.equal(string.AX,0x1234);
const modified = run([0xB0,0xF4,0xA2,5,0x7C,0x90]);
assert.equal(modified.memory[0x7C05],0xF4); assert.equal(modified.halted,true); assert.equal(modified.steps,3);
const branch = run([0xF9,0x72,3,0xB8,1,0,0xB8,42,0,0xF4]);
assert.equal(branch.AX,42);
assert.throws(()=>createState([256]),/valid bytes/);
assert.throws(()=>createState(new Uint8Array(4097)),/4,096/);
assert.throws(()=>createState([0],0x100000),/fit/);
assert.throws(()=>decode([0xA1,0]),/Truncated/);
assert.throws(()=>run([0xEB,0xFE]),/4,096/);
assert.throws(()=>run([0xBC,1,0,0x50]),/segment limit/);
assert.throws(()=>run([0xA1,0xFF,0xFF]),/segment limit/);

assert.deepEqual(Array.from(parseBits('10111000 00101010 # prose | ignored\n00000000')),[0xB8,42,0]);
assert.deepEqual(Array.from(parseBits(formatBits([0,0x80,255]))),[0,0x80,255]);
for (const text of ['','101','100000000','0xB8','11111111\n<svg onload=alert(1)>']) assert.throws(()=>parseBits(text));
assert.throws(()=>parseBits('00000000 00000000',1),/limit/);
assert.throws(()=>parseBits('x'.repeat(65537)),/64 KiB/);
assert.throws(()=>formatBits([256]),/byte values/);
const image = new Uint8Array(512); image[510]=0x55; image[511]=0xAA;
assert.equal(validateImage(image).valid,true);
assert.equal(validateImage(image.slice(1)).valid,false);
image[511]=0; assert.equal(validateImage(image).signature,false);
assert.deepEqual(bitChanges([72],[104]),[{offset:0,before:72,after:104,xor:32,bits:[2],bitCount:1}]);
assert.equal(bitChanges([], [0])[0].bitCount,8);
console.log('CPU and binary checks passed: arithmetic flags, stack/calls, segments, strings, live memory fetch, bounded execution, strict literal parser and exact bit changes.');
