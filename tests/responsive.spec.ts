import { test, expect, devices } from '@playwright/test';

/**
 * Responsive/visual-regression matrix for the Win95 portfolio.
 *
 * WHY THIS EXISTS
 * ----------------
 * The desktop layout (Win95Portfolio.tsx) uses fixed pixel `dragOptions`
 * coordinates for every draggable window, uniformly scaled to fit the
 * viewport (useResponsiveScale.ts) rather than a normal fluid/reflowing
 * layout. That means "does it look right" cannot be guaranteed by CSS
 * alone across every possible screen size — it has to be *checked* at a
 * representative set of sizes. This file is that check, automated.
 *
 * WHAT IT CATCHES
 * ----------------
 * - Windows clipped off-screen at extreme aspect ratios
 * - Overlap with the fixed TaskBar
 * - The mobile/desktop breakpoint boundary (MOBILE_BREAKPOINT_PX = 768)
 *   rendering awkwardly on either side
 * - MIN_SCALE / MAX_SCALE clamping producing a too-cramped or
 *   too-sparse canvas on unusual window shapes
 *
 * HOW TO RUN LOCALLY
 * -------------------
 *   npx playwright test responsive.spec.ts
 *   npx playwright show-report          # view diffs
 *
 * First run: no baseline screenshots exist yet. Playwright will fail and
 * write "actual" images. Review them, then run with --update-snapshots
 * once you're happy, and commit the resulting snapshots — future runs
 * diff against those.
 *
 * CI
 * ----
 * Add a job that runs `npx playwright test` on every PR. Any *unexpected*
 * pixel diff fails the build, which is exactly the safety net you want
 * for a layout that can't be reasoned about with CSS alone.
 */

// ---- The viewport matrix -----------------------------------------------
// Keep this list as the single source of truth for "sizes we support."
// Add to it whenever analytics show a new common size, or a bug report
// comes in from a size not covered here.
const VIEWPORTS = [
  { name: 'mobile-iphone', width: 390, height: 844 },
  { name: 'mobile-android', width: 360, height: 800 },

  // Straddle the MOBILE_BREAKPOINT_PX boundary from useResponsiveMode.ts
  // on purpose — this is the highest-risk zone.
  { name: 'breakpoint-below', width: 767, height: 1024 },
  { name: 'breakpoint-at', width: 768, height: 1024 },
  { name: 'tablet-ipad-portrait', width: 834, height: 1194 },

  { name: 'tablet-landscape', width: 1024, height: 768 },
  { name: 'laptop-small', width: 1366, height: 768 },
  { name: 'desktop-standard', width: 1920, height: 1080 },

  // Stress MAX_SCALE / MIN_SCALE clamping from Win95Portfolio.tsx
  { name: 'ultrawide', width: 2560, height: 1080 },
  { name: 'tall-narrow', width: 900, height: 1600 },
];

// Change this to wherever the app is served in your CI/local setup.
const BASE_URL = process.env.PORTFOLIO_BASE_URL ?? 'http://localhost:5173';

for (const vp of VIEWPORTS) {
  test(`layout @ ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto(BASE_URL);

    // Let font loading / scale calculation settle before snapshotting.
    await page.waitForTimeout(300);

    // Full-page screenshot, diffed against a committed baseline.
    // maxDiffPixelRatio gives a little tolerance for anti-aliasing noise
    // without masking real layout shifts.
    await expect(page).toHaveScreenshot(`${vp.name}.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });
}

// ---- Structural sanity checks ------------------------------------------
// These don't need pixel comparison — they catch the specific failure
// modes unique to fixed-coordinate + scale-to-fit layouts.
test.describe('structural checks', () => {
  test('taskbar stays pinned at the bottom on desktop sizes', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(BASE_URL);

    const taskbar = page.locator('.TaskBar, [class*="TaskBar"]').first();
    await expect(taskbar).toBeVisible();

    const box = await taskbar.boundingBox();
    const viewportHeight = 1080;
    expect(box).not.toBeNull();
    if (box) {
      // TaskBar's bottom edge should be at (or very near) the viewport
      // bottom, regardless of scale factor applied to the canvas above it.
      expect(box.y + box.height).toBeGreaterThan(viewportHeight - 50);
    }
  });

  test('no horizontal overflow at the mobile breakpoint boundary', async ({ page }) => {
    for (const width of [767, 768, 769]) {
      await page.setViewportSize({ width, height: 1024 });
      await page.goto(BASE_URL);

      const hasHorizontalScroll = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(hasHorizontalScroll, `unexpected horizontal scroll at ${width}px`).toBe(false);
    }
  });

  test('mobile stack renders without the scaled desktop canvas', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE_URL);

    // The scaled desktop stage shouldn't be present at all in mobile mode —
    // if it is, useResponsiveMode's isMobile/isDesktop branch is wrong.
    const desktopStage = page.locator('[style*="transform: scale"]');
    await expect(desktopStage).toHaveCount(0);
  });
});

// ---- Optional: real device emulation (touch, UA, DPR) -------------------
// Useful in addition to raw viewport sizes above, since iPad Safari has
// quirks (visual viewport vs. layout viewport) that a plain resize won't
// catch. Uncomment and adjust as needed.
//
// test.use({ ...devices['iPad Pro 11'] });
// test('iPad Pro visual check', async ({ page }) => {
//   await page.goto(BASE_URL);
//   await expect(page).toHaveScreenshot('ipad-pro-11.png', { fullPage: true });
// });
