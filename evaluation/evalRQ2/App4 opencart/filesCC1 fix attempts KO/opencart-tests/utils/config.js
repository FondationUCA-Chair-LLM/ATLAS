// utils/config.js
//
// Single source of truth for the application URL under test, shared by
// playwright.config.js (so every test's relative goto()/baseURL works)
// and global-setup.js (which launches its own ad-hoc browser context
// outside of the normal test fixtures and therefore needs the URL too).

const BASE_URL = 'http://localhost/opencart';

module.exports = { BASE_URL };
