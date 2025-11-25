import React, { useState } from 'react';
import { DataQualityKPIs } from './DataQualityKPIs';
import { DuplicateOverview } from './DuplicateOverview';
import { OrphanedRecordsDetector } from './OrphanedRecordsDetector';
import { MergeWizard } from './MergeWizard';
import { useDataQuality, useDuplicateDetection, useMerge } from '../hooks';
import { Card } from '@/components/common/Card';
import type { EntityType, DuplicateGroup } from '../types/data-quality.types';

export const DataQualityDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'duplicates' | 'orphaned'>('duplicates');
  const [mergeWizardOpen, setMergeWizardOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<DuplicateGroup | null>(null);

  const { metrics, overallScore, orphanedRecords, isLoading: metricsLoading, refreshMetrics } = useDataQuality();
  const {
    duplicateGroups,
    isScanning,
    scanProgress,
    scanAll,
    markAsNotDuplicate,
    ignoreGroup,
    removeGroup,
    refreshGroups,
  } = useDuplicateDetection();
  const {
    mergePreview,
    isGeneratingPreview,
    isMerging,
    generatePreview,
    merge,
    clearPreview,
  } = useMerge();

  const handleScan = async () => {
    await scanAll();
    refreshMetrics();
  };

  const handleMerge = async (groupId: string) => {
    const group = duplicateGroups.find(g => g.id === groupId);
    if (!group) return;

    setSelectedGroup(group);
    
    if (group.recordIds.length < 2) {
      alert('Een merge groep moet minimaal 2 records bevatten');
      return;
    }

    const masterId = group.suggestedMasterId || group.recordIds[0];
    const recordsToMerge = group.recordIds.filter(id => id !== masterId);

    try {
      await generatePreview(group.entityType, masterId, recordsToMerge);
      setMergeWizardOpen(true);
    } catch (error) {
      console.error('Failed to generate merge preview:', error);
      alert('Kon merge preview niet genereren');
    }
  };

  const handleMergeConfirm = async (fieldResolutions?: Record<string, any>) => {
    if (!selectedGroup) return;

    const masterId = selectedGroup.suggestedMasterId || selectedGroup.recordIds[0];
    const recordsToMerge = selectedGroup.recordIds.filter(id => id !== masterId);
    
    // Get current user ID (in a real app, this would come from auth context)
    const currentUserId = 'system'; // TODO: Get from auth context

    try {
      await merge(selectedGroup.entityType, masterId, recordsToMerge, currentUserId, fieldResolutions);
      removeGroup(selectedGroup.id);
      refreshGroups();
      refreshMetrics();
      setMergeWizardOpen(false);
      setSelectedGroup(null);
      clearPreview();
    } catch (error) {
      console.error('Failed to merge records:', error);
      alert('Kon records niet mergen');
    }
  };

  const handleMarkAsNotDuplicate = (groupId: string) => {
    markAsNotDuplicate(groupId);
    refreshMetrics();
  };

  const handleIgnore = (groupId: string) => {
    ignoreGroup(groupId);
  };

  const handleCleanupOrphaned = async (recordIds: string[]) => {
    // TODO: Implement cleanup logic
    console.log('Cleanup orphaned records:', recordIds);
    alert(`Cleanup functionaliteit moet nog geïmplementeerd worden voor ${recordIds.length} records`);
    refreshMetrics();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Data Quality Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Beheer duplicaten, orphaned records en data kwaliteit
        </p>
      </div>

      {/* KPIs */}
      <DataQualityKPIs metrics={metrics} overallScore={overallScore} isLoading={metricsLoading} />

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab('duplicates')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'duplicates'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Duplicaten
          </button>
          <button
            onClick={() => setActiveTab('orphaned')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'orphaned'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Orphaned Records
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'duplicates' ? (
        <DuplicateOverview
          duplicateGroups={duplicateGroups}
          isScanning={isScanning}
          onMerge={handleMerge}
          onMarkAsNotDuplicate={handleMarkAsNotDuplicate}
          onIgnore={handleIgnore}
          onScan={handleScan}
          onRefresh={refreshGroups}
        />
      ) : (
        <OrphanedRecordsDetector
          orphanedRecords={orphanedRecords}
          isLoading={metricsLoading}
          onRefresh={refreshMetrics}
          onCleanup={handleCleanupOrphaned}
        />
      )}

      {/* Merge Wizard */}
      {selectedGroup && (
        <MergeWizard
          isOpen={mergeWizardOpen}
          onClose={() => {
            setMergeWizardOpen(false);
            setSelectedGroup(null);
            clearPreview();
          }}
          entityType={selectedGroup.entityType}
          masterRecordId={selectedGroup.suggestedMasterId || selectedGroup.recordIds[0]}
          recordsToMergeIds={selectedGroup.recordIds.filter(
            id => id !== (selectedGroup.suggestedMasterId || selectedGroup.recordIds[0])
          )}
          preview={mergePreview}
          isGeneratingPreview={isGeneratingPreview}
          isMerging={isMerging}
          onGeneratePreview={async () => {
            const masterId = selectedGroup.suggestedMasterId || selectedGroup.recordIds[0];
            const recordsToMerge = selectedGroup.recordIds.filter(id => id !== masterId);
            await generatePreview(selectedGroup.entityType, masterId, recordsToMerge);
          }}
          onMerge={handleMergeConfirm}
        />
      )}
    </div>
  );
};

