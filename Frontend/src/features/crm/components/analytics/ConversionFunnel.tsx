import React from 'react';
import type { LeadConversionMetrics } from '../../types/crm.types';

interface ConversionFunnelProps {
  metrics: LeadConversionMetrics;
}

export const ConversionFunnel: React.FC<ConversionFunnelProps> = ({ metrics }) => {
  // Pipeline stages in order
  const stages = [
    { key: 'new', label: 'Nieuw' },
    { key: 'contacted', label: 'Gecontacteerd' },
    { key: 'qualified', label: 'Gekwalificeerd' },
    { key: 'proposal', label: 'Voorstel' },
    { key: 'negotiation', label: 'Onderhandeling' },
    { key: 'won', label: 'Gewonnen' },
  ];

  // Calculate counts per stage (simplified - would need actual lead data)
  const getStageCount = (stageKey: string): number => {
    const stageData = metrics.conversionByStatus.find(s => s.status === stageKey);
    return stageData?.count || 0;
  };

  const maxCount = Math.max(...stages.map(s => getStageCount(s.key)), 1);

  return (
    <div className="space-y-4">
      {stages.map((stage, index) => {
        const count = getStageCount(stage.key);
        const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
        const conversionRate = metrics.conversionByStatus.find(s => s.status === stage.key)?.conversionRate || 0;

        return (
          <div key={stage.key} className="relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 w-24">
                  {stage.label}
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {count}
                </span>
              </div>
              {conversionRate > 0 && (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {conversionRate.toFixed(1)}% conversie
                </span>
              )}
            </div>
            <div className="relative h-8 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden">
              <div
                className={`h-full transition-all ${
                  index === stages.length - 1
                    ? 'bg-green-500'
                    : index >= stages.length - 3
                    ? 'bg-indigo-500'
                    : 'bg-blue-400'
                }`}
                style={{ width: `${percentage}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-white">
                  {percentage > 5 ? `${percentage.toFixed(0)}%` : ''}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

