import os
import shutil

rename_map = {
    "home_1_old.png": "Home_Anonymous.png",
    "home_2.png": "Home_Anonymous_02.png",
    "home_3.png": "Home_Anonymous_03.png",
    "home_my_account_clicked.png": "Home_Anonymous_drop_down.png",
    "login.png": "Login_Page.png",
    "register.png": "Register_Account.png",
    "account_created.png": "Account_Created.png",
    "account.png": "My_Account.png",
    "account_desktop_clicked.png": "Category_Mac_Auth.png",
    "category_mac.png": "Category_Mac_Auth_02.png",
    "product_imac.png": "Product_Detail_Anon.png",
    "product_imac_2.png": "Product_Detail_Anon_02.png",
    "product_imac_added_cart.png": "Product_Detail_Auth_Cart.png",
    "product_imac_added_cart_2.png": "Product_Detail_Auth_Cart_02.png",
    "shopping_cart_empty.png": "Shopping_Cart_Empty.png",
    "shopping_cart_mac1.png": "Shopping_Cart_Auth.png",
    "checkout_one.png": "Checkout_Auth.png",
    "checkout_two.png": "Checkout_Auth_Shipping.png",
    "shipping_method.png": "Checkout_Auth_Shipping_options.png",
    "checkout_shippement_method_selected.png": "Checkout_Auth_Shippement_method_selected.png",
    "payment_method.png": "Checkout_Auth_Payment_options.png",
    "checkout_final.png": "Checkout_Auth_Final.png",
    "order_placed.png": "Order_Success_Auth.png",
    "wishlist_empty.png": "Wishlist_Empty.png",
    "reward_points.png": "Reward_Points.png",
    "home_search_imac_results.png": "Search_Results_Anon.png",
    "contact_us.png": "Contact_Us_Anon.png",
    "contact_us_submitted.png": "Contact_Submitted_Anon.png",
    # Unused/optional files:
    "footer.png": "Footer_Common.png",
    "product_mac.png": "Product_Detail_Mac.png",
}

for old, new in rename_map.items():
    if os.path.exists(old):
        if not os.path.exists(new):
            os.rename(old, new)
            print(f"Renamed: {old} -> {new}")
        else:
            print(f"Skipped (exists): {old}")
    else:
        print(f"Not found: {old}")

print("\nDone! Update your image_mapping.json to use the new filenames.")
