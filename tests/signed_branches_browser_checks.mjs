import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

export async function checkSignedBranches(page) {
  const source=readFileSync(new URL('../docs/instruction-encoding/fixtures/signed-branches.bits',import.meta.url),'utf8');
  const link=page.locator('a[download][href$="signed-branches.bits"]');
  assert.equal((await page.request.get(new URL(await link.getAttribute('href'),page.url()).href)).status(),200);
  await page.locator('#binary-editor').fill(source);await page.locator('#load-program').click();
  for(let index=0;index<11;index++)await page.locator('#step').click();
  assert.equal(await page.locator('[data-register="AX"] .register-value').textContent(),'8000');
  assert.equal(await page.locator('[data-flag="SF"] strong').textContent(),'0');
  assert.equal(await page.locator('[data-flag="OF"] strong').textContent(),'1');
  // CMP is the eleventh instruction: SF is clear but OF makes signed less true.
  await page.locator('#step').click();
  assert.equal(await page.locator('[data-register="BX"] .register-value').textContent(),'0000');
  const pointer=page.locator('[data-register="IP"] .register-value'),after=await pointer.textContent();
  await page.locator('#back').click();assert.notEqual(await pointer.textContent(),after);
  await page.locator('#forward').click();assert.equal(await pointer.textContent(),after);
  await page.locator('#run').click();await page.waitForFunction(()=>document.getElementById('run-state').textContent==='HALTED');
  assert.equal(await page.locator('#step-count').textContent(),'0031');
  for(const [name,value] of Object.entries({AX:'1234',BX:'0000',CX:'1111',DX:'2222',SI:'3333',DI:'4444',BP:'5555',SP:'7C00'}))
    assert.equal(await page.locator(`[data-register="${name}"] .register-value`).textContent(),value);
}
