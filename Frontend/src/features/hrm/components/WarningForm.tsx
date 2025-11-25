import React, { useState, useCallback } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Textarea } from '@/components/common/Textarea';
import type { CreateWarningInput, IncidentAttachment, Incident } from '../types/hrm.types';
import { getWarningTypeOptions, formatFileSize } from '../utils/disciplinaryUtils';
import { validateWarning, validateFileUpload } from '../utils/disciplinaryValidation';

type WarningFormProps = {
  employeeId: string;
  currentUserId: string;
  incidents?: Incident[];
  onSubmit: (data: CreateWarningInput) => void | Promise<void>;
  onCancel: () => void;
};

export const WarningForm: React.FC<WarningFormProps> = ({
  employeeId,
  currentUserId,
  incidents = [],
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<CreateWarningInput>>({
    employeeId,
    type: 'verbal',
    date: new Date().toISOString().split('T')[0],
    reason: '',
    fullText: '',
    signedByEmployee: false,
    attachments: [],
    createdBy: currentUserId,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const employeeIncidents = incidents.filter(i => i.employeeId === employeeId);

  const handleChange = useCallback((field: keyof CreateWarningInput, value: any) => {
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
    const validationErrors = validateWarning(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData as CreateWarningInput);
    } catch (error) {
      console.error('Failed to create warning:', error);
      alert('Er is een fout opgetreden bij het aanmaken van de waarschuwing');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Select
        label="Type Waarschuwing"
        value={formData.type || ''}
        onChange={e => handleChange('type', e.target.value)}
        error={errors.type}
        required
      >
        <option value="">Selecteer type...</option>
        {getWarningTypeOptions().map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Datum Waarschuwing"
          type="date"
          value={formData.date || ''}
          onChange={e => handleChange('date', e.target.value)}
          error={errors.date}
          required
        />

        <Input
          label="Geldig Tot (optioneel)"
          type="date"
          value={formData.validUntil || ''}
          onChange={e => handleChange('validUntil', e.target.value)}
          error={errors.validUntil}
          helpText="Laat leeg voor onbeperkte geldigheid"
        />
      </div>

      {employeeIncidents.length > 0 && (
        <Select
          label="Gekoppeld aan Incident (optioneel)"
          value={formData.incidentId || ''}
          onChange={e => handleChange('incidentId', e.target.value || undefined)}
        >
          <option value="">Geen incident gekoppeld</option>
          {employeeIncidents.map(incident => (
            <option key={incident.id} value={incident.id}>
              {new Date(incident.date).toLocaleDateString('nl-NL')} - {incident.description.substring(0, 50)}...
            </option>
          ))}
        </Select>
      )}

      <Textarea
        label="Reden"
        value={formData.reason || ''}
        onChange={e => handleChange('reason', e.target.value)}
        error={errors.reason}
        rows={3}
        placeholder="Korte samenvatting van de reden voor deze waarschuwing..."
        required
      />

      <Textarea
        label="Volledige Tekst van de Waarschuwing"
        value={formData.fullText || ''}
        onChange={e => handleChange('fullText', e.target.value)}
        error={errors.fullText}
        rows={6}
        placeholder="Volledige formele tekst van de waarschuwing zoals deze aan de medewerker wordt gegeven..."
        required
      />

      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg space-y-3">
        <h4 className="font-medium text-slate-900 dark:text-white">Ondertekening door Medewerker</h4>
        
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.signedByEmployee || false}
            onChange={e => handleChange('signedByEmployee', e.target.checked)}
            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm text-slate-700 dark:text-slate-300">
            Medewerker heeft de waarschuwing ondertekend
          </span>
        </label>

        {formData.signedByEmployee && (
          <>
            <Input
              label="Datum Ondertekening"
              type="date"
              value={formData.employeeSignatureDate || ''}
              onChange={e => handleChange('employeeSignatureDate', e.target.value)}
            />

            <Textarea
              label="Opmerkingen Medewerker (optioneel)"
              value={formData.employeeComments || ''}
              onChange={e => handleChange('employeeComments', e.target.value)}
              rows={3}
              placeholder="Eventuele opmerkingen van de medewerker bij ondertekening..."
            />
          </>
        )}
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
                  Upload ondertekend document of andere bijlagen
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

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Annuleren
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Bezig met opslaan...' : 'Waarschuwing Toevoegen'}
        </Button>
      </div>
    </form>
  );
};
