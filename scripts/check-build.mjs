import { readdir, readFile, access } from 'node:fs/promises';
import { resolve, relative, extname } from 'node:path';
import assert from 'node:assert/strict';
import { load } from 'cheerio';

const root = resolve('dist');
const origin = 'https://sumicalculator.com';
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) =>
        entry.isDirectory()
          ? walk(resolve(dir, entry.name))
          : resolve(dir, entry.name),
      ),
    )
  ).flat();
}
const files = await walk(root);
const pages = files.filter((file) => extname(file) === '.html');
const titles = new Set();
const canonicalUrls = [];
const routes = new Set();
const campaigns = new Set();

for (const file of pages) {
  const html = await readFile(file, 'utf8');
  const $ = load(html);
  const route = `/${relative(root, file).replace(/index\.html$/, '')}`;
  routes.add(route);
  const canonical = $('link[rel="canonical"]').attr('href');
  assert.equal(canonical, `${origin}${route}`, `canonical: ${route}`);
  assert.equal($('h1').length, 1, `one h1: ${route}`);
  assert(
    $('title').text() && !titles.has($('title').text()),
    `unique title: ${route}`,
  );
  titles.add($('title').text());
  assert(
    $('meta[name="description"]').attr('content'),
    `description: ${route}`,
  );
  assert.equal($('meta[property="og:url"]').attr('content'), canonical);
  const schemas = $('script[type="application/ld+json"]')
    .toArray()
    .flatMap((script) => JSON.parse($(script).html()));
  if (route === '/') {
    assert.equal(
      $('title').text(),
      'Sumi — Free Scientific Calculator for Android',
    );
    const app = schemas.find(
      (schema) => schema['@type'] === 'SoftwareApplication',
    );
    assert(app, 'homepage software schema');
    assert.equal(app.operatingSystem, 'Android');
    assert.equal(app.offers.price, '0');
    assert.equal(app.aggregateRating, undefined);
    assert.equal(app.review, undefined);
    assert.equal($('#hero-download a').length, 1, 'one primary hero download');
    assert.equal($('.hero [data-example-card]').length, 0);
    assert.equal($('#features [data-example-card]').length, 1);
    assert.equal($('.hero img').attr('loading'), 'eager');
    assert.equal($('.hero img').attr('fetchpriority'), 'high');
  }
  if (/^\/guides\/[^/]+\/$/.test(route)) {
    const article = schemas.find((schema) => schema['@type'] === 'Article');
    assert(article, `article schema: ${route}`);
    assert.equal(article.mainEntityOfPage, canonical);
    assert.equal(article.headline, $('h1').text().trim());
    assert.equal(article.datePublished.slice(0, 10), '2026-09-10');
    assert(
      Number.isFinite(Date.parse(article.dateModified)),
      `revision date: ${route}`,
    );
    assert(
      Date.parse(article.dateModified) >= Date.parse(article.datePublished),
    );
    assert(
      $('time')
        .toArray()
        .some(
          (time) =>
            $(time).attr('datetime')?.slice(0, 10) ===
            article.dateModified.slice(0, 10),
        ),
      `visible revision date agrees with metadata: ${route}`,
    );
    const breadcrumb = schemas.find(
      (schema) => schema['@type'] === 'BreadcrumbList',
    );
    assert.equal(breadcrumb?.itemListElement.at(-1).item, canonical);
  }
  if (route === '/404.html')
    assert.match($('meta[name="robots"]').attr('content'), /noindex/);
  else canonicalUrls.push(canonical);

  const refs = [];
  $('img').each((_, image) => {
    assert(Number($(image).attr('width')) > 0, `image width: ${route}`);
    assert(Number($(image).attr('height')) > 0, `image height: ${route}`);
    assert($(image).attr('alt') !== undefined, `image alternative: ${route}`);
  });
  for (const selector of [
    'meta[property="og:image"]',
    'meta[name="twitter:image"]',
  ]) {
    const ref = $(selector).attr('content');
    assert(ref, `sharing image: ${route}`);
    refs.push(ref);
  }
  for (const schema of schemas) {
    if (typeof schema.image === 'string') refs.push(schema.image);
  }
  $('[href], [src]').each((_, el) =>
    refs.push($(el).attr('href') ?? $(el).attr('src')),
  );
  $('[srcset]').each((_, el) =>
    $(el)
      .attr('srcset')
      .split(',')
      .forEach((item) => refs.push(item.trim().split(/\s/)[0])),
  );
  for (const ref of refs) {
    if (/^(mailto:|tel:|data:)/.test(ref)) continue;
    assert.notEqual(ref, '#', `placeholder link: ${route}`);
    const url = new URL(ref, canonical);
    if (url.hostname === 'play.google.com') {
      assert.equal(url.searchParams.get('id'), 'com.tomuozawa.sumi');
      const campaign = new URLSearchParams(url.searchParams.get('referrer'));
      assert.equal(campaign.get('utm_source'), 'sumicalculator.com');
      assert.equal(campaign.get('utm_medium'), 'website');
      assert.match(campaign.get('utm_campaign'), /^website_/);
      campaigns.add(campaign.get('utm_campaign'));
    }
    if (url.origin !== origin) continue;
    const target = resolve(
      root,
      `.${decodeURIComponent(url.pathname)}`,
      url.pathname.endsWith('/') ? 'index.html' : '',
    );
    await access(target).catch(() => {
      throw new Error(`Missing ${ref} from ${route}`);
    });
    if (url.hash && extname(target) === '.html') {
      const targetDoc =
        target === file ? $ : load(await readFile(target, 'utf8'));
      assert(
        targetDoc(`[id="${decodeURIComponent(url.hash.slice(1))}"]`).length,
        `Missing anchor ${ref} from ${route}`,
      );
    }
  }
}

assert.deepEqual(
  [...routes].sort(),
  [
    '/',
    '/404.html',
    '/download/',
    '/guides/',
    '/guides/exact-answers/',
    '/guides/fractions/',
    '/guides/solve-equations/',
    '/privacy/',
    '/support/',
  ].sort(),
  'preserve all nine routes',
);
assert.deepEqual(
  [...campaigns].sort(),
  [
    'website_home',
    'website_home_power',
    'website_download',
    'website_guides',
    'website_guide_fractions',
    'website_guide_exact_answers',
    'website_guide_solve_equations',
  ].sort(),
  'preserve store campaign identifiers',
);

const index = await readFile(resolve(root, 'sitemap-index.xml'), 'utf8');
assert.match(index, /https:\/\/sumicalculator\.com\/sitemap-0\.xml/);
const sitemap = await readFile(resolve(root, 'sitemap-0.xml'), 'utf8');
for (const url of canonicalUrls)
  assert(sitemap.includes(`<loc>${url}</loc>`), `Missing sitemap URL ${url}`);
assert(!sitemap.includes('404'), '404 must not be in sitemap');
assert.match(
  await readFile(resolve(root, 'robots.txt'), 'utf8'),
  /sitemap-index\.xml/,
);
assert.equal(
  (await readFile(resolve(root, 'CNAME'), 'utf8')).trim(),
  'sumicalculator.com',
);
for (const file of files.filter((f) => extname(f) === '.css')) {
  for (const match of (await readFile(file, 'utf8')).matchAll(
    /url\(["']?(\/[^)'"\s]+)["']?\)/g,
  ))
    await access(resolve(root, `.${match[1]}`));
}
console.log(
  `Verified ${pages.length} pages: links, images, metadata, campaigns, sitemap, fonts and custom domain.`,
);
