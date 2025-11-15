// Employee Service
import { apiClient, PaginatedResponse } from '../utils/api/apiClient';
import { Employee } from '../types';

export interface CreateEmployeeRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  role: string;
  department?: string;
  hourlyRate?: number;
  hireDate: string;
  status?: 'active' | 'inactive' | 'on_leave';
  notes?: string;
}

export interface EmployeeFilters {
  page?: number;
  limit?: number;
  status?: string;
  role?: string;
  department?: string;
  search?: string;
}

export const employeeService = {
  /**
   * Get all employees
   */
  async getEmployees(filters?: EmployeeFilters): Promise<PaginatedResponse<Employee>> {
    return apiClient.get<PaginatedResponse<Employee>>('/employees', filters);
  },

  /**
   * Get single employee
   */
  async getEmployee(id: string): Promise<Employee> {
    return apiClient.get<Employee>(`/employees/${id}`);
  },

  /**
   * Create employee
   */
  async createEmployee(data: CreateEmployeeRequest): Promise<Employee> {
    return apiClient.post<Employee>('/employees', data);
  },

  /**
   * Update employee
   */
  async updateEmployee(id: string, data: Partial<CreateEmployeeRequest>): Promise<Employee> {
    return apiClient.put<Employee>(`/employees/${id}`, data);
  },

  /**
   * Delete employee
   */
  async deleteEmployee(id: string): Promise<void> {
    return apiClient.delete<void>(`/employees/${id}`);
  },

  /**
   * Terminate employee
   */
  async terminateEmployee(id: string, terminationDate?: string): Promise<Employee> {
    return apiClient.post<Employee>(`/employees/${id}/terminate`, { terminationDate });
  },
};
