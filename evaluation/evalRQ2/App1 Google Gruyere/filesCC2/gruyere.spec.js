// =============================================================================
// Gruyere Web Application – Playwright Acceptance Tests
// Base URL : https://google-gruyere.appspot.com/start
// XPaths   : sourced from xpath_mapping.json
// Upload feature is excluded.
// =============================================================================

import { test, expect } from "@playwright/test";

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

/**
 * Navigate to the Gruyere Start page and click "Agree & Start".
 * Returns when the anonymous Home page is fully loaded.
 */
async function goToAnonHome(page) {
  await page.goto("https://google-gruyere.appspot.com/start");
  // XPath from xpath_mapping.json – Start node
  await page.locator('xpath=/html/body/h2/a').click();
  await page.waitForURL(/\/\d+\/?$/); // instance URL, no subpath
}

/**
 * From the anonymous Home page, sign up with the given credentials.
 * Returns when the "Account created." screen is visible.
 */
async function signUp(page, username, password) {
  // Click Sign up – HomeAnon xpath
  await page.locator('xpath=//*[@id="menu-right"]/a[2]').click();

  // Fill form – SignUp xpaths
  await page.locator('xpath=/html/body/div[2]/form/table/tbody/tr[1]/td[2]/input')
    .fill(username);
  await page.locator('xpath=/html/body/div[2]/form/table/tbody/tr[2]/td[2]/input')
    .fill(password);

  // Submit
  await page.locator('xpath=/html/body/div[2]/form/table/tbody/tr[3]/td[2]/input')
    .click();
}

/**
 * From the AccountCreated page, click Home to reach the authenticated Home page.
 */
async function goToAuthHome(page) {
  // AccountCreated → HomeAuth via Home link
  await page.locator('xpath=//*[@id="menu-left"]/a').click();
  await expect(page.locator('xpath=//*[@id="menu-left"]/a[2]'))
    .toContainText("My Snippets");
}

// ---------------------------------------------------------------------------
// Test data (shared across tests)
// ---------------------------------------------------------------------------
const USERNAME = "toto";
const PASSWORD = "toto";

// =============================================================================
// Scenario 01 – Start and reach the anonymous home page
// =============================================================================
test("S01 – Start and reach the anonymous home page", async ({ page }) => {
  await page.goto("https://google-gruyere.appspot.com/start");

  // The page title contains "Start Gruyere"
  await expect(page.locator("h2")).toContainText("Start Gruyere");

  // Security warning is visible
  await expect(page.getByText("Gruyere is not secure")).toBeVisible();

  // "Agree & Start" link is present (XPath from xpath_mapping.json – Start node)
  const agreeLink = page.locator('xpath=/html/body/h2/a');
  await expect(agreeLink).toBeVisible();
  await expect(agreeLink).toContainText("Agree & Start");

  // Click the link
  await agreeLink.click();

  // Anonymous Home page: nav contains Sign in and Sign up
  await expect(page.locator('xpath=//*[@id="menu-right"]/a[1]')).toContainText("Sign in");
  await expect(page.locator('xpath=//*[@id="menu-right"]/a[2]')).toContainText("Sign up");

  // Home link on the left is present
  await expect(page.locator('xpath=//*[@id="menu-left"]/a')).toContainText("Home");

  // Page heading
  await expect(page.locator("h2")).toContainText("Gruyere: Home");
});

// =============================================================================
// Scenario 02 – Navigate to the Sign Up page from the anonymous home page
// =============================================================================
test("S02 – Navigate to the Sign Up page from the anonymous home page", async ({ page }) => {
  await goToAnonHome(page);

  // Click "Sign up" – HomeAnon xpath
  await page.locator('xpath=//*[@id="menu-right"]/a[2]').click();

  // Sign Up page heading
  await expect(page.locator("h2")).toContainText("Gruyere: Sign up");

  // Form fields exist (SignUp xpaths)
  await expect(
    page.locator('xpath=/html/body/div[2]/form/table/tbody/tr[1]/td[2]/input')
  ).toBeVisible(); // User name

  await expect(
    page.locator('xpath=/html/body/div[2]/form/table/tbody/tr[2]/td[2]/input')
  ).toBeVisible(); // Password

  // Create account button
  await expect(
    page.locator('xpath=/html/body/div[2]/form/table/tbody/tr[3]/td[2]/input')
  ).toHaveValue("Create account");

  // Red security warning
  await expect(page.getByText("Gruyere is not secure")).toBeVisible();
});

