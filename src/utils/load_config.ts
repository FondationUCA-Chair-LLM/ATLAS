/**
 * Helper to load config from a JSON config file
 */

import path from "path";
import { ConfigMemory } from "../types";

/**
 * Merge a `global` block into a per-app config. Per-app keys win on conflict.
 * The `global` block lives at the top of `config.json` and holds values that
 * are independent of any specific app (faker seed, locale, etc.).
 */
export function mergeGlobalConfig(
  appConfig: Record<string, unknown>,
  globalConfig: Record<string, unknown> | undefined,
): Record<string, unknown> {
  if (!globalConfig) return appConfig;
  return { ...globalConfig, ...appConfig };
}

function validateConfig(raw: Record<string, unknown>): ConfigMemory {
  // Derive inputSource from presence of inputPath or figma credentials
  let inputSource: "figma" | "manual" = "figma";
  if (raw.inputPath) {
    inputSource = "manual";
    console.log(`Using manual input from: ${raw.inputPath}`);
  } else if (raw.figmaToken && raw.figmaFileKey) {
    inputSource = "figma";
    console.log(`Using Figma input with file key: ${raw.figmaFileKey}`);
  } else {
    console.error(
      "Error: Either inputPath or (figmaToken + figmaFileKey) must be provided",
    );
    process.exit(1);
  }

  return {
    figmaToken: (raw.figmaToken as string) || "",
    figmaFileKey: raw.figmaFileKey as string | undefined,
    useCachedElements: (raw.useCachedElements as boolean) || false,
    useCachedFigmaResponse: (raw.useCachedFigmaResponse as boolean) || true,
    inputSource,
    inputPath: raw.inputPath as string | undefined,
    ollamaUrl: (raw.ollamaUrl as string) || "http://localhost:11434",
    modelId: (raw.modelId as string) || "qwen3:14b",
    visionModelId: (raw.visionModelId as string) || "qwen3-vl:8b",
    targetUrl: (raw.targetUrl as string) || "http://localhost:3000",
    outputDir: (raw.outputDir as string) || "./out",
    startNode: (raw.startNode as string) || "Start",
    enableConsistencyCheck: raw.enableConsistencyCheck as boolean,
    generateInvalidTests: (raw.generateInvalidTests as boolean) || false,
    fakerSeed: typeof raw.fakerSeed === "number" ? raw.fakerSeed : undefined,
    fakerLocale:
      typeof raw.fakerLocale === "string" ? raw.fakerLocale : undefined,
    debug: raw.debug as boolean,
  };
}

export function loadConfigFromFile(app?: string): ConfigMemory {
  console.log(`Loading configuration for ${app}...`);
  const configPath =
    process.env.CONFIG_PATH || path.resolve(process.cwd(), "config.json");
  console.log(`Loading configuration from ${configPath}...`);

  let raw: Record<string, unknown>;
  try {
    raw = require(configPath);
  } catch {
    console.error(`Error: Could not load config file at ${configPath}`);
    process.exit(1);
  }

  const appNames = Object.keys(raw);
  if (appNames.length === 0) {
    console.error(`Error: No apps found in ${configPath}`);
    process.exit(1);
  }

  // "global" is a reserved top-level key — it holds app-agnostic defaults
  // (fakerSeed, fakerLocale, …) that get merged into the chosen app's config.
  const GLOBAL_KEY = "global";
  const globalConfig =
    (raw[GLOBAL_KEY] as Record<string, unknown> | undefined) ?? undefined;

  const selected = app ? raw[app] : raw[appNames[0]];
  if (!selected) {
    console.error(`Error: App "${app}" not found in ${configPath}`);
    console.error(`Available apps: ${appNames.join(", ")}`);
    process.exit(1);
  }

  const merged = mergeGlobalConfig(
    selected as Record<string, unknown>,
    globalConfig,
  );

  return validateConfig(merged);
}
