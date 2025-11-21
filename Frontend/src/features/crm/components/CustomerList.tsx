import React from 'react';
import { Edit, Trash2, Mail, Phone, Building2 } from 'lucide-react';
import { Card } from '@/components/common/Card';
import type { Customer } from '../types/crm.types';

interface CustomerListProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
}

export const CustomerList: React.FC<CustomerListProps> = ({ customers, onEdit, onDelete }) => {
  if (customers.length === 0) {
    return (
      <Card>
        <p className="text-slate-500 dark:text-slate-400 text-center py-8">Geen klanten gevonden</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {customers.map((customer) => (
        <Card key={customer.id} className="hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 dark:text-white">{customer.name}</h3>
              {customer.company && (
                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                  <Building2 className="h-3 w-3" />
                  {customer.company}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(customer)}
                className="p-1 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(customer.id)}
                className="p-1 text-slate-500 hover:text-red-600 dark:hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            {customer.email && (
              <p className="text-slate-600 dark:text-slate-300 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {customer.email}
              </p>
            )}
            {customer.phone && (
              <p className="text-slate-600 dark:text-slate-300 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {customer.phone}
              </p>
            )}
            {customer.address && (
              <p className="text-slate-500 dark:text-slate-400">
                {customer.address}
                {customer.city && `, ${customer.city}`}
              </p>
            )}
            {customer.creditLimit && (
              <p className="text-slate-600 dark:text-slate-300">
                Kredietlimiet: €{customer.creditLimit.toLocaleString('nl-NL')}
              </p>
            )}
            {customer.outstandingBalance !== undefined && customer.outstandingBalance > 0 && (
              <p className="text-amber-600 dark:text-amber-400 font-medium">
                Openstaand: €{customer.outstandingBalance.toLocaleString('nl-NL')}
              </p>
            )}
          </div>

          {customer.tags && customer.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
              {customer.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

