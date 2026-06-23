// tests/07-checkout-order.spec.js
//
// TC36 - TC42: the linear "Checkout" funnel from the navigation graph
// (Payment/Shipping Address -> Shipping method -> Payment method ->
// Final confirmation -> Order Success). global-setup.js already placed
// one prior order for this user, so this SECOND checkout is expected to
// show the "I want to use an existing address" radios pre-filled with
// the address saved during that first order - exactly like the
// checkout_two.png / shipping_method.png / payment_method.png /
// checkout_final.png reference screenshots.
//
// These 7 scenarios describe one continuous wizard, so they run with
// test.describe.serial and share a single page across steps, exactly
// like a real shopper would not reload between each part of checkout.

const path = require('path');
const { test, expect } = require('@playwright/test');
const { xp } = require('../utils/xpath');
const {
  openDesktopsMacCategory,
  openCartFromHeader,
  proceedToCheckoutFromCart,
  clearCart,
} = require('../utils/actions');
const { ADDRESS } = require('../utils/testData');

const STORAGE_STATE = path.join(__dirname, '..', '.auth', 'user.json');

test.describe.serial('Checkout & order placement (authenticated, 2nd order)', () => {
  test.use({ storageState: STORAGE_STATE });

  let page;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: STORAGE_STATE });
    page = await context.newPage();

    await page.goto('/opencart/');
    await clearCart(page, 'Home_Authenticated'); // defensive: ignore whatever earlier specs left behind
    await openDesktopsMacCategory(page, 'Home_Authenticated');
    await page.locator(xp('Category_Mac_Auth', 'iMac')).click();
    await page.locator(xp('Product_Detail_Auth', 'Add to Cart')).click();
    await openCartFromHeader(page, 'Home_Authenticated');
    await proceedToCheckoutFromCart(page);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('TC36 - Payment Address pre-fills the previously saved address', async () => {
    await expect(page.getByRole('heading', { name: 'Payment Address' })).toBeVisible();
    await expect(page.getByText('I want to use an existing address')).toBeVisible();
    await expect(page.getByText(new RegExp(ADDRESS.address1))).toBeVisible();
  });

  test('TC37 - Shipping Address also pre-fills the same saved address', async () => {
    await expect(page.getByRole('heading', { name: 'Shipping Address' })).toBeVisible();
    const shippingSection = page
      .locator('text=Shipping Address')
      .locator('xpath=ancestor::*[self::div or self::section][1]');
    await expect(shippingSection.getByText(new RegExp(ADDRESS.address1))).toBeVisible();
  });

  test('TC38 - Choosing the Flat Shipping Rate updates the Shipping Method field', async () => {
    await page.locator(xp('Checkout_Auth_Shipping', 'Choose Shipping Method')).click();

    await expect(page.getByRole('heading', { name: 'Shipping method options' })).toBeVisible();
    const flatRate = page.locator(xp('Checkout_Auth_Shipping_options', 'Flat Shipping Rate'));
    await expect(flatRate).toBeChecked(); // it's the only option, pre-selected
    await page.locator(xp('Checkout_Auth_Shipping_options', 'Continue')).click();

    await expect(
      page.locator(xp('Checkout_Auth_Shippement_method_selected', 'Flat Shipping Rate - $5.00'))
    ).toBeVisible();
  });

  test('TC39 - The order summary recalculates to include the Flat Shipping Rate', async () => {
    await expect(page.getByText('Flat Shipping Rate')).toBeVisible();
    await expect(page.getByText('$5.00').first()).toBeVisible();
    await expect(page.getByText('$105.00').first()).toBeVisible(); // $100.00 sub-total + $5.00 shipping
  });

  test('TC40 - Choosing Cash On Delivery updates the Payment Method field', async () => {
    await page.locator(xp('Checkout_Auth_Shippement_method_selected', 'Choose Payment Method')).click();

    await expect(page.getByRole('heading', { name: 'Payment method options' })).toBeVisible();
    await page.locator(xp('Checkout_Auth_Payment_options', 'Cash On Delivery')).check();
    await page.locator(xp('Checkout_Auth_Payment_options', 'Continue')).click();

    await expect(page.getByText('Cash On Delivery')).toBeVisible();
  });

  test('TC41 - Confirming the order shows the Order Success page', async () => {
    await page.locator(xp('Checkout_Auth_Final', 'Confirm Order')).click();

    await expect(page.getByRole('heading', { name: 'Your order has been placed!' })).toBeVisible();
    await expect(page.getByText('Your order has been successfully processed!')).toBeVisible();
  });

  test('TC42 - "Continue" returns Home and the cart resets to empty', async () => {
    await page.locator(xp('Order_Success_Auth', 'Continue')).click();

    await expect(page).toHaveURL(/route=common\/home|\/opencart\/?$/);
    await expect(page.locator('#top')).toContainText('0 item');
  });
});
