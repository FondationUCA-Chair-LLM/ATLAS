/**
 * LangGraph Multi-Agent System - State Types
 * Completely independent types - no dependency on old agent system
 */

// ============================================================================
// DOMAIN TYPES (local copy - independent of old agents)
// ============================================================================

export interface PipelineConfig {
  /** Execution mode: full (run everything) or from-stage (resume) */
  mode?: "full" | "from-stage";

  /** Stage to resume from (for "from-stage" mode) */
  startStage?: string;

  /** Configuration loaded from environment */
  config: ConfigMemory;

  /** Optional thread ID for resuming */
  threadId?: string;

  /** Output directory for results */
  // outputDir?: string;
}

export interface PipelineResult {
  success: boolean;
  state: LangGraphState;
  error?: string;
  durationMs: number;
}

/** Configuration from environment variables */
export interface ConfigMemory {
  figmaToken: string;
  figmaFileKey?: string;
  useCachedElements?: boolean;
  useCachedFigmaResponse?: boolean;
  inputPath?: string;
  ollamaUrl: string;
  modelId: string;
  inputSource?: "figma" | "manual";
  visionModelId: string;
  outputDir: string;
  targetUrl: string;
  startNode: string;
  enableConsistencyCheck: boolean;
  generateInvalidTests: boolean;
  /** Deterministic seed for the faker-backed test-data generator. */
  fakerSeed?: number;
  /** Locale code used by faker (e.g. "en", "de", "fr"). Defaults to "en". */
  fakerLocale?: string;
  debug?: boolean;
}

/** Screen state from Figma */
export interface ScreenState {
  id: string;
  name: string;
  widgets: WidgetItem[];
  interactions: InteractionEdge[];
}

export interface WidgetItem {
  id: string;
  label: string;
  type: string;
  actionable: boolean;
}

export interface InteractionEdge {
  from_screen: string;
  to_screen: string;
  action: string;
  label: string;
}

/** Navigation graph from Figma */
export interface NavigationGraph {
  nodes: ScreenState[];
  edges: InteractionEdge[];
}

/** Internal graph representation */
export interface Graph {
  source?: "figma" | "manual" | "json" | "cache";
  extractedAt?: Date | null;
  totalNodes?: number;
  totalEdges?: number;
  nodes?: Map<string, GraphNode>;
  edges?: Map<string, GraphEdge[]>;
}

export interface GraphNode {
  id: string;
  name: string;
  data: Record<string, unknown>;
}

export interface GraphEdge {
  from: string;
  to: string;
  action: string;
  label: string;
  weight?: number;
}

/** Test path through the application */
export interface TestPath {
  id: string;
  name: string;
  steps: PathStep[];
  startNode: string;
  endNode: string;
  metadata?: Record<string, unknown>;
}

export interface PathStep {
  from: string;
  to: string;
  action: string;
  label: string;
}

/** UI Element extracted from page */
export interface UIElement {
  id?: string;
  type:
    | "button"
    | "input"
    | "link"
    | "text"
    | "select"
    | "checkbox"
    | "radio"
    | "textarea"
    | "unknown";
  label?: string;
  /** Text content of element (e.g., button text, visible value, or link text) */
  text?: string;
  /** Placeholder text from input field */
  placeholder?: string;
  /** Extracted user-visible value for inputs/selects/textareas */
  value?: string;
  /** Checkbox or radio checked state if visible */
  checked?: boolean;
  /** Whether field is marked as required (e.g., asterisk in design) */
  required?: boolean;
  /** Additional HTML attributes if available (e.g., name, id, data-* attributes) */
  attributes?: Record<string, string>;
  isIcon?: boolean;
  /** Whether the element is visibly disabled, dimmed, greyed out, or read-only. */
  disabled?: boolean;
}

/** Extraction result from a page */
export interface ExtractionResult {
  // page: string;
  // pageId: string;
  elements: UIElement[];
  // imageFile?: string;
  // pageText?: string;
}

/** OCR text region detected in a screenshot */
export interface OcrTextRegion {
  text: string;
  confidence: number;
  boundingBox: { x: number; y: number; width: number; height: number };
}

