import type {
  TimeEntry,
  WeekTimesheet,
  CreateTimeEntryInput,
  UpdateTimeEntryInput,
} from '../types/hrm.types';
import { storage } from '@/utils/storage';

const TIME_ENTRIES_KEY = 'bedrijfsbeheer_time_entries';
const TIMESHEETS_KEY = 'bedrijfsbeheer_timesheets';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper functions
function getAllTimeEntries(): TimeEntry[] {
  return storage.get<TimeEntry[]>(TIME_ENTRIES_KEY, []);
}

function saveTimeEntries(entries: TimeEntry[]): void {
  storage.set(TIME_ENTRIES_KEY, entries);
}

function getAllTimesheets(): WeekTimesheet[] {
  return storage.get<WeekTimesheet[]>(TIMESHEETS_KEY, []);
}

function saveTimesheets(timesheets: WeekTimesheet[]): void {
  storage.set(TIMESHEETS_KEY, timesheets);
}

// Calculate hours between start and end time
function calculateHours(startTime: string, endTime: string): number {
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  
  // Handle overnight shifts
  if (end < start) {
    end.setDate(end.getDate() + 1);
  }
  
  const diffMs = end.getTime() - start.getTime();
  return diffMs / (1000 * 60 * 60); // Convert to hours
}

// Get week start date (Monday)
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
}

// Get week end date (Sunday)
function getWeekEnd(date: Date): Date {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  return weekEnd;
}

