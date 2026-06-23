/**
 * Centralized label/text utilities for UI elements.
 * ALL label/text cleanup, key generation, escaping, and comparison
 * across the entire pipeline happens in this file ONLY.
 *
 * Rule: After extraction (postProcessElements), every downstream consumer
 * should read pre-cleaned labels. Use getCanonicalLabel(element) everywhere.
 */

/** 1. Clean raw VLM output: strip leading "* " / "*" and collapse spaces. */
export function cleanElementText(value: string): string {
  return (
    value
      // Remove leading "* " or "*" or "$ "
      .replace(/^(\*|\$)\s*/, "")
      .replace(/\s+/g, " ") // Collapse multiple spaces
      .trim()
  );
}

/** 2. Return the canonical human-readable label for an element.
 *  Always use this instead of reading element.label / element.text directly.
 */
export function getCanonicalLabel(element: {
  type?: string;
  label?: string;
  text?: string;
  placeholder?: string;
}): string {
  if (element.type === "input") {
    return cleanElementText(
      element.label || element.text || element.placeholder || "",
    );
  }

  return cleanElementText(element.label || element.text || "");
}

/** 3. Convert any string to a snake_case field key.
 *  Replaces the old normalizeFieldKey from field-key-utils.ts.
 */
export function toFieldKey(value?: string): string {
  const normalized = (value || "")
    .trim()
    .toLowerCase()
    .replace(/[:"'`]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return normalized || "field";
}

/** 4. Get the canonical data key for an element.
 *  Uses the cleaned label so generation and consumption keys always match.
 */
export function getElementDataKey(element: {
  label?: string;
  text?: string;
  type?: string;
}): string {
  if (
    element.type === "radio" &&
    element.text !== undefined &&
    element.label !== undefined
  ) {
    return toFieldKey(cleanElementText(element.text));
  }

  return toFieldKey(getCanonicalLabel(element));
}

/** 5. Escape a string for use in Playwright generated code.
 *  Replaces the old escapeStringForPlaywright from field-key-utils.ts.
 */
export function escapeForPlaywright(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

/** 6. Normalize for fuzzy comparison (lowercase + trim). */
export function normalizeForCompare(value?: string): string {
  return (value || "").trim().toLowerCase();
}

/** 7. Convert a cleaned page name back to PascalCaseNoSpaces
 *  (e.g. "home anon", "Home Anon") → "HomeAnon".
 */
export function toPascalCaseNoSpaces(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("");
}

/** 8. Convert a raw node/path identifier to spaced lowercase.
 *  (e.g. "Home-Anon_Screen" → "home anon screen").
 */
export function toSpacedLowerCase(name: string): string {
  return name
    .replace(/[-_]/g, " ")
    .replace(/([A-Z])/g, " $1")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}
