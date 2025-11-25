export interface PersonalDetails {
  address: string;
  city: string;
  postalCode: string;
  bsn: string;
  dateOfBirth: string;
  nationality: string;
  gender: 'male' | 'female' | 'other';
  maritalStatus: string;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
}

export interface Contract {
  id: string;
  type: 'permanent' | 'temporary' | 'freelance' | 'on_call';
  startDate: string;
  endDate?: string;
  hoursPerWeek: number;
  fte: number;
  jobTitle: string;
  department?: string;
  status: 'active' | 'terminated' | 'expired';
}

export interface SalaryComponent {
  id: string;
  name: string;
  amount: number;
  type: 'fixed' | 'variable';
  taxable: boolean;
}

export interface SalaryRecord {
  id: string;
  startDate: string;
  grossSalary: number;
  currency: string;
  frequency: 'monthly' | '4-weekly' | 'hourly';
  components: SalaryComponent[];
}

export interface BankDetails {
  iban: string;
  accountHolder: string;
  bankName?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  hireDate: string;
  vacationDays: number;
  usedVacationDays: number;
  availability: 'available' | 'unavailable' | 'vacation';
  password?: string; // Simple password for demo
  permissions: string[];
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Extended HRM fields
  personalDetails?: PersonalDetails;
  contracts?: Contract[];
  salaryHistory?: SalaryRecord[];
  bankDetails?: BankDetails;
}

export interface EmployeeNote {
  id: string;
  employeeId: string;
  type: 'attendance' | 'milestone' | 'performance' | 'warning' | 'compliment' | 'general' | 'late' | 'absence';
  title: string;
  description: string;
  date: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type Permission =
  | 'full_admin'
  | 'manage_modules'
  | 'manage_inventory'
  | 'manage_crm'
  | 'manage_accounting'
  | 'manage_workorders'
  | 'manage_employees'
  | 'view_all_workorders'
  | 'view_reports'
  | 'manage_planning'
  | 'manage_pos'
  | 'manage_hrm';

// Form input types
export type CreateEmployeeInput = Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateEmployeeInput = Partial<Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>>;

export type CreateEmployeeNoteInput = Omit<EmployeeNote, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateEmployeeNoteInput = Partial<Omit<EmployeeNote, 'id' | 'createdAt' | 'updatedAt'>>;

// Disciplinair Dossier Types
export type IncidentType = 
  | 'late_arrival'
  | 'no_show'
  | 'inappropriate_behavior'
  | 'not_following_agreements'
  | 'safety_violation'
  | 'policy_violation'
  | 'performance_issue'
  | 'other';

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';
export type IncidentStatus = 'open' | 'in_progress' | 'resolved';

export interface IncidentAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  uploadedAt: string;
}

export interface Incident {
  id: string;
  employeeId: string;
  date: string;
  time: string;
  type: IncidentType;
  severity: IncidentSeverity;
  description: string;
  witnesses: string[]; // Array of employee IDs
  attachments: IncidentAttachment[];
  createdBy: string; // Employee ID of creator
  status: IncidentStatus;
  createdAt: string;
  updatedAt: string;
}

export type WarningType = 'verbal' | 'written' | 'final';

export interface Warning {
  id: string;
  employeeId: string;
  incidentId?: string; // Optional link to incident
  type: WarningType;
  date: string;
  validUntil?: string;
  reason: string;
  fullText: string;
  signedByEmployee: boolean;
  employeeSignatureDate?: string;
  employeeComments?: string;
  attachments: IncidentAttachment[];
  createdBy: string; // Employee ID of creator
  createdAt: string;
  updatedAt: string;
}

