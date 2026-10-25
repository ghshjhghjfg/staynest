import React, { useState, useEffect } from 'react';
import {
  UserRoundCheck,
  Search,
  Plus,
  LogOut,
  Download,
  Clock,
  Phone,
  User,
  X,
  AlertCircle,
} from 'lucide-react';
import { dataStore } from '../services/dataStore';
import { VisitorRecord, StudentRecord } from '../types';
import { useAuth } from '../features/auth/AuthContext';
import { formatDateTime, getStatusBadgeClasses } from '../lib/formatters';

export const VisitorsPage: React.FC = () => {
  const { role, currentUser } = useAuth();
  const [visitors, setVisitors] = useState<VisitorRecord[]>([]);
  const [students, setStudents] = useState<StudentRecord[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // New Visitor Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [entryForm, setEntryForm] = useState({
    visitor_name: '',
    visitor_phone: '',
    relationship: 'Parent',
    student_id: '',
    purpose: '',
  });

  const loadData = () => {
    setVisitors(dataStore.getVisitors());
    setStudents(dataStore.getStudents());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('staynest_store_updated', loadData);
    return () => window.removeEventListener('staynest_store_updated', loadData);
  }, []);

  const handleCreateEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === entryForm.student_id);
    if (!student || !entryForm.visitor_name.trim() || !entryForm.visitor_phone.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    dataStore.recordVisitorEntry({
      visitor_name: entryForm.visitor_name.trim(),
      visitor_phone: entryForm.visitor_phone.trim(),
      relationship: entryForm.relationship,
      student_id: student.id,
      student_name: student.full_name,
      student_code: student.student_code,
      purpose: entryForm.purpose.trim() || 'General Family Visit',
      entry_time: new Date().toISOString(),
      recorded_by: currentUser?.full_name || 'Hostel Security Desk',
    });

    setShowAddModal(false);
    setEntryForm({
      visitor_name: '',
      visitor_phone: '',
      relationship: 'Parent',
      student_id: '',
      purpose: '',
    });
  };

  const handleCheckOut = (id: string, name: string) => {
    if (window.confirm(`Log departure checkout for ${name}?`)) {
      dataStore.recordVisitorExit(id);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Visitor Name', 'Phone', 'Relationship', 'Student Visited', 'Roll No', 'Purpose', 'Entry Time', 'Exit Time', 'Status', 'Staff Officer'];
    const rows = visitors.map((v) => [
      v.visitor_name,
      v.visitor_phone,
      v.relationship,
      v.student_name,
      v.student_code,
      v.purpose,
      v.entry_time,
      v.exit_time || 'Inside',
      v.status,
      v.recorded_by,
    ]);
    dataStore.exportToCSV('staynest_visitors_register', headers, rows);
  };

  const activeVisitorsInside = visitors.filter((v) => v.status === 'Inside');

  const filteredVisitors = visitors.filter((v) => {
    const matchesSearch =
      v.visitor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.student_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.visitor_phone.includes(searchQuery);

    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0C1629]">Hostel Security & Visitor Register</h2>
          <p className="text-xs text-[#727A84]">
            Regulate campus entry, record identity, and safeguard resident security
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-white hover:bg-[#F0F3F3] border border-[#D6DCE0] text-[#0C1629] rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#727A84]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-[#0C1629] hover:bg-[#1A2942] text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Log Visitor Check-In</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#D6DCE0] shadow-xs">
          <span className="text-xs text-[#727A84] font-medium">Currently Inside Hostel</span>
          <p className="text-2xl font-bold text-[#287A52] mt-1">{activeVisitorsInside.length}</p>
          <span className="text-[11px] text-[#727A84]">Authorized guests on premises</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#D6DCE0] shadow-xs">
          <span className="text-xs text-[#727A84] font-medium">Total Registered Visits</span>
          <p className="text-2xl font-bold text-[#0C1629] mt-1">{visitors.length}</p>
          <span className="text-[11px] text-[#727A84]">Historical logs recorded</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#D6DCE0] shadow-xs">
          <span className="text-xs text-[#727A84] font-medium">Security Gate Hours</span>
          <p className="text-base font-bold text-[#0C1629] mt-1">6:00 AM – 10:00 PM</p>
          <span className="text-[11px] text-[#A66B16] font-medium">Night entry requires warden approval</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-3.5 rounded-xl border border-[#D6DCE0] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#727A84] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search visitor name, phone, or resident..."
            className="w-full pl-9 pr-3 py-2 bg-[#F0F3F3]/60 border border-[#D6DCE0] rounded-md text-xs text-[#0C1629] focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#727A84]">Presence Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-[#F0F3F3] border border-[#D6DCE0] rounded-md text-xs text-[#0C1629]"
          >
            <option value="ALL">All Visitors</option>
            <option value="Inside">Currently Inside</option>
            <option value="Checked Out">Checked Out</option>
          </select>
        </div>
      </div>

      {/* Visitor Table */}
      <div className="bg-white rounded-xl border border-[#D6DCE0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#0C1629]">
            <thead className="bg-[#F0F3F3] text-[#727A84] uppercase text-[10px] font-semibold border-b border-[#D6DCE0]">
              <tr>
                <th className="py-3 px-4">Visitor</th>
                <th className="py-3 px-4">Relationship</th>
                <th className="py-3 px-4">Student Visited</th>
                <th className="py-3 px-4">Purpose</th>
                <th className="py-3 px-4">Check-In Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Gate Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D6DCE0]/60">
              {filteredVisitors.map((v) => (
                <tr key={v.id} className="hover:bg-[#F0F3F3]/50">
                  <td className="py-3 px-4">
                    <span className="font-semibold text-[#0C1629] block">{v.visitor_name}</span>
                    <span className="text-[11px] text-[#727A84]">{v.visitor_phone}</span>
                  </td>
                  <td className="py-3 px-4 text-[#0C1629]">{v.relationship}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-[#0C1629] block">{v.student_name}</span>
                    <span className="font-mono text-[10px] text-[#727A84]">{v.student_code}</span>
                  </td>
                  <td className="py-3 px-4 max-w-xs truncate text-[#727A84]">{v.purpose}</td>
                  <td className="py-3 px-4 text-[#727A84]">{formatDateTime(v.entry_time)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${getStatusBadgeClasses(v.status)}`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {v.status === 'Inside' ? (
                      <button
                        onClick={() => handleCheckOut(v.id, v.visitor_name)}
                        className="px-2.5 py-1 bg-[#0C1629] hover:bg-[#1A2942] text-white rounded text-[11px] font-semibold flex items-center gap-1 ml-auto cursor-pointer"
                      >
                        <LogOut className="w-3 h-3" />
                        <span>Log Exit</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-[#727A84]">
                        Exit: {formatDateTime(v.exit_time)}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Visitor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-[#D6DCE0]">
            <div className="flex items-center justify-between pb-3 border-b border-[#D6DCE0]">
              <h3 className="font-bold text-base text-[#0C1629]">Register Visitor Entry</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#727A84] hover:text-[#0C1629]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateEntry} className="py-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#0C1629] mb-1">Visitor Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Varma"
                  value={entryForm.visitor_name}
                  onChange={(e) => setEntryForm({ ...entryForm, visitor_name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0C1629] mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98450 00000"
                    value={entryForm.visitor_phone}
                    onChange={(e) => setEntryForm({ ...entryForm, visitor_phone: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0C1629] mb-1">Relationship</label>
                  <select
                    value={entryForm.relationship}
                    onChange={(e) => setEntryForm({ ...entryForm, relationship: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Relative">Relative</option>
                    <option value="Official Delivery">Official Delivery</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0C1629] mb-1">Resident Student Being Visited *</label>
                <select
                  required
                  value={entryForm.student_id}
                  onChange={(e) => setEntryForm({ ...entryForm, student_id: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                >
                  <option value="">-- Choose Resident --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.full_name} ({s.student_code}) • Room {s.room_number || 'Unallocated'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#0C1629] mb-1">Purpose of Visit</label>
                <input
                  type="text"
                  placeholder="e.g. Bringing winter bedding and textbooks"
                  value={entryForm.purpose}
                  onChange={(e) => setEntryForm({ ...entryForm, purpose: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#D6DCE0]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-[#D6DCE0] rounded-md text-[#0C1629]"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#0C1629] text-white rounded-md font-semibold">
                  Record Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
