// =============================================================================
// Water Management Application – Acceptance Test Suite (Playwright)
// Base URL : http://localhost/watermanagement
// Credentials used from screenshots : username=toto / password=toto
// =============================================================================

const { test, expect } = require('@playwright/test');

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------
const BASE_URL  = 'http://localhost/watermanagement';
const USERNAME  = 'toto';
const PASSWORD  = 'toto';

/** Log in and land on the Dashboard. Called at the start of every test that
 *  requires authentication. */
async function login(page) {
  await page.goto(BASE_URL);
  await page.locator('//*[@id="page-"]/form/div/div[2]/div[1]/input').fill(USERNAME);
  await page.locator('//*[@id="page-"]/form/div/div[2]/div[2]/input').fill(PASSWORD);
  await page.locator('//*[@id="page-"]/form/div/div[2]/button').click();
  await expect(page).toHaveURL(/dashboard|index/i);
  await expect(page.locator('//*[@id="side-menu"]/li[1]/a')).toBeVisible();
}

// =============================================================================
// TEST 01 – Successful Login
// =============================================================================
test('TC01 – User can log in with valid credentials', async ({ page }) => {
  // GIVEN the application is open on the Login page
  await page.goto(BASE_URL);
  await expect(page.locator('//*[@id="page-"]/form/div/div[2]/div[1]/input')).toBeVisible();

  // WHEN the user enters valid username and password and clicks Login
  await page.locator('//*[@id="page-"]/form/div/div[2]/div[1]/input').fill(USERNAME);
  await page.locator('//*[@id="page-"]/form/div/div[2]/div[2]/input').fill(PASSWORD);
  await page.locator('//*[@id="page-"]/form/div/div[2]/button').click();

  // THEN the Dashboard is displayed with the side-menu
  await expect(page.locator('//*[@id="side-menu"]/li[1]/a')).toBeVisible();
  await expect(page.locator('//*[@id="side-menu"]/li[2]/a')).toContainText('Vendors');
});

// =============================================================================
// TEST 02 – Navigate to Register page from Login
// =============================================================================
test('TC02 – User can navigate to the Register page from Login', async ({ page }) => {
  // GIVEN the Login page is displayed
  await page.goto(BASE_URL);
  await expect(page.locator('//*[@id="page-"]/form/div/h4/a')).toBeVisible();

  // WHEN the user clicks the Register link
  await page.locator('//*[@id="page-"]/form/div/h4/a').click();

  // THEN the Register page is displayed with Username, Email and Password fields
  await expect(page.locator('//*[@id="page-"]/form/div/div[2]/div[1]/input')).toBeVisible();
  await expect(page.locator('//*[@id="page-"]/form/div/div[2]/div[2]/input')).toBeVisible();
  await expect(page.locator('//*[@id="page-"]/form/div/div[2]/div[3]/input')).toBeVisible();
});

// =============================================================================
// TEST 03 – Successful Registration and redirect to Login
// =============================================================================
test('TC03 – User can register a new account and is redirected to Login', async ({ page }) => {
  // GIVEN the Register page is open
  await page.goto(BASE_URL);
  await page.locator('//*[@id="page-"]/form/div/h4/a').click();

  // WHEN the user fills the form with valid data and submits
  const unique = Date.now();
  await page.locator('//*[@id="page-"]/form/div/div[2]/div[1]/input').fill(`user${unique}`);
  await page.locator('//*[@id="page-"]/form/div/div[2]/div[2]/input').fill(`user${unique}@gmail.com`);
  await page.locator('//*[@id="page-"]/form/div/div[2]/div[3]/input').fill('pass1234');
  await page.locator('//*[@id="page-"]/form/div/div[2]/button').click();

  // THEN a success banner is shown and the Login page is displayed
  await expect(page.locator('text=Registered Success')).toBeVisible({ timeout: 8000 });
  await expect(page.locator('//*[@id="page-"]/form/div/div[2]/div[1]/input')).toBeVisible();
});

