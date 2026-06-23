// utils/xpaths.js
//
// Thin wrapper around data/xpath_mapping.json so that test files never
// hard-code raw xpath strings. Every UI element used by the tests is
// looked up by its (screen, label) pair, exactly as described in the
// provided mapping file.

const xpathMap = require('../data/xpath_mapping.json');

/**
 * Returns a Playwright "xpath=" locator string for the given screen/label
 * pair, as defined in xpath_mapping.json.
 *
 * @param {string} screen - Screen/node id, e.g. "Login", "Vendors"
 * @param {string} label  - Element label, e.g. "Username", "+ Add Vendors"
 * @returns {string} a Playwright locator string, e.g. "xpath=//*[@id=...]"
 */
function xp(screen, label) {
  const screenDefs = xpathMap[screen];
  if (!screenDefs) {
    throw new Error(`xpath_mapping.json has no screen named "${screen}"`);
  }

  const entry = screenDefs.find((e) => e.label === label);
  if (!entry) {
    const available = screenDefs.map((e) => e.label).join(', ');
    throw new Error(
      `xpath_mapping.json has no label "${label}" for screen "${screen}". ` +
        `Available labels: ${available}`
    );
  }

  if (!entry.xpath) {
    throw new Error(
      `xpath_mapping.json defines an empty xpath for "${screen}" -> "${label}". ` +
        `This element needs a real xpath before it can be used in a test.`
    );
  }

  return `xpath=${entry.xpath}`;
}

module.exports = { xp, xpathMap };
