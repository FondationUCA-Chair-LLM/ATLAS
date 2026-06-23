/**
 * LangGraph StateGraph Definition
 * Defines the multi-agent pipeline as a state graph
 */

import { StateGraph, Annotation, START, END } from "@langchain/langgraph";
import type { LangGraphState } from "./types";
import {
  inputLoaderNode,
  pathGenerationNode,
  elementExtractionNode,
  elementVerificationNode,
  assertionGenerationNode,
  nlTestBuilderNode,
  semanticConsistencyNode,
  testDataGenerationNode,
  codeGenerationNode,
} from "./nodes";

/**
 * State annotation for LangGraph
 * Defines the shape of the state and how updates are merged
 */
export const StateAnnotation = Annotation.Root({
  // Config is static - no reducer needed
  config: Annotation<LangGraphState["config"]>({
    default: () => ({}) as LangGraphState["config"],
    reducer: (x, y) => y ?? x,
  }),

  // Graph fields
  graphRaw: Annotation<LangGraphState["graphRaw"]>({
    default: () => null,
    reducer: (x, y) => y ?? x,
  }),
  graphProcessed: Annotation<LangGraphState["graphProcessed"]>({
    default: () => ({
      source: undefined,
      extractedAt: null,
      totalNodes: 0,
      totalEdges: 0,
    }),
    reducer: (x, y) => y ?? x,
  }),
  graphMetadata: Annotation<LangGraphState["graphMetadata"]>({
    default: () => ({
      source: undefined,
      extractedAt: null,
      totalNodes: 0,
      totalEdges: 0,
    }),
    reducer: (x, y) => y ?? x,
  }),

  // Paths - append new paths
  allPaths: Annotation<LangGraphState["allPaths"]>({
    default: () => [],
    reducer: (x, y) => [...(x || []), ...(y || [])],
  }),
  selectedPaths: Annotation<LangGraphState["selectedPaths"]>({
    default: () => [],
    reducer: (x, y) => [...(x || []), ...(y || [])],
  }),
  pathCoverage: Annotation<LangGraphState["pathCoverage"]>({
    default: () => ({
      nodeCoverage: [],
      edgeCoverage: [],
      edgePairCoverage: [],
    }),
    reducer: (x, y) =>
      y ?? x ?? { nodeCoverage: [], edgeCoverage: [], edgePairCoverage: [] },
  }),

  // Elements - merge maps
  elementsByPage: Annotation<LangGraphState["elementsByPage"]>({
    default: () => new Map(),
    reducer: (x, y) => new Map([...(x || []), ...(y || [])]),
  }),
  extractionResults: Annotation<LangGraphState["extractionResults"]>({
    default: () => [],
    reducer: (x, y) => [...(x || []), ...(y || [])],
  }),
  elementLocators: Annotation<LangGraphState["elementLocators"]>({
    default: () => new Map(),
    reducer: (x, y) => new Map([...(x || []), ...(y || [])]),
  }),

  // OCR and Verification
  ocrResults: Annotation<LangGraphState["ocrResults"]>({
    default: () => [],
    reducer: (x, y) => [...(x || []), ...(y || [])],
  }),
  ocrTextByPage: Annotation<LangGraphState["ocrTextByPage"]>({
    default: () => new Map(),
    reducer: (x, y) => new Map([...(x || []), ...(y || [])]),
  }),
  verifiedElementsByPage: Annotation<LangGraphState["verifiedElementsByPage"]>({
    default: () => new Map(),
    reducer: (x, y) => new Map([...(x || []), ...(y || [])]),
  }),
  verificationResults: Annotation<LangGraphState["verificationResults"]>({
    default: () => [],
    reducer: (x, y) => [...(x || []), ...(y || [])],
  }),

  // Assertions - merge maps
  assertionsByPage: Annotation<LangGraphState["assertionsByPage"]>({
    default: () => new Map(),
    reducer: (x, y) => new Map([...(x || []), ...(y || [])]),
  }),
  assertionWeights: Annotation<LangGraphState["assertionWeights"]>({
    default: () => new Map(),
    reducer: (x, y) => new Map([...(x || []), ...(y || [])]),
  }),

  // NL Tests - merge maps and append array
  nlTestsByPath: Annotation<LangGraphState["nlTestsByPath"]>({
    default: () => new Map(),
    reducer: (x, y) => new Map([...(x || []), ...(y || [])]),
  }),
  nlTestCases: Annotation<LangGraphState["nlTestCases"]>({
    default: () => [],
    reducer: (x, y) => y ?? x,
  }),
  validTestCases: Annotation<LangGraphState["validTestCases"]>({
    default: () => [],
    reducer: (x, y) => y ?? x,
  }),
  invalidTestCases: Annotation<LangGraphState["invalidTestCases"]>({
    default: () => [],
    reducer: (x, y) => y ?? x,
  }),

  // Semantic Consistency Reports
  consistencyReports: Annotation<LangGraphState["consistencyReports"]>({
    default: () => new Map(),
    reducer: (x, y) => new Map([...(x || []), ...(y || [])]),
  }),

  // Test Data - merge maps
  testDataByTest: Annotation<LangGraphState["testDataByTest"]>({
    default: () => new Map(),
    reducer: (x, y) => new Map([...(x || []), ...(y || [])]),
  }),

  // Code - merge maps
  generatedTestFiles: Annotation<LangGraphState["generatedTestFiles"]>({
    default: () => new Map(),
    reducer: (x, y) => new Map([...(x || []), ...(y || [])]),
  }),

  // Execution state
  currentStage: Annotation<LangGraphState["currentStage"]>({
    default: () => null,
    reducer: (x, y) => y ?? x,
  }),
  completedStages: Annotation<LangGraphState["completedStages"]>({
    default: () => [],
    reducer: (x, y) => [...new Set([...(x || []), ...(y || [])])],
  }),
  executionErrors: Annotation<LangGraphState["executionErrors"]>({
    default: () => [],
    reducer: (x, y) => [...(x || []), ...(y || [])],
  }),
  executionLogs: Annotation<LangGraphState["executionLogs"]>({
    default: () => [],
    reducer: (_x, y) => y || [],
  }),
});

