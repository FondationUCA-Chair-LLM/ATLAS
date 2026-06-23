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

   - type = `select` if it opens a dropdown or selection menu

   - type = `text` ONLY if the element is non-interactive and informational

   - If uncertain:
     PRIORITY ORDER:
     link > button > text
     (default to `link` for anything that looks navigational or clickable)

## Extract All Interactive and visible Elements:

- Input fields (text, number, email, password, date, file, etc.)
- Text areas
- Buttons (submit, click, toggle)
- Dropdowns/select menus
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
