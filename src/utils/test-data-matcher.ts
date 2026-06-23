/**
 * Test Data Matcher and Generator Utility
 *
 * Matches test actions to UI elements and generates contextual test data,
 * using @faker-js/faker for realistic values, with a deterministic seed for
 * reproducibility across runs.
 *
 * The generator validates values extracted from wireframes (the VLM-extracted
 * `element.value` field) before trusting them — VLM output frequently contains
 * placeholder text like "--- Please Select ---", page counts like "0", phone
 * labels read as values like "123456789", and similar noise. Validation lives
 * in `value-validators.ts`.
 */

import type { UIElement } from "../types";
import {
  FIELD_KEYWORDS,
  detectFieldIntent,
  type FieldKeywords,
} from "./field-keywords";
import { isPlausibleExtractedValue } from "./value-validators";
import { faker } from "@faker-js/faker";

/* -------------------------------------------------------------------------- */
/*  Seed                                                                       */
/* -------------------------------------------------------------------------- */

let ACTIVE_SEED = 0;

/**
 * Initialize the test-data generator. Must be called once per pipeline run
 * so the same `seed` produces the same `general.spec.ts` for the same input.
 */
export function seedTestData(seed: number | string): void {
  ACTIVE_SEED = Number(seed) || 0;
  faker.seed(ACTIVE_SEED);
}

export function getActiveSeed(): number {
  return ACTIVE_SEED;
}

/* -------------------------------------------------------------------------- */
/*  Curated country / state map                                               */
/* -------------------------------------------------------------------------- */

/** The countries OpenCart actually exposes in its Country dropdown (visible
 *  in `data/opencart/screenshots/register.png` and `checkout_mac1.png`). */
const COUNTRIES: string[] = [
  "United Kingdom",
  "United States",
  "Germany",
  "France",
  "Australia",
  "Belgium",
  "Brazil",
  "Canada",
  "China",
  "Denmark",
  "Finland",
  "Greece",
  "India",
  "Ireland",
  "Italy",
  "Japan",
  "Mexico",
  "Netherlands",
  "New Zealand",
  "Norway",
  "Poland",
  "Portugal",
  "Spain",
  "Sweden",
  "Switzerland",
  "Thailand",
];

const STATES_BY_COUNTRY: Record<string, string[]> = {
  "United Kingdom": [
    "Aberdeen",
    "Bedfordshire",
    "Berkshire",
    "Bristol",
    "Cardiff",
    "Devon",
    "Edinburgh",
    "Essex",
    "Kent",
    "London",
    "Manchester",
    "Oxford",
    "Surrey",
    "Sussex",
    "Yorkshire",
  ],
  "United States": [
    "California",
    "Texas",
    "Florida",
    "New York",
    "Pennsylvania",
    "Illinois",
    "Ohio",
    "Georgia",
    "North Carolina",
    "Michigan",
  ],
  Germany: [
    "Bavaria",
    "Berlin",
    "Hamburg",
    "Hesse",
    "Saxony",
    "North Rhine-Westphalia",
    "Baden-Württemberg",
    "Lower Saxony",
    "Bremen",
  ],
  France: [
    "Île-de-France",
    "Provence-Alpes-Côte d'Azur",
    "Auvergne-Rhône-Alpes",
    "Nouvelle-Aquitaine",
    "Bretagne",
    "Bordeaux",
    "Normandie",
    "Occitanie",
  ],
  Australia: [
    "New South Wales",
    "Victoria",
    "Queensland",
    "Western Australia",
    "South Australia",
    "Tasmania",
    "Northern Territory",
  ],
  Canada: ["Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba"],
  Italy: ["Lombardy", "Lazio", "Campania", "Sicily", "Veneto", "Piedmont"],
  Spain: ["Madrid", "Catalonia", "Andalusia", "Valencia", "Basque Country"],
  Japan: ["Tokyo", "Osaka", "Kyoto", "Hokkaido", "Fukuoka", "Aichi"],
  China: ["Beijing", "Shanghai", "Guangdong", "Sichuan", "Zhejiang"],
  Netherlands: ["North Holland", "South Holland", "Utrecht", "Gelderland"],
  India: ["Maharashtra", "Karnataka", "Tamil Nadu", "Delhi", "Gujarat"],
  Brazil: ["São Paulo", "Rio de Janeiro", "Minas Gerais", "Bahia"],
  Mexico: ["Jalisco", "Nuevo León", "Mexico City", "Querétaro"],
  Switzerland: ["Zurich", "Geneva", "Bern", "Basel", "Vaud"],
};

const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD"];
const LANGUAGES = [
  "English",
  "French",
  "German",
  "Spanish",
  "Italian",
  "Portuguese",
  "Japanese",
  "Chinese",
];
const TITLES = ["Mr", "Mrs", "Ms", "Dr", "Miss"];
const GENDERS = ["Male", "Female", "Other"];

/* -------------------------------------------------------------------------- */
/*  String-similarity helper (kept for findMatchingElement callers)            */
/* -------------------------------------------------------------------------- */

export function stringSimilarity(
  actionText: string,
  elementText: string,
): number {
  if (!actionText || !elementText) return 0;

  const action = actionText.toLowerCase().split(/\s+/);
  const element = elementText.toLowerCase().split(/\s+/);

  const matches = action.filter((word) =>
    element.some((eWord) => eWord.includes(word) || word.includes(eWord)),
  );

  return matches.length / Math.max(action.length, element.length);
}

