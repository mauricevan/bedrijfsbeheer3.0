import React from 'react';
import { Users, Plus, TrendingUp } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';

export const CRMPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">CRM</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Customer Relationship Management</p>
        </div>
        <div className="flex gap-2">
          <Button leftIcon={<Plus className="h-4 w-4" />}>New Customer</Button>
          <Button leftIcon={<Plus className="h-4 w-4" />} variant="secondary">New Lead</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Customers</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">156</p>
            </div>
            <Users className="h-10 w-10 text-indigo-500" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Active Leads</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">23</p>
            </div>
            <TrendingUp className="h-10 w-10 text-emerald-500" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Conversion Rate</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">68%</p>
            </div>
            <TrendingUp className="h-10 w-10 text-emerald-500" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Recent Customers</h3>
          <p className="text-slate-500">No customers yet</p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold mb-4">Lead Pipeline</h3>
          <p className="text-slate-500">No leads yet</p>
        </Card>
      </div>
    </div>
  );
};
