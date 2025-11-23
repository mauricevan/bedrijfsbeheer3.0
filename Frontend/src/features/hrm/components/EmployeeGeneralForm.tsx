import React from 'react';
import { Input } from '@/components/common/Input';
import type { Employee, Permission } from '../types/hrm.types';

interface EmployeeGeneralFormProps {
  formData: Partial<Employee>;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  permissions: Permission[];
  permissionLabels: Record<Permission, string>;
  onPermissionToggle: (permission: Permission) => void;
  isEditing: boolean;
}

export const EmployeeGeneralForm: React.FC<EmployeeGeneralFormProps> = ({
  formData,
  setFormData,
  permissions,
  permissionLabels,
  onPermissionToggle,
  isEditing,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Naam *
          </label>
          <Input
            value={formData.name || ''}
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
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Telefoon
          </label>
          <Input
            value={formData.phone || ''}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Functie *
          </label>
          <Input
            value={formData.role || ''}
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
            value={formData.hireDate ? new Date(formData.hireDate).toISOString().split('T')[0] : ''}
            onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Beschikbaarheid
          </label>
          <select
            value={formData.availability || 'available'}
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
            value={formData.vacationDays?.toString() || '20'}
            onChange={(e) => setFormData({ ...formData, vacationDays: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Gebruikte vakantiedagen
          </label>
          <Input
            type="number"
            value={formData.usedVacationDays?.toString() || '0'}
            onChange={(e) => setFormData({ ...formData, usedVacationDays: parseInt(e.target.value) || 0 })}
          />
        </div>
        {!isEditing && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Wachtwoord
            </label>
            <Input
              type="password"
              value={formData.password || ''}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Laat leeg voor standaard wachtwoord"
            />
          </div>
        )}
        <div className="md:col-span-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isAdmin || false}
              onChange={(e) => {
                setFormData((prev: any) => ({
                  ...prev,
                  isAdmin: e.target.checked,
                  permissions: e.target.checked ? permissions : [],
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
              {permissions.filter(p => p !== 'full_admin').map((permission) => (
                <label key={permission} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions?.includes(permission) || false}
                    onChange={() => onPermissionToggle(permission)}
                    className="rounded border-slate-300 dark:border-slate-600"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {permissionLabels[permission]}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
