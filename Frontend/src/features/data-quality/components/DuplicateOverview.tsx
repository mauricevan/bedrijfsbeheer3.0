import React, { useState } from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { DuplicateGroupCard } from './DuplicateGroupCard';
import { Search, Filter, RefreshCw } from 'lucide-react';
import type { EntityType, DuplicateStatus } from '../types/data-quality.types';
import { cn } from '@/utils/cn';

interface DuplicateOverviewProps {
  duplicateGroups: any[];
  isScanning: boolean;
  onMerge: (groupId: string) => void;
  onMarkAsNotDuplicate: (groupId: string) => void;
  onIgnore: (groupId: string) => void;
  onScan: () => void;
  onRefresh: () => void;
}

export const DuplicateOverview: React.FC<DuplicateOverviewProps> = ({
  duplicateGroups,
  isScanning,
  onMerge,
  onMarkAsNotDuplicate,
  onIgnore,
  onScan,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [entityFilter, setEntityFilter] = useState<EntityType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<DuplicateStatus | 'all'>('pending');
  const [scoreFilter, setScoreFilter] = useState<string>('all');

  const filteredGroups = duplicateGroups.filter(group => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        group.matchReason?.toLowerCase().includes(query) ||
        group.entityType.toLowerCase().includes(query) ||
        group.recordIds.some((id: string) => id.toLowerCase().includes(query));
      
      if (!matchesSearch) return false;
    }

    // Entity filter
    if (entityFilter !== 'all' && group.entityType !== entityFilter) {
      return false;
    }

    // Status filter
    if (statusFilter !== 'all' && group.status !== statusFilter) {
      return false;
    }

    // Score filter
    if (scoreFilter !== 'all') {
      const score = group.overallScore;
      if (scoreFilter === 'high' && score < 0.95) return false;
      if (scoreFilter === 'medium' && (score < 0.85 || score >= 0.95)) return false;
      if (scoreFilter === 'low' && score >= 0.85) return false;
    }

    return true;
  });

  const pendingCount = duplicateGroups.filter(g => g.status === 'pending').length;
  const ignoredCount = duplicateGroups.filter(g => g.status === 'ignored').length;
  const notDuplicateCount = duplicateGroups.filter(g => g.status === 'not_duplicate').length;

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Duplicaat Overzicht
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {filteredGroups.length} van {duplicateGroups.length} groepen
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onRefresh}
            leftIcon={<RefreshCw className="h-4 w-4" />}
            disabled={isScanning}
          >
            Ververs
          </Button>
          <Button
            variant="primary"
            onClick={onScan}
            disabled={isScanning}
            isLoading={isScanning}
          >
            Scan Nu
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Zoek duplicaten..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value as EntityType | 'all')}
          >
            <option value="all">Alle entiteiten</option>
            <option value="customer">Klanten</option>
            <option value="supplier">Leveranciers</option>
            <option value="inventory">Artikelen</option>
            <option value="contact">Contactpersonen</option>
            <option value="employee">Medewerkers</option>
          </Select>

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as DuplicateStatus | 'all')}
          >
            <option value="all">Alle statussen</option>
            <option value="pending">Pending ({pendingCount})</option>
            <option value="ignored">Genegeerd ({ignoredCount})</option>
            <option value="not_duplicate">Geen duplicaat ({notDuplicateCount})</option>
          </Select>

          <Select
            value={scoreFilter}
            onChange={(e) => setScoreFilter(e.target.value)}
          >
            <option value="all">Alle scores</option>
            <option value="high">Hoog (≥95%)</option>
            <option value="medium">Medium (85-95%)</option>
            <option value="low">Laag (&lt;85%)</option>
          </Select>
        </div>
      </Card>

      {/* Duplicate Groups */}
      {filteredGroups.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">
              Geen duplicaten gevonden met de huidige filters.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGroups.map((group) => (
            <DuplicateGroupCard
              key={group.id}
              group={group}
              onMerge={onMerge}
              onMarkAsNotDuplicate={onMarkAsNotDuplicate}
              onIgnore={onIgnore}
            />
          ))}
        </div>
      )}
    </div>
  );
};