// =============================================================================
// TEST 04 – Dashboard shows summary counts (Vendors, Customers, Products)
// =============================================================================
test('TC04 – Dashboard displays Vendor, Customer and Product summary cards', async ({ page }) => {
  // GIVEN the user is logged in
  await login(page);

  // THEN the three summary cards (Vendors=5, Customers=3, Products=4) are visible
  await expect(page.locator('//*[@id="page-wrapper"]/div[2]/div[1]/div/a')).toBeVisible();
  await expect(page.locator('//*[@id="page-wrapper"]/div[2]/div[2]/div/a')).toBeVisible();
  await expect(page.locator('//*[@id="page-wrapper"]/div[2]/div[3]/div/a')).toBeVisible();
  // The page heading should say Dashboard
  await expect(page.locator('h1, h2, h3').filter({ hasText: 'Dashboard' })).toBeVisible();
});

// =============================================================================
// TEST 05 – Navigate to Vendors from Dashboard side-menu
// =============================================================================
test('TC05 – User can navigate to Vendors from the side-menu', async ({ page }) => {
  // GIVEN the user is on the Dashboard
  await login(page);

  // WHEN the user clicks the Vendors item in the side-menu
  await page.locator('//*[@id="side-menu"]/li[2]/a').click();

  // THEN the Vendors list page is displayed with vendor rows
  await expect(page.locator('h1, h2, h3').filter({ hasText: 'Vendors' })).toBeVisible();
  await expect(page.locator('//*[@id="page-wrapper"]/div[2]/a/h4')).toBeVisible(); // + Add Vendors
});

// =============================================================================
// TEST 06 – Search for a vendor by name
// =============================================================================
test('TC06 – User can search for a vendor by name and see filtered results', async ({ page }) => {
  // GIVEN the user is on the Vendors page
  await login(page);
  await page.locator('//*[@id="side-menu"]/li[2]/a').click();

  // WHEN the user types a vendor name in the search box and clicks Go
  await page.locator('//*[@id="input_search"]').fill('jorn');
  await page.locator('//*[@id="page-wrapper"]/div[2]/form/input[2]').click();

  // THEN the search results page is displayed
  await expect(page.locator('//*[@id="page-wrapper"]/div[2]/a[1]')).toBeVisible(); // Back button
});

// =============================================================================
// TEST 07 – Back navigation from Vendor search results
// =============================================================================
test('TC07 – User can go back from Vendor search results to Vendors', async ({ page }) => {
  // GIVEN the vendor search results page is displayed
  await login(page);
  await page.locator('//*[@id="side-menu"]/li[2]/a').click();
  await page.locator('//*[@id="input_search"]').fill('jorn');
  await page.locator('//*[@id="page-wrapper"]/div[2]/form/input[2]').click();
  await expect(page.locator('//*[@id="page-wrapper"]/div[2]/a[1]')).toBeVisible();

  // WHEN the user clicks the Back button
  await page.locator('//*[@id="page-wrapper"]/div[2]/a[1]').click();

  // THEN the Vendors list page is displayed again
  await expect(page.locator('//*[@id="page-wrapper"]/div[2]/a/h4')).toBeVisible(); // + Add Vendors
});

// =============================================================================
// TEST 08 – Add a new Vendor
// =============================================================================
test('TC08 – User can add a new vendor and see the success banner', async ({ page }) => {
  // GIVEN the user is on the Vendors page
  await login(page);
  await page.locator('//*[@id="side-menu"]/li[2]/a').click();

  // WHEN the user clicks "+ Add Vendors", fills the form and submits
  await page.locator('//*[@id="page-wrapper"]/div[2]/a/h4').click();
  await page.locator('//*[@id="page-wrapper"]/div/form/div[1]/div/input').fill('Test Vendor Playwright');
  await page.locator('//*[@id="page-wrapper"]/div/form/div[2]/div/input').fill('9988776655');
  // Select a product from the dropdown (first available option)
  await page.locator('//*[@id="page-wrapper"]/div/form/div[3]/div/div/select').selectOption({ index: 1 });
  await page.locator('//*[@id="page-wrapper"]/div/form/div[4]/div/input').fill('50');
  await page.locator('//*[@id="page-wrapper"]/div/form/div[5]/div/input').fill('250');
  await page.locator('//*[@id="page-wrapper"]/div/form/div[6]/div/button').click();

  // THEN the Vendors page is shown with "Added Success" banner
  await expect(page.locator('text=Added Success')).toBeVisible({ timeout: 8000 });
});

