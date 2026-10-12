import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdir} from 'node:fs/promises';
import {resolve,dirname,extname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {parseBits} from '../site/binary.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)),'..');
const modulePath = process.env.PLAYWRIGHT_MODULE;
const {chromium} = await import(modulePath ? pathToFileURL(resolve(modulePath)).href : 'playwright');
const types = {'.html':'text/html','.mjs':'text/javascript','.js':'text/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml','.png':'image/png'};
const server = createServer(async (request,response) => {
  const route = decodeURIComponent(new URL(request.url,'http://localhost').pathname);
  if (!route.startsWith('/bitborn/')) {response.writeHead(404).end();return;}
  const suffix = route.slice('/bitborn/'.length);
  const path = resolve(root,'site',suffix + (route.endsWith('/') ? 'index.html' : ''));
  if (!path.startsWith(resolve(root,'site') + '/')) {response.writeHead(403).end();return;}
  try {const data = await readFile(path);response.writeHead(200,{'Content-Type':types[extname(path)] || 'application/octet-stream'});response.end(data);}
  catch {response.writeHead(404).end();}
});
await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
const base = process.env.SITE_BASE_URL || `http://127.0.0.1:${server.address().port}/bitborn/`;
let browser;
try {
  browser = await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? {executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE} : {})});
  const context = await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce',acceptDownloads:true});
  const page = await context.newPage(), errors = [];
  page.on('pageerror',error => errors.push(error.message));
  page.on('response',response => {if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);});
  await page.goto(new URL('boot-builder/',base).href);
  await page.waitForFunction(() => document.querySelectorAll('.builder-byte').length === 512);
  assert.match(await page.locator('#builder-load-status').textContent(),/SHA-256 verified/);
  assert.equal(await page.locator('.cell-bits').count(),512);
  assert.equal(await page.locator('#builder-bits button').count(),8);
  assert.equal(await page.locator('.builder-byte[tabindex="0"]').count(),1);
  await page.locator('[data-offset="15"]').click();
  assert.match(await page.locator('#live-explanation').textContent(),/least significant byte first|little-endian/);
  await page.locator('[data-offset="59"]').click();
  assert.match(await page.locator('#live-explanation').textContent(),/0x7C3C.*27 = 0x7C57/);
  await page.locator('#jump-offset').fill('176');await page.locator('#jump-form button').click();
  assert.equal(await page.locator('#builder-hex').textContent(),'0x48');
  await page.locator('[data-bit="2"]').click();
  assert.equal(await page.locator('#builder-hex').textContent(),'0x68');
  assert.match(await page.locator('#live-mnemonic').textContent(),/ASCII “h”/);
  assert.match(await page.locator('#change-count').textContent(),/1 byte · 1 bit changed/);
  assert.equal(await page.locator('[data-offset="176"] .changed-bit').count(),1);
  assert.equal(await page.locator('[data-bit="2"]').getAttribute('aria-pressed'),'true');
  assert.equal(await page.locator('[data-bit="2"]').getAttribute('class'),'builder-bit changed');
  await page.locator('#simulation-run').click();
  await page.waitForFunction(() => document.querySelector('#simulation-status').textContent.includes('HLT reached'));
  assert.match(await page.locator('#simulation-output').textContent(),/hello from raw machine code!/);
  assert.equal(await page.locator('#simulation-output').textContent(),await page.locator('#simulation-serial').textContent());
  await mkdir(resolve(root,'build'),{recursive:true});
  const imageDownload = page.waitForEvent('download');await page.locator('#export-image').click();
  await (await imageDownload).saveAs(resolve(root,'build/builder-edited.img'));
  const sourceDownload = page.waitForEvent('download');await page.locator('#export-bits').click();
  await (await sourceDownload).saveAs(resolve(root,'build/builder-edited.bits'));
  const image = new Uint8Array(await readFile(resolve(root,'build/builder-edited.img')));
  assert.equal(image.length,512);assert.equal(image[176],104);assert.equal(image[510],0x55);assert.equal(image[511],0xAA);
  assert.deepEqual(parseBits(await readFile(resolve(root,'build/builder-edited.bits'),'utf8')),image);
  await page.screenshot({path:resolve(root,'build/builder-desktop.png'),fullPage:true});
  await page.locator('#reset-image').click();
  await page.locator('[data-offset="0"]').click();await page.locator('[data-bit="2"]').click();
  assert.match(await page.locator('#live-mnemonic').textContent(),/Outside this simulator/);
  assert.equal(await page.locator('#export-image').isEnabled(),true,'unsupported model encoding does not invalidate BIOS framing');
  await page.locator('#simulation-step').click();
  assert.match(await page.locator('#simulation-status').textContent(),/Stopped at byte 0.*outside this limited simulator/);
  assert.equal(await page.locator('#simulation-run').isDisabled(),true);
  await page.locator('#reset-image').click();
  await page.locator('[data-offset="510"]').click();await page.locator('[data-bit="7"]').click();
  assert.match(await page.locator('#signature-status').textContent(),/54 AA.*invalid/);
  assert.equal(await page.locator('#export-image').isDisabled(),true);
  assert.equal(await page.locator('#export-bits').isEnabled(),true);
  await page.locator('[data-offset="510"]').press('End');
  assert.equal(await page.locator('#builder-offset').textContent(),'0x1FF');
  await page.locator('[data-offset="511"]').press('Control+Home');
  assert.equal(await page.locator('#builder-offset').textContent(),'0x000');
  await page.locator('#reset-image').click();
  assert.match(await page.locator('#change-count').textContent(),/0 bytes · 0 bits changed/);
  assert.equal(await page.locator('#export-image').isEnabled(),true);
  for (const width of [1440,768,390,320]) {
    await page.setViewportSize({width,height:844});
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),true,`${width}px builder overflow`);
    assert.equal(await page.locator('.builder-byte').count(),512);
    assert.equal(await page.locator('.builder-byte[tabindex="0"]').count(),1);
  }
  await page.setViewportSize({width:390,height:844});
  await page.locator('[data-select="176"]').click();
  assert.equal(await page.locator('#builder-offset').textContent(),'0x0B0');
  await page.screenshot({path:resolve(root,'build/builder-mobile.png'),fullPage:true});
  assert.deepEqual(errors,[],'builder console / failed assets');
  console.log('builder browser checks passed: 512-byte grid, keyboard navigation, one-bit H→h simulation, downloaded 512-byte image/source identity, unsupported encoding, bad-signature export gating, reset, 1440/768/390/320px layouts; artifacts in build/');
} finally {await browser?.close();await new Promise(resolve => server.close(resolve));}
