import { test, expect, type Page } from '@playwright/test';

const activePanel = (page: Page) => page.locator('.seamless-tab-panel.is-active');
const formFields = (page: Page) => ({
  email: activePanel(page).locator('input[type="email"]'),
  message: activePanel(page).locator('textarea'),
  send: activePanel(page).getByRole('button', { name: /^Send$/ }),
});

for (const viewport of [{ name: 'mobile', width: 390, height: 844 }, { name: 'desktop', width: 1440, height: 900 }]) {
  test.describe(viewport.name, () => {
    test.use({ viewport, isMobile: viewport.name === 'mobile', hasTouch: viewport.name === 'mobile' });
    test('entry → about → photos → clay → contact, then browser Back', async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.goto('/');
      await page.getByRole('button', { name: "Enter Bryanna's portfolio" }).click();
      await expect(page).toHaveURL(/\/about$/);
      await expect(activePanel(page).getByText('SKILLS', { exact: true })).toBeVisible();
      for (const [name, route, content] of [
        ['Photos', 'photos', 'photo album'], ['Clay', 'ceramics', 'clay works'], ['Contact', 'contact', 'To:'],
      ]) {
        await page.getByRole('navigation', { name: 'Portfolio' }).getByRole('link', { name, exact: true }).click();
        await expect(page).toHaveURL(new RegExp(`/${route}$`));
        if (route === 'contact') await expect(formFields(page).email).toBeVisible();
        else await expect(activePanel(page).getByText(content, { exact: true })).toBeVisible();
      }
      for (const route of ['ceramics', 'photos', 'about']) {
        await page.goBack();
        await expect(page).toHaveURL(new RegExp(`/${route}$`));
      }
      for (const route of ['photos', 'ceramics', 'contact']) {
        await page.goForward();
        await expect(page).toHaveURL(new RegExp(`/${route}$`));
      }
      expect(errors).toEqual([]);
    });

    test('Start menu includes a working Contact destination', async ({ page }) => {
      await page.goto('/about');
      await page.getByRole('button', { name: 'Start', exact: true }).click();
      const item = page.locator('.win95-taskbar-bar').getByRole('listitem').filter({ hasText: /^Contact$/ });
      await expect(item).toBeVisible();
      await item.click();
      await expect(page).toHaveURL(/\/contact$/);
    });

    test('contact fields have accessible labels', async ({ page }) => {
      await page.goto('/contact');
      await expect(activePanel(page).getByRole('textbox', { name: /from|email/i })).toBeVisible();
      await expect(activePanel(page).getByRole('textbox', { name: /subject/i })).toBeVisible();
      await expect(activePanel(page).getByRole('textbox', { name: /message/i })).toBeVisible();
    });

    test('clicking the photo inside the lightbox keeps it open', async ({ page }) => {
      await page.goto('/photos');
      await activePanel(page).getByRole('button', { name: /View photo:/ }).first().click();
      const overlay = page.locator('.lightbox-wrapper');
      await expect(overlay.locator('img')).toHaveCSS('opacity', '1');
      await overlay.locator('img').click();
      await expect(overlay).toBeVisible();
      await overlay.getByRole('button', { name: 'Close', exact: true }).click();
      await expect(overlay).toHaveCount(0);
      await activePanel(page).getByRole('button', { name: /View photo:/ }).first().click();
      await page.locator('[data-testid="lightbox-backdrop"]').click({ position: { x: 5, y: 5 } });
      await expect(overlay).toHaveCount(0);
    });

    test('gallery opens, navigates both ways, and closes using Escape', async ({ page }) => {
      await page.goto('/photos');
      const tile = activePanel(page).getByRole('button', { name: /View photo:/ }).first();
      await tile.click();
      const overlay = page.locator('.lightbox-wrapper');
      await expect(overlay).toBeVisible();
      const firstSrc = await overlay.locator('img').getAttribute('src');
      await overlay.getByRole('button', { name: /Next/ }).click();
      await expect(overlay.locator('img')).not.toHaveAttribute('src', firstSrc!);
      await page.keyboard.press('ArrowLeft');
      await expect(overlay.locator('img')).toHaveAttribute('src', firstSrc!);
      await expect(overlay.locator('img')).toHaveCSS('opacity', '1');
      await page.keyboard.press('Escape');
      await expect(overlay).toHaveCount(0);
    });

    test('lightbox keeps keyboard focus inside and restores it on close', async ({ page }) => {
      await page.goto('/photos');
      const tile = activePanel(page).getByRole('button', { name: /View photo:/ }).first();
      await tile.focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('.lightbox-wrapper')).toBeVisible();
      expect(await page.evaluate(() => !!document.activeElement?.closest('.lightbox-wrapper'))).toBe(true);
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
        expect(await page.evaluate(() => !!document.activeElement?.closest('.lightbox-wrapper'))).toBe(true);
      }
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Shift+Tab');
        expect(await page.evaluate(() => !!document.activeElement?.closest('.lightbox-wrapper'))).toBe(true);
      }
      await page.keyboard.press('Escape');
      await expect(tile).toBeFocused();
    });

    test('lightbox locks scrolling and hides the background until closed', async ({ page }) => {
      await page.goto('/photos');
      const tile = activePanel(page).getByRole('button', { name: /View photo:/ }).first();
      await tile.scrollIntoViewIfNeeded();
      const before = await page.evaluate(() => ({
        y: window.scrollY, body: document.body.style.cssText,
        overflow: document.documentElement.style.overflow,
      }));
      await tile.click();
      await expect(page.locator('#root')).toHaveAttribute('inert', '');
      await expect(page.locator('#root')).toHaveAttribute('aria-hidden', 'true');
      await expect(page.locator('body')).toHaveCSS('position', 'fixed');
      await expect(page.getByRole('navigation', { name: 'Portfolio' })).toHaveCount(0);
      await expect(page.locator('.lightbox-wrapper').getByRole('button', { name: 'Close', exact: true })).toBeVisible();
      const lockedY = await page.evaluate(() => window.scrollY);
      if (viewport.name === 'desktop') {
        await page.mouse.move(10, 10);
        await page.mouse.wheel(0, 600);
      } else {
        await page.evaluate(() => window.scrollBy(0, 600));
      }
      await page.keyboard.press('PageDown');
      expect(await page.evaluate(() => window.scrollY)).toBe(lockedY);
      await page.keyboard.press('Escape');
      await expect(page.locator('#root')).not.toHaveAttribute('inert');
      await expect(page.locator('#root')).not.toHaveAttribute('aria-hidden');
      await expect(page.getByRole('navigation', { name: 'Portfolio' })).toBeVisible();
      await expect(tile).toBeFocused();
      expect(await page.evaluate(() => document.body.style.cssText)).toBe(before.body);
      expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe(before.overflow);
      expect(await page.evaluate(() => window.scrollY)).toBe(before.y);
    });

    test('contact succeeds only after a mocked successful request', async ({ page }) => {
      let requests = 0;
      await page.route(/api\.emailjs\.com/, async route => {
        requests++;
        const payload = route.request().postDataJSON() as { template_params: Record<string, unknown> };
        expect(payload.template_params).toMatchObject({ from_email: 'visitor@example.com', message: 'Test message' });
        await route.fulfill({ status: 200, body: 'OK' });
      });
      await page.goto('/contact');
      const fields = formFields(page);
      await fields.email.fill('visitor@example.com');
      await fields.message.fill('Test message');
      await fields.send.click();
      await expect(page.getByTestId('mail-sent-modal')).toBeVisible();
      expect(requests).toBe(1);
      await page.getByTestId('mail-sent-modal').getByRole('button', { name: 'OK' }).click();
      await expect(page.getByTestId('mail-sent-modal')).toHaveCount(0);
    });

    test('failed contact request preserves the draft and allows retry', async ({ page }) => {
      await page.route(/api\.emailjs\.com/, route => route.fulfill({ status: 500, body: 'Test failure' }));
      await page.goto('/contact');
      const fields = formFields(page);
      await fields.email.fill('visitor@example.com');
      await fields.message.fill('Keep this message');
      await fields.send.click();
      await expect(activePanel(page).getByRole('button', { name: 'Failed' })).toBeVisible();
      await expect(page.getByTestId('mail-sent-modal')).toHaveCount(0);
      await expect(fields.message).toHaveValue('Keep this message');
      await page.waitForTimeout(3100);
      await expect(fields.send).toBeEnabled();
    });

    test('fast human submission must not claim success without sending', async ({ page }) => {
      await page.clock.setFixedTime(new Date('2026-10-06T16:00:00Z'));
      let releaseResponse!: () => void;
      const responseReady = new Promise<void>(resolve => { releaseResponse = resolve; });
      await page.route(/api\.emailjs\.com/, async route => {
        await responseReady;
        await route.fulfill({ status: 200, body: 'OK' });
      });
      await page.goto('/contact');
      await page.clock.setFixedTime(new Date('2026-10-06T16:00:00.100Z'));
      const fields = formFields(page);
      await fields.email.fill('visitor@example.com');
      await fields.message.fill('A quick autofilled message');
      try {
        const [request] = await Promise.all([
          page.waitForRequest(/api\.emailjs\.com/),
          fields.send.click(),
        ]);
        expect(request.method()).toBe('POST');
        await expect(activePanel(page).getByRole('button', { name: 'Sending...' })).toBeDisabled();
        await expect(page.getByTestId('mail-sent-modal')).toHaveCount(0);
      } finally {
        releaseResponse();
      }
      await expect(page.getByTestId('mail-sent-modal')).toBeVisible();
    });
  });
}

