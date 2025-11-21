import React from 'react';
import { BarChart3, TrendingUp, DollarSign } from 'lucide-react';
import { Card } from '@/components/common/Card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const salesData = [
  { month: 'Jan', revenue: 12400, orders: 45 },
  { month: 'Feb', revenue: 15600, orders: 52 },
  { month: 'Mar', revenue: 18200, orders: 61 },
  { month: 'Apr', revenue: 22100, orders: 73 },
  { month: 'May', revenue: 25800, orders: 85 },
  { month: 'Jun', revenue: 28900, orders: 92 },
];

const categoryData = [
  { name: 'Electronics', value: 35 },
  { name: 'Office Supplies', value: 28 },
  { name: 'Furniture', value: 22 },
  { name: 'Other', value: 15 },
];

const COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b'];

export const ReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reports & Analytics</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Business insights and analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Revenue</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">€245,680</p>
              <p className="text-xs text-emerald-600 mt-1">+12.5% from last month</p>
            </div>
            <DollarSign className="h-10 w-10 text-emerald-500" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Orders</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">1,234</p>
              <p className="text-xs text-emerald-600 mt-1">+8.2% from last month</p>
            </div>
            <BarChart3 className="h-10 w-10 text-indigo-500" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Growth Rate</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">18.5%</p>
              <p className="text-xs text-emerald-600 mt-1">+2.1% from last month</p>
            </div>
            <TrendingUp className="h-10 w-10 text-violet-500" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ fill: '#6366f1', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Orders by Month</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="orders" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Revenue vs Orders</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis yAxisId="left" stroke="#64748b" />
              <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="revenue" fill="#6366f1" radius={[8, 8, 0, 0]} />
              <Bar yAxisId="right" dataKey="orders" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};
