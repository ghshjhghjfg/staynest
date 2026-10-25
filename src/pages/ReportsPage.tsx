import React, { useState } from 'react';
import {
  FileBarChart,
  Download,
  Printer,
  Calendar,
  Users,
  BedDouble,
  Wallet,
  ClipboardList,
  Wrench,
  CheckCircle2,
} from 'lucide-react';
import { dataStore } from '../services/dataStore';
import { formatINR } from '../lib/formatters';

export const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState('occupancy');

  const students = dataStore.getStudents();
  const rooms = dataStore.getRooms();
  const feeCharges = dataStore.getFeeCharges();
  const payments = dataStore.getPayments();
  const attendance = dataStore.getAttendance();
  const leaves = dataStore.getLeaves();
  const complaints = dataStore.getComplaints();
  const maintenance = dataStore.getMaintenanceTasks();
  const visitors = dataStore.getVisitors();

  // Metrics
  const totalStudents = students.length;
  const totalBeds = rooms.reduce((acc, r) => acc + r.capacity, 0);
  const occupiedBeds = rooms.reduce((acc, r) => acc + r.occupied_beds, 0);
  const availableBeds = rooms.reduce((acc, r) => acc + r.available_beds, 0);

  const totalBilled = feeCharges.reduce((acc, f) => acc + f.amount, 0);
  const totalCollected = payments
    .filter((p) => p.payment_status === 'Confirmed')
    .reduce((acc, p) => acc + p.amount, 0);
  const outstanding = Math.max(0, totalBilled - totalCollected);

  const handleDownloadCSV = (type: string) => {
    if (type === 'students') {
      const headers = ['Student ID', 'Full Name', 'Department', 'Year', 'Room', 'Fee Status'];
      const rows = students.map((s) => [s.student_code, s.full_name, s.department, s.academic_year, s.room_number || 'None', s.fee_status]);
      dataStore.exportToCSV('staynest_student_directory_report', headers, rows);
    } else if (type === 'occupancy') {
      const headers = ['Room Number', 'Building', 'Floor', 'Capacity', 'Occupied', 'Available', 'Type'];
      const rows = rooms.map((r) => [r.room_number, r.building, r.floor, r.capacity, r.occupied_beds, r.available_beds, r.room_type]);
      dataStore.exportToCSV('staynest_occupancy_report', headers, rows);
    } else if (type === 'fees') {
      const headers = ['Receipt No', 'Student', 'Category', 'Amount (INR)', 'Method', 'Date', 'Status'];
      const rows = payments.map((p) => [p.receipt_number, p.student_name, p.fee_category, p.amount, p.payment_method, p.recorded_at, p.payment_status]);
      dataStore.exportToCSV('staynest_fee_collections_report', headers, rows);
    } else if (type === 'attendance') {
      const headers = ['Date', 'Student', 'Room', 'Status', 'Logged By'];
      const rows = attendance.map((a) => [a.attendance_date, a.student_name, a.room_number, a.status, a.recorded_by]);
      dataStore.exportToCSV('staynest_attendance_audit_report', headers, rows);
    } else if (type === 'leaves') {
      const headers = ['ID', 'Student', 'Dates', 'Reason', 'Destination', 'Status', 'Reviewer'];
      const rows = leaves.map((l) => [l.id, l.student_name, `${l.start_date} to ${l.end_date}`, l.reason, l.destination, l.status, l.reviewed_by || 'Pending']);
      dataStore.exportToCSV('staynest_leave_records_report', headers, rows);
    } else if (type === 'maintenance') {
      const headers = ['Task ID', 'Title', 'Category', 'Location', 'Priority', 'Status', 'Cost (INR)', 'Assigned Staff'];
      const rows = maintenance.map((m) => [m.id, m.title, m.category, m.location, m.priority, m.status, m.cost || 0, m.assigned_to || 'None']);
      dataStore.exportToCSV('staynest_maintenance_audit_report', headers, rows);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl font-bold text-[#0C1629]">Hostel Analytics & Reporting Center</h2>
          <p className="text-xs text-[#727A84]">
            Generate official audits for occupancy, accounts, night curfew compliance, and grievances
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-[#0C1629] hover:bg-[#1A2942] text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Current Report</span>
          </button>
        </div>
      </div>

      {/* Select Report Hub Cards (no-print) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 no-print">
        {[
          { id: 'occupancy', label: 'Room Occupancy', icon: BedDouble, count: `${occupiedBeds}/${totalBeds}` },
          { id: 'students', label: 'Residents List', icon: Users, count: totalStudents },
          { id: 'fees', label: 'Collections & Dues', icon: Wallet, count: formatINR(totalCollected) },
          { id: 'attendance', label: 'Daily Attendance', icon: Calendar, count: '94% Avg' },
          { id: 'leaves', label: 'Leave Out-Passes', icon: ClipboardList, count: leaves.length },
          { id: 'maintenance', label: 'Maintenance Tasks', icon: Wrench, count: maintenance.length },
        ].map((item) => {
          const Icon = item.icon;
          const isSelected = reportType === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setReportType(item.id)}
              className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-[#0C1629] text-white border-[#0C1629] shadow-xs'
                  : 'bg-white text-[#0C1629] border-[#D6DCE0] hover:border-[#0C1629]/40'
              }`}
            >
              <Icon className={`w-4 h-4 mb-2 ${isSelected ? 'text-white' : 'text-[#727A84]'}`} />
              <p className="font-semibold text-xs leading-tight">{item.label}</p>
              <p className={`text-[11px] mt-1 ${isSelected ? 'text-[#B5C1C8]' : 'text-[#727A84]'}`}>
                {item.count}
              </p>
            </button>
          );
        })}
      </div>

      {/* Printable Report Content Container */}
      <div className="bg-white rounded-xl border border-[#D6DCE0] p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 mb-4 border-b border-[#D6DCE0]">
          <div>
            <span className="text-[10px] font-bold text-[#727A84] uppercase tracking-wider">
              staynest Official Audit Report
            </span>
            <h3 className="font-bold text-base text-[#0C1629] capitalize mt-0.5">
              {reportType.replace('-', ' ')} Summary Ledger
            </h3>
            <p className="text-xs text-[#727A84]">
              Generated on {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} • Authorized by Warden Administration
            </p>
          </div>
          <button
            onClick={() => handleDownloadCSV(reportType)}
            className="no-print mt-2 sm:mt-0 px-3 py-1.5 border border-[#D6DCE0] hover:bg-[#F0F3F3] text-[#0C1629] rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#727A84]" />
            <span>Download Filtered CSV</span>
          </button>
        </div>

        {/* Dynamic Table based on reportType */}
        {reportType === 'occupancy' && (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#F0F3F3] text-[#727A84] uppercase text-[10px] font-semibold border-b border-[#D6DCE0]">
                <tr>
                  <th className="py-2.5 px-3">Room</th>
                  <th className="py-2.5 px-3">Wing & Floor</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Capacity</th>
                  <th className="py-2.5 px-3">Occupied</th>
                  <th className="py-2.5 px-3">Available</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D6DCE0]/60">
                {rooms.map((r) => (
                  <tr key={r.id}>
                    <td className="py-2.5 px-3 font-bold text-[#0C1629]">{r.room_number}</td>
                    <td className="py-2.5 px-3">{r.building} • Floor {r.floor}</td>
                    <td className="py-2.5 px-3">{r.room_type}</td>
                    <td className="py-2.5 px-3">{r.capacity}</td>
                    <td className="py-2.5 px-3">{r.occupied_beds}</td>
                    <td className="py-2.5 px-3 font-bold text-[#287A52]">{r.available_beds}</td>
                    <td className="py-2.5 px-3 font-semibold text-[11px] text-[#287A52]">
                      {r.available_beds === 0 ? 'Full' : 'Available'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'students' && (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#F0F3F3] text-[#727A84] uppercase text-[10px] font-semibold border-b border-[#D6DCE0]">
                <tr>
                  <th className="py-2.5 px-3">Roll No</th>
                  <th className="py-2.5 px-3">Full Name</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Year</th>
                  <th className="py-2.5 px-3">Room / Bed</th>
                  <th className="py-2.5 px-3">Fee Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D6DCE0]/60">
                {students.map((s) => (
                  <tr key={s.id}>
                    <td className="py-2.5 px-3 font-mono font-semibold text-[#0C1629]">{s.student_code}</td>
                    <td className="py-2.5 px-3 font-semibold text-[#0C1629]">{s.full_name}</td>
                    <td className="py-2.5 px-3">{s.department}</td>
                    <td className="py-2.5 px-3 text-[#727A84]">{s.academic_year}</td>
                    <td className="py-2.5 px-3">{s.room_number ? `${s.room_number} (${s.bed_identifier})` : 'Unassigned'}</td>
                    <td className="py-2.5 px-3 font-semibold">{s.fee_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'fees' && (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#F0F3F3] text-[#727A84] uppercase text-[10px] font-semibold border-b border-[#D6DCE0]">
                <tr>
                  <th className="py-2.5 px-3">Receipt No</th>
                  <th className="py-2.5 px-3">Resident</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Amount Paid</th>
                  <th className="py-2.5 px-3">Method & Txn</th>
                  <th className="py-2.5 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D6DCE0]/60">
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td className="py-2.5 px-3 font-mono font-semibold text-[#0C1629]">{p.receipt_number}</td>
                    <td className="py-2.5 px-3">{p.student_name}</td>
                    <td className="py-2.5 px-3">{p.fee_category}</td>
                    <td className="py-2.5 px-3 font-bold text-[#287A52]">{formatINR(p.amount)}</td>
                    <td className="py-2.5 px-3 text-[11px] text-[#727A84]">{p.payment_method} ({p.transaction_reference})</td>
                    <td className="py-2.5 px-3 text-[#727A84]">{new Date(p.recorded_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'attendance' && (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#F0F3F3] text-[#727A84] uppercase text-[10px] font-semibold border-b border-[#D6DCE0]">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Room</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Recorded Officer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D6DCE0]/60">
                {attendance.map((a) => (
                  <tr key={a.id}>
                    <td className="py-2.5 px-3 font-mono text-[#727A84]">{a.attendance_date}</td>
                    <td className="py-2.5 px-3 font-semibold text-[#0C1629]">{a.student_name}</td>
                    <td className="py-2.5 px-3">{a.room_number}</td>
                    <td className="py-2.5 px-3 font-semibold text-[#287A52]">{a.status}</td>
                    <td className="py-2.5 px-3 text-[#727A84]">{a.recorded_by}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'leaves' && (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#F0F3F3] text-[#727A84] uppercase text-[10px] font-semibold border-b border-[#D6DCE0]">
                <tr>
                  <th className="py-2.5 px-3">Resident</th>
                  <th className="py-2.5 px-3">Dates</th>
                  <th className="py-2.5 px-3">Reason</th>
                  <th className="py-2.5 px-3">Destination</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Reviewed By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D6DCE0]/60">
                {leaves.map((l) => (
                  <tr key={l.id}>
                    <td className="py-2.5 px-3 font-semibold text-[#0C1629]">{l.student_name}</td>
                    <td className="py-2.5 px-3 text-[#727A84]">{l.start_date} to {l.end_date}</td>
                    <td className="py-2.5 px-3">{l.reason}</td>
                    <td className="py-2.5 px-3 text-[#727A84]">{l.destination}</td>
                    <td className="py-2.5 px-3 font-semibold">{l.status}</td>
                    <td className="py-2.5 px-3 text-[#727A84]">{l.reviewed_by || 'Pending'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'maintenance' && (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#F0F3F3] text-[#727A84] uppercase text-[10px] font-semibold border-b border-[#D6DCE0]">
                <tr>
                  <th className="py-2.5 px-3">Task Particulars</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Cost</th>
                  <th className="py-2.5 px-3">Assigned Technician</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D6DCE0]/60">
                {maintenance.map((m) => (
                  <tr key={m.id}>
                    <td className="py-2.5 px-3 font-semibold text-[#0C1629]">{m.title}</td>
                    <td className="py-2.5 px-3">{m.category}</td>
                    <td className="py-2.5 px-3 text-[#727A84]">{m.location}</td>
                    <td className="py-2.5 px-3">{m.priority}</td>
                    <td className="py-2.5 px-3 font-semibold">{m.status}</td>
                    <td className="py-2.5 px-3 font-bold text-[#0C1629]">{formatINR(m.cost || 0)}</td>
                    <td className="py-2.5 px-3 text-[#727A84]">{m.assigned_to || 'None'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
