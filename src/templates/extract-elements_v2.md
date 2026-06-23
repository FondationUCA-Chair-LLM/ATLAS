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
      "required": true
    }
  ]
}
```

# EXTRACTION RULES

## Element Properties

- **type**: HTML input type (input, button, select, textarea, checkbox, radio) or semantic type (link, text, button)
- **label**: Text label directly associated with this element (above, left, or visually grouped). Extract asterisks (\*) if field is marked required
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

7. **Element Type Discrimination:**
   - Only use type `link` for clearly clickable, navigable elements (underlined or styled as links).
   - Use type `text` for plain displayed content that is not clickable.
   - Use type `button` for clickable action buttons.

## Extract All Interactive and visible Elements:

- Input fields (text, number, email, password, date, file, etc.)
- Text areas
- Buttons (submit, click, toggle)
- Dropdowns/select menus
- Checkboxes and radio buttons
- Links (clearly navigable, clickable)
- Any clickable elements
- Static text, headings, and empty-state messages

## CLEAN SEMANTIC TEXT RULE

Always extract meaning, not raw visual noise.
REMOVE (NEVER INCLUDE IN LABELS)
Leading/trailing \* (required markers)
Currency symbols used as UI decoration: $, €, £
Counters and badges: (0), (12), (3 items)
Decorative symbols: •, ›, », \_, | when not meaningful
Extra formatting artifacts
