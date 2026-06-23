// tests/04-my-account.spec.js
//
// TC21 - TC25: the "My Account" node and its edges to Wish List, Reward
// Points, and Home (Authenticated). Runs against the authenticated
// storage state produced by global-setup.js.

const path = require('path');
const { test, expect } = require('@playwright/test');
const { xp } = require('../utils/xpath');

const STORAGE_STATE = path.join(__dirname, '..', '.auth', 'user.json');

test.describe('My Account (authenticated)', () => {
  test.use({ storageState: STORAGE_STATE });

  test.beforeEach(async ({ page }) => {
    await page.goto('/opencart/index.php?route=account/account');
  });

  test('TC21 - My Account lists all account management sections', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'My Account' })).toBeVisible();

    for (const link of ['My Account', 'Edit Account', 'Password', 'Payment Methods', 'Address Book', 'Wish List', 'Order History', 'Reward Points', 'Logout']) {
      await expect(page.locator(xp('My_Account', link))).toBeVisible();
    }
  });

  test('TC22 - "Wish List" shows the empty wishlist message', async ({ page }) => {
    await page.locator(xp('My_Account', 'Wish List')).click();

    await expect(page).toHaveURL(/route=account\/wishlist/);
    await expect(page.getByRole('heading', { name: 'My Wishlist' })).toBeVisible();
    await expect(page.getByText('Your wish list is empty.')).toBeVisible();
    await expect(page.locator(xp('Wishlist_Empty', 'Continue'))).toBeVisible();
  });

  test('TC23 - "Reward Points" shows a zero balance and no history rows', async ({ page }) => {
    await page.locator(xp('My_Account', 'Reward Points')).click();

    await expect(page).toHaveURL(/route=account\/rewardpoints|route=account\/reward/);
    await expect(page.getByRole('heading', { name: 'Your Reward Points' })).toBeVisible();
    await expect(page.getByText('Your total number of reward points is: 0')).toBeVisible();
    await expect(page.getByText('You do not have any reward points!')).toBeVisible();
    await expect(page.locator(xp('Reward_Points', 'Continue'))).toBeVisible();
  });

  test('TC24 - The logo link returns from My Account to Home (Authenticated)', async ({ page }) => {
    await page.locator(xp('My_Account', 'Home')).click();

    await expect(page).toHaveURL(/route=common\/home|\/opencart\/?$/);
    await expect(page.locator(xp('Home_Authenticated', 'Desktops'))).toBeVisible();
    await expect(page.locator(xp('Home_Authenticated', 'Shopping Cart'))).toBeVisible();
  });

  test('TC25 - The header "My Account" link re-opens the My Account page', async ({ page }) => {
    await page.locator(xp('My_Account', 'Home')).click(); // start from Home (Authenticated)

    // NOTE: xpath_mapping.json only documents an anonymous "drop down" with
    // Register/Login. For an authenticated session this same header element
    // navigates straight to the account dashboard.
    await page.locator(xp('Home_Authenticated', 'My Account')).click();

    await expect(page).toHaveURL(/route=account\/account/);
    await expect(page.getByRole('heading', { name: 'My Account' })).toBeVisible();
  });
});
