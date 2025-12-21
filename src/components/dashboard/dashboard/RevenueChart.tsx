/* eslint-disable @typescript-eslint/no-explicit-any */
// ==========================================
// components/dashboard/RevenueChart.tsx
// ==========================================

'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useGetRevenueChartQuery } from '@/features/dashboard/dashboardApi';
import { RevenuePeriod } from '@/types/dashboard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export function RevenueChart() {
  const [period, setPeriod] = useState<RevenuePeriod>('daily');
  const [days, setDays] = useState(30);

  const { data, isLoading, error } = useGetRevenueChartQuery({
    period,
    days,
  });

  const formatPeriod = (periodData: any) => {
    if (periodData.day) {
      return `${periodData.year}-${String(periodData.month).padStart(2, '0')}-${String(periodData.day).padStart(2, '0')}`;
    }
    if (periodData.week) {
      return `W${periodData.week} ${periodData.year}`;
    }
    if (periodData.month) {
      return `${periodData.year}-${String(periodData.month).padStart(2, '0')}`;
    }
    return `${periodData.year}`;
  };

  const chartData =
    data?.data.map(item => ({
      name: formatPeriod(item.period),
      revenue: item.revenue,
      transactions: item.transactions,
    })) || [];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Revenue Chart</h2>

        <div className="flex gap-2 mt-4 sm:mt-0">
          <select
            value={period}
            onChange={e => setPeriod(e.target.value as RevenuePeriod)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>

          <select
            value={days}
            onChange={e => setDays(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value={7}>7 days</option>
            <option value={30}>30 days</option>
            <option value={60}>60 days</option>
            <option value={90}>90 days</option>
            <option value={180}>6 months</option>
            <option value={365}>1 year</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="h-80 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="h-80 flex items-center justify-center text-red-500">
          Failed to load revenue data
        </div>
      ) : chartData.length === 0 ? (
        <div className="h-80 flex items-center justify-center text-gray-500">
          No revenue data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
              formatter={(value: any) => [
                `₦${value.toLocaleString()}`,
                'Revenue',
              ]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ fill: '#8b5cf6', r: 4 }}
              activeDot={{ r: 6 }}
              name="Revenue (₦)"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
