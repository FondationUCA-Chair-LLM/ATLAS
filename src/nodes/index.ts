/**
 * LangGraph Nodes - Export all node functions from agents
 *
 * Each agent provides an `asNode()` method that returns a LangGraph-compatible
 * node function. This keeps the node logic co-located with the agent.
 */

import { InputLoaderAgent } from "../agents/input-loader-agent";
import { PathGenerationAgent } from "../agents/path-generation-agent";
import { ElementExtractionAgent } from "../agents/element-extraction-agent";
import { ElementVerificationAgent } from "../agents/element-verification-agent";
import { OcrExtractionAgent } from "../agents/ocr-extraction-agent";
import { AssertionGenerationAgent } from "../agents/assertion-generation-agent";
import { NLTestBuilderAgent } from "../agents/nl-test-builder-agent";
import { TestDataGenerationAgent } from "../agents/test-data-generation-agent";
import { CodeGenerationAgent } from "../agents/code-generation-agent";
import { SemanticConsistencyAgent } from "../agents/semantic-consistency-agent";
import { withSkipCheck } from "../utils/utils";

// Create agent instances
const inputLoaderAgent = new InputLoaderAgent();
const pathAgent = new PathGenerationAgent();
const elementAgent = new ElementExtractionAgent();
const verificationAgent = new ElementVerificationAgent();
const assertionAgent = new AssertionGenerationAgent();
const nlAgent = new NLTestBuilderAgent();
const semanticAgent = new SemanticConsistencyAgent();
const testDataAgent = new TestDataGenerationAgent();
const codeAgent = new CodeGenerationAgent();

// Export node functions using asNode() method, wrapped with skip check
export const inputLoaderNode = withSkipCheck(
  inputLoaderAgent.asNode(),
  inputLoaderAgent.name,
);

// Backward compatibility
export const figmaExtractionNode = withSkipCheck(
  inputLoaderAgent.asNode(),
  inputLoaderAgent.name,
);
export const pathGenerationNode = withSkipCheck(
  pathAgent.asNode(),
  pathAgent.name,
);
export const elementExtractionNode = withSkipCheck(
  elementAgent.asNode(),
  elementAgent.name,
);
export const elementVerificationNode = withSkipCheck(
  verificationAgent.asNode(),
  verificationAgent.name,
);
export const assertionGenerationNode = withSkipCheck(
  assertionAgent.asNode(),
  assertionAgent.name,
);
export const nlTestBuilderNode = withSkipCheck(
  nlAgent.asNode(),
  nlAgent.name,
);
export const semanticConsistencyNode = withSkipCheck(
  semanticAgent.asNode(),
  semanticAgent.name,
);
export const testDataGenerationNode = withSkipCheck(
  testDataAgent.asNode(),
  testDataAgent.name,
);
export const codeGenerationNode = withSkipCheck(
  codeAgent.asNode(),
  codeAgent.name,
);

// OCR extraction (optional, not in main graph)
export const ocrExtractionNode = new OcrExtractionAgent().asNode();
