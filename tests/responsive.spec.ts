import { test, expect, type Page } from '@playwright/test';

// Keep the actual artwork and native scheduling. Freeze painted canvas bitmaps
// and mask only the changing taskbar clock for visual comparison.
async function openVisualPage(page: Page, route: string) {
  await page.goto(route);
  await expect(route === '/' ? page.getByRole('button', { name: "Enter Bryanna's portfolio" }) : page.locator('.seamless-tab-panel.is-active')).toBeVisible();
  // Canvas has no HTML load event: don't accept blank backgrounds as baselines.
  await expect.poll(() => page.locator('canvas').evaluateAll(canvases => canvases.every(canvas => {
    const el = canvas as HTMLCanvasElement;
    return (el.getContext('2d')?.getImageData(0, 0, 1, 1).data[3] ?? 0) > 0;
  })), { timeout: 15000 }).toBe(true);
  await page.evaluate(async () => {
    await document.fonts.ready;
    // Freeze each fully painted canvas as an identical bitmap. This preserves
    // the artwork while avoiding timer/RAF changes that can blank canvas hooks.
    document.querySelectorAll('canvas').forEach(canvas => {
      const image = document.createElement('img');
      for (const attribute of canvas.attributes) image.setAttribute(attribute.name, attribute.value);
      image.src = canvas.toDataURL();
      canvas.replaceWith(image);
    });
    // Stabilize the active gallery's masonry. Journey tests keep lazy loading.
    const images = Array.from(document.images).filter(image => image.getClientRects().length > 0);
    images.forEach(image => { image.loading = 'eager'; });
    // A slideshow may change src during decode; verify current sources below.
    await Promise.all(images.map(image => image.decode().catch(() => undefined)));
  });
  await expect.poll(() => page.locator('img').evaluateAll(images => images.filter(image => image.getClientRects().length > 0).every(image => {
    const el = image as HTMLImageElement;
    return el.complete && el.naturalWidth > 0;
  })), { timeout: 15000 }).toBe(true);
}
const screenshotOptions = { animations: 'disabled' as const, fullPage: false, maxDiffPixelRatio: 0.005, timeout: 15000 };

for (const viewport of [
  { name: 'phone', width: 390, height: 844 },
  { name: 'mobile-boundary', width: 768, height: 1024 },
  { name: 'tablet', width: 834, height: 1194 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  for (const route of ['/', '/about', '/photos', '/ceramics', '/contact']) {
    test(`visual ${viewport.name} ${route}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await openVisualPage(page, route);
      await expect(page).toHaveScreenshot(`${viewport.name}-${route === '/' ? 'entry' : route.slice(1)}.png`, { ...screenshotOptions, mask: [page.locator('.win95-taskbar-bar').getByText(/^\d{2}:\d{2}$/)], maskColor: '#dadde2' });
    });
  }
}

test('taskbar stays pinned on the portfolio desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/about');
  const start = page.getByRole('button', { name: 'Start', exact: true });
  await expect(start).toBeVisible();
  const box = await start.boundingBox();
  expect(box!.y + box!.height).toBeGreaterThan(850);
});

for (const viewport of [{ name: 'phone', width: 390, height: 844 }, { name: 'desktop', width: 1440, height: 900 }]) {
  test(`visual ${viewport.name} gallery wall`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await openVisualPage(page, '/photos');
    await page.locator('.seamless-tab-panel.is-active').getByRole('button', { name: /View photo:/ }).first().scrollIntoViewIfNeeded();
    await expect(page).toHaveScreenshot(`${viewport.name}-gallery-wall.png`, { ...screenshotOptions, mask: [page.locator('.win95-taskbar-bar').getByText(/^\d{2}:\d{2}$/)], maskColor: '#dadde2' });
  });
  test(`visual ${viewport.name} lightbox`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await openVisualPage(page, '/photos');
    await page.locator('.seamless-tab-panel.is-active').getByRole('button', { name: /View photo:/ }).first().click();
    const overlay = page.locator('.lightbox-wrapper');
    await expect(overlay).toBeVisible();
    await expect(overlay.locator('img')).toHaveCSS('opacity', '1');
    await expect(overlay).toHaveScreenshot(`${viewport.name}-lightbox.png`, { ...screenshotOptions, mask: [page.locator('.win95-taskbar-bar').getByText(/^\d{2}:\d{2}$/)], maskColor: '#dadde2' });
  });
  test(`visual ${viewport.name} contact submit area`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await openVisualPage(page, '/contact');
    await page.locator('.seamless-tab-panel.is-active').getByRole('button', { name: 'Send', exact: true }).scrollIntoViewIfNeeded();
    await expect(page).toHaveScreenshot(`${viewport.name}-contact-submit.png`, { ...screenshotOptions, mask: [page.locator('.win95-taskbar-bar').getByText(/^\d{2}:\d{2}$/)], maskColor: '#dadde2' });
  });
}
