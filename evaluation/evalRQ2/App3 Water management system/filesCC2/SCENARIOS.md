# Water Management – Acceptance Test Scenarios (Natural Language)
**Application URL:** http://localhost/watermanagement  
**Test credentials (from screenshots):** username = `toto` / password = `toto`  
**Total scenarios:** 32

---

## Module 1 – Authentication

### TC01 – Successful Login
**Objective:** Verify that a registered user can log in with valid credentials.  
**Precondition:** The application is accessible and the user account (toto/toto) exists.  
**Steps:**
1. Open `http://localhost/watermanagement` → the Login page appears ("Please Sign in").
2. Enter `toto` in the **Username** field.
3. Enter `toto` in the **Password** field.
4. Click the **Login** button.

**Expected result:** The user is redirected to the Dashboard. The side-menu shows Dashboard, Vendors, Customer, Products, Orders. The three summary cards (5 Vendors, 3 Customers, 4 Products) are visible.

---

### TC02 – Navigate to Register page from Login
**Objective:** Verify the Register link on the Login page works.  
**Precondition:** Login page is open.  
**Steps:**
1. Open the Login page.
2. Click the **Register** link ("Don't Have an Account? Register").

**Expected result:** The Register page opens showing Username, Email, and Password fields plus a Login button and a "Have an Account? Login" link.

---

### TC03 – Successful Registration and redirect to Login
**Objective:** Verify a new user can register and is redirected to Login with a success message.  
**Precondition:** Register page is open.  
**Steps:**
1. Navigate to the Register page via the Login link.
2. Enter a unique username (e.g. `newuser_<timestamp>`).
3. Enter a valid email (e.g. `newuser@gmail.com`).
4. Enter a password (e.g. `pass1234`).
5. Click the **Login** (submit) button.

**Expected result:** A green banner "Success! Registered Success" appears. The Login page is displayed with empty fields.

---

## Module 2 – Dashboard

### TC04 – Dashboard summary cards
**Objective:** Verify the Dashboard correctly displays counts for Vendors, Customers, and Products.  
**Precondition:** User is logged in.  
**Steps:**
1. Log in as toto/toto.
2. Observe the Dashboard page.

**Expected result:** Three summary cards are visible: Vendors (5), Customers (3), Products (4). Each card contains a "View Details" link. Side-menu displays Dashboard, Vendors, Customer, Products, Orders.

---

### TC31 – Dashboard "View Details – Vendors" quick link
**Objective:** Verify the "View Details" link under the Vendors card navigates to the Vendors page.  
**Precondition:** User is on the Dashboard.  
**Steps:**
1. Log in.
2. Click "View Details" in the Vendors card.

**Expected result:** The Vendors list page is displayed with the vendor table and "+ Add Vendors" button.

---

### TC32 – Dashboard "View Details – Products" quick link
**Objective:** Verify the "View Details" link under the Products card navigates to the Products page.  
**Precondition:** User is on the Dashboard.  
**Steps:**
1. Log in.
2. Click "View Details" in the Products card.

**Expected result:** The Products list page is displayed showing product rows (Water Bottle/Bislery, Water Jar/Kinely23, etc.).

---

## Module 3 – Vendors

### TC05 – Navigate to Vendors from side-menu
**Objective:** Verify the side-menu Vendors link opens the Vendors list.  
**Precondition:** User is logged in on the Dashboard.  
**Steps:**
1. Log in.
2. Click **Vendors** in the side-menu.

**Expected result:** The Vendors page appears with a search bar, a "+ Add Vendors" button, and a table listing vendors (columns: Vendor Name, Contact no, Category, Product, Quantity, Price, Actions with Edit / Delete / Buy buttons). Sample data: awdwad, John, Krishnataknt, awdwad, Test2.

---

### TC06 – Search for a vendor by name
**Objective:** Verify that searching by vendor name filters the list.  
**Precondition:** User is on the Vendors page.  
**Steps:**
1. Enter `jorn` in the **Search** field.
2. Click the **Go** button.

**Expected result:** The Vendor Search Results page is shown. Results are filtered. A **Back** button is visible.

---

