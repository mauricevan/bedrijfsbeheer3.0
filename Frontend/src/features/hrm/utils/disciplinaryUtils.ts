import type { IncidentType, IncidentSeverity, IncidentStatus, WarningType } from '../types/hrm.types';

/**
 * Vertaal incident type naar Nederlandse tekst
 */
export const getIncidentTypeLabel = (type: IncidentType): string => {
  const labels: Record<IncidentType, string> = {
    late_arrival: 'Te laat komen',
    no_show: 'Niet komen opdagen',
    inappropriate_behavior: 'Ongepast gedrag',
    not_following_agreements: 'Niet nakomen afspraken',
    safety_violation: 'Veiligheidsovertreding',
    policy_violation: 'Beleidsovertreding',
    performance_issue: 'Prestatie probleem',
    other: 'Overig',
  };
  return labels[type] || type;
};

/**
 * Vertaal incident ernst naar Nederlandse tekst
 */
export const getIncidentSeverityLabel = (severity: IncidentSeverity): string => {
  const labels: Record<IncidentSeverity, string> = {
    low: 'Laag',
    medium: 'Middel',
    high: 'Hoog',
    critical: 'Zeer ernstig',
  };
  return labels[severity] || severity;
};

/**
 * Vertaal incident status naar Nederlandse tekst
 */
export const getIncidentStatusLabel = (status: IncidentStatus): string => {
  const labels: Record<IncidentStatus, string> = {
    open: 'Open',
    in_progress: 'In behandeling',
    resolved: 'Afgerond',
  };
  return labels[status] || status;
};

/**
 * Vertaal waarschuwing type naar Nederlandse tekst
 */
export const getWarningTypeLabel = (type: WarningType): string => {
  const labels: Record<WarningType, string> = {
    verbal: 'Mondelinge waarschuwing',
    written: 'Schriftelijke waarschuwing',
    final: 'Laatste waarschuwing',
  };
  return labels[type] || type;
};

/**
 * Get severity color classes for UI
 */
export const getSeverityColorClasses = (severity: IncidentSeverity): string => {
  const colors: Record<IncidentSeverity, string> = {
    low: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    high: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    critical: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  };
  return colors[severity] || colors.low;
};

/**
 * Get status color classes for UI
 */
export const getStatusColorClasses = (status: IncidentStatus): string => {
  const colors: Record<IncidentStatus, string> = {
    open: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    resolved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
  };
  return colors[status] || colors.open;
};

/**
 * Get warning type color classes for UI
 */
export const getWarningTypeColorClasses = (type: WarningType): string => {
  const colors: Record<WarningType, string> = {
    verbal: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    written: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    final: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  };
  return colors[type] || colors.verbal;
};

/**
 * Format file size to human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Check if warning is still valid
 */
export const isWarningValid = (validUntil?: string): boolean => {
  if (!validUntil) return true;
  return new Date(validUntil) > new Date();
};

/**
 * Get all incident types for dropdown
 */
export const getIncidentTypeOptions = (): Array<{ value: IncidentType; label: string }> => {
  const types: IncidentType[] = [
    'late_arrival',
    'no_show',
    'inappropriate_behavior',
    'not_following_agreements',
    'safety_violation',
    'policy_violation',
    'performance_issue',
    'other',
  ];
  
  return types.map(type => ({
    value: type,
    label: getIncidentTypeLabel(type),
  }));
};

/**
 * Get all severity options for dropdown
 */
export const getSeverityOptions = (): Array<{ value: IncidentSeverity; label: string }> => {
  const severities: IncidentSeverity[] = ['low', 'medium', 'high', 'critical'];
  
  return severities.map(severity => ({
    value: severity,
    label: getIncidentSeverityLabel(severity),
  }));
};

/**
 * Get all status options for dropdown
 */
export const getStatusOptions = (): Array<{ value: IncidentStatus; label: string }> => {
  const statuses: IncidentStatus[] = ['open', 'in_progress', 'resolved'];
  
  return statuses.map(status => ({
    value: status,
    label: getIncidentStatusLabel(status),
  }));
};

/**
 * Get all warning type options for dropdown
 */
export const getWarningTypeOptions = (): Array<{ value: WarningType; label: string }> => {
  const types: WarningType[] = ['verbal', 'written', 'final'];
  
  return types.map(type => ({
    value: type,
    label: getWarningTypeLabel(type),
  }));
};
