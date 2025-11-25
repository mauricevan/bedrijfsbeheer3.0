import type { EntityType, DuplicateGroup, DuplicateStatus, ScanProgress } from '../types/data-quality.types';
import { findPotentialDuplicates } from './fuzzyMatching';
import { storageAdapter } from '../storage/storageAdapter';
import { storage } from '@/utils/storage';

const DUPLICATE_GROUPS_KEY = 'bedrijfsbeheer_duplicate_groups';
const DEFAULT_THRESHOLD = 0.85;

/**
 * Scan all records for duplicates
 */
export async function scanForDuplicates(
  entityType: EntityType,
  threshold: number = DEFAULT_THRESHOLD,
  onProgress?: (progress: ScanProgress) => void
): Promise<DuplicateGroup[]> {
  const allRecords = await storageAdapter.getAllRecords(entityType);
  const activeRecords = allRecords.filter(r => !r.isDeleted && !r.is_deleted);
  
  const duplicateGroups: DuplicateGroup[] = [];
  const processedIds = new Set<string>();
  const groupsMap = new Map<string, DuplicateGroup>();
  
  let processedCount = 0;
  
  for (const record of activeRecords) {
    if (processedIds.has(record.id)) continue;
    
    // Report progress
    if (onProgress) {
      onProgress({
        entityType,
        totalRecords: activeRecords.length,
        processedRecords: processedCount,
        foundDuplicates: duplicateGroups.length,
        isComplete: false,
      });
    }
    
    const matches = await findPotentialDuplicates(entityType, record, threshold);
    
    if (matches.length > 0) {
      // Check if this record is already part of a group
      let groupId: string | null = null;
      
      for (const [id, group] of groupsMap.entries()) {
        if (group.recordIds.includes(record.id)) {
          groupId = id;
          break;
        }
      }
      
      if (!groupId) {
        // Create new group
        groupId = `dup-${entityType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const matchReasons = matches.map(m => m.reasons.join(', ')).join('; ');
        const overallScore = matches.reduce((sum, m) => sum + m.score, 0) / matches.length;
        
        const group: DuplicateGroup = {
          id: groupId,
          entityType,
          recordIds: [record.id, ...matches.map(m => m.recordId)],
          matches: [
            {
              recordId: record.id,
              score: 1,
              matchedFields: [],
              reasons: ['Master record'],
            },
            ...matches,
          ],
          overallScore,
          matchReason: matchReasons,
          suggestedMasterId: record.id, // Use oldest or most complete record
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastScanAt: new Date().toISOString(),
        };
        
        groupsMap.set(groupId, group);
        duplicateGroups.push(group);
        
        // Mark all matched records as processed
        processedIds.add(record.id);
        matches.forEach(m => processedIds.add(m.recordId));
      } else {
        // Add to existing group
        const group = groupsMap.get(groupId)!;
        const newMatches = matches.filter(m => !group.recordIds.includes(m.recordId));
        
        if (newMatches.length > 0) {
          group.recordIds.push(...newMatches.map(m => m.recordId));
          group.matches.push(...newMatches);
          group.overallScore = (group.overallScore + newMatches.reduce((sum, m) => sum + m.score, 0) / newMatches.length) / 2;
          group.updatedAt = new Date().toISOString();
          group.lastScanAt = new Date().toISOString();
        }
      }
    }
    
    processedIds.add(record.id);
    processedCount++;
  }
  
  // Save duplicate groups
  await saveDuplicateGroups(duplicateGroups);
  
  if (onProgress) {
    onProgress({
      entityType,
      totalRecords: activeRecords.length,
      processedRecords: processedCount,
      foundDuplicates: duplicateGroups.length,
      isComplete: true,
    });
  }
  
  return duplicateGroups;
}

/**
 * Scan all entity types for duplicates
 */
export async function scanAllEntities(
  entityTypes: EntityType[] = ['customer', 'supplier', 'inventory', 'contact', 'employee'],
  threshold: number = DEFAULT_THRESHOLD,
  onProgress?: (progress: ScanProgress) => void
): Promise<DuplicateGroup[]> {
  const allGroups: DuplicateGroup[] = [];
  
  for (const entityType of entityTypes) {
    const groups = await scanForDuplicates(entityType, threshold, onProgress);
    allGroups.push(...groups);
  }
  
  return allGroups;
}

/**
 * Get all duplicate groups
 */
export function getDuplicateGroups(status?: DuplicateStatus): DuplicateGroup[] {
  const allGroups = storage.get<DuplicateGroup[]>(DUPLICATE_GROUPS_KEY, []);
  
  if (status) {
    return allGroups.filter(g => g.status === status);
  }
  
  return allGroups;
}

/**
 * Get duplicate groups for a specific entity type
 */
export function getDuplicateGroupsByEntity(
  entityType: EntityType,
  status?: DuplicateStatus
): DuplicateGroup[] {
  const groups = getDuplicateGroups(status);
  return groups.filter(g => g.entityType === entityType);
}

/**
 * Get a specific duplicate group
 */
export function getDuplicateGroup(groupId: string): DuplicateGroup | null {
  const groups = getDuplicateGroups();
  return groups.find(g => g.id === groupId) || null;
}

/**
 * Save duplicate groups
 */
async function saveDuplicateGroups(groups: DuplicateGroup[]): Promise<void> {
  const existingGroups = getDuplicateGroups();
  const existingIds = new Set(existingGroups.map(g => g.id));
  
  // Merge with existing groups (update if exists, add if new)
  const merged = [...existingGroups];
  
  for (const group of groups) {
    const index = merged.findIndex(g => g.id === group.id);
    if (index >= 0) {
      merged[index] = group;
    } else {
      merged.push(group);
    }
  }
  
  storage.set(DUPLICATE_GROUPS_KEY, merged);
}

/**
 * Update duplicate group status
 */
export function updateDuplicateGroupStatus(
  groupId: string,
  status: DuplicateStatus
): DuplicateGroup | null {
  const groups = getDuplicateGroups();
  const group = groups.find(g => g.id === groupId);
  
  if (!group) return null;
  
  group.status = status;
  group.updatedAt = new Date().toISOString();
  
  storage.set(DUPLICATE_GROUPS_KEY, groups);
  return group;
}

/**
 * Mark duplicate group as not duplicate
 */
export function markAsNotDuplicate(groupId: string): DuplicateGroup | null {
  return updateDuplicateGroupStatus(groupId, 'not_duplicate');
}

/**
 * Ignore duplicate group
 */
export function ignoreDuplicateGroup(groupId: string): DuplicateGroup | null {
  return updateDuplicateGroupStatus(groupId, 'ignored');
}

/**
 * Remove duplicate group (after merge)
 */
export function removeDuplicateGroup(groupId: string): void {
  const groups = getDuplicateGroups();
  const filtered = groups.filter(g => g.id !== groupId);
  storage.set(DUPLICATE_GROUPS_KEY, filtered);
}

/**
 * Auto-merge exact matches (100% score)
 */
export async function autoMergeExactMatches(
  entityType: EntityType,
  threshold: number = 0.99
): Promise<DuplicateGroup[]> {
  const groups = getDuplicateGroupsByEntity(entityType, 'pending');
  const exactMatches = groups.filter(g => g.overallScore >= threshold);
  
  // Return groups that can be auto-merged
  // Actual merging will be done by merge service
  return exactMatches;
}

