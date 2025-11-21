import React from 'react';
import { Calendar, Plus } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';

export const PlanningPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Planning & Calendar</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Schedule and manage events</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />}>New Event</Button>
      </div>

      <Card className="p-8 text-center">
        <Calendar className="h-16 w-16 mx-auto text-slate-400 mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Calendar View</h3>
        <p className="text-slate-500">Calendar functionality coming soon</p>
      </Card>
    </div>
  );
};
