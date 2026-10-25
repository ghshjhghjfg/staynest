import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  GraduationCap,
  ShieldCheck,
  BedDouble,
  Wallet,
  Wrench,
  CalendarCheck,
  Megaphone,
  Utensils,
  Wifi,
  BookOpen,
  ArrowRight,
  Check,
  Menu,
  X,
  Play,
  Minus,
  Plus,
  Star,
  Hotel,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0); // first open by default
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'Who can apply for hostel accommodation?',
      a: 'All enrolled staynest University students can apply using their university email and student ID. Allocation is subject to availability and verification.',
    },
    {
      q: 'What is included in the monthly fee?',
      a: 'The ₹8,500 monthly fee covers ₹6,500 for accommodation and ₹2,000 for the standard mess plan.',
    },
    {
      q: 'How do room allocations work?',
      a: 'The hostel team reviews verified applications and allocates available beds based on block eligibility and preferences.',
    },
    {
      q: 'Can I request leave or invite a visitor?',
      a: 'Yes. Submit your request through the student portal. The hostel team reviews it according to residence guidelines.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#0C1629] font-sans selection:bg-[#2563EB]/20 selection:text-[#2563EB]">
      {/* 1. Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[#0C1629]">staynest</span>
              <p className="text-[10px] font-semibold text-[#6B7280] tracking-wider uppercase">
                Campus living, connected
              </p>
            </div>
          </Link>

          {/* Center Nav Items */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#why-staynest"
              className="text-sm font-medium text-[#4B5563] hover:text-[#0C1629] transition-colors"
            >
              Why staynest
            </a>
            <a
              href="#campus-life"
              className="text-sm font-medium text-[#4B5563] hover:text-[#0C1629] transition-colors"
            >
              Campus life
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-[#4B5563] hover:text-[#0C1629] transition-colors"
            >
              How it works
            </a>
            <a
              href="#faqs"
              className="text-sm font-medium text-[#4B5563] hover:text-[#0C1629] transition-colors"
            >
              FAQs
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/login?role=student"
              className="text-sm font-semibold text-[#1F2937] hover:text-[#2563EB] px-3.5 py-2 rounded-xl transition-colors"
            >
              Student login
            </Link>
            <Link
              to="/login?role=admin"
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold px-4.5 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Admin login</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#4B5563] hover:text-[#0C1629] hover:bg-[#F3F4F6] md:hidden"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#E5E7EB] bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
            <a
              href="#why-staynest"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-[#4B5563] hover:bg-[#F3F4F6] rounded-lg"
            >
              Why staynest
            </a>
            <a
              href="#campus-life"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-[#4B5563] hover:bg-[#F3F4F6] rounded-lg"
            >
              Campus life
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-[#4B5563] hover:bg-[#F3F4F6] rounded-lg"
            >
              How it works
            </a>
            <a
              href="#faqs"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-[#4B5563] hover:bg-[#F3F4F6] rounded-lg"
            >
              FAQs
            </a>
            <div className="pt-3 border-t border-[#E5E7EB] flex flex-col gap-2">
              <Link
                to="/login?role=student"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 px-4 text-sm font-semibold text-[#1F2937] border border-[#E5E7EB] rounded-xl"
              >
                Student login
              </Link>
              <Link
                to="/login?role=admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 px-4 text-sm font-semibold bg-[#2563EB] text-white rounded-xl shadow-xs"
              >
                Admin login
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section (Image 1) */}
      <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-block">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] px-3.5 py-1.5 rounded-full border border-[#DBEAFE]">
                  Welcome to staynest
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-[#0C1629] tracking-tight leading-[1.12]">
                More than a room.
                <br />
                <span className="text-[#0C1629]">A better campus life.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed max-w-xl">
                Settle into a place that feels like home. From your first room allocation to everyday hostel life,
                staynest keeps everything beautifully connected.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <Link
                  to="/register"
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm px-6 py-3.5 rounded-xl shadow-sm transition-all flex items-center gap-2"
                >
                  <span>Register as a student</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#campus-life"
                  className="bg-white hover:bg-[#F9FAFB] text-[#1F2937] font-semibold text-sm px-5 py-3.5 rounded-xl border border-[#D1D5DB] shadow-2xs transition-all flex items-center gap-2"
                >
                  <Play className="w-4 h-4 text-[#4B5563] fill-[#4B5563]/20" />
                  <span>Explore campus</span>
                </a>
              </div>

              {/* Feature Checkmarks */}
              <div className="pt-3 flex flex-wrap items-center gap-6 text-sm text-[#4B5563]">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#ECFDF5] text-[#059669] flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>Secure student access</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#ECFDF5] text-[#059669] flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>Dedicated hostel support</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Building Image with Floating Tag */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#E5E7EB] bg-[#F3F4F6] aspect-[4/3] sm:aspect-[16/11]">
                <img
                  src="/hero-building.jpg"
                  alt="staynest Campus Residence Building"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

                {/* Floating Info Card */}
                <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 shadow-xl border border-white/80 max-w-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E6F4EA] text-[#0F9D58] flex items-center justify-center shrink-0">
                    <Hotel className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#0C1629]">
                      Your next chapter starts here
                    </h4>
                    <p className="text-[11px] text-[#6B7280]">
                      3 residence blocks · One welcoming community
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Portals Section ("Less admin. More living.") (Image 2) */}
      <section id="why-staynest" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB] mb-2 block">
              One community. Two connected portals.
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0C1629] tracking-tight mb-3">
              Less admin. More living.
            </h2>
            <p className="text-base text-[#4B5563]">
              Thoughtfully designed for students and the people who make campus living possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {/* Student Portal Card */}
            <div className="bg-[#F2F6FA] border border-[#E1EBF5] rounded-3xl p-8 sm:p-10 flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white text-[#2563EB] flex items-center justify-center shadow-xs mb-6">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-[#2563EB] uppercase tracking-wider block mb-2">
                  Student portal
                </span>
                <h3 className="text-2xl font-bold text-[#0C1629] mb-3">
                  Everything for your everyday
                </h3>
                <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed mb-8">
                  Room details, payments, leave, meals and support — all from your own personal dashboard.
                </p>
              </div>
              <Link
                to="/login?role=student"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] group"
              >
                <span>Student login</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Admin Portal Card */}
            <div className="bg-[#0C1629] border border-[#1A2942] rounded-3xl p-8 sm:p-10 flex flex-col justify-between text-white hover:shadow-lg transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#1A2942] text-white flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6 text-[#60A5FA]" />
                </div>
                <span className="text-xs font-semibold text-[#93C5FD] uppercase tracking-wider block mb-2">
                  Admin portal
                </span>
                <h3 className="text-2xl font-bold text-white mb-3">
                  A clearer view of your hostel
                </h3>
                <p className="text-sm sm:text-base text-[#9CA3AF] leading-relaxed mb-8">
                  Manage residents, allocate rooms, track fees and keep operations moving in one workspace.
                </p>
              </div>
              <Link
                to="/login?role=admin"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-[#93C5FD] group"
              >
                <span>Admin login</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Feature Grid ("Everything you need. Nothing in the way.") (Image 3) */}
      <section id="features" className="py-20 bg-[#F9FAFB] border-t border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB] mb-2 block">
              Everyday essentials, connected
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0C1629] tracking-tight">
              Everything you need. Nothing in the way.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* 1. Room allocation */}
            <div className="bg-white rounded-2xl p-7 border border-[#E5E7EB] hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-5">
                <BedDouble className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0C1629] mb-2">Your space, sorted</h3>
              <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                View your room, roommates and allocation details without visiting the office.
              </p>
            </div>

            {/* 2. Fees */}
            <div className="bg-white rounded-2xl p-7 border border-[#E5E7EB] hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-5">
                <Wallet className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0C1629] mb-2">Payments made clear</h3>
              <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                Know what’s due, track every payment and keep your receipts in one place.
              </p>
            </div>

            {/* 3. Support & Grievances */}
            <div className="bg-white rounded-2xl p-7 border border-[#E5E7EB] hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-5">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0C1629] mb-2">Support that follows through</h3>
              <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                Report an issue and stay updated from submission to resolution.
              </p>
            </div>

            {/* 4. Leaves & Out-Pass */}
            <div className="bg-white rounded-2xl p-7 border border-[#E5E7EB] hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-5">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0C1629] mb-2">Requests without the paperwork</h3>
              <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                Plan leave and visitors with transparent approval status.
              </p>
            </div>

            {/* 5. Notices */}
            <div className="bg-white rounded-2xl p-7 border border-[#E5E7EB] hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-5">
                <Megaphone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0C1629] mb-2">Never miss an update</h3>
              <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                Find important announcements, events and hostel guidelines.
              </p>
            </div>

            {/* 6. Dining */}
            <div className="bg-white rounded-2xl p-7 border border-[#E5E7EB] hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-5">
                <Utensils className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0C1629] mb-2">A little less “what’s for dinner?”</h3>
              <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                See the weekly menu, meal timings and mess updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Room Showcase ("Designed for focus. Made for friendship.") (Image 4) */}
      <section id="rooms" className="py-20 bg-white border-t border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Room Photo */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl overflow-hidden shadow-xl border border-[#E5E7EB] bg-[#F3F4F6] aspect-[4/3] sm:aspect-[16/11]">
                <img
                  src="/dorm-room.jpg"
                  alt="Modern Triple-Sharing Residence Room"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

            {/* Right Column: Room Details */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB] block">
                Space to grow
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0C1629] tracking-tight leading-tight">
                Designed for focus.
                <br />
                Made for friendship.
              </h2>
              <p className="text-base text-[#4B5563] leading-relaxed">
                Comfortable triple-sharing rooms, dedicated study spaces and a community that makes the transition
                to university feel easier.
              </p>

              {/* Amenity Icons */}
              <div className="flex flex-wrap items-center gap-6 pt-1 text-sm font-medium text-[#374151]">
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-[#2563EB]" />
                  <span>Campus Wi-Fi</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#2563EB]" />
                  <span>Study spaces</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                  <span>Secure access</span>
                </div>
              </div>

              {/* Pricing Callout */}
              <div className="pt-2">
                <div className="text-2xl font-extrabold text-[#0C1629]">₹8,500 / month</div>
                <div className="text-xs text-[#6B7280] mt-1">₹6,500 room fee + ₹2,000 mess plan</div>
              </div>

              {/* CTA Button */}
              <div className="pt-2">
                <Link
                  to="/register"
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm px-6 py-3.5 rounded-xl shadow-sm transition-all inline-flex items-center gap-2"
                >
                  <span>Start your registration</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. How It Works ("Your new home, in three simple steps.") (Image 5) */}
      <section id="how-it-works" className="py-20 bg-[#F0F5FA] border-y border-[#E2EAF2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB] mb-2 block">
              From application to belonging
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0C1629] tracking-tight">
              Your new home, in three simple steps.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
            {/* Step 1 */}
            <div>
              <div className="text-4xl font-extrabold text-[#2563EB] mb-4">01</div>
              <h3 className="text-lg font-bold text-[#0C1629] mb-2">Create your student account</h3>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                Register with your university details and upload your student ID.
              </p>
            </div>

            {/* Step 2 */}
            <div>
              <div className="text-4xl font-extrabold text-[#2563EB] mb-4">02</div>
              <h3 className="text-lg font-bold text-[#0C1629] mb-2">Get your room allocation</h3>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                Our hostel team reviews your application and assigns your space.
              </p>
            </div>

            {/* Step 3 */}
            <div>
              <div className="text-4xl font-extrabold text-[#2563EB] mb-4">03</div>
              <h3 className="text-lg font-bold text-[#0C1629] mb-2">Move in and make it yours</h3>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                Access your dashboard, meet your roommates and settle into campus life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Community & Testimonial Section (Image 6) */}
      <section id="campus-life" className="bg-white">
        {/* Top Community Showcase */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Text */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB] block">
                Good days start with good company
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0C1629] tracking-tight leading-tight">
                Find your people.
                <br />
                Make your memories.
              </h2>
              <p className="text-base text-[#4B5563] leading-relaxed">
                Shared meals, late-night study sessions and friendships that last beyond graduation. Life at staynest
                is about more than where you stay.
              </p>
              <p className="text-sm font-semibold text-[#0D9488]">
                Community evenings · Sports · Student-led events
              </p>
            </div>

            {/* Right Group Photo */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl overflow-hidden shadow-xl border border-[#E5E7EB] bg-[#F3F4F6] aspect-[16/10]">
                <img
                  src="/students-group.jpg"
                  alt="Students studying and socializing together"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navy Testimonial Banner */}
        <div className="bg-[#0C1629] text-white py-18 px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* 5 Stars */}
            <div className="flex items-center justify-center gap-1.5 text-[#2DD4BF]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-xl sm:text-2xl lg:text-3xl font-medium text-white leading-relaxed tracking-normal">
              “Moving away from home felt like a big step. staynest made the little things easy, so I could focus on
              finding my feet.”
            </blockquote>

            {/* Author */}
            <p className="text-sm text-[#9CA3AF]">
              Maya Patel · Computer Science · Block A resident
            </p>
          </div>
        </div>
      </section>

      {/* 8. FAQs Section (Images 7 & 8) */}
      <section id="faqs" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB] mb-2 block">
              A little clarity before you begin
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0C1629] tracking-tight">
              Questions? We’ve got you.
            </h2>
          </div>

          {/* Accordion List */}
          <div className="divide-y divide-[#E5E7EB] border-y border-[#E5E7EB]">
            {faqs.map((faq, index) => {
              const isOpen = expandedFaq === index;
              return (
                <div key={index} className="py-5">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between text-left group gap-4 cursor-pointer"
                  >
                    <span className="text-base sm:text-lg font-bold text-[#0C1629] group-hover:text-[#2563EB] transition-colors">
                      {faq.q}
                    </span>
                    <span className="text-[#2563EB] p-1">
                      {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </span>
                  </button>
                  {isOpen && (
                    <p className="mt-3 text-sm sm:text-base text-[#4B5563] leading-relaxed max-w-3xl animate-in fade-in duration-150">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. Bottom CTA Band (Image 8) */}
      <section className="bg-[#F0F5FA] py-14 px-4 sm:px-6 lg:px-8 border-y border-[#E2EAF2]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0C1629] mb-1.5">
              Your next chapter deserves a great start.
            </h2>
            <p className="text-sm sm:text-base text-[#4B5563]">
              Applications for the 2026–27 academic year are open.
            </p>
          </div>
          <Link
            to="/register"
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm px-6 py-3.5 rounded-xl shadow-sm transition-all inline-flex items-center gap-2 shrink-0"
          >
            <ArrowRight className="w-4 h-4" />
            <span>Create student account</span>
          </Link>
        </div>
      </section>

      {/* 10. Footer (Image 8) */}
      <footer className="bg-white py-14 border-t border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
            {/* Logo */}
            <div className="md:col-span-5 space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight text-[#0C1629]">staynest</span>
              </div>
              <p className="text-[10px] font-semibold text-[#6B7280] tracking-wider uppercase">
                Campus living, connected
              </p>
            </div>

            {/* Office Contact */}
            <div className="md:col-span-4 space-y-1 text-sm text-[#4B5563]">
              <h4 className="font-bold text-[#0C1629] mb-2">Hostel office</h4>
              <p>hostel@staynest.edu · +91 80 4000 1200</p>
              <p>staynest Campus Residence, Bengaluru, India</p>
            </div>

            {/* Portal Links */}
            <div className="md:col-span-3 space-y-2 text-sm">
              <div>
                <Link
                  to="/login?role=student"
                  className="text-[#2563EB] hover:underline font-medium"
                >
                  Student portal
                </Link>
              </div>
              <div>
                <Link
                  to="/login?role=admin"
                  className="text-[#2563EB] hover:underline font-medium"
                >
                  Admin portal
                </Link>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => setShowGuidelinesModal(true)}
                  className="text-[#4B5563] hover:text-[#0C1629] hover:underline transition-colors cursor-pointer"
                >
                  Residence guidelines
                </button>
              </div>
            </div>
          </div>

          {/* Sub-footer */}
          <div className="pt-8 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B7280]">
            <p>© 2026 staynest. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <button
                onClick={() => setShowGuidelinesModal(true)}
                className="hover:underline cursor-pointer"
              >
                Privacy policy
              </button>
              <span>·</span>
              <button
                onClick={() => setShowGuidelinesModal(true)}
                className="hover:underline cursor-pointer"
              >
                Terms of residence
              </button>
              <span>·</span>
              <button
                onClick={() => setShowGuidelinesModal(true)}
                className="hover:underline cursor-pointer"
              >
                Accessibility
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Guidelines & Terms Modal */}
      {showGuidelinesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#D6DCE0] max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] mb-4">
              <h3 className="text-base font-bold text-[#0C1629]">staynest Residence Guidelines</h3>
              <button
                onClick={() => setShowGuidelinesModal(false)}
                className="p-1 rounded-md text-[#6B7280] hover:text-[#0C1629] hover:bg-[#F3F4F6]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 text-xs text-[#4B5563] leading-relaxed">
              <div>
                <h4 className="font-bold text-[#0C1629] mb-1">1. Room Allocation & Curfew</h4>
                <p>
                  Night curfew roll-call occurs daily at 21:30 hrs. Residents must ensure their attendance is logged
                  with their wing floor warden.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-[#0C1629] mb-1">2. Out-Pass & Leaves</h4>
                <p>
                  Out-pass leave requests must be submitted at least 24 hours prior via the student portal. Leaving
                  campus requires warden approval and parental emergency contact confirmation.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-[#0C1629] mb-1">3. Quiet Hours & Common Spaces</h4>
                <p>
                  Quiet study hours are strictly observed between 22:00 and 06:00 across all blocks and library study rooms.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-[#0C1629] mb-1">4. Visitors & Guests</h4>
                <p>
                  All guests must register with government ID at the security gate and exit before 19:00 hrs. Overnight guests
                  are not permitted in student residence wings.
                </p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-[#E5E7EB] flex justify-end">
              <button
                type="button"
                onClick={() => setShowGuidelinesModal(false)}
                className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-xl"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
