// ============================================================
// Gruyere Acceptance Tests - Playwright
// Base URL: https://google-gruyere.appspot.com/start
// ============================================================
// IMPORTANT: Replace GRUYERE_INSTANCE_ID with your actual instance ID
// found on the Start page (e.g., 5400984643595715517187099129951455...46587)
// Then the base URL pattern is:
//   https://google-gruyere.appspot.com/<GRUYERE_INSTANCE_ID>/
// ============================================================

const { test, expect } = require('@playwright/test');

// ── Configuration ────────────────────────────────────────────
const START_URL   = 'https://google-gruyere.appspot.com/start';
const TEST_USER   = 'toto';
const TEST_PASS   = 'toto';

// Helper: navigate from Start page to the anonymous Home page
async function startToHome(page) {
  await page.goto(START_URL);
  // "Agree & Start" link  → xpath: /html/body/h2/a
  await page.locator('xpath=/html/body/h2/a').click();
  await expect(page.locator('h1, h2')).toContainText('Home');
}

// Helper: sign up a fresh user (uses a timestamp suffix to avoid conflicts)
async function signUp(page, username, password) {
  // User name field  → /html/body/div[2]/form/table/tbody/tr[1]/td[2]/input
  await page.locator('xpath=/html/body/div[2]/form/table/tbody/tr[1]/td[2]/input')
            .fill(username);
  // Password field   → /html/body/div[2]/form/table/tbody/tr[2]/td[2]/input
  await page.locator('xpath=/html/body/div[2]/form/table/tbody/tr[2]/td[2]/input')
            .fill(password);
  // Create account   → /html/body/div[2]/form/table/tbody/tr[3]/td[2]/input
  await page.locator('xpath=/html/body/div[2]/form/table/tbody/tr[3]/td[2]/input')
            .click();
}

// Helper: log in with an existing account via the Sign-in page
async function signIn(page, username, password) {
  // User name → (login form, same path pattern as sign-up row 1)
  await page.locator('xpath=/html/body/div[2]/form/table/tbody/tr[1]/td[2]/input')
            .fill(username);
  // Password  → row 2
  await page.locator('xpath=/html/body/div[2]/form/table/tbody/tr[2]/td[2]/input')
            .fill(password);
  // Login button (no xpath in mapping; use visible text)
  await page.getByRole('button', { name: 'Login' }).click();
}

// Helper: reach the authenticated Home page (reuses TEST_USER / TEST_PASS)
async function goToAuthHome(page) {
  await startToHome(page);
  // Click Sign in link → //*[@id="menu-right"]/a[1]
  await page.locator('xpath=//*[@id="menu-right"]/a[1]').click();
  await signIn(page, TEST_USER, TEST_PASS);
  await expect(page.locator('#menu-right')).toContainText('Sign out');
}

