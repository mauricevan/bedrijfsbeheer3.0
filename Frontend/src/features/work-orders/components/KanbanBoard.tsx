import React, { useState } from 'react';
import { Clock, User, MapPin } from 'lucide-react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { WorkOrder, WorkOrderStatus } from '../types';
import { Card } from '@/components/common/Card';
import { cn } from '@/utils/cn';

type KanbanBoardProps = {
  workOrders: WorkOrder[];
  onCardClick: (workOrder: WorkOrder) => void;
  onStatusChange: (id: string, newStatus: WorkOrderStatus) => void;
};

const STATUS_CONFIG: Record<WorkOrderStatus, { label: string; color: string }> = {
  todo: { label: 'To Do', color: 'bg-slate-100 dark:bg-slate-800 border-slate-300' },
  pending: { label: 'Pending', color: 'bg-amber-50 dark:bg-amber-900/20 border-amber-300' },
  in_progress: { label: 'In Progress', color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-300' },
  completed: { label: 'Completed', color: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300' },
};

const WorkOrderCard: React.FC<{
  order: WorkOrder;
  onClick: () => void;
  isDragging?: boolean;
}> = ({ order, onClick, isDragging }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: order.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        className="p-3 cursor-pointer hover:shadow-md transition-shadow"
        onClick={onClick}
      >
        <h4 className="font-medium text-slate-900 dark:text-white mb-2 line-clamp-2">
          {order.title}
        </h4>
        
        {order.assignedToName && (
          <div className="flex items-center text-xs text-slate-600 dark:text-slate-400 mb-1">
            <User className="h-3 w-3 mr-1" />
            {order.assignedToName}
          </div>
        )}
        
        {order.location && (
          <div className="flex items-center text-xs text-slate-600 dark:text-slate-400 mb-1">
            <MapPin className="h-3 w-3 mr-1" />
            {order.location}
          </div>
        )}
        
        <div className="flex items-center text-xs text-slate-600 dark:text-slate-400 mt-2">
          <Clock className="h-3 w-3 mr-1" />
          {order.hoursSpent}h / {order.estimatedHours}h
        </div>

        {order.customerName && (
          <div className="mt-2 text-xs text-indigo-600 dark:text-indigo-400">
            {order.customerName}
          </div>
        )}
      </Card>
    </div>
  );
};

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  workOrders,
  onCardClick,
  onStatusChange,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const statuses: WorkOrderStatus[] = ['todo', 'pending', 'in_progress', 'completed'];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const getOrdersByStatus = (status: WorkOrderStatus) => {
    return workOrders.filter(wo => wo.status === status);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeOrder = workOrders.find(wo => wo.id === active.id);
    const overStatus = over.id as WorkOrderStatus;

    if (activeOrder && activeOrder.status !== overStatus) {
      onStatusChange(activeOrder.id, overStatus);
    }

    setActiveId(null);
  };

  const activeOrder = activeId ? workOrders.find(wo => wo.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statuses.map(status => {
          const orders = getOrdersByStatus(status);
          const config = STATUS_CONFIG[status];

          return (
            <div key={status} className="flex flex-col">
              <div className={cn(
                'p-3 rounded-t-lg border-2 font-semibold text-sm',
                config.color
              )}>
                <div className="flex justify-between items-center">
                  <span>{config.label}</span>
                  <span className="bg-white dark:bg-slate-900 px-2 py-0.5 rounded-full text-xs">
                    {orders.length}
                  </span>
                </div>
              </div>

              <SortableContext
                id={status}
                items={orders.map(o => o.id)}
                strategy={verticalListSortingStrategy}
              >
                <div
                  className="flex-1 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-b-lg border-x-2 border-b-2 border-slate-200 dark:border-slate-700 space-y-2 min-h-[400px]"
                  data-status={status}
                >
                  {orders.map(order => (
                    <WorkOrderCard
                      key={order.id}
                      order={order}
                      onClick={() => onCardClick(order)}
                      isDragging={activeId === order.id}
                    />
                  ))}
                </div>
              </SortableContext>
            </div>
          );
        })}
      </div>

      <DragOverlay>
        {activeOrder && (
          <WorkOrderCard
            order={activeOrder}
            onClick={() => {}}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
};
