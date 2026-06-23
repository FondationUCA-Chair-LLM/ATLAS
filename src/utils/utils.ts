/**
 * LangGraph Utilities
 * Simplified utility functions for LangGraph
 */

import type { RunnableConfig } from "@langchain/core/runnables";
import type { Logger } from "../agents/types";
import type { LangGraphState, NodeConfig } from "../types";

const MAP_KEYS = new Set([
  "nodes",
  "edges",
  "elementsByPage",
  "elementLocators",
  "ocrTextByPage",
  "verifiedElementsByPage",
  "assertionsByPage",
  "assertionWeights",
  "nlTestsByPath",
  "testDataByTest",
  "generatedTestFiles",
  "consistencyReports",
]);

const DATE_KEYS = new Set(["extractedAt", "timestamp"]);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date) && !(value instanceof Map);
}

function maybeConvert(value: unknown, key: string): unknown {
  if (DATE_KEYS.has(key) && typeof value === "string") {
    const d = new Date(value);
    if (!isNaN(d.getTime())) return d;
    return value;
  }

  if (MAP_KEYS.has(key) && isPlainObject(value)) {
    const map = new Map<string, unknown>();
    for (const [k, v] of Object.entries(value)) {
      map.set(k, deepDeserialize(v, ""));
    }
    return map;
  }

  if (Array.isArray(value)) {
    return value.map((item) => deepDeserialize(item, ""));
  }

  if (isPlainObject(value)) {
    return deepDeserialize(value, "");
  }

  return value;
}

function deepDeserialize(obj: unknown, _parentKey: string): unknown {
  if (Array.isArray(obj)) {
    return obj.map((item, i) => {
      if (isPlainObject(item)) {
        const converted: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(item)) {
          converted[k] = maybeConvert(v, k);
        }
        return converted;
      }
      return maybeConvert(item, "");
    });
  }

  if (isPlainObject(obj)) {
    const converted: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      converted[key] = maybeConvert(value, key);
    }
    return converted;
  }

  return obj;
}

export function deserializeState(
  serialized: Record<string, unknown>,
): LangGraphState {
  return deepDeserialize(serialized, "") as LangGraphState;
}

export function withSkipCheck(
  nodeFn: (
    state: LangGraphState,
    config: RunnableConfig,
  ) => Promise<Partial<LangGraphState>>,
  agentName: string,
): (
  state: LangGraphState,
  config: RunnableConfig,
) => Promise<Partial<LangGraphState>> {
  return async (state: LangGraphState, config: RunnableConfig) => {
    if (state.completedStages.includes(agentName)) {
      console.log(`[${agentName}] Already completed, skipping`);
      return {};
    }
    return nodeFn(state, config);
  };
}

/**
 * Generate a unique thread ID for LangGraph execution
 */
export function generateThreadId(): string {
  return `thread-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Convert NodeConfig to RunnableConfig format
 */
export function toRunnableConfig(config: NodeConfig): RunnableConfig {
  return {
    configurable: {
      thread_id: config.threadId,
      checkpoint_ns: config.checkpointNamespace || "test_generation",
    },
  };
}

/**
 * Create a simple logger interface for agents
 */
export function createLogger(prefix: string): Logger {
  return {
    debug: (message: string, meta?: Record<string, unknown>) => {
      console.debug(`[${prefix}] ${message}`, meta ? JSON.stringify(meta) : "");
    },
    info: (message: string, meta?: Record<string, unknown>) => {
      console.info(`[${prefix}] ${message}`, meta ? JSON.stringify(meta) : "");
    },
    warn: (message: string, meta?: Record<string, unknown>) => {
      console.warn(`[${prefix}] ${message}`, meta ? JSON.stringify(meta) : "");
    },
    error: (message: string, meta?: Record<string, unknown>) => {
      console.error(`[${prefix}] ${message}`, meta ? JSON.stringify(meta) : "");
    },
  };
}

export const logExit = (data: any) => {
  console.dir(data, { depth: null });
  process.exit(0);
};

/**
 * Serialize state to JSON-compatible format (converts Maps, Dates, etc)
 */
export const serializeState = (
  state: LangGraphState,
): Record<string, unknown> => {
  const serialized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(state)) {
    if (value instanceof Map) {
      // Convert Map to Object
      serialized[key] = Object.fromEntries(value);
    } else if (value instanceof Date) {
      // Convert Date to ISO string
      serialized[key] = value.toISOString();
    } else if (Array.isArray(value)) {
      // Handle arrays that might contain Maps or Dates
      serialized[key] = value.map((item) => {
        if (item instanceof Date) return item.toISOString();
        if (item instanceof Map) return Object.fromEntries(item);
        return item;
      });
    } else if (value && typeof value === "object") {
      // Handle nested objects - check if they contain Maps or Dates
      serialized[key] = serializeObject(value);
    } else {
      serialized[key] = value;
    }
  }

  return serialized;
};

/**
 * Recursively serialize nested objects
 */
function serializeObject(
  obj: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value instanceof Map) {
      result[key] = Object.fromEntries(value);
    } else if (value instanceof Date) {
      result[key] = value.toISOString();
    } else if (Array.isArray(value)) {
      result[key] = value.map((item) => {
        if (item instanceof Date) return item.toISOString();
        if (item instanceof Map) return Object.fromEntries(item);
        return item;
      });
    } else if (value && typeof value === "object") {
      result[key] = serializeObject(value as Record<string, unknown>);
    } else {
      result[key] = value;
    }
  }

  return result;
}
