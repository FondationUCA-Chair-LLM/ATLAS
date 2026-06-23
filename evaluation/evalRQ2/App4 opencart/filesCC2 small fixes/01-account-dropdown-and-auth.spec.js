// 01-account-dropdown-and-auth.spec.js
//
// Covers the "My Account" dropdown and the full Login / Register / Logout
// sub-graph. Every test starts from the root of the application
// (Home_Anonymous, i.e. page.goto('/')) as required.
//
// Edge numbering refers to docs/test_scenarios.md.

const { test, expect } = require('@playwright/test');
const actions = require('./helpers/actions');
const { locate } = require('./helpers/xpathLoader');
const { EXISTING_USER, buildNewRegistrationData } = require('./helpers/testData');

test.describe('Account dropdown, Login, Register & Logout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/opencart');
  });

  // Edge 8: Home_Anonymous --My Account--> Home_Anonymous_drop_down
  test('TC-01 | Opening the "My Account" menu reveals Register and Login', async ({
    page,
  }) => {
    await actions.openAccountDropdown(page);

    await expect(locate(page, 'Home_Anonymous_drop_down', 'Register')).toBeVisible();
    await expect(locate(page, 'Home_Anonymous_drop_down', 'Login')).toBeVisible();
  });

  // Edge 1: Home_Anonymous_drop_down --Login--> Login_Page
  test('TC-02 | Clicking "Login" from the dropdown opens the Login page', async ({
    page,
  }) => {
    await actions.openAccountDropdown(page);
    await actions.clickDropdownLogin(page);

    await expect(page).toHaveURL(/route=account\/login/);
    await expect(page.getByRole('heading', { name: 'Returning Customer' })).toBeVisible();
  });

  // Edge 2: Home_Anonymous_drop_down --Register--> Register_Account
  test('TC-03 | Clicking "Register" from the dropdown opens the Register page', async ({
    page,
  }) => {
    await actions.openAccountDropdown(page);
    await actions.clickDropdownRegister(page);

    await expect(page).toHaveURL(/route=account\/register/);
    await expect(page.getByRole('heading', { name: 'Register Account' })).toBeVisible();
  });

  // Edge 3: Login_Page --Continue--> Register_Account
  test('TC-04 | "New Customer > Continue" on the Login page leads to Register', async ({
    page,
  }) => {
    await actions.openAccountDropdown(page);
    await actions.clickDropdownLogin(page);
    await actions.clickLoginPageContinueToRegister(page);

    await expect(page).toHaveURL(/route=account\/register/);
    await expect(page.getByRole('heading', { name: 'Register Account' })).toBeVisible();
  });

  // Edge 4: Register_Account --login page--> Login_Page
  test('TC-05 | "login page" link on Register goes back to Login', async ({ page }) => {
    await actions.openAccountDropdown(page);
    await actions.clickDropdownRegister(page);
    await actions.clickRegisterAccountLoginPageLink(page);

    await expect(page).toHaveURL(/route=account\/login/);
    await expect(page.getByRole('heading', { name: 'Returning Customer' })).toBeVisible();
  });

  // Edge 5: Register_Account --Continue--> Account_Created
  test('TC-06 | Submitting a valid registration form creates the account', async ({
    page,
  }) => {
    const newUser = buildNewRegistrationData();

    await actions.openAccountDropdown(page);
    await actions.clickDropdownRegister(page);
    await actions.fillAndSubmitRegisterForm(page, newUser);

    await expect(page).toHaveURL(/route=account\/success/);
    await expect(
      page.getByRole('heading', { name: 'Your Account Has Been Created!' })
    ).toBeVisible();
  });

  // Edge 6: Account_Created --Continue--> My_Account
  test('TC-07 | "Continue" on the Account Created page lands on My Account', async ({
    page,
  }) => {
    const newUser = buildNewRegistrationData();

    await actions.openAccountDropdown(page);
    await actions.clickDropdownRegister(page);
    await actions.fillAndSubmitRegisterForm(page, newUser);
    await actions.clickAccountCreatedContinue(page);

    await expect(page).toHaveURL(/route=account\/account/);
    await expect(page.getByRole('heading', { name: 'My Account' })).toBeVisible();
  });

  // Edge 7: Login_Page --Login--> My_Account
  test('TC-08 | Logging in with valid credentials lands on My Account', async ({
    page,
  }) => {
    await actions.openAccountDropdown(page);
    await actions.clickDropdownLogin(page);
    await actions.fillAndSubmitLoginForm(page, EXISTING_USER);

    await expect(page).toHaveURL(/route=account\/account/);
    await expect(page.getByRole('heading', { name: 'My Account' })).toBeVisible();
  });

  // Edge 42: My_Account --Logout--> Home_Anonymous
  test('TC-09 | Logging out returns the user to the anonymous home page', async ({
    page,
  }) => {
    // Precondition: reach My_Account first (Home -> dropdown -> Login -> My Account)
    await actions.loginAsExistingUser(page, EXISTING_USER);
    await expect(page.getByRole('heading', { name: 'My Account' })).toBeVisible();

    await actions.clickMyAccountLogout(page);

    await expect(page).toHaveURL(/route=account\/logout/);
    // Anonymous state is restored: the dropdown offers Register/Login again
    await actions.openAccountDropdown(page);
    await expect(locate(page, 'Home_Anonymous_drop_down', 'Login')).toBeVisible();
  });
});
