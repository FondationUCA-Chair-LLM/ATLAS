// tests/04-customers.spec.js
//
// Scenarios 17-22
// Covers the Customer screen and its child screens (search results, add,
// edit, delete, sell), matching the "Customers -> ..." edges from
// navigation_graph.json.
//
// NOTE: these scenarios mutate the Customer list (add/edit/delete/sell on
// the first row). They are written to run in order (workers: 1,
// fullyParallel: false) against a disposable/test database.

const { test, expect } = require('@playwright/test');
const { xp } = require('../utils/xpaths');
const { login } = require('../utils/auth');
const { uniqueSuffix } = require('../utils/testData');

test.describe('Customer management', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.locator(xp('Dashboard', 'Customer')).click();
    await expect(page.getByRole('heading', { name: 'Customer' })).toBeVisible();
  });

  test('Scenario 17 - Searching for an existing customer returns matching results', async ({ page }) => {
    await page.locator(xp('Customers', 'Search')).fill('Dikshant23');

    // Edge: Customers -> CustomersSearchResults (ON_CLICK "Go")
    await page.locator(xp('Customers', 'Go')).click();

    await expect(page.locator(xp('CustomersSearchResults', 'Back'))).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Dikshant23' })).toBeVisible();
  });

  test('Scenario 18 - "Back" button on customer search results returns to the full Customer list', async ({ page }) => {
    await page.locator(xp('Customers', 'Search')).fill('Dikshant23');
    await page.locator(xp('Customers', 'Go')).click();
    await expect(page.locator(xp('CustomersSearchResults', 'Back'))).toBeVisible();

    // Edge: CustomersSearchResults -> Customers (ON_CLICK "Back")
    await page.locator(xp('CustomersSearchResults', 'Back')).click();

    await expect(page.getByRole('heading', { name: 'Customer' })).toBeVisible();
    await expect(page.locator(xp('Customers', '+ Add Customer'))).toBeVisible();
  });

  test('Scenario 19 - Adding a new customer shows an "Added Success" confirmation', async ({ page }) => {
    const suffix = uniqueSuffix();
    const customerName = `Customer_${suffix}`;

    // Edge: Customers -> AddCustomer (ON_CLICK "+ Add Customer")
    await page.locator(xp('Customers', '+ Add Customer')).click();
    // NOTE: the application reuses the vendor form heading on this screen.
    await expect(page.getByRole('heading', { name: /Add .*Details/i })).toBeVisible();

    await page.locator(xp('AddCustomer', 'Customer Name:')).fill(customerName);
    await page.locator(xp('AddCustomer', 'Contact :')).fill('9123456780');

    // Edge: AddCustomer -> AddCustomerSuccess (ON_CLICK "Submit")
    await page.locator(xp('AddCustomer', 'Submit')).click();

    await expect(page.getByText(/Added Success/i)).toBeVisible();
    await expect(page.locator(xp('AddCustomerSuccess', 'Search'))).toBeVisible();
    await expect(page.getByRole('cell', { name: customerName })).toBeVisible();
  });

  test('Scenario 20 - Editing the first customer shows an "Edited Success" confirmation', async ({ page }) => {
    const suffix = uniqueSuffix();
    const updatedName = `Updated_Customer_${suffix}`;

    // Edge: Customers -> EditCustomer (ON_CLICK "Edit")
    await page.locator(xp('Customers', 'Edit')).click();
    await expect(page.getByRole('heading', { name: /Edit customer Details/i })).toBeVisible();

    await page.locator(xp('EditCustomer', 'customer Name:')).fill(updatedName);

    // Edge: EditCustomer -> EditCustomerSuccess (ON_CLICK "Submit")
    await page.locator(xp('EditCustomer', 'Submit')).click();

    await expect(page.getByText(/Edited Success/i)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Customer' })).toBeVisible();
    await expect(page.getByRole('cell', { name: updatedName })).toBeVisible();
    await expect(page.locator(xp('EditCustomerSuccess', 'Search'))).toBeVisible();
  });

  test('Scenario 21 - Deleting the first customer shows a "Deleted" confirmation', async ({ page }) => {
    page.on('dialog', (dialog) => dialog.accept());

    // Edge: Customers -> DeleteCustomerSuccess (ON_CLICK "Delete")
    await page.locator(xp('Customers', 'Delete')).click();

    await expect(page.getByText(/Deleted/i)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Customer' })).toBeVisible();
    await expect(page.locator(xp('DeleteCustomerSuccess', 'Search'))).toBeVisible();
  });

  test('Scenario 22 - Selling a product to the first customer generates an invoice', async ({ context, page }) => {
    // Edge: Customers -> SellProduct (ON_CLICK "Sell")
    await page.locator(xp('Customers', 'Sell')).click();
    await expect(page.getByRole('heading', { name: 'Sell Product' })).toBeVisible();

    // Select the first product in the list and set a quantity to sell.
    await page.locator(xp('SellProduct', 'Product')).check();
    await page.locator(xp('SellProduct', 'Quantity')).fill('1');

    // Payment status defaults to "Pending".
    await expect(page.locator(xp('SellProduct', 'Pending'))).toBeChecked();

    // Edge: SellProduct -> SellSuccess (ON_CLICK "Submit").
    // The invoice may open in a new browser tab.
    const [billPage] = await Promise.all([
      context.waitForEvent('page', { timeout: 5000 }).catch(() => null),
      page.locator(xp('SellProduct', 'Submit')).click(),
    ]);

    const target = billPage || page;
    await target.waitForLoadState();

    await expect(target.getByText(/Thank you/i)).toBeVisible();
    await expect(target.getByText(/GRAND TOTAL/i)).toBeVisible();
    await expect(target.getByText(/Order No/i)).toBeVisible();
  });

});
