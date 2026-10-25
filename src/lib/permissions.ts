import { UserRole } from '../types';

export const ROLE_PERMISSIONS = {
  admin: {
    canManageStudents: true,
    canManageRooms: true,
    canAllocateRooms: true,
    canManageFees: true,
    canRecordPayments: true,
    canTakeAttendance: true,
    canReviewLeaves: true,
    canManageComplaints: true,
    canManageMess: true,
    canManageVisitors: true,
    canManageMaintenance: true,
    canManageNotices: true,
    canViewReports: true,
    canAccessSettings: true,
  },
  warden: {
    canManageStudents: true,
    canManageRooms: true,
    canAllocateRooms: true,
    canManageFees: true,
    canRecordPayments: false, // only view fees, not financial cashier
    canTakeAttendance: true,
    canReviewLeaves: true,
    canManageComplaints: true,
    canManageMess: true,
    canManageVisitors: true,
    canManageMaintenance: true,
    canManageNotices: true,
    canViewReports: true,
    canAccessSettings: false,
  },
  staff: {
    canManageStudents: false,
    canManageRooms: false,
    canAllocateRooms: false,
    canManageFees: false,
    canRecordPayments: false,
    canTakeAttendance: true,
    canReviewLeaves: false,
    canManageComplaints: true, // can update complaint progress
    canManageMess: true, // can view & publish meals
    canManageVisitors: true, // can log visitors
    canManageMaintenance: true, // can update maintenance tasks
    canManageNotices: false,
    canViewReports: false,
    canAccessSettings: false,
  },
  student: {
    canManageStudents: false,
    canManageRooms: false,
    canAllocateRooms: false,
    canManageFees: false,
    canRecordPayments: false,
    canTakeAttendance: false,
    canReviewLeaves: false,
    canManageComplaints: false, // can only submit own complaints
    canManageMess: false, // can view menu & submit feedback
    canManageVisitors: false,
    canManageMaintenance: false,
    canManageNotices: false,
    canViewReports: false,
    canAccessSettings: false,
  },
};

export function canAccessModule(role: UserRole, modulePath: string): boolean {
  switch (modulePath) {
    case 'students':
      return role === 'admin' || role === 'warden';
    case 'rooms':
      return role === 'admin' || role === 'warden' || role === 'student'; // students can view their room
    case 'fees':
      return true; // all can view, students see their own
    case 'attendance':
      return true; // all can view, students see their own, staff/admin mark
    case 'leaves':
      return true; // students submit, admin/warden review
    case 'complaints':
      return true; // students submit, staff/warden/admin resolve
    case 'mess':
      return true; // all view menu & feedback
    case 'visitors':
      return role === 'admin' || role === 'warden' || role === 'staff';
    case 'maintenance':
      return role === 'admin' || role === 'warden' || role === 'staff';
    case 'notices':
      return true; // all read notices
    case 'reports':
      return role === 'admin' || role === 'warden';
    case 'settings':
      return role === 'admin';
    default:
      return true;
  }
}
