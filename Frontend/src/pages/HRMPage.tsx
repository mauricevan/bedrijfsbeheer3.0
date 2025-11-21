import React from 'react';
import { Briefcase, Plus, UserCheck } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';

export const HRMPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">HRM</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Human Resource Management</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />}>New Employee</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Employees</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">12</p>
            </div>
            <Briefcase className="h-10 w-10 text-indigo-500" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Active Today</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">10</p>
            </div>
            <UserCheck className="h-10 w-10 text-emerald-500" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">On Leave</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">2</p>
            </div>
            <Briefcase className="h-10 w-10 text-amber-500" />
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Employee List</h3>
        <p className="text-slate-500">No employees yet</p>
      </Card>
    </div>
  );
};
