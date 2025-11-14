// features/workorders/components/WorkOrderCard.tsx
// Work Order Card Component
// Compliant met prompt.git: Max 300 regels

import React, { useState } from 'react';
import type { WorkOrder, Employee } from '../types';
import { getStatusColor, formatHours } from '../utils';

interface WorkOrderCardProps {
  order: WorkOrder;
  employees: Employee[];
  isAdmin: boolean;
  compactView: boolean;
  onStatusChange: (newStatus: string, reason?: string) => void;
  onHoursUpdate: (hours: number) => void;
  onViewDetails: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const WorkOrderCard: React.FC<WorkOrderCardProps> = ({
  order,
  employees,
  isAdmin,
  compactView,
  onStatusChange,
  onHoursUpdate,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const [editingHours, setEditingHours] = useState(false);
  const [hours, setHours] = useState(order.hoursSpent || 0);

  const assignee = employees.find((e) => e.id === order.assignedTo);

  const handleHoursSave = () => {
    onHoursUpdate(hours);
    setEditingHours(false);
  };

  if (compactView) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
        onClick={onViewDetails}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            {order.sortIndex && (
              <span className="text-xs text-gray-500 mr-2">#{order.sortIndex}</span>
            )}
            <h4 className="font-medium text-gray-900 truncate">{order.title}</h4>
          </div>
          <span className={`text-xs px-2 py-1 rounded ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          {order.sortIndex && (
            <span className="text-xs text-gray-500">#{order.sortIndex}</span>
          )}
          <h4 className="font-semibold text-gray-900">{order.title}</h4>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {order.description}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center text-gray-600">
          <span className="font-medium mr-2">👤</span>
          <span>{assignee?.name || 'Onbekend'}</span>
        </div>

        {order.customerId && (
          <div className="flex items-center text-gray-600">
            <span className="font-medium mr-2">🏢</span>
            <span>{order.customerId}</span>
          </div>
        )}

        {order.scheduledDate && (
          <div className="flex items-center text-gray-600">
            <span className="font-medium mr-2">📅</span>
            <span>{new Date(order.scheduledDate).toLocaleDateString('nl-NL')}</span>
          </div>
        )}

        {/* Hours */}
        <div className="flex items-center text-gray-600">
          <span className="font-medium mr-2">⏱️</span>
          {editingHours ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-20 px-2 py-1 border rounded text-sm"
                min="0"
                step="0.5"
              />
              <button
                onClick={handleHoursSave}
                className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                OK
              </button>
              <button
                onClick={() => setEditingHours(false)}
                className="text-xs px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                ✕
              </button>
            </div>
          ) : (
            <span
              onClick={() => setEditingHours(true)}
              className="cursor-pointer hover:text-blue-600"
            >
              {formatHours(order.hoursSpent)}
            </span>
          )}
        </div>

        {order.requiredInventory && order.requiredInventory.length > 0 && (
          <div className="flex items-center text-gray-600">
            <span className="font-medium mr-2">📦</span>
            <span>{order.requiredInventory.length} materialen</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={onViewDetails}
          className="flex-1 text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
        >
          Details
        </button>
        {isAdmin && (
          <>
            <button
              onClick={onEdit}
              className="text-xs px-3 py-1.5 bg-gray-50 text-gray-700 rounded hover:bg-gray-100"
            >
              ✏️
            </button>
            <button
              onClick={() => {
                if (confirm('Werkorder verwijderen?')) {
                  onDelete();
                }
              }}
              className="text-xs px-3 py-1.5 bg-red-50 text-red-700 rounded hover:bg-red-100"
            >
              🗑️
            </button>
          </>
        )}
      </div>
    </div>
  );
};
