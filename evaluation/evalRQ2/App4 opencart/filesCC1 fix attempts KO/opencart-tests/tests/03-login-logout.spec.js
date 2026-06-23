// tests/03-login-logout.spec.js
//
// TC16 - TC20: the "Login" node and its edges to My Account (success) and
// back to itself (failure), plus the long "Logout" edge from My Account
// back to Home (Anonymous).
//
// TC17 and TC20 need a REAL, already-existing account. They reuse the one
// created by global-setup.js (persisted to .auth/credentials.json /
// .auth/user.json) instead of registering a new one inline.

const fs = require('fs');
const path = require('path');
const { test, expect } = require('@playwright/test');
const { xp } = require('../utils/xpath');
const { openAccountDropdownAndChoose, loginWithForm, logout } = require('../utils/actions');

const credentials = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', '.auth', 'credentials.json'), 'utf-8')
);
const STORAGE_STATE = path.join(__dirname, '..', '.auth', 'user.json');

test.describe('Login (anonymous)', () => {
  test('TC16 - "Login" in the My Account dropdown opens the Login page', async ({ page }) => {
    await page.goto('/opencart/');

    await openAccountDropdownAndChoose(page, 'Login');

    await expect(page).toHaveURL(/route=account\/login/);
    await expect(page.getByRole('heading', { name: 'Returning Customer' })).toBeVisible();
    await expect(page.locator(xp('Login_Page', 'E-Mail Address'))).toBeVisible();
    await expect(page.locator(xp('Login_Page', 'Password'))).toBeVisible();
  });

  test('TC17 - Logging in with valid credentials lands on My Account', async ({ page }) => {
    await page.goto('/');
    await openAccountDropdownAndChoose(page, 'Login');

    await loginWithForm(page, credentials.email, credentials.password);

    await expect(page).toHaveURL(/route=account\/account/);
    await expect(page.getByRole('heading', { name: 'My Account' })).toBeVisible();
  });

  test('TC18 - Logging in with an invalid password shows an error and stays on Login', async ({ page }) => {
    await page.goto('/');
    await openAccountDropdownAndChoose(page, 'Login');

    await loginWithForm(page, credentials.email, 'wrong-password-123');

    await expect(page).toHaveURL(/route=account\/login/);
    await expect(page.getByText(/No match for E-Mail Address and\/or Password/i)).toBeVisible();
  });

  test('TC19 - The "Forgotten Password" link is available on the Login page', async ({ page }) => {
    await page.goto('/');
    await openAccountDropdownAndChoose(page, 'Login');

    await page.locator(xp('Login_Page', 'Forgotten Password')).click();

    await expect(page).toHaveURL(/route=account\/forgotten/);
    await expect(page.getByRole('heading', { name: /Forgotten Password/i })).toBeVisible();
  });
});

test.describe('Logout (authenticated)', () => {
  test.use({ storageState: STORAGE_STATE });

  test('TC20 - Logging out from My Account returns to the anonymous Home state', async ({ page }) => {
    await page.goto('/index.php?route=account/account');
    await expect(page.getByRole('heading', { name: 'My Account' })).toBeVisible();

    await logout(page);

    // Exact wording isn't covered by a reference screenshot, so we match
    // loosely on "logged off" and rely on the header check below as the
    // real proof that the session ended.
    await expect(page.getByText(/logged off/i)).toBeVisible();

    // Header is back to its anonymous state: dropdown offers Register/Login again.
    await page.locator(xp('Home_Anonymous', 'My Account')).click();
    await expect(page.locator(xp('Home_Anonymous_drop_down', 'Login'))).toBeVisible();
    await expect(page.locator(xp('Home_Anonymous_drop_down', 'Register'))).toBeVisible();
  });
});