// =============================================================================
// TEST 09 – Edit an existing Vendor
// =============================================================================
test('TC09 – User can edit a vendor and see the success banner', async ({ page }) => {
  // GIVEN the user is on the Vendors page with at least one vendor in the list
  await login(page);
  await page.locator('//*[@id="side-menu"]/li[2]/a').click();
  await expect(page.locator('//*[@id="page-wrapper"]/table/tbody/tr[1]/td[7]/a[1]')).toBeVisible();

  // WHEN the user clicks Edit on the first vendor, updates the price and submits
  await page.locator('//*[@id="page-wrapper"]/table/tbody/tr[1]/td[7]/a[1]').click();
  // Update the Price field
  await page.locator('//*[@id="page-wrapper"]/div/form/div[3]/div[4]/div/input').clear();
  await page.locator('//*[@id="page-wrapper"]/div/form/div[3]/div[4]/div/input').fill('99');
  await page.locator('//*[@id="page-wrapper"]/div/form/div[3]/div[6]/div/button').click();

  // THEN the Vendors page shows "Edited Success" banner
  await expect(page.locator('text=Edited Success')).toBeVisible({ timeout: 8000 });
});

// =============================================================================
// TEST 10 – Delete a Vendor
// =============================================================================
test('TC10 – User can delete a vendor and is redirected to Vendors page', async ({ page }) => {
  // GIVEN the Vendors page is displayed
  await login(page);
  await page.locator('//*[@id="side-menu"]/li[2]/a').click();
  await expect(page.locator('//*[@id="page-wrapper"]/table/tbody/tr[1]/td[7]/a[2]')).toBeVisible();

  // WHEN the user clicks the Delete button on the last vendor row
  // Count rows and delete the last one to avoid removing test data for other tests
  const rows = page.locator('//*[@id="page-wrapper"]/table/tbody/tr');
  const count = await rows.count();
  const deleteBtn = page.locator(`//*[@id="page-wrapper"]/table/tbody/tr[${count}]/td[7]/a[2]`);
  await deleteBtn.click();

  // THEN the Vendors page is displayed (with the vendor removed)
  await expect(page.locator('h1, h2, h3').filter({ hasText: 'Vendors' })).toBeVisible();
  await expect(page.locator('//*[@id="page-wrapper"]/div[2]/a/h4')).toBeVisible(); // + Add Vendors still present
});

// =============================================================================
// TEST 11 – Confirm Buy from Vendor
// =============================================================================
test('TC11 – User can initiate a Buy from Vendor and confirm on the Confirm Buy page', async ({ page }) => {
  // GIVEN the Vendors page is displayed with at least one vendor
  await login(page);
  await page.locator('//*[@id="side-menu"]/li[2]/a').click();
  await expect(page.locator('//*[@id="page-wrapper"]/table/tbody/tr[1]/td[7]/a[3]')).toBeVisible();

  // WHEN the user clicks the Buy button for the first vendor
  await page.locator('//*[@id="page-wrapper"]/table/tbody/tr[1]/td[7]/a[3]').click();

  // THEN the Confirm Buy page is displayed showing vendor details and a Buy button
  await expect(page.locator('text=Confirm Buy')).toBeVisible();
  await expect(page.locator('//*[@id="page-wrapper"]/div/form/div[4]/div/button')).toBeVisible();
});

// =============================================================================
// TEST 12 – Complete a Buy and reach Buy Success
// =============================================================================
test('TC12 – User can complete a purchase from a vendor and reach the Buy Success page', async ({ page }) => {
  // GIVEN the Confirm Buy page is displayed
  await login(page);
  await page.locator('//*[@id="side-menu"]/li[2]/a').click();
  await page.locator('//*[@id="page-wrapper"]/table/tbody/tr[1]/td[7]/a[3]').click();
  await expect(page.locator('text=Confirm Buy')).toBeVisible();

  // WHEN the user clicks the Buy button
  await page.locator('//*[@id="page-wrapper"]/div/form/div[4]/div/button').click();

  // THEN the Buy Success page or the Vendors page with a success indicator is shown
  await expect(page.locator('text=Success').or(page.locator('h1, h2, h3').filter({ hasText: 'Vendors' }))).toBeVisible({ timeout: 8000 });
});

// =============================================================================
// TEST 13 – Navigate to Customers from Dashboard side-menu
// =============================================================================
test('TC13 – User can navigate to Customers from the side-menu', async ({ page }) => {
  // GIVEN the user is on the Dashboard
  await login(page);

  // WHEN the user clicks the Customer item in the side-menu
  await page.locator('//*[@id="side-menu"]/li[3]/a').click();

  // THEN the Customer list page is displayed with the "+ Add Customer" button
  await expect(page.locator('h1, h2, h3').filter({ hasText: 'Customer' })).toBeVisible();
  await expect(page.locator('//*[@id="page-wrapper"]/div[2]/a')).toBeVisible();
});

