import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import type { Invoice, LineItem, LaborItem, CreateInvoiceInput } from '../types';
import type { InventoryItem } from '@/features/inventory/types/inventory.types';
import { useCRM } from '@/features/crm/hooks/useCRM';
import { useInventory } from '@/features/inventory/hooks/useInventory';

interface InvoiceFormProps {
  invoice?: Invoice | null;
  onSubmit: (data: CreateInvoiceInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoice, onSubmit, onCancel, isLoading }) => {
  const { customers } = useCRM();
  const { items: inventoryItems } = useInventory();
  const [formData, setFormData] = useState({
    customerId: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentTerms: '30',
    location: '',
    scheduledDate: '',
    notes: '',
  });
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [laborItems, setLaborItems] = useState<LaborItem[]>([]);
  const [showInventorySelector, setShowInventorySelector] = useState(false);

  useEffect(() => {
    if (invoice) {
      setFormData({
        customerId: invoice.customerId || '',
        issueDate: invoice.issueDate ? new Date(invoice.issueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        dueDate: invoice.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] : '',
        paymentTerms: invoice.paymentTerms || '30',
        location: invoice.location || '',
        scheduledDate: invoice.scheduledDate ? new Date(invoice.scheduledDate).toISOString().split('T')[0] : '',
        notes: invoice.notes || '',
      });
      setLineItems(invoice.items || []);
      setLaborItems(invoice.labor || []);
    }
  }, [invoice]);

  const calculateTotals = () => {
    const itemsSubtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
    const laborSubtotal = laborItems.reduce((sum, item) => sum + item.total, 0);
    const subtotal = itemsSubtotal + laborSubtotal;
    
    const vat21 = lineItems.filter(i => i.vatRate === 21).reduce((sum, i) => sum + (i.total * 0.21), 0);
    const vat9 = lineItems.filter(i => i.vatRate === 9).reduce((sum, i) => sum + (i.total * 0.09), 0);
    const totalVat = vat21 + vat9;
    
    return { subtotal, totalVat, total: subtotal + totalVat };
  };

  const addLineItem = () => {
    const newItem: LineItem = {
      id: `item-${Date.now()}`,
      description: '',
      quantity: 1,
      unitPrice: 0,
      vatRate: 21,
      discount: 0,
      total: 0,
    };
    setLineItems([...lineItems, newItem]);
  };

  const updateLineItem = (id: string, updates: Partial<LineItem>) => {
    setLineItems(items => items.map(item => {
      if (item.id === id) {
        const updated = { ...item, ...updates };
        const subtotal = updated.quantity * updated.unitPrice;
        const discountAmount = subtotal * (updated.discount / 100);
        updated.total = subtotal - discountAmount;
        return updated;
      }
      return item;
    }));
  };

  const removeLineItem = (id: string) => {
    setLineItems(items => items.filter(item => item.id !== id));
  };

  const addLaborItem = () => {
    const newItem: LaborItem = {
      id: `labor-${Date.now()}`,
      description: '',
      hours: 1,
      hourlyRate: 0,
      total: 0,
    };
    setLaborItems([...laborItems, newItem]);
  };

  const updateLaborItem = (id: string, updates: Partial<LaborItem>) => {
    setLaborItems(items => items.map(item => {
      if (item.id === id) {
        const updated = { ...item, ...updates };
        updated.total = updated.hours * updated.hourlyRate;
        return updated;
      }
      return item;
    }));
  };

  const removeLaborItem = (id: string) => {
    setLaborItems(items => items.filter(item => item.id !== id));
  };

  const addInventoryItem = (inventoryItem: InventoryItem) => {
    const newItem: LineItem = {
      id: `item-${Date.now()}`,
      description: inventoryItem.name,
      quantity: 1,
      unitPrice: inventoryItem.salePrice,
      vatRate: inventoryItem.vatRate as 0 | 9 | 21,
      discount: 0,
      total: inventoryItem.salePrice,
      inventoryItemId: inventoryItem.id,
    };
    setLineItems([...lineItems, newItem]);
    setShowInventorySelector(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totals = calculateTotals();
    const customer = customers.find(c => c.id === formData.customerId);
    
    onSubmit({
      customerId: formData.customerId,
      customerName: customer?.name || '',
      customerEmail: customer?.email,
      status: invoice?.status || 'draft',
      items: lineItems,
      labor: laborItems.length > 0 ? laborItems : undefined,
      subtotal: totals.subtotal,
      totalVat: totals.totalVat,
      total: totals.total,
      issueDate: formData.issueDate,
      dueDate: formData.dueDate,
      paymentTerms: formData.paymentTerms,
      location: formData.location || undefined,
      scheduledDate: formData.scheduledDate || undefined,
      notes: formData.notes || undefined,
    });
  };

  const totals = calculateTotals();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Klant *
          </label>
          <select
            value={formData.customerId}
            onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            required
          >
            <option value="">Selecteer klant</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>{customer.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Factuurdatum *
          </label>
          <Input
            type="date"
            value={formData.issueDate}
            onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Vervaldatum *
          </label>
          <Input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Betaaltermijn (dagen)
          </label>
          <Input
            type="number"
            value={formData.paymentTerms}
            onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Locatie
          </label>
          <Input
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Geplande datum
          </label>
          <Input
            type="date"
            value={formData.scheduledDate}
            onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
          />
        </div>
      </div>

      {/* Line Items */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Artikelen</h3>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowInventorySelector(!showInventorySelector)}
            >
              Uit Voorraad
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={addLineItem}
            >
              Artikel Toevoegen
            </Button>
          </div>
        </div>

        {showInventorySelector && (
          <div className="mb-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 max-h-60 overflow-y-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Selecteer uit voorraad</span>
              <button
                type="button"
                onClick={() => setShowInventorySelector(false)}
                className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-1">
              {inventoryItems.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => addInventoryItem(item)}
                  className="w-full text-left px-3 py-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-sm"
                >
                  {item.name} - €{item.salePrice.toFixed(2)}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {lineItems.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
              <div className="col-span-12 md:col-span-4">
                <Input
                  placeholder="Beschrijving"
                  value={item.description}
                  onChange={(e) => updateLineItem(item.id, { description: e.target.value })}
                  required
                />
              </div>
              <div className="col-span-4 md:col-span-1">
                <Input
                  type="number"
                  placeholder="Aantal"
                  value={item.quantity}
                  onChange={(e) => updateLineItem(item.id, { quantity: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
              <div className="col-span-4 md:col-span-2">
                <Input
                  type="number"
                  placeholder="Prijs"
                  value={item.unitPrice}
                  onChange={(e) => updateLineItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
              <div className="col-span-4 md:col-span-1">
                <select
                  value={item.vatRate}
                  onChange={(e) => updateLineItem(item.id, { vatRate: parseInt(e.target.value) as 0 | 9 | 21 })}
                  className="w-full px-2 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                >
                  <option value="21">21%</option>
                  <option value="9">9%</option>
                  <option value="0">0%</option>
                </select>
              </div>
              <div className="col-span-4 md:col-span-1">
                <Input
                  type="number"
                  placeholder="Korting %"
                  value={item.discount}
                  onChange={(e) => updateLineItem(item.id, { discount: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="col-span-4 md:col-span-2 flex items-center">
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  €{item.total.toFixed(2)}
                </span>
              </div>
              <div className="col-span-4 md:col-span-1">
                <button
                  type="button"
                  onClick={() => removeLineItem(item.id)}
                  className="p-2 text-red-600 hover:text-red-700 dark:hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {lineItems.length === 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
              Geen artikelen toegevoegd. Klik op "Artikel Toevoegen" om te beginnen.
            </p>
          )}
        </div>
      </div>

      {/* Labor Items */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Arbeid (optioneel)</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={addLaborItem}
          >
            Arbeid Toevoegen
          </Button>
        </div>
        <div className="space-y-3">
          {laborItems.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
              <div className="col-span-12 md:col-span-5">
                <Input
                  placeholder="Beschrijving"
                  value={item.description}
                  onChange={(e) => updateLaborItem(item.id, { description: e.target.value })}
                />
              </div>
              <div className="col-span-4 md:col-span-2">
                <Input
                  type="number"
                  placeholder="Uren"
                  value={item.hours}
                  onChange={(e) => updateLaborItem(item.id, { hours: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="col-span-4 md:col-span-2">
                <Input
                  type="number"
                  placeholder="Uurtarief"
                  value={item.hourlyRate}
                  onChange={(e) => updateLaborItem(item.id, { hourlyRate: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="col-span-4 md:col-span-2 flex items-center">
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  €{item.total.toFixed(2)}
                </span>
              </div>
              <div className="col-span-4 md:col-span-1">
                <button
                  type="button"
                  onClick={() => removeLaborItem(item.id)}
                  className="p-2 text-red-600 hover:text-red-700 dark:hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Subtotaal (excl. BTW)</span>
            <span className="font-medium text-slate-900 dark:text-white">€{totals.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">BTW</span>
            <span className="font-medium text-slate-900 dark:text-white">€{totals.totalVat.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t border-slate-200 dark:border-slate-700 pt-2">
            <span className="text-slate-900 dark:text-white">Totaal (incl. BTW)</span>
            <span className="text-indigo-600 dark:text-indigo-400">€{totals.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Notities
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuleren
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {invoice ? 'Bijwerken' : 'Aanmaken'}
        </Button>
      </div>
    </form>
  );
};

