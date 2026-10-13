import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseBits} from '../site/binary.mjs';
import {programFragment} from '../site/program-link.mjs';

export async function checkAllocator(page,base) {
  const captures=JSON.parse(readFileSync(new URL('../assets/bounded-allocator-recording.json',import.meta.url),'utf8')).captures;
  for(const [index,name] of ['program','control'].entries()) {
    const bytes=parseBits(readFileSync(new URL(`../examples/bounded-allocator/${name}.bits`,import.meta.url),'utf8'));
    await page.setViewportSize({width:1440,height:960});
    await page.goto(new URL('cpu-lab/'+programFragment(bytes),base).href);
    await page.waitForFunction(()=>document.querySelector('#binary-editor')?.value.includes('11111010'));
    const count=name==='program'?135:137;
    for(let step=0;step<count;step++)await page.locator('#step').click();
    assert.equal(await page.locator('#run-state').textContent(),'HALTED');
    assert.equal(await page.locator('#step-count').textContent(),String(count).padStart(4,'0'));
    for(const [register,value] of Object.entries(captures[index].snapshot.registers)) {
      assert.equal(await page.locator(`[data-register="${register}"] .register-value`).textContent(),value.toString(16).toUpperCase().padStart(4,'0'));
    }
    await page.locator('#memory-address').fill('01FFF');await page.locator('#memory-form').evaluate(form=>form.requestSubmit());
    const guarded=Buffer.from(captures[index].snapshot.arenaAndGuardsHex,'hex');
    for(let offset=0;offset<guarded.length;offset++)assert.equal(await page.locator(`[data-address="${(0x1FFF+offset).toString(16).toUpperCase().padStart(5,'0')}"]`).textContent(),guarded[offset].toString(16).toUpperCase().padStart(2,'0'));
    await page.locator('#memory-address').fill('02100');await page.locator('#memory-form').evaluate(form=>form.requestSubmit());
    const log=Buffer.from(captures[index].snapshot.nativeLogHex,'hex');
    for(let offset=0;offset<log.length;offset++)assert.equal(await page.locator(`[data-address="${(0x2100+offset).toString(16).toUpperCase().padStart(5,'0')}"]`).textContent(),log[offset].toString(16).toUpperCase().padStart(2,'0'));
    await page.locator('#timeline').focus();await page.keyboard.press('Home');
    assert.equal(await page.locator('#step-count').textContent(),'0000');
    assert.equal(await page.locator('[data-address="02100"]').textContent(),'00');
    await page.keyboard.press('End');assert.equal(await page.locator('#run-state').textContent(),'HALTED');
    assert.equal(await page.locator('[data-address="02100"]').textContent(),'FF');
    await page.setViewportSize({width:320,height:844});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'allocator import fits at 320px');
  }
}
