import React, { useState } from 'react';
import { Clock, User, MapPin, Calendar, Package, Euro, FileText, AlertCircle } from 'lucide-react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { WorkOrder, WorkOrderStatus } from '../types';
import { Card } from '@/components/common/Card';
import { cn } from '@/utils/cn';
import { workOrderNeedsAttention } from '../utils/filters';

type ViewMode = 'extended' | 'compact';

type KanbanBoardProps = {
  workOrders: WorkOrder[];
  onCardClick: (workOrder: WorkOrder) => void;
  onStatusChange: (id: string, newStatus: WorkOrderStatus) => void;
  viewMode: ViewMode;
};

const STATUS_CONFIG: Record<WorkOrderStatus, { label: string; color: string }> = {
  todo: { label: 'To Do', color: 'bg-slate-100 dark:bg-slate-800 border-slate-300' },
  pending: { label: 'Pending', color: 'bg-amber-50 dark:bg-amber-900/20 border-amber-300' },
  in_progress: { label: 'In Progress', color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-300' },
  completed: { label: 'Completed', color: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300' },
};

// Droppable column component
const DroppableColumn: React.FC<{
  id: WorkOrderStatus;
  children: React.ReactNode;
  className?: string;
}> = ({ id, children, className }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        className,
        isOver && 'ring-2 ring-indigo-500 ring-offset-2'
      )}
    >
      {children}
    </div>
  );
};

