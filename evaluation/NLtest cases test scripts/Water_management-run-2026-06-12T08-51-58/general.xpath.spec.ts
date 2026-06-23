import { test, expect } from "@playwright/test";

// Base URL: http://localhost/water-management

// Test Data
const testData = {
  "test-path-Login-to-Vendors": {
    username: "toto",
    password: "toto",
    search: "John",
  },
  "test-path-Login-to-Customers": {
    username: "toto",
    password: "toto",
    search: "Hello",
  },
  "test-path-Login-to-Products": {
    username: "toto",
    password: "toto",
    search: "www",
  },
  "test-path-Login-to-Orders": {
    username: "toto",
    password: "toto",
    search: "Handcrafted Wooden Sausages",
  },
  "test-path-Login-to-Dashboard": {
    username: "toto",
    password: "toto",
  },
  "test-path-Login-to-VendorsSearchResults": {
    username: "toto",
    password: "toto",
    search: "John",
  },
  "test-path-Login-to-AddVendor": {
    username: "toto",
    password: "toto",
    search: "John",
    vendor_name: "Test Vendor2",
    contact: "2",
    product: "aw--2323",
    quantity: "2",
    price: "2",
  },
  "test-path-Login-to-EditVendor": {
    username: "toto",
    password: "toto",
    search: "John",
    vendor_name: "awdwad",
    contact: "11113243132",
    product_catgory: "Water Bottle--Bislery",
    product: "patruus",
    quantity: "1243",
    price: "44",
    remember_me: "false",
  },
  "test-path-Login-to-DeleteVendorSuccess": {
    username: "toto",
    password: "toto",
    search: "John",
  },
  "test-path-Login-to-ConfirmBuy": {
    username: "toto",
    password: "toto",
    search: "John",
  },
  "test-path-Login-to-Vendors-v49x": {
    username: "toto",
    password: "toto",
    search: "John",
  },
  "test-path-Login-to-AddVendorSuccess": {
    username: "toto",
    password: "toto",
    search: "John",
    vendor_name: "Test Vendor2",
    contact: "2",
    product: "aw--2323",
    quantity: "2",
    price: "2",
  },
  "test-path-Login-to-EditVendorSuccess": {
    username: "toto",
    password: "toto",
    search: "John",
    vendor_name: "awdwad",
    contact: "11113243132",
    product_catgory: "Water Bottle--Bislery",
    product: "armarium",
    quantity: "1243",
    price: "44",
    remember_me: "false",
  },
  "test-path-Login-to-BuySuccess": {
    username: "toto",
    password: "toto",
    search: "John",
  },
  "test-path-Login-to-CustomersSearchResults": {
    username: "toto",
    password: "toto",
    search: "Hello",
  },
  "test-path-Login-to-AddCustomer": {
    username: "toto",
    password: "toto",
    search: "Hello",
    customer_name: "New Customer 1",
    contact: "1235",
  },
  "test-path-Login-to-EditCustomer": {
    username: "toto",
    password: "toto",
    search: "Hello",
    customer_name: "Dikshant23 update",
    contact: "99750576266",
  },
  "test-path-Login-to-DeleteCustomerSuccess": {
    username: "toto",
    password: "toto",
    search: "Hello",
  },
  "test-path-Login-to-SellProduct": {
    username: "toto",
    password: "toto",
    search: "Hello",
    payment_status: "true",
    field: "true",
    quantity: "12",
  },
  "test-path-Login-to-Customers-8fzg": {
    username: "toto",
    password: "toto",
    search: "Hello",
  },
  "test-path-Login-to-AddCustomerSuccess": {
    username: "toto",
    password: "toto",
    search: "Hello",
    customer_name: "New Customer 1",
    contact: "1235",
  },
  "test-path-Login-to-EditCustomerSuccess": {
    username: "toto",
    password: "toto",
    search: "Hello",
    customer_name: "Dikshant23 update",
    contact: "99750576266",
  },
  "test-path-Login-to-SellSuccess": {
    username: "toto",
    password: "toto",
    search: "Hello",
    payment_status: "true",
    field: "true",
    quantity: "12",
  },
  "test-path-Login-to-ProductsSearchResults": {
    username: "toto",
    password: "toto",
    search: "www",
  },
  "test-path-Login-to-AddProduct": {
    username: "toto",
    password: "toto",
    search: "www",
    product_name: "Bislery",
    product_category: "Water Bottle",
    product_price: "19",
    product_stock: "1712",
  },
  "test-path-Login-to-EditProduct": {
    username: "toto",
    password: "toto",
    search: "www",
    product_name: "Bislery",
    product_category: "Water Bottle",
    product_price: "19",
    product_stock: "1712",
  },
  "test-path-Login-to-Products-a7ej": {
    username: "toto",
    password: "toto",
    search: "www",
  },
  "test-path-Login-to-AddProductSuccess": {
    username: "toto",
    password: "toto",
    search: "www",
    product_name: "Bislery",
    product_category: "Water Bottle",
    product_price: "19",
    product_stock: "1712",
  },
  "test-path-Login-to-EditProductSuccess": {
    username: "toto",
    password: "toto",
    search: "www",
    product_name: "Bislery",
    product_category: "Water Bottle",
    product_price: "19",
    product_stock: "1712",
  },
  "test-path-Login-to-UpdatePaidstatus": {
    username: "toto",
    password: "toto",
    search: "Ergonomic Aluminum Soap",
  },
  "test-path-Login-to-DeleteOrderSuccess": {
    username: "toto",
    password: "toto",
    search: "Modern Plastic Bacon",
  },
  "test-path-Login-to-ViewBill": {
    username: "toto",
    password: "toto",
    search: "Unbranded Silk Cheese",
  },
};

