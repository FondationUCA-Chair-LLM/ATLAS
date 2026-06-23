/**
 * Simplified Assertion Generation Agent for LangGraph
 * Generates discriminating assertions for pages based on extracted elements
 */

import type { RunnableConfig } from "@langchain/core/runnables";
import type {
  SimpleAgent,
  AgentContext,
  AssertionGenerationInput,
  AssertionGenerationOutput,
} from "./types";
import type { LangGraphState, UIElement } from "../types";
import { appendLog, addError, setCurrentStage } from "../types";

/**
 * Greedy assertion generator using predicate weighting
 * Implements the discriminating set algorithm from generate-assertions.ts
 */
export class GreedyAssertionGenerator {
  private allPages: Map<string, UIElement[]>;
  private pagePredicates: Map<string, Set<string>> = new Map();
  private globalPredicates: Set<string> = new Set();
  private weights: Map<string, number> = new Map();
  private assertions: Map<string, Set<string>> = new Map();

  constructor(elementsByPage: Map<string, UIElement[]>) {
    this.allPages = elementsByPage;
    this.initialize();
  }

  private initialize(): void {
    // Extract positive literals for each page
    this.extractPositiveLiterals();

    // Build global predicate pool
    this.globalPredicates = this.buildGlobalPredicatePool();

    // Add negative predicates
    this.addNegativeLiterals();

    // Calculate weights
    this.weights = this.calculateWeights();

    // Generate all assertions
    this.generateAllAssertions();
  }

  private extractPositiveLiterals(): void {
    for (const [pageName, elements] of this.allPages) {
      const predicates = new Set<string>();
      for (const el of elements) {
        // don't consider icons for assertions
        if (el.isIcon) continue;

        // todo: temp consider all items as text
        var predicate = "";
        switch (el.type) {
          case "button":
            predicate = `text("${el.text ?? el.label}")`;
            break;
          case "input":
            predicate = `text("${el.label ?? el.placeholder}")`;
            break;
          case "link":
            predicate = `text("${el.text ?? el.label}")`;
            break;
          case "text":
            predicate = `text("${el.text ?? el.label}")`;
            break;
          case "select":
            predicate = `text("${el.label ?? el.text}")`;
            break;
          case "checkbox":
            predicate = `text("${el.label}")`;
            break;
          case "radio":
            predicate = `text("${el.label}")`;
            break;
          case "textarea":
            predicate = `text("${el.label ?? el.placeholder}")`;
            break;
          default:
            predicate = `text("${el.text ?? el.label}")`;
        }
        // check if the predicate is valid and text is not empty
        const textValue = el.text ?? el.label ?? el.placeholder ?? "";

        const isOnlyNumber = /^\d+$/.test(textValue.trim());

        if (
          predicate &&
          predicate !== 'text("")' &&
          predicate !== 'text("undefined")' &&
          !isOnlyNumber
        ) {
          predicates.add(predicate);
        } else {
          console.warn(
            `Skipping invalid predicate for element: ${JSON.stringify(el)}`,
          );
        }
      }

      // check if what i rote is valide

      this.pagePredicates.set(pageName, predicates);
    }
  }

  private buildGlobalPredicatePool(): Set<string> {
    const P = new Set<string>();
    for (const pageSet of this.pagePredicates.values()) {
      pageSet.forEach((predicate) => P.add(predicate));
    }
    return P;
  }

  private addNegativeLiterals(): void {
    const totalPages = this.allPages.size;
    // Only the negative forms of common-enough predicates are useful: rare
    // predicates yield `not P` that almost every page satisfies (eliminates
    // nothing); ubiquitous predicates yield `not P` that the target almost
    // never satisfies (so the literal isn't even considered). The 25%-90%
    // band on positive frequency keeps the negative-literal pool manageable
    // AND meaningful.
    const minFreq = Math.max(2, Math.ceil(totalPages * 0.25));
    const maxFreq = Math.floor(totalPages * 0.9);

    // Compute positive frequency once per predicate (used to filter the
    // negative pool).
    const positiveFreq = new Map<string, number>();
    for (const p of this.globalPredicates) {
      let count = 0;
      for (const pageSet of this.pagePredicates.values()) {
        if (pageSet.has(p)) count++;
      }
      positiveFreq.set(p, count);
    }

    for (const [pageName, pageSet] of this.pagePredicates) {
      for (const p of this.globalPredicates) {
        if (pageSet.has(p)) continue;
        const f = positiveFreq.get(p) ?? 0;
        if (f < minFreq || f > maxFreq) continue;
        pageSet.add(`not ${p}`);
      }
    }
  }

  private calculateWeights(): Map<string, number> {
    // Discrimination power of a positive literal `P` against the worst case
    // is `totalPages - frequency(P)` (pages that don't have P). Storing this
    // — instead of raw frequency — ranks predicates by their upper bound on
    // elimination, so the discriminator never picks template noise that
    // appears on every page.
    const totalPages = this.allPages.size;
    const w = new Map<string, number>();
    for (const p of this.globalPredicates) {
      const frequency = Array.from(this.pagePredicates.values()).filter((set) =>
        set.has(p),
      ).length;
      w.set(p, totalPages - frequency);
    }
    return w;
  }

