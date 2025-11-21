import type { Employee, EmployeeNote } from '../types/hrm.types';
import { storage } from '@/utils/storage';

const EMPLOYEES_KEY = 'bedrijfsbeheer_employees';
const EMPLOYEE_NOTES_KEY = 'bedrijfsbeheer_employee_notes';

const DEFAULT_EMPLOYEES: Employee[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'Manager',
    hireDate: new Date(2020, 0, 1).toISOString(),
    vacationDays: 25,
    usedVacationDays: 5,
    availability: 'available',
    permissions: ['full_admin'],
    isAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Medewerker',
    hireDate: new Date(2022, 5, 15).toISOString(),
    vacationDays: 20,
    usedVacationDays: 3,
    availability: 'available',
    permissions: ['manage_workorders', 'view_reports'],
    isAdmin: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const DEFAULT_NOTES: EmployeeNote[] = [];

let EMPLOYEES = storage.get<Employee[]>(EMPLOYEES_KEY, DEFAULT_EMPLOYEES);
let NOTES = storage.get<EmployeeNote[]>(EMPLOYEE_NOTES_KEY, DEFAULT_NOTES);

const saveEmployees = () => storage.set(EMPLOYEES_KEY, EMPLOYEES);
const saveNotes = () => storage.set(EMPLOYEE_NOTES_KEY, NOTES);
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const hrmService = {
  // Employees
  getEmployees: async (): Promise<Employee[]> => {
    await delay(300);
    return [...EMPLOYEES];
  },

  getEmployee: async (id: string): Promise<Employee | undefined> => {
    await delay(200);
    return EMPLOYEES.find(e => e.id === id);
  },

  createEmployee: async (data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<Employee> => {
    await delay(500);
    const newEmployee: Employee = {
      ...data,
      id: `emp-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    EMPLOYEES.push(newEmployee);
    saveEmployees();
    return newEmployee;
  },

  updateEmployee: async (id: string, updates: Partial<Employee>): Promise<Employee> => {
    await delay(500);
    const index = EMPLOYEES.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Employee not found');
    
    const updated = {
      ...EMPLOYEES[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    EMPLOYEES[index] = updated;
    saveEmployees();
    return updated;
  },

  deleteEmployee: async (id: string): Promise<void> => {
    await delay(300);
    EMPLOYEES = EMPLOYEES.filter(e => e.id !== id);
    NOTES = NOTES.filter(n => n.employeeId !== id);
    saveEmployees();
    saveNotes();
  },

  // Notes
  getNotes: async (employeeId?: string): Promise<EmployeeNote[]> => {
    await delay(200);
    if (employeeId) {
      return NOTES.filter(n => n.employeeId === employeeId);
    }
    return [...NOTES];
  },

  createNote: async (data: Omit<EmployeeNote, 'id' | 'createdAt' | 'updatedAt'>): Promise<EmployeeNote> => {
    await delay(300);
    const newNote: EmployeeNote = {
      ...data,
      id: `note-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    NOTES.push(newNote);
    saveNotes();
    return newNote;
  },

  updateNote: async (id: string, updates: Partial<EmployeeNote>): Promise<EmployeeNote> => {
    await delay(300);
    const index = NOTES.findIndex(n => n.id === id);
    if (index === -1) throw new Error('Note not found');
    
    const updated = {
      ...NOTES[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    NOTES[index] = updated;
    saveNotes();
    return updated;
  },

  deleteNote: async (id: string): Promise<void> => {
    await delay(200);
    NOTES = NOTES.filter(n => n.id !== id);
    saveNotes();
  },
};

