// playwright.config.js
const { defineConfig, devices } = require('@playwright/test');
const { BASE_URL } = require('./utils/config');

export default defineConfig({
  use: {
    ignoreHTTPSErrors: true,
  },
});

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: { timeout: 5000 },
  fullyParallel: false, // several specs rely on sequential, stateful flows (checkout funnel)
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],

  // All scenarios are written against this base application URL.
  use: {
    baseURL: BASE_URL,
    actionTimeout: 10 * 1000,
    navigationTimeout: 15 * 1000,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    ignoreHTTPSErrors: true,
  },

  // Registers one fresh "toto" account, seeds an address book entry and a
  // first order for it, then stores its authenticated session so that
  // every spec needing a logged-in user can reuse it instantly.
  globalSetup: require.resolve('./global-setup.js'),

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
