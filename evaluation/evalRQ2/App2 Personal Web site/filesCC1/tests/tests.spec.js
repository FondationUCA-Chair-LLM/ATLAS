// ============================================================
// Playwright Acceptance Tests — Sébastien Salva Academic Website
// URL: https://perso.limos.fr/~sesalva/
// XPaths sourced from xpath_mapping.json
// ============================================================

const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://perso.limos.fr/~sesalva/';

// ── XPath helpers ──────────────────────────────────────────────────────────────
// Playwright uses CSS selectors natively; for XPath, wrap with page.locator('xpath=...')

// Navbar links (Home page)
const XPATH_NAV_HOME        = '//*[@id="navbar-content"]/ul/li[1]/a';
const XPATH_NAV_RESEARCH    = '//*[@id="navbar-content"]/ul/li[2]/a';
const XPATH_NAV_TOOLS       = '//*[@id="navbar-content"]/ul/li[3]/a';
const XPATH_NAV_PUBLICATIONS= '//*[@id="navbar-content"]/ul/li[4]/a';
const XPATH_NAV_TEACHING    = '//*[@id="navbar-content"]/ul/li[5]/a';
const XPATH_NAV_PROJECTS    = '//*[@id="navbar-content"]/ul/li[6]/a';
const XPATH_NAV_CONTACT     = '//*[@id="navbar-content"]/ul/li[7]/a';

// Contact form fields
const XPATH_INPUT_NAME    = '//*[@id="inputName"]';
const XPATH_INPUT_EMAIL   = '//*[@id="inputEmail"]';
const XPATH_INPUT_MESSAGE = '//*[@id="inputMessage"]';
const XPATH_BTN_SEND      = '//*[@id="contact"]/div[2]/div/div[2]/div[1]/form/button';

// Publications page
const XPATH_PUB_SEARCH    = '//*[@id="top"]/div[2]/div[2]/div/div/div[1]/div[1]/input';
const XPATH_PUB_TYPE      = '//*[@id="top"]/div[2]/div[2]/div/div/div[1]/div[2]/select';
const XPATH_PUB_DATE      = '//*[@id="top"]/div[2]/div[2]/div/div/div[1]/div[3]/select';
const XPATH_PUB_NL_EXEC   = '//*[@id="container-publications"]/div[1]/div/a';

// Teaching sidebar
const XPATH_TEACH_COURS_SE  = '//*[@id="docs-nav"]/ul/div[8]/a';
const XPATH_TEACH_COURS_PHP = '//*[@id="docs-nav"]/ul/div[4]/a';

// ── Shared helper ──────────────────────────────────────────────────────────────
async function goHome(page) {
  await page.goto(BASE_URL);
  await page.waitForLoadState('networkidle');
}


// ══════════════════════════════════════════════════════════════════════════════
// TC-01 — Home Page Loads with Biography and Navigation
// ══════════════════════════════════════════════════════════════════════════════
test('TC-01: Home page loads with biography, interests, education and navbar', async ({ page }) => {
  await goHome(page);

  // Site title / brand in navbar
  await expect(page.locator('text=Sébastien Salva').first()).toBeVisible();

  // All navbar links present
  await expect(page.locator(`xpath=${XPATH_NAV_HOME}`)).toBeVisible();
  await expect(page.locator(`xpath=${XPATH_NAV_RESEARCH}`)).toBeVisible();
  await expect(page.locator(`xpath=${XPATH_NAV_TOOLS}`)).toBeVisible();
  await expect(page.locator(`xpath=${XPATH_NAV_PUBLICATIONS}`)).toBeVisible();
  await expect(page.locator(`xpath=${XPATH_NAV_TEACHING}`)).toBeVisible();
  await expect(page.locator(`xpath=${XPATH_NAV_PROJECTS}`)).toBeVisible();
  await expect(page.locator(`xpath=${XPATH_NAV_CONTACT}`)).toBeVisible();

  // Biography section
  await expect(page.locator('text=Biography')).toBeVisible();
  await expect(page.locator('text=University of Auvergne')).toBeVisible();

  // Interests section
  await expect(page.locator('text=Interests')).toBeVisible();
  await expect(page.locator('text=Software Engineering')).toBeVisible();

  // Education section
  await expect(page.locator('text=Education')).toBeVisible();
  await expect(page.locator('text=HDR')).toBeVisible();
});


