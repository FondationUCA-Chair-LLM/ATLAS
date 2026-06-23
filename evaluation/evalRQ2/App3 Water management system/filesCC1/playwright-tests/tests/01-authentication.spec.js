// tests/01-authentication.spec.js
//
// Scenarios 1-3
// Covers the Login and Register screens and the
// "Register -> Login" / "Login -> Dashboard" transitions from
// navigation_graph.json.

const { test, expect } = require('@playwright/test');
const { xp } = require('../utils/xpaths');
const { credentials, uniqueSuffix } = require('../utils/testData');

test.describe('Authentication', () => {

  test('Scenario 01 - Successful login with valid credentials opens the Dashboard', async ({ page }) => {
    await page.goto('login.php');

    // "Please Sign in" form is displayed with Username/Password fields
    await expect(page.getByText('Please Sign in')).toBeVisible();
    await expect(page.locator(xp('Login', 'Username'))).toBeVisible();
    await expect(page.locator(xp('Login', 'Password'))).toBeVisible();

    await page.locator(xp('Login', 'Username')).fill(credentials.username);
    await page.locator(xp('Login', 'Password')).fill(credentials.password);
    await page.locator(xp('Login', 'Login')).click();

    // Edge: Login -> Dashboard (ON_CLICK "Login")
    await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible();
    await expect(page.locator(xp('Dashboard', 'Dashboard'))).toBeVisible();
    await expect(page.locator(xp('Dashboard', 'Vendors'))).toBeVisible();
    await expect(page.locator(xp('Dashboard', 'Customer'))).toBeVisible();
    await expect(page.locator(xp('Dashboard', 'Products'))).toBeVisible();
    await expect(page.locator(xp('Dashboard', 'Orders'))).toBeVisible();
  });

  test('Scenario 02 - "Register" link on the Login page opens the Register screen', async ({ page }) => {
    await page.goto('login.php');

    await page.locator(xp('Login', 'Register')).click();

    // The Register screen shows the registration form
    await expect(page.getByText('Please Register Here')).toBeVisible();
    await expect(page.locator(xp('Register', 'Username'))).toBeVisible();
    await expect(page.locator(xp('Register', 'Email'))).toBeVisible();
    await expect(page.locator(xp('Register', 'Password'))).toBeVisible();
  });

  test('Scenario 03 - Registering a new account redirects to Login with a success message', async ({ page }) => {
    const suffix = uniqueSuffix();
    const newUser = {
      username: `qa_user_${suffix}`,
      email: `qa_user_${suffix}@example.com`,
      password: 'Test@1234',
    };

    await page.goto('login.php');
    await page.locator(xp('Login', 'Register')).click();
    await expect(page.getByText('Please Register Here')).toBeVisible();

    await page.locator(xp('Register', 'Username')).fill(newUser.username);
    await page.locator(xp('Register', 'Email')).fill(newUser.email);
    await page.locator(xp('Register', 'Password')).fill(newUser.password);

    // Edge: Register -> Login (ON_CLICK "Login" = submit button)
    await page.locator(xp('Register', 'Login')).click();

    await expect(page.getByText(/Registered Success/i)).toBeVisible();
    await expect(page.getByText('Please Sign in')).toBeVisible();
    await expect(page.locator(xp('Login', 'Username'))).toBeVisible();
    await expect(page.locator(xp('Login', 'Password'))).toBeVisible();
  });

});
