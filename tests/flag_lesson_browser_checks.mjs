import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseBits} from '../site/binary.mjs';
import {programFragment} from '../site/program-link.mjs';

export async function checkFlagLesson(page,base) {
  const flags=()=>Promise.all(['CF','OF','ZF','SF','PF','AF'].map(name=>page.locator(`[data-flag="${name}"] strong`).textContent()));
  const ax=()=>page.locator('[data-register="AX"] .register-value').textContent();
  const rows=[['FFFF','0','0','0','0','0','0'],['0000','1','0','1','0','1','1'],
    ['0001','1','0','0','0','0','0'],['FFFF','1','0','0','1','1','1'],
    ['FFFF','0','0','1','0','1','0'],['FFFF','0','0','1','0','1','0']];
  const signed=parseBits(readFileSync(new URL('../challenges/signed-overflow/solution.bits',import.meta.url),'utf8'));
  for(const width of [1440,320]) {
    await page.setViewportSize({width,height:844});await page.goto(new URL('cpu-lab/',base).href);
    await page.waitForFunction(()=>document.querySelectorAll('.register').length===14);
    await page.locator('#preset').selectOption('flags');
    for(const row of rows){await page.locator('#step').click();assert.deepEqual([await ax(),...await flags()],row);}
    await page.goto(new URL('cpu-lab/'+programFragment(signed),base).href);
    await page.waitForFunction(()=>document.querySelector('#binary-editor')?.value.includes('11111010'));
    for(let count=0;count<3;count++)await page.locator('#step').click();
    assert.equal(await ax(),'8000');assert.deepEqual(await flags(),['0','1','0','1','1','1']);
    await page.locator('#preset').selectOption('stack');
    for(let count=0;count<3;count++)await page.locator('#step').click();
    assert.deepEqual(await flags(),['0','0','1','0','1','?']);
    assert.match(await page.locator('[data-flag="AF"]').getAttribute('aria-label'),/^AF: undefined/);
    await page.locator('#back').click();assert.equal((await flags())[5],'0');
    await page.locator('#forward').click();assert.equal((await flags())[5],'?');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${width}px flag lesson overflow`);
    const link=page.locator('.cpu-panel a');
    assert.equal(await link.getAttribute('href'),'../reference/docs/tutorials/flags.md');
    assert.equal((await page.request.get(new URL(await link.getAttribute('href'),page.url()).href)).status(),200);
  }
}
