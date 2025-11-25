import React, { useState, useEffect } from 'react';
import { Plus, ClipboardList } from 'lucide-react';
import { createNotification, addNotification } from '@/utils/notifications';
import { useWorkOrders } from '../hooks/useWorkOrders';
import { useWorkboard } from '../hooks/useWorkboard';
import { useHRM } from '@/features/hrm/hooks/useHRM';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useAccounting } from '@/features/accounting/hooks/useAccounting';
import {
  Workboard,
  EmployeeFilter,
  ViewModeToggle,
  WorkOrderForm,
  CompletionValidationModal,
} from '../components';
import { WorkflowDetailModal } from '@/features/accounting/components/WorkflowDetailModal';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import type { CreateWorkOrderInput } from '../types';
import { SkeletonList } from '@/components/common/SkeletonList';
import { useToast } from '@/context/ToastContext';
import type { WorkOrder, WorkOrderStatus } from '../types';

// Helper function to extract error message safely
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Er is een onverwachte fout opgetreden. Probeer het opnieuw.';
};

export const WorkOrdersPage: React.FC = () => {
  const { user } = useAuth();
  const { 
    workOrders, 
    isLoading, 
    createWorkOrder, 
    updateWorkOrder, 
    deleteWorkOrder, 
    updateStatus,
    archiveWorkOrder,
    checkAutoArchive,
    getWorkOrdersNeedingAttention,
    refresh
  } = useWorkOrders({
    userId: user?.id,
    userName: user?.name,
  });
  const { employees } = useHRM();
  const { cloneAsQuote, cloneAsInvoice } = useAccounting();
  const { showToast } = useToast();
  
  const {
    viewMode,
    selectedEmployeeId,
    selectedStatus,
    filteredWorkOrders,
    availableEmployees,
    handleEmployeeFilterChange,
    handleStatusFilterClick,
    handleViewModeChange,
  } = useWorkboard(workOrders, employees, user?.id);

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [archiveReason, setArchiveReason] = useState('');
  const [completingWorkOrder, setCompletingWorkOrder] = useState<WorkOrder | null>(null);
  const [editingWorkOrder, setEditingWorkOrder] = useState<WorkOrder | null>(null);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [archivingWorkOrder, setArchivingWorkOrder] = useState<WorkOrder | null>(null);

  const handleStatusChange = async (id: string, newStatus: WorkOrderStatus) => {
    // POKA-YOKE #1, #3: Show validation modal before completing
    if (newStatus === 'completed') {
      const workOrder = workOrders.find(wo => wo.id === id);
      if (workOrder) {
        setCompletingWorkOrder(workOrder);
        setShowCompletionModal(true);
        return; // Don't update status yet, wait for validation
      }
    }
    await updateStatus(id, newStatus);
  };

  const handleConfirmCompletion = async (withInvoice: boolean) => {
    if (!completingWorkOrder) return;

    try {
      // Update status to completed (invoice will be auto-created if withInvoice is true)
      await updateWorkOrder(completingWorkOrder.id, {
        status: 'completed',
        completedDate: new Date().toISOString(),
        autoCreateInvoice: withInvoice,
      });
      
      showToast(
        withInvoice 
          ? 'Werkorder voltooid en factuur aangemaakt!' 
          : 'Werkorder voltooid!',
        'success'
      );
      
      setShowCompletionModal(false);
      setCompletingWorkOrder(null);
    } catch (error) {
      console.error('Error completing work order:', error);
      showToast(getErrorMessage(error), 'error');
    }
  };

  const handleCardClick = (order: WorkOrder) => {
    setSelectedWorkOrder(order);
    setShowDetailModal(true);
  };

  const handleCreate = () => {
    setEditingWorkOrder(null);
    setShowFormModal(true);
  };

  const handleEdit = (order: WorkOrder) => {
    setEditingWorkOrder(order);
    setShowFormModal(true);
    setShowDetailModal(false);
  };

  const handleDelete = async () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (selectedWorkOrder) {
      await deleteWorkOrder(selectedWorkOrder.id);
      setShowDetailModal(false);
      setSelectedWorkOrder(null);
      setShowDeleteConfirm(false);
    }
  };

  // Auto-check for archiving on page load
  useEffect(() => {
    const runAutoArchiveCheck = async () => {
      try {
        const result = await checkAutoArchive();
        
        // Add notifications
        result.notifications.forEach(notif => {
          const notification = createNotification(
            notif.type === 'success' ? 'success' : 'warning',
            notif.title,
            notif.message,
            notif.link
          );
          addNotification(notification);
        });

        // Refresh if any were archived
        if (result.autoArchived.length > 0) {
          await refresh();
          showToast(`${result.autoArchived.length} werkorder(s) automatisch gearchiveerd`, 'success');
        }

        // Show warning if any need attention
        if (result.needsInvoice.length > 0) {
          showToast(`${result.needsInvoice.length} werkorder(s) hebben een factuur nodig`, 'warning');
        }
      } catch (error) {
        console.error('Error checking auto-archive:', error);
      }
    };

    if (!isLoading) {
      runAutoArchiveCheck();
    }
  }, [isLoading, checkAutoArchive, refresh, showToast]);

  const handleArchive = (order: WorkOrder) => {
    setArchivingWorkOrder(order);
    setArchiveReason('');
    setShowArchiveModal(true);
  };

  const confirmArchive = async () => {
    if (!archivingWorkOrder) return;

    try {
      // Check if invoice exists
      const hasInvoice = !!archivingWorkOrder.invoiceId;
      
      // If no invoice, require reason
      if (!hasInvoice && !archiveReason.trim()) {
        showToast('Opmerking vereist: Werkorder zonder factuur kan alleen worden gearchiveerd met een opmerking', 'error');
        return;
      }

      await archiveWorkOrder(archivingWorkOrder.id, archiveReason.trim() || undefined);
      
      showToast('Werkorder gearchiveerd', 'success');
      setShowArchiveModal(false);
      setArchivingWorkOrder(null);
      setArchiveReason('');
      await refresh();
    } catch (error) {
      console.error('Error archiving work order:', error);
      showToast(getErrorMessage(error), 'error');
    }
  };

  const handleSubmit = async (data: CreateWorkOrderInput) => {
    if (editingWorkOrder) {
      await updateWorkOrder(editingWorkOrder.id, data);
    } else {
      await createWorkOrder(data);
    }
    setShowFormModal(false);
    setEditingWorkOrder(null);
  };

  if (isLoading) {
    return <SkeletonList count={6} showAvatar={false} showActions={false} />;
  }

  const userName = user?.name || 'Gebruiker';

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1" />
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>
          + Nieuwe Werkorder
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <EmployeeFilter
          employees={availableEmployees}
          selectedEmployeeId={selectedEmployeeId}
          currentUserId={user?.id}
          onSelect={handleEmployeeFilterChange}
        />
        <ViewModeToggle
          viewMode={viewMode}
          onModeChange={handleViewModeChange}
        />
      </div>

      {/* Workboard */}
      {workOrders.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Geen werkorders gevonden"
          description={selectedEmployeeId === 'mine' 
            ? "Je hebt nog geen werkorders toegewezen gekregen. Werkorders worden hier weergegeven wanneer ze aan jou worden toegewezen."
            : "Er zijn nog geen werkorders in het systeem. Maak je eerste werkorder aan om te beginnen."}
          actionLabel="Nieuwe Werkorder"
          onAction={handleCreate}
          suggestions={selectedEmployeeId !== 'mine' ? [
            "Maak werkorders aan voor klanten",
            "Wijs werkorders toe aan medewerkers",
            "Houd de status bij voor overzicht"
          ] : undefined}
        />
      ) : (
        <Workboard
          workOrders={filteredWorkOrders}
          userName={userName}
          viewMode={viewMode}
          selectedStatus={selectedStatus}
          onCardClick={handleCardClick}
          onStatusChange={handleStatusChange}
          onStatusFilterClick={handleStatusFilterClick}
        />
      )}

      {/* Form Modal */}
      <Modal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setEditingWorkOrder(null);
        }}
        title={editingWorkOrder ? 'Werkorder Bewerken' : 'Nieuwe Werkorder'}
        className="max-w-4xl"
      >
        <WorkOrderForm
          workOrder={editingWorkOrder}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowFormModal(false);
            setEditingWorkOrder(null);
          }}
        />
      </Modal>

      {/* Detail Modal */}
      {selectedWorkOrder && (
        <WorkflowDetailModal
          item={selectedWorkOrder}
          itemType="workorder"
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedWorkOrder(null);
          }}
          onEdit={() => handleEdit(selectedWorkOrder)}
          onDelete={handleDelete}
          onArchive={(item) => handleArchive(item as WorkOrder)}
          onCloneAsQuote={async (item) => {
            const workOrder = item as WorkOrder;
            try {
              await cloneAsQuote(workOrder.id, 'workorder');
              showToast('Offerte gekloond en aangemaakt!', 'success');
            } catch (error) {
              console.error('Error cloning as quote:', error);
              showToast(getErrorMessage(error), 'error');
            }
          }}
          onCloneAsInvoice={async (item) => {
            const workOrder = item as WorkOrder;
            try {
              await cloneAsInvoice(workOrder.id, 'workorder');
              showToast('Factuur gekloond en aangemaakt!', 'success');
            } catch (error) {
              console.error('Error cloning as invoice:', error);
              showToast(getErrorMessage(error), 'error');
            }
          }}
          onCloneAsWorkOrder={async (item) => {
            const workOrder = item as WorkOrder;
            try {
              // Clone work order by creating a new one with same data
              await createWorkOrder({
                title: `${workOrder.title} (Kopie)`,
                description: workOrder.description,
                status: 'todo',
                assignedTo: workOrder.assignedTo,
                customerId: workOrder.customerId,
                location: workOrder.location,
                scheduledDate: workOrder.scheduledDate,
                materials: workOrder.materials,
                estimatedHours: workOrder.estimatedHours,
                hoursSpent: 0,
                estimatedCost: workOrder.estimatedCost,
                notes: workOrder.notes,
                sortIndex: 0,
              });
              showToast('Werkorder gekloond en aangemaakt!', 'success');
            } catch (error) {
              console.error('Error cloning work order:', error);
              showToast(getErrorMessage(error), 'error');
            }
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Werkorder Verwijderen"
        message={`Weet u zeker dat u werkorder "${selectedWorkOrder?.title}" wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.`}
        confirmText="Verwijderen"
        cancelText="Annuleren"
        type="danger"
      />

      {/* Completion Validation Modal */}
      {completingWorkOrder && (
        <CompletionValidationModal
          workOrder={completingWorkOrder}
          isOpen={showCompletionModal}
          onClose={() => {
            setShowCompletionModal(false);
            setCompletingWorkOrder(null);
          }}
          onConfirm={handleConfirmCompletion}
          existingInvoiceId={completingWorkOrder.invoiceId}
        />
      )}

      {/* Archive Modal */}
      {archivingWorkOrder && (
        <Modal
          isOpen={showArchiveModal}
          onClose={() => {
            setShowArchiveModal(false);
            setArchivingWorkOrder(null);
            setArchiveReason('');
          }}
          title="Werkorder Archiveren"
          className="max-w-md"
        >
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                <strong>Werkorder:</strong> {archivingWorkOrder.workOrderNumber || archivingWorkOrder.id}
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">
                <strong>Klant:</strong> {archivingWorkOrder.customerName || 'Geen klant'}
              </p>
              {archivingWorkOrder.invoiceId ? (
                <p className="text-sm text-green-700 dark:text-green-300 mt-2 font-medium">
                  ✓ Factuur aanwezig - archiveren toegestaan
                </p>
              ) : (
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-2 font-medium">
                  ⚠ Geen factuur - opmerking vereist
                </p>
              )}
            </div>

            {!archivingWorkOrder.invoiceId && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Opmerking (vereist) *
                </label>
                <textarea
                  value={archiveReason}
                  onChange={(e) => setArchiveReason(e.target.value)}
                  placeholder="Leg uit waarom deze werkorder wordt gearchiveerd zonder factuur..."
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={4}
                  required
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Deze opmerking wordt opgeslagen in de activiteit tracking en document archief.
                </p>
              </div>
            )}

            {archivingWorkOrder.invoiceId && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Opmerking (optioneel)
                </label>
                <textarea
                  value={archiveReason}
                  onChange={(e) => setArchiveReason(e.target.value)}
                  placeholder="Optionele opmerking voor archivering..."
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            )}

            <div className="flex gap-3 justify-end pt-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowArchiveModal(false);
                  setArchivingWorkOrder(null);
                  setArchiveReason('');
                }}
              >
                Annuleren
              </Button>
              <Button
                onClick={confirmArchive}
                disabled={!archivingWorkOrder.invoiceId && !archiveReason.trim()}
              >
                Archiveren
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
