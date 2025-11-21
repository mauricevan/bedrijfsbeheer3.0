/**
 * Accounting Dashboard Component
 * Dashboard view with metrics, charts, and insights
 */

import React, { useMemo, useState } from 'react';
import { ArrowRight, TrendingUp, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card } from '@/components/common/Card';
import type { Invoice, Quote } from '../types';
import {
  calculateAveragePaymentTerm,
  generateInsights,
  getRevenuePerMonth,
  getOutstandingPerCustomer,
  getTopCustomers,
  getPaymentBehaviorByMonth,
  getQuotesPerStatus,
} from '../utils/analytics';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type AccountingDashboardProps = {
  invoices: Invoice[];
  quotes: Quote[];
  onMetricClick?: (metric: string) => void;
};

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const AccountingDashboard: React.FC<AccountingDashboardProps> = ({
  invoices,
  quotes,
  onMetricClick,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'quarter' | 'year'>('month');

  const totalRevenue = useMemo(() => {
    return invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.total, 0);
  }, [invoices]);

  const totalInvoiced = useMemo(() => {
    return invoices.reduce((sum, inv) => sum + inv.total, 0);
  }, [invoices]);

  const outstanding = useMemo(() => {
    return invoices
      .filter(inv => inv.status !== 'paid' && inv.status !== 'cancelled')
      .reduce((sum, inv) => sum + inv.total, 0);
  }, [invoices]);

  const openQuotes = useMemo(() => {
    return quotes
      .filter(q => q.status === 'sent' || q.status === 'draft')
      .reduce((sum, q) => sum + q.total, 0);
  }, [quotes]);

  const expiredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      if (inv.status === 'paid' || inv.status === 'cancelled') return false;
      return new Date(inv.dueDate) < new Date();
    }).reduce((sum, inv) => sum + inv.total, 0);
  }, [invoices]);

  const averagePaymentTerm = useMemo(() => calculateAveragePaymentTerm(invoices), [invoices]);
  const revenuePerMonth = useMemo(() => getRevenuePerMonth(invoices), [invoices]);
  const outstandingPerCustomer = useMemo(() => getOutstandingPerCustomer(invoices), [invoices]);
  const topCustomers = useMemo(() => getTopCustomers(invoices, 5), [invoices]);
  const quotesPerStatus = useMemo(() => getQuotesPerStatus(quotes), [quotes]);
  const paymentBehavior = useMemo(() => getPaymentBehaviorByMonth(invoices), [invoices]);
  const insights = useMemo(() => generateInsights(invoices, quotes), [invoices, quotes]);

  const handleMetricClick = (metric: string) => {
    if (onMetricClick) {
      onMetricClick(metric);
    }
  };

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Systeem Analytics</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600 dark:text-slate-400">Periode:</span>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as typeof selectedPeriod)}
            className="px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
          >
            <option value="today">Vandaag</option>
            <option value="week">Laatste Week</option>
            <option value="month">Laatste Maand</option>
            <option value="quarter">Laatste Kwartaal</option>
            <option value="year">Laatste Jaar</option>
          </select>
          <button className="px-3 py-1 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200">
            Reset
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card
          className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleMetricClick('revenue')}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">Totale Omzet</span>
            <span className="text-2xl">💰</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">€{totalRevenue.toFixed(2)}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            Klik voor details <ArrowRight className="h-3 w-3" />
          </p>
        </Card>

        <Card
          className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleMetricClick('invoiced')}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">Totaal Gefactureerd</span>
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">€{totalInvoiced.toFixed(2)}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            Klik voor details <ArrowRight className="h-3 w-3" />
          </p>
        </Card>

        <Card
          className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleMetricClick('outstanding')}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">Openstaand</span>
            <span className="text-2xl">⏳</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">€{outstanding.toFixed(2)}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            Klik voor details <ArrowRight className="h-3 w-3" />
          </p>
        </Card>

        <Card
          className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleMetricClick('quotes')}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">Openstaande Offertes</span>
            <span className="text-2xl">📋</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">€{openQuotes.toFixed(2)}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            Klik voor details <ArrowRight className="h-3 w-3" />
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">Gem. Betalingstermijn</span>
            <span className="text-2xl">📅</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{averagePaymentTerm} dagen</p>
        </Card>

        <Card
          className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleMetricClick('expired')}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">Verlopen</span>
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">€{expiredInvoices.toFixed(2)}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            Klik voor details <ArrowRight className="h-3 w-3" />
          </p>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue per Month */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Omzet per Maand
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenuePerMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#6366f1" name="Omzet (€)" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Outstanding per Customer */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Openstaand per Klant
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={outstandingPerCustomer}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="customerName" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Top 5 Customers */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Top 5 Klanten
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topCustomers} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="customerName" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="total" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Quotes per Status */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Offertes per Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={Object.entries(quotesPerStatus).map(([status, count]) => ({ status, count }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ status, count }) => `${status}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {Object.entries(quotesPerStatus).map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Payment Behavior */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Betaalgedrag per Maand
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={paymentBehavior}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="onTime" stackId="a" fill="#10b981" name="Op tijd" />
              <Bar dataKey="late" stackId="a" fill="#ef4444" name="Te laat" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Insights & Recommendations */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">💡</span>
          Inzichten & Aanbevelingen
        </h3>
        <div className="space-y-2">
          {insights.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400">
              Geen specifieke inzichten op dit moment.
            </p>
          ) : (
            insights.map((insight, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  insight.type === 'warning'
                    ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
                    : insight.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                }`}
              >
                <p className="text-sm text-slate-900 dark:text-white">{insight.message}</p>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

