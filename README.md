# staynest — Smart Hostel Administration & Student Welfare Platform

> **"Better hostel management. A better student experience."**

**staynest** is a comprehensive, centralized digital operations and student welfare management platform engineered for universities, colleges, and residential academic institutions. It unifies resident admission, smart bed allocation, daily night curfew roll-call, fee payments, out-pass leave workflows, maintenance grievances, dining hall operations, security visitor registers, and institutional auditing into one cohesive interface.

---

## 1. Product Identity & Design System

- **Product Name:** `staynest`
- **Category:** Institutional Hostel Administration & Student Welfare Management Platform
- **Visual Reference:** Clean neutral grey surfaces, dark navy structural accents, restrained thin borders, and high information density following **Reference Image 2**.

### Color Tokens
| Semantic Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Canvas Background** | `#FEFEFE` | Application-wide clean canvas |
| **Surface** | `#F0F3F3` | Primary cards, content panels, and subtle containers |
| **Surface Muted / Borders** | `#D6DCE0` | Structural dividers, card borders, and input boundaries |
| **Sidebar Accent / Muted** | `#B5C1C8` | Secondary panels and inactive navigations |
| **Primary Navy** | `#0C1629` | Header accents, dark buttons, primary sidebar, active tabs |
| **Success** | `#287A52` | Paid fees, approved leaves, present attendance, active status |
| **Warning** | `#A66B16` | Pending requests, partial payments, urgent tasks |
| **Danger** | `#B54747` | Overdue balances, emergency notices, absentees, rejections |
| **Info** | `#356B9A` | Brand badges, circular tags, and informational links |

---

## 2. User Roles, Credentials & Access Matrix

All institutional stakeholders access staynest from the same application, but their interface, permissions, and visible modules are strictly governed by their role.

