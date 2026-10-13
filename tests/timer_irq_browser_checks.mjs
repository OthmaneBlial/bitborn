import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

export async function checkTimerIRQ(page,base) {
  await page.goto(new URL('examples/',base).href);
  const entry=page.locator('[data-example="timer-irq"]');
  assert.match(await entry.textContent(),/1536-byte disk/);
  assert.match(await entry.textContent(),/exceeds the CPU lab's 512-byte input bound/);
  assert.match(await entry.locator('pre').textContent(),/ISR0 \+ pending IRQ0/);
  assert.equal(await entry.locator('a[href*="cpu-lab"]').count(),0,'native stage is never advertised as browser execution');
  for(const file of ['downloads/timer-irq.img','downloads/timer-irq.bin','assets/timer-irq-recording.json',
                    'reference/examples/timer-irq/program.bits','reference/examples/timer-irq/control.bits',
                    'reference/examples/timer-irq/no-eoi.bits','reference/examples/timer-irq/README.md']) {
    const response=await page.request.get(new URL(file,base).href);assert.ok(response.ok(),file);
    assert.deepEqual(await response.body(),readFileSync(new URL('../site/'+file,import.meta.url)),`${file} serves exact verified bytes`);
  }
  for(const width of [1440,320]) {
    await page.setViewportSize({width,height:844});await entry.scrollIntoViewIfNeeded();
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${width}px native timer overflow`);
  }
}
