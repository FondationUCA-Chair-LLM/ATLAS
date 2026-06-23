import { test, expect } from "@playwright/test";

// Base URL: http://localhost/upload

// Test Data
const testData = {
  "test-path-Home_Anonymous-to-Login_Page": {
    search: "imac",
    e_mail_address: "toto@gmail.com",
    password: "toto1234",
  },
  "test-path-Home_Anonymous-to-Register_Account": {
    search: "imac",
    first_name: "toto",
    last_name: "toto",
    e_mail: "toto@gmail.com",
    password: "toto1234",
    subscribe: "false",
    i_have_read_and_agree_to_the_privacy_policy: "true",
  },
  "test-path-Home_Anonymous-to-Register_Account-lyqy": {
    search: "imac",
    e_mail_address: "toto@gmail.com",
    password: "toto1234",
    first_name: "toto",
    last_name: "toto",
    e_mail: "toto@gmail.com",
    subscribe: "false",
    i_have_read_and_agree_to_the_privacy_policy: "true",
  },
  "test-path-Home_Anonymous-to-My_Account": {
    search: "imac",
    e_mail_address: "toto@gmail.com",
    password: "toto1234",
  },
  "test-path-Home_Anonymous-to-Login_Page-enyc": {
    search: "imac",
    first_name: "toto",
    last_name: "toto",
    e_mail: "toto@gmail.com",
    password: "toto1234",
    subscribe: "false",
    i_have_read_and_agree_to_the_privacy_policy: "true",
    e_mail_address: "toto@gmail.com",
  },
  "test-path-Home_Anonymous-to-Account_Created": {
    search: "imac",
    first_name: "toto",
    last_name: "toto",
    e_mail: "toto@gmail.com",
    password: "toto1234",
    subscribe: "false",
    i_have_read_and_agree_to_the_privacy_policy: "true",
  },
  "test-path-Home_Anonymous-to-My_Account-xz4d": {
    search: "imac",
    first_name: "toto",
    last_name: "toto",
    e_mail: "toto@gmail.com",
    password: "toto1234",
    subscribe: "false",
    i_have_read_and_agree_to_the_privacy_policy: "true",
  },
  "test-path-Home_Anonymous-to-Home_Anonymous_drop_down": {
    search: "imac",
  },
  "test-path-Home_Anonymous-to-Search_Results_Anon": {
    search: "imac",
    field: "imac",
    search_in_product_descriptions: "false",
    all_categories: "All Categories",
    search_in_subcategories: "false",
    sort_by: "Default",
    show: "10",
  },
  "test-path-Home_Anonymous-to-Shopping_Cart_Empty": {
    search: "imac",
  },
  "test-path-Home_Anonymous-to-Contact_Us_Anon": {
    search: "imac",
    currency: "*",
    your_name: "toto",
    e_mail_address: "toto@gmail.com",
    enquiry: "This is a test Enquiry",
  },
  "test-path-Home_Anonymous-to-Product_Detail_Anon": {
    search: "imac",
    field: "imac",
    search_in_product_descriptions: "false",
    all_categories: "All Categories",
    search_in_subcategories: "false",
    sort_by: "Default",
    show: "10",
    currency: "*",
    qty: "1",
  },
  "test-path-Home_Anonymous-to-Home_Anonymous": {
    search: "imac",
    field: "imac",
    search_in_product_descriptions: "false",
    all_categories: "All Categories",
    search_in_subcategories: "false",
    sort_by: "Default",
    show: "10",
  },
  "test-path-Home_Anonymous-to-Home_Anonymous-pof9": {
    search: "imac",
  },
  "test-path-Home_Anonymous-to-Contact_Submitted_Anon": {
    search: "imac",
    currency: "*",
    your_name: "toto",
    e_mail_address: "toto@gmail.com",
    enquiry: "This is a test Enquiry",
  },
  "test-path-Home_Anonymous-to-Home_Anonymous-gyj4": {
    search: "imac",
    currency: "*",
    your_name: "toto",
    e_mail_address: "toto@gmail.com",
    enquiry: "This is a test Enquiry",
  },
  "test-path-Home_Anonymous-to-Home_Authenticated": {
    search: "imac",
    e_mail_address: "toto@gmail.com",
    password: "toto1234",
  },
  "test-path-Home_Anonymous-to-Reward_Points": {
    search: "imac",
    e_mail_address: "toto@gmail.com",
    password: "toto1234",
  },
  "test-path-Home_Anonymous-to-Wishlist_Empty": {
    search: "imac",
    e_mail_address: "toto@gmail.com",
    password: "toto1234",
  },
  "test-path-Home_Anonymous-to-Home_Anonymous-zoa1": {
    search: "imac",
    e_mail_address: "toto@gmail.com",
    password: "toto1234",
  },
  "test-path-Home_Anonymous-to-My_Account-yo7l": {
    search: "imac",
    e_mail_address: "toto@gmail.com",
    password: "toto1234",
  },
  "test-path-Home_Anonymous-to-Home_Authenticated_Desktop": {
    search: "imac",
    e_mail_address: "toto@gmail.com",
    password: "toto1234",
  },
  "test-path-Home_Anonymous-to-Search_Results_Auth": {
    search: "imac",
    e_mail_address: "toto@gmail.com",
    password: "toto1234",
    field: "imac",
    search_in_product_descriptions: "false",
    all_categories: "All Categories",
    search_in_subcategories: "false",
    sort_by: "Default",
    show: "10",
  },
  "test-path-Home_Anonymous-to-Contact_Us_Auth": {
    search: "imac",
    e_mail_address: "toto@gmail.com",
    password: "toto1234",
    your_name: "toto",
    enquiry: "This is a test Enquiry",
  },
  "test-path-Home_Anonymous-to-Category_Mac_Auth": {
    search: "imac",
    e_mail_address: "toto@gmail.com",
    password: "toto1234",
    sort_by: "Default",
    show: "10",
  },
  "test-path-Home_Anonymous-to-Product_Detail_Auth": {
    search: "imac",
    e_mail_address: "toto@gmail.com",
    password: "toto1234",
    sort_by: "Default",
    show: "10",
    field: "imac",
    qty: "1",
  },
  "test-path-Home_Anonymous-to-Product_Detail_Auth-07v9": {
    search: "imac",
    e_mail_address: "toto@gmail.com",
    password: "toto1234",
    field: "imac",
    search_in_product_descriptions: "false",
    all_categories: "All Categories",
    search_in_subcategories: "false",
    sort_by: "Default",
    show: "10",
    qty: "1",
  },
  "test-path-Home_Anonymous-to-Home_Authenticated-lev3": {
    search: "imac",
    e_mail_address: "toto@gmail.com",
    password: "toto1234",
    field: "imac",
    search_in_product_descriptions: "false",
    all_categories: "All Categories",
    search_in_subcategories: "false",
    sort_by: "Default",
    show: "10",
  },
  "test-path-Home_Anonymous-to-Product_Detail_Auth_Cart": {
    search: "imac",
    e_mail_address: "toto@gmail.com",
    password: "toto1234",
    field: "imac",
    search_in_product_descriptions: "false",
    all_categories: "All Categories",
    search_in_subcategories: "false",
    sort_by: "Default",
    show: "10",
    qty: "1",
  },
  "test-path-Home_Anonymous-to-Shopping_Cart_Auth": {
    search: "imac",
    e_mail_address: "toto@gmail.com",
    password: "toto1234",
    field: "imac",
    search_in_product_descriptions: "false",
    all_categories: "All Categories",
    search_in_subcategories: "false",
    sort_by: "Default",
    show: "10",
    qty: "1",
    estimate_shipping_taxes: "*",
    use_coupon_code: "*",
  },
  "test-path-Home_Anonymous-to-My_Account-u908": {
    search: "imac",
    e_mail_address: "toto@gmail.com",
    password: "toto1234",
  },
  "test-path-Home_Anonymous-to-Checkout_Auth": {
    search: "imac",
    e_mail_address: "toto@gmail.com",
    password: "toto1234",
    field: "imac",
    search_in_product_descriptions: "false",
    all_categories: "All Categories",
    search_in_subcategories: "false",
    sort_by: "Default",
    show: "10",
    qty: "1",
    estimate_shipping_taxes: "*",
    use_coupon_code: "*",
    first_name: "toto",
    last_name: "toto",
    company: "Company",
    address_1: "23 rue paris",
    address_2: "Address 2",
    city: "Paris",
    post_code: "98000",
    country: "France, Metropolitan",
    region_state: "Paris",
  },
  "test-path-Home_Anonymous-to-Home_Authenticated-afoi": {
    search: "imac",
    e_mail_address: "toto@gmail.com",
    password: "toto1234",
    field: "imac",
    search_in_product_descriptions: "false",
    all_categories: "All Categories",
    search_in_subcategories: "false",
    sort_by: "Default",
    show: "10",
    qty: "1",
    estimate_shipping_taxes: "*",
    use_coupon_code: "*",
  },
  "test-path-Home_Anonymous-to-Checkout_Auth_Shipping": {
    search: "imac",
    e_mail_address: "toto@gmail.com",
    password: "toto1234",
    field: "imac",
    search_in_product_descriptions: "false",
    all_categories: "All Categories",
    search_in_subcategories: "false",
    sort_by: "Default",
    show: "10",
    qty: "1",
    estimate_shipping_taxes: "*",
    use_coupon_code: "*",
    first_name: "toto",
    last_name: "toto",
    company: "Company",
    address_1: "23 rue paris",
    address_2: "Address 2",
    city: "Paris",
    post_code: "98000",
    country: "France, Metropolitan",
    region_state: "Paris",
    i_want_to_use_an_existing_address: "true",
    i_want_to_use_a_new_address: "false",
    choose_shipping_method: "corrupti",
    choose_payment_method: "virga",
  },
  "test-path-Home_Anonymous-to-Checkout_Auth_Shipping_options": {
    search: "imac",
    e_mail_address: "toto@gmail.com",
    password: "toto1234",
    field: "imac",
    search_in_product_descriptions: "false",
    all_categories: "All Categories",
    search_in_subcategories: "false",
    sort_by: "Default",
    show: "10",
    qty: "1",
    estimate_shipping_taxes: "*",
    use_coupon_code: "*",
    first_name: "toto",
    last_name: "toto",
    company: "Company",
    address_1: "23 rue paris",
    address_2: "Address 2",
    city: "Paris",
    post_code: "98000",
    country: "France, Metropolitan",
    region_state: "Paris",
    i_want_to_use_an_existing_address: "true",
    i_want_to_use_a_new_address: "false",
    choose_shipping_method: "synagoga",
    choose_payment_method: "patruus",
    flat_shipping_rate_5_00: "true",
  },
  "test-path-Home_Anonymous-to-Checkout_Auth_Shippement_method_selected": {
    search: "imac",
    e_mail_address: "toto@gmail.com",
    password: "toto1234",
    field: "imac",
    search_in_product_descriptions: "false",
    all_categories: "All Categories",
    search_in_subcategories: "false",
    sort_by: "Default",
    show: "10",
    qty: "1",
    estimate_shipping_taxes: "*",
    use_coupon_code: "*",
    first_name: "toto",
    last_name: "toto",
    company: "Company",
    address_1: "23 rue paris",
    address_2: "Address 2",
    city: "Paris",
    post_code: "98000",
    country: "France, Metropolitan",
    region_state: "Paris",
    i_want_to_use_an_existing_address: "true",
    i_want_to_use_a_new_address: "false",
    choose_shipping_method: "armarium",
    choose_payment_method: "armarium",
    flat_shipping_rate_5_00: "true",
  },
  "test-path-Home_Anonymous-to-Checkout_Auth_Payment_options": {
    search: "imac",
    e_mail_address: "toto@gmail.com",
    password: "toto1234",
    field: "imac",
    search_in_product_descriptions: "false",
    all_categories: "All Categories",
    search_in_subcategories: "false",
    sort_by: "Default",
    show: "10",
    qty: "1",
    estimate_shipping_taxes: "*",
    use_coupon_code: "*",
    first_name: "toto",
    last_name: "toto",
    company: "Company",
    address_1: "23 rue paris",
    address_2: "Address 2",
    city: "Paris",
    post_code: "98000",
    country: "France, Metropolitan",
    region_state: "Paris",
    i_want_to_use_an_existing_address: "true",
    i_want_to_use_a_new_address: "false",
    choose_shipping_method: "adsum",
    choose_payment_method: "usitas",
    flat_shipping_rate_5_00: "true",
    bank_transfer: "false",
    cheque_money_order: "false",
    cash_on_delivery: "true",
  },
  "test-path-Home_Anonymous-to-Checkout_Auth_Final": {
    search: "imac",
    e_mail_address: "toto@gmail.com",
    password: "toto1234",
    field: "imac",
    search_in_product_descriptions: "false",
    all_categories: "All Categories",
    search_in_subcategories: "false",
    sort_by: "Default",
    show: "10",
    qty: "1",
    estimate_shipping_taxes: "*",
    use_coupon_code: "*",
    first_name: "toto",
    last_name: "toto",
    company: "Company",
    address_1: "23 rue paris",
    address_2: "Address 2",
    city: "Paris",
    post_code: "98000",
    country: "France, Metropolitan",
    region_state: "Paris",
    i_want_to_use_an_existing_address: "true",
    i_want_to_use_a_new_address: "false",
    choose_shipping_method: "paulatim",
    choose_payment_method: "suggero",
    flat_shipping_rate_5_00: "true",
    bank_transfer: "false",
    cheque_money_order: "false",
    cash_on_delivery: "true",
  },
  "test-path-Home_Anonymous-to-Order_Success_Auth": {
    search: "imac",
    e_mail_address: "toto@gmail.com",
    password: "toto1234",
    field: "imac",
    search_in_product_descriptions: "false",
    all_categories: "All Categories",
    search_in_subcategories: "false",
    sort_by: "Default",
    show: "10",
    qty: "1",
    estimate_shipping_taxes: "*",
    use_coupon_code: "*",
    first_name: "toto",
    last_name: "toto",
    company: "Company",
    address_1: "23 rue paris",
    address_2: "Address 2",
    city: "Paris",
    post_code: "98000",
    country: "France, Metropolitan",
    region_state: "Paris",
    i_want_to_use_an_existing_address: "true",
    i_want_to_use_a_new_address: "false",
    choose_shipping_method: "accusator",
    choose_payment_method: "volubilis",
    flat_shipping_rate_5_00: "true",
    bank_transfer: "false",
    cheque_money_order: "false",
    cash_on_delivery: "true",
  },
  "test-path-Home_Anonymous-to-Home_Authenticated-gmsw": {
    search: "imac",
    e_mail_address: "toto@gmail.com",
    password: "toto1234",
    field: "imac",
    search_in_product_descriptions: "false",
    all_categories: "All Categories",
    search_in_subcategories: "false",
    sort_by: "Default",
    show: "10",
    qty: "1",
    estimate_shipping_taxes: "*",
    use_coupon_code: "*",
    first_name: "toto",
    last_name: "toto",
    company: "Company",
    address_1: "23 rue paris",
    address_2: "Address 2",
    city: "Paris",
    post_code: "98000",
    country: "France, Metropolitan",
    region_state: "Paris",
    i_want_to_use_an_existing_address: "true",
    i_want_to_use_a_new_address: "false",
    choose_shipping_method: "tristis",
    choose_payment_method: "benevolentia",
    flat_shipping_rate_5_00: "true",
    bank_transfer: "false",
    cheque_money_order: "false",
    cash_on_delivery: "true",
  },
  "test-path-Home_Anonymous-to-Contact_Submitted_Auth": {
    search: "imac",
    e_mail_address: "toto@gmail.com",
    password: "toto1234",
    your_name: "toto",
    enquiry: "This is a test Enquiry",
  },
  "test-path-Home_Anonymous-to-Home_Authenticated-tg9c": {
    search: "imac",
    e_mail_address: "toto@gmail.com",
    password: "toto1234",
    your_name: "toto",
    enquiry: "This is a test Enquiry",
  },
};

