# ATLAS

**ATLAS** — Acceptance Test generation using LLM-based Agent Systems.

A multi-agent system that turns a navigation graph (Figma or manual) plus page screenshots into executable Playwright tests. The pipeline uses a vision-language model to extract UI elements, a discriminating-set algorithm to identify each page, and a structured code generator to emit `.spec.ts` files.

## Installation

### Prerequisites

- **Node.js** ≥ 18
- **Ollama** running and reachable at the URL in `config.json` (default `http://localhost:11434`). ATLAS uses local models for both text and vision; you need a text model and a vision model pulled.

### Steps

```bash
# 1. Install Node dependencies
npm install

# 2. Install Playwright browsers
npx playwright install

# 3. Pull the models referenced in config.json
ollama pull <modelId>          # e.g. gemma3:27b
ollama pull <visionModelId>    # e.g. qwen3.6:27b
```

### Configure

Edit `config.json` at the repo root. It has two parts:

- **`global`** — shared settings (Ollama URL, model IDs, faker seed/locale, `debug`).
- **per-app keys** (e.g. `gruyere`, `gruyere`) — each app has its own `inputPath`, `targetUrl`, `outputDir`, and `startNode`.

```json
{
  "global": {
    "ollamaUrl": "http://localhost:11434",
    "modelId": "gemma3:27b",
    "visionModelId": "qwen2-vl:7b",
    "fakerSeed": 42,
    "debug": false
  },
  "gruyere": {
    "inputPath": "./data/gruyere",
    "targetUrl": "http://localhost/upload",
    "outputDir": "./out/gruyere",
    "startNode": "Home_Anonymous"
  }
}
```

To switch to a Figma source, replace `inputPath` with `figmaToken` + `figmaFileKey` for that app entry.

## Project Structure

```
.
├── config.json                  # Global + per-app configuration
├── package.json
├── data/                        # Input data per app
│   ├── gruyere/
│   │   ├── navigation_graph.dot
│   │   ├── images_mapping.json
│   │   ├── xpath_mapping.json
│   │   └── screenshots/....png                # Pages screenshots
│   └── other-app/
├── src/
│   ├── agents/                  # One class per pipeline stage
│   ├── graph.ts                 # LangGraph StateGraph definition
│   ├── orchestrator.ts          # Pipeline runner (full / resume)
│   ├── cli/index.ts             # CLI entry point
│   ├── templates/               # Mustache LLM prompts
│   ├── utils/                   # Shared helpers (NL grammar, test data, etc.)
│   └── types.ts                 # Shared TypeScript types
├── out/                         # Generated outputs (versioned per run)
├── tests/                       # Playwright tests
```

### Source layout (`src/`)

```
src/
├── agents/                      # Pipeline stages — each is a SimpleAgent
│   ├── input-loader-agent.ts          # Loads the navigation graph (manual or Figma)
│   ├── path-generation-agent.ts       # Builds TestPaths covering graph edges
│   ├── element-extraction-agent.ts    # VLM extracts UIElement[] per page
│   ├── element-verification-agent.ts  # Confirms graph edges map to real elements
│   ├── assertion-generation-agent.ts  # Picks discriminating assertions per page
│   ├── nl-test-builder-agent.ts       # Builds NL test cases from paths + elements
│   ├── test-data-generation-agent.ts  # Generates test data for each case
│   ├── semantic-consistency-agent.ts  # LLM-based quality gate (optional)
│   └── code-generation-agent.ts       # Emits Playwright .spec.ts files
│
├── templates/                   # Mustache LLM prompt templates
│   ├── extract-elements_v7.md
│   ├── generate-nl-testcases.md
│   ├── semantic-consistency.md
│   └── ...
│
├── utils/                       # Shared helpers
│   ├── nl-grammar.ts            # NL <-> action grammar (shared by builder + runner)
│   ├── test-data-matcher.ts     # Field-intent detection (email, phone, etc.)
│   ├── test-data-resolver.ts    # Placeholder substitution
│   ├── label-utils.ts           # getCanonicalLabel, escapeForPlaywright, etc.
│   ├── load_config.ts           # config.json loader
│   ├── load_state.ts            # Resume from saved state
│   └── ...
│
├── graph.ts                     # LangGraph StateGraph wiring
├── orchestrator.ts              # Full-run / resume / from-stage runners
├── cli/index.ts                 # CLI entry
└── types.ts                     # LangGraphState, UIElement, NLTestCase, ...
```

### Output layout (`out/run-<placeholder>/`)

Each pipeline run writes a versioned folder:

```
out/run-2026-06-22T11-09-02/
├── general.spec.ts              # Generated Playwright test file
├── general.xpath.spec.ts        # Variant using xpath_mapping.json
├── valid-nl-testcases.json      # NL test cases that passed the consistency check
├── langgraph-full-state.json    # Full state snapshot (for resume)
└── langgraph-state-summary.json # Per-stage counts and errors
```

## Running the pipeline

```bash
# Full run for the app named in config.json (uses "global" or first app key)
npm start

# Run for a specific app
npm start run -- -a gruyere

# Resume from a saved state, re-running everything from a given stage
npm start run -- -a gruyere -m from-stage -s CodeGenerationAgent
```

Valid stage names (agent class names):

- `InputLoaderAgent`
- `PathGenerationAgent`
- `ElementExtractionAgent`
- `ElementVerificationAgent`
- `AssertionGenerationAgent`
- `NLTestBuilderAgent`
- `TestDataGenerationAgent`
- `SemanticConsistencyAgent`
- `CodeGenerationAgent`

## Pipeline stages

```
InputLoader → ┬─→ PathGeneration
             └─→ ElementExtraction → ElementVerification → AssertionGeneration
                          └──────────────────┬───────────────────┘
                                             ↓
                                       NLTestBuilder → TestDataGeneration
                                             ↓              ↓
                                  SemanticConsistency (optional)
                                             ↓
                                       CodeGeneration
```

Path generation and element extraction run in parallel after the input is loaded. The rest of the pipeline is sequential.

## Evaluation:

The evaluation folder contains all evaluation artifacts, including the results obtained during the evaluation of ATLAS and the open-source web applications used in the study (available in the websites/ directory).