  private generateAllAssertions(): void {
    for (const pageName of this.allPages.keys()) {
      const results = this.generateDiscriminatingSet(pageName);
      this.assertions.set(pageName, new Set(results));
    }
  }

  private generateDiscriminatingSet(
    targetPageName: string,
    maxAssertions = 10,
  ): string[] {
    const targetSet = this.pagePredicates.get(targetPageName);
    if (!targetSet) throw new Error(`Page ${targetPageName} not found`);

    const candidates = Array.from(targetSet);
    let R = new Set(
      Array.from(this.allPages.keys()).filter((p) => p !== targetPageName),
    );
    const L: string[] = [];

    while (R.size > 0 && L.length < maxAssertions) {
      let bestP = "";
      let maxEliminated = -1;

      for (const p of candidates) {
        const isNegated = p.startsWith("not ");
        const baseP = isNegated ? p.slice(4) : p;
        let eliminated = 0;
        for (const other of R) {
          const otherHas = this.pagePredicates.get(other)!.has(baseP);
          // For a positive literal `P`, eliminate pages where P is false
          // (i.e. `P` is not present on the other page).
          // For a negative literal `not P`, eliminate pages where P is true
          // (i.e. `P` IS present on the other page, so `not P` is not
          // satisfied on it).
          const otherSatisfiesLiteral = isNegated ? !otherHas : otherHas;
          if (!otherSatisfiesLiteral) eliminated++;
        }
        if (eliminated > maxEliminated) {
          maxEliminated = eliminated;
          bestP = p;
        }
      }

      // Stop only when no candidate can eliminate any page, or we have
      // enough assertions. Previously the loop broke on `maxEliminated === 0`
      // after the first round, which produced single-assertion outputs.
      if (bestP === "" || maxEliminated <= 0) break;

      L.push(bestP);

      // Remove from R every page that the chosen literal would not satisfy.
      const isNegated = bestP.startsWith("not ");
      const baseP = isNegated ? bestP.slice(4) : bestP;
      R.forEach((other) => {
        const otherHas = this.pagePredicates.get(other)!.has(baseP);
        const otherSatisfiesLiteral = isNegated ? !otherHas : otherHas;
        if (!otherSatisfiesLiteral) R.delete(other);
      });
    }

    return L;
  }

  getAssertions(): Map<string, Set<string>> {
    return this.assertions;
  }

  getWeights(): Map<string, number> {
    return this.weights;
  }

  getPagePredicates(): Map<string, Set<string>> {
    return this.pagePredicates;
  }
}

export class AssertionGenerationAgent implements SimpleAgent<
  AssertionGenerationInput,
  AssertionGenerationOutput
> {
  readonly name = "AssertionGenerationAgent";
  readonly description =
    "Generates discriminating assertions for page identification";

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
            debug: (msg: string) => logger.debug(`[${agentName}] ${msg}`),
            info: (msg: string) => logger.info(`[${agentName}] ${msg}`),
            warn: (msg: string) => logger.warn(`[${agentName}] ${msg}`),
            error: (msg: string) => logger.error(`[${agentName}] ${msg}`),
          },
          config: {},
        };

        const result = await this.execute(
          {
            verifiedElementsByPage:
              state.verifiedElementsByPage.size > 0
                ? state.verifiedElementsByPage
                : state.elementsByPage,
          },
          context,
        );

        if (state.config.debug) {
          this.verifyOutput(result);
        }

        const totalAssertions = result.assertionsByPage.size;
        logger.info(
          `[${agentName}] Complete: ${totalAssertions} assertions for ${result.assertionsByPage.size} pages`,
        );

        return {
          ...stageUpdate,
          assertionsByPage: result.assertionsByPage,
          assertionWeights: result.assertionWeights,
          completedStages: [...state.completedStages, agentName],
          currentStage: null,
          executionLogs: appendLog(
            state,
            agentName,
            "info",
            `Generated assertions for ${result.assertionsByPage.size} pages`,
            {
              pageCount: result.assertionsByPage.size,
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
  verifyOutput(result: AssertionGenerationOutput) {
    for (const [pageId, assertions] of result.assertionsByPage) {
      console.log(`Page: ${pageId} ||  Assertions: ${assertions}`);
    }
  }

  async execute(
    input: AssertionGenerationInput,
    context: AgentContext,
  ): Promise<AssertionGenerationOutput> {
    const { verifiedElementsByPage } = input;
    const { logger } = context;

    logger.info("Starting assertion generation", {
      pageCount: verifiedElementsByPage.size,
    });

    // Use greedy algorithm to generate discriminating assertions
    const generator = new GreedyAssertionGenerator(verifiedElementsByPage);

    // Convert Set<string> to string[] for output
    const assertionsByPage = new Map<string, string[]>();
    for (const [pageId, assertionSet] of generator.getAssertions()) {
      assertionsByPage.set(pageId, Array.from(assertionSet));
    }

    // Convert weights for output
    const assertionWeights = generator.getWeights();

    logger.info("Assertion generation complete", {
      totalAssertions: Array.from(assertionsByPage.values()).reduce(
        (sum, arr) => sum + arr.length,
        0,
      ),
    });

    return {
      assertionsByPage,
      assertionWeights,
    };
  }
}
