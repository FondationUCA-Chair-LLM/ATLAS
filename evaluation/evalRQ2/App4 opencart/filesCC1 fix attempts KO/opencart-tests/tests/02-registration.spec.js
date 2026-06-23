// tests/02-registration.spec.js
//
// TC11 - TC15: "Register Account" node and its edges to/from Login and
// Account Created. Each test registers its own unique e-mail address
// (timestamp + random suffix) so the suite can be re-run against the
// same OpenCart instance without "E-Mail Address already registered" errors.

const { test, expect } = require('@playwright/test');
const { xp } = require('../utils/xpath');
const { openAccountDropdownAndChoose, registerAccount } = require('../utils/actions');

function uniqueUser() {
  const id = `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  return {
    firstName: 'toto',
    lastName: 'toto',
    email: `toto.${id}@gmail.com`,
    password: 'toto1234',
  };
}

test.describe('Registration', () => {
  test('TC11 - "Register" in the My Account dropdown opens the Register Account page', async ({ page }) => {
    await page.goto('/opencart/');

    await openAccountDropdownAndChoose(page, 'Register');

    await expect(page).toHaveURL(/route=account\/register/);
    await expect(page.getByRole('heading', { name: 'Register Account' })).toBeVisible();
    await expect(page.locator(xp('Register_Account', 'First Name'))).toBeVisible();
    await expect(page.locator(xp('Register_Account', 'Last Name'))).toBeVisible();
    await expect(page.locator(xp('Register_Account', 'E-Mail'))).toBeVisible();
    await expect(page.locator(xp('Register_Account', 'Password'))).toBeVisible();
  });

  test('TC12 - Submitting the register form without agreeing to the Privacy Policy is rejected', async ({ page }) => {
    const user = uniqueUser();
    await page.goto('/');
    await openAccountDropdownAndChoose(page, 'Register');

    await page.locator(xp('Register_Account', 'First Name')).fill(user.firstName);
    await page.locator(xp('Register_Account', 'Last Name')).fill(user.lastName);
    await page.locator(xp('Register_Account', 'E-Mail')).fill(user.email);
    await page.locator(xp('Register_Account', 'Password')).fill(user.password);
    // Intentionally leave the "I have read and agree..." switch OFF.
    await page.locator(xp('Register_Account', 'Continue')).click();

    // OpenCart blocks submission and keeps the shopper on the register form.
    await expect(page).toHaveURL(/route=account\/register/);
    await expect(page.getByText(/Privacy Policy/i)).toBeVisible();
  });

  test('TC13 - A valid registration creates the account and lands on My Account', async ({ page }) => {
    const user = uniqueUser();
    await page.goto('/');
    await openAccountDropdownAndChoose(page, 'Register');

    await registerAccount(page, user);

    await expect(page.getByRole('heading', { name: 'Your Account Has Been Created!' })).toBeVisible();
    await page.locator(xp('Account_Created', 'Continue')).click();

    await expect(page).toHaveURL(/route=account\/account/);
    await expect(page.getByRole('heading', { name: 'My Account' })).toBeVisible();
  });

  test('TC14 - The "Continue" button on the Login page opens the Register Account page', async ({ page }) => {
    await page.goto('/');
    await openAccountDropdownAndChoose(page, 'Login');

    await page.locator(xp('Login_Page', 'Continue')).click();

    await expect(page).toHaveURL(/route=account\/register/);
    await expect(page.getByRole('heading', { name: 'Register Account' })).toBeVisible();
  });

  test('TC15 - The "login page" link on Register Account navigates back to Login', async ({ page }) => {
    await page.goto('/');
    await openAccountDropdownAndChoose(page, 'Register');

    // Not present in xpath_mapping.json (only the page's nav/breadcrumb/form
    // fields are listed there) - falling back to an accessible-name locator
    // for this single inline link.
    await page.getByRole('link', { name: 'login page' }).click();

    await expect(page).toHaveURL(/route=account\/login/);
    await expect(page.getByRole('heading', { name: 'Returning Customer' })).toBeVisible();
  });
});
