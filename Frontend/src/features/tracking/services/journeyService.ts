import type { DocumentJourneyEntry, JourneyStage } from '../types/tracking.types';

/**
 * Create a journey entry
 */
export const createJourneyEntry = (
  stage: JourneyStage,
  performedBy: string,
  performedByName: string,
  action: string,
  description: string,
  metadata?: Record<string, unknown>
): DocumentJourneyEntry => {
  return {
    id: `journey_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    stage,
    performedBy,
    performedByName,
    action,
    description,
    metadata,
  };
};

/**
 * Add journey entry to document journey array
 */
export const addJourneyEntry = (
  journey: DocumentJourneyEntry[],
  entry: DocumentJourneyEntry
): DocumentJourneyEntry[] => {
  return [...journey, entry];
};

/**
 * Get journey entries for a specific stage
 */
export const getJourneyEntriesByStage = (
  journey: DocumentJourneyEntry[],
  stage: JourneyStage
): DocumentJourneyEntry[] => {
  return journey.filter(entry => entry.stage === stage);
};

/**
 * Get latest journey entry
 */
export const getLatestJourneyEntry = (
  journey: DocumentJourneyEntry[]
): DocumentJourneyEntry | null => {
  if (journey.length === 0) return null;
  return journey[journey.length - 1];
};

