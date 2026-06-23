import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

// project root = one level up from src
export const PROJECT_ROOT = path.join(__dirname, "..", "..");
export const OUT_DIR = path.join(PROJECT_ROOT, "out");

// helper to build full paths
async function outPath(name: string) {
  await mkdir(OUT_DIR, { recursive: true });
  return path.join(OUT_DIR, name);
}

export async function saveDataToJson(data: any, file_name: string = "data") {
  // The replacer function handles Map and Set serialization
  const jsonString = JSON.stringify(
    data,
    (key, value) => {
      if (value instanceof Map) {
        return Object.fromEntries(value); // Converts Map to { key: value }
      }
      if (value instanceof Set) {
        return Array.from(value); // Converts Set to [item1, item2]
      }
      return value;
    },
    2,
  );

  await writeFile(await outPath(file_name + ".json"), jsonString, "utf8");
}
