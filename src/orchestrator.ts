/**
 * LangGraph Orchestrator
 * Runs the test generation pipeline using LangGraph
 */

import { createInitialState } from ".";
import { createTestGenerationGraph } from "./graph";
import type { LangGraphState, PipelineConfig, PipelineResult } from "./types";
import { generateThreadId, serializeState } from "./utils/utils";
import { loadLatestState } from "./utils/load_state";
import { resolvePlaceholdersInTestCase } from "./utils/test-data-resolver.js";

const STAGE_ORDER = [
  "InputLoaderAgent",
  "PathGenerationAgent",
  "ElementExtractionAgent",
  "ElementVerificationAgent",
  "AssertionGenerationAgent",
  "NLTestBuilderAgent",
  "TestDataGenerationAgent",
  "SemanticConsistencyAgent",
  "CodeGenerationAgent",
];

/**
 * LangGraph-based orchestrator for the test generation pipeline
 */
export class LangGraphOrchestrator {
  private graph = createTestGenerationGraph();

  private async resolveInitialState(
    config: PipelineConfig,
  ): Promise<LangGraphState> {
    if (config.mode !== "from-stage" || !config.startStage) {
      return createInitialState(config.config);
    }

    const saved = await loadLatestState(config.config.outputDir || "./out");
    if (!saved) {
      console.warn("No previous run found, starting from scratch");
      return createInitialState(config.config);
    }

    saved.config = config.config;
    const startIndex = STAGE_ORDER.indexOf(config.startStage);
    const stagesToKeep =
      startIndex >= 0
        ? STAGE_ORDER.slice(0, startIndex)
        : saved.completedStages;
    saved.completedStages = saved.completedStages.filter((s) =>
      stagesToKeep.includes(s),
    );
    console.log(
      `Resuming from stage ${config.startStage}. Kept stages: ${saved.completedStages.join(", ")}`,
    );
    return saved;
  }

  /**
   * Run the complete pipeline
   */
  async runPipeline(config: PipelineConfig): Promise<PipelineResult> {
    const startTime = Date.now();
    const threadId = config.threadId || generateThreadId();

    console.log(`[LangGraphOrchestrator] Starting pipeline`);
    console.log(`  Thread ID: ${threadId}`);
    console.log(`  Mode: ${config.mode || "full"}`);

    try {
      const initialState = await this.resolveInitialState(config);

      // Invoke the graph with thread_id in configurable
      const result = await this.graph.invoke(initialState, {
        configurable: {
          thread_id: threadId,
          checkpoint_ns: "test_generation",
        },
      });

      const duration = Date.now() - startTime;

      // Cast result to LangGraphState
      const finalState = result as unknown as LangGraphState;

      console.log(`\n[LangGraphOrchestrator] Pipeline completed`);
      console.log(`  Duration: ${duration}ms`);
      console.log(
        `  Completed stages: ${finalState.completedStages.join(", ")}`,
      );

      // Save results if output dir specified
      if (config.config.outputDir) {
        await this.saveResults(finalState, config.config.outputDir);
      }

      return {
        success: finalState.executionErrors.length === 0,
        state: finalState,
        durationMs: duration,
      };
    } catch (error) {
      console.log(error);
      const duration = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      console.error(`[LangGraphOrchestrator] Pipeline failed: ${errorMessage}`);

      return {
        success: false,
        state: createInitialState(config.config),
        error: errorMessage,
        durationMs: duration,
      };
    }
  }

  /**
   * Get the current state for a thread (for debugging/resuming)
   */
  async getThreadState(threadId: string): Promise<LangGraphState | null> {
    try {
      const state = await this.graph.getState({
        configurable: {
          thread_id: threadId,
          checkpoint_ns: "test_generation",
        },
      });
      return state as unknown as LangGraphState;
    } catch {
      return null;
    }
  }

  /**
   * Get the graph structure for visualization
   */
  getGraphStructure() {
    return this.graph.getGraph();
  }

  /**
   * Save final results to disk with versioned directory
   */
  private async saveResults(
    state: LangGraphState,
    outputDir: string,
  ): Promise<void> {
    const fs = await import("fs/promises");
    const path = await import("path");

    // Create versioned subdirectory with timestamp
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .slice(0, -5); // Format: 2026-05-06T14-30-00
    const versionedDir = path.join(outputDir, `run-${timestamp}`);
    await fs.mkdir(versionedDir, { recursive: true });

    // Save full state for debugging (strip verbose logs)
    const fullStatePath = path.join(versionedDir, "langgraph-full-state.json");
    const serializedState = serializeState(state);
    delete (serializedState as Record<string, unknown>).executionLogs;
    await fs.writeFile(
      fullStatePath,
      JSON.stringify(serializedState, null, 2),
      "utf8",
    );

    // Resolve placeholders in NL test cases using generated test data
    const resolvedValidNlTestCases = state.validTestCases.map((tc) => {
      const testData = state.testDataByTest?.get(tc.id);
      return resolvePlaceholdersInTestCase(tc, testData);
    });

    // Save NL test cases separately with only essential fields
    const strippedNlTestCases = resolvedValidNlTestCases.map((tc) => ({
      id: tc.id,
      name: tc.name,
      description: tc.description,
      actions: tc.actions,
      pathId: tc.pathId,
      assertions: tc.assertions,
    }));

    const nlTestsPath = path.join(versionedDir, "valid-nl-testcases.json");
    await fs.writeFile(
      nlTestsPath,
      JSON.stringify(strippedNlTestCases, null, 2),
      "utf8",
    );

    // Save invalid test cases with reasons from consistency reports
    if (state.invalidTestCases?.length > 0) {
      const resolvedInvalidNlTestCases = state.invalidTestCases.map((tc) => {
        const testData = state.testDataByTest?.get(tc.id);
        return resolvePlaceholdersInTestCase(tc, testData);
      });
      const invalidEntries = resolvedInvalidNlTestCases.map((tc) => {
        const report = state.consistencyReports.get(tc.id);
        return {
          id: tc.id,
          name: tc.name,
          description: tc.description,
          actions: tc.actions,
          pathId: tc.pathId,
          assertions: tc.assertions,
          reasons: report?.issues || [],
        };
      });
      const invalidPath = path.join(versionedDir, "invalid-nl-testcases.json");
      await fs.writeFile(
        invalidPath,
        JSON.stringify(invalidEntries, null, 2),
        "utf8",
      );
    }

    // Save generated test files
    for (const [filename, content] of state.generatedTestFiles.entries()) {
      const filePath = path.join(versionedDir, filename);
      await fs.writeFile(filePath, content, "utf8");
    }

    // Save state summary
    const summaryPath = path.join(versionedDir, "langgraph-state-summary.json");
    const summary = {
      completedStages: state.completedStages,
      totalPaths: state.selectedPaths.length,
      totalTestCases: state.nlTestCases.length,
      totalTestFiles: state.generatedTestFiles.size,
      errors: state.executionErrors.map((e) => ({
        agent: e.agent,
        message: e.message,
        timestamp: e.timestamp.toISOString(),
      })),
    };
    await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2), "utf8");

    console.log(`[LangGraphOrchestrator] Results saved to ${versionedDir}`);
  }
}

/**
 * Factory function to create a configured orchestrator
 */
export function createLangGraphOrchestrator(): LangGraphOrchestrator {
  return new LangGraphOrchestrator();
}
