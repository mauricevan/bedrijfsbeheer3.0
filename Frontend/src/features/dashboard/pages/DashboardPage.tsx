import React from 'react';
import { Card } from '@/components/common/Card';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Revenue</h3>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">€45,231.89</p>
          <p className="mt-1 text-xs text-emerald-500">+20.1% from last month</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Orders</h3>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">+573</p>
          <p className="mt-1 text-xs text-emerald-500">+201 since last hour</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending Quotes</h3>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">12</p>
          <p className="mt-1 text-xs text-red-500">-4% from last month</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Now</h3>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">+573</p>
          <p className="mt-1 text-xs text-emerald-500">+201 since last hour</p>
        </Card>
      </div>
    </div>
  );
};
