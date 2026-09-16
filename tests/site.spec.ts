import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = [
  '/',
  '/download/',
  '/guides/',
  '/guides/fractions/',
  '/guides/exact-answers/',
  '/guides/solve-equations/',
  '/privacy/',
  '/support/',
  '/404.html',
];

test('examples preserve correct exact and decimal results across controls', async ({
  page,
}) => {
  await page.goto('/');
  const card = page.locator('[data-example-card]');
  await expect(
    card.getByRole('math', { name: 'One half', exact: true }),
  ).toBeVisible();
  await card.getByRole('button', { name: 'S⇔D: Show decimal result' }).click();
  await expect(
    card.locator('[data-example-panel="fractions"] .decimal-result'),
  ).toHaveText('0.5');
  await card.getByRole('button', { name: 'Roots', exact: true }).click();
  await expect(
    card.locator('[data-example-panel="roots"] .decimal-result'),
  ).toHaveText('2.828427125');
  await card.getByRole('button', { name: 'S⇔D: Show exact result' }).click();
  await expect(
    card.getByRole('math', {
      name: 'Two times the square root of two',
      exact: true,
    }),
  ).toBeVisible();
  await card.getByRole('button', { name: 'Trigonometry', exact: true }).click();
  await expect(
    card.getByRole('math', {
      name: 'Square root of six minus square root of two, all divided by four',
      exact: true,
    }),
  ).toBeVisible();
  await card.getByRole('button', { name: 'S⇔D: Show decimal result' }).click();
  await expect(
    card.locator('[data-example-panel="trigonometry"] .decimal-result'),
  ).toHaveText('0.2588190451');
  await card.getByRole('button', { name: 'Ink theme' }).click();
  await expect(card).toHaveAttribute('data-theme', 'ink');
  const darkAudit = await new AxeBuilder({ page })
    .include('[data-example-card]')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(darkAudit.violations).toEqual([]);
  await card.getByRole('button', { name: 'Paper theme' }).focus();
  await page.keyboard.press('Enter');
  await expect(card).toHaveAttribute('data-theme', 'paper');
});

test('mobile download bar follows the hero and leaves footer accessible', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const bar = page.locator('[data-mobile-download]');
  await expect(bar).toBeHidden();
  await page.locator('#features').scrollIntoViewIfNeeded();
  await expect(bar).toBeVisible();
  await expect(bar.getByRole('link')).toHaveAttribute(
    'href',
    /play.google.com/,
  );
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  const footerBottom = await page.locator('.trademark').boundingBox();
  const barBox = await bar.boundingBox();
  expect(footerBottom!.y + footerBottom!.height).toBeLessThan(barBox!.y);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect(bar).toBeHidden();
});

test('core content and downloads work without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Beautifully exact.',
  );
  await expect(page.locator('#hero-download a')).toHaveAttribute(
    'href',
    /play.google.com/,
  );
  await expect(
    page.getByRole('math', { name: 'One half', exact: true }),
  ).toBeVisible();
  const showcase = page.getByRole('region', { name: /For the problems/ });
  for (const name of [
    'Find your unknown.',
    'A little higher thinking.',
    'Less looking things up.',
  ]) {
    await expect(showcase.getByRole('heading', { name })).toBeVisible();
  }
  await expect(
    showcase.getByRole('math', {
      name: 'The integral of x squared from zero to three equals nine',
    }),
  ).toBeVisible();
  await expect(
    showcase.getByRole('link', { name: 'See how to solve equations' }),
  ).toHaveAttribute('href', '/guides/solve-equations/');
  const storeLink = showcase.getByRole('link', {
    name: /Download for Android/,
  });
  const referrer = new URL(
    (await storeLink.getAttribute('href'))!,
  ).searchParams.get('referrer');
  expect(new URLSearchParams(referrer!).get('utm_campaign')).toBe(
    'website_home_power',
  );
  await page.goto('/guides/fractions/');
  await expect(
    page.getByRole('heading', { name: 'Enter stacked fractions' }),
  ).toBeVisible();
  const tip = page.locator('.prose details').first();
  const tipText = tip.locator('p').first();
  await expect(tipText).toBeHidden();
  await tip.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(tipText).toBeVisible();
  await page.keyboard.press('Space');
  await expect(tipText).toBeHidden();
  await context.close();
});

