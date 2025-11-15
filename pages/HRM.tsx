// pages/HRM.tsx - Refactored
import React from 'react';
import { calculateServiceYears } from '../features/hrm';

export const HRM: React.FC<any> = ({ employees, setEmployees, isAdmin }) => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">HRM (Personeelsbeheer)</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Naam</th>
              <th className="px-6 py-3 text-left">Functie</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Diensttijd</th>
              <th className="px-6 py-3 text-left">Admin</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp: any) => (
              <tr key={emp.id} className="border-t">
                <td className="px-6 py-4">{emp.name}</td>
                <td className="px-6 py-4">{emp.role}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{emp.email}</td>
                <td className="px-6 py-4">{calculateServiceYears(emp.hireDate)} jaar</td>
                <td className="px-6 py-4">{emp.isAdmin ? '👑' : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
