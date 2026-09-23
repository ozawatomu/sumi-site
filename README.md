# Sumi website

A promotional website built with Astro, TypeScript and custom CSS. It generates static HTML for GitHub Pages at **https://sumicalculator.com**. Android is available; iPhone is coming soon. No visitor analytics, cookies, backend or accounts.

**Your scientific calculator. Always with you.** The site introduces Sumi to people who want familiar scientific-calculator tools on their phone, with readable maths and an interface they enjoy. Graphite is the default appearance: pale `#F1F2F4` backgrounds, white surfaces, charcoal `#202329` text and blue `#405C81` accents. Graphite Dark and Paper & Ink are appearance choices. Acquisition copy should set accurate expectations so installs lead to continued use, helpful reviews and optional support.

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

The build writes to `dist/`; do not commit it. The preview serves the production build. Production builds use checked-in imagery and require neither Flutter nor the sibling app repository.

## Browser checks

```sh
npx playwright install chromium
npm test
```

Alternatively, use an installed Google Chrome with `PLAYWRIGHT_CHANNEL=chrome npm test`. Build first. The suite serves `dist/` on port 4178 and checks all nine pages, accessibility, example controls, keyboard use, reduced motion, JavaScript-disabled content, mobile download behaviour, enlarged text and responsive layouts at 360, 390, 768, 1024 and 1440px. The build checker also verifies stable routes and campaign identifiers, image references, canonical URLs, structured data and visible guide revision dates. Screenshots and failure traces go to `test-results/`; `npx playwright show-report` opens the report.

For a mobile performance check, serve the production build and run:

```sh
npx lighthouse http://127.0.0.1:4178/ --only-categories=performance,accessibility,best-practices,seo --output=html --output-path=/tmp/sumi-lighthouse.html --chrome-flags="--headless"
```

Lab targets: performance ≥95, accessibility/SEO 100, LCP ≤2.5 seconds and CLS ≤0.1. Check field performance after release; local results do not predict rankings or establish real-user performance.

Inspect the generated page screenshots at their intended display size as well as full resolution. Check the phone captures, keypad labels, examples, image crops, expanded help and footer around the mobile download bar. Record the date and actual test/Lighthouse results with the release review; historical scores are not evidence for a new build. Production hosting and a physical Android QR scan remain release checks.

Refresh validation on 23 September 2026: Astro checked 25 files with no errors, warnings or hints; the production build and all nine pages' link/metadata checks passed; all 31 Playwright tests passed using local Google Chrome. The generated screenshots cover all nine routes at the five widths above, plus doubled text at 390 and 720px. Desktop and mobile visual review covered every page. Mobile Lighthouse scored 99 for performance and 100 for accessibility, best practices and SEO, with LCP 2.0 seconds, CLS 0 and total blocking time 0 ms.

## Content and product data

- Shared product information, platform availability and store campaign links live in `src/data/site.ts`.
- Guide Markdown lives in `src/content/guides/` with validated frontmatter. Preserve `publishedDate`; set optional `updatedDate` when content is revised. The latter appears visibly and in Article `dateModified`. Use English (UK), current keypad labels and verified key sequences. Keep the main example short and secondary help in native `<details>`.
- Keep the existing homepage, download, guide, support and privacy URLs, all three guide slugs, navigation anchors and store campaign identifiers stable. The 404 route remains excluded from indexing. Add no aggregate ratings or reviews without genuine supporting data.
- The homepage example card uses predetermined, engine-verified fixtures; it does not evaluate arbitrary input. Keep the default fraction example readable in generated HTML. The three examples are `1/3 + 1/6 = 1/2 = 0.5`, `√8 = 2√2 ≈ 2.828427125`, and `sin(15°) = (√6−√2)/4 ≈ 0.2588190451` in degree mode.
- Describe SOLVE as numerical and exact forms as available where supported. Do not imply symbolic algebra, worked solutions, graphing, complete hardware emulation, exam approval or updated scientific-reference values. Every calculator feature is free; optional tips support development and unlock nothing.
- Check instructions against the release build. Theme controls System/Light/Dark separately from Colour choices; reset preserves some appearance and support state. Keep support and privacy descriptions aligned with actual local storage and platform billing/review services.
- Self-hosted Inter and Noto Sans Math WOFF2 files retain their OFL licences under `public/fonts/`. Inter keeps variable weights with optical size fixed at 14; Noto retains MATH/stretch variants.