test('guides keep examples and downloads before optional help', async ({
  page,
}, testInfo) => {
  for (const slug of ['fractions', 'exact-answers', 'solve-equations']) {
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/guides/${slug}/`);
      await page.evaluate(() => document.fonts.ready);
      const example = page.locator('.guide-example');
      await example.locator('img').evaluate(async (image: HTMLImageElement) => {
        image.loading = 'eager';
        await image.decode();
      });
      const tips = page.locator('.prose details');
      await expect(page.locator('.prose details[open]')).toHaveCount(0);
      const download = page.locator('.article-download a');
      const campaign = new URLSearchParams(
        new URL((await download.getAttribute('href'))!).searchParams.get(
          'referrer',
        )!,
      );
      expect(campaign.get('utm_campaign')).toBe(
        `website_guide_${slug.replaceAll('-', '_')}`,
      );
      const downloadBox = (await download.boundingBox())!;
      const exampleBox = (await example.boundingBox())!;
      const tipsBox = (await tips.first().boundingBox())!;
      expect(downloadBox.y + downloadBox.height).toBeLessThan(exampleBox.y);
      expect(exampleBox.y + exampleBox.height).toBeLessThan(tipsBox.y);
      await page.screenshot({
        path: testInfo.outputPath(`${slug}-${width}.png`),
        fullPage: true,
      });
      for (const summary of await tips.locator('summary').all()) {
        await summary.click();
      }
      await expect(page.locator('.prose details[open]')).toHaveCount(
        await tips.count(),
      );
      await page.screenshot({
        path: testInfo.outputPath(`${slug}-${width}-expanded.png`),
        fullPage: true,
      });
      if (width === 390) {
        await page.evaluate(() => {
          document.documentElement.style.fontSize = '200%';
        });
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        for (const artwork of await page.locator('.guide-art').all()) {
          expect(
            await artwork.evaluate(
              (element) => element.scrollHeight <= element.clientHeight,
            ),
          ).toBe(true);
        }
        await page.screenshot({
          path: testInfo.outputPath(`${slug}-enlarged.png`),
          fullPage: true,
        });
      }
    }
  }
});

test('reduced motion and keyboard focus remain usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.hero-copy')).toHaveCSS('animation-name', 'none');
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Skip to content' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
  const showcase = page.getByRole('region', { name: /For the problems/ });
  await showcase.scrollIntoViewIfNeeded();
  for (const card of await showcase.getByRole('article').all()) {
    await expect(card).toHaveCSS('animation-name', 'none');
    await expect(card).toHaveCSS('transform', 'none');
  }
  const guide = showcase.getByRole('link', {
    name: 'See how to solve equations',
  });
  await guide.focus();
  await expect(guide).toBeFocused();
  await expect(guide).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Tab');
  await expect(
    showcase.getByRole('link', { name: /Download for Android/ }),
  ).toBeFocused();
});

for (const route of routes) {
  test(`accessible, complete page: ${route}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(route);
    await expect(page.locator('h1')).toHaveCount(1);
    await page.locator('main').waitFor();
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(
      result.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          summary: n.failureSummary,
        })),
      })),
    ).toEqual([]);
    expect(errors).toEqual([]);
  });
}

