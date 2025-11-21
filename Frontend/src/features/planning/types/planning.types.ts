export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  type: 'work_order' | 'meeting' | 'vacation' | 'other';
  start: string; // ISO datetime
  end: string; // ISO datetime
  employeeId?: string;
  customerId?: string;
  relatedEntityId?: string; // work order ID, etc.
  createdAt: string;
  updatedAt: string;
}

export type CalendarView = 'day' | 'week' | 'month';

