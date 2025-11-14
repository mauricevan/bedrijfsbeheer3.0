// components/AdminSettings.tsx - Refactored < 300 regels
import React, { useState } from 'react';
import type { ModuleKey } from '../types';

interface AdminSettingsProps {
  activeModules: Record<ModuleKey, boolean>;
  setActiveModules: React.Dispatch<React.SetStateAction<Record<ModuleKey, boolean>>>;
  isAdmin: boolean;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  activeModules,
  setActiveModules,
  isAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'modules' | 'analytics'>('modules');

  if (!isAdmin) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Alleen admins hebben toegang tot deze pagina.</p>
        </div>
      </div>
    );
  }

  const modules = Object.entries(activeModules);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Instellingen</h1>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('modules')}
          className={`px-4 py-2 rounded ${
            activeTab === 'modules' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Modules
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded ${
            activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Analytics
        </button>
      </div>

      {activeTab === 'modules' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Module Beheer</h2>
          <div className="space-y-4">
            {modules.map(([key, enabled]) => (
              <div key={key} className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="font-semibold capitalize">
                    {key.replace(/_/g, ' ')}
                  </h3>
                  <p className="text-sm text-gray-600">Module in-/uitschakelen</p>
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) =>
                      setActiveModules((prev) => ({
                        ...prev,
                        [key]: e.target.checked,
                      }))
                    }
                    className="w-5 h-5 rounded"
                  />
                  <span className="text-sm font-medium">
                    {enabled ? 'Actief' : 'Inactief'}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Systeem Analytics</h2>
          <p className="text-gray-600">Analytics dashboard (in ontwikkeling)</p>
        </div>
      )}
    </div>
  );
};
