#!/usr/bin/env tsx
/**
 * Prepare experiment data for all four web applications
 *
 * Usage:
 *   tsx scripts/prepare-all-apps.ts
 *
 * This script will:
 * 1. Crawl each application (if running)
 * 2. Convert the dataset to navigation graph format
 * 3. Save results to data/experiments/<app>/
 */

import * as path from "path";
import { execSync } from "child_process";

interface AppConfig {
  name: string;
  url: string;
  outputDir: string;
  screenshotDir: string;
}

const apps: AppConfig[] = [
  {
    name: "gruyere",
    url: "https://google-gruyere.appspot.com/start",
    outputDir: "./data/experiments/gruyere",
    screenshotDir: "./data/experiments/gruyere/screenshots",
  },
  // {
  //   name: "opencart",
  //   url: "http://localhost/opencart",
  //   outputDir: "./data/experiments/opencart",
  //   screenshotDir: "./data/experiments/opencart/screenshots",
  // },
  // {
  //   name: "water",
  //   url: "http://localhost/watermanagement",
  //   outputDir: "./data/experiments/water",
  //   screenshotDir: "./data/experiments/water/screenshots",
  // },
  // {
  //   name: "perso",
  //   url: "https://perso.limos.fr/~sesalva/",
  //   outputDir: "./data/experiments/perso",
  //   screenshotDir: "./data/experiments/perso/screenshots",
  // },
];

function runCommand(cmd: string, description: string): boolean {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`📋 ${description}`);
  console.log(`   Command: ${cmd}`);
  console.log("=".repeat(60));

  try {
    execSync(cmd, { stdio: "inherit" });
    return true;
  } catch (error) {
    console.error(`❌ Failed: ${description}`);
    return false;
  }
}

async function prepareAppData(app: AppConfig): Promise<void> {
  console.log(`\n\n🚀 Processing: ${app.name.toUpperCase()}`);
  console.log(`   URL: ${app.url}`);
  console.log(`   Output: ${app.outputDir}`);

  // Step 1: Crawl the application
  const crawlCmd = `npm run exp -- -u "${app.url}" -o "${app.outputDir}" --screenshots "${app.screenshotDir}" --max-states 20 --max-depth 3`;
  const crawlSuccess = runCommand(crawlCmd, `Crawling ${app.name}`);

  if (!crawlSuccess) {
    console.log(`⚠️  Skipping ${app.name} - crawl failed`);
    return;
  }

  // Step 2: Convert to navigation graph
  const inputPath = path.join(app.outputDir, "experiment-dataset.json");
  const outputPath = path.join(app.outputDir, "navigation-graph.json");
  const convertCmd = `npm run exp:convert -- -i "${inputPath}" -o "${outputPath}" --app ${app.name}`;
  runCommand(convertCmd, `Converting ${app.name} dataset to navigation graph`);

  console.log(`\n✅ ${app.name.toUpperCase()} complete!`);
  console.log(`   Dataset: ${inputPath}`);
  console.log(`   Graph: ${outputPath}`);
}

async function main() {
  console.log("Prepare Experiment Data for All Web Applications");

  console.log("\nApplications to process:");
  apps.forEach((app, i) => {
    console.log(`  ${i + 1}. ${app.name} - ${app.url}`);
  });

  console.log("\n⚠️  Make sure each application is running before crawling!");
  console.log("\nStarting in 3 seconds... (Ctrl+C to cancel)\n");

  await new Promise((resolve) => setTimeout(resolve, 3000));

  for (const app of apps) {
    await prepareAppData(app);
  }

  console.log("\nAll applications processed!");
}

main().catch(console.error);
