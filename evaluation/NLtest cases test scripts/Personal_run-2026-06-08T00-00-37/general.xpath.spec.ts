import { test, expect } from "@playwright/test";

// Base URL: https://perso.limos.fr/~sesalva

// Test Data
const testData = {
  "test-path-Home-to-Research": {
    name: "Mohammad Crist",
    email: "Maybelle.Sipes-Effertz18@gmail.com",
    message:
      "Custodia clamo perspiciatis apud claro copiose defleo. Aveho doloribus omnis adipiscor pectus assumenda advoco vinum vociferor. Cogo alter stella decerno animus deputo adeo verbera caute.",
  },
  "test-path-Home-to-Tools": {
    name: "John Denesik DDS",
    email: "Therese.Bayer38@yahoo.com",
    message:
      "Consuasor cicuta illo aqua thorax aestas vos ter avarus. Tot suffragium suspendo. Aer contego ancilla urbanus qui comptus adversus colo communis.",
  },
  "test-path-Home-to-Publications": {
    name: "Shayna Carter",
    email: "Jenifer.Balistreri@yahoo.com",
    message:
      "Dolor venustas carus cunae temeritas. Aestus clam arx vetus. Recusandae ut thymbra audentia vapulus fugit timor vel cometes.",
    field: "amo",
    type: "*",
    date: "*",
  },
  "test-path-Home-to-Teaching": {
    name: "Robyn Adams",
    email: "Geneva36@hotmail.com",
    message:
      "Caste derideo coerceo cinis adfectus peior desolo admoneo cibo ver. Arbor deporto voro carbo. Temptatio capio suscipit corona ratione recusandae facilis alioqui.",
    field: "Sleek Concrete Chair",
  },
  "test-path-Home-to-Home": {
    name: "Marcelina Langworth",
    email: "Gilda92@hotmail.com",
    message:
      "Solutio totidem itaque ex carbo. Velit velut recusandae. Conscendo sursum velit valens termes.",
  },
  "test-path-Home-to-Home-z9le": {
    name: "Christian Moen",
    email: "Christian.OKeefe71@gmail.com",
    message:
      "Tamen sodalitas ulciscor solum minus. Corona celo careo. Crudelis vapulus quos theatrum desolo neque depromo autus suppono cicuta.",
  },
  "test-path-Home-to-Home-gp9w": {
    name: "Chaim Wilkinson III",
    email: "Walter.Grimes85@gmail.com",
    message:
      "Iusto video subito molestiae. Possimus vulariter apud. Utpote talio subiungo subvenio contigo claudeo tolero.",
  },
  "test-path-Home-to-Home-bgzz": {
    name: "Mr. Tate Kuvalis",
    email: "Eulalia.Mayert@yahoo.com",
    message:
      "Officiis adaugeo adfero traho contigo. Enim tepesco bibo qui. Admoneo excepturi hic.",
    field: "repellendus",
    type: "*",
    date: "*",
  },
  "test-path-Home-to-PublicationsNLExec": {
    name: "Jordon Schinner",
    email: "Verna.Jast15@hotmail.com",
    message:
      "Summopere solutio cibus virtus taceo iste perspiciatis. Carmen constans tempora accedo ancilla adipisci. Umbra succedo demitto.",
    field: "alter",
    type: "1",
    date: "*",
  },
  "test-path-Home-to-Home-hw8x": {
    name: "Christine Jacobi",
    email: "Mamie.Oberbrunner@hotmail.com",
    message:
      "Occaecati vilicus necessitatibus. Sed defungo in vilis creptio vito. Autus aegrus amaritudo accusamus alius statua aequitas comis tutis acervus.",
    field: "Rustic Concrete Bike",
  },
  "test-path-Home-to-TeachingSE": {
    name: "Sebastian Schneider",
    email: "Zack93@gmail.com",
    message:
      "Tantillus tego amet veniam despecto trepide. Vehemens creta abstergo ventosus aliqua. Virga virga nam ratione dedico.",
    field: "Frozen Concrete Salad",
  },
};

