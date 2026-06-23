// utils/testData.js
//
// Shared test data / configuration. Credentials can be overridden via
// environment variables so the same suite can run against different
// environments without code changes.

const credentials = {
  username: process.env.APP_USERNAME || 'toto',
  password: process.env.APP_PASSWORD || 'toto',
};

/**
 * Returns a short, time-based suffix used to keep test data
 * (vendor/customer/product names) unique across test runs.
 */
function uniqueSuffix() {
  return Date.now().toString();
}

module.exports = { credentials, uniqueSuffix };
