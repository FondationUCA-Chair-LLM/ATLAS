# Acceptance Test Scenarios — Water Management Application

Application under test: `http://localhost/watermanagement/` (login page:
`http://localhost/watermanagement/login.php`)

Source material:
- `navigation_graph.json` — screens (nodes) and transitions (edges/interactions)
- `xpath_mapping.json` — xpaths for the UI elements of each screen
- `screenshots/*.png` — actual GUI states with sample functional data

Each scenario below is implemented as one Playwright `test()` in the
`tests/` folder. Scenario numbers match the comments in the test files
(`Scenario 01`, `Scenario 02`, ...).

Two findings from cross-checking the graph against the xpath mapping and
screenshots are called out explicitly where relevant:
- `navigation_graph.json` does not define a `Products -> ProductsSearchResults`
  edge, a `Products -> DeleteProductSuccess` edge, or an
  `Orders -> OrdersSearchResults` edge, even though the corresponding
  "Go"/"Back"/"Delete" elements exist in `xpath_mapping.json` and the
  destination screens (`ProductsSearchResults`, `DeleteProductSuccess`,
  `OrdersSearchResults`) are defined as nodes. These flows are tested for
  completeness (Scenarios 23, 27, 28, 29).
- The screens "Add Customer" and "Edit Customer" reuse the headings
  "Add Vendor Details" / "Edit customer Details" coming from the Vendor
  templates (visible in `customer-add-details.png`). Tests use a
  case-insensitive/loose match on these headings to tolerate this.

---

## 1. Authentication

### Scenario 01 — Successful login with valid credentials
**Preconditions:** A registered administrator account exists (default test
data: `toto` / `toto`, as seen in `login.png`).

**Steps:**
1. Open `login.php`.
2. Verify the "Please Sign in" form is displayed with "Username" and
   "Password" fields and a "Login" button.
3. Enter a valid username and password.
4. Click "Login".

**Expected result:** The user is redirected to the Dashboard. The
"Dashboard" heading is shown, and the side menu displays "Dashboard",
"Vendors", "Customer", "Products" and "Orders".

**Graph edge:** `Login -> Dashboard` (ON_CLICK "Login")

---

### Scenario 02 — "Register" link on the Login page opens the Register screen
**Preconditions:** None.

**Steps:**
1. Open `login.php`.
2. Click the "Register" link ("Don't Have an Account ? Register").

**Expected result:** The Register screen is displayed, titled "Please
Register Here", with "Username", "Email" and "Password" fields.

**Graph context:** Reverse of the `Register -> Login` edge; the "Register"
link is present in `xpath_mapping.json` for the "Login" screen.

---

### Scenario 03 — Registering a new account redirects to Login with a success message
**Preconditions:** None (a unique username/email is generated per run).

**Steps:**
1. Open `login.php` and click "Register".
2. Fill in "Username", "Email" and "Password" with new, unique values.
3. Click the submit button (labelled "Login" in `xpath_mapping.json`).

**Expected result:** The user is redirected to the Login screen with a
green banner "Success! Registered Success" (see `register-success.png`),
and the "Please Sign in" form is displayed again.

**Graph edge:** `Register -> Login` (ON_CLICK "Login")

---

## 2. Dashboard navigation

All Dashboard scenarios assume the user is already logged in (Scenario 01
preconditions).

### Scenario 04 — Side menu "Vendors" link opens the Vendors screen
**Steps:** From the Dashboard, click "Vendors" in the side menu.

**Expected result:** The "Vendors" screen is displayed with a "Search"
box, a "Go" button and a "+ Add Vendors" button.

**Graph edge:** `Dashboard -> Vendors` (ON_CLICK "Vendors")

---

### Scenario 05 — Side menu "Customer" link opens the Customer screen
**Steps:** From the Dashboard, click "Customer" in the side menu.

**Expected result:** The "Customer" screen is displayed with a "Search"
box, a "Go" button and a "+ Add Customer" button.

**Graph edge:** `Dashboard -> Customers` (ON_CLICK "Customer")

---

