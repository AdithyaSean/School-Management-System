# School Management System Interfaces

This document lists all the interfaces (use cases) extracted from the use case diagram, organized by functional areas and actors.

SCOPE: The statuses below reflect only the clickable prototype (static/front-end screens, navigation, modals, placeholder interactions). They do NOT imply any backend, persistence, security, real-time messaging, or logging implementation.

## Prototype Coverage Legend

- [x] Present: Screen or modal exists and affords the core interaction in the prototype.
- [~] Partial: UI element(s) exist but the flow is incomplete or only a placeholder link/button.
- [ ] Missing: No corresponding screen / interactive element yet.

High-level prototype summary: Dashboards for roles and most CRUD-style management UIs are present with static/sample data. New in this iteration: Teacher student information management screen (CRUD + detail off‑canvas + basic report placeholders) and student result enhancements (recorrection request modal, GPA breakdown + recompute action). Remaining major gaps: messaging/threads UI, global notifications panel, enrollment reports, and exam result editing UI for teachers.

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

- [~] **View User Profile**
  - Actor: User
  - Description: Users view their profiles.
  - Extends: Update User Profile (UI modal present for student only; no persistence)
    - Includes: Update User Log (not implemented)
  - Prototype Notes: Student profile screen + edit modal exist. Other roles lack profile pages (gap if required in scope).

- [x] **Logout**
  - Actor: User
  - Description: Users log out of the system.
  - Includes: Confirm, Update User Log
  - Prototype Notes: Navigation links route back to login; no confirmation dialog (optional enhancement).

- [~] **Communication**
  - Actor: User
  - Description: Users communicate with others.
  - Extends: Send Messages
    - Includes: Update User Log
  - Prototype Notes: Placeholder quick action and bell icon only; no dedicated messaging/threads screen yet.

### Attendance Management

- [~] **Enter the Attendance Daily**
  - Actor: User (Teachers primarily)
  - Description: Users enter daily attendance.
  - Includes: Verify Using Fingerprint (not implemented), Update User Log (not implemented)
  - Prototype Notes: Teacher attendance management (table + modal) present. Student-facing attendance or fingerprint verification not represented.

### Educational Information Management (Students)

- [~] **View Educational Information**
  - Actor: Student
  - Description: Students view educational information (shows option to create if empty).
  - Extends: Submit Assessments (submission modal UI exists -> `assessments.html` / `assessments.js`; no backend, no create-if-empty logic)
    - Includes: Update Educational Information (not implemented)
  - Extends: View Assessments (implemented UI list with filters)
    - Includes: View Submission Marks (partial: some cards show submitted status; detailed marks view limited)
  - Prototype Notes: Cards, filters, submission modal present with sample content.

- [~] **View Exams Information**
  - Actor: Student
  - Description: Students view exam information (shows option to create if empty).
  - Extends: View Exams (UI: `exams.html` + `exams.js` schedule & details modal)
  - Extends: View Exam Results (results & charts via `results.html` + `results.js`)
    - Extends: Apply for Recorrections (UI modal implemented: reason, file upload, confirm; no backend)
    - Extends: Calculate GPA (Dynamic recompute trigger + explanation modal; underlying math still mock)
  - Prototype Notes: Exam schedule, performance charts, result detail modals, recorrection request flow & GPA breakdown modal now present. GPA and recorrection submissions remain in-memory only.

### Student Information Management (Teachers)

- [~] **View Student Information**
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
  - Extends: Generate Enrollment Reports (not implemented – no UI yet)
  - Prototype Notes: New `students.html` implements list (list/grid toggle), empty state, CRUD modal, detail off‑canvas (performance & attendance snapshot placeholders) and report placeholders. No backend or persistent storage; enrollment reporting absent.

### Assessment Management (Teachers)

- [~] **View Educational Information**
  - Actor: Teacher
  - Description: Teachers view educational information (shows option to create if empty).
  - Extends: Create Assessments (UI modal + mock create in `manage-assessments.html` / `manage-assessments.js`)
    - Includes: Update Educational Information (not implemented)
  - Extends: Edit Assessments (reuse create modal; no data loading)
    - Includes: Update Educational Information
  - Extends: Delete Assessments (row removal only)
    - Includes: Update Educational Information
  - Prototype Notes: Listing + create/edit/delete/grade entry points visually represented.

- [~] **View Student Submissions**
  - Actor: Teacher
  - Description: Teachers view student submissions (shows option to create if empty).
  - Extends: Mark Student Submissions (submission management & grading UI present; no persistence)
    - Includes: Update Educational Information (not implemented)
  - Prototype Notes: Dedicated marking & report modal present.

### Exam Management (Teachers)

- [~] **View Exam Information**
  - Actor: Teacher
  - Description: Teachers view exam information (shows option to create if empty).
  - Extends: Create Exams (schedule modal UI)
    - Includes: Update Exam Information (not implemented)
  - Extends: Update Exams (edit reuses create modal; no data binding)
    - Includes: Update Exam Information
  - Extends: Delete Exams (row removal only)
    - Includes: Update Exam Information
  - Extends: Edit Exam Results (results listing shown; no editing UI for scores)
    - Includes: Update Exam Information
  - Prototype Notes: Exam list/calendar and create/edit modals present; score editing UI absent.

