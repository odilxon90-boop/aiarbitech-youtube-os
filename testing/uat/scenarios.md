<<<<<<< HEAD
# UAT Test Scenarios — YouTube OS

Each scenario describes a real-world workflow a user would perform. Scenarios group related test cases in `cases.md`.

Priority: **P0** = Critical (must pass), **P1** = High, **P2** = Medium

---

## SCN-AUTH — Authentication

**Priority:** P0  
**Description:** Users authenticate securely and access is controlled by role.

### Scenarios

| ID | Scenario | Priority |
|---|---|---|
| SCN-AUTH-01 | User logs in with valid credentials | P0 |
| SCN-AUTH-02 | User login fails with invalid credentials | P0 |
| SCN-AUTH-03 | User is redirected to login when accessing protected route unauthenticated | P0 |
| SCN-AUTH-04 | Access token expires and is automatically refreshed | P0 |
| SCN-AUTH-05 | User logs out and session is invalidated | P0 |
| SCN-AUTH-06 | User with insufficient permissions is denied access to restricted routes | P0 |
| SCN-AUTH-07 | Rate limiting blocks repeated failed login attempts | P1 |
| SCN-AUTH-08 | User session persists across browser refresh | P1 |

**Business Value:** Authentication is the security gateway to all platform features. Any failure blocks all other testing and represents a critical security risk.

---

## SCN-DASH — Creator Dashboard

**Priority:** P0  
**Description:** Creators view their channel overview, recent metrics, and recommended actions.

### Scenarios

| ID | Scenario | Priority |
|---|---|---|
| SCN-DASH-01 | Dashboard loads within 500ms with channel summary data | P0 |
| SCN-DASH-02 | Dashboard displays correct subscriber count and recent views | P0 |
| SCN-DASH-03 | Dashboard shows trending content recommendations | P1 |
| SCN-DASH-04 | Dashboard reflects recently published video data | P1 |
| SCN-DASH-05 | Dashboard is accessible with keyboard navigation (a11y) | P2 |
| SCN-DASH-06 | Dashboard loads correctly after token refresh | P1 |

**Business Value:** The dashboard is the primary landing page for creators. Performance and accuracy directly affect creator trust.

---

## SCN-AI — AI Assistant

**Priority:** P0  
**Description:** Creators interact with the AI assistant to get content strategy recommendations and feedback.

### Scenarios

| ID | Scenario | Priority |
|---|---|---|
| SCN-AI-01 | AI assistant responds to a basic content idea prompt | P0 |
| SCN-AI-02 | AI assistant provides title and description suggestions | P0 |
| SCN-AI-03 | AI assistant handles empty or nonsensical input gracefully | P1 |
| SCN-AI-04 | AI assistant response time is under 3 seconds | P1 |
| SCN-AI-05 | AI assistant conversation history persists within session | P1 |
| SCN-AI-06 | AI assistant suggestions reflect user's genre and niche | P1 |

**Business Value:** AI assistance is a core differentiator. Creators rely on it for content strategy and ideation.

---

## SCN-ANALYTICS — Analytics

**Priority:** P0  
**Description:** Creators view performance data for their channel and videos.

### Scenarios

| ID | Scenario | Priority |
|---|---|---|
| SCN-ANALYTICS-01 | Analytics page loads with view counts, watch time, and revenue data | P0 |
| SCN-ANALYTICS-02 | Date range filter changes the data displayed correctly | P0 |
| SCN-ANALYTICS-03 | Charts render without errors | P0 |
| SCN-ANALYTICS-04 | Analytics data matches expected values from seeded test data | P0 |
| SCN-ANALYTICS-05 | Analytics updates after new video data is recorded | P1 |
| SCN-ANALYTICS-06 | Analytics page is accessible with no console errors | P2 |

**Business Value:** Analytics are the primary way creators measure success and make business decisions.

---

## SCN-GOALS — Goals

**Priority:** P1  
**Description:** Creators create, track, and update goals for their channel.

### Scenarios

| ID | Scenario | Priority |
|---|---|---|
| SCN-GOALS-01 | Creator creates a new subscriber growth goal | P1 |
| SCN-GOALS-02 | Creator views progress toward an active goal | P1 |
| SCN-GOALS-03 | Creator marks a completed goal as done | P1 |
| SCN-GOALS-04 | Creator deletes a goal | P1 |
| SCN-GOALS-05 | Goal progress is reflected correctly from analytics data | P1 |
| SCN-GOALS-06 | Goals persist across sessions | P1 |

**Business Value:** Goals drive creator engagement and retention by giving actionable targets.

---

## SCN-VIDEO — Video Studio

**Priority:** P0  
**Description:** Creators manage their video library, upload metadata, and review video performance.

### Scenarios