### Scenario 06 — Side menu "Products" link opens the Product screen
**Steps:** From the Dashboard, click "Products" in the side menu.

**Expected result:** The "Product" screen is displayed with a "Search"
box, a "Go" button and a "+ Add product" button.

**Graph edge:** `Dashboard -> Products` (ON_CLICK "Products")

---

### Scenario 07 — Side menu "Orders" link opens the Orders screen
**Steps:** From the Dashboard, click "Orders" in the side menu.

**Expected result:** The "Orders" screen is displayed with a "Search" box
listing existing orders (Order ID, Customer Name, Payment Status, Date,
Total, Actions).

**Graph edge:** `Dashboard -> Orders` (ON_CLICK "Orders")

---

### Scenario 08 — Dashboard "View Details" card for Vendors
**Steps:** From the Dashboard, click "View Details" on the blue "Vendors"
card.

**Expected result:** The "Vendors" screen is displayed.

**Source:** `xpath_mapping.json` "Dashboard" -> "View Details - Vendors"
(`dashboard.png` shows a card with a vendor count and a "View Details"
link).

---

### Scenario 09 — Dashboard "View Details" card for Customers
**Steps:** From the Dashboard, click "View Details" on the green
"Customers" card.

**Expected result:** The "Customer" screen is displayed.

**Source:** `xpath_mapping.json` "Dashboard" -> "View Details - Customers"

---

### Scenario 10 — Dashboard "View Details" card for Products
**Steps:** From the Dashboard, click "View Details" on the blue "Products"
card.

**Expected result:** The "Product" screen is displayed.

**Source:** `xpath_mapping.json` "Dashboard" -> "View Details - Products"

---

## 3. Vendors management

All Vendors scenarios assume the user is logged in and on the "Vendors"
screen (Dashboard -> Vendors). They are designed to run in sequence
because they progressively modify the first row of the vendor table.

### Scenario 11 — Searching for an existing vendor returns matching results
**Steps:**
1. On the "Vendors" screen, type "John" in the "Search" box.
2. Click "Go".

**Expected result:** The results table shows only vendor "John" (as in
`vendorsSearchJornResult.png` / `vendors-searchs-jorn-result.png`), and a
"Back" button is shown.

**Graph edge:** `Vendors -> VendorsSearchResults` (ON_CLICK "Go")

---

### Scenario 12 — "Back" button on vendor search results returns to the full Vendors list
**Steps:**
1. Search for "John" as in Scenario 11.
2. Click "Back".

**Expected result:** The full "Vendors" list is shown again, including the
"+ Add Vendors" button.

**Graph edge:** `VendorsSearchResults -> Vendors` (ON_CLICK "Back")

---

### Scenario 13 — Adding a new vendor shows an "Added Success" confirmation
**Steps:**
1. Click "+ Add Vendors".
2. On "Add Vendor Details" (`add-vendor.png`), fill in "Vendor Name:",
   "Contact :", select a "Product", and fill "Quantity :" and "Price:".
3. Click "Submit".

**Expected result:** The user is returned to the "Vendors" list with a
green banner "Success! Added Success" (`add-vendor-success.png`), and the
new vendor row is visible in the table.

**Graph edge:** `AddVendor -> AddVendorSuccess` (ON_CLICK "Submit"), reached
via `Vendors -> AddVendor` (ON_CLICK "+ Add Vendors").

---

### Scenario 14 — Editing the first vendor shows an "Edited Success" confirmation
**Steps:**
1. Click "Edit" on the first vendor row.
2. On "Edit Vendor Details" (`edit-vendor.png`), change the "Price" value.
3. Click "Submit".

**Expected result:** The user is returned to the "Vendors" list with a
green banner "Success! Edited Success" (`vendor-edit-success.png`).

**Graph edge:** `EditVendor -> EditVendorSuccess` (ON_CLICK "Submit"),
reached via `Vendors -> EditVendor` (ON_CLICK "Edit").

---

### Scenario 15 — Deleting the first vendor shows a "Deleted" confirmation
**Steps:**
1. Accept any confirmation dialog.
2. Click "Delete" on the first vendor row.

