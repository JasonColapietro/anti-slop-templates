// Guard tests for the /notes/ article section. Node built-in runner, no dependencies.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'https://jasoncolapietro.github.io/anti-slop-templates/';
const PERSON = 'https://suedeai.ai/founder#person';
const ORG = 'https://suedeai.ai/#organization';
const read = (p) => readFileSync(join(root, p), 'utf8');
const articles = readdirSync(join(root, 'notes')).filter((f) => f.endsWith('.html') && f !== 'index.html');

const FORBIDDEN = [
  /velvet sundown/i, /\$\s?(28|30)\s?M\b/i, /multimillion/i, /forbes/i,
  /anthropic partner/i, /claude partner/i, /\bgoogle partner\b/i, /\bFAU\b/,
  /\b(delve|leverage|unlock|elevate|seamless|game-changer|tapestry|realm)\b/i,
  /\b\d+ S Olive\b/i, /"@type"\s*:\s*"(LocalBusiness|PostalAddress)"/,
];

const jsonLd = (html) =>
  [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((m) => JSON.parse(m[1]));
const words = (html) => {
  const body = html.match(/<article[^>]*>([\s\S]*?)<\/article>/)[1].replace(/<pre>[\s\S]*?<\/pre>/g, ' ');
  return body.replace(/<[^>]+>/g, ' ').split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;
};

test('three articles plus an index exist', () => {
  assert.equal(articles.length, 3);
  assert.ok(existsSync(join(root, 'notes/index.html')));
});

for (const file of articles) {
  const html = read(`notes/${file}`);
  const url = `${BASE}notes/${file}`;

  test(`${file}: no forbidden terms`, () => {
    for (const re of FORBIDDEN) assert.doesNotMatch(html, re);
  });

  test(`${file}: canonical, title and description`, () => {
    assert.match(html, new RegExp(`<link rel="canonical" href="${url}" />`));
    assert.match(html, new RegExp(`<meta property="og:url" content="${url}" />`));
    const title = html.match(/<title>(.*?)<\/title>/)[1].replace(/&amp;/g, '&');
    assert.ok(title.length >= 50 && title.length <= 60, `title length ${title.length}`);
    const desc = html.match(/<meta name="description" content="(.*?)"/)[1].replace(/&amp;/g, '&');
    assert.ok(desc.length >= 120 && desc.length <= 160, `description length ${desc.length}`);
  });

  test(`${file}: BlogPosting and BreadcrumbList reference canonical @ids`, () => {
    const blocks = jsonLd(html);
    const post = blocks.find((b) => b['@type'] === 'BlogPosting');
    const crumbs = blocks.find((b) => b['@type'] === 'BreadcrumbList');
    assert.ok(post && crumbs);
    assert.deepEqual(post.author, { '@id': PERSON });
    assert.deepEqual(post.publisher, { '@id': ORG });
    assert.equal(post.mainEntityOfPage['@id'], url);
    assert.equal(post['@id'], `${url}#article`);
    assert.equal(crumbs.itemListElement.at(-1).item, url);
    // never mint new Person / Organization nodes
    const all = JSON.stringify(blocks);
    assert.doesNotMatch(all, /"@type":"(Person|Organization)"/);
  });

  test(`${file}: 800-1300 words with a single h1`, () => {
    const n = words(html);
    assert.ok(n >= 800 && n <= 1300, `word count ${n}`);
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
  });

  test(`${file}: listed in sitemap and llms files`, () => {
    assert.ok(read('sitemap.xml').includes(`<loc>${url}</loc>`));
    assert.ok(read('llms.txt').includes(url));
    assert.ok(read('llms-full.txt').includes(url));
  });
}

test('gallery links to notes and carries the Suede AI credit', () => {
  const html = read('index.html');
  assert.match(html, /href="notes\/"/);
  assert.match(html, /Built by Suede AI in West Palm Beach, Florida/);
  for (const href of ['https://suedeai.agency/', 'https://suedeai.ai/', 'https://suedeai.ai/founder', 'https://jasoncolapietro.com/', 'https://jupitersocialfl.com/']) {
    assert.ok(html.includes(`href="${href}"`), href);
  }
});

test('sitemap lastmod is current and every local page in it exists', () => {
  const xml = read('sitemap.xml');
  const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  assert.ok(xml.includes('<lastmod>2026-11-15</lastmod>'));
  for (const loc of locs) {
    const rel = loc.slice(BASE.length) || 'index.html';
    assert.ok(existsSync(join(root, rel.endsWith('/') ? `${rel}index.html` : rel)), loc);
  }
});
