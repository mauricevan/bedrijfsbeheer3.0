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
    <div className="w-full">
      {/* Container with same width as Kanban columns - maintains consistent width across breakpoints */}
      {/* Matches: grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 from KanbanBoard */}
      {/* gap-4 = 1rem, so: md: (100% - 1rem) / 2, lg: (100% - 3rem) / 4 */}
      <div className="w-full md:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-3rem)/4)] mx-auto space-y-2">
        {workOrders.map((order, index) => (
          <Card
            key={order.id}
            className="p-3 cursor-pointer hover:shadow-md transition-shadow animate-foldIn"
            onClick={() => onCardClick(order)}
            style={{
              animationDelay: `${index * 0.05}s`,
            }}
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
        ))}
      </div>
    </div>
  );
};

