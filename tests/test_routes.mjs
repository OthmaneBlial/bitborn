import assert from 'node:assert/strict';
import {readFileSync,existsSync,statSync} from 'node:fs';
import {dirname,resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)),'..');
const routes = ['playground','examples','learn','architecture','roadmap'];
const descriptions = [], titles = [];
for (const route of routes) {
  const page = resolve(root,'site',route,'index.html'), html = readFileSync(page,'utf8');
  assert.match(html,/<html lang="en">/);
  assert.ok(html.includes(`rel="canonical" href="https://othmaneblial.github.io/bitborn/${route}/"`),`${route} canonical`);
  assert.match(html,/property="og:image"/);assert.match(html,/name="twitter:card"/);
  assert.match(html,/type="application\/ld\+json"/);assert.match(html,/Skip to content/);
  assert.equal([...html.matchAll(/<h1\b/g)].length,1,`${route} has one page heading`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size,ids.length,`${route} IDs are unique`);
  descriptions.push(html.match(/name="description" content="([^"]+)"/)[1]);
  titles.push(html.match(/<title>([^<]+)<\/title>/)[1]);
  for (const [,url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|data:)/.test(url)) continue;
    assert.ok(!url.startsWith('/'),`${route} portable link ${url}`);
    const [relative,fragment] = url.split('#');
    let file = resolve(dirname(page),relative || 'index.html');
    assert.ok(existsSync(file),`${route} local link exists: ${url}`);
    if (statSync(file).isDirectory()) file = join(file,'index.html');
    assert.ok(existsSync(file),`${route} directory index exists: ${url}`);
    if (fragment) assert.ok(readFileSync(file,'utf8').includes(`id="${fragment}"`),`${route} local fragment ${url}`);
  }
}
assert.equal(new Set(titles).size,routes.length,'unique route titles');
assert.equal(new Set(descriptions).size,routes.length,'unique route descriptions');
const examples = readFileSync(resolve(root,'site/examples/index.html'),'utf8');
assert.equal([...examples.matchAll(/data-example="/g)].length,14);
const targets = [
  ...JSON.parse(readFileSync(resolve(root,'targets.json'),'utf8')),
  ...JSON.parse(readFileSync(resolve(root,'examples/shell/targets.json'),'utf8')),
];
for (const [,slug,size] of examples.matchAll(/data-example="([^"]+)"[^]*?<span>(\d+)-BYTE/g)) {
  const source = slug === 'boot-sector' ? 'boot/boot.bits' : `examples/${slug}/program.bits`;
  const target = targets.find(target => target.source === source);
  assert.ok(target,`${slug} has a reviewed target manifest entry`);
  assert.equal(Number(size),target.size,`${slug} displayed payload size`);
}
const progress = JSON.parse(readFileSync(resolve(root,'site/progress.json'),'utf8'));
for (const name of ['README.md','ROADMAP.md','CONTRIBUTING.md','CODE_OF_CONDUCT.md','SECURITY.md','CHANGELOG.md','LICENSE','targets.json','SHOWCASE.md','GOOD_FIRST_ISSUES.md']) {
  assert.deepEqual(readFileSync(resolve(root,name)),readFileSync(resolve(root,'site/reference',name)),`${name} published reference matches canonical source`);
}
assert.match(progress.updated,/^\d{4}-\d{2}-\d{2}$/);assert.ok(progress.milestones.length > 0);
assert.ok(progress.milestones.every(item => typeof item.milestone === 'string' && typeof item.progress === 'string'));
console.log('route checks passed: five portable dedicated routes, unique metadata, local source/tutorial/download links, fourteen real example sizes, generated repository progress data');
