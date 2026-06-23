// utils/auth.js
const { expect } = require('@playwright/test');
const { xp } = require('./xpaths');
const { credentials } = require('./testData');

/**
 * Logs the given page in as an Administrator and waits for the Dashboard
 * side menu to be visible.
 *
 * Implements the "Login" -> "Dashboard" transition from
 * navigation_graph.json using the xpaths defined for the "Login" screen
 * in xpath_mapping.json.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} [username]
 * @param {string} [password]
 */
async function login(page, username = credentials.username, password = credentials.password) {
  await page.goto('login.php');

  await page.locator(xp('Login', 'Username')).fill(username);
  await page.locator(xp('Login', 'Password')).fill(password);
  await page.locator(xp('Login', 'Login')).click();

  // The "Dashboard" entry in the side menu is the signal that the
  // Login -> Dashboard transition succeeded.
  await expect(page.locator(xp('Dashboard', 'Dashboard'))).toBeVisible();
}

module.exports = { login };
