import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

export async function checkSelfModifying(page) {
  const source=readFileSync(new URL('../examples/self-modifying/program.bits',import.meta.url),'utf8');
  const link=page.locator('a[download][href$="self-modifying/program.bits"]');
  const response=await page.request.get(new URL(await link.getAttribute('href'),page.url()).href);
  assert.equal(response.status(),200);assert.equal(await response.text(),source);
  await page.locator('#binary-editor').fill(source);await page.locator('#load-program').click();
  for(let index=0;index<27;index++)await page.locator('#step').click();
  await page.locator('#memory-address').fill('07C3D');await page.locator('#memory-form').evaluate(form=>form.requestSubmit());
  assert.equal(await page.locator('[data-address="07C3D"]').textContent(),'41');
  await page.locator('#step').click();assert.equal(await page.locator('[data-address="07C3D"]').textContent(),'61');
  await page.locator('#back').click();assert.equal(await page.locator('[data-address="07C3D"]').textContent(),'41');
  await page.locator('#forward').click();assert.equal(await page.locator('[data-address="07C3D"]').textContent(),'61');
  await page.locator('#step').click();await page.locator('#step').click();
  assert.equal(await page.locator('[data-register="AX"] .register-value').textContent(),'0061');
  await page.locator('#run').click();await page.waitForFunction(()=>document.getElementById('run-state').textContent==='HALTED');
  assert.equal(await page.locator('#serial-output').textContent(),'a');assert.equal(await page.locator('#step-count').textContent(),'0040');
  assert.equal(await page.locator('#binary-editor').inputValue(),source,'live RAM writes do not rewrite the original source');
  await page.locator('#memory-address').fill('B8000');await page.locator('#memory-form').evaluate(form=>form.requestSubmit());
  assert.equal(await page.locator('[data-address="B8000"]').textContent(),'61');assert.equal(await page.locator('[data-address="B8001"]').textContent(),'0F');
}
