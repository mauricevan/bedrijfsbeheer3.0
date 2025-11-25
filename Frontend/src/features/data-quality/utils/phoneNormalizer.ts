/**
 * Normalizes a phone number for comparison
 * Removes spaces, dashes, parentheses, and country codes
 * Handles Dutch phone number formats
 */
export function normalizePhoneNumber(phone: string | undefined | null): string | null {
  if (!phone || typeof phone !== 'string') return null;
  
  // Remove all non-digit characters except +
  let normalized = phone.replace(/[^\d+]/g, '');
  
  // Remove common country codes
  if (normalized.startsWith('+31')) {
    normalized = normalized.substring(3);
  } else if (normalized.startsWith('0031')) {
    normalized = normalized.substring(4);
  } else if (normalized.startsWith('31') && normalized.length > 9) {
    normalized = normalized.substring(2);
  }
  
  // Remove leading 0 if present
  if (normalized.startsWith('0')) {
    normalized = normalized.substring(1);
  }
  
  return normalized || null;
}

/**
 * Compares two phone numbers for similarity
 * Returns a score between 0 and 1
 */
export function comparePhoneNumbers(phone1: string | undefined | null, phone2: string | undefined | null): number {
  const norm1 = normalizePhoneNumber(phone1);
  const norm2 = normalizePhoneNumber(phone2);
  
  if (!norm1 || !norm2) return 0;
  if (norm1 === norm2) return 1;
  
  // Check if numbers are similar (e.g., one digit difference)
  const similarity = calculatePhoneSimilarity(norm1, norm2);
  return similarity;
}

/**
 * Calculate similarity between phone numbers
 */
function calculatePhoneSimilarity(phone1: string, phone2: string): number {
  // Exact match
  if (phone1 === phone2) return 1;
  
  // Check if one is a substring of the other (e.g., mobile vs landline)
  if (phone1.includes(phone2) || phone2.includes(phone1)) {
    return 0.8;
  }
  
  // Calculate Levenshtein distance
  const maxLen = Math.max(phone1.length, phone2.length);
  if (maxLen === 0) return 1;
  
  const distance = levenshteinDistance(phone1, phone2);
  const similarity = 1 - (distance / maxLen);
  
  // Only consider similar if similarity > 0.7
  return similarity > 0.7 ? similarity : 0;
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

