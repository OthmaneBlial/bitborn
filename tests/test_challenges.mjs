import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {evaluateChallenge,parseProgress} from '../site/challenges/challenges.mjs';
import {parseBits,formatBits,bitChanges} from '../site/binary.mjs';
import {decode} from '../site/simulator.mjs';

const catalog = JSON.parse(await readFile(new URL('../site/challenges/catalog.json',import.meta.url),'utf8'));
assert.equal(catalog.length,20);
assert.equal(new Set(catalog.map(challenge => challenge.id)).size,20);
for (const difficulty of ['beginner','intermediate','advanced','expert']) assert.equal(catalog.filter(challenge => challenge.difficulty === difficulty).length,5);
for (const challenge of catalog) {
  assert.equal(challenge.hints.length,3,`${challenge.id}: hints`);
  assert.ok(challenge.explanation.length > 80 && challenge.visual.length > 20,`${challenge.id}: educational explanation`);
  for (const prefix of ['start','solution']) {
    const bytes = parseBits(challenge[prefix+'Text']);
    assert.deepEqual([...bytes],challenge[prefix+'Bytes']);
    assert.equal(createHash('sha256').update(bytes).digest('hex'),challenge[prefix+'Sha256']);
    const canonical = await readFile(new URL(`../${challenge[prefix === 'start' ? 'source' : 'solution']}`,import.meta.url),'utf8');
    assert.equal(canonical,challenge[prefix+'Text'],'packaging must preserve canonical sources');
    assert.equal(challenge[prefix+'Annotations'].reduce((sum,item) => sum+item.size,0),bytes.length);
    for (const annotation of challenge[prefix+'Annotations']) {
      assert.ok(annotation.explanation);
      if (prefix === 'solution' && annotation.kind === 'instruction') assert.equal(decode(bytes,annotation.offset).size,annotation.size,`${challenge.id}: instruction boundary ${annotation.offset}`);
    }
  }
  const solution = evaluateChallenge(challenge,challenge.solutionText);
  assert.equal(solution.success,true,`${challenge.id}: ${solution.message}`);
  assert.equal(evaluateChallenge(challenge,challenge.startText).success,false,`${challenge.id}: starting puzzle must require work`);
  assert.ok(solution.state.halted);
  assert.ok(solution.state.steps <= challenge.maxSteps);
  assert.equal(evaluateChallenge(challenge,'10111000 00101010').success,false,'truncated input');
  assert.equal(evaluateChallenge(challenge,'11110000 '.repeat(513)).success,false,'oversized input');
  assert.equal(evaluateChallenge(challenge,'<img src=x onerror=alert(1)>').success,false,'nonbinary input');
  assert.equal(evaluateChallenge(challenge,[-1,256,NaN]).success,false,'invalid byte array');
  assert.equal(evaluateChallenge(challenge,null).success,false,'invalid program value');
  const locked = Uint8Array.from(challenge.solutionBytes); locked[0] ^= 1;
  assert.match(evaluateChallenge(challenge,formatBits(locked)).message,/locked byte/);
}
const addition = catalog.find(challenge => challenge.id === 'addition');
const alternative = Uint8Array.from(addition.solutionBytes); alternative[2] = 34; alternative[5] = 8;
assert.equal(evaluateChallenge(addition,formatBits(alternative)).success,true,'semantic goals must accept 34 + 8 as another solution');
assert.notDeepEqual([...alternative],addition.solutionBytes);
const oneBit = catalog.find(challenge => challenge.id === 'signed-overflow');
const tooMany = Uint8Array.from(oneBit.startBytes); tooMany[2] = 0;
assert.match(evaluateChallenge(oneBit,formatBits(tooMany)).message,/edit budget/);
const boot = catalog.find(challenge => challenge.id === 'repair-boot');
assert.equal(boot.solutionBytes.length,512);
assert.deepEqual(boot.solutionBytes.slice(-2),[0x55,0xAA]);
assert.equal(bitChanges(boot.startBytes,boot.solutionBytes).reduce((sum,item) => sum+item.bitCount,0),3);
assert.equal(evaluateChallenge(catalog.find(challenge => challenge.id === 'escape-loop'),'11111010 11101011 11111110 11110100').state.steps,96);
for (const raw of [null,'invalid','[]','{"version":2}','{"version":1,"completed":[],"attempts":null}']) assert.deepEqual(parseProgress(raw,catalog),{version:1,completed:[],attempts:{}});
const stored = parseProgress(JSON.stringify({version:1,completed:['return-42','return-42','<script>','missing',42],attempts:{'return-42':7,'little-endian':-1,'choose-register':1e100,'high-low':'1','print-character':0,'missing':99}}),catalog);
assert.deepEqual(stored,{version:1,completed:['return-42'],attempts:{'return-42':7,'print-character':0}});
console.log('20 challenges passed: reviewed hashes, canonical sources, decode boundaries, positive solutions, negative seeds, bounded loops, alternate solution, edit rules, malformed input and validated local progress.');