## Regenerate app imagery

The source captures come from real Flutter app widgets and verified calculator fixtures, rendered on Android at 412 × 915 logical pixels and 3× resolution. Reusable capture code lives in the sibling app repository's `tool/app_capture.dart`. The website generator covers the hero expression, exact/decimal answers, history, numerical solving, calculus and matching Graphite Light/Dark and Paper & Ink examples. Guide images render the actual display widgets separately at 412 × 200 logical pixels and 3× resolution; they are not recreated maths or crops from the full-phone screenshots.

From the `sumi` repository:

```sh
flutter test --tags tool tool/render_website_assets_test.dart
flutter analyze
```

Captures are written to ignored `build/website-assets/`. From `sumi-site`, import them with:

```sh
npm run assets:import -- ../sumi
```

The importer preflights image dimensions before copying full PNG captures and branding assets, and encodes guide crops as lossless WebP. Commit the resulting source assets; ordinary website builds never run the Flutter renderer. Astro serves responsive WebP versions of full-app captures. Keep `/img/guides/fractions.webp`, `/img/guides/exact-answers.webp` and `/img/guides/solve-equations.webp` stable, with HTML dimensions matching the updated files.

To verify that capture-tool changes preserve store artwork without overwriting the tracked store files, run from `sumi`:

```sh
flutter test --tags tool --dart-define=SUMI_STORE_ASSET_DIR=build/store-regression tool/render_store_assets_test.dart
```

Compare the generated files with their equivalents in `store/`. The default store-renderer command still writes to `store/`. Each fixture should assert its own expected result, preview, solution and residual as applicable. Never substitute a single expected solution across solver examples.

Inspect all captures and display crops at full size and in the website. Verify expressions, results, unclipped controls and matching appearance states. The favicon and touch icon derive from the current app icon; the 1200 × 630 social image includes Sumi's name, primary message and authentic app UI. Update screenshot alt text when the depicted calculation changes.

## Identity and provenance

Use Sumi's own branding, original copy and generic scientific-calculator terminology in public content. Keep third-party calculator brands and model names out of acquisition headlines, metadata and artwork. Preserve the app's development references and provenance records; see the [store identity and provenance record](../sumi/store/README.md#identity-and-provenance). These website changes do not constitute IP clearance, and no exhaustive legal or provenance review is part of this release.

## Release and hosting

This implementation leaves changes unstaged on the existing branches. It does not commit, push, deploy or change hosting settings. Coordinate publication with availability of the app version shown.

Verify the current Pages configuration before the first Astro publication. If Pages still publishes static files directly from the root of `main`, its source must be switched to GitHub Actions before pushing the source replacement; the Astro site requires a build.

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

Record the website release date, app version, locale/country filters and preceding 28-day baseline. Compare equivalent 28-day periods after publication:

- Search Console: impressions, clicks, CTR and queries by landing page.
- Play Console: store visitors and install-button clicks by UTM source/campaign where reported.
- Completed acquisitions: use acquisition/statistics reports separately; an install-button click is not a confirmed installation.
- Continued use: available retention or engagement metrics, with their cohort, time window and coverage.
- Reviews: new ratings, their distribution and recurring feedback themes.
- Support: completed tips and net proceeds after reported fees, taxes and refunds, recorded by currency.

Low-volume campaigns and web-to-device journeys may have incomplete attribution. There is no website pageview or CTA-click collection, so do not report a visitor-to-install conversion rate from these sources. Missing retention is not zero. Use search queries and landing-page performance to prioritise later guide work. Assess downloads alongside retention, review themes and net tips; avoid claiming causation from small changes. [Play Console reporting reference](https://support.google.com/googleplay/android-developer/answer/9859173).

## Activating iPhone downloads later

Verify the real App Store listing, extend the typed platform configuration with its URL, and update visible CTAs, availability text, metadata and tests together. Do not add an empty or disabled store link. Website analytics, localisation and a full browser calculator require separate changes.
