// ==========================================
// components/reports/ReportsByReason.tsx
// ==========================================

'use client';

import { ReportStats } from '@/types/report';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { BarChart3 } from 'lucide-react';

interface ReportsByReasonProps {
  reasons: ReportStats['byReason'];
}

const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

const REASON_LABELS: Record<string, string> = {
  scam: 'Scam',
  fake_products: 'Fake Products',
  non_delivery: 'Non-Delivery',
  poor_quality: 'Poor Quality',
  offensive_content: 'Offensive Content',
  counterfeit: 'Counterfeit',
  misleading_info: 'Misleading Info',
  harassment: 'Harassment',
  spam: 'Spam',
  other: 'Other',
};

export function ReportsByReason({ reasons }: ReportsByReasonProps) {
  const chartData = reasons.map(r => ({
    name: REASON_LABELS[r.reason] || r.reason,
    value: r.count,
  }));

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Reports by Reason
        </h3>
      </div>

      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          No report data available
        </div>
      )}
    </div>
  );
}
