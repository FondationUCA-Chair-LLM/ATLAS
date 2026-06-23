import { defineConfig, devices } from "@playwright/test";
import type { PlaywrightTestConfig } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */

export default defineConfig({
  testDir: "out",
  timeout: 60000,

  // Restore the water-management DB before the suite starts.
  // Per-test reset is also handled by `test.beforeEach` injected into
  // generated spec files (see src/agents/code-generation-agent.ts).
  globalSetup: "./src/scripts/restore-water-db.global-setup.ts",

  // testMatch: ["basic_interaction.test.ts"],

  use: {
    headless: false,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    launchOptions: {
      // slowMo: 1000,
    },
  },

  retries: 0,
  reporter: [
    ["dot"],
    // [
    //   "json",
    //   {
    //     outputFile: "jsonReports/jsonReport.json",
    //   },
    // ],
    [
      "html",
      {
        open: "on-failure",
      },
    ],
  ],
});
