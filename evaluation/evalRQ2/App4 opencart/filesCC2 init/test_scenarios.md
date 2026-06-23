# OpenCart — 42 Acceptance Test Scenarios

**Application under test:** `http://localhost/opencart`
**Source of truth:** `navigation_graph.json` (29 screens / nodes, 42 transitions / edges) and `xpath_mapping.json` (UI element locators), cross-checked against `screenshots.zip` for real functional data (form values, product info, prices, confirmation messages).

**Convention:** every scenario starts at the root of the application — the anonymous home page (`Home_Anonymous`) — and replays, click by click, the shortest path from the graph to reach the screen under test, then performs and verifies the one transition (edge) the scenario is named after. Scenario numbers map 1:1 to `edges[]` in `navigation_graph.json` and to the `TC-xx` test names in the Playwright suite.

Test data actually used (read from the screenshots):
- Demo account: `toto` / `toto` / `toto@gmail.com` / `toto1234`
- Contact form: name `toto`, email `toto@gmail.com`, enquiry "This is a test Enquiry"
- Checkout address: toto toto, 23 rue paris, Paris, 98000, France Metropolitan / Paris
- Product: iMac, Brand Apple, Model "Product 14", $122.00 ($100.00 ex tax)
- Shipping: Flat Shipping Rate – $5.00. Payment: Cash On Delivery.

---

## Group A — Account dropdown, Login, Register, Logout (TC-01 → TC-09)

**TC-01 — Open the "My Account" menu**
*Given* an anonymous visitor is on the home page, *when* they click the "My Account" icon in the header, *then* a dropdown appears offering "Register" and "Login".

**TC-02 — Navigate to Login from the dropdown**
*Given* the "My Account" dropdown is open, *when* the visitor clicks "Login", *then* the Login page opens, showing both a "New Customer" and a "Returning Customer" panel.

**TC-03 — Navigate to Register from the dropdown**
*Given* the "My Account" dropdown is open, *when* the visitor clicks "Register", *then* the Register Account page opens with the personal-details form.

**TC-04 — "Continue" on the Login page leads to Register**
*Given* the visitor is on the Login page, *when* they click "Continue" in the New Customer panel, *then* they are taken to the Register Account page.

**TC-05 — "login page" link on Register goes back to Login**
*Given* the visitor is on the Register Account page, *when* they click the inline "login page" link, *then* they are returned to the Login page.

**TC-06 — Submit a valid registration form**
*Given* the visitor is on the Register Account page, *when* they fill in First Name "toto", Last Name "toto", a unique e-mail, Password "toto1234", check "I have read and agree to the Privacy Policy" and click "Continue", *then* the "Your Account Has Been Created!" confirmation page is displayed.

**TC-07 — "Continue" after account creation lands on My Account**
*Given* a new account was just created, *when* the visitor clicks "Continue" on the confirmation page, *then* they land on the My Account page, now authenticated.

**TC-08 — Login with valid, existing credentials**
*Given* the visitor is on the Login page, *when* they enter `toto@gmail.com` / `toto1234` and click the "Login" button, *then* they land on the My Account page.

**TC-09 — Logout returns to the anonymous home page**
*Given* the visitor is logged in (My Account page), *when* they click "Logout" in the account menu, *then* they are returned to an anonymous state — re-opening the "My Account" dropdown again shows "Login"/"Register".

---

## Group B — Anonymous home navigation: search, cart, contact (TC-10 → TC-17)

**TC-10 — Search "imac" from the home page**
*Given* an anonymous visitor is on the home page, *when* they type "imac" into the header search box and click the search button, *then* the search results page lists the iMac product.

**TC-11 — Open the iMac from anonymous search results**
*Given* search results for "imac" are displayed, *when* the visitor clicks the "iMac" result, *then* the product detail page opens, showing the price $122.00.

**TC-12 — "Home" breadcrumb from search results**
*Given* the visitor is on the search results page, *when* they click "Home" in the breadcrumb/menu, *then* they return to the home page.

**TC-13 — Open an empty shopping cart**
*Given* an anonymous visitor with no items in the cart, *when* they click "Shopping Cart" in the header, *then* the cart page shows "Your shopping cart is empty!".

**TC-14 — "Continue" on the empty cart page**
*Given* the visitor is on the empty cart page, *when* they click "Continue", *then* they return to the home page.

**TC-15 — Open Contact Us via the phone number link**
*Given* an anonymous visitor is on the home page, *when* they click the phone number ("123456789") in the header, *then* the Contact Us page opens with Name/E-Mail/Enquiry fields.

**TC-16 — Submit a valid Contact Us enquiry (guest)**
*Given* the visitor is on the Contact Us page, *when* they fill Name "toto", E-Mail "toto@gmail.com", Enquiry "This is a test Enquiry" and click "Submit", *then* the page confirms "Your enquiry has been successfully sent to the store owner!".

**TC-17 — "Continue" after a submitted enquiry (guest)**
*Given* the enquiry was just submitted, *when* the visitor clicks "Continue", *then* they return to the home page.

---

## Group C — Authenticated home navigation: catalogue, search, contact (TC-18 → TC-27)

*(Precondition for every scenario in this group: Home → My Account dropdown → Login → enter `toto@gmail.com`/`toto1234` → My Account.)*