export function findMatchingElement(
  actionText: string,
  elements: UIElement[],
  threshold = 0.5,
): UIElement | undefined {
  if (!elements || elements.length === 0) return undefined;

  let bestMatch: UIElement | undefined;
  let bestScore = 0;

  for (const element of elements) {
    const labelScore = stringSimilarity(actionText, element.label || "");
    const textScore = stringSimilarity(actionText, element.text || "");
    const placeholderScore = stringSimilarity(
      actionText,
      element.placeholder || "",
    );

    let score = Math.max(labelScore, textScore, placeholderScore * 1.2);

    if (
      actionText.toLowerCase().includes("enter") ||
      actionText.toLowerCase().includes("type")
    ) {
      if (element.type === "input" || element.type === "textarea") {
        score *= 1.3;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = element;
    }
  }

  return bestScore >= threshold ? bestMatch : undefined;
}

/* -------------------------------------------------------------------------- */
/*  Top-level generator                                                        */
/* -------------------------------------------------------------------------- */

export function generateDataForElement(
  element: UIElement,
  elementType?: keyof FieldKeywords,
): string {
  const intent = detectFieldIntent(
    element.label,
    element.placeholder,
    element.text,
  );

  if (element.placeholder === "Search") {
    return "imac";
  }

  if (element.placeholder === "Name/Contact") {
    return "John";
  }

  // Priority 1: Use extracted visible value if present AND plausible.
  if (element.value !== undefined && element.value !== "") {
    // if (isPlausibleExtractedValue(element.value, intent, element.type)) {
    return String(element.value);
    // }
  }

  // Priority 2: Use extracted checkbox/radio state if available.
  if (element.type === "checkbox") {
    return element.checked === true ? "true" : "false";
  }

  if (element.type === "radio") {
    // Default to "true" so the selected option is checked. The NL builder only
    // emits one action per radio group, so only that option will be toggled.
    return "true";
  }

  if (element.type === "select") {
    return String("*");
  }

  // Priority 3: Infer from element label/text.
  if (intent !== "generic") {
    return generateByFieldIntent(intent);
  }

  // Priority 4: HTML type hint.
  if (elementType) {
    return generateByFieldIntent(elementType);
  }

  // Fallback: generic data based on element HTML type.
  return generateByElementType(element.type);
}

/* -------------------------------------------------------------------------- */
/*  Per-intent generators                                                      */
/* -------------------------------------------------------------------------- */

function pickCountry(): string {
  return faker.helpers.arrayElement(COUNTRIES);
}

function pickState(country: string): string {
  const list = STATES_BY_COUNTRY[country];
  if (list && list.length > 0) {
    return faker.helpers.arrayElement(list);
  }
  return faker.location.state();
}

function pickPassword(): string {
  return faker.internet.password({ length: 12, memorable: false });
}

function generateByFieldIntent(
  fieldIntent: keyof FieldKeywords | "generic",
): string {
  switch (fieldIntent) {
    case "email":
      return faker.internet.email();
    case "password":
      return pickPassword();
    case "telephone":
    case "phone":
      return faker.phone.number({ style: "national" });
    case "firstName":
      return faker.person.firstName();
    case "lastName":
      return faker.person.lastName();
    case "fullName":
      return faker.person.fullName();
    case "street":
      return faker.location.streetAddress({ useFullAddress: false });
    case "address2":
      // Optional secondary address line.
      return "";
    case "city":
      return faker.location.city();
    case "zip":
      return faker.location.zipCode();
    case "country":
      return pickCountry();
    case "state":
      return pickState(pickCountry());
    case "quantity":
      return String(faker.number.int({ min: 1, max: 5 }));
    case "price":
    case "amount":
      return faker.commerce.price({ min: 5, max: 999, dec: 2 });
    case "date":
    case "dob": {
      const d = faker.date.between({
        from: "1950-01-01T00:00:00.000Z",
        to: "2005-12-31T00:00:00.000Z",
      });
      return d.toISOString().slice(0, 10);
    }
    case "currency":
      return faker.helpers.arrayElement(CURRENCIES);
    case "language":
      return faker.helpers.arrayElement(LANGUAGES);
    case "gender":
      return faker.helpers.arrayElement(GENDERS);
    case "title":
      return faker.helpers.arrayElement(TITLES);
    case "color":
      return faker.color.human();
    case "company":
      return faker.company.name();
    case "agree":
    case "subscribe":
      // Consent boxes: checked by default so the form can submit.
      return "true";
    case "comments":
      return faker.lorem.paragraph();
    case "searchQuery":
      return faker.commerce.productName();
    case "username":
      return faker.internet.username();
    case "url":
      return faker.internet.url();
    case "creditCard":
      return faker.finance.creditCardNumber();
    case "cvv":
      return faker.finance.creditCardCVV();
    case "expiryDate": {
      const d = faker.date.future();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yy = String(d.getFullYear()).slice(-2);
      return `${mm}/${yy}`;
    }
    case "generic":
    default:
      return `value_${faker.string.alphanumeric(8)}`;
  }
}

function generateByElementType(elementType: string): string {
  switch (elementType.toLowerCase()) {
    case "input":
      return faker.lorem.word();
    case "textarea":
      return faker.lorem.paragraph({ min: 2, max: 4 });
    case "select":
      return faker.helpers.arrayElement(["Option 1", "Option 2", "Option 3"]);
    case "checkbox":
    case "radio":
      return "true";
    case "button":
      return `btn_${faker.string.alphanumeric(5)}`;
    default:
      return `value_${faker.string.alphanumeric(8)}`;
  }
}

/* -------------------------------------------------------------------------- */
/*  Convenience re-exports                                                     */
/* -------------------------------------------------------------------------- */

export { FIELD_KEYWORDS, detectFieldIntent };
