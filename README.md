# HostelEase — Smart Hostel Administration & Student Welfare Platform

> "Better hostel management. A better student experience."

HostelEase is a centralized digital management system built for educational institutions to administer hostel residents, room allocations, daily curfew roll calls, fee receipts, leave requests, grievances, dining services, visitors, and facility maintenance.

---

## 1. User Roles & Credentials

The system provides 4 distinct roles, all operating within the same unified application with strict role-based access control (RBAC):

| Role | Default Demo Account | Password | Key Capabilities |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@hostelease.edu` | `demo1234` | Full system administration, rooms, fee ledger, institutional reports, settings |
| **Warden** | `warden@hostelease.edu` | `demo1234` | Student admissions, bed allocations, leave approvals, notices, complaints |
| **Staff** | `staff@hostelease.edu` | `demo1234` | Night attendance roll-call, visitor register, maintenance task resolution |
| **Student** | `student@hostelease.edu` | `demo1234` | View allocated room & bed, fee status, submit leave out-passes, raise complaints |

*Tip: In demo mode, you can also use the **Role Switcher** in the top navigation bar to switch between personas instantly with one click.*

---

## 2. Feature Modules

1. **Student Management:** Comprehensive resident directory, emergency contacts, guardian verification, search & department filtering.
2. **Room & Bed Management:** Visual grid of wings (Wing A, B, C) and floors, bed capacities, allocation modal with double-booking prevention, bed release, and historical logs.
3. **Fee & Payment Administration:** Fee charge assignment, partial & full payments, outstanding balance computation, and printable official vouchers.
4. **Attendance & Roll Call:** Daily attendance ledger, one-click "Mark All Present", night curfew compliance percentage, and unrecorded alerts.
5. **Leave & Out-Pass Workflow:** Student leave applications with travel addresses, warden approval/rejection with auditable remarks.
6. **Complaints & Grievance Desk:** Categorized maintenance issues (Electrical, Plumbing, Wi-Fi, Food, Furniture) with priority badges and technician updates.
7. **Mess & Dining Management:** 7-day four-meal menu schedule (Breakfast, Lunch, Snacks, Dinner, Specials) with student feedback ratings.
8. **Visitor & Security Log:** Regulate campus entry, visitor relationships, resident visited, and departure timestamps.
9. **Facility Maintenance:** Multi-trade task scheduling (HVAC, plumbing, electrical) with technician assignments and cost tracking.
10. **Notice Board & Circulars:** Broadcast announcements with high-priority emergency alerts highlighted in red.
11. **Institutional Reports & Exports:** Dynamic report generator with one-click formatted CSV exports for all datasets.

---

## 3. Technology Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide React icons, Recharts
- **Routing:** React Router v7
- **Database & Auth:** Supabase Auth & PostgreSQL with Row Level Security (RLS)
- **Local Fallback:** Fully reactive LocalStorage data store with deterministic initial seed data

---

## 4. Setup & Running Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Production build:**
   ```bash
   npm run build
   ```

---

## 5. Supabase Database Deployment

1. Create a new Supabase project at [https://supabase.com](https://supabase.com).
2. In the Supabase SQL Editor, run the migration script:
   - `supabase/migrations/20261025000000_init_schema.sql`
3. Optionally run the sample data script:
   - `supabase/seed.sql`
4. Copy your project credentials into `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
