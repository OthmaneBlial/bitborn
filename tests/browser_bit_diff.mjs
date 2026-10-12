import {createServer} from 'node:http';
import {readFile,mkdir} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {checkBitDiff} from './bit_diff_browser_checks.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),site=resolve(root,'site');
const types={'.html':'text/html','.css':'text/css','.mjs':'text/javascript','.json':'application/json','.svg':'image/svg+xml'};
const server=createServer(async(request,response)=>{
  try{const path=decodeURIComponent(new URL(request.url,'http://localhost').pathname),file=resolve(site,path.slice(1)+(path.endsWith('/')?'index.html':''));if(!file.startsWith(site+'/')){response.writeHead(403).end();return;}const bytes=await readFile(file);response.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream'}).end(bytes);}catch{response.writeHead(404).end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser;
try {
  browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE}:{})});
  const page=await browser.newPage({reducedMotion:'reduce'}),errors=[];page.on('pageerror',error=>errors.push(error.message));page.on('response',response=>{if(response.status()>=400)errors.push(response.url());});
  await checkBitDiff(page,process.env.SITE_BASE_URL||`http://127.0.0.1:${server.address().port}/`);assert.deepEqual(errors,[]);
  await mkdir(resolve(root,'build/bit-diff-evidence'),{recursive:true});await page.screenshot({path:resolve(root,'build/bit-diff-evidence/mobile.png'),fullPage:true});
  await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:resolve(root,'build/bit-diff-evidence/desktop.png'),fullPage:true});
  console.log('Bit diff browser checks passed: raw flips and unchanged field roles, mode/boundary stops, keyboard rows, notation conversion, invalid-draft preservation, safe text, missing bytes, 512-byte limits and 320px layout. Read-only.');
}finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
