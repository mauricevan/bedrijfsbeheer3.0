// features/accounting/hooks/useInvoiceForm.ts - Refactored < 200 lines
import { useState, useCallback } from 'react';
import type { QuoteItem, QuoteLabor, InventoryItem } from '../../../types';
import { useForm } from './useForm';
import { validateInvoiceForm } from '../utils/validators';
import { calculateInvoiceTotals } from '../utils/calculations';

/**
 * Invoice form data interface
 */
export interface InvoiceFormData {
  customerId: string;
  items: QuoteItem[];
  labor: QuoteLabor[];
  vatRate: number;
  notes: string;
  paymentTerms: string;
  issueDate: string;
  dueDate: string;
}

/**
 * Invoice form hook type
 */
export type InvoiceFormHook = ReturnType<typeof useInvoiceForm>;

const initialFormData: InvoiceFormData = {
  customerId: '',
  items: [],
  labor: [],
  vatRate: 21,
  notes: '',
  paymentTerms: '14 dagen',
  issueDate: '',
  dueDate: '',
};

/**
 * Hook for managing invoice form state and handlers
 */
export const useInvoiceForm = (inventory: InventoryItem[] = []) => {
  const [editingInvoiceId, setEditingInvoiceId] = useState<string | null>(null);
  const form = useForm<InvoiceFormData>(initialFormData, (data) => validateInvoiceForm(data));

  const totals = useCallback(() => {
    return calculateInvoiceTotals(form.formData.items, form.formData.labor, form.formData.vatRate);
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

  const loadInvoiceForEditing = useCallback(
    (invoice: {
      customerId: string;
      items: QuoteItem[];
      labor?: QuoteLabor[];
      vatRate: number;
      notes?: string;
      paymentTerms?: string;
      issueDate: string;
      dueDate: string;
    }) => {
      form.setFields({
        customerId: invoice.customerId,
        items: invoice.items,
        labor: invoice.labor || [],
        vatRate: invoice.vatRate,
        notes: invoice.notes || '',
        paymentTerms: invoice.paymentTerms || '14 dagen',
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
      });
    },
    [form]
  );

  const resetForm = useCallback(() => {
    form.reset();
    setEditingInvoiceId(null);
  }, [form]);

  return {
    formData: form.formData,
    errors: form.errors,
    isSubmitting: form.isSubmitting,
    hasErrors: form.hasErrors,
    editingInvoiceId,
    setEditingInvoiceId,
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
    loadInvoiceForEditing,
    totals,
  };
};
