import assert from 'node:assert/strict';

export async function checkEncoding(page) {
  const initial=await page.locator('#play-registers').textContent();
  for(const width of [1440,320]) {
    await page.setViewportSize({width,height:1000});
    await page.locator('#instruction-select').selectOption('mov32');
    await page.locator('#decode-mode').selectOption('16');
    assert.equal(await page.locator('#decoded-instruction').textContent(),'MOV AX, 42');
    assert.match(await page.locator('#encoding-explanation').textContent(),/consumes 3 of the 5/);
    assert.equal(await page.locator('#execute-instruction').isEnabled(),true);
    await page.locator('#decode-mode').selectOption('32');
    assert.equal(await page.locator('#decoded-instruction').textContent(),'MOV EAX, 42');
    assert.equal(await page.locator('#execute-instruction').isDisabled(),true);
    await page.locator('#decode-mode').selectOption('64');
    assert.equal(await page.locator('#decoded-instruction').textContent(),'MOV EAX, 42');
    assert.match(await page.locator('#encoding-explanation').textContent(),/clears its upper 32 bits/);
    await page.locator('#instruction-select').selectOption('mov64');
    assert.equal(await page.locator('#decoded-instruction').textContent(),'MOV R8, 18446744073709551615');
    assert.equal(await page.locator('#execute-instruction').isDisabled(),true);
    assert.match(await page.locator('[data-bit="0-0"]').getAttribute('aria-label'),/B: register extension/);
    await page.locator('[data-bit="0-0"]').press('Space');
    assert.equal(await page.locator('#decoded-instruction').textContent(),'MOV RAX, 18446744073709551615');
    assert.equal(await page.evaluate(()=>document.activeElement.dataset.bit),'0-0');
    await page.locator('[data-bit="0-3"]').click();
    assert.equal(await page.locator('#decoded-instruction').textContent(),'MOV EAX, 4294967295');
    assert.match(await page.locator('#encoding-explanation').textContent(),/consumes 6 of the 10/);
    assert.equal(await page.locator('#play-registers').textContent(),initial,'read-only inspection never changes simulated state');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`wide instruction inspection fits ${width}px`);
  }
  await page.locator('#decode-mode').selectOption('16');await page.locator('#reset-bits').click();
  assert.equal(await page.locator('#decoded-instruction').textContent(),'DEC CX');
  await page.locator('#instruction-select').selectOption('mov');
}
