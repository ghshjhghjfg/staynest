-- ====================================================================
-- HostelEase: Smart Hostel Administration & Student Welfare Platform
-- Complete PostgreSQL Schema with Constraints, Indexes, and RLS Policies
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('admin', 'warden', 'student', 'staff')) DEFAULT 'student',
    account_status TEXT NOT NULL CHECK (account_status IN ('active', 'pending', 'suspended')) DEFAULT 'active',
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. STUDENTS
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_code TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    department TEXT NOT NULL,
    academic_year TEXT NOT NULL,
    gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
    guardian_name TEXT NOT NULL,
    guardian_phone TEXT NOT NULL,
    emergency_contact TEXT NOT NULL,
    fee_status TEXT NOT NULL CHECK (fee_status IN ('Paid', 'Partially Paid', 'Pending', 'Overdue')) DEFAULT 'Pending',
    account_status TEXT NOT NULL DEFAULT 'active',
    joining_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. ROOMS
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    building TEXT NOT NULL,
    floor INTEGER NOT NULL,
    room_number TEXT UNIQUE NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    room_type TEXT NOT NULL CHECK (room_type IN ('Single', 'Double', 'Triple', 'Four Sharing')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. ROOM ALLOCATIONS
CREATE TABLE IF NOT EXISTS public.room_allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
    bed_identifier TEXT NOT NULL,
    allocated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    released_at TIMESTAMPTZ,
    allocation_status TEXT NOT NULL CHECK (allocation_status IN ('active', 'released')) DEFAULT 'active',
    allocated_by TEXT NOT NULL
);

-- Enforce: a student can have at most ONE active allocation
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_student_allocation
ON public.room_allocations (student_id)
WHERE allocation_status = 'active';

-- Enforce: a bed in a room can have at most ONE active allocation
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_room_bed_allocation
ON public.room_allocations (room_id, bed_identifier)
WHERE allocation_status = 'active';

-- 5. FEE CHARGES
CREATE TABLE IF NOT EXISTS public.fee_charges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('Hostel Rent', 'Mess Fee', 'Maintenance & Utilities', 'Security Deposit', 'Gym & Amenities')),
    amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    due_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. PAYMENTS
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    fee_charge_id UUID REFERENCES public.fee_charges(id) ON DELETE SET NULL,
    fee_category TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('Bank Transfer', 'UPI', 'Demand Draft', 'Cash Receipt')),
    transaction_reference TEXT UNIQUE NOT NULL,
    payment_status TEXT NOT NULL CHECK (payment_status IN ('Confirmed', 'Pending Verification', 'Failed')) DEFAULT 'Confirmed',
    receipt_number TEXT UNIQUE NOT NULL,
    recorded_by TEXT NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. ATTENDANCE
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Present', 'Absent', 'On Leave')),
    recorded_by TEXT NOT NULL,
    remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_student_daily_attendance UNIQUE (student_id, attendance_date)
);

-- 8. LEAVE REQUESTS
CREATE TABLE IF NOT EXISTS public.leave_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    destination TEXT NOT NULL,
    emergency_contact TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Cancelled')) DEFAULT 'Pending',
    reviewed_by TEXT,
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_leave_dates CHECK (end_date >= start_date)
);

-- 9. COMPLAINTS
CREATE TABLE IF NOT EXISTS public.complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Electrical', 'Plumbing', 'Water', 'Wi-Fi', 'Cleanliness', 'Furniture', 'Food', 'Other')),
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')) DEFAULT 'Medium',
    status TEXT NOT NULL CHECK (status IN ('Submitted', 'Assigned', 'In Progress', 'Resolved', 'Closed')) DEFAULT 'Submitted',
    assigned_to TEXT,
    resolution_notes TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. COMPLAINT UPDATES
CREATE TABLE IF NOT EXISTS public.complaint_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
    updated_by TEXT NOT NULL,
    status TEXT NOT NULL,
    message TEXT NOT NULL,
    is_internal BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. MESS MENUS
CREATE TABLE IF NOT EXISTS public.mess_menus (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    day_of_week TEXT UNIQUE NOT NULL CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
    breakfast TEXT NOT NULL,
    lunch TEXT NOT NULL,
    snacks TEXT NOT NULL,
    dinner TEXT NOT NULL,
    special_item TEXT,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    published_by TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. FOOD FEEDBACK
CREATE TABLE IF NOT EXISTS public.food_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    meal_type TEXT NOT NULL CHECK (meal_type IN ('Breakfast', 'Lunch', 'Snacks', 'Dinner')),
    date DATE NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    category TEXT NOT NULL,
    comments TEXT NOT NULL,
    reviewed_by_staff BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. VISITORS
CREATE TABLE IF NOT EXISTS public.visitors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    visitor_name TEXT NOT NULL,
    visitor_phone TEXT NOT NULL,
    relationship TEXT NOT NULL,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    purpose TEXT NOT NULL,
    entry_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    exit_time TIMESTAMPTZ,
    recorded_by TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Inside', 'Checked Out')) DEFAULT 'Inside'
);

-- 14. MAINTENANCE TASKS
CREATE TABLE IF NOT EXISTS public.maintenance_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('Carpentry', 'Plumbing', 'Electrical', 'HVAC / Fan', 'Appliance', 'Civil & Painting')),
    location TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')) DEFAULT 'Medium',
    status TEXT NOT NULL CHECK (status IN ('Pending', 'Assigned', 'In Progress', 'Completed', 'Cancelled')) DEFAULT 'Pending',
    assigned_to TEXT,
    cost NUMERIC(10,2) DEFAULT 0,
    notes TEXT,
    created_by TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 15. NOTICES