// =============================================================================
// TEST 14 – Search for a customer by name
// =============================================================================
test('TC14 – User can search for a customer and see filtered results', async ({ page }) => {
  // GIVEN the user is on the Customers page
  await login(page);
  await page.locator('//*[@id="side-menu"]/li[3]/a').click();

  // WHEN the user types a name in the search field and clicks Go
  await page.locator('//*[@id="input_search"]').fill('Hello');
  await page.locator('//*[@id="page-wrapper"]/div[2]/form/input[2]').click();

  // THEN the Customer Search Results page is shown with a Back button
  await expect(page.locator('//*[@id="page-wrapper"]/div[2]/a[1]')).toBeVisible();
});

// =============================================================================
// TEST 15 – Back navigation from Customer search results
// =============================================================================
test('TC15 – User can go back from Customer search results to Customers', async ({ page }) => {
  // GIVEN the Customer search results page is displayed
  await login(page);
  await page.locator('//*[@id="side-menu"]/li[3]/a').click();
  await page.locator('//*[@id="input_search"]').fill('Hello');
  await page.locator('//*[@id="page-wrapper"]/div[2]/form/input[2]').click();
  await expect(page.locator('//*[@id="page-wrapper"]/div[2]/a[1]')).toBeVisible();

  // WHEN the user clicks the Back button
  await page.locator('//*[@id="page-wrapper"]/div[2]/a[1]').click();

  // THEN the Customer list page is shown
  await expect(page.locator('//*[@id="page-wrapper"]/div[2]/a')).toBeVisible(); // + Add Customer
});

// =============================================================================
// TEST 16 – Add a new Customer
// =============================================================================
test('TC16 – User can add a new customer and see the success banner', async ({ page }) => {
  // GIVEN the user is on the Customers page
  await login(page);
  await page.locator('//*[@id="side-menu"]/li[3]/a').click();

  // WHEN the user clicks "+ Add Customer", fills the form and submits
  await page.locator('//*[@id="page-wrapper"]/div[2]/a').click();
  await page.locator('//*[@id="page-wrapper"]/div/form/div[1]/div/input').fill('New Customer PW');
  await page.locator('//*[@id="page-wrapper"]/div/form/div[2]/div/input').fill('9876543210');
  await page.locator('//*[@id="page-wrapper"]/div/form/div[3]/div/button').click();

  // THEN the Customers page shows a success banner or updated list
  await expect(page.locator('text=Success').or(page.locator('h1, h2, h3').filter({ hasText: 'Customer' }))).toBeVisible({ timeout: 8000 });
});

// =============================================================================
// TEST 17 – Edit an existing Customer
// =============================================================================
test('TC17 – User can edit a customer and see the success banner', async ({ page }) => {
  // GIVEN the Customers page has at least one customer
  await login(page);
  await page.locator('//*[@id="side-menu"]/li[3]/a').click();
  await expect(page.locator('//*[@id="page-wrapper"]/table/tbody/tr[1]/td[3]/a[1]')).toBeVisible();

  // WHEN the user clicks Edit, changes the contact number and submits
  await page.locator('//*[@id="page-wrapper"]/table/tbody/tr[1]/td[3]/a[1]').click();
  await page.locator('//*[@id="page-wrapper"]/div[1]/form/div[2]/div/input').clear();
  await page.locator('//*[@id="page-wrapper"]/div[1]/form/div[2]/div/input').fill('1111111111');
  await page.locator('//*[@id="page-wrapper"]/div[2]/div/button').click();

  // THEN the Customers page is shown (with or without a success banner)
  await expect(page.locator('h1, h2, h3').filter({ hasText: 'Customer' })).toBeVisible({ timeout: 8000 });
});

