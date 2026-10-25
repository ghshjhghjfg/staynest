import {
  StudentRecord,
  RoomRecord,
  RoomAllocation,
  FeeCharge,
  PaymentRecord,
  AttendanceRecord,
  LeaveRequest,
  ComplaintRecord,
  MessMenu,
  FoodFeedback,
  VisitorRecord,
  MaintenanceTask,
  NoticeRecord,
  NotificationItem,
} from '../types';
import {
  SEED_STUDENTS,
  SEED_ROOMS,
  SEED_ALLOCATIONS,
  SEED_FEE_CHARGES,
  SEED_PAYMENTS,
  SEED_ATTENDANCE,
  SEED_LEAVE_REQUESTS,
  SEED_COMPLAINTS,
  SEED_MESS_MENUS,
  SEED_FOOD_FEEDBACK,
  SEED_VISITORS,
  SEED_MAINTENANCE_TASKS,
  SEED_NOTICES,
  SEED_NOTIFICATIONS,
} from './seedData';

const STORAGE_KEYS = {
  STUDENTS: 'staynest_students_v1',
  ROOMS: 'staynest_rooms_v1',
  ALLOCATIONS: 'staynest_allocations_v1',
  FEE_CHARGES: 'staynest_fee_charges_v1',
  PAYMENTS: 'staynest_payments_v1',
  ATTENDANCE: 'staynest_attendance_v1',
  LEAVES: 'staynest_leaves_v1',
  COMPLAINTS: 'staynest_complaints_v1',
  MESS_MENUS: 'staynest_mess_menus_v1',
  FOOD_FEEDBACK: 'staynest_food_feedback_v1',
  VISITORS: 'staynest_visitors_v1',
  MAINTENANCE: 'staynest_maintenance_v1',
  NOTICES: 'staynest_notices_v1',
  NOTIFICATIONS: 'staynest_notifications_v1',
};

function getStorage<T>(key: string, defaultValue: T): T {
  try {
    let raw = localStorage.getItem(key);
    if (!raw) {
      // Check legacy key if exists
      const legacyKey = key.replace('staynest_', 'hostelease_');
      raw = localStorage.getItem(legacyKey);
    }
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('staynest_store_updated'));
  } catch (err) {
    console.error('Storage write error:', err);
  }
}

