import type { CreateIncidentInput, CreateWarningInput } from '../types/hrm.types';

/**
 * Validate incident form data
 */
export const validateIncident = (data: Partial<CreateIncidentInput>): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.employeeId) {
    errors.employeeId = 'Medewerker is verplicht';
  }

  if (!data.date) {
    errors.date = 'Datum is verplicht';
  }

  if (!data.time) {
    errors.time = 'Tijd is verplicht';
  }

  if (!data.type) {
    errors.type = 'Type incident is verplicht';
  }

  if (!data.severity) {
    errors.severity = 'Ernst is verplicht';
  }

  if (!data.description || data.description.trim().length === 0) {
    errors.description = 'Beschrijving is verplicht';
  } else if (data.description.trim().length < 10) {
    errors.description = 'Beschrijving moet minimaal 10 karakters bevatten';
  }

  if (!data.createdBy) {
    errors.createdBy = 'Toegevoegd door is verplicht';
  }

  if (!data.status) {
    errors.status = 'Status is verplicht';
  }

  return errors;
};

/**
 * Validate warning form data
 */
export const validateWarning = (data: Partial<CreateWarningInput>): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.employeeId) {
    errors.employeeId = 'Medewerker is verplicht';
  }

  if (!data.type) {
    errors.type = 'Type waarschuwing is verplicht';
  }

  if (!data.date) {
    errors.date = 'Datum is verplicht';
  }

  if (data.validUntil && data.date) {
    const validUntilDate = new Date(data.validUntil);
    const dateDate = new Date(data.date);
    
    if (validUntilDate <= dateDate) {
      errors.validUntil = 'Geldig tot moet na de datum van de waarschuwing zijn';
    }
  }

  if (!data.reason || data.reason.trim().length === 0) {
    errors.reason = 'Reden is verplicht';
  } else if (data.reason.trim().length < 10) {
    errors.reason = 'Reden moet minimaal 10 karakters bevatten';
  }

  if (!data.fullText || data.fullText.trim().length === 0) {
    errors.fullText = 'Volledige tekst is verplicht';
  } else if (data.fullText.trim().length < 20) {
    errors.fullText = 'Volledige tekst moet minimaal 20 karakters bevatten';
  }

  if (!data.createdBy) {
    errors.createdBy = 'Toegevoegd door is verplicht';
  }

  return errors;
};

/**
 * Validate file upload
 */
export const validateFileUpload = (file: File): string | null => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (file.size > maxSize) {
    return 'Bestand is te groot. Maximum grootte is 10MB';
  }

  if (!allowedTypes.includes(file.type)) {
    return 'Bestandstype niet toegestaan. Alleen PDF, afbeeldingen en Word documenten zijn toegestaan';
  }

  return null;
};
