```json
{
  "testCaseName": 'All Snippets Displayed',
  "task": [
    "Open the website 'https://google-gruyere.appspot.com/start'",
    "Click on 'Agree & Start'",
    "Click on 'All snippets'",
    "Assert that 'Gruyere' OR 'Cheddar' is displayed on this page.",
    "Assert that 'Bleu d'Auvergne' is displayed on this page."
  ],
  "UIactions": [
    [
      {
        description: 'link: Agree & Start',
        method: 'click',
        arguments: [],
        selector: 'xpath=/html[1]/body[1]/h2[1]/a[1]'
      }
    ],
    [
      {
        description: 'link: All snippets',
        method: 'click',
        arguments: [],
        selector: 'xpath=/html[1]/body[1]/div[3]/table[1]/tbody[1]/tr[2]/td[3]/a[1]'
      }
    ]
  ],
  "expectedTestCase": [ 1, 0 ],
  "pageContent": '{\n' +
    '{"id": , "description": Home, "type": link}\n' +
    '{"id": , "description": Sign in, "type": link}\n' +
    '{"id": , "description": Sign up, "type": link}\n' +
    '{"id": , "description": Refresh, "type": link}\n' +
    `{"id": , "description": Cheddar Mac's site, "type": link}\n` +
    '{"id": , "description": Home, "type": link}\n' +
    '{"id": , "description": Sign in, "type": link}\n' +
    '{"id": , "description": Sign up, "type": link}\n' +
    '{"id": , "description": Refresh, "type": link}\n' +
    `{"id": , "description": Cheddar Mac's site, "type": link}\n` +
    '{"id": , "description": Home, "type": StaticText}\n' +
    '{"id": , "description": Sign in | Sign up, "type": StaticText}\n'
}
```

=== TEST GENERATION RUN 1 / 20 ===
{
testCaseName: 'All Snippets Displayed',
task: [
"Open the website 'https://google-gruyere.appspot.com/start'",
"Click on 'Agree & Start'",
"Click on 'All snippets'",
"Assert that 'Gruyere' OR 'Cheddar' is displayed on this page.",
"Assert that 'Bleu d'Auvergne' is displayed on this page."
],
UIactions: [
[
{
description: 'link: Agree & Start',
method: 'click',
arguments: [],
selector: 'xpath=/html[1]/body[1]/h2[1]/a[1]'
}
],
[
{
description: 'link: All snippets',
method: 'click',
arguments: [],
selector: 'xpath=/html[1]/body[1]/div[3]/table[1]/tbody[1]/tr[2]/td[3]/a[1]'
}
]
],
expectedTestCase: [ 1, 0 ],
pageContent: '{\n' +
'{"id": , "description": Home, "type": link}\n' +
'{"id": , "description": Sign in, "type": link}\n' +
'{"id": , "description": Sign up, "type": link}\n' +
'{"id": , "description": Refresh, "type": link}\n' +
`{"id": , "description": Cheddar Mac's site, "type": link}\n` +
'{"id": , "description": Home, "type": link}\n' +
'{"id": , "description": Sign in, "type": link}\n' +
'{"id": , "description": Sign up, "type": link}\n' +
'{"id": , "description": Refresh, "type": link}\n' +
`{"id": , "description": Cheddar Mac's site, "type": link}\n` +
'{"id": , "description": Home, "type": StaticText}\n' +
'{"id": , "description": Sign in | Sign up, "type": StaticText}\n'
}
'SYSTEM:\n' +
'You are an expert software test automation engineer.\n' +
'Your task is to generate a FULL, runnable, production-ready test automation script.\n' +
'You MUST return ONLY the complete code of the test file.\n' +
'Do NOT include JSON, markdown, explanations, comments, or any text—ONLY the code.\n' +
'\n' +
'USER:\n' +
'Generate a runnable test automation script according to the inputs below.\n' +
'\n' +
'Rules about the expected array:\n' +
'- expected[i] corresponds ONLY to assertion steps and aligns with tc_steps[i].\n' +
'- Non-assert steps may have null → ignore them.\n' +
'- If tc_steps[i] is an assertion and expected[i] === 1 → produce a POSITIVE assertion.\n' +
'- If tc_steps[i] is an assertion and expected[i] === 0 → produce a NEGATED assertion using idiomatic syntax of the chosen framework/language.\n' +
'\n' +
'GLOBAL GENERATION CONSTRAINTS (MANDATORY):\n' +
'1. Implement the scenario strictly step-by-step using ONLY the supplied XPaths and inputs.\n' +
'2. Navigate to the base page URL provided in Page before any action.\n' +
'3. Use explicit synchronization / waits where necessary (no blind sleeps).\n' +
'4. Add a FINAL assertion that verifies the final expected page state.\n' +
'5. Ensure readability and maintainability (helpers allowed).\n' +
'6. The generated test MUST be executable as-is.\n' +
'7. RETURN ONLY THE CODE, NOTHING ELSE.\n' +
'\n' +
'ROBUSTNESS RULES (MANDATORY):\n' +
'9. NEVER use exact text matching unless explicitly required.\n' +
' Always prefer partial / contains / non-exact matching for text verification.\n' +
'10. If an assertion accepts multiple valid outcomes (logical OR),\n' +
' you MUST implement TRUE OR validation logic.\n' +
'11. You MUST NOT assume the presence of exact full text unless it is provided verbatim.\n' +
'12. The final assertion MUST validate the real final page state, not duplicate a previous check.\n' +
'13. Any violation of these rules makes the output INVALID.\n' +
'\n' +
'Inputs:\n' +
`- Test case steps: ["Open the website 'https://google-gruyere.appspot.com/start'","Click on 'Agree & Start'","Click on 'All snippets'","Assert that 'Gruyere' OR 'Cheddar' is displayed on this page.","Assert that 'Bleu d'Auvergne' is displayed on this page."]\n` +
'- XPaths: [[{"description":"link: Agree & Start","method":"click","arguments":[],"selector":"xpath=/html[1]/body[1]/h2[1]/a[1]"}],[{"description":"link: All snippets","method":"click","arguments":[],"selector":"xpath=/html[1]/body[1]/div[3]/table[1]/tbody[1]/tr[2]/td[3]/a[1]"}]]\n' +
'- Framework: Playwright\n' +
'- Programming language: TypeScript\n' +
'- Page (base URL): {\n' +
'{"id": , "description": Home, "type": link}\n' +
'{"id": , "description": Sign in, "type": link}\n' +
'{"id": , "description": Sign up, "type": link}\n' +
'{"id": , "description": Refresh, "type": link}\n' +
`{"id": , "description": Cheddar Mac's site, "type": link}\n` +
'{"id": , "description": Home, "type": link}\n' +
'{"id": , "description": Sign in, "type": link}\n' +
'{"id": , "description": Sign up, "type": link}\n' +
'{"id": , "description": Refresh, "type": link}\n' +
`{"id": , "description": Cheddar Mac's site, "type": link}\n` +
'{"id": , "description": Home, "type": StaticText}\n' +
'{"id": , "description": Sign in | Sign up, "type": StaticText}\n' +
'\n' +
'- Expected assertion array: [1,0]'
gve
'``typescript\n' +
  "import { test, expect } from '@playwright/test';\n" +
  '\n' +
  "test('google gruyere scenario', async ({ page }) => {\n" +
  "  await page.goto('https://google-gruyere.appspot.com/start');\n" +
  '\n' +
  "  // Click on 'Agree & Start'\n" +
  "  await page.click('xpath=/html[1]/body[1]/h2[1]/a[1]');\n" +
  '\n' +
  "  // Click on 'All snippets'\n" +
  "  await page.click('xpath=/html[1]/body[1]/div[3]/table[1]/tbody[1]/tr[2]/td[3]/a[1]');\n" +
  '\n' +
  "  // Assert that 'Gruyere' OR 'Cheddar' is displayed on this page\n" +
  `  const gruyereOrCheddar = await page.textContent('xpath=//h1[contains(text(), "Gruyere") or contains(text(), "Cheddar")]');\n` +
  '  expect(gruyereOrCheddar).toBeTruthy();\n' +
  '\n' +
  "  // Assert that 'Bleu d'Auvergne' is displayed on this page (negated)\n" +
  `  const bleuDAuvergne = await page.textContent('xpath=//h1[contains(text(), "Bleu d\\'Auvergne")]');\n` +
  '  expect(bleuDAuvergne).toBeFalsy();\n' +
  '});\n' +
  '``'
