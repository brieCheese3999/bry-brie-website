# UI and visual testing

Run commands from the website repository. The Playwright configuration reuses the running development server at http://localhost:5173 locally, and starts a fresh server in CI.

```sh
npm run test:ui
npm run test:visual
npm run test:report
```

`test:ui` runs the journey suite in Chromium and WebKit. Mobile cases use touch/mobile emulation at 390 × 844; desktop cases use 1440 × 900. Tablets through 1279px use the unscaled stacked layout; desktop starts at 1280px. Readability checks cover 769, 834, 1024, and 1279px. Phone checks verify the compact textarea and visible Send control, including long drafts. Additional contact geometry checks cover widths 360, 390, 767, 768, 769, 834, 1024, and 1440. Gallery interactions, browser Back, contact success/failure, fast submission, draft retention during resize, labels, modal focus, Start navigation, and unknown routes are checked. EmailJS is intercepted: automated tests do not send real messages. No CAPTCHA is solved; this local configuration has no active CAPTCHA challenge. Testing a configured CAPTCHA requires a dedicated test environment/test key.

The visual suite contains 26 screenshots: five routes at four widths (390, 768, 834, 1440), plus gallery wall, lightbox, and contact submission views on phone and desktop. It also checks the desktop taskbar position. Baselines live in `tests/responsive.spec.ts-snapshots` and should be committed. Reports, traces, and failure screenshots are generated in `playwright-report` and `test-results`, which are ignored by Git.

```sh
# Review each intended appearance change before accepting new baselines.
npm run test:visual:update

# Run just one browser during investigation.
npx playwright test tests/ui-journeys.spec.ts --project=chromium
```

Screenshot capture waits for painted canvases and fonts, freezes each canvas as an identical bitmap, loads the active gallery's images to settle masonry, and masks only the changing taskbar clock. Functional journey tests retain production canvas animation and lazy loading. Artificially fixing browser Date made the portfolio canvases blank, so visual tests use native time. Contact's fast-submit regression test fixes Date to verify that a submission within 100 ms still sends, and holds the mocked response to verify that confirmation waits for success.

Use the same Playwright/browser versions and OS for comparing screenshots. The initial baselines are Chromium/macOS; Linux CI requires its own reviewed baseline set. A screenshot match proves appearance has not changed; it does not prove usability or accessibility. These baselines document the current design, including the issues in the review. The journey suite deliberately fails on those product defects until they are fixed; do not delete assertions or mark them expected failures to make CI green.

This review exercised Chromium on macOS and 12 WebKit smoke checks. WebKit emulation is not a substitute for a physical iPhone/Safari test. Firefox, assistive technology, real email delivery, deployment configuration, and production performance under throttled networks remain outside the completed checks.

Gallery refresh checks hold image responses, record every tile’s position, then release/load all photos and verify that positions stay identical at phone, tablet, and desktop widths. Image dimensions come from the same Vite image transform as the displayed assets.

## Performance changes

The portfolio route JavaScript fell from approximately 3,736 kB / 528 kB gzip to 284 kB / 68 kB gzip in the October 6, 2026 production build. App icons use the package's supported individual exports. Vite rewrites @react95/core's icon imports the same way so its icon barrel does not retain hundreds of unused SVG components. Original SVG artwork remains unchanged.

Gallery tiles use 320/640/960px width candidates with srcset/sizes; the lightbox retains the 1600px capped image. Encoded dimensions reserve tile geometry. Gallery refresh/alignment tests cover delayed downloads.

@react95/core 9.8.3 has no clock override property. A narrowly scoped Vite transform replaces its internal TaskBar/Clock.mjs module with PortfolioClock in development and production. The custom clock updates at minute boundaries, refreshes when the tab becomes visible, and cleans up its timer. The clock regression checks immediate rendering and catches zero-delay intervals if a dependency update bypasses the replacement. Keep this integration check when updating React95.
