// utils/actions.js
//
// Reusable, multi-step UI flows built on top of utils/xpath.js.
// Keeping these in one place avoids duplicating the same click sequence
// in every spec file and keeps each test's "Steps" section short and
// readable (one call == one step from the natural-language scenario).

const { xp } = require('./xpath');

// ---------------------------------------------------------------------
// Header / navigation
// ---------------------------------------------------------------------

/** Loads the storefront home page (anonymous or authenticated, depending on cookies). */
async function gotoHome(page) {
  await page.goto('/opencart');
}

/**
 * Opens the "My Account" header dropdown on an anonymous page and clicks
 * either "Login" or "Register".
 * @param {'Login'|'Register'} target
 */
async function openAccountDropdownAndChoose(page, target) {
  await page.locator(xp('Home_Anonymous', 'My Account')).click();
  await page.locator(xp('Home_Anonymous_drop_down', target)).waitFor({ state: 'visible' });
  await page.locator(xp('Home_Anonymous_drop_down', target)).click();
}

/** Opens the Desktops mega-menu on the given header screen and clicks "Mac (1)". */
async function openDesktopsMacCategory(page, screen = 'Home_Authenticated') {
  const desktops = page.locator(xp(screen, 'Desktops'));
  await desktops.hover();
  await desktops.click();
  const mac = page.locator(xp(screen, 'Mac (1)'));
  await mac.waitFor({ state: 'visible' });
  await mac.click();
}

/** Types a term into the header search box and triggers the search. */
async function searchHeader(page, screen, term) {
  await page.locator(xp(screen, 'Search')).fill(term);
  await page.locator(xp(screen, screen === 'Home_Anonymous' ? 'Search-Button' : 'Search Button')).click();
}

// ---------------------------------------------------------------------
// Account: register / login / logout
// ---------------------------------------------------------------------

/** Fills and submits the Register Account form. Expects to already be on that page. */
async function registerAccount(page, user) {
  await page.locator(xp('Register_Account', 'First Name')).fill(user.firstName);
  await page.locator(xp('Register_Account', 'Last Name')).fill(user.lastName);
  await page.locator(xp('Register_Account', 'E-Mail')).fill(user.email);
  await page.locator(xp('Register_Account', 'Password')).fill(user.password);
  await page.locator(xp('Register_Account', 'I have read and agree to the Privacy Policy')).check();
  await page.locator(xp('Register_Account', 'Continue')).click();
}

/** Fills and submits the Returning Customer login form. Expects to already be on the Login page. */
async function loginWithForm(page, email, password) {
  await page.locator(xp('Login_Page', 'E-Mail Address')).fill(email);
  await page.locator(xp('Login_Page', 'Password')).fill(password);
  await page.locator(xp('Login_Page', 'Login', 1)).click(); // occurrence 1 = the submit button
}

/** Full flow: from an anonymous page, open the dropdown, go to Login, sign in. */
async function login(page, email, password) {
  await openAccountDropdownAndChoose(page, 'Login');
  await loginWithForm(page, email, password);
}

/** Logs the current (authenticated) user out via the My Account sidebar. */
async function logout(page) {
  await page.locator(xp('My_Account', 'Logout')).click();
}

// ---------------------------------------------------------------------
// Catalog / cart
// ---------------------------------------------------------------------

/** From a product detail page, optionally sets the quantity and clicks Add to Cart. */
async function addCurrentProductToCart(page, screen, qty = null) {
  if (qty !== null) {
    await page.locator(xp(screen, 'Qty')).fill(String(qty));
  }
  await page.locator(xp(screen, 'Add to Cart')).click();
}

/** Convenience flow: search "imac" from the header, open the result, add it to the cart. */
async function addImacToCartViaSearch(page, headerScreen, searchResultsScreen, productScreen) {
  await searchHeader(page, headerScreen, 'imac');
  await page.locator(xp(searchResultsScreen, 'iMac')).click();
  await addCurrentProductToCart(page, productScreen);
}

/** Opens the Shopping Cart page from the header link. */
async function openCartFromHeader(page, screen) {
  await page.locator(xp(screen, 'Shopping Cart')).click();
}

/** From the Shopping Cart page, clicks the Checkout button. */
async function proceedToCheckoutFromCart(page) {
  await page.locator(xp('Shopping_Cart_Auth', 'Checkout')).click();
}

/**
 * Empties the shopping cart, if it isn't already empty, by repeatedly
 * clicking the Remove button. Makes cart/checkout specs deterministic
 * and independent of whatever a previous test left behind.
 */
