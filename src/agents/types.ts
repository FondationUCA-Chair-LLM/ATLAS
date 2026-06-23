/**
 * Simplified Agent Types for LangGraph
 * Independent of the existing agent system - designed specifically for LangGraph nodes
 */

import {
  ConfigMemory,
  ConsistencyReport,
  ExtractionResult,
  Graph,
  NavigationGraph,
  NLTestCase,
  OcrExtractionResult,
  OcrTextRegion,
  TestPath,
  UIElement,
  VerificationResult,
} from "../types";

// ============================================================================
// BASE AGENT INTERFACE
// ============================================================================

/**
 * Simplified agent interface for LangGraph
 * Each agent is a pure function that transforms state
 */
export interface SimpleAgent<TInput, TOutput> {
  /** Agent name */
  readonly name: string;

  /** Agent description */
  readonly description: string;

  /** Execute the agent's task */
  execute(input: TInput, context: AgentContext): Promise<TOutput>;
}

/**
 * Context provided to agents during execution
 */
export interface AgentContext {
  /** Execution ID */
  executionId: string;

  /** Logger for agent output */
  logger: Logger;

  /** Agent configuration from environment */
  config: Record<string, unknown>;
}

/**
 * Simple logger interface
 */
export interface Logger {
  debug(message: string, meta?: Record<string, unknown>): void;
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, meta?: Record<string, unknown>): void;
}

// ============================================================================
// AGENT-SPECIFIC INPUT/OUTPUT TYPES
// ============================================================================

/** Input Loader Agent */
export interface InputLoaderInput {
  config: ConfigMemory;
}

export interface InputLoaderOutput {
  graphRaw: NavigationGraph | null;
  graphProcessed: Graph;
  metadata: Graph;
}

/** Backward compatibility */
export type FigmaExtractionInput = InputLoaderInput;
export type FigmaExtractionOutput = InputLoaderOutput;

/** Path Generation Agent */
export interface PathGenerationInput {
  graphProcessed: Graph;
  startNode: string;
}

export interface PathGenerationOutput {
  allPaths: TestPath[];
  selectedPaths: TestPath[];
}

/** Element Extraction Agent */
export interface ElementExtractionInput {
  graphProcessed: Graph;
  config: ConfigMemory;
}

export interface ElementExtractionOutput {
  elementsByPage: Map<string, UIElement[]>;
  extractionResults: ExtractionResult[];
}

/** OCR Extraction Agent */
export interface OcrExtractionInput {
  graphProcessed: Graph;
  config: ConfigMemory;
}

export interface OcrExtractionOutput {
  ocrResults: OcrExtractionResult[];
  ocrTextByPage: Map<string, OcrTextRegion[]>;
}

/** Element Verification Agent */
export interface ElementVerificationInput {
  graphProcessed: Graph;
  elementsByPage: Map<string, UIElement[]>;
}

export interface ElementVerificationOutput {
  verifiedElementsByPage: Map<string, UIElement[]>;
  verificationResults: VerificationResult[];
}

/** Assertion Generation Agent */
export interface AssertionGenerationInput {
  verifiedElementsByPage: Map<string, UIElement[]>;
}

/** Backward compatibility - use verified elements if available, fall back to raw */
export interface AssertionGenerationInputRaw {
  elementsByPage: Map<string, UIElement[]>;
}

export interface AssertionGenerationOutput {
  assertionsByPage: Map<string, string[]>;
  assertionWeights: Map<string, number>;
}

/** NL Test Builder Agent */
export interface NLTestBuilderInput {
  selectedPaths: TestPath[];
  assertionsByPage: Map<string, string[]>;
  elementsByPage: Map<string, UIElement[]>;
  config?: ConfigMemory;
}

export interface NLTestBuilderOutput {
  nlTestsByPath: Map<string, NLTestCase>;
  nlTestCases: NLTestCase[];
}

/** Test Data Generation Agent */
export interface TestDataGenerationInput {
  nlTestCases: NLTestCase[];
  elementsByPage: Map<string, UIElement[]>;
  config?: ConfigMemory;
  /** Optional faker seed override (otherwise read from `config.fakerSeed`). */
  fakerSeed?: number;
}

export interface TestDataGenerationOutput {
  testDataByTest: Map<string, Record<string, unknown>>;
}

export interface SemanticConsistencyInput {
  nlTestCases: NLTestCase[];
  selectedPaths: TestPath[];
  elementsByPage: Map<string, UIElement[]>;
  assertionsByPage: Map<string, string[]>;
  testDataByTest: Map<string, Record<string, unknown>>;
  config: ConfigMemory;
}

export interface SemanticConsistencyOutput {
  consistencyReports: Map<string, ConsistencyReport>;
  validTestCases: NLTestCase[];
  invalidTestCases: NLTestCase[];
}

/** Code Generation Agent */
export interface CodeGenerationInput {
  validTestCases: NLTestCase[];
  invalidTestCases: NLTestCase[];
  testDataByTest: Map<string, Record<string, unknown>>;
  config: ConfigMemory;
}

export interface CodeGenerationOutput {
  generatedTestFiles: Map<string, string>;
}
