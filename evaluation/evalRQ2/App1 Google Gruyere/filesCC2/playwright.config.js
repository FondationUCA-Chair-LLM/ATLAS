// playwright.config.js
// Playwright configuration for the Gruyere acceptance test suite.
// Run all tests with: npx playwright test

import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: "gruyere.spec.js",

  // Give each test plenty of time – Gruyere is a live internet service.
  timeout: 30_000,

  // Retry once on CI to absorb transient network hiccups.
  retries: process.env.CI ? 1 : 0,

  // Run tests serially to avoid account-name collisions on the shared
  // Gruyere instance (username uniqueness is per-instance, not per-user).
  workers: 1,

  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],

  use: {
    // No baseURL – tests navigate to the full URL to capture the instance ID.
    headless: true,
    viewport: { width: 1280, height: 720 },
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    // Extend navigation timeout for the Start→Home redirect.
    navigationTimeout: 15_000,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
  ],
});
