import React, { useState, useEffect } from 'react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import type { Interaction } from '../types/crm.types';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface InteractionFormProps {
  interaction?: Interaction | null;
  customerId?: string;
  leadId?: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const InteractionForm: React.FC<InteractionFormProps> = ({
  interaction,
  customerId,
  leadId,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    type: 'note' as Interaction['type'],
    subject: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    followUpRequired: false,
    followUpDate: '',
  });

  useEffect(() => {
    if (interaction) {
      const date = new Date(interaction.date);
      setFormData({
        type: interaction.type,
        subject: interaction.subject || '',
        description: interaction.description || '',
        date: date.toISOString().split('T')[0],
        time: date.toTimeString().slice(0, 5),
        followUpRequired: interaction.followUpRequired || false,
        followUpDate: interaction.followUpDate ? new Date(interaction.followUpDate).toISOString().split('T')[0] : '',
      });
    } else if (customerId || leadId) {
      setFormData(prev => ({ ...prev, customerId, leadId }));
    }
  }, [interaction, customerId, leadId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dateTime = new Date(`${formData.date}T${formData.time}`);
    onSubmit({
      type: formData.type,
      subject: formData.subject,
      description: formData.description,
      date: dateTime.toISOString(),
      employeeId: user?.id || '',
      customerId: customerId || interaction?.customerId,
      leadId: leadId || interaction?.leadId,
      followUpRequired: formData.followUpRequired,
      followUpDate: formData.followUpDate || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Type *
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as Interaction['type'] })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            required
          >
            <option value="call">Telefoon</option>
            <option value="email">E-mail</option>
            <option value="meeting">Afspraak</option>
            <option value="note">Notitie</option>
            <option value="sms">SMS</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Datum *
          </label>
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Tijd *
          </label>
          <Input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Onderwerp *
          </label>
          <Input
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Beschrijving *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.followUpRequired}
              onChange={(e) => setFormData({ ...formData, followUpRequired: e.target.checked })}
              className="rounded border-slate-300 dark:border-slate-600"
            />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Opvolging vereist
            </span>
          </label>
        </div>
        {formData.followUpRequired && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Opvolgingsdatum
            </label>
            <Input
              type="date"
              value={formData.followUpDate}
              onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
            />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuleren
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {interaction ? 'Bijwerken' : 'Aanmaken'}
        </Button>
      </div>
    </form>
  );
};

