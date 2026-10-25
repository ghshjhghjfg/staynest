import React, { useState, useEffect } from 'react';
import {
  MessageSquareWarning,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  Wrench,
  X,
  Download,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';
import { dataStore } from '../services/dataStore';
import { ComplaintRecord, StudentRecord } from '../types';
import { useAuth } from '../features/auth/AuthContext';
import { getStatusBadgeClasses, formatDateTime } from '../lib/formatters';

export const ComplaintsPage: React.FC = () => {
  const { role, currentUser } = useAuth();
  const [complaints, setComplaints] = useState<ComplaintRecord[]>([]);
  const [students, setStudents] = useState<StudentRecord[]>([]);

  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [updatingComplaint, setUpdatingComplaint] = useState<ComplaintRecord | null>(null);

  // Submit Form
  const [submitForm, setSubmitForm] = useState({
    title: '',
    category: 'Electrical' as ComplaintRecord['category'],
    description: '',
    location: '',
    priority: 'Medium' as ComplaintRecord['priority'],
  });

  // Status Update State
  const [updateStatus, setUpdateStatus] = useState<ComplaintRecord['status']>('In Progress');
  const [assignedTechnician, setAssignedTechnician] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');

  const loadData = () => {
    setComplaints(dataStore.getComplaints());
    setStudents(dataStore.getStudents());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('hostelease_store_updated', loadData);
    return () => window.removeEventListener('hostelease_store_updated', loadData);
  }, []);

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitForm.title || !submitForm.description) {
      alert('Please fill out all fields.');
      return;
    }

    const currentStudent = students.find((s) => s.email === currentUser?.email) || students[0];

    dataStore.submitComplaint({
      student_id: currentStudent.id,
      student_name: currentStudent.full_name,
      student_code: currentStudent.student_code,
      title: submitForm.title,
      category: submitForm.category,
      description: submitForm.description,
      location: submitForm.location || currentStudent.room_number || 'Hostel Campus',
      priority: submitForm.priority,
    });

    setShowSubmitModal(false);
    setSubmitForm({
      title: '',
      category: 'Electrical',
      description: '',
      location: '',
      priority: 'Medium',
    });
  };

  const handleSaveUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatingComplaint) return;

    dataStore.updateComplaintStatus(
      updatingComplaint.id,
      updateStatus,
      assignedTechnician || updatingComplaint.assigned_to,
      resolutionNotes || updatingComplaint.resolution_notes
    );

    setUpdatingComplaint(null);
  };

  const handleExportCSV = () => {
    const headers = ['Complaint ID', 'Student', 'Title', 'Category', 'Location', 'Priority', 'Status', 'Assigned To', 'Created Date'];
    const rows = complaints.map((c) => [
      c.id,
      c.student_name,
      c.title,
      c.category,
      c.location,
      c.priority,
      c.status,
      c.assigned_to || 'Unassigned',
      c.created_at,
    ]);
    dataStore.exportToCSV('hostelease_complaints_log', headers, rows);
  };

  const filteredComplaints = complaints.filter((c) => {
    if (role === 'student') {
      const studentMatch = students.find((s) => s.email === currentUser?.email);
      if (studentMatch && c.student_id !== studentMatch.id) return false;
    }
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || c.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const canManageComplaints = role === 'admin' || role === 'warden' || role === 'staff';

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0C1629]">Hostel Grievance & Complaint Desk</h2>
          <p className="text-xs text-[#727A84]">
            Resolve electrical, plumbing, Wi-Fi, furniture, and water issues promptly
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-white hover:bg-[#F0F3F3] border border-[#D6DCE0] text-[#0C1629] rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#727A84]" />
            <span>Export Log</span>
          </button>
          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-3.5 py-2 bg-[#0C1629] hover:bg-[#1A2942] text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Raise New Issue</span>
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
            placeholder="Search issue title, room, or description..."
            className="w-full pl-9 pr-3 py-2 bg-[#F0F3F3]/60 border border-[#D6DCE0] rounded-md text-xs text-[#0C1629] focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[#727A84]">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-[#F0F3F3] border border-[#D6DCE0] rounded-md text-xs text-[#0C1629]"
            >
              <option value="ALL">All Categories</option>
              <option value="Electrical">Electrical</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Wi-Fi">Wi-Fi</option>
              <option value="Water">Water</option>
              <option value="Cleanliness">Cleanliness</option>
              <option value="Furniture">Furniture</option>
              <option value="Food">Food</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#727A84]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-[#F0F3F3] border border-[#D6DCE0] rounded-md text-xs text-[#0C1629]"
            >
              <option value="ALL">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complaints List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredComplaints.length === 0 ? (
          <div className="col-span-2 bg-white p-8 rounded-xl border border-[#D6DCE0] text-center text-[#727A84] text-xs">
            No complaints found under current selection.
          </div>
        ) : (
          filteredComplaints.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-xl border border-[#D6DCE0] p-4 shadow-xs flex flex-col justify-between hover:border-[#0C1629]/40 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2 pb-2 border-b border-[#D6DCE0]">
                  <div>
                    <span className="font-bold text-sm text-[#0C1629] block">{c.title}</span>
                    <span className="text-[11px] text-[#727A84]">
                      {c.location} • By {c.student_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        c.priority === 'Urgent' || c.priority === 'High'
                          ? 'bg-[#B54747]/10 text-[#B54747]'
                          : 'bg-[#F0F3F3] text-[#727A84]'
                      }`}
                    >
                      {c.priority}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${getStatusBadgeClasses(c.status)}`}>
                      {c.status}
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-xs text-[#0C1629] leading-relaxed">{c.description}</p>

                {c.resolution_notes && (
                  <div className="mt-3 p-2 bg-[#F0F3F3] rounded text-[11px] text-[#0C1629]">
                    <span className="font-semibold text-[#287A52] block">Resolution Note:</span>
                    <span>{c.resolution_notes}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-2.5 border-t border-[#D6DCE0] flex items-center justify-between text-[11px] text-[#727A84]">
                <div>
                  <span>Assigned: </span>
                  <strong className="text-[#0C1629]">{c.assigned_to || 'Unassigned'}</strong>
                </div>
                {canManageComplaints && (
                  <button
                    onClick={() => {
                      setUpdatingComplaint(c);
                      setUpdateStatus(c.status);
                      setAssignedTechnician(c.assigned_to || '');
                      setResolutionNotes(c.resolution_notes || '');
                    }}
                    className="text-[#356B9A] font-semibold hover:underline"
                  >
                    Update Progress
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Submit Issue Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-[#D6DCE0]">
            <div className="flex items-center justify-between pb-3 border-b border-[#D6DCE0]">
              <h3 className="font-bold text-base text-[#0C1629]">Report Maintenance Grievance</h3>
              <button onClick={() => setShowSubmitModal(false)} className="text-[#727A84] hover:text-[#0C1629]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitComplaint} className="py-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#0C1629] mb-1">Issue Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Geyser tripping circuit breaker"
                  value={submitForm.title}
                  onChange={(e) => setSubmitForm({ ...submitForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0C1629] mb-1">Category *</label>
                  <select
                    value={submitForm.category}
                    onChange={(e) => setSubmitForm({ ...submitForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                  >
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Wi-Fi">Wi-Fi</option>
                    <option value="Water">Water</option>
                    <option value="Cleanliness">Cleanliness</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Food">Food</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#0C1629] mb-1">Priority</label>
                  <select
                    value={submitForm.priority}
                    onChange={(e) => setSubmitForm({ ...submitForm, priority: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0C1629] mb-1">Location / Room Number</label>
                <input
                  type="text"
                  placeholder="e.g. Room A-101 Bathroom or 2nd Floor Corridor"
                  value={submitForm.location}
                  onChange={(e) => setSubmitForm({ ...submitForm, location: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0C1629] mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the defect or repair needed..."
                  value={submitForm.description}
                  onChange={(e) => setSubmitForm({ ...submitForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#D6DCE0]">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 border border-[#D6DCE0] rounded-md text-[#0C1629]"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#0C1629] text-white rounded-md font-semibold">
                  Submit Grievance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Progress Modal */}
      {updatingComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-[#D6DCE0]">
            <div className="flex items-center justify-between pb-3 border-b border-[#D6DCE0]">
              <h3 className="font-bold text-base text-[#0C1629]">Update Complaint Resolution</h3>
              <button onClick={() => setUpdatingComplaint(null)} className="text-[#727A84] hover:text-[#0C1629]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveUpdate} className="py-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#0C1629] mb-1">Status</label>
                <select
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                >
                  <option value="Submitted">Submitted</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#0C1629] mb-1">Assign Responsible Technician</label>
                <input
                  type="text"
                  placeholder="e.g. Electrician - Rajesh Kumar"
                  value={assignedTechnician}
                  onChange={(e) => setAssignedTechnician(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0C1629] mb-1">Resolution / Action Notes</label>
                <textarea
                  rows={3}
                  placeholder="Describe parts replaced or work completed..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#D6DCE0]">
                <button
                  type="button"
                  onClick={() => setUpdatingComplaint(null)}
                  className="px-4 py-2 border border-[#D6DCE0] rounded-md"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#0C1629] text-white rounded-md font-semibold">
                  Save Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
