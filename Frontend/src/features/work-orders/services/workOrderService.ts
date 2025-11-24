import type { WorkOrder, WorkOrderHistoryEntry, WorkOrderHistoryActionType, WorkOrderStatus } from '../types';
import { storage, STORAGE_KEYS } from '@/utils/storage';
import { getNextGeneralNumber, getNextWerkorderNumber } from '@/utils/numberGenerator';
import { logActivityHelper } from '@/utils/activityLogger';
import { createJourneyEntry, addJourneyEntry } from '@/features/tracking/services/journeyService';
import { archiveDocument } from '@/features/tracking/services/archiveService';
import { getEntityActivities } from '@/features/tracking/services/activityService';

const DEFAULT_WORK_ORDERS: WorkOrder[] = [
  {
    id: '1',
    title: 'Install Office Network',
    description: 'Set up network infrastructure for new office',
    status: 'in_progress',
    assignedTo: 'emp1',
    assignedToName: 'John Doe',
    customerId: 'cust1',
    customerName: 'Acme Corp',
    location: 'Amsterdam Office',
    scheduledDate: new Date(Date.now() + 86400000).toISOString(),
    materials: [],
    estimatedHours: 8,
    hoursSpent: 4,
    estimatedCost: 1200,
    sortIndex: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    history: [],
  },
  {
    id: '2',
    title: 'Repair Laptop',
    description: 'Fix broken screen and keyboard',
    status: 'todo',
    materials: [],
    estimatedHours: 2,
    hoursSpent: 0,
    estimatedCost: 350,
    sortIndex: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    history: [],
  },
  {
    id: '3',
    title: 'Server Maintenance',
    description: 'Monthly server check and updates',
    status: 'completed',
    assignedTo: 'emp2',
    assignedToName: 'Jane Smith',
    completedDate: new Date().toISOString(),
    materials: [],
    estimatedHours: 4,
    hoursSpent: 3.5,
    estimatedCost: 500,
    sortIndex: 0,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date().toISOString(),
    history: [],
  },
];

let MOCK_WORK_ORDERS = storage.get<WorkOrder[]>(STORAGE_KEYS.WORK_ORDERS, DEFAULT_WORK_ORDERS);

const saveWorkOrders = () => {
  storage.set(STORAGE_KEYS.WORK_ORDERS, MOCK_WORK_ORDERS);
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to get user info from localStorage
const getUserInfo = () => {
  try {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
      };
    }
  } catch (error) {
    console.error('Error getting user info:', error);
  }
  return {
    userId: 'unknown',
    userName: 'Unknown User',
    userEmail: 'unknown@example.com',
  };
};

// Helper function to create history entry
const createHistoryEntry = (
  actionType: WorkOrderHistoryActionType,
  performedBy: string,
  performedByName?: string,
  details?: string,
  metadata?: {
    fromStatus?: WorkOrderStatus;
    toStatus?: WorkOrderStatus;
    fromAssignedTo?: string;
    toAssignedTo?: string;
    [key: string]: unknown;
  }
): WorkOrderHistoryEntry => {
  return {
    id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    actionType,
    performedBy,
    performedByName,
    timestamp: new Date().toISOString(),
    details,
    fromStatus: metadata?.fromStatus,
    toStatus: metadata?.toStatus,
    fromAssignedTo: metadata?.fromAssignedTo,
    toAssignedTo: metadata?.toAssignedTo,
    metadata: metadata ? { ...metadata } : undefined,
  };
};

// Helper function to add history entry to work order
const addHistoryEntry = (workOrder: WorkOrder, entry: WorkOrderHistoryEntry): WorkOrder => {
  return {
    ...workOrder,
    history: [...(workOrder.history || []), entry],
  };
};

