# Gruyere Web Application – Acceptance Test Scenarios

> Base URL: `https://google-gruyere.appspot.com/start`  
> All scenarios begin at the **Start** screen.  
> The **Upload** feature is excluded from all scenarios.

---

## Scenario 01 – Start and reach the anonymous home page

**Goal:** Verify that a user who agrees to the terms of service is redirected to the anonymous home page.

**Preconditions:** None.

**Steps:**
1. Navigate to `https://google-gruyere.appspot.com/start`.
2. Observe the Start Gruyere page showing the instance ID, the red security warning, and the "Agree & Start" link.
3. Click **Agree & Start**.

**Expected result:** The anonymous home page ("Gruyere: Home") is displayed with:
- Navigation bar containing **Home**, **Sign in**, and **Sign up** links.
- A "Most recent snippets" section visible in the content area.

---

## Scenario 02 – Navigate to the Sign Up page from the anonymous home page

**Goal:** Verify that the Sign Up page is reachable from the anonymous home page.

**Preconditions:** User has completed Scenario 01 (anonymous home page is displayed).

**Steps:**
1. Start from the Start screen and click **Agree & Start**.
2. On the anonymous home page, click **Sign up**.

**Expected result:** The Sign Up page ("Gruyere: Sign up") is displayed with:
- A form containing **User name** and **Password** fields.
- The red security warning message.
- A **Create account** button.

---

## Scenario 03 – Navigate back to the anonymous home page from the Sign Up page

**Goal:** Verify that clicking **Home** on the Sign Up page returns the user to the anonymous home page.

**Preconditions:** The Sign Up page is displayed.

**Steps:**
1. Start from the Start screen and click **Agree & Start**.
2. Click **Sign up**.
3. On the Sign Up page, click **Home**.

**Expected result:** The anonymous home page is displayed again with the navigation bar showing **Sign in** and **Sign up** links.

---

## Scenario 04 – Create a new account successfully

**Goal:** Verify that a user can create a new account and see the "Account created" confirmation.

**Preconditions:** The Sign Up page is displayed.

**Steps:**
1. Start from the Start screen and click **Agree & Start**.
2. Click **Sign up**.
3. Enter a unique username (e.g., `toto`) in the **User name** field.
4. Enter a password (e.g., `toto`) in the **Password** field.
5. Click **Create account**.

**Expected result:**  
- An "Account created." confirmation message is displayed (red text in a rounded pink/red box).
- The navigation bar still shows only **Home**, **Sign in**, and **Sign up** (the user is not yet authenticated).

---

## Scenario 05 – Navigate to the authenticated home page after account creation

**Goal:** Verify that after account creation, clicking **Home** displays the authenticated home page.

**Preconditions:** The "Account created" screen is displayed (Scenario 04 completed).

**Steps:**
1. Follow Scenario 04 to reach the Account Created screen.
2. Click **Home**.

**Expected result:** The authenticated home page ("Gruyere: Home") is displayed with:
- Navigation bar on the left showing **Home**, **My Snippets**, **New Snippet**, **Upload**.
- Navigation bar on the right showing the logged-in username (e.g., `toto <toto>`), **Profile**, and **Sign out**.
- A "Most recent snippets" content area.

---

## Scenario 06 – Sign out from the authenticated home page

**Goal:** Verify that signing out from the authenticated home page redirects the user to the anonymous home page.

**Preconditions:** The authenticated home page is displayed.

**Steps:**
1. Follow Scenario 05 to reach the authenticated home page.
2. Click **Sign out**.

**Expected result:** The anonymous home page is displayed with:
- Navigation bar showing only **Home**, **Sign in**, and **Sign up** (no authenticated user elements).

---

## Scenario 07 – Add a new snippet from the authenticated home page

**Goal:** Verify that a logged-in user can create a new snippet and see it listed under My Snippets.

**Preconditions:** The authenticated home page is displayed.

