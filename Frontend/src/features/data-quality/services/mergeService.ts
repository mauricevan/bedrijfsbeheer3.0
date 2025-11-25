import type { EntityType, MergeOperation, MergePreview } from '../types/data-quality.types';
import { storageAdapter } from '../storage/storageAdapter';
import { storage } from '@/utils/storage';

const MERGE_LOG_KEY = 'bedrijfsbeheer_merge_log';

/**
 * Generate merge preview
 */
export async function generateMergePreview(
  entityType: EntityType,
  masterRecordId: string,
  recordsToMergeIds: string[]
): Promise<MergePreview> {
  const masterRecord = await storageAdapter.getRecordById(entityType, masterRecordId);
  if (!masterRecord) {
    throw new Error(`Master record not found: ${masterRecordId}`);
  }
  
  const recordsToMerge = await Promise.all(
    recordsToMergeIds.map(id => storageAdapter.getRecordById(entityType, id))
  );
  
  const validRecords = recordsToMerge.filter(r => r !== null) as any[];
  
  // Find fields to merge
  const fieldsToMerge: MergePreview['fieldsToMerge'] = [];
  const allFields = new Set<string>();
  
  // Collect all fields from all records
  [masterRecord, ...validRecords].forEach(record => {
    Object.keys(record).forEach(key => {
      if (!['id', 'createdAt', 'updatedAt', 'isDeleted', 'is_deleted', 'mergedIntoId'].includes(key)) {
        allFields.add(key);
      }
    });
  });
  
  // Compare fields
  for (const field of allFields) {
    const masterValue = masterRecord[field];
    const mergeValues = validRecords.map(r => r[field]).filter(v => v !== undefined && v !== null);
    
    if (mergeValues.length > 0) {
      const hasConflict = mergeValues.some(v => {
        if (masterValue === undefined || masterValue === null) return false;
        if (typeof masterValue === 'object' || typeof v === 'object') {
          return JSON.stringify(masterValue) !== JSON.stringify(v);
        }
        return String(masterValue) !== String(v);
      });
      
      fieldsToMerge.push({
        field,
        masterValue: masterValue ?? null,
        mergeValue: mergeValues[0] ?? null,
        conflict: hasConflict,
      });
    }
  }
  
  // Find relations to relocate
  const relationsToRelocate: MergePreview['relationsToRelocate'] = [];
  
  for (const recordId of recordsToMergeIds) {
    const relatedRecords = await storageAdapter.getRelatedRecords(entityType, recordId);
    
    for (const relation of relatedRecords) {
      const existing = relationsToRelocate.find(
        r => r.entityType === relation.entityType && r.relationField === relation.entityType + 'Id'
      );
      
      if (existing) {
        existing.count += relation.records.length;
        existing.records.push(...relation.records);
      } else {
        // Determine relation field name
        const relationField = getRelationFieldName(entityType, relation.entityType);
        
        relationsToRelocate.push({
          entityType: relation.entityType,
          relationField: relationField || `${entityType}Id`,
          count: relation.records.length,
          records: relation.records,
        });
      }
    }
  }
  
  return {
    masterRecord,
    recordsToMerge: validRecords,
    fieldsToMerge,
    relationsToRelocate,
  };
}

/**
 * Merge records
 */
export async function mergeRecords(
  entityType: EntityType,
  masterRecordId: string,
  recordsToMergeIds: string[],
  mergedBy: string,
  fieldResolutions?: Record<string, any>
): Promise<MergeOperation> {
  const preview = await generateMergePreview(entityType, masterRecordId, recordsToMergeIds);
  
  // Merge fields into master record
  const mergedFields: string[] = [];
  const conflictsResolved: MergeOperation['mergeDetails']['conflictsResolved'] = [];
  
  for (const fieldMerge of preview.fieldsToMerge) {
    if (fieldMerge.conflict && fieldResolutions && fieldResolutions[fieldMerge.field] !== undefined) {
      // Use resolved value
      const resolvedValue = fieldResolutions[fieldMerge.field];
      await storageAdapter.updateRecord(entityType, masterRecordId, {
        [fieldMerge.field]: resolvedValue,
      });
      conflictsResolved.push({
        field: fieldMerge.field,
        chosenValue: resolvedValue,
        discardedValue: fieldMerge.mergeValue,
      });
      mergedFields.push(fieldMerge.field);
    } else if (!fieldMerge.masterValue && fieldMerge.mergeValue) {
      // Master doesn't have value, use merge value
      await storageAdapter.updateRecord(entityType, masterRecordId, {
        [fieldMerge.field]: fieldMerge.mergeValue,
      });
      mergedFields.push(fieldMerge.field);
    } else if (fieldMerge.masterValue && !fieldMerge.conflict) {
      // No conflict, keep master value
      mergedFields.push(fieldMerge.field);
    }
  }
  
  // Relocate foreign keys
  const relationsRelocated: MergeOperation['mergeDetails']['relationsRelocated'] = [];
  
  for (const relation of preview.relationsToRelocate) {
    let relocatedCount = 0;
    
    for (const recordId of recordsToMergeIds) {
      const count = await storageAdapter.updateRelatedRecords(
        relation.entityType,
        relation.relationField,
        recordId,
        masterRecordId
      );
      relocatedCount += count;
    }
    
    if (relocatedCount > 0) {
      relationsRelocated.push({
        entityType: relation.entityType,
        count: relocatedCount,
      });
    }
  }
  
  // Soft-delete merged records
  for (const recordId of recordsToMergeIds) {
    await storageAdapter.updateRecord(entityType, recordId, {
      isDeleted: true,
      is_deleted: true,
      deletedAt: new Date().toISOString(),
      mergedIntoId: masterRecordId,
    });
  }
  
  // Create merge log entry
  const mergeOperation: MergeOperation = {
    id: `merge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    entityType,
    masterRecordId,
    mergedRecordIds: recordsToMergeIds,
    mergedBy,
    mergedAt: new Date().toISOString(),
    mergeDetails: {
      fieldsMerged: mergedFields,
      relationsRelocated: relationsRelocated,
      conflictsResolved,
    },
  };
  
  // Save merge log
  const mergeLog = storage.get<MergeOperation[]>(MERGE_LOG_KEY, []);
  mergeLog.push(mergeOperation);
  storage.set(MERGE_LOG_KEY, mergeLog);
  
  return mergeOperation;
}

/**
 * Get relation field name for a given entity relationship
 */
function getRelationFieldName(entityType: EntityType, relatedEntityType: string): string {
  const mapping: Record<string, Record<string, string>> = {
    customer: {
      interaction: 'customerId',
      task: 'customerId',
      invoice: 'customerId',
      quote: 'customerId',
      work_order: 'customerId',
    },
    supplier: {
      inventory: 'supplierId',
    },
    inventory: {
      pos_sale_item: 'inventoryItemId',
      work_order_material: 'inventoryItemId',
    },
    employee: {
      interaction: 'employeeId',
      task: 'employeeId',
    },
  };
  
  return mapping[entityType]?.[relatedEntityType] || `${entityType}Id`;
}

/**
 * Get merge log
 */
export function getMergeLog(entityType?: EntityType): MergeOperation[] {
  const log = storage.get<MergeOperation[]>(MERGE_LOG_KEY, []);
  
  if (entityType) {
    return log.filter(op => op.entityType === entityType);
  }
  
  return log;
}

/**
 * Get merge operation by ID
 */
export function getMergeOperation(id: string): MergeOperation | null {
  const log = getMergeLog();
  return log.find(op => op.id === id) || null;
}

