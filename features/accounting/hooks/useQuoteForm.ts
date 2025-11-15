// features/accounting/hooks/useQuoteForm.ts - Refactored < 200 lines
import { useState, useCallback } from 'react';
import type { QuoteItem, QuoteLabor, InventoryItem } from '../../../types';
import { useForm } from './useForm';
import { validateQuoteForm } from '../utils/validators';
import { calculateQuoteTotals } from '../utils/calculations';

/**
 * Quote form data interface
 */
export interface QuoteFormData {
  customerId: string;
  items: QuoteItem[];
  labor: QuoteLabor[];
  vatRate: number;
  notes: string;
  validUntil: string;
}

/**
 * Quote form hook type
 */
export type QuoteFormHook = ReturnType<typeof useQuoteForm>;

const initialFormData: QuoteFormData = {
  customerId: '',
  items: [],
  labor: [],
  vatRate: 21,
  notes: '',
  validUntil: '',
};

/**
 * Hook for managing quote form state and handlers
 */
export const useQuoteForm = (inventory: InventoryItem[] = []) => {
  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null);
  const form = useForm<QuoteFormData>(initialFormData, (data) => validateQuoteForm(data));

  const totals = useCallback(() => {
    return calculateQuoteTotals(form.formData.items, form.formData.labor, form.formData.vatRate);
  }, [form.formData.items, form.formData.labor, form.formData.vatRate]);

  const handleAddInventoryItem = useCallback(() => {
    form.handleNestedChange('items', (items) => [
      ...items,
      { inventoryItemId: '', description: '', quantity: 1, pricePerUnit: 0, total: 0 },
    ]);
  }, [form]);

  const handleAddCustomItem = useCallback(() => {
    form.handleNestedChange('items', (items) => [
      ...items,
      { description: '', quantity: 1, pricePerUnit: 0, total: 0 },
    ]);
  }, [form]);

  const handleAddLabor = useCallback(() => {
    form.handleNestedChange('labor', (labor) => [
      ...labor,
      { description: '', hours: 1, hourlyRate: 50, total: 50 },
    ]);
  }, [form]);

  const handleRemoveItem = useCallback(
    (index: number) => {
      form.handleNestedChange('items', (items) => items.filter((_, i) => i !== index));
    },
    [form]
  );

  const handleRemoveLabor = useCallback(
    (index: number) => {
      form.handleNestedChange('labor', (labor) => labor.filter((_, i) => i !== index));
    },
    [form]
  );

  const handleInventoryItemChange = useCallback(
    (index: number, inventoryItemId: string) => {
      const inventoryItem = inventory.find((i) => i.id === inventoryItemId);
      if (inventoryItem) {
        form.handleNestedChange('items', (items) => {
          const updated = [...items];
          updated[index] = {
            ...updated[index],
            inventoryItemId,
            description: inventoryItem.name,
            pricePerUnit: inventoryItem.price || 0,
            total: updated[index].quantity * (inventoryItem.price || 0),
          };
          return updated;
        });
      }
    },
    [form, inventory]
  );

  const handleItemChange = useCallback(
    (index: number, field: keyof QuoteItem, value: any) => {
      form.handleNestedChange('items', (items) => {
        const updated = [...items];
        updated[index] = { ...updated[index], [field]: value };
        if (field === 'quantity' || field === 'pricePerUnit') {
          updated[index].total = updated[index].quantity * updated[index].pricePerUnit;
        }
        return updated;
      });
    },
    [form]
  );

  const handleLaborChange = useCallback(
    (index: number, field: keyof QuoteLabor, value: any) => {
      form.handleNestedChange('labor', (labor) => {
        const updated = [...labor];
        updated[index] = { ...updated[index], [field]: value };
        if (field === 'hours' || field === 'hourlyRate') {
          updated[index].total = updated[index].hours * updated[index].hourlyRate;
        }
        return updated;
      });
    },
    [form]
  );

  const loadQuoteForEditing = useCallback(
    (quote: {
      customerId: string;
      items: QuoteItem[];
      labor?: QuoteLabor[];
      vatRate: number;
      notes?: string;
      validUntil: string;
    }) => {
      form.setFields({
        customerId: quote.customerId,
        items: quote.items,
        labor: quote.labor || [],
        vatRate: quote.vatRate,
        notes: quote.notes || '',
        validUntil: quote.validUntil,
      });
    },
    [form]
  );

  const resetForm = useCallback(() => {
    form.reset();
    setEditingQuoteId(null);
  }, [form]);

  return {
    formData: form.formData,
    errors: form.errors,
    isSubmitting: form.isSubmitting,
    hasErrors: form.hasErrors,
    editingQuoteId,
    setEditingQuoteId,
    handleChange: form.handleChange,
    handleNestedChange: form.handleNestedChange,
    setFields: form.setFields,
    validate: form.validate,
    reset: resetForm,
    handleAddInventoryItem,
    handleAddCustomItem,
    handleAddLabor,
    handleRemoveItem,
    handleRemoveLabor,
    handleInventoryItemChange,
    handleItemChange,
    handleLaborChange,
    loadQuoteForEditing,
    totals,
  };
};
