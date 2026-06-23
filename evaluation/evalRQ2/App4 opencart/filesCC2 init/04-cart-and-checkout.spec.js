// 04-cart-and-checkout.spec.js
//
// Covers Add to Cart through to Order Success — the longest chain in the
// navigation graph. Every test starts from the root (Home_Anonymous), logs
// in, and walks the exact graph path up to the edge under test. Later tests
// in this file necessarily replay more of the chain than earlier ones,
// which is expected: this is what "always start from the root" means for a
// deep, mostly-linear checkout flow.

const { test, expect } = require('@playwright/test');
const actions = require('./helpers/actions');
const { locate } = require('./helpers/xpathLoader');
const { EXISTING_USER, CHECKOUT_ADDRESS, PRODUCT_IMAC } = require('./helpers/testData');

/**
 * Shared precondition for this whole file: log in, browse to the iMac via
 * Search (the shortest graph path to Product_Detail_Auth), and land on the
 * product page ready to add it to the cart.
 */
async function reachProductDetailAuth(page) {
  await page.goto('/');
  await actions.loginAsExistingUser(page, EXISTING_USER);
  await actions.clickMyAccountHome(page);
  await actions.searchFromHome(page, 'Home_Authenticated', 'imac');
  await actions.clickSearchResultIMac(page, 'Search_Results_Auth');
  await expect(page.getByRole('heading', { name: 'iMac', exact: true })).toBeVisible();
}

