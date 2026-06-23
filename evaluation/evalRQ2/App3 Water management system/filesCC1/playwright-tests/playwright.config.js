// playwright.config.js
const { defineConfig, devices } = require('@playwright/test');

/**
 * Base URL of the application under test.
 * Override with: BASE_URL=http://localhost/watermanagement/ npx playwright test
 */
const BASE_URL = process.env.BASE_URL || 'http://localhost/watermanagement/';

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  // The test suite mutates shared application data (adds/edits/deletes
  // vendors, customers, products and orders), so scenarios within a file
  // must run in declaration order and not in parallel workers.
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    headless: process.env.HEADLESS !== 'false',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 10 * 1000,
    navigationTimeout: 15 * 1000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
