import React, { useState, useEffect } from 'react';
import { Clock, Plus, Calendar, Briefcase, FileText } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { timeTrackingService } from '../../services/timeTrackingService';
import type { TimeEntry, CreateTimeEntryInput, TimeEntryType } from '../../types/hrm.types';
import { useToast } from '@/context/ToastContext';

interface TimeRegistrationProps {
  employeeId: string;
  onUpdate?: () => void;
}

export const TimeRegistration: React.FC<TimeRegistrationProps> = ({
  employeeId,
  onUpdate,
}) => {
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<CreateTimeEntryInput>>({
    employeeId,
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '17:00',
    type: 'work',
    billable: true,
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadEntries();
  }, [employeeId]);

  const loadEntries = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const data = await timeTrackingService.getTimeEntries({
        employeeId,
        startDate: today,
        endDate: today,
      });
      setEntries(data);
    } catch (error) {
      console.error('Error loading time entries:', error);
      showToast('Fout bij laden van urenregistraties', 'error');
    } finally {
      setLoading(false);
    }
  };

  const calculateHours = (startTime: string, endTime: string): number => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    if (end < start) {
      end.setDate(end.getDate() + 1);
    }
    const diffMs = end.getTime() - start.getTime();
    return diffMs / (1000 * 60 * 60);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) newErrors.date = 'Datum is verplicht';
    if (!formData.startTime) newErrors.startTime = 'Starttijd is verplicht';
    if (!formData.endTime) newErrors.endTime = 'Eindtijd is verplicht';
    
    if (formData.startTime && formData.endTime) {
      const hours = calculateHours(formData.startTime, formData.endTime);
      if (hours <= 0) {
        newErrors.endTime = 'Eindtijd moet na starttijd zijn';
      }
      if (hours > 24) {
        newErrors.endTime = 'Maximaal 24 uur per entry';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await timeTrackingService.createTimeEntry(formData as CreateTimeEntryInput);
      showToast('Urenregistratie toegevoegd', 'success');
      setShowModal(false);
      resetForm();
      await loadEntries();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error creating time entry:', error);
      showToast('Fout bij toevoegen van urenregistratie', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      employeeId,
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '17:00',
      type: 'work',
      billable: true,
      description: '',
    });
    setErrors({});
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Weet je zeker dat je deze urenregistratie wilt verwijderen?')) return;

    try {
      await timeTrackingService.deleteTimeEntry(id);
      showToast('Urenregistratie verwijderd', 'success');
      await loadEntries();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error deleting time entry:', error);
      showToast('Fout bij verwijderen van urenregistratie', 'error');
    }
  };

  const totalHours = entries.reduce((sum, e) => sum + e.totalHours, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Urenregistratie
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {new Date().toLocaleDateString('nl-NL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Button
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setShowModal(true)}
        >
          Nieuwe Registratie
        </Button>
      </div>

      {/* Summary Card */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
              <Clock className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Totaal Uren Vandaag</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalHours.toFixed(2)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500 dark:text-slate-400">Aantal Entries</p>
            <p className="text-xl font-semibold text-slate-900 dark:text-white">{entries.length}</p>
          </div>
        </div>
      </Card>

      {/* Entries List */}
      {entries.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              Geen urenregistraties vandaag
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Voeg je eerste urenregistratie toe om te beginnen
            </p>
            <Button onClick={() => setShowModal(true)}>
              Nieuwe Registratie
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {entries.map(entry => (
            <Card key={entry.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      entry.type === 'work' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' :
                      entry.type === 'break' ? 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300' :
                      entry.type === 'overtime' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300' :
                      'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'
                    }`}>
                      {entry.type === 'work' ? 'Werk' :
                       entry.type === 'break' ? 'Pauze' :
                       entry.type === 'overtime' ? 'Overuren' : 'Reizen'}
                    </span>
                    {entry.billable && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                        Factureerbaar
                      </span>
                    )}
                    {entry.approved && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                        Goedgekeurd
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                    <span>{entry.startTime} - {entry.endTime}</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {entry.totalHours.toFixed(2)} uur
                    </span>
                  </div>
                  {entry.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                      {entry.description}
                    </p>
                  )}
                </div>
                {!entry.approved && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(entry.id)}
                  >
                    Verwijderen
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Entry Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title="Nieuwe Urenregistratie"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Datum *
              </label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                error={errors.date}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Type *
              </label>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as TimeEntryType })}
              >
                <option value="work">Werk</option>
                <option value="break">Pauze</option>
                <option value="overtime">Overuren</option>
                <option value="travel">Reizen</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Starttijd *
              </label>
              <Input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                error={errors.startTime}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Eindtijd *
              </label>
              <Input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                error={errors.endTime}
              />
            </div>
          </div>

          {formData.startTime && formData.endTime && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                Totaal: {calculateHours(formData.startTime, formData.endTime).toFixed(2)} uur
              </p>
            </div>
          )}

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.billable || false}
                onChange={(e) => setFormData({ ...formData, billable: e.target.checked })}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">Factureerbaar</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Beschrijving
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg 
                       bg-white dark:bg-slate-700 text-slate-900 dark:text-white
                       focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              placeholder="Beschrijf wat je hebt gedaan..."
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              className="flex-1"
            >
              Annuleren
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Toevoegen...' : 'Toevoegen'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

