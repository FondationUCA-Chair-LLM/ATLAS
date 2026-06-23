# OpenCart Acceptance Tests (Playwright)

42 acceptance tests for the OpenCart demo store at `http://localhost/opencart`,
generated from:

- `navigation_graph.json` — 29 screens, 42 click-driven transitions (the graph has exactly 42 edges, one per acceptance test)
- `xpath_mapping.json` — xpath locators for the important UI elements of each screen (used as the **single source of truth** for every locator in the tests, via `tests/helpers/xpathLoader.js`)
- `screenshots.zip` — used to extract real functional test data (form values, the iMac's price, confirmation messages, etc.), see `tests/helpers/testData.js`

Every test starts at the root of the application (the anonymous home page) and replays, click by click, the shortest path through the graph to reach the screen under test before performing and asserting the scenario's specific action. See `docs/test_scenarios.md` for the full list in natural language, and the coverage table at the bottom of that file mapping each scenario back to its graph edge.

## Project layout

```
opencart-tests/
├── docs/
│   └── test_scenarios.md        # 42 scenarios in natural language + coverage table
├── tests/
│   ├── helpers/
│   │   ├── xpath_mapping.json   # copy of the provided mapping file (source of truth)
│   │   ├── xpathLoader.js       # getXPath()/locate() — reads xpath_mapping.json
│   │   ├── testData.js          # functional data extracted from screenshots.zip
│   │   └── actions.js           # one small helper per graph edge (click/fill only, no assertions)
│   ├── 01-account-dropdown-and-auth.spec.js      # TC-01 .. TC-09 (9 tests)
│   ├── 02-home-anonymous-navigation.spec.js      # TC-10 .. TC-17 (8 tests)
│   ├── 03-authenticated-home-navigation.spec.js  # TC-18 .. TC-27 (10 tests)
│   ├── 04-cart-and-checkout.spec.js              # TC-28 .. TC-38 (11 tests)
│   └── 05-account-management.spec.js             # TC-39 .. TC-42 (4 tests)
├── playwright.config.js
└── package.json
```

## Setup

```bash
npm install
npx playwright install chromium   # downloads the browser binary
```

## Run

```bash
npx playwright test               # headless, all 42 tests
npx playwright test --headed      # watch the browser
npx playwright test --ui          # interactive UI mode
npx playwright test --list        # list all tests without running them (sanity check: should print "Total: 42 tests")
npx playwright show-report        # open the HTML report after a run
```

Run a single file or test:

```bash
npx playwright test tests/04-cart-and-checkout.spec.js
npx playwright test -g "TC-37"
```

`playwright.config.js` sets `baseURL: 'http://localhost/opencart'` and `fullyParallel: false`, since several scenarios reuse the same demo account and the checkout flow is a long, strictly linear chain — running them serially avoids state collisions between workers.

## Important assumptions — please review before running

1. **Pre-existing demo account.** Most scenarios log in as `toto@gmail.com` / `toto1234` (the credentials visible in `login.png`/`register.png`). This account is **assumed to already exist** on your OpenCart instance. If it doesn't:
   - run TC-06 once manually (or via `npx playwright test -g "TC-06"`, which registers a *new* unique account each time so it never collides) to confirm registration works, then
   - register `toto@gmail.com` / `toto1234` once by hand (or adapt `EXISTING_USER` in `tests/helpers/testData.js` to a real account on your instance).
2. **First-time checkout address form.** `Checkout_Auth` in `xpath_mapping.json` only exposes the direct address-entry fields (no "use an existing address" radio buttons), matching `checkout_one.png`. The tests assume the demo account has **no saved address book entries** yet. If `toto@gmail.com` has already checked out before on your instance, OpenCart will show the existing-address radio buttons instead, and `fillAndSubmitCheckoutAddress()` will need a small adaptation (selecting the existing address rather than filling the form) — happy to add that variant if useful.
3. **Country/Region values.** Checkout uses `France, Metropolitan` / `Paris`, as seen in `checkout_one.png`. Adjust `CHECKOUT_ADDRESS` in `testData.js` if your catalogue/zone data differs.
4. **Base URL / routing.** Tests navigate with relative paths (`page.goto('/')`) and click through the UI rather than hard-coding `route=...` URLs, in line with the navigation-graph's click-driven model. A couple of assertions do check the URL's `route=` query parameter as a secondary signal; adjust the regexes in the specs if your instance disables SEO-friendly URLs.
5. **One element label, two elements.** Two screens reuse the same label for two different elements (e.g. `Login_Page` has a "Login" top-nav link *and* a "Login" submit button). `xpathLoader.getXPath(screen, label, occurrence)` takes an optional `occurrence` index to disambiguate; this is already handled inside `actions.js` (occurrence `1` for the Login submit button).

## Traceability

Every `actions.js` helper and every spec file carries a comment naming the exact edge of `navigation_graph.json` it implements (e.g. `// Edge 7: Login_Page --Login--> My_Account`), and every locator is resolved at runtime from `xpath_mapping.json` rather than being hard-coded — so if the navigation graph or the xpath mapping is regenerated, the gap between "what changed" and "what test/locator needs updating" stays small.
