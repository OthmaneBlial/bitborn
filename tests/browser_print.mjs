import {createServer} from 'node:http';
import {readFile,mkdir} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {checkPrintLessons} from './print_browser_checks.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),site=resolve(root,'site');
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.svg':'image/svg+xml'};
const server=createServer(async(request,response)=>{
  try {
    const route=decodeURIComponent(new URL(request.url,'http://localhost').pathname),file=resolve(site,route.slice(1)+(route.endsWith('/')?'index.html':''));
    if(!file.startsWith(site+'/')){response.writeHead(403).end();return;}
    response.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream'}).end(await readFile(file));
  } catch {response.writeHead(404).end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser;
try {
  browser=await chromium.launch({headless:true});const page=await browser.newPage({reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));page.on('response',response=>{if(response.status()>=400)errors.push(response.url());});
  const directory=resolve(root,'build/print-evidence');await mkdir(directory,{recursive:true});
  await checkPrintLessons(page,`http://127.0.0.1:${server.address().port}/`,directory);assert.deepEqual(errors,[]);
  console.log('Print checks passed: manual, learning path and eight introductions; white paper, hidden navigation, unchanged literal code, LTR code/RTL Arabic, source attribution and four real A4 PDF QA captures.');
} finally {await browser?.close();await new Promise(resolve=>server.close(resolve));}
