// tests/06-orders.spec.js
//
// Scenarios 28-32
// Covers the Orders screen and its related screens: search results,
// payment status update, delete and bill/invoice.
//
// NOTE: "Orders -> UpdatePaidstatus" (via "Paid"), "Orders ->
// DeleteOrderSuccess" (via "Delete") and "Orders -> ViewBill" (via
// "BILL") are explicit edges in navigation_graph.json. The "Go"/"Back"
// search flow (-> OrdersSearchResults) is not represented as an edge in
// navigation_graph.json, but the corresponding "Search"/"Go"/"Back"
// elements are present in xpath_mapping.json, so it is covered here too.

const { test, expect } = require('@playwright/test');
const { xp } = require('../utils/xpaths');
const { login } = require('../utils/auth');

test.describe('Orders management', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.locator(xp('Dashboard', 'Orders')).click();
    await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible();
  });

  test('Scenario 28 - Searching for an existing order returns matching results', async ({ page }) => {
    await page.locator(xp('Orders', 'Search')).fill('1045');

    // Edge: Orders -> OrdersSearchResults (ON_CLICK "Go")
    await page.locator(xp('Orders', 'Go')).click();

    await expect(page.locator(xp('OrdersSearchResults', 'Back'))).toBeVisible();
    await expect(page.getByRole('cell', { name: '1045' })).toBeVisible();
  });

  test('Scenario 29 - "Back" button on order search results returns to the full Orders list', async ({ page }) => {
    await page.locator(xp('Orders', 'Search')).fill('1045');
    await page.locator(xp('Orders', 'Go')).click();
    await expect(page.locator(xp('OrdersSearchResults', 'Back'))).toBeVisible();

    // Edge: OrdersSearchResults -> Orders (ON_CLICK "Back")
    await page.locator(xp('OrdersSearchResults', 'Back')).click();

    await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible();
    await expect(page.locator(xp('Orders', 'Search'))).toBeVisible();
  });

  test('Scenario 30 - Toggling the payment status of the first order updates it', async ({ page }) => {
    const statusBadge = page.locator(xp('Orders', 'Paid'));
    await expect(statusBadge).toBeVisible();
    const initialStatus = (await statusBadge.textContent())?.trim();

    // Edge: Orders -> UpdatePaidstatus (ON_CLICK "Paid")
    await statusBadge.click();

    await expect(page.getByText(/Payment Status Updated/i)).toBeVisible();
    await expect(page.locator(xp('UpdatePaidstatus', 'Search'))).toBeVisible();

    const updatedStatus = (await page.locator(xp('Orders', 'Paid')).textContent())?.trim();
    expect(updatedStatus).not.toEqual(initialStatus);
    expect(['Paid', 'Pending']).toContain(updatedStatus);
  });

  test('Scenario 31 - Deleting the first order shows a "Deleted" confirmation', async ({ page }) => {
    page.on('dialog', (dialog) => dialog.accept());

    // Edge: Orders -> DeleteOrderSuccess (ON_CLICK "Delete")
    await page.locator(xp('Orders', 'Delete')).click();

    await expect(page.getByText(/Deleted/i)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible();
    await expect(page.locator(xp('DeleteOrderSuccess', 'Search'))).toBeVisible();
  });

  test('Scenario 32 - "BILL" action opens the invoice for the first order', async ({ context, page }) => {
    // Edge: Orders -> ViewBill (ON_CLICK "BILL").
    // The bill/invoice may open in a new browser tab.
    const [billPage] = await Promise.all([
      context.waitForEvent('page', { timeout: 5000 }).catch(() => null),
      page.locator(xp('Orders', 'BILL')).click(),
    ]);

    const target = billPage || page;
    await target.waitForLoadState();

    // ViewBill has no defined xpaths in xpath_mapping.json, so the
    // invoice content is verified via the text visible in the
    // order-bill.png screenshot.
    await expect(target.getByText(/Order No/i)).toBeVisible();
    await expect(target.getByText(/GRAND TOTAL/i)).toBeVisible();
    await expect(target.getByText(/Print/i)).toBeVisible();
    await expect(target.getByText(/Export as PDF/i)).toBeVisible();
  });

});
