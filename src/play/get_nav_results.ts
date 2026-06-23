import { NavResults } from "../extract_labels/types/NavResults";
import { run_search } from "../extract_labels/GenCodeForTests";
import testCases from "./nlTesting.json";

async function main() {
  const navResults: NavResults | null = await run_search(testCases[0]);

  console.dir(navResults, { depth: null });
}

main();