// ══════════════════════════════════════════════════════════════════════════════
// TC-02 — Navigate from Home to Research Page
// ══════════════════════════════════════════════════════════════════════════════
test('TC-02: Clicking Research nav link opens the Research page', async ({ page }) => {
  await goHome(page);

  await page.locator(`xpath=${XPATH_NAV_RESEARCH}`).click();
  await page.waitForLoadState('networkidle');

  // Heading
  await expect(page.locator('text=Research topics')).toBeVisible();

  // Research sections visible
  await expect(page.locator('text=Data Quality')).toBeVisible();
  await expect(page.locator('text=Model-based Testing')).toBeVisible();

  // "Home" link available for return navigation
  await expect(page.locator(`xpath=${XPATH_NAV_HOME}`)).toBeVisible();
});


// ══════════════════════════════════════════════════════════════════════════════
// TC-03 — Navigate from Home to Tools Page
// ══════════════════════════════════════════════════════════════════════════════
test('TC-03: Clicking Tools nav link opens the Tools page', async ({ page }) => {
  await goHome(page);

  await page.locator(`xpath=${XPATH_NAV_TOOLS}`).click();
  await page.waitForLoadState('networkidle');

  // Page heading and subtitle
  await expect(page.locator('h1, h2').filter({ hasText: 'Tools' }).first()).toBeVisible();
  await expect(page.locator('text=Tools related to project or publications')).toBeVisible();

  // Tool sections
  await expect(page.locator('text=Natural Language test case execution and agent evaluation')).toBeVisible();
  await expect(page.locator('text=Restful API healing with LLMs')).toBeVisible();
  await expect(page.locator('text=Event log to Conversations')).toBeVisible();
});


// ══════════════════════════════════════════════════════════════════════════════
// TC-04 — Navigate from Home to Publications Page
// ══════════════════════════════════════════════════════════════════════════════
test('TC-04: Clicking Publications nav link opens the Publications page', async ({ page }) => {
  await goHome(page);

  await page.locator(`xpath=${XPATH_NAV_PUBLICATIONS}`).click();
  await page.waitForLoadState('networkidle');

  // Page heading
  await expect(page.locator('h1, h2').filter({ hasText: 'Publications' }).first()).toBeVisible();

  // At least one publication entry
  await expect(page.locator('text=Sébastien Salva, Redha Taguelmimt (2026)').first()).toBeVisible();

  // Search / filter controls
  await expect(page.locator(`xpath=${XPATH_PUB_SEARCH}`)).toBeVisible();
  await expect(page.locator(`xpath=${XPATH_PUB_TYPE}`)).toBeVisible();
  await expect(page.locator(`xpath=${XPATH_PUB_DATE}`)).toBeVisible();
});


// ══════════════════════════════════════════════════════════════════════════════
// TC-05 — Navigate from Home to Teaching Page
// ══════════════════════════════════════════════════════════════════════════════
test('TC-05: Clicking Teaching nav link opens the Teaching page', async ({ page }) => {
  await goHome(page);

  await page.locator(`xpath=${XPATH_NAV_TEACHING}`).click();
  await page.waitForLoadState('networkidle');

  // Page heading
  await expect(page.locator('h1, h2').filter({ hasText: 'Teaching' }).first()).toBeVisible();

  // Sidebar course links
  await expect(page.locator(`xpath=${XPATH_TEACH_COURS_SE}`)).toBeVisible();
  await expect(page.locator(`xpath=${XPATH_TEACH_COURS_PHP}`)).toBeVisible();

  // Main content course levels
  await expect(page.locator('text=BUT 2A')).toBeVisible();
  await expect(page.locator('text=BUT 3A')).toBeVisible();
});


