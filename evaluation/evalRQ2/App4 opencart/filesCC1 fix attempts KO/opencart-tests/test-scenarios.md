# OpenCart Acceptance Test Scenarios

**Application under test:** `http://localhost/opencart`
**Source artifacts:** `opencart_nav_graph.png` (navigation graph), `xpath_mapping.json` (element locators), `screenshots.zip` (golden-state UI references)
**Test data used throughout:** user `toto` / `toto1234` (e-mail varies per run), address `23 rue paris, Paris, 98000, France, Metropolitan`, product **iMac** ($122.00, Ex Tax $100.00)

Each scenario below maps to one Playwright test of the same ID in the `opencart-tests/` project (e.g. TC01 → `tests/01-anonymous-navigation.spec.js`).

---

## Group A — Anonymous browsing & navigation (TC01–TC10)
*Graph node: `Home (Anonymous)` and its direct edges.*

**TC01 — Home page loads with default storefront elements for an anonymous visitor**
Preconditions: no session/cookies (fresh visitor).
Steps: 1) Open `/`.
Expected: search box, "My Account", "Wish List (0)", "Shopping Cart" and "Checkout" header links are visible; all 8 top category links (Desktops, Laptops & Notebooks, Components, Tablets, Software, Phones & PDAs, Cameras, MP3 Players) are visible. Reference: `home_1.png`.

**TC02 — "My Account" dropdown offers Register and Login to an anonymous visitor**
Steps: 1) Open `/`. 2) Click "My Account".
Expected: dropdown shows "Register" and "Login" links. Reference: `home_my_account_clicked.png`; graph edge `Home (Anonymous) --My Account--> Home Drop Down (Anonymous)`.

**TC03 — Desktops mega-menu lists PC (0), Mac (1) and "Show All Desktops"**
Steps: 1) Open `/`. 2) Hover/click "Desktops".
Expected: sub-menu shows "PC (0)", "Mac (1)", "Show All Desktops". Reference: `account_desktop_clicked.png`.

**TC04 — Searching "imac" from the header returns the iMac in Search results**
Steps: 1) Open `/`. 2) Type "imac" in the header search box. 3) Click the search button.
Expected: navigates to a `product/search` URL, heading "Search - imac", iMac result card visible. Reference: `home_search_imac_results.png`.

**TC05 — Opening the iMac from search results shows the expected product details**
Steps: 1)–3) as TC04. 4) Click the "iMac" result.
Expected: product heading "iMac", price "122.00", "Ex Tax: 100.00", "Add to Cart" button visible. Reference: `product_imac.png`.

**TC06 — Adding the iMac to the cart updates the header cart indicator (anonymous)**
Steps: 1)–4) as TC05. 5) Click "Add to Cart".
Expected: header cart widget updates to "1 item(s) - $122.00". Reference: `product_imac_added_cart.png`.

**TC07 — A fresh anonymous session has an empty Shopping Cart page**
Steps: 1) Open `/`. 2) Click "Shopping Cart" in the header.
Expected: heading "Shopping Cart", message "Your shopping cart is empty!", "Continue" button visible. Reference: `shopping_cart_empty.png`.

**TC08 — Anonymous visitor submits the Contact Us form and sees a confirmation**
Steps: 1) Open `/`. 2) Click the "123456789" header link. 3) Fill Name/E-Mail/Enquiry. 4) Click "Submit".
Expected: confirmation text "Your enquiry has been successfully sent to the store owner!", "Continue" button visible. Reference: `contact_us.png` → `contact_us_submitted.png`.

**TC09 — Clicking the header phone number navigates to the Contact Us page**
Steps: 1) Open `/`. 2) Click "123456789".
Expected: navigates to `information/contact`, heading "Contact Us", contact form visible. Graph edge `Home (Anonymous) --123456789--> Contact Us`.

**TC10 — Browsing Desktops > Mac lists the iMac with its catalog price**
Steps: 1) Open `/`. 2) Open the Desktops mega-menu. 3) Click "Mac (1)".
Expected: breadcrumb/heading "Mac", iMac product card visible with price "122.00". Reference: `category_mac.png`.

