export type WorkOrderStatus = 'todo' | 'pending' | 'in_progress' | 'completed';

export interface WorkOrderMaterial {
  inventoryItemId: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface WorkOrder {
  id: string;
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
}

export type WorkOrderFilter = {
  status?: WorkOrderStatus;
  assignedTo?: string;
  customerId?: string;
  search?: string;
};
