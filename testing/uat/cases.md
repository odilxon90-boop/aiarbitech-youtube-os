# UAT Test Cases — YouTube OS

Test cases map to scenarios in `scenarios.md`. Each case includes preconditions, steps, expected results, and pass/fail criteria.

**Status values:** `PASS` | `FAIL` | `BLOCKED` | `NOT RUN`

---

## Authentication Test Cases (SCN-AUTH)

---

### TC-AUTH-01 — Successful Login

**Scenario:** SCN-AUTH-01  
**Priority:** P0  
**Tester:** _______________  
**Date:** _______________  
**Status:** `NOT RUN`

**Preconditions:**
- Test user account exists with known credentials
- Login page is accessible

**Steps:**
1. Navigate to the platform login page
2. Enter a valid username/email
3. Enter the correct password
4. Click "Sign In"

**Expected Result:**
- User is redirected to the creator dashboard
- User's name/avatar appears in the navigation bar
- A valid session token is stored
- No error message displayed

**Actual Result:** _______________

**Pass Criteria:** Redirect to dashboard; authenticated state visible in UI

---

### TC-AUTH-02 — Failed Login with Invalid Credentials

**Scenario:** SCN-AUTH-02  
**Priority:** P0  
**Tester:** _______________  
**Date:** _______________  
**Status:** `NOT RUN`

**Preconditions:**
- Login page is accessible

**Steps:**
1. Navigate to the platform login page
2. Enter a valid username
3. Enter an **incorrect** password
4. Click "Sign In"

**Expected Result:**
- Error message displayed: "Invalid credentials" or similar
- User remains on the login page
- No session token created
- HTTP 401 returned from auth endpoint

**Actual Result:** _______________

**Pass Criteria:** No session created; error message shown; HTTP 401 from API

---

### TC-AUTH-03 — Redirect to Login for Unauthenticated Access

**Scenario:** SCN-AUTH-03  
**Priority:** P0  
**Tester:** _______________  
**Date:** _______________  
**Status:** `NOT RUN`

**Preconditions:**
- User is not logged in (clear session/cookies)

**Steps:**
1. Navigate directly to `/dashboard` (or any protected route)

**Expected Result:**
- User is redirected to the login page
- Original destination URL is preserved in redirect parameter (e.g., `?redirect=/dashboard`)
- HTTP 401 returned from any protected API calls

**Actual Result:** _______________

**Pass Criteria:** Redirect to login page; no protected content visible

---

### TC-AUTH-04 — Token Refresh

**Scenario:** SCN-AUTH-04  
**Priority:** P0  
**Tester:** _______________  
**Date:** _______________  
**Status:** `NOT RUN`

**Preconditions:**
- User is logged in
- Access token is near or past expiration (manipulate expiry in test environment if needed)

**Steps:**
1. Perform any authenticated API action (e.g., load dashboard)
2. Observe network requests in browser dev tools

**Expected Result:**
- A token refresh request is made automatically
- New access token is stored
- The original API request succeeds (no user-visible error)
- User is NOT redirected to login

**Actual Result:** _______________

**Pass Criteria:** Seamless continuation of session; new token issued

---

### TC-AUTH-05 — Logout

**Scenario:** SCN-AUTH-05  
**Priority:** P0  
**Tester:** _______________  
**Date:** _______________  
**Status:** `NOT RUN`

**Preconditions:**
- User is logged in

**Steps:**
1. Click the logout button in the navigation
2. After logout, attempt to navigate to `/dashboard`

**Expected Result:**
- User is redirected to the login page
- Session token is cleared from browser storage
- Subsequent API calls with old token return HTTP 401

**Actual Result:** _______________

**Pass Criteria:** Session fully invalidated; no access with old token

---

### TC-AUTH-06 — Permission Enforcement

**Scenario:** SCN-AUTH-06  
**Priority:** P0  
**Tester:** _______________  
**Date:** _______________  
**Status:** `NOT RUN`

