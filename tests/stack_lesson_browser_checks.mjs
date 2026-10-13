import assert from 'node:assert/strict';

export async function checkStackLesson(page) {
  for(const width of [1440,320]) {
    await page.setViewportSize({width,height:844});
    await page.locator('#preset').selectOption('stack');
    const register = name => page.locator(`[data-register="${name}"] .register-value`).textContent();
    const memory = address => page.locator(`[data-address="${address}"]`).textContent();
    const rows = [
      ['1234','0000','7C00','7C03','00','00'], ['1234','0000','7BFE','7C04','34','12'],
      ['0000','0000','7BFE','7C06','34','12'], ['0000','1234','7C00','7C07','34','12'],
      ['0000','1234','7BFE','7C0B','0A','7C'], ['0001','1234','7BFE','7C0C','0A','7C'],
      ['0001','1234','7C00','7C0A','0A','7C'], ['0001','1234','7C00','7C0B','0A','7C'],
    ];
    await page.locator('#memory-address').fill('07BFE');await page.locator('#memory-form button').click();
    for(let index=0;index<rows.length;index++) {
      await page.locator('#step').click();
      assert.deepEqual(await Promise.all(['AX','BX','SP','IP'].map(register).concat([memory('07BFE'),memory('07BFF')])),rows[index]);
      if(index===1 || index===4) {
        assert.equal(await page.locator('.stack-word:first-child').getAttribute('data-stack-address'),'07BFE');
        assert.match(await page.locator('.stack-word:first-child').getAttribute('aria-label'),index===1?/word 1234; bytes 34, 12/:/word 7C0A; bytes 0A, 7C/);
      }
      if(index===4) {
        await page.locator('#back').click();
        assert.deepEqual(await Promise.all([register('SP'),memory('07BFE'),memory('07BFF')]),['7C00','34','12']);
        await page.locator('#forward').click();
        assert.deepEqual(await Promise.all([register('SP'),memory('07BFE'),memory('07BFF')]),['7BFE','0A','7C']);
      }
    }
    assert.equal(await page.locator('#step').isDisabled(),true);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${width}px stack lesson overflow`);
    const link=page.locator('.stack-panel a');
    assert.equal(await link.getAttribute('href'),'../reference/docs/tutorials/stack-and-calls.md');
    assert.equal((await page.request.get(new URL(await link.getAttribute('href'),page.url()).href)).status(),200);
    await page.locator('#reset').click();
    assert.equal(await register('SP'),'7C00');
    assert.equal(await page.locator('#back').isDisabled(),true);
  }
}
