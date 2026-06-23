/**
 * Generates Playwright test code from natural language test cases.
 *
 * Architecture:
 *   - Instance layer (asNode, execute): LangGraph agent wiring
 *   - Static layer (generateTestSuite, emitXxx, helpers): pure code generation
 *
 * To add a new action type:
 *   1. Add a case in detectActionType()
 *   2. Add an emitXxx() method
 *   3. Wire it in generateTestBody() switch
 */

import type { RunnableConfig } from "@langchain/core/runnables";
import type {
  SimpleAgent,
  AgentContext,
  CodeGenerationInput,
  CodeGenerationOutput,
} from "./types";
import type {
  LangGraphState,
  NLActionStep,
  NLTestCase,
  UIElement,
} from "../types";
import { appendLog, addError, setCurrentStage } from "../types";
import {
  escapeForPlaywright,
  getElementDataKey,
  normalizeForCompare,
  toFieldKey,
  toPascalCaseNoSpaces,
  toSpacedLowerCase,
} from "../utils/label-utils";
import { parseNLAction } from "../utils/nl-grammar";
import { resolvePlaceholdersInTestCase } from "../utils/test-data-resolver";
import path from "path";

export class CodeGenerationAgent implements SimpleAgent<
  CodeGenerationInput,
  CodeGenerationOutput
