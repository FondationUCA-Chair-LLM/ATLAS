// tests/05-catalog-product.spec.js
//
// TC26 - TC31: Desktops > Mac > iMac browsing path, header search, and the
// resulting Shopping Cart totals, for a logged-in shopper.

const path = require('path');
const { test, expect } = require('@playwright/test');
const { xp } = require('../utils/xpath');
const { openDesktopsMacCategory, searchHeader, clearCart, openCartFromHeader } = require('../utils/actions');
const { PRODUCT } = require('../utils/testData');

const STORAGE_STATE = path.join(__dirname, '..', '.auth', 'user.json');

test.describe('Catalog & product detail (authenticated)', () => {
  test.use({ storageState: STORAGE_STATE });

  test.beforeEach(async ({ page }) => {
    await page.goto('/opencart/');
    await clearCart(page, 'Home_Authenticated'); // start every test with an empty cart
  });

  test('TC26 - Desktops > Mac (1) lists the iMac for a logged-in shopper', async ({ page }) => {
    await openDesktopsMacCategory(page, 'Home_Authenticated');

    await expect(page.getByRole('heading', { name: 'Mac', exact: true })).toBeVisible();
    await expect(page.locator(xp('Category_Mac_Auth', 'iMac'))).toBeVisible();
    await expect(page.getByText(PRODUCT.price)).toBeVisible();
  });

  test('TC27 - The iMac product page shows brand, model and availability', async ({ page }) => {
    await openDesktopsMacCategory(page, 'Home_Authenticated');
    await page.locator(xp('Category_Mac_Auth', 'iMac')).click();

    await expect(page.getByRole('heading', { name: PRODUCT.name, exact: true })).toBeVisible();
    await expect(page.getByText(PRODUCT.brand, { exact: true })).toBeVisible();
    await expect(page.getByText(PRODUCT.model)).toBeVisible();
    await expect(page.getByText('In Stock')).toBeVisible();
  });

  test('TC28 - Header search for "imac" returns the iMac for a logged-in shopper', async ({ page }) => {
    await searchHeader(page, 'Home_Authenticated', 'imac');

    await expect(page).toHaveURL(/route=product\/search/);
    await expect(page.locator(xp('Search_Results_Auth', 'iMac'))).toBeVisible();
  });

  test('TC29 - Adding the iMac to the cart updates the header cart total', async ({ page }) => {
    await openDesktopsMacCategory(page, 'Home_Authenticated');
    await page.locator(xp('Category_Mac_Auth', 'iMac')).click();

    await page.locator(xp('Product_Detail_Auth', 'Qty')).fill('1');
    await page.locator(xp('Product_Detail_Auth', 'Add to Cart')).click();

    await expect(page.locator('#top')).toContainText('1 item');
    await expect(page.locator('#top')).toContainText(PRODUCT.price);
  });

  test('TC30 - The iMac product page recommends the Apple Cinema 30" as a related product', async ({ page }) => {
    await openDesktopsMacCategory(page, 'Home_Authenticated');
    await page.locator(xp('Category_Mac_Auth', 'iMac')).click();

    await expect(page.getByRole('heading', { name: 'Related Products' })).toBeVisible();
    await expect(page.getByText('Apple Cinema 30"')).toBeVisible();
  });

  test('TC31 - The Shopping Cart shows correct weight and tax breakdown for one iMac', async ({ page }) => {
    await openDesktopsMacCategory(page, 'Home_Authenticated');
    await page.locator(xp('Category_Mac_Auth', 'iMac')).click();
    await page.locator(xp('Product_Detail_Auth', 'Add to Cart')).click();

    await openCartFromHeader(page, 'Home_Authenticated');

    await expect(page.getByRole('heading', { name: /Shopping Cart \(5\.00kg\)/ })).toBeVisible();
    await expect(page.locator(xp('Shopping_Cart_Auth', 'iMac'))).toBeVisible();
    await expect(page.getByText('Sub-Total')).toBeVisible();
    await expect(page.getByText('$100.00').first()).toBeVisible();
    await expect(page.getByText(/Eco Tax/)).toBeVisible();
    await expect(page.getByText('$2.00')).toBeVisible();
    await expect(page.getByText(/VAT \(20%\)/)).toBeVisible();
    await expect(page.getByText('$20.00')).toBeVisible();
    await expect(page.getByText('$122.00').first()).toBeVisible(); // unit price / line / grand total
  });
});
