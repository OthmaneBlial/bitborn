import assert from 'node:assert/strict';
import {parseBits,parseHex} from '../site/binary.mjs';

export async function checkHexDrafts(page) {
  await page.locator('#preset').selectOption('immediates');
  await page.locator('#step').click();
  const state=await page.locator('#registers,#step-count,#history-position').allTextContents();
  const binary='10111000 00101010 00000000 # retained comment\n11110100';
  await page.locator('#binary-editor').fill(binary);
  assert.deepEqual([...parseHex(await page.locator('#hex-editor').inputValue())],[0xB8,42,0,0xF4]);
  assert.equal(await page.locator('#binary-editor').inputValue(),binary,'synchronizing the hex view retains binary comments');
  assert.deepEqual(await page.locator('#registers,#step-count,#history-position').allTextContents(),state,'drafts do not execute or load programs');
  await page.locator('#hex-editor').fill('b8 07 00 # literal\nf4');
  assert.equal(await page.locator('#binary-editor').inputValue(),binary,'hex editing waits for an explicit load');
  await page.locator('#load-hex').click();
  assert.deepEqual([...parseBits(await page.locator('#binary-editor').inputValue())],[0xB8,7,0,0xF4]);
  assert.equal(await page.locator('#step-count').textContent(),'0000');
  await page.locator('#step').click();assert.equal(await page.locator('[data-register="AX"] .register-value').textContent(),'0007');
  const loaded=await page.locator('#registers,#step-count,#history-position').allTextContents(),source=await page.locator('#binary-editor').inputValue();
  await page.locator('#hex-editor').fill('B8 0x07 00');await page.locator('#load-hex').click();
  assert.match(await page.locator('#hex-status').textContent(),/two-digit hexadecimal token/);
  assert.equal(await page.locator('#binary-editor').inputValue(),source);
  assert.deepEqual(await page.locator('#registers,#step-count,#history-position').allTextContents(),loaded);
  await page.locator('#binary-editor').fill('0000000');
  assert.match(await page.locator('#hex-status').textContent(),/Binary draft invalid/);
  assert.equal(await page.locator('#hex-editor').inputValue(),'B8 0x07 00');
  await page.locator('#preset').selectOption('memory');
  assert.deepEqual(parseHex(await page.locator('#hex-editor').inputValue()),parseBits(await page.locator('#binary-editor').inputValue()));
}
