// testData.js
//
// Functional test data extracted from screenshots.zip (the GUI captures that
// accompany the navigation graph). Centralising it here means every spec
// file uses the same values and they only need updating in one place.

// Base URL of the application under test.
const BASE_URL = 'http://localhost/opencart';

// Credentials of an already-registered demo customer, as seen in login.png /
// register.png. ASSUMPTION: this account already exists on the target
// instance (it was created once, prior to these tests, via the Register
// scenario). All "login" based scenarios reuse it so they stay independent
// and repeatable. See README.md for how to (re)seed it if needed.
const EXISTING_USER = {
  firstName: 'toto',
  lastName: 'toto',
  email: 'toto@gmail.com',
  password: 'toto1234',
};

// Data used by the "Register a brand-new account" scenario. The e-mail must
// be unique on every run (OpenCart rejects duplicate e-mails), so it is
// generated at run time from the same "toto" pattern seen in register.png.
function buildNewRegistrationData() {
  const unique = Date.now();
  return {
    firstName: 'toto',
    lastName: 'toto',
    email: `toto+${unique}@gmail.com`,
    password: 'toto1234',
  };
}

// Contact Us form data, as seen in contact_us.png.
const CONTACT_FORM_DATA = {
  name: 'toto',
  email: 'toto@gmail.com',
  enquiry: 'This is a test Enquiry',
};

// Checkout payment-address data, as seen in checkout_one.png. This matches
// the first-time checkout flow (no saved address book entry yet), which is
// the flow described by xpath_mapping.json for the Checkout_Auth screen.
const CHECKOUT_ADDRESS = {
  firstName: 'toto',
  lastName: 'toto',
  address1: '23 rue paris',
  city: 'Paris',
  postcode: '98000',
  country: 'France, Metropolitan',
  region: 'Paris',
};

// Product used throughout the catalogue / cart / checkout scenarios, as seen
// in product_imac.png, category_mac.png and shopping_cart_mac1.png.
const PRODUCT_IMAC = {
  name: 'iMac',
  model: 'Product 14',
  unitPrice: '$122.00',
  subTotal: '$100.00',
};

module.exports = {
  BASE_URL,
  EXISTING_USER,
  buildNewRegistrationData,
  CONTACT_FORM_DATA,
  CHECKOUT_ADDRESS,
  PRODUCT_IMAC,
};
