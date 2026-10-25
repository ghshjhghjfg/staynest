import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Search,
  Download,
  Check,
  X as XIcon,
  Clock,
  CheckCheck,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { dataStore } from '../services/dataStore';
import { AttendanceRecord, StudentRecord } from '../types';
import { useAuth } from '../features/auth/AuthContext';
import { getStatusBadgeClasses } from '../lib/formatters';

export const AttendancePage: React.FC = () => {
  const { role, currentUser } = useAuth();
  const [selectedDate, setSelectedDate] = useState('2026-10-25');
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const loadData = () => {
    setStudents(dataStore.getStudents());
    setAttendanceRecords(dataStore.getAttendance());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('hostelease_store_updated', loadData);
    return () => window.removeEventListener('hostelease_store_updated', loadData);
  }, []);

  // Filter attendance for chosen date
  const dateAttendance = attendanceRecords.filter((a) => a.attendance_date === selectedDate);

  // Present / Absent / Leave statistics
  const presentCount = dateAttendance.filter((a) => a.status === 'Present').length;
  const absentCount = dateAttendance.filter((a) => a.status === 'Absent').length;
  const leaveCount = dateAttendance.filter((a) => a.status === 'On Leave').length;
  const recordedCount = dateAttendance.length;
  const percent = recordedCount > 0 ? Math.round((presentCount / recordedCount) * 100) : 0;

  const handleSetStatus = (student: StudentRecord, status: 'Present' | 'Absent' | 'On Leave') => {
    dataStore.markAttendance({
      student_id: student.id,
      student_name: student.full_name,
      student_code: student.student_code,
      room_number: student.room_number || 'Unallocated',
      attendance_date: selectedDate,
      status,
      recorded_by: currentUser?.full_name || 'Staff On Duty',
    });
  };

  const handleMarkAllPresent = () => {
    students.forEach((s) => {
      // Don't override if on approved leave
      const existing = dateAttendance.find((a) => a.student_id === s.id);
      if (existing?.status === 'On Leave') return;

      dataStore.markAttendance({
        student_id: s.id,
        student_name: s.full_name,
        student_code: s.student_code,
        room_number: s.room_number || 'Unallocated',
        attendance_date: selectedDate,
        status: 'Present',
        recorded_by: currentUser?.full_name || 'Staff On Duty',
      });
    });
  };

  const handleExportCSV = () => {
    const headers = ['Date', 'Student ID', 'Student Name', 'Room', 'Status', 'Recorded By'];
    const rows = students.map((s) => {
      const record = dateAttendance.find((a) => a.student_id === s.id);
      return [
        selectedDate,
        s.student_code,
        s.full_name,
        s.room_number || 'Unallocated',
        record ? record.status : 'Not Recorded',
        record ? record.recorded_by : '—',
      ];
    });
    dataStore.exportToCSV(`hostelease_attendance_${selectedDate}`, headers, rows);
  };

  const filteredStudents = students.filter((s) => {
    if (role === 'student' && s.email !== currentUser?.email) return false;
    const matchesSearch =
      s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.student_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.room_number && s.room_number.toLowerCase().includes(searchQuery.toLowerCase()));

    const record = dateAttendance.find((a) => a.student_id === s.id);
    const studentStatus = record ? record.status : 'Unrecorded';
    const matchesStatus = statusFilter === 'ALL' || studentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const canEditAttendance = role === 'admin' || role === 'warden' || role === 'staff';

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0C1629]">Night Roll Call & Daily Attendance</h2>
          <p className="text-xs text-[#727A84]">
            Enforce curfew compliance, track out-pass leaves, and maintain permanent attendance records
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
          {canEditAttendance && (
            <button
              onClick={handleMarkAllPresent}
              className="px-3.5 py-2 bg-[#0C1629] hover:bg-[#1A2942] text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark All Present</span>
            </button>
          )}
        </div>
      </div>

      {/* Date & Summary Stat Banner */}
      <div className="bg-white p-4 rounded-xl border border-[#D6DCE0] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-[#356B9A]" />
          <div>
            <label className="block text-[11px] font-semibold text-[#727A84]">Attendance Session Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-0.5 px-3 py-1.5 bg-[#F0F3F3] border border-[#D6DCE0] rounded-md text-xs font-semibold text-[#0C1629]"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 text-center divide-x divide-[#D6DCE0]">
          <div className="px-3">
            <span className="text-[11px] text-[#727A84]">Present</span>
            <p className="text-lg font-bold text-[#287A52]">{presentCount}</p>
          </div>
          <div className="px-3">
            <span className="text-[11px] text-[#727A84]">Absent</span>
            <p className="text-lg font-bold text-[#B54747]">{absentCount}</p>
          </div>
          <div className="px-3">
            <span className="text-[11px] text-[#727A84]">On Leave</span>
            <p className="text-lg font-bold text-[#A66B16]">{leaveCount}</p>
          </div>
          <div className="px-3">
            <span className="text-[11px] text-[#727A84]">Compliance</span>
            <p className="text-lg font-bold text-[#0C1629]">{percent}%</p>
          </div>
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
            placeholder="Search student or room..."
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
            <option value="ALL">All Records</option>
            <option value="Present">Present Only</option>
            <option value="Absent">Absent Only</option>
            <option value="On Leave">On Leave</option>
            <option value="Unrecorded">Unrecorded</option>
          </select>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl border border-[#D6DCE0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#0C1629]">
            <thead className="bg-[#F0F3F3] text-[#727A84] uppercase text-[10px] font-semibold border-b border-[#D6DCE0]">
              <tr>
                <th className="py-3 px-4">Resident</th>
                <th className="py-3 px-4">Room No</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4">Logged By</th>
                {canEditAttendance && <th className="py-3 px-4 text-right">Attendance Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D6DCE0]/60">
              {filteredStudents.map((student) => {
                const record = dateAttendance.find((a) => a.student_id === student.id);
                const currentStatus = record ? record.status : 'Unrecorded';

                return (
                  <tr key={student.id} className="hover:bg-[#F0F3F3]/50">
                    <td className="py-3 px-4">
                      <span className="font-semibold text-[#0C1629] block">{student.full_name}</span>
                      <span className="font-mono text-[10px] text-[#727A84]">{student.student_code}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#0C1629]">{student.room_number || 'Unallocated'}</td>
                    <td className="py-3 px-4 text-[#727A84]">{student.department}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          currentStatus === 'Unrecorded'
                            ? 'bg-gray-100 text-gray-500 border border-gray-200'
                            : getStatusBadgeClasses(currentStatus)
                        }`}
                      >
                        {currentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[11px] text-[#727A84]">
                      {record ? record.recorded_by : 'Pending verification'}
                    </td>
                    {canEditAttendance && (
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleSetStatus(student, 'Present')}
                            className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                              currentStatus === 'Present'
                                ? 'bg-[#287A52] text-white shadow-xs'
                                : 'bg-[#F0F3F3] text-[#287A52] hover:bg-[#287A52]/10 border border-[#D6DCE0]'
                            }`}
                          >
                            <Check className="w-3 h-3" />
                            <span>Present</span>
                          </button>
                          <button
                            onClick={() => handleSetStatus(student, 'Absent')}
                            className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                              currentStatus === 'Absent'
                                ? 'bg-[#B54747] text-white shadow-xs'
                                : 'bg-[#F0F3F3] text-[#B54747] hover:bg-[#B54747]/10 border border-[#D6DCE0]'
                            }`}
                          >
                            <XIcon className="w-3 h-3" />
                            <span>Absent</span>
                          </button>
                          <button
                            onClick={() => handleSetStatus(student, 'On Leave')}
                            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                              currentStatus === 'On Leave'
                                ? 'bg-[#A66B16] text-white shadow-xs'
                                : 'bg-[#F0F3F3] text-[#A66B16] hover:bg-[#A66B16]/10 border border-[#D6DCE0]'
                            }`}
                          >
                            Leave
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