test('contact draft survives resizing from desktop to mobile', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/contact');
  await formFields(page).email.fill('visitor@example.com');
  await formFields(page).message.fill('My unsent draft');
  await activePanel(page).getByRole('textbox', { name: /subject/i }).fill('Draft subject');
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(formFields(page).email).toHaveValue('visitor@example.com');
  await expect(formFields(page).message).toHaveValue('My unsent draft');
  await expect(activePanel(page).getByRole('textbox', { name: /subject/i })).toHaveValue('Draft subject');
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(formFields(page).email).toHaveValue('visitor@example.com');
  await expect(formFields(page).message).toHaveValue('My unsent draft');
  await expect(activePanel(page).getByRole('textbox', { name: /subject/i })).toHaveValue('Draft subject');
});

test('unknown URL provides a recovery link', async ({ page }) => {
  await page.goto('/missing-page');
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  await page.reload();
  await page.getByRole('link', { name: 'Back to portfolio' }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(activePanel(page)).toBeVisible();
});

for (const width of [360, 390, 767, 768, 769, 834, 1024, 1440]) {
  test(`visible contact inputs stay inside viewport at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/contact');
    await expect(formFields(page).email).toBeVisible();
    for (const field of [formFields(page).email, formFields(page).message]) {
      await expect.poll(async () => {
        const box = await field.boundingBox();
        return !!box && box.x >= 0 && box.x + box.width <= width;
      }).toBe(true);
    }
  });
}

for (const width of [769, 834, 1024, 1279]) {
  test(`tablet text remains unscaled and readable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1024 });
    await page.goto('/about');
    await expect(page.locator('.win95-mobile-root')).toBeVisible();
    for (const selector of ['.win95-bio-text', '.win95-skill-tile-label']) {
      const text = activePanel(page).locator(selector).first();
      await expect(text).toBeVisible();
      expect(await text.evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(14);
      await expect.poll(() => text.evaluate(el => {
        let node: HTMLElement | null = el as HTMLElement;
        while (node) {
          const transform = getComputedStyle(node).transform;
          if (transform !== 'none') {
            const matrix = new DOMMatrixReadOnly(transform);
            if (matrix.a !== 1 || matrix.d !== 1) return false;
          }
          node = node.parentElement;
        }
        return true;
      })).toBe(true);
    }
  });
}

