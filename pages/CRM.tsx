// pages/CRM.tsx - Orchestration Only
import React, { useState } from 'react';
import { CRMDashboard, PipelineBoard, useCRMStats, useLeadsPipeline, type CRMProps } from '../features/crm';

export const CRM: React.FC<CRMProps> = (props) => {
  const { leads, customers } = props;
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pipeline' | 'customers'>('dashboard');

  const stats = useCRMStats(leads, customers);
  const pipelineGrouped = useLeadsPipeline(leads);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">CRM</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 rounded ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
          Dashboard
        </button>
        <button onClick={() => setActiveTab('pipeline')} className={`px-4 py-2 rounded ${activeTab === 'pipeline' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
          Pipeline
        </button>
        <button onClick={() => setActiveTab('customers')} className={`px-4 py-2 rounded ${activeTab === 'customers' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
          Klanten
        </button>
      </div>

      {/* Content */}
      {activeTab === 'dashboard' && <CRMDashboard stats={stats} />}
      {activeTab === 'pipeline' && <PipelineBoard grouped={pipelineGrouped} />}
      {activeTab === 'customers' && (
        <div className="bg-white p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Klanten Lijst</h2>
          <p className="text-gray-600">Totaal {customers.length} klanten</p>
        </div>
      )}
    </div>
  );
};
