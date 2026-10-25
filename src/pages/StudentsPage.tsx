import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  Trash2,
  Edit,
  X,
  CheckCircle2,
  AlertCircle,
  Building2,
  Phone,
  Mail,
  GraduationCap,
  ShieldAlert,
} from 'lucide-react';
import { dataStore } from '../services/dataStore';
import { StudentRecord } from '../types';
import { useAuth } from '../features/auth/AuthContext';
import { getStatusBadgeClasses, formatINR } from '../lib/formatters';

export const StudentsPage: React.FC = () => {
  const { role } = useAuth();
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [feeStatusFilter, setFeeStatusFilter] = useState('ALL');

  // Modals
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentRecord | null>(null);

  // Add/Edit Form State
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    student_code: '',
    department: 'Computer Science & Eng',
    academic_year: '1st Year',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    guardian_name: '',
    guardian_phone: '',
    emergency_contact: '',
  });

  const loadData = () => {
    setStudents(dataStore.getStudents());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('hostelease_store_updated', loadData);
    return () => window.removeEventListener('hostelease_store_updated', loadData);
  }, []);

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.student_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.room_number && s.room_number.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDept = departmentFilter === 'ALL' || s.department === departmentFilter;
    const matchesFee = feeStatusFilter === 'ALL' || s.fee_status === feeStatusFilter;

    return matchesSearch && matchesDept && matchesFee;
  });

  const handleExportCSV = () => {
    const headers = ['Student ID', 'Full Name', 'Email', 'Phone', 'Department', 'Year', 'Room', 'Fee Status', 'Status'];
    const rows = filteredStudents.map((s) => [
      s.student_code,
      s.full_name,
      s.email,
      s.phone,
      s.department,
      s.academic_year,
      s.room_number || 'Unallocated',
      s.fee_status,
      s.account_status,
    ]);
    dataStore.exportToCSV('hostelease_students_list', headers, rows);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.student_code || !formData.email) {
      alert('Please fill all required fields.');
      return;
    }

    if (editingStudent) {
      dataStore.updateStudent(editingStudent.id, {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        academic_year: formData.academic_year,
        guardian_name: formData.guardian_name,
        guardian_phone: formData.guardian_phone,
        emergency_contact: formData.emergency_contact,
      });
    } else {
      dataStore.addStudent({
        profile_id: `user-${Date.now()}`,
        student_code: formData.student_code,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        academic_year: formData.academic_year,
        gender: formData.gender,
        guardian_name: formData.guardian_name,
        guardian_phone: formData.guardian_phone,
        emergency_contact: formData.emergency_contact,
        fee_status: 'Pending',
        account_status: 'active',
        joining_date: new Date().toISOString().split('T')[0],
      });
    }

    setShowAddModal(false);
    setEditingStudent(null);
  };

  const handleDeleteStudent = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to deactivate and remove resident record for ${name}?`)) {
      dataStore.deleteStudent(id);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0C1629]">Student Resident Directory</h2>
          <p className="text-xs text-[#727A84]">
            Total {students.length} registered students • {students.filter((s) => s.room_number).length} allocated to rooms
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
          {(role === 'admin' || role === 'warden') && (
            <button
              onClick={() => {
                setFormData({
                  full_name: '',
                  email: '',
                  phone: '',
                  student_code: `HE-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
                  department: 'Computer Science & Eng',
                  academic_year: '1st Year',
                  gender: 'Male',
                  guardian_name: '',
                  guardian_phone: '',
                  emergency_contact: '',
                });
                setEditingStudent(null);
                setShowAddModal(true);
              }}
              className="px-3.5 py-2 bg-[#0C1629] hover:bg-[#1A2942] text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Student</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-[#D6DCE0] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#727A84] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, roll no, room, or email..."
            className="w-full pl-9 pr-3 py-2 bg-[#F0F3F3]/60 border border-[#D6DCE0] rounded-md text-xs text-[#0C1629] focus:outline-hidden focus:border-[#0C1629]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-[#727A84] font-medium">Department:</span>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-[#F0F3F3] border border-[#D6DCE0] rounded-md text-xs text-[#0C1629]"
            >
              <option value="ALL">All Departments</option>
              <option value="Computer Science & Eng">CSE</option>
              <option value="Electronics & Comm">ECE</option>
              <option value="Mechanical Engineering">Mech</option>
              <option value="Civil Engineering">Civil</option>
              <option value="Biotechnology">Biotech</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#727A84] font-medium">Fee Status:</span>
            <select
              value={feeStatusFilter}
              onChange={(e) => setFeeStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-[#F0F3F3] border border-[#D6DCE0] rounded-md text-xs text-[#0C1629]"
            >
              <option value="ALL">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-xl border border-[#D6DCE0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#0C1629]">
            <thead className="bg-[#F0F3F3] text-[#727A84] font-semibold border-b border-[#D6DCE0] uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Student ID</th>
                <th className="py-3 px-4">Resident Name</th>
                <th className="py-3 px-4">Department & Year</th>
                <th className="py-3 px-4">Room / Bed</th>
                <th className="py-3 px-4">Fee Status</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D6DCE0]/60">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#727A84]">
                    No student records matching current filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-[#F0F3F3]/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-[#0C1629]">{s.student_code}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#0C1629] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                          {s.full_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-[#0C1629] leading-tight">{s.full_name}</p>
                          <p className="text-[11px] text-[#727A84]">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-[#0C1629]">{s.department}</p>
                      <p className="text-[11px] text-[#727A84]">{s.academic_year}</p>
                    </td>
                    <td className="py-3 px-4">
                      {s.room_number ? (
                        <div>
                          <span className="font-semibold text-[#0C1629]">{s.room_number}</span>
                          <span className="text-[10px] text-[#727A84] ml-1.5">({s.bed_identifier || 'Bed'})</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#A66B16] font-medium bg-[#A66B16]/10 px-2 py-0.5 rounded">
                          Unallocated
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${getStatusBadgeClasses(s.fee_status)}`}>
                        {s.fee_status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-[#287A52]/10 text-[#287A52] font-semibold uppercase">
                        {s.account_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedStudent(s)}
                          title="View Profile Details"
                          className="p-1 rounded text-[#727A84] hover:text-[#0C1629] hover:bg-[#F0F3F3]"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {(role === 'admin' || role === 'warden') && (
                          <>
                            <button
                              onClick={() => {
                                setEditingStudent(s);
                                setFormData({
                                  full_name: s.full_name,
                                  email: s.email,
                                  phone: s.phone,
                                  student_code: s.student_code,
                                  department: s.department,
                                  academic_year: s.academic_year,
                                  gender: s.gender || 'Male',
                                  guardian_name: s.guardian_name,
                                  guardian_phone: s.guardian_phone,
                                  emergency_contact: s.emergency_contact,
                                });
                                setShowAddModal(true);
                              }}
                              title="Edit Record"
                              className="p-1 rounded text-[#727A84] hover:text-[#0C1629] hover:bg-[#F0F3F3]"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(s.id, s.full_name)}
                              title="Deactivate Student"
                              className="p-1 rounded text-[#727A84] hover:text-[#B54747] hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
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

      {/* Student Profile Drawer / Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-[#D6DCE0] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#D6DCE0]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-[#0C1629] text-white flex items-center justify-center font-bold text-sm">
                  {selectedStudent.full_name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#0C1629]">{selectedStudent.full_name}</h3>
                  <p className="text-xs text-[#727A84]">ID: {selectedStudent.student_code}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1.5 rounded-md text-[#727A84] hover:text-[#0C1629] hover:bg-[#F0F3F3]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-[#F0F3F3] rounded-lg">
                <div>
                  <span className="text-[#727A84]">Room Allocation</span>
                  <p className="font-semibold text-[#0C1629] mt-0.5">
                    {selectedStudent.room_number ? `${selectedStudent.room_number} (${selectedStudent.bed_identifier})` : 'Not Allocated'}
                  </p>
                </div>
                <div>
                  <span className="text-[#727A84]">Fee Clearance</span>
                  <p className="font-semibold text-[#0C1629] mt-0.5">{selectedStudent.fee_status}</p>
                </div>
                <div>
                  <span className="text-[#727A84]">Department</span>
                  <p className="font-semibold text-[#0C1629] mt-0.5">{selectedStudent.department}</p>
                </div>
                <div>
                  <span className="text-[#727A84]">Academic Year</span>
                  <p className="font-semibold text-[#0C1629] mt-0.5">{selectedStudent.academic_year}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-[#0C1629] mb-2 uppercase tracking-wide text-[10px] text-[#727A84]">
                  Contact & Communication
                </h4>
                <div className="space-y-1.5 text-xs text-[#0C1629]">
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#727A84]" />
                    <span>{selectedStudent.email}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#727A84]" />
                    <span>{selectedStudent.phone}</span>
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#D6DCE0]">
                <h4 className="font-semibold text-[#0C1629] mb-2 uppercase tracking-wide text-[10px] text-[#727A84]">
                  Guardian & Emergency Details (Restricted Access)
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs bg-[#F0F3F3]/50 p-3 rounded-lg border border-[#D6DCE0]">
                  <div>
                    <span className="text-[#727A84]">Guardian Name:</span>
                    <p className="font-semibold text-[#0C1629]">{selectedStudent.guardian_name}</p>
                  </div>
                  <div>
                    <span className="text-[#727A84]">Guardian Phone:</span>
                    <p className="font-semibold text-[#0C1629]">{selectedStudent.guardian_phone}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[#727A84]">24/7 Emergency Line:</span>
                    <p className="font-semibold text-[#B54747]">{selectedStudent.emergency_contact}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#D6DCE0] flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-[#0C1629] text-white rounded-md text-xs font-medium cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-xl border border-[#D6DCE0] animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#D6DCE0]">
              <h3 className="font-bold text-base text-[#0C1629]">
                {editingStudent ? 'Edit Student Record' : 'Register New Student Resident'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-md text-[#727A84] hover:text-[#0C1629] hover:bg-[#F0F3F3]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0C1629] mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0C1629] mb-1">Student ID / Roll No *</label>
                  <input
                    type="text"
                    required
                    disabled={Boolean(editingStudent)}
                    value={formData.student_code}
                    onChange={(e) => setFormData({ ...formData, student_code: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0C1629] mb-1">Institutional Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0C1629] mb-1">Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0C1629] mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                  >
                    <option value="Computer Science & Eng">Computer Science & Eng</option>
                    <option value="Electronics & Comm">Electronics & Comm</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Biotechnology">Biotechnology</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#0C1629] mb-1">Academic Year</label>
                  <select
                    value={formData.academic_year}
                    onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#0C1629] mb-1">Guardian Name</label>
                  <input
                    type="text"
                    value={formData.guardian_name}
                    onChange={(e) => setFormData({ ...formData, guardian_name: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0C1629] mb-1">Guardian Phone</label>
                  <input
                    type="tel"
                    value={formData.guardian_phone}
                    onChange={(e) => setFormData({ ...formData, guardian_phone: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-[#0C1629] mb-1">Emergency Contact</label>
                  <input
                    type="tel"
                    value={formData.emergency_contact}
                    onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#D6DCE0] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-[#D6DCE0] rounded-md text-[#0C1629] hover:bg-[#F0F3F3]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0C1629] text-white rounded-md font-semibold hover:bg-[#1A2942]"
                >
                  {editingStudent ? 'Save Changes' : 'Register Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