// =============================================================================
// Scenario 03 – Navigate back to the anonymous home page from Sign Up
// =============================================================================
test("S03 – Navigate back to the anonymous home page from Sign Up", async ({ page }) => {
  await goToAnonHome(page);

  // Go to Sign Up
  await page.locator('xpath=//*[@id="menu-right"]/a[2]').click();
  await expect(page.locator("h2")).toContainText("Gruyere: Sign up");

  // Click Home – SignUp xpath
  await page.locator('xpath=//*[@id="menu-left"]/a').click();

  // Back to anonymous Home
  await expect(page.locator("h2")).toContainText("Gruyere: Home");
  await expect(page.locator('xpath=//*[@id="menu-right"]/a[1]')).toContainText("Sign in");
  await expect(page.locator('xpath=//*[@id="menu-right"]/a[2]')).toContainText("Sign up");
});

// =============================================================================
// Scenario 04 – Create a new account successfully
// =============================================================================
test("S04 – Create a new account successfully", async ({ page }) => {
  await goToAnonHome(page);

  await signUp(page, USERNAME, PASSWORD);

  // AccountCreated screen: confirmation message
  await expect(page.getByText("Account created.")).toBeVisible();

  // Still shows anonymous nav (not yet authenticated)
  await expect(page.locator('xpath=//*[@id="menu-right"]/a[1]')).toContainText("Sign in");
  await expect(page.locator('xpath=//*[@id="menu-right"]/a[2]')).toContainText("Sign up");
});

// =============================================================================
// Scenario 05 – Navigate to the authenticated home page after account creation
// =============================================================================
test("S05 – Navigate to the authenticated home page after account creation", async ({ page }) => {
  await goToAnonHome(page);
  await signUp(page, USERNAME, PASSWORD);

  // AccountCreated → HomeAuth: click Home
  await page.locator('xpath=//*[@id="menu-left"]/a').click();

  // Authenticated nav – left side
  await expect(page.locator('xpath=//*[@id="menu-left"]/a[1]')).toContainText("Home");
  await expect(page.locator('xpath=//*[@id="menu-left"]/a[2]')).toContainText("My Snippets");
  await expect(page.locator('xpath=//*[@id="menu-left"]/a[3]')).toContainText("New Snippet");
  await expect(page.locator('xpath=//*[@id="menu-left"]/a[4]')).toContainText("Upload");

  // Authenticated nav – right side
  await expect(page.locator('xpath=//*[@id="menu-right"]/a[1]')).toContainText("Profile");
  await expect(page.locator('xpath=//*[@id="menu-right"]/a[2]')).toContainText("Sign out");

  // Page heading
  await expect(page.locator("h2")).toContainText("Gruyere: Home");
});

// =============================================================================
// Scenario 06 – Sign out from the authenticated home page
// =============================================================================
test("S06 – Sign out from the authenticated home page", async ({ page }) => {
  await goToAnonHome(page);
  await signUp(page, USERNAME, PASSWORD);
  await goToAuthHome(page);

  // Sign out – HomeAuth xpath
  await page.locator('xpath=//*[@id="menu-right"]/a[2]').click();

  // Anonymous Home page
  await expect(page.locator("h2")).toContainText("Gruyere: Home");
  await expect(page.locator('xpath=//*[@id="menu-right"]/a[1]')).toContainText("Sign in");
  await expect(page.locator('xpath=//*[@id="menu-right"]/a[2]')).toContainText("Sign up");

  // Authenticated links must NOT appear
  await expect(page.locator('xpath=//*[@id="menu-right"]/a[1]')).not.toContainText("Profile");
  await expect(page.locator('xpath=//*[@id="menu-right"]/a[2]')).not.toContainText("Sign out");
});

