import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

export async function checkCarry(page) {
  const source=readFileSync(new URL('../docs/instruction-encoding/fixtures/carry-borrow.bits',import.meta.url),'utf8');
  const link=page.locator('a[download][href$="carry-borrow.bits"]');
  const response=await page.request.get(new URL(await link.getAttribute('href'),page.url()).href);
  assert.equal(response.status(),200);assert.equal(await response.text(),source);
  await page.locator('#binary-editor').fill(source);await page.locator('#load-program').click();
  for(let index=0;index<12;index++)await page.locator('#step').click();
  assert.equal(await page.locator('[data-register="AX"] .register-value').textContent(),'0000');
  assert.equal(await page.locator('[data-flag="CF"] strong').textContent(),'1');
  await page.locator('#back').click();assert.equal(await page.locator('[data-register="AX"] .register-value').textContent(),'FFFF');
  await page.locator('#forward').click();assert.equal(await page.locator('[data-register="AX"] .register-value').textContent(),'0000');
  for(let index=0;index<13;index++)await page.locator('#step').click();
  for(const name of ['SI','DI','BP'])assert.equal(await page.locator(`[data-register="${name}"] .register-value`).textContent(),'FFFF');
  for(let index=0;index<3;index++)await page.locator('#step').click();
  assert.equal(await page.locator('[data-register="AX"] .register-value').textContent(),'AB00');
  assert.equal(await page.locator('[data-flag="CF"] strong').textContent(),'1');
  await page.locator('#run').click();await page.waitForFunction(()=>document.getElementById('run-state').textContent==='HALTED');
  assert.equal(await page.locator('#step-count').textContent(),'0032');
  for(const [name,value] of Object.entries({AX:'AB00',BX:'0000',CX:'0000',DX:'0001',SI:'FFFF',DI:'FFFF',BP:'FFFF',SP:'7C00'}))
    assert.equal(await page.locator(`[data-register="${name}"] .register-value`).textContent(),value);
  await page.locator('#memory-address').fill('02000');await page.locator('#memory-form').evaluate(form=>form.requestSubmit());
  for(const [address,value] of [['02000','00'],['02001','AB'],['02002','00'],['02003','AB']])
    assert.equal(await page.locator(`[data-address="${address}"]`).textContent(),value);
  await page.locator('#back').click();await page.locator('#back').click();
  assert.equal(await page.locator('[data-address="02003"]').textContent(),'00');
  await page.locator('#forward').click();assert.equal(await page.locator('[data-address="02003"]').textContent(),'AB');
  await page.locator('#forward').click();assert.equal(await page.locator('#run-state').textContent(),'HALTED');
}
