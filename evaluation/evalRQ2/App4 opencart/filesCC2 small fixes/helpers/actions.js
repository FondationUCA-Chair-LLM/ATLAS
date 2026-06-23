// actions.js
//
// One small, single-purpose helper per edge of navigation_graph.json.
// Each helper only performs the UI interaction described by that edge's
// "label"/"action" (ON_CLICK) — it does not assert anything, so the
// assertion for "did we really land on the expected screen" stays visible
// inside the test scenario itself (see the *.spec.js files).
//
// Helpers that fill in a form also live here, immediately next to the click
// that submits the form, since the graph models the submit click as a single
// edge (e.g. "Login_Page --Login--> My_Account").
//
// Edge numbers in the comments refer to the 1-based order of navigation_graph.json -> edges[],
// matching the numbering used in docs/test_scenarios.md.

const { locate } = require('./xpathLoader');

/* ----------------------------------------------------------------------- *
 * Root / anonymous header navigation
 * ----------------------------------------------------------------------- */

// Edge: Home_Anonymous --My Account--> Home_Anonymous_drop_down
async function openAccountDropdown(page) {
  await locate(page, 'Home_Anonymous', 'My Account').click();
}

// Edge 1: Home_Anonymous_drop_down --Login--> Login_Page
async function clickDropdownLogin(page) {
  await locate(page, 'Home_Anonymous_drop_down', 'Login').click();
}

// Edge 2: Home_Anonymous_drop_down --Register--> Register_Account
async function clickDropdownRegister(page) {
  await locate(page, 'Home_Anonymous_drop_down', 'Register').click();
}

/* ----------------------------------------------------------------------- *
 * Login / Register / Account creation
 * ----------------------------------------------------------------------- */

// Edge 3: Login_Page --Continue--> Register_Account
// ("New Customer" panel Continue button)
async function clickLoginPageContinueToRegister(page) {
  await locate(page, 'Login_Page', 'Continue').click();
}

// Edge 4: Register_Account --login page--> Login_Page
async function clickRegisterAccountLoginPageLink(page) {
  // The label in the graph is "login page"; in xpath_mapping.json this link
  // does not have its own dedicated entry, it is the inline link inside the
  // intro paragraph ("...please login at the login page."). We fall back to
  // a resilient text locator for this one element only.
  await page.getByRole('link', { name: 'login page' }).click();
}

// Edge 5: Register_Account --Continue--> Account_Created
async function fillAndSubmitRegisterForm(page, data) {
  await locate(page, 'Register_Account', 'First Name').fill(data.firstName);
  await locate(page, 'Register_Account', 'Last Name').fill(data.lastName);
  await locate(page, 'Register_Account', 'E-Mail').fill(data.email);
  await locate(page, 'Register_Account', 'Password').fill(data.password);
  await locate(
    page,
    'Register_Account',
    'I have read and agree to the Privacy Policy'
  ).check();
  await locate(page, 'Register_Account', 'Continue').click();
}

// Edge 6: Account_Created --Continue--> My_Account
async function clickAccountCreatedContinue(page) {
  await locate(page, 'Account_Created', 'Continue').click();
}

// Edge 7: Login_Page --Login--> My_Account
async function fillAndSubmitLoginForm(page, creds) {
  await locate(page, 'Login_Page', 'E-Mail Address').fill(creds.email);
  await locate(page, 'Login_Page', 'Password').fill(creds.password);
  // occurrence 1 = the form submit button (occurrence 0 is the top nav "Login" link)
  await locate(page, 'Login_Page', 'Login', 1).click();
}

/* ----------------------------------------------------------------------- *
 * My Account hub
 * ----------------------------------------------------------------------- */

// Edge: My_Account --Home--> Home_Authenticated
async function clickMyAccountHome(page) {
  await locate(page, 'My_Account', 'Home').click();
}

// Edge: My_Account --Reward Points--> Reward_Points
async function clickMyAccountRewardPoints(page) {
  await locate(page, 'My_Account', 'Reward Points').click();
}

// Edge: Reward_Points --Continue--> My_Account
async function clickRewardPointsContinue(page) {
  await locate(page, 'Reward_Points', 'Continue').click();
}

// Edge: My_Account --Wish List--> Wishlist_Empty
async function clickMyAccountWishList(page) {
  await locate(page, 'My_Account', 'Wish List').click();
}

// Edge: Wishlist_Empty --Continue--> My_Account
async function clickWishlistContinue(page) {
  await locate(page, 'Wishlist_Empty', 'Continue').click();
}

