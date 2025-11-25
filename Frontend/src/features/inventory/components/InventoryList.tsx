/**
 * InventoryList Component
 * Enhanced list view with multiple SKU types, quick adjustments, and BTW info
 */

import React, { useState } from 'react';
import { Edit, Trash2, AlertTriangle, Link as LinkIcon, Package } from 'lucide-react';
import type { InventoryItem, Category } from '../types';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { cn } from '@/utils/cn';
import { calculateMargin, calculatePriceInclBTW } from '../utils/btw';
import { useInventoryWarningDisplay } from '@/hooks/useInventoryWarningDisplay';
import { InventoryWarningModal } from '@/components/common/InventoryWarningModal';

type InventoryListProps = {
  items: InventoryItem[];
  categories: Category[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
  onQuickAdjust: (id: string, adjustment: number) => void;
  isLoading?: boolean;
};

export const InventoryList: React.FC<InventoryListProps> = ({
  items,
  categories,
  onEdit,
  onDelete,
  onQuickAdjust,
  isLoading
}) => {
  const [pendingEditItem, setPendingEditItem] = useState<InventoryItem | null>(null);
  const {
    checkAndShowWarning,
    showModal,
    warningNote,
    itemName,
    acknowledgeWarning,
  } = useInventoryWarningDisplay();

  const handleEdit = async (item: InventoryItem) => {
    // Check for warning first
    const hasWarning = await checkAndShowWarning(item.id);
    
    if (hasWarning) {
      // Store the item to edit after warning is acknowledged
      setPendingEditItem(item);
    } else {
      // No warning, edit directly
      onEdit(item);
    }
  };

  const handleAcknowledgeWarning = () => {
    acknowledgeWarning();
    
    // Edit pending item after warning is acknowledged
    if (pendingEditItem) {
      onEdit(pendingEditItem);
      setPendingEditItem(null);
    }
  };
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="Geen voorraaditems gevonden"
        description="Er zijn nog geen voorraaditems in het systeem. Voeg je eerste item toe om te beginnen."
        actionLabel="Nieuw Item Toevoegen"
        onAction={() => onEdit({} as InventoryItem)}
        suggestions={[
          "Voeg producten toe met naam, SKU en prijs",
          "Stel voorraadniveaus in voor automatische meldingen",
          "Koppel items aan categorieën voor betere organisatie"
        ]}
      />
    );
  }

  const getCategoryName = (id: string) => {
    const category = categories.find(c => c.id === id);
    return category?.name || '-';
  };

  const getSupplierName = (supplierId?: string) => {
    // This would come from suppliers prop if needed
    return supplierId || '-';
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
          <tr>
            <th className="px-4 py-3 font-medium">Naam</th>
            <th className="px-4 py-3 font-medium">SKU (Auto)</th>
            <th className="px-4 py-3 font-medium">SKU (Leverancier)</th>
            <th className="px-4 py-3 font-medium">SKU (Aangepast)</th>
            <th className="px-4 py-3 font-medium">Categorie</th>
            <th className="px-4 py-3 font-medium text-right">Voorraad</th>
            <th className="px-4 py-3 font-medium text-right">Aankoop €</th>
            <th className="px-4 py-3 font-medium text-right">Verkoop €</th>
            <th className="px-4 py-3 font-medium text-right">Marge %</th>
            <th className="px-4 py-3 font-medium text-right">BTW</th>
            <th className="px-4 py-3 font-medium text-right">Incl. BTW</th>
            <th className="px-4 py-3 font-medium">Leverancier</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Sync</th>
            <th className="px-4 py-3 font-medium text-right">Acties</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-900">
          {items.map((item) => {
            const margin = calculateMargin(item.purchasePrice, item.salePrice);
            const priceInclBTW = calculatePriceInclBTW(item.salePrice, item.vatRate);
            const isLowStock = item.quantity <= item.reorderLevel;

            const hasWarning = !!(item.warningNote && item.warningEnabled !== false);
            const hasDisabledWarning = !!(item.warningNote && item.warningEnabled === false);

            return (
              <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900 dark:text-white">{item.name}</span>
                    {hasWarning && (
                      <AlertTriangle 
                        className="h-4 w-4 text-red-600 dark:text-red-400" 
                        fill="currentColor"
                        title="Dit artikel heeft een waarschuwing"
                      />
                    )}
                    {hasDisabledWarning && (
                      <AlertTriangle 
                        className="h-4 w-4 text-slate-400 dark:text-slate-500" 
                        title="Waarschuwing uitgeschakeld"
                      />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{item.sku}</td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {item.supplierSku || '-'}
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {item.customSku || '-'}
                </td>
                <td className="px-4 py-3">
                  <span className="text-slate-600 dark:text-slate-400">
                    {getCategoryName(item.categoryId)}
                  </span>
                </td>
                <td className={cn(
                  "px-4 py-3 text-right font-medium",
                  isLowStock ? "text-amber-600 dark:text-amber-500" : "text-slate-700 dark:text-slate-300"
                )}>
                  {item.quantity} {item.unit}
                </td>
                <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">
                  €{item.purchasePrice.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">
                  €{item.salePrice.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right">
                  <span className={cn(
                    "font-medium",
                    margin >= 30 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-700 dark:text-slate-300"
                  )}>
                    {margin.toFixed(2)}%
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">
                  {item.vatRate}%
                </td>
                <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300 font-medium">
                  €{priceInclBTW.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                  {getSupplierName(item.supplierId)}
                </td>
                <td className="px-4 py-3">
                  {isLowStock ? (
                    <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                      <AlertTriangle className="h-3 w-3" />
                      Laag
                    </span>
                  ) : (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400">✓ OK</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {item.webshopSync ? (
                    <div className="flex items-center gap-1">
                      {item.webshopSync && <LinkIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => {/* Sync action */}}
                      >
                        Sync
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() => {/* Sync action */}}
                    >
                      Sync
                    </Button>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(item)}
                      className="h-8 w-8 p-0"
                      title="Bewerken"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onQuickAdjust(item.id, 10)}
                      className="h-8 px-2 text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                      title="+10"
                    >
                      +10
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onQuickAdjust(item.id, -10)}
                      className="h-8 px-2 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="-10"
                    >
                      -10
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(item.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Verwijderen"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Inventory Warning Modal */}
      {warningNote && itemName && (
        <InventoryWarningModal
          isOpen={showModal}
          onAcknowledge={handleAcknowledgeWarning}
          itemName={itemName}
          warningNote={warningNote}
        />
      )}
    </div>
  );
};