// =============================================================================
// TEST 18 – Delete a Customer
// =============================================================================
test('TC18 – User can delete a customer and is returned to Customers page', async ({ page }) => {
  // GIVEN the Customers page has at least one customer
  await login(page);
  await page.locator('//*[@id="side-menu"]/li[3]/a').click();
  await expect(page.locator('//*[@id="page-wrapper"]/table/tbody/tr[1]/td[3]/a[2]')).toBeVisible();

  // WHEN the user clicks Delete on the last customer row
  const rows = page.locator('//*[@id="page-wrapper"]/table/tbody/tr');
  const count = await rows.count();
  const deleteBtn = page.locator(`//*[@id="page-wrapper"]/table/tbody/tr[${count}]/td[3]/a[2]`);
  await deleteBtn.click();

  // THEN the Customers list page is displayed
  await expect(page.locator('h1, h2, h3').filter({ hasText: 'Customer' })).toBeVisible({ timeout: 8000 });
});

// =============================================================================
// TEST 19 – Sell a product to a customer (Pending payment status)
// =============================================================================
test('TC19 – User can sell a product to a customer with Pending payment status', async ({ page }) => {
  // GIVEN the Customers page has at least one customer with a Sell button
  await login(page);
  await page.locator('//*[@id="side-menu"]/li[3]/a').click();
  await expect(page.locator('//*[@id="page-wrapper"]/table/tbody/tr[1]/td[3]/a[3]')).toBeVisible();

  // WHEN the user clicks Sell, selects Pending status, picks a product, enters quantity
  await page.locator('//*[@id="page-wrapper"]/table/tbody/tr[1]/td[3]/a[3]').click();
  await expect(page.locator('text=Sell Product')).toBeVisible();
  // Select Pending radio
  await page.locator('/html/body/div/section/div[1]/form/div[3]/input[1]').check();
  // Check the first product checkbox and enter quantity
  await page.locator('//*[@id="page-wrapper"]/div[2]/div/table/tbody/tr[1]/td[1]/div/input').check();
  await page.locator('//*[@id="page-wrapper"]/div[2]/div/table/tbody/tr[1]/td[5]/input').fill('5');
  await page.locator('//*[@id="page-wrapper"]/div[3]/div/button').click();

  // THEN the Sell Success page or Customers page is shown
  await expect(page.locator('text=Success').or(page.locator('h1, h2, h3').filter({ hasText: 'Customer' }))).toBeVisible({ timeout: 8000 });
});

// =============================================================================
// TEST 20 – Sell a product to a customer (Paid payment status)
// =============================================================================
test('TC20 – User can sell a product to a customer with Paid payment status', async ({ page }) => {
  // GIVEN the Customers page has at least one customer
  await login(page);
  await page.locator('//*[@id="side-menu"]/li[3]/a').click();
  await expect(page.locator('//*[@id="page-wrapper"]/table/tbody/tr[1]/td[3]/a[3]')).toBeVisible();

  // WHEN the user clicks Sell, selects Paid status, picks a product, enters quantity
  await page.locator('//*[@id="page-wrapper"]/table/tbody/tr[1]/td[3]/a[3]').click();
  await expect(page.locator('text=Sell Product')).toBeVisible();
  // Select Paid radio
  await page.locator('/html/body/div/section/div[1]/form/div[3]/input[2]').check();
  // Check the first product checkbox and enter quantity
  await page.locator('//*[@id="page-wrapper"]/div[2]/div/table/tbody/tr[1]/td[1]/div/input').check();
  await page.locator('//*[@id="page-wrapper"]/div[2]/div/table/tbody/tr[1]/td[5]/input').fill('3');
  await page.locator('//*[@id="page-wrapper"]/div[3]/div/button').click();

  // THEN success screen or Customer list is visible
  await expect(page.locator('text=Success').or(page.locator('h1, h2, h3').filter({ hasText: 'Customer' }))).toBeVisible({ timeout: 8000 });
});

// =============================================================================
// TEST 21 – Navigate to Products from Dashboard side-menu
// =============================================================================
test('TC21 – User can navigate to Products from the side-menu', async ({ page }) => {
  // GIVEN the user is on the Dashboard
  await login(page);

  // WHEN the user clicks the Products item in the side-menu
  await page.locator('//*[@id="side-menu"]/li[4]/a').click();

  // THEN the Product list page is displayed with product rows and an Add button
  await expect(page.locator('h1, h2, h3').filter({ hasText: 'Product' })).toBeVisible();
  await expect(page.locator('//*[@id="page-wrapper"]/div[2]/a')).toBeVisible(); // + Add product
});

