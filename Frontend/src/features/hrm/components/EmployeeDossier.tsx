import React, { useState } from 'react';
import { 
  User, Mail, Phone, CreditCard, 
  FileText, Clock, AlertCircle 
} from 'lucide-react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import type { Employee } from '../types/hrm.types';
import { Card } from '@/components/common/Card';
import { DisciplinaryDossierTab } from './DisciplinaryDossierTab';


interface EmployeeDossierProps {
  employee: Employee;
  employees?: Employee[];
  currentUserId?: string;
}

export const EmployeeDossier: React.FC<EmployeeDossierProps> = ({ 
  employee, 
  employees = [],
  currentUserId = 'current_user'
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'personal' | 'contracts' | 'salary' | 'disciplinary'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overzicht', icon: User },
    { id: 'personal', label: 'Persoonlijk', icon: FileText },
    { id: 'contracts', label: 'Contracten', icon: BriefcaseIcon },
    { id: 'salary', label: 'Salaris', icon: CreditCard },
    { id: 'disciplinary', label: 'Disciplinair Dossier', icon: AlertCircle },
  ] as const;


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 text-2xl font-bold">
            {employee.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{employee.name}</h2>
            <p className="text-slate-500 dark:text-slate-400">{employee.role}</p>
            <div className="flex items-center gap-4 mt-1 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {employee.email}
              </span>
              {employee.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {employee.phone}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          employee.availability === 'available' 
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
            : employee.availability === 'vacation'
            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
            : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
        }`}>
          {employee.availability === 'available' ? 'Beschikbaar' : 
           employee.availability === 'vacation' ? 'Vakantie' : 'Niet beschikbaar'}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:border-slate-300'
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="min-h-[300px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-500" />
                Dienstverband
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">In dienst sinds</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {format(new Date(employee.hireDate), 'd MMMM yyyy', { locale: nl })}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Vakantiedagen</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {employee.usedVacationDays} / {employee.vacationDays} gebruikt
                  </span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-indigo-500" />
                Status & Rechten
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Admin Rechten</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {employee.isAdmin ? 'Ja' : 'Nee'}
                  </span>
                </div>
                <div className="py-2">
                  <span className="text-slate-500 dark:text-slate-400 block mb-2">Specifieke Rechten</span>
                  <div className="flex flex-wrap gap-1">
                    {employee.permissions.map((perm, idx) => (
                      <span key={idx} className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded">
                        {perm.replace(/_/g, ' ')}
                      </span>
                    ))}
                    {employee.permissions.length === 0 && (
                      <span className="text-slate-400 italic">Geen specifieke rechten</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'personal' && (
          <div className="space-y-6">
            {employee.personalDetails ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Adresgegevens</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Adres</span>
                      <span className="text-slate-900 dark:text-white">{employee.personalDetails.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Postcode & Plaats</span>
                      <span className="text-slate-900 dark:text-white">
                        {employee.personalDetails.postalCode} {employee.personalDetails.city}
                      </span>
                    </div>
                  </div>
                </Card>
                <Card>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Persoonlijke Info</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Geboortedatum</span>
                      <span className="text-slate-900 dark:text-white">
                        {format(new Date(employee.personalDetails.dateOfBirth), 'd MMMM yyyy', { locale: nl })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">BSN</span>
                      <span className="text-slate-900 dark:text-white">{employee.personalDetails.bsn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Nationaliteit</span>
                      <span className="text-slate-900 dark:text-white">{employee.personalDetails.nationality}</span>
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                Geen persoonlijke gegevens beschikbaar
              </div>
            )}
          </div>
        )}

        {activeTab === 'contracts' && (
          <div className="space-y-4">
            {employee.contracts && employee.contracts.length > 0 ? (
              employee.contracts.map((contract) => (
                <Card key={contract.id} className="border-l-4 border-l-indigo-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">{contract.jobTitle}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {contract.type === 'permanent' ? 'Vast contract' : 
                         contract.type === 'temporary' ? 'Tijdelijk contract' : contract.type}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded ${
                      contract.status === 'active' 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {contract.status === 'active' ? 'Actief' : 'Beëindigd'}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block">Startdatum</span>
                      <span className="text-slate-900 dark:text-white">
                        {format(new Date(contract.startDate), 'd MMM yyyy', { locale: nl })}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block">Uren per week</span>
                      <span className="text-slate-900 dark:text-white">{contract.hoursPerWeek} uur ({contract.fte} FTE)</span>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                Geen contracten gevonden
              </div>
            )}
          </div>
        )}

        {activeTab === 'salary' && (
          <div className="space-y-6">
            {employee.bankDetails && (
              <Card>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Bankgegevens</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Rekeninghouder</span>
                    <span className="text-slate-900 dark:text-white">{employee.bankDetails.accountHolder}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">IBAN</span>
                    <span className="font-mono text-slate-900 dark:text-white">{employee.bankDetails.iban}</span>
                  </div>
                </div>
              </Card>
            )}

            {employee.salaryHistory && employee.salaryHistory.length > 0 ? (
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">Salarishistorie</h3>
                {employee.salaryHistory.map((record) => (
                  <Card key={record.id}>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {new Intl.NumberFormat('nl-NL', { style: 'currency', currency: record.currency }).format(record.grossSalary)}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Bruto per {record.frequency === 'monthly' ? 'maand' : record.frequency}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Ingangsdatum</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {format(new Date(record.startDate), 'd MMM yyyy', { locale: nl })}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                Geen salarisgegevens beschikbaar
              </div>
            )}
          </div>
        )}

        {activeTab === 'disciplinary' && (
          <DisciplinaryDossierTab
            employee={employee}
            employees={employees}
            currentUserId={currentUserId}
          />
        )}
      </div>
    </div>
  );
};

function BriefcaseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  )
}
