import React from 'react';
import { Card } from '@/components/common/Card';
import { AlertCircle, CheckCircle, Users, Package, FileText, TrendingUp } from 'lucide-react';
import type { DataQualityMetrics } from '../types/data-quality.types';
import { cn } from '@/utils/cn';

interface DataQualityKPIsProps {
  metrics: DataQualityMetrics[];
  overallScore: number;
  isLoading?: boolean;
}

export const DataQualityKPIs: React.FC<DataQualityKPIsProps> = ({
  metrics,
  overallScore,
  isLoading = false,
}) => {
  const totalDuplicates = metrics.reduce((sum, m) => sum + m.duplicateCount, 0);
  const totalMissingEmail = metrics.reduce((sum, m) => sum + m.missingEmailCount, 0);
  const totalSoftDeleted = metrics.reduce((sum, m) => sum + m.softDeletedCount, 0);
  const totalRecords = metrics.reduce((sum, m) => sum + m.activeRecords, 0);
  
  const missingEmailPercentage = totalRecords > 0 
    ? Math.round((totalMissingEmail / totalRecords) * 100) 
    : 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="animate-pulse">
            <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Overall Quality Score */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Overall Score</p>
            <p className={cn('text-3xl font-bold', getScoreColor(overallScore))}>
              {overallScore.toFixed(1)}
            </p>
          </div>
          <div className={cn('p-3 rounded-lg', getScoreBgColor(overallScore))}>
            <TrendingUp className={cn('h-6 w-6', getScoreColor(overallScore))} />
          </div>
        </div>
      </Card>

      {/* Active Duplicates */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Actieve Duplicaten</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {totalDuplicates}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/20">
            <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </Card>

      {/* Missing Email */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Zonder E-mail</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {missingEmailPercentage}%
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {totalMissingEmail} van {totalRecords}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
            <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </Card>

      {/* Soft Deleted */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Verwijderd (Soft)</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {totalSoftDeleted}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-700">
            <Package className="h-6 w-6 text-slate-600 dark:text-slate-400" />
          </div>
        </div>
      </Card>
    </div>
  );
};

