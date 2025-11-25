import React, { useEffect, useState } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, DollarSign, FileText, Calendar, User } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { customerDashboardService } from '../../services/customerDashboardService';
import type { CustomerDashboard } from '../../types/crm.types';

interface CustomerDetailViewProps {
  customerId: string;
  onBack: () => void;
}

export const CustomerDetailView: React.FC<CustomerDetailViewProps> = ({
  customerId,
  onBack,
}) => {
  const [dashboard, setDashboard] = useState<CustomerDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, [customerId]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const data = await customerDashboardService.getCustomerDashboard(customerId);
      setDashboard(data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 dark:text-slate-400">Klant niet gevonden</p>
        <Button onClick={onBack} className="mt-4">
          Terug naar Overzicht
        </Button>
      </div>
    );
  }

  const { customer, salesSummary, financialSummary, recentDocuments, journeyEntries, openTasks } = dashboard;

  const trendIcon = salesSummary.trend === 'up' ? TrendingUp : salesSummary.trend === 'down' ? TrendingDown : Minus;
  const TrendIcon = trendIcon;
  const trendColor = salesSummary.trend === 'up' ? 'text-green-600' : salesSummary.trend === 'down' ? 'text-red-600' : 'text-gray-600';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={onBack}
          >
            Terug
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{customer.name}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {customer.company && `${customer.company} • `}
              {customer.email}
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sales Summary */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Verkoop Overzicht</h3>
            <DollarSign className="h-5 w-5 text-blue-500" />
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                €{salesSummary.totalSales.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Totale verkoop</p>
            </div>
            <div className="flex items-center gap-2">
              <TrendIcon className={`h-4 w-4 ${trendColor}`} />
              <span className={`text-sm font-medium ${trendColor}`}>
                {salesSummary.trendPercentage > 0 ? '+' : ''}{salesSummary.trendPercentage.toFixed(1)}%
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">vs vorige periode</span>
            </div>
            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Gemiddeld per order</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  €{salesSummary.averageSalePerOrder.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Totaal orders</span>
                <span className="font-medium text-slate-900 dark:text-white">{salesSummary.totalOrders}</span>
              </div>
              {salesSummary.lastSaleDate && (
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Laatste verkoop</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {new Date(salesSummary.lastSaleDate).toLocaleDateString('nl-NL')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Financieel Overzicht</h3>
            <FileText className="h-5 w-5 text-green-500" />
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                €{financialSummary.outstandingBalance.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Openstaand bedrag</p>
            </div>
            {financialSummary.overdueAmount > 0 && (
              <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  €{financialSummary.overdueAmount.toLocaleString('nl-NL', { minimumFractionDigits: 2 })} achterstallig
                </p>
              </div>
            )}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Kredietlimiet</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  €{financialSummary.creditLimit.toLocaleString('nl-NL')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Krediet gebruikt</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {financialSummary.creditLimit > 0 
                    ? `${((financialSummary.creditUsed / financialSummary.creditLimit) * 100).toFixed(0)}%`
                    : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Gem. betaaltermijn</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {financialSummary.averagePaymentDays} dagen
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Open Tasks */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Openstaande Taken</h3>
            <Calendar className="h-5 w-5 text-purple-500" />
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{openTasks.length}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Actieve taken</p>
            </div>
            {openTasks.length > 0 ? (
              <div className="space-y-2">
                {openTasks.slice(0, 3).map(task => (
                  <div key={task.id} className="p-2 bg-slate-50 dark:bg-slate-800 rounded text-sm">
                    <p className="font-medium text-slate-900 dark:text-white truncate">{task.title}</p>
                    {task.dueDate && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Deadline: {new Date(task.dueDate).toLocaleDateString('nl-NL')}
                      </p>
                    )}
                  </div>
                ))}
                {openTasks.length > 3 && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                    +{openTasks.length - 3} meer
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">Geen openstaande taken</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Documents */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recente Documenten</h3>
        {recentDocuments.length > 0 ? (
          <div className="space-y-2">
            {recentDocuments.map(doc => {
              const statusColors = {
                draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
                sent: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
                paid: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
                overdue: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
                cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
              };

              return (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{doc.title}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {new Date(doc.date).toLocaleDateString('nl-NL')}
                        {doc.amount && ` • €${doc.amount.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}`}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[doc.status]}`}>
                    {doc.status}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
            Geen documenten beschikbaar
          </p>
        )}
      </div>

      {/* Customer Journey Timeline */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Customer Journey</h3>
        {journeyEntries.length > 0 ? (
          <div className="space-y-4">
            {journeyEntries.slice(0, 10).map((entry, index) => {
              const typeIcons = {
                interaction: User,
                quote: FileText,
                invoice: DollarSign,
                work_order: Calendar,
                payment: DollarSign,
                note: FileText,
              };
              const Icon = typeIcons[entry.type] || FileText;

              const typeColors = {
                interaction: 'text-blue-500',
                quote: 'text-purple-500',
                invoice: 'text-green-500',
                work_order: 'text-orange-500',
                payment: 'text-emerald-500',
                note: 'text-gray-500',
              };

              return (
                <div key={entry.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`p-2 rounded-full bg-slate-100 dark:bg-slate-800 ${typeColors[entry.type]}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    {index < journeyEntries.length - 1 && (
                      <div className="w-px h-full bg-slate-200 dark:bg-slate-700 mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{entry.title}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{entry.description}</p>
                        {entry.amount && (
                          <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-1">
                            €{entry.amount.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                        {new Date(entry.date).toLocaleDateString('nl-NL')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            {journeyEntries.length > 10 && (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center pt-4">
                +{journeyEntries.length - 10} meer activiteiten
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
            Geen activiteiten beschikbaar
          </p>
        )}
      </div>
    </div>
  );
};
