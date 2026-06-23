// 05-account-management.spec.js
//
// Covers the two simple "leaf" sections reachable from My Account: Reward
// Points and Wish List. Every test starts from the root and logs in first.

const { test, expect } = require('@playwright/test');
const actions = require('./helpers/actions');
const { EXISTING_USER } = require('./helpers/testData');

test.describe('Account management: Reward Points & Wish List', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/opencart');
    await actions.loginAsExistingUser(page, EXISTING_USER);
    await expect(page.getByRole('heading', { name: 'My Account' })).toBeVisible();
  });

  // Edge 18: My_Account --Reward Points--> Reward_Points
  test('TC-39 | "Reward Points" from My Account shows the reward points page', async ({
    page,
  }) => {
    await actions.clickMyAccountRewardPoints(page);

    await expect(page).toHaveURL(/route=account\/rewardpoints/);
    await expect(page.getByRole('heading', { name: 'Your Reward Points' })).toBeVisible();
  });

  // Edge 19: Reward_Points --Continue--> My_Account
  test('TC-40 | "Continue" on Reward Points returns to My Account', async ({ page }) => {
    await actions.clickMyAccountRewardPoints(page);

    await actions.clickRewardPointsContinue(page);

    await expect(page).toHaveURL(/route=account\/account/);
    await expect(page.getByRole('heading', { name: 'My Account' })).toBeVisible();
  });

  // Edge 28: My_Account --Wish List--> Wishlist_Empty
  test('TC-41 | "Wish List" from My Account shows the empty wish list message', async ({
    page,
  }) => {
    await actions.clickMyAccountWishList(page);

    await expect(page).toHaveURL(/route=account\/wishlist/);
    await expect(page.getByRole('heading', { name: 'My Wishlist' })).toBeVisible();
    await expect(page.getByText('Your wish list is empty.')).toBeVisible();
  });

  // Edge 29: Wishlist_Empty --Continue--> My_Account
  test('TC-42 | "Continue" on the empty Wish List returns to My Account', async ({
    page,
  }) => {
    await actions.clickMyAccountWishList(page);

    await actions.clickWishlistContinue(page);

    await expect(page).toHaveURL(/route=account\/account/);
    await expect(page.getByRole('heading', { name: 'My Account' })).toBeVisible();
  });
});