// ══════════════════════════════════════════════════════════════════════════════
// TC-06 — Navigate from Research Page Back to Home
// ══════════════════════════════════════════════════════════════════════════════
test('TC-06: Home link on Research page returns to Home page', async ({ page }) => {
  await goHome(page);

  // Go to Research
  await page.locator(`xpath=${XPATH_NAV_RESEARCH}`).click();
  await page.waitForLoadState('networkidle');
  await expect(page.locator('text=Research topics')).toBeVisible();

  // Return to Home via navbar
  await page.locator(`xpath=${XPATH_NAV_HOME}`).click();
  await page.waitForLoadState('networkidle');

  // Confirm we are back on Home
  await expect(page.locator('text=Biography')).toBeVisible();
  await expect(page.locator('text=Sébastien Salva').first()).toBeVisible();
});


// ══════════════════════════════════════════════════════════════════════════════
// TC-07 — Navigate from Publications to NL Exec Publication Detail
// ══════════════════════════════════════════════════════════════════════════════
test('TC-07: Clicking NL Exec publication link opens the publication detail page', async ({ page }) => {
  await goHome(page);

  // Go to Publications
  await page.locator(`xpath=${XPATH_NAV_PUBLICATIONS}`).click();
  await page.waitForLoadState('networkidle');

  // Click the specific publication link
  await page.locator(`xpath=${XPATH_PUB_NL_EXEC}`).click();
  await page.waitForLoadState('networkidle');

  // Verify detail page content
  await expect(
    page.locator('text=On the Soundness and Consistency of LLM Agents for Executing Test Cases Written in Natural Language')
  ).toBeVisible();

  // Authors
  await expect(page.locator('text=Sébastien Salva, Redha Taguelmimt')).toBeVisible();

  // Abstract section
  await expect(page.locator('text=Abstract')).toBeVisible();

  // Action buttons
  await expect(page.locator('text=PDF').first()).toBeVisible();
  await expect(page.locator('text=Cite').first()).toBeVisible();
});


// ══════════════════════════════════════════════════════════════════════════════
// TC-08 — Search for a Publication by Keyword
// ══════════════════════════════════════════════════════════════════════════════
test('TC-08: Searching "On the Soundness" filters publications to one result', async ({ page }) => {
  await goHome(page);

  await page.locator(`xpath=${XPATH_NAV_PUBLICATIONS}`).click();
  await page.waitForLoadState('networkidle');

  // Type search keyword
  const searchInput = page.locator(`xpath=${XPATH_PUB_SEARCH}`);
  await searchInput.fill('On the Soundness');

  // Wait for the list to filter (debounce / re-render)
  await page.waitForTimeout(600);

  // Only one publication should be visible
  const pubLinks = page.locator('#container-publications a');
  await expect(pubLinks).toHaveCount(1);

  // That one publication is the correct paper
  await expect(page.locator('text=On the Soundness and Consistency of LLM Agents').first()).toBeVisible();
  await expect(page.locator('text=Sébastien Salva, Redha Taguelmimt').first()).toBeVisible();
});


// ══════════════════════════════════════════════════════════════════════════════
// TC-09 — Navigate to Teaching — Software Engineering Course
// ══════════════════════════════════════════════════════════════════════════════
test('TC-09: Clicking Cours software Engineering opens the course detail page', async ({ page }) => {
  await goHome(page);

  await page.locator(`xpath=${XPATH_NAV_TEACHING}`).click();
  await page.waitForLoadState('networkidle');

  // Click the Software Engineering course link in the sidebar
  await page.locator(`xpath=${XPATH_TEACH_COURS_SE}`).click();
  await page.waitForLoadState('networkidle');

  // Heading
  await expect(page.locator('text=Cours software Engineering')).toBeVisible();

  // Subtitle
  await expect(page.locator('text=LP MI Applications Web')).toBeVisible();

  // Cours section content
  await expect(page.locator('text=Le test du logiciel')).toBeVisible();

  // TP section content
  await expect(page.locator('text=TP3 Selenium IDE')).toBeVisible();
});


