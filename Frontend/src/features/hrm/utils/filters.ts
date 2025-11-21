/**
 * HRM Filters Utilities
 * Pure filtering and search functions
 */

import type { Employee } from '../types/hrm.types';

/**
 * Filter employees by search term
 */
export const filterEmployeesBySearch = (
  employees: Employee[],
  searchTerm: string
): Employee[] => {
  if (!searchTerm) return employees;

  const searchLower = searchTerm.toLowerCase();

  return employees.filter((employee) => {
    // Search in name
    if (employee.name.toLowerCase().includes(searchLower)) return true;

    // Search in email
    if (employee.email.toLowerCase().includes(searchLower)) return true;

    // Search in phone
    if (employee.phone?.toLowerCase().includes(searchLower)) return true;

    // Search in role
    if (employee.role.toLowerCase().includes(searchLower)) return true;

    return false;
  });
};

/**
 * Filter employees by role
 */
export const filterEmployeesByRole = (
  employees: Employee[],
  role: string | null
): Employee[] => {
  if (!role) return employees;
  return employees.filter((employee) => employee.role === role);
};

/**
 * Filter employees by availability
 */
export const filterEmployeesByAvailability = (
  employees: Employee[],
  availability: string | null
): Employee[] => {
  if (!availability) return employees;
  return employees.filter((employee) => employee.availability === availability);
};

/**
 * Get available employees
 */
export const getAvailableEmployees = (employees: Employee[]): Employee[] => {
  return employees.filter((employee) => employee.availability === 'available');
};

/**
 * Get employees on vacation
 */
export const getEmployeesOnVacation = (employees: Employee[]): Employee[] => {
  return employees.filter((employee) => employee.availability === 'vacation');
};

