// pages/Dashboard.tsx - Enhanced with Visual Design
import React from 'react';
import { calculateKPIs } from '../features/dashboard';

export const Dashboard: React.FC<any> = (props) => {
  const kpis = calculateKPIs(props);

  return (
    <div className="p-6 animate-fadeIn">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Omzet Card - Enhanced with gradient */}
        <div className="group bg-gradient-to-br from-white to-primary-50/30 p-6 rounded-xl shadow-soft hover:shadow-soft-lg transition-all duration-300 border border-primary-100/50 animate-slideInBottom">
          <h3 className="text-gray-600 mb-2 font-medium">Omzet</h3>
          <p className="text-3xl font-bold text-primary-700 group-hover:text-primary-800 transition-colors">
            €{kpis.revenue.toLocaleString()}
          </p>
          <div className="mt-3 h-1 bg-primary-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary-500 to-primary-600 w-3/4 rounded-full"></div>
          </div>
        </div>

        {/* Werkorders Card - Enhanced with gradient */}
        <div className="group bg-gradient-to-br from-white to-success-50/30 p-6 rounded-xl shadow-soft hover:shadow-soft-lg transition-all duration-300 border border-success-100/50 animate-slideInBottom" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-gray-600 mb-2 font-medium">Werkorders</h3>
          <p className="text-3xl font-bold text-success-700 group-hover:text-success-800 transition-colors">
            {kpis.orders}
          </p>
          <div className="mt-3 h-1 bg-success-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-success-500 to-success-600 w-2/3 rounded-full"></div>
          </div>
        </div>

        {/* Lage Voorraad Card - Enhanced with gradient */}
        <div className="group bg-gradient-to-br from-white to-warning-50/30 p-6 rounded-xl shadow-soft hover:shadow-soft-lg transition-all duration-300 border border-warning-100/50 animate-slideInBottom" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-gray-600 mb-2 font-medium">Lage Voorraad</h3>
          <p className="text-3xl font-bold text-warning-700 group-hover:text-warning-800 transition-colors">
            {kpis.lowStock}
          </p>
          <div className="mt-3 h-1 bg-warning-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-warning-500 to-warning-600 w-1/4 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
