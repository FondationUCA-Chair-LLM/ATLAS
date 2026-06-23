// playwright.config.js
// Configuration for the Water Management acceptance test suite

const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './',
  /* Maximum time one test can run */
  timeout: 30_000,
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallel tests – the app has shared state (DB rows) */
  workers: 1,
  /* Reporter */
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ],
  use: {
    /* Base URL for all page.goto() calls */
    baseURL: 'http://localhost/watermanagement',
    /* Capture screenshot on failure */
    screenshot: 'only-on-failure',
    /* Record traces on first retry */
    trace: 'on-first-retry',
    /* Keep the browser viewport consistent */
    viewport: { width: 1280, height: 800 },
    /* Increase default navigation timeout */
    navigationTimeout: 15_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});
