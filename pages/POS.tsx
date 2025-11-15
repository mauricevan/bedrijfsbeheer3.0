// pages/POS.tsx - Refactored
import React, { useState } from 'react';
import { calculateTotal } from '../features/pos';

export const POS: React.FC<any> = ({ inventory, customers, setInventory, setSales }) => {
  const [cart, setCart] = useState<any[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');

  const total = calculateTotal(cart);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Kassa (POS)</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Producten</h2>
          <div className="space-y-2">
            {inventory.slice(0, 10).map((item: any) => (
              <button
                key={item.id}
                onClick={() => setCart([...cart, { ...item, quantity: 1 }])}
                className="w-full text-left px-4 py-2 bg-gray-50 rounded hover:bg-gray-100"
              >
                {item.name} - €{item.salePrice}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Winkelwagen</h2>
          <div className="space-y-2 mb-4">
            {cart.map((item, idx) => (
              <div key={idx} className="flex justify-between border-b pb-2">
                <span>{item.name}</span>
                <span>€{item.salePrice}</span>
              </div>
            ))}
          </div>
          <div className="text-xl font-bold border-t pt-4">
            Totaal: €{total.toFixed(2)}
          </div>
          <button className="w-full mt-4 px-4 py-3 bg-green-600 text-white rounded hover:bg-green-700">
            Afrekenen
          </button>
        </div>
      </div>
    </div>
  );
};
