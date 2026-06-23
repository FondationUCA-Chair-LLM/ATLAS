import * as fs from "fs";

interface NavAction {
  stepIndex: number;
  label: string;
  selector: string | null;
  description: string | null;
  method: string | null;
}

interface NavSelectorEntry {
  name: string;
  url: string;
  actions: NavAction[];
}

type NavSelectors = Record<string, NavSelectorEntry>;

function extractTargetText(locatorExpr: string): string | null {
  const getByText = locatorExpr.match(/getByText\("([^"]+)"\)/);
  if (getByText) return getByText[1];

  const getByLabel = locatorExpr.match(/getByLabel\("([^"]+)"\)/);
  if (getByLabel) return getByLabel[1];

  const getByRole = locatorExpr.match(
    /getByRole\("[^"]+",\s*\{\s*name:\s*"([^"]+)"\s*\}\)/,
  );
  if (getByRole) return getByRole[1];

  const hasText = locatorExpr.match(/has-text\("([^"]+)"\)/);
  if (hasText) return hasText[1];

  return null;
}

function mapPlaywrightActionToNavMethod(action: string): string {
  if (action === "fill") return "type";
  return action;
}

function getAwaitPrefix(originalLines: string[]): string {
  const match = originalLines[0].match(/^(\s*await\s+)/);
  return match ? match[1] : "await ";
}

function processActionLine(
  line: string,
  availableNavActions: NavAction[],
  resultLines: string[],
  originalLines: string[],
): boolean {
  const actionMatch = line.match(
    /^(\s*await\s+)(page\..*?)\.(click|fill|hover)\((.*)\);?$/,
  );

  if (!actionMatch) {
    resultLines.push(...originalLines);
    return false;
  }

  const indent = getAwaitPrefix(originalLines);
  const locatorExpr = actionMatch[2];
  const playwrightAction = actionMatch[3];
  const actionArgs = actionMatch[4];

  const targetText = extractTargetText(locatorExpr);
  const navMethod = mapPlaywrightActionToNavMethod(playwrightAction);

  if (targetText && availableNavActions.length > 0) {
    const matchIndex = availableNavActions.findIndex(
      (a) =>
        a.method === navMethod &&
        a.label.includes(targetText),
    );

    if (matchIndex !== -1) {
      const matchedAction = availableNavActions[matchIndex];
      availableNavActions.splice(matchIndex, 1);
      resultLines.push(
        `${indent}page.locator('${matchedAction.selector}').${playwrightAction}(${actionArgs});`,
      );
      return true;
    }
  }

  resultLines.push(...originalLines);
  return false;
}

export function convertSpecToXPathBased(
  specContent: string,
  navSelectorsPath: string,
): string {
  const navSelectors: NavSelectors = JSON.parse(
    fs.readFileSync(navSelectorsPath, "utf-8"),
  );

  const lines = specContent.split("\n");
  const resultLines: string[] = [];

  let inTestBlock = false;
  let currentTestKey: string | null = null;
  let availableNavActions: NavAction[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Detect start of a test block
    if (trimmed.startsWith('test("') || trimmed.startsWith("test('")) {
      inTestBlock = true;
      currentTestKey = null;
      availableNavActions = [];
      resultLines.push(line);
      continue;
    }

    // Detect end of a test block
    if (inTestBlock && trimmed === "});") {
      inTestBlock = false;
      currentTestKey = null;
      availableNavActions = [];
      resultLines.push(line);
      continue;
    }

    if (!inTestBlock) {
      resultLines.push(line);
      continue;
    }

    // Extract test data key inside the test block
    if (!currentTestKey) {
      const dataKeyMatch = line.match(/const\s+data\s*=\s*testData\[(?:'|")(.+?)(?:'|")\]/);
      if (dataKeyMatch) {
        currentTestKey = dataKeyMatch[1];
        const entry = navSelectors[currentTestKey];
        if (entry) {
          availableNavActions = entry.actions.filter(
            (a) => a.selector !== null && a.method !== null,
          );
        }
      }
      resultLines.push(line);
      continue;
    }

    // Detect multi-line action chains: await page ... that don't end with );
    if (
      trimmed.startsWith("await page") &&
      !trimmed.endsWith(");")
    ) {
      const collectedLines: string[] = [line];
      let j = i + 1;
      while (j < lines.length) {
        collectedLines.push(lines[j]);
        if (lines[j].trim().endsWith(");")) {
          break;
        }
        j++;
      }

      const joinedLine = collectedLines.map((l) => l.trim()).join("");
      const replaced = processActionLine(
        joinedLine,
        availableNavActions,
        resultLines,
        collectedLines,
      );
      i = j;
      continue;
    }

    // Single-line action
    processActionLine(line, availableNavActions, resultLines, [line]);
  }

  return resultLines.join("\n");
}
