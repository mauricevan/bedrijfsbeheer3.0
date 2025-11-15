import React from "react";
import type { Invoice, Quote, Transaction, Customer } from "../../../types";
import { useAccountingDashboard } from "../../../features/accounting/hooks/useAccountingDashboard";
import { DashboardStats } from "./DashboardStats";
import { DashboardCharts } from "./DashboardCharts";

export interface AccountingDashboardProps {
  invoices: Invoice[];
  quotes: Quote[];
  transactions: Transaction[];
  customers: Customer[];
  onNavigate: (view: string, data?: any) => void;
}

export const AccountingDashboard: React.FC<AccountingDashboardProps> = ({
  invoices,
  quotes,
  transactions,
  customers,
  onNavigate,
}) => {
  const dashboardData = useAccountingDashboard(invoices, quotes, transactions, customers);

  const {
    totalInvoiced,
    totalPaid,
    totalOverdue,
    totalOutstanding,
  } = dashboardData.stats.invoice;
  const { openQuotesCount, avgPaymentDays } = dashboardData.stats;

  const {
    monthlyRevenue,
    openByCustomer,
    salesByCustomer,
    paymentBehavior,
  } = dashboardData.charts;

  const { comparisonToPrevious, quotesByStatusWithValue, insights } = dashboardData.insights;

  return (
    <div className="space-y-6">
      <DashboardStats
        totalPaid={totalPaid}
        totalInvoiced={totalInvoiced}
        totalOutstanding={totalOutstanding}
        openQuotesCount={openQuotesCount}
        avgPaymentDays={avgPaymentDays}
        totalOverdue={totalOverdue}
        comparisonToPrevious={comparisonToPrevious}
        onNavigate={onNavigate}
      />

      <DashboardCharts
        monthlyRevenue={monthlyRevenue}
        openByCustomer={openByCustomer}
        salesByCustomer={salesByCustomer}
        quotesByStatusWithValue={quotesByStatusWithValue}
        paymentBehavior={paymentBehavior}
        onNavigate={onNavigate}
      />

      {insights.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-neutral mb-4 flex items-center gap-2">
            <span>💡</span>
            <span>Inzichten & Aanbevelingen</span>
          </h3>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-l-4 ${
                  insight.includes("⚠️")
                    ? "bg-red-50 border-red-400"
                    : insight.includes("✅") || insight.includes("📈")
                    ? "bg-green-50 border-green-400"
                    : "bg-blue-50 border-blue-400"
                }`}
              >
                <p className="text-sm text-gray-700">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
