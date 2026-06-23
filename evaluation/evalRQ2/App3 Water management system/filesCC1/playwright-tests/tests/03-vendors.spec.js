// tests/03-vendors.spec.js
//
// Scenarios 11-16
// Covers the Vendors screen and its child screens (search results, add,
// edit, delete, buy), matching the "Vendors -> ..." edges from
// navigation_graph.json.
//
// NOTE: these scenarios mutate the Vendors list (add/edit/delete/buy on
// the first row). They are written to run in order (workers: 1,
// fullyParallel: false) against a disposable/test database.

const { test, expect } = require('@playwright/test');
const { xp } = require('../utils/xpaths');
const { login } = require('../utils/auth');
const { uniqueSuffix } = require('../utils/testData');

test.describe('Vendors management', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.locator(xp('Dashboard', 'Vendors')).click();
    await expect(page.getByRole('heading', { name: 'Vendors' })).toBeVisible();
  });

  test('Scenario 11 - Searching for an existing vendor returns matching results', async ({ page }) => {
    await page.locator(xp('Vendors', 'Search')).fill('John');

    // Edge: Vendors -> VendorsSearchResults (ON_CLICK "Go")
    await page.locator(xp('Vendors', 'Go')).click();

    await expect(page.locator(xp('VendorsSearchResults', 'Back'))).toBeVisible();
    await expect(page.getByRole('cell', { name: 'John' })).toBeVisible();
  });

  test('Scenario 12 - "Back" button on vendor search results returns to the full Vendors list', async ({ page }) => {
    await page.locator(xp('Vendors', 'Search')).fill('John');
    await page.locator(xp('Vendors', 'Go')).click();
    await expect(page.locator(xp('VendorsSearchResults', 'Back'))).toBeVisible();

    // Edge: VendorsSearchResults -> Vendors (ON_CLICK "Back")
    await page.locator(xp('VendorsSearchResults', 'Back')).click();

    await expect(page.getByRole('heading', { name: 'Vendors' })).toBeVisible();
    await expect(page.locator(xp('Vendors', '+ Add Vendors'))).toBeVisible();
  });

  test('Scenario 13 - Adding a new vendor shows an "Added Success" confirmation', async ({ page }) => {
    const suffix = uniqueSuffix();
    const vendorName = `Vendor_${suffix}`;

    // Edge: Vendors -> AddVendor (ON_CLICK "+ Add Vendors")
    await page.locator(xp('Vendors', '+ Add Vendors')).click();
    await expect(page.getByRole('heading', { name: 'Add Vendor Details' })).toBeVisible();

    await page.locator(xp('AddVendor', 'Vendor Name:')).fill(vendorName);
    await page.locator(xp('AddVendor', 'Contact :')).fill('9876543210');
    await page.locator(xp('AddVendor', 'Product')).selectOption({ index: 1 });
    await page.locator(xp('AddVendor', 'Quantity :')).fill('10');
    await page.locator(xp('AddVendor', 'Price:')).fill('100');

    // Edge: AddVendor -> AddVendorSuccess (ON_CLICK "Submit")
    await page.locator(xp('AddVendor', 'Submit')).click();

    await expect(page.getByText(/Added Success/i)).toBeVisible();
    await expect(page.locator(xp('AddVendorSuccess', 'Search'))).toBeVisible();
    await expect(page.getByRole('cell', { name: vendorName })).toBeVisible();
  });

  test('Scenario 14 - Editing the first vendor shows an "Edited Success" confirmation', async ({ page }) => {
    // Edge: Vendors -> EditVendor (ON_CLICK "Edit")
    await page.locator(xp('Vendors', 'Edit')).click();
    await expect(page.getByRole('heading', { name: 'Edit Vendor Details' })).toBeVisible();

    await page.locator(xp('EditVendor', 'Price')).fill('199');

    // Edge: EditVendor -> EditVendorSuccess (ON_CLICK "Submit")
    await page.locator(xp('EditVendor', 'Submit')).click();

    await expect(page.getByText(/Edited Success/i)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Vendors' })).toBeVisible();
    await expect(page.locator(xp('EditVendorSuccess', 'Search'))).toBeVisible();
  });

  test('Scenario 15 - Deleting the first vendor shows a "Deleted" confirmation', async ({ page }) => {
    page.on('dialog', (dialog) => dialog.accept());

    // Edge: Vendors -> DeleteVendorSuccess (ON_CLICK "Delete")
    await page.locator(xp('Vendors', 'Delete')).click();

    await expect(page.getByText(/Deleted/i)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Vendors' })).toBeVisible();
    await expect(page.locator(xp('DeleteVendorSuccess', 'Search'))).toBeVisible();
  });

  test('Scenario 16 - Buying from a vendor goes through the Confirm Buy screen', async ({ page }) => {
    // Edge: Vendors -> ConfirmBuy (ON_CLICK "Buy")
    await page.locator(xp('Vendors', 'Buy')).click();

    await expect(page.getByRole('heading', { name: /Confirm Buy/i })).toBeVisible();
    await expect(page.getByText('Vendor Name:')).toBeVisible();
    await expect(page.getByText('Product Catgory')).toBeVisible();

    // Edge: ConfirmBuy -> BuySuccess (ON_CLICK "Buy")
    await page.locator(xp('ConfirmBuy', 'Buy')).click();

    await expect(page.getByText(/Success/i)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Vendors' })).toBeVisible();
    await expect(page.locator(xp('BuySuccess', 'Search'))).toBeVisible();
  });

});