**TC-18 — "Home" from My Account**
*When* the authenticated user clicks "Home" on the My Account page, *then* the authenticated home page is displayed (header now shows the account menu instead of Register/Login).

**TC-19 — Open the "Desktops" menu**
*When* the authenticated user clicks "Desktops" in the top navigation, *then* the menu expands and reveals the "Mac (1)" sub-category link.

**TC-20 — Browse to the Mac category**
*When* the user clicks "Mac (1)" under Desktops, *then* the Mac category page lists the iMac product.

**TC-21 — Open the iMac from the Mac category**
*When* the user clicks the "iMac" product in the Mac category, *then* the product detail page opens with an "Add to Cart" button.

**TC-22 — Search "imac" while authenticated**
*When* the authenticated user searches "imac", *then* the search results page lists the iMac product.

**TC-23 — Open the iMac from authenticated search results**
*When* the user clicks the "iMac" search result, *then* the product detail page opens.

**TC-24 — "Home" breadcrumb from authenticated search results**
*When* the user clicks "Home" from the search results page, *then* they return to the authenticated home page.

**TC-25 — Open Contact Us while authenticated**
*When* the authenticated user clicks the phone number in the header, *then* the Contact Us page opens.

**TC-26 — Submit a valid Contact Us enquiry (authenticated)**
*When* the authenticated user submits the Contact Us form with the same demo data, *then* the success message "Your enquiry has been successfully sent to the store owner!" is shown.

**TC-27 — "Continue" after a submitted enquiry (authenticated)**
*When* the user clicks "Continue" after submitting the enquiry, *then* they return to the authenticated home page.

---

## Group D — Add to cart and full checkout flow (TC-28 → TC-38)

*(Precondition for every scenario in this group: Home → Login → My Account → Home (authenticated) → Search "imac" → open iMac product page. Each later scenario replays every preceding click in this group, since checkout is a strictly linear flow.)*

**TC-28 — Add the iMac to the cart**
*When* the user sets quantity to 1 and clicks "Add to Cart" on the product page, *then* a "Success: You have added..." message appears and the cart icon updates.

**TC-29 — Open the cart after adding the iMac**
*When* the user clicks "Shopping Cart" in the header after adding the iMac, *then* the cart page lists 1× iMac at $122.00.

**TC-30 — "Continue Shopping" from the cart**
*When* the user clicks "Continue Shopping" on the cart page, *then* they return to the authenticated home page (the item stays in the cart).

**TC-31 — Proceed to Checkout**
*When* the user clicks "Checkout" on the cart page, *then* the Checkout page opens on the "Payment Address" step.

**TC-32 — Submit the payment/shipping address**
*When* the user fills First Name "toto", Last Name "toto", Address 1 "23 rue paris", City "Paris", Post Code "98000", Country "France, Metropolitan", Region "Paris" and clicks "Continue", *then* the page shows both "Choose Shipping Method" and "Choose Payment Method" actions available.

**TC-33 — Open the shipping method options**
*When* the user clicks "Choose" next to Shipping Method, *then* a modal opens listing "Flat Shipping Rate".

**TC-34 — Select Flat Rate shipping**
*When* the user selects "Flat Shipping Rate" and clicks "Continue" in the modal, *then* the page confirms "Flat Shipping Rate - $5.00" was applied.

**TC-35 — Open the payment method options**
*When* the user clicks "Choose" next to Payment Method, *then* a modal opens listing Bank Transfer, Cheque/Money Order and Cash On Delivery.

**TC-36 — Select Cash On Delivery**
*When* the user selects "Cash On Delivery" and clicks "Continue" in the modal, *then* the final order review step is shown with a "Confirm Order" button.

**TC-37 — Confirm the order**
*When* the user clicks "Confirm Order", *then* the order is placed and the page displays "Your order has been placed!".

**TC-38 — "Continue" after a successful order**
*When* the user clicks "Continue" on the order-success page, *then* they return to the authenticated home page.

---

## Group E — Account management: Reward Points & Wish List (TC-39 → TC-42)

*(Precondition: Home → Login → My Account.)*

**TC-39 — Open Reward Points**
*When* the authenticated user clicks "Reward Points" on the My Account page, *then* the Reward Points page is displayed (0 points for a fresh account).

**TC-40 — "Continue" on Reward Points**
*When* the user clicks "Continue" on the Reward Points page, *then* they return to My Account.

**TC-41 — Open the Wish List**
*When* the authenticated user clicks "Wish List" on the My Account page, *then* the Wish List page shows "Your wish list is empty.".

**TC-42 — "Continue" on the Wish List**
*When* the user clicks "Continue" on the Wish List page, *then* they return to My Account.

---

## Coverage check

| Group | Scenarios | Edges from navigation_graph.json covered |
|---|---|---|
| A — Dropdown / Login / Register / Logout | TC-01 – TC-09 | 1,2,3,4,5,6,7,8,42 |
| B — Anonymous home navigation | TC-10 – TC-17 | 9,10,11,12,13,14,15,16 |
| C — Authenticated home navigation | TC-18 – TC-27 | 17,20,21,22,23,24,25,39,40,41 |
| D — Cart & checkout | TC-28 – TC-38 | 26,27,30,31,32,33,34,35,36,37,38 |
| E — Reward Points & Wish List | TC-39 – TC-42 | 18,19,28,29 |

**Total: 42 scenarios = the 42 edges of `navigation_graph.json`, each one exactly once.**
