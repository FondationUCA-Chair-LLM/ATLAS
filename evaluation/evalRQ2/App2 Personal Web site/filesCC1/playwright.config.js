// playwright.config.js
// Configuration for the Sébastien Salva website acceptance tests

const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30_000,          // 30 s per test
  retries: 1,               // retry once on flaky network
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: 'https://perso.limos.fr/~sesalva/',
    headless: true,
    viewport: { width: 1280, height: 800 },
    ignoreHTTPSErrors: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
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