### TC07 – Back navigation from Vendor search results
**Objective:** Verify the Back button returns the user to the full Vendors list.  
**Precondition:** Vendor search results are displayed.  
**Steps:**
1. After performing a vendor search, click the **Back** button.

**Expected result:** The Vendors list page with all vendor rows and the "+ Add Vendors" button is restored.

---

### TC08 – Add a new Vendor
**Objective:** Verify that a new vendor can be created with valid data.  
**Precondition:** User is on the Vendors page.  
**Steps:**
1. Click **+ Add Vendors**.
2. Enter **Vendor Name**: `Test Vendor Playwright`.
3. Enter **Contact**: `9988776655`.
4. Select a **Product** from the dropdown (e.g. `aw--2323`).
5. Enter **Quantity**: `50`.
6. Enter **Price**: `250`.
7. Click **Submit**.

**Expected result:** The Vendors page opens and a green banner "Success! Added Success" is displayed. The new vendor appears in the table.

---

### TC09 – Edit an existing Vendor
**Objective:** Verify that an existing vendor's details can be updated.  
**Precondition:** At least one vendor exists. User is on the Vendors page.  
**Steps:**
1. Click the **Edit** (pencil icon) button on the first vendor row (awdwad, 11113243132, Water Bottle, Bislery, 1243, 44).
2. Change the **Price** field to `99`.
3. Click **Submit**.

**Expected result:** The Vendors page is shown with a green banner "Success! Edited Success". The updated price is visible in the table.

---

### TC10 – Delete a Vendor
**Objective:** Verify that a vendor can be removed from the list.  
**Precondition:** At least one vendor exists. User is on the Vendors page.  
**Steps:**
1. Click the **Delete** (trash icon) button on the last vendor row.

**Expected result:** The Vendors page reloads. The deleted vendor no longer appears in the table.

---

### TC11 – Initiate a Buy from Vendor (Confirm Buy page)
**Objective:** Verify that clicking Buy on a vendor opens the Confirm Buy page with correct details.  
**Precondition:** At least one vendor exists. User is on the Vendors page.  
**Steps:**
1. Click the **Buy** button on the first vendor row (awdwad).

**Expected result:** The "Confirm Buy?" page is displayed showing Vendor Name: awdwad, Contact: 11113243132, Product Category: Water Bottle, Product: Bislery, Quantity: 1243, Price: 43. A **Buy** button is present.

---

### TC12 – Complete a purchase from a Vendor
**Objective:** Verify that confirming a buy records the purchase successfully.  
**Precondition:** The Confirm Buy page is displayed with vendor details.  
**Steps:**
1. On the Confirm Buy page, click the **Buy** button.

**Expected result:** A success screen is displayed (or the Vendors page with a success banner), confirming the purchase was registered.

---

## Module 4 – Customers

### TC13 – Navigate to Customers from side-menu
**Objective:** Verify the side-menu Customer link opens the Customers list.  
**Precondition:** User is logged in.  
**Steps:**
1. Log in.
2. Click **Customer** in the side-menu.

**Expected result:** The Customer page appears with a search bar, a "+ Add Customer" button, and a table listing customers (Dikshant23 / 99750576266, HEllo / 1223, Akshata / 9004439609) with Edit / Delete / Sell action buttons.

---

### TC14 – Search for a customer by name
**Objective:** Verify the customer search filters the table.  
**Precondition:** User is on the Customers page.  
**Steps:**
1. Type `Hello` in the **Search** field.
2. Click **Go**.

**Expected result:** Customer Search Results page is shown. Results matching "Hello" are listed. A **Back** button is visible.

---

### TC15 – Back navigation from Customer search results
**Objective:** Verify the Back button returns to the full Customer list.  
**Precondition:** Customer search results are displayed.  
**Steps:**
1. Click **Back** on the Customer Search Results page.

**Expected result:** Full Customer list with all three customers and the "+ Add Customer" button is shown.

---

### TC16 – Add a new Customer
**Objective:** Verify that a new customer can be created.  
**Precondition:** User is on the Customers page.  
**Steps:**
1. Click **+ Add Customer**.
2. Enter **Customer Name**: `New Customer PW`.
3. Enter **Contact**: `9876543210`.
4. Click **Submit**.