export const dataStore = {
  // Reset all to deterministic seeds
  resetToDefaults: () => {
    setStorage(STORAGE_KEYS.STUDENTS, SEED_STUDENTS);
    setStorage(STORAGE_KEYS.ROOMS, SEED_ROOMS);
    setStorage(STORAGE_KEYS.ALLOCATIONS, SEED_ALLOCATIONS);
    setStorage(STORAGE_KEYS.FEE_CHARGES, SEED_FEE_CHARGES);
    setStorage(STORAGE_KEYS.PAYMENTS, SEED_PAYMENTS);
    setStorage(STORAGE_KEYS.ATTENDANCE, SEED_ATTENDANCE);
    setStorage(STORAGE_KEYS.LEAVES, SEED_LEAVE_REQUESTS);
    setStorage(STORAGE_KEYS.COMPLAINTS, SEED_COMPLAINTS);
    setStorage(STORAGE_KEYS.MESS_MENUS, SEED_MESS_MENUS);
    setStorage(STORAGE_KEYS.FOOD_FEEDBACK, SEED_FOOD_FEEDBACK);
    setStorage(STORAGE_KEYS.VISITORS, SEED_VISITORS);
    setStorage(STORAGE_KEYS.MAINTENANCE, SEED_MAINTENANCE_TASKS);
    setStorage(STORAGE_KEYS.NOTICES, SEED_NOTICES);
    setStorage(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
  },

  // STUDENTS
  getStudents: (): StudentRecord[] => getStorage(STORAGE_KEYS.STUDENTS, SEED_STUDENTS),
  getStudentById: (id: string): StudentRecord | undefined => {
    return dataStore.getStudents().find((s) => s.id === id || s.profile_id === id);
  },
  addStudent: (student: Omit<StudentRecord, 'id' | 'created_at'>): StudentRecord => {
    const students = dataStore.getStudents();
    const newStudent: StudentRecord = {
      ...student,
      id: `std-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setStorage(STORAGE_KEYS.STUDENTS, [newStudent, ...students]);
    return newStudent;
  },
  updateStudent: (id: string, updates: Partial<StudentRecord>): StudentRecord | null => {
    const students = dataStore.getStudents();
    const index = students.findIndex((s) => s.id === id);
    if (index === -1) return null;
    const updated = { ...students[index], ...updates };
    students[index] = updated;
    setStorage(STORAGE_KEYS.STUDENTS, [...students]);
    return updated;
  },
  deleteStudent: (id: string): boolean => {
    const students = dataStore.getStudents();
    const filtered = students.filter((s) => s.id !== id);
    if (filtered.length === students.length) return false;
    setStorage(STORAGE_KEYS.STUDENTS, filtered);
    return true;
  },

  // ROOMS
  getRooms: (): RoomRecord[] => {
    const rooms = getStorage<RoomRecord[]>(STORAGE_KEYS.ROOMS, SEED_ROOMS);
    const allocations = dataStore.getAllocations().filter((a) => a.allocation_status === 'active');
    
    // Recalculate occupied and available beds dynamically to guarantee 100% consistency
    return rooms.map((room) => {
      const activeCount = allocations.filter((a) => a.room_id === room.id).length;
      return {
        ...room,
        occupied_beds: activeCount,
        available_beds: Math.max(0, room.capacity - activeCount),
      };
    });
  },
  addRoom: (room: Omit<RoomRecord, 'id' | 'occupied_beds' | 'available_beds' | 'created_at'>): RoomRecord => {
    const rooms = dataStore.getRooms();
    const newRoom: RoomRecord = {
      ...room,
      id: `room-${Date.now()}`,
      occupied_beds: 0,
      available_beds: room.capacity,
      created_at: new Date().toISOString(),
    };
    setStorage(STORAGE_KEYS.ROOMS, [...rooms, newRoom]);
    return newRoom;
  },
  updateRoom: (id: string, updates: Partial<RoomRecord>): RoomRecord | null => {
    const rooms = getStorage<RoomRecord[]>(STORAGE_KEYS.ROOMS, SEED_ROOMS);
    const index = rooms.findIndex((r) => r.id === id);
    if (index === -1) return null;
    rooms[index] = { ...rooms[index], ...updates };
    setStorage(STORAGE_KEYS.ROOMS, [...rooms]);
    return rooms[index];
  },

  // ALLOCATIONS
  getAllocations: (): RoomAllocation[] => getStorage(STORAGE_KEYS.ALLOCATIONS, SEED_ALLOCATIONS),
  allocateStudentToRoom: (
    studentId: string,
    roomId: string,
    bedIdentifier: string,
    allocatedBy: string
  ): { success: boolean; message: string; allocation?: RoomAllocation } => {
    const students = dataStore.getStudents();
    const rooms = dataStore.getRooms();
    const student = students.find((s) => s.id === studentId);
    const room = rooms.find((r) => r.id === roomId);

    if (!student || !room) {
      return { success: false, message: 'Student or Room not found.' };
    }

    // Check capacity
    const activeInRoom = dataStore
      .getAllocations()
      .filter((a) => a.room_id === roomId && a.allocation_status === 'active');

    if (activeInRoom.length >= room.capacity) {
      return { success: false, message: `Room ${room.room_number} is already at full capacity (${room.capacity}/${room.capacity}).` };
    }

    // Check if bed already taken in room
    const bedTaken = activeInRoom.some((a) => a.bed_identifier.toLowerCase() === bedIdentifier.toLowerCase());
    if (bedTaken) {
      return { success: false, message: `${bedIdentifier} in Room ${room.room_number} is already occupied.` };
    }

    // Release any previous active allocation for this student
    const allocations = dataStore.getAllocations();
    const now = new Date().toISOString();
    const updatedAllocations = allocations.map((a) => {
      if (a.student_id === studentId && a.allocation_status === 'active') {
        return { ...a, allocation_status: 'released' as const, released_at: now };
      }
      return a;
    });

    const newAlloc: RoomAllocation = {
      id: `alloc-${Date.now()}`,
      student_id: student.id,
      student_name: student.full_name,
      student_code: student.student_code,
      room_id: room.id,
      room_number: room.room_number,
      bed_identifier: bedIdentifier,
      allocated_at: now,
      released_at: null,
      allocation_status: 'active',
      allocated_by: allocatedBy,
    };

    setStorage(STORAGE_KEYS.ALLOCATIONS, [newAlloc, ...updatedAllocations]);

    // Update student's room info
    dataStore.updateStudent(student.id, {
      room_id: room.id,
      room_number: room.room_number,
      bed_identifier: bedIdentifier,
    });

    return { success: true, message: `Allocated ${student.full_name} to ${room.room_number} (${bedIdentifier})`, allocation: newAlloc };
  },

  releaseStudentBed: (studentId: string): boolean => {
    const allocations = dataStore.getAllocations();
    const now = new Date().toISOString();
    let found = false;

    const updated = allocations.map((a) => {
      if (a.student_id === studentId && a.allocation_status === 'active') {
        found = true;
        return { ...a, allocation_status: 'released' as const, released_at: now };
      }
      return a;
    });

    if (found) {
      setStorage(STORAGE_KEYS.ALLOCATIONS, updated);
      dataStore.updateStudent(studentId, {
        room_id: undefined,
        room_number: undefined,
        bed_identifier: undefined,
      });
    }
    return found;
  },

  // FEES & PAYMENTS
  getFeeCharges: (): FeeCharge[] => getStorage(STORAGE_KEYS.FEE_CHARGES, SEED_FEE_CHARGES),
  getPayments: (): PaymentRecord[] => getStorage(STORAGE_KEYS.PAYMENTS, SEED_PAYMENTS),
  addFeeCharge: (charge: Omit<FeeCharge, 'id' | 'created_at'>): FeeCharge => {
    const charges = dataStore.getFeeCharges();
    const newCharge: FeeCharge = {
      ...charge,
      id: `fee-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setStorage(STORAGE_KEYS.FEE_CHARGES, [newCharge, ...charges]);
    return newCharge;
  },
  recordPayment: (payment: Omit<PaymentRecord, 'id' | 'recorded_at' | 'receipt_number'>): PaymentRecord => {
    const payments = dataStore.getPayments();
    const newPayment: PaymentRecord = {
      ...payment,
      id: `pay-${Date.now()}`,
      recorded_at: new Date().toISOString(),
      receipt_number: `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    setStorage(STORAGE_KEYS.PAYMENTS, [newPayment, ...payments]);

    // Recalculate fee status for the student
    const studentCharges = dataStore.getFeeCharges().filter((c) => c.student_id === payment.student_id);
    const studentPayments = [newPayment, ...payments].filter(
      (p) => p.student_id === payment.student_id && p.payment_status === 'Confirmed'
    );

    const totalBilled = studentCharges.reduce((sum, c) => sum + c.amount, 0);
    const totalPaid = studentPayments.reduce((sum, p) => sum + p.amount, 0);

    let feeStatus: StudentRecord['fee_status'] = 'Paid';
    if (totalPaid === 0 && totalBilled > 0) {
      feeStatus = 'Pending';
    } else if (totalPaid < totalBilled) {
      feeStatus = 'Partially Paid';
    } else {
      feeStatus = 'Paid';
    }

    dataStore.updateStudent(payment.student_id, { fee_status: feeStatus });
    return newPayment;
  },

  // ATTENDANCE
  getAttendance: (): AttendanceRecord[] => getStorage(STORAGE_KEYS.ATTENDANCE, SEED_ATTENDANCE),
  markAttendance: (record: Omit<AttendanceRecord, 'id' | 'created_at'>): AttendanceRecord => {
    const attendance = dataStore.getAttendance();
    const existingIndex = attendance.findIndex(
      (a) => a.student_id === record.student_id && a.attendance_date === record.attendance_date
    );

    const updatedItem: AttendanceRecord = {
      ...record,
      id: existingIndex >= 0 ? attendance[existingIndex].id : `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      created_at: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      attendance[existingIndex] = updatedItem;
      setStorage(STORAGE_KEYS.ATTENDANCE, [...attendance]);
    } else {
      setStorage(STORAGE_KEYS.ATTENDANCE, [updatedItem, ...attendance]);
    }

    return updatedItem;
  },

  // LEAVE REQUESTS
  getLeaves: (): LeaveRequest[] => getStorage(STORAGE_KEYS.LEAVES, SEED_LEAVE_REQUESTS),
  submitLeave: (request: Omit<LeaveRequest, 'id' | 'created_at' | 'status'>): LeaveRequest => {
    const leaves = dataStore.getLeaves();
    const newLeave: LeaveRequest = {
      ...request,
      id: `leave-${Date.now()}`,
      status: 'Pending',
      created_at: new Date().toISOString(),
    };
    setStorage(STORAGE_KEYS.LEAVES, [newLeave, ...leaves]);
    return newLeave;
  },
  reviewLeave: (
    id: string,
    status: 'Approved' | 'Rejected',
    reviewedBy: string,
    rejectionReason?: string
  ): LeaveRequest | null => {
    const leaves = dataStore.getLeaves();
    const index = leaves.findIndex((l) => l.id === id);
    if (index === -1) return null;

    leaves[index] = {
      ...leaves[index],
      status,
      reviewed_by: reviewedBy,
      reviewed_at: new Date().toISOString(),
      rejection_reason: rejectionReason,
    };
    setStorage(STORAGE_KEYS.LEAVES, [...leaves]);
    return leaves[index];
  },
  cancelLeave: (id: string, studentId: string): boolean => {
    const leaves = dataStore.getLeaves();
    const index = leaves.findIndex((l) => l.id === id && l.student_id === studentId);
    if (index === -1) return false;
    if (leaves[index].status !== 'Pending') return false;

    leaves[index] = {
      ...leaves[index],
      status: 'Cancelled',
    };
    setStorage(STORAGE_KEYS.LEAVES, [...leaves]);
    return true;
  },

  // COMPLAINTS
  getComplaints: (): ComplaintRecord[] => getStorage(STORAGE_KEYS.COMPLAINTS, SEED_COMPLAINTS),
  submitComplaint: (complaint: Omit<ComplaintRecord, 'id' | 'status' | 'created_at' | 'updated_at'>): ComplaintRecord => {
    const complaints = dataStore.getComplaints();
    const now = new Date().toISOString();
    const newComp: ComplaintRecord = {
      ...complaint,
      id: `comp-${Date.now()}`,
      status: 'Submitted',
      created_at: now,
      updated_at: now,
    };
    setStorage(STORAGE_KEYS.COMPLAINTS, [newComp, ...complaints]);
    return newComp;
  },
  updateComplaintStatus: (
    id: string,
    status: ComplaintRecord['status'],
    assignedTo?: string,
    resolutionNotes?: string
  ): ComplaintRecord | null => {
    const complaints = dataStore.getComplaints();
    const index = complaints.findIndex((c) => c.id === id);
    if (index === -1) return null;

    const current = complaints[index];
    const now = new Date().toISOString();
    complaints[index] = {
      ...current,
      status,
      assigned_to: assignedTo !== undefined ? assignedTo : current.assigned_to,
      resolution_notes: resolutionNotes !== undefined ? resolutionNotes : current.resolution_notes,
      resolved_at: status === 'Resolved' || status === 'Closed' ? (current.resolved_at || now) : undefined,
      updated_at: now,
    };
    setStorage(STORAGE_KEYS.COMPLAINTS, [...complaints]);
    return complaints[index];
  },

  // MESS MENUS & FEEDBACK
  getMessMenus: (): MessMenu[] => getStorage(STORAGE_KEYS.MESS_MENUS, SEED_MESS_MENUS),
  updateMessMenu: (id: string, updates: Partial<MessMenu>): MessMenu | null => {
    const menus = dataStore.getMessMenus();
    const index = menus.findIndex((m) => m.id === id);
    if (index === -1) return null;
    menus[index] = { ...menus[index], ...updates, updated_at: new Date().toISOString() };
    setStorage(STORAGE_KEYS.MESS_MENUS, [...menus]);
    return menus[index];
  },
  getFoodFeedback: (): FoodFeedback[] => getStorage(STORAGE_KEYS.FOOD_FEEDBACK, SEED_FOOD_FEEDBACK),
  addFoodFeedback: (feedback: Omit<FoodFeedback, 'id' | 'created_at' | 'reviewed_by_staff'>): FoodFeedback => {
    const list = dataStore.getFoodFeedback();
    const item: FoodFeedback = {
      ...feedback,
      id: `fb-${Date.now()}`,
      reviewed_by_staff: false,
      created_at: new Date().toISOString(),
    };
    setStorage(STORAGE_KEYS.FOOD_FEEDBACK, [item, ...list]);
    return item;
  },
  toggleFeedbackReviewed: (id: string): boolean => {
    const list = dataStore.getFoodFeedback();
    const index = list.findIndex((f) => f.id === id);
    if (index === -1) return false;
    list[index].reviewed_by_staff = !list[index].reviewed_by_staff;
    setStorage(STORAGE_KEYS.FOOD_FEEDBACK, [...list]);
    return true;
  },

  // VISITORS
  getVisitors: (): VisitorRecord[] => getStorage(STORAGE_KEYS.VISITORS, SEED_VISITORS),
  recordVisitorEntry: (entry: Omit<VisitorRecord, 'id' | 'exit_time' | 'status'>): VisitorRecord => {
    const visitors = dataStore.getVisitors();
    const newVisitor: VisitorRecord = {
      ...entry,
      id: `vis-${Date.now()}`,
      exit_time: null,
      status: 'Inside',
    };
    setStorage(STORAGE_KEYS.VISITORS, [newVisitor, ...visitors]);
    return newVisitor;
  },
  recordVisitorExit: (id: string): VisitorRecord | null => {
    const visitors = dataStore.getVisitors();
    const index = visitors.findIndex((v) => v.id === id);
    if (index === -1) return null;
    visitors[index] = {
      ...visitors[index],
      exit_time: new Date().toISOString(),
      status: 'Checked Out',
    };
    setStorage(STORAGE_KEYS.VISITORS, [...visitors]);
    return visitors[index];
  },

  // MAINTENANCE
  getMaintenanceTasks: (): MaintenanceTask[] => getStorage(STORAGE_KEYS.MAINTENANCE, SEED_MAINTENANCE_TASKS),
  addMaintenanceTask: (task: Omit<MaintenanceTask, 'id' | 'created_at' | 'status'>): MaintenanceTask => {
    const tasks = dataStore.getMaintenanceTasks();
    const newTask: MaintenanceTask = {
      ...task,
      id: `maint-${Date.now()}`,
      status: 'Pending',
      created_at: new Date().toISOString(),
    };
    setStorage(STORAGE_KEYS.MAINTENANCE, [newTask, ...tasks]);
    return newTask;
  },
  updateMaintenanceTask: (id: string, updates: Partial<MaintenanceTask>): MaintenanceTask | null => {
    const tasks = dataStore.getMaintenanceTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;
    tasks[index] = { ...tasks[index], ...updates };
    setStorage(STORAGE_KEYS.MAINTENANCE, [...tasks]);
    return tasks[index];
  },

  // NOTICES
  getNotices: (): NoticeRecord[] => getStorage(STORAGE_KEYS.NOTICES, SEED_NOTICES),
  addNotice: (notice: Omit<NoticeRecord, 'id' | 'published_at'>): NoticeRecord => {
    const notices = dataStore.getNotices();
    const newNotice: NoticeRecord = {
      ...notice,
      id: `not-${Date.now()}`,
      published_at: new Date().toISOString(),
    };
    setStorage(STORAGE_KEYS.NOTICES, [newNotice, ...notices]);
    return newNotice;
  },
  updateNotice: (id: string, updates: Partial<NoticeRecord>): NoticeRecord | null => {
    const notices = dataStore.getNotices();
    const index = notices.findIndex((n) => n.id === id);
    if (index === -1) return null;
    notices[index] = { ...notices[index], ...updates };
    setStorage(STORAGE_KEYS.NOTICES, [...notices]);
    return notices[index];
  },
  deleteNotice: (id: string): boolean => {
    const notices = dataStore.getNotices();
    const filtered = notices.filter((n) => n.id !== id);
    if (filtered.length === notices.length) return false;
    setStorage(STORAGE_KEYS.NOTICES, filtered);
    return true;
  },

  // NOTIFICATIONS
  getNotifications: (recipientId?: string): NotificationItem[] => {
    const list = getStorage<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
    if (!recipientId) return list;
    return list.filter((n) => n.recipient_id === recipientId || n.recipient_id === 'all');
  },
  markNotificationRead: (id: string): void => {
    const list = dataStore.getNotifications();
    const index = list.findIndex((n) => n.id === id);
    if (index !== -1) {
      list[index].read_at = new Date().toISOString();
      setStorage(STORAGE_KEYS.NOTIFICATIONS, [...list]);
    }
  },

  // CSV EXPORT HELPER
  exportToCSV: (filename: string, headers: string[], rows: (string | number)[][]) => {
    const content = [
      headers.join(','),
      ...rows.map((row) =>
        row
          .map((item) => {
            const str = String(item ?? '');
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
              return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
          })
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};