// ════════════════════════════════════════════════════════════
// SCENARIO 1 – Navigate from Start to anonymous Home
// Path: Start → HomeAnon
// ════════════════════════════════════════════════════════════
test('SC01 – Start page loads and "Agree & Start" navigates to anonymous Home', async ({ page }) => {
  // Given the user opens the Start URL
  await page.goto(START_URL);

  // Then the Start page is visible (contains "Agree & Start")
  await expect(page.locator('xpath=/html/body/h2/a')).toBeVisible();
  await expect(page.locator('xpath=/html/body/h2/a')).toContainText('Agree & Start');

  // When the user clicks "Agree & Start"
  await page.locator('xpath=/html/body/h2/a').click();

  // Then the anonymous Home page is displayed
  await expect(page).toHaveURL(/\/\d+\//);
  await expect(page.locator('h1, h2')).toContainText('Home');

  // And the navigation bar shows "Sign in" and "Sign up" links
  await expect(page.locator('xpath=//*[@id="menu-right"]/a[1]')).toContainText('Sign in');
  await expect(page.locator('xpath=//*[@id="menu-right"]/a[2]')).toContainText('Sign up');
});

// ════════════════════════════════════════════════════════════
// SCENARIO 2 – Navigate to Sign-up page from anonymous Home
// Path: HomeAnon → SignUp
// ════════════════════════════════════════════════════════════
test('SC02 – "Sign up" link navigates to Sign-up page', async ({ page }) => {
  await startToHome(page);

  // When the user clicks "Sign up"
  await page.locator('xpath=//*[@id="menu-right"]/a[2]').click();

  // Then the Sign-up page is displayed with the correct form fields
  await expect(page.locator('h1, h2')).toContainText('Sign up');
  await expect(
    page.locator('xpath=/html/body/div[2]/form/table/tbody/tr[1]/td[2]/input')
  ).toBeVisible();   // User name field
  await expect(
    page.locator('xpath=/html/body/div[2]/form/table/tbody/tr[2]/td[2]/input')
  ).toBeVisible();   // Password field
  await expect(
    page.locator('xpath=/html/body/div[2]/form/table/tbody/tr[3]/td[2]/input')
  ).toBeVisible();   // "Create account" button
});

// ════════════════════════════════════════════════════════════
// SCENARIO 3 – Return to anonymous Home from Sign-up page
// Path: SignUp → HomeAnon (via "Home" nav link)
// ════════════════════════════════════════════════════════════
test('SC03 – "Home" link on Sign-up page returns to anonymous Home', async ({ page }) => {
  await startToHome(page);
  await page.locator('xpath=//*[@id="menu-right"]/a[2]').click(); // go to Sign up
  await expect(page.locator('h1, h2')).toContainText('Sign up');

  // When the user clicks the "Home" nav link
  await page.locator('xpath=//*[@id="menu-left"]/a').click();

  // Then anonymous Home is displayed again
  await expect(page.locator('h1, h2')).toContainText('Home');
  await expect(page.locator('xpath=//*[@id="menu-right"]/a[2]')).toContainText('Sign up');
});

// ════════════════════════════════════════════════════════════
// SCENARIO 4 – Create a new account successfully
// Path: SignUp → AccountCreated
// ════════════════════════════════════════════════════════════
test('SC04 – User can create a new account', async ({ page }) => {
  const newUser = `user_${Date.now()}`;
  const newPass = 'pass123';

  await startToHome(page);
  await page.locator('xpath=//*[@id="menu-right"]/a[2]').click(); // Sign up

  // When the user fills in credentials and submits
  await signUp(page, newUser, newPass);

  // Then "Account created." confirmation is displayed
  await expect(page.locator('body')).toContainText('Account created');

  // And the navigation bar still shows anonymous state (Sign in / Sign up)
  await expect(page.locator('xpath=//*[@id="menu-right"]/a[1]')).toContainText('Sign in');
});

// ════════════════════════════════════════════════════════════
// SCENARIO 5 – Navigate to authenticated Home after account creation
// Path: AccountCreated → HomeAuth (via "Home" nav link)
// ════════════════════════════════════════════════════════════
test('SC05 – After account creation, "Home" link leads to authenticated Home', async ({ page }) => {
  const newUser = `authuser_${Date.now()}`;
  const newPass = 'pass123';

  await startToHome(page);
  await page.locator('xpath=//*[@id="menu-right"]/a[2]').click(); // Sign up
  await signUp(page, newUser, newPass);
  await expect(page.locator('body')).toContainText('Account created');

  // When the user clicks the Home link (anonymous nav bar, left link)
  await page.locator('xpath=//*[@id="menu-left"]/a').click();

  // Then the authenticated Home page is shown with the correct nav items
  await expect(page.locator('h1, h2')).toContainText('Home');
  await expect(page.locator('xpath=//*[@id="menu-right"]/a[2]')).toContainText('Sign out');
  await expect(page.locator('xpath=//*[@id="menu-left"]/a[2]')).toContainText('My Snippets');
});

// ════════════════════════════════════════════════════════════
// SCENARIO 6 – Sign out returns to anonymous Home
// Path: HomeAuth → HomeAnon (via "Sign out")
// ════════════════════════════════════════════════════════════
test('SC06 – Authenticated user can sign out and returns to anonymous Home', async ({ page }) => {
  await goToAuthHome(page);

  // When the user clicks "Sign out"
  await page.locator('xpath=//*[@id="menu-right"]/a[2]').click();

  // Then the anonymous Home page is shown
  await expect(page.locator('h1, h2')).toContainText('Home');
  await expect(page.locator('xpath=//*[@id="menu-right"]/a[1]')).toContainText('Sign in');
  await expect(page.locator('xpath=//*[@id="menu-right"]/a[2]')).toContainText('Sign up');
});

// ════════════════════════════════════════════════════════════
// SCENARIO 7 – Navigate to "New Snippet" page from authenticated Home
// Path: HomeAuth → NewSnippet
// ════════════════════════════════════════════════════════════
test('SC07 – Authenticated user can navigate to New Snippet page', async ({ page }) => {
  await goToAuthHome(page);

  // When the user clicks "New Snippet"
  await page.locator('xpath=//*[@id="menu-left"]/a[3]').click();

  // Then the New Snippet page is displayed
  await expect(page.locator('h1, h2')).toContainText('New Snippet');

  // And the textarea and Submit button are visible
  await expect(
    page.locator('xpath=/html/body/div[2]/div/form/textarea')
  ).toBeVisible();
  await expect(
    page.locator('xpath=/html/body/div[2]/div/form/table/tbody/tr/td[2]/input')
  ).toBeVisible();
});

// ════════════════════════════════════════════════════════════
// SCENARIO 8 – Add a new snippet and verify it appears in My Snippets
// Path: HomeAuth → NewSnippet → MySnippetsAdded
// ════════════════════════════════════════════════════════════
test('SC08 – User can add a new snippet and it appears in My Snippets', async ({ page }) => {
  await goToAuthHome(page);
  await page.locator('xpath=//*[@id="menu-left"]/a[3]').click(); // New Snippet

  // When the user types a snippet and submits
  const snippetText = `hello snippet ${Date.now()}`;
  await page.locator('xpath=/html/body/div[2]/div/form/textarea').fill(snippetText);
  await page.locator('xpath=/html/body/div[2]/div/form/table/tbody/tr/td[2]/input').click();

  // Then My Snippets page is shown with the snippet listed
  await expect(page.locator('h1, h2')).toContainText('My Snippets');
  await expect(page.locator('body')).toContainText(snippetText);
});

// ════════════════════════════════════════════════════════════
// SCENARIO 9 – My Snippets is empty when no snippet has been added
// Path: HomeAuth → MySnippetsEmpty
// ════════════════════════════════════════════════════════════
test('SC09 – "My Snippets" page shows "No snippets" for a fresh account', async ({ page }) => {
  // Create a brand-new account so snippets are guaranteed empty
  const freshUser = `fresh_${Date.now()}`;
  const freshPass = 'pass123';

  await startToHome(page);
  await page.locator('xpath=//*[@id="menu-right"]/a[2]').click();
  await signUp(page, freshUser, freshPass);
  // Navigate to authenticated Home
  await page.locator('xpath=//*[@id="menu-left"]/a').click();

  // When the user navigates to My Snippets
  await page.locator('xpath=//*[@id="menu-left"]/a[2]').click();

  // Then "No snippets." message is displayed
  await expect(page.locator('h1, h2')).toContainText('My Snippets');
  await expect(page.locator('body')).toContainText('No snippets');
});

// ════════════════════════════════════════════════════════════
// SCENARIO 10 – Navigate from My Snippets back to authenticated Home
// Path: MySnippetsEmpty → HomeAuth (via "Home" nav link)
// ════════════════════════════════════════════════════════════
test('SC10 – "Home" link on My Snippets page navigates back to authenticated Home', async ({ page }) => {
  await goToAuthHome(page);
  await page.locator('xpath=//*[@id="menu-left"]/a[2]').click(); // My Snippets
  await expect(page.locator('h1, h2')).toContainText('My Snippets');

  // When the user clicks the "Home" nav link
  await page.locator('xpath=//*[@id="menu-left"]/a[1]').click();

  // Then the authenticated Home page is shown
  await expect(page.locator('h1, h2')).toContainText('Home');
  await expect(page.locator('xpath=//*[@id="menu-right"]/a[2]')).toContainText('Sign out');
});

// ════════════════════════════════════════════════════════════
// SCENARIO 11 – Navigate to Profile page and verify form fields
// Path: HomeAuth → Profile
// ════════════════════════════════════════════════════════════
test('SC11 – Authenticated user can navigate to Profile page and see the edit form', async ({ page }) => {
  await goToAuthHome(page);

  // When the user clicks "Profile"
  await page.locator('xpath=//*[@id="menu-right"]/a[1]').click();

  // Then the Profile page is shown
  await expect(page.locator('h1, h2')).toContainText('Profile');

  // And all profile form fields are visible
  await expect(
    page.locator('xpath=/html/body/div[3]/form/table/tbody/tr[2]/td[2]/input')
  ).toBeVisible();   // User name
  await expect(
    page.locator('xpath=/html/body/div[3]/form/table/tbody/tr[3]/td[2]/input')
  ).toBeVisible();   // OLD Password
  await expect(
    page.locator('xpath=/html/body/div[3]/form/table/tbody/tr[4]/td[2]/input')
  ).toBeVisible();   // NEW Password
  await expect(
    page.locator('xpath=/html/body/div[3]/form/table/tbody/tr[5]/td[2]/input')
  ).toBeVisible();   // Icon
  await expect(
    page.locator('xpath=/html/body/div[3]/form/table/tbody/tr[6]/td[2]/input')
  ).toBeVisible();   // Homepage
  await expect(
    page.locator('xpath=/html/body/div[3]/form/table/tbody/tr[7]/td[2]/input')
  ).toBeVisible();   // Profile Color
  await expect(
    page.locator('xpath=/html/body/div[3]/form/table/tbody/tr[8]/td[2]/textarea')
  ).toBeVisible();   // Private Snippet
  await expect(
    page.locator('xpath=/html/body/div[3]/form/table/tbody/tr[9]/td[2]/input')
  ).toBeVisible();   // Update button
});

// ════════════════════════════════════════════════════════════
// SCENARIO 12 – Update profile and return to authenticated Home
// Path: Profile → HomeAuth (via "Update" button)
// ════════════════════════════════════════════════════════════
test('SC12 – User can update profile and is redirected to authenticated Home', async ({ page }) => {
  await goToAuthHome(page);
  await page.locator('xpath=//*[@id="menu-right"]/a[1]').click(); // Profile
  await expect(page.locator('h1, h2')).toContainText('Profile');

  // When the user sets a homepage URL and submits with the Update button
  await page.locator('xpath=/html/body/div[3]/form/table/tbody/tr[6]/td[2]/input')
            .fill('http://example.com');
  await page.locator('xpath=/html/body/div[3]/form/table/tbody/tr[9]/td[2]/input')
            .click(); // Update

  // Then the authenticated Home page is displayed
  await expect(page.locator('h1, h2')).toContainText('Home');
  await expect(page.locator('xpath=//*[@id="menu-right"]/a[2]')).toContainText('Sign out');
});