import { restoreWaterDb } from "../../../src/scripts/restore-water-db";

test.beforeEach(async () => {
  restoreWaterDb();
});

test("login - login - dashboard - vendors - vendors", async ({ page }) => {
  const data = testData["test-path-Login-to-Vendors"];

  await page.goto("http://localhost/water-management");
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[1]/input')
    .fill(data["username"]);
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[2]/input')
    .fill(data["password"]);
  await page.locator('xpath=//*[@id="page-"]/form/div/div[2]/button').click();
  await page.locator('xpath=//*[@id="side-menu"]/li[2]/a').click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  // Verify: text("Vendor Name")
  var item = page.getByText("Vendor Name");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Water Bottle")
  var item = page.getByText("Water Bottle");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("login - login - dashboard - customer - customers", async ({ page }) => {
  const data = testData["test-path-Login-to-Customers"];

  await page.goto("http://localhost/water-management");
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[1]/input')
    .fill(data["username"]);
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[2]/input')
    .fill(data["password"]);
  await page.locator('xpath=//*[@id="page-"]/form/div/div[2]/button').click();
  await page.locator('xpath=//*[@id="side-menu"]/li[3]/a').click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  // Verify: text("Customer Name")
  var item = page.getByText("Customer Name");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Contact no")
  var item = page.getByText("Contact no");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Dikshant23")
  var item = page.getByText("Dikshant23");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("login - login - dashboard - products - products", async ({ page }) => {
  const data = testData["test-path-Login-to-Products"];

  await page.goto("http://localhost/water-management");
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[1]/input')
    .fill(data["username"]);
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[2]/input')
    .fill(data["password"]);
  await page.locator('xpath=//*[@id="page-"]/form/div/div[2]/button').click();
  await page.locator('xpath=//*[@id="side-menu"]/li[4]/a').click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  // Verify: text("aw")
  var item = page.getByText("aw");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: not text("Contact no")
  var item = page.getByText("Contact no");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeHidden();
  } else {
    await expect(item).toBeHidden();
  }
});

test("login - login - dashboard - orders - orders", async ({ page }) => {
  const data = testData["test-path-Login-to-Orders"];

  await page.goto("http://localhost/water-management");
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[1]/input')
    .fill(data["username"]);
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[2]/input')
    .fill(data["password"]);
  await page.locator('xpath=//*[@id="page-"]/form/div/div[2]/button').click();
  await page.locator('xpath=//*[@id="side-menu"]/li[5]/a').click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  // Verify: text("Customer Name")
  var item = page.getByText("Customer Name");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: not text("Contact no")
  var item = page.getByText("Contact no");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeHidden();
  } else {
    await expect(item).toBeHidden();
  }
});

test("login - login - dashboard", async ({ page }) => {
  const data = testData["test-path-Login-to-Dashboard"];

  await page.goto("http://localhost/water-management");
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[1]/input')
    .fill(data["username"]);
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[2]/input')
    .fill(data["password"]);
  await page.locator('xpath=//*[@id="page-"]/form/div/div[2]/button').click();
  // Verify: not text("Search")
  var item = page.getByText("Search");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeHidden();
  } else {
    await expect(item).toBeHidden();
  }
  // Verify: text("Dashboard")
  var item = page.getByText("Dashboard");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: not text("Product")
  var item = page.getByText("Product");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeHidden();
  } else {
    await expect(item).toBeHidden();
  }
  // Verify: not text("Water Bottle")
  var item = page.getByText("Water Bottle");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeHidden();
  } else {
    await expect(item).toBeHidden();
  }
});

