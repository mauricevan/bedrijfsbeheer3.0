export type EntityType = 'customer' | 'supplier' | 'inventory' | 'contact' | 'employee';

export type DuplicateStatus = 'pending' | 'merged' | 'ignored' | 'not_duplicate';

export interface DuplicateMatch {
  recordId: string;
  score: number;
  matchedFields: string[];
  reasons: string[];
}

export interface DuplicateGroup {
  id: string;
  entityType: EntityType;
  recordIds: string[];
  matches: DuplicateMatch[];
  overallScore: number;
  matchReason: string;
  suggestedMasterId?: string;
  status: DuplicateStatus;
  createdAt: string;
  updatedAt: string;
  lastScanAt?: string;
}

export interface MergeOperation {
  id: string;
  entityType: EntityType;
  masterRecordId: string;
  mergedRecordIds: string[];
  mergedBy: string;
  mergedAt: string;
  mergeDetails: {
    fieldsMerged: string[];
    relationsRelocated: {
      entityType: string;
      count: number;
    }[];
    conflictsResolved: {
      field: string;
      chosenValue: any;
      discardedValue: any;
    }[];
  };
}

export interface DataQualityMetrics {
  entityType: EntityType;
  totalRecords: number;
  activeRecords: number;
  duplicateCount: number;
  orphanedCount: number;
  missingEmailCount: number;
  missingPhoneCount: number;
  softDeletedCount: number;
  lastScanAt?: string;
  calculatedAt: string;
}

export interface OrphanedRecord {
  id: string;
  entityType: string;
  recordId: string;
  parentEntityType: string;
  parentId: string;
  recordData: any;
  detectedAt: string;
}

export interface MatchingConfig {
  email: { threshold: number; weight: number };
  name: { threshold: number; weight: number };
  phone: { threshold: number; weight: number };
  composite: { threshold: number; weight: number };
}

export interface EntityMatchingRules {
  uniqueFields: string[];
  matchingFields: string[];
  compositeKeys?: {
    fields: string[];
    threshold: number;
  }[];
}

export interface MergePreview {
  masterRecord: any;
  recordsToMerge: any[];
  fieldsToMerge: {
    field: string;
    masterValue: any;
    mergeValue: any;
    conflict: boolean;
  }[];
  relationsToRelocate: {
    entityType: string;
    relationField: string;
    count: number;
    records: any[];
  }[];
}

export interface ScanProgress {
  entityType: EntityType;
  totalRecords: number;
  processedRecords: number;
  foundDuplicates: number;
  isComplete: boolean;
  error?: string;
}

