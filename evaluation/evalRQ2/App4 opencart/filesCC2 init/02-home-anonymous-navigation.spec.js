// 02-home-anonymous-navigation.spec.js
//
// Covers everything reachable directly from the anonymous home page without
// logging in: search, empty cart, and the Contact Us form.
// Every test starts from the root (Home_Anonymous).

const { test, expect } = require('@playwright/test');
const actions = require('./helpers/actions');
const { locate } = require('./helpers/xpathLoader');
const { CONTACT_FORM_DATA } = require('./helpers/testData');

test.describe('Anonymous home navigation: search, cart, contact', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // Edge 9: Home_Anonymous --Search--> Search_Results_Anon
  test('TC-10 | Searching "imac" from the home page shows matching results', async ({
    page,
  }) => {
    await actions.searchFromHome(page, 'Home_Anonymous', 'imac');

    await expect(page).toHaveURL(/route=product\/search/);
    await expect(locate(page, 'Search_Results_Anon', 'iMac')).toBeVisible();
  });

  // Edge 12: Search_Results_Anon --iMac--> Product_Detail_Anon
  test('TC-11 | Opening the iMac result shows the product detail page', async ({
    page,
  }) => {
    await actions.searchFromHome(page, 'Home_Anonymous', 'imac');
    await actions.clickSearchResultIMac(page, 'Search_Results_Anon');

    await expect(page).toHaveURL(/route=product\/product/);
    await expect(page.getByRole('heading', { name: 'iMac', exact: true })).toBeVisible();
    await expect(page.getByText('122.00')).toBeVisible();
  });

  // Edge 14: Search_Results_Anon --Home--> Home_Anonymous
  test('TC-12 | "Home" breadcrumb from search results returns to the home page', async ({
    page,
  }) => {
    await actions.searchFromHome(page, 'Home_Anonymous', 'imac');
    await actions.clickSearchResultsHome(page, 'Search_Results_Anon');

    await expect(
      page
    ).toHaveURL(/route=common\/home|\/opencart\/?($|index\.php\?route=common\/home)/);
    await expect(locate(page, 'Home_Anonymous', 'Search')).toBeVisible();
  });

  // Edge 10: Home_Anonymous --Shopping Cart--> Shopping_Cart_Empty
  test('TC-13 | Opening the cart with no items shows "Your shopping cart is empty!"', async ({
    page,
  }) => {
    await actions.clickHomeShoppingCart(page);

    await expect(page).toHaveURL(/route=checkout\/cart/);
    await expect(page.getByText('Your shopping cart is empty!')).toBeVisible();
  });

  // Edge 13: Shopping_Cart_Empty --Continue--> Home_Anonymous
  test('TC-14 | "Continue" on the empty cart page returns to the home page', async ({
    page,
  }) => {
    await actions.clickHomeShoppingCart(page);
    await actions.clickShoppingCartEmptyContinue(page);

    await expect(
      page
    ).toHaveURL(/route=common\/home|\/opencart\/?($|index\.php\?route=common\/home)/);
    await expect(locate(page, 'Home_Anonymous', 'Search')).toBeVisible();
  });

  // Edge 11: Home_Anonymous --123456789--> Contact_Us_Anon
  test('TC-15 | The phone number link opens the Contact Us page', async ({ page }) => {
    await actions.clickHomePhoneNumber(page, 'Home_Anonymous');

    await expect(page).toHaveURL(/route=information\/contact/);
    await expect(page.getByRole('heading', { name: 'Contact Us' })).toBeVisible();
  });

  // Edge 15: Contact_Us_Anon --Submit--> Contact_Submitted_Anon
  test('TC-16 | Submitting a valid Contact Us form confirms the enquiry was sent', async ({
    page,
  }) => {
    await actions.clickHomePhoneNumber(page, 'Home_Anonymous');
    await actions.fillAndSubmitContactForm(page, 'Contact_Us_Anon', CONTACT_FORM_DATA);

    await expect(
      page.getByText('Your enquiry has been successfully sent to the store owner!')
    ).toBeVisible();
  });

  // Edge 16: Contact_Submitted_Anon --Continue--> Home_Anonymous
  test('TC-17 | "Continue" after a submitted enquiry returns to the home page', async ({
    page,
  }) => {
    await actions.clickHomePhoneNumber(page, 'Home_Anonymous');
    await actions.fillAndSubmitContactForm(page, 'Contact_Us_Anon', CONTACT_FORM_DATA);
    await actions.clickContactSubmittedContinue(page, 'Contact_Submitted_Anon');

    await expect(
      page
    ).toHaveURL(/route=common\/home|\/opencart\/?($|index\.php\?route=common\/home)/);
    await expect(locate(page, 'Home_Anonymous', 'Search')).toBeVisible();
  });
});