async function clearCart(page, screen = 'Home_Authenticated') {
  await openCartFromHeader(page, screen);
  const removeButton = page.locator(xp('Shopping_Cart_Auth', 'Remove'));
  for (let i = 0; i < 5 && (await removeButton.count()) > 0; i++) {
    await removeButton.click();
    await page.waitForTimeout(500); // let the AJAX cart refresh settle
  }
}

// ---------------------------------------------------------------------
// Checkout
// ---------------------------------------------------------------------

/**
 * Fills the Payment Address section of the one-page checkout assuming the
 * customer has NO address book entry yet (first-ever checkout), then
 * submits it. Matches the "checkout_one.png" reference screenshot.
 */
async function fillNewCheckoutAddress(page, user, address) {
  await page.locator(xp('Checkout_Auth', 'First Name')).fill(user.firstName);
  await page.locator(xp('Checkout_Auth', 'Last Name')).fill(user.lastName);
  await page.locator(xp('Checkout_Auth', 'Address 1')).fill(address.address1);
  await page.locator(xp('Checkout_Auth', 'City')).fill(address.city);
  await page.locator(xp('Checkout_Auth', 'Post Code')).fill(address.postcode);
  await page.locator(xp('Checkout_Auth', 'Country')).selectOption({ label: address.country });
  await page.locator(xp('Checkout_Auth', 'Region / State')).selectOption({ label: address.zone });
  await page.locator(xp('Checkout_Auth', 'Continue')).click();
}

/** Opens the "Shipping method options" modal and confirms the Flat Shipping Rate. */
async function chooseFlatShippingMethod(page) {
  await page.locator(xp('Checkout_Auth_Shipping', 'Choose Shipping Method')).click();
  await page.locator(xp('Checkout_Auth_Shipping_options', 'Flat Shipping Rate')).check();
  await page.locator(xp('Checkout_Auth_Shipping_options', 'Continue')).click();
}

/** Opens the "Payment method options" modal and confirms Cash On Delivery. */
async function choosePaymentMethodCOD(page) {
  await page.locator(xp('Checkout_Auth_Shippement_method_selected', 'Choose Payment Method')).click();
  await page.locator(xp('Checkout_Auth_Payment_options', 'Cash On Delivery')).check();
  await page.locator(xp('Checkout_Auth_Payment_options', 'Continue')).click();
}

/** Clicks the final "Confirm Order" button. */
async function confirmOrder(page) {
  await page.locator(xp('Checkout_Auth_Final', 'Confirm Order')).click();
}

/**
 * Runs an entire happy-path order from an empty cart: add iMac to cart,
 * go to checkout, fill a brand-new address, pick flat shipping + COD, and
 * confirm. Used by global-setup.js to seed an address book entry / order
 * history for the authenticated-user storage state.
 */
async function placeFirstImacOrder(page, user, address) {
  await openDesktopsMacCategory(page, 'Home_Authenticated');
  await page.locator(xp('Category_Mac_Auth', 'iMac')).click();
  await addCurrentProductToCart(page, 'Product_Detail_Auth');
  await openCartFromHeader(page, 'Home_Authenticated');
  await proceedToCheckoutFromCart(page);
  await fillNewCheckoutAddress(page, user, address);
  await chooseFlatShippingMethod(page);
  await choosePaymentMethodCOD(page);
  await confirmOrder(page);
  await page.locator(xp('Order_Success_Auth', 'Continue')).click();
}

// ---------------------------------------------------------------------
// Contact us
// ---------------------------------------------------------------------

async function submitContactForm(page, screen, name, email, message) {
  await page.locator(xp(screen, 'Your Name')).fill(name);
  await page.locator(xp(screen, 'E-Mail Address')).fill(email);
  await page.locator(xp(screen, 'Enquiry')).fill(message);
  await page.locator(xp(screen, 'Submit')).click();
}

module.exports = {
  gotoHome,
  openAccountDropdownAndChoose,
  openDesktopsMacCategory,
  searchHeader,
  registerAccount,
  loginWithForm,
  login,
  logout,
  addCurrentProductToCart,
  addImacToCartViaSearch,
  openCartFromHeader,
  proceedToCheckoutFromCart,
  clearCart,
  fillNewCheckoutAddress,
  chooseFlatShippingMethod,
  choosePaymentMethodCOD,
  confirmOrder,
  placeFirstImacOrder,
  submitContactForm,
};
