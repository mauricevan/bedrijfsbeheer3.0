import React, { useState, useMemo } from 'react';
import { Plus, Filter, Download, AlertTriangle, FileWarning, Search } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Card } from '@/components/common/Card';
import type { Employee } from '../types/hrm.types';
import { useDisciplinaryDossier } from '../hooks/useDisciplinaryDossier';
import { IncidentForm } from './IncidentForm';
import { WarningForm } from './WarningForm';
import { DisciplinaryTimeline } from './DisciplinaryTimeline';
import {
  getIncidentTypeOptions,
  getSeverityOptions,
  getStatusOptions,
} from '../utils/disciplinaryUtils';

type DisciplinaryDossierTabProps = {
  employee: Employee;
  employees: Employee[];
  currentUserId: string;
};

export const DisciplinaryDossierTab: React.FC<DisciplinaryDossierTabProps> = ({
  employee,
  employees,
  currentUserId,
}) => {
  const {
    incidents,
    warnings,
    improvementPlans,
    createIncident,
    createWarning,
  } = useDisciplinaryDossier(employee.id);

  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [activeView, setActiveView] = useState<'timeline' | 'incidents' | 'warnings'>('timeline');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filteredIncidents = useMemo(() => {
    return incidents.filter(incident => {
      const matchesSearch = 
        incident.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = !filterType || incident.type === filterType;
      const matchesSeverity = !filterSeverity || incident.severity === filterSeverity;
      const matchesStatus = !filterStatus || incident.status === filterStatus;

      return matchesSearch && matchesType && matchesSeverity && matchesStatus;
    });
  }, [incidents, searchQuery, filterType, filterSeverity, filterStatus]);

  const handleCreateIncident = async (data: any) => {
    await createIncident(data);
    setShowIncidentModal(false);
  };

  const handleCreateWarning = async (data: any) => {
    await createWarning(data);
    setShowWarningModal(false);
  };

  const handleExportPDF = () => {
    // In a real application, this would generate a PDF
    alert('PDF export functionaliteit wordt geïmplementeerd met een backend service');
  };

  const totalIncidents = incidents.length;
  const openIncidents = incidents.filter(i => i.status === 'open').length;
  const totalWarnings = warnings.length;
  const activeWarnings = warnings.filter(w => {
    if (!w.validUntil) return true;
    return new Date(w.validUntil) > new Date();
  }).length;

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Totaal Incidenten</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalIncidents}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Open Incidenten</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{openIncidents}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Totaal Waarschuwingen</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalWarnings}</p>
            </div>
            <FileWarning className="h-8 w-8 text-amber-500" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Actieve Waarschuwingen</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{activeWarnings}</p>
            </div>
            <FileWarning className="h-8 w-8 text-amber-400" />
          </div>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2">
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setShowIncidentModal(true)}
          >
            Incident Toevoegen
          </Button>
          <Button
            variant="outline"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setShowWarningModal(true)}
          >
            Waarschuwing Toevoegen
          </Button>
        </div>

        <Button
          variant="outline"
          leftIcon={<Download className="h-4 w-4" />}
          onClick={handleExportPDF}
        >
          Exporteer als PDF
        </Button>
      </div>

      {/* View tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveView('timeline')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeView === 'timeline'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
            }`}
          >
            Tijdlijn
          </button>
          <button
            onClick={() => setActiveView('incidents')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeView === 'incidents'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
            }`}
          >
            Incidenten ({totalIncidents})
          </button>
          <button
            onClick={() => setActiveView('warnings')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeView === 'warnings'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
            }`}
          >
            Waarschuwingen ({totalWarnings})
          </button>
        </nav>
      </div>

      {/* Content */}
      <div>
        {activeView === 'timeline' && (
          <DisciplinaryTimeline
            incidents={incidents}
            warnings={warnings}
            improvementPlans={improvementPlans}
            employees={employees}
          />
        )}

        {activeView === 'incidents' && (
          <div className="space-y-4">
            {/* Filters */}
            <Card>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  placeholder="Zoeken in beschrijving..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="h-4 w-4" />}
                />

                <Select
                  value={filterType}
                  onChange={e => setFilterType(e.target.value)}
                >
                  <option value="">Alle types</option>
                  {getIncidentTypeOptions().map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Select>

                <Select
                  value={filterSeverity}
                  onChange={e => setFilterSeverity(e.target.value)}
                >
                  <option value="">Alle ernst niveaus</option>
                  {getSeverityOptions().map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Select>

                <Select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                >
                  <option value="">Alle statussen</option>
                  {getStatusOptions().map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Select>
              </div>
            </Card>

            {/* Incidents list */}
            {filteredIncidents.length > 0 ? (
              <div className="space-y-3">
                {filteredIncidents.map(incident => (
                  <Card key={incident.id} className="hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-slate-900 dark:text-white">
                            {new Date(incident.date).toLocaleDateString('nl-NL')} - {incident.time}
                          </span>
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            {getIncidentTypeOptions().find(o => o.value === incident.type)?.label}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{incident.description}</p>
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          incident.severity === 'low' ? 'bg-blue-100 text-blue-700' :
                          incident.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                          incident.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {getSeverityOptions().find(o => o.value === incident.severity)?.label}
                        </span>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          incident.status === 'open' ? 'bg-slate-100 text-slate-700' :
                          incident.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {getStatusOptions().find(o => o.value === incident.status)?.label}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                Geen incidenten gevonden
              </div>
            )}
          </div>
        )}

        {activeView === 'warnings' && (
          <div className="space-y-3">
            {warnings.length > 0 ? (
              warnings.map(warning => (
                <Card key={warning.id} className="hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-slate-900 dark:text-white">
                          {new Date(warning.date).toLocaleDateString('nl-NL')}
                        </span>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          warning.type === 'verbal' ? 'bg-amber-100 text-amber-700' :
                          warning.type === 'written' ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {warning.type === 'verbal' ? 'Mondeling' : warning.type === 'written' ? 'Schriftelijk' : 'Laatste waarschuwing'}
                        </span>
                        {warning.signedByEmployee && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-700">
                            Ondertekend
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        {warning.reason}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                        {warning.fullText}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                Geen waarschuwingen gevonden
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal
        isOpen={showIncidentModal}
        onClose={() => setShowIncidentModal(false)}
        title="Nieuw Incident Toevoegen"
        className="max-w-3xl"
      >
        <IncidentForm
          employeeId={employee.id}
          employees={employees}
          currentUserId={currentUserId}
          onSubmit={handleCreateIncident}
          onCancel={() => setShowIncidentModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showWarningModal}
        onClose={() => setShowWarningModal(false)}
        title="Nieuwe Waarschuwing Toevoegen"
        className="max-w-3xl"
      >
        <WarningForm
          employeeId={employee.id}
          currentUserId={currentUserId}
          incidents={incidents}
          onSubmit={handleCreateWarning}
          onCancel={() => setShowWarningModal(false)}
        />
      </Modal>
    </div>
  );
};
