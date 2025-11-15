// features/crm/components/index.tsx
import React from 'react';

export const CRMDashboard: React.FC<any> = ({ stats }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
    <div className="bg-white p-4 rounded-lg shadow">
      <p className="text-sm text-gray-600">Totale Leads</p>
      <p className="text-2xl font-bold">{stats.totalLeads}</p>
    </div>
    <div className="bg-blue-50 p-4 rounded-lg shadow">
      <p className="text-sm text-gray-600">Actieve Leads</p>
      <p className="text-2xl font-bold">{stats.activeLeads}</p>
    </div>
    <div className="bg-green-50 p-4 rounded-lg shadow">
      <p className="text-sm text-gray-600">Conversie</p>
      <p className="text-2xl font-bold">{stats.conversionRate}%</p>
    </div>
    <div className="bg-purple-50 p-4 rounded-lg shadow">
      <p className="text-sm text-gray-600">Pipeline Waarde</p>
      <p className="text-2xl font-bold">€{stats.pipelineValue.toLocaleString()}</p>
    </div>
  </div>
);

export const PipelineBoard: React.FC<{ grouped: Record<string, any[]> }> = ({ grouped }) => {
  const stages = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];
  const stageNames: Record<string, string> = {
    new: 'Nieuw',
    contacted: 'Contact',
    qualified: 'Gekwalificeerd',
    proposal: 'Voorstel',
    negotiation: 'Onderhandeling',
    won: 'Gewonnen',
    lost: 'Verloren',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
      {stages.map((stage) => (
        <div key={stage} className="bg-gray-50 rounded-lg p-3">
          <h3 className="font-semibold mb-2">{stageNames[stage]}</h3>
          <div className="space-y-2">
            {grouped[stage]?.map((lead) => (
              <div key={lead.id} className="bg-white p-2 rounded shadow-sm text-sm">
                <p className="font-medium">{lead.name}</p>
                <p className="text-gray-600 text-xs">{lead.company}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
