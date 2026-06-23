// 03-authenticated-home-navigation.spec.js
//
// Covers everything reachable from the authenticated home page (catalogue
// browsing via menu, catalogue browsing via search, and Contact Us while
// logged in). Every test starts from the root (Home_Anonymous) and logs in
// first, exactly mirroring the shortest path computed from
// navigation_graph.json.

const { test, expect } = require('@playwright/test');
const actions = require('./helpers/actions');
const { locate } = require('./helpers/xpathLoader');
const { EXISTING_USER, CONTACT_FORM_DATA } = require('./helpers/testData');

test.describe('Authenticated home navigation: catalogue, search, contact', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Precondition shared by every test in this file: Home -> dropdown -> Login -> My Account
    await actions.loginAsExistingUser(page, EXISTING_USER);
    await expect(page.getByRole('heading', { name: 'My Account' })).toBeVisible();
  });

  // Edge 17: My_Account --Home--> Home_Authenticated
  test('TC-18 | "Home" from My Account shows the authenticated home page', async ({
    page,
  }) => {
    await actions.clickMyAccountHome(page);

    await expect(page).toHaveURL(/route=common\/home|\/opencart\/?($|index\.php\?route=common\/home)/);
    // Authenticated header no longer offers Register/Login, it shows the account menu directly
    await expect(locate(page, 'Home_Authenticated', 'Desktops')).toBeVisible();
  });

  // Edge 20: Home_Authenticated --Desktops--> Home_Authenticated_Desktop
  test('TC-19 | Opening "Desktops" reveals the Mac sub-category link', async ({
    page,
  }) => {
    await actions.clickMyAccountHome(page);
    await actions.clickDesktopsMenu(page);

    await expect(locate(page, 'Home_Authenticated_Desktop', 'Mac (1)')).toBeVisible();
  });

  // Edge 21: Home_Authenticated_Desktop --Mac (1)--> Category_Mac_Auth
  test('TC-20 | Selecting "Mac" under Desktops lists the iMac product', async ({
    page,
  }) => {
    await actions.clickMyAccountHome(page);
    await actions.clickDesktopsMenu(page);
    await actions.clickDesktopsMacSubmenu(page);

    await expect(page).toHaveURL(/route=product\/category/);
    await expect(page.getByRole('heading', { name: 'Mac', exact: true })).toBeVisible();
    await expect(locate(page, 'Category_Mac_Auth', 'iMac')).toBeVisible();
  });

  // Edge 24: Category_Mac_Auth --iMac--> Product_Detail_Auth
  test('TC-21 | Opening the iMac from the Mac category shows its product page', async ({
    page,
  }) => {
    await actions.clickMyAccountHome(page);
    await actions.clickDesktopsMenu(page);
    await actions.clickDesktopsMacSubmenu(page);
    await actions.clickCategoryIMac(page);

    await expect(page).toHaveURL(/route=product\/product/);
    await expect(page.getByRole('heading', { name: 'iMac', exact: true })).toBeVisible();
    await expect(locate(page, 'Product_Detail_Auth', 'Add to Cart')).toBeVisible();
  });

  // Edge 22: Home_Authenticated --Search--> Search_Results_Auth
  test('TC-22 | Searching "imac" while logged in shows matching results', async ({
    page,
  }) => {
    await actions.clickMyAccountHome(page);
    await actions.searchFromHome(page, 'Home_Authenticated', 'imac');

    await expect(page).toHaveURL(/route=product\/search/);
    await expect(locate(page, 'Search_Results_Auth', 'iMac')).toBeVisible();
  });

  // Edge 25: Search_Results_Auth --iMac--> Product_Detail_Auth
  test('TC-23 | Opening the iMac search result (authenticated) shows the product page', async ({
    page,
  }) => {
    await actions.clickMyAccountHome(page);
    await actions.searchFromHome(page, 'Home_Authenticated', 'imac');
    await actions.clickSearchResultIMac(page, 'Search_Results_Auth');

    await expect(page).toHaveURL(/route=product\/product/);
    await expect(page.getByRole('heading', { name: 'iMac', exact: true })).toBeVisible();
  });

  // Edge 39: Search_Results_Auth --Home--> Home_Authenticated
  test('TC-24 | "Home" breadcrumb from authenticated search results returns home', async ({
    page,
  }) => {
    await actions.clickMyAccountHome(page);
    await actions.searchFromHome(page, 'Home_Authenticated', 'imac');
    await actions.clickSearchResultsHome(page, 'Search_Results_Auth');

    await expect(locate(page, 'Home_Authenticated', 'Desktops')).toBeVisible();
  });

  // Edge 23: Home_Authenticated --123456789--> Contact_Us_Auth
  test('TC-25 | The phone number link opens Contact Us while logged in', async ({
    page,
  }) => {
    await actions.clickMyAccountHome(page);
    await actions.clickHomePhoneNumber(page, 'Home_Authenticated');

    await expect(page).toHaveURL(/route=information\/contact/);
    await expect(page.getByRole('heading', { name: 'Contact Us' })).toBeVisible();
  });

  // Edge 40: Contact_Us_Auth --Submit--> Contact_Submitted_Auth
  test('TC-26 | Submitting Contact Us while logged in confirms the enquiry was sent', async ({
    page,
  }) => {
    await actions.clickMyAccountHome(page);
    await actions.clickHomePhoneNumber(page, 'Home_Authenticated');
    await actions.fillAndSubmitContactForm(page, 'Contact_Us_Auth', CONTACT_FORM_DATA);

    await expect(
      page.getByText('Your enquiry has been successfully sent to the store owner!')
    ).toBeVisible();
  });

  // Edge 41: Contact_Submitted_Auth --Continue--> Home_Authenticated
  test('TC-27 | "Continue" after a logged-in enquiry returns to authenticated home', async ({
    page,
  }) => {
    await actions.clickMyAccountHome(page);
    await actions.clickHomePhoneNumber(page, 'Home_Authenticated');
    await actions.fillAndSubmitContactForm(page, 'Contact_Us_Auth', CONTACT_FORM_DATA);
    await actions.clickContactSubmittedContinue(page, 'Contact_Submitted_Auth');

    await expect(locate(page, 'Home_Authenticated', 'Desktops')).toBeVisible();
  });
});
