import { useState, useEffect, useCallback } from 'react';
import type { 
  Employee, EmployeeNote,
  CreateEmployeeInput, UpdateEmployeeInput,
  CreateEmployeeNoteInput, UpdateEmployeeNoteInput
} from '../types/hrm.types';
import { hrmService } from '../services/hrmService';

export const useHRM = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [notes, setNotes] = useState<EmployeeNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [employeesData, notesData] = await Promise.all([
        hrmService.getEmployees(),
        hrmService.getNotes(),
      ]);
      setEmployees(employeesData);
      setNotes(notesData);
    } catch (error) {
      console.error('Failed to fetch HRM data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createEmployee = async (data: CreateEmployeeInput) => {
    const newEmployee = await hrmService.createEmployee(data);
    setEmployees(prev => [...prev, newEmployee]);
    return newEmployee;
  };

  const updateEmployee = async (id: string, updates: UpdateEmployeeInput) => {
    const updated = await hrmService.updateEmployee(id, updates);
    setEmployees(prev => prev.map(e => e.id === id ? updated : e));
    return updated;
  };

  const deleteEmployee = async (id: string) => {
    await hrmService.deleteEmployee(id);
    setEmployees(prev => prev.filter(e => e.id !== id));
    setNotes(prev => prev.filter(n => n.employeeId !== id));
  };

  const createNote = async (data: CreateEmployeeNoteInput) => {
    const newNote = await hrmService.createNote(data);
    setNotes(prev => [...prev, newNote]);
    return newNote;
  };

  const updateNote = async (id: string, updates: UpdateEmployeeNoteInput) => {
    const updated = await hrmService.updateNote(id, updates);
    setNotes(prev => prev.map(n => n.id === id ? updated : n));
    return updated;
  };

  const deleteNote = async (id: string) => {
    await hrmService.deleteNote(id);
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const getEmployeeNotes = (employeeId: string) => {
    return notes.filter(n => n.employeeId === employeeId);
  };

  return {
    employees,
    notes,
    isLoading,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    createNote,
    updateNote,
    deleteNote,
    getEmployeeNotes,
    refresh: fetchData,
  };
};