test("login - login - dashboard - vendors - vendors - go - vendors search results", async ({
  page,
}) => {
  const data = testData["test-path-Login-to-VendorsSearchResults"];

  await page.goto("http://localhost/water-management");
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[1]/input')
    .fill(data["username"]);
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[2]/input')
    .fill(data["password"]);
  await page.locator('xpath=//*[@id="page-"]/form/div/div[2]/button').click();
  await page.locator('xpath=//*[@id="side-menu"]/li[2]/a').click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div[2]/form/input[2]')
    .click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  // Verify: text("Vendor Name")
  var item = page.getByText("Vendor Name");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: not text("Water Bottle")
  var item = page.getByText("Water Bottle");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeHidden();
  } else {
    await expect(item).toBeHidden();
  }
  // Verify: text("Search")
  var item = page.getByText("Search");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("login - login - dashboard - vendors - vendors - + add vendors - add vendor", async ({
  page,
}) => {
  const data = testData["test-path-Login-to-AddVendor"];

  await page.goto("http://localhost/water-management");
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[1]/input')
    .fill(data["username"]);
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[2]/input')
    .fill(data["password"]);
  await page.locator('xpath=//*[@id="page-"]/form/div/div[2]/button').click();
  await page.locator('xpath=//*[@id="side-menu"]/li[2]/a').click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  await page.locator('xpath=//*[@id="page-wrapper"]/div[2]/a/h4').click();
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div/form/div[1]/div/input')
    .fill(data["vendor_name"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div/form/div[2]/div/input')
    .fill(data["contact"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div/form/div[3]/div/div/select')
    .selectOption(data["product"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div/form/div[4]/div/input')
    .fill(data["quantity"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div/form/div[5]/div/input')
    .fill(data["price"]);
  // Verify: text("Submit")
  var item = page.getByText("Submit");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Product")
  var item = page.getByText("Product");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: not text("Quantity")
  var item = page.getByText("Quantity");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeHidden();
  } else {
    await expect(item).toBeHidden();
  }
});

test("login - login - dashboard - vendors - vendors - edit - edit vendor", async ({
  page,
}) => {
  const data = testData["test-path-Login-to-EditVendor"];

  await page.goto("http://localhost/water-management");
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[1]/input')
    .fill(data["username"]);
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[2]/input')
    .fill(data["password"]);
  await page.locator('xpath=//*[@id="page-"]/form/div/div[2]/button').click();
  await page.locator('xpath=//*[@id="side-menu"]/li[2]/a').click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/table/tbody/tr[1]/td[7]/a[1]')
    .click();
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div/form/div[1]/div/input')
    .fill(data["vendor_name"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div/form/div[2]/div/input')
    .fill(data["contact"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div/form/div[3]/div[1]/div/select')
    .selectOption(data["product_catgory"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div/form/div[3]/div[2]/div/input')
    .fill(data["product"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div/form/div[3]/div[3]/div/input')
    .fill(data["quantity"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div/form/div[3]/div[4]/div/input')
    .fill(data["price"]);
  if (data["remember_me"] === "true") {
    await page
      .locator(
        'xpath=//*[@id="page-wrapper"]/div/form/div[3]/div[5]/div/div/label/input',
      )
      .check();
  } else {
    await page
      .locator(
        'xpath=//*[@id="page-wrapper"]/div/form/div[3]/div[5]/div/div/label/input',
      )
      .uncheck();
  }
  // Verify: text("Vendor Name")
  var item = page.getByText("Vendor Name");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: not text("Search")
  var item = page.getByText("Search");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeHidden();
  } else {
    await expect(item).toBeHidden();
  }
});

test("login - login - dashboard - vendors - vendors - delete - delete vendor success", async ({
  page,
}) => {
  const data = testData["test-path-Login-to-DeleteVendorSuccess"];

  await page.goto("http://localhost/water-management");
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[1]/input')
    .fill(data["username"]);
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[2]/input')
    .fill(data["password"]);
  await page.locator('xpath=//*[@id="page-"]/form/div/div[2]/button').click();
  await page.locator('xpath=//*[@id="side-menu"]/li[2]/a').click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/table/tbody/tr[1]/td[7]/a[2]')
    .click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  // Verify: text("Vendor Name")
  var item = page.getByText("Vendor Name");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Water Bottle")
  var item = page.getByText("Water Bottle");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("login - login - dashboard - vendors - vendors - buy - confirm buy", async ({
  page,
}) => {
  const data = testData["test-path-Login-to-ConfirmBuy"];

  await page.goto("http://localhost/water-management");
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[1]/input')
    .fill(data["username"]);
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[2]/input')
    .fill(data["password"]);
  await page.locator('xpath=//*[@id="page-"]/form/div/div[2]/button').click();
  await page.locator('xpath=//*[@id="side-menu"]/li[2]/a').click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/table/tbody/tr[1]/td[7]/a[3]')
    .click();
  // Verify: text("Buy")
  var item = page.getByText("Buy");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: not text("Search")
  var item = page.getByText("Search");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeHidden();
  } else {
    await expect(item).toBeHidden();
  }
});

test("login - login - dashboard - vendors - vendors - go - vendors search results - back - vendors", async ({
  page,
}) => {
  const data = testData["test-path-Login-to-Vendors-v49x"];

  await page.goto("http://localhost/water-management");
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[1]/input')
    .fill(data["username"]);
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[2]/input')
    .fill(data["password"]);
  await page.locator('xpath=//*[@id="page-"]/form/div/div[2]/button').click();
  await page.locator('xpath=//*[@id="side-menu"]/li[2]/a').click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div[2]/form/input[2]')
    .click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  await page.locator('xpath=//*[@id="page-wrapper"]/div[2]/a[1]').click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  // Verify: text("Vendor Name")
  var item = page.getByText("Vendor Name");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Water Bottle")
  var item = page.getByText("Water Bottle");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("login - login - dashboard - vendors - vendors - + add vendors - add vendor - submit - add vendor success", async ({
  page,
}) => {
  const data = testData["test-path-Login-to-AddVendorSuccess"];

  await page.goto("http://localhost/water-management");
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[1]/input')
    .fill(data["username"]);
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[2]/input')
    .fill(data["password"]);
  await page.locator('xpath=//*[@id="page-"]/form/div/div[2]/button').click();
  await page.locator('xpath=//*[@id="side-menu"]/li[2]/a').click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  await page.locator('xpath=//*[@id="page-wrapper"]/div[2]/a/h4').click();
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div/form/div[1]/div/input')
    .fill(data["vendor_name"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div/form/div[2]/div/input')
    .fill(data["contact"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div/form/div[3]/div/div/select')
    .selectOption(data["product"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div/form/div[4]/div/input')
    .fill(data["quantity"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div/form/div[5]/div/input')
    .fill(data["price"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div/form/div[6]/div/button')
    .click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  // Verify: text("Vendor Name")
  var item = page.getByText("Vendor Name");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Water Bottle")
  var item = page.getByText("Water Bottle");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("login - login - dashboard - vendors - vendors - edit - edit vendor - submit - edit vendor success", async ({
  page,
}) => {
  const data = testData["test-path-Login-to-EditVendorSuccess"];

  await page.goto("http://localhost/water-management");
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[1]/input')
    .fill(data["username"]);
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[2]/input')
    .fill(data["password"]);
  await page.locator('xpath=//*[@id="page-"]/form/div/div[2]/button').click();
  await page.locator('xpath=//*[@id="side-menu"]/li[2]/a').click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/table/tbody/tr[1]/td[7]/a[1]')
    .click();
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div/form/div[1]/div/input')
    .fill(data["vendor_name"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div/form/div[2]/div/input')
    .fill(data["contact"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div/form/div[3]/div[1]/div/select')
    .selectOption(data["product_catgory"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div/form/div[3]/div[2]/div/input')
    .fill(data["product"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div/form/div[3]/div[3]/div/input')
    .fill(data["quantity"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div/form/div[3]/div[4]/div/input')
    .fill(data["price"]);
  if (data["remember_me"] === "true") {
    await page
      .locator(
        'xpath=//*[@id="page-wrapper"]/div/form/div[3]/div[5]/div/div/label/input',
      )
      .check();
  } else {
    await page
      .locator(
        'xpath=//*[@id="page-wrapper"]/div/form/div[3]/div[5]/div/div/label/input',
      )
      .uncheck();
  }
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div/form/div[3]/div[6]/div/button')
    .click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  // Verify: text("Vendor Name")
  var item = page.getByText("Vendor Name");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Water Bottle")
  var item = page.getByText("Water Bottle");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("login - login - dashboard - vendors - vendors - buy - confirm buy - buy - buy success", async ({
  page,
}) => {
  const data = testData["test-path-Login-to-BuySuccess"];

  await page.goto("http://localhost/water-management");
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[1]/input')
    .fill(data["username"]);
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[2]/input')
    .fill(data["password"]);
  await page.locator('xpath=//*[@id="page-"]/form/div/div[2]/button').click();
  await page.locator('xpath=//*[@id="side-menu"]/li[2]/a').click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/table/tbody/tr[1]/td[7]/a[3]')
    .click();
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div/form/div[4]/div/button')
    .click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  // Verify: text("Vendor Name")
  var item = page.getByText("Vendor Name");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Water Bottle")
  var item = page.getByText("Water Bottle");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("login - login - dashboard - customer - customers - go - customers search results", async ({
  page,
}) => {
  const data = testData["test-path-Login-to-CustomersSearchResults"];

  await page.goto("http://localhost/water-management");
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[1]/input')
    .fill(data["username"]);
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[2]/input')
    .fill(data["password"]);
  await page.locator('xpath=//*[@id="page-"]/form/div/div[2]/button').click();
  await page.locator('xpath=//*[@id="side-menu"]/li[3]/a').click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div[2]/form/input[2]')
    .click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  // Verify: text("Customer Name")
  var item = page.getByText("Customer Name");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: not text("Dikshant23")
  var item = page.getByText("Dikshant23");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeHidden();
  } else {
    await expect(item).toBeHidden();
  }
});

test("login - login - dashboard - customer - customers - + add customer - add customer", async ({
  page,
}) => {
  const data = testData["test-path-Login-to-AddCustomer"];

  await page.goto("http://localhost/water-management");
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[1]/input')
    .fill(data["username"]);
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[2]/input')
    .fill(data["password"]);
  await page.locator('xpath=//*[@id="page-"]/form/div/div[2]/button').click();
  await page.locator('xpath=//*[@id="side-menu"]/li[3]/a').click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  await page.locator('xpath=//*[@id="page-wrapper"]/div[2]/a').click();
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div/form/div[1]/div/input')
    .fill(data["customer_name"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div/form/div[2]/div/input')
    .fill(data["contact"]);
  // Verify: text("Submit")
  var item = page.getByText("Submit");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: not text("Product")
  var item = page.getByText("Product");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeHidden();
  } else {
    await expect(item).toBeHidden();
  }
  // Verify: text("Dashboard")
  var item = page.getByText("Dashboard");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("login - login - dashboard - customer - customers - edit - edit customer", async ({
  page,
}) => {
  const data = testData["test-path-Login-to-EditCustomer"];

  await page.goto("http://localhost/water-management");
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[1]/input')
    .fill(data["username"]);
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[2]/input')
    .fill(data["password"]);
  await page.locator('xpath=//*[@id="page-"]/form/div/div[2]/button').click();
  await page.locator('xpath=//*[@id="side-menu"]/li[3]/a').click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/table/tbody/tr[1]/td[3]/a[1]')
    .click();
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div[1]/form/div[1]/div/input')
    .fill(data["customer_name"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div[1]/form/div[2]/div/input')
    .fill(data["contact"]);
  // Verify: not text("Dashboard")
  var item = page.getByText("Dashboard");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeHidden();
  } else {
    await expect(item).toBeHidden();
  }
  // Verify: text("Administrator")
  var item = page.getByText("Administrator");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("login - login - dashboard - customer - customers - delete - delete customer success", async ({
  page,
}) => {
  const data = testData["test-path-Login-to-DeleteCustomerSuccess"];

  await page.goto("http://localhost/water-management");
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[1]/input')
    .fill(data["username"]);
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[2]/input')
    .fill(data["password"]);
  await page.locator('xpath=//*[@id="page-"]/form/div/div[2]/button').click();
  await page.locator('xpath=//*[@id="side-menu"]/li[3]/a').click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/table/tbody/tr[1]/td[3]/a[2]')
    .click();
  // Verify: not text("Administrator")
  var item = page.getByText("Administrator");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeHidden();
  } else {
    await expect(item).toBeHidden();
  }
  // Verify: not text("Water Bottle")
  var item = page.getByText("Water Bottle");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeHidden();
  } else {
    await expect(item).toBeHidden();
  }
});

test("login - login - dashboard - customer - customers - sell - sell product", async ({
  page,
}) => {
  const data = testData["test-path-Login-to-SellProduct"];

  await page.goto("http://localhost/water-management");
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[1]/input')
    .fill(data["username"]);
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[2]/input')
    .fill(data["password"]);
  await page.locator('xpath=//*[@id="page-"]/form/div/div[2]/button').click();
  await page.locator('xpath=//*[@id="side-menu"]/li[3]/a').click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/table/tbody/tr[1]/td[3]/a[3]')
    .click();
  if (data["payment_status"] === "true") {
    await page
      .locator("xpath=/html/body/div/section/div[1]/form/div[3]/input[1]")
      .check();
  } else {
    await page
      .locator("xpath=/html/body/div/section/div[1]/form/div[3]/input[1]")
      .uncheck();
  }
  if (data["payment_status"] === "true") {
    await page
      .locator("xpath=/html/body/div/section/div[1]/form/div[3]/input[2]")
      .check();
  } else {
    await page
      .locator("xpath=/html/body/div/section/div[1]/form/div[3]/input[2]")
      .uncheck();
  }
  await page
    .locator(
      'xpath=//*[@id="page-wrapper"]/div[2]/div/table/tbody/tr[1]/td[5]/input',
    )
    .fill(data["quantity"]);
  await page
    .locator(
      'xpath=//*[@id="page-wrapper"]/div[2]/div/table/tbody/tr[1]/td[5]/input',
    )
    .fill(data["quantity"]);
  await page
    .locator(
      'xpath=//*[@id="page-wrapper"]/div[2]/div/table/tbody/tr[1]/td[5]/input',
    )
    .fill(data["quantity"]);
  await page
    .locator(
      'xpath=//*[@id="page-wrapper"]/div[2]/div/table/tbody/tr[1]/td[5]/input',
    )
    .fill(data["quantity"]);
  // Verify: text("Submit")
  var item = page.getByText("Submit");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Dikshant23")
  var item = page.getByText("Dikshant23");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("login - login - dashboard - customer - customers - go - customers search results - back - customers", async ({
  page,
}) => {
  const data = testData["test-path-Login-to-Customers-8fzg"];

  await page.goto("http://localhost/water-management");
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[1]/input')
    .fill(data["username"]);
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[2]/input')
    .fill(data["password"]);
  await page.locator('xpath=//*[@id="page-"]/form/div/div[2]/button').click();
  await page.locator('xpath=//*[@id="side-menu"]/li[3]/a').click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div[2]/form/input[2]')
    .click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  await page.locator('xpath=//*[@id="page-wrapper"]/div[2]/a[1]').click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  // Verify: text("Customer Name")
  var item = page.getByText("Customer Name");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Contact no")
  var item = page.getByText("Contact no");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Dikshant23")
  var item = page.getByText("Dikshant23");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("login - login - dashboard - customer - customers - + add customer - add customer - submit - add customer success", async ({
  page,
}) => {
  const data = testData["test-path-Login-to-AddCustomerSuccess"];

  await page.goto("http://localhost/water-management");
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[1]/input')
    .fill(data["username"]);
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[2]/input')
    .fill(data["password"]);
  await page.locator('xpath=//*[@id="page-"]/form/div/div[2]/button').click();
  await page.locator('xpath=//*[@id="side-menu"]/li[3]/a').click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  await page.locator('xpath=//*[@id="page-wrapper"]/div[2]/a').click();
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div/form/div[1]/div/input')
    .fill(data["customer_name"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div/form/div[2]/div/input')
    .fill(data["contact"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div/form/div[3]/div/button')
    .click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  // Verify: text("Customer Name")
  var item = page.getByText("Customer Name");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Contact no")
  var item = page.getByText("Contact no");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Dikshant23")
  var item = page.getByText("Dikshant23");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("login - login - dashboard - customer - customers - edit - edit customer - submit - edit customer success", async ({
  page,
}) => {
  const data = testData["test-path-Login-to-EditCustomerSuccess"];

  await page.goto("http://localhost/water-management");
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[1]/input')
    .fill(data["username"]);
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[2]/input')
    .fill(data["password"]);
  await page.locator('xpath=//*[@id="page-"]/form/div/div[2]/button').click();
  await page.locator('xpath=//*[@id="side-menu"]/li[3]/a').click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/table/tbody/tr[1]/td[3]/a[1]')
    .click();
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div[1]/form/div[1]/div/input')
    .fill(data["customer_name"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div[1]/form/div[2]/div/input')
    .fill(data["contact"]);
  await page.locator('xpath=//*[@id="page-wrapper"]/div[2]/div/button').click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  // Verify: text("Customer Name")
  var item = page.getByText("Customer Name");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Contact no")
  var item = page.getByText("Contact no");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: text("Dikshant23")
  var item = page.getByText("Dikshant23");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("login - login - dashboard - customer - customers - sell - sell product - submit - sell success", async ({
  page,
}) => {
  const data = testData["test-path-Login-to-SellSuccess"];

  await page.goto("http://localhost/water-management");
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[1]/input')
    .fill(data["username"]);
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[2]/input')
    .fill(data["password"]);
  await page.locator('xpath=//*[@id="page-"]/form/div/div[2]/button').click();
  await page.locator('xpath=//*[@id="side-menu"]/li[3]/a').click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/table/tbody/tr[1]/td[3]/a[3]')
    .click();
  if (data["payment_status"] === "true") {
    await page
      .locator("xpath=/html/body/div/section/div[1]/form/div[3]/input[1]")
      .check();
  } else {
    await page
      .locator("xpath=/html/body/div/section/div[1]/form/div[3]/input[1]")
      .uncheck();
  }
  if (data["payment_status"] === "true") {
    await page
      .locator("xpath=/html/body/div/section/div[1]/form/div[3]/input[2]")
      .check();
  } else {
    await page
      .locator("xpath=/html/body/div/section/div[1]/form/div[3]/input[2]")
      .uncheck();
  }
  await page
    .locator(
      'xpath=//*[@id="page-wrapper"]/div[2]/div/table/tbody/tr[1]/td[5]/input',
    )
    .fill(data["quantity"]);
  await page
    .locator(
      'xpath=//*[@id="page-wrapper"]/div[2]/div/table/tbody/tr[1]/td[5]/input',
    )
    .fill(data["quantity"]);
  await page
    .locator(
      'xpath=//*[@id="page-wrapper"]/div[2]/div/table/tbody/tr[1]/td[5]/input',
    )
    .fill(data["quantity"]);
  await page
    .locator(
      'xpath=//*[@id="page-wrapper"]/div[2]/div/table/tbody/tr[1]/td[5]/input',
    )
    .fill(data["quantity"]);
  await page.locator('xpath=//*[@id="page-wrapper"]/div[3]/div/button').click();
  // Verify: not text("Administrator")
  var item = page.getByText("Administrator");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeHidden();
  } else {
    await expect(item).toBeHidden();
  }
  // Verify: text("Water Bottle")
  var item = page.getByText("Water Bottle");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("login - login - dashboard - products - products - go - products search results", async ({
  page,
}) => {
  const data = testData["test-path-Login-to-ProductsSearchResults"];

  await page.goto("http://localhost/water-management");
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[1]/input')
    .fill(data["username"]);
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[2]/input')
    .fill(data["password"]);
  await page.locator('xpath=//*[@id="page-"]/form/div/div[2]/button').click();
  await page.locator('xpath=//*[@id="side-menu"]/li[4]/a').click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div[2]/form/input[2]')
    .click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  // Verify: text("Product")
  var item = page.getByText("Product");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: not text("Water Bottle")
  var item = page.getByText("Water Bottle");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeHidden();
  } else {
    await expect(item).toBeHidden();
  }
  // Verify: text("Search")
  var item = page.getByText("Search");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: not text("Contact no")
  var item = page.getByText("Contact no");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeHidden();
  } else {
    await expect(item).toBeHidden();
  }
});

test("login - login - dashboard - products - products - + add product - add product", async ({
  page,
}) => {
  const data = testData["test-path-Login-to-AddProduct"];

  await page.goto("http://localhost/water-management");
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[1]/input')
    .fill(data["username"]);
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[2]/input')
    .fill(data["password"]);
  await page.locator('xpath=//*[@id="page-"]/form/div/div[2]/button').click();
  await page.locator('xpath=//*[@id="side-menu"]/li[4]/a').click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  await page.locator('xpath=//*[@id="page-wrapper"]/div[2]/a').click();
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div/form/div[2]/div/input')
    .fill(data["product_name"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div/form/div[1]/div/input')
    .fill(data["product_category"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div/form/div[3]/div/input')
    .fill(data["product_price"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div/form/div[4]/div/input')
    .fill(data["product_stock"]);
  // Verify: text("Submit")
  var item = page.getByText("Submit");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: not text("Product")
  var item = page.getByText("Product");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeHidden();
  } else {
    await expect(item).toBeHidden();
  }
  // Verify: text("Dashboard")
  var item = page.getByText("Dashboard");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("login - login - dashboard - products - products - edit - edit product", async ({
  page,
}) => {
  const data = testData["test-path-Login-to-EditProduct"];

  await page.goto("http://localhost/water-management");
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[1]/input')
    .fill(data["username"]);
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[2]/input')
    .fill(data["password"]);
  await page.locator('xpath=//*[@id="page-"]/form/div/div[2]/button').click();
  await page.locator('xpath=//*[@id="side-menu"]/li[4]/a').click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/table/tbody/tr[1]/td[6]/form/a[1]')
    .click();
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div[1]/form/div[2]/div/input')
    .fill(data["product_name"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div[1]/form/div[1]/div/input')
    .fill(data["product_category"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div[1]/form/div[3]/div/input')
    .fill(data["product_price"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div[1]/form/div[4]/div/input')
    .fill(data["product_stock"]);
  // Verify: text("Submit")
  var item = page.getByText("Submit");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: not text("Product")
  var item = page.getByText("Product");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeHidden();
  } else {
    await expect(item).toBeHidden();
  }
  // Verify: text("Dashboard")
  var item = page.getByText("Dashboard");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("login - login - dashboard - products - products - go - products search results - back - products", async ({
  page,
}) => {
  const data = testData["test-path-Login-to-Products-a7ej"];

  await page.goto("http://localhost/water-management");
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[1]/input')
    .fill(data["username"]);
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[2]/input')
    .fill(data["password"]);
  await page.locator('xpath=//*[@id="page-"]/form/div/div[2]/button').click();
  await page.locator('xpath=//*[@id="side-menu"]/li[4]/a').click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div[2]/form/input[2]')
    .click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  await page.locator('xpath=//*[@id="page-wrapper"]/div[2]/a[1]').click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  // Verify: text("aw")
  var item = page.getByText("aw");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: not text("Contact no")
  var item = page.getByText("Contact no");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeHidden();
  } else {
    await expect(item).toBeHidden();
  }
});

test("login - login - dashboard - products - products - + add product - add product - submit - add product success", async ({
  page,
}) => {
  const data = testData["test-path-Login-to-AddProductSuccess"];

  await page.goto("http://localhost/water-management");
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[1]/input')
    .fill(data["username"]);
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[2]/input')
    .fill(data["password"]);
  await page.locator('xpath=//*[@id="page-"]/form/div/div[2]/button').click();
  await page.locator('xpath=//*[@id="side-menu"]/li[4]/a').click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  await page.locator('xpath=//*[@id="page-wrapper"]/div[2]/a').click();
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div/form/div[2]/div/input')
    .fill(data["product_name"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div/form/div[1]/div/input')
    .fill(data["product_category"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div/form/div[3]/div/input')
    .fill(data["product_price"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div/form/div[4]/div/input')
    .fill(data["product_stock"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div/form/div[5]/div/button')
    .click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  // Verify: text("aw")
  var item = page.getByText("aw");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: not text("Contact no")
  var item = page.getByText("Contact no");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeHidden();
  } else {
    await expect(item).toBeHidden();
  }
});

test("login - login - dashboard - products - products - edit - edit product - submit - edit product success", async ({
  page,
}) => {
  const data = testData["test-path-Login-to-EditProductSuccess"];

  await page.goto("http://localhost/water-management");
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[1]/input')
    .fill(data["username"]);
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[2]/input')
    .fill(data["password"]);
  await page.locator('xpath=//*[@id="page-"]/form/div/div[2]/button').click();
  await page.locator('xpath=//*[@id="side-menu"]/li[4]/a').click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/table/tbody/tr[1]/td[6]/form/a[1]')
    .click();
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div[1]/form/div[2]/div/input')
    .fill(data["product_name"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div[1]/form/div[1]/div/input')
    .fill(data["product_category"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div[1]/form/div[3]/div/input')
    .fill(data["product_price"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/div[1]/form/div[4]/div/input')
    .fill(data["product_stock"]);
  await page.locator('xpath=//*[@id="page-wrapper"]/div[2]/div/button').click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  // Verify: text("aw")
  var item = page.getByText("aw");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: not text("Contact no")
  var item = page.getByText("Contact no");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeHidden();
  } else {
    await expect(item).toBeHidden();
  }
});

test("login - login - dashboard - orders - orders - paid - update paidstatus", async ({
  page,
}) => {
  const data = testData["test-path-Login-to-UpdatePaidstatus"];

  await page.goto("http://localhost/water-management");
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[1]/input')
    .fill(data["username"]);
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[2]/input')
    .fill(data["password"]);
  await page.locator('xpath=//*[@id="page-"]/form/div/div[2]/button').click();
  await page.locator('xpath=//*[@id="side-menu"]/li[5]/a').click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/table/tbody/tr[1]/td[3]/a')
    .click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  // Verify: text("Customer Name")
  var item = page.getByText("Customer Name");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: not text("Contact no")
  var item = page.getByText("Contact no");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeHidden();
  } else {
    await expect(item).toBeHidden();
  }
});

test("login - login - dashboard - orders - orders - delete - delete order success", async ({
  page,
}) => {
  const data = testData["test-path-Login-to-DeleteOrderSuccess"];

  await page.goto("http://localhost/water-management");
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[1]/input')
    .fill(data["username"]);
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[2]/input')
    .fill(data["password"]);
  await page.locator('xpath=//*[@id="page-"]/form/div/div[2]/button').click();
  await page.locator('xpath=//*[@id="side-menu"]/li[5]/a').click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/table/tbody/tr[1]/td[6]/a[2]')
    .click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  // Verify: text("Customer Name")
  var item = page.getByText("Customer Name");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
  // Verify: not text("Contact no")
  var item = page.getByText("Contact no");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeHidden();
  } else {
    await expect(item).toBeHidden();
  }
});

test("login - login - dashboard - orders - orders - b i l l - view bill", async ({
  page,
}) => {
  const data = testData["test-path-Login-to-ViewBill"];

  await page.goto("http://localhost/water-management");
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[1]/input')
    .fill(data["username"]);
  await page
    .locator('xpath=//*[@id="page-"]/form/div/div[2]/div[2]/input')
    .fill(data["password"]);
  await page.locator('xpath=//*[@id="page-"]/form/div/div[2]/button').click();
  await page.locator('xpath=//*[@id="side-menu"]/li[5]/a').click();
  await page.locator('xpath=//*[@id="input_search"]').fill(data["search"]);
  await page
    .locator('xpath=//*[@id="page-wrapper"]/table/tbody/tr[1]/td[6]/a[3]')
    .click();
  // Verify: not text("Administrator")
  var item = page.getByText("Administrator");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeHidden();
  } else {
    await expect(item).toBeHidden();
  }
  // Verify: text("Water Bottle")
  var item = page.getByText("Water Bottle");
  if ((await item.count()) > 1) {
    await expect(item.last()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});
