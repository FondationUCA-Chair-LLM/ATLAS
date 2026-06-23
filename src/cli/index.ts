/**
 * LangGraph CLI
 * Command-line interface for running the LangGraph-based pipeline
 */

import { Command } from "commander";
import { LangGraphOrchestrator } from "../orchestrator";
import { loadConfigFromFile } from "../utils/load_config";
import { PipelineConfig } from "../types";

const program = new Command();

program
  .name("langgraph-agent")
  .description("LangGraph-based multi-agent test generation pipeline")
  .version("1.0.0");

/**
 * Run command - Execute the full pipeline
 */
program
  .command("run")
  .description("Run the test generation pipeline")
  .option("-m, --mode <mode>", "Execution mode (full, from-stage)", "full")
  .option(
    "-s, --start-stage <stage>",
    "Stage to resume from (for from-stage mode)",
  )
  .option("-a, --app <name>", "App config to use from config.json")
  .option("--thread-id <id>", "Thread ID for resuming")
  .action(async (options) => {
    console.log("\nLangGraph Test Generation Pipeline\n");

    const config = loadConfigFromFile(options.app);

    const pipelineConfig: PipelineConfig = {
      mode: options.mode,
      startStage: options.startStage,
      config,
      threadId: options.threadId,
      // outputDir: options.output,
    };
    console.log(pipelineConfig);

    const orchestrator = new LangGraphOrchestrator();
    const result = await orchestrator.runPipeline(pipelineConfig);

    console.log("\n" + "=".repeat(60));
    if (result.success) {
      console.log("Pipeline completed successfully");
      console.log(`Output saved to: ${config.outputDir}`);
      console.log(`Duration: ${result.durationMs}ms`);
      console.log(`Generated ${result.state.nlTestCases.length} test cases`);
      console.log(
        `Generated ${result.state.generatedTestFiles.size} test files`,
      );
    } else {
      console.log("Pipeline failed");
      console.log(`Error: ${result.error}`);
      console.log(`Duration: ${result.durationMs}ms`);
      process.exit(1);
    }
    console.log("=".repeat(60) + "\n");
  });

// Run the CLI
if (require.main === module) {
  program.parse();
}

export { program };
