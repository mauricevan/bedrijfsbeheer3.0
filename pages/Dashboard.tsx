// pages/Dashboard.tsx - Refactored
import React from 'react';
import { calculateKPIs } from '../features/dashboard';

export const Dashboard: React.FC<any> = (props) => {
  const kpis = calculateKPIs(props);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 mb-2">Omzet</h3>
          <p className="text-3xl font-bold">€{kpis.revenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 mb-2">Werkorders</h3>
          <p className="text-3xl font-bold">{kpis.orders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 mb-2">Lage Voorraad</h3>
          <p className="text-3xl font-bold text-yellow-600">{kpis.lowStock}</p>
        </div>
      </div>
    </div>
  );
};
