/**
 * Generates test paths from navigation graph using edge coverage strategy
 */

import type { RunnableConfig } from "@langchain/core/runnables";
import type {
  SimpleAgent,
  AgentContext,
  PathGenerationInput,
  PathGenerationOutput,
} from "./types";
import type { Graph, LangGraphState, PathStep, TestPath } from "../types";
import { appendLog, addError, setCurrentStage } from "../types";

export class PathGenerationAgent implements SimpleAgent<
  PathGenerationInput,
  PathGenerationOutput
> {
  readonly name = "PathGenerationAgent";
  readonly description = "Generates test paths from navigation graph";

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
        if (!state.graphProcessed) {
          throw new Error("No processed graph available");
        }

        const context = {
          executionId: config.runId || "default-run",
          logger: {
            debug: (msg: string) => logger.debug(`[${agentName}] ${msg}`),
            info: (msg: string) => logger.info(`[${agentName}] ${msg}`),
            warn: (msg: string) => logger.warn(`[${agentName}] ${msg}`),
            error: (msg: string) => logger.error(`[${agentName}] ${msg}`),
          },
          config: {},
        };

        const result = await this.execute(
          {
            graphProcessed: state.graphProcessed,
            startNode: state.config.startNode,
          },
          context,
        );

        logger.info(
          `[${agentName}] Generated ${result.selectedPaths.length} paths from ${result.allPaths.length} total`,
        );

        return {
          ...stageUpdate,
          allPaths: result.allPaths,
          selectedPaths: result.selectedPaths,
          pathCoverage: {
            nodeCoverage: [],
            edgeCoverage: [],
          },
          completedStages: [...state.completedStages, agentName],
          executionLogs: appendLog(
            state,
            agentName,
            "info",
            `Generated ${result.selectedPaths.length} paths`,
            {
              allPaths: result.allPaths.length,
              selected: result.selectedPaths.length,
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
    input: PathGenerationInput,
    context: AgentContext,
  ): Promise<PathGenerationOutput> {
    const { graphProcessed, startNode } = input;
    const { logger } = context;

    logger.info("Starting path generation");

    if (!graphProcessed) {
      throw new Error("No processed graph available");
    }

    if (!startNode) {
      throw new Error("No start node specified for path generation");
    }

    const edgePaths = this.generatePathsToCoverEdges(startNode, graphProcessed);
    logger.info(`Generated ${edgePaths.length} edge coverage paths`);

    // const nodePaths = this.generatePathsToCoverNodes(startNode, graphProcessed);
    // logger.info(`Generated ${nodePaths.length} node coverage paths`);

    const allPaths = [...edgePaths];
    this.ensureUniqueIds(allPaths);

    const selectedPaths = this.selectPathsForCoverage(allPaths, graphProcessed);
    this.ensureUniqueIds(selectedPaths);
    logger.info(`Selected ${selectedPaths.length} representative paths`);

    return {
      allPaths,
      selectedPaths,
    };
  }

  private findStartNode(graph: Graph): string {
    const nodes = graph.nodes;
    if (!nodes) return "";
    for (const [id, node] of nodes.entries()) {
      if (
        node.name.toLowerCase() === "home" ||
        id.toLowerCase().includes("home")
      ) {
        return id;
      }
    }
    return nodes.keys().next().value ?? "";
  }

  private findShortestPath(
    graph: Graph,
    start: string,
    target: string,
  ): PathStep[] | null {
    if (start === target) return [];

    const queue: { node: string; path: PathStep[] }[] = [
      { node: start, path: [] },
    ];
    const visited = new Set<string>([start]);

    while (queue.length > 0) {
      const { node, path } = queue.shift()!;
      const edges = graph.edges?.get(node) || [];

      for (const edge of edges) {
        if (visited.has(edge.to)) continue;

        const newPath: PathStep[] = [
          ...path,
          {
            from: node,
            to: edge.to,
            action: edge.action,
            label: edge.label,
          },
        ];

        if (edge.to === target) {
          return newPath;
        }

        visited.add(edge.to);
        queue.push({ node: edge.to, path: newPath });
      }
    }

    return null;
  }

  private getAllEdges(
    graph: Graph,
  ): { from: string; to: string; action: string; label: string }[] {
    const result: {
      from: string;
      to: string;
      action: string;
      label: string;
    }[] = [];
    for (const [fromId, edges] of graph.edges?.entries() || []) {
      for (const edge of edges) {
        result.push({
          from: fromId,
          to: edge.to,
          action: edge.action,
          label: edge.label,
        });
      }
    }
    return result;
  }

  private generatePathsToCoverEdges(
    startNode: string,
    graph: Graph,
  ): TestPath[] {
    const paths: TestPath[] = [];
    const coveredEdges = new Set<string>();
    const allEdges = this.getAllEdges(graph);

    for (const edge of allEdges) {
      const edgeKey = `${edge.from}->${edge.to}`;
      if (coveredEdges.has(edgeKey)) continue;

      const pathToEdge = this.findShortestPath(graph, startNode, edge.from);
      if (!pathToEdge) continue;

      const fullPath: PathStep[] = [
        ...pathToEdge,
        {
          from: edge.from,
          to: edge.to,
          action: edge.action,
          label: edge.label,
        },
      ];

      paths.push({
        id: `path-${startNode}-to-${edge.to}`,
        name: `Path from ${startNode} to ${edge.to}`,
        steps: fullPath,
        startNode,
        endNode: edge.to,
        metadata: { type: "edge-coverage", edgeKey },
      });

      coveredEdges.add(edgeKey);
    }

    return paths;
  }

  private generatePathsToCoverNodes(
    startNode: string,
    graph: Graph,
  ): TestPath[] {
    const paths: TestPath[] = [];
    const allNodes = Array.from(graph.nodes?.keys() || []);

    for (const targetNode of allNodes) {
      if (targetNode === startNode) continue;

      const path = this.findShortestPath(graph, startNode, targetNode);
      if (path && path.length > 0) {
        paths.push({
          id: `path-${startNode}-to-${targetNode}`,
          name: `Path from ${startNode} to ${targetNode}`,
          steps: path,
          startNode,
          endNode: targetNode,
          metadata: { type: "node-coverage", targetNode },
        });
      }
    }

    return paths;
  }

  private selectPathsForCoverage(
    allPaths: TestPath[],
    graph: Graph,
  ): TestPath[] {
    // todo: implement more sophisticated selection strategy to minimize number of paths while maximizing coverage
    return allPaths;
  }

  private ensureUniqueIds(paths: TestPath[]): void {
    const seen = new Set<string>();
    for (const path of paths) {
      let id = path.id;
      while (seen.has(id)) {
        const suffix = Math.random().toString(36).substring(2, 6);
        id = `${path.id}-${suffix}`;
      }
      seen.add(id);
      path.id = id;
    }
  }
}