test("home - research - research", async ({ page }) => {
  const data = testData["test-path-Home-to-Research"];

  await page.goto("https://perso.limos.fr/~sesalva");
  await page.locator('xpath=//*[@id="inputName"]').fill(data["name"]);
  await page.locator('xpath=//*[@id="inputEmail"]').fill(data["email"]);
  await page.locator('xpath=//*[@id="inputMessage"]').fill(data["message"]);
  await page.locator('xpath=//*[@id="navbar-content"]/ul/li[2]/a').click();
  // Verify: text("Research topics")
  var item = page.getByText("Research topics");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home - tools - tools", async ({ page }) => {
  const data = testData["test-path-Home-to-Tools"];

  await page.goto("https://perso.limos.fr/~sesalva");
  await page.locator('xpath=//*[@id="inputName"]').fill(data["name"]);
  await page.locator('xpath=//*[@id="inputEmail"]').fill(data["email"]);
  await page.locator('xpath=//*[@id="inputMessage"]').fill(data["message"]);
  await page.locator('xpath=//*[@id="navbar-content"]/ul/li[3]/a').click();
  // Verify: text("Tools related to project or publications")
  var item = page.getByText("Tools related to project or publications");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home - publications - publications", async ({ page }) => {
  const data = testData["test-path-Home-to-Publications"];

  await page.goto("https://perso.limos.fr/~sesalva");
  await page.locator('xpath=//*[@id="inputName"]').fill(data["name"]);
  await page.locator('xpath=//*[@id="inputEmail"]').fill(data["email"]);
  await page.locator('xpath=//*[@id="inputMessage"]').fill(data["message"]);
  await page.locator('xpath=//*[@id="navbar-content"]/ul/li[4]/a').click();
  await page
    .locator('xpath=//*[@id="top"]/div[2]/div[2]/div/div/div[1]/div[2]/select')
    .selectOption(data["type"]);
  await page
    .locator('xpath=//*[@id="top"]/div[2]/div[2]/div/div/div[1]/div[3]/select')
    .selectOption(data["date"]);
  // Verify: text("Sébastien Salva, Redha Taguelmimt (2026).")
  var item = page.getByText("Sébastien Salva, Redha Taguelmimt (2026).");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home - teaching - teaching", async ({ page }) => {
  const data = testData["test-path-Home-to-Teaching"];

  await page.goto("https://perso.limos.fr/~sesalva");
  await page.locator('xpath=//*[@id="inputName"]').fill(data["name"]);
  await page.locator('xpath=//*[@id="inputEmail"]').fill(data["email"]);
  await page.locator('xpath=//*[@id="inputMessage"]').fill(data["message"]);
  await page.locator('xpath=//*[@id="navbar-content"]/ul/li[5]/a').click();
  // Verify: text("Search...")
  var item = page.getByText("Search...");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home - send - home", async ({ page }) => {
  const data = testData["test-path-Home-to-Home"];

  await page.goto("https://perso.limos.fr/~sesalva");
  await page.locator('xpath=//*[@id="inputName"]').fill(data["name"]);
  await page.locator('xpath=//*[@id="inputEmail"]').fill(data["email"]);
  await page.locator('xpath=//*[@id="inputMessage"]').fill(data["message"]);
  await page
    .locator('xpath=//*[@id="contact"]/div[2]/div/div[2]/div[1]/form/button')
    .click();
  await page.locator('xpath=//*[@id="inputName"]').fill(data["name"]);
  await page.locator('xpath=//*[@id="inputEmail"]').fill(data["email"]);
  await page.locator('xpath=//*[@id="inputMessage"]').fill(data["message"]);
  // Verify: text("Biography")
  var item = page.getByText("Biography");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home - research - research - home - home", async ({ page }) => {
  const data = testData["test-path-Home-to-Home-z9le"];

  await page.goto("https://perso.limos.fr/~sesalva");
  await page.locator('xpath=//*[@id="inputName"]').fill(data["name"]);
  await page.locator('xpath=//*[@id="inputEmail"]').fill(data["email"]);
  await page.locator('xpath=//*[@id="inputMessage"]').fill(data["message"]);
  await page.locator('xpath=//*[@id="navbar-content"]/ul/li[2]/a').click();
  await page.locator('xpath=//*[@id="navbar-content"]/ul/li[1]/a').click();
  await page.locator('xpath=//*[@id="inputName"]').fill(data["name"]);
  await page.locator('xpath=//*[@id="inputEmail"]').fill(data["email"]);
  await page.locator('xpath=//*[@id="inputMessage"]').fill(data["message"]);
  // Verify: text("Biography")
  var item = page.getByText("Biography");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home - tools - tools - home - home", async ({ page }) => {
  const data = testData["test-path-Home-to-Home-gp9w"];

  await page.goto("https://perso.limos.fr/~sesalva");
  await page.locator('xpath=//*[@id="inputName"]').fill(data["name"]);
  await page.locator('xpath=//*[@id="inputEmail"]').fill(data["email"]);
  await page.locator('xpath=//*[@id="inputMessage"]').fill(data["message"]);
  await page.locator('xpath=//*[@id="navbar-content"]/ul/li[3]/a').click();
  await page.locator('xpath=//*[@id="navbar-content"]/ul/li[1]/a').click();
  await page.locator('xpath=//*[@id="inputName"]').fill(data["name"]);
  await page.locator('xpath=//*[@id="inputEmail"]').fill(data["email"]);
  await page.locator('xpath=//*[@id="inputMessage"]').fill(data["message"]);
  // Verify: text("Biography")
  var item = page.getByText("Biography");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home - publications - publications - home - home", async ({ page }) => {
  const data = testData["test-path-Home-to-Home-bgzz"];

  await page.goto("https://perso.limos.fr/~sesalva");
  await page.locator('xpath=//*[@id="inputName"]').fill(data["name"]);
  await page.locator('xpath=//*[@id="inputEmail"]').fill(data["email"]);
  await page.locator('xpath=//*[@id="inputMessage"]').fill(data["message"]);
  await page.locator('xpath=//*[@id="navbar-content"]/ul/li[4]/a').click();
  await page
    .locator('xpath=//*[@id="top"]/div[2]/div[2]/div/div/div[1]/div[2]/select')
    .selectOption(data["type"]);
  await page
    .locator('xpath=//*[@id="top"]/div[2]/div[2]/div/div/div[1]/div[3]/select')
    .selectOption(data["date"]);
  await page.locator('xpath=//*[@id="navbar-content"]/ul/li[1]/a').click();
  await page.locator('xpath=//*[@id="inputName"]').fill(data["name"]);
  await page.locator('xpath=//*[@id="inputEmail"]').fill(data["email"]);
  await page.locator('xpath=//*[@id="inputMessage"]').fill(data["message"]);
  // Verify: text("Biography")
  var item = page.getByText("Biography");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home - publications - publications - on the soundness and consistency of l l m agents for executing test cases written in natural language - publications n l exec", async ({
  page,
}) => {
  const data = testData["test-path-Home-to-PublicationsNLExec"];

  await page.goto("https://perso.limos.fr/~sesalva");
  await page.locator('xpath=//*[@id="inputName"]').fill(data["name"]);
  await page.locator('xpath=//*[@id="inputEmail"]').fill(data["email"]);
  await page.locator('xpath=//*[@id="inputMessage"]').fill(data["message"]);
  await page.locator('xpath=//*[@id="navbar-content"]/ul/li[4]/a').click();
  await page
    .locator('xpath=//*[@id="top"]/div[2]/div[2]/div/div/div[1]/div[2]/select')
    .selectOption(data["type"]);
  await page
    .locator('xpath=//*[@id="top"]/div[2]/div[2]/div/div/div[1]/div[3]/select')
    .selectOption(data["date"]);
  await page
    .locator('xpath=//*[@id="container-publications"]/div[1]/div/a')
    .click();
  // Verify: text("On the Soundness and Consistency of LLM Agents for Executing Test Cases Written in Natural Language")
  var item = page.getByText(
    "On the Soundness and Consistency of LLM Agents for Executing Test Cases Written in Natural Language",
  );
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home - teaching - teaching - home - home", async ({ page }) => {
  const data = testData["test-path-Home-to-Home-hw8x"];

  await page.goto("https://perso.limos.fr/~sesalva");
  await page.locator('xpath=//*[@id="inputName"]').fill(data["name"]);
  await page.locator('xpath=//*[@id="inputEmail"]').fill(data["email"]);
  await page.locator('xpath=//*[@id="inputMessage"]').fill(data["message"]);
  await page.locator('xpath=//*[@id="navbar-content"]/ul/li[5]/a').click();
  await page.locator('xpath=//*[@id="navbar-content"]/ul/li[1]/a').click();
  await page.locator('xpath=//*[@id="inputName"]').fill(data["name"]);
  await page.locator('xpath=//*[@id="inputEmail"]').fill(data["email"]);
  await page.locator('xpath=//*[@id="inputMessage"]').fill(data["message"]);
  // Verify: text("Biography")
  var item = page.getByText("Biography");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});

test("home - teaching - teaching - cours software engineering - teaching s e", async ({
  page,
}) => {
  const data = testData["test-path-Home-to-TeachingSE"];

  await page.goto("https://perso.limos.fr/~sesalva");
  await page.locator('xpath=//*[@id="inputName"]').fill(data["name"]);
  await page.locator('xpath=//*[@id="inputEmail"]').fill(data["email"]);
  await page.locator('xpath=//*[@id="inputMessage"]').fill(data["message"]);
  await page.locator('xpath=//*[@id="navbar-content"]/ul/li[5]/a').click();
  await page.locator('xpath=//*[@id="docs-nav"]/ul/div[8]/a').click();
  // Verify: text("LP MI Applications Web")
  var item = page.getByText("LP MI Applications Web");
  if ((await item.count()) > 1) {
    await expect(item.first()).toBeVisible();
  } else {
    await expect(item).toBeVisible();
  }
});
