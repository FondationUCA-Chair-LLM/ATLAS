/**
 * Acceptance Tests – Sébastien Salva Academic Website
 * URL: https://perso.limos.fr/~sesalva/
 *
 * Framework  : Playwright (TypeScript)
 * Test count : 13
 * Source data: navigation_graph.json  +  xpath_mapping.json  +  UI screenshots
 *
 * XPath helpers
 * ─────────────
 * All xpaths come directly from xpath_mapping.json.
 * Playwright's page.locator() accepts XPath strings when prefixed with "xpath=".
 *
 * Run:
 *   npx playwright test salva_acceptance_tests.spec.ts
 */

import { test, expect, Page } from "@playwright/test";

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_URL = "https://perso.limos.fr/~sesalva/";

// XPaths from xpath_mapping.json – Home screen
const XPATH = {
  // Navbar items (all screens share the same navbar)
  nav: {
    home:         `xpath=//*[@id="navbar-content"]/ul/li[1]/a`,
    research:     `xpath=//*[@id="navbar-content"]/ul/li[2]/a`,
    tools:        `xpath=//*[@id="navbar-content"]/ul/li[3]/a`,
    publications: `xpath=//*[@id="navbar-content"]/ul/li[4]/a`,
    teaching:     `xpath=//*[@id="navbar-content"]/ul/li[5]/a`,
    projects:     `xpath=//*[@id="navbar-content"]/ul/li[6]/a`,
    contact:      `xpath=//*[@id="navbar-content"]/ul/li[7]/a`,
  },
  // Contact form elements (Home screen)
  contact: {
    name:    `xpath=//*[@id="inputName"]`,
    email:   `xpath=//*[@id="inputEmail"]`,
    message: `xpath=//*[@id="inputMessage"]`,
    send:    `xpath=//*[@id="contact"]/div[2]/div/div[2]/div[1]/form/button`,
  },
  // Projects tab
  projects: {
    testingTab: `xpath=//*[@id="projects"]/div[2]/div/div[2]/div[1]/div/div/div/a[4]`,
  },
  // Publications screen
  publications: {
    searchInput: `xpath=//*[@id="top"]/div[2]/div[2]/div/div/div[1]/div[1]/input`,
    typeSelect:  `xpath=//*[@id="top"]/div[2]/div[2]/div/div/div[1]/div[2]/select`,
    dateSelect:  `xpath=//*[@id="top"]/div[2]/div[2]/div/div/div[1]/div[3]/select`,
    nlExecLink:  `xpath=//*[@id="container-publications"]/div[1]/div/a`,
  },
  // Teaching screen
  teaching: {
    coursesSE:  `xpath=//*[@id="docs-nav"]/ul/div[8]/a`,
    coursesPHP: `xpath=//*[@id="docs-nav"]/ul/div[4]/a`,
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Navigate to the base URL and wait for the navbar to appear.
 */
async function goHome(page: Page): Promise<void> {
  await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
  await page.locator(XPATH.nav.home).waitFor({ state: "visible", timeout: 15_000 });
}

// ─── Tests ────────────────────────────────────────────────────────────────────

test.describe("Sébastien Salva – Academic Website Acceptance Tests", () => {

  // ── TC-01 ────────────────────────────────────────────────────────────────────
  test("TC-01 · Home page loads with biography content", async ({ page }) => {
    await goHome(page);

    // Page title
    await expect(page).toHaveTitle(/S[ée]bastien Salva/i);

    // All seven navbar links are visible
    for (const label of [
      "Home", "Research", "Tools", "Publications", "Teaching", "Projects", "Contact",
    ]) {
      await expect(
        page.getByRole("link", { name: label, exact: true }).first()
      ).toBeVisible();
    }

    // Biography section
    await expect(page.getByRole("heading", { name: /biography/i })).toBeVisible();

    // Interests and Education sub-sections
    await expect(page.getByText(/interests/i).first()).toBeVisible();
    await expect(page.getByText(/education/i).first()).toBeVisible();

    // Key biography content
    await expect(
      page.getByText(/University of Auvergne|University Clermont Auvergne/i).first()
    ).toBeVisible();
  });

  // ── TC-02 ────────────────────────────────────────────────────────────────────
  test("TC-02 · Navigate from Home to Research and return", async ({ page }) => {
    await goHome(page);

    // Click Research in navbar
    await page.locator(XPATH.nav.research).click();
    await page.waitForURL(/research/i, { timeout: 10_000 });

    // Research page heading
    await expect(page.getByRole("heading", { name: /research topics/i })).toBeVisible();

    // Expected topic sections
    await expect(page.getByText(/data quality/i).first()).toBeVisible();
    await expect(page.getByText(/model.based testing/i).first()).toBeVisible();

    // Navigate back to Home
    await page.locator(XPATH.nav.home).click();
    await expect(page.getByRole("heading", { name: /biography/i })).toBeVisible();
  });

  // ── TC-03 ────────────────────────────────────────────────────────────────────
  test("TC-03 · Navigate from Home to Tools and return", async ({ page }) => {
    await goHome(page);

    await page.locator(XPATH.nav.tools).click();
    await page.waitForURL(/tools/i, { timeout: 10_000 });

    // Tools page heading
    await expect(page.getByRole("heading", { name: /^tools$/i })).toBeVisible();

    // Three expected tool entries
    await expect(
      page.getByText(/natural language test case execution/i)
    ).toBeVisible();
    await expect(page.getByText(/restful api healing/i)).toBeVisible();
    await expect(
      page.getByText(/from event logs to.*test cases/i)
    ).toBeVisible();

    // Navigate back to Home
    await page.locator(XPATH.nav.home).click();
    await expect(page.getByRole("heading", { name: /biography/i })).toBeVisible();
  });

  // ── TC-04 ────────────────────────────────────────────────────────────────────
  test("TC-04 · Navigate from Home to Publications page", async ({ page }) => {
    await goHome(page);

    await page.locator(XPATH.nav.publications).click();
    await page.waitForURL(/publications/i, { timeout: 10_000 });

    // Page heading
    await expect(page.getByRole("heading", { name: /publications/i })).toBeVisible();

    // Search input is present and empty
    const searchInput = page.locator(XPATH.publications.searchInput);
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveValue("");

    // Type and Date filter dropdowns
    await expect(page.locator(XPATH.publications.typeSelect)).toBeVisible();
    await expect(page.locator(XPATH.publications.dateSelect)).toBeVisible();

    // At least one publication is listed (the 2026 ENASE paper)
    await expect(
      page.getByText(/on the soundness and consistency of llm agents/i)
    ).toBeVisible();
  });

  // ── TC-05 ────────────────────────────────────────────────────────────────────
  test("TC-05 · Search for a publication by keyword", async ({ page }) => {
    await goHome(page);
    await page.locator(XPATH.nav.publications).click();
    await page.waitForURL(/publications/i, { timeout: 10_000 });

    // Type into search field
    const searchInput = page.locator(XPATH.publications.searchInput);
    await searchInput.fill("On the Soundness");

    // Only the matching publication should remain visible
    await expect(
      page.getByText(/on the soundness and consistency of llm agents/i)
    ).toBeVisible();

    // PDF and Cite buttons are visible on the filtered result
    await expect(page.getByRole("link", { name: /pdf/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /cite/i }).first()).toBeVisible();

    // Unrelated publications should be hidden
    await expect(
      page.getByText(/bridging science and society/i)
    ).not.toBeVisible();
  });

  // ── TC-06 ────────────────────────────────────────────────────────────────────
  test("TC-06 · Open a publication detail page from Publications", async ({ page }) => {
    await goHome(page);
    await page.locator(XPATH.nav.publications).click();
    await page.waitForURL(/publications/i, { timeout: 10_000 });

    // Click the NLExec publication link
    await page.locator(XPATH.publications.nlExecLink).click();

    // Detail page: full title visible
    await expect(
      page.getByRole("heading", {
        name: /on the soundness and consistency of llm agents for executing test cases written in natural language/i,
      })
    ).toBeVisible();

    // Authors
    await expect(page.getByText(/Sébastien Salva/i)).toBeVisible();
    await expect(page.getByText(/Redha Taguelmimt/i)).toBeVisible();

    // Date
    await expect(page.getByText(/march.*2026|2026.*march/i)).toBeVisible();

    // Tags
    await expect(page.getByText(/software engineering|sotfware engineering/i)).toBeVisible();
    await expect(page.getByText(/LLM/)).toBeVisible();

    // Abstract heading present
    await expect(page.getByRole("heading", { name: /abstract/i })).toBeVisible();

    // Abstract body starts with expected sentence
    await expect(
      page.getByText(/the use of natural language.*test cases.*graphical user interface/i)
    ).toBeVisible();
  });

  // ── TC-07 ────────────────────────────────────────────────────────────────────
  test("TC-07 · Navigate from Home to Teaching page", async ({ page }) => {
    await goHome(page);

    await page.locator(XPATH.nav.teaching).click();
    await page.waitForURL(/teaching/i, { timeout: 10_000 });

    // Teaching heading
    await expect(page.getByRole("heading", { name: /^teaching$/i })).toBeVisible();

    // Left sidebar with course links
    await expect(page.locator(XPATH.teaching.coursesSE)).toBeVisible();
    await expect(page.locator(XPATH.teaching.coursesPHP)).toBeVisible();

    // Main content mentions BUT 2A and BUT 3A
    await expect(page.getByText(/BUT 2A/)).toBeVisible();
    await expect(page.getByText(/BUT 3A/)).toBeVisible();
  });

  // ── TC-08 ────────────────────────────────────────────────────────────────────
  test("TC-08 · Navigate from Teaching to the Software Engineering course page", async ({ page }) => {
    await goHome(page);
    await page.locator(XPATH.nav.teaching).click();
    await page.waitForURL(/teaching/i, { timeout: 10_000 });

    // Click Cours software Engineering in sidebar
    await page.locator(XPATH.teaching.coursesSE).click();
    await page.waitForURL(/software.engineering|software_engineering/i, { timeout: 10_000 });

    // Course title
    await expect(
      page.getByRole("heading", { name: /cours software engineering/i })
    ).toBeVisible();

    // Subtitle
    await expect(page.getByText(/LP MI Applications Web/i)).toBeVisible();

    // Section headings
    await expect(page.getByRole("heading", { name: /^cours$/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /^TD$/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /^TP$/i })).toBeVisible();

    // Sample course links
    await expect(page.getByText(/le test du logiciel/i)).toBeVisible();
    await expect(page.getByText(/TD 1 TDD/i)).toBeVisible();
    await expect(page.getByText(/TP1 Rappel JUNIT/i)).toBeVisible();
  });

  // ── TC-09 ────────────────────────────────────────────────────────────────────
  test("TC-09 · Navigate from Home to the Projects section", async ({ page }) => {
    await goHome(page);

    // "Projects" in the nav is a self-loop (stays on Home, scrolls to #projects)
    await page.locator(XPATH.nav.projects).click();

    // Wait for the Projects heading to become visible in viewport
    await expect(
      page.getByRole("heading", { name: /^projects$/i })
    ).toBeVisible({ timeout: 8_000 });

    // Filter buttons
    await expect(page.getByRole("link", { name: /^all$/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /security/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /model learning/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /testing/i }).first()).toBeVisible();

    // Flagship project entry
    await expect(
      page.getByText(/industrial chair on reliable and confident use of LLMs/i)
    ).toBeVisible();
  });

  // ── TC-10 ────────────────────────────────────────────────────────────────────
  test("TC-10 · Navigate from Home to the Contact section and verify form", async ({ page }) => {
    await goHome(page);

    await page.locator(XPATH.nav.contact).click();

    // Contact section heading
    await expect(
      page.getByRole("heading", { name: /^contact$/i })
    ).toBeVisible({ timeout: 8_000 });

    // Contact form fields
    await expect(page.locator(XPATH.contact.name)).toBeVisible();
    await expect(page.locator(XPATH.contact.email)).toBeVisible();
    await expect(page.locator(XPATH.contact.message)).toBeVisible();
    await expect(page.locator(XPATH.contact.send)).toBeVisible();

    // Email address displayed on page
    await expect(page.getByText(/sebastien\.salva@uca\.fr/i)).toBeVisible();

    // Phone number
    await expect(page.getByText(/\+33.*0.*4 73 17 71 27/i)).toBeVisible();
  });

  // ── TC-11 ────────────────────────────────────────────────────────────────────
  test("TC-11 · Submit the contact form (Send self-loop)", async ({ page }) => {
    await goHome(page);
    await page.locator(XPATH.nav.contact).click();

    // Fill in the contact form
    await page.locator(XPATH.contact.name).fill("Test User");
    await page.locator(XPATH.contact.email).fill("test@example.com");
    await page.locator(XPATH.contact.message).fill("Hello, this is an automated acceptance test.");

    // Click Send – navigation graph marks this as a self-loop (Home → Home)
    await page.locator(XPATH.contact.send).click();

    // Small wait to let any navigation settle
    await page.waitForTimeout(1_500);

    // Must still be on Home (self-loop); biography visible
    await expect(page.getByRole("heading", { name: /biography/i })).toBeVisible();

    // URL should not have navigated away from the root domain path
    await expect(page).toHaveURL(new RegExp(BASE_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  });

  // ── TC-12 ────────────────────────────────────────────────────────────────────
  test("TC-12 · Navigate from Publications back to Home", async ({ page }) => {
    await goHome(page);
    await page.locator(XPATH.nav.publications).click();
    await page.waitForURL(/publications/i, { timeout: 10_000 });

    // Publications → Home via navbar Home link
    await page.locator(XPATH.nav.home).click();

    // Biography section confirms we are back on Home
    await expect(page.getByRole("heading", { name: /biography/i })).toBeVisible();
    await expect(page.getByText(/University of Auvergne|University Clermont Auvergne/i).first()).toBeVisible();
  });

  // ── TC-13 ────────────────────────────────────────────────────────────────────
  test("TC-13 · Tools page displays the MLC approach companion section", async ({ page }) => {
    await goHome(page);
    await page.locator(XPATH.nav.tools).click();
    await page.waitForURL(/tools/i, { timeout: 10_000 });

    // The event log to Conversations section (which leads to the MLC companion)
    await expect(page.getByText(/event log to conversations/i)).toBeVisible();

    // Git link for ConversationExtraction is present on the Tools page
    await expect(
      page.getByRole("link", { name: /conversationextraction/i })
    ).toBeVisible();

    // Navigate to the MLC companion page if a direct link exists on the Tools page
    // (This is the companion page visible in tools_companion_1.png screenshot)
    // We check the Tools page still shows the heading, then navigate Home.
    await expect(page.getByRole("heading", { name: /^tools$/i })).toBeVisible();

    await page.locator(XPATH.nav.home).click();
    await expect(page.getByRole("heading", { name: /biography/i })).toBeVisible();
  });

}); // end describe
