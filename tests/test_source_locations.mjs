import assert from 'node:assert/strict';
import {parseBits,parseHex,SourceDiagnosticError} from '../site/binary.mjs';

const lines=['\n','\r','\r\n','\v','\f','\x1C','\x1D','\x1E','\x85','\u2028','\u2029'];
const spaces=[' ','\t','\x1F','\u00A0','\u1680','\u2003','\u202F','\u3000'];
let count=0;
for(const parse of [parseBits,parseHex])for(const line of lines)for(const space of spaces)for(const bom of ['', '\uFEFF']) {
  const byte=parse===parseBits?'00000000':'00',bad='bad🧪token';
  const source=`${bom}# bad🧪token ignored${line}${space}${byte}${space}${byte}${space}${bad} # ${bad} ignored`;
  const start=source.indexOf(bad,source.indexOf(line)+line.length);
  assert.throws(()=>parse(source),error=>{
    assert.ok(error instanceof SourceDiagnosticError);
    assert.equal(error.code,'INVALID_TOKEN');assert.equal(error.line,2);assert.equal(error.tokenIndex,3);
    assert.equal(error.start,start);assert.equal(error.end,start+bad.length);
    assert.equal(source.slice(error.start,error.end),bad);return true;
  });count++;
  const excess=`${bom}${byte}${space}${byte}${line}${space}${byte}`;
  assert.throws(()=>parse(excess,2),error=>{
    assert.equal(error.code,'BYTE_LIMIT');assert.equal(error.line,2);assert.equal(error.tokenIndex,1);
    assert.equal(error.start,excess.lastIndexOf(byte));assert.equal(error.end,excess.length);return true;
  });count++;
}
for(const parse of [parseBits,parseHex]) {
  for(const source of ['', '# comment 🧪',null,' '.repeat(65537)])assert.throws(()=>parse(source),error=>error.start===null&&error.end===null);
  const long='x'.repeat(80)+'🧪';
  assert.throws(()=>parse(long),error=>error.start===0&&error.end===long.length&&error.message.length<150,'full token span is independent of the bounded message snippet');
  const byte=parse===parseBits?'00000000':'00',source=`\uFEFF${byte} ${byte} \uFEFF${byte}`;
  assert.throws(()=>parse(source),error=>error.start===source.lastIndexOf('\uFEFF')&&source.slice(error.start,error.end)===`\uFEFF${byte}`);
}
assert.equal(count,704);
console.log(`Source-location checks passed: ${count} binary/hex token/byte-limit spans across Unicode whitespace, every host line boundary, CRLF and BOM; UTF-16 emoji offsets, repeated tokens/comments and full invalid-token ranges. Grammar/messages are unchanged.`);
