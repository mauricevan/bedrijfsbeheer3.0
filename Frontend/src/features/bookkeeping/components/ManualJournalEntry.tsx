import React, { useState } from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useToast } from '@/context/ToastContext';
import { Plus, Trash2, AlertCircle, CheckCircle } from 'lucide-react';

interface JournalLine {
  id: string;
  account: string;
  accountName: string;
  debit: string;
  credit: string;
}

const ACCOUNTS = [
  { code: '1300', name: 'Debiteuren' },
  { code: '1500', name: 'Voorraad' },
  { code: '1800', name: 'Bank' },
  { code: '1850', name: 'Kas' },
  { code: '2600', name: 'Crediteuren' },
  { code: '2700', name: 'BTW Te Betalen' },
  { code: '2710', name: 'BTW Te Vorderen' },
  { code: '8000', name: 'Omzet 21%' },
  { code: '8010', name: 'Omzet 9%' },
  { code: '8020', name: 'Omzet 0%' },
  { code: '4000', name: 'Inkoop Handelsgoederen' },
  { code: '4500', name: 'Lonen en Salarissen' },
];

export const ManualJournalEntry: React.FC = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [reference, setReference] = useState('');
  const [lines, setLines] = useState<JournalLine[]>([
    { id: '1', account: '', accountName: '', debit: '', credit: '' },
    { id: '2', account: '', accountName: '', debit: '', credit: '' },
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  const addLine = () => {
    const newLine: JournalLine = {
      id: Date.now().toString(),
      account: '',
      accountName: '',
      debit: '',
      credit: '',
    };
    setLines([...lines, newLine]);
  };

  const removeLine = (id: string) => {
    if (lines.length <= 2) {
      showToast('At least 2 lines are required', 'warning');
      return;
    }
    setLines(lines.filter((line) => line.id !== id));
  };

  const updateLine = (id: string, field: keyof JournalLine, value: string) => {
    setLines(
      lines.map((line) => {
        if (line.id === id) {
          if (field === 'account') {
            const account = ACCOUNTS.find((acc) => acc.code === value);
            return {
              ...line,
              account: value,
              accountName: account?.name || '',
            };
          }
          return { ...line, [field]: value };
        }
        return line;
      })
    );
  };

  const calculateTotals = () => {
    const totalDebit = lines.reduce(
      (sum, line) => sum + (parseFloat(line.debit) || 0),
      0
    );
    const totalCredit = lines.reduce(
      (sum, line) => sum + (parseFloat(line.credit) || 0),
      0
    );
    return { totalDebit, totalCredit };
  };

  const isBalanced = () => {
    const { totalDebit, totalCredit } = calculateTotals();
    return Math.abs(totalDebit - totalCredit) < 0.01 && totalDebit > 0;
  };

  const validate = () => {
    if (!description.trim()) {
      showToast('Description is required', 'warning');
      return false;
    }

    if (lines.length < 2) {
      showToast('At least 2 lines are required', 'warning');
      return false;
    }

    const hasEmptyAccount = lines.some((line) => !line.account);
    if (hasEmptyAccount) {
      showToast('All lines must have an account selected', 'warning');
      return false;
    }

    const hasEmptyAmount = lines.some(
      (line) => !line.debit && !line.credit
    );
    if (hasEmptyAmount) {
      showToast('Each line must have either a debit or credit amount', 'warning');
      return false;
    }

    const hasBothAmounts = lines.some(
      (line) => line.debit && line.credit
    );
    if (hasBothAmounts) {
      showToast('A line cannot have both debit and credit amounts', 'warning');
      return false;
    }

    if (!isBalanced()) {
      showToast('Total debits must equal total credits', 'error');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const entry = {
        date,
        description,
        reference,
        lines: lines.map((line) => ({
          account: line.account,
          accountName: line.accountName,
          debit: parseFloat(line.debit) || 0,
          credit: parseFloat(line.credit) || 0,
        })),
        source: 'manual',
        createdAt: new Date().toISOString(),
      };

      // Save to localStorage
      const existingEntries = JSON.parse(
        localStorage.getItem('journalEntries') || '[]'
      );
      localStorage.setItem(
        'journalEntries',
        JSON.stringify([...existingEntries, entry])
      );

      showToast('Journal entry saved successfully!', 'success');
      
      // Reset form
      setDescription('');
      setReference('');
      setLines([
        { id: '1', account: '', accountName: '', debit: '', credit: '' },
        { id: '2', account: '', accountName: '', debit: '', credit: '' },
      ]);
    } catch (error) {
      showToast('Failed to save journal entry', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const { totalDebit, totalCredit } = calculateTotals();
  const balanced = isBalanced();

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          New Manual Journal Entry
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Create manual corrections and adjustments
        </p>
      </div>

      <div className="space-y-6">
        {/* Header Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Date *
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Description *
            </label>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Correction for invoice #2025-123"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Reference (Optional)
          </label>
          <Input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="e.g., INV-2025-123"
          />
        </div>

        {/* Journal Lines */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Journal Lines
            </label>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={addLine}
            >
              Add Line
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-2 px-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    Account
                  </th>
                  <th className="text-right py-2 px-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    Debit (€)
                  </th>
                  <th className="text-right py-2 px-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    Credit (€)
                  </th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line) => (
                  <tr key={line.id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-2 px-2">
                      <select
                        value={line.account}
                        onChange={(e) =>
                          updateLine(line.id, 'account', e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Select account...</option>
                        {ACCOUNTS.map((account) => (
                          <option key={account.code} value={account.code}>
                            {account.code} - {account.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 px-2">
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={line.debit}
                        onChange={(e) =>
                          updateLine(line.id, 'debit', e.target.value)
                        }
                        placeholder="0.00"
                        className="text-right"
                        disabled={!!line.credit}
                      />
                    </td>
                    <td className="py-2 px-2">
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={line.credit}
                        onChange={(e) =>
                          updateLine(line.id, 'credit', e.target.value)
                        }
                        placeholder="0.00"
                        className="text-right"
                        disabled={!!line.debit}
                      />
                    </td>
                    <td className="py-2 px-2">
                      <button
                        onClick={() => removeLine(line.id)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1"
                        disabled={lines.length <= 2}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-300 dark:border-slate-600 font-semibold">
                  <td className="py-3 px-2 text-sm text-slate-700 dark:text-slate-300">
                    Total
                  </td>
                  <td className="py-3 px-2 text-right text-sm text-slate-900 dark:text-white">
                    €{totalDebit.toFixed(2)}
                  </td>
                  <td className="py-3 px-2 text-right text-sm text-slate-900 dark:text-white">
                    €{totalCredit.toFixed(2)}
                  </td>
                  <td className="py-3 px-2"></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Balance Indicator */}
          <div className="mt-4">
            {balanced ? (
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Balanced ✓</span>
              </div>
            ) : totalDebit > 0 || totalCredit > 0 ? (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm font-medium">
                  Unbalanced - Difference: €
                  {Math.abs(totalDebit - totalCredit).toFixed(2)}
                </span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <Button
            variant="outline"
            onClick={() => {
              setDescription('');
              setReference('');
              setLines([
                { id: '1', account: '', accountName: '', debit: '', credit: '' },
                { id: '2', account: '', accountName: '', debit: '', credit: '' },
              ]);
            }}
          >
            Reset
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            isLoading={isSaving}
            disabled={!balanced}
            className="flex-1"
          >
            Save Journal Entry
          </Button>
        </div>
      </div>
    </Card>
  );
};
