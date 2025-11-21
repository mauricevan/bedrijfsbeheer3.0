import React, { useState } from 'react';
import { Calendar, Plus, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { usePlanning } from '../hooks/usePlanning';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks, startOfMonth, endOfMonth } from 'date-fns';
import { nl } from 'date-fns/locale';
import type { CalendarEvent, CalendarView } from '../types/planning.types';

export const PlanningPage: React.FC = () => {
  const { events, isLoading, createEvent, updateEvent, deleteEvent } = usePlanning();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('week');
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDate = (date: Date) => {
    return events.filter(e => isSameDay(new Date(e.start), date));
  };

  const handleCreateEvent = async (data: any) => {
    await createEvent(data);
    setShowEventModal(false);
    setEditingEvent(null);
  };

  const handleUpdateEvent = async (data: any) => {
    if (editingEvent) {
      await updateEvent(editingEvent.id, data);
      setShowEventModal(false);
      setEditingEvent(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Planning</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Kalender en planning</p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-1">
            <button
              onClick={() => setView('day')}
              className={`px-3 py-1 text-sm rounded ${view === 'day' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
            >
              Dag
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1 text-sm rounded ${view === 'week' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
            >
              Week
            </button>
            <button
              onClick={() => setView('month')}
              className={`px-3 py-1 text-sm rounded ${view === 'month' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
            >
              Maand
            </button>
          </div>
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => {
            setEditingEvent(null);
            setShowEventModal(true);
          }}>
            Nieuw Evenement
          </Button>
        </div>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentDate(subWeeks(currentDate, 1))}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {view === 'week' && format(weekStart, 'd MMM', { locale: nl }) + ' - ' + format(weekEnd, 'd MMM yyyy', { locale: nl })}
              {view === 'month' && format(currentDate, 'MMMM yyyy', { locale: nl })}
              {view === 'day' && format(currentDate, 'EEEE d MMMM yyyy', { locale: nl })}
            </h2>
            <button
              onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
            Vandaag
          </Button>
        </div>

        {view === 'week' && (
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => {
              const dayEvents = getEventsForDate(day);
              return (
                <div key={day.toISOString()} className="border border-slate-200 dark:border-slate-700 rounded-lg p-2 min-h-[120px]">
                  <div className={`text-sm font-medium mb-2 ${isSameDay(day, new Date()) ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}>
                    {format(day, 'EEE d', { locale: nl })}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className="text-xs p-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded cursor-pointer hover:bg-indigo-200 dark:hover:bg-indigo-800"
                        onClick={() => {
                          setEditingEvent(event);
                          setShowEventModal(true);
                        }}
                      >
                        {format(new Date(event.start), 'HH:mm', { locale: nl })} {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        +{dayEvents.length - 3} meer
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {view === 'month' && (
          <div className="grid grid-cols-7 gap-1">
            {['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'].map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
                {day}
              </div>
            ))}
            {monthDays.map((day) => {
              const dayEvents = getEventsForDate(day);
              return (
                <div
                  key={day.toISOString()}
                  className={`border border-slate-200 dark:border-slate-700 rounded-lg p-2 min-h-[100px] ${
                    isSameDay(day, new Date()) ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                  }`}
                >
                  <div className={`text-sm font-medium mb-1 ${isSameDay(day, new Date()) ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}>
                    {format(day, 'd', { locale: nl })}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className="text-xs p-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded truncate"
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        +{dayEvents.length - 2}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {view === 'day' && (
          <div className="space-y-2">
            {Array.from({ length: 24 }).map((_, hour) => {
              const hourEvents = events.filter(e => {
                const eventHour = new Date(e.start).getHours();
                return eventHour === hour;
              });
              return (
                <div key={hour} className="flex gap-4 border-b border-slate-200 dark:border-slate-700 pb-2">
                  <div className="w-16 text-sm text-slate-500 dark:text-slate-400">
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                  <div className="flex-1">
                    {hourEvents.map((event) => (
                      <div
                        key={event.id}
                        className="p-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded mb-1 cursor-pointer hover:bg-indigo-200 dark:hover:bg-indigo-800"
                        onClick={() => {
                          setEditingEvent(event);
                          setShowEventModal(true);
                        }}
                      >
                        <div className="font-medium">{event.title}</div>
                        {event.description && (
                          <div className="text-xs mt-1">{event.description}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Modal
        isOpen={showEventModal}
        onClose={() => {
          setShowEventModal(false);
          setEditingEvent(null);
        }}
        title={editingEvent ? 'Evenement Bewerken' : 'Nieuw Evenement'}
        className="max-w-2xl"
      >
        <EventForm
          event={editingEvent}
          onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
          onCancel={() => {
            setShowEventModal(false);
            setEditingEvent(null);
          }}
        />
      </Modal>
    </div>
  );
};

const EventForm: React.FC<{
  event?: CalendarEvent | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}> = ({ event, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'other' as CalendarEvent['type'],
    startDate: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endDate: new Date().toISOString().split('T')[0],
    endTime: '10:00',
  });

  React.useEffect(() => {
    if (event) {
      const start = new Date(event.start);
      const end = new Date(event.end);
      setFormData({
        title: event.title || '',
        description: event.description || '',
        type: event.type || 'other',
        startDate: start.toISOString().split('T')[0],
        startTime: start.toTimeString().slice(0, 5),
        endDate: end.toISOString().split('T')[0],
        endTime: end.toTimeString().slice(0, 5),
      });
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...formData,
      start: new Date(`${formData.startDate}T${formData.startTime}`).toISOString(),
      end: new Date(`${formData.endDate}T${formData.endTime}`).toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Titel *
        </label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Type
        </label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as CalendarEvent['type'] })}
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
        >
          <option value="work_order">Werkorder</option>
          <option value="meeting">Vergadering</option>
          <option value="vacation">Vakantie</option>
          <option value="other">Anders</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Startdatum *
          </label>
          <Input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Starttijd *
          </label>
          <Input
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Einddatum *
          </label>
          <Input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Eindtijd *
          </label>
          <Input
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Beschrijving
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
        />
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuleren
        </Button>
        <Button type="submit">
          {event ? 'Bijwerken' : 'Aanmaken'}
        </Button>
      </div>
    </form>
  );
};

