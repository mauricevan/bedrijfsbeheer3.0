import React, { useState } from 'react';
import { Briefcase, Plus, UserCheck, Calendar, Search } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { useHRM } from '../hooks/useHRM';
import { EmployeeList, EmployeeForm, EmployeeDossier } from '../components';
import type { Employee, CreateEmployeeInput } from '../types/hrm.types';

export const HRMPage: React.FC = () => {
  const {
    employees,
    isLoading,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  } = useHRM();

  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [showDossierModal, setShowDossierModal] = useState(false);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);

  const activeEmployees = employees.filter(e => e.availability === 'available').length;
  const onLeave = employees.filter(e => e.availability === 'vacation').length;

  const filteredEmployees = employees.filter(e =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateEmployee = async (data: CreateEmployeeInput) => {
    await createEmployee(data);
    setShowEmployeeModal(false);
    setEditingEmployee(null);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowEmployeeModal(true);
  };

  const handleUpdateEmployee = async (data: CreateEmployeeInput) => {
    if (editingEmployee) {
      await updateEmployee(editingEmployee.id, data);
      setShowEmployeeModal(false);
      setEditingEmployee(null);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (window.confirm('Weet u zeker dat u deze medewerker wilt verwijderen?')) {
      await deleteEmployee(id);
    }
  };

  const handleViewDossier = (id: string) => {
    const employee = employees.find(e => e.id === id);
    if (employee) {
      setViewingEmployee(employee);
      setShowDossierModal(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">HRM</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Human Resource Management</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => {
          setEditingEmployee(null);
          setShowEmployeeModal(true);
        }}>
          Nieuwe Medewerker
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Totaal Medewerkers</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{employees.length}</p>
            </div>
            <Briefcase className="h-10 w-10 text-indigo-500" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Actief Vandaag</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{activeEmployees}</p>
            </div>
            <UserCheck className="h-10 w-10 text-emerald-500" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Met Vakantie</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{onLeave}</p>
            </div>
            <Calendar className="h-10 w-10 text-amber-500" />
          </div>
        </Card>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="mb-4">
          <Input
            placeholder="Zoeken op naam, e-mail of functie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
        <EmployeeList
          employees={filteredEmployees}
          onEdit={handleEditEmployee}
          onDelete={handleDeleteEmployee}
          onViewDossier={handleViewDossier}
        />
      </div>

      <Modal
        isOpen={showEmployeeModal}
        onClose={() => {
          setShowEmployeeModal(false);
          setEditingEmployee(null);
        }}
        title={editingEmployee ? 'Medewerker Bewerken' : 'Nieuwe Medewerker'}
        className="max-w-3xl"
      >
        <EmployeeForm
          employee={editingEmployee}
          onSubmit={editingEmployee ? handleUpdateEmployee : handleCreateEmployee}
          onCancel={() => {
            setShowEmployeeModal(false);
            setEditingEmployee(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={showDossierModal}
        onClose={() => {
          setShowDossierModal(false);
          setViewingEmployee(null);
        }}
        title="Personeelsdossier"
        className="max-w-4xl"
      >
        {viewingEmployee && (
          <EmployeeDossier 
            employee={viewingEmployee} 
            employees={employees}
            currentUserId="current_user"
          />
        )}
      </Modal>
    </div>
  );
};

