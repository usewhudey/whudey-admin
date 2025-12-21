// ==========================================
// components/dashboard/UserGrowthChart.tsx
// ==========================================

'use client';

import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useGetUserGrowthQuery } from '@/features/dashboard/dashboardApi';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export function UserGrowthChart() {
  const [days, setDays] = useState(30);

  const { data, isLoading, error } = useGetUserGrowthQuery({ days });

  const chartData = data?.data || [];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">User Growth</h2>

        <select
          value={days}
          onChange={e => setDays(Number(e.target.value))}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 mt-4 sm:mt-0"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={60}>Last 60 days</option>
          <option value={90}>Last 90 days</option>
          <option value={180}>Last 6 months</option>
        </select>
      </div>

      {isLoading ? (
        <div className="h-80 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="h-80 flex items-center justify-center text-red-500">
          Failed to load user growth data
        </div>
      ) : chartData.length === 0 ? (
        <div className="h-80 flex items-center justify-center text-gray-500">
          No user growth data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="free"
              stackId="1"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
              name="Free Users"
            />
            <Area
              type="monotone"
              dataKey="paid"
              stackId="1"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.6}
              name="Paid Users"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
