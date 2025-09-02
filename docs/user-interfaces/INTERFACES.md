# School Management System Interfaces

This document lists all the interfaces (use cases) extracted from the use case diagram, organized by functional areas and actors.

SCOPE: The statuses below reflect only the clickable prototype (static/front-end screens, navigation, modals, placeholder interactions). They do NOT imply any backend, persistence, security, real-time messaging, or logging implementation.

## Prototype Coverage Legend

- [x] Present: Screen or modal exists and affords the core interaction in the prototype.
- [~] Partial: UI element(s) exist but the flow is incomplete or only a placeholder link/button.
- [ ] Missing: No corresponding screen / interactive element yet.

High-level prototype summary: All role dashboards now share a consistent layout (sidebar, header actions, notification + activity log buttons, logout confirmation) via `layout-standardize.js`. Most CRUD and reporting UIs are present with static/sample data: messaging inbox (threads, compose, filters), global notifications off‑canvas + centralized toast/confirm utilities, exam score editing modal (bulk save, mark absent, publish), performance reports (teacher & admin) with filters/charts/per‑student breakdown, student results enhancements (recorrection request modal, GPA breakdown + recompute action), student attendance analytics (filters, summary/detail modal, export), teacher gradebook (filters, inline edit modal, weighting settings, analytics charts, CSV export), teacher enrollment report (class totals & movements), enhanced admin system monitor (mock charts / tables / progress cards), and global activity log off‑canvas + logging helper. Secondary pages (student assessments/exams, teacher manage assessments) now also include standardized notification & activity log controls, empty‑state markers, and logging calls.

Recent UI alignment (Sept 2025): Admin, Principal, and Sectional Head dashboards refactored to match Student/Teacher layout patterns. Added unified header actions (notification bell, activity log, role menu dropdown), responsive table wrapper (`.table-fluid-wrapper`), standardized form panels (`.form-section`), announcement list styling, and improved accessibility focus outlines. Minor CSS utilities introduced (`.hidden`, `.page-header-actions`, metric card helpers) without altering existing interactions.

Remaining major prototype gaps (UI only – backend intentionally absent):
1. Deeper cross‑link navigation (contextual deep links between lists, reports, and detail modals still minimal) – partial heuristics added for notification deep links.
2. Additional status badge retrofit for any yet untouched legacy static tables (most core tables updated). 
3. Broader accessibility polish (focus trapping refinement, high contrast theme variant, keyboard shortcuts for off‑canvas toggle).
4. Profile enrichment beyond current activity/performance tabs (e.g., comparative analytics across terms, teacher workload forecasting).
5. Real persistence / API integration (all data remains session‑only, in‑memory).

## Actors

- **User (U)**: Generic actor representing any user of the system.
- **Student (S)**: Can view educational information, submit assessments, view exam results, and apply for recorrections.
- **Teacher (T)**: Can manage student information, create/edit assessments, mark submissions, and manage exam information.
- **Sectional Head (SH)**: Can manage staff members, create/update time tables, and oversee sectional information.
- **Principal (P)**: Can broadcast announcements and oversee school functioning.
- **Administrator (A)**: Can manage user information, monitor system performance, and generate reports.

## Use Cases and Interfaces

### User Management (All Users)

- [x] **Login**
  - Actor: User
  - Description: Users log in to the system.
  - Includes: Validate User, Update User Log
  - Prototype Notes: `index.html` + `auth.js` form with role-based redirection (sufficient for navigation demonstration).

- [x] **View User Profile**
  - Actor: User
  - Description: Users view their profiles.
  - Extends: Update User Profile (edit modals for all roles; no persistence)
    - Includes: Update User Log (not implemented)
  - Prototype Notes: Profile pages now exist for student, teacher, sectional head, principal, and admin with basic edit modals (in‑memory only) and role‑specific tabs.

- [x] **Logout**
  - Actor: User
  - Description: Users log out of the system.
  - Includes: Confirm, Update User Log
  - Prototype Notes: Logout links now use a confirmation modal (`UIUtils.confirm` via `layout-standardize.js`).

- [x] **Communication**
  - Actor: User
  - Description: Users communicate with others.
  - Extends: Send Messages
    - Includes: Update User Log
  - Prototype Notes: Full messaging inbox (`messages.html`) with threads list (unread/starred filters), search, compose modal, per-thread view & reply, delete with reusable confirm modal, star toggling, and toast notifications. Global notifications off‑canvas implemented.

