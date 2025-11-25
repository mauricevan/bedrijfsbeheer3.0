import type { EntityType, DataQualityMetrics, OrphanedRecord } from '../types/data-quality.types';
import { storageAdapter } from '../storage/storageAdapter';
import { getDuplicateGroupsByEntity } from './duplicateDetector';
import { normalizeEmailAddress } from '../utils/emailNormalizer';
import { normalizePhoneNumber } from '../utils/phoneNormalizer';

/**
 * Calculate data quality metrics for an entity type
 */
export async function calculateMetrics(entityType: EntityType): Promise<DataQualityMetrics> {
  const allRecords = await storageAdapter.getAllRecords(entityType);
  const activeRecords = allRecords.filter(r => !r.isDeleted && !r.is_deleted);
  const softDeletedRecords = allRecords.filter(r => r.isDeleted || r.is_deleted);
  
  // Count duplicates
  const duplicateGroups = getDuplicateGroupsByEntity(entityType, 'pending');
  const duplicateRecordIds = new Set<string>();
  duplicateGroups.forEach(group => {
    group.recordIds.forEach(id => duplicateRecordIds.add(id));
  });
  const duplicateCount = duplicateRecordIds.size;
  
  // Count missing emails
  let missingEmailCount = 0;
  let missingPhoneCount = 0;
  
  for (const record of activeRecords) {
    const email = getEmailField(record);
    const phone = getPhoneField(record);
    
    if (!email || !normalizeEmailAddress(email)) {
      missingEmailCount++;
    }
    
    if (!phone || !normalizePhoneNumber(phone)) {
      missingPhoneCount++;
    }
  }
  
  return {
    entityType,
    totalRecords: allRecords.length,
    activeRecords: activeRecords.length,
    duplicateCount,
    orphanedCount: 0, // Will be calculated separately
    missingEmailCount,
    missingPhoneCount,
    softDeletedCount: softDeletedRecords.length,
    calculatedAt: new Date().toISOString(),
  };
}

/**
 * Calculate metrics for all entity types
 */
export async function calculateAllMetrics(): Promise<DataQualityMetrics[]> {
  const entityTypes: EntityType[] = ['customer', 'supplier', 'inventory', 'contact', 'employee'];
  const metrics = await Promise.all(entityTypes.map(et => calculateMetrics(et)));
  return metrics;
}

/**
 * Find orphaned records
 */
export async function findOrphanedRecords(entityType: EntityType): Promise<OrphanedRecord[]> {
  const orphaned: OrphanedRecord[] = [];
  
  // Define parent relationships
  const parentRelations: Record<string, { parentEntityType: EntityType; field: string; storageKey: string }[]> = {
    interaction: [
      { parentEntityType: 'customer', field: 'customerId', storageKey: 'bedrijfsbeheer_customers' },
      { parentEntityType: 'employee', field: 'employeeId', storageKey: 'bedrijfsbeheer_employees' },
    ],
    task: [
      { parentEntityType: 'customer', field: 'customerId', storageKey: 'bedrijfsbeheer_customers' },
      { parentEntityType: 'employee', field: 'employeeId', storageKey: 'bedrijfsbeheer_employees' },
    ],
    invoice: [
      { parentEntityType: 'customer', field: 'customerId', storageKey: 'bedrijfsbeheer_customers' },
    ],
    quote: [
      { parentEntityType: 'customer', field: 'customerId', storageKey: 'bedrijfsbeheer_customers' },
    ],
    inventory: [
      { parentEntityType: 'supplier', field: 'supplierId', storageKey: 'bedrijfsbeheer_suppliers' },
    ],
  };
  
  const relations = parentRelations[entityType] || [];
  
  for (const relation of relations) {
    const records = await storageAdapter.getAllRecords(entityType as EntityType);
    const parentRecords = await storageAdapter.getAllRecords(relation.parentEntityType);
    const parentIds = new Set(parentRecords.map(r => r.id));
    
    for (const record of records) {
      const parentId = record[relation.field];
      if (parentId && !parentIds.has(parentId)) {
        orphaned.push({
          id: `orphan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          entityType,
          recordId: record.id,
          parentEntityType: relation.parentEntityType,
          parentId,
          recordData: record,
          detectedAt: new Date().toISOString(),
        });
      }
    }
  }
  
  return orphaned;
}

/**
 * Find all orphaned records across all entity types
 */
export async function findAllOrphanedRecords(): Promise<OrphanedRecord[]> {
  const entityTypes = ['interaction', 'task', 'invoice', 'quote', 'inventory'] as EntityType[];
  const allOrphaned: OrphanedRecord[] = [];
  
  for (const entityType of entityTypes) {
    const orphaned = await findOrphanedRecords(entityType);
    allOrphaned.push(...orphaned);
  }
  
  return allOrphaned;
}

/**
 * Get email field from record (handles different field names)
 */
function getEmailField(record: any): string | null {
  return record.email || record.emailAddress || record.emailAddresses?.[0] || null;
}

/**
 * Get phone field from record (handles different field names)
 */
function getPhoneField(record: any): string | null {
  return record.phone || record.phoneNumber || record.mobile || record.telephone || null;
}

/**
 * Get overall data quality score (0-100)
 */
export async function getOverallQualityScore(): Promise<number> {
  const metrics = await calculateAllMetrics();
  const totalRecords = metrics.reduce((sum, m) => sum + m.totalRecords, 0);
  
  if (totalRecords === 0) return 100;
  
  const totalDuplicates = metrics.reduce((sum, m) => sum + m.duplicateCount, 0);
  const totalMissingEmail = metrics.reduce((sum, m) => sum + m.missingEmailCount, 0);
  const totalOrphaned = metrics.reduce((sum, m) => sum + m.orphanedCount, 0);
  
  // Calculate score (penalize duplicates, missing emails, orphaned records)
  const duplicatePenalty = (totalDuplicates / totalRecords) * 30;
  const emailPenalty = (totalMissingEmail / totalRecords) * 20;
  const orphanedPenalty = (totalOrphaned / totalRecords) * 50;
  
  const score = Math.max(0, 100 - duplicatePenalty - emailPenalty - orphanedPenalty);
  return Math.round(score * 100) / 100;
}

/**
 * Get records without activity for X days
 */
export async function getInactiveRecords(
  entityType: EntityType,
  daysThreshold: number = 365
): Promise<any[]> {
  const records = await storageAdapter.getAllRecords(entityType);
  const activeRecords = records.filter(r => !r.isDeleted && !r.is_deleted);
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() - daysThreshold);
  
  return activeRecords.filter(record => {
    const updatedAt = record.updatedAt || record.createdAt;
    if (!updatedAt) return true;
    
    const updatedDate = new Date(updatedAt);
    return updatedDate < thresholdDate;
  });
}

