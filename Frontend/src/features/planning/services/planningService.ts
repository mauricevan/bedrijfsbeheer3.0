import type { CalendarEvent } from '../types/planning.types';
import { storage } from '@/utils/storage';

const EVENTS_KEY = 'bedrijfsbeheer_calendar_events';

const DEFAULT_EVENTS: CalendarEvent[] = [];

let EVENTS = storage.get<CalendarEvent[]>(EVENTS_KEY, DEFAULT_EVENTS);

const saveEvents = () => storage.set(EVENTS_KEY, EVENTS);
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const planningService = {
  getEvents: async (filters?: { start?: string; end?: string; employeeId?: string }): Promise<CalendarEvent[]> => {
    await delay(300);
    let filtered = [...EVENTS];
    if (filters?.start) {
      filtered = filtered.filter(e => e.start >= filters.start!);
    }
    if (filters?.end) {
      filtered = filtered.filter(e => e.end <= filters.end!);
    }
    if (filters?.employeeId) {
      filtered = filtered.filter(e => e.employeeId === filters.employeeId);
    }
    return filtered;
  },

  createEvent: async (data: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<CalendarEvent> => {
    await delay(500);
    const newEvent: CalendarEvent = {
      ...data,
      id: `event-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    EVENTS.push(newEvent);
    saveEvents();
    return newEvent;
  },

  updateEvent: async (id: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent> => {
    await delay(500);
    const index = EVENTS.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Event not found');
    
    const updated = {
      ...EVENTS[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    EVENTS[index] = updated;
    saveEvents();
    return updated;
  },

  deleteEvent: async (id: string): Promise<void> => {
    await delay(300);
    EVENTS = EVENTS.filter(e => e.id !== id);
    saveEvents();
  },
};