// Edge: My_Account --Logout--> Home_Anonymous
async function clickMyAccountLogout(page) {
  await locate(page, 'My_Account', 'Logout').click();
}

/* ----------------------------------------------------------------------- *
 * Composite helper: log in an already-registered user and land on My_Account
 * (chains: openAccountDropdown -> clickDropdownLogin -> fillAndSubmitLoginForm)
 * Used as a *precondition* by every authenticated-zone scenario, exactly
 * mirroring the graph path Home_Anonymous -> ... -> My_Account.
 * ----------------------------------------------------------------------- */
async function loginAsExistingUser(page, creds) {
  await openAccountDropdown(page);
  await clickDropdownLogin(page);
  await fillAndSubmitLoginForm(page, creds);
}

/* ----------------------------------------------------------------------- *
 * Anonymous home navigation / search / cart / contact
 * ----------------------------------------------------------------------- */

// Edge: Home_Anonymous --Search--> Search_Results_Anon
async function searchFromHome(page, screen, query) {
  await locate(page, screen, 'Search').fill(query);
  const buttonLabel = screen === 'Home_Anonymous' ? 'Search-Button' : 'Search Button';
  await locate(page, screen, buttonLabel).click();
}

// Edge: Home_Anonymous --Shopping Cart--> Shopping_Cart_Empty
async function clickHomeShoppingCart(page) {
  await locate(page, 'Home_Anonymous', 'Shopping Cart').click();
}

// Edge: Home_Anonymous / Home_Authenticated --123456789--> Contact_Us_*
async function clickHomePhoneNumber(page, screen) {
  await locate(page, screen, '123456789').click();
}

// Edge: Search_Results_Anon / Search_Results_Auth --iMac--> Product_Detail_*
async function clickSearchResultIMac(page, screen) {
  await locate(page, screen, 'iMac').click();
}

// Edge: Search_Results_Anon / Search_Results_Auth --Home--> Home_*
async function clickSearchResultsHome(page, screen) {
  await locate(page, screen, 'Home').click();
}

// Edge: Shopping_Cart_Empty --Continue--> Home_Anonymous
async function clickShoppingCartEmptyContinue(page) {
  await locate(page, 'Shopping_Cart_Empty', 'Continue').click();
}

// Edge: Contact_Us_Anon / Contact_Us_Auth --Submit--> Contact_Submitted_*
async function fillAndSubmitContactForm(page, screen, data) {
  await locate(page, screen, 'Your Name').fill(data.name);
  await locate(page, screen, 'E-Mail Address').fill(data.email);
  await locate(page, screen, 'Enquiry').fill(data.enquiry);
  await locate(page, screen, 'Submit').click();
}

// Edge: Contact_Submitted_Anon / Contact_Submitted_Auth --Continue--> Home_*
async function clickContactSubmittedContinue(page, screen) {
  await locate(page, screen, 'Continue').click();
}

/* ----------------------------------------------------------------------- *
 * Authenticated catalogue browsing
 * ----------------------------------------------------------------------- */

// Edge: Home_Authenticated --Desktops--> Home_Authenticated_Desktop
async function clickDesktopsMenu(page) {
  await locate(page, 'Home_Authenticated', 'Desktops').click();
}

// Edge: Home_Authenticated_Desktop --Mac (1)--> Category_Mac_Auth
async function clickDesktopsMacSubmenu(page) {
  await locate(page, 'Home_Authenticated_Desktop', 'Mac (1)').click();
}

// Edge: Category_Mac_Auth --iMac--> Product_Detail_Auth
async function clickCategoryIMac(page) {
  await locate(page, 'Category_Mac_Auth', 'iMac').click();
}

/* ----------------------------------------------------------------------- *
 * Product detail / cart / checkout
 * ----------------------------------------------------------------------- */

// Edge: Product_Detail_Auth --Add to Cart--> Product_Detail_Auth_Cart
async function addProductToCart(page, qty = '1') {
  await locate(page, 'Product_Detail_Auth', 'Qty').fill(qty);
  await locate(page, 'Product_Detail_Auth', 'Add to Cart').click();
}

// Edge: Product_Detail_Auth_Cart --Shopping Cart--> Shopping_Cart_Auth
async function clickHeaderShoppingCartLink(page, screen) {
  await locate(page, screen, 'Shopping Cart').click();
}

