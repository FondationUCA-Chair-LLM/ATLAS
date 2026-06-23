import { test, expect } from "@playwright/test";

// Base URL: https://google-gruyere.appspot.com/start

// Test Data
const testData = {
  "test-path-Start-to-HomeAnon": {},
  "test-path-Start-to-AccountCreated": {
    user_name: "toto",
    password: "toto",
  },
  "test-path-Start-to-HomeAnon-rt28": {
    user_name: "toto",
    password: "toto",
  },
  "test-path-Start-to-HomeAuth": {
    user_name: "toto",
    password: "toto",
  },
  "test-path-Start-to-HomeAnon-cvhm": {
    user_name: "toto",
    password: "toto",
  },
  "test-path-Start-to-NewSnippet": {
    user_name: "toto",
    password: "toto",
    add_a_new_snippet: "hello snippet",
  },
  "test-path-Start-to-MySnippetsEmpty": {
    user_name: "toto",
    password: "toto",
  },
  "test-path-Start-to-Profile": {
    user_name: "toto",
    password: "toto",
    old_password: "toto",
    new_password: "DfYsZdp522RJ",
    icon: "clamo",
    homepage: "perspiciatis",
    profile_color: "apud",
    private_snippet:
      "Defleo territo aveho doloribus omnis. Pectus assumenda advoco.",
  },
  "test-path-Start-to-MySnippetsAdded": {
    user_name: "toto",
    password: "toto",
    add_a_new_snippet: "hello snippet",
  },
  "test-path-Start-to-HomeAuth-mz09": {
    user_name: "toto",
    password: "toto",
  },
  "test-path-Start-to-HomeAuth-9gn2": {
    user_name: "toto",
    password: "toto",
    old_password: "toto",
    new_password: "mbJPw9_RT2jz",
    icon: "varius",
    homepage: "patrocinor",
    profile_color: "verus",
    private_snippet:
      "Adipisci comparo creta cernuus. Consuasor cicuta illo aqua thorax aestas vos ter avarus.",
  },
};

