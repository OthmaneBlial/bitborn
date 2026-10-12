import assert from 'node:assert/strict';
import {createState, step} from '../site/simulator.mjs';

// Independent bit-by-bit adder; subtraction adds the complement and a carry-in.
function oracle(left, right, subtract) {
  let carry = Number(subtract), result = 0, halfCarry = 0, signCarry = 0;
  for (let bit = 0; bit < 16; bit++) {
    if (bit === 15) signCarry = carry;
    const sum = ((left >>> bit) & 1) + (((right >>> bit) & 1) ^ Number(subtract)) + carry;
    result |= (sum % 2) << bit;
    carry = Math.floor(sum / 2);
    if (bit === 3) halfCarry = carry;
  }
  return {result, cf: Boolean(carry ^ Number(subtract)), af: Boolean(halfCarry ^ Number(subtract)),
    of: signCarry !== carry, ...resultFlags(result, 16)};
}
function resultFlags(result, width) {
  const ones = (result & 255).toString(2).split('1').length - 1;
  return {zf: result === 0, sf: result >= 2 ** (width - 1), pf: ones % 2 === 0};
}
const bytes = [0, 0, 0], state = createState(bytes);
let count = 0;
function execute(instruction, left, register = 'AX', carry = false) {
  bytes.fill(0); bytes.splice(0, instruction.length, ...instruction);
  state.memory.set(bytes, state.loadAddress);
  Object.assign(state, {ip: 0, steps: 0, halted: false, cf: carry, af: null,
    zf: true, sf: true, of: true, pf: false, df: true, interrupts: true, [register]: left});
  step(bytes, state); count++;
  assert.equal(state.df, true); assert.equal(state.interrupts, true);
}
function check(expected, register = 'AX', preserve = {}) {
  assert.equal(state[register], expected.result);
  for (const flag of ['cf', 'af', 'of', 'zf', 'sf', 'pf']) {
    assert.equal(state[flag], flag in preserve ? preserve[flag] : expected[flag], `${count}: ${flag}`);
  }
}
const edges = [0, 1, 7, 8, 15, 16, 127, 128, 255, 256, 32767, 32768, 32769, 65534, 65535];
let seed = 0xB17B0A;
function randomWord() { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed >>> 16; }
const pairs = edges.flatMap(left => edges.map(right => [left, right]));
for (let index = 0; index < 5000; index++) pairs.push([randomWord(), randomWord()]);
for (const [left, right] of pairs) {
  for (const opcode of [0x05, 0x2D, 0x3D]) {
    const expected = oracle(left, right, opcode !== 0x05);
    execute([opcode, right & 255, right >>> 8], left);
    check({...expected, result: opcode === 0x3D ? left : expected.result});
  }
}
const registers = ['AX', 'CX', 'DX', 'BX', 'SP', 'BP', 'SI', 'DI'];
for (const [index, register] of registers.entries()) {
  for (const left of edges) for (const carry of [false, true]) for (const subtract of [false, true]) {
    execute([(subtract ? 0x48 : 0x40) + index], left, register, carry);
    check(oracle(left, 1, subtract), register, {cf: carry});
  }
}
for (let left = 0; left < 256; left++) for (let right = 0; right < 256; right++) {
  execute([0xA8, right], 0xA500 | left);
  const expected = resultFlags(left & right, 8);
  assert.equal(state.AX, 0xA500 | left, 'TEST preserves the entire register');
  for (const flag of ['zf', 'sf', 'pf']) assert.equal(state[flag], expected[flag]);
  assert.equal(state.cf, false); assert.equal(state.of, false); assert.equal(state.af, null);
}
console.log(`Flag properties passed: ${count.toLocaleString('en-US')} modeled instructions; ripple-carry ADD/SUB/CMP, all INC/DEC registers and CF preservation, exhaustive 8-bit TEST masks, undefined AF and preserved IF/DF. Seed 0xB17B0A; no native execution.`);