**Preconditions:**
- Creator account (non-admin) is logged in

**Steps:**
1. Attempt to access `/admin` or admin-only API endpoints
2. Record HTTP response

**Expected Result:**
- HTTP 403 Forbidden returned
- No admin data is visible
- Error message indicates insufficient permissions

**Actual Result:** _______________

**Pass Criteria:** HTTP 403; no unauthorized data exposed

---

## Dashboard Test Cases (SCN-DASH)

---

### TC-DASH-01 — Dashboard Loads with Data

**Scenario:** SCN-DASH-01  
**Priority:** P0  
**Tester:** _______________  
**Date:** _______________  
**Status:** `NOT RUN`

**Preconditions:**
- Creator is logged in
- Test account has seeded channel data (subscribers, views)

**Steps:**
1. Navigate to the creator dashboard

**Expected Result:**
- Dashboard renders within 500ms (measure via browser dev tools Network tab)
- Subscriber count visible and matches seeded test data value
- Recent view count visible
- No loading spinners stuck indefinitely

**Actual Result:** _______________

**Pass Criteria:** Load time < 500ms; data displayed and correct

---

### TC-DASH-02 — Dashboard Data Accuracy

**Scenario:** SCN-DASH-02  
**Priority:** P0  
**Tester:** _______________  
**Date:** _______________  
**Status:** `NOT RUN`

**Preconditions:**
- Test account has known seeded data values

**Steps:**
1. Load dashboard
2. Compare displayed subscriber count and recent view count to expected test values

**Expected Result:**
- Subscriber count matches expected value (e.g., 1,250 subscribers)
- Recent view count matches expected value (e.g., 4,500 views this week)

**Actual Result:** _______________  
**Expected Values:** Subscribers: ___, Views: ___  
**Actual Values:** Subscribers: ___, Views: ___

**Pass Criteria:** Values match expected test data within ±1% (rounding tolerance)

---

## AI Assistant Test Cases (SCN-AI)

---

### TC-AI-01 — AI Assistant Basic Response

**Scenario:** SCN-AI-01  
**Priority:** P0  
**Tester:** _______________  
**Date:** _______________  
**Status:** `NOT RUN`

**Preconditions:**
- Creator is logged in
- AI Assistant page is accessible

**Steps:**
1. Navigate to the AI Assistant
2. Type: "What type of content should I create this week?"
3. Submit the prompt

**Expected Result:**
- Response is received within 3 seconds
- Response is relevant to the prompt (content suggestions)
- Response is coherent English text
- No error message displayed

**Actual Result:** _______________

**Pass Criteria:** Relevant response within 3 seconds; no errors

---

### TC-AI-02 — AI Assistant Invalid Input

**Scenario:** SCN-AI-03  
**Priority:** P1  
**Tester:** _______________  
**Date:** _______________  
**Status:** `NOT RUN`

**Preconditions:**
- AI Assistant page is accessible

**Steps:**
1. Submit an empty message
2. Submit a message with only special characters: `!@#$%^&*()`

**Expected Result:**
- Empty submission: either button is disabled or a validation message is shown
- Special character input: handled gracefully (either rejected with a friendly message or AI responds meaningfully)
- No server 500 error

**Actual Result:** _______________

**Pass Criteria:** No 500 errors; user receives feedback for invalid input

---

## Analytics Test Cases (SCN-ANALYTICS)

---

### TC-ANALYTICS-01 — Analytics Page Loads

**Scenario:** SCN-ANALYTICS-01  
**Priority:** P0  
**Tester:** _______________  
**Date:** _______________  
**Status:** `NOT RUN`

**Preconditions:**
- Creator is logged in
- Test account has seeded analytics data

**Steps:**
1. Navigate to the Analytics page

**Expected Result:**
- Page loads without errors
- View count, watch time, and revenue figures are visible
- Charts render (no blank chart areas)
- Page loads within 500ms