### Attendance Management

- [x] **Enter the Attendance Daily**
  - Actor: User (Teachers primarily)
  - Description: Users enter daily attendance.
  - Includes: Verify Using Fingerprint (not implemented), Update User Log (not implemented)
  - Prototype Notes: Teacher attendance management (table + modal) present. Fingerprint verification not represented.

- [x] **View Personal Attendance**
  - Actor: Student
  - Description: Students view their own attendance records and summary analytics.
  - Extends: View Attendance Summary (progress bars by subject, monthly stats)
  - Includes: Export Attendance (CSV mock)
  - Prototype Notes: New `attendance.html` (student) with month/subject/status filters, table vs summary toggle, detail modal, mock data generation & CSV export.

### Educational Information Management (Students)

- [x] **View Educational Information**
  - Actor: Student
  - Description: Students view educational information (shows option to create if empty).
  - Extends: Submit Assessments (submission modal UI exists -> `assessments.html` / `assessments.js`; no backend, no create-if-empty logic)
    - Includes: Update Educational Information (not implemented)
  - Extends: View Assessments (implemented UI list with filters)
    - Includes: View Submission Marks (partial: some cards show submitted status; detailed marks view limited)
  - Prototype Notes: Cards, filters, submission modal present with sample content.

- [x] **View Exams Information**
  - Actor: Student
  - Description: Students view exam information (shows option to create if empty).
  - Extends: View Exams (UI: `exams.html` + `exams.js` schedule & details modal)
  - Extends: View Exam Results (results & charts via `results.html` + `results.js`)
    - Extends: Apply for Recorrections (UI modal implemented: reason, file upload, confirm; no backend)
    - Extends: Calculate GPA (Dynamic recompute trigger + explanation modal; underlying math still mock)
  - Prototype Notes: Exam schedule, performance charts, result detail modals, recorrection request flow & GPA breakdown modal now present. GPA and recorrection submissions remain in-memory only.

### Student Information Management (Teachers)

- [x] **View Student Information**
  - Actor: Teacher
  - Description: Teachers view student information (shows option to create if empty).
  - Extends: Create Student Information (modal form adds to in-memory list)
    - Includes: Update Student Information (no persistence layer)
  - Extends: Delete Student Information (UI delete with confirmation)
    - Includes: Update Student Information
  - Extends: Generate Student Attendance Reports (per‑student placeholder buttons -> inline alert in off‑canvas)
    - Includes: Update Student Information
  - Extends: Generate Student Performance Reports (per‑student placeholder buttons -> inline alert; dedicated performance-report page for teachers still empty)
    - Includes: Update Student Information
  - Extends: Generate Enrollment Reports (separate enrollment report page present – partial linkage)
  - Prototype Notes: `students.html` implements list (list/grid toggle), empty state, CRUD modal, detail off‑canvas. Enrollment metrics now available via `enrollment-report.html`; not yet context-linked (e.g., per-class quick jump) and still in-memory only.

### Assessment Management (Teachers)

- [x] **View Educational Information**
  - Actor: Teacher
  - Description: Teachers view educational information (shows option to create if empty).
  - Extends: Create Assessments (UI modal + mock create in `manage-assessments.html` / `manage-assessments.js`)
    - Includes: Update Educational Information (not implemented)
  - Extends: Edit Assessments (reuse create modal; no data loading)
    - Includes: Update Educational Information
  - Extends: Delete Assessments (row removal only)
    - Includes: Update Educational Information
  - Prototype Notes: Listing + create/edit/delete/grade entry points visually represented.

- [x] **View Student Submissions**
  - Actor: Teacher
  - Description: Teachers view student submissions (shows option to create if empty).
  - Extends: Mark Student Submissions (submission management & grading UI present; no persistence)
    - Includes: Update Educational Information (not implemented)
  - Prototype Notes: Dedicated marking & report modal present.

### Exam & Grade Management (Teachers)

