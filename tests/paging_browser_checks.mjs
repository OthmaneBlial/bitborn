import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseBits} from '../site/binary.mjs';
import {programFragment} from '../site/program-link.mjs';

export async function checkPaging(page,base) {
  await page.goto(new URL('examples/',base).href);
  const entry=page.locator('[data-example="paging"]');
  assert.match(await entry.textContent(),/model stops at LGDT before paging setup/);
  assert.match(await entry.locator('pre').textContent(),/page still read-only/);
  for(const file of ['downloads/paging.img','downloads/paging.bin','assets/paging-recording.json',
                    'reference/examples/paging/program.bits','reference/examples/paging/writable.bits',
                    'reference/examples/paging/wp-off.bits','reference/examples/paging/README.md']) {
    const response=await page.request.get(new URL(file,base).href);assert.ok(response.ok(),file);
    assert.deepEqual(await response.body(),readFileSync(new URL('../site/'+file,import.meta.url)),`${file} serves exact verified bytes`);
  }
  for(const width of [1440,320]) {
    await page.setViewportSize({width,height:844});await entry.scrollIntoViewIfNeeded();
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${width}px paging gallery overflow`);
  }
  for(const name of ['program','writable','wp-off']) {
    const bytes=parseBits(readFileSync(new URL(`../examples/paging/${name}.bits`,import.meta.url),'utf8'));
    await page.goto(new URL('cpu-lab/'+programFragment(bytes),base).href);
    await page.waitForFunction(()=>document.querySelector('#binary-editor')?.value.includes('11111010'));
    for(let count=0;count<7;count++)await page.locator('#step').click();
    assert.equal(await page.locator('#step-count').textContent(),'0007');
    assert.equal(await page.locator('[data-register="SP"] .register-value').textContent(),'7C00');
    await page.locator('#step').click();
    assert.match(await page.locator('#status').textContent(),/Encoding 0x0F.*outside/);
    assert.equal(await page.locator('#step-count').textContent(),'0007');
    assert.equal(await page.locator('#screen-output').textContent(),'∅');
    assert.equal(await page.locator('#serial-output').textContent(),'∅');
  }
}