**Actual Result:** _______________

**Pass Criteria:** All data sections visible; charts rendered; no console errors

---

### TC-ANALYTICS-02 — Date Range Filter

**Scenario:** SCN-ANALYTICS-02  
**Priority:** P0  
**Tester:** _______________  
**Date:** _______________  
**Status:** `NOT RUN`

**Preconditions:**
- Test account has seeded analytics data spanning multiple date ranges

**Steps:**
1. Load the Analytics page (default range, e.g., last 28 days)
2. Note the total view count
3. Change date range to "Last 7 days"
4. Note the new total view count

**Expected Result:**
- View count changes when date range changes
- Shorter range shows equal or lower values than longer range
- No page reload required (dynamic update)

**Actual Result:** _______________

**Pass Criteria:** Data changes on filter; values consistent with expected ranges

---

## Goals Test Cases (SCN-GOALS)

---

### TC-GOALS-01 — Create Goal

**Scenario:** SCN-GOALS-01  
**Priority:** P1  
**Tester:** _______________  
**Date:** _______________  
**Status:** `NOT RUN`

**Preconditions:**
- Creator is logged in

**Steps:**
1. Navigate to the Goals page
2. Click "Create New Goal"
3. Enter title: "Reach 10,000 subscribers"
4. Set target value: 10000
5. Set target date: 90 days from today
6. Save the goal

**Expected Result:**
- Goal appears in the goals list
- Title, target value, and date are displayed correctly
- Goal shows 0% progress initially (or current subscriber count progress)

**Actual Result:** _______________

**Pass Criteria:** Goal saved and displayed; correct attributes shown

---

### TC-GOALS-02 — Delete Goal

**Scenario:** SCN-GOALS-04  
**Priority:** P1  
**Tester:** _______________  
**Date:** _______________  
**Status:** `NOT RUN`

**Preconditions:**
- At least one goal exists

**Steps:**
1. Navigate to the Goals page
2. Click delete on an existing goal
3. Confirm deletion when prompted

**Expected Result:**
- Goal is removed from the list
- Confirmation dialog shown before deletion
- No other goals are affected

**Actual Result:** _______________

**Pass Criteria:** Goal deleted; list updates; confirmation shown

---

## Video Studio Test Cases (SCN-VIDEO)

---

### TC-VIDEO-01 — Video Library Loads

**Scenario:** SCN-VIDEO-01  
**Priority:** P0  
**Tester:** _______________  
**Date:** _______________  
**Status:** `NOT RUN`

**Preconditions:**
- Creator is logged in
- Test account has seeded video entries

**Steps:**
1. Navigate to Video Studio

**Expected Result:**
- Video list is displayed with titles and status labels
- Videos are sorted by most recent first
- Page loads within 500ms

**Actual Result:** _______________

**Pass Criteria:** Video list visible; sorted correctly; loads within 500ms

---

### TC-VIDEO-02 — Create Video Entry

**Scenario:** SCN-VIDEO-03  
**Priority:** P0  
**Tester:** _______________  
**Date:** _______________  
**Status:** `NOT RUN`

**Preconditions:**
- Creator is logged in

**Steps:**
1. Navigate to Video Studio
2. Click "New Video"
3. Enter title: "Test Video Entry UAT-001"
4. Enter description: "UAT test video"
5. Add tags: "uat, testing"
6. Save

**Expected Result:**
- New video entry appears in the video list
- Title and description are correct
- Video ID is generated
- HTTP 201 returned from API

**Actual Result:** _______________

**Pass Criteria:** Entry created; appears in list; HTTP 201

---

## Admin Test Cases (SCN-ADMIN)

---

### TC-ADMIN-01 — Admin Views User List

**Scenario:** SCN-ADMIN-01  
**Priority:** P0  
**Tester:** _______________  
**Date:** _______________  
**Status:** `NOT RUN`

**Preconditions:**
- Admin account is logged in

