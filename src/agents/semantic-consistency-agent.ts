/**
 * Semantic Consistency Agent
 *
 * Uses an LLM to verify that each generated NL test case semantically matches
 * the navigation path it was derived from.
 */

import type { RunnableConfig } from "@langchain/core/runnables";
import type {
  SimpleAgent,
  AgentContext,
  SemanticConsistencyInput,
  SemanticConsistencyOutput,
} from "./types";
import type {
  ConsistencyReport,
  LangGraphState,
  NLTestCase,
  TestPath,
  UIElement,
} from "../types";
import { appendLog, addError, setCurrentStage } from "../types";
import { ollama } from "../utils/llm_wrapper";
import { getTemplate, renderTemplate } from "../utils/template_manager";
import { resolvePlaceholdersInTestCase } from "../utils/test-data-resolver";
import { Console } from "console";

export class SemanticConsistencyAgent implements SimpleAgent<
  SemanticConsistencyInput,
  SemanticConsistencyOutput
> {
  readonly name = "SemanticConsistencyAgent";
  readonly description =
    "Checks semantic consistency between paths and NL test cases using an LLM";

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
            nlTestCases: state.nlTestCases,
            selectedPaths: state.selectedPaths,
            elementsByPage:
              state.verifiedElementsByPage.size > 0
                ? state.verifiedElementsByPage
                : state.elementsByPage,
            assertionsByPage: state.assertionsByPage,
            testDataByTest: state.testDataByTest,
            config: state.config,
          },
          context,
        );

        logger.info(
          `[${agentName}] Checked ${result.consistencyReports.size} test cases, ${result.invalidTestCases.length} flagged`,
        );

        return {
          ...stageUpdate,
          validTestCases: result.validTestCases,
          invalidTestCases: result.invalidTestCases,
          consistencyReports: result.consistencyReports,
          completedStages: [...state.completedStages, agentName],
          currentStage: null,
          executionLogs: appendLog(
            state,
            agentName,
            "info",
            `Checked ${result.consistencyReports.size} test cases`,
            {
              valid: result.validTestCases.length,
              invalid: result.invalidTestCases.length,
            },
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
    input: SemanticConsistencyInput,
    context: AgentContext,
  ): Promise<SemanticConsistencyOutput> {
    const {
      nlTestCases,
      selectedPaths,
      elementsByPage,
      testDataByTest,
      config,
    } = input;
    const { logger } = context;

    if (!config.enableConsistencyCheck) {
      logger.info(
        `Semantic consistency check disabled (enableConsistencyCheck=${config.enableConsistencyCheck}), skipping`,
      );
      return {
        validTestCases: nlTestCases,
        invalidTestCases: [],
        consistencyReports: new Map(),
      };
    }

    logger.info("Starting semantic consistency check", {
      testCaseCount: nlTestCases.length,
    });

    const pathById = new Map<string, TestPath>();
    for (const path of selectedPaths) {
      pathById.set(path.id, path);
    }

    const consistencyReports = new Map<string, ConsistencyReport>();
    const validTestCases: NLTestCase[] = [];
    const invalidTestCases: NLTestCase[] = [];

    var counter = 1;

    for (const testCase of nlTestCases) {
      //print progress of processing
      console.log(
        `Processing NL test case consistency:  ${counter}/${nlTestCases.length}`,
      );
      counter++;

      const path = testCase.pathId ? pathById.get(testCase.pathId) : undefined;
      if (!path) {
        logger.warn(`No matching path found for test case ${testCase.id}`);
        validTestCases.push(testCase);
        continue;
      }

      try {
        const testData = testDataByTest.get(testCase.id);
        const resolvedTestCase = resolvePlaceholdersInTestCase(
          testCase,
          testData,
        );
        const report = await this.checkConsistency(
          path,
          resolvedTestCase,
          elementsByPage,
          config,
        );
        consistencyReports.set(testCase.id, report);

        if (report.valid) {
          validTestCases.push(testCase);
        } else {
          invalidTestCases.push(testCase);
          logger.warn(`Test case ${testCase.id} failed consistency check`, {
            issues: report.issues,
          });
        }
      } catch (err) {
        logger.error(`Consistency check failed for ${testCase.id}: ${err}`);
        // On LLM error, treat as valid to avoid blocking pipeline
        validTestCases.push(testCase);
      }
    }

    return {
      consistencyReports,
      validTestCases,
      invalidTestCases,
    };
  }

  async checkConsistency(
    path: TestPath,
    testCase: NLTestCase,
    elementsByPage: Map<string, UIElement[]>,
    config: { modelId: string },
    promptTemplatePath = "semantic-consistency_v2.md",
  ): Promise<ConsistencyReport> {
    const pathDescription = this.describePath(path);
    const resolvedNlDescription = this.describeResolvedTestCase(testCase);
    const elementsDescription = this.describeElementsForPath(
      path,
      elementsByPage,
    );

    const template = await getTemplate(promptTemplatePath);
    const prompt = renderTemplate(template, {
      pathDescription,
      resolvedNlDescription,
      elementsDescription,
    });

    // console.log(prompt);

    const response = await ollama.chat({
      model: config.modelId,
      messages: [
        {
          role: "system",
          content:
            "You are a specialized QA assistant. Output strict JSON only.",
        },
        { role: "user", content: prompt },
      ],
      format: "json",
      options: {
        temperature: 0,
        seed: 42,
      },
    });

    console.debug(
      "LLM response for consistency check:",
      testCase.name,
      testCase.id,
      response.message.content,
      response.prompt_eval_count,
    );

    const parsed = JSON.parse(response.message.content);

    return {
      pathId: path.id,
      testCaseId: testCase.id,
      valid: parsed.valid === true,
      confidence: parsed.confidence || "low",
      issues: Array.isArray(parsed.issues) ? parsed.issues : [],
    };
  }

  private describePath(path: TestPath): string {
    const pageSequence = [path.startNode, ...path.steps.map((s) => s.to)];
    const lines: string[] = [
      `Expected Page Sequence: ${pageSequence.join(" → ")}`,
      "Path Edges:",
      ...path.steps.map(
        (step, i) =>
          `  Step ${i + 1}: ${step.from} → [${step.label}] → ${step.to}`,
      ),
    ];
    return lines.join("\n");
  }

  private describeResolvedTestCase(testCase: NLTestCase): string {
    const navActions = testCase.actions.filter((a) => {
      const lower = a.toLowerCase();
      return !lower.includes("assert that");
    });

    const pages = testCase.name.split(" - ").filter((_, i) => i % 2 === 0);

    const lines: string[] = [
      `Name: ${testCase.name}`,
      `Actual Page Sequence: ${pages.join(" → ")}`,
      "Navigation Actions:",
      ...navActions.map((a, i) => `  ${i + 1}. ${a}`),
    ];
    return lines.join("\n");
  }

  private describeElementsForPath(
    path: TestPath,
    elementsByPage: Map<string, UIElement[]>,
  ): string {
    const pageNames = new Set<string>();
    pageNames.add(path.startNode);
    for (const step of path.steps) {
      pageNames.add(step.from);
      pageNames.add(step.to);
    }

    const lines: string[] = [];
    for (const page of pageNames) {
      const elements = elementsByPage.get(page) || [];
      if (elements.length === 0) continue;
      lines.push(`Page: ${page}`);
      for (const el of elements) {
        const parts: string[] = [el.type];
        if (el.label) parts.push(`label="${el.label}"`);
        if (el.text) parts.push(`text="${el.text}"`);
        if (el.placeholder) parts.push(`placeholder="${el.placeholder}"`);
        lines.push(`  - ${parts.join(" ")}`);
      }
    }

    if (lines.length === 0) {
      return "No extracted elements available for pages in this path.";
    }
    return lines.join("\n");
  }
}
