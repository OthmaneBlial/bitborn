import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseBits} from '../site/binary.mjs';
import {programFragment} from '../site/program-link.mjs';

export async function checkBitHunt(page,base) {
  await page.goto(new URL('examples/',base).href);
  const entry=page.locator('[data-example="bit-hunt"]');
  assert.match(await entry.textContent(),/twenty actual QEMU frames from two boots/);
  assert.match(await entry.textContent(),/model does not emulate this game/);
  assert.match(await entry.locator('pre').textContent(),/WIN Y.*WIN N/);
  assert.equal(await entry.locator('a[href*="cpu-lab"]').count(),0,'native game is not advertised as browser play');
  await entry.locator('img').scrollIntoViewIfNeeded();
  await entry.locator('img').evaluate(img=>img.decode());
  assert.deepEqual(await entry.locator('img').evaluate(img=>[img.naturalWidth,img.naturalHeight]),[648,432]);
  for(const file of ['downloads/bit-hunt.img','downloads/bit-hunt.bin','assets/bit-hunt-recording.json','assets/bit-hunt-demo.gif',
                    'reference/examples/bit-hunt/program.bits','reference/examples/bit-hunt/no-star.bits','reference/examples/bit-hunt/README.md']) {
    const response=await page.request.get(new URL(file,base).href);assert.ok(response.ok(),file);
    assert.deepEqual(await response.body(),readFileSync(new URL('../site/'+file,import.meta.url)),`${file} serves verified native bytes`);
  }
  for(const width of [1440,320]) {
    await page.setViewportSize({width,height:844});await entry.scrollIntoViewIfNeeded();
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${width}px Bit Hunt overflow`);
  }
  for(const name of ['program','no-star']) {
    const bytes=parseBits(readFileSync(new URL(`../examples/bit-hunt/${name}.bits`,import.meta.url),'utf8'));
    await page.goto(new URL('cpu-lab/'+programFragment(bytes),base).href);
    await page.waitForFunction(()=>document.getElementById('byte-count').textContent==='492 BYTES');
    for(let count=0;count<14;count++)await page.locator('#step').click();
    assert.equal(await page.locator('#step-count').textContent(),'0014');
    const shown=()=>page.evaluate(()=>JSON.stringify({registers:Array.from(document.querySelectorAll('#registers .register-value'),value=>value.textContent),memory:document.getElementById('memory').textContent,
      screen:document.getElementById('screen-output').textContent,serial:document.getElementById('serial-output').textContent}));
    const before=await shown();await page.locator('#step').click();
    assert.match(await page.locator('#status').textContent(),/0xC6.*outside/);
    assert.equal(await page.locator('#step-count').textContent(),'0014');
    assert.equal(await shown(),before,'the unsupported guard store preserves register values, displayed memory and output');
  }
}
