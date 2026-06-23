/**
 * LangGraph Multi-Agent System - Main Entry Point
 *
 * This is the main entry point for the LangGraph-based test generation pipeline.
 * It provides a clean API for running the pipeline programmatically.
 *
 */

export {
  LangGraphOrchestrator,
  createLangGraphOrchestrator,
} from "./orchestrator";
export { createTestGenerationGraph } from "./graph";
export {
  createInitialState,
  appendLog,
  addError,
  setCurrentStage,
  markStageComplete,
  type LangGraphState,
  type ExecutionError,
  type ExecutionLogEntry,
  type ConfigMemory,
} from "./types";
export {
  generateThreadId,
  createLogger,
  toRunnableConfig,
} from "./utils/utils";

export {
  figmaExtractionNode,
  pathGenerationNode,
  elementExtractionNode,
  assertionGenerationNode,
  nlTestBuilderNode,
  semanticConsistencyNode,
  testDataGenerationNode,
  codeGenerationNode,
} from "./nodes";

import { LangGraphOrchestrator } from "./orchestrator";
import { PipelineConfig, PipelineResult } from "./types";
import { loadConfigFromFile } from "./utils/load_config";

export async function runPipeline(
  config: PipelineConfig,
): Promise<PipelineResult> {
  const orchestrator = new LangGraphOrchestrator();
  return orchestrator.runPipeline(config);
}

/**
 * Main execution for direct script running
 */
export async function main(app?: string): Promise<void> {
  console.log("\nLangGraph Multi-Agent Test Generation\n");

  try {
    const config = loadConfigFromFile(app);

    console.log("Configuration:");
    console.log(`  Model: ${config.modelId}`);
    console.log(`  Vision Model: ${config.visionModelId}`);
    console.log(`  Output Dir: ${config.outputDir}`);
    console.log();

    const result = await runPipeline({
      config,
    });

    if (result.success) {
      console.log("\nPipeline completed successfully!");
      console.log(
        `   Generated ${result.state.generatedTestFiles.size} test files`,
      );
      console.log(`   Duration: ${result.durationMs}ms`);
    } else {
      console.error("\nPipeline failed:");
      console.error(`   ${result.error}`);
      process.exit(1);
    }
  } catch (error) {
    console.error("\nFatal error:");
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// Run main if this file is executed directly
if (require.main === module) {
  main();
}
