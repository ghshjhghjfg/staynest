import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Users,
  BedDouble,
  Wallet,
  CalendarCheck,
  ClipboardList,
  MessageSquareWarning,
  Utensils,
  UserRoundCheck,
  Wrench,
  Megaphone,
  FileBarChart,
  ShieldCheck,
  ArrowRight,
  CheckCircle,
  Menu,
  X,
  Layers,
  Sparkles,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: Users,
      title: 'Student Management',
      description: 'Maintain resident profiles, emergency contacts, guardian information, course details, and joining dates.',
    },
    {
      icon: BedDouble,
      title: 'Room Management',
      description: 'Track room capacity, occupied beds, available beds, floor information, and automated room allocations.',
    },
    {
      icon: Wallet,
      title: 'Fee Management',
      description: 'Record fee structures, installment payments, outstanding balances, due dates, and generate printable receipts.',
    },
    {
      icon: CalendarCheck,
      title: 'Daily Attendance',
      description: 'Record daily attendance sessions, track night curfews, and review monthly resident attendance summaries.',
    },
    {
      icon: ClipboardList,
      title: 'Leave Requests',
      description: 'Submit, approve, and reject student out-pass and leave applications with verification of travel reasons.',
    },
    {
      icon: MessageSquareWarning,
      title: 'Complaint Tracking',
      description: 'Submit maintenance or hostel issues, assign responsible technicians, and track end-to-end resolution.',
    },
    {
      icon: Utensils,
      title: 'Mess & Food Services',
      description: 'Publish weekly four-meal menus, track special holiday feasts, and collect structured dining hall feedback.',
    },
    {
      icon: UserRoundCheck,
      title: 'Visitor Log',
      description: 'Record visitor identification, student relationship, reason for visit, check-in, and check-out timestamps.',
    },
    {
      icon: Wrench,
      title: 'Facility Maintenance',
      description: 'Report damaged equipment, schedule repairs, manage vendor expenses, and track maintenance tasks.',
    },
    {
      icon: Megaphone,
      title: 'Notice Board',
      description: 'Broadcast urgent announcements, fee reminders, holiday closures, and maintenance schedules.',
    },
    {
      icon: FileBarChart,
      title: 'Operational Reports',
      description: 'Generate summaries for occupancy ratios, fee collections, attendance percentages, and export CSV data.',
    },
    {
      icon: ShieldCheck,
      title: 'Role-Based Access',
      description: 'Strict authorization ensuring administrators, wardens, staff, and students only access permitted data.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FEFEFE] text-[#0C1629]">
      {/* 5.1 Restrained Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#FEFEFE]/95 backdrop-blur-xs border-b border-[#D6DCE0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#0C1629] flex items-center justify-center text-white">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-[#0C1629]">staynest</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-[#727A84]">
            <a href="#features" className="hover:text-[#0C1629] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#0C1629] transition-colors">How It Works</a>
            <a href="#for-students" className="hover:text-[#0C1629] transition-colors">For Students</a>
            <a href="#for-admins" className="hover:text-[#0C1629] transition-colors">For Administrators</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs font-medium px-4 py-2 text-[#0C1629] hover:bg-[#F0F3F3] rounded-md transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-xs font-medium px-4 py-2 bg-[#0C1629] hover:bg-[#1A2942] text-white rounded-md shadow-xs transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-[#727A84] hover:text-[#0C1629] hover:bg-[#F0F3F3] md:hidden"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#D6DCE0] bg-[#FEFEFE] px-4 py-4 space-y-3">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-[#727A84] hover:text-[#0C1629]"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-[#727A84] hover:text-[#0C1629]"
            >
              How It Works
            </a>
            <a
              href="#for-students"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-[#727A84] hover:text-[#0C1629]"
            >
              For Students
            </a>
            <a
              href="#for-admins"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-[#727A84] hover:text-[#0C1629]"
            >
              For Administrators
            </a>
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                className="w-full text-center text-xs font-medium py-2 border border-[#D6DCE0] rounded-md"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="w-full text-center text-xs font-medium py-2 bg-[#0C1629] text-white rounded-md"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 5.2 Hero Section with Realistic Reference Image 2 Style Preview */}
      <section className="py-12 md:py-20 lg:py-24 bg-gradient-to-b from-[#FEFEFE] to-[#F0F3F3]/60 border-b border-[#D6DCE0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D6DCE0]/50 border border-[#D6DCE0] text-xs font-semibold text-[#0C1629]">
                <span className="w-2 h-2 rounded-full bg-[#287A52]" />
                Institutional Platform • 2026 Edition
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0C1629] leading-tight">
                Hostel management, without the daily chaos.
              </h1>
              <p className="text-base sm:text-lg text-[#727A84] leading-relaxed max-w-xl">
                Manage residents, room allocations, payments, attendance, leave requests, and hostel operations from one organized workspace.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/register"
                  className="px-6 py-3 bg-[#0C1629] hover:bg-[#1A2942] text-white rounded-lg text-sm font-semibold shadow-xs flex items-center gap-2 transition-all"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#features"
                  className="px-6 py-3 bg-white hover:bg-[#F0F3F3] text-[#0C1629] border border-[#D6DCE0] rounded-lg text-sm font-medium transition-colors"
                >
                  Explore Features
                </a>
              </div>
            </div>

            {/* Right: Realistic Dashboard Preview (Following Reference Image 2) */}
            <div className="lg:col-span-6">
              <div className="bg-[#B5C1C8] p-3 sm:p-4 rounded-xl shadow-md border border-[#D6DCE0]">
                {/* Browser/Window Bar */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/10">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                  </div>
                  <span className="text-[11px] font-medium text-[#0C1629]/70">staynest.edu/dashboard</span>
                  <div className="w-6" />
                </div>

                {/* Dashboard Frame Mockup */}
                <div className="bg-[#FEFEFE] rounded-lg overflow-hidden border border-[#D6DCE0] flex flex-col text-[11px]">
                  {/* Mock Nav Bar */}
                  <div className="bg-[#0C1629] px-3 py-2 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-[#356B9A] flex items-center justify-center font-bold text-[10px]">SN</div>
                      <span className="font-semibold text-xs">staynest System</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-[#287A52] text-[9px] font-semibold">ACTIVE</span>
                      <div className="w-5 h-5 rounded-full bg-[#1A2942] flex items-center justify-center text-[9px]">A</div>
                    </div>
                  </div>

                  <div className="p-3 bg-[#F0F3F3] space-y-3">
                    {/* Mock 4 KPI Cards matching prompt specification */}
                    <div className="grid grid-cols-4 gap-2">
                      <div className="bg-white p-2 rounded border border-[#D6DCE0]">
                        <p className="text-[10px] text-[#727A84]">Total Students</p>
                        <p className="text-base font-bold text-[#0C1629] mt-0.5">250</p>
                      </div>
                      <div className="bg-white p-2 rounded border border-[#D6DCE0]">
                        <p className="text-[10px] text-[#727A84]">Total Rooms</p>
                        <p className="text-base font-bold text-[#0C1629] mt-0.5">80</p>
                      </div>
                      <div className="bg-white p-2 rounded border border-[#D6DCE0]">
                        <p className="text-[10px] text-[#727A84]">Available Beds</p>
                        <p className="text-base font-bold text-[#287A52] mt-0.5">18</p>
                      </div>
                      <div className="bg-white p-2 rounded border border-[#D6DCE0]">
                        <p className="text-[10px] text-[#727A84]">Pending Fees</p>
                        <p className="text-base font-bold text-[#A66B16] mt-0.5">₹2.4L</p>
                      </div>
                    </div>

                    {/* Secondary Metrics */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-white p-2 rounded border border-[#D6DCE0]">
                        <p className="text-[10px] text-[#727A84]">Today's Attendance</p>
                        <p className="text-sm font-semibold text-[#0C1629] mt-0.5">94% Present</p>
                      </div>
                      <div className="bg-white p-2 rounded border border-[#D6DCE0]">
                        <p className="text-[10px] text-[#727A84]">Pending Leaves</p>
                        <p className="text-sm font-semibold text-[#A66B16] mt-0.5">2 Requests</p>
                      </div>
                      <div className="bg-white p-2 rounded border border-[#D6DCE0]">
                        <p className="text-[10px] text-[#727A84]">Open Complaints</p>
                        <p className="text-sm font-semibold text-[#0C1629] mt-0.5">3 Assigned</p>
                      </div>
                    </div>

                    {/* Mock Table */}
                    <div className="bg-white rounded border border-[#D6DCE0] overflow-hidden">
                      <div className="px-2.5 py-1.5 border-b border-[#D6DCE0] flex items-center justify-between bg-gray-50/50">
                        <span className="font-semibold text-[#0C1629]">Recent Resident Activity</span>
                        <span className="text-[9px] text-[#727A84]">Live RLS</span>
                      </div>
                      <div className="divide-y divide-[#D6DCE0]/60">
                        <div className="px-2.5 py-1.5 flex items-center justify-between">
                          <div>
                            <span className="font-medium text-[#0C1629]">Ananya Rao</span>
                            <span className="text-[#727A84] ml-1.5">(Room A-101)</span>
                          </div>
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#287A52]/10 text-[#287A52] font-semibold">Fee Paid</span>
                        </div>
                        <div className="px-2.5 py-1.5 flex items-center justify-between">
                          <div>
                            <span className="font-medium text-[#0C1629]">Kiran Kumar</span>
                            <span className="text-[#727A84] ml-1.5">(Room A-101)</span>
                          </div>
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#A66B16]/10 text-[#A66B16] font-semibold">Leave Pending</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5.3 Trust & Benefits Strip */}
      <section className="py-6 bg-[#FEFEFE] border-b border-[#D6DCE0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-[#F0F3F3] border border-[#D6DCE0] flex items-center justify-center shrink-0">
                <CheckCircle className="w-4 h-4 text-[#287A52]" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-[#0C1629]">One place for hostel operations</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-[#F0F3F3] border border-[#D6DCE0] flex items-center justify-center shrink-0">
                <CheckCircle className="w-4 h-4 text-[#287A52]" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-[#0C1629]">Clear room availability</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-[#F0F3F3] border border-[#D6DCE0] flex items-center justify-center shrink-0">
                <CheckCircle className="w-4 h-4 text-[#287A52]" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-[#0C1629]">Trackable fees and requests</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-[#F0F3F3] border border-[#D6DCE0] flex items-center justify-center shrink-0">
                <CheckCircle className="w-4 h-4 text-[#287A52]" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-[#0C1629]">Role-based access</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5.4 Features Section */}
      <section id="features" className="py-16 md:py-24 bg-[#F0F3F3]/40 border-b border-[#D6DCE0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0C1629]">
              Everything your hostel needs to run smoothly.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#727A84]">
              Replace scattered registers and repetitive follow-ups with one organized system.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-lg border border-[#D6DCE0] shadow-xs hover:border-[#0C1629]/40 transition-colors"
                >
                  <div className="w-10 h-10 rounded-md bg-[#F0F3F3] border border-[#D6DCE0] flex items-center justify-center text-[#0C1629] mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-[#0C1629] mb-2">{feat.title}</h3>
                  <p className="text-xs sm:text-sm text-[#727A84] leading-relaxed">{feat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5.5 How It Works (Four-Step Process) */}
      <section id="how-it-works" className="py-16 md:py-24 bg-[#FEFEFE] border-b border-[#D6DCE0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold text-[#356B9A] uppercase tracking-wider">Workflow</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0C1629] mt-1">
              How staynest works
            </h2>
            <p className="mt-2 text-sm text-[#727A84]">
              A straightforward progression from student admission to daily campus welfare.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-lg border border-[#D6DCE0] bg-[#F0F3F3]/30">
              <span className="text-xs font-mono font-bold text-[#727A84] bg-white px-2 py-1 rounded border border-[#D6DCE0]">
                STEP 01
              </span>
              <h3 className="text-base font-semibold text-[#0C1629] mt-4 mb-2">Register or sign in</h3>
              <p className="text-xs text-[#727A84] leading-relaxed">
                Students create accounts using their roll number and institutional email credentials.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-[#D6DCE0] bg-[#F0F3F3]/30">
              <span className="text-xs font-mono font-bold text-[#727A84] bg-white px-2 py-1 rounded border border-[#D6DCE0]">
                STEP 02
              </span>
              <h3 className="text-base font-semibold text-[#0C1629] mt-4 mb-2">Complete student profile</h3>
              <p className="text-xs text-[#727A84] leading-relaxed">
                Provide academic year, department, emergency contacts, and verified guardian details.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-[#D6DCE0] bg-[#F0F3F3]/30">
              <span className="text-xs font-mono font-bold text-[#727A84] bg-white px-2 py-1 rounded border border-[#D6DCE0]">
                STEP 03
              </span>
              <h3 className="text-base font-semibold text-[#0C1629] mt-4 mb-2">Receive room allocation</h3>
              <p className="text-xs text-[#727A84] leading-relaxed">
                Warden verifies documents and allocates an available bed without overbooking conflicts.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-[#D6DCE0] bg-[#F0F3F3]/30">
              <span className="text-xs font-mono font-bold text-[#727A84] bg-white px-2 py-1 rounded border border-[#D6DCE0]">
                STEP 04
              </span>
              <h3 className="text-base font-semibold text-[#0C1629] mt-4 mb-2">Manage daily activities</h3>
              <p className="text-xs text-[#727A84] leading-relaxed">
                Submit leaves, log maintenance issues, review dining menus, and track fee records seamlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5.6 Role-Specific Breakdown */}
      <section className="py-16 md:py-24 bg-[#F0F3F3]/50 border-b border-[#D6DCE0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Students */}
            <div id="for-students" className="bg-white p-7 rounded-xl border border-[#D6DCE0] shadow-xs">
              <div className="inline-block px-3 py-1 bg-[#356B9A]/10 text-[#356B9A] text-xs font-semibold rounded mb-3">
                For Students
              </div>
              <h3 className="text-xl font-bold text-[#0C1629] mb-4">Empowering resident life</h3>
              <ul className="space-y-3 text-xs sm:text-sm text-[#727A84]">
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#287A52] shrink-0 mt-0.5" />
                  <span>View assigned room details, roommates, and inventory.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#287A52] shrink-0 mt-0.5" />
                  <span>Track fee schedules, verified payment receipts, and due dates.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#287A52] shrink-0 mt-0.5" />
                  <span>Check personal attendance and roll-call history.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#287A52] shrink-0 mt-0.5" />
                  <span>Submit leave and out-pass applications with instant status tracking.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#287A52] shrink-0 mt-0.5" />
                  <span>Raise maintenance complaints and monitor technician updates.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#287A52] shrink-0 mt-0.5" />
                  <span>Read published weekly mess menus and submit dining feedback.</span>
                </li>
              </ul>
            </div>

            {/* For Administrators */}
            <div id="for-admins" className="bg-white p-7 rounded-xl border border-[#D6DCE0] shadow-xs">
              <div className="inline-block px-3 py-1 bg-[#0C1629]/10 text-[#0C1629] text-xs font-semibold rounded mb-3">
                For Administrators & Wardens
              </div>
              <h3 className="text-xl font-bold text-[#0C1629] mb-4">Total operational governance</h3>
              <ul className="space-y-3 text-xs sm:text-sm text-[#727A84]">
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#287A52] shrink-0 mt-0.5" />
                  <span>Manage student records, guardian emergency contacts, and departments.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#287A52] shrink-0 mt-0.5" />
                  <span>Allocate rooms with automated bed capacity and double-booking checks.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#287A52] shrink-0 mt-0.5" />
                  <span>Record and audit payment receipts with exact balance computations.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#287A52] shrink-0 mt-0.5" />
                  <span>Review and approve student out-pass and overnight leave requests.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#287A52] shrink-0 mt-0.5" />
                  <span>Monitor daily night attendance and track absent residents.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#287A52] shrink-0 mt-0.5" />
                  <span>Export institutional reports for occupancy, dues, and visitor logs.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5.7 Final CTA */}
      <section className="py-16 md:py-20 bg-[#0C1629] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Bring your hostel operations into one workspace.
          </h2>
          <p className="text-sm sm:text-base text-[#B5C1C8] max-w-xl mx-auto">
            Experience reliable student registration, accurate room allocations, transparent fee records, and peace of mind.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-3 pt-2">
            <Link
              to="/register"
              className="px-6 py-3 bg-white text-[#0C1629] hover:bg-[#F0F3F3] rounded-lg text-sm font-semibold shadow-xs transition-colors"
            >
              Student Registration
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 bg-[#1A2942] hover:bg-[#25395a] text-white border border-[#356B9A]/40 rounded-lg text-sm font-medium transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* 5.8 Footer */}
      <footer className="py-10 bg-[#FEFEFE] border-t border-[#D6DCE0] text-xs text-[#727A84]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#0C1629] flex items-center justify-center text-white font-bold">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-[#0C1629] text-sm">staynest</span>
              <span className="text-[#D6DCE0]">|</span>
              <span>Hostel Administration and Student Welfare Management</span>
            </div>

            <div className="flex items-center gap-6">
              <a href="#features" className="hover:text-[#0C1629] transition-colors">Features</a>
              <Link to="/login" className="hover:text-[#0C1629] transition-colors">Login</Link>
              <Link to="/register" className="hover:text-[#0C1629] transition-colors">Registration</Link>
              <span className="hover:text-[#0C1629] cursor-pointer">Privacy Policy</span>
              <span className="hover:text-[#0C1629] cursor-pointer">Terms of Service</span>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-[#D6DCE0] text-center text-[11px] text-[#727A84]">
            © {new Date().getFullYear()} staynest Systems. Designed for institutional efficiency and student welfare.
          </div>
        </div>
      </footer>
    </div>
  );
};