- [x] **View Exam Information**
  - Actor: Teacher
  - Description: Teachers view exam information (shows option to create if empty).
  - Extends: Create Exams (schedule modal UI)
    - Includes: Update Exam Information (not implemented)
  - Extends: Update Exams (edit reuses create modal; no data binding)
    - Includes: Update Exam Information
  - Extends: Delete Exams (row removal only)
    - Includes: Update Exam Information
  - Extends: Edit Exam Results (results listing + score editing modal with per‑student save, bulk save, mark all absent, finalize publish simulation)
    - Includes: Update Exam Information
  - Prototype Notes: Exam list/calendar and create/edit modals present; score editing modal now implemented (in‑memory only) enabling per‑student updates, bulk operations, absent marking, and finalize step.

- [x] **View & Manage Gradebook**
  - Actor: Teacher
  - Description: Teachers review and edit grades across assessments and exams.
  - Extends: Edit Grades (inline modal edit per record)
  - Extends: Configure Weighting (assessment vs exam weighting modal)
  - Includes: Export Grades (CSV mock)
  - Prototype Notes: New `grades.html` + `teacher-grades.js` with filters (class/subject/type/status/student), summary cards, grade table, analytics (distribution + trend charts), weighting modal, edit modal, CSV export.

### Staff Management (Sectional Heads)

- [x] **View Staff Information**
  - Actor: Sectional Head
  - Description: Sectional heads view staff information (shows option to create if empty).
  - Extends: Add Staff Members (UI form adds to local array)
    - Includes: Notify Teachers (not implemented)
  - Extends: Update Staff Members (UI form edits local array)
    - Includes: Notify Teachers (not implemented)
  - Extends: Remove Staff Members (UI removal only)
    - Includes: Notify Teachers (not implemented)
  - Prototype Notes: Staff CRUD forms exist; stray React snippet removed for consistency.

- [x] **View Sectional Information**
  - Actor: Sectional Head
  - Description: Sectional heads view sectional information (shows option to create if empty).
  - Extends: Create Time Tables (UI form in `timetable-management.html` local state)
    - Includes: Notify Teachers (not implemented)
  - Extends: Update Time Tables (UI edit)
    - Includes: Notify Teachers
  - Extends: Delete Time Tables (UI delete)
    - Includes: Notify Teachers
  - Prototype Notes: Timetable CRUD present; navigation/linkage to staff screen not shown.

### Principal Features

- [x] **Broadcast Announcements**
  - Actor: Principal
  - Description: Principals broadcast announcements.
  - Includes: Select Users (audience dropdown present)
    - Extends: Notify Users (not implemented)
    - Extends: Notify Sectional Heads (not implemented)
  - Prototype Notes: Form & list present; update/cancel buttons visually duplicate without differentiated behavior.

- [x] **View School Performance Reports**
  - Actor: Principal
  - Description: Principal reviews cross-class performance, attendance, and discipline summaries (KPIs, trend, distribution, class breakdown).
  - Extends: Generate Academic Performance Overview (mock charts + KPI cards)
    - Includes: Export Reports (CSV mock)
    - Includes: Refresh Data (in‑memory regenerate)
  - Prototype Notes: New `reports.html` (principal) with filters (term, view, class, metric), KPI cards, line & doughnut charts (Chart.js), breakdown table toggle, export & refresh actions, integrated logging & notifications.

### Administrator Features

- [x] **View User Information**
  - Actor: Administrator
  - Description: Administrators view user information (shows option to create if empty).
  - Extends: Add User (UI form adds to local array)
    - Includes: Update User Logs (not implemented)
  - Extends: Update User (UI form edits local array)
    - Includes: Update User Logs (not implemented)
  - Extends: Delete User (UI delete only)
    - Includes: Update User Logs (not implemented)
  - Prototype Notes: User list & CRUD forms present; duplicate element IDs and redundant action buttons.

- [x] **View System Monitor**
  - Actor: Administrator
  - Description: Administrators view system monitor (shows option to create if empty).
  - Extends: Generate User Engagement Reports (placeholder -> mock card/table output)
    - Includes: Notify Principals (not implemented)
  - Extends: Generate Performance Reports (mock visualizations)
    - Includes: Notify Principals
  - Extends: Generate System Utilization Reports (mock charts/progress)
    - Includes: Notify Principals
  - Extends: Generate Content Popularity Reports (mock tables)
    - Includes: Notify Principals
  - Extends: Generate Monthly Attendance Reports (mock tables)
    - Includes: Notify Principals
  - Prototype Notes: Now includes sample chart/table placeholders; still in‑memory and non‑interactive beyond expansion.

