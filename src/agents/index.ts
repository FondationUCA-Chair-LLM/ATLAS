/**
 * Simplified Agents for LangGraph
 * Independent agent implementations specifically designed for LangGraph
 */

// Export types
export * from "./types";

// Export agent implementations
export { InputLoaderAgent } from "./input-loader-agent";
export { PathGenerationAgent } from "./path-generation-agent";
export { ElementExtractionAgent } from "./element-extraction-agent";
export { AssertionGenerationAgent } from "./assertion-generation-agent";
export { NLTestBuilderAgent } from "./nl-test-builder-agent";
export { TestDataGenerationAgent } from "./test-data-generation-agent";
export { CodeGenerationAgent } from "./code-generation-agent";
export { SemanticConsistencyAgent } from "./semantic-consistency-agent";

// Backward compatibility: FigmaExtractionAgent is now InputLoaderAgent
export { InputLoaderAgent as FigmaExtractionAgent } from "./input-loader-agent";

// Re-export agent types
import type { InputLoaderAgent } from "./input-loader-agent";
import type { PathGenerationAgent } from "./path-generation-agent";
import type { ElementExtractionAgent } from "./element-extraction-agent";
import type { AssertionGenerationAgent } from "./assertion-generation-agent";
import type { NLTestBuilderAgent } from "./nl-test-builder-agent";
import type { TestDataGenerationAgent } from "./test-data-generation-agent";
import type { CodeGenerationAgent } from "./code-generation-agent";
import type { SemanticConsistencyAgent } from "./semantic-consistency-agent";

// Export agent factory for easy instantiation
export interface AgentSet {
  inputLoader: InputLoaderAgent;
  pathGeneration: PathGenerationAgent;
  elementExtraction: ElementExtractionAgent;
  assertionGeneration: AssertionGenerationAgent;
  nlTestBuilder: NLTestBuilderAgent;
  semanticConsistency: SemanticConsistencyAgent;
  testDataGeneration: TestDataGenerationAgent;
  codeGeneration: CodeGenerationAgent;
}

export function createAgents(): AgentSet {
  // Dynamic imports to avoid circular dependency issues
  const {
    InputLoaderAgent: InputAgent,
  } = require("./input-loader-agent");
  const { PathGenerationAgent: PathAgent } = require("./path-generation-agent");
  const {
    ElementExtractionAgent: ElementAgent,
  } = require("./element-extraction-agent");
  const {
    AssertionGenerationAgent: AssertionAgent,
  } = require("./assertion-generation-agent");
  const { NLTestBuilderAgent: NLAgent } = require("./nl-test-builder-agent");
  const {
    SemanticConsistencyAgent: SemanticAgent,
  } = require("./semantic-consistency-agent");
  const {
    TestDataGenerationAgent: TestDataAgent,
  } = require("./test-data-generation-agent");
  const { CodeGenerationAgent: CodeAgent } = require("./code-generation-agent");

  return {
    inputLoader: new InputAgent(),
    pathGeneration: new PathAgent(),
    elementExtraction: new ElementAgent(),
    assertionGeneration: new AssertionAgent(),
    nlTestBuilder: new NLAgent(),
    semanticConsistency: new SemanticAgent(),
    testDataGeneration: new TestDataAgent(),
    codeGeneration: new CodeAgent(),
  };
}
