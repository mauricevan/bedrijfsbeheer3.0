import { useState, useCallback } from 'react';
import { customerWarningService } from '../services/customerWarningService';
import type { CustomerWarningNote } from '../types/crm.types';
import { useAuth } from '@/features/auth/hooks/useAuth';

export const useCustomerWarnings = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const addWarningNote = useCallback(
    async (customerId: string, note: string): Promise<CustomerWarningNote> => {
      if (!user?.id) {
        throw new Error('User must be logged in to add warning notes');
      }

      setIsLoading(true);
      try {
        const newNote = await customerWarningService.addWarningNote(
          customerId,
          note,
          user.id
        );
        return newNote;
      } finally {
        setIsLoading(false);
      }
    },
    [user?.id]
  );

  const updateWarningNote = useCallback(
    async (
      customerId: string,
      noteId: string,
      updates: Partial<Pick<CustomerWarningNote, 'note' | 'isActive'>>
    ): Promise<CustomerWarningNote> => {
      setIsLoading(true);
      try {
        const updated = await customerWarningService.updateWarningNote(
          customerId,
          noteId,
          updates
        );
        return updated;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const deleteWarningNote = useCallback(
    async (customerId: string, noteId: string): Promise<void> => {
      setIsLoading(true);
      try {
        await customerWarningService.deleteWarningNote(customerId, noteId);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getActiveWarnings = useCallback(
    async (customerId: string): Promise<CustomerWarningNote[]> => {
      setIsLoading(true);
      try {
        return await customerWarningService.getActiveWarningNotes(customerId);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getAllWarnings = useCallback(
    async (customerId: string): Promise<CustomerWarningNote[]> => {
      setIsLoading(true);
      try {
        return await customerWarningService.getWarningNotes(customerId);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const hasActiveWarnings = useCallback(
    async (customerId: string): Promise<boolean> => {
      try {
        return await customerWarningService.hasActiveWarnings(customerId);
      } catch {
        return false;
      }
    },
    []
  );

  return {
    addWarningNote,
    updateWarningNote,
    deleteWarningNote,
    getActiveWarnings,
    getAllWarnings,
    hasActiveWarnings,
    isLoading,
  };
};

