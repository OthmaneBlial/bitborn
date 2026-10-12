import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdir,stat} from 'node:fs/promises';
import {resolve,dirname,extname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)),'..');
const {chromium} = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(resolve(process.env.PLAYWRIGHT_MODULE)).href : 'playwright');
const catalog = JSON.parse(await readFile(resolve(root,'site/challenges/catalog.json'),'utf8'));
const types = {'.html':'text/html','.mjs':'text/javascript','.json':'application/json','.css':'text/css'};
const server = createServer(async (request,response) => {
  try {
    const route = decodeURIComponent(new URL(request.url,'http://localhost').pathname);
    if (!route.startsWith('/bitborn/')) { response.writeHead(404).end(); return; }
    let path = resolve(root,'site',route.slice('/bitborn/'.length));
    if (!path.startsWith(resolve(root,'site')+'/')) { response.writeHead(403).end(); return; }
    if ((await stat(path)).isDirectory()) path = resolve(path,'index.html');
    response.writeHead(200,{'Content-Type':types[extname(path)] || 'application/octet-stream'}).end(await readFile(path));
  } catch { response.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
const base = process.env.SITE_BASE_URL || `http://127.0.0.1:${server.address().port}/bitborn/`;
let browser;
try {
  browser = await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? {executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE} : {})});
  const context = await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  const page = await context.newPage(), errors = [];
  page.on('pageerror',error => errors.push(error.message));
  page.on('response',response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  const open = async id => {
    await page.goto(new URL(`challenges/?id=${encodeURIComponent(id)}`,base).href);
    await page.locator('#challenge-app').waitFor({state:'visible'});
  };
  await open('return-42');
  assert.equal(await page.locator('#challenge-list a').count(),20);
  await page.locator('#validate').click();
  assert.match(await page.locator('#result').textContent(),/goal is still unmet/);
  for (let count = 0; count < 3; count++) await page.locator('#hint').click();
  assert.equal(await page.locator('#hints li').count(),3);
  assert.equal(await page.locator('#hint').isDisabled(),true);
  const bit = page.locator('[data-offset="2"][data-bit="6"]');
  const original = await bit.getAttribute('aria-pressed');
  await bit.focus(); await page.keyboard.press('Enter');
  assert.notEqual(await bit.getAttribute('aria-pressed'),original,'keyboard toggles a bit');
  assert.equal(await bit.evaluate(button => button === document.activeElement),true,'bit focus survives redraw');
  await page.keyboard.press('Enter');
  assert.equal(await bit.getAttribute('aria-pressed'),original);
  await page.locator('#reset').click();
  assert.equal(await page.locator('#binary-source').inputValue(),catalog[0].startText);

  for (const challenge of catalog) {
    await open(challenge.id);
    assert.equal(await page.locator('#challenge-title').textContent(),challenge.title);
    assert.equal(new URL(await page.locator('#share').getAttribute('href')).searchParams.get('id'),challenge.id);
    await page.locator('#binary-source').fill(challenge.solutionText);
    await page.locator('#validate').click();
    assert.match(await page.locator('#result').textContent(),/Solved in/,
      `${challenge.id}: ${await page.locator('#result').textContent()}`);
    assert.equal(await page.locator('.goal-checks .fail').count(),0);
    assert.equal(await page.locator('#result-panel').evaluate(panel => getComputedStyle(panel).animationName),'none','reduced motion');
  }
  assert.match(await page.locator('#completion-count').textContent(),/^20 \/ 20$/);
  assert.equal(await page.locator('.completed-mark').filter({hasText:'✓'}).count(),20);
  assert.equal(await page.locator('#attempt-count').textContent(),'21 validation attempts');
  await page.reload(); await page.locator('#challenge-app').waitFor({state:'visible'});
  assert.match(await page.locator('#completion-count').textContent(),/^20 \/ 20$/,'progress survives reload');
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('bitborn.challenges.v1')));
  assert.equal(stored.completed.length,20);
  assert.equal(Object.values(stored.attempts).reduce((sum,value) => sum+value,0),21);
  await page.locator('.explanation summary').click();
  assert.ok((await page.locator('#visual-explanation').textContent()).includes('EB → EA'));
  await mkdir(resolve(root,'build'),{recursive:true});
  await page.screenshot({path:resolve(root,'build/challenges-desktop.png'),fullPage:true});

  await open('<img src=x onerror="window.pwned=1">');
  assert.match(await page.locator('#load-status').textContent(),/Unknown challenge/);
  assert.equal(await page.evaluate(() => window.pwned),undefined);
  await page.locator('#binary-source').fill('<img src=x onerror="window.pwned=1">');
  await page.locator('#validate').click();
  assert.equal(await page.locator('#result-panel img').count(),0);
  assert.equal(await page.evaluate(() => window.pwned),undefined);
  await page.locator('#binary-source').fill('00000000 '.repeat(513)); await page.locator('#validate').click();
  assert.match(await page.locator('#result').textContent(),/512|limit|large|maximum/i);
  await page.evaluate(() => localStorage.setItem('bitborn.challenges.v1','{"version":1,"completed":["missing","return-42","return-42","<img>"],"attempts":{"return-42":-5,"addition":1e100,"print-character":2}}'));
  await page.reload(); await page.locator('#challenge-app').waitFor({state:'visible'});
  assert.match(await page.locator('#completion-count').textContent(),/^1 \/ 20$/);
  assert.equal(await page.locator('#attempt-count').textContent(),'2 validation attempts');
  await page.evaluate(() => localStorage.setItem('bitborn.challenges.v1','corrupt json'));
  await page.reload(); await page.locator('#challenge-app').waitFor({state:'visible'});
  assert.match(await page.locator('#completion-count').textContent(),/^0 \/ 20$/);
  for (const width of [390,320]) {
    await page.setViewportSize({width,height:844});
    for (const id of ['return-42','repair-boot']) {
      await open(id);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),true,`${width}px overflow for ${id}`);
      await page.locator('#hint').click();
      await page.locator('#binary-source').fill(catalog.find(challenge => challenge.id === id).solutionText);
      await page.locator('#validate').click();
      assert.match(await page.locator('#result').textContent(),/Solved in/);
    }
  }
  await page.screenshot({path:resolve(root,'build/challenges-mobile.png'),fullPage:true});
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error('Storage denied'); };
    Storage.prototype.setItem = () => { throw new Error('Storage denied'); };
  });
  await open('return-42');
  await page.locator('#binary-source').fill(catalog[0].solutionText); await page.locator('#validate').click();
  assert.match(await page.locator('#result').textContent(),/Solved in/,'denied storage still permits completion');
  assert.deepEqual(errors,[],'browser errors and failed assets');
  console.log('Real-browser challenge checks passed: all 20 solutions, negative seed, hints, keyboard bits, shared links, reload/counts, malformed input, XSS-safe text, invalid/denied storage, reduced motion and 1440/390/320px layouts. Screenshots: build/challenges-{desktop,mobile}.png');
} finally { await browser?.close(); await new Promise(resolve => server.close(resolve)); }
