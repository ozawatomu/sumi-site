# Sumi website

A promotional website built with Astro, TypeScript and custom CSS. It generates static HTML for GitHub Pages at **https://sumicalculator.com**. Android is available; iPhone is coming soon. No visitor analytics, cookies, backend or accounts.

## Local development

Use Node 24 LTS and npm. Dependencies are pinned by `package-lock.json`.

```sh
npm ci
npm run dev
```

Open the local URL printed by Astro. Astro 7 can keep its development server running in the background; use `npx astro dev status`, `npx astro dev logs` and `npx astro dev stop` to manage it.

```sh
npm run check
npm run build
npm run test:links
npm run preview
```

The build writes to `dist/`; do not commit it. The preview serves the production build. Root HTML/CSS from the old website has been replaced by Astro source.

## Browser checks

```sh
npx playwright install chromium
npm test
```

Alternatively, use an installed Google Chrome with `PLAYWRIGHT_CHANNEL=chrome npm test`. Build first. The suite serves `dist/` on port 4178 and checks all nine pages, accessibility, demo controls, keyboard use, reduced motion, JavaScript-disabled content, mobile download behaviour and responsive layouts. Screenshots and failure traces go to `test-results/`; `npx playwright show-report` opens the report.

For a mobile performance check, serve the production build and run:

```sh
npx lighthouse http://127.0.0.1:4178/ --only-categories=performance,accessibility,best-practices,seo --output=html --output-path=/tmp/sumi-lighthouse.html --chrome-flags="--headless"
```

Lab targets: performance ≥95, accessibility/SEO 100, LCP ≤2.5 seconds and CLS ≤0.1. Check field performance after release; local results do not predict rankings or establish real-user performance.

Validated on 10 September 2026 with local Chrome: 19 browser tests passed; type checking reported zero errors, warnings or hints; all nine generated pages passed link/metadata checks. Mobile Lighthouse scored 99 performance and 100 accessibility, best practices and SEO, with LCP 2.1 seconds, CLS 0 and total blocking time 0 ms. Visual review covered desktop, tablet, mobile, landscape and enlarged text. Production hosting and real-device QR checks remain release checks.

## Content and product data

- Shared product information, platform availability and store campaign links live in `src/data/site.ts`.
- Guide Markdown lives in `src/content/guides/` with validated frontmatter. Use English (UK), visible keypad labels and verified key sequences. Keep the main example short and secondary help in native `<details>`. New guides need card artwork and a matching `public/img/guides/<slug>.webp` image, also used by Article metadata.
- The homepage demo uses predetermined, engine-verified fixtures; it does not evaluate arbitrary input. Keep readable default content in generated HTML.
- App screenshots are authentic captures. Guide images render the app's display at 412×200 logical pixels and 3× resolution, using the gallery approach with a temporary Flutter harness. They show `1/3 + 1/6 = 1/2`, `√8 = 2√2`, and `2 × X + 3 = 11` with `X = 4`. Shared homepage images and app source are unchanged.
- Self-hosted Inter and Noto Sans Math WOFF2 files retain their OFL licences under `public/fonts/`. Inter keeps variable weights with optical size fixed at 14; Noto retains MATH/stretch variants. The existing social image is preserved.

Demo fixtures were checked with Sumi's Dart calculator: `1/3 + 1/6 = 1/2 = 0.5`, `√8 = 2√2 ≈ 2.828427125`, and `sin(15°) = (√6−√2)/4 ≈ 0.2588190451` in degree mode. The simplified guide instructions were checked with actual keypad taps in four temporary Flutter widget tests, covering fraction entry, exact/decimal toggles, mixed numbers, visible SHIFT/ALPHA labels and the linear SOLVE example, including retry and exit.

## First release: GitHub Pages migration

The previous site was served directly from the root of `main`. **Do not push the source replacement while Pages still publishes from that directory.** The new site requires a build.

1. Review the unstaged changes and run the checks above. Record the last working static-site commit for rollback.
2. In repository Settings → Pages, verify the current configuration and change **Source** to **GitHub Actions**. Preserve `sumicalculator.com` and HTTPS settings. No DNS change is needed.
3. Commit and push the reviewed implementation. The workflow validates, builds and runs browser checks before uploading `dist/` and deploying it through the `github-pages` environment. Pull requests validate without publishing.
4. Verify the homepage, download, guides, support and privacy URLs on the live domain. Check a nonexistent URL returns the custom page with an actual 404 response. Confirm images, fonts, HTTPS and store links work.
5. Verify the QR code opens `https://sumicalculator.com/download/` on a physical Android phone.

Every push to `main` starts the **Validate and deploy Sumi** workflow, including documentation-only changes.

Implementation does not change Pages settings, commit, push or deploy. The source-switch and first push are coordinated release actions. [Astro deployment reference](https://docs.astro.build/en/guides/deploy/github/).

For rollback, redeploy a previous successful Pages artifact. If the first Astro release fails after publication, export the previous static-site commit to a clean temporary directory and deploy those files as a Pages artifact, or restore branch publishing together with the previous static revision. Keep the domain and DNS unchanged. Do not use a destructive Git reset on the working checkout.

## Search and store reporting

Verify ownership in Google Search Console using its Domain-property DNS verification flow, then submit `https://sumicalculator.com/sitemap-index.xml`. The old `/sitemap.xml` URL remains a compatible sitemap index. Check indexing and canonical selection for the homepage and each guide after publication.

Google Play links encode `utm_source=sumicalculator.com`, `utm_medium=website`, and stable page campaigns such as `website_home`, `website_download` and `website_guide_fractions` in the `referrer` parameter. QR codes use the download page, so their outgoing Play link uses the download campaign. No personal identifier is included.

Record a baseline around launch, then compare equivalent 28-day periods:

- Search Console: impressions, clicks, CTR and queries by landing page.
- Play Console: store visitors and install-button clicks by UTM source/campaign where reported.
- Completed acquisitions: use acquisition/statistics reports separately; an install-button click is not a confirmed installation.

Low-volume campaigns and web-to-device journeys may have incomplete attribution. There is no website pageview or CTA-click collection, so do not report a visitor-to-install conversion rate from these sources. Use the data to improve guide usefulness, homepage wording and store presentation without claiming causation from small changes. [Play Console reporting reference](https://support.google.com/googleplay/android-developer/answer/9859173).

## Activating iPhone downloads later

Verify the real App Store listing, extend the typed platform configuration with its URL, and update visible CTAs, availability text, metadata and tests together. Do not add an empty or disabled store link. Website analytics, localisation and a full browser calculator require separate changes.
