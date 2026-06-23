/**
 * Element Verification Agent for LangGraph
 * Validates that navigation trigger elements exist in extracted elements
 * Provides quality gate before elements flow to downstream agents
 */

import type { RunnableConfig } from "@langchain/core/runnables";
import type {
  SimpleAgent,
  ElementVerificationInput,
  ElementVerificationOutput,
} from "./types";
import type {
  Graph,
  GraphEdge,
  LangGraphState,
  UIElement,
  VerificationResult,
  VerificationIssue,
} from "../types";
import { appendLog, addError, setCurrentStage } from "../types";
import { getCanonicalLabel } from "../utils/label-utils";

export class ElementVerificationAgent implements SimpleAgent<
  ElementVerificationInput,
  ElementVerificationOutput
> {
  readonly name = "ElementVerificationAgent";
  readonly description =
    "Validates that navigation trigger elements exist in extracted elements";

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
            graphProcessed: state.graphProcessed,
            elementsByPage: state.elementsByPage,
          },
          context,
        );

        const totalVerified = Array.from(
          result.verifiedElementsByPage.values(),
        ).reduce((sum, elements) => sum + elements.length, 0);

        const issuesCount = result.verificationResults.reduce(
          (sum, r) => sum + r.issues.length,
          0,
        );

        const alignedCount = result.verificationResults.filter(
          (r) => r.navigationAligned,
        ).length;

        return {
          ...stageUpdate,
          verifiedElementsByPage: result.verifiedElementsByPage,
          verificationResults: result.verificationResults,
          completedStages: [...state.completedStages, agentName],
          currentStage: null,
          executionLogs: appendLog(
            state,
            agentName,
            "info",
            `Verified ${totalVerified} elements across ${result.verifiedElementsByPage.size} pages, ${alignedCount}/${result.verificationResults.length} aligned`,
            {
              elementCount: totalVerified,
              pageCount: result.verifiedElementsByPage.size,
              issuesCount,
              alignedCount,
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
    input: ElementVerificationInput,
    context: import("./types").AgentContext,
  ): Promise<ElementVerificationOutput> {
    const { graphProcessed, elementsByPage } = input;
    const { logger } = context;

    logger.info("Starting element verification", {
      pageCount: elementsByPage.size,
    });

    const verifiedElementsByPage = new Map<string, UIElement[]>();
    const verificationResults: VerificationResult[] = [];

    // Build a map of outgoing edges for each page
    const outgoingEdgesByPage = this.buildOutgoingEdgesMap(graphProcessed);

    // Verify each page
    for (const [pageId, elements] of elementsByPage) {
      const pageEdges = outgoingEdgesByPage.get(pageId) || [];

      const verificationResult = this.verifyPage(pageId, elements, pageEdges);

      verificationResults.push(verificationResult);

      // Pass through all elements (verified elements = raw elements for now)
      verifiedElementsByPage.set(pageId, elements);
    }

    const alignedCount = verificationResults.filter(
      (r) => r.navigationAligned,
    ).length;

    logger.info("Element verification complete", {
      pagesVerified: verificationResults.length,
      navigationAligned: alignedCount,
      navigationMisaligned: verificationResults.length - alignedCount,
    });

    return {
      verifiedElementsByPage,
      verificationResults,
    };
  }

  private buildOutgoingEdgesMap(graph: Graph): Map<string, GraphEdge[]> {
    const edgesMap = new Map<string, GraphEdge[]>();

    if (!graph.edges) {
      return edgesMap;
    }

    for (const [fromNode, edges] of graph.edges) {
      edgesMap.set(fromNode, edges);
    }

    return edgesMap;
  }

  /**
   * Verify that all navigation trigger elements exist in the extracted elements
   */
  private verifyPage(
    pageId: string,
    elements: UIElement[],
    edges: GraphEdge[],
  ): VerificationResult {
    const issues: VerificationIssue[] = [];
    let navigationAligned = true;

    // For each outgoing edge, verify an element exists with matching label
    for (const edge of edges) {
      const matchingElement = this.findElementByLabel(elements, edge.label);

      if (!matchingElement) {
        navigationAligned = false;
        issues.push({
          severity: "error",
          message: `Navigation trigger "${edge.label}" not found in extracted elements`,
          expectedLabel: edge.label,
        });
      } else if (edge.action === "ON_CLICK" && !this.isClickableElement(matchingElement)) {
        issues.push({
          severity: "warning",
          message: `Navigation trigger "${edge.label}" may not be clickable (type: ${matchingElement.type})`,
          elementId: matchingElement.id,
        });
      }
    }

    return {
      page: pageId,
      pageId,
      confidence: navigationAligned ? "high" : "low",
      issues,
      navigationAligned,
      ocrAligned: true, // Not used in simple mode
    };
  }

  private findElementByLabel(
    elements: UIElement[],
    label: string,
  ): UIElement | undefined {
    const normalizedLabel = label.toLowerCase().trim();

    return elements.find(
      (element) =>
        [
          getCanonicalLabel(element),
          element.placeholder,
          element.value,
        ]
          .filter(Boolean)
          .some((text) => text?.toLowerCase().trim() === normalizedLabel),
    );
  }

  private isClickableElement(element: UIElement): boolean {
    const clickableTypes: UIElement["type"][] = [
      "button",
      "link",
      "checkbox",
      "radio",
    ];
    return clickableTypes.includes(element.type);
  }
}
