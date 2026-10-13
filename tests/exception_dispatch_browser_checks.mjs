import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

export async function checkExceptionDispatch(page,base) {
  await page.goto(new URL('examples/',base).href);
  const entry=page.locator('[data-example="exception-dispatch"]');
  assert.match(await entry.textContent(),/only these four vectors have native delivery proof/);
  assert.match(await entry.textContent(),/exceeds the CPU lab's 512-byte input bound/);
  assert.match(await entry.locator('pre').textContent(),/fifth entry stops/);
  assert.equal(await entry.locator('a[href*="cpu-lab"]').count(),0,'native dispatch is never advertised as model execution');
  for(const file of ['downloads/exception-dispatch.img','downloads/exception-dispatch.bin','assets/exception-dispatch-recording.json',
                    'reference/examples/exception-dispatch/program.bits','reference/examples/exception-dispatch/divisor-one.bits',
                    'reference/examples/exception-dispatch/stop-divide.bits','reference/examples/exception-dispatch/retry-divide.bits',
                    'reference/examples/exception-dispatch/README.md','reference/examples/exception-dispatch/bytes.md']) {
    const response=await page.request.get(new URL(file,base).href);assert.ok(response.ok(),file);
    assert.deepEqual(await response.body(),readFileSync(new URL('../site/'+file,import.meta.url)),`${file} serves exact native proof bytes`);
  }
  for(const width of [1440,320]) {
    await page.setViewportSize({width,height:844});await entry.scrollIntoViewIfNeeded();
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${width}px dispatcher overflow`);
  }
}
