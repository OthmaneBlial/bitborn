// Test-only JSON adapter: parse literal data; never execute it.
import {parseBits} from '../site/binary.mjs';
let input='';
process.stdin.setEncoding('utf8');
for await (const chunk of process.stdin)input+=chunk;
const cases=JSON.parse(input);
const results=cases.map(source=>{
  try {return {bytes:[...parseBits(source)]};}
  catch(error){return {error:true,code:error.code,line:error.line,tokenIndex:error.tokenIndex};}
});
process.stdout.write(JSON.stringify(results));