test.beforeEach(async () => {});

test("home anonymous - my account - home anonymous drop down - login - login page", async ({
  page,
}) => {
  const data = testData["test-path-Home_Anonymous-to-Login_Page"];

  await page.goto("http://localhost/upload");
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/ul/li[2]/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="input-email"]')
    .fill(data["e_mail_address"]);
  await page.locator('xpath=//*[@id="input-password"]').fill(data["password"]);
  // Verify: text("Shopping Cart")
  var item = page.getByText("Shopping Cart");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Order History")
  var item = page.getByText("Order History");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home anonymous - my account - home anonymous drop down - register - register account", async ({
  page,
}) => {
  const data = testData["test-path-Home_Anonymous-to-Register_Account"];

  await page.goto("http://localhost/upload");
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/ul/li[1]/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="input-firstname"]')
    .fill(data["first_name"]);
  await page.locator('xpath=//*[@id="input-lastname"]').fill(data["last_name"]);
  await page.locator('xpath=//*[@id="input-email"]').fill(data["e_mail"]);
  await page.locator('xpath=//*[@id="input-password"]').fill(data["password"]);
  if (data["subscribe"] === "true") {
    await page.locator('xpath=//*[@id="input-newsletter"]').check();
  } else {
    await page.locator('xpath=//*[@id="input-newsletter"]').uncheck();
  }
  if (data["i_have_read_and_agree_to_the_privacy_policy"] === "true") {
    await page.locator('xpath=//*[@id="input-agree"]').check();
  } else {
    await page.locator('xpath=//*[@id="input-agree"]').uncheck();
  }
  // Verify: text("Shopping Cart")
  var item = page.getByText("Shopping Cart");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Newsletter")
  var item = page.getByText("Newsletter");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home anonymous - my account - home anonymous drop down - login - login page - continue - register account", async ({
  page,
}) => {
  const data = testData["test-path-Home_Anonymous-to-Register_Account-lyqy"];

  await page.goto("http://localhost/upload");
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/ul/li[2]/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="input-email"]')
    .fill(data["e_mail_address"]);
  await page.locator('xpath=//*[@id="input-password"]').fill(data["password"]);
  await page.locator('xpath=//*[@id="content"]/div/div[1]/div/div/a').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="input-firstname"]')
    .fill(data["first_name"]);
  await page.locator('xpath=//*[@id="input-lastname"]').fill(data["last_name"]);
  await page.locator('xpath=//*[@id="input-email"]').fill(data["e_mail"]);
  await page.locator('xpath=//*[@id="input-password"]').fill(data["password"]);
  if (data["subscribe"] === "true") {
    await page.locator('xpath=//*[@id="input-newsletter"]').check();
  } else {
    await page.locator('xpath=//*[@id="input-newsletter"]').uncheck();
  }
  if (data["i_have_read_and_agree_to_the_privacy_policy"] === "true") {
    await page.locator('xpath=//*[@id="input-agree"]').check();
  } else {
    await page.locator('xpath=//*[@id="input-agree"]').uncheck();
  }
  // Verify: text("Shopping Cart")
  var item = page.getByText("Shopping Cart");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Newsletter")
  var item = page.getByText("Newsletter");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home anonymous - my account - home anonymous drop down - login - login page - login - my account", async ({
  page,
}) => {
  const data = testData["test-path-Home_Anonymous-to-My_Account"];

  await page.goto("http://localhost/upload");
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/ul/li[2]/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="input-email"]')
    .fill(data["e_mail_address"]);
  await page.locator('xpath=//*[@id="input-password"]').fill(data["password"]);
  await page.locator('xpath=//*[@id="form-login"]/div[3]/button').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  // Verify: text("Newsletter")
  var item = page.getByText("Newsletter");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Currency")
  var item = page.getByText("Currency");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home anonymous - my account - home anonymous drop down - register - register account - login page - login page", async ({
  page,
}) => {
  const data = testData["test-path-Home_Anonymous-to-Login_Page-enyc"];

  await page.goto("http://localhost/upload");
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/ul/li[1]/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="input-firstname"]')
    .fill(data["first_name"]);
  await page.locator('xpath=//*[@id="input-lastname"]').fill(data["last_name"]);
  await page.locator('xpath=//*[@id="input-email"]').fill(data["e_mail"]);
  await page.locator('xpath=//*[@id="input-password"]').fill(data["password"]);
  if (data["subscribe"] === "true") {
    await page.locator('xpath=//*[@id="input-newsletter"]').check();
  } else {
    await page.locator('xpath=//*[@id="input-newsletter"]').uncheck();
  }
  if (data["i_have_read_and_agree_to_the_privacy_policy"] === "true") {
    await page.locator('xpath=//*[@id="input-agree"]').check();
  } else {
    await page.locator('xpath=//*[@id="input-agree"]').uncheck();
  }
  await page.getByText("login page").click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="input-email"]')
    .fill(data["e_mail_address"]);
  await page.locator('xpath=//*[@id="input-password"]').fill(data["password"]);
  // Verify: text("Shopping Cart")
  var item = page.getByText("Shopping Cart");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Order History")
  var item = page.getByText("Order History");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home anonymous - my account - home anonymous drop down - register - register account - continue - account created", async ({
  page,
}) => {
  const data = testData["test-path-Home_Anonymous-to-Account_Created"];

  await page.goto("http://localhost/upload");
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/ul/li[1]/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="input-firstname"]')
    .fill(data["first_name"]);
  await page.locator('xpath=//*[@id="input-lastname"]').fill(data["last_name"]);
  await page.locator('xpath=//*[@id="input-email"]').fill(data["e_mail"]);
  await page.locator('xpath=//*[@id="input-password"]').fill(data["password"]);
  if (data["subscribe"] === "true") {
    await page.locator('xpath=//*[@id="input-newsletter"]').check();
  } else {
    await page.locator('xpath=//*[@id="input-newsletter"]').uncheck();
  }
  if (data["i_have_read_and_agree_to_the_privacy_policy"] === "true") {
    await page.locator('xpath=//*[@id="input-agree"]').check();
  } else {
    await page.locator('xpath=//*[@id="input-agree"]').uncheck();
  }
  await page.locator('xpath=//*[@id="form-register"]/div/button').click();

  // Verify: text("My Account")
  var item = page.getByText("My Account");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home anonymous - my account - home anonymous drop down - register - register account - continue - account created - continue - my account", async ({
  page,
}) => {
  const data = testData["test-path-Home_Anonymous-to-My_Account-xz4d"];

  await page.goto("http://localhost/upload");
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/ul/li[1]/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="input-firstname"]')
    .fill(data["first_name"]);
  await page.locator('xpath=//*[@id="input-lastname"]').fill(data["last_name"]);
  await page.locator('xpath=//*[@id="input-email"]').fill(data["e_mail"]);
  await page.locator('xpath=//*[@id="input-password"]').fill(data["password"]);
  if (data["subscribe"] === "true") {
    await page.locator('xpath=//*[@id="input-newsletter"]').check();
  } else {
    await page.locator('xpath=//*[@id="input-newsletter"]').uncheck();
  }
  if (data["i_have_read_and_agree_to_the_privacy_policy"] === "true") {
    await page.locator('xpath=//*[@id="input-agree"]').check();
  } else {
    await page.locator('xpath=//*[@id="input-agree"]').uncheck();
  }
  await page.locator('xpath=//*[@id="form-register"]/div/button').click();
  await page.locator('xpath=//*[@id="content"]/div/a').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  // Verify: text("Newsletter")
  var item = page.getByText("Newsletter");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Currency")
  var item = page.getByText("Currency");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home anonymous - my account - home anonymous drop down", async ({
  page,
}) => {
  const data = testData["test-path-Home_Anonymous-to-Home_Anonymous_drop_down"];

  await page.goto("http://localhost/upload");
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  // Verify: not text("Order History")
  var item = page.getByText("Order History");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeHidden();
  } else {
    await expect(item).toBeHidden();
  }
  // Verify: text("My Account")
  var item = page.getByText("My Account");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home anonymous - search - search results anon", async ({ page }) => {
  const data = testData["test-path-Home_Anonymous-to-Search_Results_Anon"];

  await page.goto("http://localhost/upload");
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/button')
    .click();

  if (data["search_in_subcategories"] === "true") {
    await page.locator('xpath=//*[@id="input-category"]').check();
  } else {
    await page.locator('xpath=//*[@id="input-category"]').uncheck();
  }

  // Verify: not text("Order History")
  var item = page.getByText("Order History");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeHidden();
  } else {
    await expect(item).toBeHidden();
  }
  // Verify: text("My Account")
  var item = page.getByText("My Account");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home anonymous - shopping cart - shopping cart empty", async ({
  page,
}) => {
  const data = testData["test-path-Home_Anonymous-to-Shopping_Cart_Empty"];

  await page.goto("http://localhost/upload");
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page.locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[4]/a').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  // Verify: text("Shopping Cart")
  var item = page.getByText("Shopping Cart");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Information")
  var item = page.getByText("Information");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home anonymous - 123456789 - contact us anon", async ({ page }) => {
  const data = testData["test-path-Home_Anonymous-to-Contact_Us_Anon"];

  await page.goto("http://localhost/upload");
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page.locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[1]/a').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page.locator('xpath=//*[@id="input-name"]').fill(data["your_name"]);
  await page
    .locator('xpath=//*[@id="input-email"]')
    .fill(data["e_mail_address"]);
  await page.locator('xpath=//*[@id="input-enquiry"]').fill(data["enquiry"]);
  // Verify: text("Shopping Cart")
  var item = page.getByText("Shopping Cart");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Contact Us")
  var item = page.getByText("Contact Us");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home anonymous - search - search results anon - i mac - product detail anon", async ({
  page,
}) => {
  const data = testData["test-path-Home_Anonymous-to-Product_Detail_Anon"];

  await page.goto("http://localhost/upload");
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/button')
    .click();

  if (data["search_in_subcategories"] === "true") {
    await page.locator('xpath=//*[@id="input-category"]').check();
  } else {
    await page.locator('xpath=//*[@id="input-category"]').uncheck();
  }

  await page
    .locator('xpath=//*[@id="product-list"]/div/div/div[2]/div/h4/a')
    .click();
  await page.locator('xpath=//*[@id=\"input-quantity\"]').fill(data["qty"]);
  // Verify: text("Shopping Cart")
  var item = page.getByText("Shopping Cart");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Information")
  var item = page.getByText("Information");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home anonymous - search - search results anon - home - home anonymous", async ({
  page,
}) => {
  const data = testData["test-path-Home_Anonymous-to-Home_Anonymous"];

  await page.goto("http://localhost/upload");
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/button')
    .click();

  if (data["search_in_subcategories"] === "true") {
    await page.locator('xpath=//*[@id="input-category"]').check();
  } else {
    await page.locator('xpath=//*[@id="input-category"]').uncheck();
  }

  await page.locator('xpath=//*[@id="navbar-content"]/ul/li[1]/a').click();
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  // Verify: text("Shopping Cart")
  var item = page.getByText("Shopping Cart");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Information")
  var item = page.getByText("Information");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home anonymous - shopping cart - shopping cart empty - continue - home anonymous", async ({
  page,
}) => {
  const data = testData["test-path-Home_Anonymous-to-Home_Anonymous-pof9"];

  await page.goto("http://localhost/upload");
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page.locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[4]/a').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page.locator('xpath=//*[@id="shopping-cart"]/div/a').click();
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  // Verify: text("Shopping Cart")
  var item = page.getByText("Shopping Cart");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Information")
  var item = page.getByText("Information");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home anonymous - 123456789 - contact us anon - submit - contact submitted anon", async ({
  page,
}) => {
  const data = testData["test-path-Home_Anonymous-to-Contact_Submitted_Anon"];

  await page.goto("http://localhost/upload");
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page.locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[1]/a').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page.locator('xpath=//*[@id="input-name"]').fill(data["your_name"]);
  await page
    .locator('xpath=//*[@id="input-email"]')
    .fill(data["e_mail_address"]);
  await page.locator('xpath=//*[@id="input-enquiry"]').fill(data["enquiry"]);
  await page.locator('xpath=//*[@id="form-contact"]/div/button').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  // Verify: text("Shopping Cart")
  var item = page.getByText("Shopping Cart");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Contact Us")
  var item = page.getByText("Contact Us");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home anonymous - 123456789 - contact us anon - submit - contact submitted anon - continue - home anonymous", async ({
  page,
}) => {
  const data = testData["test-path-Home_Anonymous-to-Home_Anonymous-gyj4"];

  await page.goto("http://localhost/upload");
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page.locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[1]/a').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page.locator('xpath=//*[@id="input-name"]').fill(data["your_name"]);
  await page
    .locator('xpath=//*[@id="input-email"]')
    .fill(data["e_mail_address"]);
  await page.locator('xpath=//*[@id="input-enquiry"]').fill(data["enquiry"]);
  await page.locator('xpath=//*[@id="form-contact"]/div/button').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page.locator('xpath=//*[@id="content"]/div/a').click();
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  // Verify: text("Shopping Cart")
  var item = page.getByText("Shopping Cart");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Information")
  var item = page.getByText("Information");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home anonymous - my account - home anonymous drop down - login - login page - login - my account - home - home authenticated", async ({
  page,
}) => {
  const data = testData["test-path-Home_Anonymous-to-Home_Authenticated"];

  await page.goto("http://localhost/upload");
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/ul/li[2]/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="input-email"]')
    .fill(data["e_mail_address"]);
  await page.locator('xpath=//*[@id="input-password"]').fill(data["password"]);
  await page.locator('xpath=//*[@id="form-login"]/div[3]/button').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page.locator('xpath=//*[@id="logo"]/a').click();
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  // Verify: text("Shopping Cart")
  var item = page.getByText("Shopping Cart");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Information")
  var item = page.getByText("Information");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home anonymous - my account - home anonymous drop down - login - login page - login - my account - reward points - reward points", async ({
  page,
}) => {
  const data = testData["test-path-Home_Anonymous-to-Reward_Points"];

  await page.goto("http://localhost/upload");
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/ul/li[2]/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="input-email"]')
    .fill(data["e_mail_address"]);
  await page.locator('xpath=//*[@id="input-password"]').fill(data["password"]);
  await page.locator('xpath=//*[@id="form-login"]/div[3]/button').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page.locator('xpath=//*[@id="column-right"]/div/a[10]').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  // Verify: text("Shopping Cart")
  var item = page.getByText("Shopping Cart");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Order History")
  var item = page.getByText("Order History");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home anonymous - my account - home anonymous drop down - login - login page - login - my account - wish list - wishlist empty", async ({
  page,
}) => {
  const data = testData["test-path-Home_Anonymous-to-Wishlist_Empty"];

  await page.goto("http://localhost/upload");
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/ul/li[2]/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="input-email"]')
    .fill(data["e_mail_address"]);
  await page.locator('xpath=//*[@id="input-password"]').fill(data["password"]);
  await page.locator('xpath=//*[@id="form-login"]/div[3]/button').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page.locator('xpath=//*[@id="column-right"]/div/a[6]').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  // Verify: text("Shopping Cart")
  var item = page.getByText("Shopping Cart");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Order History")
  var item = page.getByText("Order History");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home anonymous - my account - home anonymous drop down - login - login page - login - my account - logout - home anonymous", async ({
  page,
}) => {
  const data = testData["test-path-Home_Anonymous-to-Home_Anonymous-zoa1"];

  await page.goto("http://localhost/upload");
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/ul/li[2]/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="input-email"]')
    .fill(data["e_mail_address"]);
  await page.locator('xpath=//*[@id="input-password"]').fill(data["password"]);
  await page.locator('xpath=//*[@id="form-login"]/div[3]/button').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page.locator('xpath=//*[@id="column-right"]/div/a[14]').click();
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  // Verify: text("Shopping Cart")
  var item = page.getByText("Shopping Cart");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Information")
  var item = page.getByText("Information");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home anonymous - my account - home anonymous drop down - login - login page - login - my account - reward points - reward points - continue - my account", async ({
  page,
}) => {
  const data = testData["test-path-Home_Anonymous-to-My_Account-yo7l"];

  await page.goto("http://localhost/upload");
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/ul/li[2]/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="input-email"]')
    .fill(data["e_mail_address"]);
  await page.locator('xpath=//*[@id="input-password"]').fill(data["password"]);
  await page.locator('xpath=//*[@id="form-login"]/div[3]/button').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page.locator('xpath=//*[@id="column-right"]/div/a[10]').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page.locator('xpath=//*[@id="content"]/div[3]/a').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  // Verify: text("Newsletter")
  var item = page.getByText("Newsletter");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Currency")
  var item = page.getByText("Currency");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home anonymous - my account - home anonymous drop down - login - login page - login - my account - home - home authenticated - desktops - home authenticated desktop", async ({
  page,
}) => {
  const data =
    testData["test-path-Home_Anonymous-to-Home_Authenticated_Desktop"];

  await page.goto("http://localhost/upload");
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/ul/li[2]/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="input-email"]')
    .fill(data["e_mail_address"]);
  await page.locator('xpath=//*[@id="input-password"]').fill(data["password"]);
  await page.locator('xpath=//*[@id="form-login"]/div[3]/button').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page.locator('xpath=//*[@id="logo"]/a').click();
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page.locator('xpath=//*[@id="navbar-menu"]/ul/li[1]/a').click();
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  // Verify: text("Shopping Cart")
  var item = page.getByText("Shopping Cart");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Information")
  var item = page.getByText("Information");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home anonymous - my account - home anonymous drop down - login - login page - login - my account - home - home authenticated - search - search results auth", async ({
  page,
}) => {
  const data = testData["test-path-Home_Anonymous-to-Search_Results_Auth"];

  await page.goto("http://localhost/upload");
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/ul/li[2]/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="input-email"]')
    .fill(data["e_mail_address"]);
  await page.locator('xpath=//*[@id="input-password"]').fill(data["password"]);
  await page.locator('xpath=//*[@id="form-login"]/div[3]/button').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page.locator('xpath=//*[@id="logo"]/a').click();
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/button')
    .click();

  // Verify: not text("Order History")
  var item = page.getByText("Order History");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeHidden();
  } else {
    await expect(item).toBeHidden();
  }
  // Verify: text("My Account")
  var item = page.getByText("My Account");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home anonymous - my account - home anonymous drop down - login - login page - login - my account - home - home authenticated - 123456789 - contact us auth", async ({
  page,
}) => {
  const data = testData["test-path-Home_Anonymous-to-Contact_Us_Auth"];

  await page.goto("http://localhost/upload");
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/ul/li[2]/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="input-email"]')
    .fill(data["e_mail_address"]);
  await page.locator('xpath=//*[@id="input-password"]').fill(data["password"]);
  await page.locator('xpath=//*[@id="form-login"]/div[3]/button').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page.locator('xpath=//*[@id="logo"]/a').click();
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page.locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[1]/a').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page.locator('xpath=//*[@id="input-name"]').fill(data["your_name"]);
  await page
    .locator('xpath=//*[@id="input-email"]')
    .fill(data["e_mail_address"]);
  await page.locator('xpath=//*[@id="input-enquiry"]').fill(data["enquiry"]);
  // Verify: text("Shopping Cart")
  var item = page.getByText("Shopping Cart");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Contact Us")
  var item = page.getByText("Contact Us");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home anonymous - my account - home anonymous drop down - login - login page - login - my account - home - home authenticated - desktops - home authenticated desktop - mac (1) - category mac auth", async ({
  page,
}) => {
  const data = testData["test-path-Home_Anonymous-to-Category_Mac_Auth"];

  await page.goto("http://localhost/upload");
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/ul/li[2]/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="input-email"]')
    .fill(data["e_mail_address"]);
  await page.locator('xpath=//*[@id="input-password"]').fill(data["password"]);
  await page.locator('xpath=//*[@id="form-login"]/div[3]/button').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page.locator('xpath=//*[@id="logo"]/a').click();
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page.locator('xpath=//*[@id="navbar-menu"]/ul/li[1]/a').click();
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="navbar-menu"]/ul/li[1]/div/div/ul/li[2]/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);

  // Verify: text("Shopping Cart")
  var item = page.getByText("Shopping Cart");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Information")
  var item = page.getByText("Information");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home anonymous - my account - home anonymous drop down - login - login page - login - my account - home - home authenticated - desktops - home authenticated desktop - mac (1) - category mac auth - i mac - product detail auth", async ({
  page,
}) => {
  const data = testData["test-path-Home_Anonymous-to-Product_Detail_Auth"];

  await page.goto("http://localhost/upload");
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/ul/li[2]/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="input-email"]')
    .fill(data["e_mail_address"]);
  await page.locator('xpath=//*[@id="input-password"]').fill(data["password"]);
  await page.locator('xpath=//*[@id="form-login"]/div[3]/button').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page.locator('xpath=//*[@id="logo"]/a').click();
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page.locator('xpath=//*[@id="navbar-menu"]/ul/li[1]/a').click();
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="navbar-menu"]/ul/li[1]/div/div/ul/li[2]/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);

  await page
    .locator('xpath=//*[@id="product-list"]/div/div/div[2]/div/h4/a')
    .click();
  await page.locator('xpath=//*[@id=\"input-quantity\"]').fill(data["qty"]);
  // Verify: text("Shopping Cart")
  var item = page.getByText("Shopping Cart");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Information")
  var item = page.getByText("Information");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home anonymous - my account - home anonymous drop down - login - login page - login - my account - home - home authenticated - search - search results auth - i mac - product detail auth", async ({
  page,
}) => {
  const data = testData["test-path-Home_Anonymous-to-Product_Detail_Auth-07v9"];

  await page.goto("http://localhost/upload");
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/ul/li[2]/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="input-email"]')
    .fill(data["e_mail_address"]);
  await page.locator('xpath=//*[@id="input-password"]').fill(data["password"]);
  await page.locator('xpath=//*[@id="form-login"]/div[3]/button').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page.locator('xpath=//*[@id="logo"]/a').click();
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/button')
    .click();

  await page
    .locator('xpath=//*[@id="product-list"]/div/div/div[2]/div/h4/a')
    .click();
  await page.locator('xpath=//*[@id=\"input-quantity\"]').fill(data["qty"]);
  // Verify: text("Shopping Cart")
  var item = page.getByText("Shopping Cart");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Information")
  var item = page.getByText("Information");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home anonymous - my account - home anonymous drop down - login - login page - login - my account - home - home authenticated - search - search results auth - home - home authenticated", async ({
  page,
}) => {
  const data = testData["test-path-Home_Anonymous-to-Home_Authenticated-lev3"];

  await page.goto("http://localhost/upload");
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/ul/li[2]/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="input-email"]')
    .fill(data["e_mail_address"]);
  await page.locator('xpath=//*[@id="input-password"]').fill(data["password"]);
  await page.locator('xpath=//*[@id="form-login"]/div[3]/button').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page.locator('xpath=//*[@id="logo"]/a').click();
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/button')
    .click();

  await page.locator('xpath=//*[@id="navbar-content"]/ul/li[1]/a').click();
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  // Verify: text("Shopping Cart")
  var item = page.getByText("Shopping Cart");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Information")
  var item = page.getByText("Information");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home anonymous - my account - home anonymous drop down - login - login page - login - my account - home - home authenticated - search - search results auth - i mac - product detail auth - add to cart - product detail auth cart", async ({
  page,
}) => {
  const data = testData["test-path-Home_Anonymous-to-Product_Detail_Auth_Cart"];

  await page.goto("http://localhost/upload");
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/ul/li[2]/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="input-email"]')
    .fill(data["e_mail_address"]);
  await page.locator('xpath=//*[@id="input-password"]').fill(data["password"]);
  await page.locator('xpath=//*[@id="form-login"]/div[3]/button').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page.locator('xpath=//*[@id="logo"]/a').click();
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/button')
    .click();

  await page
    .locator('xpath=//*[@id="product-list"]/div/div/div[2]/div/h4/a')
    .click();
  await page.locator('xpath=//*[@id=\"input-quantity\"]').fill(data["qty"]);
  await page.getByText("Add to Cart").click();
  await page.locator('xpath=//*[@id=\"input-quantity\"]').fill(data["qty"]);
  // Verify: text("Shopping Cart")
  var item = page.getByText("Shopping Cart");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Information")
  var item = page.getByText("Information");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home anonymous - my account - home anonymous drop down - login - login page - login - my account - home - home authenticated - search - search results auth - i mac - product detail auth - add to cart - product detail auth cart - shopping cart - shopping cart auth", async ({
  page,
}) => {
  const data = testData["test-path-Home_Anonymous-to-Shopping_Cart_Auth"];

  await page.goto("http://localhost/upload");
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/ul/li[2]/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="input-email"]')
    .fill(data["e_mail_address"]);
  await page.locator('xpath=//*[@id="input-password"]').fill(data["password"]);
  await page.locator('xpath=//*[@id="form-login"]/div[3]/button').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page.locator('xpath=//*[@id="logo"]/a').click();
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/button')
    .click();

  await page
    .locator('xpath=//*[@id="product-list"]/div/div/div[2]/div/h4/a')
    .click();
  await page.locator('xpath=//*[@id=\"input-quantity\"]').fill(data["qty"]);
  await page.getByText("Add to Cart").click();
  await page.locator('xpath=//*[@id=\"input-quantity\"]').fill(data["qty"]);
  await page
    .locator('xpath=//*[@id=\"top\"]/div/div/div[2]/ul/li[4]/a')
    .click();
  await page.locator('xpath=//*[@id="input-search"]').fill(data["search"]);

  // Verify: text("Shopping Cart")
  var item = page.getByText("Shopping Cart");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Information")
  var item = page.getByText("Information");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home anonymous - my account - home anonymous drop down - login - login page - login - my account - wish list - wishlist empty - continue - my account", async ({
  page,
}) => {
  const data = testData["test-path-Home_Anonymous-to-My_Account-u908"];

  await page.goto("http://localhost/upload");
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/ul/li[2]/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="input-email"]')
    .fill(data["e_mail_address"]);
  await page.locator('xpath=//*[@id="input-password"]').fill(data["password"]);
  await page.locator('xpath=//*[@id="form-login"]/div[3]/button').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page.locator('xpath=//*[@id="column-right"]/div/a[6]').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page.locator('xpath=//*[@id="content"]/div[2]/a').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  // Verify: text("Newsletter")
  var item = page.getByText("Newsletter");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Currency")
  var item = page.getByText("Currency");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home anonymous - my account - home anonymous drop down - login - login page - login - my account - home - home authenticated - search - search results auth - i mac - product detail auth - add to cart - product detail auth cart - shopping cart - shopping cart auth - checkout - checkout auth", async ({
  page,
}) => {
  const data = testData["test-path-Home_Anonymous-to-Checkout_Auth"];

  await page.goto("http://localhost/upload");
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/ul/li[2]/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="input-email"]')
    .fill(data["e_mail_address"]);
  await page.locator('xpath=//*[@id="input-password"]').fill(data["password"]);
  await page.locator('xpath=//*[@id="form-login"]/div[3]/button').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page.locator('xpath=//*[@id="logo"]/a').click();
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/button')
    .click();

  await page
    .locator('xpath=//*[@id="product-list"]/div/div/div[2]/div/h4/a')
    .click();
  await page.locator('xpath=//*[@id=\"input-quantity\"]').fill(data["qty"]);
  await page.getByText("Add to Cart").click();
  await page.locator('xpath=//*[@id=\"input-quantity\"]').fill(data["qty"]);
  await page
    .locator('xpath=//*[@id=\"top\"]/div/div/div[2]/ul/li[4]/a')
    .click();
  await page.locator('xpath=//*[@id="input-search"]').fill(data["search"]);

  await page.getByText("Checkout").click();
  await page.locator('xpath=//*[@id="input-search"]').fill(data["search"]);
  await page.getByLabel("First Name").fill(data["first_name"]);
  await page.getByLabel("Last Name").fill(data["last_name"]);
  await page.getByLabel("Company").fill(data["company"]);
  await page.getByLabel("Address 1").fill(data["address_1"]);
  await page.getByLabel("Address 2").fill(data["address_2"]);
  await page.getByLabel("City").fill(data["city"]);
  await page.getByLabel("Post Code").fill(data["post_code"]);
  await page.getByLabel("Country").selectOption(data["country"]);
  await page.getByLabel("Region / State").selectOption(data["region_state"]);
  // Verify: text("Shopping Cart")
  var item = page.getByText("Shopping Cart");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Information")
  var item = page.getByText("Information");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home anonymous - my account - home anonymous drop down - login - login page - login - my account - home - home authenticated - search - search results auth - i mac - product detail auth - add to cart - product detail auth cart - shopping cart - shopping cart auth - continue shopping - home authenticated", async ({
  page,
}) => {
  const data = testData["test-path-Home_Anonymous-to-Home_Authenticated-afoi"];

  await page.goto("http://localhost/upload");
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/ul/li[2]/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="input-email"]')
    .fill(data["e_mail_address"]);
  await page.locator('xpath=//*[@id="input-password"]').fill(data["password"]);
  await page.locator('xpath=//*[@id="form-login"]/div[3]/button').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page.locator('xpath=//*[@id="logo"]/a').click();
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/button')
    .click();

  await page
    .locator('xpath=//*[@id="product-list"]/div/div/div[2]/div/h4/a')
    .click();
  await page.locator('xpath=//*[@id=\"input-quantity\"]').fill(data["qty"]);
  await page.getByText("Add to Cart").click();
  await page.locator('xpath=//*[@id=\"input-quantity\"]').fill(data["qty"]);
  await page
    .locator('xpath=//*[@id=\"top\"]/div/div/div[2]/ul/li[4]/a')
    .click();
  await page.locator('xpath=//*[@id="input-search"]').fill(data["search"]);

  await page.getByText("Continue Shopping").click();
  await page.locator('xpath=//*[@id="input-search"]').fill(data["search"]);
  // Verify: text("Shopping Cart")
  var item = page.getByText("Shopping Cart");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Information")
  var item = page.getByText("Information");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home anonymous - my account - home anonymous drop down - login - login page - login - my account - home - home authenticated - search - search results auth - i mac - product detail auth - add to cart - product detail auth cart - shopping cart - shopping cart auth - checkout - checkout auth - continue - checkout auth shipping", async ({
  page,
}) => {
  const data = testData["test-path-Home_Anonymous-to-Checkout_Auth_Shipping"];

  await page.goto("http://localhost/upload");
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/ul/li[2]/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="input-email"]')
    .fill(data["e_mail_address"]);
  await page.locator('xpath=//*[@id="input-password"]').fill(data["password"]);
  await page.locator('xpath=//*[@id="form-login"]/div[3]/button').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page.locator('xpath=//*[@id="logo"]/a').click();
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/button')
    .click();

  await page
    .locator('xpath=//*[@id="product-list"]/div/div/div[2]/div/h4/a')
    .click();
  await page.locator('xpath=//*[@id=\"input-quantity\"]').fill(data["qty"]);
  await page.getByText("Add to Cart").click();
  await page.locator('xpath=//*[@id=\"input-quantity\"]').fill(data["qty"]);
  await page
    .locator('xpath=//*[@id=\"top\"]/div/div/div[2]/ul/li[4]/a')
    .click();
  await page.locator('xpath=//*[@id="input-search"]').fill(data["search"]);

  await page.getByText("Checkout").click();
  await page.locator('xpath=//*[@id="input-search"]').fill(data["search"]);
  await page.getByLabel("First Name").fill(data["first_name"]);
  await page.getByLabel("Last Name").fill(data["last_name"]);
  await page.getByLabel("Company").fill(data["company"]);
  await page.getByLabel("Address 1").fill(data["address_1"]);
  await page.getByLabel("Address 2").fill(data["address_2"]);
  await page.getByLabel("City").fill(data["city"]);
  await page.getByLabel("Post Code").fill(data["post_code"]);
  await page.getByLabel("Country").selectOption(data["country"]);
  await page.getByLabel("Region / State").selectOption(data["region_state"]);
  await page.getByText("Continue").click();
  await page.locator('xpath=//*[@id="input-search"]').fill(data["search"]);
  if (data["i_want_to_use_an_existing_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .uncheck();
  }
  if (data["i_want_to_use_a_new_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .uncheck();
  }

  // Verify: text("Shopping Cart")
  var item = page.getByText("Shopping Cart");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Information")
  var item = page.getByText("Information");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home anonymous - my account - home anonymous drop down - login - login page - login - my account - home - home authenticated - search - search results auth - i mac - product detail auth - add to cart - product detail auth cart - shopping cart - shopping cart auth - checkout - checkout auth - continue - checkout auth shipping - choose - checkout auth shipping options", async ({
  page,
}) => {
  const data =
    testData["test-path-Home_Anonymous-to-Checkout_Auth_Shipping_options"];

  await page.goto("http://localhost/upload");
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/ul/li[2]/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="input-email"]')
    .fill(data["e_mail_address"]);
  await page.locator('xpath=//*[@id="input-password"]').fill(data["password"]);
  await page.locator('xpath=//*[@id="form-login"]/div[3]/button').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page.locator('xpath=//*[@id="logo"]/a').click();
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/button')
    .click();

  await page
    .locator('xpath=//*[@id="product-list"]/div/div/div[2]/div/h4/a')
    .click();
  await page.locator('xpath=//*[@id=\"input-quantity\"]').fill(data["qty"]);
  await page.getByText("Add to Cart").click();
  await page.locator('xpath=//*[@id=\"input-quantity\"]').fill(data["qty"]);
  await page
    .locator('xpath=//*[@id=\"top\"]/div/div/div[2]/ul/li[4]/a')
    .click();
  await page.locator('xpath=//*[@id="input-search"]').fill(data["search"]);

  await page.getByText("Checkout").click();
  await page.locator('xpath=//*[@id="input-search"]').fill(data["search"]);
  await page.getByLabel("First Name").fill(data["first_name"]);
  await page.getByLabel("Last Name").fill(data["last_name"]);
  await page.getByLabel("Company").fill(data["company"]);
  await page.getByLabel("Address 1").fill(data["address_1"]);
  await page.getByLabel("Address 2").fill(data["address_2"]);
  await page.getByLabel("City").fill(data["city"]);
  await page.getByLabel("Post Code").fill(data["post_code"]);
  await page.getByLabel("Country").selectOption(data["country"]);
  await page.getByLabel("Region / State").selectOption(data["region_state"]);
  await page.getByText("Continue").click();
  await page.locator('xpath=//*[@id="input-search"]').fill(data["search"]);
  if (data["i_want_to_use_an_existing_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .uncheck();
  }
  if (data["i_want_to_use_a_new_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .uncheck();
  }

  await page.getByLabel("Choose").click();
  await page.locator('xpath=//*[@id="input-search"]').fill(data["search"]);
  if (data["i_want_to_use_an_existing_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .uncheck();
  }
  if (data["i_want_to_use_a_new_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .uncheck();
  }

  if (data["flat_shipping_rate_5_00"] === "true") {
    await page
      .getByRole("radio", { name: "Flat Shipping Rate - $5.00" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "Flat Shipping Rate - $5.00" })
      .uncheck();
  }
  // Verify: text("Shopping Cart")
  var item = page.getByText("Shopping Cart");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Information")
  var item = page.getByText("Information");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home anonymous - my account - home anonymous drop down - login - login page - login - my account - home - home authenticated - search - search results auth - i mac - product detail auth - add to cart - product detail auth cart - shopping cart - shopping cart auth - checkout - checkout auth - continue - checkout auth shipping - choose - checkout auth shipping options - continue - checkout auth shippement method selected", async ({
  page,
}) => {
  const data =
    testData[
      "test-path-Home_Anonymous-to-Checkout_Auth_Shippement_method_selected"
    ];

  await page.goto("http://localhost/upload");
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/ul/li[2]/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="input-email"]')
    .fill(data["e_mail_address"]);
  await page.locator('xpath=//*[@id="input-password"]').fill(data["password"]);
  await page.locator('xpath=//*[@id="form-login"]/div[3]/button').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page.locator('xpath=//*[@id="logo"]/a').click();
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/button')
    .click();

  await page
    .locator('xpath=//*[@id="product-list"]/div/div/div[2]/div/h4/a')
    .click();
  await page.locator('xpath=//*[@id=\"input-quantity\"]').fill(data["qty"]);
  await page.getByText("Add to Cart").click();
  await page.locator('xpath=//*[@id=\"input-quantity\"]').fill(data["qty"]);
  await page
    .locator('xpath=//*[@id=\"top\"]/div/div/div[2]/ul/li[4]/a')
    .click();
  await page.locator('xpath=//*[@id="input-search"]').fill(data["search"]);

  await page.getByText("Checkout").click();
  await page.locator('xpath=//*[@id="input-search"]').fill(data["search"]);
  await page.getByLabel("First Name").fill(data["first_name"]);
  await page.getByLabel("Last Name").fill(data["last_name"]);
  await page.getByLabel("Company").fill(data["company"]);
  await page.getByLabel("Address 1").fill(data["address_1"]);
  await page.getByLabel("Address 2").fill(data["address_2"]);
  await page.getByLabel("City").fill(data["city"]);
  await page.getByLabel("Post Code").fill(data["post_code"]);
  await page.getByLabel("Country").selectOption(data["country"]);
  await page.getByLabel("Region / State").selectOption(data["region_state"]);
  await page.getByText("Continue").click();
  await page.locator('xpath=//*[@id="input-search"]').fill(data["search"]);
  if (data["i_want_to_use_an_existing_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .uncheck();
  }
  if (data["i_want_to_use_a_new_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .uncheck();
  }

  await page.getByLabel("Choose").click();
  await page.locator('xpath=//*[@id="input-search"]').fill(data["search"]);
  if (data["i_want_to_use_an_existing_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .uncheck();
  }
  if (data["i_want_to_use_a_new_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .uncheck();
  }

  if (data["flat_shipping_rate_5_00"] === "true") {
    await page
      .getByRole("radio", { name: "Flat Shipping Rate - $5.00" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "Flat Shipping Rate - $5.00" })
      .uncheck();
  }
  await page.getByText("Continue").click();
  await page.locator('xpath=//*[@id="input-search"]').fill(data["search"]);
  if (data["i_want_to_use_an_existing_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .uncheck();
  }
  if (data["i_want_to_use_a_new_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .uncheck();
  }

  // Verify: text("Shopping Cart")
  var item = page.getByText("Shopping Cart");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Information")
  var item = page.getByText("Information");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home anonymous - my account - home anonymous drop down - login - login page - login - my account - home - home authenticated - search - search results auth - i mac - product detail auth - add to cart - product detail auth cart - shopping cart - shopping cart auth - checkout - checkout auth - continue - checkout auth shipping - choose - checkout auth shipping options - continue - checkout auth shippement method selected - choose - checkout auth payment options", async ({
  page,
}) => {
  const data =
    testData["test-path-Home_Anonymous-to-Checkout_Auth_Payment_options"];

  await page.goto("http://localhost/upload");
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/ul/li[2]/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="input-email"]')
    .fill(data["e_mail_address"]);
  await page.locator('xpath=//*[@id="input-password"]').fill(data["password"]);
  await page.locator('xpath=//*[@id="form-login"]/div[3]/button').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page.locator('xpath=//*[@id="logo"]/a').click();
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/button')
    .click();

  await page
    .locator('xpath=//*[@id="product-list"]/div/div/div[2]/div/h4/a')
    .click();
  await page.locator('xpath=//*[@id=\"input-quantity\"]').fill(data["qty"]);
  await page.getByText("Add to Cart").click();
  await page.locator('xpath=//*[@id=\"input-quantity\"]').fill(data["qty"]);
  await page
    .locator('xpath=//*[@id=\"top\"]/div/div/div[2]/ul/li[4]/a')
    .click();
  await page.locator('xpath=//*[@id="input-search"]').fill(data["search"]);

  await page.getByText("Checkout").click();
  await page.locator('xpath=//*[@id="input-search"]').fill(data["search"]);
  await page.getByLabel("First Name").fill(data["first_name"]);
  await page.getByLabel("Last Name").fill(data["last_name"]);
  await page.getByLabel("Company").fill(data["company"]);
  await page.getByLabel("Address 1").fill(data["address_1"]);
  await page.getByLabel("Address 2").fill(data["address_2"]);
  await page.getByLabel("City").fill(data["city"]);
  await page.getByLabel("Post Code").fill(data["post_code"]);
  await page.getByLabel("Country").selectOption(data["country"]);
  await page.getByLabel("Region / State").selectOption(data["region_state"]);
  await page.getByText("Continue").click();
  await page.locator('xpath=//*[@id="input-search"]').fill(data["search"]);
  if (data["i_want_to_use_an_existing_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .uncheck();
  }
  if (data["i_want_to_use_a_new_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .uncheck();
  }

  await page.getByLabel("Choose").click();
  await page.locator('xpath=//*[@id="input-search"]').fill(data["search"]);
  if (data["i_want_to_use_an_existing_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .uncheck();
  }
  if (data["i_want_to_use_a_new_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .uncheck();
  }

  if (data["flat_shipping_rate_5_00"] === "true") {
    await page
      .getByRole("radio", { name: "Flat Shipping Rate - $5.00" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "Flat Shipping Rate - $5.00" })
      .uncheck();
  }
  await page.getByText("Continue").click();
  await page.locator('xpath=//*[@id="input-search"]').fill(data["search"]);
  if (data["i_want_to_use_an_existing_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .uncheck();
  }
  if (data["i_want_to_use_a_new_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .uncheck();
  }

  await page.getByLabel("Choose").click();
  await page.locator('xpath=//*[@id="input-search"]').fill(data["search"]);
  if (data["i_want_to_use_an_existing_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .uncheck();
  }
  if (data["i_want_to_use_a_new_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .uncheck();
  }

  if (data["cash_on_delivery"] === "true") {
    await page.getByRole("radio", { name: "Cash On Delivery" }).check();
  } else {
    await page.getByRole("radio", { name: "Cash On Delivery" }).uncheck();
  }
  // Verify: text("Shopping Cart")
  var item = page.getByText("Shopping Cart");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Information")
  var item = page.getByText("Information");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home anonymous - my account - home anonymous drop down - login - login page - login - my account - home - home authenticated - search - search results auth - i mac - product detail auth - add to cart - product detail auth cart - shopping cart - shopping cart auth - checkout - checkout auth - continue - checkout auth shipping - choose - checkout auth shipping options - continue - checkout auth shippement method selected - choose - checkout auth payment options - continue - checkout auth final", async ({
  page,
}) => {
  const data = testData["test-path-Home_Anonymous-to-Checkout_Auth_Final"];

  await page.goto("http://localhost/upload");
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/ul/li[2]/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="input-email"]')
    .fill(data["e_mail_address"]);
  await page.locator('xpath=//*[@id="input-password"]').fill(data["password"]);
  await page.locator('xpath=//*[@id="form-login"]/div[3]/button').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page.locator('xpath=//*[@id="logo"]/a').click();
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/button')
    .click();

  await page
    .locator('xpath=//*[@id="product-list"]/div/div/div[2]/div/h4/a')
    .click();
  await page.locator('xpath=//*[@id=\"input-quantity\"]').fill(data["qty"]);
  await page.getByText("Add to Cart").click();
  await page.locator('xpath=//*[@id=\"input-quantity\"]').fill(data["qty"]);
  await page
    .locator('xpath=//*[@id=\"top\"]/div/div/div[2]/ul/li[4]/a')
    .click();
  await page.locator('xpath=//*[@id="input-search"]').fill(data["search"]);

  await page.getByText("Checkout").click();
  await page.locator('xpath=//*[@id="input-search"]').fill(data["search"]);
  await page.getByLabel("First Name").fill(data["first_name"]);
  await page.getByLabel("Last Name").fill(data["last_name"]);
  await page.getByLabel("Company").fill(data["company"]);
  await page.getByLabel("Address 1").fill(data["address_1"]);
  await page.getByLabel("Address 2").fill(data["address_2"]);
  await page.getByLabel("City").fill(data["city"]);
  await page.getByLabel("Post Code").fill(data["post_code"]);
  await page.getByLabel("Country").selectOption(data["country"]);
  await page.getByLabel("Region / State").selectOption(data["region_state"]);
  await page.getByText("Continue").click();
  await page.locator('xpath=//*[@id="input-search"]').fill(data["search"]);
  if (data["i_want_to_use_an_existing_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .uncheck();
  }
  if (data["i_want_to_use_a_new_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .uncheck();
  }

  await page.getByLabel("Choose").click();
  await page.locator('xpath=//*[@id="input-search"]').fill(data["search"]);
  if (data["i_want_to_use_an_existing_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .uncheck();
  }
  if (data["i_want_to_use_a_new_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .uncheck();
  }

  if (data["flat_shipping_rate_5_00"] === "true") {
    await page
      .getByRole("radio", { name: "Flat Shipping Rate - $5.00" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "Flat Shipping Rate - $5.00" })
      .uncheck();
  }
  await page.getByText("Continue").click();
  await page.locator('xpath=//*[@id="input-search"]').fill(data["search"]);
  if (data["i_want_to_use_an_existing_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .uncheck();
  }
  if (data["i_want_to_use_a_new_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .uncheck();
  }

  await page.getByLabel("Choose").click();
  await page.locator('xpath=//*[@id="input-search"]').fill(data["search"]);
  if (data["i_want_to_use_an_existing_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .uncheck();
  }
  if (data["i_want_to_use_a_new_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .uncheck();
  }

  if (data["cash_on_delivery"] === "true") {
    await page.getByRole("radio", { name: "Cash On Delivery" }).check();
  } else {
    await page.getByRole("radio", { name: "Cash On Delivery" }).uncheck();
  }
  await page.getByText("Continue").click();
  // Verify: not text("My Account")
  var item = page.getByText("My Account");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeHidden();
  } else {
    await expect(item).toBeHidden();
  }
});

test("home anonymous - my account - home anonymous drop down - login - login page - login - my account - home - home authenticated - search - search results auth - i mac - product detail auth - add to cart - product detail auth cart - shopping cart - shopping cart auth - checkout - checkout auth - continue - checkout auth shipping - choose - checkout auth shipping options - continue - checkout auth shippement method selected - choose - checkout auth payment options - continue - checkout auth final - confirm order - order success auth", async ({
  page,
}) => {
  const data = testData["test-path-Home_Anonymous-to-Order_Success_Auth"];

  await page.goto("http://localhost/upload");
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/ul/li[2]/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="input-email"]')
    .fill(data["e_mail_address"]);
  await page.locator('xpath=//*[@id="input-password"]').fill(data["password"]);
  await page.locator('xpath=//*[@id="form-login"]/div[3]/button').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page.locator('xpath=//*[@id="logo"]/a').click();
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/button')
    .click();

  await page
    .locator('xpath=//*[@id="product-list"]/div/div/div[2]/div/h4/a')
    .click();
  await page.locator('xpath=//*[@id=\"input-quantity\"]').fill(data["qty"]);
  await page.getByText("Add to Cart").click();
  await page.locator('xpath=//*[@id=\"input-quantity\"]').fill(data["qty"]);
  await page
    .locator('xpath=//*[@id=\"top\"]/div/div/div[2]/ul/li[4]/a')
    .click();
  await page.locator('xpath=//*[@id="input-search"]').fill(data["search"]);

  await page.getByText("Checkout").click();
  await page.locator('xpath=//*[@id="input-search"]').fill(data["search"]);
  await page.getByLabel("First Name").fill(data["first_name"]);
  await page.getByLabel("Last Name").fill(data["last_name"]);
  await page.getByLabel("Company").fill(data["company"]);
  await page.getByLabel("Address 1").fill(data["address_1"]);
  await page.getByLabel("Address 2").fill(data["address_2"]);
  await page.getByLabel("City").fill(data["city"]);
  await page.getByLabel("Post Code").fill(data["post_code"]);
  await page.getByLabel("Country").selectOption(data["country"]);
  await page.getByLabel("Region / State").selectOption(data["region_state"]);
  await page.getByText("Continue").click();
  await page.locator('xpath=//*[@id="input-search"]').fill(data["search"]);
  if (data["i_want_to_use_an_existing_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .uncheck();
  }
  if (data["i_want_to_use_a_new_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .uncheck();
  }

  await page.getByLabel("Choose").click();
  if (data["i_want_to_use_an_existing_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .uncheck();
  }
  if (data["i_want_to_use_a_new_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .uncheck();
  }

  if (data["flat_shipping_rate_5_00"] === "true") {
    await page
      .getByRole("radio", { name: "Flat Shipping Rate - $5.00" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "Flat Shipping Rate - $5.00" })
      .uncheck();
  }
  await page.getByText("Continue").click();
  await page.locator('xpath=//*[@id="input-search"]').fill(data["search"]);
  if (data["i_want_to_use_an_existing_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .uncheck();
  }
  if (data["i_want_to_use_a_new_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .uncheck();
  }

  await page.getByLabel("Choose").click();
  await page.locator('xpath=//*[@id="input-search"]').fill(data["search"]);
  if (data["i_want_to_use_an_existing_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .uncheck();
  }
  if (data["i_want_to_use_a_new_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .uncheck();
  }

  if (data["cash_on_delivery"] === "true") {
    await page.getByRole("radio", { name: "Cash On Delivery" }).check();
  } else {
    await page.getByRole("radio", { name: "Cash On Delivery" }).uncheck();
  }
  await page.getByText("Continue").click();
  await page.getByText("Confirm Order").click();

  // Verify: text("My Account")
  var item = page.getByText("My Account");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home anonymous - my account - home anonymous drop down - login - login page - login - my account - home - home authenticated - search - search results auth - i mac - product detail auth - add to cart - product detail auth cart - shopping cart - shopping cart auth - checkout - checkout auth - continue - checkout auth shipping - choose - checkout auth shipping options - continue - checkout auth shippement method selected - choose - checkout auth payment options - continue - checkout auth final - confirm order - order success auth - continue - home authenticated", async ({
  page,
}) => {
  const data = testData["test-path-Home_Anonymous-to-Home_Authenticated-gmsw"];

  await page.goto("http://localhost/upload");
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/ul/li[2]/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="input-email"]')
    .fill(data["e_mail_address"]);
  await page.locator('xpath=//*[@id="input-password"]').fill(data["password"]);
  await page.locator('xpath=//*[@id="form-login"]/div[3]/button').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page.locator('xpath=//*[@id="logo"]/a').click();
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/button')
    .click();

  await page
    .locator('xpath=//*[@id="product-list"]/div/div/div[2]/div/h4/a')
    .click();
  await page.locator('xpath=//*[@id=\"input-quantity\"]').fill(data["qty"]);
  await page.getByText("Add to Cart").click();
  await page.locator('xpath=//*[@id=\"input-quantity\"]').fill(data["qty"]);
  await page
    .locator('xpath=//*[@id=\"top\"]/div/div/div[2]/ul/li[4]/a')
    .click();
  await page.locator('xpath=//*[@id="input-search"]').fill(data["search"]);

  await page.getByText("Checkout").click();
  await page.locator('xpath=//*[@id="input-search"]').fill(data["search"]);
  await page.getByLabel("First Name").fill(data["first_name"]);
  await page.getByLabel("Last Name").fill(data["last_name"]);
  await page.getByLabel("Company").fill(data["company"]);
  await page.getByLabel("Address 1").fill(data["address_1"]);
  await page.getByLabel("Address 2").fill(data["address_2"]);
  await page.getByLabel("City").fill(data["city"]);
  await page.getByLabel("Post Code").fill(data["post_code"]);
  await page.getByLabel("Country").selectOption(data["country"]);
  await page.getByLabel("Region / State").selectOption(data["region_state"]);
  await page.getByText("Continue").click();
  await page.locator('xpath=//*[@id="input-search"]').fill(data["search"]);
  if (data["i_want_to_use_an_existing_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .uncheck();
  }
  if (data["i_want_to_use_a_new_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .uncheck();
  }

  await page.getByLabel("Choose").click();
  await page.locator('xpath=//*[@id="input-search"]').fill(data["search"]);
  if (data["i_want_to_use_an_existing_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .uncheck();
  }
  if (data["i_want_to_use_a_new_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .uncheck();
  }

  if (data["flat_shipping_rate_5_00"] === "true") {
    await page
      .getByRole("radio", { name: "Flat Shipping Rate - $5.00" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "Flat Shipping Rate - $5.00" })
      .uncheck();
  }
  await page.getByText("Continue").click();
  await page.locator('xpath=//*[@id="input-search"]').fill(data["search"]);
  if (data["i_want_to_use_an_existing_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .uncheck();
  }
  if (data["i_want_to_use_a_new_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .uncheck();
  }

  await page.getByLabel("Choose").click();
  await page.locator('xpath=//*[@id="input-search"]').fill(data["search"]);
  if (data["i_want_to_use_an_existing_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use an existing address" })
      .uncheck();
  }
  if (data["i_want_to_use_a_new_address"] === "true") {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .check();
  } else {
    await page
      .getByRole("radio", { name: "I want to use a new address" })
      .uncheck();
  }

  if (data["cash_on_delivery"] === "true") {
    await page.getByRole("radio", { name: "Cash On Delivery" }).check();
  } else {
    await page.getByRole("radio", { name: "Cash On Delivery" }).uncheck();
  }
  await page.getByText("Continue").click();
  await page.getByText("Confirm Order").click();
  await page.getByText("Continue").click();
  await page.locator('xpath=//*[@id="input-search"]').fill(data["search"]);
  // Verify: text("Shopping Cart")
  var item = page.getByText("Shopping Cart");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Information")
  var item = page.getByText("Information");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home anonymous - my account - home anonymous drop down - login - login page - login - my account - home - home authenticated - 123456789 - contact us auth - submit - contact submitted auth", async ({
  page,
}) => {
  const data = testData["test-path-Home_Anonymous-to-Contact_Submitted_Auth"];

  await page.goto("http://localhost/upload");
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/ul/li[2]/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="input-email"]')
    .fill(data["e_mail_address"]);
  await page.locator('xpath=//*[@id="input-password"]').fill(data["password"]);
  await page.locator('xpath=//*[@id="form-login"]/div[3]/button').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page.locator('xpath=//*[@id="logo"]/a').click();
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page.locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[1]/a').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page.locator('xpath=//*[@id="input-name"]').fill(data["your_name"]);
  await page
    .locator('xpath=//*[@id="input-email"]')
    .fill(data["e_mail_address"]);
  await page.locator('xpath=//*[@id="input-enquiry"]').fill(data["enquiry"]);
  await page.locator('xpath=//*[@id="form-contact"]/div/button').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  // Verify: text("Shopping Cart")
  var item = page.getByText("Shopping Cart");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Contact Us")
  var item = page.getByText("Contact Us");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home anonymous - my account - home anonymous drop down - login - login page - login - my account - home - home authenticated - 123456789 - contact us auth - submit - contact submitted auth - continue - home authenticated", async ({
  page,
}) => {
  const data = testData["test-path-Home_Anonymous-to-Home_Authenticated-tg9c"];

  await page.goto("http://localhost/upload");
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[2]/div/ul/li[2]/a')
    .click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page
    .locator('xpath=//*[@id="input-email"]')
    .fill(data["e_mail_address"]);
  await page.locator('xpath=//*[@id="input-password"]').fill(data["password"]);
  await page.locator('xpath=//*[@id="form-login"]/div[3]/button').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page.locator('xpath=//*[@id="logo"]/a').click();
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  await page.locator('xpath=//*[@id="top"]/div/div/div[2]/ul/li[1]/a').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page.locator('xpath=//*[@id="input-name"]').fill(data["your_name"]);
  await page
    .locator('xpath=//*[@id="input-email"]')
    .fill(data["e_mail_address"]);
  await page.locator('xpath=//*[@id="input-enquiry"]').fill(data["enquiry"]);
  await page.locator('xpath=//*[@id="form-contact"]/div/button').click();
  await page.getByPlaceholder("Search").fill(data["search"]);
  await page.locator('xpath=//*[@id="content"]/div/a').click();
  await page
    .locator('xpath=//*[@id="container"]/header/div/div/div[2]/form/input')
    .fill(data["search"]);
  // Verify: text("Shopping Cart")
  var item = page.getByText("Shopping Cart");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Information")
  var item = page.getByText("Information");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});
