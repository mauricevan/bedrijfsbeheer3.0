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
  | 'manage_pos';

