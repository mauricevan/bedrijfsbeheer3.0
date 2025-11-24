/**
 * Workboard Component
 * Personalized Kanban board view for work orders
 */

import React, { useMemo } from 'react';
import { Clock } from 'lucide-react';
import { KanbanBoard } from './KanbanBoard';
import type { WorkOrder, WorkOrderStatus } from '../types';
import { calculateTotalHours, getStatusCounts } from '../utils/workboard';
import { cn } from '@/utils/cn';

type ViewMode = 'extended' | 'compact';

type WorkboardProps = {
  workOrders: WorkOrder[];
  userName: string;
  viewMode: ViewMode;
  selectedStatus: WorkOrderStatus | null;
  onCardClick: (workOrder: WorkOrder) => void;
  onStatusChange: (id: string, newStatus: WorkOrderStatus) => void;
  onStatusFilterClick: (status: WorkOrderStatus | null) => void;
};

const STATUS_LABELS: Record<WorkOrderStatus, { label: string; emoji: string }> = {
  todo: { label: 'To Do', emoji: '👆' },
  pending: { label: 'In Wacht', emoji: '👆' },
  in_progress: { label: 'Bezig', emoji: '👆' },
  completed: { label: 'Afgerond', emoji: '👆' },
};

export const Workboard: React.FC<WorkboardProps> = ({
  workOrders,
  userName,
  viewMode,
  selectedStatus,
  onCardClick,
  onStatusChange,
  onStatusFilterClick,
}) => {
  const statusCounts = useMemo(() => getStatusCounts(workOrders), [workOrders]);
  const totalHours = useMemo(() => calculateTotalHours(workOrders), [workOrders]);

  const filteredWorkOrders = useMemo(() => {
    if (!selectedStatus) return workOrders;
    return workOrders.filter(wo => wo.status === selectedStatus);
  }, [workOrders, selectedStatus]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Workboard - {userName}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Jouw toegewezen taken en werkzaamheden
          </p>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {(['todo', 'pending', 'in_progress', 'completed'] as WorkOrderStatus[]).map(status => {
            const config = STATUS_LABELS[status];
            const count = statusCounts[status];
            const isSelected = selectedStatus === status;

            return (
              <button
                key={status}
                onClick={() => onStatusFilterClick(isSelected ? null : status)}
                className={cn(
                  'px-4 py-2 rounded-lg border-2 transition-all',
                  'flex items-center gap-2',
                  isSelected
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 border-indigo-500 text-indigo-700 dark:text-indigo-300'
                    : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-indigo-400',
                  count === 0 && 'opacity-50'
                )}
              >
                <span className="font-semibold">{count}</span>
                <span>{config.label}</span>
                <span>{config.emoji}</span>
              </button>
            );
          })}

          {/* Total Hours Display */}
          <div className="ml-auto flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-600">
            <Clock className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Totaal uren: {totalHours.toFixed(1)}h
            </span>
          </div>
        </div>
      </div>

      {/* Board Content */}
      <KanbanBoard
        workOrders={filteredWorkOrders}
        onCardClick={onCardClick}
        onStatusChange={onStatusChange}
        viewMode={viewMode}
      />
    </div>
  );
};

