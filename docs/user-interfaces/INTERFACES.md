# School Management System Interfaces

This document lists all the interfaces (use cases) extracted from the use case diagram, organized by functional areas and actors.

## Actors

- **User (U)**: Generic actor representing any user of the system.
- **Student (S)**: Can view educational information, submit assessments, view exam results, and apply for recorrections.
- **Teacher (T)**: Can manage student information, create/edit assessments, mark submissions, and manage exam information.
- **Sectional Head (SH)**: Can manage staff members, create/update time tables, and oversee sectional information.
- **Principal (P)**: Can broadcast announcements and oversee school functioning.
- **Administrator (A)**: Can manage user information, monitor system performance, and generate reports.

## Use Cases and Interfaces

### User Management (All Users)

- **Login**
  - Actor: User
  - Description: Users log in to the system.
  - Includes: Validate User, Update User Log

- **View User Profile**
  - Actor: User
  - Description: Users view their profiles.
  - Extends: Update User Profile
    - Includes: Update User Log

- **Logout**
  - Actor: User
  - Description: Users log out of the system.
  - Includes: Confirm, Update User Log

- **Communication**
  - Actor: User
  - Description: Users communicate with others.
  - Extends: Send Messages
    - Includes: Update User Log

### Attendance Management

- **Enter the Attendance Daily**
  - Actor: User
  - Description: Users enter daily attendance.
  - Includes: Verify Using Fingerprint, Update User Log

### Educational Information Management (Students)

- **View Educational Information**
  - Actor: Student
  - Description: Students view educational information (shows option to create if empty).
  - Extends: Submit Assessments
    - Includes: Update Educational Information
  - Extends: View Assessments
    - Includes: View Submission Marks

- **View Exams Information**
  - Actor: Student
  - Description: Students view exam information (shows option to create if empty).
  - Extends: View Exams
  - Extends: View Exam Results
    - Extends: Apply for Recorrections
    - Extends: Calculate GPA

### Student Information Management (Teachers)

- **View Student Information**
  - Actor: Teacher
  - Description: Teachers view student information (shows option to create if empty).
  - Extends: Create Student Information
    - Includes: Update Student Information
  - Extends: Delete Student Information
    - Includes: Update Student Information
  - Extends: Generate Student Attendance Reports
    - Includes: Update Student Information
  - Extends: Generate Student Performance Reports
    - Includes: Update Student Information
  - Extends: Generate Enrollment Reports
    - Includes: Update Student Information

### Assessment Management (Teachers)

- **View Educational Information**
  - Actor: Teacher
  - Description: Teachers view educational information (shows option to create if empty).
  - Extends: Create Assessments
    - Includes: Update Educational Information
  - Extends: Edit Assessments
    - Includes: Update Educational Information
  - Extends: Delete Assessments
    - Includes: Update Educational Information

- **View Student Submissions**
  - Actor: Teacher
  - Description: Teachers view student submissions (shows option to create if empty).
  - Extends: Mark Student Submissions
    - Includes: Update Educational Information

### Exam Management (Teachers)

- **View Exam Information**
  - Actor: Teacher
  - Description: Teachers view exam information (shows option to create if empty).
  - Extends: Create Exams
    - Includes: Update Exam Information
  - Extends: Update Exams
    - Includes: Update Exam Information
  - Extends: Delete Exams
    - Includes: Update Exam Information
  - Extends: Edit Exam Results
    - Includes: Update Exam Information

### Staff Management (Sectional Heads)

- **View Staff Information**
  - Actor: Sectional Head
  - Description: Sectional heads view staff information (shows option to create if empty).
  - Extends: Add Staff Members
    - Includes: Notify Teachers
  - Extends: Update Staff Members
    - Includes: Notify Teachers
  - Extends: Remove Staff Members
    - Includes: Notify Teachers

- **View Sectional Information**
  - Actor: Sectional Head
  - Description: Sectional heads view sectional information (shows option to create if empty).
  - Extends: Create Time Tables
    - Includes: Notify Teachers
  - Extends: Update Time Tables
    - Includes: Notify Teachers
  - Extends: Delete Time Tables
    - Includes: Notify Teachers

### Principal Features

- **Broadcast Announcements**
  - Actor: Principal
  - Description: Principals broadcast announcements.
  - Includes: Select Users
    - Extends: Notify Users
    - Extends: Notify Sectional Heads

### Administrator Features

- **View User Information**
  - Actor: Administrator
  - Description: Administrators view user information (shows option to create if empty).
  - Extends: Add User
    - Includes: Update User Logs
  - Extends: Update User
    - Includes: Update User Logs
  - Extends: Delete User
    - Includes: Update User Logs

- **View System Monitor**
  - Actor: Administrator
  - Description: Administrators view system monitor (shows option to create if empty).
  - Extends: Generate User Engagement Reports
    - Includes: Notify Principals
  - Extends: Generate Performance Reports
    - Includes: Notify Principals
  - Extends: Generate System Utilization Reports
    - Includes: Notify Principals
  - Extends: Generate Content Popularity Reports
    - Includes: Notify Principals
  - Extends: Generate Monthly Attendance Reports
    - Includes: Notify Principals

### Notification Interfaces

- **Notify Users**
  - Actor: System
  - Description: System notifies users of updates.

- **Notify Teachers**
  - Actor: System
  - Description: System notifies teachers of changes (e.g., staff or time table updates).

- **Notify Sectional Heads**
  - Actor: System
  - Description: System notifies sectional heads.

- **Notify Principals**
  - Actor: System
  - Description: System notifies principals of reports.

### Update Interfaces

- **Update Student Information**
  - Actor: System
  - Description: Updates student records.

- **Update Educational Information**
  - Actor: System
  - Description: Updates educational content and assessments.

- **Update Exam Information**
  - Actor: System
  - Description: Updates exam data.

- **Update User Log**
  - Actor: System
  - Description: Logs user activities.

- **Update User Logs**
  - Actor: System
  - Description: Alternative logging interface for administrators.
