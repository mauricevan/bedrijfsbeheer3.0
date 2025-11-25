import type { CustomerWarningNote } from '../types/crm.types';
import { storage } from '@/utils/storage';

const WARNING_NOTES_KEY = 'bedrijfsbeheer_customer_warnings';

// Store warnings as a map: customerId -> CustomerWarningNote[]
type WarningNotesMap = Record<string, CustomerWarningNote[]>;

const getWarningNotesMap = (): WarningNotesMap => {
  return storage.get<WarningNotesMap>(WARNING_NOTES_KEY, {});
};

const saveWarningNotesMap = (map: WarningNotesMap) => {
  storage.set(WARNING_NOTES_KEY, map);
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const customerWarningService = {
  /**
   * Get all warning notes for a customer
   */
  getWarningNotes: async (customerId: string): Promise<CustomerWarningNote[]> => {
    await delay(200);
    const map = getWarningNotesMap();
    return map[customerId] || [];
  },

  /**
   * Get only active warning notes for a customer
   */
  getActiveWarningNotes: async (customerId: string): Promise<CustomerWarningNote[]> => {
    const allNotes = await customerWarningService.getWarningNotes(customerId);
    return allNotes.filter(note => note.isActive);
  },

  /**
   * Add a warning note to a customer
   */
  addWarningNote: async (
    customerId: string,
    note: string,
    userId: string
  ): Promise<CustomerWarningNote> => {
    await delay(300);
    const map = getWarningNotesMap();
    const existingNotes = map[customerId] || [];

    const newNote: CustomerWarningNote = {
      id: `warn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      note,
      createdAt: new Date().toISOString(),
      createdBy: userId,
      isActive: true,
    };

    map[customerId] = [...existingNotes, newNote];
    saveWarningNotesMap(map);

    return newNote;
  },

  /**
   * Update a warning note
   */
  updateWarningNote: async (
    customerId: string,
    noteId: string,
    updates: Partial<Pick<CustomerWarningNote, 'note' | 'isActive'>>
  ): Promise<CustomerWarningNote> => {
    await delay(300);
    const map = getWarningNotesMap();
    const notes = map[customerId] || [];
    const index = notes.findIndex(n => n.id === noteId);

    if (index === -1) {
      throw new Error('Warning note not found');
    }

    const updated = {
      ...notes[index],
      ...updates,
    };

    notes[index] = updated;
    map[customerId] = notes;
    saveWarningNotesMap(map);

    return updated;
  },

  /**
   * Delete a warning note
   */
  deleteWarningNote: async (customerId: string, noteId: string): Promise<void> => {
    await delay(300);
    const map = getWarningNotesMap();
    const notes = map[customerId] || [];
    const filtered = notes.filter(n => n.id !== noteId);

    if (filtered.length === 0) {
      delete map[customerId];
    } else {
      map[customerId] = filtered;
    }

    saveWarningNotesMap(map);
  },

  /**
   * Check if customer has active warnings
   */
  hasActiveWarnings: async (customerId: string): Promise<boolean> => {
    const activeNotes = await customerWarningService.getActiveWarningNotes(customerId);
    return activeNotes.length > 0;
  },
};

