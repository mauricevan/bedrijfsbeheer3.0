import React, { useState, useCallback } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Textarea } from '@/components/common/Textarea';
import type { Employee, CreateIncidentInput, IncidentAttachment } from '../types/hrm.types';
import {
  getIncidentTypeOptions,
  getSeverityOptions,
  getStatusOptions,
  formatFileSize,
} from '../utils/disciplinaryUtils';
import { validateIncident, validateFileUpload } from '../utils/disciplinaryValidation';

type IncidentFormProps = {
  employeeId: string;
  employees: Employee[];
  currentUserId: string;
  onSubmit: (data: CreateIncidentInput) => void | Promise<void>;
  onCancel: () => void;
};

export const IncidentForm: React.FC<IncidentFormProps> = ({
  employeeId,
  employees,
  currentUserId,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<CreateIncidentInput>>({
    employeeId,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    type: 'late_arrival',
    severity: 'low',
    description: '',
    witnesses: [],
    attachments: [],
    createdBy: currentUserId,
    status: 'open',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((field: keyof CreateIncidentInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const handleWitnessToggle = useCallback((witnessId: string) => {
    setFormData(prev => {
      const witnesses = prev.witnesses || [];
      const isSelected = witnesses.includes(witnessId);
      
      return {
        ...prev,
        witnesses: isSelected
          ? witnesses.filter(id => id !== witnessId)
          : [...witnesses, witnessId],
      };
    });
  }, []);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: IncidentAttachment[] = [];
    
    Array.from(files).forEach(file => {
      const error = validateFileUpload(file);
      if (error) {
        alert(error);
        return;
      }

      // In a real app, you would upload to a server here
      // For now, we'll create a mock URL
      const attachment: IncidentAttachment = {
        id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        url: URL.createObjectURL(file),
        uploadedAt: new Date().toISOString(),
      };
      
      newAttachments.push(attachment);
    });

    setFormData(prev => ({
      ...prev,
      attachments: [...(prev.attachments || []), ...newAttachments],
    }));
  }, []);

  const handleRemoveAttachment = useCallback((attachmentId: string) => {
    setFormData(prev => ({
      ...prev,
      attachments: (prev.attachments || []).filter(a => a.id !== attachmentId),
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const validationErrors = validateIncident(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData as CreateIncidentInput);
    } catch (error) {
      console.error('Failed to create incident:', error);
      alert('Er is een fout opgetreden bij het aanmaken van het incident');
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableWitnesses = employees.filter(e => e.id !== employeeId);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Datum"
          type="date"
          value={formData.date || ''}
          onChange={e => handleChange('date', e.target.value)}
          error={errors.date}
          required
        />

        <Input
          label="Tijd"
          type="time"
          value={formData.time || ''}
          onChange={e => handleChange('time', e.target.value)}
          error={errors.time}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Type Incident"
          value={formData.type || ''}
          onChange={e => handleChange('type', e.target.value)}
          error={errors.type}
          required
        >
          <option value="">Selecteer type...</option>
          {getIncidentTypeOptions().map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        <Select
          label="Ernst"
          value={formData.severity || ''}
          onChange={e => handleChange('severity', e.target.value)}
          error={errors.severity}
          required
        >
          <option value="">Selecteer ernst...</option>
          {getSeverityOptions().map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      <Textarea
        label="Beschrijving"
        value={formData.description || ''}
        onChange={e => handleChange('description', e.target.value)}
        error={errors.description}
        rows={4}
        placeholder="Geef een gedetailleerde beschrijving van het incident..."
        required
      />

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Getuigen (optioneel)
        </label>
        <div className="max-h-40 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg p-3 space-y-2">
          {availableWitnesses.length > 0 ? (
            availableWitnesses.map(employee => (
              <label
                key={employee.id}
                className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={(formData.witnesses || []).includes(employee.id)}
                  onChange={() => handleWitnessToggle(employee.id)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-900 dark:text-white">
                  {employee.name} - {employee.role}
                </span>
              </label>
            ))
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400 italic">
              Geen andere medewerkers beschikbaar
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Bijlagen (optioneel)
        </label>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="flex-1">
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors">
                <Upload className="h-5 w-5 text-slate-400" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Klik om bestanden te uploaden
                </span>
              </div>
            </label>
          </div>

          {(formData.attachments || []).length > 0 && (
            <div className="space-y-2">
              {formData.attachments!.map(attachment => (
                <div
                  key={attachment.id}
                  className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-lg"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileText className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-slate-900 dark:text-white truncate">
                        {attachment.fileName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {formatFileSize(attachment.fileSize)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAttachment(attachment.id)}
                    className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Select
        label="Status"
        value={formData.status || ''}
        onChange={e => handleChange('status', e.target.value)}
        error={errors.status}
        required
      >
        <option value="">Selecteer status...</option>
        {getStatusOptions().map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Annuleren
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Bezig met opslaan...' : 'Incident Toevoegen'}
        </Button>
      </div>
    </form>
  );
};
