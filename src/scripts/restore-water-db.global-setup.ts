/**
 * Playwright `globalSetup` — runs once before the entire test suite.
 *
 * Resets the `water-managment` MariaDB database to the baseline dump so the
 * first test starts on a clean state. Per-test reset is also handled by
 * `test.beforeEach` injected into generated spec files.
 */

import { restoreWaterDb } from "./restore-water-db";

export default async function globalSetup(): Promise<void> {
  console.log("[globalSetup] Restoring water-management database...");
  restoreWaterDb();
}
