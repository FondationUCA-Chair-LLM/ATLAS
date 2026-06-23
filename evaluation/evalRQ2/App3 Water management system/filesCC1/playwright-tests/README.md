# Water Management — Playwright Acceptance Tests

Playwright acceptance test suite for the Water Management web application
(`http://localhost/watermanagement/`), generated from:

- `data/navigation_graph.json` — application navigation graph (screens +
  transitions)
- `data/xpath_mapping.json` — xpaths of the important UI elements per
  screen (used by every test via `utils/xpaths.js`)
- the provided screenshots (used to confirm headings, labels, success
  messages and sample data such as the vendor "John", customer
  "Dikshant23", product "www", order "1045")

See **`SCENARIOS.md`** for the 32 test scenarios in natural language, with
their mapping to graph edges / xpath entries / screenshots.

## Project layout

```
playwright-tests/
├── data/
│   ├── navigation_graph.json   # copy of the provided navigation graph
│   └── xpath_mapping.json      # copy of the provided xpath mapping
├── utils/
│   ├── xpaths.js                # xp(screen, label) -> "xpath=..." helper
│   ├── auth.js                  # login() helper (Login -> Dashboard)
│   └── testData.js              # credentials + unique-data helpers
├── tests/
│   ├── 01-authentication.spec.js  # Scenarios 01-03
│   ├── 02-dashboard.spec.js       # Scenarios 04-10
│   ├── 03-vendors.spec.js         # Scenarios 11-16
│   ├── 04-customers.spec.js       # Scenarios 17-22
│   ├── 05-products.spec.js        # Scenarios 23-27
│   └── 06-orders.spec.js          # Scenarios 28-32
├── playwright.config.js
├── package.json
└── SCENARIOS.md
```

Every UI element used by the tests is looked up via
`xp('<Screen>', '<Label>')`, which resolves to the exact xpath string from
`xpath_mapping.json` (prefixed with `xpath=` for Playwright). No xpath is
hard-coded inside a test file — see `utils/xpaths.js`.

## Setup

```bash
cd playwright-tests
npm install
npx playwright install --with-deps chromium
```

## Configuration

| Variable       | Default                                | Purpose                              |
|-----------------|-----------------------------------------|---------------------------------------|
| `BASE_URL`      | `http://localhost/watermanagement/`     | Base URL of the application           |
| `APP_USERNAME`  | `toto`                                   | Login username (see `login.png`)      |
| `APP_PASSWORD`  | `toto`                                   | Login password                        |
| `HEADLESS`      | `true`                                   | Set to `false` to watch the browser   |

Example:

```bash
BASE_URL=http://localhost/watermanagement/ \
APP_USERNAME=toto APP_PASSWORD=toto \
npx playwright test
```

## Running the tests

```bash
# Run the full suite (32 scenarios)
npx playwright test

# Run a single spec file
npx playwright test tests/03-vendors.spec.js

# Run a single scenario by name
npx playwright test -g "Scenario 13"

# Watch the browser while it runs
npx playwright test --headed

# Open the HTML report after a run
npx playwright show-report
```

## Important notes / assumptions

1. **Data mutation & ordering.** Several scenarios (vendors, customers,
   products, orders — Add/Edit/Delete/Buy/Sell) mutate real records and
   are written to run **in order, in a single worker**
   (`fullyParallel: false`, `workers: 1` in `playwright.config.js`). Each
   spec file's `beforeEach` returns to the relevant list screen, and most
   "Edit/Delete/Buy/Sell" scenarios operate on the **first row** of that
   list — which may be a different record after a previous scenario
   deleted/added rows. This mirrors how a human tester would work through
   the screens, but means the suite is best run against a disposable/test
   database (or re-seeded between runs) rather than production data.

2. **Confirmation dialogs.** "Delete" actions are assumed to trigger a
   native `confirm()` dialog; tests register
   `page.on('dialog', d => d.accept())` before clicking Delete. If your
   environment does not show a dialog, this handler is simply unused and
   harmless.

3. **New tabs for invoices.** "Sell Product -> Submit" (Scenario 22) and
   "Orders -> BILL" (Scenario 32) render an invoice that, in
   `customer-sell-success.png` / `order-bill.png`, looks like a separate
   page (different layout/background from the admin theme). The tests
   therefore wait for a possible new tab (`context.waitForEvent('page')`)
   and fall back to the current page if no new tab opens.

4. **`xpath_mapping.json` quirks carried over as-is:**
   - The `Login` and `Register` screens use `id="page-"` in their xpaths
     (e.g. `//*[@id="page-"]/form/...`). This is used verbatim, as
     instructed. If your running application renders a different id for
     these pages, update `data/xpath_mapping.json` accordingly — every
     test will pick up the change automatically through `xp()`.
   - `EditVendorSuccess.xpath` for "Success banner (Edited Success)" and
     `SellProduct.xpath` for "Price" are empty strings in
     `xpath_mapping.json`. These entries are **not used** by the tests
     (`utils/xpaths.js` throws a clear error if an empty xpath is ever
     requested); the corresponding assertions instead use visible text
     (`getByText(/Edited Success/i)`, etc.).
   - `ViewBill` has no xpaths defined at all (`[]`), so Scenario 32
     asserts on the invoice's visible text/labels instead
     (`Order No`, `GRAND TOTAL`, `Print`, `Export as PDF`).

5. **Headings reused across forms.** The screenshots show that the "Add
   Customer" form is rendered with the heading "Add Vendor Details" and
   the "Edit Customer" form with "Edit customer Details" (lower-case
   "c"). Scenarios 19 and 20 use tolerant/case-insensitive heading matches
   to account for this without failing on a cosmetic inconsistency.

## Gaps found between `navigation_graph.json` and `xpath_mapping.json`

While building the suite, the following inconsistencies were found between
the navigation graph, the xpath mapping and the screenshots. They do not
block testing (the corresponding UI elements and target screens exist), but
are worth fixing in the source graph for completeness:

- `navigation_graph.json` has **no edge** for:
  - `Products -> ProductsSearchResults` (label `Go`)
  - `ProductsSearchResults -> Products` (label `Back`)
  - `Products -> DeleteProductSuccess` (label `Delete`)
  - `Orders -> OrdersSearchResults` (label `Go`)
  - `OrdersSearchResults -> Orders` (label `Back`)

  ...even though `xpath_mapping.json` defines the corresponding elements
  and target screens/nodes (`ProductsSearchResults`,
  `DeleteProductSuccess`, `OrdersSearchResults` all exist as nodes, but
  with no incoming/outgoing edges). These are covered by Scenarios 23, 24,
  27, 28, 29.

- `xpath_mapping.json` contains a `"Search"` entry (`//*[@id="input_search"]`)
  for screens that have no visible search box in the screenshots
  (`AddCustomer`, `EditCustomer`, `AddVendorSuccess`'s analogues, etc.).
  These look like leftovers from copy-pasted templates and are not used by
  the tests.
