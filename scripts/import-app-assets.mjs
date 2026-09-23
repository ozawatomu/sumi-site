import { copyFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import sharp from 'sharp';

const appRoot = process.argv[2];
if (!appRoot) {
  throw new Error('Usage: npm run assets:import -- /path/to/sumi');
}
const source = resolve(appRoot, 'build/website-assets');
const website = fileURLToPath(new URL('../', import.meta.url));
const appAssets = resolve(website, 'src/assets/app');
const publicAssets = resolve(website, 'public');
const captures = [
  'graphite-editing',
  'graphite-exact',
  'graphite-decimal',
  'graphite-history',
  'numerical-solve',
  'numerical-integral',
  'graphite-light',
  'graphite-dark',
  'paper-ink-light',
  'graphite-controls',
];
const guides = ['fractions', 'exact-answers', 'solve-equations'];
const dimensions = [
  ...captures.map((name) => [`${name}.png`, 1236, 2745]),
  ['crops/solve-display.png', 1236, 600],
  ...guides.map((name) => [`crops/guide-${name}.png`, 1236, 600]),
  ['og.png', 1200, 630],
  ['favicon.png', 64, 64],
  ['apple-touch-icon.png', 180, 180],
];

for (const [name, width, height] of dimensions) {
  const metadata = await sharp(resolve(source, name)).metadata();
  assert.equal(metadata.width, width, `${name} width`);
  assert.equal(metadata.height, height, `${name} height`);
}
await mkdir(appAssets, { recursive: true });
await mkdir(resolve(publicAssets, 'img/guides'), { recursive: true });
for (const name of captures) {
  await copyFile(
    resolve(source, `${name}.png`),
    resolve(appAssets, `${name}.png`),
  );
}
await copyFile(
  resolve(source, 'crops/solve-display.png'),
  resolve(appAssets, 'solve-display.png'),
);
for (const name of guides) {
  await sharp(resolve(source, `crops/guide-${name}.png`))
    .webp({ lossless: true })
    .toFile(resolve(publicAssets, `img/guides/${name}.webp`));
}
for (const name of ['og.png', 'favicon.png', 'apple-touch-icon.png']) {
  await copyFile(resolve(source, name), resolve(publicAssets, name));
}
console.log(
  'Imported 10 app captures, 4 display images, and 3 branding assets.',
);