for (const viewport of [{ width: 390, height: 844 }, { width: 360, height: 640 }]) {
  test(`mobile message box keeps Send close at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/contact');
    const fields = formFields(page);
    const box = await fields.message.boundingBox();
    const send = await fields.send.boundingBox();
    expect(box!.height).toBeLessThanOrEqual(220);
    expect(send!.y - (box!.y + box!.height)).toBeLessThan(100);
    expect(send!.y + send!.height).toBeLessThan(viewport.height - 40);
    await expect(fields.message).toHaveCSS('font-size', '16px');
    await fields.message.fill('A long draft\n'.repeat(60));
    await expect(fields.message).toHaveValue('A long draft\n'.repeat(60));
  });
}

for (const width of [390, 834, 1440]) {
  test(`gallery positions remain stable while photos load after refresh at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/photos');
    let releaseImages!: () => void;
    const imagesReady = new Promise<void>(resolve => { releaseImages = resolve; });
    await page.route('**/*', async route => {
      if (route.request().resourceType() === 'image') await imagesReady;
      await route.continue();
    });
    await page.reload({ waitUntil: 'domcontentloaded' });
    const tiles = activePanel(page).getByRole('button', { name: /View photo:/ });
    await expect(tiles.first()).toBeVisible();
    await expect(activePanel(page).locator('.win95-gallery-wall')).toHaveCSS('column-count', width < 1280 ? '2' : '4');
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(document.getAnimations().map(animation => animation.finished.catch(() => undefined)));
    });
    const positions = () => tiles.evaluateAll(elements => elements.map(element => {
      const box = element.getBoundingClientRect();
      return [Math.round(box.x), Math.round(box.y), Math.round(box.width), Math.round(box.height)];
    }));
    const before = await positions();
    releaseImages();
    expect(before.every(box => box[3] > 0)).toBe(true);
    await tiles.locator('img').evaluateAll(async images => {
      images.forEach(image => { (image as HTMLImageElement).loading = 'eager'; });
      await Promise.all(images.map(image => (image as HTMLImageElement).decode()));
    });
    expect(await positions()).toEqual(before);
  });
}

