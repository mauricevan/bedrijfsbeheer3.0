import React, { useState, useCallback } from 'react';
import type { EntityType, MergeOperation, MergePreview } from '../types/data-quality.types';
import { generateMergePreview, mergeRecords, getMergeLog, getMergeOperation } from '../services/mergeService';

export const useMerge = () => {
  const [mergePreview, setMergePreview] = useState<MergePreview | null>(null);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mergeHistory, setMergeHistory] = useState<MergeOperation[]>([]);

  const loadMergeHistory = useCallback(() => {
    const history = getMergeLog();
    setMergeHistory(history);
  }, []);

  const generatePreview = useCallback(
    async (entityType: EntityType, masterRecordId: string, recordsToMergeIds: string[]) => {
      try {
        setIsGeneratingPreview(true);
        setError(null);
        const preview = await generateMergePreview(entityType, masterRecordId, recordsToMergeIds);
        setMergePreview(preview);
        return preview;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to generate merge preview';
        setError(errorMessage);
        throw err;
      } finally {
        setIsGeneratingPreview(false);
      }
    },
    []
  );

  const merge = useCallback(
    async (
      entityType: EntityType,
      masterRecordId: string,
      recordsToMergeIds: string[],
      mergedBy: string,
      fieldResolutions?: Record<string, any>
    ) => {
      try {
        setIsMerging(true);
        setError(null);
        const operation = await mergeRecords(
          entityType,
          masterRecordId,
          recordsToMergeIds,
          mergedBy,
          fieldResolutions
        );
        setMergePreview(null);
        loadMergeHistory();
        return operation;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to merge records';
        setError(errorMessage);
        throw err;
      } finally {
        setIsMerging(false);
      }
    },
    [loadMergeHistory]
  );

  const getOperation = useCallback((id: string) => {
    return getMergeOperation(id);
  }, []);

  const clearPreview = useCallback(() => {
    setMergePreview(null);
    setError(null);
  }, []);

  // Load history on mount
  React.useEffect(() => {
    loadMergeHistory();
  }, [loadMergeHistory]);

  return {
    mergePreview,
    isGeneratingPreview,
    isMerging,
    error,
    mergeHistory,
    generatePreview,
    merge,
    getOperation,
    clearPreview,
    loadMergeHistory,
  };
};

