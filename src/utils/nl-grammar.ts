import { cleanElementText, getCanonicalLabel } from "./label-utils";

/**
 * Centralized NL action grammar.
 *
 * Both the test-case builder and the runner/parser use these rules
 * so generated NL strings and parsed patterns are guaranteed to match.
 */

export interface GrammarRule {
  /** Regex that recognizes this pattern in a raw NL action string */
  regex: RegExp;
  /** Method forwarded to Stagehand / Playwright (click, type, fill, press, selectOption) */
  method: string;
  /** Which regex capture group provides the target (field name / element label) */
  targetGroup: number;
  /** Which regex capture group(s) provide the argument values */
  argumentGroups: number[];
  /** Human-readable description for debugging */
  description: string;
}

/** Grammar rules used by the runner to parse an NL action back into method + target + args */
export const PARSE_RULES: GrammarRule[] = [
  {
    regex: /^Click\s+on\s+'([^']+)'/i,
    method: "click",
    targetGroup: 1,
    argumentGroups: [],
    description: "Click on 'X'",
  },
  {
    regex: /^Type\s+in\s+'([^']+)'\s+in\s+(?:the\s+)?field\s+'([^']+)'/i,
    method: "type",
    targetGroup: 2,
    argumentGroups: [1],
    description: "Type in 'Y' in the field 'Z'",
  },
  {
    regex: /^Fill\s+'([^']+)'\s+with\s+'([^']+)'/i,
    method: "fill",
    targetGroup: 1,
    argumentGroups: [2],
    description: "Fill 'Z' with 'Y'",
  },
  {
    regex: /^Press\s+'([^']+)'/i,
    method: "press",
    targetGroup: 0,
    argumentGroups: [1],
    description: "Press 'Key'",
  },
  {
    regex: /^Select\s+'([^']+)'\s+from\s+'([^']+)'/i,
    method: "selectOption",
    targetGroup: 2,
    argumentGroups: [1],
    description: "Select 'Y' from 'Z'",
  },
  {
    regex: /^Set\s+'([^']+)'\s+to\s+'([^']+)'/i,
    method: "click",
    targetGroup: 1,
    argumentGroups: [2],
    description: "Set 'Z' to 'Y'",
  },
  {
    regex: /^Set\s+'([^']+)'\s+on\s+'([^']+)'/i,
    method: "click",
    targetGroup: 1,
    argumentGroups: [2],
    description: "Set 'X' on 'Y'",
  },
  {
    regex: /^Check\s+'([^']+)'/i,
    method: "click",
    targetGroup: 1,
    argumentGroups: [],
    description: "Check 'X'",
  },
  {
    regex: /^Uncheck\s+'([^']+)'/i,
    method: "click",
    targetGroup: 1,
    argumentGroups: [],
    description: "Uncheck 'X'",
  },
];

/** Parsed result from a successful grammar match */
export interface ParsedNLAction {
  method: string;
  target: string;
  arguments: string[];
}

/**
 * Parse a natural-language test step into a deterministic action.
 * Returns null for unrecognized patterns so the caller can fall back
 * to full LLM-based observe+act.
 */
export function parseNLAction(step: string): ParsedNLAction | null {
  const trimmed = step.trim();

  for (const rule of PARSE_RULES) {
    const match = trimmed.match(rule.regex);
    if (match) {
      return {
        method: rule.method,
        target: rule.targetGroup === 0 ? "" : match[rule.targetGroup],
        arguments: rule.argumentGroups.map((g) => match[g]),
      };
    }
  }

  return null;
}

/* ------------------------------------------------------------------ */
/*  Builder-side helpers — generate NL strings from element metadata    */
/* ------------------------------------------------------------------ */

export interface ElementLike {
  label?: string;
  text?: string;
  type?: string;
  /** Extracted checked state for checkboxes (and radios). undefined = unknown. */
  checked?: boolean;
}

/**
 * Generate an NL action string for an interactive element.
 * The returned string contains a <placeholder> token that the
 * data resolver replaces later with the generated value.
 */
export function buildNLAction(
  element: ElementLike,
  value?: string,
): string | null {
  const label = getCanonicalLabel(element);
  if (!label) return null;

  //todo: remove tmp for Currency problem
  if (label.toLowerCase().includes("currency")) {
    return null;
  }

  switch (element.type) {
    case "input":
    case "textarea":
      // After data resolution: Type in 'value' in the field 'label'
      return `Type in <${label}> in the field '${label}'`;
    case "checkbox": {
      // Honor the extracted checked state: an already-unchecked box must
      // not be flipped to checked by the test. Check vs Uncheck reflects the
      // intended state, not a one-size-fits-all positive verb.
      const verb = element.checked === false ? "Uncheck" : "Check";
      if (element.text !== undefined && element.text !== "") {
        const text = cleanElementText(element.text);
        return `${verb} '${text}'`;
      }
      return `${verb} '${label}'`;
    }
    case "radio":
      // Human-readable: Set 'Male' on 'Gender'.
      if (element.text !== undefined && element.text !== "") {
        const text = cleanElementText(element.text);
        return `Set '${text}' on '${label}'`;
      }
      return `Set '${label}' on '${label}'`;
    case "select":
      return value !== undefined
        ? `Select '${value}' from '${label}'`
        : `Select <${label}> from '${label}'`;
    case "button":
      return `Click on '${label}'`;
    case "link":
      return `Click on '${label}'`;
    default:
      return null;
  }
}
