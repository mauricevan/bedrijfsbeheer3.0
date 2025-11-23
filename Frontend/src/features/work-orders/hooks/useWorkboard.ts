/**
 * useWorkboard Hook
 * Business logic for workboard functionality
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import type { WorkOrder, WorkOrderStatus } from '../types';
import type { Employee } from '@/features/hrm/types/hrm.types';
import { filterByEmployee, getEmployeesWithWorkOrders } from '../utils/workboard';

type ViewMode = 'extended' | 'compact';

const STORAGE_KEY = 'workorders_filter_preference';

export const useWorkboard = (
  workOrders: WorkOrder[],
  employees: Employee[],
  currentUserId?: string
) => {
  // Load initial filter preference from localStorage
  const getInitialFilter = (): string | null | 'mine' => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : 'mine';
    } catch {
      return 'mine';
    }
  };

  const [viewMode, setViewMode] = useState<ViewMode>('extended');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null | 'mine'>(getInitialFilter());
  const [selectedStatus, setSelectedStatus] = useState<WorkOrderStatus | null>(null);

  // Save filter preference to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedEmployeeId));
    } catch (error) {
      console.error('Failed to save filter preference:', error);
    }
  }, [selectedEmployeeId]);

  const filteredWorkOrders = useMemo(() => {
    let filtered = filterByEmployee(workOrders, selectedEmployeeId, currentUserId);
    if (selectedStatus) {
      filtered = filtered.filter(wo => wo.status === selectedStatus);
    }
    return filtered;
  }, [workOrders, selectedEmployeeId, selectedStatus, currentUserId]);

  const availableEmployees = useMemo(() => {
    return getEmployeesWithWorkOrders(workOrders, employees);
  }, [workOrders, employees]);

  const handleEmployeeFilterChange = useCallback((employeeId: string | null | 'mine') => {
    setSelectedEmployeeId(employeeId);
    setSelectedStatus(null); // Reset status filter when changing employee
  }, []);

  const handleStatusFilterClick = useCallback((status: WorkOrderStatus | null) => {
    setSelectedStatus(prev => prev === status ? null : status);
  }, []);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  return {
    viewMode,
    selectedEmployeeId,
    selectedStatus,
    filteredWorkOrders,
    availableEmployees,
    handleEmployeeFilterChange,
    handleStatusFilterClick,
    handleViewModeChange,
  };
};

