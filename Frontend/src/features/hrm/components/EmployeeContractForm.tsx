import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import type { Contract } from '../types/hrm.types';
import { Plus, Trash2, Edit2 } from 'lucide-react';

interface EmployeeContractFormProps {
  contracts: Contract[];
  onChange: (contracts: Contract[]) => void;
}

export const EmployeeContractForm: React.FC<EmployeeContractFormProps> = ({
  contracts,
  onChange,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Contract>>({});

  const handleAddNew = () => {
    setEditForm({
      id: crypto.randomUUID(),
      type: 'permanent',
      startDate: new Date().toISOString().split('T')[0],
      hoursPerWeek: 40,
      fte: 1.0,
      jobTitle: '',
      status: 'active',
    });
    setIsAdding(true);
    setEditingId(null);
  };

  const handleEdit = (contract: Contract) => {
    setEditForm(contract);
    setEditingId(contract.id);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    onChange(contracts.filter(c => c.id !== id));
  };

  const handleSave = () => {
    if (!editForm.jobTitle || !editForm.startDate) return;

    const newContract = editForm as Contract;
    
    if (isAdding) {
      onChange([...contracts, newContract]);
    } else {
      onChange(contracts.map(c => c.id === newContract.id ? newContract : c));
    }
    
    setIsAdding(false);
    setEditingId(null);
    setEditForm({});
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setEditForm({});
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-slate-900 dark:text-white">Contracten</h3>
        {!isAdding && !editingId && (
          <Button onClick={handleAddNew} size="sm" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nieuw Contract
          </Button>
        )}
      </div>

      {(isAdding || editingId) && (
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 space-y-4">
          <h4 className="font-medium text-slate-900 dark:text-white">
            {isAdding ? 'Nieuw Contract' : 'Contract Bewerken'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Functietitel *
              </label>
              <Input
                value={editForm.jobTitle || ''}
                onChange={(e) => setEditForm({ ...editForm, jobTitle: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Type Contract
              </label>
              <select
                value={editForm.type || 'permanent'}
                onChange={(e) => setEditForm({ ...editForm, type: e.target.value as Contract['type'] })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="permanent">Onbepaalde tijd</option>
                <option value="temporary">Bepaalde tijd</option>
                <option value="freelance">Freelance</option>
                <option value="on_call">Oproepbasis</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Startdatum *
              </label>
              <Input
                type="date"
                value={editForm.startDate || ''}
                onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Einddatum
              </label>
              <Input
                type="date"
                value={editForm.endDate || ''}
                onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Uren per week
              </label>
              <Input
                type="number"
                value={editForm.hoursPerWeek?.toString() || '40'}
                onChange={(e) => setEditForm({ ...editForm, hoursPerWeek: parseFloat(e.target.value), fte: parseFloat(e.target.value) / 40 })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                FTE
              </label>
              <Input
                type="number"
                step="0.1"
                value={editForm.fte?.toString() || '1.0'}
                onChange={(e) => setEditForm({ ...editForm, fte: parseFloat(e.target.value) })}
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Status
              </label>
              <select
                value={editForm.status || 'active'}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value as Contract['status'] })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="active">Actief</option>
                <option value="terminated">Beëindigd</option>
                <option value="expired">Verlopen</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel} size="sm">
              Annuleren
            </Button>
            <Button onClick={handleSave} size="sm">
              Opslaan
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {contracts.map((contract) => (
          <div
            key={contract.id}
            className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
          >
            <div>
              <h4 className="font-medium text-slate-900 dark:text-white">{contract.jobTitle}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {contract.type} • {contract.hoursPerWeek} uur ({contract.fte} FTE)
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {new Date(contract.startDate).toLocaleDateString()} - {contract.endDate ? new Date(contract.endDate).toLocaleDateString() : 'Heden'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 text-xs rounded-full ${
                contract.status === 'active' 
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
              }`}>
                {contract.status === 'active' ? 'Actief' : contract.status === 'terminated' ? 'Beëindigd' : 'Verlopen'}
              </span>
              <button
                onClick={() => handleEdit(contract)}
                className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(contract.id)}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {contracts.length === 0 && !isAdding && (
          <p className="text-center text-slate-500 dark:text-slate-400 py-4">
            Geen contracten gevonden.
          </p>
        )}
      </div>
    </div>
  );
};
