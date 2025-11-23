import React from 'react';
import { Edit, Trash2, UserPlus, Mail, Phone } from 'lucide-react';
import { Card } from '@/components/common/Card';
import type { Lead } from '../types/crm.types';

interface LeadPipelineProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onConvert: (id: string) => void;
}


const STATUS_LABELS: Record<Lead['status'], string> = {
  new: 'Nieuw',
  contacted: 'Gecontacteerd',
  qualified: 'Gekwalificeerd',
  proposal: 'Voorstel',
  negotiation: 'Onderhandeling',
  won: 'Gewonnen',
  lost: 'Verloren',
};

export const LeadPipeline: React.FC<LeadPipelineProps> = ({ leads, onEdit, onDelete, onConvert }) => {
  const statuses: Lead['status'][] = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];

  const getLeadsByStatus = (status: Lead['status']) => {
    return leads.filter(lead => lead.status === status);
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 min-w-max pb-4">
        {statuses.map((status) => {
          const statusLeads = getLeadsByStatus(status);
          return (
            <div key={status} className="flex-shrink-0 w-64">
              <div className="mb-2">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  {STATUS_LABELS[status]}
                </h3>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {statusLeads.length} leads
                </span>
              </div>
              <div className="space-y-2">
                {statusLeads.map((lead) => (
                  <Card key={lead.id} className="hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900 dark:text-white">{lead.name}</h4>
                        {lead.company && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {lead.company}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        {status !== 'won' && status !== 'lost' && (
                          <button
                            onClick={() => onConvert(lead.id)}
                            className="p-1 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400"
                            title="Converteer naar klant"
                          >
                            <UserPlus className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onEdit(lead)}
                          className="p-1 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(lead.id)}
                          className="p-1 text-slate-500 hover:text-red-600 dark:hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-xs">
                      {lead.email && (
                        <p className="text-slate-600 dark:text-slate-300 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {lead.email}
                        </p>
                      )}
                      {lead.phone && (
                        <p className="text-slate-600 dark:text-slate-300 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {lead.phone}
                        </p>
                      )}
                      {lead.estimatedValue && (
                        <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                          €{lead.estimatedValue.toLocaleString('nl-NL')}
                        </p>
                      )}
                      {lead.source && (
                        <p className="text-slate-500 dark:text-slate-400">
                          Bron: {lead.source}
                        </p>
                      )}
                    </div>
                  </Card>
                ))}
                {statusLeads.length === 0 && (
                  <Card className="border-dashed border-2 border-slate-300 dark:border-slate-700">
                    <p className="text-center text-slate-400 dark:text-slate-500 text-sm py-4">
                      Geen leads
                    </p>
                  </Card>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

