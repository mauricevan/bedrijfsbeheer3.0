/**
 * BTW Overview Component
 * Displays NL-compliant VAT overview for current month
 */

import React, { useMemo } from 'react';
import { CheckCircle } from 'lucide-react';
import { Card } from '@/components/common/Card';
import type { InventoryItem } from '../types';
import { calculateBTWOverview, isReadyForBTWFiling } from '../utils/btw';

type BTWOverviewProps = {
  items: InventoryItem[];
};

export const BTWOverview: React.FC<BTWOverviewProps> = ({ items }) => {
  const overview = useMemo(() => calculateBTWOverview(items), [items]);
  const isReady = useMemo(() => isReadyForBTWFiling(overview), [overview]);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        💰 BTW Overzicht Deze Maand
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">BTW 21%</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            €{overview.btw21.toFixed(2)}
          </p>
        </div>
        
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">BTW 9%</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            €{overview.btw9.toFixed(2)}
          </p>
        </div>
        
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">BTW Vrij</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            €{overview.btwVrij.toFixed(2)}
          </p>
        </div>
        
        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border-2 border-indigo-200 dark:border-indigo-800">
          <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-1 font-medium">Totaal BTW</p>
          <p className="text-xl font-bold text-indigo-900 dark:text-indigo-100">
            €{overview.totaal.toFixed(2)}
          </p>
        </div>
      </div>
      
      {isReady && (
        <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400">
          <CheckCircle className="h-4 w-4" />
          <span className="font-medium">
            ✅ Klaar voor BTW-aangifte - Alle bedragen zijn berekend conform NL-regels
          </span>
        </div>
      )}
    </Card>
  );
};

