// features/workorders/components/WorkOrdersBoard.tsx
// Main Kanban Board Component
// Compliant met prompt.git: Max 300 regels

import React from 'react';
import type { WorkOrder, Employee } from '../types';
import { WorkOrderCard } from './WorkOrderCard';

interface WorkOrdersBoardProps {
  groupedOrders: Record<string, WorkOrder[]>;
  employees: Employee[];
  isAdmin: boolean;
  compactView: boolean;
  onStatusChange: (orderId: string, newStatus: string, reason?: string) => void;
  onHoursUpdate: (orderId: string, hours: number) => void;
  onViewDetails: (order: WorkOrder) => void;
  onEdit: (order: WorkOrder) => void;
  onDelete: (orderId: string) => void;
}

export const WorkOrdersBoard: React.FC<WorkOrdersBoardProps> = ({
  groupedOrders,
  employees,
  isAdmin,
  compactView,
  onStatusChange,
  onHoursUpdate,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const statuses = ['To Do', 'Pending', 'In Progress', 'Completed'];

  const getColumnColor = (status: string): string => {
    const colors: Record<string, string> = {
      'To Do': 'bg-gray-50 border-gray-200',
      'Pending': 'bg-yellow-50 border-yellow-200',
      'In Progress': 'bg-blue-50 border-blue-200',
      'Completed': 'bg-green-50 border-green-200',
    };
    return colors[status] || 'bg-gray-50';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {statuses.map((status) => (
        <div key={status} className="flex flex-col">
          {/* Column Header */}
          <div className={`p-3 rounded-t-lg border-b-2 ${getColumnColor(status)}`}>
            <h3 className="font-semibold text-gray-800">{status}</h3>
            <p className="text-sm text-gray-600">
              {groupedOrders[status]?.length || 0} werkorders
            </p>
          </div>

          {/* Cards Container */}
          <div className="flex-1 p-2 bg-gray-100 rounded-b-lg min-h-[400px] overflow-y-auto">
            <div className="space-y-3">
              {groupedOrders[status]?.map((order) => (
                <WorkOrderCard
                  key={order.id}
                  order={order}
                  employees={employees}
                  isAdmin={isAdmin}
                  compactView={compactView}
                  onStatusChange={(newStatus, reason) =>
                    onStatusChange(order.id, newStatus, reason)
                  }
                  onHoursUpdate={(hours) => onHoursUpdate(order.id, hours)}
                  onViewDetails={() => onViewDetails(order)}
                  onEdit={() => onEdit(order)}
                  onDelete={() => onDelete(order.id)}
                />
              ))}

              {(!groupedOrders[status] || groupedOrders[status].length === 0) && (
                <div className="text-center py-8 text-gray-400">
                  <p>Geen werkorders</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
