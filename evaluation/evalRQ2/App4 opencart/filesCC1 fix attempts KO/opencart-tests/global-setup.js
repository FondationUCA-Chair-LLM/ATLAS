// global-setup.js
//
// Runs once before the whole suite. It:
//   1. Registers a brand-new "toto" account (unique e-mail per run).
//   2. Places one full iMac order for it (this is what creates the first
//      address-book entry, exactly like the real shopper journey behind
//      the "checkout_one.png" -> "order_placed.png" screenshots).
//   3. Persists the authenticated session to .auth/user.json so every
//      spec that needs to start "already logged in" can just do
//      `test.use({ storageState: '.auth/user.json' })`.
//   4. Persists the plain-text credentials to .auth/credentials.json so
//      the Login/Logout spec can exercise the real login FORM with a
//      known-valid account instead of guessing one.

const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');

const { xp } = require('./utils/xpath');
const { BASE_URL } = require('./utils/config');
const { USER, ADDRESS } = require('./utils/testData');
const {
  openAccountDropdownAndChoose,
  registerAccount,
  placeFirstImacOrder,
} = require('./utils/actions');

const AUTH_DIR = path.join(__dirname, '.auth');

module.exports = async () => {
  fs.mkdirSync(AUTH_DIR, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({ baseURL: BASE_URL });
  const page = await context.newPage();

  // 1. Register a brand new account.
  await page.goto('/');
  await openAccountDropdownAndChoose(page, 'Register');
  await registerAccount(page, USER);
  await page.locator(xp('Account_Created', 'Continue')).click(); // -> lands on My Account, already logged in

  // 2. Place one full order so the address book + order history are seeded.
  await page.locator(xp('My_Account', 'Home')).click(); // -> Home (Authenticated)
  await placeFirstImacOrder(page, USER, ADDRESS);

  // 3. Persist session for reuse by authenticated specs.
  await context.storageState({ path: path.join(AUTH_DIR, 'user.json') });

  // 4. Persist plain-text credentials for the Login/Logout spec.
  fs.writeFileSync(
    path.join(AUTH_DIR, 'credentials.json'),
    JSON.stringify({ email: USER.email, password: USER.password }, null, 2)
  );

  await browser.close();
};
