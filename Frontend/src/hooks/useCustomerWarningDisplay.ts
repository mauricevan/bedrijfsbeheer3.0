import { useState, useCallback, useEffect } from 'react';
import { warningConfigService, type WarningArea } from '@/features/crm/services/warningConfigService';
import { customerWarningService } from '@/features/crm/services/customerWarningService';
import type { CustomerWarningNote } from '@/features/crm/types/crm.types';

interface UseCustomerWarningDisplayReturn {
  checkAndShowWarning: (customerId: string, area: WarningArea) => Promise<boolean>;
  shouldShowWarning: (area: WarningArea) => boolean;
  showModal: boolean;
  warningNotes: CustomerWarningNote[];
  customerId: string | null;
  acknowledgeWarning: () => void;
}

export const useCustomerWarningDisplay = (): UseCustomerWarningDisplayReturn => {
  const [showModal, setShowModal] = useState(false);
  const [warningNotes, setWarningNotes] = useState<CustomerWarningNote[]>([]);
  const [customerId, setCustomerId] = useState<string | null>(null);

  const shouldShowWarning = useCallback((area: WarningArea): boolean => {
    return warningConfigService.shouldShowWarning(area);
  }, []);

  const checkAndShowWarning = useCallback(
    async (customerId: string, area: WarningArea): Promise<boolean> => {
      // Check if warnings are enabled for this area
      if (!shouldShowWarning(area)) {
        return false;
      }

      // Check if customer has active warnings
      const hasWarnings = await customerWarningService.hasActiveWarnings(customerId);
      
      if (hasWarnings) {
        const activeNotes = await customerWarningService.getActiveWarningNotes(customerId);
        setWarningNotes(activeNotes);
        setCustomerId(customerId);
        setShowModal(true);
        return true;
      }

      return false;
    },
    [shouldShowWarning]
  );

  const acknowledgeWarning = useCallback(() => {
    setShowModal(false);
    setWarningNotes([]);
    setCustomerId(null);
  }, []);

  return {
    checkAndShowWarning,
    shouldShowWarning,
    showModal,
    warningNotes,
    customerId,
    acknowledgeWarning,
  };
};

