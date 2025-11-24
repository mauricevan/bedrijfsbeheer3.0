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

  getById: async (id: string): Promise<WorkOrder | null> => {
    await delay(200);
    const workOrder = MOCK_WORK_ORDERS.find(wo => wo.id === id);
    return workOrder || null;
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

      // POKA-YOKE #8: Automatic Inventory Deduction
      if (existing.materials && existing.materials.length > 0) {
        try {
          const { inventoryService } = await import('@/features/inventory/services/inventoryService');
          const allItems = await inventoryService.getItems();
          
          for (const material of existing.materials) {
            if (material.inventoryItemId) {
              const inventoryItem = allItems.find(item => item.id === material.inventoryItemId);
              if (inventoryItem) {
                const newQuantity = Math.max(0, inventoryItem.quantity - material.quantity);
                await inventoryService.updateItem(material.inventoryItemId, {
                  quantity: newQuantity,
                });
                
                // Log inventory deduction in history
                const inventoryEntry = createHistoryEntry(
                  'material_updated',
                  performedBy,
                  performedByName || userInfo.userName,
                  `Inventaris afgetrokken: ${material.name} (${material.quantity} ${material.unit})`,
                  {
                    inventoryItemId: material.inventoryItemId,
                    quantityDeducted: material.quantity,
                    previousQuantity: inventoryItem.quantity,
                    newQuantity,
                  }
                );
                historyEntries.push(inventoryEntry);
              }
            }
          }
        } catch (error) {
          console.error('Failed to deduct inventory:', error);
          // Log error but don't fail completion
          const errorEntry = createHistoryEntry(
            'updated',
            performedBy,
            performedByName || userInfo.userName,
            `Waarschuwing: Inventaris aftrekken mislukt: ${error instanceof Error ? error.message : 'Onbekende fout'}`,
            { error: true }
          );
          historyEntries.push(errorEntry);
        }
      }

      // POKA-YOKE #2: Automatic Invoice Creation
      // Only create invoice if it doesn't already exist and if auto-create is enabled
      if (!existing.invoiceId && updates.autoCreateInvoice !== false) {
        try {
          const { accountingService } = await import('@/features/accounting/services/accountingService');
          // Create a temporary work order object with completed status for invoice creation
          const completedWorkOrder = {
            ...existing,
            ...updates,
            status: 'completed' as const,
          };
          const invoice = await accountingService.convertWorkOrderToInvoice(id, completedWorkOrder);
          if (invoice) {
            // Update work order with invoice ID (will be done in next update)
            updates.invoiceId = invoice.id;
          }
        } catch (error) {
          console.error('Failed to auto-create invoice:', error);
          // Log detailed error for debugging
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error('Invoice creation error details:', {
            workOrderId: id,
            workOrderNumber: existing.workOrderNumber,
            customerId: existing.customerId,
            status: existing.status,
            error: errorMessage,
          });
          // Don't fail the completion if invoice creation fails
        }
      }
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

  // POKA-YOKE #4: Reopen completed work order
  reopen: async (
    id: string,
    reason: string,
    performedBy: string,
    performedByName?: string
  ): Promise<WorkOrder> => {
    await delay(500);
    const index = MOCK_WORK_ORDERS.findIndex(wo => wo.id === id);
    if (index === -1) throw new Error('Work order not found');

    const userInfo = getUserInfo();
    const existing = MOCK_WORK_ORDERS[index];

    // Validate that work order is completed
    if (existing.status !== 'completed') {
      throw new Error('Only completed work orders can be reopened');
    }

    // Check if invoice exists and its status
    let invoiceStatus: 'draft' | 'sent' | 'paid' | null = null;
    if (existing.invoiceId) {
      try {
        const { accountingService } = await import('@/features/accounting/services/accountingService');
        const invoices = await accountingService.getInvoices();
        const invoice = invoices.find(inv => inv.id === existing.invoiceId);
        if (invoice) {
          invoiceStatus = invoice.status;
          
          // If invoice is paid, require manager approval (for now, just log warning)
          if (invoice.status === 'paid') {
            console.warn('Work order with paid invoice is being reopened. This may require manual intervention.');
          }
        }
      } catch (error) {
        console.error('Failed to check invoice status:', error);
      }
    }

    // Determine new status (revert to previous status or 'in_progress')
    const previousStatus = existing.history
      ?.filter(h => h.fromStatus && h.toStatus === 'completed')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]?.fromStatus;
    
    const newStatus: WorkOrderStatus = (previousStatus as WorkOrderStatus) || 'in_progress';

    // Create reopen history entry
    const reopenEntry = createHistoryEntry(
      'status_changed',
      performedBy,
      performedByName || userInfo.userName,
      `Werkorder heropend: ${reason}`,
      {
        fromStatus: 'completed',
        toStatus: newStatus,
        reopenReason: reason,
        invoiceStatus,
      }
    );

    // Add journey entry
    const journeyEntry = createJourneyEntry(
      'in_progress',
      userInfo.userId,
      userInfo.userName,
      'Reopened',
      `Werkorder heropend: ${reason}`,
      { fromStatus: 'completed', toStatus: newStatus, reason, invoiceStatus }
    );

    const updated: WorkOrder = {
      ...existing,
      status: newStatus,
      completedDate: undefined, // Clear completion date
      updatedAt: new Date().toISOString(),
      history: [...(existing.history || []), reopenEntry],
      journey: addJourneyEntry(existing.journey || [], journeyEntry),
    };

    MOCK_WORK_ORDERS[index] = updated;
    saveWorkOrders();

    // Log activity
    logActivityHelper(
      'werkorder_reopened',
      'werkorder',
      id,
      'status_changed',
      `Werkorder ${existing.workOrderNumber || existing.id} heropend`,
      userInfo.userId,
      userInfo.userName,
      userInfo.userEmail,
      `Werkorder ${existing.workOrderNumber || existing.id}`,
      [{ field: 'status', oldValue: 'completed', newValue: newStatus }]
    );

    return updated;
  },

  /**
   * Archive a completed work order
   * Validates that invoice exists OR user provides archive reason
   */
  archive: async (
    id: string,
    archiveReason: string | undefined,
    performedBy: string,
    performedByName?: string
  ): Promise<WorkOrder> => {
    await delay(500);
    const index = MOCK_WORK_ORDERS.findIndex(wo => wo.id === id);
    if (index === -1) throw new Error('Work order not found');

    const userInfo = getUserInfo();
    const existing = MOCK_WORK_ORDERS[index];

    // Validate work order is completed
    if (existing.status !== 'completed') {
      throw new Error('Alleen voltooide werkorders kunnen worden gearchiveerd');
    }

    // Validate invoice exists OR archive reason provided
    if (!existing.invoiceId && !archiveReason) {
      throw new Error('Factuur vereist of opmerking nodig: Werkorder kan niet worden gearchiveerd zonder factuur tenzij er een opmerking wordt toegevoegd');
    }

    // Check if already archived
    if (existing.isArchived) {
      throw new Error('Werkorder is al gearchiveerd');
    }

    // Get activities for archive
    const activities = getEntityActivities('werkorder', id);

    // Archive to document archive
    archiveDocument(
      'werkorder',
      existing as any,
      existing.generalNumber || '',
      existing.workOrderNumber || '',
      existing.journey || [],
      activities,
      userInfo.userId,
      userInfo.userName,
      archiveReason || (existing.invoiceId ? 'Automatisch gearchiveerd: factuur bestaat' : 'Handmatig gearchiveerd zonder factuur')
    );

    // Create archive history entry
    const archiveEntry = createHistoryEntry(
      'archived',
      performedBy,
      performedByName || userInfo.userName,
      archiveReason 
        ? `Gearchiveerd met opmerking: ${archiveReason}`
        : `Gearchiveerd (factuur: ${existing.invoiceId ? 'aanwezig' : 'afwezig'})`,
      {
        archivedAt: new Date().toISOString(),
        archiveReason: archiveReason || undefined,
        invoiceId: existing.invoiceId || undefined,
      }
    );

    // Add journey entry
    const journeyEntry = createJourneyEntry(
      'completed',
      userInfo.userId,
      userInfo.userName,
      'Archived',
      archiveReason 
        ? `Gearchiveerd: ${archiveReason}`
        : 'Gearchiveerd',
      { archiveReason: archiveReason || undefined, invoiceId: existing.invoiceId || undefined }
    );

    const updated: WorkOrder = {
      ...existing,
      isArchived: true,
      archivedAt: new Date().toISOString(),
      archivedBy: userInfo.userId,
      archivedByName: userInfo.userName,
      archiveReason: archiveReason || undefined,
      updatedAt: new Date().toISOString(),
      history: [...(existing.history || []), archiveEntry],
      journey: addJourneyEntry(existing.journey || [], journeyEntry),
    };

    MOCK_WORK_ORDERS[index] = updated;
    saveWorkOrders();

    // Log activity
    logActivityHelper(
      'werkorder_archived',
      'werkorder',
      id,
      'archived',
      `Werkorder ${existing.workOrderNumber || existing.id} gearchiveerd${archiveReason ? ` met opmerking: ${archiveReason}` : ''}`,
      userInfo.userId,
      userInfo.userName,
      userInfo.userEmail,
      `Werkorder ${existing.workOrderNumber || existing.id}`,
      [{ field: 'isArchived', oldValue: false, newValue: true }]
    );

    return updated;
  },

  /**
   * Check and auto-archive completed work orders older than 48 hours
   * Returns list of work orders that need attention (no invoice after 48h)
   */
  checkAutoArchive: async (): Promise<{
    autoArchived: WorkOrder[];
    needsInvoice: WorkOrder[];
    notifications: Array<{ type: 'success' | 'warning'; title: string; message: string; link?: string }>;
  }> => {
    const now = Date.now();
    const fortyEightHoursAgo = now - (48 * 60 * 60 * 1000);
    const completedWorkOrders = MOCK_WORK_ORDERS.filter(
      wo => wo.status === 'completed' && !wo.isArchived && wo.completedDate
    );

    const autoArchived: WorkOrder[] = [];
    const needsInvoice: WorkOrder[] = [];
    const notifications: Array<{ type: 'success' | 'warning'; title: string; message: string; link?: string }> = [];

    for (const workOrder of completedWorkOrders) {
      const completedTime = new Date(workOrder.completedDate!).getTime();
      
      // Only process if older than 48 hours
      if (completedTime < fortyEightHoursAgo) {
        if (workOrder.invoiceId) {
          // Has invoice - auto-archive
          try {
            const userInfo = getUserInfo();
            const archived = await workOrderService.archive(
              workOrder.id,
              undefined, // No reason needed - has invoice
              'system',
              'Systeem'
            );
            autoArchived.push(archived);
            
            notifications.push({
              type: 'success',
              title: 'Werkorder automatisch gearchiveerd',
              message: `Werkorder ${workOrder.workOrderNumber || workOrder.id} is automatisch gearchiveerd (48+ uur voltooid met factuur)`,
              link: `/work-orders?archived=true`,
            });
          } catch (error) {
            console.error(`Failed to auto-archive work order ${workOrder.id}:`, error);
          }
        } else {
          // No invoice - mark as needs attention
          needsInvoice.push(workOrder);
          
          notifications.push({
            type: 'warning',
            title: 'Factuur vereist voor werkorder',
            message: `Werkorder ${workOrder.workOrderNumber || workOrder.id} is al 48+ uur voltooid zonder factuur. Maak een factuur aan of archiveer met opmerking.`,
            link: `/work-orders?id=${workOrder.id}`,
          });
        }
      }
    }

    return { autoArchived, needsInvoice, notifications };
  },

  /**
   * Get work orders that need attention (completed >48h without invoice)
   */
  getWorkOrdersNeedingAttention: (): WorkOrder[] => {
    const now = Date.now();
    const fortyEightHoursAgo = now - (48 * 60 * 60 * 1000);
    
    return MOCK_WORK_ORDERS.filter(wo => {
      if (wo.status !== 'completed' || wo.isArchived || !wo.completedDate) {
        return false;
      }
      
      const completedTime = new Date(wo.completedDate).getTime();
      return completedTime < fortyEightHoursAgo && !wo.invoiceId;
    });
  },
};
