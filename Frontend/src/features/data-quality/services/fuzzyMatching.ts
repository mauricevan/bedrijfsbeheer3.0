import type { EntityType, MatchingConfig, EntityMatchingRules } from '../types/data-quality.types';
import { normalizeEmailAddress, compareEmails } from '../utils/emailNormalizer';
import { normalizePhoneNumber, comparePhoneNumbers } from '../utils/phoneNormalizer';
import {
  calculateStringSimilarity,
  calculateNameSimilarity,
  calculateCompanySimilarity,
  calculateNumberSimilarity,
  calculateCompositeSimilarity,
} from '../utils/similarityCalculators';
import { storageAdapter } from '../storage/storageAdapter';

// Default matching configuration
export const DEFAULT_MATCHING_CONFIG: MatchingConfig = {
  email: { threshold: 0.95, weight: 0.4 },
  name: { threshold: 0.85, weight: 0.3 },
  phone: { threshold: 0.90, weight: 0.2 },
  composite: { threshold: 0.80, weight: 0.1 },
};

// Entity-specific matching rules
export const ENTITY_MATCHING_RULES: Record<EntityType, EntityMatchingRules> = {
  customer: {
    uniqueFields: ['email', 'vatNumber', 'kvk'],
    matchingFields: ['email', 'name', 'phone', 'vatNumber', 'kvk', 'postalCode'],
    compositeKeys: [
      {
        fields: ['name', 'postalCode', 'city'],
        threshold: 0.85,
      },
    ],
  },
  supplier: {
    uniqueFields: ['email', 'vatNumber'],
    matchingFields: ['email', 'name', 'phone', 'vatNumber'],
    compositeKeys: [
      {
        fields: ['name', 'email'],
        threshold: 0.90,
      },
    ],
  },
  inventory: {
    uniqueFields: ['sku'],
    matchingFields: ['sku', 'name', 'supplierSku', 'customSku'],
    compositeKeys: [
      {
        fields: ['name', 'supplierId'],
        threshold: 0.85,
      },
    ],
  },
  contact: {
    uniqueFields: ['email'],
    matchingFields: ['email', 'name', 'phone'],
    compositeKeys: [
      {
        fields: ['firstName', 'lastName', 'dateOfBirth', 'postalCode'],
        threshold: 0.80,
      },
    ],
  },
  employee: {
    uniqueFields: ['email'],
    matchingFields: ['email', 'name', 'phone'],
    compositeKeys: [],
  },
};

export interface MatchResult {
  recordId: string;
  score: number;
  matchedFields: string[];
  reasons: string[];
}

/**
 * Find potential duplicate records for a given record
 */
export async function findPotentialDuplicates(
  entityType: EntityType,
  record: any,
  threshold: number = 0.85
): Promise<MatchResult[]> {
  const allRecords = await storageAdapter.getAllRecords(entityType);
  const rules = ENTITY_MATCHING_RULES[entityType];
  const matches: MatchResult[] = [];
  
  // Filter out the current record and soft-deleted records
  const otherRecords = allRecords.filter(
    r => r.id !== record.id && !r.isDeleted && !r.is_deleted
  );
  
  for (const otherRecord of otherRecords) {
    const matchResult = compareRecords(entityType, record, otherRecord, rules);
    
    if (matchResult.score >= threshold) {
      matches.push(matchResult);
    }
  }
  
  // Sort by score descending
  return matches.sort((a, b) => b.score - a.score);
}

/**
 * Compare two records and calculate similarity score
 */