/** OCR extraction result for a page */
export interface OcrExtractionResult {
  page: string;
  pageId: string;
  imageFile: string;
  textRegions: OcrTextRegion[];
  fullText?: string;
}

/** Verification result for a page */
export interface VerificationResult {
  page: string;
  pageId: string;
  confidence: "high" | "medium" | "low";
  issues: VerificationIssue[];
  navigationAligned: boolean;
  ocrAligned: boolean;
}

/** Issue found during verification */
export interface VerificationIssue {
  severity: "error" | "warning" | "info";
  message: string;
  elementId?: string;
  expectedLabel?: string;
  actualLabel?: string;
  ocrText?: string;
  vlmText?: string;
}

/** Natural language test case */
export interface NLTestCase {
  id: string;
  name: string;
  description?: string;
  actions: string[];
  assertions: string[];
  pathId?: string;
  metadata?: Record<string, unknown>;
  interactiveElements?: UIElement[];
  /**
   * 1:1 with `actions`. Same length. `actions[i]` is the human-readable form of
   * `structuredActions[i]`. Old testcases may omit this; code-gen falls back to
   * the parser-driven path when missing.
   */
  structuredActions?: NLActionStep[];
  /**
   * Per-page interactive element lists keyed by pageId, scoped to the pages
   * visited by this testcase's path. Used to resolve `elementIndex` recorded
   * on `structuredActions` back to the actual `UIElement`.
   */
  elementsByPage?: Record<string, UIElement[]>;
  data?: Record<string, unknown>;
}

/**
 * Builder-side metadata that pairs 1:1 with `NLTestCase.actions[i]`.
 * Records the exact element each NL string refers to so code generation can
 * look it up deterministically instead of re-matching labels.
 */
export interface NLActionStep {
  /** Verb of the NL action. Mirrors buildNLAction's grammar. */
  type:
    | "open"
    | "click"
    | "type"
    | "fill"
    | "select"
    | "set"
    | "check"
    | "uncheck"
    | "press"
    | "assert";
  /** Target element label as the builder used it (post-`getCanonicalLabel`). */
  label: string;
  /** Raw value token (for fill/select/set) when known, else undefined. */
  value?: string;
  /**
   * Position of the element in the *per-page* interactive element list at the
   * time this step was built. `-1` means "no element reference" — applies to
   * the initial `Open the website`, navigation clicks, and assertions.
   */
  elementIndex: number;
  /** PageId this action targets. `""` for the initial `Open the website`. */
  pageId: string;
  /** True if the assertion started with `not `. */
  negated?: boolean;
  /** True if this step still contains an unresolved `<placeholder>` token. */
  isResolvedPlaceholder?: boolean;
  /** For unresolved steps, the data key the placeholder maps to (`toFieldKey`). */
  placeholderKey?: string;
}

/** Test data entry */
export interface DataEntry {
  name: string;
  type: string;
  value: string;
}

/** AST representation of a test case */
export interface TestCaseAST {
  name: string;
  actions: ASTStep[];
  data: Record<string, DataEntry>;
}

export type ASTStep = ASTActionStep | ASTAssertionStep;

export interface ASTActionStep {
  type: "open" | "click" | "type" | "hover" | "select" | "set";
  target?: string;
  value?: string;
  locator?: string;
}

export interface ASTAssertionStep {
  type: "assertion";
  target?: string;
  condition: string;
  expectedValue?: string;
  negated?: boolean;
  locator?: string;
}

// ============================================================================
// CONSISTENCY REPORT
// ============================================================================

export interface ConsistencyReport {
  pathId: string;
  testCaseId: string;
  valid: boolean;
  confidence: "high" | "medium" | "low";
  issues: string[];
}

// ============================================================================
// LANGGRAPH STATE
// ============================================================================

/**
 * State channels for LangGraph - flattened version
 * Each field represents a channel that can be updated by nodes
 */
export interface LangGraphState {
  // Configuration (static, set at start)
  config: ConfigMemory;

  // Stage 1: Graph extraction
  graphRaw: NavigationGraph | null;
  graphProcessed: Graph;
  graphMetadata: Graph;

