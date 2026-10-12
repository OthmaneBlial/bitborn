import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {checkIntroductions} from './introduction_browser_checks.mjs';

const site=resolve(fileURLToPath(new URL('../site/',import.meta.url)));
const types={'.html':'text/html','.css':'text/css','.svg':'image/svg+xml'};
const server=createServer(async(request,response)=>{
  const path=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
  const file=resolve(site,path.slice(1)+(path.endsWith('/')?'index.html':''));
  if(!file.startsWith(site+'/')){response.writeHead(403).end();return;}
  try{response.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream'}).end(await readFile(file));}
  catch{response.writeHead(404).end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
try {
  browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE}:{})});
  const page=await browser.newPage({reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
  await checkIntroductions(page,process.env.SITE_BASE_URL||`http://127.0.0.1:${server.address().port}/`);
  assert.deepEqual(errors,[]);
  await page.screenshot({path:resolve(site,'../build/intro-ar-mobile.png'),fullPage:true});
  console.log('Introduction browser checks passed: eight language pages, desktop/320px, RTL prose and LTR literal code, current language, keyboard skip navigation and loaded assets.');
} finally {if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
