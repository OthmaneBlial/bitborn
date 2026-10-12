import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const manifest=JSON.parse(readFileSync(new URL('../docs/i18n/manifest.json',import.meta.url),'utf8'));
export async function checkIntroductions(page,base) {
  for(const language of manifest.languages) {
    for(const width of [1440,320]) {
      await page.setViewportSize({width,height:1000});
      const response=await page.goto(new URL(`intro/${language.tag}/`,base).href);
      assert.equal(response.status(),200,`${language.tag} introduction HTTP status`);
      assert.equal(await page.locator('html').getAttribute('lang'),language.tag);
      assert.equal(await page.locator('html').getAttribute('dir'),language.direction);
      assert.equal(await page.locator('h1').count(),1);
      assert.equal(await page.locator('nav [aria-current="page"]').textContent(),language.name);
      assert.equal(await page.locator('main').evaluate(node=>getComputedStyle(node).direction),language.direction);
      assert.equal(await page.locator('pre').first().textContent(),'10111000 00101010 00000000');
      assert.deepEqual(await page.locator('pre').evaluateAll(nodes=>nodes.map(node=>[getComputedStyle(node).direction,getComputedStyle(node).textAlign])),[['ltr','left'],['ltr','left']]);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${language.tag} page fits ${width}px`);
      await page.keyboard.press('Tab');
      // Safari's default macOS setting uses Option-Tab to include links.
      if(await page.evaluate(()=>document.activeElement===document.body))await page.keyboard.press('Alt+Tab');
      assert.equal(await page.evaluate(()=>document.activeElement.className),'skip-link');
      await page.keyboard.press('Enter');
      assert.equal(await page.evaluate(()=>document.activeElement.id),'main','skip link focuses the article');
    }
  }
}
