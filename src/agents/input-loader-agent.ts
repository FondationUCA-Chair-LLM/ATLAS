/**
 * Input Loader Agent for LangGraph
 * Loads navigation graph from various sources: Figma API, manual folder, etc.
 */

import type { RunnableConfig } from "@langchain/core/runnables";
import type {
  SimpleAgent,
  AgentContext,
  InputLoaderInput,
  InputLoaderOutput,
} from "./types";
import type {
  ConfigMemory,
  Graph,
  InteractionEdge,
  LangGraphState,
  NavigationGraph,
  ScreenState,
} from "../types";
import { appendLog, addError, setCurrentStage } from "../types";
import path from "path";
import fs from "fs/promises";
import fssync from "fs";
// const fs = await import("fs/promises");
// const path = await import("path");

export class InputLoaderAgent implements SimpleAgent<
  InputLoaderInput,
  InputLoaderOutput
> {
  readonly name = "InputLoaderAgent";
  readonly description =
    "Loads navigation graph from Figma API or manual folder";

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

        const result = await this.execute({ config: state.config }, context);

        logger.info(
          `[${agentName}] Complete: ${result.metadata.totalNodes} nodes, ${result.metadata.totalEdges} edges`,
        );

        return {
          ...stageUpdate,
          graphRaw: result.graphRaw,
          graphProcessed: result.graphProcessed,
          graphMetadata: result.metadata,
          completedStages: [...state.completedStages, agentName],
          executionLogs: appendLog(
            state,
            agentName,
            "info",
            `Loaded ${result.metadata.totalNodes} nodes, ${result.metadata.totalEdges} edges`,
            {
              nodes: result.metadata.totalNodes,
              edges: result.metadata.totalEdges,
              source: result.metadata.source,
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
    input: InputLoaderInput,
    context: AgentContext,
  ): Promise<InputLoaderOutput> {
    const { config } = input;
    const { logger } = context;

    // Determine source and load accordingly
    if (config.inputSource === "manual" && config.inputPath) {
      logger.info("Loading from manual folder", { path: config.inputPath });
      return this.loadFromManual(config.inputPath, config);
    }

    // Default: Load from Figma
    logger.info("Loading from Figma API", { fileKey: config.figmaFileKey });
    return this.loadFromFigma(config);
  }

  private async loadFromManual(
    inputPath: string,
    config: ConfigMemory,
  ): Promise<InputLoaderOutput> {
    const dotPath = path.join(inputPath, "navigation_graph.dot");
    const processedPath = path.join(inputPath, "graph_processed.json");
    const navigationPath = path.join(inputPath, "navigation_graph.json");

    // DOT is the sole source of truth for manual input
    let dotContent: string;
    try {
      dotContent = await fs.readFile(dotPath, "utf-8");
    } catch {
      throw new Error(
        `navigation_graph.dot not found at ${dotPath}. ` +
          `For manual input mode, navigation_graph.dot is the required source of truth.`,
      );
    }

    console.log(
      `[${this.name}] Loading from DOT file (source of truth): ${dotPath}`,
    );
    const graphRaw = this.parseDotFile(dotContent);
    const graphProcessed = this.convertToGraph(graphRaw);

    // Always regenerate JSON files from DOT
    await fs.writeFile(
      navigationPath,
      JSON.stringify(graphRaw, null, 2),
      "utf-8",
    );
    console.log(`[${this.name}] Regenerated navigation_graph.json`);

    const processedData = {
      source: "manual" as const,
      extractedAt: new Date(),
      totalNodes: graphRaw.nodes.length,
      totalEdges: graphRaw.edges.length,
      nodes: Object.fromEntries(graphProcessed.nodes || new Map()),
      edges: Object.fromEntries(graphProcessed.edges || new Map()),
    };
    await fs.writeFile(
      processedPath,
      JSON.stringify(processedData, null, 2),
      "utf-8",
    );
    console.log(`[${this.name}] Regenerated graph_processed.json`);

    const totalNodes = graphRaw.nodes.length;
    const totalEdges = graphRaw.edges.length;

    // verify all screenshots are present
    this.checkIfMappingsAreGood(config, graphRaw);

    const metadata = {
      source: "manual" as const,
      extractedAt: new Date(),
      totalNodes,
      totalEdges,
    };

    return {
      graphRaw,
      graphProcessed: { ...graphProcessed, ...metadata },
      metadata,
    };
  }
  async checkIfMappingsAreGood(
    config: ConfigMemory,
    graphRaw: NavigationGraph,
  ) {
    const fs = await import("fs/promises");
    const path = await import("path");

    const imagesMapping = JSON.parse(
      await fs.readFile(
        path.resolve(config.inputPath ?? "", "images_mapping.json"),
        "utf8",
      ),
    );

    const findMapping = (id: string, mappings: any) => {
      for (const map of mappings) {
        if (map.stateId === id) {
          return map;
        }
      }
      throw Error(`No Mapping found for page: ${id}`);
    };

    for (const node of graphRaw.nodes) {
      const map = findMapping(node.id, imagesMapping.mappings);
      for (const img of map.images) {
        if (!fssync.existsSync(path.join(config.inputPath || "", img))) {
          throw Error(`Image not found for ${map.stateId} ${img}`);
        }
      }
    }
  }

  /**
   * Parse DOT file content into NavigationGraph
   * Supports format: digraph Nav { "id" [label="name"]; "from" -> "to" [label="action"]; }
   */
  private parseDotFile(dotContent: string): NavigationGraph {
    const nodes: ScreenState[] = [];
    const edges: InteractionEdge[] = [];
    const nodeIds = new Set<string>();

    const lines = dotContent.split("\n");

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Skip empty lines, comments, and graph declaration lines
      if (
        !trimmedLine ||
        trimmedLine.startsWith("//") ||
        trimmedLine.startsWith("#") ||
        trimmedLine.startsWith("digraph") ||
        trimmedLine.startsWith("}") ||
        trimmedLine.startsWith("rankdir")
      ) {
        continue;
      }

      // Parse node definition: "id" [label="name"]; or id [label="name"];
      let nodeMatch = trimmedLine.match(
        /^"([^"]+)"\s*\[label="([^"]*)"\]\s*;?\s*$/,
      );
      if (!nodeMatch) {
        nodeMatch = trimmedLine.match(
          /^([A-Za-z][A-Za-z0-9_\-]*)\s*\[label="([^"]*)"\]\s*;?\s*$/,
        );
      }
      if (nodeMatch) {
        const id = nodeMatch[1];
        const name = nodeMatch[2] || id;

        if (!nodeIds.has(id)) {
          nodeIds.add(id);
          nodes.push({
            id,
            name,
            widgets: [],
            interactions: [],
          });
        } else {
          // Update name if node was auto-created from an edge earlier
          const existing = nodes.find((n) => n.id === id);
          if (existing && existing.name === id && name !== id) {
            existing.name = name;
          }
        }
        continue;
      }

      // Parse edge definition: "from" -> "to" [label="action"]; or from -> to [label="action"];
      let edgeMatch = trimmedLine.match(
        /^"([^"]+)"\s*->\s*"([^"]+)"\s*\[label="([^"]*)"\]\s*;?\s*$/,
      );
      if (!edgeMatch) {
        edgeMatch = trimmedLine.match(
          /^([A-Za-z][A-Za-z0-9_\-]*)\s*->\s*([A-Za-z][A-Za-z0-9_\-]*)\s*\[label="([^"]*)"\]\s*;?\s*$/,
        );
      }
      if (edgeMatch) {
        const fromScreen = edgeMatch[1];
        const toScreen = edgeMatch[2];
        const label = edgeMatch[3] || "navigate";

        edges.push({
          from_screen: fromScreen,
          to_screen: toScreen,
          action: "ON_CLICK",
          label,
        });

        // Ensure nodes exist (even if not explicitly declared in DOT)
        if (!nodeIds.has(fromScreen)) {
          nodeIds.add(fromScreen);
          nodes.push({
            id: fromScreen,
            name: fromScreen,
            widgets: [],
            interactions: [],
          });
        }
        if (!nodeIds.has(toScreen)) {
          nodeIds.add(toScreen);
          nodes.push({
            id: toScreen,
            name: toScreen,
            widgets: [],
            interactions: [],
          });
        }
      }
    }

    if (nodes.length === 0) {
      throw new Error("No nodes found in DOT file");
    }

    // Rebuild interactions from edges for each node
    for (const node of nodes) {
      node.interactions = edges.filter((e) => e.from_screen === node.id);
    }

    console.log(
      `[${this.name}] Parsed DOT file: ${nodes.length} nodes, ${edges.length} edges`,
    );

    return { nodes, edges };
  }

  private async loadFromFigma(
    config: InputLoaderInput["config"],
  ): Promise<InputLoaderOutput> {
    const fileKey = config.figmaFileKey;
    if (!fileKey) {
      throw new Error("FIGMA_FILE_KEY not configured");
    }

    let fileData: any;
    if (config.useCachedFigmaResponse) {
      fileData = await this.loadFromCache(fileKey);
    } else {
      const response = await fetch(
        `https://api.figma.com/v1/files/${fileKey}`,
        {
          headers: {
            "X-Figma-Token": config.figmaToken,
          },
        },
      );

      if (!response.ok) {
        throw new Error(
          `Figma API error: ${response.status} ${response.statusText}`,
        );
      }

      fileData = await response.json();
    }

    const navigationGraph = this.parseFigmaDocument(fileData, console);
    const processedGraph = this.convertToGraph(navigationGraph);

    const totalNodes = navigationGraph.nodes.length;
    const totalEdges = navigationGraph.edges.length;

    const metadata = {
      source: "figma" as const,
      extractedAt: new Date(),
      totalNodes,
      totalEdges,
    };

    return {
      graphRaw: navigationGraph,
      graphProcessed: { ...processedGraph, ...metadata },
      metadata,
    };
  }

  async loadFromCache(fileKey: string): Promise<any> {
    const fs = require("fs");
    const path = `./data/figma-cache/${fileKey}.json`;

    if (fs.existsSync(path)) {
      const data = fs.readFileSync(path, "utf-8");
      return JSON.parse(data);
    } else {
      throw new Error(`Cache file not found: ${path}`);
    }
  }

  private parseFigmaDocument(fileData: any, logger: Logger): NavigationGraph {
    const nodes: ScreenState[] = [];
    const edges: InteractionEdge[] = [];
    const nodeMap = new Map<string, string>();

    const processNode = (node: any, parentName?: string) => {
      if (node.type === "FRAME" || node.type === "CANVAS") {
        const screenName = node.name || parentName || "unnamed";
        const screenId = node.id || `screen-${nodes.length}`;

        if (!nodeMap.has(screenName)) {
          nodeMap.set(screenName, screenId);

          const screenState: ScreenState = {
            id: screenId,
            name: screenName,
            widgets: [],
            interactions: [],
          };

          for (const child of node.children ?? []) {
            const isActionable =
              child.interactions && child.interactions.length > 0;
            screenState.widgets.push({
              id: child.id,
              label: child.name,
              type: child.type,
              actionable: isActionable,
            });

            if (isActionable) {
              screenState.interactions = child.interactions.map(
                (interaction: any) => ({
                  from_screen: screenId,
                  to_screen: interaction.actions?.[0]?.destinationId,
                  action: interaction.trigger.type,
                  label: child.name,
                }),
              );
              for (const interaction of child.interactions) {
                edges.push({
                  from_screen: screenId,
                  to_screen: interaction.actions?.[0]?.destinationId,
                  action: interaction.trigger.type,
                  label: child.name,
                });
              }
            }
          }

          nodes.push(screenState);
        }
      }
    };

    for (const page of fileData.document?.children ?? []) {
      processNode(page);
    }

    if (nodes.length === 0) {
      logger.warn("No screens found, creating minimal structure");
      const defaultScreen: ScreenState = {
        id: "default-screen",
        name: "Default Screen",
        widgets: [],
        interactions: [],
      };
      nodes.push(defaultScreen);
    }

    return { nodes, edges };
  }

  convertToGraph(navigationGraph: NavigationGraph): Graph {
    const nodes = new Map<string, GraphNode>();
    const edges = new Map<string, GraphEdge[]>();

    for (const screen of navigationGraph.nodes) {
      nodes.set(screen.id, {
        id: screen.id,
        name: screen.name,
        data: { widgets: screen.widgets },
      });
    }

    for (const edge of navigationGraph.edges) {
      const fromEdges = edges.get(edge.from_screen) || [];
      fromEdges.push({
        from: edge.from_screen,
        to: edge.to_screen,
        action: edge.action,
        label: edge.label,
      });
      edges.set(edge.from_screen, fromEdges);
    }

    return {
      nodes,
      edges,
    };
  }
}

type Logger = {
  info: (msg: string, meta?: Record<string, unknown>) => void;
  warn: (msg: string, meta?: Record<string, unknown>) => void;
  error: (msg: string, meta?: Record<string, unknown>) => void;
};

type GraphNode = {
  id: string;
  name: string;
  data: Record<string, unknown>;
};

type GraphEdge = {
  from: string;
  to: string;
  action: string;
  label: string;
};
