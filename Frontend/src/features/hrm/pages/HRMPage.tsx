import React, { useState } from 'react';
import { Briefcase, Plus, UserCheck, Calendar, Search, ClipboardList, Clock } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { useHRM } from '../hooks/useHRM';
import { useToast } from '@/context/ToastContext';
import { EmployeeList, EmployeeForm, EmployeeDossier } from '../components';
import { LeaveRequestForm, LeaveBalanceWidget, LeaveApproval } from '../components/leave';
import { TimeRegistration } from '../components/time';
import { leaveService } from '../services/leaveService';
import type { Employee, CreateEmployeeInput, LeaveRequest } from '../types/hrm.types';


export const HRMPage: React.FC = () => {
  const {
    employees,
    isLoading,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  } = useHRM();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'employees' | 'leave' | 'time' | 'approval'>('employees');
  const [currentUserId] = useState('current_user'); // TODO: Get from auth context
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDossierModal, setShowDossierModal] = useState(false);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [showLeaveRequestModal, setShowLeaveRequestModal] = useState(false);
  const [selectedEmployeeForLeave, setSelectedEmployeeForLeave] = useState<string | null>(null);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);

  // Load leave requests
  React.useEffect(() => {
    if (activeTab === 'leave') {
      setLeaveRequests(leaveService.getAllLeaveRequests());
    }
  }, [activeTab]);

  const activeEmployees = employees.filter(e => e.availability === 'available').length;
  const onLeave = employees.filter(e => e.availability === 'vacation').length;
  const pendingLeaveRequests = leaveRequests.filter(r => r.status === 'pending').length;

  const filteredEmployees = employees.filter(e =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateEmployee = async (data: CreateEmployeeInput) => {
    await createEmployee(data);
    showToast('Medewerker succesvol aangemaakt', 'success');
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
      showToast('Medewerker succesvol bijgewerkt', 'success');
      setShowEmployeeModal(false);
      setEditingEmployee(null);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (window.confirm('Weet u zeker dat u deze medewerker wilt verwijderen?')) {
      await deleteEmployee(id);
      showToast('Medewerker verwijderd', 'info');
    }
  };

  const handleViewDossier = (id: string) => {
    const employee = employees.find(e => e.id === id);
    if (employee) {
      setViewingEmployee(employee);
      setShowDossierModal(true);
    }
  };

  const handleRequestLeave = (employeeId?: string) => {
    if (employeeId) {
      setSelectedEmployeeForLeave(employeeId);
    } else {
      // Use first employee for demo, in real app would use logged-in user
      setSelectedEmployeeForLeave(employees[0]?.id || null);
    }
    setShowLeaveRequestModal(true);
  };

  const handleLeaveRequestSuccess = () => {
    showToast('Verlofaanvraag succesvol ingediend', 'success');
    setShowLeaveRequestModal(false);
    setSelectedEmployeeForLeave(null);
    // Reload leave requests
    setLeaveRequests(leaveService.getAllLeaveRequests());
  };

  const handleApproveLeave = (requestId: string) => {
    const request = leaveService.approveLeaveRequest(requestId, 'current_user', 'Goedgekeurd');
    if (request) {
      showToast('Verlofaanvraag goedgekeurd', 'success');
      setLeaveRequests(leaveService.getAllLeaveRequests());
    }
  };

  const handleRejectLeave = (requestId: string) => {
    const reason = window.prompt('Reden voor afwijzing:');
    if (reason) {
      const request = leaveService.rejectLeaveRequest(requestId, 'current_user', reason);
      if (request) {
        showToast('Verlofaanvraag afgewezen', 'info');
        setLeaveRequests(leaveService.getAllLeaveRequests());
      }
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
        <div className="flex gap-2">
          {activeTab === 'employees' && (
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => {
              setEditingEmployee(null);
              setShowEmployeeModal(true);
            }}>
              Nieuwe Medewerker
            </Button>
          )}
          {activeTab === 'leave' && (
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => handleRequestLeave()}>
              Verlof Aanvragen
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Pending Verlof</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{pendingLeaveRequests}</p>
            </div>
            <ClipboardList className="h-10 w-10 text-blue-500" />
          </div>
        </Card>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('employees')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'employees'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Medewerkers ({employees.length})
            </button>
            <button
              onClick={() => setActiveTab('leave')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'leave'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Verlofbeheer ({leaveRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('time')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'time'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Tijdregistratie
              </div>
            </button>
            <button
              onClick={() => setActiveTab('approval')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'approval'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Goedkeuringen ({pendingLeaveRequests})
            </button>
          </div>
          {activeTab === 'employees' && (
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Zoeken op naam, e-mail of functie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
          )}
        </div>

        {activeTab === 'employees' && (
          <EmployeeList
            employees={filteredEmployees}
            onEdit={handleEditEmployee}
            onDelete={handleDeleteEmployee}
            onViewDossier={handleViewDossier}
          />
        )}

        {activeTab === 'leave' && (
          <div className="space-y-6">
            {/* Leave Balance Overview */}
            {employees.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Mijn Verlofsaldo
                </h3>
                <LeaveBalanceWidget 
                  employeeId={employees[0].id} 
                  compact={true}
                />
              </div>
            )}

            {/* Leave Requests List */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Verlofaanvragen
              </h3>
              {leaveRequests.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-500 dark:text-slate-400">
                    Geen verlofaanvragen gevonden
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => handleRequestLeave()}
                  >
                    Eerste Verlofaanvraag Indienen
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {leaveRequests.map(request => {
                    const employee = employees.find(e => e.id === request.employeeId);
                    const statusColors = {
                      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
                      approved: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
                      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
                      cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
                    };

                    return (
                      <div
                        key={request.id}
                        className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-medium text-slate-900 dark:text-white">
                                {employee?.name || 'Unknown Employee'}
                              </h4>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[request.status]}`}>
                                {request.status === 'pending' && 'In behandeling'}
                                {request.status === 'approved' && 'Goedgekeurd'}
                                {request.status === 'rejected' && 'Afgewezen'}
                                {request.status === 'cancelled' && 'Geannuleerd'}
                              </span>
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                              <p>
                                <span className="font-medium">Type:</span>{' '}
                                {request.type === 'vacation' && 'Vakantie'}
                                {request.type === 'sick' && 'Ziekte'}
                                {request.type === 'care' && 'Zorgverlof'}
                                {request.type === 'parental' && 'Ouderschapsverlof'}
                                {request.type === 'special' && 'Bijzonder verlof'}
                                {request.type === 'unpaid' && 'Onbetaald'}
                                {request.type === 'compensatory' && 'Compensatie'}
                              </p>
                              <p>
                                <span className="font-medium">Periode:</span>{' '}
                                {new Date(request.startDate).toLocaleDateString('nl-NL')} -{' '}
                                {new Date(request.endDate).toLocaleDateString('nl-NL')}
                              </p>
                              <p>
                                <span className="font-medium">Dagen:</span> {request.totalDays}
                              </p>
                              {request.reason && (
                                <p>
                                  <span className="font-medium">Reden:</span> {request.reason}
                                </p>
                              )}
                            </div>
                          </div>
                          {request.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApproveLeave(request.id)}
                              >
                                Goedkeuren
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectLeave(request.id)}
                              >
                                Afwijzen
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'time' && employees.length > 0 && (
          <TimeRegistration
            employeeId={employees[0].id} // TODO: Use logged-in user ID
            onUpdate={() => {
              // Refresh if needed
            }}
          />
        )}

        {activeTab === 'approval' && (
          <LeaveApproval
            currentUserId={currentUserId}
            onUpdate={() => {
              // Reload leave requests
              setLeaveRequests(leaveService.getAllLeaveRequests());
            }}
          />
        )}
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

      <Modal
        isOpen={showLeaveRequestModal}
        onClose={() => {
          setShowLeaveRequestModal(false);
          setSelectedEmployeeForLeave(null);
        }}
        title="Verlofaanvraag Indienen"
        className="max-w-2xl"
      >
        {selectedEmployeeForLeave && (
          <LeaveRequestForm
            employeeId={selectedEmployeeForLeave}
            onSuccess={handleLeaveRequestSuccess}
            onCancel={() => {
              setShowLeaveRequestModal(false);
              setSelectedEmployeeForLeave(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
};
