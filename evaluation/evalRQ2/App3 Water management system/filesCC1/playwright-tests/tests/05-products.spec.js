// tests/05-products.spec.js
//
// Scenarios 23-27
// Covers the Product screen and its child screens (search results, add,
// edit, delete).
//
// NOTE: "Products -> AddProduct" and "Products -> EditProduct" are
// explicit edges in navigation_graph.json. The "Delete" action and the
// "Go"/"Back" search flow are not represented as edges in
// navigation_graph.json, but the corresponding UI elements and
// destination screens (DeleteProductSuccess, ProductsSearchResults) are
// present in xpath_mapping.json and visible in the screenshots, so they
// are covered here as well.
//
// These scenarios mutate the Product list (add/edit/delete on the first
// row) and are written to run in order (workers: 1,
// fullyParallel: false) against a disposable/test database.

const { test, expect } = require('@playwright/test');
const { xp } = require('../utils/xpaths');
const { login } = require('../utils/auth');
const { uniqueSuffix } = require('../utils/testData');

test.describe('Product management', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.locator(xp('Dashboard', 'Products')).click();
    await expect(page.getByRole('heading', { name: 'Product' })).toBeVisible();
  });

  test('Scenario 23 - Searching for an existing product returns matching results', async ({ page }) => {
    await page.locator(xp('Products', 'Search')).fill('www');

    // Edge: Products -> ProductsSearchResults (ON_CLICK "Go")
    await page.locator(xp('Products', 'Go')).click();

    await expect(page.locator(xp('ProductsSearchResults', 'Back'))).toBeVisible();
    await expect(page.getByRole('cell', { name: 'www', exact: true }).first()).toBeVisible();
  });

  test('Scenario 24 - "Back" button on product search results returns to the full Product list', async ({ page }) => {
    await page.locator(xp('Products', 'Search')).fill('www');
    await page.locator(xp('Products', 'Go')).click();
    await expect(page.locator(xp('ProductsSearchResults', 'Back'))).toBeVisible();

    // Edge: ProductsSearchResults -> Products (ON_CLICK "Back")
    await page.locator(xp('ProductsSearchResults', 'Back')).click();

    await expect(page.getByRole('heading', { name: 'Product' })).toBeVisible();
    await expect(page.locator(xp('Products', '+ Add product'))).toBeVisible();
  });

  test('Scenario 25 - Adding a new product shows an "Added Success" confirmation', async ({ page }) => {
    const suffix = uniqueSuffix();
    const productName = `Product_${suffix}`;

    // Edge: Products -> AddProduct (ON_CLICK "+ Add product")
    await page.locator(xp('Products', '+ Add product')).click();
    await expect(page.getByRole('heading', { name: 'Add Products Details' })).toBeVisible();

    await page.locator(xp('AddProduct', 'Product Category:')).fill(`Category_${suffix}`);
    await page.locator(xp('AddProduct', 'Product Name:')).fill(productName);
    await page.locator(xp('AddProduct', 'Product Price:')).fill('50');
    await page.locator(xp('AddProduct', 'Product Stock:')).fill('25');

    // Edge: AddProduct -> AddProductSuccess (ON_CLICK "Submit")
    await page.locator(xp('AddProduct', 'Submit')).click();

    await expect(page.getByText(/Added Success/i)).toBeVisible();
    await expect(page.locator(xp('AddProductSuccess', 'Search'))).toBeVisible();
    await expect(page.getByRole('cell', { name: productName })).toBeVisible();
  });

  test('Scenario 26 - Editing the first product shows an "Edited Success" confirmation', async ({ page }) => {
    // Edge: Products -> EditProduct (ON_CLICK "Edit")
    await page.locator(xp('Products', 'Edit')).click();
    await expect(page.getByRole('heading', { name: 'Edit product Details' })).toBeVisible();

    await page.locator(xp('EditProduct', 'Product Price:')).fill('25');

    // Edge: EditProduct -> EditProductSuccess (ON_CLICK "Submit")
    await page.locator(xp('EditProduct', 'Submit')).click();

    await expect(page.getByText(/Edited Success/i)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Product' })).toBeVisible();
    await expect(page.locator(xp('EditProductSuccess', 'Search'))).toBeVisible();
  });

  test('Scenario 27 - Deleting the first product shows a "Deleted" confirmation', async ({ page }) => {
    page.on('dialog', (dialog) => dialog.accept());

    // "Delete" action for Products (from xpath_mapping.json / screenshots,
    // not present as an edge in navigation_graph.json).
    await page.locator(xp('Products', 'Delete')).click();

    await expect(page.getByText(/Deleted/i)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Product' })).toBeVisible();
    await expect(page.locator(xp('DeleteProductSuccess', 'Search'))).toBeVisible();
  });

});