  // Stage 2: Paths
  allPaths: TestPath[];
  selectedPaths: TestPath[];
  pathCoverage: {
    nodeCoverage: string[];
    edgeCoverage: string[];
  };

  // Stage 3: Elements
  elementsByPage: Map<string, UIElement[]>;
  extractionResults: ExtractionResult[];
  elementLocators: Map<string, string>;

  // Stage 3b: OCR and Verification
  ocrResults: OcrExtractionResult[];
  ocrTextByPage: Map<string, OcrTextRegion[]>;
  verifiedElementsByPage: Map<string, UIElement[]>;
  verificationResults: VerificationResult[];

  // Stage 4: Assertions
  assertionsByPage: Map<string, string[]>;
  assertionWeights: Map<string, number>;

  // Stage 5: NL Tests
  nlTestsByPath: Map<string, NLTestCase>;
  nlTestCases: NLTestCase[];

  // Stage 5b: Semantic Consistency Check
  invalidTestCases: NLTestCase[];
  validTestCases: NLTestCase[];
  consistencyReports: Map<string, ConsistencyReport>;

  // Stage 6: Test Data
  testDataByTest: Map<string, Record<string, unknown>>;

  // Stage 7: Code
  generatedTestFiles: Map<string, string>;

  // Execution state
  currentStage: string | null;
  completedStages: string[];
  executionErrors: ExecutionError[];
  executionLogs: ExecutionLogEntry[];
}

export interface ExecutionError {
  agent: string;
  message: string;
  stack?: string;
  timestamp: Date;
}

export interface ExecutionLogEntry {
  agent: string;
  level: "debug" | "info" | "warn" | "error";
  message: string;
  meta?: Record<string, unknown>;
  timestamp: Date;
}

// ============================================================================
// INITIAL STATE FACTORY
// ============================================================================

export function createInitialState(config: ConfigMemory): LangGraphState {
  return {
    config,
    graphRaw: null,
    graphProcessed: {
      source: "figma",
      extractedAt: null,
      totalNodes: 0,
      totalEdges: 0,
    },
    graphMetadata: {
      source: "figma",
      extractedAt: null,
      totalNodes: 0,
      totalEdges: 0,
    },
    allPaths: [],
    selectedPaths: [],
    pathCoverage: {
      nodeCoverage: [],
      edgeCoverage: [],
    },
    elementsByPage: new Map(),
    extractionResults: [],
    elementLocators: new Map(),
    ocrResults: [],
    ocrTextByPage: new Map(),
    verifiedElementsByPage: new Map(),
    verificationResults: [],
    assertionsByPage: new Map(),
    assertionWeights: new Map(),
    nlTestsByPath: new Map(),
    nlTestCases: [],
    invalidTestCases: [],
    validTestCases: [],
    consistencyReports: new Map(),
    testDataByTest: new Map(),
    generatedTestFiles: new Map(),
    currentStage: null,
    completedStages: [],
    executionErrors: [],
    executionLogs: [],
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function appendLog(
  state: LangGraphState,
  agent: string,
  level: "debug" | "info" | "warn" | "error",
  message: string,
  meta?: Record<string, unknown>,
): ExecutionLogEntry[] {
  const entry: ExecutionLogEntry = {
    agent,
    level,
    message,
    meta,
    timestamp: new Date(),
  };
  return [...state.executionLogs, entry];
}

export function markStageComplete(
  state: LangGraphState,
  stageName: string,
): { completedStages: string[]; currentStage: string | null } {
  return {
    completedStages: [...state.completedStages, stageName],
    currentStage: null,
  };
}

export function setCurrentStage(
  state: LangGraphState,
  stageName: string,
): { currentStage: string } {
  return { currentStage: stageName };
}

export function addError(
  state: LangGraphState,
  agent: string,
  message: string,
  stack?: string,
): ExecutionError[] {
  const error: ExecutionError = {
    agent,
    message,
    stack,
    timestamp: new Date(),
  };
  return [...state.executionErrors, error];
}

// ============================================================================
// NODE CONFIG
// ============================================================================

export interface NodeConfig {
  threadId: string;
  checkpointNamespace?: string;
  [key: string]: unknown;
}
