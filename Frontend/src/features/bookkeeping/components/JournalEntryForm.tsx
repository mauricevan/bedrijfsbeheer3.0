import React, { useState } from 'react';
import { X, Plus, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import type { LedgerAccount } from '../types/bookkeeping.types';

interface JournalEntryLine {
  id: string;
  accountId: string;
  accountNumber: string;
  accountName: string;
  description: string;
  debit: number;
  credit: number;
}

interface JournalEntryFormProps {
  ledgerAccounts: LedgerAccount[];
  onSubmit: (data: {
    date: string;
    description: string;
    entries: JournalEntryLine[];
  }) => Promise<void>;
  onCancel: () => void;
}

export const JournalEntryForm: React.FC<JournalEntryFormProps> = ({
  ledgerAccounts,
  onSubmit,
  onCancel,
}) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [lines, setLines] = useState<JournalEntryLine[]>([
    {
      id: '1',
      accountId: '',
      accountNumber: '',
      accountName: '',
      description: '',
      debit: 0,
      credit: 0,
    },
    {
      id: '2',
      accountId: '',
      accountNumber: '',
      accountName: '',
      description: '',
      debit: 0,
      credit: 0,
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const totalDebit = lines.reduce((sum, line) => sum + (line.debit || 0), 0);
  const totalCredit = lines.reduce((sum, line) => sum + (line.credit || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01 && totalDebit > 0;

  const addLine = () => {
    setLines([
      ...lines,
      {
        id: Date.now().toString(),
        accountId: '',
        accountNumber: '',
        accountName: '',
        description: '',
        debit: 0,
        credit: 0,
      },
    ]);
  };

  const removeLine = (id: string) => {
    if (lines.length > 2) {
      setLines(lines.filter((line) => line.id !== id));
    }
  };

  const updateLine = (id: string, field: keyof JournalEntryLine, value: any) => {
    setLines(
      lines.map((line) => {
        if (line.id === id) {
          const updated = { ...line, [field]: value };
          
          // If account is selected, auto-fill account details
          if (field === 'accountId') {
            const account = ledgerAccounts.find((acc) => acc.id === value);
            if (account) {
              updated.accountNumber = account.accountNumber;
              updated.accountName = account.name;
            }
          }
          
          // Ensure only debit or credit has a value, not both
          if (field === 'debit' && value > 0) {
            updated.credit = 0;
          } else if (field === 'credit' && value > 0) {
            updated.debit = 0;
          }
          
          return updated;
        }
        return line;
      })
    );
  };

  const validate = (): boolean => {
    const newErrors: string[] = [];

    if (!description.trim()) {
      newErrors.push('Omschrijving is verplicht');
    }

    if (!isBalanced) {
      newErrors.push('Debet en Credit moeten in balans zijn');
    }

    if (totalDebit === 0) {
      newErrors.push('Minimaal één boeking is vereist');
    }

    const hasEmptyAccounts = lines.some(
      (line) => (line.debit > 0 || line.credit > 0) && !line.accountId
    );
    if (hasEmptyAccounts) {
      newErrors.push('Alle boekingsregels moeten een rekening hebben');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        date,
        description,
        entries: lines.filter((line) => line.debit > 0 || line.credit > 0),
      });
    } catch (error) {
      setErrors(['Er is een fout opgetreden bij het opslaan']);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Nieuwe Journaalpost
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Datum *
              </label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Omschrijving *
              </label>
              <Input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Bijv. Correctie factuur 2025-001"
                className="w-full"
              />
            </div>
          </div>

          {/* Journal Lines */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Boekingsregels
              </h3>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={addLine}
              >
                Regel toevoegen
              </Button>
            </div>

            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800">
                    <tr>
                      <th className="text-left p-3 text-slate-700 dark:text-slate-300 font-medium">
                        Rekening *
                      </th>
                      <th className="text-left p-3 text-slate-700 dark:text-slate-300 font-medium">
                        Omschrijving
                      </th>
                      <th className="text-right p-3 text-slate-700 dark:text-slate-300 font-medium">
                        Debet
                      </th>
                      <th className="text-right p-3 text-slate-700 dark:text-slate-300 font-medium">
                        Credit
                      </th>
                      <th className="w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map((line) => (
                      <tr
                        key={line.id}
                        className="border-t border-slate-200 dark:border-slate-700"
                      >
                        <td className="p-3">
                          <select
                            value={line.accountId}
                            onChange={(e) =>
                              updateLine(line.id, 'accountId', e.target.value)
                            }
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          >
                            <option value="">Selecteer rekening...</option>
                            {ledgerAccounts.map((account) => (
                              <option key={account.id} value={account.id}>
                                {account.accountNumber} - {account.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-3">
                          <Input
                            type="text"
                            value={line.description}
                            onChange={(e) =>
                              updateLine(line.id, 'description', e.target.value)
                            }
                            placeholder="Omschrijving..."
                            className="w-full"
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={line.debit || ''}
                            onChange={(e) =>
                              updateLine(
                                line.id,
                                'debit',
                                parseFloat(e.target.value) || 0
                              )
                            }
                            placeholder="0.00"
                            className="w-full text-right"
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={line.credit || ''}
                            onChange={(e) =>
                              updateLine(
                                line.id,
                                'credit',
                                parseFloat(e.target.value) || 0
                              )
                            }
                            placeholder="0.00"
                            className="w-full text-right"
                          />
                        </td>
                        <td className="p-3">
                          {lines.length > 2 && (
                            <button
                              onClick={() => removeLine(line.id)}
                              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 dark:bg-slate-800 border-t-2 border-slate-300 dark:border-slate-600">
                    <tr>
                      <td colSpan={2} className="p-3 text-right font-semibold text-slate-900 dark:text-white">
                        Totaal:
                      </td>
                      <td className="p-3 text-right font-bold text-slate-900 dark:text-white">
                        €{totalDebit.toFixed(2)}
                      </td>
                      <td className="p-3 text-right font-bold text-slate-900 dark:text-white">
                        €{totalCredit.toFixed(2)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Balance Indicator */}
            <div className="mt-4">
              {isBalanced ? (
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <div className="h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400"></div>
                  <span className="text-sm font-medium">
                    Debet en Credit zijn in balans
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Verschil: €{Math.abs(totalDebit - totalCredit).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-red-900 dark:text-red-100 mb-2">
                    Controleer de volgende punten:
                  </h4>
                  <ul className="list-disc list-inside space-y-1">
                    {errors.map((error, index) => (
                      <li key={index} className="text-sm text-red-700 dark:text-red-300">
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
          <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Annuleren
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isBalanced || isSubmitting}
            isLoading={isSubmitting}
          >
            Journaalpost Boeken
          </Button>
        </div>
      </div>
    </div>
  );
};
