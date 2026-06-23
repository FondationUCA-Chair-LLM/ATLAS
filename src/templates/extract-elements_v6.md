# TASK

Analyze this screenshot and extract ALL visible UI elements—interactive controls, static content, text for test automation and test data generation.

# PAGE TEXT CONTEXT

{{page_text}}

# REQUIRED JSON OUTPUT (no explanations, no markdown blocks):

```json
{
  "elements": [
    {
      "id": "unique-element-id-if-visible",
      "type": "input|button|select|textarea|link|checkbox|radio|...",
      "label": "Associated label text or text near element",
      "text": "Button display text, pre-filled value, or visible text content",
      "placeholder": "Input placeholder text if visible",
      "hint": "Visible hint or helper text if present",
      "value": "User-visible value or selected option if present",
      "checked": true,
      "required": true,
      "isIcon": true
    }
  ]
}
```

# EXTRACTION RULES

## Element Properties

- **type**: HTML input type (input, button, select, textarea, checkbox, radio) or semantic type (link, text, button)
- **label**: Text label directly associated with an interactive element (above, left, or visually grouped).
  DO NOT extract labels as standalone elements.
  Always attach labels to their corresponding input/select/textarea/button element.
  Remove decorative symbols such as \*, $, €, £, counters, or UI artifacts. Use them only to infer metadata like required=true.
- **text**:
  - For buttons: the button display text
  - For inputs: visible field text or value label
  - For links: link text
  - For textareas: any visible text content
- **placeholder**: The placeholder text inside input/textarea fields (if visible)
- **hint**: Any visible hint or helper text associated with the field (e.g., "Password must be at least 8 characters")
- **value**: The extracted visible value for inputs, selects, and textareas when the field is pre-filled or already selected.
- **checked**: `true` or `false` for checkbox and radio elements when the selected state is visible.
- **required**: Set to true if field is marked with asterisk (\*), "required" text, or red indicator
- **isIcon**: `true` only when the element itself is represented primarily by an icon, symbol, pictogram, or logo (e.g., home icon, search icon, user/profile icon, shopping cart icon, brand/application logo).

  Rules:
  - Do NOT set `isIcon: true` for elements that merely contain an icon alongside visible text.
  - Do NOT create separate elements for icons attached to another element.
  - `isIcon` is metadata only and must never affect type, label, text, placeholder, hint, or value extraction.
  - If an icon-only element has a recognizable purpose, populate the `text` field with its semantic meaning (e.g., "Search", "Home", "Shopping Cart", "My Account").
  - Do not leave `text` empty for recognizable icon-only elements.

  Examples:
  { "type": "button", "text": "Search", "isIcon": true }
  { "type": "link", "text": "Home", "isIcon": true }
  { "type": "link", "text": "Shopping Cart", "isIcon": true }
  { "type": "link", "text": "OpenCart", "isIcon": true }

## Instructions

1. **Layout Proximity (Labeling):** If text is directly above, left of, or grouped near a box, it's the label. Look for asterisks (\*) or "required" indicators.

2. **Field Type Detection:** Infer field purpose from:
   - Label text (e.g., "Email Address", "Password", "Phone Number")
   - Placeholder text (e.g., "user@example.com", "(123) 456-7890")
   - Visual cues (icons, input masks)

3. **Required Fields:** Mark as required if:
   - Label has asterisk (\*)
   - Field has red border or "required" text
   - Form header indicates required fields

4. **Text Preservation:** Preserve exact visible text including spaces and punctuation. Never use underscores or hyphens in place of spaces (e.g., output "Sign in" not "Sign_in").

5. **Static Text Extraction:** Also extract visible non-interactive text as `type: 'text'`:
   - Page titles and headings (e.g., "Gruyere: Upload Complete")
   - Empty-state messages (e.g., "No snippets")
   - Plain displayed content that is not clickable

