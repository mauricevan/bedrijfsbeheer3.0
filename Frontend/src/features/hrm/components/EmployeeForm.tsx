import React, { useState, useEffect } from 'react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import type { Employee, Permission } from '../types/hrm.types';

interface EmployeeFormProps {
  employee?: Employee | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const PERMISSIONS: Permission[] = [
  'full_admin',
  'manage_modules',
  'manage_inventory',
  'manage_crm',
  'manage_accounting',
  'manage_workorders',
  'manage_employees',
  'view_all_workorders',
  'view_reports',
  'manage_planning',
  'manage_pos',
];

const PERMISSION_LABELS: Record<Permission, string> = {
  full_admin: 'Volledige admin rechten',
  manage_modules: 'Modules beheren',
  manage_inventory: 'Voorraad beheren',
  manage_crm: 'CRM beheren',
  manage_accounting: 'Boekhouding beheren',
  manage_workorders: 'Werkorders beheren',
  manage_employees: 'Medewerkers beheren',
  view_all_workorders: 'Alle werkorders bekijken',
  view_reports: 'Rapporten bekijken',
  manage_planning: 'Planning beheren',
  manage_pos: 'Kassa beheren',
};

export const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    hireDate: new Date().toISOString().split('T')[0],
    vacationDays: '20',
    usedVacationDays: '0',
    availability: 'available' as Employee['availability'],
    password: '',
    permissions: [] as Permission[],
    isAdmin: false,
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        role: employee.role || '',
        hireDate: employee.hireDate ? new Date(employee.hireDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        vacationDays: employee.vacationDays?.toString() || '20',
        usedVacationDays: employee.usedVacationDays?.toString() || '0',
        availability: employee.availability || 'available',
        password: '',
        permissions: employee.permissions || [],
        isAdmin: employee.isAdmin || false,
      });
    }
  }, [employee]);

  const handlePermissionToggle = (permission: Permission) => {
    if (permission === 'full_admin') {
      setFormData(prev => ({ ...prev, isAdmin: !prev.isAdmin, permissions: prev.isAdmin ? [] : PERMISSIONS }));
    } else {
      setFormData(prev => ({
        ...prev,
        permissions: prev.permissions.includes(permission)
          ? prev.permissions.filter(p => p !== permission)
          : [...prev.permissions, permission],
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData: any = {
      ...formData,
      vacationDays: parseInt(formData.vacationDays),
      usedVacationDays: parseInt(formData.usedVacationDays),
    };
    if (formData.password) {
      submitData.password = formData.password;
    } else if (!employee) {
      submitData.password = 'password123'; // Default password
    }
    if (formData.isAdmin) {
      submitData.permissions = PERMISSIONS;
    }
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Naam *
          </label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            E-mail *
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Telefoon
          </label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Functie *
          </label>
          <Input
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Datum in dienst *
          </label>
          <Input
            type="date"
            value={formData.hireDate}
            onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Beschikbaarheid
          </label>
          <select
            value={formData.availability}
            onChange={(e) => setFormData({ ...formData, availability: e.target.value as Employee['availability'] })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="available">Beschikbaar</option>
            <option value="unavailable">Niet beschikbaar</option>
            <option value="vacation">Vakantie</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Vakantiedagen per jaar
          </label>
          <Input
            type="number"
            value={formData.vacationDays}
            onChange={(e) => setFormData({ ...formData, vacationDays: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Gebruikte vakantiedagen
          </label>
          <Input
            type="number"
            value={formData.usedVacationDays}
            onChange={(e) => setFormData({ ...formData, usedVacationDays: e.target.value })}
          />
        </div>
        {!employee && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Wachtwoord
            </label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Laat leeg voor standaard wachtwoord"
            />
          </div>
        )}
        <div className="md:col-span-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isAdmin}
              onChange={(e) => {
                setFormData(prev => ({
                  ...prev,
                  isAdmin: e.target.checked,
                  permissions: e.target.checked ? PERMISSIONS : [],
                }));
              }}
              className="rounded border-slate-300 dark:border-slate-600"
            />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Volledige admin rechten
            </span>
          </label>
        </div>
        {!formData.isAdmin && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Rechten
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PERMISSIONS.filter(p => p !== 'full_admin').map((permission) => (
                <label key={permission} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(permission)}
                    onChange={() => handlePermissionToggle(permission)}
                    className="rounded border-slate-300 dark:border-slate-600"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {PERMISSION_LABELS[permission]}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuleren
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {employee ? 'Bijwerken' : 'Aanmaken'}
        </Button>
      </div>
    </form>
  );
};

