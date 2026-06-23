// tests/01-anonymous-navigation.spec.js
//
// TC01 - TC10: scenarios reachable from the "Home (Anonymous)" node of the
// navigation graph, with no prior login. Each test starts a brand-new
// browser context (Playwright's default), so the cart/session is always
// empty at the start of every test in this file.

const { test, expect } = require('@playwright/test');
const { xp } = require('../utils/xpath');
const { searchHeader, openDesktopsMacCategory, submitContactForm } = require('../utils/actions');
const { PRODUCT, USER, ENQUIRY } = require('../utils/testData');

test.describe('Anonymous browsing & navigation', () => {
  test('TC01 - Home page loads with default storefront elements for an anonymous visitor', async ({ page }) => {
    await page.goto('/opencart/');

    await expect(page.locator(xp('Home_Anonymous', 'Search'))).toBeVisible();
    await expect(page.locator(xp('Home_Anonymous', 'My Account'))).toBeVisible();
    await expect(page.locator(xp('Home_Anonymous', 'Shopping Cart'))).toBeVisible();
    await expect(page.locator(xp('Home_Anonymous', 'Checkout'))).toBeVisible();

    // Top navigation categories.
    for (const category of ['Desktops', 'Laptops & Notebooks', 'Components', 'Tablets', 'Software', 'Phones & PDAs', 'Cameras', 'MP3 Players']) {
      await expect(page.locator(xp('Home_Anonymous', category))).toBeVisible();
    }

    // Wish list counter starts at 0 for a brand-new session.
    await expect(page.locator(xp('Home_Anonymous', 'Wish List (0)'))).toContainText('0');
  });

  test('TC02 - "My Account" dropdown offers Register and Login to an anonymous visitor', async ({ page }) => {
    await page.goto('/opencart');

    await page.locator(xp('Home_Anonymous', 'My Account')).click();

    await expect(page.locator(xp('Home_Anonymous_drop_down', 'Register'))).toBeVisible();
    await expect(page.locator(xp('Home_Anonymous_drop_down', 'Login'))).toBeVisible();
  });

  test('TC03 - Desktops mega-menu lists PC (0), Mac (1) and "Show All Desktops"', async ({ page }) => {
    await page.goto('/');

    const desktops = page.locator(xp('Home_Anonymous', 'Desktops'));
    await desktops.hover();
    await desktops.click();

    await expect(page.locator(xp('Home_Anonymous', 'PC (0)'))).toBeVisible();
    await expect(page.locator(xp('Home_Anonymous', 'Mac (1)'))).toBeVisible();
    await expect(page.locator(xp('Home_Anonymous', 'Show All Desktops'))).toBeVisible();
  });

  test('TC04 - Searching "imac" from the header returns the iMac in Search results', async ({ page }) => {
    await page.goto('/');

    await searchHeader(page, 'Home_Anonymous', 'imac');

    await expect(page).toHaveURL(/route=product\/search/);
    await expect(page.getByRole('heading', { name: /Search\s*-\s*imac/i })).toBeVisible();
    await expect(page.locator(xp('Search_Results_Anon', 'iMac'))).toBeVisible();
  });

  test('TC05 - Opening the iMac from search results shows the expected product details', async ({ page }) => {
    await page.goto('/');
    await searchHeader(page, 'Home_Anonymous', 'imac');
    await page.locator(xp('Search_Results_Anon', 'iMac')).click();

    await expect(page.getByRole('heading', { name: PRODUCT.name, exact: true })).toBeVisible();
    await expect(page.getByText(PRODUCT.price).first()).toBeVisible();
    await expect(page.getByText(new RegExp(`Ex Tax:\\s*${PRODUCT.exTax}`))).toBeVisible();
    await expect(page.locator(xp('Product_Detail_Anon', 'Add to Cart'))).toBeVisible();
  });

  test('TC06 - Adding the iMac to the cart updates the header cart indicator', async ({ page }) => {
    await page.goto('/');
    await searchHeader(page, 'Home_Anonymous', 'imac');
    await page.locator(xp('Search_Results_Anon', 'iMac')).click();

    await page.locator(xp('Product_Detail_Anon', 'Add to Cart')).click();

    // OpenCart refreshes the header cart widget via AJAX after a successful add.
    await expect(page.locator('#top')).toContainText('1 item');
    await expect(page.locator('#top')).toContainText(PRODUCT.price);
  });

  test('TC07 - A fresh anonymous session has an empty Shopping Cart page', async ({ page }) => {
    await page.goto('/');

    await page.locator(xp('Home_Anonymous', 'Shopping Cart')).click();

    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();
    await expect(page.getByText('Your shopping cart is empty!')).toBeVisible();
    await expect(page.locator(xp('Shopping_Cart_Empty', 'Continue'))).toBeVisible();
  });

  test('TC08 - Anonymous visitor submits the Contact Us form and sees a confirmation', async ({ page }) => {
    await page.goto('/');
    await page.locator(xp('Home_Anonymous', '123456789')).click(); // header phone link -> Contact Us

    await submitContactForm(page, 'Contact_Us_Anon', USER.firstName, USER.email, ENQUIRY);

    await expect(page.getByText('Your enquiry has been successfully sent to the store owner!')).toBeVisible();
    await expect(page.locator(xp('Contact_Submitted_Anon', 'Continue'))).toBeVisible();
  });

  test('TC09 - Clicking the header phone number navigates to the Contact Us page', async ({ page }) => {
    await page.goto('/');

    await page.locator(xp('Home_Anonymous', '123456789')).click();

    await expect(page).toHaveURL(/route=information\/contact/);
    await expect(page.getByRole('heading', { name: 'Contact Us', exact: true })).toBeVisible();
    await expect(page.locator(xp('Contact_Us_Anon', 'Submit'))).toBeVisible();
  });

  test('TC10 - Browsing Desktops > Mac lists the iMac with its catalog price', async ({ page }) => {
    await page.goto('/');

    await openDesktopsMacCategory(page, 'Home_Anonymous');

    await expect(page.getByRole('heading', { name: 'Mac', exact: true })).toBeVisible();
    await expect(page.locator(xp('Category_Mac_Anon', 'iMac'))).toBeVisible();
    await expect(page.getByText(PRODUCT.price)).toBeVisible();
  });
});
