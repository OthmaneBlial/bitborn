import assert from 'node:assert/strict';
import {readFileSync,existsSync,statSync,readdirSync} from 'node:fs';
import {dirname,resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)),'..');
const routes = ['playground','examples','learn','architecture','roadmap','elf','bit-diff'];
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
assert.equal([...examples.matchAll(/data-example="/g)].length,16);
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
function checkCopies(directory) {
  for(const entry of readdirSync(resolve(root,directory),{withFileTypes:true})) {
    const source=join(directory,entry.name);
    if(entry.isDirectory())checkCopies(source);
    else assert.deepEqual(readFileSync(resolve(root,source)),readFileSync(resolve(root,'site/reference',source)),`${source} published reference matches canonical source`);
  }
}
checkCopies('docs');
for(const folder of new Set(['boot','challenges','assets','examples/boot-sector',...targets.filter(target=>target.source.startsWith('examples/')).map(target=>dirname(target.source))]))checkCopies(folder);
assert.deepEqual(readFileSync(resolve(root,'examples/README.md')),readFileSync(resolve(root,'site/reference/examples/README.md')));
for(const name of readdirSync(resolve(root,'assets')))assert.deepEqual(readFileSync(resolve(root,'assets',name)),readFileSync(resolve(root,'site/assets',name)),`${name} live asset copy matches canonical source`);
const languages=JSON.parse(readFileSync(resolve(root,'docs/i18n/manifest.json'),'utf8')).languages;
for(const language of languages) {
  const page=resolve(root,'site/intro',language.tag,'index.html'),html=readFileSync(page,'utf8');
  assert.ok(html.includes(`<html lang="${language.tag}" dir="${language.direction}">`));
  assert.ok(html.includes(`rel="canonical" href="https://othmaneblial.github.io/bitborn/intro/${language.tag}/"`));
  assert.equal([...html.matchAll(/<h1\b/g)].length,1);
  assert.equal([...html.matchAll(/hreflang="/g)].length,9);
  for(const item of languages)assert.ok(html.includes(`hreflang="${item.tag}"`));
  for(const [,url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if(/^(https?:|#)/.test(url))continue;
    const target=resolve(dirname(page),url);
    assert.ok(existsSync(target),`${language.tag} local link: ${url}`);
    if(statSync(target).isDirectory())assert.ok(existsSync(join(target,'index.html')));
  }
  assert.ok(readFileSync(resolve(root,'site/sitemap.xml'),'utf8').includes(`/intro/${language.tag}/`));
}
assert.match(progress.updated,/^\d{4}-\d{2}-\d{2}$/);assert.ok(progress.milestones.length > 0);
assert.ok(progress.milestones.every(item => typeof item.milestone === 'string' && typeof item.progress === 'string'));
console.log(`route checks passed: ${routes.length} portable routes, unique metadata, local source/tutorial/download links, sixteen real example sizes, generated repository progress data`);
