// features/workorders/hooks/useWorkOrderForm.ts
// Work Order Form State Hook
// Compliant met prompt.git: Max 200 regels

import { useState } from 'react';
import type { NewOrderForm } from '../types';
import { validateNewOrder } from '../utils';

interface UseWorkOrderFormProps {
  initialAssignedTo: string;
  onSubmit: (form: NewOrderForm) => void;
  onCancel: () => void;
}

export const useWorkOrderForm = ({
  initialAssignedTo,
  onSubmit,
  onCancel,
}: UseWorkOrderFormProps) => {
  const [form, setForm] = useState<NewOrderForm>({
    title: '',
    description: '',
    assignedTo: initialAssignedTo,
    customerId: '',
    location: '',
    scheduledDate: '',
    pendingReason: '',
    sortIndex: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPendingReason, setShowPendingReason] = useState(false);

  // Update form field
  const updateField = <K extends keyof NewOrderForm>(
    field: K,
    value: NewOrderForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validate and submit
  const handleSubmit = () => {
    const validationError = validateNewOrder(form);
    if (validationError) {
      setErrors({ general: validationError });
      return false;
    }

    onSubmit(form);
    resetForm();
    return true;
  };

  // Reset form
  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      assignedTo: initialAssignedTo,
      customerId: '',
      location: '',
      scheduledDate: '',
      pendingReason: '',
      sortIndex: undefined,
    });
    setErrors({});
    setShowPendingReason(false);
  };

  // Cancel and reset
  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  return {
    form,
    errors,
    showPendingReason,
    setShowPendingReason,
    updateField,
    handleSubmit,
    handleCancel,
    resetForm,
  };
};
