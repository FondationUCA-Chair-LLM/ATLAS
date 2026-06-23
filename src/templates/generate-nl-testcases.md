The application under test is **"{{app_name}}"**. Its start URL is **"{{base_url}}"**.

## Example

First, study this example. It shows how to transform the navigation path  
`home → signup → account_created` into a test case JSON:

```json
{
"name": "Sign Up to Google Gruyere",
"actions": [
"Go to the website 'https://google-gruyere.appspot.com/start'",
"Click on 'Agree & Start'",
"Click on 'Sign up'",
"Type in 'toto' in the field 'User name'",
"Type in 'toto' in the field 'Password'",
"Click on 'Create account'",
"Assert that the 'Account created' is displayed on this page"
],
},
```

## Current navigation path

Here is the **current** navigation path in JSON.  
Each step has a source screen, a target screen, the UI trigger label,:

```json
{{PATH_JSON_HERE}}
```

## Task

Using **only the current navigation path above** (not the example),  
write **one** test case object in JSON with this exact structure:

```json
{
  "name": "...",
  "actions": ["Step 1 ...", "Step 2 ...", "Assert ..."]
}
```

Guidelines:

- Use imperative steps: "Go to ...", "Click ...", "Type ...", "Assert ...".
- Use the navigation path to decide which links/buttons are clicked and in which order.
- For each page do the necessary tasks (like fill in inputs ... before doing some action)
- Include field names and button labels when relevant.
- The final expected assertion must check that the target screen of the last step is reached and that its success message or key UI element is visible.
- Output **only** the JSON object for the current path. Do **not** add explanations or extra text.
