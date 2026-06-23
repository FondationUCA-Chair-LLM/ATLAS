/**
 * Load the most recent saved pipeline state from the output directory
 */

import path from "path";
import fs from "fs/promises";
import type { LangGraphState } from "../types";
import { deserializeState } from "./utils";

export async function loadLatestState(
  outputDir: string,
): Promise<LangGraphState | null> {
  try {
    const entries = await fs.readdir(outputDir, { withFileTypes: true });
    const runDirs = entries
      .filter((e) => e.isDirectory() && e.name.startsWith("run-"))
      .map((e) => ({
        name: e.name,
        path: path.join(outputDir, e.name),
      }));

    if (runDirs.length === 0) {
      console.log(`No run folders found in ${outputDir}`);
      return null;
    }

    // Sort by directory name descending (timestamps are ISO strings, so lexicographic sort works)
    runDirs.sort((a, b) => b.name.localeCompare(a.name));
    const latestDir = runDirs[0].path;

    const statePath = path.join(latestDir, "langgraph-full-state.json");
    const raw = await fs.readFile(statePath, "utf8");
    const parsed = JSON.parse(raw) as Record<string, unknown>;

    console.log(`Loaded state from ${statePath}`);
    return deserializeState(parsed);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`Failed to load latest state: ${msg}`);
    return null;
  }
}