---

## Group B — Registration (TC11–TC15)
*Graph nodes: `Register Account`, `Account Created`, and their edges to/from `Login`.*

**TC11 — "Register" in the My Account dropdown opens the Register Account page**
Steps: 1) Open `/`. 2) Open "My Account" dropdown. 3) Click "Register".
Expected: navigates to `account/register`, heading "Register Account", First Name/Last Name/E-Mail/Password fields visible. Reference: `register.png`.

**TC12 — Submitting the Register form without agreeing to the Privacy Policy is rejected**
Steps: 1)–2) as TC11. 3) Fill First/Last Name, E-Mail, Password. 4) Leave the "I have read and agree…" switch OFF. 5) Click "Continue".
Expected: page stays on `account/register`; a Privacy Policy warning is shown.

**TC13 — Registering with valid details creates the account and lands on My Account**
Steps: 1)–2) as TC11. 3) Fill all fields, toggle the Privacy Policy switch ON. 4) Click "Continue". 5) Click "Continue" on the confirmation page.
Expected: confirmation heading "Your Account Has Been Created!", then navigation to `account/account` with heading "My Account". Reference: `register.png` → `account_created.png`.

**TC14 — The Login page's "Continue" button (New Customer panel) opens Register Account**
Steps: 1) Open `/`. 2) Open dropdown → "Login". 3) In the "New Customer" panel, click "Continue".
Expected: navigates to `account/register`, heading "Register Account". Graph edge `Login --Continue--> Register Account`.

**TC15 — The "login page" link on Register Account navigates back to Login**
Steps: 1)–2) as TC11. 3) Click the inline "login page" link under "If you already have an account…".
Expected: navigates to `account/login`, heading "Returning Customer". Graph edge `Register Account --login page--> Login`.

---

## Group C — Login / Logout (TC16–TC20)
*Graph node: `Login`, and the `Logout` edge back to `Home (Anonymous)`.*

**TC16 — "Login" in the My Account dropdown opens the Login page**
Steps: 1) Open `/`. 2) Open dropdown → "Login".
Expected: navigates to `account/login`, heading "Returning Customer", E-Mail/Password fields visible. Reference: `login.png`.

**TC17 — Logging in with valid credentials lands on My Account**
Preconditions: an existing account (the one seeded by `global-setup.js`).
Steps: 1)–2) as TC16. 3) Fill valid E-Mail/Password. 4) Click "Login".
Expected: navigates to `account/account`, heading "My Account". Graph edge `Login --Login--> My Account`.

**TC18 — Logging in with an invalid password shows an error and stays on Login**
Steps: 1)–2) as TC16. 3) Fill a valid e-mail with a wrong password. 4) Click "Login".
Expected: stays on `account/login`, warning "No match for E-Mail Address and/or Password" shown.

**TC19 — The "Forgotten Password" link is available on the Login page**
Steps: 1)–2) as TC16. 3) Click "Forgotten Password".
Expected: navigates to `account/forgotten`, heading containing "Forgotten Password".

**TC20 — Logging out from My Account returns to the anonymous Home state**
Preconditions: authenticated session.
Steps: 1) Open My Account. 2) Click "Logout" in the sidebar. 3) Re-open the "My Account" dropdown.
Expected: a "logged off" confirmation is shown; the dropdown now offers "Login"/"Register" again (anonymous state). Graph edge `My Account --Logout--> Home (Anonymous)`.

---

## Group D — My Account, authenticated (TC21–TC25)
*Graph node: `My Account` and its edges to `My Wishlist (empty)`, `Reward Points Page`, `Home (Authenticated)`.*

**TC21 — My Account lists all account management sections**
Preconditions: authenticated session.
Steps: 1) Open `account/account`.
Expected: heading "My Account"; sidebar links "My Account", "Edit Account", "Password", "Payment Methods", "Address Book", "Wish List", "Order History", "Reward Points", "Logout" are all visible. Reference: `account.png`.

