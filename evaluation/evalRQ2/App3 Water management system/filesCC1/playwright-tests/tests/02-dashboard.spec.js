// tests/02-dashboard.spec.js
//
// Scenarios 4-10
// Covers the Dashboard side menu links and "View Details" cards, i.e.
// the "Dashboard -> Vendors / Customers / Products / Orders" edges from
// navigation_graph.json plus the dashboard widgets/xpaths from
// xpath_mapping.json.

const { test, expect } = require('@playwright/test');
const { xp } = require('../utils/xpaths');
const { login } = require('../utils/auth');

test.describe('Dashboard navigation', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
    await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible();
  });

  test('Scenario 04 - Side menu "Vendors" link opens the Vendors screen', async ({ page }) => {
    // Edge: Dashboard -> Vendors (ON_CLICK "Vendors")
    await page.locator(xp('Dashboard', 'Vendors')).click();

    await expect(page.getByRole('heading', { name: 'Vendors' })).toBeVisible();
    await expect(page.locator(xp('Vendors', 'Search'))).toBeVisible();
    await expect(page.locator(xp('Vendors', '+ Add Vendors'))).toBeVisible();
  });

  test('Scenario 05 - Side menu "Customer" link opens the Customer screen', async ({ page }) => {
    // Edge: Dashboard -> Customers (ON_CLICK "Customer")
    await page.locator(xp('Dashboard', 'Customer')).click();

    await expect(page.getByRole('heading', { name: 'Customer' })).toBeVisible();
    await expect(page.locator(xp('Customers', 'Search'))).toBeVisible();
    await expect(page.locator(xp('Customers', '+ Add Customer'))).toBeVisible();
  });

  test('Scenario 06 - Side menu "Products" link opens the Product screen', async ({ page }) => {
    // Edge: Dashboard -> Products (ON_CLICK "Products")
    await page.locator(xp('Dashboard', 'Products')).click();

    await expect(page.getByRole('heading', { name: 'Product' })).toBeVisible();
    await expect(page.locator(xp('Products', 'Search'))).toBeVisible();
    await expect(page.locator(xp('Products', '+ Add product'))).toBeVisible();
  });

  test('Scenario 07 - Side menu "Orders" link opens the Orders screen', async ({ page }) => {
    // Edge: Dashboard -> Orders (ON_CLICK "Orders")
    await page.locator(xp('Dashboard', 'Orders')).click();

    await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible();
    await expect(page.locator(xp('Orders', 'Search'))).toBeVisible();
  });

  test('Scenario 08 - Dashboard "View Details" card for Vendors opens the Vendors screen', async ({ page }) => {
    const viewDetails = page.locator(xp('Dashboard', 'View Details - Vendors'));
    await expect(viewDetails).toBeVisible();
    await expect(viewDetails).toContainText('View Details');

    await viewDetails.click();

    await expect(page.getByRole('heading', { name: 'Vendors' })).toBeVisible();
  });

  test('Scenario 09 - Dashboard "View Details" card for Customers opens the Customer screen', async ({ page }) => {
    const viewDetails = page.locator(xp('Dashboard', 'View Details - Customers'));
    await expect(viewDetails).toBeVisible();
    await expect(viewDetails).toContainText('View Details');

    await viewDetails.click();

    await expect(page.getByRole('heading', { name: 'Customer' })).toBeVisible();
  });

  test('Scenario 10 - Dashboard "View Details" card for Products opens the Product screen', async ({ page }) => {
    const viewDetails = page.locator(xp('Dashboard', 'View Details - Products'));
    await expect(viewDetails).toBeVisible();

    await viewDetails.click();

    await expect(page.getByRole('heading', { name: 'Product' })).toBeVisible();
  });

});