| ID | Scenario | Priority |
|---|---|---|
| SCN-VIDEO-01 | Creator views their video library with titles, thumbnails, and status | P0 |
| SCN-VIDEO-02 | Creator views detailed information for a specific video | P0 |
| SCN-VIDEO-03 | Creator creates a new video entry with title, description, and tags | P0 |
| SCN-VIDEO-04 | Creator updates video metadata | P1 |
| SCN-VIDEO-05 | Creator views video performance metrics | P1 |
| SCN-VIDEO-06 | Videos are displayed in correct chronological order | P1 |

**Business Value:** Video management is the operational core of the platform for content creators.

---

## SCN-MUSIC — Music Studio

**Priority:** P1  
**Description:** Creators browse and manage music tracks for their content.

### Scenarios

| ID | Scenario | Priority |
|---|---|---|
| SCN-MUSIC-01 | Creator browses available music tracks | P1 |
| SCN-MUSIC-02 | Creator searches for a track by name or genre | P1 |
| SCN-MUSIC-03 | Creator views track details and licensing information | P1 |
| SCN-MUSIC-04 | Creator adds a track to a favorites list | P2 |

**Business Value:** Music selection affects content quality and compliance (licensing).

---

## SCN-GENRE — Genre Recommendations

**Priority:** P1  
**Description:** Creators receive AI-powered genre and niche recommendations.

### Scenarios

| ID | Scenario | Priority |
|---|---|---|
| SCN-GENRE-01 | Creator views genre recommendations based on their channel data | P1 |
| SCN-GENRE-02 | Recommendations are specific to the creator's content niche | P1 |
| SCN-GENRE-03 | Creator can view details about a recommended genre | P1 |
| SCN-GENRE-04 | Genre recommendations load within 1 second (cached) | P1 |

**Business Value:** Genre recommendations help creators discover growth opportunities.

---

## SCN-ADMIN — Admin Functions

**Priority:** P0  
**Description:** Platform administrators manage users, channels, and review audit logs.

### Scenarios

| ID | Scenario | Priority |
|---|---|---|
| SCN-ADMIN-01 | Admin views the list of registered platform users | P0 |
| SCN-ADMIN-02 | Admin can suspend or activate a user account | P0 |
| SCN-ADMIN-03 | Admin views channel moderation queue | P0 |
| SCN-ADMIN-04 | Admin approves or rejects a flagged channel | P0 |
| SCN-ADMIN-05 | Audit log records admin actions with timestamps and actor | P0 |
| SCN-ADMIN-06 | Admin cannot access creator-only routes | P0 |
| SCN-ADMIN-07 | Creator cannot access admin-only routes | P0 |
| SCN-ADMIN-08 | Admin views platform health metrics | P1 |

**Business Value:** Admin functions are critical for compliance, security, and platform governance.

---

## SCN-PERF — Performance

**Priority:** P0  
**Description:** The platform meets response time and reliability targets under normal and peak load.

### Scenarios

| ID | Scenario | Priority |
|---|---|---|
| SCN-PERF-01 | Health check endpoint responds within 100ms | P0 |
| SCN-PERF-02 | Dashboard API responds within 500ms at p95 | P0 |
| SCN-PERF-03 | Analytics API responds within 500ms at p95 | P0 |
| SCN-PERF-04 | Genre API responds within 200ms from cache | P1 |
| SCN-PERF-05 | Platform sustains 50 concurrent users with < 1% error rate | P0 |
| SCN-PERF-06 | Platform recovers gracefully after a Redis cache miss | P1 |
| SCN-PERF-07 | Rate limiting returns 429 (not 500) on threshold breach | P1 |

**Business Value:** Performance directly affects creator productivity and platform perception at launch.
=======
# User Acceptance Test Scenarios

| ID | Scenario | User outcome | Priority |
| --- | --- | --- | --- |
| SCN-AUTH | Login, logout, token refresh, and permission enforcement | Authorized users securely access permitted functions. | P0 |
| SCN-DASH | Dashboard loading and data accuracy | Creators see a responsive, accurate summary. | P0 |
| SCN-AI | AI Assistant responses and edge cases | Users receive useful, safe responses for valid requests. | P0 |
| SCN-ANALYTICS | KPI cards, charts, and filtering | Users can understand and filter performance data. | P1 |
| SCN-GOALS | Goal creation, update, and deletion | Users manage goals without losing unrelated data. | P1 |
| SCN-VIDEO | Video library and metadata | Users can view and manage video records. | P1 |
| SCN-MUSIC | Music browsing, search, and licensing | Users can find licensable music and see licensing status. | P2 |
| SCN-GENRE | Genre recommendations and caching | Users receive relevant recommendations with repeatable performance. | P2 |
| SCN-ADMIN | User management and moderation | Administrators safely manage users and moderation actions. | P0 |
| SCN-PERF | Response time and load handling | Critical journeys remain responsive at the approved load. | P0 |
>>>>>>> 81fef7325c2bc9ed278736de444923623b49724f