**Expected result:** The vendor is removed from the list and a green
banner "Success! Deleted Sucess" is shown (`delete-vendor-success.png`).

**Graph edge:** `Vendors -> DeleteVendorSuccess` (ON_CLICK "Delete")

---

### Scenario 16 — Buying from a vendor goes through the Confirm Buy screen
**Steps:**
1. Click "Buy" on the first vendor row.
2. On "Confirm Buy ?" (`vendor_buy.png`), verify the vendor's details
   (Vendor Name, Contact, Product Category, Product, Quantity, Price) are
   displayed read-only.
3. Click "Buy".

**Expected result:** The user is returned to the "Vendors" list with a
success banner (`vendors-buy-success.png` shows "Success! Edited
Success").

**Graph edges:** `Vendors -> ConfirmBuy` (ON_CLICK "Buy"),
`ConfirmBuy -> BuySuccess` (ON_CLICK "Buy")

---

## 4. Customer management

All Customer scenarios assume the user is logged in and on the "Customer"
screen (Dashboard -> Customers). They run in sequence and progressively
modify the first row of the customer table.

### Scenario 17 — Searching for an existing customer returns matching results
**Steps:**
1. On the "Customer" screen, type "Dikshant23" in "Search".
2. Click "Go".

**Expected result:** The results table shows the matching customer(s) and
a "Back" button is shown (`customer-searchhello-results.png` shows the
analogous flow for the term "Hello").

**Graph edge:** `Customers -> CustomersSearchResults` (ON_CLICK "Go")

---

### Scenario 18 — "Back" button on customer search results returns to the full Customer list
**Steps:**
1. Search for "Dikshant23" as in Scenario 17.
2. Click "Back".

**Expected result:** The full "Customer" list is shown again, including
the "+ Add Customer" button.

**Graph edge:** `CustomersSearchResults -> Customers` (ON_CLICK "Back")

---

### Scenario 19 — Adding a new customer shows an "Added Success" confirmation
**Steps:**
1. Click "+ Add Customer".
2. On the add-customer form (`customer-add-details.png` — heading "Add
   Vendor Details"), fill in "Customer Name:" and "Contact :".
3. Click "Submit".

**Expected result:** The user is returned to the "Customer" list with a
green banner "Success! Added Success" (`customer-add-success.png`), and the
new customer row is visible.

**Graph edge:** `AddCustomer -> AddCustomerSuccess` (ON_CLICK "Submit"),
reached via `Customers -> AddCustomer` (ON_CLICK "+ Add Customer").

---

### Scenario 20 — Editing the first customer shows an "Edited Success" confirmation
**Steps:**
1. Click "Edit" on the first customer row.
2. On "Edit customer Details" (`customer-update-details.png`), change
   "customer Name:".
3. Click "Submit".

**Expected result:** The user is returned to the "Customer" list with a
green banner "Success! Edited Success" (`customer-update-success.png`),
showing the updated name.

**Graph edge:** `EditCustomer -> EditCustomerSuccess` (ON_CLICK "Submit"),
reached via `Customers -> EditCustomer` (ON_CLICK "Edit").

---

### Scenario 21 — Deleting the first customer shows a "Deleted" confirmation
**Steps:**
1. Accept any confirmation dialog.
2. Click "Delete" on the first customer row.

**Expected result:** The customer is removed from the list and a success
banner is shown.

**Graph edge:** `Customers -> DeleteCustomerSuccess` (ON_CLICK "Delete")

---

### Scenario 22 — Selling a product to the first customer generates an invoice
**Steps:**
1. Click "Sell" on the first customer row.
2. On "Sell Product" (`customer-sell-details.png`), check the checkbox for
   the first product and fill in "Quantity". Leave "Payment Status" as
   "Pending" (default).
3. Click "Submit".

**Expected result:** An invoice/bill is generated (`customer-sell-success.png`),
showing "INVOICE TO", an "Order No", a line item for the selected product,
"SUBTOTAL", "TAX 5%", "GRAND TOTAL" and "Thank you!", with "Payment Status
: pending".

**Graph edge:** `SellProduct -> SellSuccess` (ON_CLICK "Submit"), reached
via `Customers -> SellProduct` (ON_CLICK "Sell").

---

## 5. Product management

All Product scenarios assume the user is logged in and on the "Product"
screen (Dashboard -> Products). They run in sequence and progressively
modify the first row of the product table.

### Scenario 23 — Searching for an existing product returns matching results
**Steps:**
1. On the "Product" screen, type "www" in "Search".
2. Click "Go".

**Expected result:** The results table shows the matching product (ID 4,
category "www", name "www" — see `products-search-result.png`), with a
"Back" button.

**Note:** Not an explicit edge in `navigation_graph.json`, but the "Go" /
"Back" elements and `ProductsSearchResults` node exist in
`xpath_mapping.json`.

---

### Scenario 24 — "Back" button on product search results returns to the full Product list
**Steps:**
1. Search for "www" as in Scenario 23.
2. Click "Back".

**Expected result:** The full "Product" list is shown again, including the
"+ Add product" button.

---

### Scenario 25 — Adding a new product shows an "Added Success" confirmation
**Steps:**
1. Click "+ Add product".
2. On "Add Products Details" (`product-add-details.png`), fill in
   "Product Category:", "Product Name:", "Product Price:" and "Product
   Stock:".
3. Click "Submit".

**Expected result:** The user is returned to the "Product" list with a
green banner "Success! Added Success" (`product-add-success.png`), and the
new product row is visible.

**Graph edge:** `AddProduct -> AddProductSuccess` (ON_CLICK "Submit"),
reached via `Products -> AddProduct` (ON_CLICK "+ Add product").

---

### Scenario 26 — Editing the first product shows an "Edited Success" confirmation
**Steps:**
1. Click "Edit" on the first product row.
2. On "Edit product Details" (`product-edit-details.png`), change "Product
   Price:".
3. Click "Submit".

**Expected result:** The user is returned to the "Product" list with a
green banner "Success! Edited Success" (`product-edit-succuss.png`).

**Graph edge:** `EditProduct -> EditProductSuccess` (ON_CLICK "Submit"),
reached via `Products -> EditProduct` (ON_CLICK "Edit").

---

### Scenario 27 — Deleting the first product shows a "Deleted" confirmation
**Steps:**
1. Accept any confirmation dialog.
2. Click "Delete" on the first product row.

**Expected result:** The product is removed from the list and a success
banner is shown.

**Note:** Not an explicit edge in `navigation_graph.json`, but the
"Delete" element (table action) and `DeleteProductSuccess` node exist in
`xpath_mapping.json`, and the "Delete" button is visible in
`products.png`.

---

## 6. Orders management

All Orders scenarios assume the user is logged in and on the "Orders"
screen (Dashboard -> Orders). They run in sequence and progressively modify
the first row of the orders table.

### Scenario 28 — Searching for an existing order returns matching results
**Steps:**
1. On the "Orders" screen, type "1045" in "Search".
2. Click "Go".

**Expected result:** The results table shows order "1045", with a "Back"
button.

**Note:** Not an explicit edge in `navigation_graph.json`, but the "Go" /
"Back" elements and `OrdersSearchResults` node exist in
`xpath_mapping.json`, and the "Search"/"Go" controls are visible in
`orders.png`.

---

### Scenario 29 — "Back" button on order search results returns to the full Orders list
**Steps:**
1. Search for "1045" as in Scenario 28.
2. Click "Back".

**Expected result:** The full "Orders" list is shown again.

---

### Scenario 30 — Toggling the payment status of the first order updates it
**Steps:**
1. Note the current "Payment Status" badge ("Paid" or "Pending") for the
   first order row.
2. Click on the "Payment Status" badge.

**Expected result:** A green banner "Success! Payment Status Updated" is
shown (`order-updated-success.png`), and the badge for the first order now
shows the opposite status (e.g. "Paid" -> "Pending", as seen comparing
`orders.png` and `order-updated-success.png`).

**Graph edge:** `Orders -> UpdatePaidstatus` (ON_CLICK "Paid")

---

### Scenario 31 — Deleting the first order shows a "Deleted" confirmation
**Steps:**
1. Accept any confirmation dialog.
2. Click "Delete" on the first order row.

**Expected result:** The order is removed from the list and a green banner
"Success! Deleted Success" is shown (`order-deleted-succuss.png`).

**Graph edge:** `Orders -> DeleteOrderSuccess` (ON_CLICK "Delete")

---

### Scenario 32 — "BILL" action opens the invoice for the first order
**Steps:**
1. Click "BILL" on the first order row.

**Expected result:** An invoice/bill page is displayed (`order-bill.png`),
showing "INVOICE TO", "Order No", a line item table, "SUBTOTAL", "TAX 5%",
"GRAND TOTAL", "Payment Status", and "Print" / "Export as PDF" buttons.

**Graph edge:** `Orders -> ViewBill` (ON_CLICK "BILL")

---

## Coverage summary

| # | Scenario | Graph edge(s) | Spec file |
|---|----------|---------------|-----------|
| 01 | Login success | Login -> Dashboard | 01-authentication.spec.js |
| 02 | Login -> Register link | (Login screen element) | 01-authentication.spec.js |
| 03 | Register success | Register -> Login | 01-authentication.spec.js |
| 04 | Dashboard -> Vendors (menu) | Dashboard -> Vendors | 02-dashboard.spec.js |
| 05 | Dashboard -> Customers (menu) | Dashboard -> Customers | 02-dashboard.spec.js |
| 06 | Dashboard -> Products (menu) | Dashboard -> Products | 02-dashboard.spec.js |
| 07 | Dashboard -> Orders (menu) | Dashboard -> Orders | 02-dashboard.spec.js |
| 08 | Dashboard View Details -> Vendors | (Dashboard widget) | 02-dashboard.spec.js |
| 09 | Dashboard View Details -> Customers | (Dashboard widget) | 02-dashboard.spec.js |
| 10 | Dashboard View Details -> Products | (Dashboard widget) | 02-dashboard.spec.js |
| 11 | Vendors search | Vendors -> VendorsSearchResults | 03-vendors.spec.js |
| 12 | Vendors search Back | VendorsSearchResults -> Vendors | 03-vendors.spec.js |
| 13 | Add vendor | AddVendor -> AddVendorSuccess | 03-vendors.spec.js |
| 14 | Edit vendor | EditVendor -> EditVendorSuccess | 03-vendors.spec.js |
| 15 | Delete vendor | Vendors -> DeleteVendorSuccess | 03-vendors.spec.js |
| 16 | Buy from vendor | Vendors -> ConfirmBuy -> BuySuccess | 03-vendors.spec.js |
| 17 | Customers search | Customers -> CustomersSearchResults | 04-customers.spec.js |
| 18 | Customers search Back | CustomersSearchResults -> Customers | 04-customers.spec.js |
| 19 | Add customer | AddCustomer -> AddCustomerSuccess | 04-customers.spec.js |
| 20 | Edit customer | EditCustomer -> EditCustomerSuccess | 04-customers.spec.js |
| 21 | Delete customer | Customers -> DeleteCustomerSuccess | 04-customers.spec.js |
| 22 | Sell product | SellProduct -> SellSuccess | 04-customers.spec.js |
| 23 | Products search | (gap vs. graph) | 05-products.spec.js |
| 24 | Products search Back | (gap vs. graph) | 05-products.spec.js |
| 25 | Add product | AddProduct -> AddProductSuccess | 05-products.spec.js |
| 26 | Edit product | EditProduct -> EditProductSuccess | 05-products.spec.js |
| 27 | Delete product | (gap vs. graph) | 05-products.spec.js |
| 28 | Orders search | (gap vs. graph) | 06-orders.spec.js |
| 29 | Orders search Back | (gap vs. graph) | 06-orders.spec.js |
| 30 | Toggle order payment status | Orders -> UpdatePaidstatus | 06-orders.spec.js |
| 31 | Delete order | Orders -> DeleteOrderSuccess | 06-orders.spec.js |
| 32 | View order bill | Orders -> ViewBill | 06-orders.spec.js |
