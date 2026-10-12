import assert from 'node:assert/strict';
import {formatBits} from '../site/binary.mjs';

export async function checkRegisterMOV(page) {
  const bytes=Uint8Array.from([0xB8,0xCD,0xAB,0xBB,0x34,0x12,0xF9,0xFD,0x89,0xDE,0x88,0xE0,0x8A,0xE3,0xF4]);
  await page.locator('#binary-editor').fill(formatBits(bytes));await page.locator('#load-program').click();
  for(let count=0;count<4;count++)await page.locator('#step').click();
  const flags=await page.locator('#flags').textContent();
  await page.locator('#step').click();
  assert.equal(await page.locator('[data-register="SI"] .register-value').textContent(),'1234');
  await page.locator('#step').click();assert.equal(await page.locator('[data-register="AX"] .register-value').textContent(),'ABAB');
  await page.locator('#step').click();assert.equal(await page.locator('[data-register="AX"] .register-value').textContent(),'34AB');
  assert.equal(await page.locator('#flags').textContent(),flags,'register MOV preserves the displayed carry/direction and other flags');
  await page.locator('#back').click();assert.equal(await page.locator('[data-register="AX"] .register-value').textContent(),'ABAB');
  await page.locator('#forward').click();assert.equal(await page.locator('[data-register="AX"] .register-value').textContent(),'34AB');
  await page.locator('#step').click();assert.equal(await page.locator('#run-state').textContent(),'HALTED');
}