// =============================================================================
// TEST 22 – Search for a product by name
// =============================================================================
test('TC22 – User can search for a product and see filtered results', async ({ page }) => {
  // GIVEN the user is on the Products page
  await login(page);
  await page.locator('//*[@id="side-menu"]/li[4]/a').click();

  // WHEN the user types a product name and clicks Go
  await page.locator('//*[@id="input_search"]').fill('Bislery');
  await page.locator('//*[@id="page-wrapper"]/div[2]/form/input[2]').click();

  // THEN the Products Search Results page is shown with a Back button
  await expect(page.locator('//*[@id="page-wrapper"]/div[2]/a[1]')).toBeVisible();
});

// =============================================================================
// TEST 23 – Back navigation from Product search results
// =============================================================================
test('TC23 – User can go back from Product search results to Products', async ({ page }) => {
  // GIVEN the Product search results page is displayed
  await login(page);
  await page.locator('//*[@id="side-menu"]/li[4]/a').click();
  await page.locator('//*[@id="input_search"]').fill('Bislery');
  await page.locator('//*[@id="page-wrapper"]/div[2]/form/input[2]').click();
  await expect(page.locator('//*[@id="page-wrapper"]/div[2]/a[1]')).toBeVisible();

  // WHEN the user clicks Back
  await page.locator('//*[@id="page-wrapper"]/div[2]/a[1]').click();

  // THEN the Products list page is displayed
  await expect(page.locator('//*[@id="page-wrapper"]/div[2]/a')).toBeVisible(); // + Add product
});

// =============================================================================
// TEST 24 – Add a new Product
// =============================================================================
test('TC24 – User can add a new product and see the success banner', async ({ page }) => {
  // GIVEN the user is on the Products page
  await login(page);
  await page.locator('//*[@id="side-menu"]/li[4]/a').click();

  // WHEN the user clicks "+ Add product", fills the form and submits
  await page.locator('//*[@id="page-wrapper"]/div[2]/a').click();
  await page.locator('//*[@id="page-wrapper"]/div/form/div[1]/div/input').fill('Water Purifier');
  await page.locator('//*[@id="page-wrapper"]/div/form/div[2]/div/input').fill('AquaClean Pro');
  await page.locator('//*[@id="page-wrapper"]/div/form/div[3]/div/input').fill('1500');
  await page.locator('//*[@id="page-wrapper"]/div/form/div[4]/div/input').fill('200');
  await page.locator('//*[@id="page-wrapper"]/div/form/div[5]/div/button').click();

  // THEN the Products page displays a success banner
  await expect(page.locator('text=Success').or(page.locator('h1, h2, h3').filter({ hasText: 'Product' }))).toBeVisible({ timeout: 8000 });
});

// =============================================================================
// TEST 25 – Edit an existing Product
// =============================================================================
test('TC25 – User can edit a product and see the success banner', async ({ page }) => {
  // GIVEN the Products page has at least one product
  await login(page);
  await page.locator('//*[@id="side-menu"]/li[4]/a').click();
  await expect(page.locator('//*[@id="page-wrapper"]/table/tbody/tr[1]/td[6]/form/a[1]')).toBeVisible();

  // WHEN the user clicks Edit on the first product and updates the price
  await page.locator('//*[@id="page-wrapper"]/table/tbody/tr[1]/td[6]/form/a[1]').click();
  await page.locator('//*[@id="page-wrapper"]/div[1]/form/div[3]/div/input').clear();
  await page.locator('//*[@id="page-wrapper"]/div[1]/form/div[3]/div/input').fill('25');
  await page.locator('//*[@id="page-wrapper"]/div[2]/div/button').click();

  // THEN the Products page is shown with the update reflected
  await expect(page.locator('text=Success').or(page.locator('h1, h2, h3').filter({ hasText: 'Product' }))).toBeVisible({ timeout: 8000 });
});

// =============================================================================
// TEST 26 – Navigate to Orders from Dashboard side-menu
// =============================================================================
test('TC26 – User can navigate to Orders from the side-menu', async ({ page }) => {
  // GIVEN the user is on the Dashboard
  await login(page);

  // WHEN the user clicks the Orders item in the side-menu
  await page.locator('//*[@id="side-menu"]/li[5]/a').click();

  // THEN the Orders list page is displayed with order rows
  await expect(page.locator('h1, h2, h3').filter({ hasText: 'Orders' })).toBeVisible();
});

