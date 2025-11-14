// pages/Webshop.tsx - Refactored
import React, { useState } from 'react';
import { generateSlug, generateSKU } from '../features/webshop';

export const Webshop: React.FC<any> = ({ products = [], setProducts, isAdmin }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'orders'>('products');

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Webshop Beheer</h1>
      <div className="flex gap-2 mb-6">
        <button onClick={() => setActiveTab('products')} className={`px-4 py-2 rounded ${activeTab === 'products' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
          Producten
        </button>
        <button onClick={() => setActiveTab('categories')} className={`px-4 py-2 rounded ${activeTab === 'categories' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
          Categorieën
        </button>
        <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 rounded ${activeTab === 'orders' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
          Bestellingen
        </button>
      </div>
      {activeTab === 'products' && (
        <div className="bg-white p-6 rounded-lg">
          <p>Producten: {products.length}</p>
        </div>
      )}
      {activeTab === 'categories' && <div className="bg-white p-6 rounded-lg"><p>Categorieën beheer</p></div>}
      {activeTab === 'orders' && <div className="bg-white p-6 rounded-lg"><p>Bestellingen</p></div>}
    </div>
  );
};
