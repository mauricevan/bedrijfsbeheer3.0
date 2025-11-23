import React from 'react';
import { Edit, Trash2, CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';
import { Card } from '@/components/common/Card';
import type { Task } from '../types/crm.types';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

const PRIORITY_COLORS = {
  low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  high: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

const PRIORITY_LABELS = {
  low: 'Laag',
  medium: 'Normaal',
  high: 'Hoog',
};

const STATUS_ICONS = {
  todo: Circle,
  in_progress: Clock,
  done: CheckCircle2,
};

export const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete, onToggleStatus }) => {
  if (tasks.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
          <CheckCircle2 className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">Geen taken gevonden</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-xs">
          Maak een nieuwe taak aan om je werkzaamheden te plannen en niets te vergeten.
        </p>
      </Card>
    );
  }

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const StatusIcon = STATUS_ICONS[task.status];
        const overdue = isOverdue(task.dueDate);
        return (
          <Card key={task.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <button
                onClick={() => onToggleStatus(task.id)}
                className="mt-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <StatusIcon className={`h-5 w-5 ${task.status === 'done' ? 'text-emerald-600 dark:text-emerald-400' : ''}`} />
              </button>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className={`font-semibold ${task.status === 'done' ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                        {task.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => onEdit(task)}
                      className="p-1 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(task.id)}
                      className="p-1 text-slate-500 hover:text-red-600 dark:hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className={`px-2 py-1 text-xs rounded ${PRIORITY_COLORS[task.priority]}`}>
                    {PRIORITY_LABELS[task.priority]}
                  </span>
                  {task.dueDate && (
                    <span className={`text-xs flex items-center gap-1 ${overdue ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}>
                      {overdue && <AlertCircle className="h-3 w-3" />}
                      {format(new Date(task.dueDate), 'dd MMM yyyy', { locale: nl })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