**Steps:**
1. Navigate to Admin → User Management

**Expected Result:**
- List of registered users is displayed
- Each row shows: user ID, email, role, status, registration date
- Pagination works (if > 20 users)

**Actual Result:** _______________

**Pass Criteria:** User list displayed; data complete; pagination functional

---

### TC-ADMIN-02 — Admin Suspends User

**Scenario:** SCN-ADMIN-02  
**Priority:** P0  
**Tester:** _______________  
**Date:** _______________  
**Status:** `NOT RUN`

**Preconditions:**
- Admin is logged in
- At least one active test user exists

**Steps:**
1. Navigate to Admin → User Management
2. Locate the test user
3. Click "Suspend Account"
4. Confirm the action
5. Log out as admin
6. Attempt to log in as the suspended user

**Expected Result:**
- User status changes to "Suspended" in admin view
- Suspended user cannot log in (receives appropriate error)
- Action is recorded in the audit log

**Actual Result:** _______________

**Pass Criteria:** User suspended; login blocked; audit log entry created

---

### TC-ADMIN-03 — Audit Log Records Admin Actions

**Scenario:** SCN-ADMIN-05  
**Priority:** P0  
**Tester:** _______________  
**Date:** _______________  
**Status:** `NOT RUN`

**Preconditions:**
- Admin is logged in

**Steps:**
1. Perform any admin action (e.g., suspend/activate user, approve/reject channel)
2. Navigate to Admin → Audit Log

**Expected Result:**
- Audit log shows a new entry for the action just performed
- Entry includes: timestamp, actor (admin user ID), action type, affected resource
- Log entries are read-only (no edit/delete button)

**Actual Result:** _______________

**Pass Criteria:** Entry created with correct actor, action, timestamp

---

### TC-ADMIN-04 — Role Isolation: Creator Cannot Access Admin

**Scenario:** SCN-ADMIN-07  
**Priority:** P0  
**Tester:** _______________  
**Date:** _______________  
**Status:** `NOT RUN`

**Preconditions:**
- Creator (non-admin) is logged in

**Steps:**
1. Navigate directly to `/admin`
2. Call admin API endpoints directly (e.g., `GET /api/v1/admin/users`)

**Expected Result:**
- UI: Redirect to dashboard or access denied page
- API: HTTP 403 Forbidden
- No admin data is exposed

**Actual Result:** _______________

**Pass Criteria:** HTTP 403 from API; no admin UI accessible

---

## Performance Test Cases (SCN-PERF)

---

### TC-PERF-01 — Health Check Response Time

**Scenario:** SCN-PERF-01  
**Priority:** P0  
**Tester:** _______________  
**Date:** _______________  
**Status:** `NOT RUN`

**Preconditions:**
- Backend is running in staging

**Steps:**
1. Run: `curl -w "\nTime: %{time_total}s\n" http://staging-api.youtube-os.aiarbitech.com/api/v1/health`
2. Repeat 10 times

**Expected Result:**
- All 10 responses return HTTP 200
- All response times < 100ms

**Actual Result:** _______________  
**Response times:** ___, ___, ___, ___, ___, ___, ___, ___, ___, ___

**Pass Criteria:** 100% HTTP 200; all < 100ms

---

### TC-PERF-02 — Dashboard API Response Time (p95)

**Scenario:** SCN-PERF-02  
**Priority:** P0  
**Tester:** _______________  
**Date:** _______________  
**Status:** `NOT RUN`

**Preconditions:**
- Backend running; 5 concurrent test users logged in

**Steps:**
1. Open browser dev tools Network tab on the dashboard page
2. Hard refresh (`Ctrl+Shift+R`) to bypass browser cache
3. Record response time for the dashboard API call
4. Repeat for 5 different test accounts
5. Calculate p95 response time

**Expected Result:**
- p95 response time < 500ms
- No requests returning 5xx errors

**Actual Result:** _______________  
**Recorded times (ms):** ___, ___, ___, ___, ___  
**p95:** ___ms