for (const width of [390, 834, 1440]) {
  test(`gallery column tops align at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/photos');
    const wall = activePanel(page).locator('.win95-gallery-wall');
    await expect(wall).toHaveCSS('column-count', width < 1280 ? '2' : '4');
    await page.evaluate(async () => { await document.fonts.ready; });
    const tops = await wall.locator('button').evaluateAll(tiles => {
      const columns = new Map<number, number>();
      tiles.forEach(tile => {
        const box = tile.getBoundingClientRect();
        const x = Math.round(box.x);
        columns.set(x, Math.min(columns.get(x) ?? Infinity, box.y));
      });
      return [...columns.values()];
    });
    expect(tops).toHaveLength(width < 1280 ? 2 : 4);
    expect(Math.max(...tops) - Math.min(...tops)).toBeLessThanOrEqual(1);
  });
}

for (const width of [390, 1440]) {
  for (const destination of [
    { path: '/', module: '**/components/Home/EnterPage.tsx*' },
    { path: '/photos', module: '**/components/Home/HomePage.tsx*' },
  ]) {
    test(`route loading announces progress for ${destination.path} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      let releaseModule!: () => void;
      const moduleReady = new Promise<void>(resolve => { releaseModule = resolve; });
      await page.route(destination.module, async route => {
        await moduleReady;
        await route.continue();
      });
      try {
        await page.goto(destination.path, { waitUntil: 'domcontentloaded' });
        const status = page.getByRole('status');
        await expect(status).toContainText('Loading portfolio');
        await expect(status).toBeVisible();
        const box = await status.boundingBox();
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(width);
      } finally {
        releaseModule();
      }
      await expect(page.locator('.route-loading-page')).toHaveCount(0);
      await expect(destination.path === '/' ? page.getByRole('button', { name: "Enter Bryanna's portfolio" }) : activePanel(page)).toBeVisible();
    });
  }
}

