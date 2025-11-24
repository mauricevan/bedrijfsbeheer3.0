/**
 * Activity Types - All possible activity types in the system
 */
export type ActivityType =
  | 'factuur_created'
  | 'factuur_updated'
  | 'factuur_sent'
  | 'factuur_paid'
  | 'factuur_cancelled'
  | 'factuur_deleted'
  | 'werkorder_created'
  | 'werkorder_updated'
  | 'werkorder_assigned'
  | 'werkorder_status_changed'
  | 'werkorder_completed'
  | 'werkorder_deleted'
  | 'offerte_created'
  | 'offerte_updated'
  | 'offerte_sent'
  | 'offerte_accepted'
  | 'offerte_rejected'
  | 'offerte_converted_to_invoice'
  | 'offerte_converted_to_werkorder'
  | 'offerte_deleted'
  | 'customer_created'
  | 'customer_updated'
  | 'customer_deleted'
  | 'inventory_created'
  | 'inventory_updated'
  | 'inventory_stock_adjusted'
  | 'inventory_deleted'
  | 'employee_created'
  | 'employee_updated'
  | 'employee_deleted'
  | 'settings_changed'
  | 'module_toggled'
  | 'user_logged_in'
  | 'user_logged_out'
  | 'data_exported'
  | 'report_generated';

/**
 * Entity Types
 */
export type EntityType =
  | 'factuur'
  | 'werkorder'
  | 'offerte'
  | 'customer'
  | 'inventory'
  | 'employee'
  | 'settings'
  | 'system';

/**
 * Activity Log Entry
 */
export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  activityType: ActivityType;
  entityType: EntityType;
  entityId: string;
  entityName?: string; // Display name for the entity
  action: string; // e.g., "created", "updated", "deleted"
  description: string; // Human-readable description
  changes?: {
    field: string;
    oldValue: unknown;
    newValue: unknown;
  }[];
  metadata?: Record<string, unknown>; // Additional context
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  sessionId?: string;
}

/**
 * Journey Stage Types
 */
export type JourneyStage =
  | 'created'
  | 'draft'
  | 'sent'
  | 'in_progress'
  | 'completed'
  | 'converted'
  | 'paid'
  | 'cancelled'
  | 'archived';

/**
 * Document Journey Entry
 */
export interface DocumentJourneyEntry {
  id: string;
  timestamp: string;
  stage: JourneyStage;
  performedBy: string; // User ID
  performedByName: string; // User name
  action: string; // e.g., "Created", "Sent to customer", "Converted to invoice"
  description: string;
  metadata?: Record<string, unknown>;
}

/**
 * Archived Document
 */
export interface ArchivedDocument {
  id: string; // Original document ID
  documentType: 'factuur' | 'werkorder' | 'offerte';
  generalNumber: string; // e.g., "2024-0001"
  documentNumber: string; // e.g., "F-2024-0001"
  
  // Full document data (snapshot at time of deletion)
  documentData: Record<string, unknown>;
  
  // Archive metadata
  archivedAt: string;
  archivedBy: string; // User ID
  archivedByName: string; // User name
  archiveReason?: string; // Why it was archived/deleted
  
  // Original creation metadata
  createdAt: string;
  createdBy: string;
  createdByName: string;
  
  // Journey tracking
  journey: DocumentJourneyEntry[];
  
  // Activity log (all activities related to this document)
  activities: ActivityLog[];
}

/**
 * Activity Filter Options
 */
export interface ActivityFilter {
  userId?: string;
  entityType?: EntityType;
  activityType?: ActivityType;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

/**
 * Archive Filter Options
 */
export interface ArchiveFilter {
  documentType?: 'factuur' | 'werkorder' | 'offerte';
  customerId?: string;
  customerName?: string;
  generalNumber?: string;
  documentNumber?: string;
  createdBy?: string;
  archivedBy?: string;
  dateFrom?: string;
  dateTo?: string;
  archivedDateFrom?: string;
  archivedDateTo?: string;
  status?: string;
  amountMin?: number;
  amountMax?: number;
  search?: string;
}

