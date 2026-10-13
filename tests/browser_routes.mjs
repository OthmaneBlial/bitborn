import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdir} from 'node:fs/promises';
import {resolve,dirname,extname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {checkEncoding} from './encoding_browser_checks.mjs';
import {checkVGABitmap} from './vga_bitmap_browser_checks.mjs';
import {checkByteOrder} from './byte_order_browser_checks.mjs';
import {checkTimerIRQ} from './timer_irq_browser_checks.mjs';
import {checkPaging} from './paging_browser_checks.mjs';

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
const routes = ['playground','examples','learn','architecture','roadmap'];
let browser;
try {
  browser = await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? {executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE} : {})});
  const context = await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  const page = await context.newPage(), errors = [];
  page.on('pageerror',error => errors.push(error.message));
  page.on('response',response => {if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);});
  await page.goto(new URL('playground/',base).href);
  await page.waitForFunction(() => document.querySelectorAll('#bit-editor button').length === 24);
  await page.locator('[data-bit="0-0"]').press('Space');
  assert.equal(await page.locator('#decoded-instruction').textContent(),'MOV CX, 42');
  await page.locator('#execute-instruction').click();assert.match(await page.locator('#play-registers').textContent(),/CX002A/);
  await page.locator('#reset-bits').click();await page.locator('#reset-state').click();
  await page.locator('[data-bit="1-0"]').click();await page.locator('#execute-instruction').click();
  assert.match(await page.locator('#play-registers').textContent(),/AX002B/);
  await page.locator('#reset-bits').click();await page.locator('#reset-state').click();await page.locator('#execute-instruction').click();
  await page.locator('#instruction-select').selectOption('cmp');await page.locator('#execute-instruction').click();
  assert.match(await page.locator('#play-registers').textContent(),/ZF1/);
  await checkEncoding(page);
  await page.goto(new URL('examples/',base).href);
  assert.equal(await page.locator('[data-example]').count(),19);
  assert.equal(await page.locator('[data-example] a[download]').count(),19);
  assert.match(await page.locator('[data-example="shell-app"]').textContent(),/not independently bootable/);
  assert.equal(await page.locator('[data-example="shell-app"] a[download]').getAttribute('href'),'../downloads/shell-app.bin');
  const allocator=page.locator('[data-example="bounded-allocator"]');
  assert.match(await allocator.textContent(),/CPU lab can run both sources/);
  assert.match(await allocator.locator('pre').textContent(),/\[200F,2010\)/);
  for(const file of ['downloads/bounded-allocator.img','reference/examples/bounded-allocator/program.bits','reference/examples/bounded-allocator/control.bits','assets/bounded-allocator-recording.json']) {
    const response=await page.request.get(new URL(file,base).href);assert.ok(response.ok(),file);
    assert.deepEqual(await response.body(),await readFile(resolve(root,'site',file)),`${file} serves exact reviewed bytes`);
  }
  await checkTimerIRQ(page,base);
  await checkPaging(page,base);
  await page.goto(new URL('roadmap/',base).href);
  const progress = JSON.parse(await readFile(resolve(root,'site/progress.json'),'utf8'));
  await page.waitForFunction(() => document.querySelectorAll('.milestone-row').length > 0);
  assert.equal(await page.locator('.milestone-row').count(),progress.milestones.length);
  assert.equal(await page.locator('#roadmap-updated').textContent(),`UPDATED ${progress.updated}`);
  assert.deepEqual(await page.locator('.milestone-row h3').allTextContents(),progress.milestones.map(item => item.milestone));
  await page.route('**/progress.json',route => route.fulfill({contentType:'application/json',body:JSON.stringify({updated:'2026-10-12',milestones:[{milestone:'<img src=x onerror="window.injected=true">',progress:'<script>window.injected=true</script>'}]})}));
  await page.reload();await page.waitForFunction(() => document.querySelectorAll('.milestone-row').length === 1);
  assert.match(await page.locator('.milestone-row h3').textContent(),/<img/);
  assert.equal(await page.locator('.milestone-row img, .milestone-row script').count(),0);
  assert.equal(await page.evaluate(() => window.injected),undefined,'progress uses textContent rather than HTML injection');
  await page.unroute('**/progress.json');
  await page.route('**/progress.json',route => route.fulfill({contentType:'application/json',body:JSON.stringify({updated:'today',milestones:[]})}));
  await page.reload();await page.waitForFunction(() => document.querySelector('#roadmap-status').textContent.includes('invalid shape'));
  assert.equal(await page.locator('.milestone-row').count(),0);
  await page.unroute('**/progress.json');
  await checkByteOrder(page, base);
  await mkdir(resolve(root,'build'),{recursive:true});
  for (const width of [1440,768,390,320]) {
    await page.setViewportSize({width,height:844});
    for (const route of routes) {
      await page.goto(new URL(`${route}/`,base).href);
      if (route === 'playground') await page.waitForFunction(() => document.querySelectorAll('#bit-editor button').length === 24);
      if (route === 'roadmap') await page.waitForFunction(() => document.querySelectorAll('.milestone-row').length > 0);
      assert.equal(await page.locator('h1').count(),1);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),true,`${width}px overflow: ${route}`);
      if (width === 1440 || width === 390) await page.screenshot({path:resolve(root,`build/route-${route}-${width}.png`),fullPage:true});
    }
  }
  await checkVGABitmap(page,base);
  assert.deepEqual(errors,[],'route console / failed assets');
  console.log('dedicated-route browser checks passed: nested playground editing/keyboard/flags, nineteen example downloads and app payload boundary, native bitmap/GIF/image bytes and graphics rejection, exact generated roadmap, safe text rendering and invalid-data handling, all five routes at 1440/768/390/320px; screenshots in build/');
} finally {await browser?.close();await new Promise(resolve => server.close(resolve));}
