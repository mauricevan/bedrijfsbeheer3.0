import React from 'react';
import { FileText, Plus, DollarSign } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';

export const AccountingPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Accounting</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Quotes & Invoices</p>
        </div>
        <div className="flex gap-2">
          <Button leftIcon={<Plus className="h-4 w-4" />}>New Quote</Button>
          <Button leftIcon={<Plus className="h-4 w-4" />} variant="secondary">New Invoice</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Quoted</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">€45,230</p>
            </div>
            <FileText className="h-10 w-10 text-indigo-500" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Invoiced</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">€128,450</p>
            </div>
            <DollarSign className="h-10 w-10 text-emerald-500" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Outstanding</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">€12,340</p>
            </div>
            <DollarSign className="h-10 w-10 text-amber-500" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Recent Quotes</h3>
          <p className="text-slate-500">No quotes yet</p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold mb-4">Recent Invoices</h3>
          <p className="text-slate-500">No invoices yet</p>
        </Card>
      </div>
    </div>
  );
};
