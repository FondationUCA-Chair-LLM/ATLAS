/**
 * OCR Extraction Agent for LangGraph
 * Extracts text from screenshots using Tesseract.js OCR
 * Provides secondary verification source for VLM-extracted elements
 */

import type { RunnableConfig } from "@langchain/core/runnables";
import type {
  SimpleAgent,
  OcrExtractionInput,
  OcrExtractionOutput,
} from "./types";
import type {
  ConfigMemory,
  OcrExtractionResult,
  OcrTextRegion,
  GraphNode,
  LangGraphState,
} from "../types";
import { appendLog, addError, setCurrentStage } from "../types";
import path from "path";
import imagesMapping from "../../data/gruyere/images_mapping.json";
import { createWorker } from "tesseract.js";

export class OcrExtractionAgent implements SimpleAgent<
  OcrExtractionInput,
  OcrExtractionOutput
> {
  readonly name = "OcrExtractionAgent";
  readonly description =
    "Extracts text from page screenshots using Tesseract.js OCR";

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
          { graphProcessed: state.graphProcessed, config: state.config },
          context,
        );

        const totalRegions = result.ocrResults.reduce(
          (sum, r) => sum + r.textRegions.length,
          0,
        );

        return {
          ...stageUpdate,
          ocrResults: result.ocrResults,
          ocrTextByPage: result.ocrTextByPage,
          completedStages: [...state.completedStages, agentName],
          currentStage: null,
          executionLogs: appendLog(
            state,
            agentName,
            "info",
            `Extracted ${totalRegions} text regions from ${result.ocrResults.length} pages`,
            {
              regionCount: totalRegions,
              pageCount: result.ocrResults.length,
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
    input: OcrExtractionInput,
    context: import("./types").AgentContext,
  ): Promise<OcrExtractionOutput> {
    const { graphProcessed, config } = input;
    const { logger } = context;

    const nodeCount = graphProcessed.nodes?.size || 0;
    logger.info("Starting OCR extraction", {
      pageCount: nodeCount,
    });

    const ocrResults: OcrExtractionResult[] = [];
    const ocrTextByPage = new Map<string, OcrTextRegion[]>();

    // Create Tesseract worker
    const worker = await createWorker("eng", 1, {
      logger: (m) => logger.debug(`Tesseract: ${m.status}`),
    });

    try {
      // Extract text from each page
      if (graphProcessed.nodes) {
        for (const [nodeId, nodeData] of graphProcessed.nodes) {
          try {
            const result = await this.extractOcrFromPage(
              nodeData,
              config,
              worker,
            );

            ocrResults.push(result);
            ocrTextByPage.set(nodeId, result.textRegions);
          } catch (error) {
            logger.warn(`Failed to extract OCR from ${nodeId}`, {
              error: error instanceof Error ? error.message : String(error),
            });

            // Add empty result on failure
            ocrTextByPage.set(nodeId, []);
          }
        }
      }
    } finally {
      await worker.terminate();
    }

    logger.info("OCR extraction complete", {
      pagesProcessed: graphProcessed.nodes?.size || 0,
      totalRegions: ocrResults.reduce(
        (sum, r) => sum + r.textRegions.length,
        0,
      ),
    });

    return {
      ocrResults,
      ocrTextByPage,
    };
  }

  async extractOcrFromPage(
    page: GraphNode,
    config: ConfigMemory,
    worker: Awaited<ReturnType<typeof createWorker>>,
  ): Promise<OcrExtractionResult> {
    const imagePath = this.getImagePathForPage(page, config);

    if (!imagePath) {
      return {
        page: page.name,
        pageId: page.id,
        imageFile: "",
        textRegions: [],
      };
    }

    // Run OCR on the image
    const result = await worker.recognize(imagePath);

    // Parse text regions from result
    const textRegions = this.parseOcrResult(result);

    // Combine all text for full-text search
    const fullText = textRegions.map((r) => r.text).join("\n");

    return {
      page: page.name,
      pageId: page.id,
      imageFile: imagePath,
      textRegions,
      fullText,
    };
  }

  private parseOcrResult(result: any): OcrTextRegion[] {
    const regions: OcrTextRegion[] = [];
    const data = result.data;

    if (!data) {
      return regions;
    }

    // Tesseract.js v5 uses 'blocks' instead of 'paragraphs'
    const blocks = data.blocks || data.paragraphs || [];

    for (const block of blocks) {
      if (!block.lines) continue;

      for (const line of block.lines) {
        if (!line.text || line.text.trim() === "") continue;

        // Get bounding box from line
        const bbox = line.bbox || { x0: 0, y0: 0, x1: 0, y1: 0 };

        regions.push({
          text: line.text.trim(),
          confidence:
            line.confidence !== undefined
              ? line.confidence
              : data.confidence || 0,
          boundingBox: {
            x: bbox.x0 || 0,
            y: bbox.y0 || 0,
            width: (bbox.x1 || 0) - (bbox.x0 || 0),
            height: (bbox.y1 || 0) - (bbox.y0 || 0),
          },
        });
      }
    }

    return regions;
  }

  private getImagePathForPage(page: GraphNode, config: ConfigMemory): string {
    const basePath = config.inputPath;
    for (const p of imagesMapping.mappings) {
      if (p.stateId === page.id) {
        return path.join(basePath || "", p.image);
      }
    }
    console.warn(`No image mapping found for page ${page.name}, skipping OCR.`);
    return "";
  }
}
