import assert from 'node:assert/strict';
import {inspectEncoding} from '../site/encoding.mjs';
import {decode} from '../site/simulator.mjs';

const bases=[['BX','SI'],['BX','DI'],['BP','SI'],['BP','DI'],['SI'],['DI'],['BP'],['BX']];
const wordNames=['AX','CX','DX','BX','SP','BP','SI','DI'],byteNames=['AL','CL','DL','BL','AH','CH','DH','BH'];
let cases=0;
for(const prefix of [[],[0x66]])for(const opcode of [0x88,0x89,0x8A,0x8B])for(let mod=0;mod<3;mod++)for(let rm=0;rm<8;rm++)for(let reg=0;reg<8;reg++) {
  const absolute=mod===0&&rm===6,count=absolute||mod===2?2:mod===1?1:0;
  const values=count===0?[0]:count===1?[0,1,127,128,255]:[0,1,32767,32768,65535];
  for(const encoded of values) {
    const tail=count===0?[]:count===1?[encoded]:[encoded%256,Math.floor(encoded/256)];
    const bytes=Uint8Array.from([...prefix,opcode,mod*64+reg*8+rm,...tail]);
    const before=bytes.slice(),result=inspectEncoding(bytes,16),address=absolute?[]:bases[rm];
    const expectedDisplacement=absolute||!count?encoded:encoded>=(count===1?128:32768)?encoded-(count===1?256:65536):encoded;
    const width=opcode%2===0?8:prefix.length?32:16;
    const register=width===8?byteNames[reg]:(width===32?'E':'')+wordNames[reg];
    const expression=absolute?String(encoded):address.join('+')+(count?(expectedDisplacement<0?String(expectedDisplacement):'+'+expectedDisplacement):'');
    const operands=opcode<0x8A?[`[${expression}]`,register]:[register,`[${expression}]`];
    assert.equal(result.mnemonic,`MOV ${operands.join(', ')}`);assert.equal(result.size,bytes.length);assert.equal(result.width,width);
    assert.deepEqual(result.memory.bases,address);assert.equal(result.memory.segment,address.includes('BP')?'SS':'DS');
    assert.equal(result.memory.displacement,expectedDisplacement);assert.equal(result.memory.absolute,absolute);assert.equal(result.memory.addressBits,16);
    assert.equal(result.fields.length,bytes.length);assert.equal(result.bitFields.length,bytes.length);assert.deepEqual(bytes,before);
    assert.ok(result.bitFields.every(bits=>bits.length===8));
    for(let end=prefix.length+2;end<bytes.length;end++)assert.throws(()=>inspectEncoding(bytes.slice(0,end),16),/Truncated MOV/);
    if(prefix.length)assert.throws(()=>decode(bytes),/outside this limited/);
    else assert.equal(decode(bytes).mnemonic,result.mnemonic,'model and inspector share the address decoder');cases++;
  }
}
assert.throws(()=>inspectEncoding([0x67,0x8B,0],16),/outside/);
assert.throws(()=>inspectEncoding([0x36,0x8B,0x46,0],16),/outside/);
for(const mode of [32,64])assert.throws(()=>inspectEncoding([0x8B,0],mode),/16-bit addressing context only/);
console.log(`Memory encoding checks passed: ${cases} context/opcode/register/address/displacement cases, DS versus BP-derived SS, absolute rm6 exception, signed extrema, 66 operand versus address size, truncation and shared model/inspection addressing.`);
