// pages/WorkOrders.tsx
// WorkOrders Page - Orchestration Only
// Compliant met prompt.git: Max 300 regels, orchestration pattern

import React, { useState } from 'react';
import {
  WorkOrdersBoard,
  useWorkOrders,
  type WorkOrdersProps as FeatureProps,
} from '../features/workorders';

// Page props = Feature props (pass-through)
type WorkOrdersProps = FeatureProps;

export const WorkOrders: React.FC<WorkOrdersProps> = (props) => {
  const {
    workOrders,
    currentUser,
    isAdmin,
    employees,
  } = props;

  // Local UI state
  const [viewingUserId, setViewingUserId] = useState(currentUser.employeeId);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [compactView, setCompactView] = useState(false);

  // Use feature hook
  const {
    groupedOrders,
    stats,
    changeStatus,
    updateHours,
  } = useWorkOrders({
    workOrders,
    setWorkOrders: props.setWorkOrders,
    currentUser,
    statusFilter: statusFilter as any,
    viewingUserId,
  });

  // Handler stubs (simplified for refactoring)
  const handleViewDetails = (order: any) => {
    alert(`View details: ${order.title}`);
  };

  const handleEdit = (order: any) => {
    alert(`Edit: ${order.title}`);
  };

  const handleDelete = (orderId: string) => {
    if (confirm('Werkorder verwijderen?')) {
      props.setWorkOrders((prev) => prev.filter((o) => o.id !== orderId));
    }
  };

  const viewingEmployee = employees.find((e) => e.id === viewingUserId);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Werkorders</h1>
        <p className="text-gray-600 mt-1">
          Kanban-stijl werkorder beheer systeem
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Totaal</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">To Do</p>
          <p className="text-2xl font-bold">{stats.todo}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold">{stats.pending}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">In Progress</p>
          <p className="text-2xl font-bold">{stats.inProgress}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Completed</p>
          <p className="text-2xl font-bold">{stats.completed}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-4 items-center">
        {/* Employee Filter */}
        {isAdmin && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bekijk medewerker:
            </label>
            <select
              value={viewingUserId}
              onChange={(e) => setViewingUserId(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter status:
          </label>
          <select
            value={statusFilter || ''}
            onChange={(e) => setStatusFilter(e.target.value || null)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="">Alle statussen</option>
            <option value="To Do">To Do</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Compact View Toggle */}
        <div className="flex items-center gap-2 ml-auto">
          <label className="text-sm text-gray-700">Compact</label>
          <input
            type="checkbox"
            checked={compactView}
            onChange={(e) => setCompactView(e.target.checked)}
            className="rounded"
          />
        </div>
      </div>

      {/* Current View Info */}
      <div className="mb-4 text-sm text-gray-600">
        Bekijkt: <strong>{viewingEmployee?.name || 'Onbekend'}</strong>
        {statusFilter && <> | Status: <strong>{statusFilter}</strong></>}
        {!isAdmin && <> (alleen eigen werkorders)</>}
      </div>

      {/* Kanban Board */}
      <WorkOrdersBoard
        groupedOrders={groupedOrders}
        employees={employees}
        isAdmin={isAdmin}
        compactView={compactView}
        onStatusChange={changeStatus}
        onHoursUpdate={updateHours}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Add Button (Admin only) */}
      {isAdmin && (
        <button
          onClick={() => alert('Nieuwe werkorder toevoegen (TODO)')}
          className="fixed bottom-8 right-8 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          + Nieuwe Werkorder
        </button>
      )}
    </div>
  );
};