// =============================================================================
// Scenario 07 – Add a new snippet from the authenticated home page
// =============================================================================
test("S07 – Add a new snippet from the authenticated home page", async ({ page }) => {
  await goToAnonHome(page);
  await signUp(page, USERNAME, PASSWORD);
  await goToAuthHome(page);

  // Navigate to New Snippet – HomeAuth xpath
  await page.locator('xpath=//*[@id="menu-left"]/a[3]').click();

  // New Snippet page
  await expect(page.locator("h2")).toContainText("Gruyere: New Snippet");

  // Textarea is visible (NewSnippet xpath)
  const textarea = page.locator('xpath=/html/body/div[2]/div/form/textarea');
  await expect(textarea).toBeVisible();
  await textarea.fill("hello snippet");

  // Submit button (NewSnippet xpath)
  await page.locator('xpath=/html/body/div[2]/div/form/table/tbody/tr/td[2]/input').click();

  // My Snippets page with the new snippet visible
  await expect(page.locator("h2")).toContainText("My Snippets");
  await expect(page.getByText("hello snippet")).toBeVisible();
  await expect(page.getByText("All snippets:")).toBeVisible();
});

// =============================================================================
// Scenario 08 – View My Snippets when no snippets exist
// =============================================================================
test("S08 – View My Snippets when no snippets exist", async ({ page }) => {
  await goToAnonHome(page);
  // Use a unique username to ensure a fresh account with no snippets
  const freshUser = "user_" + Date.now();
  await signUp(page, freshUser, "pass123");
  await goToAuthHome(page);

  // Click My Snippets – HomeAuth xpath
  await page.locator('xpath=//*[@id="menu-left"]/a[2]').click();

  // My Snippets empty state
  await expect(page.locator("h2")).toContainText("My Snippets");
  await expect(page.getByText("No snippets.")).toBeVisible();

  // My site link visible (MySnippetsEmpty xpaths are all nav links; content is in the div)
  await expect(page.getByText("My site")).toBeVisible();

  // Refresh link
  await expect(page.getByText("Refresh")).toBeVisible();
});

// =============================================================================
// Scenario 09 – Navigate from My Snippets (empty) back to the authenticated home page
// =============================================================================
test("S09 – Navigate from empty My Snippets back to the authenticated home page", async ({ page }) => {
  await goToAnonHome(page);
  const freshUser = "user_" + Date.now();
  await signUp(page, freshUser, "pass123");
  await goToAuthHome(page);

  // Go to My Snippets (empty) – HomeAuth xpath
  await page.locator('xpath=//*[@id="menu-left"]/a[2]').click();
  await expect(page.getByText("No snippets.")).toBeVisible();

  // Click Home – MySnippetsEmpty xpath
  await page.locator('xpath=//*[@id="menu-left"]/a[1]').click();

  // Back at authenticated Home
  await expect(page.locator("h2")).toContainText("Gruyere: Home");
  await expect(page.locator('xpath=//*[@id="menu-left"]/a[2]')).toContainText("My Snippets");
  await expect(page.locator('xpath=//*[@id="menu-right"]/a[1]')).toContainText("Profile");
});

