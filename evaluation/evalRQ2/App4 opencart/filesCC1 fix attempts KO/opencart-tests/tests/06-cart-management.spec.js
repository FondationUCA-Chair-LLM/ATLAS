// tests/06-cart-management.spec.js
//
// TC32 - TC35: actions available directly on the Shopping Cart page
// (Update, Remove, Continue Shopping, Checkout). Each test rebuilds a
// known-good "1x iMac" cart in beforeEach so it never depends on what a
// previous test (in this file or another) left behind.

const path = require('path');
const { test, expect } = require('@playwright/test');
const { xp } = require('../utils/xpath');
const { openDesktopsMacCategory, openCartFromHeader, clearCart } = require('../utils/actions');

const STORAGE_STATE = path.join(__dirname, '..', '.auth', 'user.json');

test.describe('Cart management (authenticated)', () => {
  test.use({ storageState: STORAGE_STATE });

  test.beforeEach(async ({ page }) => {
    await page.goto('/opencart/');
    await clearCart(page, 'Home_Authenticated');
    await openDesktopsMacCategory(page, 'Home_Authenticated');
    await page.locator(xp('Category_Mac_Auth', 'iMac')).click();
    await page.locator(xp('Product_Detail_Auth', 'Add to Cart')).click();
    await openCartFromHeader(page, 'Home_Authenticated');
    await expect(page.getByRole('heading', { name: /Shopping Cart/ })).toBeVisible();
  });

  test('TC32 - Updating the quantity recalculates the cart total', async ({ page }) => {
    // The quantity <input> itself isn't listed in xpath_mapping.json (only
    // the Update/Remove buttons are); it's the only text input inside the
    // cart table, so it's targeted directly and reliably via CSS.
    const qtyInput = page.locator('#shopping-cart input[type="text"]').first();
    await qtyInput.fill('2');
    await page.locator(xp('Shopping_Cart_Auth', 'Update')).click();

    await expect(page.getByText('$244.00').first()).toBeVisible(); // 2 x $122.00
  });

  test('TC33 - Removing the only item empties the cart', async ({ page }) => {
    await page.locator(xp('Shopping_Cart_Auth', 'Remove')).click();

    await expect(page.getByText('Your shopping cart is empty!')).toBeVisible();
  });

  test('TC34 - "Continue Shopping" returns to Home (Authenticated)', async ({ page }) => {
    await page.locator(xp('Shopping_Cart_Auth', 'Continue Shopping')).click();

    await expect(page).toHaveURL(/route=common\/home|\/opencart\/?$/);
    await expect(page.locator(xp('Home_Authenticated', 'Desktops'))).toBeVisible();
  });

  test('TC35 - "Checkout" on the cart page opens the Checkout page', async ({ page }) => {
    await page.locator(xp('Shopping_Cart_Auth', 'Checkout')).click();

    await expect(page).toHaveURL(/route=checkout\/checkout/);
    await expect(page.getByRole('heading', { name: 'Checkout', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Payment Address' })).toBeVisible();
  });
});
