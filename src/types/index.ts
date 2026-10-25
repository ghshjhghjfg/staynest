export type UserRole = 'admin' | 'warden' | 'student' | 'staff';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: UserRole;
  account_status: 'active' | 'pending' | 'suspended';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface StudentRecord {
  id: string;
  profile_id: string;
  student_code: string; // e.g., HE-2023-042
  full_name: string;
  email: string;
  phone: string;
  department: string;
  academic_year: string; // e.g., '1st Year', '2nd Year', '3rd Year', '4th Year'
  gender?: 'Male' | 'Female' | 'Other';
  guardian_name: string;
  guardian_phone: string;
  emergency_contact: string;
  room_id?: string;
  room_number?: string;
  bed_identifier?: string;
  fee_status: 'Paid' | 'Partially Paid' | 'Pending' | 'Overdue';
  account_status: 'active' | 'pending' | 'suspended';
  joining_date: string;
  created_at: string;
}

export interface RoomRecord {
  id: string;
  building: string;
  floor: number;
  room_number: string;
  capacity: number;
  occupied_beds: number;
  available_beds: number;
  room_type: 'Single' | 'Double' | 'Triple' | 'Four Sharing';
  is_active: boolean;
  notes?: string;
  created_at: string;
}

export interface RoomAllocation {
  id: string;
  student_id: string;
  student_name: string;
  student_code: string;
  room_id: string;
  room_number: string;
  bed_identifier: string; // e.g., Bed-1, Bed-2
  allocated_at: string;
  released_at?: string | null;
  allocation_status: 'active' | 'released';
  allocated_by: string;
}

export interface FeeCharge {
  id: string;
  student_id: string;
  student_name: string;
  student_code: string;
  category: 'Hostel Rent' | 'Mess Fee' | 'Maintenance & Utilities' | 'Security Deposit' | 'Gym & Amenities';
  amount: number;
  due_date: string;
  description: string;
  created_at: string;
}

export interface PaymentRecord {
  id: string;
  student_id: string;
  student_name: string;
  student_code: string;
  fee_charge_id?: string;
  fee_category: string;
  amount: number;
  payment_method: 'Bank Transfer' | 'UPI' | 'Demand Draft' | 'Cash Receipt';
  transaction_reference: string;
  payment_status: 'Confirmed' | 'Pending Verification' | 'Failed';
  recorded_by: string;
  recorded_at: string;
  receipt_number: string;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  student_name: string;
  student_code: string;
  room_number: string;
  attendance_date: string; // YYYY-MM-DD
  status: 'Present' | 'Absent' | 'On Leave';
  recorded_by: string;
  remarks?: string;
  created_at: string;
}

export interface LeaveRequest {
  id: string;
  student_id: string;
  student_name: string;
  student_code: string;
  room_number: string;
  start_date: string;
  end_date: string;
  reason: string;
  destination: string;
  emergency_contact: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  reviewed_by?: string;
  reviewed_at?: string;
  rejection_reason?: string;
  created_at: string;
}

export interface ComplaintRecord {
  id: string;
  student_id: string;
  student_name: string;
  student_code: string;
  title: string;
  category: 'Electrical' | 'Plumbing' | 'Water' | 'Wi-Fi' | 'Cleanliness' | 'Furniture' | 'Food' | 'Other';
  description: string;
  location: string; // e.g. Room A-101 or Common Area
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Submitted' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed';
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  resolution_notes?: string;
}

export interface ComplaintUpdate {
  id: string;
  complaint_id: string;
  updated_by: string;
  status: string;
  message: string;
  is_internal: boolean;
  created_at: string;
}

export interface MessMenu {
  id: string;
  day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  breakfast: string;
  lunch: string;
  snacks: string;
  dinner: string;
  special_item?: string;
  is_published: boolean;
  published_by: string;
  updated_at: string;
}

export interface FoodFeedback {
  id: string;
  student_id: string;
  student_name: string;
  meal_type: 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner';
  date: string;
  rating: number; // 1 to 5
  comments: string;
  category: 'Taste & Quality' | 'Hygiene' | 'Portion Size' | 'Timeliness';
  reviewed_by_staff: boolean;
  created_at: string;
}

export interface VisitorRecord {
  id: string;
  visitor_name: string;
  visitor_phone: string;
  relationship: string;
  student_id: string;
  student_name: string;
  student_code: string;
  purpose: string;
  entry_time: string;
  exit_time?: string | null;
  recorded_by: string;
  status: 'Inside' | 'Checked Out';
}

export interface MaintenanceTask {
  id: string;
  title: string;
  description: string;
  category: 'Carpentry' | 'Plumbing' | 'Electrical' | 'HVAC / Fan' | 'Appliance' | 'Civil & Painting';
  location: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Pending' | 'Assigned' | 'In Progress' | 'Completed' | 'Cancelled';
  assigned_to?: string;
  created_by: string;
  created_at: string;
  completed_at?: string;
  cost?: number;
  notes?: string;
}

export interface NoticeRecord {
  id: string;
  title: string;
  body: string;
  category: 'General' | 'Fees' | 'Holiday' | 'Maintenance' | 'Mess' | 'Emergency';
  target_audience: 'All Residents' | 'Students' | 'Staff' | 'Wing A' | 'Wing B';
  published_at: string;
  expires_at?: string;
  created_by: string;
  is_published: boolean;
  is_emergency: boolean;
}

export interface NotificationItem {
  id: string;
  recipient_id: string;
  title: string;
  message: string;
  notification_type: 'fee' | 'leave' | 'complaint' | 'notice' | 'maintenance' | 'system';
  read_at?: string | null;
  created_at: string;
}
