import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Receipt, Users, TrendingUp, Download, Plus, Search, Filter } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useBookkeeping } from '../hooks/useBookkeeping';
import { useAccounting } from '@/features/accounting/hooks/useAccounting';
import { useToast } from '@/context/ToastContext';
import { JournalEntryForm } from '../components/JournalEntryForm';
import { JournalEntryDetailModal } from '../components/JournalEntryDetailModal';
import { EmptyState } from '../components/EmptyState';
import type { JournalEntry } from '../types/bookkeeping.types';

export const BookkeepingPage: React.FC = () => {
  const { ledgerAccounts, journalEntries, posSales, customerDossiers, isLoading, getVatReport, createManualJournalEntry } = useBookkeeping();
  const { invoices } = useAccounting();
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'ledger' | 'journal' | 'vat' | 'invoices' | 'pos' | 'dossiers'>('ledger');
  const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('month');
  const [vatReport, setVatReport] = useState<any>(null);
  const [showJournalEntryForm, setShowJournalEntryForm] = useState(false);
  const [selectedJournalEntry, setSelectedJournalEntry] = useState<JournalEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadVatReport = async () => {
      const now = new Date();
      let startDate: string;
      if (period === 'month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      } else if (period === 'quarter') {
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1).toISOString().split('T')[0];
      } else {
        startDate = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
      }
      const endDate = now.toISOString().split('T')[0];
      const report = await getVatReport(startDate, endDate);
      setVatReport(report);
    };
    if (activeTab === 'vat') {
      loadVatReport();
    }
  }, [period, activeTab, getVatReport]);

  const totalRevenue = ledgerAccounts
    .filter(acc => acc.type === 'revenue')
    .reduce((sum, acc) => sum + acc.balance, 0);
  
  const vatToPay = vatReport?.vatToPay || 0;
  const outstandingInvoices = invoices.filter(i => i.status !== 'paid' && i.status !== 'cancelled').length;

  const handleCreateJournalEntry = async (data: {
    date: string;
    description: string;
    entries: any[];
  }) => {
    try {
      await createManualJournalEntry(data);
      setShowJournalEntryForm(false);
      showToast('Journaalpost succesvol aangemaakt', 'success');
    } catch (error) {
      showToast('Fout bij het aanmaken van journaalpost', 'error');
      throw error;
    }
  };

  // Filter functions
  const filteredJournalEntries = journalEntries.filter(entry =>
    entry.entryNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPosSales = posSales.filter(sale =>
    sale.saleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sale.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCustomerDossiers = customerDossiers.filter(dossier =>
    dossier.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Boekhouding & Dossier</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Grootboek, journaal en BTW-overzicht</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Totaal Omzet</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">€{totalRevenue.toFixed(2)}</p>
                </div>
                <TrendingUp className="h-10 w-10 text-emerald-500" />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">BTW te betalen</p>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">€{vatToPay.toFixed(2)}</p>
                </div>
                <Receipt className="h-10 w-10 text-amber-500" />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Openstaande Facturen</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{outstandingInvoices}</p>
                </div>
                <FileText className="h-10 w-10 text-indigo-500" />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Journaalposten</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{journalEntries.length}</p>
                </div>
                <BookOpen className="h-10 w-10 text-purple-500" />
              </div>
            </Card>
          </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 flex-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('ledger')}
              className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === 'ledger'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Grootboek
            </button>
            <button
              onClick={() => setActiveTab('journal')}
              className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === 'journal'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Journaal
            </button>
            <button
              onClick={() => setActiveTab('vat')}
              className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === 'vat'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              BTW-Overzicht
            </button>
            <button
              onClick={() => setActiveTab('invoices')}
              className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === 'invoices'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Factuur Archief
            </button>
            <button
              onClick={() => setActiveTab('pos')}
              className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === 'pos'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Kassa Verkopen
            </button>
            <button
              onClick={() => setActiveTab('dossiers')}
              className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === 'dossiers'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Dossiers
            </button>
          </div>
          <div className="flex gap-2 items-center">
            {activeTab !== 'ledger' && activeTab !== 'vat' && (
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="search"
                  placeholder="Zoeken..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
            )}
            {activeTab === 'journal' && (
              <Button
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={() => setShowJournalEntryForm(true)}
              >
                Nieuwe Post
              </Button>
            )}
            {activeTab === 'vat' && (
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as any)}
                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="month">Maand</option>
                <option value="quarter">Kwartaal</option>
                <option value="year">Jaar</option>
              </select>
            )}
            <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
              Exporteren
            </Button>
          </div>
        </div>

        {activeTab === 'ledger' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Grootboek Rekeningen</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left p-3 text-slate-700 dark:text-slate-300">Rekeningnummer</th>
                    <th className="text-left p-3 text-slate-700 dark:text-slate-300">Naam</th>
                    <th className="text-left p-3 text-slate-700 dark:text-slate-300">Type</th>
                    <th className="text-right p-3 text-slate-700 dark:text-slate-300">Debet</th>
                    <th className="text-right p-3 text-slate-700 dark:text-slate-300">Credit</th>
                    <th className="text-right p-3 text-slate-700 dark:text-slate-300">Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {ledgerAccounts.map((account) => {
                    const typeLabels: Record<string, string> = {
                      asset: 'Activa',
                      liability: 'Passiva',
                      equity: 'Eigen Vermogen',
                      revenue: 'Omzet',
                      expense: 'Kosten',
                    };
                    return (
                      <tr key={account.id} className="border-b border-slate-100 dark:border-slate-800">
                        <td className="p-3 text-slate-900 dark:text-white">{account.accountNumber}</td>
                        <td className="p-3 text-slate-900 dark:text-white">{account.name}</td>
                        <td className="p-3 text-slate-500 dark:text-slate-400">{typeLabels[account.type]}</td>
                        <td className="p-3 text-right text-slate-900 dark:text-white">€{account.debit.toFixed(2)}</td>
                        <td className="p-3 text-right text-slate-900 dark:text-white">€{account.credit.toFixed(2)}</td>
                        <td className="p-3 text-right font-medium text-slate-900 dark:text-white">€{account.balance.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'journal' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Journaalposten</h3>
            </div>
            {filteredJournalEntries.length === 0 ? (
              <EmptyState
                icon={BookOpen}
                title="Geen journaalposten gevonden"
                description={searchQuery ? "Geen resultaten voor je zoekopdracht. Probeer andere zoektermen." : "Journaalposten worden automatisch gegenereerd vanuit facturen en kassaverkopen, of je kunt handmatig een journaalpost aanmaken."}
                actionLabel={!searchQuery ? "Nieuwe Journaalpost" : undefined}
                onAction={!searchQuery ? () => setShowJournalEntryForm(true) : undefined}
                suggestions={!searchQuery ? [
                  "Maak facturen aan in de Accounting module",
                  "Registreer verkopen in de POS module",
                  "Maak handmatig een journaalpost aan voor correcties"
                ] : undefined}
              />
            ) : (
              <div className="space-y-4">
                {filteredJournalEntries.map(entry => (
                  <Card 
                    key={entry.id} 
                    className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedJournalEntry(entry)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">{entry.entryNumber}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{entry.description}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {new Date(entry.date).toLocaleDateString('nl-NL')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {entry.invoiceId && (
                          <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                            Factuur
                          </span>
                        )}
                        {entry.posSaleId && (
                          <span className="text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                            POS
                          </span>
                        )}
                        {!entry.invoiceId && !entry.posSaleId && (
                          <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            Handmatig
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {entry.entries.length} boekingsregels
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'vat' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">BTW-Overzicht</h3>
            {vatReport ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <h4 className="font-semibold mb-4 text-slate-900 dark:text-white">Omzet BTW</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Omzet 21% BTW</span>
                      <span className="font-medium text-slate-900 dark:text-white">€{vatReport.sales21.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">BTW 21%</span>
                      <span className="font-medium text-slate-900 dark:text-white">€{vatReport.salesVat21.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Omzet 9% BTW</span>
                      <span className="font-medium text-slate-900 dark:text-white">€{vatReport.sales9.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">BTW 9%</span>
                      <span className="font-medium text-slate-900 dark:text-white">€{vatReport.salesVat9.toFixed(2)}</span>
                    </div>
                    {vatReport.sales0 > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Omzet 0% BTW</span>
                        <span className="font-medium text-slate-900 dark:text-white">€{vatReport.sales0.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </Card>
                <Card>
                  <h4 className="font-semibold mb-4 text-slate-900 dark:text-white">Voorbelasting</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Voorbelasting 21%</span>
                      <span className="font-medium text-slate-900 dark:text-white">€{vatReport.inputVat21.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Voorbelasting 9%</span>
                      <span className="font-medium text-slate-900 dark:text-white">€{vatReport.inputVat9.toFixed(2)}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex justify-between">
                        <span className="font-semibold text-slate-900 dark:text-white">Totaal BTW te betalen</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400">€{vatReport.vatToPay.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">Laden...</div>
            )}
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Factuur Archief</h3>
            {filteredInvoices.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="Geen facturen gevonden"
                description={searchQuery ? "Geen resultaten voor je zoekopdracht." : "Facturen worden automatisch gearchiveerd wanneer je ze aanmaakt in de Accounting module."}
                suggestions={!searchQuery ? [
                  "Ga naar de Accounting module om facturen aan te maken",
                  "Facturen worden hier automatisch weergegeven"
                ] : undefined}
              />
            ) : (
              <div className="space-y-2">
                {filteredInvoices.map(invoice => (
                  <Card key={invoice.id} className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">{invoice.invoiceNumber}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{invoice.customerName}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {new Date(invoice.issueDate || invoice.createdAt).toLocaleDateString('nl-NL')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900 dark:text-white">€{invoice.total.toFixed(2)}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          invoice.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                          invoice.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {invoice.status === 'paid' ? 'Betaald' : invoice.status === 'sent' ? 'Verzonden' : 'Concept'}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'pos' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Kassa Verkopen</h3>
            {filteredPosSales.length === 0 ? (
              <EmptyState
                icon={Receipt}
                title="Geen kassaverkopen gevonden"
                description={searchQuery ? "Geen resultaten voor je zoekopdracht." : "Kassaverkopen worden automatisch geregistreerd wanneer je transacties verwerkt in de POS module."}
                suggestions={!searchQuery ? [
                  "Ga naar de POS module om verkopen te registreren",
                  "Verkopen worden hier automatisch weergegeven"
                ] : undefined}
              />
            ) : (
              <div className="space-y-2">
                {filteredPosSales.map(sale => (
                  <Card key={sale.id} className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">{sale.saleNumber}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{sale.employeeName}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {new Date(sale.date).toLocaleDateString('nl-NL')} - {sale.items.length} artikelen
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900 dark:text-white">€{sale.total.toFixed(2)}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {sale.paymentMethod === 'cash' ? 'Contant' : sale.paymentMethod === 'card' ? 'Pin' : 'Overig'}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'dossiers' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Klant Dossiers</h3>
            {filteredCustomerDossiers.length === 0 ? (
              <EmptyState
                icon={Users}
                title="Geen klantdossiers gevonden"
                description={searchQuery ? "Geen resultaten voor je zoekopdracht." : "Klantdossiers worden automatisch aangemaakt wanneer je facturen of offertes voor klanten aanmaakt."}
                suggestions={!searchQuery ? [
                  "Maak facturen aan voor klanten in de Accounting module",
                  "Dossiers tonen een overzicht van alle financiële interacties"
                ] : undefined}
              />
            ) : (
              <div className="space-y-2">
                {filteredCustomerDossiers.map(dossier => (
                  <Card key={dossier.customerId} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">{dossier.customerName}</h4>
                        <div className="mt-2 space-y-1 text-sm">
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-600 dark:text-slate-400">Totaal gefactureerd:</span>
                            <span className="font-medium text-slate-900 dark:text-white">€{dossier.totalInvoiced.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-600 dark:text-slate-400">Totaal betaald:</span>
                            <span className="font-medium text-emerald-600 dark:text-emerald-400">€{dossier.totalPaid.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-600 dark:text-slate-400">Openstaand:</span>
                            <span className="font-medium text-amber-600 dark:text-amber-400">€{dossier.outstandingBalance.toFixed(2)}</span>
                          </div>
                          <div className="flex gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2">
                            <span>{dossier.invoices.length} facturen</span>
                            <span>{dossier.quotes.length} offertes</span>
                            <span>{dossier.workOrders.length} werkorders</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
        </div>
        </>
      )}

      {/* Modals */}
      {showJournalEntryForm && (
        <JournalEntryForm
          ledgerAccounts={ledgerAccounts}
          onSubmit={handleCreateJournalEntry}
          onCancel={() => setShowJournalEntryForm(false)}
        />
      )}

      {selectedJournalEntry && (
        <JournalEntryDetailModal
          entry={selectedJournalEntry}
          onClose={() => setSelectedJournalEntry(null)}
        />
      )}
    </div>
  );
};
