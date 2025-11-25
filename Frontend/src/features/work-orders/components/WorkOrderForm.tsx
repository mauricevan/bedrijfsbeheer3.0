import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, X, Search } from 'lucide-react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Combobox } from '@/components/common/Combobox';
import type { WorkOrder, WorkOrderMaterial, CreateWorkOrderInput } from '../types';
import type { InventoryItem } from '@/features/inventory/types/inventory.types';
import { useCRM } from '@/features/crm/hooks/useCRM';
import { useInventory } from '@/features/inventory/hooks/useInventory';
import { useHRM } from '@/features/hrm/hooks/useHRM';

interface WorkOrderFormProps {
  workOrder?: WorkOrder | null;
  onSubmit: (data: CreateWorkOrderInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const WorkOrderForm: React.FC<WorkOrderFormProps> = ({ workOrder, onSubmit, onCancel, isLoading }) => {
  const { customers } = useCRM();
  const { items: inventoryItems, categories, suppliers } = useInventory();
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
  const [materialSearchTerm, setMaterialSearchTerm] = useState('');
  const [materialCategoryFilter, setMaterialCategoryFilter] = useState('');
  const [materialSupplierFilter, setMaterialSupplierFilter] = useState('');
  const [materialLocationFilter, setMaterialLocationFilter] = useState('');
  const [materialStockFilter, setMaterialStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');

  // Convert customers to Combobox options
  const customerOptions = useMemo(() => 
    customers.map(customer => ({
      value: customer.id,
      label: customer.name,
      subtitle: customer.email || customer.company,
    })), [customers]
  );

  // Convert employees to Combobox options
  const employeeOptions = useMemo(() =>
    employees.map(emp => ({
      value: emp.id,
      label: emp.name,
      subtitle: emp.email,
    })), [employees]
  );

  // Get unique locations from inventory items
  const uniqueLocations = useMemo(() => {
    const locations = inventoryItems
      .map(item => item.location)
      .filter((loc): loc is string => !!loc);
    return Array.from(new Set(locations)).sort();
  }, [inventoryItems]);

  // Filter inventory items for material selector
  const filteredInventoryItems = useMemo(() => {
    let filtered = inventoryItems;

    // Search filter
    if (materialSearchTerm) {
      const search = materialSearchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(search) ||
        item.sku?.toLowerCase().includes(search) ||
        item.supplierSku?.toLowerCase().includes(search) ||
        item.customSku?.toLowerCase().includes(search)
      );
    }

    // Category filter
    if (materialCategoryFilter) {
      filtered = filtered.filter(item => item.categoryId === materialCategoryFilter);
    }

    // Supplier filter
    if (materialSupplierFilter) {
      filtered = filtered.filter(item => item.supplierId === materialSupplierFilter);
    }

    // Location filter
    if (materialLocationFilter) {
      filtered = filtered.filter(item => item.location === materialLocationFilter);
    }

    // Stock status filter
    if (materialStockFilter !== 'all') {
      filtered = filtered.filter(item => {
        if (materialStockFilter === 'in_stock') {
          return item.quantity > item.reorderLevel;
        } else if (materialStockFilter === 'low_stock') {
          return item.quantity > 0 && item.quantity <= item.reorderLevel;
        } else if (materialStockFilter === 'out_of_stock') {
          return item.quantity === 0;
        }
        return true;
      });
    }

    return filtered;
  }, [inventoryItems, materialSearchTerm, materialCategoryFilter, materialSupplierFilter, materialLocationFilter, materialStockFilter]);

  const resetMaterialFilters = () => {
    setMaterialSearchTerm('');
    setMaterialCategoryFilter('');
    setMaterialSupplierFilter('');
    setMaterialLocationFilter('');
    setMaterialStockFilter('all');
  };

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

  const addInventoryItem = (inventoryItem: InventoryItem) => {
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
          <Combobox
            options={employeeOptions}
            value={formData.assignedTo}
            onChange={(value) => setFormData({ ...formData, assignedTo: value })}
            placeholder="Selecteer medewerker"
            searchPlaceholder="Zoek medewerker..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Klant
          </label>
          <Combobox
            options={customerOptions}
            value={formData.customerId}
            onChange={(value) => setFormData({ ...formData, customerId: value })}
            placeholder="Selecteer klant"
            searchPlaceholder="Zoek klant..."
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
          <div className="mb-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Selecteer uit voorraad</span>
              <button
                type="button"
                onClick={() => {
                  setShowInventorySelector(false);
                  resetMaterialFilters();
                }}
                className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="mb-3 relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={materialSearchTerm}
                onChange={(e) => setMaterialSearchTerm(e.target.value)}
                placeholder="Zoek op naam, SKU..."
                className="w-full pl-8 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Filter Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
              {/* Category Filter */}
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Categorie
                </label>
                <select
                  value={materialCategoryFilter}
                  onChange={(e) => setMaterialCategoryFilter(e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Alle categorieën</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Supplier Filter */}
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Leverancier
                </label>
                <select
                  value={materialSupplierFilter}
                  onChange={(e) => setMaterialSupplierFilter(e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Alle leveranciers</option>
                  {suppliers.map(supplier => (
                    <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Locatie
                </label>
                <select
                  value={materialLocationFilter}
                  onChange={(e) => setMaterialLocationFilter(e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Alle locaties</option>
                  {uniqueLocations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              {/* Stock Status Filter */}
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Voorraadstatus
                </label>
                <select
                  value={materialStockFilter}
                  onChange={(e) => setMaterialStockFilter(e.target.value as typeof materialStockFilter)}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">Alle</option>
                  <option value="in_stock">Op voorraad</option>
                  <option value="low_stock">Lage voorraad</option>
                  <option value="out_of_stock">Niet op voorraad</option>
                </select>
              </div>
            </div>

            {/* Clear Filters Button */}
            {(materialCategoryFilter || materialSupplierFilter || materialLocationFilter || materialStockFilter !== 'all' || materialSearchTerm) && (
              <div className="mb-3">
                <button
                  type="button"
                  onClick={resetMaterialFilters}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Filters wissen
                </button>
              </div>
            )}

            {/* Results Count */}
            <div className="mb-2 text-xs text-slate-500 dark:text-slate-400">
              {filteredInventoryItems.length} {filteredInventoryItems.length === 1 ? 'materiaal' : 'materialen'} gevonden
            </div>

            {/* Filtered Items List */}
            <div className="max-h-60 overflow-y-auto space-y-1">
              {filteredInventoryItems.length === 0 ? (
                <div className="px-3 py-4 text-sm text-slate-500 dark:text-slate-400 text-center">
                  Geen materialen gevonden. Pas de filters aan.
                </div>
              ) : (
                filteredInventoryItems.map(item => {
                  const category = categories.find(c => c.id === item.categoryId);
                  const supplier = suppliers.find(s => s.id === item.supplierId);
                  const isLowStock = item.quantity > 0 && item.quantity <= item.reorderLevel;
                  const isOutOfStock = item.quantity === 0;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        addInventoryItem(item);
                        resetMaterialFilters();
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-sm border border-transparent hover:border-slate-300 dark:hover:border-slate-600"
                    >
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <div className="flex flex-wrap gap-2">
                          <span className={isOutOfStock ? 'text-red-600 dark:text-red-400' : isLowStock ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}>
                            {item.quantity} {item.unit} beschikbaar
                          </span>
                          {item.sku && <span>• SKU: {item.sku}</span>}
                          {category && <span>• {category.name}</span>}
                          {supplier && <span>• {supplier.name}</span>}
                          {item.location && <span>• Locatie: {item.location}</span>}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
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