CREATE TABLE IF NOT EXISTS public.notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('General', 'Fees', 'Holiday', 'Maintenance', 'Mess', 'Emergency')),
    target_audience TEXT NOT NULL DEFAULT 'All Residents',
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    created_by TEXT NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    is_emergency BOOLEAN NOT NULL DEFAULT FALSE
);

-- 16. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_id TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    notification_type TEXT NOT NULL,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_charges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mess_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to get caller role
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS TEXT LANGUAGE sql STABLE AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- PROFILES Policies
CREATE POLICY "Users can read their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id OR public.get_auth_role() IN ('admin', 'warden'));

CREATE POLICY "Admins can update all profiles"
ON public.profiles FOR ALL
USING (public.get_auth_role() = 'admin');

-- STUDENTS Policies
CREATE POLICY "Staff, Warden, Admin can view all students"
ON public.students FOR SELECT
USING (public.get_auth_role() IN ('admin', 'warden', 'staff') OR profile_id = auth.uid());

CREATE POLICY "Warden and Admin can manage students"
ON public.students FOR ALL
USING (public.get_auth_role() IN ('admin', 'warden'));

-- ROOMS Policies
CREATE POLICY "Anyone authenticated can view rooms"
ON public.rooms FOR SELECT
TO authenticated USING (true);

CREATE POLICY "Admin and Warden can manage rooms"
ON public.rooms FOR ALL
USING (public.get_auth_role() IN ('admin', 'warden'));

-- ALLOCATIONS Policies
CREATE POLICY "Users view allocations"
ON public.room_allocations FOR SELECT
TO authenticated USING (true);

CREATE POLICY "Admin and Warden manage allocations"
ON public.room_allocations FOR ALL
USING (public.get_auth_role() IN ('admin', 'warden'));

-- FEE CHARGES & PAYMENTS Policies
CREATE POLICY "Students view own fees; Admin views all"
ON public.fee_charges FOR SELECT
USING (public.get_auth_role() IN ('admin', 'warden') OR student_id IN (SELECT id FROM public.students WHERE profile_id = auth.uid()));

CREATE POLICY "Admin manages fees"
ON public.fee_charges FOR ALL
USING (public.get_auth_role() = 'admin');

CREATE POLICY "Students view own payments; Admin views all"
ON public.payments FOR SELECT
USING (public.get_auth_role() IN ('admin', 'warden') OR student_id IN (SELECT id FROM public.students WHERE profile_id = auth.uid()));

CREATE POLICY "Admin records payments"
ON public.payments FOR ALL
USING (public.get_auth_role() = 'admin');

-- ATTENDANCE Policies
CREATE POLICY "Students view own attendance; Staff/Admin view all"
ON public.attendance FOR SELECT
USING (public.get_auth_role() IN ('admin', 'warden', 'staff') OR student_id IN (SELECT id FROM public.students WHERE profile_id = auth.uid()));

CREATE POLICY "Staff and Warden mark attendance"
ON public.attendance FOR ALL
USING (public.get_auth_role() IN ('admin', 'warden', 'staff'));

-- LEAVE REQUESTS Policies
CREATE POLICY "Students manage own leaves; Warden reviews"
ON public.leave_requests FOR SELECT
USING (public.get_auth_role() IN ('admin', 'warden') OR student_id IN (SELECT id FROM public.students WHERE profile_id = auth.uid()));

CREATE POLICY "Students insert own leaves"
ON public.leave_requests FOR INSERT
WITH CHECK (student_id IN (SELECT id FROM public.students WHERE profile_id = auth.uid()));

CREATE POLICY "Warden reviews leaves"
ON public.leave_requests FOR UPDATE
USING (public.get_auth_role() IN ('admin', 'warden'));

-- COMPLAINTS Policies
CREATE POLICY "Students view own; Staff/Warden view all complaints"
ON public.complaints FOR SELECT
USING (public.get_auth_role() IN ('admin', 'warden', 'staff') OR student_id IN (SELECT id FROM public.students WHERE profile_id = auth.uid()));

CREATE POLICY "Students insert complaints"
ON public.complaints FOR INSERT
WITH CHECK (student_id IN (SELECT id FROM public.students WHERE profile_id = auth.uid()));

CREATE POLICY "Staff and Warden update complaints"
ON public.complaints FOR UPDATE
USING (public.get_auth_role() IN ('admin', 'warden', 'staff'));

-- NOTICES & MENUS Policies (Public to authenticated)
CREATE POLICY "All authenticated view published notices"
ON public.notices FOR SELECT
TO authenticated USING (is_published = true);

CREATE POLICY "Warden/Admin manage notices"
ON public.notices FOR ALL
USING (public.get_auth_role() IN ('admin', 'warden'));

CREATE POLICY "All view mess menus"
ON public.mess_menus FOR SELECT
TO authenticated USING (true);

CREATE POLICY "Staff/Warden manage mess menus"
ON public.mess_menus FOR ALL
USING (public.get_auth_role() IN ('admin', 'warden', 'staff'));

-- VISITORS Policies
CREATE POLICY "Staff and Warden view and record visitors"
ON public.visitors FOR ALL
USING (public.get_auth_role() IN ('admin', 'warden', 'staff'));

-- MAINTENANCE Policies
CREATE POLICY "Staff and Warden view and record maintenance"
ON public.maintenance_tasks FOR ALL
USING (public.get_auth_role() IN ('admin', 'warden', 'staff'));
