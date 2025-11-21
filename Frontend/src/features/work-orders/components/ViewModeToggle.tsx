/**
 * ViewModeToggle Component
 * Toggle between Extended (Kanban) and Compact (List) views
 */

import React from 'react';
import { FileText, List } from 'lucide-react';
import { cn } from '@/utils/cn';

type ViewMode = 'extended' | 'compact';

type ViewModeToggleProps = {
  viewMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
};

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  viewMode,
  onModeChange,
}) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
        Weergave:
      </span>
      <div className="flex rounded-lg border-2 border-slate-300 dark:border-slate-600 overflow-hidden">
        <button
          onClick={() => onModeChange('extended')}
          className={cn(
            'px-4 py-2 flex items-center gap-2 transition-colors',
            viewMode === 'extended'
              ? 'bg-indigo-500 text-white'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
          )}
        >
          <FileText className="h-4 w-4" />
          <span className="text-sm font-medium">Uitgebreid</span>
        </button>
        <button
          onClick={() => onModeChange('compact')}
          className={cn(
            'px-4 py-2 flex items-center gap-2 transition-colors border-l-2 border-slate-300 dark:border-slate-600',
            viewMode === 'compact'
              ? 'bg-indigo-500 text-white'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
          )}
        >
          <List className="h-4 w-4" />
          <span className="text-sm font-medium">Compact</span>
        </button>
      </div>
    </div>
  );
};

