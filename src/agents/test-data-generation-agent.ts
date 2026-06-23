/**
 * Test Data Generation Agent
 *
 * Generates smart test data by:
 * 1. Matching test actions to extracted UI elements
 * 2. Inferring field intent from element metadata (label, placeholder, type)
 * 3. Generating contextual data (e.g., email format for email fields)
 */

import type { RunnableConfig } from "@langchain/core/runnables";
import type {
  SimpleAgent,
  AgentContext,
  TestDataGenerationInput,
  TestDataGenerationOutput,
} from "./types";
import type { LangGraphState, NLTestCase } from "../types";
import { appendLog, addError, setCurrentStage } from "../types";
import {
  generateDataForElement,
  seedTestData,
} from "../utils/test-data-matcher";
import { getElementDataKey } from "../utils/label-utils";

export class TestDataGenerationAgent implements SimpleAgent<
  TestDataGenerationInput,
  TestDataGenerationOutput
> {
  readonly name = "TestDataGenerationAgent";
  readonly description =
    "Generates test data by matching actions to extracted UI elements";

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
            debug: (msg: string, meta?: Record<string, unknown>) =>
              logger.debug(`[${agentName}] ${msg}`, meta),
            info: (msg: string, meta?: Record<string, unknown>) =>
              logger.info(`[${agentName}] ${msg}`, meta),
            warn: (msg: string, meta?: Record<string, unknown>) =>
              logger.warn(`[${agentName}] ${msg}`, meta),
            error: (msg: string, meta?: Record<string, unknown>) =>
              logger.error(`[${agentName}] ${msg}`, meta),
          },
          config: {},
        };

        const result = await this.execute(
          {
            nlTestCases: state.nlTestCases,
            elementsByPage:
              state.verifiedElementsByPage.size > 0
                ? state.verifiedElementsByPage
                : state.elementsByPage,
            config: state.config,
            fakerSeed: state.config?.fakerSeed,
          },
          context,
        );

        logger.info(
          `[${agentName}] Generated test data for ${result.testDataByTest.size} tests`,
        );

        return {
          ...stageUpdate,
          testDataByTest: result.testDataByTest,
          completedStages: [...state.completedStages, agentName],
          currentStage: null,
          executionLogs: appendLog(
            state,
            agentName,
            "info",
            `Generated test data for ${result.testDataByTest.size} tests`,
            { entryCount: result.testDataByTest.size },
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
    input: TestDataGenerationInput,
    context: AgentContext,
  ): Promise<TestDataGenerationOutput> {
    const { nlTestCases, elementsByPage, config, fakerSeed } = input;
    const { logger } = context;

    // Seed faker for reproducibility. Default seed 42 — same input ⇒ same output.
    const seed = fakerSeed ?? config?.fakerSeed ?? 42;
    seedTestData(seed);
    logger.info(`[TestDataGenerationAgent] Seeded faker (seed=${seed})`);

    const testDataByTest = new Map<string, Record<string, unknown>>();

    for (const testCase of nlTestCases) {
      try {
        const testData = this.generateSmartDataForTest(testCase, logger);
        testDataByTest.set(testCase.id, testData);
      } catch (error) {
        logger.warn(
          `Failed to generate data for test case ${testCase.id}: ${error instanceof Error ? error.message : String(error)}`,
        );
        // Continue with other test cases
      }
    }

    logger.info("Test data generation complete", {
      testsProcessed: testDataByTest.size,
    });

    return {
      testDataByTest,
    };
  }

  /**
   * Generate test data by matching actions to UI elements.
   */
  generateSmartDataForTest(
    testCase: NLTestCase,
    logger: any,
  ): Record<string, unknown> {
    const data: Record<string, unknown> = {};
    const elementsToProcess =
      testCase.interactiveElements && testCase.interactiveElements.length > 0
        ? testCase.interactiveElements
        : [];

    if (elementsToProcess.length === 0) {
      logger.debug(
        `No interactive elements available for ${testCase.id}, using fallback generation`,
      );
      return {};
    }

    const processedFields = new Set<string>();

    for (const element of elementsToProcess) {
      // Skip disabled / read-only elements: they cannot be filled and need no data.
      if (element.disabled) {
        continue;
      }

      const fieldId = getElementDataKey(element);

      if (processedFields.has(fieldId)) {
        continue;
      }
      processedFields.add(fieldId);

      const generatedValue = generateDataForElement(element);
      data[fieldId] = generatedValue;
    }

    if (Object.keys(data).length === 0) {
      logger.debug(
        `No interactive elements generated data for ${testCase.id}, using fallback`,
      );
      return {};
    }

    return data;
  }
}
