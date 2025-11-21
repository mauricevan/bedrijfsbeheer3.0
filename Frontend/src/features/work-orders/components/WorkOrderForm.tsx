import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import type { WorkOrder, WorkOrderMaterial } from '../types';
import { useCRM } from '@/features/crm/hooks/useCRM';
import { useInventory } from '@/features/inventory/hooks/useInventory';
import { useHRM } from '@/features/hrm/hooks/useHRM';

interface WorkOrderFormProps {
  workOrder?: WorkOrder | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const WorkOrderForm: React.FC<WorkOrderFormProps> = ({ workOrder, onSubmit, onCancel, isLoading }) => {
  const { customers } = useCRM();
  const { items: inventoryItems } = useInventory();
  const { employees } = useHRM();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo' as WorkOrder['status'],
    assignedTo: '',
    customerId: '',
    location: '',
    scheduledDate: '',
    estimatedHours: '',
    estimatedCost: '',
    notes: '',
    pendingReason: '',
  });
  const [materials, setMaterials] = useState<WorkOrderMaterial[]>([]);
  const [showInventorySelector, setShowInventorySelector] = useState(false);

  useEffect(() => {
    if (workOrder) {
      setFormData({
        title: workOrder.title || '',
        description: workOrder.description || '',
        status: workOrder.status || 'todo',
        assignedTo: workOrder.assignedTo || '',
        customerId: workOrder.customerId || '',
        location: workOrder.location || '',
        scheduledDate: workOrder.scheduledDate ? new Date(workOrder.scheduledDate).toISOString().split('T')[0] : '',
        estimatedHours: workOrder.estimatedHours?.toString() || '',
        estimatedCost: workOrder.estimatedCost?.toString() || '',
        notes: workOrder.notes || '',
        pendingReason: workOrder.pendingReason || '',
      });
      setMaterials(workOrder.materials || []);
    }
  }, [workOrder]);

  const addMaterial = () => {
    const newMaterial: WorkOrderMaterial = {
      inventoryItemId: '',
      name: '',
      quantity: 1,
      unit: 'stuks',
    };
    setMaterials([...materials, newMaterial]);
  };

  const updateMaterial = (index: number, updates: Partial<WorkOrderMaterial>) => {
    setMaterials(items => items.map((item, i) => i === index ? { ...item, ...updates } : item));
  };

  const removeMaterial = (index: number) => {
    setMaterials(items => items.filter((_, i) => i !== index));
  };

  const addInventoryItem = (inventoryItem: any) => {
    const newMaterial: WorkOrderMaterial = {
      inventoryItemId: inventoryItem.id,
      name: inventoryItem.name,
      quantity: 1,
      unit: inventoryItem.unit || 'stuks',
    };
    setMaterials([...materials, newMaterial]);
    setShowInventorySelector(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      assignedTo: formData.assignedTo || undefined,
      customerId: formData.customerId || undefined,
      location: formData.location || undefined,
      scheduledDate: formData.scheduledDate || undefined,
      estimatedHours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : 0,
      estimatedCost: formData.estimatedCost ? parseFloat(formData.estimatedCost) : 0,
      materials,
      notes: formData.notes || undefined,
      pendingReason: formData.status === 'pending' ? formData.pendingReason : undefined,
      hoursSpent: workOrder?.hoursSpent || 0,
      sortIndex: workOrder?.sortIndex || 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Titel *
          </label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Beschrijving *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as WorkOrder['status'] })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="todo">Te Doen</option>
            <option value="pending">In Afwachting</option>
            <option value="in_progress">Bezig</option>
            <option value="completed">Voltooid</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Toegewezen aan
          </label>
          <select
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="">Selecteer medewerker</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Klant
          </label>
          <select
            value={formData.customerId}
            onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="">Selecteer klant</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>{customer.name}</option>
            ))}
          </select>
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
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Geschatte uren
          </label>
          <Input
            type="number"
            value={formData.estimatedHours}
            onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Geschatte kosten (€)
          </label>
          <Input
            type="number"
            value={formData.estimatedCost}
            onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
          />
        </div>
        {formData.status === 'pending' && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Reden voor afwachting
            </label>
            <Input
              value={formData.pendingReason}
              onChange={(e) => setFormData({ ...formData, pendingReason: e.target.value })}
            />
          </div>
        )}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Notities
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Materials */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Benodigde Materialen</h3>
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
              onClick={addMaterial}
            >
              Materiaal Toevoegen
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
                  {item.name} - {item.quantity} {item.unit} beschikbaar
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {materials.map((material, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
              <div className="col-span-12 md:col-span-5">
                <Input
                  placeholder="Materiaal naam"
                  value={material.name}
                  onChange={(e) => updateMaterial(index, { name: e.target.value })}
                  required
                />
              </div>
              <div className="col-span-4 md:col-span-2">
                <Input
                  type="number"
                  placeholder="Aantal"
                  value={material.quantity}
                  onChange={(e) => updateMaterial(index, { quantity: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
              <div className="col-span-4 md:col-span-2">
                <Input
                  placeholder="Eenheid"
                  value={material.unit}
                  onChange={(e) => updateMaterial(index, { unit: e.target.value })}
                />
              </div>
              <div className="col-span-4 md:col-span-2 flex items-center">
                {material.inventoryItemId && (
                  <span className="text-xs text-slate-500 dark:text-slate-400">Uit voorraad</span>
                )}
              </div>
              <div className="col-span-4 md:col-span-1">
                <button
                  type="button"
                  onClick={() => removeMaterial(index)}
                  className="p-2 text-red-600 hover:text-red-700 dark:hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {materials.length === 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
              Geen materialen toegevoegd. Klik op "Materiaal Toevoegen" om te beginnen.
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuleren
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {workOrder ? 'Bijwerken' : 'Aanmaken'}
        </Button>
      </div>
    </form>
  );
};

