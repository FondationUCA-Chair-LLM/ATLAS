// playwright.config.js
const { defineConfig, devices } = require('@playwright/test');

export default defineConfig({
  use: {
    ignoreHTTPSErrors: true,
  },
});

module.exports = defineConfig({
  testDir: './',
  timeout: 30 * 1000,
  expect: { timeout: 5000 },
  fullyParallel: false, // checkout/login scenarios share the same demo account; run serially per file
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost/opencart',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
