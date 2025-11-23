import React, { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import type { Employee, Permission, PersonalDetails, BankDetails } from '../types/hrm.types';
import { EmployeeGeneralForm } from './EmployeeGeneralForm';
import { EmployeePersonalForm } from './EmployeePersonalForm';
import { EmployeeContractForm } from './EmployeeContractForm';
import { EmployeeSalaryForm } from './EmployeeSalaryForm';

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
  manage_hrm: 'HRM beheren', // Added missing label if needed, though not in list above
};

type Tab = 'general' | 'personal' | 'contracts' | 'salary';

export const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onSubmit, onCancel, isLoading }) => {
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [formData, setFormData] = useState<Partial<Employee>>({
    name: '',
    email: '',
    phone: '',
    role: '',
    hireDate: new Date().toISOString().split('T')[0],
    vacationDays: 20,
    usedVacationDays: 0,
    availability: 'available',
    password: '',
    permissions: [],
    isAdmin: false,
    personalDetails: {} as PersonalDetails,
    contracts: [],
    salaryHistory: [],
    bankDetails: {} as BankDetails,
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        ...employee,
        hireDate: employee.hireDate ? new Date(employee.hireDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        personalDetails: employee.personalDetails || {} as PersonalDetails,
        contracts: employee.contracts || [],
        salaryHistory: employee.salaryHistory || [],
        bankDetails: employee.bankDetails || {} as BankDetails,
        password: '', // Don't populate password
      });
    }
  }, [employee]);

  const handlePermissionToggle = (permission: Permission) => {
    if (permission === 'full_admin') {
      setFormData(prev => ({ ...prev, isAdmin: !prev.isAdmin, permissions: prev.isAdmin ? [] : PERMISSIONS }));
    } else {
      setFormData(prev => ({
        ...prev,
        permissions: prev.permissions?.includes(permission)
          ? prev.permissions.filter(p => p !== permission)
          : [...(prev.permissions || []), permission],
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData: any = {
      ...formData,
      vacationDays: Number(formData.vacationDays),
      usedVacationDays: Number(formData.usedVacationDays),
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

  const tabs: { id: Tab; label: string }[] = [
    { id: 'general', label: 'Algemeen' },
    { id: 'personal', label: 'Persoonlijk' },
    { id: 'contracts', label: 'Contracten' },
    { id: 'salary', label: 'Salaris & Bank' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="px-1">
        {activeTab === 'general' && (
          <EmployeeGeneralForm
            formData={formData}
            setFormData={setFormData}
            permissions={PERMISSIONS}
            permissionLabels={PERMISSION_LABELS}
            onPermissionToggle={handlePermissionToggle}
            isEditing={!!employee}
          />
        )}

        {activeTab === 'personal' && (
          <EmployeePersonalForm
            personalDetails={formData.personalDetails as PersonalDetails}
            onChange={(details) => setFormData({ ...formData, personalDetails: details })}
          />
        )}

        {activeTab === 'contracts' && (
          <EmployeeContractForm
            contracts={formData.contracts || []}
            onChange={(contracts) => setFormData({ ...formData, contracts })}
          />
        )}

        {activeTab === 'salary' && (
          <EmployeeSalaryForm
            salaryHistory={formData.salaryHistory || []}
            bankDetails={formData.bankDetails as BankDetails}
            onSalaryChange={(history) => setFormData({ ...formData, salaryHistory: history })}
            onBankDetailsChange={(details) => setFormData({ ...formData, bankDetails: details })}
          />
        )}
      </div>

      <div className="flex justify-end gap-2 pt-6 mt-6 border-t border-slate-200 dark:border-slate-700">
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

