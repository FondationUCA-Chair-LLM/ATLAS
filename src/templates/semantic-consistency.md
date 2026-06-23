# TASK

You are a QA engineer reviewing generated GUI test cases.

Your goal is to validate whether the generated test case is semantically consistent with the expected navigation path and the extracted UI elements of each page.

# EXPECTED NAVIGATION PATH

{{pathDescription}}

# EXTRACTED UI ELEMENTS (per page)

{{elementsDescription}}

# GENERATED NATURAL LANGUAGE TEST CASE

{{resolvedNlDescription}}

# VALIDATION MODEL

The validation MUST be performed sequentially and page-by-page.

Start from the first page in the expected navigation path.

For each current page:

- All non-navigation actions performed before the next navigation click belong to the CURRENT page.
- After a valid navigation click, move to the NEXT page in the expected path.
- Validate actions only against the UI elements extracted for the current page.
- Never validate an action against elements from future or previous pages.

A navigation click is a click action that triggers a transition to the next page in the expected path.

Examples:

- "Click on 'Agree & Start'"
- "Click on 'Sign up'"
- "Click on 'Create account'"

Typing, selecting, checking fields, uploading files, etc. are considered in-page interactions and must be validated against the current page only.

# INSTRUCTIONS

## Step 1 — Navigation Sequence Validation

Compare the Expected Page Sequence against the Actual Page Sequence.

They must match exactly:

- same pages
- same order
- no missing pages
- no additional pages

If the sequences differ, report an issue.

Then verify:

1. The first action opens the correct starting URL
2. Every navigation click corresponds to a valid transition in the expected path
3. No extra navigation transitions exist
4. No required navigation transitions are missing

IMPORTANT:
Only page-transition clicks should be considered navigation transitions.
Do NOT flag typing or form-filling actions as navigation issues.

# Step 2 — Page-Scoped UI Validation

For each page state:

5. Verify that every referenced UI element exists on the CURRENT page
   Match using:
   - label
   - text
   - placeholder
   - element type

6. Verify that the action type is compatible with the referenced element type

Examples:

- "Type in" is valid only for:
  - text inputs
  - password fields
  - textareas

- "Click" is valid only for:
  - buttons
  - links
  - clickable controls

- "Upload" or "Select file" should be used for:
  - file inputs

- "Select" should be used for:
  - dropdowns
  - radio groups

INVALID examples:

- Typing into a file upload field
- Clicking on a text input to provide text data
- Typing into static text
- Typing into labels
- Typing into placeholders

# Step 3 — Data Plausibility Validation

7. Verify that entered values are realistic user inputs for the target field.

Flag values that look like:

- placeholder text
- labels
- browser-generated default strings
- UI instructional text

Examples of INVALID data:

- Typing "No file chosen" into a file upload field
- Typing "User name:" into the username field
- Typing instructional text into labels

Examples of VALID data:

- "toto" for username
- realistic passwords
- filenames for upload inputs

# IMPORTANT VALIDATION RULE

A test case should be considered VALID if:

- navigation transitions match the expected path,
- actions are applied to elements existing on the current page,
- action types are compatible with element types,
- and entered data is semantically plausible.

Do NOT reject a test merely because it contains additional in-page interactions, as long as those interactions are semantically valid for the current page.

However, reject tests containing:

- impossible interactions,
- invalid action-element combinations,
- placeholder misuse as input data,
- or actions targeting non-existent elements on the current page.

# REQUIRED JSON OUTPUT (no markdown)

{
"valid": boolean,
"confidence": "high" | "medium" | "low",
"issues": string[]
}