**Expected result:** The Customers page shows a success banner and the new customer appears in the table.

---

### TC17 – Edit an existing Customer
**Objective:** Verify that a customer's details can be updated.  
**Precondition:** At least one customer exists.  
**Steps:**
1. Click **Edit** on the first customer row (Dikshant23).
2. Update the **Contact** field to `1111111111`.
3. Click **Submit**.

**Expected result:** The Customer page is displayed with the updated contact number for Dikshant23.

---

### TC18 – Delete a Customer
**Objective:** Verify that a customer can be removed.  
**Precondition:** At least one customer exists.  
**Steps:**
1. Click **Delete** on the last customer row.

**Expected result:** The Customers page reloads without the deleted customer.

---

### TC19 – Sell a product to a customer (Pending payment)
**Objective:** Verify that an order can be placed with Pending payment status.  
**Precondition:** At least one customer and one product exist.  
**Steps:**
1. Click **Sell** on the first customer row (Dikshant23).
2. The "Sell Product" page shows: Customer Name: Dikshant23, Contact: 99750576266, Payment Status (Pending / Paid radio).
3. Select **Pending**.
4. Check the first product checkbox (Bislery--Water Bottle, Price: 20, Stocks: 1712).
5. Enter **Quantity**: `5`.
6. Click **Submit**.

**Expected result:** A success screen or the Customers page is displayed, confirming the sale was recorded with Pending status.

---

### TC20 – Sell a product to a customer (Paid payment)
**Objective:** Verify that an order can be placed with Paid payment status.  
**Precondition:** At least one customer and one product exist.  
**Steps:**
1. Click **Sell** on the first customer row.
2. Select **Paid** radio button.
3. Check the first product (Bislery--Water Bottle).
4. Enter **Quantity**: `3`.
5. Click **Submit**.

**Expected result:** Success screen or Customer page is shown, confirming the order with Paid status.

---

## Module 5 – Products

### TC21 – Navigate to Products from side-menu
**Objective:** Verify the Products side-menu link opens the Products list.  
**Precondition:** User is logged in.  
**Steps:**
1. Log in.
2. Click **Products** in the side-menu.

**Expected result:** Products page appears showing: product table (ID, Product Category, Product Name, Product Price, Product Stocks, Actions). Sample data: 1/Water Bottle/Bislery/20/1712, 2/Water Jar/Kinely23/355/100, 3/aw/2323/12/10, 4/www/www/233/213123. "+ Add product" button is visible.

---

### TC22 – Search for a product by name
**Objective:** Verify the product search filters results correctly.  
**Precondition:** User is on the Products page.  
**Steps:**
1. Enter `Bislery` in the **Search** field.
2. Click **Go**.

**Expected result:** The Products Search Results page is shown with matching products. A **Back** button is visible.

---

### TC23 – Back navigation from Product search results
**Objective:** Verify the Back button restores the full Products list.  
**Precondition:** Products search results page is shown.  
**Steps:**
1. Click the **Back** button.

**Expected result:** The full Products list (all 4 products) is displayed.

---

### TC24 – Add a new Product
**Objective:** Verify that a new product can be created.  
**Precondition:** User is on the Products page.  
**Steps:**
1. Click **+ Add product**.
2. Enter **Product Category**: `Water Purifier`.
3. Enter **Product Name**: `AquaClean Pro`.
4. Enter **Product Price**: `1500`.
5. Enter **Product Stock**: `200`.
6. Click **Submit**.

**Expected result:** The Products page is shown with a success banner. The new product appears in the list.

---

### TC25 – Edit an existing Product
**Objective:** Verify that an existing product's details can be updated.  
**Precondition:** At least one product exists.  
**Steps:**
1. Click **Edit** on the first product row (Water Bottle / Bislery).
2. Change **Product Price** to `25`.
3. Click **Submit**.

**Expected result:** The Products page is displayed. The updated price is visible. A success message may appear.

---

## Module 6 – Orders

### TC26 – Navigate to Orders from side-menu
**Objective:** Verify the Orders side-menu link opens the Orders list.  
**Precondition:** User is logged in and some orders exist (created via Sell flows).  
**Steps:**
1. Log in.
2. Click **Orders** in the side-menu.

