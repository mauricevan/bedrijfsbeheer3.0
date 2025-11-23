import React, { useState, useEffect } from 'react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import type { Interaction, Customer, Lead } from '../types/crm.types';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface InteractionFormProps {
  interaction?: Interaction | null;
  customerId?: string;
  leadId?: string;
  customers?: Customer[];
  leads?: Lead[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const InteractionForm: React.FC<InteractionFormProps> = ({
  interaction,
  customerId,
  leadId,
  customers = [],
  leads = [],
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
    customerId: '',
    leadId: '',
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
        customerId: interaction.customerId || '',
        leadId: interaction.leadId || '',
      });
    } else {
      if (customerId) setFormData(prev => ({ ...prev, customerId }));
      if (leadId) setFormData(prev => ({ ...prev, leadId }));
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
      customerId: formData.customerId || undefined,
      leadId: formData.leadId || undefined,
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

        {/* Customer Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Koppel aan Klant
          </label>
          <select
            value={formData.customerId}
            onChange={(e) => setFormData({ ...formData, customerId: e.target.value, leadId: '' })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            disabled={!!formData.leadId && !formData.customerId} // Disable if lead is selected (optional logic, but usually exclusive)
          >
            <option value="">-- Geen Klant --</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.name} {customer.company ? `(${customer.company})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Lead Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Koppel aan Lead
          </label>
          <select
            value={formData.leadId}
            onChange={(e) => setFormData({ ...formData, leadId: e.target.value, customerId: '' })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            disabled={!!formData.customerId && !formData.leadId}
          >
            <option value="">-- Geen Lead --</option>
            {leads.map(lead => (
              <option key={lead.id} value={lead.id}>
                {lead.name} {lead.company ? `(${lead.company})` : ''}
              </option>
            ))}
          </select>
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

