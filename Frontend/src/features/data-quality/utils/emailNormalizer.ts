import normalizeEmail from 'normalize-email';

/**
 * Normalizes an email address for comparison
 * - Converts to lowercase
 * - Removes dots from local part (gmail.com)
 * - Removes + aliases
 */
export function normalizeEmailAddress(email: string | undefined | null): string | null {
  if (!email || typeof email !== 'string') return null;
  
  try {
    // Use normalize-email library for advanced normalization
    const normalized = normalizeEmail(email.toLowerCase().trim());
    return normalized || null;
  } catch (error) {
    // Fallback to simple normalization
    return email.toLowerCase().trim();
  }
}

/**
 * Compares two email addresses for similarity
 * Returns a score between 0 and 1
 */
export function compareEmails(email1: string | undefined | null, email2: string | undefined | null): number {
  const norm1 = normalizeEmailAddress(email1);
  const norm2 = normalizeEmailAddress(email2);
  
  if (!norm1 || !norm2) return 0;
  if (norm1 === norm2) return 1;
  
  // Check if emails are similar (e.g., typos)
  const similarity = calculateStringSimilarity(norm1, norm2);
  return similarity;
}

/**
 * Simple string similarity using Levenshtein distance
 */
function calculateStringSimilarity(str1: string, str2: string): number {
  const maxLen = Math.max(str1.length, str2.length);
  if (maxLen === 0) return 1;
  
  const distance = levenshteinDistance(str1, str2);
  return 1 - (distance / maxLen);
}

/**
 * Calculate Levenshtein distance between two strings
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

