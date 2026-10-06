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
        await page.locator('.portfolio-tab-modal > ul').getByText(name, { exact: true }).click();
        await expect(page).toHaveURL(new RegExp(`/${route}$`));
        if (route === 'contact') await expect(formFields(page).email).toBeVisible();
        else await expect(activePanel(page).getByText(content, { exact: true })).toBeVisible();
      }
      await page.goBack();
      await expect(page).toHaveURL(/\/ceramics$/);
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
      await page.keyboard.press('Escape');
      await expect(tile).toBeFocused();
    });

    test('contact succeeds only after a mocked successful request', async ({ page }) => {
      let requests = 0;
      await page.route(/api\.emailjs\.com/, async route => {
        requests++;
        expect(route.request().postDataJSON().template_params).toMatchObject({ from_email: 'visitor@example.com', message: 'Test message' });
        await route.fulfill({ status: 200, body: 'OK' });
      });
      await page.goto('/contact');
      const fields = formFields(page);
      await fields.email.fill('visitor@example.com');
      await fields.message.fill('Test message');
      await page.waitForTimeout(3500);
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
      await page.waitForTimeout(3500);
      await fields.send.click();
      await expect(activePanel(page).getByRole('button', { name: 'Failed' })).toBeVisible();
      await expect(page.getByTestId('mail-sent-modal')).toHaveCount(0);
      await expect(fields.message).toHaveValue('Keep this message');
      await page.waitForTimeout(3100);
      await expect(fields.send).toBeEnabled();
    });

    test('fast human submission must not claim success without sending', async ({ page }) => {
      await page.clock.setFixedTime(new Date('2026-10-06T16:00:00Z'));
      await page.route(/api\.emailjs\.com/, route => route.fulfill({ status: 200, body: 'OK' }));
      await page.goto('/contact');
      await page.clock.setFixedTime(new Date('2026-10-06T16:00:00.100Z'));
      const fields = formFields(page);
      await fields.email.fill('visitor@example.com');
      await fields.message.fill('A quick autofilled message');
      const requests: string[] = [];
      page.on('request', r => { if (r.url().includes('api.emailjs.com')) requests.push(r.url()); });
      await fields.send.click();
      if (requests.length === 0) await expect(page.getByTestId('mail-sent-modal')).toHaveCount(0);
    });
  });
}

test('contact draft survives resizing from desktop to mobile', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/contact');
  await formFields(page).email.fill('visitor@example.com');
  await formFields(page).message.fill('My unsent draft');
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(formFields(page).email).toHaveValue('visitor@example.com');
  await expect(formFields(page).message).toHaveValue('My unsent draft');
});

test('unknown URL provides a recovery link', async ({ page }) => {
  await page.goto('/missing-page');
  await expect(page.getByRole('link', { name: /home|portfolio|back|about/i })).toBeVisible();
});

for (const width of [360, 390, 767, 768, 769, 834, 1024, 1440]) {
  test(`visible contact inputs stay inside viewport at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/contact');
    await expect(formFields(page).email).toBeVisible();
    for (const field of [formFields(page).email, formFields(page).message]) {
      const box = await field.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    }
  });
}
