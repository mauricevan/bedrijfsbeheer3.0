import { compareTwoStrings } from 'string-similarity';
import { distance } from 'fast-levenshtein';

/**
 * Calculate similarity between two strings using multiple algorithms
 * Returns a score between 0 and 1
 */
export function calculateStringSimilarity(str1: string | undefined | null, str2: string | undefined | null): number {
  if (!str1 || !str2) return 0;
  if (str1 === str2) return 1;
  
  const normalized1 = normalizeString(str1);
  const normalized2 = normalizeString(str2);
  
  if (normalized1 === normalized2) return 1;
  
  // Use Dice coefficient (Sørensen–Dice coefficient) from string-similarity
  const diceScore = compareTwoStrings(normalized1, normalized2);
  
  // Use Levenshtein distance
  const maxLen = Math.max(normalized1.length, normalized2.length);
  const levenshteinDist = distance(normalized1, normalized2);
  const levenshteinScore = maxLen > 0 ? 1 - (levenshteinDist / maxLen) : 1;
  
  // Combine both scores (weighted average)
  return (diceScore * 0.6 + levenshteinScore * 0.4);
}

/**
 * Normalize string for comparison
 * - Convert to lowercase
 * - Remove accents/diacritics
 * - Remove extra whitespace
 * - Remove special characters (optional)
 */
export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculate similarity for names (handles first/last name variations)
 */
export function calculateNameSimilarity(name1: string | undefined | null, name2: string | undefined | null): number {
  if (!name1 || !name2) return 0;
  if (name1 === name2) return 1;
  
  const norm1 = normalizeString(name1);
  const norm2 = normalizeString(name2);
  
  // Split into words
  const words1 = norm1.split(/\s+/).filter(w => w.length > 0);
  const words2 = norm2.split(/\s+/).filter(w => w.length > 0);
  
  if (words1.length === 0 || words2.length === 0) {
    return calculateStringSimilarity(norm1, norm2);
  }
  
  // Check if all words match (order independent)
  let matches = 0;
  const used = new Set<number>();
  
  for (const word1 of words1) {
    for (let i = 0; i < words2.length; i++) {
      if (!used.has(i)) {
        const similarity = calculateStringSimilarity(word1, words2[i]);
        if (similarity > 0.85) {
          matches++;
          used.add(i);
          break;
        }
      }
    }
  }
  
  const maxWords = Math.max(words1.length, words2.length);
  return matches / maxWords;
}

/**
 * Calculate similarity for company names
 * Handles common variations like "BV", "B.V.", "BV.", etc.
 */
export function calculateCompanySimilarity(company1: string | undefined | null, company2: string | undefined | null): number {
  if (!company1 || !company2) return 0;
  
  // Normalize company suffixes
  const normalizeCompany = (name: string): string => {
    return normalizeString(name)
      .replace(/\b(b\.?v\.?|nv|n\.?v\.?|bv|b\.?v)\b/gi, 'bv')
      .replace(/\b(inc\.?|incorporated|corp\.?|corporation)\b/gi, 'inc')
      .replace(/\b(ltd\.?|limited)\b/gi, 'ltd')
      .replace(/[.,]/g, '')
      .trim();
  };
  
  const norm1 = normalizeCompany(company1);
  const norm2 = normalizeCompany(company2);
  
  return calculateStringSimilarity(norm1, norm2);
}

/**
 * Calculate similarity for numbers (KVK, BTW, etc.)
 * Exact match = 1, one digit difference = 0.9, etc.
 */
export function calculateNumberSimilarity(num1: string | undefined | null, num2: string | undefined | null): number {
  if (!num1 || !num2) return 0;
  
  // Remove all non-digit characters
  const clean1 = num1.replace(/\D/g, '');
  const clean2 = num2.replace(/\D/g, '');
  
  if (clean1 === clean2) return 1;
  
  // Check if one is a substring of the other
  if (clean1.includes(clean2) || clean2.includes(clean1)) {
    return 0.8;
  }
  
  // Calculate similarity based on length and differences
  const maxLen = Math.max(clean1.length, clean2.length);
  const distance = levenshteinDistance(clean1, clean2);
  
  if (maxLen === 0) return 1;
  
  const similarity = 1 - (distance / maxLen);
  
  // Only consider similar if similarity > 0.7
  return similarity > 0.7 ? similarity : 0;
}

/**
 * Calculate Levenshtein distance
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

/**
 * Calculate composite similarity score from multiple field comparisons
 */
export function calculateCompositeSimilarity(
  comparisons: Array<{ score: number; weight: number }>
): number {
  if (comparisons.length === 0) return 0;
  
  let totalWeight = 0;
  let weightedSum = 0;
  
  for (const comp of comparisons) {
    if (comp.score > 0) {
      weightedSum += comp.score * comp.weight;
      totalWeight += comp.weight;
    }
  }
  
  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