function compareRecords(
  entityType: EntityType,
  record1: any,
  record2: any,
  rules: EntityMatchingRules
): MatchResult {
  const matchedFields: string[] = [];
  const reasons: string[] = [];
  const comparisons: Array<{ score: number; weight: number }> = [];
  
  // Check unique fields first (exact matches)
  for (const field of rules.uniqueFields) {
    const val1 = record1[field];
    const val2 = record2[field];
    
    if (val1 && val2) {
      if (field === 'email') {
        const score = compareEmails(val1, val2);
        if (score > 0.9) {
          matchedFields.push(field);
          reasons.push(`Email match: ${score.toFixed(2)}`);
          comparisons.push({ score, weight: DEFAULT_MATCHING_CONFIG.email.weight });
        }
      } else if (field === 'vatNumber' || field === 'kvk' || field === 'sku') {
        const score = calculateNumberSimilarity(val1, val2);
        if (score > 0.9) {
          matchedFields.push(field);
          reasons.push(`${field} match: ${score.toFixed(2)}`);
          comparisons.push({ score, weight: 0.5 });
        }
      }
    }
  }
  
  // Check matching fields
  for (const field of rules.matchingFields) {
    const val1 = record1[field];
    const val2 = record2[field];
    
    if (!val1 || !val2) continue;
    
    let score = 0;
    
    if (field === 'email') {
      score = compareEmails(val1, val2);
      if (score > DEFAULT_MATCHING_CONFIG.email.threshold) {
        matchedFields.push(field);
        comparisons.push({ score, weight: DEFAULT_MATCHING_CONFIG.email.weight });
      }
    } else if (field === 'phone') {
      score = comparePhoneNumbers(val1, val2);
      if (score > DEFAULT_MATCHING_CONFIG.phone.threshold) {
        matchedFields.push(field);
        comparisons.push({ score, weight: DEFAULT_MATCHING_CONFIG.phone.weight });
      }
    } else if (field === 'name') {
      score = calculateNameSimilarity(val1, val2);
      if (score > DEFAULT_MATCHING_CONFIG.name.threshold) {
        matchedFields.push(field);
        comparisons.push({ score, weight: DEFAULT_MATCHING_CONFIG.name.weight });
      }
    } else if (field === 'vatNumber' || field === 'kvk') {
      score = calculateNumberSimilarity(val1, val2);
      if (score > 0.85) {
        matchedFields.push(field);
        comparisons.push({ score, weight: 0.2 });
      }
    } else {
      // Generic string similarity
      score = calculateStringSimilarity(val1, val2);
      if (score > 0.85) {
        matchedFields.push(field);
        comparisons.push({ score, weight: 0.1 });
      }
    }
    
    if (score > 0.7) {
      reasons.push(`${field}: ${score.toFixed(2)}`);
    }
  }
  
  // Check composite keys
  for (const compositeKey of rules.compositeKeys || []) {
    const values1 = compositeKey.fields.map(f => record1[f]).filter(v => v);
    const values2 = compositeKey.fields.map(f => record2[f]).filter(v => v);
    
    if (values1.length === compositeKey.fields.length && values2.length === compositeKey.fields.length) {
      const compositeScore = calculateCompositeKeySimilarity(
        compositeKey.fields,
        record1,
        record2
      );
      
      if (compositeScore >= compositeKey.threshold) {
        matchedFields.push(`composite:${compositeKey.fields.join('+')}`);
        reasons.push(`Composite key match (${compositeKey.fields.join('+')}): ${compositeScore.toFixed(2)}`);
        comparisons.push({ score: compositeScore, weight: DEFAULT_MATCHING_CONFIG.composite.weight });
      }
    }
  }
  
  // Calculate overall score
  const overallScore = calculateCompositeSimilarity(comparisons);
  
  return {
    recordId: record2.id,
    score: overallScore,
    matchedFields,
    reasons,
  };
}

/**
 * Calculate similarity for composite key
 */
function calculateCompositeKeySimilarity(
  fields: string[],
  record1: any,
  record2: any
): number {
  const scores: number[] = [];
  
  for (const field of fields) {
    const val1 = record1[field];
    const val2 = record2[field];
    
    if (!val1 || !val2) {
      return 0;
    }
    
    let score = 0;
    
    if (field === 'email') {
      score = compareEmails(val1, val2);
    } else if (field === 'phone') {
      score = comparePhoneNumbers(val1, val2);
    } else if (field === 'name' || field.includes('Name')) {
      score = calculateNameSimilarity(val1, val2);
    } else if (field.includes('Date') || field === 'dateOfBirth') {
      // Date comparison - exact match only
      score = val1 === val2 ? 1 : 0;
    } else {
      score = calculateStringSimilarity(val1, val2);
    }
    
    scores.push(score);
  }
  
  // Average of all field scores
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

/**
 * Check if a record violates unique constraints
 */
export async function checkUniqueConstraints(
  entityType: EntityType,
  record: any,
  excludeId?: string
): Promise<{ violated: boolean; conflicts: Array<{ field: string; value: any; existingRecordId: string }> }> {
  const rules = ENTITY_MATCHING_RULES[entityType];
  const allRecords = await storageAdapter.getAllRecords(entityType);
  const conflicts: Array<{ field: string; value: any; existingRecordId: string }> = [];
  
  for (const field of rules.uniqueFields) {
    const value = record[field];
    if (!value) continue;
    
    const existing = allRecords.find(r => {
      if (r.id === excludeId || r.isDeleted || r.is_deleted) return false;
      
      if (field === 'email') {
        const norm1 = normalizeEmailAddress(r[field]);
        const norm2 = normalizeEmailAddress(value);
        return norm1 && norm2 && norm1 === norm2;
      }
      
      return r[field] === value;
    });
    
    if (existing) {
      conflicts.push({
        field,
        value,
        existingRecordId: existing.id,
      });
    }
  }
  
  return {
    violated: conflicts.length > 0,
    conflicts,
  };
}

