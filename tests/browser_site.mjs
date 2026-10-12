// Optional real-browser check: install Playwright outside the runtime site, then run this file.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdir} from 'node:fs/promises';
import {resolve,dirname,extname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {checkEncoding} from './encoding_browser_checks.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)),'..');
const modulePath = process.env.PLAYWRIGHT_MODULE;
const {chromium} = await import(modulePath ? pathToFileURL(resolve(modulePath)).href : 'playwright');
const types = {'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.gif':'image/gif','.txt':'text/plain','.xml':'application/xml'};
const server = createServer(async (request,response) => {
  const route = decodeURIComponent(new URL(request.url,'http://localhost').pathname);
  if (!route.startsWith('/bitborn/')) {response.writeHead(404).end();return;}
  const path = resolve(root,'site',route.slice('/bitborn/'.length) || 'index.html');
  if (!path.startsWith(resolve(root,'site') + '/')) {response.writeHead(403).end();return;}
  try {const data=await readFile(path);response.writeHead(200,{'Content-Type':types[extname(path)] || 'application/octet-stream'});response.end(data);}
  catch {response.writeHead(404).end();}
});
await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
const base = process.env.SITE_BASE_URL || `http://127.0.0.1:${server.address().port}/bitborn/`;
let browser;
try {
  browser = await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? {executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE} : {})});
  const context = await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce',permissions:['clipboard-read','clipboard-write']});
  const page = await context.newPage(), errors = [];
  page.on('pageerror',error => errors.push(error.message));
  page.on('response',response => {if(response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);});
  await page.goto(base);
  await page.waitForFunction(() => document.querySelectorAll('.byte-cell').length === 512);
  assert.match(await page.locator('#boot-load-status').textContent(),/SHA-256 verified/);
  assert.equal(await page.locator('.example').count(),10);
  assert.equal(await page.locator('#terminal-output').textContent(),(await readFile(resolve(root,'site/index.html'),'utf8')).match(/id="terminal-output"[^>]*>([\s\S]*?)<\/pre>/)[1]);
  await page.locator('[data-bit="0-0"]').click();
  assert.equal(await page.locator('#decoded-instruction').textContent(),'MOV CX, 42');
  await page.locator('#execute-instruction').click();
  assert.match(await page.locator('#play-registers').textContent(),/CX002A/);
  await page.locator('#reset-bits').click(); await page.locator('#execute-instruction').click();
  assert.match(await page.locator('#play-registers').textContent(),/AX002A/);
  await page.locator('#instruction-select').selectOption('add'); await page.locator('#execute-instruction').click();
  assert.match(await page.locator('#play-registers').textContent(),/AX0031/);
  await page.locator('#instruction-select').selectOption('mov'); await page.locator('[data-bit="0-7"]').click();
  assert.equal(await page.locator('#execute-instruction').isDisabled(),true);
  assert.match(await page.locator('#encoding-explanation').textContent(),/outside this limited simulator/);
  await page.locator('#reset-bits').click(); await page.locator('#reset-state').click();
  assert.match(await page.locator('#play-registers').textContent(),/AX0000/);
  await checkEncoding(page);
  await page.locator('[data-offset="510"]').click(); assert.equal(await page.locator('#selected-hex').textContent(),'0x55');
  assert.equal(await page.locator('#selected-kind').textContent(),'SIGNATURE');
  await page.locator('[data-offset="510"]').press('End'); assert.equal(await page.locator('#selected-hex').textContent(),'0xAA');
  await page.locator('#boot-reset').click(); await page.locator('#boot-step').click();
  assert.match(await page.locator('#boot-registers').textContent(),/IP7C01/);
  await page.locator('#boot-step').click(); assert.match(await page.locator('#boot-registers').textContent(),/IP7C06/);
  for(let count=0; count<128 && !(await page.locator('#boot-run').isDisabled()); count++) await page.locator('#boot-run').click();
  assert.equal(await page.locator('#boot-run').isDisabled(),true);
  assert.match(await page.locator('#boot-step-status').textContent(),/HLT reached/);
  const data=JSON.parse(await readFile(resolve(root,'site/boot.json'),'utf8')), message=data.annotations.find(annotation=>annotation.kind==='data');
  assert.equal(await page.locator('#boot-output').textContent(),String.fromCharCode(...data.bytes.slice(message.offset,data.bytes.indexOf(0,message.offset))));
  await page.locator('#boot-reset').click(); assert.equal(await page.locator('#boot-step').isEnabled(),true);
  await page.locator('#demo-motion').click(); await page.locator('#demo-image').evaluate(image=>image.decode());
  assert.match(await page.locator('#demo-image').getAttribute('src'),/boot.gif/);
  await page.locator('#demo-motion').click();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth),true,'desktop overflow');
  await mkdir(resolve(root,'build'),{recursive:true});
  await page.screenshot({path:resolve(root,'build/site-desktop.png'),fullPage:true});
  await page.goto(new URL('docs.html',base).href);
  await page.locator('[data-copy="quickstart-command"]').click();
  assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),await page.locator('#quickstart-command').textContent());
  for (const width of [390,320]) {
    await page.setViewportSize({width,height:844});
    for(const path of ['','docs.html']) {
      await page.goto(new URL(path,base).href);
      if(!path) await page.waitForFunction(()=>document.querySelectorAll('.byte-cell').length === 512);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth),true,`${width}px overflow in ${path || 'index'}`);
    }
  }
  await page.setViewportSize({width:390,height:844});await page.goto(base);
  await page.waitForFunction(()=>document.querySelectorAll('.byte-cell').length === 512);
  await page.screenshot({path:resolve(root,'build/site-mobile.png'),fullPage:true});
  assert.deepEqual(errors,[],'browser console / failed assets');
  console.log('browser checks passed: bit editing, opcode change, simulation, unsupported bytes, 512-byte inspection, signature keyboard navigation, full boot stepping, recording, clipboard, subpath assets, 1440/390/320px layouts; screenshots in build/');
} finally {await browser?.close();await new Promise(resolve=>server.close(resolve));}
