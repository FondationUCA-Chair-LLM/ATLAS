# Acceptance Test Scenarios — Sébastien Salva Academic Website
# URL: https://perso.limos.fr/~sesalva/

---

## TC-01: Home Page Loads with Biography and Navigation
**Goal:** Verify the home page displays the professor's biography, interests, education, and all navigation links.
**Preconditions:** Browser open, no prior navigation.
**Steps:**
1. Navigate to https://perso.limos.fr/~sesalva/
2. Verify the page title/header contains "Sébastien Salva"
3. Verify the navigation bar contains: Home, Research, Tools, Publications, Teaching, Projects, Contact
4. Verify the Biography section is visible with text mentioning "University of Auvergne"
5. Verify the "Interests" section is visible and contains "Software Engineering"
6. Verify the "Education" section is visible and contains "HDR"
**Expected Result:** Home page fully rendered with all sections and nav links visible.

---

## TC-02: Navigate from Home to Research Page
**Goal:** Verify clicking the "Research" nav link navigates to the Research page.
**Preconditions:** User is on the Home page.
**Steps:**
1. Navigate to https://perso.limos.fr/~sesalva/
2. Click the "Research" link in the navbar
3. Verify the URL contains "research" or the page heading reads "Research topics"
4. Verify the page contains "Data Quality" section
5. Verify the page contains "Model-based Testing" section
6. Verify the navbar "Home" link is visible for returning
**Expected Result:** Research page displayed with research topics including Data Quality and Model-based Testing sections.

---

## TC-03: Navigate from Home to Tools Page
**Goal:** Verify clicking the "Tools" nav link navigates to the Tools page.
**Preconditions:** User is on the Home page.
**Steps:**
1. Navigate to https://perso.limos.fr/~sesalva/
2. Click the "Tools" link in the navbar
3. Verify the page heading reads "Tools"
4. Verify the page subtitle reads "Tools related to project or publications"
5. Verify the section "Natural Language test case execution and agent evaluation" is visible
6. Verify the section "Restful API healing with LLMs" is visible
7. Verify the section "Event log to Conversations" is visible
**Expected Result:** Tools page displayed with all tool sections.

---

## TC-04: Navigate from Home to Publications Page
**Goal:** Verify clicking the "Publications" nav link navigates to the Publications page.
**Preconditions:** User is on the Home page.
**Steps:**
1. Navigate to https://perso.limos.fr/~sesalva/
2. Click the "Publications" link in the navbar
3. Verify the page heading reads "Publications"
4. Verify at least one publication entry is visible
5. Verify the first publication mentions "Sébastien Salva, Redha Taguelmimt (2026)"
6. Verify a search input field is visible
7. Verify the "Type" and "Date" filter dropdowns are present
**Expected Result:** Publications page with the list of publications and filter controls.

---

## TC-05: Navigate from Home to Teaching Page
**Goal:** Verify clicking the "Teaching" nav link navigates to the Teaching page.
**Preconditions:** User is on the Home page.
**Steps:**
1. Navigate to https://perso.limos.fr/~sesalva/
2. Click the "Teaching" link in the navbar
3. Verify the page heading reads "Teaching"
4. Verify the left sidebar contains "Cours software Engineering"
5. Verify the main content mentions "BUT 2A" and "BUT 3A"
6. Verify the "Cours PHP" link is visible in the sidebar
**Expected Result:** Teaching page with courses listed in sidebar and main content area.

---

## TC-06: Navigate from Research Page Back to Home
**Goal:** Verify the "Home" link on the Research page navigates back to the Home page.
**Preconditions:** User is on the Research page.
**Steps:**
1. Navigate to https://perso.limos.fr/~sesalva/
2. Click the "Research" link in the navbar
3. Verify the Research page is displayed
4. Click the "Home" link in the navbar
5. Verify the page contains the "Biography" section
6. Verify the profile name "Sébastien Salva" is visible
**Expected Result:** User is returned to the Home page.

---

## TC-07: Navigate from Publications to Publication Detail (NL Exec Paper)
**Goal:** Verify clicking the publication link opens the detail page for the NL Exec paper.
**Preconditions:** User is on the Publications page.
**Steps:**
1. Navigate to https://perso.limos.fr/~sesalva/
2. Click "Publications" in the navbar
3. Click the link "On the Soundness and Consistency of LLM Agents for Executing Test Cases Written in Natural Language"
4. Verify the publication detail page loads
5. Verify the title "On the Soundness and Consistency of LLM Agents for Executing Test Cases Written in Natural Language" is displayed
6. Verify the authors "Sébastien Salva, Redha Taguelmimt" are displayed
7. Verify the "Abstract" section is present
8. Verify the "PDF" and "Cite" buttons are visible
**Expected Result:** Publication detail page displays full title, authors, abstract, and action buttons.