// Edge: Shopping_Cart_Auth --Continue Shopping--> Home_Authenticated
async function clickCartContinueShopping(page) {
  await locate(page, 'Shopping_Cart_Auth', 'Continue Shopping').click();
}

// Edge: Shopping_Cart_Auth --Checkout--> Checkout_Auth
async function clickCartCheckout(page) {
  await locate(page, 'Shopping_Cart_Auth', 'Checkout').click();
}

// Edge: Checkout_Auth --Continue--> Checkout_Auth_Shipping
async function fillAndSubmitCheckoutAddress(page, data) {
  await locate(page, 'Checkout_Auth', 'First Name').fill(data.firstName);
  await locate(page, 'Checkout_Auth', 'Last Name').fill(data.lastName);
  await locate(page, 'Checkout_Auth', 'Address 1').fill(data.address1);
  await locate(page, 'Checkout_Auth', 'City').fill(data.city);
  await locate(page, 'Checkout_Auth', 'Post Code').fill(data.postcode);
  await locate(page, 'Checkout_Auth', 'Country').selectOption({ label: data.country });
  // The Region/State <select> is re-populated by AJAX once a country is
  // chosen, so we wait for the expected option to actually be available
  // before selecting it.
  const regionSelect = locate(page, 'Checkout_Auth', 'Region / State');
  await regionSelect.locator(`option:text("${data.region}")`).waitFor();
  await regionSelect.selectOption({ label: data.region });
  await locate(page, 'Checkout_Auth', 'Continue').click();
}

// Edge: Checkout_Auth_Shipping --Choose--> Checkout_Auth_Shipping_options
async function openShippingMethodModal(page) {
  await locate(page, 'Checkout_Auth_Shipping', 'Choose Shipping Method').click();
}

// Edge: Checkout_Auth_Shipping_options --Continue--> Checkout_Auth_Shippement_method_selected
async function selectFlatShippingAndContinue(page) {
  await locate(page, 'Checkout_Auth_Shipping_options', 'Flat Shipping Rate').check();
  await locate(page, 'Checkout_Auth_Shipping_options', 'Continue').click();
}

// Edge: Checkout_Auth_Shippement_method_selected --Choose--> Checkout_Auth_Payment_options
async function openPaymentMethodModal(page) {
  await locate(
    page,
    'Checkout_Auth_Shippement_method_selected',
    'Choose Payment Method'
  ).click();
}

// Edge: Checkout_Auth_Payment_options --Continue--> Checkout_Auth_Final
async function selectCashOnDeliveryAndContinue(page) {
  await locate(page, 'Checkout_Auth_Payment_options', 'Cash On Delivery').check();
  await locate(page, 'Checkout_Auth_Payment_options', 'Continue').click();
}

// Edge: Checkout_Auth_Final --Confirm Order--> Order_Success_Auth
async function confirmOrder(page) {
  await locate(page, 'Checkout_Auth_Final', 'Confirm Order').click();
}

// Edge: Order_Success_Auth --Continue--> Home_Authenticated
async function clickOrderSuccessContinue(page) {
  await locate(page, 'Order_Success_Auth', 'Continue').click();
}

module.exports = {
  openAccountDropdown,
  clickDropdownLogin,
  clickDropdownRegister,
  clickLoginPageContinueToRegister,
  clickRegisterAccountLoginPageLink,
  fillAndSubmitRegisterForm,
  clickAccountCreatedContinue,
  fillAndSubmitLoginForm,
  loginAsExistingUser,
  clickMyAccountHome,
  clickMyAccountRewardPoints,
  clickRewardPointsContinue,
  clickMyAccountWishList,
  clickWishlistContinue,
  clickMyAccountLogout,
  searchFromHome,
  clickHomeShoppingCart,
  clickHomePhoneNumber,
  clickSearchResultIMac,
  clickSearchResultsHome,
  clickShoppingCartEmptyContinue,
  fillAndSubmitContactForm,
  clickContactSubmittedContinue,
  clickDesktopsMenu,
  clickDesktopsMacSubmenu,
  clickCategoryIMac,
  addProductToCart,
  clickHeaderShoppingCartLink,
  clickCartContinueShopping,
  clickCartCheckout,
  fillAndSubmitCheckoutAddress,
  openShippingMethodModal,
  selectFlatShippingAndContinue,
  openPaymentMethodModal,
  selectCashOnDeliveryAndContinue,
  confirmOrder,
  clickOrderSuccessContinue,
};
