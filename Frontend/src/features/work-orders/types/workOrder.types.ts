export type WorkOrderStatus = 'todo' | 'pending' | 'in_progress' | 'completed';

export type WorkOrderHistoryActionType = 
  | 'created' 
  | 'converted' 
  | 'assigned' 
  | 'status_changed' 
  | 'updated' 
  | 'completed'
  | 'reassigned'
  | 'material_updated'
  | 'hours_updated'
  | 'deleted'
  | 'archived';

export interface WorkOrderHistoryEntry {
  id: string;
  actionType: WorkOrderHistoryActionType;
  performedBy: string; // Employee ID
  performedByName?: string; // Employee name for display
  timestamp: string;
  details?: string; // Description of change
  fromStatus?: WorkOrderStatus; // For status changes
  toStatus?: WorkOrderStatus; // For status changes
  fromAssignedTo?: string; // For reassignments
  toAssignedTo?: string; // For reassignments
  metadata?: Record<string, unknown>; // Additional data
}

export interface WorkOrderMaterial {
  inventoryItemId: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface WorkOrder {
  id: string;
  generalNumber: string; // e.g., "2024-0001"
  workOrderNumber: string; // e.g., "W-2024-0001"
  title: string;
  description: string;
  status: WorkOrderStatus;
  assignedTo?: string; // Employee ID
  assignedToName?: string;
  customerId?: string;
  customerName?: string;
  location?: string;
  scheduledDate?: string;
  completedDate?: string;
  materials: WorkOrderMaterial[];
  estimatedHours: number;
  hoursSpent: number;
  estimatedCost: number;
  notes?: string;
  pendingReason?: string;
  sortIndex: number;
  createdAt: string;
  updatedAt: string;
  quoteId?: string;
  invoiceId?: string;
  history?: WorkOrderHistoryEntry[]; // Audit trail
  journey?: import('../tracking/types/tracking.types').DocumentJourneyEntry[];
  createdBy?: string;
  createdByName?: string;
  // Archive fields
  isArchived?: boolean;
  archivedAt?: string;
  archivedBy?: string;
  archivedByName?: string;
  archiveReason?: string; // Required comment when archiving without invoice
}

export type WorkOrderFilter = {
  status?: WorkOrderStatus;
  assignedTo?: string;
  customerId?: string;
  search?: string;
};

// Form input types
export type CreateWorkOrderInput = Omit<WorkOrder, 'id' | 'generalNumber' | 'workOrderNumber' | 'createdAt' | 'updatedAt' | 'history' | 'journey'>;
export type UpdateWorkOrderInput = Partial<Omit<WorkOrder, 'id' | 'generalNumber' | 'workOrderNumber' | 'createdAt' | 'updatedAt' | 'history' | 'journey'>>;