// =============================================================================
// Scenario 10 – Access and view the Profile page
// =============================================================================
test("S10 – Access and view the Profile page", async ({ page }) => {
  await goToAnonHome(page);
  await signUp(page, USERNAME, PASSWORD);
  await goToAuthHome(page);

  // Click Profile – HomeAuth xpath
  await page.locator('xpath=//*[@id="menu-right"]/a[1]').click();

  // Profile page heading
  await expect(page.locator("h2")).toContainText("Gruyere: Profile");

  // "Edit your profile." sub-heading
  await expect(page.getByText("Edit your profile.")).toBeVisible();

  // User name field pre-filled (Profile xpath)
  const userNameField = page.locator(
    'xpath=/html/body/div[3]/form/table/tbody/tr[2]/td[2]/input'
  );
  await expect(userNameField).toBeVisible();
  await expect(userNameField).toHaveValue(USERNAME);

  // OLD Password field pre-filled (Profile xpath)
  const oldPwdField = page.locator(
    'xpath=/html/body/div[3]/form/table/tbody/tr[3]/td[2]/input'
  );
  await expect(oldPwdField).toBeVisible();
  await expect(oldPwdField).toHaveValue(PASSWORD);

  // NEW Password field empty (Profile xpath)
  const newPwdField = page.locator(
    'xpath=/html/body/div[3]/form/table/tbody/tr[4]/td[2]/input'
  );
  await expect(newPwdField).toBeVisible();
  await expect(newPwdField).toHaveValue("");

  // Other fields visible (Icon, Homepage, Profile Color, Private Snippet)
  await expect(
    page.locator('xpath=/html/body/div[3]/form/table/tbody/tr[5]/td[2]/input')
  ).toBeVisible(); // Icon

  await expect(
    page.locator('xpath=/html/body/div[3]/form/table/tbody/tr[6]/td[2]/input')
  ).toBeVisible(); // Homepage

  await expect(
    page.locator('xpath=/html/body/div[3]/form/table/tbody/tr[7]/td[2]/input')
  ).toBeVisible(); // Profile Color

  await expect(
    page.locator('xpath=/html/body/div[3]/form/table/tbody/tr[8]/td[2]/textarea')
  ).toBeVisible(); // Private Snippet textarea

  // Update button present (Profile xpath)
  const updateBtn = page.locator(
    'xpath=/html/body/div[3]/form/table/tbody/tr[9]/td[2]/input'
  );
  await expect(updateBtn).toBeVisible();
  await expect(updateBtn).toHaveValue("Update");

  // Security warning about real passwords
  await expect(page.getByText("Gruyere is not secure")).toBeVisible();
});

// =============================================================================
// Scenario 11 – Update the profile and return to the authenticated home page
// =============================================================================
test("S11 – Update the profile and return to the authenticated home page", async ({ page }) => {
  await goToAnonHome(page);
  await signUp(page, USERNAME, PASSWORD);
  await goToAuthHome(page);

  // Navigate to Profile – HomeAuth xpath
  await page.locator('xpath=//*[@id="menu-right"]/a[1]').click();
  await expect(page.locator("h2")).toContainText("Gruyere: Profile");

  // Optionally fill the Homepage field to exercise the form
  await page.locator(
    'xpath=/html/body/div[3]/form/table/tbody/tr[6]/td[2]/input'
  ).fill("http://example.com");

  // Click Update – Profile xpath
  await page.locator(
    'xpath=/html/body/div[3]/form/table/tbody/tr[9]/td[2]/input'
  ).click();

  // Redirected back to the authenticated Home page
  await expect(page.locator("h2")).toContainText("Gruyere: Home");

  // Authenticated nav still intact
  await expect(page.locator('xpath=//*[@id="menu-left"]/a[2]')).toContainText("My Snippets");
  await expect(page.locator('xpath=//*[@id="menu-right"]/a[1]')).toContainText("Profile");
  await expect(page.locator('xpath=//*[@id="menu-right"]/a[2]')).toContainText("Sign out");
});

