# OpenCart Acceptance Tests (Playwright)

42 acceptance scenarios for `http://localhost/opencart`, derived from the
supplied navigation graph, `xpath_mapping.json`, and the reference
screenshots. See **`test-scenarios.md`** for the full natural-language
scenario list (one section per test, IDs TC01–TC42).

## Project layout

```
opencart-tests/
├── playwright.config.js     # baseURL, globalSetup wiring
├── global-setup.js          # registers a user + places one seed order, saves session
├── data/
│   └── xpath_mapping.json   # the supplied locator map (copied as-is)
├── utils/
│   ├── config.js            # BASE_URL constant
│   ├── xpath.js              # xp('Screen','Label') -> locator, backed by xpath_mapping.json
│   ├── testData.js          # toto user / address / iMac price constants
│   └── actions.js           # reusable multi-step UI flows (login, add-to-cart, checkout…)
├── tests/
│   ├── 01-anonymous-navigation.spec.js   # TC01–TC10
│   ├── 02-registration.spec.js           # TC11–TC15
│   ├── 03-login-logout.spec.js           # TC16–TC20
│   ├── 04-my-account.spec.js             # TC21–TC25
│   ├── 05-catalog-product.spec.js        # TC26–TC31
│   ├── 06-cart-management.spec.js        # TC32–TC35
│   └── 07-checkout-order.spec.js         # TC36–TC42
└── test-scenarios.md        # natural-language version of all 42 scenarios
```

## How locators are resolved

Every interactive element is looked up from `data/xpath_mapping.json` through
`utils/xpath.js`:

```js
const { xp } = require('../utils/xpath');
await page.locator(xp('Login_Page', 'E-Mail Address')).fill('toto@gmail.com');
```

`xp(screen, label, occurrence?)` throws a clear error at runtime if the
screen/label isn't found, instead of silently returning an empty locator —
the suite is run once in "dry" mode (see below) to make sure all 100+ calls
resolve before any browser is launched. A small number of purely
display-only assertions (e.g. the iMac's "Apple"/"Product 14"/"In Stock"
text, or the "login page" inline link that isn't in the mapping file) use
Playwright's built-in role/text locators instead, since the mapping focuses
on interactive elements.

## Setup

```bash
cd opencart-tests
npm install
npx playwright install chromium   # downloads the browser binary
```

## Running

```bash
npx playwright test                 # headless, all 42 tests
npx playwright test --headed        # watch it run
npx playwright test tests/07-checkout-order.spec.js
npx playwright test -g "TC18"       # run a single scenario by name
npx playwright show-report          # open the HTML report after a run
```

`global-setup.js` runs once before the suite: it registers a fresh `toto.*`
account, places one full order for it (so the address book has an entry,
matching the "existing address" checkout screenshots), and saves the
authenticated session to `.auth/user.json` plus the credentials to
`.auth/credentials.json`. Specs that need to start already logged in just
add:

```js
test.use({ storageState: path.join(__dirname, '..', '.auth', 'user.json') });
```

## Design notes / assumptions worth knowing before the first real run

- **Unique e-mails.** Every registration (global setup and TC11–TC15) uses a
  timestamp-based e-mail, so the suite can be re-run against the same
  OpenCart database without hitting "E-Mail Address already registered".
- **Country/Region values.** `utils/testData.js` uses the exact option text
  seen in the screenshots ("France, Metropolitan" / "Paris"). If your
  store's seed data differs, update `ADDRESS` there.
- **Checkout group (TC36–TC42)** is written as one `test.describe.serial`
  block sharing a single page, because those 7 scenarios are really one
  continuous wizard (you wouldn't reload between choosing shipping and
  choosing payment in real life).
- **TC25** assumes that, once authenticated, the header "My Account"
  element navigates directly to the account page (the mapping file only
  documents the anonymous Register/Login dropdown). Adjust if your theme
  shows a different authenticated dropdown.
- Tests were written against the **provided screenshots**, not against a
  live instance (no network access in the environment that produced this
  suite). Run `npx playwright test --headed` first and adjust any selector
  drift before trusting the suite in CI.
