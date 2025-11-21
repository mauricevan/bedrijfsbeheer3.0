import React from 'react';
import { Edit, Trash2, Mail, Phone, Briefcase, Calendar } from 'lucide-react';
import { Card } from '@/components/common/Card';
import type { Employee } from '../types/hrm.types';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

interface EmployeeListProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
  onViewDossier: (id: string) => void;
}

const AVAILABILITY_COLORS = {
  available: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
  unavailable: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  vacation: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
};

const AVAILABILITY_LABELS = {
  available: 'Beschikbaar',
  unavailable: 'Niet beschikbaar',
  vacation: 'Vakantie',
};

export const EmployeeList: React.FC<EmployeeListProps> = ({ employees, onEdit, onDelete, onViewDossier }) => {
  if (employees.length === 0) {
    return (
      <Card>
        <p className="text-slate-500 dark:text-slate-400 text-center py-8">Geen medewerkers gevonden</p>
      </Card>
    );
  }

  const calculateTenure = (hireDate: string) => {
    const years = Math.floor((new Date().getTime() - new Date(hireDate).getTime()) / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor(((new Date().getTime() - new Date(hireDate).getTime()) / (1000 * 60 * 60 * 24)) % 365 / 30);
    return { years, months };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {employees.map((employee) => {
        const tenure = calculateTenure(employee.hireDate);
        return (
          <Card key={employee.id} className="hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{employee.name}</h3>
                  {employee.isAdmin && (
                    <span className="px-2 py-0.5 text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded">
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  {employee.role}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onViewDossier(employee.id)}
                  className="p-1 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                  title="Dossier bekijken"
                >
                  <Calendar className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onEdit(employee)}
                  className="p-1 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(employee.id)}
                  className="p-1 text-slate-500 hover:text-red-600 dark:hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              {employee.email && (
                <p className="text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {employee.email}
                </p>
              )}
              {employee.phone && (
                <p className="text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {employee.phone}
                </p>
              )}
              <p className="text-slate-600 dark:text-slate-300">
                In dienst sinds: {format(new Date(employee.hireDate), 'dd MMM yyyy', { locale: nl })}
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                Dienstverband: {tenure.years > 0 ? `${tenure.years} jaar` : ''} {tenure.months} maanden
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                Vakantiedagen: {employee.usedVacationDays} / {employee.vacationDays} gebruikt
              </p>
              <span className={`inline-block px-2 py-1 text-xs rounded ${AVAILABILITY_COLORS[employee.availability]}`}>
                {AVAILABILITY_LABELS[employee.availability]}
              </span>
            </div>

            {employee.permissions.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Rechten:</p>
                <div className="flex flex-wrap gap-1">
                  {employee.permissions.slice(0, 3).map((perm, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded"
                    >
                      {perm.replace('_', ' ')}
                    </span>
                  ))}
                  {employee.permissions.length > 3 && (
                    <span className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded">
                      +{employee.permissions.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};

