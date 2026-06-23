# Gruyere – Playwright Acceptance Test Suite

## What is in this folder?

| File | Purpose |
|------|---------|
| `scenarios.md` | 12 acceptance test scenarios written in natural language |
| `gruyere.spec.js` | Playwright test scripts, one `test()` block per scenario |
| `playwright.config.js` | Playwright project configuration |
| `README.md` | This file |

---

## Prerequisites

- **Node.js** ≥ 18 (LTS recommended)
- **npm** ≥ 9

---

## Setup

```bash
# 1. Install Playwright and its test runner
npm init playwright@latest --yes

# 2. Install browser binaries
npx playwright install chromium firefox
```

No other dependencies are required – all tests import only `@playwright/test`.

---

## Running the tests

```bash
# Run the full suite (all 12 scenarios, Chromium + Firefox)
npx playwright test --config playwright.config.js

# Run a single scenario by name
npx playwright test --config playwright.config.js -g "S07"

# Run in headed mode (watch the browser)
npx playwright test --config playwright.config.js --headed

# Open the HTML report after a run
npx playwright show-report playwright-report
```

---

## Test scenarios covered (12 total)

| # | Scenario title | Key assertion |
|---|---------------|---------------|
| S01 | Start and reach the anonymous home page | Anon nav visible after "Agree & Start" |
| S02 | Navigate to the Sign Up page | Sign Up form elements present |
| S03 | Navigate back to Home from Sign Up | Home page restored via menu link |
| S04 | Create a new account successfully | "Account created." confirmation |
| S05 | Reach the authenticated home page after creation | Auth nav (My Snippets, Profile, Sign out) |
| S06 | Sign out from the authenticated home page | Anon nav restored, no Profile/Sign out |
| S07 | Add a new snippet | Snippet appears in My Snippets list |
| S08 | View My Snippets when empty | "No snippets." message + Refresh link |
| S09 | Navigate from empty My Snippets to authenticated Home | Auth Home page restored |
| S10 | Access and view the Profile page | All profile fields present and pre-filled |
| S11 | Update the profile and return to authenticated Home | Auth Home page displayed after Update |
| S12 | Full end-to-end happy path | All 12 navigation steps pass in sequence |

---

## Important notes

- **Upload excluded** – the `Upload` feature is intentionally not tested, as per specification.
- **Serial execution** – `workers: 1` in `playwright.config.js` prevents two tests from creating the same username on the shared Gruyere instance simultaneously. Scenarios S08 and S09 generate a timestamp-based unique username to guarantee a fresh account with no snippets.
- **Live service** – Gruyere runs on `google-gruyere.appspot.com`. Each run starts a new instance via the `/start` URL; the instance ID is embedded in all subsequent URLs, which is why `goToAnonHome()` waits for the URL pattern `/\d+\/?$/` rather than a fixed path.
- **XPaths** – all locators use the exact XPaths from `xpath_mapping.json`. If the application HTML structure changes, update the XPaths here accordingly.
