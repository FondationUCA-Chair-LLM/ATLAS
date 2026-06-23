import type { NLTestCase } from "../types.js";
import { toFieldKey } from "./label-utils.js";

/**
 * Resolve <placeholder> tokens in a test case's actions using the provided data map.
 * Returns a new test case with resolved actions and the data attached.
 *
 * Because both generation and consumption keys are produced by getElementDataKey,
 * a single toFieldKey lookup is sufficient.
 */
export function resolvePlaceholdersInTestCase(
  testCase: NLTestCase,
  testData: Record<string, unknown> | undefined,
): NLTestCase {
  if (!testData) {
    return testCase;
  }

  const resolvedActions = testCase.actions.map((action) =>
    action.replace(/\<([^>]+)\>/g, (_match, key) => {
      const normalizedKey = toFieldKey(key);
      const value = testData[normalizedKey];

      if (value !== undefined) {
        return `'${String(value)}'`;
      }
      // No match found — leave placeholder unchanged
      return _match;
    }),
  );

  return {
    ...testCase,
    actions: resolvedActions,
    data: testData,
  };
}