### Staff Management (Sectional Heads)

- [~] **View Staff Information**
  - Actor: Sectional Head
  - Description: Sectional heads view staff information (shows option to create if empty).
  - Extends: Add Staff Members (UI form adds to local array)
    - Includes: Notify Teachers (not implemented)
  - Extends: Update Staff Members (UI form edits local array)
    - Includes: Notify Teachers (not implemented)
  - Extends: Remove Staff Members (UI removal only)
    - Includes: Notify Teachers (not implemented)
  - Prototype Notes: Staff CRUD forms exist; stray React snippet removed for consistency.

- [~] **View Sectional Information**
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

- [~] **Broadcast Announcements**
  - Actor: Principal
  - Description: Principals broadcast announcements.
  - Includes: Select Users (audience dropdown present)
    - Extends: Notify Users (not implemented)
    - Extends: Notify Sectional Heads (not implemented)
  - Prototype Notes: Form & list present; update/cancel buttons visually duplicate without differentiated behavior.

### Administrator Features

- [~] **View User Information**
  - Actor: Administrator
  - Description: Administrators view user information (shows option to create if empty).
  - Extends: Add User (UI form adds to local array)
    - Includes: Update User Logs (not implemented)
  - Extends: Update User (UI form edits local array)
    - Includes: Update User Logs (not implemented)
  - Extends: Delete User (UI delete only)
    - Includes: Update User Logs (not implemented)
  - Prototype Notes: User list & CRUD forms present; duplicate element IDs and redundant action buttons.

- [~] **View System Monitor**
  - Actor: Administrator
  - Description: Administrators view system monitor (shows option to create if empty).
  - Extends: Generate User Engagement Reports (placeholder button -> mock div)
    - Includes: Notify Principals (not implemented)
  - Extends: Generate Performance Reports (mock div)
    - Includes: Notify Principals
  - Extends: Generate System Utilization Reports (mock div)
    - Includes: Notify Principals
  - Extends: Generate Content Popularity Reports (mock div)
    - Includes: Notify Principals
  - Extends: Generate Monthly Attendance Reports (mock div)
    - Includes: Notify Principals
  - Prototype Notes: Buttons output placeholder report boxes only; no chart/table mockups.

### Notification Interfaces

- [ ] **Notify Users**
  - Actor: System
  - Description: System notifies users of updates.
  - Status Notes: No notification service; only static bell icon & badges.

- [ ] **Notify Teachers**
  - Actor: System
  - Description: System notifies teachers of changes (e.g., staff or time table updates).
  - Status Notes: Not implemented.

- [ ] **Notify Sectional Heads**
  - Actor: System
  - Description: System notifies sectional heads.
  - Status Notes: Not implemented.

- [ ] **Notify Principals**
  - Actor: System
  - Description: System notifies principals of reports.
  - Status Notes: Not implemented.

### Update Interfaces

- [~] **Update Student Information**
  - Actor: System
  - Description: Updates student records.
  - Status Notes: CRUD UI now mutates in-memory list (prototype scope) but lacks abstraction/service layer and persistence.

- [ ] **Update Educational Information**
  - Actor: System
  - Description: Updates educational content and assessments.
  - Status Notes: Teacher assessment & submission UIs mutate only in-memory lists; no system-level update abstraction.

- [ ] **Update Exam Information**
  - Actor: System
  - Description: Updates exam data.
  - Status Notes: Exam scheduling edits not persisted or broadcast.

- [ ] **Update User Log**
  - Actor: System
  - Description: Logs user activities.
  - Status Notes: No logging implemented.

- [ ] **Update User Logs**
  - Actor: System
  - Description: Alternative logging interface for administrators.
  - Status Notes: Not implemented.

## Prototype Gaps & Next UI Steps (Updated)

1. Add messaging/inbox UI (threads list, message view, compose) and integrate from bell/quick actions.
2. Implement global notifications panel (dropdown or off‑canvas) listing recent events; unify bell behavior across pages.
3. Add exam result editing / score entry UI for teachers (inline table or modal) and tie into existing results placeholders.
4. Create enrollment reports & class-level attendance/performance analytics pages (currently absent).
5. Flesh out teacher `performance-report.html` (empty) with filters, charts, per‑student breakdown linking back to `students.html` off‑canvas.
6. Standardize layout: convert standalone principal/admin/sectional pages to shared sidebar shell (or vice versa) for consistency.
7. Consolidate destructive action confirmations into reusable modal (currently some use `confirm()` dialogs, others none).
8. Introduce empty-state components across all list views still lacking them (e.g., exams, assessments manage pages when arrays become empty).
9. Add status iconography/badges for submissions (graded, pending, late) and staff statuses; unify color semantics.
10. Enhance system monitor placeholder reports with basic mock charts/tables & add activity/log feed placeholder for future audit/logging.
11. (Stretch) Centralize toast/notification utility to a single script to avoid duplicated markup creation patterns.

Change Log (current iteration): Added student management screen (teacher role), recorrection request modal, GPA breakdown & recompute UI, removed React snippet from staff management, upgraded status of related use cases to partial where appropriate.

Progress list will be updated as prototype screens evolve.
