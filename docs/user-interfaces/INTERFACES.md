# School Management System Interfaces

This document lists all the interfaces (use cases) extracted from the use case diagram, organized by functional areas and actors.

SCOPE: The statuses below reflect only the clickable prototype (static/front-end screens, navigation, modals, placeholder interactions). They do NOT imply any backend, persistence, security, real-time messaging, or logging implementation.

## Prototype Coverage Legend

- [x] Present: Screen or modal exists and affords the core interaction in the prototype.
- [~] Partial: UI element(s) exist but the flow is incomplete or only a placeholder link/button.
- [ ] Missing: No corresponding screen / interactive element yet.

High-level prototype summary: All role dashboards now share a consistent layout (sidebar, header actions, notification + activity log buttons, logout confirmation) via `layout-standardize.js`. Most CRUD and reporting UIs are present with static/sample data: messaging inbox (threads, compose, filters), global notifications off‑canvas + centralized toast/confirm utilities, exam score editing modal (bulk save, mark absent, publish), performance reports (teacher & admin) with filters/charts/per‑student breakdown, student results enhancements (recorrection request modal, GPA breakdown + recompute action), student attendance analytics (filters, summary/detail modal, export), teacher gradebook (filters, inline edit modal, weighting settings, analytics charts, CSV export), teacher enrollment report (class totals & movements), enhanced admin system monitor (mock charts / tables / progress cards), and global activity log off‑canvas + logging helper. Secondary pages (student assessments/exams, teacher manage assessments) now also include standardized notification & activity log controls, empty‑state markers, and logging calls.

Remaining major prototype gaps (UI only – backend intentionally absent):
1. Role‑scoped notification filtering & targeted audience delivery (all notifications currently global).
2. Centralized in‑memory service layer (data duplication across page scripts; no shared data store abstraction).
3. Deeper cross‑link navigation (contextual deep links between lists, reports, and detail modals still minimal).
4. Advanced audit log features (pagination, search, export, richer categorization beyond basic filter).
5. Full status badge retrofit for legacy tables not yet refactored (some older list pages still use plain text).
6. Accessibility & responsive polish (ARIA roles for off‑canvas/log, keyboard trap handling, improved color contrast on certain badge/background combinations).
7. Optional profile enrichment (richer non‑student profile tabs & activity summaries) – basic shells exist.

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
  - Status Notes: Off‑canvas notification center with mock events & badge clearing implemented; still no persistence or subscription model.

- [x] **Notify Teachers**
  - Actor: System
  - Description: System notifies teachers of changes (e.g., staff or time table updates).
  - Status Notes: Generic notification center + logging exist; staff CRUD logging can evolve into role-targeted pushes (not filtered yet).

- [x] **Notify Sectional Heads**
  - Actor: System
  - Description: System notifies sectional heads.
  - Status Notes: Infrastructure (off‑canvas, logging) present; no distinct trigger paths yet.

- [x] **Notify Principals**
  - Actor: System
  - Description: System notifies principals of reports.
  - Status Notes: Report generation & announcements now log events; targeted audience filtering not yet implemented.

### Update Interfaces

- [x] **Update Student Information**
  - Actor: System
  - Description: Updates student records.
  - Status Notes: CRUD UI now mutates in-memory list (prototype scope) but lacks abstraction/service layer and persistence.

- [x] **Update Educational Information**
  - Actor: System
  - Description: Updates educational content and assessments.
  - Status Notes: Assessment/submission UIs allow create/edit/delete (in-memory). Missing: shared service abstraction, audit categorization, cross-page reuse.

- [x] **Update Exam Information**
  - Actor: System
  - Description: Updates exam data.
  - Status Notes: Scheduling + editing + score update modal mutate in‑memory view; lacks abstraction/persistence & notification triggers.

- [x] **Update User Log**
  - Actor: System
  - Description: Logs user activities.
  - Status Notes: Activity off‑canvas log records CRUD/report/announcement events; session-only, basic category filter only.

- [x] **Update User Logs**
  - Actor: System
  - Description: Alternative logging interface for administrators.
  - Status Notes: Shares same activity log; lacks admin-specific filters/export UI.

## Prototype Gaps & Next UI Steps (Updated)

1. (DONE) Messaging/inbox UI (threads, compose, filters) integrated via quick action.
2. (DONE) Global notifications off‑canvas (mock data + add/clear actions).
3. (DONE) Exam result editing / score entry modal (bulk save, finalize, mark absent) for teachers.
4. (DONE) Create enrollment reports & class-level attendance/performance analytics pages (teacher `enrollment-report.html`, admin performance/system report refactor).
5. (DONE) Teacher `performance-report.html` with filters, charts, per‑student breakdown & detail modal.
6. (DONE) Standardize layout across all role dashboards (shared sidebar, header actions, logout confirmation via `layout-standardize.js`).
7. (DONE) Reusable confirmation modal utility added (`UIUtils.confirm`) & applied to logout links.
8. (DONE) Empty-state components auto-applied via `data-empty-state` attributes handled by `layout-standardize.js`.
9. (DONE) Status badge utility available; retrofit pass completed on updated dashboards (remaining legacy tables queued for refactor if expanded further).
10. (DONE) Enhance system monitor report outputs with mock charts/tables & activity/log feed placeholder.
11. (DONE) Centralized toast/notification utility (`ui-utils.js`).
12. (DONE) Add enrollment report pages & integrate into navigation (teacher `enrollment-report.html`, admin performance report unified).
13. (DONE) Notification center triggers & activity log buttons consistent across dashboards.
14. (DONE) Lightweight logging/audit feed off‑canvas + `UIUtils.log` integrated; dashboards log load event.

Unified Change Log (recent highlights):
• Added messaging inbox, notification off‑canvas, centralized UI utilities (toast, confirm, status badges).
• Implemented exam score editing modal (bulk save, mark absent, publish flow) and performance reports (teacher/admin) with charts & per‑student breakdown.
• Delivered student results enhancements (recorrection request modal, GPA breakdown/recompute), attendance analytics (filters, summary/detail modal, export), and teacher gradebook (filters, weighting modal, analytics charts, inline edit, CSV export).
• Added enrollment report page, activity/audit log off‑canvas (`UIUtils.log`), and richer system monitor mock visuals.
• Standardized all dashboards & key secondary pages using `layout-standardize.js` (notification + activity controls, logout confirmation, empty‑state auto rendering, logging hooks).
• Retrofitted empty states & notification triggers on student assessments/exams and teacher manage assessments pages.
• Updated interface statuses from partial to present; remaining enhancements intentionally deferred (role-scoped notifications, shared data layer, deeper cross-linking, advanced audit capabilities, accessibility polish).

Progress list will be updated as prototype screens evolve.
