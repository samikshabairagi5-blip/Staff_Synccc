export type UserRole = 'employee' | 'manager' | 'hr';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  employeeId: string;
  department: string;
  designation: string;
  phone?: string;
  token?: string;
}

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface LeaveBalance {
  annual: number;
  sick: number;
  casual: number;
  maternity: number;
  unpaid?: number;
}

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  salary: number;
  dateOfJoining: string;
  status: 'active' | 'on_leave' | 'probation' | 'resigned';
  managerId: string;
  managerName: string;
  avatar: string;
  emergencyContact: EmergencyContact;
  skills: string[];
  address: string;
  leaveBalance: LeaveBalance;
  performanceScore: number; // 1-5 scale
}

export type AttendanceStatus = 'present' | 'absent' | 'half_day' | 'late' | 'on_leave';
export type WorkMode = 'office' | 'remote' | 'hybrid';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string; // YYYY-MM-DD
  clockIn: string; // HH:mm:ss
  clockOut?: string; // HH:mm:ss
  totalHours?: number;
  status: AttendanceStatus;
  workMode: WorkMode;
  location?: string;
  notes?: string;
}

export type LeaveType = 'annual' | 'sick' | 'casual' | 'maternity' | 'unpaid';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: string;
  managerId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: LeaveStatus;
  appliedAt: string;
  reviewedBy?: string;
  reviewerRole?: string;
  managerComment?: string;
  reviewedAt?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  department: string; // 'All' or specific department
  priority: 'urgent' | 'high' | 'normal';
  authorName: string;
  authorRole: string;
  date: string;
  tags: string[];
  isPinned: boolean;
}

export interface TrainingModule {
  id: string;
  title: string;
  durationMinutes: number;
  completed: boolean;
  summary: string;
}

export interface TrainingProgram {
  id: string;
  title: string;
  description: string;
  category: 'Engineering' | 'Management' | 'Security & Compliance' | 'Productivity' | 'Design';
  instructor: string;
  durationHours: number;
  enrolledCount: number;
  enrolledEmployeeIds: string[];
  modules: TrainingModule[];
  status: 'enrolled' | 'in_progress' | 'completed' | 'available';
  completionDate?: string;
  certificateIssued?: boolean;
  certificateId?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  targetRole?: UserRole | 'all';
  title: string;
  message: string;
  type: 'leave' | 'attendance' | 'announcement' | 'training' | 'performance' | 'system';
  timestamp: string;
  read: boolean;
  linkTab?: string;
}

export interface PerformanceRatingCategories {
  technicalSkills: number;
  communication: number;
  punctuality: number;
  problemSolving: number;
  teamwork: number;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  reviewerId: string;
  reviewerName: string;
  reviewPeriod: string;
  date: string;
  rating: number; // 1 to 5 average
  categories: PerformanceRatingCategories;
  strengths: string;
  areasForImprovement: string;
  managerNotes: string;
  goalsNextQuarter: string[];
  status: 'submitted' | 'acknowledged';
}

export interface Department {
  id: string;
  name: string;
  code: string;
  managerId: string;
  managerName: string;
  employeeCount: number;
  budgetAnnual: number;
}
