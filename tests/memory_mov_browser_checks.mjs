import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

export async function checkMemoryMOV(page) {
  await page.locator('#preset').selectOption('memory-mov');
  assert.equal(await page.locator('#binary-editor').inputValue(),readFileSync(new URL('../docs/instruction-encoding/fixtures/memory-mov-program.bits',import.meta.url),'utf8'));
  for(let index=0;index<20;index++)await page.locator('#step').click();
  const flags=await page.locator('#flags').textContent();
  await page.locator('#step').click();assert.equal(await page.locator('[data-register="AX"] .register-value').textContent(),'2233');
  await page.locator('#step').click();assert.equal(await page.locator('[data-register="CX"] .register-value').textContent(),'1111');
  await page.locator('#step').click();assert.equal(await page.locator('[data-register="DX"] .register-value').textContent(),'1111');
  await page.locator('#step').click();await page.locator('#step').click();
  await page.locator('#memory-address').fill('10030');await page.locator('#memory-form').evaluate(form=>form.requestSubmit());
  assert.equal(await page.locator('[data-address="10030"]').textContent(),'11');
  assert.equal(await page.locator('[data-address="10031"]').textContent(),'11');
  await page.locator('#back').click();assert.equal(await page.locator('[data-address="10030"]').textContent(),'00');
  await page.locator('#forward').click();assert.equal(await page.locator('[data-address="10030"]').textContent(),'11');
  await page.locator('#step').click();assert.equal(await page.locator('[data-address="10032"]').textContent(),'22');
  await page.locator('#step').click();assert.equal(await page.locator('[data-register="DX"] .register-value').textContent(),'1122');
  assert.equal(await page.locator('#flags').textContent(),flags,'all displayed flags, including undefined AF, survive memory MOV');
  await page.locator('#step').click();assert.equal(await page.locator('#run-state').textContent(),'HALTED');
  assert.equal(await page.locator('#step-count').textContent(),'0028');
}
