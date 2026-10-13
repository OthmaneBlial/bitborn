import assert from 'node:assert/strict';

export async function checkBitKeyboard(page) {
  const editor=page.locator('#bit-editor'),first=page.locator('[data-bit="0-7"]');
  const active=()=>page.evaluate(()=>document.activeElement.dataset.bit);
  const oneStop=async()=>assert.equal(await editor.locator('[tabindex="0"]').count(),1);
  await page.locator('#instruction-select').selectOption('mov64');await page.locator('#decode-mode').selectOption('64');
  const registers=await page.locator('#play-registers').textContent(),bytes=await page.locator('#byte-values').textContent();
  await first.focus();await oneStop();
  await page.keyboard.press('ArrowLeft');assert.equal(await active(),'0-7');
  await page.keyboard.press('ArrowRight');assert.equal(await active(),'0-6');
  await page.keyboard.press('ArrowDown');assert.equal(await active(),'1-6');
  await page.keyboard.press('ArrowUp');assert.equal(await active(),'0-6');
  await page.keyboard.press('End');assert.equal(await active(),'0-0');
  await page.keyboard.press('ArrowRight');assert.equal(await active(),'1-7');
  await page.keyboard.press('ArrowDown');assert.equal(await active(),'2-7');
  await page.keyboard.press('End');assert.equal(await active(),'2-0');
  await page.keyboard.press('Home');assert.equal(await active(),'2-7');
  for(const modifier of ['Control','Meta']) {
    await page.keyboard.press(`${modifier}+End`);assert.equal(await active(),'9-0');
    await page.keyboard.press('ArrowRight');assert.equal(await active(),'9-0');
    await page.keyboard.press('ArrowDown');assert.equal(await active(),'9-0');
    await page.keyboard.press(`${modifier}+Home`);assert.equal(await active(),'0-7');
  }
  assert.equal(await page.locator('#byte-values').textContent(),bytes,'navigation does not edit bytes');
  await page.keyboard.press('Enter');assert.equal(await active(),'0-7');await oneStop();
  assert.equal(await page.locator('#decoded-instruction').textContent(),'Outside this inspector');
  await page.keyboard.press('Space');assert.equal(await active(),'0-7');await oneStop();
  assert.equal(await page.locator('#byte-values').textContent(),bytes,'Enter/Space toggle and restore exactly one bit');
  assert.equal(await page.locator('#play-registers').textContent(),registers,'keyboard edits do not execute');
  await page.keyboard.press('Tab');assert.equal(await active(),undefined,'one Tab exits the entire byte matrix');
  await page.keyboard.press('Shift+Tab');assert.equal(await active(),'0-7');
  await page.keyboard.press('Control+End');assert.equal(await active(),'9-0');
  await page.locator('#instruction-select').focus();await page.locator('#instruction-select').selectOption('nop');
  assert.equal(await page.evaluate(()=>document.activeElement.id),'instruction-select','shortening a fixture does not steal control focus');
  assert.equal(await editor.locator('[tabindex="0"]').getAttribute('data-bit'),'0-7');
  await first.focus();await page.keyboard.press('ArrowUp');assert.equal(await active(),'0-7');
  await page.keyboard.press('End');assert.equal(await active(),'0-0');await page.keyboard.press('ArrowDown');assert.equal(await active(),'0-0');
  assert.equal(await editor.getAttribute('aria-describedby'),'bit-keyboard-help');
  assert.match(await page.locator('#bit-keyboard-help').textContent(),/Enter\/Space/);
  await page.locator('#decode-mode').selectOption('16');await page.locator('#instruction-select').selectOption('mov');
}