export interface ImprovementPlan {
  id: string;
  employeeId: string;
  incidentId?: string;
  warningId?: string;
  title: string;
  description: string;
  goals: string[];
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'cancelled';
  progress: number; // 0-100
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Form input types
export type CreateIncidentInput = Omit<Incident, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateIncidentInput = Partial<Omit<Incident, 'id' | 'createdAt' | 'updatedAt'>>;

export type CreateWarningInput = Omit<Warning, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateWarningInput = Partial<Omit<Warning, 'id' | 'createdAt' | 'updatedAt'>>;

export type CreateImprovementPlanInput = Omit<ImprovementPlan, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateImprovementPlanInput = Partial<Omit<ImprovementPlan, 'id' | 'createdAt' | 'updatedAt'>>;

// Leave Management Types
export type LeaveType = 
  | 'vacation'           // Vakantie
  | 'sick'              // Ziekte
  | 'care'              // Zorgverlof
  | 'parental'          // Ouderschapsverlof
  | 'special'           // Bijzonder verlof
  | 'unpaid'            // Onbetaald verlof
  | 'compensatory';     // Compensatieverlof

export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface LeaveAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  uploadedAt: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  halfDayStart?: boolean; // Half day at start
  halfDayEnd?: boolean;   // Half day at end
  reason?: string;
  comments?: string;
  attachments: LeaveAttachment[];
  status: LeaveStatus;
  requestedAt: string;
  reviewedBy?: string;    // Employee ID of reviewer
  reviewedAt?: string;
  reviewComments?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveBalance {
  id: string;
  employeeId: string;
  year: number;
  leaveType: LeaveType;
  totalDays: number;
  usedDays: number;
  pendingDays: number;
  remainingDays: number;
  carriedOverDays?: number; // From previous year
  expiryDate?: string;      // For carried over days
  createdAt: string;
  updatedAt: string;
}

export interface LeaveApprovalRule {
  id: string;
  leaveType: LeaveType;
  requiresApproval: boolean;
  autoApproveUnder?: number; // Auto approve if less than X days
  approverRole: string;       // Role that can approve
  multiLevelApproval: boolean;
  notifyHR: boolean;
  createdAt: string;
  updatedAt: string;
}

// Form input types for Leave Management
export type CreateLeaveRequestInput = Omit<LeaveRequest, 'id' | 'createdAt' | 'updatedAt' | 'totalDays'>;
export type UpdateLeaveRequestInput = Partial<Omit<LeaveRequest, 'id' | 'createdAt' | 'updatedAt'>>;

export type CreateLeaveBalanceInput = Omit<LeaveBalance, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateLeaveBalanceInput = Partial<Omit<LeaveBalance, 'id' | 'createdAt' | 'updatedAt'>>;

// Time Tracking Types
export type TimeEntryType = 'work' | 'break' | 'overtime' | 'travel';

export interface TimeEntry {
  id: string;
  employeeId: string;
  date: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  type: TimeEntryType;
  projectId?: string;
  taskId?: string;
  description?: string;
  billable: boolean;
  approved: boolean;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeekTimesheet {
  id: string;
  employeeId: string;
  weekStartDate: string;
  weekEndDate: string;
  entries: TimeEntry[];
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submittedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Shift Planning Types
export type ShiftType = 'morning' | 'afternoon' | 'evening' | 'night' | 'custom';

export interface Shift {
  id: string;
  employeeId: string;
  date: string;
  type: ShiftType;
  startTime: string;
  endTime: string;
  breakDuration: number; // in minutes
  location?: string;
  notes?: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShiftTemplate {
  id: string;
  name: string;
  type: ShiftType;
  startTime: string;
  endTime: string;
  breakDuration: number;
  daysOfWeek: number[]; // 0-6 (Sunday-Saturday)
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeAvailability {
  id: string;
  employeeId: string;
  dayOfWeek: number; // 0-6
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Attendance Tracking Types
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'half_day' | 'on_leave';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  breakStart?: string;
  breakEnd?: string;
  totalHours?: number;
  status: AttendanceStatus;
  lateMinutes?: number;
  notes?: string;
  location?: string; // For location tracking
  createdAt: string;
  updatedAt: string;
}

// Form input types
export type CreateTimeEntryInput = Omit<TimeEntry, 'id' | 'createdAt' | 'updatedAt' | 'totalHours'>;
export type UpdateTimeEntryInput = Partial<Omit<TimeEntry, 'id' | 'createdAt' | 'updatedAt'>>;

export type CreateShiftInput = Omit<Shift, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateShiftInput = Partial<Omit<Shift, 'id' | 'createdAt' | 'updatedAt'>>;

export type CreateAttendanceInput = Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateAttendanceInput = Partial<Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>>;

