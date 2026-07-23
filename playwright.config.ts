import { defineConfig } from '@playwright/test';

/**
 * Minimal Playwright config for the responsive visual-regression matrix
 * (see responsive.spec.ts). Drop this at your project root (or merge with
 * an existing playwright.config.ts) alongside a `tests/` folder containing
 * the spec file.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,

  // Fail the CI build if someone leaves `.only` in a commit.
  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 1 : 0,

  // If your dev server needs a moment to boot in CI before Playwright
  // starts hitting it, this handles that automatically.
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  // Screenshot diffing is inherently a little flaky across OS/font
  // rendering differences — running snapshot tests in a fixed Docker
  // image (e.g. mcr.microsoft.com/playwright:v1.4x.0-jammy) in CI avoids
  // "works on my machine, fails in the pipeline" baseline mismatches.
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
});