// =============================================================================
// Scenario 12 – Full end-to-end happy path
// =============================================================================
test("S12 – Full end-to-end happy path: register → add snippet → view snippet → update profile → sign out", async ({ page }) => {

  // ── Step 1-2: Start → Anonymous Home ─────────────────────────────────────
  await page.goto("https://google-gruyere.appspot.com/start");
  await expect(page.locator("h2")).toContainText("Start Gruyere");
  await page.locator('xpath=/html/body/h2/a').click();
  await expect(page.locator("h2")).toContainText("Gruyere: Home");
  await expect(page.locator('xpath=//*[@id="menu-right"]/a[2]')).toContainText("Sign up");

  // ── Step 3-4: Sign Up → Account Created ──────────────────────────────────
  await page.locator('xpath=//*[@id="menu-right"]/a[2]').click();
  await expect(page.locator("h2")).toContainText("Gruyere: Sign up");

  await page.locator('xpath=/html/body/div[2]/form/table/tbody/tr[1]/td[2]/input')
    .fill(USERNAME);
  await page.locator('xpath=/html/body/div[2]/form/table/tbody/tr[2]/td[2]/input')
    .fill(PASSWORD);
  await page.locator('xpath=/html/body/div[2]/form/table/tbody/tr[3]/td[2]/input')
    .click();
  await expect(page.getByText("Account created.")).toBeVisible();

  // ── Step 5: Account Created → Authenticated Home ──────────────────────────
  await page.locator('xpath=//*[@id="menu-left"]/a').click();
  await expect(page.locator("h2")).toContainText("Gruyere: Home");
  await expect(page.locator('xpath=//*[@id="menu-left"]/a[2]')).toContainText("My Snippets");
  await expect(page.locator('xpath=//*[@id="menu-right"]/a[1]')).toContainText("Profile");

  // ── Step 6: New Snippet → My Snippets (with snippet) ─────────────────────
  await page.locator('xpath=//*[@id="menu-left"]/a[3]').click();
  await expect(page.locator("h2")).toContainText("Gruyere: New Snippet");
  await page.locator('xpath=/html/body/div[2]/div/form/textarea').fill("hello snippet");
  await page.locator('xpath=/html/body/div[2]/div/form/table/tbody/tr/td[2]/input').click();
  await expect(page.locator("h2")).toContainText("My Snippets");
  await expect(page.getByText("hello snippet")).toBeVisible();

  // ── Step 7: Back to Authenticated Home ────────────────────────────────────
  await page.locator('xpath=//*[@id="menu-left"]/a[1]').click();
  await expect(page.locator("h2")).toContainText("Gruyere: Home");

  // ── Step 8: My Snippets shows the previously created snippet ──────────────
  await page.locator('xpath=//*[@id="menu-left"]/a[2]').click();
  await expect(page.locator("h2")).toContainText("My Snippets");
  await expect(page.getByText("hello snippet")).toBeVisible();

  // ── Step 9: Back to Authenticated Home ────────────────────────────────────
  await page.locator('xpath=//*[@id="menu-left"]/a[1]').click();
  await expect(page.locator("h2")).toContainText("Gruyere: Home");

  // ── Step 10: Navigate to Profile ─────────────────────────────────────────
  await page.locator('xpath=//*[@id="menu-right"]/a[1]').click();
  await expect(page.locator("h2")).toContainText("Gruyere: Profile");
  await expect(
    page.locator('xpath=/html/body/div[3]/form/table/tbody/tr[2]/td[2]/input')
  ).toHaveValue(USERNAME);
  await expect(
    page.locator('xpath=/html/body/div[3]/form/table/tbody/tr[3]/td[2]/input')
  ).toHaveValue(PASSWORD);

  // ── Step 11: Update Profile → Authenticated Home ──────────────────────────
  await page.locator('xpath=/html/body/div[3]/form/table/tbody/tr[9]/td[2]/input').click();
  await expect(page.locator("h2")).toContainText("Gruyere: Home");

  // ── Step 12: Sign out → Anonymous Home ───────────────────────────────────
  await page.locator('xpath=//*[@id="menu-right"]/a[2]').click();
  await expect(page.locator("h2")).toContainText("Gruyere: Home");
  await expect(page.locator('xpath=//*[@id="menu-right"]/a[1]')).toContainText("Sign in");
  await expect(page.locator('xpath=//*[@id="menu-right"]/a[2]')).toContainText("Sign up");
});