6. **File Upload Inputs:** For file upload inputs, extract as a single `input` element. Capture the button text in `text` and the current status (e.g., "No file chosen") in `value`.

7. Element Type Discrimination (CRITICAL):

   Always classify elements based on FUNCTION (interaction behavior), not raw OCR text.
   - type = `link` if the element is clickable AND navigates or behaves like navigation:
     Examples (generic patterns):
     - menus (any top navigation, side navigation, category menus)
     - breadcrumbs
     - account-related items
     - dashboard shortcuts
     - summary widgets that open another view (cart, notifications, wishlist, etc.)

   - type = `button` if the element triggers an ACTION:
     Examples:
     - submit, save, cancel, search
     - icon-only clickable controls
     - add/remove/update actions
   - type = `select` ONLY when the element is part of a form and is used to provide a value that will be submitted as user input.
     Examples:
     ✓ Country
     ✓ State
     ✓ Language
     ✓ Sort By
     ✓ Show 25 per page
     Do NOT classify navigation dropdowns as select elements.
     Elements located in:
     - page headers
     - navigation bars
     - account menus
     - category menus
     - side menus
     - breadcrumbs

- type = `text` ONLY if the element is non-interactive and informational

- If uncertain:
  PRIORITY ORDER:
  link > button > text
  (default to `link` for anything that looks navigational or clickable)

## Extract All Interactive and visible Elements:

- Input fields (text, number, email, password, date, file, etc.)
- Text areas
- Buttons (submit, click, toggle)
- select menus
- Checkboxes and radio buttons
- Links (clearly navigable, clickable)
- Any clickable elements
- Static text, headings, and empty-state messages

## Additionally, apply the following normalization globally:

- Remove decorative UI symbols from labels/text:
  - asterisks (\*)
  - currency symbols ($, €, £) when used as UI decoration
  - counters/badges like (0), (12), (3 items)
  - separator or UI artifacts (•, ›, », |, \_)

- These symbols MUST NOT appear in final output fields (label, text, placeholder, hint)
- They may only be used internally to infer meaning (e.g., required=true)

## CONTROL GROUP MERGING RULE (CRITICAL)

Always merge UI fragments that belong to the same interaction unit into ONE element.

Merge when:

- A checkbox/radio is described by surrounding sentence text
- A sentence contains an inline clickable link (e.g. “Privacy Policy”)
- A label, helper text, and control are visually grouped
- A toggle/checkbox + description text form one logical unit

Output rule:

- Represent the full interaction as a single primary control element
- Embed all related text into the most relevant field (usually "label")
- Never split one interaction across multiple elements

Example:
Checkbox + “I agree to Privacy Policy” + link → ONE checkbox element

## SELECT VS NAVIGATION DROPDOWN RULE (CRITICAL)

Only classify an element as "select" if ALL conditions are true:

- It is inside a FORM
- It is used to provide user input that will be submitted
- It changes application state as form data (e.g. country, language, filters)

Otherwise, it MUST NOT be "select".

If a dropdown is in:

- header
- navbar
- utility bar
- account menu
- navigation area

→ classify as "link" or "button" depending on behavior, NEVER select.

## MODAL / OVERLAY PRIORITY RULE (CRITICAL)

If a modal dialog, popup, overlay, drawer, lightbox, or blocking panel is visible and visually disables the underlying page:

- Treat the modal/overlay as the active UI context.
- Extract ONLY elements that belong to the active modal/overlay.
- Ignore elements located behind the overlay, even if partially visible.
- Ignore background navigation, forms, buttons, links, and text that cannot be interacted with while the overlay is open.
- The modal container itself may be extracted as type="dialog" if clearly identifiable.

Indicators of an active overlay include:

- Background dimming or darkening
- Disabled or blurred page content
- Modal window centered above other content
- Visible close button (X)
- User interaction restricted to the overlay

Exception:
If the overlay is non-blocking and the background remains interactable, extract both the overlay and the underlying page.
