import React, { useState, useEffect } from 'react';
import {
  ClipboardList,
  Search,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Calendar,
  X,
  FileText,
  Clock,
} from 'lucide-react';
import { dataStore } from '../services/dataStore';
import { LeaveRequest, StudentRecord } from '../types';
import { useAuth } from '../features/auth/AuthContext';
import { getStatusBadgeClasses, formatDate } from '../lib/formatters';

export const LeavesPage: React.FC = () => {
  const { role, currentUser } = useAuth();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [students, setStudents] = useState<StudentRecord[]>([]);

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [rejectingLeaveId, setRejectingLeaveId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Apply Form
  const [applyForm, setApplyForm] = useState({
    start_date: '2026-11-01',
    end_date: '2026-11-04',
    reason: '',
    destination: '',
    emergency_contact: '',
  });

  const loadData = () => {
    setLeaves(dataStore.getLeaves());
    setStudents(dataStore.getStudents());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('hostelease_store_updated', loadData);
    return () => window.removeEventListener('hostelease_store_updated', loadData);
  }, []);

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyForm.reason || !applyForm.destination) {
      alert('Please fill out all required fields.');
      return;
    }

    // Determine student identity
    const currentStudent = students.find((s) => s.email === currentUser?.email) || students[0];

    dataStore.submitLeave({
      student_id: currentStudent.id,
      student_name: currentStudent.full_name,
      student_code: currentStudent.student_code,
      room_number: currentStudent.room_number || 'Unallocated',
      start_date: applyForm.start_date,
      end_date: applyForm.end_date,
      reason: applyForm.reason,
      destination: applyForm.destination,
      emergency_contact: applyForm.emergency_contact || currentStudent.emergency_contact,
    });

    setShowApplyModal(false);
    setApplyForm({
      start_date: '',
      end_date: '',
      reason: '',
      destination: '',
      emergency_contact: '',
    });
  };

  const handleApprove = (leaveId: string) => {
    dataStore.reviewLeave(leaveId, 'Approved', currentUser?.full_name || 'Chief Warden');
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingLeaveId) return;
    dataStore.reviewLeave(
      rejectingLeaveId,
      'Rejected',
      currentUser?.full_name || 'Chief Warden',
      rejectionReason || 'Institutional consent not verified.'
    );
    setRejectingLeaveId(null);
    setRejectionReason('');
  };

  const handleCancelLeave = (leaveId: string, studentId: string) => {
    if (window.confirm('Cancel this pending out-pass request?')) {
      dataStore.cancelLeave(leaveId, studentId);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Request ID', 'Student', 'Roll No', 'Room', 'Start Date', 'End Date', 'Reason', 'Destination', 'Status', 'Reviewer'];
    const rows = leaves.map((l) => [
      l.id,
      l.student_name,
      l.student_code,
      l.room_number,
      l.start_date,
      l.end_date,
      l.reason,
      l.destination,
      l.status,
      l.reviewed_by || 'Pending',
    ]);
    dataStore.exportToCSV('hostelease_leave_requests', headers, rows);
  };

  const filteredLeaves = leaves.filter((l) => {
    if (role === 'student') {
      const studentMatch = students.find((s) => s.email === currentUser?.email);
      if (studentMatch && l.student_id !== studentMatch.id) return false;
    }
    const matchesSearch =
      l.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.student_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const canReview = role === 'admin' || role === 'warden';

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0C1629]">Student Leave & Out-Pass Management</h2>
          <p className="text-xs text-[#727A84]">
            Review weekend out-passes, technical conference permissions, and emergency home leaves
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
            onClick={() => setShowApplyModal(true)}
            className="px-3.5 py-2 bg-[#0C1629] hover:bg-[#1A2942] text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Apply For Leave</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-[#D6DCE0] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#727A84] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student, roll no, or destination..."
            className="w-full pl-9 pr-3 py-2 bg-[#F0F3F3]/60 border border-[#D6DCE0] rounded-md text-xs text-[#0C1629] focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#727A84]">Status Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-[#F0F3F3] border border-[#D6DCE0] rounded-md text-xs text-[#0C1629]"
          >
            <option value="ALL">All Statuses</option>
            <option value="Pending">Pending Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white rounded-xl border border-[#D6DCE0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#0C1629]">
            <thead className="bg-[#F0F3F3] text-[#727A84] uppercase text-[10px] font-semibold border-b border-[#D6DCE0]">
              <tr>
                <th className="py-3 px-4">Resident</th>
                <th className="py-3 px-4">Room No</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Reason & Destination</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Review Remarks</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D6DCE0]/60">
              {filteredLeaves.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#727A84]">
                    No leave requests found.
                  </td>
                </tr>
              ) : (
                filteredLeaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-[#F0F3F3]/50">
                    <td className="py-3 px-4">
                      <span className="font-semibold text-[#0C1629] block">{leave.student_name}</span>
                      <span className="font-mono text-[10px] text-[#727A84]">{leave.student_code}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#0C1629]">{leave.room_number}</td>
                    <td className="py-3 px-4">
                      <span className="text-[#0C1629] font-medium block">
                        {formatDate(leave.start_date)} – {formatDate(leave.end_date)}
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <p className="text-[#0C1629] truncate">{leave.reason}</p>
                      <p className="text-[10px] text-[#727A84] truncate">Dest: {leave.destination}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${getStatusBadgeClasses(leave.status)}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[11px] text-[#727A84]">
                      {leave.reviewed_by ? (
                        <div>
                          <span>By: {leave.reviewed_by}</span>
                          {leave.rejection_reason && (
                            <p className="text-[10px] text-[#B54747] mt-0.5">{leave.rejection_reason}</p>
                          )}
                        </div>
                      ) : (
                        <span className="italic">Awaiting Warden review</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {canReview && leave.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(leave.id)}
                              className="px-2.5 py-1 bg-[#287A52] hover:bg-[#1E5D3E] text-white rounded text-[11px] font-semibold"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => setRejectingLeaveId(leave.id)}
                              className="px-2.5 py-1 bg-[#B54747] hover:bg-[#923838] text-white rounded text-[11px] font-semibold"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {role === 'student' && leave.status === 'Pending' && (
                          <button
                            onClick={() => handleCancelLeave(leave.id, leave.student_id)}
                            className="px-2 py-1 text-[#B54747] border border-[#B54747]/30 hover:bg-red-50 rounded text-[11px]"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-[#D6DCE0]">
            <div className="flex items-center justify-between pb-3 border-b border-[#D6DCE0]">
              <h3 className="font-bold text-base text-[#0C1629]">Submit Leave / Out-Pass Request</h3>
              <button onClick={() => setShowApplyModal(false)} className="text-[#727A84] hover:text-[#0C1629]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleApplyLeave} className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0C1629] mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={applyForm.start_date}
                    onChange={(e) => setApplyForm({ ...applyForm, start_date: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0C1629] mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={applyForm.end_date}
                    onChange={(e) => setApplyForm({ ...applyForm, end_date: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0C1629] mb-1">Destination Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Home address or conference hotel"
                  value={applyForm.destination}
                  onChange={(e) => setApplyForm({ ...applyForm, destination: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0C1629] mb-1">Reason for Leave *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Specify genuine cause for overnight or weekend departure..."
                  value={applyForm.reason}
                  onChange={(e) => setApplyForm({ ...applyForm, reason: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0C1629] mb-1">Emergency Phone During Travel</label>
                <input
                  type="tel"
                  placeholder="+91 98765 00000"
                  value={applyForm.emergency_contact}
                  onChange={(e) => setApplyForm({ ...applyForm, emergency_contact: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#D6DCE0]">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 border border-[#D6DCE0] rounded-md text-[#0C1629]"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#0C1629] text-white rounded-md font-semibold">
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Leave Modal */}
      {rejectingLeaveId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl border border-[#D6DCE0]">
            <h3 className="font-bold text-base text-[#0C1629] mb-2">Reject Out-Pass Request</h3>
            <p className="text-xs text-[#727A84] mb-3">Provide reason for audit and student record notification.</p>
            <form onSubmit={handleConfirmReject} className="space-y-3 text-xs">
              <textarea
                rows={3}
                required
                placeholder="e.g. Inadequate guardian consent or exam period curfew restriction"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 border border-[#D6DCE0] rounded-md"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingLeaveId(null)}
                  className="px-3 py-1.5 border border-[#D6DCE0] rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="px-3 py-1.5 bg-[#B54747] text-white rounded font-semibold">
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
