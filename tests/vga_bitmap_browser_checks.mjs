import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {parseBits} from '../site/binary.mjs';

export async function checkVGABitmap(page,base) {
  const source=await readFile(new URL('../examples/vga-bitmap/program.bits',import.meta.url),'utf8'),bytes=parseBits(source);
  await page.goto(new URL('examples/',base).href);
  const entry=page.locator('[data-example="vga-bitmap"]');await entry.scrollIntoViewIfNeeded();
  assert.match(await entry.textContent(),/142-BYTE PAYLOAD/);assert.match(await entry.textContent(),/two separate boots/);
  await page.waitForFunction(()=>{const image=document.querySelector('[data-example="vga-bitmap"] img');return image.complete&&image.naturalWidth===512;});
  assert.equal(await entry.locator('a[href$="program.bits"]').getAttribute('href'),'../reference/examples/vga-bitmap/program.bits');
  const downloadPromise=page.waitForEvent('download');await entry.locator('a[download]').click();const download=await downloadPromise;
  const image=await readFile(await download.path());assert.equal(image.length,512);
  assert.deepEqual([...image.subarray(0,bytes.length)],[...bytes]);assert.ok(image.subarray(bytes.length,510).every(value=>value===0));
  assert.deepEqual([...image.subarray(510)],[0x55,0xAA]);
  for(const width of [1440,320]) {await page.setViewportSize({width,height:1000});await entry.scrollIntoViewIfNeeded();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`native bitmap gallery fits ${width}px`);}
  await page.goto(new URL('cpu-lab/',base).href);await page.locator('#binary-editor').fill(source);await page.locator('#load-program').click();
  for(let count=0;count<7;count++)await page.locator('#step').click();
  assert.match(await page.locator('#status').textContent(),/needs BIOS services outside this model/);
  assert.equal(await page.locator('#serial-output').textContent(),'∅');
  assert.equal(await page.locator('#screen-output').textContent(),'∅');
  await page.locator('#preset').selectOption('immediates');
}