test.describe('Add to cart and checkout flow', () => {
  // Edge 26: Product_Detail_Auth --Add to Cart--> Product_Detail_Auth_Cart
  test('TC-28 | Adding the iMac to the cart confirms success on the product page', async ({
    page,
  }) => {
    await reachProductDetailAuth(page);

    await actions.addProductToCart(page, '1');

    await expect(page.getByText(/Success: You have added/i)).toBeVisible();
    await expect(locate(page, 'Product_Detail_Auth_Cart', 'Shopping Cart')).toBeVisible();
  });

  // Edge 27: Product_Detail_Auth_Cart --Shopping Cart--> Shopping_Cart_Auth
  test('TC-29 | Opening the cart after adding the iMac shows it in the cart table', async ({
    page,
  }) => {
    await reachProductDetailAuth(page);
    await actions.addProductToCart(page, '1');

    await actions.clickHeaderShoppingCartLink(page, 'Product_Detail_Auth_Cart');

    await expect(page).toHaveURL(/route=checkout\/cart/);
    await expect(page.getByRole('cell', { name: PRODUCT_IMAC.name })).toBeVisible();
    await expect(page.getByText(PRODUCT_IMAC.unitPrice)).toBeVisible();
  });

  // Edge 38: Shopping_Cart_Auth --Continue Shopping--> Home_Authenticated
  test('TC-30 | "Continue Shopping" from the cart returns to the authenticated home page', async ({
    page,
  }) => {
    await reachProductDetailAuth(page);
    await actions.addProductToCart(page, '1');
    await actions.clickHeaderShoppingCartLink(page, 'Product_Detail_Auth_Cart');

    await actions.clickCartContinueShopping(page);

    await expect(locate(page, 'Home_Authenticated', 'Desktops')).toBeVisible();
  });

  // Edge 30: Shopping_Cart_Auth --Checkout--> Checkout_Auth
  test('TC-31 | "Checkout" from the cart opens the checkout payment-address step', async ({
    page,
  }) => {
    await reachProductDetailAuth(page);
    await actions.addProductToCart(page, '1');
    await actions.clickHeaderShoppingCartLink(page, 'Product_Detail_Auth_Cart');

    await actions.clickCartCheckout(page);

    await expect(page).toHaveURL(/route=checkout\/checkout/);
    await expect(page.getByRole('heading', { name: 'Payment Address' })).toBeVisible();
  });

  // Edge 31: Checkout_Auth --Continue--> Checkout_Auth_Shipping
  test('TC-32 | Submitting a valid payment address moves to shipping/payment selection', async ({
    page,
  }) => {
    await reachProductDetailAuth(page);
    await actions.addProductToCart(page, '1');
    await actions.clickHeaderShoppingCartLink(page, 'Product_Detail_Auth_Cart');
    await actions.clickCartCheckout(page);

    await actions.fillAndSubmitCheckoutAddress(page, CHECKOUT_ADDRESS);

    await expect(locate(page, 'Checkout_Auth_Shipping', 'Choose Shipping Method')).toBeVisible();
    await expect(locate(page, 'Checkout_Auth_Shipping', 'Choose Payment Method')).toBeVisible();
  });

  // Edge 32: Checkout_Auth_Shipping --Choose--> Checkout_Auth_Shipping_options
  test('TC-33 | "Choose" shipping method opens the shipping method options', async ({
    page,
  }) => {
    await reachProductDetailAuth(page);
    await actions.addProductToCart(page, '1');
    await actions.clickHeaderShoppingCartLink(page, 'Product_Detail_Auth_Cart');
    await actions.clickCartCheckout(page);
    await actions.fillAndSubmitCheckoutAddress(page, CHECKOUT_ADDRESS);

    await actions.openShippingMethodModal(page);

    await expect(locate(page, 'Checkout_Auth_Shipping_options', 'Flat Shipping Rate')).toBeVisible();
  });

  // Edge 33: Checkout_Auth_Shipping_options --Continue--> Checkout_Auth_Shippement_method_selected
  test('TC-34 | Selecting Flat Rate shipping confirms the $5.00 shipping line', async ({
    page,
  }) => {
    await reachProductDetailAuth(page);
    await actions.addProductToCart(page, '1');
    await actions.clickHeaderShoppingCartLink(page, 'Product_Detail_Auth_Cart');
    await actions.clickCartCheckout(page);
    await actions.fillAndSubmitCheckoutAddress(page, CHECKOUT_ADDRESS);
    await actions.openShippingMethodModal(page);

    await actions.selectFlatShippingAndContinue(page);

    await expect(
      locate(page, 'Checkout_Auth_Shippement_method_selected', 'Flat Shipping Rate - $5.00')
    ).toHaveText(/Flat Shipping Rate.*\$5\.00/);
  });

  // Edge 34: Checkout_Auth_Shippement_method_selected --Choose--> Checkout_Auth_Payment_options
  test('TC-35 | "Choose" payment method opens the payment method options', async ({
    page,
  }) => {
    await reachProductDetailAuth(page);
    await actions.addProductToCart(page, '1');
    await actions.clickHeaderShoppingCartLink(page, 'Product_Detail_Auth_Cart');
    await actions.clickCartCheckout(page);
    await actions.fillAndSubmitCheckoutAddress(page, CHECKOUT_ADDRESS);
    await actions.openShippingMethodModal(page);
    await actions.selectFlatShippingAndContinue(page);

    await actions.openPaymentMethodModal(page);

    await expect(locate(page, 'Checkout_Auth_Payment_options', 'Cash On Delivery')).toBeVisible();
  });

  // Edge 35: Checkout_Auth_Payment_options --Continue--> Checkout_Auth_Final
  test('TC-36 | Selecting Cash On Delivery moves to the final order review', async ({
    page,
  }) => {
    await reachProductDetailAuth(page);
    await actions.addProductToCart(page, '1');
    await actions.clickHeaderShoppingCartLink(page, 'Product_Detail_Auth_Cart');
    await actions.clickCartCheckout(page);
    await actions.fillAndSubmitCheckoutAddress(page, CHECKOUT_ADDRESS);
    await actions.openShippingMethodModal(page);
    await actions.selectFlatShippingAndContinue(page);
    await actions.openPaymentMethodModal(page);

    await actions.selectCashOnDeliveryAndContinue(page);

    await expect(locate(page, 'Checkout_Auth_Final', 'Confirm Order')).toBeVisible();
  });

  // Edge 36: Checkout_Auth_Final --Confirm Order--> Order_Success_Auth
  test('TC-37 | Confirming the order places it successfully', async ({ page }) => {
    await reachProductDetailAuth(page);
    await actions.addProductToCart(page, '1');
    await actions.clickHeaderShoppingCartLink(page, 'Product_Detail_Auth_Cart');
    await actions.clickCartCheckout(page);
    await actions.fillAndSubmitCheckoutAddress(page, CHECKOUT_ADDRESS);
    await actions.openShippingMethodModal(page);
    await actions.selectFlatShippingAndContinue(page);
    await actions.openPaymentMethodModal(page);
    await actions.selectCashOnDeliveryAndContinue(page);

    await actions.confirmOrder(page);

    await expect(page).toHaveURL(/route=checkout\/success/);
    await expect(page.getByRole('heading', { name: 'Your order has been placed!' })).toBeVisible();
  });

  // Edge 37: Order_Success_Auth --Continue--> Home_Authenticated
  test('TC-38 | "Continue" after a successful order returns to authenticated home', async ({
    page,
  }) => {
    await reachProductDetailAuth(page);
    await actions.addProductToCart(page, '1');
    await actions.clickHeaderShoppingCartLink(page, 'Product_Detail_Auth_Cart');
    await actions.clickCartCheckout(page);
    await actions.fillAndSubmitCheckoutAddress(page, CHECKOUT_ADDRESS);
    await actions.openShippingMethodModal(page);
    await actions.selectFlatShippingAndContinue(page);
    await actions.openPaymentMethodModal(page);
    await actions.selectCashOnDeliveryAndContinue(page);
    await actions.confirmOrder(page);

    await actions.clickOrderSuccessContinue(page);

    await expect(locate(page, 'Home_Authenticated', 'Desktops')).toBeVisible();
  });
});