### Notification Interfaces

- [x] **Notify Users**
  - Actor: System
  - Description: System notifies users of updates.
  - Status Notes: Off‑canvas notification center now supports role‑scoped audience arrays, search, audience filter, and minimal deep‑link routing (prototype).

- [x] **Notify Teachers**
  - Actor: System
  - Description: System notifies teachers of changes (e.g., staff or time table updates).
  - Status Notes: Targeted notifications can specify teacher audience; activity log categorization present.

- [x] **Notify Sectional Heads**
  - Actor: System
  - Description: System notifies sectional heads.
  - Status Notes: Audience filtering includes sectional-head; seeded & broadcast examples route correctly.

- [x] **Notify Principals**
  - Actor: System
  - Description: System notifies principals of reports.
  - Status Notes: Broadcast announcements create targeted notifications; role filter surfaces principal-only events.

### Update Interfaces

- [x] **Update Student Information**
  - Actor: System
  - Description: Updates student records.
  - Status Notes: CRUD UI mutates in-memory list; central DataService available for future consolidation (not yet wired to student pages).

- [x] **Update Educational Information**
  - Actor: System
  - Description: Updates educational content and assessments.
  - Status Notes: Assessment CRUD in-memory; shared service layer scaffold present (DataService) – migration pending.

- [x] **Update Exam Information**
  - Actor: System
  - Description: Updates exam data.
  - Status Notes: Score editing modal + scheduling; notifications now can be targeted (hook integration pending for exam events).

- [x] **Update User Log**
  - Actor: System
  - Description: Logs user activities.
  - Status Notes: Enhanced log now supports pagination, search, export, expanded categories, accessibility roles.

- [x] **Update User Logs**
  - Actor: System
  - Description: Alternative logging interface for administrators.
  - Status Notes: Unified log with export & filtering replaces prior gap; future admin-specific views optional.

## Prototype Gaps & Next UI Steps (Updated)

1. (DONE) Messaging/inbox UI (threads, compose, filters) integrated via quick action.
2. (DONE) Global notifications off‑canvas (mock data + add/clear actions).
3. (DONE) Exam result editing / score entry modal (bulk save, finalize, mark absent) for teachers.
4. (DONE) Enrollment reports & analytics pages (teacher + admin performance/system report refactor).
5. (DONE) Teacher performance report with charts & breakdown.
6. (DONE) Standardized layout across role dashboards.
7. (DONE) Reusable confirmation modal utility.
8. (DONE) Empty-state auto rendering.
9. (DONE) Status badge utility + role/state extension.
10. (DONE) System monitor report mock enhancements.
11. (DONE) Centralized toast/notification utility.
12. (DONE) Notification center triggers & activity buttons unified.
13. (DONE) Activity log off‑canvas + logging helper.
14. (DONE) Role‑scoped notifications & audience filters.
15. (DONE) Centralized in‑memory DataService (notifications + activity pub/sub).
16. (DONE) Advanced audit log features (pagination, search, export, richer categories, accessibility roles).
17. (PARTIAL) Basic deep-link heuristics for notifications (further cross‑page context links pending).

Unified Change Log (recent highlights):
• Standardized admin, principal, sectional head dashboards (header actions, profile dropdown, responsive tables, form-section & announcement styling).
• Added accessibility focus outlines and utility classes (`.hidden`, `.table-fluid-wrapper`, `.page-header-actions`).
• Added centralized DataService with role-scoped notifications & pub/sub.
• Upgraded notification center (audience filter, search, deep-link heuristics).
• Enhanced activity log (pagination, search, CSV export, expanded categories, accessibility labels).
• Extended status badges to include roles & system states; applied to admin user table.
• Principal announcements now generate targeted notifications.
• Maintained standardized layout + utilities across dashboards.
• Added Principal Reports page (`principal/reports.html`) with KPI cards, filters, charts, class breakdown, export & refresh actions.
• Unified sidebars across Admin, Principal, Sectional Head pages (consistent link order: Dashboard, Reports (where applicable), Profile (where applicable), Logout) and standardized logout confirmation.

Progress list will be updated as prototype screens evolve.
