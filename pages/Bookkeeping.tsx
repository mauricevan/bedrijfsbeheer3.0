// pages/Bookkeeping.tsx - Refactored
import React, { useState } from 'react';
import { ledgerAccounts } from '../features/bookkeeping';

const Bookkeeping: React.FC<any> = ({ invoices = [], isAdmin }) => {
  const [activeTab, setActiveTab] = useState<'ledger' | 'vat' | 'archive'>('ledger');

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Boekhouding & Dossier</h1>
      <div className="flex gap-2 mb-6">
        <button onClick={() => setActiveTab('ledger')} className={`px-4 py-2 rounded ${activeTab === 'ledger' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
          Grootboek
        </button>
        <button onClick={() => setActiveTab('vat')} className={`px-4 py-2 rounded ${activeTab === 'vat' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
          BTW
        </button>
        <button onClick={() => setActiveTab('archive')} className={`px-4 py-2 rounded ${activeTab === 'archive' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
          Archief
        </button>
      </div>
      {activeTab === 'ledger' && (
        <div className="bg-white p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Grootboekrekeningen</h2>
          {ledgerAccounts.map((acc) => (
            <div key={acc.id} className="border-b py-2">
              {acc.id} - {acc.name}
            </div>
          ))}
        </div>
      )}
      {activeTab === 'vat' && <div className="bg-white p-6 rounded-lg"><p>BTW Overzicht</p></div>}
      {activeTab === 'archive' && <div className="bg-white p-6 rounded-lg"><p>Factuur Archief</p></div>}
    </div>
  );
};

export default Bookkeeping;
