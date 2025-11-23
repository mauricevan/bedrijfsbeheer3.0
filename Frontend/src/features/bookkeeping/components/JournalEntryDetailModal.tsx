import React from 'react';
import { X, FileText, Calendar, User } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import type { JournalEntry } from '../types/bookkeeping.types';

interface JournalEntryDetailModalProps {
  entry: JournalEntry;
  onClose: () => void;
}

export const JournalEntryDetailModal: React.FC<JournalEntryDetailModalProps> = ({
  entry,
  onClose,
}) => {
  const totalDebit = entry.entries.reduce((sum, line) => sum + line.debit, 0);
  const totalCredit = entry.entries.reduce((sum, line) => sum + line.credit, 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {entry.entryNumber}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Journaalpost Details
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Datum</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {new Date(entry.date).toLocaleDateString('nl-NL', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Type</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {entry.invoiceId
                      ? 'Factuur'
                      : entry.posSaleId
                      ? 'Kassaverkoop'
                      : 'Handmatig'}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <User className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Aangemaakt</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {new Date(entry.createdAt).toLocaleDateString('nl-NL')}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Omschrijving
            </h3>
            <Card className="p-4">
              <p className="text-slate-900 dark:text-white">{entry.description}</p>
            </Card>
          </div>

          {/* Journal Lines */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Boekingsregels
            </h3>
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800">
                    <tr>
                      <th className="text-left p-4 text-slate-700 dark:text-slate-300 font-semibold">
                        Rekening
                      </th>
                      <th className="text-left p-4 text-slate-700 dark:text-slate-300 font-semibold">
                        Omschrijving
                      </th>
                      <th className="text-right p-4 text-slate-700 dark:text-slate-300 font-semibold">
                        Debet
                      </th>
                      <th className="text-right p-4 text-slate-700 dark:text-slate-300 font-semibold">
                        Credit
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {entry.entries.map((line, index) => (
                      <tr
                        key={line.id}
                        className={`${
                          index !== entry.entries.length - 1
                            ? 'border-b border-slate-200 dark:border-slate-700'
                            : ''
                        }`}
                      >
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">
                              {line.accountNumber}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {line.accountName}
                            </p>
                          </div>
                        </td>
                        <td className="p-4 text-slate-600 dark:text-slate-400">
                          {line.description}
                        </td>
                        <td className="p-4 text-right font-medium text-slate-900 dark:text-white">
                          {line.debit > 0 ? `€${line.debit.toFixed(2)}` : '-'}
                        </td>
                        <td className="p-4 text-right font-medium text-slate-900 dark:text-white">
                          {line.credit > 0 ? `€${line.credit.toFixed(2)}` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 dark:bg-slate-800 border-t-2 border-slate-300 dark:border-slate-600">
                    <tr>
                      <td colSpan={2} className="p-4 text-right font-bold text-slate-900 dark:text-white">
                        Totaal:
                      </td>
                      <td className="p-4 text-right font-bold text-slate-900 dark:text-white">
                        €{totalDebit.toFixed(2)}
                      </td>
                      <td className="p-4 text-right font-bold text-slate-900 dark:text-white">
                        €{totalCredit.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Balance Check */}
            <div className="mt-4 flex items-center justify-center">
              {Math.abs(totalDebit - totalCredit) < 0.01 ? (
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-lg">
                  <div className="h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400"></div>
                  <span className="text-sm font-medium">In balans</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg">
                  <div className="h-2 w-2 rounded-full bg-red-600 dark:bg-red-400"></div>
                  <span className="text-sm font-medium">
                    Niet in balans (verschil: €{Math.abs(totalDebit - totalCredit).toFixed(2)})
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Related Documents */}
          {(entry.invoiceId || entry.posSaleId) && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Gerelateerde Documenten
              </h3>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {entry.invoiceId ? 'Factuur' : 'Kassaverkoop'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      ID: {entry.invoiceId || entry.posSaleId}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
          <Button variant="outline" onClick={onClose}>
            Sluiten
          </Button>
        </div>
      </div>
    </div>
  );
};
