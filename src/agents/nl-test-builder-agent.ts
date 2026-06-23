/**
 * Builds natural language test cases from paths and extracted elements
 */

import type { RunnableConfig } from "@langchain/core/runnables";
import type {
  SimpleAgent,
  AgentContext,
  NLTestBuilderInput,
  NLTestBuilderOutput,
} from "./types";
import type { LangGraphState, NLActionStep, NLTestCase, TestPath, UIElement } from "../types";
import { addError, appendLog, setCurrentStage } from "../types";
import { buildNLAction } from "../utils/nl-grammar.js";
import { getCanonicalLabel, toFieldKey, toSpacedLowerCase } from "../utils/label-utils.js";

export class NLTestBuilderAgent implements SimpleAgent<
  NLTestBuilderInput,
  NLTestBuilderOutput
> {
  readonly name = "NLTestBuilderAgent";
  readonly description = "Builds natural language test cases from paths";

  private elementsByPage: Map<string, UIElement[]> = new Map();
  private targetUrl: string = "http://localhost:3000";

  /**
   * Returns the LangGraph node function for this agent
   */
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
            selectedPaths: state.selectedPaths,
            assertionsByPage: state.assertionsByPage,
            elementsByPage:
              state.verifiedElementsByPage.size > 0
                ? state.verifiedElementsByPage
                : state.elementsByPage,
            config: state.config,
          },
          context,
        );

        logger.info(
          `[${agentName}] Built ${result.nlTestCases.length} natural language test cases`,
        );

        return {
          ...stageUpdate,
          nlTestsByPath: result.nlTestsByPath,
          nlTestCases: result.nlTestCases,
          completedStages: [...state.completedStages, agentName],
          currentStage: null,
          executionLogs: appendLog(
            state,
            agentName,
            "info",
            `Built ${result.nlTestCases.length} NL test cases`,
            { testCount: result.nlTestCases.length },
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

  async execute(
    input: NLTestBuilderInput,
    context: AgentContext,
  ): Promise<NLTestBuilderOutput> {
    const { selectedPaths, assertionsByPage, elementsByPage, config } = input;
    const { logger } = context;

    // Initialize instance variables
    this.elementsByPage = elementsByPage;
    this.targetUrl = config?.targetUrl || "http://localhost:3000";

    const nlTestsByPath = new Map<string, NLTestCase>();
    const nlTestCases: NLTestCase[] = [];

    for (const path of selectedPaths) {
      // Convert path steps to array format expected by buildNLTestcaseForPath
      const pathArray = this.convertPathToArray(path);

      // Build actions using element-aware logic; also captures per-page element
      // indices so code generation can resolve them deterministically.
      const {
        steps: actions,
        structuredActions,
        interactiveElementsForPath,
        elementsByPageForPath,
      } = this.buildNLTestcaseForPath(pathArray);

      // Build Assertions for the end page, transform them to

      const endPage = path.endNode;
      const {
        strings: pageAssertionsFormated,
        steps: pageAssertionSteps,
      } = this.buildAssertionsForPage(
        assertionsByPage.get(endPage) ?? [],
        elementsByPage.get(endPage) ?? [],
      );

      // Create test case with the generated actions
      const testCase = this.buildTestCase(
        path,
        actions,
        structuredActions,
        pageAssertionsFormated,
        pageAssertionSteps,
        assertionsByPage,
        interactiveElementsForPath,
        elementsByPageForPath,
        endPage,
      );
      nlTestsByPath.set(path.id, testCase);

      nlTestCases.push(testCase);
    }

    logger.info("NL test case building complete", {
      testCaseCount: nlTestCases.length,
    });

    return {
      nlTestsByPath,
      nlTestCases,
    };
  }
  buildAssertionsForPage(
    assertions: string[],
    _elements: UIElement[],
  ): { strings: string[]; steps: NLActionStep[] } {
    const strings: string[] = [];
    const steps: NLActionStep[] = [];
    for (const element of assertions ?? []) {
      // extract label from item:  input("OLD Password")
      const elementType = element.split("(")[0];
      const elementLabel = element.split('"')[1]?.replace('"', "") ?? "";
      // check if it's with negation:  not input("OLD Password")
      const isNegation = element.startsWith("not ");
      switch (elementType) {
        case "input":
        case "textarea":
          strings.push(
            `Assert that '${elementLabel}' is ${isNegation ? "not" : ""} displayed on this page`,
          );
          break;
        case "checkbox":
          strings.push(
            `Assert that '${elementLabel}' is ${isNegation ? "not" : ""} checked on this page`,
          );
          break;
        case "radio":
          strings.push(
            `Assert that '${elementLabel}' is ${isNegation ? "not" : ""} selected on this page`,
          );
          break;
        case "select":
          strings.push(
            `Assert that '${elementLabel}' has the value '<${elementLabel}>'`,
          );
          break;

        default:
          strings.push(
            `Assert that '${elementLabel}' is ${isNegation ? "not" : ""} displayed on this page`,
          );
      }
      steps.push({
        type: "assert",
        label: elementLabel,
        elementIndex: -1,
        pageId: "",
        negated: isNegation,
      });
    }

    return { strings, steps };
  }

  /**
   * Build NL test case for a path (sequence of page IDs).
   * Path format: [page1, nav1, page2, nav2, page3, ...]
   *
   * Returns paired outputs so code generation can resolve each NL action back
   * to the exact element it was built from, even when two fields share a label.
   */
  private buildNLTestcaseForPath(pathSteps: string[]): {
    steps: string[];
    structuredActions: NLActionStep[];
    interactiveElementsForPath: UIElement[];
    elementsByPageForPath: Record<string, UIElement[]>;
  } {
    const pathPages = pathSteps.filter((val, index) => index % 2 === 0);
    const pathNavItems = pathSteps.filter((val, index) => index % 2 !== 0);
    const steps = [`Open the website '${this.targetUrl}'`];
    const structuredActions: NLActionStep[] = [
      {
        type: "open",
        label: this.targetUrl,
        elementIndex: -1,
        pageId: "",
      },
    ];

    const interactiveElementsForPath: UIElement[] = [];
    const elementsByPageForPath: Record<string, UIElement[]> = {};

    for (let i = 0; i < pathPages.length; i++) {
      const page = pathPages[i];
      const pageElements = this.elementsByPage.get(page);

      // Filter for interactive elements
      const interactiveElements = this.filterInteractiveElements(pageElements);

      // Record the per-page interactive list so codegen can resolve indices.
      elementsByPageForPath[page] = interactiveElements;

      if (i === 0) {
        console.log("page-0", interactiveElements);
      }

      // Accumulate interactive elements for the final NL test case
      if (interactiveElements.length > 0) {
        interactiveElementsForPath.push(...interactiveElements);
      }

      // Construct actions for interactive elements (paired with structured steps)
      const {
        strings: pageActions,
        steps: pageActionSteps,
      } = this.constructPageActions(interactiveElements, page);
      if (i === 0) {
        console.log("page-0", pageActions);
      }

      if (pageActions.length > 0) {
        steps.push(...pageActions);
        structuredActions.push(...pageActionSteps);
      }

      // Add navigation action if this isn't the last page
      if (i < pathNavItems.length) {
        steps.push(`Click on '${pathNavItems[i]}'`);
        structuredActions.push({
          type: "click",
          label: pathNavItems[i],
          elementIndex: -1,
          pageId: page, // click originates from the page we're leaving
        });
      }
    }

    return {
      steps,
      structuredActions,
      interactiveElementsForPath,
      elementsByPageForPath,
    };
  }

  /**
   * Construct NL actions for interactive elements on a page.
   * For radio groups, emit only one action per group (prefer the checked option).
   *
   * Returns paired `{ strings, steps }` so each NL sentence carries its
   * structured counterpart recording the page-relative element index.
   */
  private constructPageActions(
    interactiveElements: UIElement[] | undefined,
    pageId: string,
  ): { strings: string[]; steps: NLActionStep[] } {
    const strings: string[] = [];
    const steps: NLActionStep[] = [];
    if (!interactiveElements) return { strings, steps };

    // Pick one radio per group. Prefer a checked option; otherwise keep the first seen.
    const selectedRadios = new Map<string, UIElement>();
    for (const element of interactiveElements) {
      if (element.type !== "radio") continue;
      const group = element.label || "";
      const existing = selectedRadios.get(group);
      if (!existing || (!existing.checked && element.checked)) {
        selectedRadios.set(group, element);
      }
    }
    const selectedRadioRefs = new Set<UIElement>([...selectedRadios.values()]);

    for (let idx = 0; idx < interactiveElements.length; idx++) {
      const element = interactiveElements[idx];
      if (element.type === "radio" && !selectedRadioRefs.has(element)) {
        continue;
      }
      const action = buildNLAction(element);
      if (action) {
        strings.push(action);
        steps.push(this.actionToStructured(action, element, pageId, idx));
      }
    }

    return { strings, steps };
  }

  /**
   * Convert a built NL action string into its structured counterpart.
   * Mirrors the verb set emitted by `buildNLAction` (utils/nl-grammar.ts).
   */
  private actionToStructured(
    actionStr: string,
    element: UIElement,
    pageId: string,
    elementIndex: number,
  ): NLActionStep {
    const label = getCanonicalLabel(element) || element.text || "";

    // Detect a `<placeholder>` token, matching resolvePlaceholdersInTestCase.
    const placeholderMatch = actionStr.match(/<([^>]+)>/);
    const isResolvedPlaceholder = !!placeholderMatch;
    const placeholderKey = placeholderMatch
      ? toFieldKey(placeholderMatch[1])
      : undefined;

    // Map the NL prefix to a verb. Unknown verbs default to "click"; the
    // code-generation fallback then re-parses the NL string.
    const lower = actionStr.toLowerCase();
    let type: NLActionStep["type"] = "click";
    let value: string | undefined;

    if (lower.startsWith("type in")) {
      type = "type";
      value = `<${label}>`;
    } else if (lower.startsWith("fill ")) {
      type = "fill";
    } else if (lower.startsWith("select")) {
      type = "select";
      const m = actionStr.match(/from\s+['"`]([^'"`]+)['"`]/i);
      value = m ? m[1] : `<${label}>`;
    } else if (lower.startsWith("set ")) {
      type = "set";
      const m = actionStr.match(/on\s+['"`]([^'"`]+)['"`]/i);
      value = m ? m[1] : undefined;
    } else if (lower.startsWith("uncheck")) {
      type = "uncheck";
    } else if (lower.startsWith("check")) {
      type = "check";
    } else if (lower.startsWith("press")) {
      type = "press";
    }

    return {
      type,
      label,
      value,
      elementIndex,
      pageId,
      isResolvedPlaceholder,
      placeholderKey,
    };
  }

  /**
   * Filter elements to get only interactive ones (inputs, textareas, checkboxes, radios, selects).
   * Skip visibly disabled or read-only elements because they cannot be filled.
   */
  private filterInteractiveElements(
    pageElements: UIElement[] | undefined,
  ): UIElement[] {
    return (
      pageElements?.filter(
        (el) =>
          ["input", "textarea", "checkbox", "radio", "select"].includes(el.type) &&
          !el.disabled,
      ) ?? []
    );
  }

  /**
   * Convert TestPath to array format used by buildNLTestcaseForPath
   * Format: [page1, nav1, page2, nav2, ...]
   */
  private convertPathToArray(path: TestPath): string[] {
    const result: string[] = [path.startNode];

    for (const step of path.steps) {
      result.push(step.label); // navigation label
      result.push(step.to); // target page
    }

    return result;
  }

  /**
   * Build final test case with generated actions and assertions
   */
  private buildTestCase(
    path: TestPath,
    generatedActions: string[],
    generatedStructuredActions: NLActionStep[],
    pageAssertionsFormated: string[],
    pageAssertionSteps: NLActionStep[],
    assertionsByPage: Map<string, string[]>,
    interactiveElements: UIElement[],
    elementsByPage: Record<string, UIElement[]>,
    _endPage: string,
  ): NLTestCase {
    const actions = [...generatedActions, ...pageAssertionsFormated];
    const structuredActions = [
      ...generatedStructuredActions,
      ...pageAssertionSteps,
      // Ensure the two arrays stay 1:1 — assertions push both forms.
    ];

    // Add verification assertions at the end
    const endPage = path.endNode;
    const finalAssertions = assertionsByPage.get(endPage);

    return {
      id: `test-${path.id}`,
      name: this.generateTestName(path),
      description: `Test case covering path: ${path.name}`,
      actions,
      assertions: finalAssertions ?? [],
      pathId: path.id,
      metadata: {
        pathLength: path.steps.length,
        startNode: path.startNode,
        endNode: path.endNode,
      },
      interactiveElements,
      structuredActions,
      elementsByPage,
    };
  }

  private generateTestName(path: TestPath): string {
    // Convert path to readable test name: page1 - transition label1 - page2 - ...
    const parts: string[] = [];

    // Add start page
    parts.push(toSpacedLowerCase(path.startNode));

    // Add transition labels and destination pages alternatingly
    for (const step of path.steps) {
      parts.push(toSpacedLowerCase(step.label));
      parts.push(toSpacedLowerCase(step.to));
    }

    const rawName = parts.join(" - ");

    return rawName;
    // Clean up the name
    // return rawName
    //   .replace(/[-_]/g, " ")
    //   .replace(/\s+/g, " ")
    //   .trim()
    //   .replace(/\b\w/g, (c) => c.toUpperCase());
  }
}