**TC22 — "Wish List" shows the empty wishlist message**
Steps: 1) From My Account, click "Wish List".
Expected: navigates to `account/wishlist`, heading "My Wishlist", text "Your wish list is empty.", "Continue" button visible. Reference: `wishlist_empty.png`. Graph edge `My Account --Wish List--> My Wishlist (empty)`.

**TC23 — "Reward Points" shows a zero balance and no history rows**
Steps: 1) From My Account, click "Reward Points".
Expected: heading "Your Reward Points", text "Your total number of reward points is: 0", "You do not have any reward points!", "Continue" button visible. Reference: `reward_points.png`. Graph edge `My Account --Reward Points--> Reward Points Page`.

**TC24 — The logo link returns from My Account to Home (Authenticated)**
Steps: 1) From My Account, click the "Home" logo link.
Expected: navigates back to the home page; authenticated header (Desktops menu, Shopping Cart link) is visible. Graph edge `My Account --Home--> Home (Authenticated)`.

**TC25 — The header "My Account" link re-opens the My Account page**
Steps: 1) From Home (Authenticated), click the header "My Account" link.
Expected: navigates to `account/account`, heading "My Account". *Note: `xpath_mapping.json` only documents the anonymous dropdown (Register/Login); for an authenticated session this header element is assumed to link straight to the account dashboard.*

---

## Group E — Catalog & product detail, authenticated (TC26–TC31)
*Graph path: `Home (Authenticated) --Desktops--> ... --Mac (1)--> Category: Mac --iMac--> Product: iMac --Add to Cart--> ... --Shopping Cart-->`.*

**TC26 — Desktops > Mac (1) lists the iMac for a logged-in shopper**
Preconditions: authenticated session, empty cart.
Steps: 1) Open Desktops mega-menu. 2) Click "Mac (1)".
Expected: heading "Mac", iMac card visible with price "122.00". Reference: `category_mac.png`.

**TC27 — The iMac product page shows brand, model and availability**
Steps: 1)–2) as TC26. 3) Click "iMac".
Expected: heading "iMac"; "Apple" brand, "Product 14" model, "In Stock" availability visible. Reference: `product_imac.png`.

**TC28 — Header search for "imac" returns the iMac for a logged-in shopper**
Steps: 1) Search "imac" from the header.
Expected: navigates to `product/search`, iMac result visible. Reference: `home_search_imac_results.png` (logged-in equivalent).

**TC29 — Adding the iMac to the cart updates the header cart total**
Steps: 1)–2) as TC26. 3) Click "iMac". 4) Set Qty = 1. 5) Click "Add to Cart".
Expected: header shows "1 item(s) - $122.00". Reference: `product_imac_added_cart.png`.

**TC30 — The iMac product page recommends the Apple Cinema 30" as a related product**
Steps: 1)–3) as TC27.
Expected: "Related Products" section shows "Apple Cinema 30"". Reference: `product_imac_added_cart_2.png`.

**TC31 — The Shopping Cart shows correct weight and tax breakdown for one iMac**
Steps: 1)–3) as TC27. 4) Click "Add to Cart". 5) Open "Shopping Cart" from the header.
Expected: heading "Shopping Cart (5.00kg)"; line item "iMac"; Sub-Total $100.00; Eco Tax (-2.00) $2.00; VAT (20%) $20.00; Total $122.00. Reference: `shopping_cart_mac1.png`.

---

## Group F — Cart management, authenticated (TC32–TC35)
*Graph node: `Shopping Cart` and its edges (`Checkout`, `Continue Shopping`).*

**TC32 — Updating the quantity recalculates the cart total**
Preconditions: cart contains 1x iMac.
Steps: 1) Change the quantity field to 2. 2) Click "Update".
Expected: line/grand total recalculates to $244.00 (2 × $122.00). Reference: `shopping_cart_mac1.png` (xpath `Shopping_Cart_Auth` → "Update").

**TC33 — Removing the only item empties the cart**
Steps: 1) Click "Remove".
Expected: message "Your shopping cart is empty!" shown.