> {
  readonly name = "CodeGenerationAgent";
  readonly description = "Generates Playwright test code from NL test cases";

  /* ================================================================ */
  /*  INSTANCE: LangGraph node wiring                                   */
  /* ================================================================ */

  asNode(): (
    state: LangGraphState,
    config: RunnableConfig,
  ) => Promise<Partial<LangGraphState>> {
    return async (state: LangGraphState, config: RunnableConfig) => {
      const agentName = this.name;
      const logger = console;

      logger.info(`[${agentName}] Starting execution`);
      const stageUpdate = setCurrentStage(state, agentName);

      try {
        const context = {
          executionId: config.runId || "default-run",
          logger: {
            debug: (msg: string) => logger.debug(`[${agentName}] ${msg}`),
            info: (msg: string) => logger.info(`[${agentName}] ${msg}`),
            warn: (msg: string) => logger.warn(`[${agentName}] ${msg}`),
            error: (msg: string) => logger.error(`[${agentName}] ${msg}`),
          },
          config: {},
        };

        const result = await this.execute(
          {
            validTestCases: state.validTestCases.map((tc) =>
              resolvePlaceholdersInTestCase(
                tc,
                state.testDataByTest?.get(tc.id),
              ),
            ),
            invalidTestCases: state.invalidTestCases || [],
            testDataByTest: state.testDataByTest,
            config: state.config,
          },
          context,
        );

        logger.info(
          `[${agentName}] Generated ${result.generatedTestFiles.size} test files`,
        );

        return {
          ...stageUpdate,
          generatedTestFiles: result.generatedTestFiles,
          completedStages: [...state.completedStages, agentName],
          currentStage: null,
          executionLogs: appendLog(
            state,
            agentName,
            "info",
            `Generated ${result.generatedTestFiles.size} test files`,
            { fileCount: result.generatedTestFiles.size },
          ),
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        logger.error(`[${agentName}] Error: ${errorMessage}`);
        return {
          ...stageUpdate,
          executionErrors: addError(state, agentName, errorMessage),
          executionLogs: appendLog(state, agentName, "error", errorMessage),
        };
      }
    };
  }

  /* ================================================================ */
  /*  INSTANCE: Orchestration                                           */
  /* ================================================================ */

  async execute(
    input: CodeGenerationInput,
    context: AgentContext,
  ): Promise<CodeGenerationOutput> {
    const { validTestCases, invalidTestCases, testDataByTest, config } = input;
    const { logger } = context;

    let testsToGenerate = validTestCases;
    if (config.generateInvalidTests && invalidTestCases.length > 0) {
      testsToGenerate = [...validTestCases, ...invalidTestCases];
    }

    logger.info("Starting code generation", {
      testCaseCount: testsToGenerate.length,
      validCount: validTestCases.length,
      invalidCount: config.generateInvalidTests ? invalidTestCases.length : 0,
    });

    const generatedTestFiles = new Map<string, string>();
    const xpathMapping = await this.loadXPathMapping(config.inputPath);
    const targetUrl = config.targetUrl || "http://localhost:3000";

    // Label-based spec
    generatedTestFiles.set(
      "general.spec.ts",
      CodeGenerationAgent.generateTestSuite(
        testsToGenerate,
        testDataByTest,
        targetUrl,
      ),
    );

    // XPath-based spec if mapping available
    if (xpathMapping.size > 0) {
      generatedTestFiles.set(
        "general.xpath.spec.ts",
        CodeGenerationAgent.generateTestSuite(
          testsToGenerate,
          testDataByTest,
          targetUrl,
          xpathMapping,
        ),
      );
    }

    logger.info("Code generation complete", {
      filesGenerated: generatedTestFiles.size,
      testsGenerated: testsToGenerate.length,
    });

    return { generatedTestFiles };
  }

  /* ================================================================ */
  /*  STATIC: Test-suite generation                                     */
  /* ================================================================ */

  private static generateTestSuite(
    tests: NLTestCase[],
    testDataByTest: Map<string, Record<string, unknown>>,
    targetUrl: string,
    xpathMapping?: Map<string, Map<string, string>>,
  ): string {
    const lines: string[] = [
      `import { test, expect } from '@playwright/test';`,
      "",
      `// Base URL: ${targetUrl}`,
      "",
      "// Test Data",
      `const testData = {`,
    ];

    for (const test of tests) {
      const data = testDataByTest.get(test.id) || {};
      lines.push(`  '${escapeForPlaywright(test.id)}': {`);
      for (const [key, value] of Object.entries(data)) {
        lines.push(
          `    '${escapeForPlaywright(key)}': '${escapeForPlaywright(String(value))}',`,
        );
      }
      lines.push(`  },`);
    }
    lines.push(`};`, "");

    // Restore the DB before every test for max isolation between cases.
    // Resolves from out/<app>/<run-id>/general.spec.ts up to GenCodeMAS/src/.
    lines.push(
      `import { restoreWaterDb } from '../../../src/scripts/restore-water-db';`,
      ``,
      `test.beforeEach(async () => {`,
      `  restoreWaterDb();`,
      `});`,
      ``,
    );

    for (const test of tests) {
      lines.push(
        `test('${escapeForPlaywright(test.name)}', async ({ page }) => {`,
      );
      lines.push(`  const data = testData['${test.id}'];`, "");

      const body = this.generateTestBody(
        test,
        testDataByTest.get(test.id) || {},
        targetUrl,
        xpathMapping,
      );
      for (const line of body) lines.push(`  ${line}`);

      lines.push(`});`, "");
    }

    return lines.join("\n");
  }

  /* ================================================================ */
  /*  STATIC: Test-body generation (single-pass)                        */
  /* ================================================================ */

  private static generateTestBody(
    test: NLTestCase,
    testData: Record<string, unknown>,
    targetUrl: string,
    xpathMapping?: Map<string, Map<string, string>>,
  ): string[] {
    const lines: string[] = [];
    const elements = test.interactiveElements ?? [];
    const elementsByPage = test.elementsByPage ?? {};
    const structured = test.structuredActions;
    const pages = this.parsePagePath(test.name);
    const transitions = test.name.split(" - ").filter((_, i) => i % 2 === 1);
    let pageIndex = 0;
    let currentPage = pages[0] || "Start";

    for (let i = 0; i < test.actions.length; i++) {
      const action = test.actions[i];
      const step = structured?.[i];

      // Fast path: structured action carries (pageId, elementIndex). Use the
      // per-page element list to look up the exact element. Fall back to the
      // parser path if the structured form is missing or lookup fails.
      let actionType: string;
      let targetLabel: string | undefined;
      let valueLabel: string | undefined;
      let element: UIElement | undefined;

      if (step) {
        const resolved = this.resolveStructuredAction(
          step,
          elementsByPage,
          elements,
        );
        if (step.type === "assert") {
          // Real assertions live in test.assertions; the leaked action form
          // is intentionally skipped by the existing parser.
          continue;
        }
        if (step.type === "open") {
          lines.push(...this.emitOpen(action, targetUrl));
          continue;
        }
        actionType = step.type;
        targetLabel = step.label || undefined;
        valueLabel = step.value;
        element = resolved.element;
        // If the structured lookup failed, fall through to the parser for the NL string.
        if (!element) {
          const parsed = this.parseAction(action);
          if (!parsed) {
            lines.push(
              `// TODO: unrecognized action: ${escapeForPlaywright(action)}`,
            );
            continue;
          }
          if (parsed.actionType === "open") {
            lines.push(...this.emitOpen(action, targetUrl));
            continue;
          }
          if (parsed.actionType === "assertion-skip") continue;
          actionType = parsed.actionType;
          targetLabel = parsed.targetLabel;
          valueLabel = parsed.valueLabel;
          element = targetLabel
            ? this.findElementByLabel(targetLabel, elements)
            : undefined;
        }
      } else {
        const parsed = this.parseAction(action);
        if (!parsed) {
          lines.push(
            `// TODO: unrecognized action: ${escapeForPlaywright(action)}`,
          );
          continue;
        }

        if (parsed.actionType === "open") {
          lines.push(...this.emitOpen(action, targetUrl));
          continue;
        }

        // The NL builder used to stuff assertion sentences into the actions array.
        // Skip them here; real assertions live in test.assertions.
        if (parsed.actionType === "assertion-skip") {
          continue;
        }

        actionType = parsed.actionType;
        targetLabel = parsed.targetLabel;
        valueLabel = parsed.valueLabel;
        element = targetLabel
          ? this.findElementByLabel(targetLabel, elements)
          : undefined;
      }

      if (element?.disabled) {
        lines.push(
          `// TODO: skipped disabled action: ${escapeForPlaywright(action)}`,
        );
        continue;
      }

      switch (actionType) {
        case "click": {
          lines.push(
            ...this.emitClick(targetLabel, element, currentPage, xpathMapping),
          );
          if (targetLabel && pageIndex + 1 < pages.length) {
            const transition = transitions[pageIndex];
            if (
              transition &&
              normalizeForCompare(transition) ===
                normalizeForCompare(targetLabel)
            ) {
              currentPage = pages[++pageIndex];
            }
          }
          break;
        }

        case "type":
        case "fill": {
          lines.push(
            ...this.emitFill(
              targetLabel,
              valueLabel,
              element,
              currentPage,
              testData,
              xpathMapping,
            ),
          );
          break;
        }

        case "select": {
          lines.push(
            ...this.emitSelect(
              targetLabel,
              valueLabel,
              element,
              currentPage,
              testData,
              xpathMapping,
            ),
          );
          break;
        }

        case "set":
        case "check":
        case "uncheck": {
          lines.push(
            ...this.emitSet(
              targetLabel,
              valueLabel,
              element,
              currentPage,
              testData,
              xpathMapping,
              actionType,
            ),
          );
          break;
        }

        case "press": {
          lines.push(...this.emitPress(targetLabel));
          break;
        }

        default: {
          lines.push(
            `// TODO: unsupported action type '${actionType}': ${escapeForPlaywright(action)}`,
          );
        }
      }
    }

    for (const assertion of test.assertions || []) {
      lines.push(...this.emitAssertion(assertion));
    }

    return lines;
  }

  /**
   * Resolve a structured action to its element.
   * - `elementIndex === -1` → no element (open, navigation click, assert).
   * - Otherwise look up `elementsByPage[step.pageId][step.elementIndex]`.
   * - Out-of-range or missing page list → fall back to label-based search.
   */
  private static resolveStructuredAction(
    step: NLActionStep,
    elementsByPage: Record<string, UIElement[]>,
    flatElements: UIElement[],
  ): { element?: UIElement; fallbackLabel?: string } {
    if (step.elementIndex === -1) {
      return { fallbackLabel: step.label };
    }
    const pageList = step.pageId ? elementsByPage[step.pageId] : undefined;
    const pool = pageList ?? flatElements;
    if (step.elementIndex >= 0 && step.elementIndex < pool.length) {
      return { element: pool[step.elementIndex] };
    }
    // Out-of-range safety net.
    return {
      element: this.findElementByLabel(step.label, flatElements),
      fallbackLabel: step.label,
    };
  }

  /**
   * Parse a natural-language action step into a structured action.
   *
   * Delegates pattern recognition to the centralized grammar in
   * `utils/nl-grammar.ts` so the generator and the builder share one set
   * of rules.
   */
  private static parseAction(action: string): {
    actionType: string;
    targetLabel?: string;
    valueLabel?: string;
  } | null {
    const trimmed = action.trim();

    // Open / start / navigate — not in PARSE_RULES, handle here.
    const openMatch = trimmed.match(
      /^(?:open the website|start at|navigate to)\s+['"]?(.+?)['"]?$/i,
    );
    if (openMatch) {
      return { actionType: "open", targetLabel: openMatch[1].trim() };
    }

    // Assertion sentences that leaked into the actions array are not executable.
    if (trimmed.toLowerCase().startsWith("assert ")) {
      return { actionType: "assertion-skip" };
    }

    // Delegate to the canonical grammar.
    const parsed = parseNLAction(action);
    if (!parsed) return null;

    // Map grammar method → codegen actionType.
    // For "click" method, the original verb (Check / Uncheck / Set / Click) is
    // taken from the action string directly so the switch in generateTestBody
    // can disambiguate them.
    let actionType: string;
    switch (parsed.method) {
      case "type":
      case "fill":
        actionType = "fill";
        break;
      case "selectOption":
        actionType = "select";
        break;
      case "click": {
        const verb = trimmed.split(/\s+/)[0].toLowerCase();
        actionType = ["click", "check", "uncheck", "set"].includes(verb)
          ? verb
          : "click";
        break;
      }
      default:
        actionType = parsed.method;
    }

    return {
      actionType,
      targetLabel: parsed.target || undefined,
      valueLabel: parsed.arguments[0],
    };
  }

  /* ================================================================ */
  /*  STATIC: Action emitters (one per NL action type)                  */
  /* ================================================================ */

  private static emitOpen(action: string, targetUrl: string): string[] {
    const m = action.match(
      /(?:open the website|start at|navigate to)\s+['"]?(.+?)['"]?$/i,
    );
    const target = m ? m[1].trim() : "/";
    const url = target.startsWith("http") ? target : `${targetUrl}${target}`;
    return [`await page.goto('${escapeForPlaywright(url)}');`];
  }

  private static emitClick(
    targetLabel: string | undefined,
    element: UIElement | undefined,
    currentPage: string,
    xpathMapping?: Map<string, Map<string, string>>,
  ): string[] {
    if (element?.disabled) {
      return [
        `// TODO: skipped disabled click: ${escapeForPlaywright(targetLabel || "")}`,
      ];
    }
    const locator = this.makeLocator(
      targetLabel,
      element,
      currentPage,
      xpathMapping,
      "text",
    );
    return [`await ${locator}.click();`];
  }

  private static emitFill(
    targetLabel: string | undefined,
    valueLabel: string | undefined,
    element: UIElement | undefined,
    currentPage: string,
    testData: Record<string, unknown>,
    xpathMapping?: Map<string, Map<string, string>>,
  ): string[] {
    if (element?.disabled) {
      return [
        `// TODO: skipped disabled fill: ${escapeForPlaywright(targetLabel || "")}`,
      ];
    }
    const fillableTypes = ["input", "textarea", "unknown"];
    if (element && !fillableTypes.includes(element.type)) {
      return [
        `// TODO: cannot fill element of type '${element.type}' for '${escapeForPlaywright(targetLabel || "")}'`,
      ];
    }
    const { value, locator } = this.buildActionContext(
      targetLabel,
      element,
      currentPage,
      testData,
      xpathMapping,
      "sample text",
      valueLabel,
    );
    return [`await ${locator}.fill(${value});`];
  }

  private static emitSelect(
    targetLabel: string | undefined,
    valueLabel: string | undefined,
    element: UIElement | undefined,
    currentPage: string,
    testData: Record<string, unknown>,
    xpathMapping?: Map<string, Map<string, string>>,
  ): string[] {
    if (element?.disabled) {
      return [
        `// TODO: skipped disabled select: ${escapeForPlaywright(targetLabel || "")}`,
      ];
    }
    if (element && element.type !== "select" && element.type !== "unknown") {
      return [
        `// TODO: cannot select from element of type '${element.type}' for '${escapeForPlaywright(targetLabel || "")}'`,
      ];
    }
    const { value, locator } = this.buildActionContext(
      targetLabel,
      element,
      currentPage,
      testData,
      xpathMapping,
      "Option 1",
      valueLabel,
    );
    return [`await ${locator}.selectOption(${value});`];
  }

  private static emitSet(
    targetLabel: string | undefined,
    valueLabel: string | undefined,
    element: UIElement | undefined,
    currentPage: string,
    testData: Record<string, unknown>,
    xpathMapping?: Map<string, Map<string, string>>,
    actionVerb: string = "set",
  ): string[] {
    if (element?.disabled) {
      return [
        `// TODO: skipped disabled set: ${escapeForPlaywright(targetLabel || "")}`,
      ];
    }
    if (
      element &&
      element.type !== "checkbox" &&
      element.type !== "radio" &&
      element.type !== "unknown"
    ) {
      return [
        `// TODO: cannot check/uncheck element of type '${element.type}' for '${escapeForPlaywright(targetLabel || "")}'`,
      ];
    }

    // Radio: the NL step names the group and the option; check that option.
    if (element?.type === "radio") {
      const locator = this.makeLocator(
        targetLabel,
        element,
        currentPage,
        xpathMapping,
        "label",
      );
      return [`await ${locator}.check();`];
    }

    const { value, locator } = this.buildActionContext(
      targetLabel,
      element,
      currentPage,
      testData,
      xpathMapping,
      "true",
      valueLabel,
    );

    // Checkbox: respect an explicit NL verb, otherwise use the generated data value.
    if (element?.type === "checkbox") {
      const wantCheck =
        actionVerb === "check" ||
        (actionVerb !== "uncheck" && value === "'true'");
      return wantCheck
        ? [`await ${locator}.check();`]
        : [`await ${locator}.uncheck();`];
    }

    // Unknown / fallback: branch on the resolved value.
    return [
      `if (${value} === 'true') {`,
      `  await ${locator}.check();`,
      `} else {`,
      `  await ${locator}.uncheck();`,
      `}`,
    ];
  }

  private static emitPress(key: string | undefined): string[] {
    if (!key) return [];
    return [`await page.keyboard.press('${escapeForPlaywright(key)}');`];
  }

  private static emitAssertion(assertionStr: string): string[] {
    const parsed = this.parseAssertion(assertionStr);
    if (!parsed) return [];

    const { identifier, negated } = parsed;
    const method = negated ? "toBeHidden" : "toBeVisible";
    //todo: i removed , { exact: true }
    return [
      `// Verify: ${escapeForPlaywright(assertionStr)}`,
      `var item = page.getByText('${identifier}')`,
      `if (await item.count() > 1) {`,
      `await expect(item.first()).${method}();`,
      `} else {`,
      `await expect(item).${method}();`,
      `}`,
    ];
    ``;
  }

  /* ================================================================ */
  /*  STATIC: Locator resolution                                        */
  /* ================================================================ */

  /**
   * Build a Playwright locator string from a UIElement. The element decides —
   * inspect label / text / placeholder and pick a strategy per type.
   */
  private static buildLocator(element: UIElement): string {
    const label = element.label?.trim();
    const text = element.text?.trim();
    const ph = element.placeholder?.trim();

    const safeLabel = label ? escapeForPlaywright(label) : undefined;
    const safeText = text ? escapeForPlaywright(text) : undefined;
    const safePh = ph ? escapeForPlaywright(ph) : undefined;

    switch (element.type) {
      case "button": {
        // Prefer role+name (accessible name resolves to label or text on real
        // DOM, but for generated spec we wire the field we actually have).
        if (safeLabel) return `page.getByRole('button', { name: '${safeLabel}' })`;
        if (safeText) return `page.getByRole('button', { name: '${safeText}' })`;
        return `page.locator('button')`;
      }

      case "link": {
        if (safeLabel) return `page.getByRole('link', { name: '${safeLabel}' })`;
        if (safeText) return `page.getByRole('link', { name: '${safeText}' })`;
        return `page.locator('a')`;
      }

      case "radio": {
        // Radio option text lives in `text`; the group label lives in `label`.
        if (safeText) return `page.getByRole('radio', { name: '${safeText}' })`;
        if (safeLabel) return `page.getByRole('radio', { name: '${safeLabel}' })`;
        return `page.locator('input[type="radio"]')`;
      }

      case "checkbox": {
        if (safeLabel) return `page.getByLabel('${safeLabel}')`;
        if (safeText) return `page.getByLabel('${safeText}')`;
        return `page.locator('input[type="checkbox"]')`;
      }

      case "input": {
        if (safeLabel) return `page.getByLabel('${safeLabel}')`;
        if (safePh) return `page.locator('input[placeholder="${safePh}"]')`;
        if (safeText) return `page.getByLabel('${safeText}')`;
        return `page.locator('input')`;
      }

      case "textarea": {
        if (safeLabel) return `page.getByLabel('${safeLabel}')`;
        if (safePh) return `page.locator('textarea[placeholder="${safePh}"]')`;
        if (safeText) return `page.getByLabel('${safeText}')`;
        return `page.locator('textarea')`;
      }

      case "select": {
        if (safeLabel) return `page.getByLabel('${safeLabel}')`;
        if (safeText) return `page.getByLabel('${safeText}')`;
        return `page.locator('select')`;
      }

      case "text":
      case "unknown": {
        if (safeText) return `page.getByText('${safeText}')`;
        if (safeLabel) return `page.getByText('${safeLabel}')`;
        return `page.locator('*')`;
      }
    }
  }

  private static makeLocator(
    targetLabel: string | undefined,
    element: UIElement | undefined,
    currentPage: string,
    xpathMapping: Map<string, Map<string, string>> | undefined,
    fallback: "text" | "label",
  ): string {
    if (targetLabel && xpathMapping) {
      const pageXpaths = xpathMapping.get(toPascalCaseNoSpaces(currentPage));
      const xpath = pageXpaths?.get(targetLabel);
      if (xpath) return `page.locator('xpath=${escapeForPlaywright(xpath)}')`;
    }
    if (element) return this.buildLocator(element);

    const safe = escapeForPlaywright(targetLabel || "");
    return fallback === "text"
      ? `page.getByText('${safe}')`
      : `page.getByLabel('${safe}')`;
  }

  private static buildActionContext(
    targetLabel: string | undefined,
    element: UIElement | undefined,
    currentPage: string,
    testData: Record<string, unknown>,
    xpathMapping: Map<string, Map<string, string>> | undefined,
    fallbackValue = "",
    valueLabel?: string,
  ) {
    const key = element
      ? getElementDataKey(element)
      : toFieldKey(targetLabel || "");

    const dataValue = testData[key];
    let useData = dataValue !== undefined;

    // The data generator uses '*' as a sentinel for selects meaning "any option".
    // When we have an explicit option from the NL step, prefer that literal value.
    if (
      element?.type === "select" &&
      useData &&
      String(dataValue) === "*" &&
      valueLabel
    ) {
      useData = false;
    }

    const value = useData
      ? `data['${key}']`
      : valueLabel !== undefined
        ? `'${escapeForPlaywright(valueLabel)}'`
        : `'${escapeForPlaywright(targetLabel || fallbackValue)}'`;

    return {
      value,
      locator: this.makeLocator(
        targetLabel,
        element,
        currentPage,
        xpathMapping,
        "label",
      ),
    };
  }

  /* ================================================================ */
  /*  STATIC: Text parsing helpers                                      */
  /* ================================================================ */

  private static extractTargetLabel(action: string): string | undefined {
    const quoted = action.match(/['"<]([^'">]+)['">]/);
    return quoted?.[1]?.trim();
  }

  private static findElementByLabel(
    label: string,
    elements: UIElement[],
  ): UIElement | undefined {
    const norm = normalizeForCompare(label);
    for (const el of elements) {
      const texts = [el.label, el.text, el.placeholder, el.value].filter(
        Boolean,
      );
      if (texts.some((t) => normalizeForCompare(t) === norm)) return el;
    }
    for (const el of elements) {
      const texts = [el.label, el.text, el.placeholder, el.value].filter(
        Boolean,
      );
      if (
        texts.some(
          (t) =>
            normalizeForCompare(t).includes(norm) ||
            norm.includes(normalizeForCompare(t)),
        )
      )
        return el;
    }
    return undefined;
  }

  private static parsePagePath(testCaseName: string): string[] {
    const parts = testCaseName.split(" - ");
    const pages: string[] = [];
    for (let i = 0; i < parts.length; i += 2) pages.push(parts[i].trim());
    return pages.length > 0 ? pages : ["Start"];
  }

  private static parseAssertion(assertionStr: string): {
    identifier: string;
    negated: boolean;
  } | null {
    // Quote-aware: "..."  |  '...'  |  unquoted word
    const m = assertionStr.match(
      /(\w+)\s*\(\s*(?:name=)?(?:"([^"]*)"|'([^']*)'|([^"')\s]+))\s*\)/i,
    );
    if (!m) return null;
    return {
      identifier: m[2] || m[3] || m[4],
      negated: /\b(?:not|hidden|invisible)\b/i.test(assertionStr),
    };
  }

  /* ================================================================ */
  /*  INSTANCE: XPath mapping loader                                    */
  /* ================================================================ */

  private async loadXPathMapping(
    inputPath?: string,
  ): Promise<Map<string, Map<string, string>>> {
    if (!inputPath) return new Map();
    try {
      const fs = await import("fs/promises");
      const raw = await fs.readFile(
        path.join(inputPath, "xpath_mapping.json"),
        "utf8",
      );

      const mapping = JSON.parse(raw) as Record<
        string,
        { label: string; xpath: string }[]
      >;
      const result = new Map<string, Map<string, string>>();
      for (const [pageName, elements] of Object.entries(mapping)) {
        const pageMap = new Map<string, string>();
        for (const el of elements) {
          if (el.label && el.xpath)
            pageMap.set(el.label.trim(), el.xpath.trim());
        }
        // Normalize the same way test names are built (spaced lowercase → PascalCaseNoSpaces)
        const normalizedKey = toPascalCaseNoSpaces(toSpacedLowerCase(pageName));
        result.set(normalizedKey, pageMap);
      }
      return result;
    } catch (e) {
      console.log("Error while loading xmap", e);

      return new Map();
    }
  }
}
