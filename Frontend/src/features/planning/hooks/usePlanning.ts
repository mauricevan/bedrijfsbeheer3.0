import { useState, useEffect, useCallback } from 'react';
import type { CalendarEvent } from '../types/planning.types';
import { planningService } from '../services/planningService';

export const usePlanning = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = useCallback(async (filters?: { start?: string; end?: string; employeeId?: string }) => {
    try {
      setIsLoading(true);
      const eventsData = await planningService.getEvents(filters);
      setEvents(eventsData);
    } catch (error) {
      console.error('Failed to fetch planning data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const createEvent = async (data: any) => {
    const newEvent = await planningService.createEvent(data);
    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  };

  const updateEvent = async (id: string, updates: any) => {
    const updated = await planningService.updateEvent(id, updates);
    setEvents(prev => prev.map(e => e.id === id ? updated : e));
    return updated;
  };

  const deleteEvent = async (id: string) => {
    await planningService.deleteEvent(id);
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  return {
    events,
    isLoading,
    createEvent,
    updateEvent,
    deleteEvent,
    refresh: fetchEvents,
  };
};

