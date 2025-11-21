/**
 * CSV Parser Utilities
 * Parse CSV files with column mapping support
 */

export interface CSVColumnMapping {
  csvColumn: string;
  targetField: string;
  required?: boolean;
  transform?: (value: string) => unknown;
}

export interface CSVParseResult<T> {
  success: boolean;
  data: T[];
  errors: string[];
  warnings: string[];
  totalRows: number;
  validRows: number;
  invalidRows: number;
}

/**
 * Parse CSV content to array of objects
 */
export function parseCSV<T>(
  csvContent: string,
  columnMappings: CSVColumnMapping[]
): CSVParseResult<T> {
  const result: CSVParseResult<T> = {
    success: false,
    data: [],
    errors: [],
    warnings: [],
    totalRows: 0,
    validRows: 0,
    invalidRows: 0,
  };

  try {
    // Split into lines
    const lines = csvContent.split('\n').filter((line) => line.trim());

    if (lines.length === 0) {
      result.errors.push('CSV file is empty');
      return result;
    }

    // Parse header row
    const headerLine = lines[0];
    const headers = parseCSVLine(headerLine);

    // Create mapping from CSV column index to target field
    const columnIndexMap = new Map<number, CSVColumnMapping>();

    columnMappings.forEach((mapping) => {
      const index = headers.findIndex(
        (h) => h.toLowerCase().trim() === mapping.csvColumn.toLowerCase().trim()
      );
      if (index !== -1) {
        columnIndexMap.set(index, mapping);
      } else if (mapping.required) {
        result.errors.push(`Required column "${mapping.csvColumn}" not found in CSV`);
      }
    });

    if (result.errors.length > 0) {
      return result;
    }

    // Parse data rows
    result.totalRows = lines.length - 1; // Exclude header

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;

      try {
        const values = parseCSVLine(line);
        const rowData: Record<string, unknown> = {};

        let isValid = true;
        const rowErrors: string[] = [];

        columnIndexMap.forEach((mapping, index) => {
          const value = values[index]?.trim() || '';

          if (mapping.required && !value) {
            isValid = false;
            rowErrors.push(`Row ${i + 1}: Required field "${mapping.targetField}" is empty`);
            return;
          }

          if (value && mapping.transform) {
            try {
              rowData[mapping.targetField] = mapping.transform(value);
            } catch (error) {
              isValid = false;
              rowErrors.push(
                `Row ${i + 1}: Error transforming "${mapping.targetField}": ${error instanceof Error ? error.message : 'Unknown error'}`
              );
            }
          } else {
            rowData[mapping.targetField] = value;
          }
        });

        if (isValid) {
          result.data.push(rowData as T);
          result.validRows++;
        } else {
          result.invalidRows++;
          result.errors.push(...rowErrors);
        }
      } catch (error) {
        result.invalidRows++;
        result.errors.push(
          `Row ${i + 1}: Parse error - ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }

    result.success = result.validRows > 0;
  } catch (error) {
    result.errors.push(
      `CSV parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }

  return result;
}

/**
 * Parse a single CSV line handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of value
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  // Add last value
  values.push(current);

  return values;
}

/**
 * Common transform functions
 */
export const csvTransforms = {
  toNumber: (value: string): number => {
    const num = parseFloat(value.replace(',', '.'));
    if (isNaN(num)) throw new Error(`Invalid number: ${value}`);
    return num;
  },

  toInteger: (value: string): number => {
    const num = parseInt(value, 10);
    if (isNaN(num)) throw new Error(`Invalid integer: ${value}`);
    return num;
  },

  toBoolean: (value: string): boolean => {
    const lower = value.toLowerCase().trim();
    return lower === 'true' || lower === 'yes' || lower === '1' || lower === 'ja';
  },

  toDate: (value: string): string => {
    // Try to parse common date formats
    const date = new Date(value);
    if (isNaN(date.getTime())) throw new Error(`Invalid date: ${value}`);
    return date.toISOString().split('T')[0];
  },
};

