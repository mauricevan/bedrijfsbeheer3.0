export { csvValidators, csvTransformers } from './csvHelpers';

export interface CSVParseResult<T> {
  data: T[];
  errors: string[];
  warnings: string[];
  totalRows: number;
  successRows: number;
}

export interface CSVColumnMapping {
  csvHeader: string;
  dataKey: string;
  required?: boolean;
  validator?: (value: string) => boolean;
  transformer?: (value: string) => any;
}

export function parseCSV<T>(csvText: string, columnMappings: CSVColumnMapping[]): CSVParseResult<T> {
  const result: CSVParseResult<T> = { data: [], errors: [], warnings: [], totalRows: 0, successRows: 0 };

  try {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length === 0) {
      result.errors.push('CSV bestand is leeg');
      return result;
    }

    const headers = parseCSVLine(lines[0]);
    const missingRequired: string[] = [];
    columnMappings.forEach(mapping => {
      if (mapping.required && !headers.includes(mapping.csvHeader)) {
        missingRequired.push(mapping.csvHeader);
      }
    });

    if (missingRequired.length > 0) {
      result.errors.push(`Verplichte kolommen ontbreken: ${missingRequired.join(', ')}`);
      return result;
    }

    result.totalRows = lines.length - 1;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const values = parseCSVLine(line);

      if (values.every(v => !v.trim())) {
        result.warnings.push(`Rij ${i}: Lege rij overgeslagen`);
        continue;
      }

      if (values.length !== headers.length) {
        result.errors.push(`Rij ${i}: Aantal kolommen (${values.length}) komt niet overeen met header (${headers.length})`);
        continue;
      }

      const item: any = {};
      let rowValid = true;

      columnMappings.forEach(mapping => {
        const headerIndex = headers.indexOf(mapping.csvHeader);

        if (headerIndex === -1) {
          if (mapping.required) {
            result.errors.push(`Rij ${i}: Verplichte kolom '${mapping.csvHeader}' ontbreekt`);
            rowValid = false;
          }
          return;
        }

        const rawValue = values[headerIndex]?.trim() || '';

        if (mapping.required && !rawValue) {
          result.errors.push(`Rij ${i}: Verplichte veld '${mapping.csvHeader}' is leeg`);
          rowValid = false;
          return;
        }

        if (mapping.validator && rawValue && !mapping.validator(rawValue)) {
          result.errors.push(`Rij ${i}: Ongeldige waarde voor '${mapping.csvHeader}': ${rawValue}`);
          rowValid = false;
          return;
        }

        const transformedValue = mapping.transformer ? mapping.transformer(rawValue) : rawValue;
        item[mapping.dataKey] = transformedValue;
      });

      if (rowValid) {
        result.data.push(item as T);
        result.successRows++;
      }
    }
  } catch (error) {
    result.errors.push(`Fout bij parsen van CSV: ${error instanceof Error ? error.message : 'Onbekende fout'}`);
  }

  return result;
}

function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let currentValue = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentValue += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      values.push(currentValue);
      currentValue = '';
    } else {
      currentValue += char;
    }
  }

  values.push(currentValue);
  return values;
}

export function generateCSV<T extends Record<string, any>>(
  data: T[],
  headers: { key: keyof T; label: string }[]
): string {
  const csvLines: string[] = [];
  const headerLine = headers.map(h => escapeCSVValue(h.label)).join(',');
  csvLines.push(headerLine);

  data.forEach(item => {
    const values = headers.map(h => escapeCSVValue(String(item[h.key] ?? '')));
    csvLines.push(values.join(','));
  });

  return csvLines.join('\n');
}

function escapeCSVValue(value: string): string {
  if (value.includes(',') || value.includes('\n') || value.includes('"')) {
    const escapedValue = value.replace(/"/g, '""');
    return `"${escapedValue}"`;
  }
  return value;
}

export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