**TC34 — "Continue Shopping" returns to Home (Authenticated)**
Steps: 1) Click "Continue Shopping".
Expected: navigates back to the home page, authenticated header visible. Graph edge `Shopping Cart --Continue Shopping--> Home (Authenticated)`.

**TC35 — "Checkout" on the cart page opens the Checkout page**
Steps: 1) Click "Checkout".
Expected: navigates to `checkout/checkout`, headings "Checkout" and "Payment Address" visible. Graph edge `Shopping Cart --Checkout--> Checkout (Payment Address)`.

---

## Group G — Checkout & order placement (TC36–TC42)
*Graph path: `Checkout (Payment Address) --Continue--> Checkout (Shipping Address) --Choose--> Shipping method options --Continue--> Checkout (Shipping Selected) --Choose--> Payment method options --Continue--> Checkout (Final Confirmation) --Confirm Order--> Order Success --Continue--> Home (Authenticated)`.*

Precondition shared by the whole group: the test account already placed **one prior order** (seeded by `global-setup.js`, mirroring the very first checkout shown in `checkout_one.png`/`order_placed.png`). Because of that, this *second* checkout is expected to show the "use an existing address" UI, exactly like `checkout_two.png` onward. TC36–TC42 are run as one continuous, ordered flow (a shopper does not reload between these steps).

**TC36 — Payment Address pre-fills the previously saved address**
Steps: 1) Add an iMac to the cart. 2) Open Cart. 3) Click "Checkout".
Expected: "Payment Address" section shows "I want to use an existing address" selected, with the saved address ("23 rue paris…") in the dropdown. Reference: `checkout_two.png`.

**TC37 — Shipping Address also pre-fills the same saved address**
Expected: "Shipping Address" section likewise shows the existing-address radio selected with the same address. Reference: `checkout_two.png`.

**TC38 — Choosing the Flat Shipping Rate updates the Shipping Method field**
Steps: 1) Click "Choose" next to Shipping Method. 2) In the modal, confirm "Flat Shipping Rate - $5.00". 3) Click "Continue".
Expected: modal closes; Shipping Method field now reads "Flat Shipping Rate - $5.00". Reference: `shipping_method.png` → `checkout_shippement_method_selected.png`.

**TC39 — The order summary recalculates to include the Flat Shipping Rate**
Expected: order summary table shows a "Flat Shipping Rate" line of $5.00 and a new Total of $105.00 (Sub-Total $100.00 + $5.00). Reference: `checkout_shippement_method_selected.png`.

**TC40 — Choosing Cash On Delivery updates the Payment Method field**
Steps: 1) Click "Choose" next to Payment Method. 2) In the modal, confirm "Cash On Delivery". 3) Click "Continue".
Expected: modal closes; Payment Method field now reads "Cash On Delivery". Reference: `payment_method.png`.

**TC41 — Confirming the order shows the Order Success page**
Steps: 1) Click "Confirm Order".
Expected: navigates to the success page, heading "Your order has been placed!", text "Your order has been successfully processed!". Reference: `checkout_final.png` → `order_placed.png`.

**TC42 — "Continue" returns Home and the cart resets to empty**
Steps: 1) Click "Continue" on the Order Success page.
Expected: navigates back to the home page; header cart shows "0 item(s)…". Graph edge `Order Success --Continue--> Home (Authenticated)`.

---

## Coverage summary

| Group | Scenarios | Graph area covered |
|---|---|---|
| A. Anonymous browsing & navigation | TC01–TC10 | `Home (Anonymous)` and its direct edges |
| B. Registration | TC11–TC15 | `Register Account`, `Account Created` |
| C. Login / Logout | TC16–TC20 | `Login`, `Logout` edge |
| D. My Account (authenticated) | TC21–TC25 | `My Account`, `Wishlist`, `Reward Points` |
| E. Catalog & product detail | TC26–TC31 | `Home (Authenticated)` → category → product → cart |
| F. Cart management | TC32–TC35 | `Shopping Cart` actions |
| G. Checkout & order placement | TC36–TC42 | Full checkout funnel → `Order Success` |

**Total: 42 scenarios.**
