/**
 * WorkOrderList Component
 * Compact list view for work orders
 */

import React from 'react';
import { Clock, User, MapPin } from 'lucide-react';
import { Card } from '@/components/common/Card';
import type { WorkOrder } from '../types';

type WorkOrderListProps = {
  workOrders: WorkOrder[];
  onCardClick: (workOrder: WorkOrder) => void;
};

export const WorkOrderList: React.FC<WorkOrderListProps> = ({
  workOrders,
  onCardClick,
}) => {
  return (
    <div className="space-y-2">
      {workOrders.map(order => (
        <Card
          key={order.id}
          className="p-4 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onCardClick(order)}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-slate-900 dark:text-white mb-2 line-clamp-1">
                {order.title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
                {order.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                {order.assignedToName && (
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {order.assignedToName}
                  </div>
                )}
                {order.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {order.location}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {order.hoursSpent}h / {order.estimatedHours}h
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <span className={`
                px-2 py-1 rounded-full text-xs font-medium
                ${order.status === 'todo' ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' : ''}
                ${order.status === 'pending' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' : ''}
                ${order.status === 'in_progress' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : ''}
                ${order.status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' : ''}
              `}>
                {order.status === 'todo' ? 'To Do' : ''}
                {order.status === 'pending' ? 'In Wacht' : ''}
                {order.status === 'in_progress' ? 'Bezig' : ''}
                {order.status === 'completed' ? 'Afgerond' : ''}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