test('taskbar clock renders immediately and avoids zero-delay intervals', async ({ page }) => {
  await page.addInitScript(() => {
    const delays: number[] = [];
    Object.assign(window, { intervalDelays: delays });
    const nativeInterval = window.setInterval.bind(window);
    window.setInterval = ((handler: TimerHandler, delay?: number, ...args: unknown[]) => {
      delays.push(delay ?? 0);
      return nativeInterval(handler, delay, ...args);
    }) as typeof window.setInterval;
  });
  await page.goto('/about');
  await expect(page.locator('.win95-taskbar-bar time')).toHaveText(/^\d{2}:\d{2}$/);
  expect(await page.evaluate(() => (window as unknown as { intervalDelays: number[] }).intervalDelays.every(delay => delay >= 1000))).toBe(true);
});

test('gallery selects smaller thumbnails and opens a larger lightbox image', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/photos');
  const tile = activePanel(page).getByRole('button', { name: /View photo:/ }).first();
  await tile.scrollIntoViewIfNeeded();
  const image = tile.locator('img');
  await image.evaluate(async el => { await (el as HTMLImageElement).decode(); });
  const thumbnail = await image.evaluate(el => ({ src: (el as HTMLImageElement).currentSrc, width: (el as HTMLImageElement).naturalWidth }));
  expect(thumbnail.width).toBeLessThanOrEqual(640);
  await tile.click();
  const fullImage = page.locator('.lightbox-wrapper img');
  await fullImage.evaluate(async el => { await (el as HTMLImageElement).decode(); });
  const full = await fullImage.evaluate(el => ({ src: (el as HTMLImageElement).currentSrc, width: (el as HTMLImageElement).naturalWidth }));
  expect(full.src).not.toBe(thumbnail.src);
  expect(full.width).toBeGreaterThan(thumbnail.width);
});

for (const width of [360, 390, 834, 1440]) {
  test(`contact decorative icons fill the strip at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/contact');
    const strip = activePanel(page).locator('.contact-icon-strip');
    await expect(strip).toBeVisible();
    await expect.poll(async () => {
      const dimensions = await strip.evaluate(el => ({ width: el.clientWidth - 8, count: el.children.length }));
      return dimensions.count === Math.max(1, Math.min(28, Math.floor((dimensions.width + 4) / 44)));
    }).toBe(true);
    await expect(strip.getByRole('button')).toHaveCount(0);
    await expect(strip).toHaveCSS('overflow-x', 'hidden');
    expect(await strip.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    const box = await strip.boundingBox();
    const last = await strip.locator('.contact-icon-tile').last().boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    expect(box!.x + box!.width - (last!.x + last!.width)).toBeLessThan(6);
    await strip.screenshot({ path: test.info().outputPath(`contact-icons-${width}.png`) });
  });
}

test('contact formatting icons fill the space beside the font pickers', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/contact');
  const row = activePanel(page).locator('.contact-format-row');
  await expect(row.locator('.contact-icon-tile')).toHaveCount(10);
  await expect(row.locator('svg')).toHaveCount(10);
  const box = await row.boundingBox();
  const last = await row.locator('.contact-icon-tile').last().boundingBox();
  expect(box!.x + box!.width - (last!.x + last!.width)).toBeLessThan(6);
  await row.screenshot({ path: test.info().outputPath('format-icons.png') });
});
