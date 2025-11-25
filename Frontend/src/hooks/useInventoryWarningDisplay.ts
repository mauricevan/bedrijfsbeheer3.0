import { useState, useCallback } from 'react';
import { inventoryWarningService } from '@/features/inventory/services/inventoryWarningService';

interface UseInventoryWarningDisplayReturn {
  checkAndShowWarning: (itemId: string) => Promise<boolean>;
  shouldShowWarning: (itemId: string) => Promise<boolean>;
  showModal: boolean;
  warningNote: string | null;
  itemId: string | null;
  itemName: string | null;
  acknowledgeWarning: () => void;
}

export const useInventoryWarningDisplay = (): UseInventoryWarningDisplayReturn => {
  const [showModal, setShowModal] = useState(false);
  const [warningNote, setWarningNote] = useState<string | null>(null);
  const [itemId, setItemId] = useState<string | null>(null);
  const [itemName, setItemName] = useState<string | null>(null);

  const shouldShowWarning = useCallback(async (itemId: string): Promise<boolean> => {
    return await inventoryWarningService.hasActiveWarning(itemId);
  }, []);

  const checkAndShowWarning = useCallback(
    async (itemId: string): Promise<boolean> => {
      // Check if item has active warning
      const hasWarning = await inventoryWarningService.hasActiveWarning(itemId);
      
      if (hasWarning) {
        const note = await inventoryWarningService.getWarningNote(itemId);
        const item = await inventoryWarningService.getItem(itemId);
        
        if (note && item) {
          setWarningNote(note);
          setItemId(itemId);
          setItemName(item.name);
          setShowModal(true);
          return true;
        }
      }

      return false;
    },
    []
  );

  const acknowledgeWarning = useCallback(() => {
    setShowModal(false);
    setWarningNote(null);
    setItemId(null);
    setItemName(null);
  }, []);

  return {
    checkAndShowWarning,
    shouldShowWarning,
    showModal,
    warningNote,
    itemId,
    itemName,
    acknowledgeWarning,
  };
};

