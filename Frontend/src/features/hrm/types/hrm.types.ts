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

