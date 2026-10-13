import assert from 'node:assert/strict';

export async function checkByteOrder(page, base) {
  for (const width of [1440, 320]) {
    await page.setViewportSize({width, height: 844});
    await page.goto(new URL('learn/', base).href);
    const byte = page.locator('#lesson-byte'), word = page.locator('#lesson-word');
    await page.waitForFunction(() => document.querySelector('#lesson-branch').textContent.includes('JMP -6'));
    assert.equal(await word.textContent(), 'B8 34 12 → MOV AX, 4660 (0x1234)');
    await page.locator('#lesson-bit').focus(); await page.keyboard.press('Space');
    assert.equal(await byte.textContent(), '00110101 = 0x35 = 53');
    assert.equal(await word.textContent(), 'B8 35 12 → MOV AX, 4661 (0x1235)');
    assert.equal(await page.locator('#lesson-bit').evaluate(node => node === document.activeElement), true);
    await page.locator('#lesson-swap').click();
    assert.equal(await word.textContent(), 'B8 12 35 → MOV AX, 13586 (0x3512)');
    assert.equal(await byte.textContent(), '00010010 = 0x12 = 18');
    await page.locator('#lesson-sign').focus(); await page.keyboard.press('Enter');
    assert.match(await page.locator('#lesson-branch').textContent(), /JMP \+122; next IP 0x7C06 \+ 122 = 0x7C80/);
    assert.match(await page.locator('#lesson-boundary').textContent(), /outside.*does not prove/);
    assert.match(await page.locator('#lesson-literal').textContent(), /01111010$/);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${width}px edited lesson overflow`);
    await page.locator('#lesson-reset').click();
    assert.equal(await word.textContent(), 'B8 34 12 → MOV AX, 4660 (0x1234)');
    assert.match(await page.locator('#lesson-boundary').textContent(), /offset 0 inside/);
    await page.locator('#lesson-bit').click(); await page.reload();
    await page.waitForFunction(() => document.querySelector('#lesson-branch').textContent.includes('JMP -6'));
    assert.equal(await byte.textContent(), '00110100 = 0x34 = 52');
    for (const id of ['lesson-byte', 'lesson-word', 'lesson-branch']) {
      assert.equal(await page.locator(`#${id}`).getAttribute('aria-live'), 'polite');
      assert.equal(await page.locator(`#${id}`).getAttribute('aria-atomic'), 'true');
    }
  }
}