---

## TC-08: Search for a Publication by Keyword
**Goal:** Verify the search/filter functionality on the Publications page filters results correctly.
**Preconditions:** User is on the Publications page.
**Steps:**
1. Navigate to https://perso.limos.fr/~sesalva/
2. Click "Publications" in the navbar
3. Type "On the Soundness" into the search input field
4. Verify only one publication is displayed in the results
5. Verify the displayed publication title contains "On the Soundness and Consistency of LLM Agents"
6. Verify the author "Sébastien Salva, Redha Taguelmimt" is shown
**Expected Result:** Search filters publications to show only the matching paper.

---

## TC-09: Navigate to Teaching — Software Engineering Course
**Goal:** Verify navigating to the "Cours software Engineering" sub-page from the Teaching page.
**Preconditions:** User is on the Teaching page.
**Steps:**
1. Navigate to https://perso.limos.fr/~sesalva/
2. Click "Teaching" in the navbar
3. Click "Cours software Engineering" in the left sidebar
4. Verify the page heading reads "Cours software Engineering"
5. Verify the subtitle "LP MI Applications Web" is present
6. Verify the "Cours" section contains "Le test du logiciel"
7. Verify the "TP" section contains "TP3 Selenium IDE"
**Expected Result:** Software Engineering course detail page is displayed with course and TD/TP links.

---

## TC-10: Navigate from Tools Page Back to Home
**Goal:** Verify the "Home" link on the Tools page navigates back to the Home page.
**Preconditions:** User is on the Tools page.
**Steps:**
1. Navigate to https://perso.limos.fr/~sesalva/
2. Click "Tools" in the navbar
3. Verify the Tools page is displayed
4. Click "Home" in the navbar
5. Verify the Biography section is visible
**Expected Result:** User navigates back to the Home page successfully.

---

## TC-11: Contact Form is Visible and Accepts Input
**Goal:** Verify the Contact section of the Home page renders the form with all fields and the Send button.
**Preconditions:** User is on the Home page (Contact section).
**Steps:**
1. Navigate to https://perso.limos.fr/~sesalva/
2. Scroll to the "Contact" section or click "Contact" in the navbar
3. Verify the "Name" input field is visible
4. Verify the "Email" input field is visible
5. Verify the "Message" textarea is visible
6. Verify the "Send" button is visible
7. Type "Test User" into the Name field
8. Type "test@example.com" into the Email field
9. Type "Hello, this is a test message." into the Message field
10. Verify the Send button is clickable (does not need to be submitted)
**Expected Result:** Contact form renders all fields, accepts text input, and displays the Send button.

---

## TC-12: Projects Section on Home Page — Inline Navigation Stays on Home
**Goal:** Verify clicking "Projects" in the navbar scrolls to the Projects section (stays on Home).
**Preconditions:** User is on the Home page.
**Steps:**
1. Navigate to https://perso.limos.fr/~sesalva/
2. Click "Projects" in the navbar
3. Verify the user remains on the Home/Projects page (same URL or anchor navigation)
4. Verify the "Projects" heading is visible
5. Verify the "All", "Security", "Model Learning", "Testing" filter tabs are visible
6. Verify the project "Industrial Chair on reliable and confident use of LLMs 25-29" is listed
**Expected Result:** Projects section is displayed with filter tabs and at least one project entry.

---

## TC-13: Navigate from Teaching Back to Home and Verify Full Round-Trip
**Goal:** Verify full navigation round-trip: Home → Teaching → Home.
**Preconditions:** Fresh browser session.
**Steps:**
1. Navigate to https://perso.limos.fr/~sesalva/
2. Verify the Home page is loaded (Biography visible)
3. Click "Teaching" in the navbar
4. Verify the Teaching page heading "Teaching" is visible
5. Verify the sidebar contains "Cours PHP"
6. Click "Home" in the navbar
7. Verify the Biography section is visible again
8. Verify the profile title "(Full) Professor" is visible
**Expected Result:** Navigation from Home to Teaching and back to Home works correctly, with all content present at each step.