**Steps:**
1. Follow Scenario 05 to reach the authenticated home page.
2. Click **New Snippet**.
3. On the New Snippet page, observe the textarea labelled "Add a new snippet.".
4. Type a snippet text (e.g., `hello snippet`) in the textarea.
5. Click **Submit**.

**Expected result:** The My Snippets page is displayed showing:
- "All snippets:" section with the newly added snippet listed (e.g., `1 [X] hello snippet`).
- A **My site** link.

---

## Scenario 08 – View My Snippets when no snippets exist

**Goal:** Verify that the My Snippets page correctly shows an empty state.

**Preconditions:** The authenticated home page is displayed and no snippets have been created for this account.

**Steps:**
1. Follow Scenario 05 to reach the authenticated home page.
2. Click **My Snippets**.

**Expected result:** The My Snippets page is displayed showing:
- "No snippets." message.
- A **My site** link.
- A **Refresh** link in the upper-right area.

---

## Scenario 09 – Navigate from My Snippets (empty) back to the authenticated home page

**Goal:** Verify that clicking **Home** on the empty My Snippets page returns the user to the authenticated home page.

**Preconditions:** The empty My Snippets page is displayed.

**Steps:**
1. Follow Scenario 08 to reach the empty My Snippets page.
2. Click **Home**.

**Expected result:** The authenticated home page is displayed with the full authenticated navigation bar (Home, My Snippets, New Snippet, Upload on the left; username, Profile, Sign out on the right).

---

## Scenario 10 – Access and view the Profile page

**Goal:** Verify that a logged-in user can navigate to the Profile page and see the profile form.

**Preconditions:** The authenticated home page is displayed.

**Steps:**
1. Follow Scenario 05 to reach the authenticated home page.
2. Click **Profile**.

**Expected result:** The Profile page ("Gruyere: Profile") is displayed with:
- "Edit your profile." heading.
- Read-only **User id** field showing the current user's ID.
- Editable **User name** field pre-filled with the current username.
- **OLD Password** field pre-filled with the current password.
- **NEW Password** field (empty).
- The red security warning about not using real passwords.
- Fields for **Icon**, **Homepage**, **Profile Color**, and **Private Snippet** (textarea).
- An **Update** button.

---

## Scenario 11 – Update the profile and return to the authenticated home page

**Goal:** Verify that submitting the profile update form redirects the user back to the authenticated home page.

**Preconditions:** The Profile page is displayed.

**Steps:**
1. Follow Scenario 10 to reach the Profile page.
2. Verify that the User name and OLD Password fields are pre-populated.
3. Leave all fields as-is (or optionally enter a value in the Homepage field).
4. Click **Update**.

**Expected result:** The authenticated home page is displayed, confirming the profile update was accepted. The authenticated navigation bar remains visible.

---

## Scenario 12 – Full end-to-end happy path: register, add snippet, view snippet, update profile, sign out

**Goal:** Verify the complete happy-path user journey from registration to sign-out.

**Preconditions:** None.

**Steps:**
1. Navigate to `https://google-gruyere.appspot.com/start`.
2. Click **Agree & Start** → anonymous home page is displayed.
3. Click **Sign up** → Sign Up page is displayed.
4. Enter username `toto` and password `toto`, then click **Create account** → Account Created confirmation is displayed.
5. Click **Home** → authenticated home page is displayed.
6. Click **New Snippet**, type `hello snippet`, click **Submit** → My Snippets page shows the new snippet.
7. Click **Home** → authenticated home page is displayed.
8. Click **My Snippets** → the snippet created in step 6 appears in the list.
9. Click **Home** → authenticated home page is displayed.
10. Click **Profile** → Profile page is displayed with pre-populated fields.
11. Click **Update** → authenticated home page is displayed.
12. Click **Sign out** → anonymous home page is displayed.

**Expected result:** Each step transitions to the correct page, data persists across navigation, and the final state is the anonymous home page (user is signed out).

---