const WorkOrderCard: React.FC<{
  order: WorkOrder;
  onClick: () => void;
  isDragging?: boolean;
  isCompact?: boolean;
}> = ({ order, onClick, isDragging, isCompact = false }) => {
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

  const needsAttention = workOrderNeedsAttention(order);

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className={cn(
        "transition-all duration-300 ease-out w-full",
        !isCompact && "flex-shrink-0"
      )}
    >
      <Card
        className={cn(
          "cursor-pointer hover:shadow-md transition-all duration-300 w-full",
          isCompact ? "p-2" : "p-4 flex flex-col",
          needsAttention && "border-2 border-red-500 bg-red-50 dark:bg-red-900/20"
        )}
        onClick={onClick}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className={cn(
            "font-medium text-slate-900 dark:text-white",
            isCompact ? "text-sm line-clamp-2" : ""
          )}>
            {order.title}
          </h4>
          {needsAttention && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-red-100 dark:bg-red-900/30 rounded text-xs text-red-700 dark:text-red-300 font-medium flex-shrink-0">
              <AlertCircle className="h-3 w-3" />
              Factuur vereist
            </div>
          )}
        </div>
        
        {!isCompact && (
          <div className="flex flex-col min-h-[280px]">
            {/* Description */}
            {order.description && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-4">
                {order.description}
              </p>
            )}
            
            {/* Main Info Grid */}
            <div className="space-y-2 mb-4 flex-1">
              {order.assignedToName && (
                <div className="flex items-center text-sm text-slate-700 dark:text-slate-300">
                  <User className="h-4 w-4 mr-2 flex-shrink-0 text-slate-500 dark:text-slate-400" />
                  <span className="truncate font-medium">{order.assignedToName}</span>
                </div>
              )}
              
              {order.location && (
                <div className="flex items-center text-sm text-slate-700 dark:text-slate-300">
                  <MapPin className="h-4 w-4 mr-2 flex-shrink-0 text-slate-500 dark:text-slate-400" />
                  <span className="truncate">{order.location}</span>
                </div>
              )}

              {order.scheduledDate && (
                <div className="flex items-center text-sm text-slate-700 dark:text-slate-300">
                  <Calendar className="h-4 w-4 mr-2 flex-shrink-0 text-slate-500 dark:text-slate-400" />
                  <span>
                    {new Date(order.scheduledDate).toLocaleDateString('nl-NL', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              )}

              {order.customerName && (
                <div className="flex items-center text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                  <User className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{order.customerName}</span>
                </div>
              )}

              {/* Materials */}
              {order.materials && order.materials.length > 0 && (
                <div className="flex items-start text-sm text-slate-700 dark:text-slate-300">
                  <Package className="h-4 w-4 mr-2 flex-shrink-0 text-slate-500 dark:text-slate-400 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium mb-1">Materialen:</div>
                    <div className="space-y-1">
                      {order.materials.slice(0, 2).map((material, idx) => (
                        <div key={idx} className="text-xs">
                          {material.quantity} {material.unit} {material.name}
                        </div>
                      ))}
                      {order.materials.length > 2 && (
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          +{order.materials.length - 2} meer
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Pending Reason */}
              {order.status === 'pending' && order.pendingReason && (
                <div className="flex items-start text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
                  <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-xs">{order.pendingReason}</span>
                </div>
              )}

              {/* Notes */}
              {order.notes && (
                <div className="flex items-start text-sm text-slate-600 dark:text-slate-400">
                  <FileText className="h-4 w-4 mr-2 flex-shrink-0 text-slate-500 dark:text-slate-400 mt-0.5" />
                  <span className="text-xs line-clamp-2">{order.notes}</span>
                </div>
              )}
            </div>
            
            {/* Bottom Section */}
            <div className="mt-auto pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
              {/* Hours Progress */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{order.hoursSpent}h / {order.estimatedHours}h</span>
                  </div>
                  {order.estimatedHours > 0 && (
                    <span className="text-slate-500 dark:text-slate-400">
                      {Math.round((order.hoursSpent / order.estimatedHours) * 100)}%
                    </span>
                  )}
                </div>
                {order.estimatedHours > 0 && (
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                    <div
                      className={cn(
                        "h-1.5 rounded-full transition-all",
                        order.hoursSpent > order.estimatedHours
                          ? "bg-red-500"
                          : order.hoursSpent / order.estimatedHours > 0.8
                          ? "bg-amber-500"
                          : "bg-blue-500"
                      )}
                      style={{
                        width: `${Math.min((order.hoursSpent / order.estimatedHours) * 100, 100)}%`
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Estimated Cost */}
              {order.estimatedCost > 0 && (
                <div className="flex items-center text-xs text-slate-600 dark:text-slate-400">
                  <Euro className="h-3 w-3 mr-1" />
                  <span>€{order.estimatedCost.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {isCompact && (
          <div className="flex items-center text-xs text-slate-600 dark:text-slate-400 mt-1">
            <Clock className="h-3 w-3 mr-1" />
            {order.hoursSpent}h / {order.estimatedHours}h
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
  viewMode,
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
    if (!activeOrder) {
      setActiveId(null);
      return;
    }

    // Check if over.id is a status (dropped on column) or a card ID (dropped on another card)
    let overStatus: WorkOrderStatus | null = null;
    
    // If over.id is a status, use it directly
    if (statuses.includes(over.id as WorkOrderStatus)) {
      overStatus = over.id as WorkOrderStatus;
    } else {
      // If over.id is a card ID, find which status that card belongs to
      const overOrder = workOrders.find(wo => wo.id === over.id);
      if (overOrder) {
        overStatus = overOrder.status;
      }
    }

    if (overStatus && activeOrder.status !== overStatus) {
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
            <DroppableColumn
              key={status}
              id={status}
              className="flex flex-col"
            >
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
                items={orders.map(o => o.id)}
                strategy={verticalListSortingStrategy}
              >
                <div
                  className={cn(
                    "flex-1 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-b-lg border-x-2 border-b-2 border-slate-200 dark:border-slate-700 min-h-[400px]",
                    viewMode === 'extended' ? "space-y-2 overflow-y-auto" : "space-y-2"
                  )}
                  data-status={status}
                >
                  {orders.map((order, index) => (
                    <WorkOrderCard
                      key={order.id}
                      order={order}
                      onClick={() => onCardClick(order)}
                      isDragging={activeId === order.id}
                      isCompact={viewMode === 'compact'}
                    />
                  ))}
                </div>
              </SortableContext>
            </DroppableColumn>
          );
        })}
      </div>

      <DragOverlay>
        {activeOrder && (
          <WorkOrderCard
            order={activeOrder}
            onClick={() => {}}
            isCompact={viewMode === 'compact'}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
};
