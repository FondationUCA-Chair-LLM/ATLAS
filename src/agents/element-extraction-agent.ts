/**
 * Simplified Element Extraction Agent for LangGraph
 * Extracts UI elements from pages - can use VLM or mock data
 */
// import imagesMapping from "../../data/gruyere_v1/images_mapping.json";
import type { RunnableConfig } from "@langchain/core/runnables";
import type {
  SimpleAgent,
  AgentContext,
  ElementExtractionInput,
  ElementExtractionOutput,
} from "./types";
import type {
  ConfigMemory,
  ExtractionResult,
  GraphNode,
  LangGraphState,
  UIElement,
} from "../types";
import { appendLog, addError, setCurrentStage } from "../types";
import { getTemplate, renderTemplate } from "../utils/template_manager";
import { ollama } from "../utils/llm_wrapper";
import { cleanElementText } from "../utils/label-utils";
import path from "path";
import fs from "fs";

export class ElementExtractionAgent implements SimpleAgent<
  ElementExtractionInput,
  ElementExtractionOutput
> {
  readonly name = "ElementExtractionAgent";
  readonly description = "Extracts UI elements from page screenshots";

  // read images mapping
  imagesMapping: {
    mappings: {
      stateId: string;
      images: string[];
    }[];
  } = { mappings: [] };

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

        const totalElements = result.extractionResults.reduce(
          (sum, r) => sum + r.elements.length,
          0,
        );

        return {
          ...stageUpdate,
          elementsByPage: result.elementsByPage,
          extractionResults: result.extractionResults,
          completedStages: [...state.completedStages, agentName],
          currentStage: null,
          executionLogs: appendLog(
            state,
            agentName,
            "info",
            `Extracted ${totalElements} elements from ${result.elementsByPage.size} pages`,
            {
              elementCount: totalElements,
              pageCount: result.elementsByPage.size,
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
    input: ElementExtractionInput,
    context: AgentContext,
  ): Promise<ElementExtractionOutput> {
    const { graphProcessed, config } = input;
    const { logger } = context;

    this.imagesMapping = JSON.parse(
      fs.readFileSync(
        path.resolve(config.inputPath ?? "", "images_mapping.json"),
        "utf8",
      ),
    );

    const nodeCount = graphProcessed.nodes?.size || 0;
    logger.info("Starting element extraction", {
      pageCount: nodeCount,
    });

    const elementsByPage = new Map<string, UIElement[]>();
    const extractionResults: ExtractionResult[] = [];
    let counter = 1;
    // Extract elements from each page
    if (graphProcessed.nodes) {
      for (const [nodeId, nodeData] of graphProcessed.nodes) {
        //print progress of processing
        console.log(
          `Processing page extraction ${nodeData.name} :  ${counter}/${graphProcessed.nodes.size}`,
        );
        counter++;

        try {
          // Try to extract using VLM if available
          const result = await this.extractElementsFromPageWithVLM(
            nodeData,
            config,
          );

          elementsByPage.set(nodeId, result.elements);

          extractionResults.push({
            elements: result.elements,
          });
        } catch (error) {
          logger.warn(`Failed to extract from ${nodeId}`, {
            error: error instanceof Error ? error.message : String(error),
          });

          // Add empty result on failure
          elementsByPage.set(nodeId, []);
        }
      }
    }

    logger.info("Element extraction complete", {
      pagesProcessed: graphProcessed.nodes?.size || 0,
      totalElements: extractionResults.reduce(
        (sum, r) => sum + r.elements.length,
        0,
      ),
    });

    return {
      elementsByPage,
      extractionResults,
    };
  }

  async extractElementsFromPageWithVLM(
    page: GraphNode,
    config: ConfigMemory,
    promptOverridePath?: string,
  ): Promise<ExtractionResult> {
    // 1. Load and Render the template
    const template = await getTemplate(
      promptOverridePath || "extract-elements_v7.md",
    );
    const renderedPrompt = renderTemplate(template, {
      page_text: "",
    });

    //todo: remove it later
    this.imagesMapping = JSON.parse(
      fs.readFileSync(
        path.resolve(config.inputPath ?? "", "images_mapping.json"),
        "utf8",
      ),
    );
    // 2.  Prepare the images Base64 encode

    //todo : tmp solution to import images
    const pageName = page.name;
    const images = await this.encodePageImages(page, config);

    try {
      // 3. Build Messages following your pattern
      const messages = [
        {
          role: "system",
          content:
            "You are a specialized VLM for UI Automation. You output strict JSON based on visual analysis.",
        },
        {
          role: "user",
          content: renderedPrompt,
          images: images,
        },
      ];

      //todo: remove this and use VLM output instead - this is just for testing the pipeline without hitting the VLM
      // if (config.useCachedElements) {
      //   return {
      //     page: page.name,
      //     pageId: page.id,
      //     imageFile: imagePath,
      //     elements: [],
      //   };
      // }

      // 4. Execution

      const response = await ollama.chat({
        model: config.visionModelId,
        messages: messages,
        format: "json",

        options: {
          temperature: 0, // Lower temperature is better for extraction
          seed: 42, // Fixed seed for reproducibility
        },
      });

      console.log(
        `VLM response received for ${page.name} (${response.eval_count || 0} tokens)`,
      );

      if (config.debug) {
        console.debug(`VLM raw response for ${page.name}:`, response);
      }

      return this.parseElements(page.name, response.message.content);
    } catch (error) {
      console.error(`Error processing page ${page.name}:`, error);
      return {
        elements: [],
      };
    }
  }

  async encodePageImages(
    page: GraphNode,
    config: ConfigMemory,
  ): Promise<string[]> {
    const basePath = config.inputPath;
    const pageImages: string[] = [];

    for (const p of this.imagesMapping.mappings) {
      if (p.stateId === page.id) {
        for (const imagePath of p.images) {
          pageImages.push(path.join(basePath || "", imagePath));
        }
      }
    }

    const imagesEncoded: string[] = [];
    for (const imgPath of pageImages) {
      try {
        const base64 = await this.fileToBase64(imgPath);
        imagesEncoded.push(base64);
      } catch (e) {
        console.error(`Failed to encode image ${imgPath}:`, e);
      }
    }

    if (imagesEncoded.length === 0) {
      console.warn(
        `No image mapping found for page name: ${page.name}, id: ${page.id}`,
      );
    }

    return imagesEncoded;
  }

  async fileToBase64(filePath: string): Promise<string> {
    // Node.js fs.readFileSync + Buffer
    const fs = await import("fs");
    const fileBuffer = fs.readFileSync(filePath);
    return fileBuffer.toString("base64");
  }

  parseElements(
    // imageFile: string,
    pageName: string,
    vlmResponse: string,
  ): ExtractionResult {
    try {
      const parsed = JSON.parse(vlmResponse);
      const rawElements: UIElement[] = parsed.elements || [];
      const processedElements = this.postProcessElements(rawElements);
      return {
        elements: processedElements,
      };
    } catch (e) {
      console.error("VLM JSON parse failed:", e);
      return {
        elements: [],
      };
    }
  }

  postProcessElements(elements: UIElement[]): UIElement[] {
    const processed = elements.map((el) => ({ ...el }));

    // 1. Normalize snake_case text back to spaces (e.g., "Sign_in" -> "Sign in")
    for (const el of processed) {
      if (el.text && /\w_\w/.test(el.text)) {
        el.text = el.text.trim().replace(/_/g, " ");
      }
      if (el.label && /\w_\w/.test(el.label)) {
        el.label = el.label.trim().replace(/_/g, " ");
      }

      // 2. Clean text/label (single canonical location via cleanElementText)
      if (el.text) {
        el.text = cleanElementText(el.text);
      }
      if (el.label) {
        el.label = cleanElementText(el.label);
      }
    }

    return processed;
  }
}