// ══════════════════════════════════════════════════════════════════════════════
// TC-10 — Navigate from Tools Page Back to Home
// ══════════════════════════════════════════════════════════════════════════════
test('TC-10: Home link on Tools page returns to Home page', async ({ page }) => {
  await goHome(page);

  // Go to Tools
  await page.locator(`xpath=${XPATH_NAV_TOOLS}`).click();
  await page.waitForLoadState('networkidle');
  await expect(page.locator('h1, h2').filter({ hasText: 'Tools' }).first()).toBeVisible();

  // Return to Home
  await page.locator(`xpath=${XPATH_NAV_HOME}`).click();
  await page.waitForLoadState('networkidle');

  // Confirm Home page
  await expect(page.locator('text=Biography')).toBeVisible();
});


// ══════════════════════════════════════════════════════════════════════════════
// TC-11 — Contact Form is Visible and Accepts Input
// ══════════════════════════════════════════════════════════════════════════════
test('TC-11: Contact form is visible with all fields and accepts text input', async ({ page }) => {
  await goHome(page);

  // Scroll to Contact section (or click nav link which scrolls to it)
  await page.locator(`xpath=${XPATH_NAV_CONTACT}`).click();
  await page.waitForTimeout(600); // allow scroll animation

  // All form fields visible
  const nameField    = page.locator(`xpath=${XPATH_INPUT_NAME}`);
  const emailField   = page.locator(`xpath=${XPATH_INPUT_EMAIL}`);
  const messageField = page.locator(`xpath=${XPATH_INPUT_MESSAGE}`);
  const sendButton   = page.locator(`xpath=${XPATH_BTN_SEND}`);

  await expect(nameField).toBeVisible();
  await expect(emailField).toBeVisible();
  await expect(messageField).toBeVisible();
  await expect(sendButton).toBeVisible();

  // Fields accept input
  await nameField.fill('Test User');
  await expect(nameField).toHaveValue('Test User');

  await emailField.fill('test@example.com');
  await expect(emailField).toHaveValue('test@example.com');

  await messageField.fill('Hello, this is a test message.');
  await expect(messageField).toHaveValue('Hello, this is a test message.');

  // Send button is enabled
  await expect(sendButton).toBeEnabled();
});


// ══════════════════════════════════════════════════════════════════════════════
// TC-12 — Projects Section — Inline Anchor Navigation Stays on Home
// ══════════════════════════════════════════════════════════════════════════════
test('TC-12: Clicking Projects nav link scrolls to Projects section on Home', async ({ page }) => {
  await goHome(page);

  await page.locator(`xpath=${XPATH_NAV_PROJECTS}`).click();
  await page.waitForTimeout(600); // allow scroll

  // Projects heading visible
  await expect(page.locator('h1, h2, h3').filter({ hasText: 'Projects' }).first()).toBeVisible();

  // Filter tabs
  await expect(page.locator('text=All').first()).toBeVisible();
  await expect(page.locator('text=Security').first()).toBeVisible();
  await expect(page.locator('text=Model Learning').first()).toBeVisible();
  await expect(page.locator('text=Testing').first()).toBeVisible();

  // At least the first notable project is listed
  await expect(
    page.locator('text=Industrial Chair on reliable and confident use of LLMs 25-29')
  ).toBeVisible();
});


// ══════════════════════════════════════════════════════════════════════════════
// TC-13 — Full Round-Trip Navigation: Home → Teaching → Home
// ══════════════════════════════════════════════════════════════════════════════
test('TC-13: Full navigation round-trip Home → Teaching → Home', async ({ page }) => {
  // Step 1: Start at Home
  await goHome(page);
  await expect(page.locator('text=Biography')).toBeVisible();

  // Step 2: Go to Teaching
  await page.locator(`xpath=${XPATH_NAV_TEACHING}`).click();
  await page.waitForLoadState('networkidle');

  await expect(page.locator('h1, h2').filter({ hasText: 'Teaching' }).first()).toBeVisible();
  await expect(page.locator(`xpath=${XPATH_TEACH_COURS_PHP}`)).toBeVisible();

  // Step 3: Return to Home
  await page.locator(`xpath=${XPATH_NAV_HOME}`).click();
  await page.waitForLoadState('networkidle');

  // Verify Home content restored
  await expect(page.locator('text=Biography')).toBeVisible();
  await expect(page.locator('text=(Full) Professor')).toBeVisible();
});