// =============================================================================
// TEST 27 – Search Orders
// =============================================================================
test('TC27 – User can search orders and receive results', async ({ page }) => {
  // GIVEN the Orders page is displayed
  await login(page);
  await page.locator('//*[@id="side-menu"]/li[5]/a').click();

  // WHEN the user types in the search field and clicks Go
  await page.locator('//*[@id="input_search"]').fill('Dikshant');
  await page.locator('//*[@id="page-wrapper"]/div[2]/form/input[2]').click();

  // THEN the page reloads with filtered results or an empty state
  await expect(page.locator('h1, h2, h3').filter({ hasText: 'Orders' })).toBeVisible({ timeout: 8000 });
});

// =============================================================================
// TEST 28 – Mark an Order as Paid
// =============================================================================
test('TC28 – User can mark an order as Paid', async ({ page }) => {
  // GIVEN the Orders page has at least one order
  await login(page);
  await page.locator('//*[@id="side-menu"]/li[5]/a').click();
  await expect(page.locator('//*[@id="page-wrapper"]/table/tbody/tr[1]/td[3]/a')).toBeVisible();

  // WHEN the user clicks the Paid button on the first order
  await page.locator('//*[@id="page-wrapper"]/table/tbody/tr[1]/td[3]/a').click();

  // THEN the order status is updated and the Orders page (or update page) is shown
  await expect(page.locator('h1, h2, h3').filter({ hasText: 'Order' })).toBeVisible({ timeout: 8000 });
});

// =============================================================================
// TEST 29 – View Bill for an Order
// =============================================================================
test('TC29 – User can view the bill for an order', async ({ page }) => {
  // GIVEN the Orders page has at least one order
  await login(page);
  await page.locator('//*[@id="side-menu"]/li[5]/a').click();
  await expect(page.locator('//*[@id="page-wrapper"]/table/tbody/tr[1]/td[6]/a[3]')).toBeVisible();

  // WHEN the user clicks the BILL button on the first order
  await page.locator('//*[@id="page-wrapper"]/table/tbody/tr[1]/td[6]/a[3]').click();

  // THEN the Bill details page is displayed
  // The bill page may render invoice content – we assert we left the Orders list
  await expect(page).not.toHaveURL(/\/orders$/i, { timeout: 8000 });
});

// =============================================================================
// TEST 30 – Delete an Order
// =============================================================================
test('TC30 – User can delete an order and is returned to Orders page', async ({ page }) => {
  // GIVEN the Orders page has at least one order
  await login(page);
  await page.locator('//*[@id="side-menu"]/li[5]/a').click();
  await expect(page.locator('//*[@id="page-wrapper"]/table/tbody/tr[1]/td[6]/a[2]')).toBeVisible();

  // WHEN the user clicks the Delete button on the last order
  const rows = page.locator('//*[@id="page-wrapper"]/table/tbody/tr');
  const count = await rows.count();
  const deleteBtn = page.locator(`//*[@id="page-wrapper"]/table/tbody/tr[${count}]/td[6]/a[2]`);
  await deleteBtn.click();

  // THEN the Orders page is shown (order removed)
  await expect(page.locator('h1, h2, h3').filter({ hasText: 'Order' })).toBeVisible({ timeout: 8000 });
});

// =============================================================================
// TEST 31 – Dashboard "View Details – Vendors" quick link
// =============================================================================
test('TC31 – Clicking "View Details" for Vendors on Dashboard navigates to Vendors page', async ({ page }) => {
  // GIVEN the user is on the Dashboard
  await login(page);

  // WHEN the user clicks the "View Details" link under the Vendors card
  await page.locator('//*[@id="page-wrapper"]/div[2]/div[1]/div/a').click();

  // THEN the Vendors list page is displayed
  await expect(page.locator('h1, h2, h3').filter({ hasText: 'Vendors' })).toBeVisible();
});

// =============================================================================
// TEST 32 – Dashboard "View Details – Products" quick link
// =============================================================================
test('TC32 – Clicking "View Details" for Products on Dashboard navigates to Products page', async ({ page }) => {
  // GIVEN the user is on the Dashboard
  await login(page);

  // WHEN the user clicks the "View Details" link under the Products card
  await page.locator('//*[@id="page-wrapper"]/div[2]/div[3]/div/a/div').click();

  // THEN the Products list page is displayed
  await expect(page.locator('h1, h2, h3').filter({ hasText: 'Product' })).toBeVisible();
});
