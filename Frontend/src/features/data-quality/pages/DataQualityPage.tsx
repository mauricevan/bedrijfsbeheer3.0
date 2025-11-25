import React from 'react';
import { DataQualityDashboard } from '../components/DataQualityDashboard';

export const DataQualityPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <DataQualityDashboard />
    </div>
  );
};

