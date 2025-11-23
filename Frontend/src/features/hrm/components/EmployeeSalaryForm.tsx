import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import type { SalaryRecord, BankDetails, SalaryComponent } from '../types/hrm.types';
import { Plus, Trash2, Edit2, X } from 'lucide-react';

interface EmployeeSalaryFormProps {
  salaryHistory: SalaryRecord[];
  bankDetails: BankDetails;
  onSalaryChange: (history: SalaryRecord[]) => void;
  onBankDetailsChange: (details: BankDetails) => void;
}

export const EmployeeSalaryForm: React.FC<EmployeeSalaryFormProps> = ({
  salaryHistory,
  bankDetails,
  onSalaryChange,
  onBankDetailsChange,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<SalaryRecord>>({});

  const handleAddNew = () => {
    setEditForm({
      id: crypto.randomUUID(),
      startDate: new Date().toISOString().split('T')[0],
      grossSalary: 0,
      currency: 'EUR',
      frequency: 'monthly',
      components: [],
    });
    setIsAdding(true);
    setEditingId(null);
  };

  const handleEdit = (record: SalaryRecord) => {
    setEditForm(record);
    setEditingId(record.id);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    onSalaryChange(salaryHistory.filter(s => s.id !== id));
  };

  const handleSave = () => {
    if (!editForm.grossSalary || !editForm.startDate) return;

    const newRecord = editForm as SalaryRecord;
    
    if (isAdding) {
      onSalaryChange([...salaryHistory, newRecord]);
    } else {
      onSalaryChange(salaryHistory.map(s => s.id === newRecord.id ? newRecord : s));
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

  const handleAddComponent = () => {
    const newComponent: SalaryComponent = {
      id: crypto.randomUUID(),
      name: '',
      amount: 0,
      type: 'fixed',
      taxable: true,
    };
    setEditForm({
      ...editForm,
      components: [...(editForm.components || []), newComponent],
    });
  };

  const handleUpdateComponent = (id: string, field: keyof SalaryComponent, value: any) => {
    setEditForm({
      ...editForm,
      components: editForm.components?.map(c => c.id === id ? { ...c, [field]: value } : c),
    });
  };

  const handleRemoveComponent = (id: string) => {
    setEditForm({
      ...editForm,
      components: editForm.components?.filter(c => c.id !== id),
    });
  };

  return (
    <div className="space-y-8">
      {/* Bank Details Section */}
      <div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Bankgegevens</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              IBAN
            </label>
            <Input
              value={bankDetails.iban || ''}
              onChange={(e) => onBankDetailsChange({ ...bankDetails, iban: e.target.value })}
              placeholder="NL00 BANK 0000 0000 00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Ten name van
            </label>
            <Input
              value={bankDetails.accountHolder || ''}
              onChange={(e) => onBankDetailsChange({ ...bankDetails, accountHolder: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Bank
            </label>
            <Input
              value={bankDetails.bankName || ''}
              onChange={(e) => onBankDetailsChange({ ...bankDetails, bankName: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Salary History Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">Salaris Historie</h3>
          {!isAdding && !editingId && (
            <Button onClick={handleAddNew} size="sm" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nieuwe Salarisregel
            </Button>
          )}
        </div>

        {(isAdding || editingId) && (
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 space-y-4 mb-4">
            <h4 className="font-medium text-slate-900 dark:text-white">
              {isAdding ? 'Nieuwe Salarisregel' : 'Salarisregel Bewerken'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Startdatum *
                </label>
                <Input
                  type="date"
                  value={editForm.startDate || ''}
                  onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                  data-testid="salary-start-date"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Bruto Salaris *
                </label>
                <Input
                  type="number"
                  value={editForm.grossSalary?.toString() || '0'}
                  onChange={(e) => setEditForm({ ...editForm, grossSalary: parseFloat(e.target.value) })}
                  data-testid="salary-gross-amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Frequentie
                </label>
                <select
                  value={editForm.frequency || 'monthly'}
                  onChange={(e) => setEditForm({ ...editForm, frequency: e.target.value as SalaryRecord['frequency'] })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="monthly">Maandelijks</option>
                  <option value="4-weekly">4-wekelijks</option>
                  <option value="hourly">Per uur</option>
                </select>
              </div>
            </div>

            {/* Salary Components */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Componenten (Toeslagen/Inhoudingen)
                </label>
                <Button onClick={handleAddComponent} size="sm" variant="outline" className="text-xs">
                  + Component
                </Button>
              </div>
              <div className="space-y-2">
                {editForm.components?.map((comp) => (
                  <div key={comp.id} className="flex gap-2 items-center">
                    <Input
                      placeholder="Naam"
                      value={comp.name}
                      onChange={(e) => handleUpdateComponent(comp.id, 'name', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      placeholder="Bedrag"
                      value={comp.amount.toString()}
                      onChange={(e) => handleUpdateComponent(comp.id, 'amount', parseFloat(e.target.value))}
                      className="w-24"
                    />
                    <select
                      value={comp.type}
                      onChange={(e) => handleUpdateComponent(comp.id, 'type', e.target.value)}
                      className="px-2 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                    >
                      <option value="fixed">Vast</option>
                      <option value="variable">Variabel</option>
                    </select>
                    <button
                      onClick={() => handleRemoveComponent(comp.id)}
                      className="p-2 text-slate-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {(!editForm.components || editForm.components.length === 0) && (
                  <p className="text-sm text-slate-500 italic">Geen extra componenten</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={handleCancel} size="sm">
                Annuleren
              </Button>
              <Button onClick={handleSave} size="sm" data-testid="salary-save-btn">
                Opslaan
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {salaryHistory.map((record) => (
            <div
              key={record.id}
              className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
            >
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white">
                  {new Intl.NumberFormat('nl-NL', { style: 'currency', currency: record.currency }).format(record.grossSalary)}
                  <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-1">
                    / {record.frequency === 'monthly' ? 'maand' : record.frequency === '4-weekly' ? '4 weken' : 'uur'}
                  </span>
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Vanaf {new Date(record.startDate).toLocaleDateString()}
                </p>
                {record.components.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {record.components.map(c => (
                      <span key={c.id} className="text-xs bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">
                        {c.name}: +{c.amount}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(record)}
                  className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(record.id)}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {salaryHistory.length === 0 && !isAdding && (
            <p className="text-center text-slate-500 dark:text-slate-400 py-4">
              Geen salarishistorie gevonden.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
