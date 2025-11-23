/**
 * EmployeeFilter Component
 * Dropdown to filter work orders by employee
 */

import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { Employee } from '@/features/hrm/types/hrm.types';
import { cn } from '@/utils/cn';

type EmployeeFilterProps = {
  employees: Employee[];
  selectedEmployeeId: string | null | 'mine';
  currentUserId?: string;
  onSelect: (employeeId: string | null | 'mine') => void;
};

export const EmployeeFilter: React.FC<EmployeeFilterProps> = ({
  employees,
  selectedEmployeeId,
  onSelect,
}) => {

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        Bekijk werkorders van:
        {selectedEmployeeId === 'mine' && (
          <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded">
            Gefilterd
          </span>
        )}
      </label>
      <div className="relative">
        <select
          value={selectedEmployeeId === null ? 'all' : selectedEmployeeId === 'mine' ? 'mine' : selectedEmployeeId}
          onChange={(e) => {
            const value = e.target.value;
            if (value === 'all') onSelect(null);
            else if (value === 'mine') onSelect('mine');
            else onSelect(value);
          }}
          className={cn(
            'w-full px-4 py-2 pr-10 rounded-lg border-2',
            'bg-white dark:bg-slate-800',
            'border-slate-300 dark:border-slate-600',
            'text-slate-900 dark:text-white',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
            'appearance-none cursor-pointer'
          )}
        >
          <option value="mine">Mijn werkorders</option>
          <option value="all">Alle medewerkers</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>
              {emp.name} ({emp.role})
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
      </div>
    </div>
  );
};