// Get or create timesheet for a week
function getOrCreateTimesheet(employeeId: string, date: Date): WeekTimesheet {
  const weekStart = getWeekStart(date);
  const weekEnd = getWeekEnd(date);
  const weekStartStr = weekStart.toISOString().split('T')[0];
  const weekEndStr = weekEnd.toISOString().split('T')[0];
  
  const timesheets = getAllTimesheets();
  let timesheet = timesheets.find(
    t => t.employeeId === employeeId && t.weekStartDate === weekStartStr
  );
  
  if (!timesheet) {
    const now = new Date().toISOString();
    timesheet = {
      id: `timesheet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      employeeId,
      weekStartDate: weekStartStr,
      weekEndDate: weekEndStr,
      entries: [],
      totalHours: 0,
      regularHours: 0,
      overtimeHours: 0,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
    };
    timesheets.push(timesheet);
    saveTimesheets(timesheets);
  }
  
  return timesheet;
}

// Update timesheet totals
function updateTimesheetTotals(timesheet: WeekTimesheet): WeekTimesheet {
  const entries = getAllTimeEntries().filter(e => {
    const entryDate = new Date(e.date);
    const weekStart = new Date(timesheet.weekStartDate);
    const weekEnd = new Date(timesheet.weekEndDate);
    return e.employeeId === timesheet.employeeId &&
           entryDate >= weekStart &&
           entryDate <= weekEnd;
  });
  
  const totalHours = entries.reduce((sum, e) => sum + e.totalHours, 0);
  const regularHours = entries
    .filter(e => e.type === 'work')
    .reduce((sum, e) => sum + e.totalHours, 0);
  const overtimeHours = Math.max(0, regularHours - 40); // Assuming 40h/week standard
  
  return {
    ...timesheet,
    entries,
    totalHours,
    regularHours: Math.min(regularHours, 40),
    overtimeHours,
  };
}

export const timeTrackingService = {
  // Get all time entries
  async getTimeEntries(filters?: {
    employeeId?: string;
    startDate?: string;
    endDate?: string;
    projectId?: string;
    approved?: boolean;
  }): Promise<TimeEntry[]> {
    await delay(300);
    let entries = getAllTimeEntries();
    
    if (filters?.employeeId) {
      entries = entries.filter(e => e.employeeId === filters.employeeId);
    }
    
    if (filters?.startDate) {
      entries = entries.filter(e => e.date >= filters.startDate!);
    }
    
    if (filters?.endDate) {
      entries = entries.filter(e => e.date <= filters.endDate!);
    }
    
    if (filters?.projectId) {
      entries = entries.filter(e => e.projectId === filters.projectId);
    }
    
    if (filters?.approved !== undefined) {
      entries = entries.filter(e => e.approved === filters.approved);
    }
    
    return entries.sort((a, b) => {
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;
      return b.startTime.localeCompare(a.startTime);
    });
  },

  // Get time entry by ID
  async getTimeEntry(id: string): Promise<TimeEntry | undefined> {
    await delay(200);
    const entries = getAllTimeEntries();
    return entries.find(e => e.id === id);
  },

  // Create time entry
  async createTimeEntry(input: CreateTimeEntryInput): Promise<TimeEntry> {
    await delay(500);
    const totalHours = calculateHours(input.startTime, input.endTime);
    
    const now = new Date().toISOString();
    const entry: TimeEntry = {
      ...input,
      id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      totalHours,
      approved: false,
      createdAt: now,
      updatedAt: now,
    };
    
    const entries = getAllTimeEntries();
    entries.push(entry);
    saveTimeEntries(entries);
    
    // Update timesheet
    const entryDate = new Date(input.date);
    const timesheet = getOrCreateTimesheet(input.employeeId, entryDate);
    const updatedTimesheet = updateTimesheetTotals(timesheet);
    
    const timesheets = getAllTimesheets();
    const index = timesheets.findIndex(t => t.id === timesheet.id);
    if (index !== -1) {
      timesheets[index] = updatedTimesheet;
      saveTimesheets(timesheets);
    }
    
    return entry;
  },

  // Update time entry
  async updateTimeEntry(id: string, updates: UpdateTimeEntryInput): Promise<TimeEntry> {
    await delay(500);
    const entries = getAllTimeEntries();
    const index = entries.findIndex(e => e.id === id);
    
    if (index === -1) {
      throw new Error('Time entry not found');
    }
    
    const existing = entries[index];
    const startTime = updates.startTime ?? existing.startTime;
    const endTime = updates.endTime ?? existing.endTime;
    const totalHours = calculateHours(startTime, endTime);
    
    const updated: TimeEntry = {
      ...existing,
      ...updates,
      totalHours,
      updatedAt: new Date().toISOString(),
    };
    
    entries[index] = updated;
    saveTimeEntries(entries);
    
    // Update timesheet
    const entryDate = new Date(updated.date);
    const timesheet = getOrCreateTimesheet(updated.employeeId, entryDate);
    const updatedTimesheet = updateTimesheetTotals(timesheet);
    
    const timesheets = getAllTimesheets();
    const timesheetIndex = timesheets.findIndex(t => t.id === timesheet.id);
    if (timesheetIndex !== -1) {
      timesheets[timesheetIndex] = updatedTimesheet;
      saveTimesheets(timesheets);
    }
    
    return updated;
  },

  // Delete time entry
  async deleteTimeEntry(id: string): Promise<void> {
    await delay(300);
    const entries = getAllTimeEntries();
    const entry = entries.find(e => e.id === id);
    
    if (!entry) {
      throw new Error('Time entry not found');
    }
    
    const filtered = entries.filter(e => e.id !== id);
    saveTimeEntries(filtered);
    
    // Update timesheet
    const entryDate = new Date(entry.date);
    const timesheet = getOrCreateTimesheet(entry.employeeId, entryDate);
    const updatedTimesheet = updateTimesheetTotals(timesheet);
    
    const timesheets = getAllTimesheets();
    const timesheetIndex = timesheets.findIndex(t => t.id === timesheet.id);
    if (timesheetIndex !== -1) {
      timesheets[timesheetIndex] = updatedTimesheet;
      saveTimesheets(timesheets);
    }
  },

  // Get week timesheet
  async getWeekTimesheet(employeeId: string, date: Date): Promise<WeekTimesheet> {
    await delay(300);
    const timesheet = getOrCreateTimesheet(employeeId, date);
    return updateTimesheetTotals(timesheet);
  },

  // Get all timesheets for an employee
  async getEmployeeTimesheets(employeeId: string): Promise<WeekTimesheet[]> {
    await delay(300);
    const timesheets = getAllTimesheets();
    return timesheets
      .filter(t => t.employeeId === employeeId)
      .map(t => updateTimesheetTotals(t))
      .sort((a, b) => b.weekStartDate.localeCompare(a.weekStartDate));
  },

  // Submit timesheet for approval
  async submitTimesheet(timesheetId: string): Promise<WeekTimesheet> {
    await delay(500);
    const timesheets = getAllTimesheets();
    const index = timesheets.findIndex(t => t.id === timesheetId);
    
    if (index === -1) {
      throw new Error('Timesheet not found');
    }
    
    const updated: WeekTimesheet = {
      ...timesheets[index],
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    timesheets[index] = updated;
    saveTimesheets(timesheets);
    
    return updated;
  },

  // Approve timesheet
  async approveTimesheet(timesheetId: string, approvedBy: string): Promise<WeekTimesheet> {
    await delay(500);
    const timesheets = getAllTimesheets();
    const index = timesheets.findIndex(t => t.id === timesheetId);
    
    if (index === -1) {
      throw new Error('Timesheet not found');
    }
    
    const timesheet = timesheets[index];
    
    // Approve all entries in the timesheet
    const entries = getAllTimeEntries();
    timesheet.entries.forEach(entry => {
      const entryIndex = entries.findIndex(e => e.id === entry.id);
      if (entryIndex !== -1) {
        entries[entryIndex] = {
          ...entries[entryIndex],
          approved: true,
          approvedBy,
          approvedAt: new Date().toISOString(),
        };
      }
    });
    saveTimeEntries(entries);
    
    const updated: WeekTimesheet = {
      ...timesheet,
      status: 'approved',
      approvedBy,
      approvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    timesheets[index] = updated;
    saveTimesheets(timesheets);
    
    return updated;
  },

  // Reject timesheet
  async rejectTimesheet(timesheetId: string): Promise<WeekTimesheet> {
    await delay(500);
    const timesheets = getAllTimesheets();
    const index = timesheets.findIndex(t => t.id === timesheetId);
    
    if (index === -1) {
      throw new Error('Timesheet not found');
    }
    
    const updated: WeekTimesheet = {
      ...timesheets[index],
      status: 'rejected',
      updatedAt: new Date().toISOString(),
    };
    
    timesheets[index] = updated;
    saveTimesheets(timesheets);
    
    return updated;
  },

  // Get pending timesheets (for managers)
  async getPendingTimesheets(): Promise<WeekTimesheet[]> {
    await delay(300);
    const timesheets = getAllTimesheets();
    return timesheets
      .filter(t => t.status === 'submitted')
      .map(t => updateTimesheetTotals(t))
      .sort((a, b) => {
        const dateA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
        const dateB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
        return dateB - dateA;
      });
  },
};

