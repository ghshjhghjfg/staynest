import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  BedDouble,
  Wallet,
  CalendarCheck,
  ClipboardList,
  MessageSquareWarning,
  Wrench,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Utensils,
  ChevronRight,
  Shield,
  Plus,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useAuth } from '../features/auth/AuthContext';
import { dataStore } from '../services/dataStore';
import { formatINR } from '../lib/formatters';

export const DashboardPage: React.FC = () => {
  const { currentUser, role } = useAuth();
  const [, setRefreshKey] = useState(0);

  // Subscribe to local store updates
  useEffect(() => {
    const handleUpdate = () => setRefreshKey((k) => k + 1);
    window.addEventListener('staynest_store_updated', handleUpdate);
    return () => window.removeEventListener('staynest_store_updated', handleUpdate);
  }, []);

  const students = dataStore.getStudents();
  const rooms = dataStore.getRooms();
  const feeCharges = dataStore.getFeeCharges();
  const payments = dataStore.getPayments();
  const attendance = dataStore.getAttendance();
  const leaves = dataStore.getLeaves();
  const complaints = dataStore.getComplaints();
  const maintenance = dataStore.getMaintenanceTasks();
  const notices = dataStore.getNotices();
  const messMenus = dataStore.getMessMenus();

  // Aggregate metrics
  const totalStudents = students.length;
  const totalRooms = rooms.length;
  const totalBeds = rooms.reduce((acc, r) => acc + r.capacity, 0);
  const occupiedBeds = rooms.reduce((acc, r) => acc + r.occupied_beds, 0);
  const availableBeds = rooms.reduce((acc, r) => acc + r.available_beds, 0);

  const totalCharges = feeCharges.reduce((acc, f) => acc + f.amount, 0);
  const totalCollected = payments
    .filter((p) => p.payment_status === 'Confirmed')
    .reduce((acc, p) => acc + p.amount, 0);
  const outstandingFees = Math.max(0, totalCharges - totalCollected);

  // Attendance metrics
  const todayStr = '2026-10-25';
  const todayAttendance = attendance.filter((a) => a.attendance_date === todayStr);
  const presentCount = todayAttendance.filter((a) => a.status === 'Present').length;
  const absentCount = todayAttendance.filter((a) => a.status === 'Absent').length;
  const attendancePercent =
    todayAttendance.length > 0 ? Math.round((presentCount / todayAttendance.length) * 100) : 94;

  // Pending items
  const pendingLeaves = leaves.filter((l) => l.status === 'Pending').length;
  const unresolvedComplaints = complaints.filter(
    (c) => c.status === 'Submitted' || c.status === 'Assigned' || c.status === 'In Progress'
  ).length;
  const pendingMaintenance = maintenance.filter((m) => m.status !== 'Completed' && m.status !== 'Cancelled').length;

  // Chart Data: Students per floor
  const floorData = [
    { floor: '1st Floor', students: rooms.filter((r) => r.floor === 1).reduce((s, r) => s + r.occupied_beds, 0) },
    { floor: '2nd Floor', students: rooms.filter((r) => r.floor === 2).reduce((s, r) => s + r.occupied_beds, 0) },
    { floor: '3rd Floor', students: rooms.filter((r) => r.floor === 3).reduce((s, r) => s + r.occupied_beds, 0) },
    { floor: '4th Floor', students: 0 },
  ];

  // Chart Data: Room Occupancy Pie
  const occupancyPieData = [
    { name: 'Occupied', value: occupiedBeds, color: '#0C1629' },
    { name: 'Available', value: availableBeds, color: '#287A52' },
  ];

  // Chart Data: Complaints by Category
  const categoryCounts = complaints.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const complaintChartData = Object.keys(categoryCounts).map((cat, i) => ({
    name: cat,
    value: categoryCounts[cat],
    color: ['#0C1629', '#356B9A', '#A66B16', '#287A52', '#B54747'][i % 5],
  }));

  // Monthly Attendance Trend
  const monthlyTrendData = [
    { month: 'Jun', attendance: 92 },
    { month: 'Jul', attendance: 95 },
    { month: 'Aug', attendance: 91 },
    { month: 'Sep', attendance: 94 },
    { month: 'Oct', attendance: 96 },
  ];

  // Recent 4 Activity Items
  const recentActivities = [
    { title: 'Room Allocation', desc: 'Ananya Rao assigned to Room A-101 (Bed-1)', time: '2h ago', icon: BedDouble },
    { title: 'Fee Payment', desc: 'REC-2026-1092 verified for ₹35,000', time: '3h ago', icon: Wallet },
    { title: 'Leave Application', desc: 'Meera Nair approved for weekend visit', time: '5h ago', icon: ClipboardList },
    { title: 'Maintenance Logged', desc: 'Wing A overhead tank float valve repair', time: '1d ago', icon: Wrench },
  ];

  // If role is Student, show personalized student resident view
  if (role === 'student') {
    const studentInfo = students.find((s) => s.email === currentUser?.email) || students[0];
    const myCharges = feeCharges.filter((c) => c.student_id === studentInfo.id);
    const myPayments = payments.filter((p) => p.student_id === studentInfo.id);
    const myDue = myCharges.reduce((s, c) => s + c.amount, 0) - myPayments.reduce((s, p) => s + p.amount, 0);
    const myLeaves = leaves.filter((l) => l.student_id === studentInfo.id);
    const myComplaints = complaints.filter((c) => c.student_id === studentInfo.id);

    return (
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-white p-5 rounded-xl border border-[#D6DCE0] shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-[#356B9A] uppercase tracking-wider">Student Resident Portal</span>
            <h2 className="text-xl font-bold text-[#0C1629] mt-0.5">Welcome back, {studentInfo.full_name}</h2>
            <p className="text-xs text-[#727A84] mt-1">
              Roll No: <span className="font-semibold text-[#0C1629]">{studentInfo.student_code}</span> • {studentInfo.department} ({studentInfo.academic_year})
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/dashboard/leaves"
              className="px-3.5 py-2 bg-[#0C1629] hover:bg-[#1A2942] text-white rounded-md text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Apply Out-Pass</span>
            </Link>
            <Link
              to="/dashboard/complaints"
              className="px-3.5 py-2 bg-white hover:bg-[#F0F3F3] border border-[#D6DCE0] text-[#0C1629] rounded-md text-xs font-medium transition-colors"
            >
              Raise Complaint
            </Link>
          </div>
        </div>

        {/* Student KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-[#D6DCE0] shadow-xs">
            <div className="flex items-center justify-between text-[#727A84]">
              <span className="text-xs font-medium">Assigned Room</span>
              <BedDouble className="w-4 h-4 text-[#356B9A]" />
            </div>
            <p className="text-2xl font-bold text-[#0C1629] mt-2">
              {studentInfo.room_number || 'Unallocated'}
            </p>
            <p className="text-[11px] text-[#727A84] mt-1">{studentInfo.bed_identifier || 'Awaiting assignment'}</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#D6DCE0] shadow-xs">
            <div className="flex items-center justify-between text-[#727A84]">
              <span className="text-xs font-medium">Fee Balance</span>
              <Wallet className="w-4 h-4 text-[#287A52]" />
            </div>
            <p className="text-2xl font-bold text-[#0C1629] mt-2">{formatINR(Math.max(0, myDue))}</p>
            <span
              className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded ${
                myDue <= 0 ? 'bg-[#287A52]/10 text-[#287A52]' : 'bg-[#A66B16]/10 text-[#A66B16]'
              }`}
            >
              {myDue <= 0 ? 'All Dues Cleared' : 'Payment Due'}
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#D6DCE0] shadow-xs">
            <div className="flex items-center justify-between text-[#727A84]">
              <span className="text-xs font-medium">Monthly Attendance</span>
              <CalendarCheck className="w-4 h-4 text-[#0C1629]" />
            </div>
            <p className="text-2xl font-bold text-[#0C1629] mt-2">96%</p>
            <p className="text-[11px] text-[#287A52] font-medium mt-1">Full compliance (Above 85% rule)</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#D6DCE0] shadow-xs">
            <div className="flex items-center justify-between text-[#727A84]">
              <span className="text-xs font-medium">Active Requests</span>
              <ClipboardList className="w-4 h-4 text-[#A66B16]" />
            </div>
            <p className="text-2xl font-bold text-[#0C1629] mt-2">
              {myLeaves.filter((l) => l.status === 'Pending').length + myComplaints.filter((c) => c.status !== 'Resolved').length}
            </p>
            <p className="text-[11px] text-[#727A84] mt-1">Leaves & complaints in review</p>
          </div>
        </div>

        {/* Student Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Mess Menu */}
          <div className="bg-white rounded-xl border border-[#D6DCE0] p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#D6DCE0]">
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-[#356B9A]" />
                <h3 className="font-semibold text-sm text-[#0C1629]">Today's Dining Menu (Sunday)</h3>
              </div>
              <Link to="/dashboard/mess" className="text-xs text-[#356B9A] hover:underline font-medium">
                Weekly Menu
              </Link>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-2.5 rounded bg-[#F0F3F3]">
                <span className="font-semibold text-[#0C1629] block">Breakfast (7:30 AM - 9:30 AM)</span>
                <span className="text-[#727A84]">{messMenus[6]?.breakfast}</span>
              </div>
              <div className="p-2.5 rounded bg-[#F0F3F3]">
                <span className="font-semibold text-[#0C1629] block">Lunch (12:30 PM - 2:30 PM)</span>
                <span className="text-[#727A84]">{messMenus[6]?.lunch}</span>
              </div>
              <div className="p-2.5 rounded bg-[#F0F3F3]">
                <span className="font-semibold text-[#0C1629] block">Dinner (7:30 PM - 9:30 PM)</span>
                <span className="text-[#727A84]">{messMenus[6]?.dinner}</span>
              </div>
            </div>
          </div>

          {/* Important Notices */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-[#D6DCE0] p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#D6DCE0]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0C1629]" />
                <h3 className="font-semibold text-sm text-[#0C1629]">Hostel Notice Board</h3>
              </div>
              <Link to="/dashboard/notices" className="text-xs text-[#356B9A] hover:underline font-medium">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {notices.slice(0, 3).map((notice) => (
                <div key={notice.id} className="p-3 rounded-lg border border-[#D6DCE0] bg-[#F0F3F3]/40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#0C1629]">{notice.title}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        notice.is_emergency ? 'bg-[#B54747]/10 text-[#B54747]' : 'bg-[#356B9A]/10 text-[#356B9A]'
                      }`}
                    >
                      {notice.category}
                    </span>
                  </div>
                  <p className="text-xs text-[#727A84] mt-1.5 line-clamp-2">{notice.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Administrator / Warden / Staff Dashboard Overview
  return (
    <div className="space-y-6">
      {/* 4 Main KPI Cards (Matching Reference Image 2 & Section 8.2 Specs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <Link
          to="/dashboard/students"
          className="bg-white p-4 rounded-xl border border-[#D6DCE0] shadow-xs hover:border-[#0C1629]/40 transition-colors group"
        >
          <div className="flex items-center justify-between text-[#727A84]">
            <span className="text-xs font-medium">Total Students</span>
            <div className="w-8 h-8 rounded-lg bg-[#F0F3F3] flex items-center justify-center text-[#0C1629] group-hover:bg-[#0C1629] group-hover:text-white transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-[#0C1629] mt-2">{totalStudents}</p>
          <p className="text-[11px] text-[#727A84] mt-1 flex items-center gap-1">
            <span className="text-[#287A52] font-semibold">Active Residents</span> • Across 3 wings
          </p>
        </Link>

        {/* Total Rooms */}
        <Link
          to="/dashboard/rooms"
          className="bg-white p-4 rounded-xl border border-[#D6DCE0] shadow-xs hover:border-[#0C1629]/40 transition-colors group"
        >
          <div className="flex items-center justify-between text-[#727A84]">
            <span className="text-xs font-medium">Total Rooms</span>
            <div className="w-8 h-8 rounded-lg bg-[#F0F3F3] flex items-center justify-center text-[#0C1629] group-hover:bg-[#0C1629] group-hover:text-white transition-colors">
              <BedDouble className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-[#0C1629] mt-2">{totalRooms}</p>
          <p className="text-[11px] text-[#727A84] mt-1">
            Total capacity: <span className="font-semibold text-[#0C1629]">{totalBeds} beds</span>
          </p>
        </Link>

        {/* Available Beds */}
        <Link
          to="/dashboard/rooms"
          className="bg-white p-4 rounded-xl border border-[#D6DCE0] shadow-xs hover:border-[#0C1629]/40 transition-colors group"
        >
          <div className="flex items-center justify-between text-[#727A84]">
            <span className="text-xs font-medium">Available Beds</span>
            <div className="w-8 h-8 rounded-lg bg-[#287A52]/10 flex items-center justify-center text-[#287A52]">
              <BedDouble className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-[#287A52] mt-2">{availableBeds}</p>
          <p className="text-[11px] text-[#727A84] mt-1">
            {occupiedBeds} occupied ({Math.round((occupiedBeds / (totalBeds || 1)) * 100)}% occupancy)
          </p>
        </Link>

        {/* Pending Fees */}
        <Link
          to="/dashboard/fees"
          className="bg-white p-4 rounded-xl border border-[#D6DCE0] shadow-xs hover:border-[#0C1629]/40 transition-colors group"
        >
          <div className="flex items-center justify-between text-[#727A84]">
            <span className="text-xs font-medium">Pending Fees</span>
            <div className="w-8 h-8 rounded-lg bg-[#A66B16]/10 flex items-center justify-center text-[#A66B16]">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-[#A66B16] mt-2">{formatINR(outstandingFees)}</p>
          <p className="text-[11px] text-[#727A84] mt-1">
            Collected: <span className="font-semibold text-[#287A52]">{formatINR(totalCollected)}</span>
          </p>
        </Link>
      </div>

      {/* Secondary Metrics Row (Attendance, Pending Leaves, Complaints) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Today's Attendance */}
        <div className="bg-white p-4 rounded-xl border border-[#D6DCE0] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-[#727A84] font-medium">Today's Attendance</span>
            <p className="text-xl font-bold text-[#0C1629] mt-1">{attendancePercent}% Present</p>
            <span className="text-[11px] text-[#727A84]">
              {presentCount} present • {absentCount} absent
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#287A52]/10 flex items-center justify-center text-[#287A52]">
            <CalendarCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Pending Leave Requests */}
        <Link
          to="/dashboard/leaves"
          className="bg-white p-4 rounded-xl border border-[#D6DCE0] shadow-xs flex items-center justify-between hover:border-[#0C1629]/30 transition-colors"
        >
          <div>
            <span className="text-xs text-[#727A84] font-medium">Pending Leaves</span>
            <p className="text-xl font-bold text-[#A66B16] mt-1">{pendingLeaves} Awaiting Review</p>
            <span className="text-[11px] text-[#727A84]">Click to approve / reject</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#A66B16]/10 flex items-center justify-center text-[#A66B16]">
            <ClipboardList className="w-5 h-5" />
          </div>
        </Link>

        {/* Unresolved Complaints */}
        <Link
          to="/dashboard/complaints"
          className="bg-white p-4 rounded-xl border border-[#D6DCE0] shadow-xs flex items-center justify-between hover:border-[#0C1629]/30 transition-colors"
        >
          <div>
            <span className="text-xs text-[#727A84] font-medium">Open Complaints</span>
            <p className="text-xl font-bold text-[#0C1629] mt-1">{unresolvedComplaints} In Progress</p>
            <span className="text-[11px] text-[#727A84]">{pendingMaintenance} maintenance tasks</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#356B9A]/10 flex items-center justify-center text-[#356B9A]">
            <MessageSquareWarning className="w-5 h-5" />
          </div>
        </Link>
      </div>

      {/* Main Charts & Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Students per Floor Bar Chart */}
        <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-[#D6DCE0] shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#D6DCE0]">
            <div>
              <h3 className="text-sm font-semibold text-[#0C1629]">Students Distribution by Floor</h3>
              <p className="text-xs text-[#727A84]">Current occupied capacity across hostel floors</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#F0F3F3] text-[#727A84]">
              Wings A & B
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={floorData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="floor" tick={{ fontSize: 11, fill: '#727A84' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#727A84' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0C1629', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="students" fill="#0C1629" radius={[4, 4, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Room Occupancy Donut */}
        <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-[#D6DCE0] shadow-xs flex flex-col justify-between">
          <div className="pb-3 border-b border-[#D6DCE0]">
            <h3 className="text-sm font-semibold text-[#0C1629]">Bed Occupancy Ratio</h3>
            <p className="text-xs text-[#727A84]">Total Capacity: {totalBeds} Beds</p>
          </div>
          <div className="h-52 w-full my-auto flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={occupancyPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {occupancyPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0C1629', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-around pt-3 border-t border-[#D6DCE0] text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#0C1629]" />
              <span className="text-[#727A84]">Occupied: <strong className="text-[#0C1629]">{occupiedBeds}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#287A52]" />
              <span className="text-[#727A84]">Available: <strong className="text-[#287A52]">{availableBeds}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Row: Complaints breakdown + Monthly Attendance + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Complaints Breakdown */}
        <div className="bg-white p-5 rounded-xl border border-[#D6DCE0] shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#D6DCE0]">
            <h3 className="text-sm font-semibold text-[#0C1629]">Complaints by Category</h3>
            <Link to="/dashboard/complaints" className="text-xs text-[#356B9A] hover:underline font-medium">
              View All
            </Link>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={complaintChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={65}
                  innerRadius={30}
                  dataKey="value"
                >
                  {complaintChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0C1629', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Attendance Trend */}
        <div className="bg-white p-5 rounded-xl border border-[#D6DCE0] shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#D6DCE0]">
            <h3 className="text-sm font-semibold text-[#0C1629]">Monthly Attendance Trend</h3>
            <span className="text-[11px] text-[#287A52] font-semibold">Avg 93.6%</span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#727A84' }} axisLine={false} tickLine={false} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 11, fill: '#727A84' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0C1629', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                />
                <Line
                  type="monotone"
                  dataKey="attendance"
                  stroke="#356B9A"
                  strokeWidth={2.5}
                  dot={{ fill: '#356B9A', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Resident Activity */}
        <div className="bg-white p-5 rounded-xl border border-[#D6DCE0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#D6DCE0]">
            <h3 className="text-sm font-semibold text-[#0C1629]">Recent Hostel Operations</h3>
            <span className="text-[10px] text-[#727A84] font-mono">AUDIT LOG</span>
          </div>
          <div className="divide-y divide-[#D6DCE0]/60 my-2">
            {recentActivities.map((act, i) => {
              const Icon = act.icon;
              return (
                <div key={i} className="py-2.5 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-md bg-[#F0F3F3] border border-[#D6DCE0] flex items-center justify-center text-[#0C1629] shrink-0 mt-0.5">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[#0C1629] leading-tight">{act.title}</p>
                    <p className="text-[11px] text-[#727A84] truncate">{act.desc}</p>
                  </div>
                  <span className="text-[10px] text-[#727A84] shrink-0">{act.time}</span>
                </div>
              );
            })}
          </div>
          <div className="pt-2 border-t border-[#D6DCE0]">
            <Link
              to="/dashboard/reports"
              className="text-xs text-[#356B9A] hover:underline font-medium flex items-center justify-center gap-1"
            >
              <span>Download Operational Report</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
