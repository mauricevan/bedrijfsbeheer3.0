import React, { useState, useCallback } from 'react';
import type { EntityType, DuplicateGroup, ScanProgress } from '../types/data-quality.types';
import {
  scanForDuplicates,
  scanAllEntities,
  getDuplicateGroups,
  getDuplicateGroupsByEntity,
  getDuplicateGroup,
  updateDuplicateGroupStatus,
  markAsNotDuplicate,
  ignoreDuplicateGroup,
  removeDuplicateGroup,
  autoMergeExactMatches,
} from '../services/duplicateDetector';

export const useDuplicateDetection = () => {
  const [duplicateGroups, setDuplicateGroups] = useState<DuplicateGroup[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState<ScanProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refreshGroups = useCallback(() => {
    const groups = getDuplicateGroups();
    setDuplicateGroups(groups);
  }, []);

  const scanEntity = useCallback(
    async (entityType: EntityType, threshold: number = 0.85) => {
      try {
        setIsScanning(true);
        setError(null);
        setScanProgress(null);

        const groups = await scanForDuplicates(entityType, threshold, (progress) => {
          setScanProgress(progress);
        });

        refreshGroups();
        return groups;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to scan for duplicates';
        setError(errorMessage);
        throw err;
      } finally {
        setIsScanning(false);
        setScanProgress(null);
      }
    },
    [refreshGroups]
  );

  const scanAll = useCallback(
    async (entityTypes: EntityType[] = ['customer', 'supplier', 'inventory', 'contact', 'employee'], threshold: number = 0.85) => {
      try {
        setIsScanning(true);
        setError(null);
        setScanProgress(null);

        const groups = await scanAllEntities(entityTypes, threshold, (progress) => {
          setScanProgress(progress);
        });

        refreshGroups();
        return groups;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to scan all entities';
        setError(errorMessage);
        throw err;
      } finally {
        setIsScanning(false);
        setScanProgress(null);
      }
    },
    [refreshGroups]
  );

  const getGroupsByEntity = useCallback((entityType: EntityType) => {
    return getDuplicateGroupsByEntity(entityType);
  }, []);

  const getGroup = useCallback((groupId: string) => {
    return getDuplicateGroup(groupId);
  }, []);

  const markAsNotDuplicateHandler = useCallback(
    (groupId: string) => {
      const updated = markAsNotDuplicate(groupId);
      if (updated) {
        refreshGroups();
      }
      return updated;
    },
    [refreshGroups]
  );

  const ignoreGroup = useCallback(
    (groupId: string) => {
      const updated = ignoreDuplicateGroup(groupId);
      if (updated) {
        refreshGroups();
      }
      return updated;
    },
    [refreshGroups]
  );

  const removeGroup = useCallback(
    (groupId: string) => {
      removeDuplicateGroup(groupId);
      refreshGroups();
    },
    [refreshGroups]
  );

  const autoMerge = useCallback(
    async (entityType: EntityType, threshold: number = 0.99) => {
      return await autoMergeExactMatches(entityType, threshold);
    },
    []
  );

  // Load groups on mount
  React.useEffect(() => {
    refreshGroups();
  }, [refreshGroups]);

  return {
    duplicateGroups,
    isScanning,
    scanProgress,
    error,
    scanEntity,
    scanAll,
    getGroupsByEntity,
    getGroup,
    markAsNotDuplicate: markAsNotDuplicateHandler,
    ignoreGroup,
    removeGroup,
    autoMerge,
    refreshGroups,
  };
};