**Pass Criteria:** p95 < 500ms; 0 server errors

---

### TC-PERF-03 — Concurrent User Load Test

**Scenario:** SCN-PERF-05  
**Priority:** P0  
**Tester:** _______________  
**Date:** _______________  
**Status:** `NOT RUN`

**Preconditions:**
- k6 installed
- Staging environment running
- `load-test/script.js` available

**Steps:**
1. Run the load test at 50 concurrent users (load scenario):
   ```bash
   k6 run --env SCENARIO=load load-test/script.js
   ```
2. Observe the output: request rate, error rate, p95 latency

**Expected Result:**
- Error rate < 1%
- p95 response time < 500ms
- No service crashes or restarts

**Actual Result:** _______________  
**Error rate:** ___%  
**p95 latency:** ___ms  
**Total requests:** ___

**Pass Criteria:** Error rate < 1%; p95 < 500ms; service stable throughout

---

### TC-PERF-04 — Rate Limiting Behavior

**Scenario:** SCN-PERF-07  
**Priority:** P1  
**Tester:** _______________  
**Date:** _______________  
**Status:** `NOT RUN`

**Preconditions:**
- Backend running

**Steps:**
1. Send >100 requests to the same endpoint within 1 minute:
   ```bash
   for i in $(seq 1 110); do curl -s -o /dev/null -w "%{http_code}\n" http://staging-api/api/v1/health; done
   ```
2. Observe HTTP status codes

**Expected Result:**
- First ~100 requests return HTTP 200
- Subsequent requests return HTTP 429 (Too Many Requests)
- No HTTP 500 errors

**Actual Result:** _______________

**Pass Criteria:** HTTP 429 returned (not 500) when rate limit exceeded

---

## Test Summary Table

| Test Case ID | Scenario | Priority | Tester | Status | Notes |
|---|---|---|---|---|---|
| TC-AUTH-01 | Login success | P0 | | NOT RUN | |
| TC-AUTH-02 | Login failure | P0 | | NOT RUN | |
| TC-AUTH-03 | Redirect unauthenticated | P0 | | NOT RUN | |
| TC-AUTH-04 | Token refresh | P0 | | NOT RUN | |
| TC-AUTH-05 | Logout | P0 | | NOT RUN | |
| TC-AUTH-06 | Permission enforcement | P0 | | NOT RUN | |
| TC-DASH-01 | Dashboard loads | P0 | | NOT RUN | |
| TC-DASH-02 | Dashboard data accuracy | P0 | | NOT RUN | |
| TC-AI-01 | AI basic response | P0 | | NOT RUN | |
| TC-AI-02 | AI invalid input | P1 | | NOT RUN | |
| TC-ANALYTICS-01 | Analytics page loads | P0 | | NOT RUN | |
| TC-ANALYTICS-02 | Date range filter | P0 | | NOT RUN | |
| TC-GOALS-01 | Create goal | P1 | | NOT RUN | |
| TC-GOALS-02 | Delete goal | P1 | | NOT RUN | |
| TC-VIDEO-01 | Video library loads | P0 | | NOT RUN | |
| TC-VIDEO-02 | Create video entry | P0 | | NOT RUN | |
| TC-ADMIN-01 | Admin user list | P0 | | NOT RUN | |
| TC-ADMIN-02 | Admin suspend user | P0 | | NOT RUN | |
| TC-ADMIN-03 | Audit log | P0 | | NOT RUN | |
| TC-ADMIN-04 | Role isolation | P0 | | NOT RUN | |
| TC-PERF-01 | Health check < 100ms | P0 | | NOT RUN | |
| TC-PERF-02 | Dashboard p95 < 500ms | P0 | | NOT RUN | |
| TC-PERF-03 | 50 concurrent users | P0 | | NOT RUN | |
| TC-PERF-04 | Rate limiting behavior | P1 | | NOT RUN | |
