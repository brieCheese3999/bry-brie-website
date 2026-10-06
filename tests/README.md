# UI and visual testing

Run commands from the website repository. The Playwright configuration reuses the running development server at http://localhost:5173 locally, and starts a fresh server in CI.

```sh
npm run test:ui
npm run test:visual
npm run test:report
```

`test:ui` runs the journey suite in Chromium and WebKit. Mobile cases use touch/mobile emulation at 390 × 844; desktop cases use 1440 × 900. Additional contact geometry checks cover widths 360, 390, 767, 768, 769, 834, 1024, and 1440. Gallery interactions, browser Back, contact success/failure, fast submission, draft retention during resize, labels, modal focus, Start navigation, and unknown routes are checked. EmailJS is intercepted: automated tests do not send real messages. No CAPTCHA is solved; this local configuration has no active CAPTCHA challenge. Testing a configured CAPTCHA requires a dedicated test environment/test key.

The visual suite contains 26 screenshots: five routes at four widths (390, 768, 834, 1440), plus gallery wall, lightbox, and contact submission views on phone and desktop. It also checks the desktop taskbar position. Baselines live in `tests/responsive.spec.ts-snapshots` and should be committed. Reports, traces, and failure screenshots are generated in `playwright-report` and `test-results`, which are ignored by Git.

```sh
# Review each intended appearance change before accepting new baselines.
npm run test:visual:update

# Run just one browser during investigation.
npx playwright test tests/ui-journeys.spec.ts --project=chromium
```

Screenshot capture waits for painted canvases and fonts, freezes each canvas as an identical bitmap, loads the active gallery's images to settle masonry, and masks only the changing taskbar clock. Functional journey tests retain production canvas animation and lazy loading. Artificially fixing browser Date made the portfolio canvases blank, so visual tests use native time. Contact's fast-submit test fixes Date solely to make its three-second threshold reproducible.

Use the same Playwright/browser versions and OS for comparing screenshots. The initial baselines are Chromium/macOS; Linux CI requires its own reviewed baseline set. A screenshot match proves appearance has not changed; it does not prove usability or accessibility. These baselines document the current design, including the issues in the review. The journey suite deliberately fails on those product defects until they are fixed; do not delete assertions or mark them expected failures to make CI green.

This review exercised Chromium on macOS and 12 WebKit smoke checks. WebKit emulation is not a substitute for a physical iPhone/Safari test. Firefox, assistive technology, real email delivery, deployment configuration, and production performance under throttled networks remain outside the completed checks.