test("start - agree & start - home anon", async ({ page }) => {
  const data = testData["test-path-Start-to-HomeAnon"];

  await page.goto("https://google-gruyere.appspot.com/start");
  await page.locator("xpath=/html/body/h2/a").click();
  // Verify: text("Cheddar")
  var item = page.getByText("Cheddar");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("start - agree & start - home anon - sign up - sign up - create account - account created", async ({
  page,
}) => {
  const data = testData["test-path-Start-to-AccountCreated"];

  await page.goto("https://google-gruyere.appspot.com/start");
  await page.locator("xpath=/html/body/h2/a").click();
  await page.locator('xpath=//*[@id="menu-right"]/a[2]').click();
  await page
    .locator("xpath=/html/body/div[2]/form/table/tbody/tr[1]/td[2]/input")
    .fill(data["user_name"]);
  await page
    .locator("xpath=/html/body/div[2]/form/table/tbody/tr[2]/td[2]/input")
    .fill(data["password"]);
  await page
    .locator("xpath=/html/body/div[2]/form/table/tbody/tr[3]/td[2]/input")
    .click();
  // Verify: text("Account created.")
  var item = page.getByText("Account created.");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("start - agree & start - home anon - sign up - sign up - home - home anon", async ({
  page,
}) => {
  const data = testData["test-path-Start-to-HomeAnon-rt28"];

  await page.goto("https://google-gruyere.appspot.com/start");
  await page.locator("xpath=/html/body/h2/a").click();
  await page.locator('xpath=//*[@id="menu-right"]/a[2]').click();
  await page
    .locator("xpath=/html/body/div[2]/form/table/tbody/tr[1]/td[2]/input")
    .fill(data["user_name"]);
  await page
    .locator("xpath=/html/body/div[2]/form/table/tbody/tr[2]/td[2]/input")
    .fill(data["password"]);
  await page.locator('xpath=//*[@id="menu-left"]/a').click();
  // Verify: text("Cheddar")
  var item = page.getByText("Cheddar");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("start - agree & start - home anon - sign up - sign up - create account - account created - home - home auth", async ({
  page,
}) => {
  const data = testData["test-path-Start-to-HomeAuth"];

  await page.goto("https://google-gruyere.appspot.com/start");
  await page.locator("xpath=/html/body/h2/a").click();
  await page.locator('xpath=//*[@id="menu-right"]/a[2]').click();
  await page
    .locator("xpath=/html/body/div[2]/form/table/tbody/tr[1]/td[2]/input")
    .fill(data["user_name"]);
  await page
    .locator("xpath=/html/body/div[2]/form/table/tbody/tr[2]/td[2]/input")
    .fill(data["password"]);
  await page
    .locator("xpath=/html/body/div[2]/form/table/tbody/tr[3]/td[2]/input")
    .click();
  await page.locator('xpath=//*[@id="menu-left"]/a').click();
  // Verify: text("Cheddar Mac")
  var item = page.getByText("Cheddar Mac");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("start - agree & start - home anon - sign up - sign up - create account - account created - home - home auth - sign out - home anon", async ({
  page,
}) => {
  const data = testData["test-path-Start-to-HomeAnon-cvhm"];

  await page.goto("https://google-gruyere.appspot.com/start");
  await page.locator("xpath=/html/body/h2/a").click();
  await page.locator('xpath=//*[@id="menu-right"]/a[2]').click();
  await page
    .locator("xpath=/html/body/div[2]/form/table/tbody/tr[1]/td[2]/input")
    .fill(data["user_name"]);
  await page
    .locator("xpath=/html/body/div[2]/form/table/tbody/tr[2]/td[2]/input")
    .fill(data["password"]);
  await page
    .locator("xpath=/html/body/div[2]/form/table/tbody/tr[3]/td[2]/input")
    .click();
  await page.locator('xpath=//*[@id="menu-left"]/a').click();
  await page.locator('xpath=//*[@id="menu-right"]/a[2]').click();
  // Verify: text("Cheddar")
  var item = page.getByText("Cheddar");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("start - agree & start - home anon - sign up - sign up - create account - account created - home - home auth - new snippet - new snippet", async ({
  page,
}) => {
  const data = testData["test-path-Start-to-NewSnippet"];

  await page.goto("https://google-gruyere.appspot.com/start");
  await page.locator("xpath=/html/body/h2/a").click();
  await page.locator('xpath=//*[@id="menu-right"]/a[2]').click();
  await page
    .locator("xpath=/html/body/div[2]/form/table/tbody/tr[1]/td[2]/input")
    .fill(data["user_name"]);
  await page
    .locator("xpath=/html/body/div[2]/form/table/tbody/tr[2]/td[2]/input")
    .fill(data["password"]);
  await page
    .locator("xpath=/html/body/div[2]/form/table/tbody/tr[3]/td[2]/input")
    .click();
  await page.locator('xpath=//*[@id="menu-left"]/a').click();
  await page.locator('xpath=//*[@id="menu-left"]/a[3]').click();
  await page
    .locator("xpath=/html/body/div[2]/div/form/textarea")
    .fill(data["add_a_new_snippet"]);
  // Verify: text("Gruyere: New Snippet")
  var item = page.getByText("Gruyere: New Snippet");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("start - agree & start - home anon - sign up - sign up - create account - account created - home - home auth - my snippets - my snippets empty", async ({
  page,
}) => {
  const data = testData["test-path-Start-to-MySnippetsEmpty"];

  await page.goto("https://google-gruyere.appspot.com/start");
  await page.locator("xpath=/html/body/h2/a").click();
  await page.locator('xpath=//*[@id="menu-right"]/a[2]').click();
  await page
    .locator("xpath=/html/body/div[2]/form/table/tbody/tr[1]/td[2]/input")
    .fill(data["user_name"]);
  await page
    .locator("xpath=/html/body/div[2]/form/table/tbody/tr[2]/td[2]/input")
    .fill(data["password"]);
  await page
    .locator("xpath=/html/body/div[2]/form/table/tbody/tr[3]/td[2]/input")
    .click();
  await page.locator('xpath=//*[@id="menu-left"]/a').click();
  await page.locator('xpath=//*[@id="menu-left"]/a[2]').click();
  // Verify: text("No snippets.")
  var item = page.getByText("No snippets.");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("start - agree & start - home anon - sign up - sign up - create account - account created - home - home auth - profile - profile", async ({
  page,
}) => {
  const data = testData["test-path-Start-to-Profile"];

  await page.goto("https://google-gruyere.appspot.com/start");
  await page.locator("xpath=/html/body/h2/a").click();
  await page.locator('xpath=//*[@id="menu-right"]/a[2]').click();
  await page
    .locator("xpath=/html/body/div[2]/form/table/tbody/tr[1]/td[2]/input")
    .fill(data["user_name"]);
  await page
    .locator("xpath=/html/body/div[2]/form/table/tbody/tr[2]/td[2]/input")
    .fill(data["password"]);
  await page
    .locator("xpath=/html/body/div[2]/form/table/tbody/tr[3]/td[2]/input")
    .click();
  await page.locator('xpath=//*[@id="menu-left"]/a').click();
  await page.locator('xpath=//*[@id="menu-right"]/a[1]').click();
  await page
    .locator("xpath=/html/body/div[3]/form/table/tbody/tr[2]/td[2]/input")
    .fill(data["user_name"]);
  await page
    .locator("xpath=/html/body/div[3]/form/table/tbody/tr[3]/td[2]/input")
    .fill(data["old_password"]);
  await page
    .locator("xpath=/html/body/div[3]/form/table/tbody/tr[4]/td[2]/input")
    .fill(data["new_password"]);
  await page
    .locator("xpath=/html/body/div[3]/form/table/tbody/tr[5]/td[2]/input")
    .fill(data["icon"]);
  await page
    .locator("xpath=/html/body/div[3]/form/table/tbody/tr[6]/td[2]/input")
    .fill(data["homepage"]);
  await page
    .locator("xpath=/html/body/div[3]/form/table/tbody/tr[7]/td[2]/input")
    .fill(data["profile_color"]);
  await page
    .locator("xpath=/html/body/div[3]/form/table/tbody/tr[8]/td[2]/textarea")
    .fill(data["private_snippet"]);
  // Verify: text("Gruyere: Profile")
  var item = page.getByText("Gruyere: Profile");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("start - agree & start - home anon - sign up - sign up - create account - account created - home - home auth - new snippet - new snippet - submit - my snippets added", async ({
  page,
}) => {
  const data = testData["test-path-Start-to-MySnippetsAdded"];

  await page.goto("https://google-gruyere.appspot.com/start");
  await page.locator("xpath=/html/body/h2/a").click();
  await page.locator('xpath=//*[@id="menu-right"]/a[2]').click();
  await page
    .locator("xpath=/html/body/div[2]/form/table/tbody/tr[1]/td[2]/input")
    .fill(data["user_name"]);
  await page
    .locator("xpath=/html/body/div[2]/form/table/tbody/tr[2]/td[2]/input")
    .fill(data["password"]);
  await page
    .locator("xpath=/html/body/div[2]/form/table/tbody/tr[3]/td[2]/input")
    .click();
  await page.locator('xpath=//*[@id="menu-left"]/a').click();
  await page.locator('xpath=//*[@id="menu-left"]/a[3]').click();
  await page
    .locator("xpath=/html/body/div[2]/div/form/textarea")
    .fill(data["add_a_new_snippet"]);
  await page
    .locator("xpath=/html/body/div[2]/div/form/table/tbody/tr/td[2]/input")
    .click();
  // Verify: text("All snippets:")
  var item = page.getByText("All snippets:");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("start - agree & start - home anon - sign up - sign up - create account - account created - home - home auth - my snippets - my snippets empty - home - home auth", async ({
  page,
}) => {
  const data = testData["test-path-Start-to-HomeAuth-mz09"];

  await page.goto("https://google-gruyere.appspot.com/start");
  await page.locator("xpath=/html/body/h2/a").click();
  await page.locator('xpath=//*[@id="menu-right"]/a[2]').click();
  await page
    .locator("xpath=/html/body/div[2]/form/table/tbody/tr[1]/td[2]/input")
    .fill(data["user_name"]);
  await page
    .locator("xpath=/html/body/div[2]/form/table/tbody/tr[2]/td[2]/input")
    .fill(data["password"]);
  await page
    .locator("xpath=/html/body/div[2]/form/table/tbody/tr[3]/td[2]/input")
    .click();
  await page.locator('xpath=//*[@id="menu-left"]/a').click();
  await page.locator('xpath=//*[@id="menu-left"]/a[2]').click();
  await page.locator('xpath=//*[@id="menu-left"]/a[1]').click();
  // Verify: text("Cheddar Mac")
  var item = page.getByText("Cheddar Mac");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("start - agree & start - home anon - sign up - sign up - create account - account created - home - home auth - profile - profile - update - home auth", async ({
  page,
}) => {
  const data = testData["test-path-Start-to-HomeAuth-9gn2"];

  await page.goto("https://google-gruyere.appspot.com/start");
  await page.locator("xpath=/html/body/h2/a").click();
  await page.locator('xpath=//*[@id="menu-right"]/a[2]').click();
  await page
    .locator("xpath=/html/body/div[2]/form/table/tbody/tr[1]/td[2]/input")
    .fill(data["user_name"]);
  await page
    .locator("xpath=/html/body/div[2]/form/table/tbody/tr[2]/td[2]/input")
    .fill(data["password"]);
  await page
    .locator("xpath=/html/body/div[2]/form/table/tbody/tr[3]/td[2]/input")
    .click();
  await page.locator('xpath=//*[@id="menu-left"]/a').click();
  await page.locator('xpath=//*[@id="menu-right"]/a[1]').click();
  await page
    .locator("xpath=/html/body/div[3]/form/table/tbody/tr[2]/td[2]/input")
    .fill(data["user_name"]);
  await page
    .locator("xpath=/html/body/div[3]/form/table/tbody/tr[3]/td[2]/input")
    .fill(data["old_password"]);
  await page
    .locator("xpath=/html/body/div[3]/form/table/tbody/tr[4]/td[2]/input")
    .fill(data["new_password"]);
  await page
    .locator("xpath=/html/body/div[3]/form/table/tbody/tr[5]/td[2]/input")
    .fill(data["icon"]);
  await page
    .locator("xpath=/html/body/div[3]/form/table/tbody/tr[6]/td[2]/input")
    .fill(data["homepage"]);
  await page
    .locator("xpath=/html/body/div[3]/form/table/tbody/tr[7]/td[2]/input")
    .fill(data["profile_color"]);
  await page
    .locator("xpath=/html/body/div[3]/form/table/tbody/tr[8]/td[2]/textarea")
    .fill(data["private_snippet"]);
  await page
    .locator("xpath=/html/body/div[3]/form/table/tbody/tr[9]/td[2]/input")
    .click();
  // Verify: text("Cheddar Mac")
  var item = page.getByText("Cheddar Mac");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});
