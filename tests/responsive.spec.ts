import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: 'mobile-iphone', width: 390, height: 844 },
  { name: 'mobile-android', width: 360, height: 800 },
  { name: 'breakpoint-below', width: 767, height: 1024 },
  { name: 'breakpoint-at', width: 768, height: 1024 },
  { name: 'tablet-ipad-portrait', width: 834, height: 1194 },
  { name: 'tablet-landscape', width: 1024, height: 768 },
  { name: 'laptop-small', width: 1366, height: 768 },
  { name: 'desktop-standard', width: 1920, height: 1080 },
  { name: 'ultrawide', width: 2560, height: 1080 },
  { name: 'tall-narrow', width: 900, height: 1600 },
];

const BASE_URL = process.env.PORTFOLIO_BASE_URL ?? 'http://localhost:5173';

// The pixelated canvas background animates continuously and the react95
// Clock component runs setInterval with no delay, both causing constant
// repaints. Freeze them before screenshotting so Playwright's stability
// check can pass.
async function stabilizePage(page: import('@playwright/test').Page) {
  await page.evaluate(() => {
    // Hide animated canvas background
    document.querySelectorAll('canvas').forEach(c => {
      (c as HTMLCanvasElement).style.visibility = 'hidden';
    });
    // Stop all intervals (kills the Clock's rapid-fire setInterval)
    const maxId = window.setInterval(() => {}, 100000);
    for (let i = 1; i <= maxId; i++) window.clearInterval(i);
  });
}

for (const vp of VIEWPORTS) {
  test(`layout @ ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto(BASE_URL, { waitUntil: 'load' });
    await page.waitForTimeout(1000);
    await stabilizePage(page);

    await expect(page).toHaveScreenshot(`${vp.name}.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
      timeout: 15_000,
    });
  });
}

test.describe('structural checks', () => {
  test('taskbar stays pinned at the bottom on desktop sizes', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(BASE_URL, { waitUntil: 'load' });
    await page.waitForTimeout(1000);

    const startButton = page.getByText('Start').first();
    await expect(startButton).toBeVisible();

    const bottom = await page.evaluate(() => {
      const btn = [...document.querySelectorAll('button')]
        .find(b => b.textContent?.includes('Start'));
      if (!btn) return null;
      return btn.getBoundingClientRect().bottom;
    });

    expect(bottom).not.toBeNull();
    expect(bottom!).toBeGreaterThan(1080 - 50);
  });

  test('no horizontal overflow at the mobile breakpoint boundary', async ({ page }) => {
    for (const width of [767, 768, 769]) {
      await page.setViewportSize({ width, height: 1024 });
      await page.goto(BASE_URL, { waitUntil: 'load' });
      await page.waitForTimeout(1000);

      const hasHorizontalScroll = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(hasHorizontalScroll, `unexpected horizontal scroll at ${width}px`).toBe(false);
    }
  });

  test('mobile stack renders without the scaled desktop canvas', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE_URL, { waitUntil: 'load' });
    await page.waitForTimeout(1000);

    const desktopStage = page.locator('[style*="transform: scale"]');
    await expect(desktopStage).toHaveCount(0);
  });
});
