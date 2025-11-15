// pages/Planning.tsx - Refactored < 300 lines
import React, { useState } from 'react';
import type { WorkOrder, Employee } from '../types';

interface PlanningProps {
  workOrders: WorkOrder[];
  employees: Employee[];
}

export const Planning: React.FC<PlanningProps> = ({ workOrders, employees }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');

  const getOrdersForDate = (date: string) => {
    return workOrders.filter(wo => wo.scheduledDate === date);
  };

  const getWeekDates = () => {
    const dates = [];
    const start = new Date(selectedDate);
    const dayOfWeek = start.getDay();
    start.setDate(start.getDate() - dayOfWeek + 1); // Monday

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const weekDates = getWeekDates();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Planning</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('day')}
            className={`px-4 py-2 rounded ${viewMode === 'day' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Dag
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`px-4 py-2 rounded ${viewMode === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Week
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`px-4 py-2 rounded ${viewMode === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Maand
          </button>
        </div>
      </div>

      {/* Date Selector */}
      <div className="mb-6">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        />
      </div>

      {/* Week View */}
      {viewMode === 'week' && (
        <div className="grid grid-cols-7 gap-2">
          {weekDates.map((date) => {
            const orders = getOrdersForDate(date);
            const dayName = new Date(date).toLocaleDateString('nl-NL', { weekday: 'short' });
            const dayNum = new Date(date).getDate();

            return (
              <div key={date} className="border rounded-lg p-3 bg-white">
                <div className="font-bold mb-2">
                  {dayName} {dayNum}
                </div>
                <div className="space-y-2">
                  {orders.length === 0 ? (
                    <p className="text-sm text-gray-400">Geen werkorders</p>
                  ) : (
                    orders.map((wo) => (
                      <div
                        key={wo.id}
                        className="bg-blue-50 p-2 rounded text-xs"
                      >
                        <p className="font-semibold">{wo.title}</p>
                        <p className="text-gray-600">
                          {employees.find(e => e.id === wo.assignedTo)?.name || 'Niet toegewezen'}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Day View */}
      {viewMode === 'day' && (
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">
            {new Date(selectedDate).toLocaleDateString('nl-NL', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h2>
          <div className="space-y-3">
            {getOrdersForDate(selectedDate).map((wo) => (
              <div key={wo.id} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg">{wo.title}</h3>
                <p className="text-gray-600">{wo.description}</p>
                <div className="mt-2 flex gap-4 text-sm">
                  <span>👤 {employees.find(e => e.id === wo.assignedTo)?.name || 'Niet toegewezen'}</span>
                  <span>📍 {wo.location || 'Geen locatie'}</span>
                  <span>⏱️ {wo.estimatedHours || '?'}u</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Month View */}
      {viewMode === 'month' && (
        <div className="bg-white rounded-lg p-6">
          <p className="text-center text-gray-500">Maandweergave - In ontwikkeling</p>
        </div>
      )}
    </div>
  );
};