| Role | Default Demo Email | Password | Primary Capabilities |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@staynest.edu` | `demo1234` | System configuration, room setup, fee charges, financial ledger, audit reports, user management |
| **Warden** | `warden@staynest.edu` | `demo1234` | Student directory, bed allocation, out-pass approvals, notices, complaint oversight, attendance review |
| **Hostel Staff** | `staff@staynest.edu` | `demo1234` | Night attendance roll-call, gate visitor register, maintenance repairs, meal preparation logs |
| **Student Resident** | `student@staynest.edu` | `demo1234` | View allocated room & bed, fee receipts, submit out-pass leaves, raise grievances, check weekly meals |

> **Interactive Persona Switcher:** When testing in demo mode, click the **Role Selector** in the dashboard header to immediately switch personas with one click.
> **Logout Redirect:** Logging out immediately redirects users to the public landing page (`/`) and triggers a confirmation toast popup.

---

## 3. Core Functional Modules

### 3.1 Student Management (`/dashboard/students`)
- **Directory & Search:** Real-time search across resident names, student IDs (e.g. `SN-2023-042`), departments, and allocated rooms.
- **Department & Fee Filters:** Filter by branch (CSE, ECE, Mech, Civil, Biotech) and fee status (Paid, Partially Paid, Pending, Overdue).
- **Restricted Profile Drawer:** View emergency contacts and verified guardian details without exposing private data to unauthorized roles.
- **CSV Export:** Download complete student records with one click.

### 3.2 Room & Bed Management (`/dashboard/rooms`)
- **Capacity & Occupancy Tracking:** Visual overview across buildings (`Wing A`, `Wing B`, `Wing C`) and floor levels.
- **Strict Allocation Engine:**
  - Prevents room overbooking (occupied beds cannot exceed capacity).
  - Enforces that a resident cannot hold two simultaneous active room allocations.
  - Guarantees no two students occupy the same bed identifier (`Bed-1`, `Bed-2`).
- **Bed Release & Re-allocation:** Seamlessly release beds when students vacate or change rooms while preserving full historical allocation logs.
- **Dual View Modes:** Toggle between visual card grids and compact tabular views.

### 3.3 Fee & Payment Administration (`/dashboard/fees`)
- **Category Billing:** Configure charges for Hostel Rent, Mess Dining, Utilities & Maintenance, Security Deposits, and Amenities.
- **Exact Balance Calculation:** Real-time calculation: `Outstanding Amount = Total Charges - Confirmed Payments`.
- **Payment Ledger:** Record payments via UPI, NEFT Bank Transfer, Demand Draft, or Cash with transaction references.
- **Printable Official Receipt:** Generate professional, printable vouchers with receipt numbers, student identifiers, and authorization signatures.

### 3.4 Night Roll-Call & Daily Attendance (`/dashboard/attendance`)
- **Session Date Picker:** Inspect or record daily attendance for any date.
- **Curfew Statuses:** Mark students as **Present**, **Absent**, or **On Leave** (synced with approved out-passes).
- **One-Click Batch Action:** "Mark All Present" shortcut for rapid roll-call entry.
- **Compliance Rate:** Live percentage indicator tracking compliance with institutional 85% attendance guidelines.

### 3.5 Student Leave & Out-Pass Workflow (`/dashboard/leaves`)
- **Student Submission:** Residents apply with start/end dates, travel destination, emergency contact, and verified reason.
- **Warden Review Desk:** Wardens and administrators review pending applications to either **Approve** or **Reject** (with mandatory reason).
- **Self-Service Cancellation:** Students can cancel their own eligible pending requests.
- **Security Rule:** Students are strictly prohibited from approving their own out-pass applications.

### 3.6 Grievance & Complaint Desk (`/dashboard/complaints`)
- **Categories:** Electrical, Plumbing, Water, Wi-Fi, Cleanliness, Furniture, Food, and General Facility.
- **Priority Escalation:** Low, Medium, High, and Urgent tags.
- **Progressive Lifecycle:** `Submitted` → `Assigned` → `In Progress` → `Resolved` → `Closed`.
- **Technician Notes:** Staff and wardens record parts replaced, contractor details, and resolution timestamps.

### 3.7 Mess & Dining Services (`/dashboard/mess`)
- **7-Day Menu Schedule:** Weekly navigation from Monday to Sunday covering Breakfast, Lunch, Evening Snacks, and Dinner.
- **Special Items:** Highlights special feasts, ice creams, and holiday options.
- **Menu Authoring:** Wardens and staff can edit meal descriptions and publish updates live.
- **Resident Food Feedback:** Students rate meals from 1 to 5 stars across taste, hygiene, portion size, and timeliness.

### 3.8 Security & Visitor Register (`/dashboard/visitors`)
- **Gate Check-In:** Record guest full name, phone number, relationship to student, and visit purpose.
- **Live Premises Counter:** Real-time metric showing visitors currently inside the hostel.
- **Gate Check-Out:** Log exit timestamps with one click upon departure.

### 3.9 Facility Maintenance Tasks (`/dashboard/maintenance`)
- **Multi-Trade Tracking:** Plumbing, Electrical, HVAC / Geyser, Carpentry, and Civil & Painting.
- **Expense Logging:** Record estimated and final incurred repair costs in INR.
- **Status Progression:** Track maintenance jobs from unassigned queue to completion.

### 3.10 Notice Board & Urgent Bulletins (`/dashboard/notices`)
- **Target Audiences:** Broadcast circulars to All Residents, Students Only, Staff, Wing A, or Wing B.
- **Emergency Alerts:** Critical announcements (e.g. water tank descaling shut-off) are highlighted with red accent borders.

### 3.11 Institutional Reports & Exports (`/dashboard/reports`)
- **Centralized Export Hub:** Generate reports for room occupancy, resident rolls, financial dues, attendance logs, and maintenance logs.
- **CSV & Print Ready:** Download clean CSV spreadsheets or trigger browser print stylesheets.

---

## 4. Security & Authorization Rules

1. **Strict Public Registration Constraint:**
   - Any public sign-up via `/register` is hardcoded to receive the `student` role.
   - Public visitors can never self-assign `admin`, `warden`, or `staff` privileges.
2. **Protected Route Boundaries:**
   - Unauthenticated visitors attempting to access `/dashboard/*` or signed-out users are immediately redirected to the public landing page (`/`).
   - Access to administrative modules (`students`, `reports`, `settings`, `visitors`, `maintenance`) is blocked for student accounts.
3. **Auditability:**
   - Sensitive operations (bed allocation, payment verification, out-pass rejection) record reviewer names and timestamps.

---

## 5. Technology Stack & Directory Structure

```
├── .env.example                               # Environment variable templates
├── index.html                                 # HTML entry point with Inter font & metadata
├── metadata.json                              # Project metadata & capabilities
├── package.json                               # Dependencies & scripts
├── public/                                    # Static assets & attachments
├── src/
│   ├── app/                                   # App routing & providers
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx                     # Top bar, role switcher, date, notifications
│   │   │   ├── Sidebar.tsx                    # Navy compact navigation sidebar
│   │   │   └── DashboardLayout.tsx            # Protected dashboard shell
│   │   └── ui/
│   │       └── Toast.tsx                      # Floating popup alert notifications
│   ├── features/
│   │   └── auth/
│   │       └── AuthContext.tsx                # Auth state, login/logout, session persistence
│   ├── lib/
│   │   ├── formatters.ts                      # INR currency & date formatters
│   │   ├── permissions.ts                     # RBAC permission matrices
│   │   └── supabase.ts                        # Supabase client initializer
│   ├── pages/
│   │   ├── LandingPage.tsx                    # Public marketing page with Reference Image 2 preview
│   │   ├── LoginPage.tsx                      # Sign in page with demo accounts
│   │   ├── RegisterPage.tsx                   # Student registration page
│   │   ├── ForgotPasswordPage.tsx             # Password recovery
│   │   ├── DashboardPage.tsx                  # Executive dashboard with Recharts
│   │   ├── StudentsPage.tsx                   # Resident management directory
│   │   ├── RoomsPage.tsx                      # Room & bed allocation
│   │   ├── FeesPage.tsx                       # Fee collection & printable receipt
│   │   ├── AttendancePage.tsx                 # Night curfew roll call
│   │   ├── LeavesPage.tsx                     # Out-pass leave approvals
│   │   ├── ComplaintsPage.tsx                 # Grievance desk
│   │   ├── MessPage.tsx                       # 7-day dining schedule & feedback
│   │   ├── VisitorsPage.tsx                   # Security gate register
│   │   ├── MaintenancePage.tsx                # Maintenance task dispatch
│   │   ├── NoticesPage.tsx                    # Official circulars
│   │   ├── ReportsPage.tsx                    # Audit reporting & CSV export
│   │   └── SettingsPage.tsx                   # System parameters & demo reset
│   ├── services/
│   │   ├── dataStore.ts                       # Reactive LocalStorage persistence & CSV export
│   │   └── seedData.ts                        # Deterministic initial institutional seed data
│   ├── types/
│   │   └── index.ts                           # TypeScript models & interfaces
│   ├── index.css                              # Tailwind CSS & design tokens
│   └── main.tsx                               # Application mount point
└── supabase/
    ├── migrations/
    │   └── 20261025000000_init_schema.sql     # PostgreSQL schema, constraints & RLS policies
    └── seed.sql                               # PostgreSQL seed statements
```

---

## 6. Installation & Deployment Guide

### Local Development
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Start the development server on port 3000:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view staynest.

3. Verify compilation and linting:
   ```bash
   npm run build
   npm run lint
   ```

### Supabase Cloud Database Setup
1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard and execute:
   - `supabase/migrations/20261025000000_init_schema.sql`
   - `supabase/seed.sql`
3. In your `.env` file (or host environment variables), set:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
4. When credentials are provided, staynest connects to Supabase PostgreSQL and authenticates users via Supabase Auth. If credentials are omitted, staynest operates seamlessly in **Interactive Demo Mode** with persistent LocalStorage.

---

© 2026 staynest Systems. Designed for institutional efficiency, transparency, and resident welfare.
