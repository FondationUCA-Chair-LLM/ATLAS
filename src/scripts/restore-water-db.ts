#!/usr/bin/env tsx
/**
 * Drop and recreate the `water-managment` MariaDB database from
 * data/water-management/water-managment.sql.
 *
 * Mirrors scripts/restore-water-db.bat and scripts/restore-water-db.mjs.
 * Exposed as a function so it can be reused by:
 *   - playwright.config.ts (globalSetup)
 *   - generated test files (test.beforeEach)
 *
 * Standalone usage:
 *   npx tsx src/scripts/restore-water-db.ts
 */

import { spawnSync } from "child_process";
import { readFileSync } from "fs";
import * as path from "path";

const MYSQL_BIN = "C:\\xampp\\mysql\\bin\\mysql.exe";
const SQL_FILE = path.join(
  __dirname,
  "..",
  "..",
  "data",
  "water-management",
  "water-managment.sql",
);
const DB = "water-managment";
const USER = "root";
const HOST = "127.0.0.1";

function mysql(args: string[], input?: string): void {
  const res = spawnSync(MYSQL_BIN, ["-h", HOST, "-u", USER, ...args], {
    input,
    stdio: ["pipe", "inherit", "inherit"],
    encoding: "utf8",
  });
  if (res.status !== 0) {
    throw new Error(`mysql ${args.join(" ")} failed with code ${res.status}`);
  }
}

export function restoreWaterDb(): void {
  // Drop + recreate cleanly so leftover state can't leak between runs.
  // Backticks are required: `-managment` looks like a CLI flag otherwise.
  mysql([
    "-e",
    `DROP DATABASE IF EXISTS \`${DB}\`; CREATE DATABASE \`${DB}\` CHARACTER SET utf8mb4;`,
  ]);

  // Pipe the dump into the fresh database.
  const dump = readFileSync(SQL_FILE, "utf8");
  mysql([DB], dump);

  console.log(
    `[restore-water-db] OK - database '${DB}' restored from ${SQL_FILE}`,
  );
}

// Allow `npx tsx src/scripts/restore-water-db.ts` for ad-hoc runs.
if (require.main === module) {
  try {
    restoreWaterDb();
  } catch (e) {
    console.error("[restore-water-db] FAILED:", e);
    process.exit(1);
  }
}