for (const width of [360, 390, 768, 1024, 1440]) {
  test(`responsive layout at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      );
      expect(overflow, `horizontal overflow on ${route}`).toBe(false);
      if (route === '/') {
        await page.locator('img').evaluateAll(async (images) => {
          await Promise.all(
            images.map(async (image) => {
              const img = image as HTMLImageElement;
              img.loading = 'eager';
              await img.decode();
            }),
          );
        });
        await page.screenshot({
          path: testInfo.outputPath(`home-${width}.png`),
          fullPage: true,
          animations: 'disabled',
        });
        await page.screenshot({
          path: testInfo.outputPath(`hero-${width}.png`),
          animations: 'disabled',
        });
        await page
          .getByRole('region', { name: /For the problems/ })
          .screenshot({
            path: testInfo.outputPath(`showcase-${width}.png`),
            animations: 'disabled',
          });
      }
    }
  });
}

test('landscape and doubled text remain within the viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto('/');
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.setViewportSize({ width: 720, height: 900 });
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '200%';
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test('enlarged text does not overlap the following section', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '200%';
  });
  const card = await page.locator('.hero-note').boundingBox();
  const trust = await page.locator('.trust-strip').boundingBox();
  expect(card!.y + card!.height).toBeLessThan(trust!.y);
  const constants = await page.locator('.constants-art').boundingBox();
  const title = await page.locator('.constants-card h3').boundingBox();
  expect(constants!.y + constants!.height).toBeLessThanOrEqual(title!.y + 1);
  const formula = await page.locator('.power-math math').boundingBox();
  const formulaBox = await page.locator('.power-math').boundingBox();
  expect(formula!.width).toBeLessThanOrEqual(formulaBox!.width);
  const grid = await page.locator('.power-grid').boundingBox();
  const download = await page.locator('.power-download').boundingBox();
  expect(grid!.y + grid!.height).toBeLessThan(download!.y);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test('showcase adapts its hierarchy to desktop, tablet and mobile', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const showcase = page.getByRole('region', { name: /For the problems/ });
  for (const width of [390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const solve = (await showcase
      .getByRole('article', { name: 'Find your unknown.' })
      .boundingBox())!;
    const calculus = (await showcase
      .getByRole('article', { name: 'A little higher thinking.' })
      .boundingBox())!;
    const constants = (await showcase
      .getByRole('article', { name: 'Less looking things up.' })
      .boundingBox())!;
    if (width < 768) {
      expect(solve.y + solve.height).toBeLessThan(calculus.y);
      expect(calculus.y + calculus.height).toBeLessThan(constants.y);
      expect(solve.x).toBeCloseTo(constants.x, 0);
    } else if (width < 1024) {
      expect(solve.y + solve.height).toBeLessThan(calculus.y);
      expect(calculus.y).toBeCloseTo(constants.y, 0);
      expect(calculus.x + calculus.width).toBeLessThan(constants.x);
    } else {
      expect(solve.x + solve.width).toBeLessThan(calculus.x);
      expect(solve.y).toBeCloseTo(calculus.y, 0);
      expect(calculus.y + calculus.height).toBeLessThan(constants.y);
      expect(solve.y + solve.height).toBeCloseTo(
        constants.y + constants.height,
        0,
      );
    }
    const screen = (await showcase.locator('.solver-screen').boundingBox())!;
    const image = (await showcase.getByRole('img').boundingBox())!;
    expect(image.y).toBeCloseTo(screen.y, 0);
    expect(image.width).toBeCloseTo(screen.width, 0);
    expect(screen.height / image.width).toBeCloseTo(648 / 824, 2);
  }
});

test('showcase entrance finishes and does not replay when revisited', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const card = page.getByRole('article', { name: 'Find your unknown.' });
  await card.scrollIntoViewIfNeeded();
  await expect(card).toHaveClass(/is-revealed/);
  await expect
    .poll(() =>
      card.evaluate((element) =>
        element
          .getAnimations()
          .some((animation) => animation.playState === 'running'),
      ),
    )
    .toBe(false);
  await expect(card).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await card.scrollIntoViewIfNeeded();
  expect(
    await card.evaluate((element) =>
      element
        .getAnimations()
        .some((animation) => animation.playState === 'running'),
    ),
  ).toBe(false);
});