export const workOrderService = {
  getAll: async (): Promise<WorkOrder[]> => {
    await delay(500);
    return [...MOCK_WORK_ORDERS];
  },

  create: async (
    data: Omit<WorkOrder, 'id' | 'generalNumber' | 'workOrderNumber' | 'createdAt' | 'updatedAt' | 'history' | 'journey' | 'createdBy' | 'createdByName'>,
    performedBy: string,
    performedByName?: string,
    sourceType?: 'quote' | 'invoice' | 'manual'
  ): Promise<WorkOrder> => {
    await delay(800);
    const userInfo = getUserInfo();
    const generalNumber = getNextGeneralNumber();
    const workOrderNumber = getNextWerkorderNumber();
    const now = new Date().toISOString();
    const newOrder: WorkOrder = {
      ...data,
      id: `wo-${Date.now()}`,
      generalNumber,
      workOrderNumber,
      createdAt: now,
      updatedAt: now,
      createdBy: userInfo.userId,
      createdByName: userInfo.userName,
      history: [],
      journey: [],
    };

    // Add creation history entry
    let actionType: WorkOrderHistoryActionType = 'created';
    let details = 'Werkorder aangemaakt';
    let journeyStage: 'created' | 'converted' = 'created';
    
    if (sourceType === 'quote') {
      actionType = 'converted';
      journeyStage = 'converted';
      details = `Werkorder aangemaakt vanuit offerte ${data.quoteId || ''}`;
    } else if (sourceType === 'invoice') {
      actionType = 'converted';
      journeyStage = 'converted';
      details = `Werkorder aangemaakt vanuit factuur ${data.invoiceId || ''}`;
    }

    const historyEntry = createHistoryEntry(actionType, performedBy, performedByName || userInfo.userName, details, {
      quoteId: data.quoteId,
      invoiceId: data.invoiceId,
    });

    // Add journey entry
    const journeyEntry = createJourneyEntry(
      journeyStage,
      userInfo.userId,
      userInfo.userName,
      journeyStage === 'converted' ? 'Converted' : 'Created',
      `Werkorder ${workOrderNumber} aangemaakt`,
      { generalNumber, workOrderNumber, sourceType }
    );
    newOrder.journey = [journeyEntry];

    // Add assignment history if assigned
    if (data.assignedTo) {
      const assignmentEntry = createHistoryEntry(
        'assigned',
        performedBy,
        performedByName || userInfo.userName,
        `Toegewezen aan ${data.assignedToName || data.assignedTo}`,
        { toAssignedTo: data.assignedTo }
      );
      newOrder.history = [historyEntry, assignmentEntry];
      
      // Add assignment to journey
      const assignmentJourneyEntry = createJourneyEntry(
        'in_progress',
        userInfo.userId,
        userInfo.userName,
        'Assigned',
        `Toegewezen aan ${data.assignedToName || data.assignedTo}`,
        { assignedTo: data.assignedTo }
      );
      newOrder.journey = addJourneyEntry(newOrder.journey, assignmentJourneyEntry);
    } else {
      newOrder.history = [historyEntry];
    }

    MOCK_WORK_ORDERS.push(newOrder);
    saveWorkOrders();
    
    // Log activity
    logActivityHelper(
      'werkorder_created',
      'werkorder',
      newOrder.id,
      'created',
      `Werkorder ${workOrderNumber} aangemaakt${data.customerName ? ` voor ${data.customerName}` : ''}`,
      userInfo.userId,
      userInfo.userName,
      userInfo.userEmail,
      `Werkorder ${workOrderNumber}`,
      undefined,
      { generalNumber, workOrderNumber, customerId: data.customerId, sourceType }
    );
    
    return newOrder;
  },

  update: async (
    id: string,
    updates: Partial<WorkOrder>,
    performedBy: string,
    performedByName?: string
  ): Promise<WorkOrder> => {
    await delay(500);
    const index = MOCK_WORK_ORDERS.findIndex(wo => wo.id === id);
    if (index === -1) throw new Error('Work order not found');

    const userInfo = getUserInfo();
    const existing = MOCK_WORK_ORDERS[index];
    const historyEntries: WorkOrderHistoryEntry[] = [];
    let journey = existing.journey || []; // Initialize journey if not exists

    // Track status changes
    if (updates.status && updates.status !== existing.status) {
      const statusEntry = createHistoryEntry(
        'status_changed',
        performedBy,
        performedByName || userInfo.userName,
        `Status gewijzigd van "${existing.status}" naar "${updates.status}"`,
        {
          fromStatus: existing.status,
          toStatus: updates.status,
        }
      );
      historyEntries.push(statusEntry);
      
      // Add journey entry for status changes
      let journeyStage: 'in_progress' | 'completed' = 'in_progress';
      if (updates.status === 'completed') {
        journeyStage = 'completed';
      }
      const journeyEntry = createJourneyEntry(
        journeyStage,
        userInfo.userId,
        userInfo.userName,
        'Status Changed',
        `Status gewijzigd naar "${updates.status}"`,
        { fromStatus: existing.status, toStatus: updates.status }
      );
      journey = addJourneyEntry(journey, journeyEntry);
      
      // Log activity
      logActivityHelper(
        'werkorder_status_changed',
        'werkorder',
        id,
        'status_changed',
        `Werkorder ${existing.workOrderNumber || existing.id} status gewijzigd naar ${updates.status}`,
        userInfo.userId,
        userInfo.userName,
        userInfo.userEmail,
        `Werkorder ${existing.workOrderNumber || existing.id}`,
        [{ field: 'status', oldValue: existing.status, newValue: updates.status }]
      );
    }

    // Track assignment changes
    if (updates.assignedTo !== undefined && updates.assignedTo !== existing.assignedTo) {
      const assignmentType = existing.assignedTo ? 'reassigned' : 'assigned';
      const details = existing.assignedTo
        ? `Herverdeeld van ${existing.assignedToName || existing.assignedTo} naar ${updates.assignedToName || updates.assignedTo}`
        : `Toegewezen aan ${updates.assignedToName || updates.assignedTo}`;
      
      const assignmentEntry = createHistoryEntry(
        assignmentType,
        performedBy,
        performedByName || userInfo.userName,
        details,
        {
          fromAssignedTo: existing.assignedTo,
          toAssignedTo: updates.assignedTo,
        }
      );
      historyEntries.push(assignmentEntry);
      
      // Add journey entry for assignment
      const journeyEntry = createJourneyEntry(
        'in_progress',
        userInfo.userId,
        userInfo.userName,
        assignmentType === 'reassigned' ? 'Reassigned' : 'Assigned',
        details,
        { fromAssignedTo: existing.assignedTo, toAssignedTo: updates.assignedTo }
      );
      journey = addJourneyEntry(journey, journeyEntry);
      
      // Log activity
      logActivityHelper(
        'werkorder_assigned',
        'werkorder',
        id,
        assignmentType,
        `Werkorder ${existing.workOrderNumber || existing.id} ${assignmentType === 'reassigned' ? 'herverdeeld' : 'toegewezen'}`,
        userInfo.userId,
        userInfo.userName,
        userInfo.userEmail,
        `Werkorder ${existing.workOrderNumber || existing.id}`,
        [{ field: 'assignedTo', oldValue: existing.assignedTo, newValue: updates.assignedTo }]
      );
    }

    // Track material changes
    if (updates.materials && JSON.stringify(updates.materials) !== JSON.stringify(existing.materials)) {
      const materialEntry = createHistoryEntry(
        'material_updated',
        performedBy,
        performedByName,
        `Materialen bijgewerkt (${updates.materials.length} items)`,
        { materialCount: updates.materials.length }
      );
      historyEntries.push(materialEntry);
    }

    // Track hours changes
    if (updates.hoursSpent !== undefined && updates.hoursSpent !== existing.hoursSpent) {
      const hoursEntry = createHistoryEntry(
        'hours_updated',
        performedBy,
        performedByName,
        `Gewerkte uren bijgewerkt van ${existing.hoursSpent} naar ${updates.hoursSpent} uur`,
        {
          fromHours: existing.hoursSpent,
          toHours: updates.hoursSpent,
        }
      );
      historyEntries.push(hoursEntry);
    }

    // Track completion
    if (updates.status === 'completed' && existing.status !== 'completed') {
      const completionEntry = createHistoryEntry(
        'completed',
        performedBy,
        performedByName || userInfo.userName,
        'Werkorder voltooid',
        {
          fromStatus: existing.status,
          toStatus: 'completed',
          completedDate: updates.completedDate || new Date().toISOString(),
        }
      );
      historyEntries.push(completionEntry);
      
      // Add journey entry for completion
      const journeyEntry = createJourneyEntry(
        'completed',
        userInfo.userId,
        userInfo.userName,
        'Completed',
        'Werkorder voltooid',
        { completedDate: updates.completedDate || new Date().toISOString() }
      );
      journey = addJourneyEntry(journey, journeyEntry);
      
      // Log activity
      logActivityHelper(
        'werkorder_completed',
        'werkorder',
        id,
        'completed',
        `Werkorder ${existing.workOrderNumber || existing.id} voltooid`,
        userInfo.userId,
        userInfo.userName,
        userInfo.userEmail,
        `Werkorder ${existing.workOrderNumber || existing.id}`
      );
    }

    // If no specific tracking, add general update entry
    if (historyEntries.length === 0) {
      const updateEntry = createHistoryEntry(
        'updated',
        performedBy,
        performedByName || userInfo.userName,
        'Werkorder bijgewerkt'
      );
      historyEntries.push(updateEntry);
      
      // Log activity for general update
      logActivityHelper(
        'werkorder_updated',
        'werkorder',
        id,
        'updated',
        `Werkorder ${existing.workOrderNumber || existing.id} bijgewerkt`,
        userInfo.userId,
        userInfo.userName,
        userInfo.userEmail,
        `Werkorder ${existing.workOrderNumber || existing.id}`
      );
    }

    const updated: WorkOrder = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
      history: [...(existing.history || []), ...historyEntries],
      journey,
    };
    
    MOCK_WORK_ORDERS[index] = updated;
    saveWorkOrders();
    return updated;
  },

  delete: async (id: string, performedBy: string, performedByName?: string): Promise<void> => {
    await delay(500);
    const index = MOCK_WORK_ORDERS.findIndex(wo => wo.id === id);
    if (index === -1) return;
    
    const workOrder = MOCK_WORK_ORDERS[index];
    const userInfo = getUserInfo();
    const activities = getEntityActivities('werkorder', id);
    
    // Archive before deleting
    archiveDocument(
      'werkorder',
      workOrder as any,
      workOrder.generalNumber || '',
      workOrder.workOrderNumber || '',
      workOrder.journey || [],
      activities,
      userInfo.userId,
      userInfo.userName,
      'Deleted by user'
    );
    
    // Log activity
    logActivityHelper(
      'werkorder_deleted',
      'werkorder',
      id,
      'deleted',
      `Werkorder ${workOrder.workOrderNumber || workOrder.id} verwijderd`,
      userInfo.userId,
      userInfo.userName,
      userInfo.userEmail,
      `Werkorder ${workOrder.workOrderNumber || workOrder.id}`
    );
    
    MOCK_WORK_ORDERS.splice(index, 1);
    saveWorkOrders();
  },
};
