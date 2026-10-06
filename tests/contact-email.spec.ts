import { test, expect, type Request } from '@playwright/test';

/**
 * Contact form → EmailJS send verification.
 *
 * We never let a real email leave: every request to the EmailJS API is
 * intercepted and fulfilled with a canned 200, exactly as the SDK would see on
 * success. That lets us assert two things end-to-end without spamming the
 * inbox:
 *
 *   1. Clicking "Send" actually fires a POST to EmailJS carrying the values the
 *      user typed (from address, subject, message).
 *   2. Once the send resolves, the Win95 "Mail Sent" confirmation dialog
 *      appears in the UI.
 *
 */

const BASE_URL = process.env.PORTFOLIO_BASE_URL ?? 'http://localhost:5173';
const EMAILJS_ENDPOINT = /api\.emailjs\.com/;

const FROM = 'visitor@example.com';
const SUBJECT = 'Hello from the portfolio';
const MESSAGE = 'This is an automated test message. Please ignore.';

/** Route the contact panel and wait for its form to be interactive. */
async function openContactPanel(page: import('@playwright/test').Page) {
    // Desktop viewport so the full Wordpad-style panel (with data-testid hooks)
    // renders rather than the mobile stack.
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`${BASE_URL}/contact`, { waitUntil: 'load' });
    await expect(page.getByTestId('contact-from')).toBeVisible();
}

test.describe('contact form email sending', () => {
    test('sends the typed message to EmailJS and shows the confirmation dialog', async ({ page }) => {
        // Intercept EmailJS so no real email is sent; capture the request.
        let sendRequest: Request | null = null;
        await page.route(EMAILJS_ENDPOINT, async (route) => {
            sendRequest = route.request();
            await route.fulfill({ status: 200, contentType: 'text/plain', body: 'OK' });
        });

        await openContactPanel(page);

        await page.getByTestId('contact-from').fill(FROM);
        await page.getByTestId('contact-subject').fill(SUBJECT);
        await page.getByTestId('contact-message').fill(MESSAGE);


        const [request] = await Promise.all([
            page.waitForRequest(EMAILJS_ENDPOINT),
            page.getByTestId('contact-send').click(),
        ]);

        // 1) The request carries what the user typed.
        expect(request.method()).toBe('POST');
        const payload = request.postDataJSON() as {
            service_id?: string;
            template_id?: string;
            user_id?: string;
            template_params?: Record<string, unknown>;
        };
        expect(payload.service_id, 'service_id should be configured').toBeTruthy();
        expect(payload.template_id, 'template_id should be configured').toBeTruthy();
        expect(payload.user_id, 'public key should be configured').toBeTruthy();
        expect(payload.template_params).toMatchObject({
            from_email: FROM,
            subject: SUBJECT,
            message: MESSAGE,
        });

        // 2) The Win95 "Mail Sent" confirmation dialog appears.
        const modal = page.getByTestId('mail-sent-modal');
        await expect(modal).toBeVisible();
        await expect(modal.getByText(/sent successfully/i)).toBeVisible();

        // The captured route request is the same one we asserted on.
        expect(sendRequest).not.toBeNull();

        // And it can be dismissed with OK.
        await modal.getByRole('button', { name: 'OK' }).click();
        await expect(modal).toHaveCount(0);
    });

    test('does not send (or confirm) an empty form', async ({ page }) => {
        let hitNetwork = false;
        await page.route(EMAILJS_ENDPOINT, async (route) => {
            hitNetwork = true;
            await route.fulfill({ status: 200, contentType: 'text/plain', body: 'OK' });
        });

        await openContactPanel(page);

        // Empty From + message → the form alerts and bails; auto-dismiss it.
        page.once('dialog', (d) => void d.accept());
        await page.getByTestId('contact-send').click();
        await page.waitForTimeout(500);

        expect(hitNetwork, 'empty form must not call EmailJS').toBe(false);
        await expect(page.getByTestId('mail-sent-modal')).toHaveCount(0);
    });

    test('does not send or confirm a honeypot submission', async ({ page }) => {
        let hitNetwork = false;
        await page.route(EMAILJS_ENDPOINT, async (route) => {
            hitNetwork = true;
            await route.fulfill({ status: 200, contentType: 'text/plain', body: 'OK' });
        });

        await openContactPanel(page);

        // The hidden spam field must never produce a success confirmation.
        await page.getByTestId('contact-from').fill(FROM);
        await page.getByTestId('contact-message').fill(MESSAGE);
        await page.locator('.seamless-tab-panel.is-active input[name="company_website"]').fill('spam', { force: true });
        await page.getByTestId('contact-send').click();
        await expect(page.getByTestId('contact-send')).toHaveText('Failed');
        expect(hitNetwork, 'honeypot submission must not call EmailJS').toBe(false);
        await expect(page.getByTestId('mail-sent-modal')).toHaveCount(0);
    });
});