/**
 * Create the test generation StateGraph
 *
 * Pipeline Flow:
 * START -> extract_figma -> [generate_paths, extract_elements] (parallel)
 * generate_paths -> build_nl_tests
 * extract_elements -> generate_assertions
 * extract_elements -> build_nl_tests
 * generate_assertions -> build_nl_tests
 * build_nl_tests -> generate_test_data -> generate_code -> END
 */
export function createTestGenerationGraph() {
  // Define the state graph using the annotation
  const graph = new StateGraph(StateAnnotation);

  // Add all nodes
  graph.addNode("load_input", inputLoaderNode);
  graph.addNode("generate_paths", pathGenerationNode);
  graph.addNode("extract_elements", elementExtractionNode);
  graph.addNode("verify_elements", elementVerificationNode);
  graph.addNode("generate_assertions", assertionGenerationNode);
  graph.addNode("build_nl_tests", nlTestBuilderNode);
  graph.addNode("semantic_check", semanticConsistencyNode);
  graph.addNode("generate_test_data", testDataGenerationNode);
  graph.addNode("generate_code", codeGenerationNode);

  // Define execution flow
  // @ts-expect-error LangGraph addEdge types are overly strict with Annotation.Root
  graph.addEdge(START, "load_input");
  //  @ts-expect-error LangGraph addEdge types are overly strict with Annotation.Root
  graph.addEdge("load_input", "generate_paths");
  // @ts-expect-error LangGraph addEdge types are overly strict with Annotation.Root
  graph.addEdge("load_input", "extract_elements");
  // @ts-expect-error LangGraph addEdge types are overly strict with Annotation.Root
  graph.addEdge("extract_elements", "verify_elements");
  // @ts-expect-error LangGraph addEdge types are overly strict with Annotation.Root
  graph.addEdge("verify_elements", "generate_assertions");
  // @ts-expect-error LangGraph addEdge types are overly strict with Annotation.Root
  graph.addEdge(["generate_paths", "generate_assertions"], "build_nl_tests");
  // @ts-expect-error LangGraph addEdge types are overly strict with Annotation.Root
  graph.addEdge("build_nl_tests", "generate_test_data");
  // @ts-expect-error LangGraph addEdge types are overly strict with Annotation.Root
  graph.addEdge("generate_test_data", "semantic_check");
  // @ts-expect-error LangGraph addEdge types are overly strict with Annotation.Root
  graph.addEdge("semantic_check", "generate_code");
  // @ts-expect-error LangGraph addEdge types are overly strict with Annotation.Root
  graph.addEdge("generate_code", END);

  // Compile the graph
  return graph.compile();
}
