import React from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Merge, X, CheckCircle, AlertTriangle } from 'lucide-react';
import type { DuplicateGroup } from '../types/data-quality.types';
import { cn } from '@/utils/cn';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

interface DuplicateGroupCardProps {
  group: DuplicateGroup;
  onMerge: (groupId: string) => void;
  onMarkAsNotDuplicate: (groupId: string) => void;
  onIgnore: (groupId: string) => void;
}

export const DuplicateGroupCard: React.FC<DuplicateGroupCardProps> = ({
  group,
  onMerge,
  onMarkAsNotDuplicate,
  onIgnore,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 0.95) return 'text-red-600 dark:text-red-400';
    if (score >= 0.85) return 'text-orange-600 dark:text-orange-400';
    return 'text-yellow-600 dark:text-yellow-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 0.95) return 'bg-red-100 dark:bg-red-900/20';
    if (score >= 0.85) return 'bg-orange-100 dark:bg-orange-900/20';
    return 'bg-yellow-100 dark:bg-yellow-900/20';
  };

  const scorePercentage = Math.round(group.overallScore * 100);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 capitalize">
              {group.entityType}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
              {group.recordIds.length} records
            </span>
          </div>
          <div className={cn('inline-flex items-center gap-2 px-3 py-1 rounded-full', getScoreBgColor(group.overallScore))}>
            <span className={cn('text-sm font-bold', getScoreColor(group.overallScore))}>
              {scorePercentage}% match
            </span>
          </div>
        </div>
        {group.status === 'pending' && (
          <AlertTriangle className="h-5 w-5 text-orange-500" />
        )}
        {group.status === 'ignored' && (
          <X className="h-5 w-5 text-slate-400" />
        )}
        {group.status === 'not_duplicate' && (
          <CheckCircle className="h-5 w-5 text-green-500" />
        )}
      </div>

      <div className="mb-4">
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
          Match redenen:
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-500 line-clamp-2">
          {group.matchReason || 'Geen specifieke reden opgegeven'}
        </p>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4">
        <span>
          Laatste scan: {group.lastScanAt 
            ? format(new Date(group.lastScanAt), 'dd MMM yyyy', { locale: nl })
            : 'Onbekend'}
        </span>
      </div>

      {group.status === 'pending' && (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => onMerge(group.id)}
            leftIcon={<Merge className="h-4 w-4" />}
            className="flex-1"
          >
            Merge
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onMarkAsNotDuplicate(group.id)}
            leftIcon={<CheckCircle className="h-4 w-4" />}
          >
            Geen duplicaat
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onIgnore(group.id)}
            leftIcon={<X className="h-4 w-4" />}
          >
            Negeer
          </Button>
        </div>
      )}
    </Card>
  );
};

