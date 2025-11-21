import React from 'react';
import { Edit, Trash2, Phone, Mail, Calendar, MessageSquare, FileText } from 'lucide-react';
import { Card } from '@/components/common/Card';
import type { Interaction } from '../types/crm.types';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

interface InteractionListProps {
  interactions: Interaction[];
  onEdit: (interaction: Interaction) => void;
  onDelete: (id: string) => void;
}

const TYPE_ICONS = {
  call: Phone,
  email: Mail,
  meeting: Calendar,
  note: FileText,
  sms: MessageSquare,
};

const TYPE_LABELS = {
  call: 'Telefoon',
  email: 'E-mail',
  meeting: 'Afspraak',
  note: 'Notitie',
  sms: 'SMS',
};

export const InteractionList: React.FC<InteractionListProps> = ({ interactions, onEdit, onDelete }) => {
  if (interactions.length === 0) {
    return (
      <Card>
        <p className="text-slate-500 dark:text-slate-400 text-center py-8">Geen interacties gevonden</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {interactions.map((interaction) => {
        const Icon = TYPE_ICONS[interaction.type];
        return (
          <Card key={interaction.id} className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {TYPE_LABELS[interaction.type]}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {format(new Date(interaction.date), 'dd MMM yyyy HH:mm', { locale: nl })}
                  </span>
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                  {interaction.subject}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {interaction.description}
                </p>
                {interaction.followUpRequired && interaction.followUpDate && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                    Opvolging: {format(new Date(interaction.followUpDate), 'dd MMM yyyy', { locale: nl })}
                  </p>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => onEdit(interaction)}
                  className="p-1 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(interaction.id)}
                  className="p-1 text-slate-500 hover:text-red-600 dark:hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

