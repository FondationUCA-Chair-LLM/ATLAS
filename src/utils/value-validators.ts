/**
 * Value Validators — used by the test-data generator to decide whether a
 * value extracted from a wireframe / screenshot is plausible enough to trust,
 * or whether to fall through to the faker-based generator.
 *
 * Pure functions, no external dependencies. Each function returns `true` when
 * the value is "plausible" for the given field kind.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Phone: very loose — accept digits, spaces, dashes, parens, leading +.
// We just need to reject things like "123456789" used as a label, or empty strings.
const PHONE_RE = /^[+()\d][\d\s().-]{5,}$/;
const URL_RE = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+([/?#].*)?$/i;
const ZIP_RE = /^[A-Za-z0-9][A-Za-z0-9\s-]{2,9}$/;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
// Words that often appear in default/placeholder option text in <select>.
const SELECT_PLACEHOLDER_RE =
  /^(---.*---|please\s+select|select\.{3,}|choose\.{3,}|\*{3,}|select\s+(a|an)\s+.*)$/i;

/** Loose email check — used to reject obvious non-emails from VLM output. */
export function isValidEmail(value: string | undefined): boolean {
  if (!value) return false;
  return EMAIL_RE.test(value.trim());
}

/** Loose phone check — at least 6 chars, mostly digits, allows formatting. */
export function isValidPhone(value: string | undefined): boolean {
  if (!value) return false;
  const trimmed = value.trim();
  if (trimmed.length < 6 || trimmed.length > 32) return false;
  return PHONE_RE.test(trimmed);
}

/** Loose URL check — accepts schemeless and scheme-prefixed. */
export function isValidUrl(value: string | undefined): boolean {
  if (!value) return false;
  return URL_RE.test(value.trim());
}

/** Loose ZIP / postcode check. */
export function isValidZip(value: string | undefined): boolean {
  if (!value) return false;
  return ZIP_RE.test(value.trim());
}

/** ISO date check (YYYY-MM-DD). */
export function isValidDate(value: string | undefined): boolean {
  if (!value) return false;
  if (!ISO_DATE_RE.test(value.trim())) return false;
  const d = new Date(value);
  return !Number.isNaN(d.getTime());
}

/** Quantity: 1–999 integer string. */
export function isPlausibleQuantity(value: string | undefined): boolean {
  if (!value) return false;
  const n = Number(value.trim());
  return Number.isInteger(n) && n >= 1 && n <= 999;
}

/** Detect default/placeholder option text in a <select>. */
export function isSelectPlaceholder(value: string | undefined): boolean {
  if (!value) return false;
  return SELECT_PLACEHOLDER_RE.test(value.trim());
}

/** Reject things that obviously aren't a name (pure digits, html tags, etc.). */
export function isPlausibleName(value: string | undefined): boolean {
  if (!value) return false;
  const v = value.trim();
  if (v.length < 2 || v.length > 80) return false;
  if (/^\d+$/.test(v)) return false;
  if (/[<>{}]/.test(v)) return false;
  return /[A-Za-z]/.test(v);
}

/** Reject things that obviously aren't a street address. */
export function isPlausibleStreet(value: string | undefined): boolean {
  if (!value) return false;
  const v = value.trim();
  if (v.length < 3 || v.length > 120) return false;
  if (/[<>{}]/.test(v)) return false;
  // Address must contain at least one digit or "apt/suite" marker.
  return /\d/.test(v) || /\b(apt|suite|ste|unit)\b/i.test(v);
}

/** Reject HTML/script leakage in extracted values. */
export function containsHtmlNoise(value: string | undefined): boolean {
  if (!value) return false;
  return /[<>{}]/.test(value);
}

/**
 * Top-level gate: given a value extracted from a wireframe, the field intent
 * and the HTML element type, decide whether the value is plausible enough to
 * trust. Used by the data agent before it falls back to faker.
 */
export function isPlausibleExtractedValue(
  value: string | undefined,
  intent: string,
  elementType: string,
): boolean {
  if (!value) return false;
  const v = value.trim();
  if (v.length === 0 || v.length > 400) return false;

  // HTML leakage is never plausible for a form value.
  if (containsHtmlNoise(v)) return false;

  if (isSelectPlaceholder(v)) return false;

  // "123456789" used as a phone label is the classic VLM confusion case.
  if (
    /^\d{1,12}$/.test(v) &&
    (intent === "fullName" || intent === "firstName" || intent === "lastName")
  ) {
    return false;
  }

  switch (intent) {
    case "email":
      return isValidEmail(v);
    case "phone":
    case "telephone":
      return isValidPhone(v);
    case "zip":
      return isValidZip(v);
    case "url":
      return isValidUrl(v);
    case "date":
    case "dob":
      return isValidDate(v);
    case "quantity":
      return isPlausibleQuantity(v);
    case "firstName":
    case "lastName":
    case "fullName":
      return isPlausibleName(v);
    case "street":
      return isPlausibleStreet(v);
    default:
      break;
  }

  if (elementType === "input" && /^\d+$/.test(v) && v.length > 10) {
    // Pure 11+ digit number for a plain input is suspicious.
    return false;
  }

  return true;
}
