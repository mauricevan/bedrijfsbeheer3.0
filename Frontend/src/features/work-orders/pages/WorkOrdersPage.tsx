import React, { useState } from 'react';
import { Plus, ClipboardList } from 'lucide-react';
import { useWorkOrders } from '../hooks/useWorkOrders';
import { useWorkboard } from '../hooks/useWorkboard';
import { useHRM } from '@/features/hrm/hooks/useHRM';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  Workboard,
  EmployeeFilter,
  ViewModeToggle,
  WorkOrderForm,
  WorkOrderDetail,
} from '../components';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { SkeletonList } from '@/components/common/SkeletonList';
import type { WorkOrder, WorkOrderStatus } from '../types';

export const WorkOrdersPage: React.FC = () => {
  const { user } = useAuth();
  const { workOrders, isLoading, createWorkOrder, updateWorkOrder, deleteWorkOrder, updateStatus } = useWorkOrders({
    userId: user?.id,
    userName: user?.name,
  });
  const { employees } = useHRM();
  
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
  const [editingWorkOrder, setEditingWorkOrder] = useState<WorkOrder | null>(null);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);

  const handleStatusChange = async (id: string, newStatus: WorkOrderStatus) => {
    await updateStatus(id, newStatus);
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

  const handleSubmit = async (data: any) => {
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
        <WorkOrderDetail
          workOrder={selectedWorkOrder}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedWorkOrder(null);
          }}
          onEdit={() => handleEdit(selectedWorkOrder)}
          onDelete={handleDelete}
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
    </div>
  );
};
