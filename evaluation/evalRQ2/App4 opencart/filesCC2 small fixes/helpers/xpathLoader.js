// xpathLoader.js
//
// Single source of truth for UI element locators.
// All xpaths are read directly from xpath_mapping.json (provided by the
// navigation-graph extraction step) so that test scripts never hard-code an
// xpath string themselves. If the mapping file is regenerated, the tests
// automatically pick up the new values.

const fs = require('fs');
const path = require('path');

const MAPPING_PATH = path.join(__dirname, 'xpath_mapping.json');
const xpathMap = JSON.parse(fs.readFileSync(MAPPING_PATH, 'utf-8'));

/**
 * Look up the xpath for a given screen/label pair.
 *
 * A few screens reuse the same label for two different elements (e.g. on
 * Login_Page the label "Login" is used both for the top navigation link and
 * for the form submit button). In those cases pass `occurrence` (0-based) to
 * disambiguate. The default is 0 (first match in the JSON array).
 *
 * @param {string} screen - node id as defined in navigation_graph.json
 * @param {string} label - the UI element label as defined in xpath_mapping.json
 * @param {number} occurrence - which match to use when a label repeats on a screen
 * @returns {string} the raw xpath expression (without the "xpath=" prefix)
 */
function getXPath(screen, label, occurrence = 0) {
  const entries = xpathMap[screen];
  if (!entries) {
    throw new Error(
      `[xpathLoader] No entries found for screen "${screen}" in xpath_mapping.json`
    );
  }
  const matches = entries.filter((e) => e.label === label);
  if (matches.length === 0) {
    throw new Error(
      `[xpathLoader] No element with label "${label}" found for screen "${screen}" in xpath_mapping.json`
    );
  }
  if (occurrence >= matches.length) {
    throw new Error(
      `[xpathLoader] Requested occurrence ${occurrence} for label "${label}" on screen "${screen}", ` +
        `but only ${matches.length} match(es) exist.`
    );
  }
  const xpath = matches[occurrence].xpath;
  if (!xpath) {
    throw new Error(
      `[xpathLoader] Element "${label}" on screen "${screen}" has an empty xpath in xpath_mapping.json`
    );
  }
  return xpath;
}

/**
 * Convenience wrapper: returns a Playwright locator built from
 * xpath_mapping.json for the given screen/label.
 *
 * @param {import('@playwright/test').Page} page
 */
function locate(page, screen, label, occurrence = 0) {
  return page.locator(`xpath=${getXPath(screen, label, occurrence)}`);
}

module.exports = { getXPath, locate, xpathMap };
