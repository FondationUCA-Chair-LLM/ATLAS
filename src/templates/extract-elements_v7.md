# TASK

Analyze this screenshot and extract ALL visible UI elements as JSON.

# REQUIRED JSON OUTPUT

No explanations, no markdown blocks. Output ONLY this JSON:

```json
{
  "elements": [
    {
      "id": "unique-element-id-if-visible",
      "type": "input|button|select|textarea|link|checkbox|radio|text|dialog",
      "label": "",
      "text": "",
      "placeholder": "",
      "hint": "",
      "value": "",
      "checked": false,
      "required": false,
      "isIcon": false,
      "disabled": false
    }
  ]
}
```

# FIELD RULES BY TYPE

| Type     | label                                                        | text                                       | placeholder                       | value                                  | checked                | required                      | isIcon                 | disabled                   |
| -------- | ------------------------------------------------------------ | ------------------------------------------ | --------------------------------- | -------------------------------------- | ---------------------- | ----------------------------- | ---------------------- | -------------------------- |
| input    | Field name OR leave empty if placeholder carries the name    | Do NOT use for plain inputs                | Empty-state prompt inside the box | Real pre-filled value only             | Do NOT emit            | true if \* / red / "required" | false                  | true if dimmed / read-only |
| textarea | Field name OR leave empty if placeholder carries the name    | Do NOT use for plain textareas             | Empty-state prompt inside the box | Real pre-filled text only              | Do NOT emit            | true if \* / red / "required" | false                  | true if dimmed / read-only |
| select   | Field name (e.g. Country, Sort By)                           | Leave empty unless trigger has prefix text | Do NOT use                        | Selected real option only              | Do NOT emit            | true if \* / red / "required" | false                  | true if dimmed / read-only |
| checkbox | Full statement attached to the box (merge link/text into it) | Leave empty unless extra inline text       | Do NOT use                        | Leave empty unless separate value text | true if visibly ticked | true if mandatory             | false                  | true if dimmed / read-only |
| radio    | Group/question label (e.g. Gender)                           | Individual option label (e.g. Male)        | Do NOT use                        | Leave empty                            | true if selected       | true if mandatory             | false                  | true if dimmed / read-only |
| button   | Leave empty unless external label exists                     | Button label or icon meaning               | Do NOT use                        | Do NOT use                             | Do NOT emit            | Do NOT emit                   | true only if icon-only | true if greyed out         |
| link     | Leave empty unless external label exists                     | Link label or icon meaning                 | Do NOT use                        | Do NOT use                             | Do NOT emit            | Do NOT emit                   | true only if icon-only | true if greyed out         |
| text     | Leave empty                                                  | Exact visible non-clickable text           | Do NOT use                        | Do NOT use                             | Do NOT emit            | Do NOT emit                   | false                  | false                      |
| dialog   | Leave empty or add description                               | Modal title / main message                 | Do NOT use                        | Do NOT use                             | Do NOT emit            | Do NOT emit                   | false                  | false                      |

# TYPE DISCRIMINATION (priority order)

Classify by FUNCTION, not appearance.

1. **dialog** — blocking modal/overlay visible? Extract only the modal + its children; ignore background.
2. **link** — clickable AND navigates or belongs to menus, breadcrumbs, account, categories, cart/wishlist/notifications.
3. **button** — clickable AND triggers an action (submit, save, cancel, search, add, remove, update, icon-only control).
4. **select** — dropdown INSIDE a form used to submit user input (Country, State, Language, Sort By, Show X per page). The field itself, when clicked, must directly reveal a list of options.
5. **checkbox / radio / input / textarea** — by HTML-like function.
6. **text** — non-interactive informational text only.
7. **Uncertain?** Use priority: link > button > text.

# SELECT VS BUTTON-TRIGGERED PICKER

- If the control has a **separate clickable button** next to the displayed value (Choose, Edit, Change, Add, Select, etc.), it is **NOT** a `select`.
- In that case:
  - the clickable trigger is a `button`;
  - the displayed value area is an `input` (if editable) or `text` (if read-only).
- Only use `select` when clicking the field itself directly reveals a dropdown list of options.

# HARD RULES

0. **Every element MUST have at least one of `text`, `label`, or `placeholder` populated.** Never emit an element with only `type` (and optional flags like `isIcon`, `checked`, `disabled`). If you cannot determine any of the three, describe what the element represents (e.g. icon-only controls MUST state the icon's meaning).
1. **One interaction = one element.** Merge a checkbox/radio with its surrounding sentence and any inline link into the primary control. Do NOT split.
2. **Labels belong to controls.** Text above or left of an input/select/textarea/checkbox/radio is its `label`. Do NOT emit it as separate `text`.
3. **value is real user data only.** Placeholders, "--- Please Select ---", "Search", and format masks are NOT `value`.
4. **text preservation.** Keep exact spaces and punctuation. "Sign in" not "Sign_in".
5. **Disabled / read-only fields.** If an input, select, or textarea is visibly dimmed, greyed out, non-editable, or appears as a plain display box, set `disabled: true`. Downstream automation will skip it.
6. **Strip decorative symbols** from label/text/placeholder/hint: \* $ € £ counters like (0) (12) • › » | \_. Use them only to infer required=true.
7. **Icon rule.** `isIcon: true` only for elements that are **primarily an icon** (no visible text, or only a badge/counter). If the element shows both an icon AND visible text such as "My Account" or "Wish List", set `isIcon: false`. Icon-only controls still MUST carry `text` describing the icon.
8. Do NOT extract text from images, illustrations, banners, product photos, advertisements, logos used as artwork, decorative graphics, or any non-UI visual content.

# EXAMPLES

```json
{"type": "input", "label": "Email Address", "placeholder": "user@example.com", "required": true}
{"type": "input", "label": "Phone Number", "placeholder": "(123) 456-7890"}
{"type": "select", "label": "Country", "value": "United Kingdom"}
{"type": "checkbox", "label": "I agree to the Privacy Policy", "checked": false, "required": true}
{"type": "radio", "label": "Gender", "text": "Male", "checked": true}
{"type": "radio", "label": "Gender", "text": "Female"}
{"type": "button", "text": "Sign in"}
{"type": "button", "text": "Search", "isIcon": true}
{"type": "link", "text": "My Account"}
{"type": "link", "text": "Shopping Cart"}
{"type": "link", "text": "Home", "isIcon": true}
{"type": "button", "text": "Search", "isIcon": true}
{"type": "text", "text": "Gruyere: Upload Complete"}
{"type": "dialog", "text": "Confirm Delete"}
```

**Bad — never emit these:**

```json
{"type": "button", "isIcon": true}
{"type": "link", "isIcon": true}
```

# BEFORE OUTPUTTING

Check each element:

- Does the type match the function?
- Is `value` only a real pre-filled value / selected option?
- Is `label` used for field names and `text` for button/link labels?
- Are decorative symbols removed?
- Is there any element that should be merged into another?
- Are visibly disabled / read-only fields marked with `disabled: true`?
- **Does every element have at least one of `text`, `label`, `placeholder` populated?**
