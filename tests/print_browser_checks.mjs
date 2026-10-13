import assert from 'node:assert/strict';
import {resolve} from 'node:path';

export async function checkPrintLessons(page,base,pdfDirectory=null) {
  const viewport=page.viewportSize();
  try {
    await page.setViewportSize({width:674,height:960});
    for(const route of ['docs.html','learn/','intro/en/','intro/zh-CN/','intro/es/','intro/fr/','intro/ja/','intro/pt/','intro/de/','intro/ar/']) {
      await page.emulateMedia({media:'screen'});await page.goto(new URL(route,base).href);
      const code=await page.locator('main pre,main code').allTextContents();
      assert.equal(await page.locator('.print-source').isVisible(),false,'attribution is print-only');
      await page.emulateMedia({media:'print'});
      await page.waitForFunction(()=>getComputedStyle(document.body).backgroundColor==='rgb(255, 255, 255)');
      assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).backgroundColor),'rgb(255, 255, 255)','page margins stay white');
      assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).colorScheme),'light');
      assert.equal(await page.locator('.header,.intro-header').first().isVisible(),false,'navigation is omitted on paper');
      assert.equal(await page.locator('.print-source').isVisible(),true);
      assert.match(await page.locator('.print-source').textContent(),/https:\/\/github.com\/OthmaneBlial\/bitborn\/blob\/main\//);
      assert.match(await page.locator('.print-source').textContent(),/https:\/\/othmaneblial.github.io\/bitborn\//);
      assert.deepEqual(await page.locator('main pre,main code').allTextContents(),code,'literal text survives printing unchanged');
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${route} print width`);
      for(const pre of await page.locator('main pre').all()) {
        assert.equal(await pre.evaluate(element=>getComputedStyle(element).direction),'ltr');
        assert.equal(await pre.evaluate(element=>getComputedStyle(element).overflowX),'visible');
        assert.match(await pre.evaluate(element=>getComputedStyle(element).fontFamily),/monospace/);
        assert.equal(await pre.evaluate(element=>getComputedStyle(element).color),'rgb(17, 17, 17)');
      }
      if(route==='intro/ar/')assert.equal(await page.locator('main').evaluate(element=>getComputedStyle(element).direction),'rtl');
      if(pdfDirectory&&['docs.html','learn/','intro/en/','intro/ar/'].includes(route)) {
        await page.evaluate(()=>document.fonts.ready);
        const name=route==='docs.html'?'manual':route==='learn/'?'learning-path':route.includes('/ar/')?'arabic':'english';
        await page.pdf({path:resolve(pdfDirectory,`${name}.pdf`),preferCSSPageSize:true,printBackground:true});
      }
    }
  } finally {await page.emulateMedia({media:'screen'});if(viewport)await page.setViewportSize(viewport);}
}
