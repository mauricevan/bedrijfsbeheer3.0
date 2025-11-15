// pages/Inventory.tsx - Refactored
import React from 'react';
import { calculateStockStatus, getStockColor } from '../features/inventory';

export const Inventory: React.FC<any> = ({ inventory, setInventory, isAdmin }) => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Voorraadbeheer</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Naam</th>
              <th className="px-6 py-3 text-left">SKU</th>
              <th className="px-6 py-3 text-left">Voorraad</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-right">Prijs</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item: any) => {
              const status = calculateStockStatus(item.quantity, item.reorderLevel);
              return (
                <tr key={item.id} className="border-t">
                  <td className="px-6 py-4">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.autoSku || item.sku}</td>
                  <td className="px-6 py-4">{item.quantity}</td>
                  <td className={`px-6 py-4 font-medium ${getStockColor(status)}`}>
                    {status === 'ok' ? 'OK' : status === 'low' ? 'Laag' : 'Niet op voorraad'}
                  </td>
                  <td className="px-6 py-4 text-right">€{item.salePrice.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
