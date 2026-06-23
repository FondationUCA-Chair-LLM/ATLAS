// utils/xpath.js
//
// Thin wrapper around data/xpath_mapping.json.
// Every locator used by the test suite is resolved through this module so
// that the mapping file stays the single source of truth for UI elements,
// exactly as supplied for this assignment.

const fs = require('fs');
const path = require('path');

//const MAPPING_PATH = path.join(__dirname, '..', 'data', 'xpath_mapping.json');
const MAPPING_PATH = path.join(__dirname, 'xpath_mapping.json');
const mapping = JSON.parse(fs.readFileSync(MAPPING_PATH, 'utf-8'));

/**
 * Returns the raw XPath string for a given screen/label pair.
 *
 * Some screens contain two UI elements that share the same human label
 * (e.g. "Login_Page" has a breadcrumb link AND a submit button both
 * labelled "Login"). When that happens, pass `occurrence` (0-based) to
 * pick the right one. Defaults to the first match.
 */
function getXPath(screen, label, occurrence = 0) {
  const entries = mapping[screen];
  if (!entries) {
    throw new Error(`xpath_mapping.json has no screen named "${screen}"`);
  }
  const matches = entries.filter((e) => e.label === label);
  if (matches.length === 0) {
    throw new Error(`xpath_mapping.json: screen "${screen}" has no element labelled "${label}"`);
  }
  const entry = matches[occurrence] || matches[0];
  if (!entry.xpath) {
    throw new Error(
      `xpath_mapping.json: element "${label}" on screen "${screen}" (occurrence ${occurrence}) has an empty xpath`
    );
  }
  return entry.xpath;
}

/**
 * Returns a Playwright-ready locator string ("xpath=...") for a given
 * screen/label pair. Use with page.locator(xp('Screen', 'Label')).
 */
function xp(screen, label, occurrence = 0) {
  return `xpath=${getXPath(screen, label, occurrence)}`;
}

module.exports = { getXPath, xp, mapping };
