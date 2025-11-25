import { useState, useEffect, useCallback } from 'react';
import type { EntityType, DataQualityMetrics, OrphanedRecord } from '../types/data-quality.types';
import {
  calculateMetrics,
  calculateAllMetrics,
  getOverallQualityScore,
  findAllOrphanedRecords,
  getInactiveRecords,
} from '../services/dataQualityMetrics';

export const useDataQuality = () => {
  const [metrics, setMetrics] = useState<DataQualityMetrics[]>([]);
  const [overallScore, setOverallScore] = useState<number>(0);
  const [orphanedRecords, setOrphanedRecords] = useState<OrphanedRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshMetrics = useCallback(async () => {
    try {
      setIsLoading(true);
      const [allMetrics, score, orphaned] = await Promise.all([
        calculateAllMetrics(),
        getOverallQualityScore(),
        findAllOrphanedRecords(),
      ]);
      setMetrics(allMetrics);
      setOverallScore(score);
      setOrphanedRecords(orphaned);
    } catch (error) {
      console.error('Failed to load data quality metrics:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshEntityMetrics = useCallback(async (entityType: EntityType) => {
    try {
      const entityMetrics = await calculateMetrics(entityType);
      setMetrics(prev => {
        const filtered = prev.filter(m => m.entityType !== entityType);
        return [...filtered, entityMetrics];
      });
    } catch (error) {
      console.error(`Failed to load metrics for ${entityType}:`, error);
    }
  }, []);

  const getInactiveRecordsForEntity = useCallback(
    async (entityType: EntityType, daysThreshold: number = 365) => {
      return await getInactiveRecords(entityType, daysThreshold);
    },
    []
  );

  useEffect(() => {
    refreshMetrics();
  }, [refreshMetrics]);

  return {
    metrics,
    overallScore,
    orphanedRecords,
    isLoading,
    refreshMetrics,
    refreshEntityMetrics,
    getInactiveRecordsForEntity,
  };
};

