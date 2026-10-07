import { test, expect } from '@playwright/test';

// Geometry checks complement the screenshot baselines in responsive.spec.ts.
// Allow one CSS pixel for fractional scaling and browser rounding.
for (const width of [390, 834, 1279, 1440]) {
  test(`gallery layout preserves the approved design at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/photos');
    const panel = page.locator('.seamless-tab-panel.is-active');
    const wall = panel.locator('.win95-gallery-wall');
    await expect(wall).toBeVisible();
    await expect(wall).toHaveCSS('column-count', width < 1280 ? '2' : '4');
    const preview = panel.locator('.neodrag');
    await expect(preview).toHaveCount(width < 1280 ? 0 : 1);
    await page.evaluate(() => document.fonts.ready);
    const geometry = await wall.evaluate(el => {
      const wall = el.getBoundingClientRect();
      const tiles = [...el.querySelectorAll('button')].map(tile => tile.getBoundingClientRect());
      const tops = new Map<number, number>();
      for (const tile of tiles) {
        const column = Math.round(tile.left);
        tops.set(column, Math.min(tops.get(column) ?? Infinity, tile.top));
      }
      return {
        overflow: document.documentElement.scrollWidth - innerWidth,
        contained: tiles.every(tile => tile.left >= wall.left - 1 && tile.right <= wall.right + 1),
        topDifference: Math.max(...tops.values()) - Math.min(...tops.values()),
      };
    });
    expect(geometry.overflow).toBeLessThanOrEqual(1);
    expect(geometry.contained).toBe(true);
    expect(geometry.topDifference).toBeLessThanOrEqual(1);
    if (width >= 1280) {
      // Preserve the original introduction and floating preview arrangement.
      const heading = panel.locator('fieldset').first();
      expect(await heading.evaluate(el => (el as HTMLElement).offsetWidth)).toBe(800);
      const headingBox = await heading.boundingBox();
      const previewBox = await preview.boundingBox();
      expect(previewBox!.x).toBeGreaterThan(headingBox!.x + headingBox!.width);
    }
  });

  for (const route of ['/about', '/photos', '/contact']) {
    test(`taskbar and page edges stay aligned on ${route} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route);
      const bar = page.locator('.win95-taskbar-bar');
      await expect(bar).toBeVisible();
      for (const bottom of [false, true]) {
        await page.evaluate(bottom => window.scrollTo(0, bottom ? document.documentElement.scrollHeight : 0), bottom);
        const box = await bar.boundingBox();
        expect(Math.abs(box!.x)).toBeLessThanOrEqual(1);
        expect(Math.abs(box!.width - width)).toBeLessThanOrEqual(1);
        expect(Math.abs(box!.y + box!.height - 900)).toBeLessThanOrEqual(1);
      }
      await expect(page.locator('html')).toHaveCSS('overscroll-behavior-y', 'none');
    });
  }
}
