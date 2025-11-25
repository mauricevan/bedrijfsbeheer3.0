import React, { useState } from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { AlertTriangle, Trash2, RefreshCw, CheckCircle } from 'lucide-react';
import type { OrphanedRecord } from '../types/data-quality.types';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

interface OrphanedRecordsDetectorProps {
  orphanedRecords: OrphanedRecord[];
  isLoading?: boolean;
  onRefresh: () => void;
  onCleanup: (recordIds: string[]) => void;
}

export const OrphanedRecordsDetector: React.FC<OrphanedRecordsDetectorProps> = ({
  orphanedRecords,
  isLoading = false,
  onRefresh,
  onCleanup,
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === orphanedRecords.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(orphanedRecords.map(r => r.id)));
    }
  };

  const handleCleanup = () => {
    const recordIds = orphanedRecords
      .filter(r => selectedIds.has(r.id))
      .map(r => r.recordId);
    onCleanup(recordIds);
    setSelectedIds(new Set());
  };

  const groupedByEntity = orphanedRecords.reduce((acc, record) => {
    if (!acc[record.entityType]) {
      acc[record.entityType] = [];
    }
    acc[record.entityType].push(record);
    return acc;
  }, {} as Record<string, OrphanedRecord[]>);

  if (isLoading) {
    return (
      <Card>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
          <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded" />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Orphaned Records
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {orphanedRecords.length} records met ontbrekende parent records
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onRefresh}
            leftIcon={<RefreshCw className="h-4 w-4" />}
          >
            Ververs
          </Button>
          {selectedIds.size > 0 && (
            <Button
              variant="danger"
              onClick={handleCleanup}
              leftIcon={<Trash2 className="h-4 w-4" />}
            >
              Opruimen ({selectedIds.size})
            </Button>
          )}
        </div>
      </div>

      {orphanedRecords.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">
              Geen orphaned records gevonden.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedByEntity).map(([entityType, records]) => (
            <Card key={entityType}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 capitalize">
                  {entityType} ({records.length})
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={selectAll}
                >
                  {selectedIds.size === records.length ? 'Deselecteer alles' : 'Selecteer alles'}
                </Button>
              </div>
              <div className="space-y-2">
                {records.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.has(record.id)}
                      onChange={() => toggleSelect(record.id)}
                      className="mt-1 h-4 w-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          Record ID: {record.recordId}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Ontbrekende parent: {record.parentEntityType} ({record.parentId})
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                        Gedetecteerd: {format(new Date(record.detectedAt), 'dd MMM yyyy HH:mm', { locale: nl })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