**Expected result:** The Orders page is displayed with a table of orders (columns include customer name, product, quantity, status, actions: Paid / Delete / BILL buttons).

---

### TC27 – Search Orders
**Objective:** Verify that the Orders search field filters the order list.  
**Precondition:** Orders page is displayed, at least one order exists.  
**Steps:**
1. Type a customer name (e.g. `Dikshant`) in the **Search** field.
2. Click **Go**.

**Expected result:** The Orders page reloads showing only orders matching the search term.

---

### TC28 – Mark an Order as Paid
**Objective:** Verify that a Pending order can be marked Paid.  
**Precondition:** At least one order with Pending status exists.  
**Steps:**
1. On the Orders page, click the **Paid** button on the first order row.

**Expected result:** The order's payment status is updated to Paid. The Orders page (or UpdatePaidstatus page) is displayed confirming the change.

---

### TC29 – View Bill for an Order
**Objective:** Verify that clicking BILL opens the invoice/bill view for that order.  
**Precondition:** At least one order exists.  
**Steps:**
1. On the Orders page, click the **BILL** button on the first order row.

**Expected result:** The View Bill page is displayed showing order details (customer, product, quantity, price, total). The URL changes from the Orders listing.

---

### TC30 – Delete an Order
**Objective:** Verify that an order can be deleted.  
**Precondition:** At least one order exists.  
**Steps:**
1. On the Orders page, click the **Delete** button on the last order row.

**Expected result:** The Orders page reloads. The deleted order no longer appears in the list. A success indicator may be shown ("Delete Order Success").

---

## Summary Table

| ID    | Module       | Scenario                                      | Entry Point     |
|-------|--------------|-----------------------------------------------|-----------------|
| TC01  | Auth         | Successful Login                              | Login page      |
| TC02  | Auth         | Navigate to Register from Login               | Login page      |
| TC03  | Auth         | Successful Registration                       | Login → Register|
| TC04  | Dashboard    | Summary cards shown                           | Login → Dashboard|
| TC05  | Vendors      | Navigate via side-menu                        | Dashboard       |
| TC06  | Vendors      | Search vendor by name                         | Vendors page    |
| TC07  | Vendors      | Back from vendor search results               | Vendor Search   |
| TC08  | Vendors      | Add new vendor                                | Vendors page    |
| TC09  | Vendors      | Edit vendor                                   | Vendors page    |
| TC10  | Vendors      | Delete vendor                                 | Vendors page    |
| TC11  | Vendors      | Initiate Buy → Confirm Buy page               | Vendors page    |
| TC12  | Vendors      | Complete Buy → Buy Success                    | Confirm Buy page|
| TC13  | Customers    | Navigate via side-menu                        | Dashboard       |
| TC14  | Customers    | Search customer by name                       | Customers page  |
| TC15  | Customers    | Back from customer search results             | Customer Search |
| TC16  | Customers    | Add new customer                              | Customers page  |
| TC17  | Customers    | Edit customer                                 | Customers page  |
| TC18  | Customers    | Delete customer                               | Customers page  |
| TC19  | Customers    | Sell product (Pending payment)                | Customers page  |
| TC20  | Customers    | Sell product (Paid payment)                   | Customers page  |
| TC21  | Products     | Navigate via side-menu                        | Dashboard       |
| TC22  | Products     | Search product by name                        | Products page   |
| TC23  | Products     | Back from product search results              | Product Search  |
| TC24  | Products     | Add new product                               | Products page   |
| TC25  | Products     | Edit product                                  | Products page   |
| TC26  | Orders       | Navigate via side-menu                        | Dashboard       |
| TC27  | Orders       | Search orders                                 | Orders page     |
| TC28  | Orders       | Mark order as Paid                            | Orders page     |
| TC29  | Orders       | View Bill for an order                        | Orders page     |
| TC30  | Orders       | Delete an order                               | Orders page     |
| TC31  | Dashboard    | Quick link – View Details Vendors             | Dashboard       |
| TC32  | Dashboard    | Quick link – View Details Products            | Dashboard       |
