// ==========================================
// app/(dashboard)/dashboard/issues/IssuesHeader.tsx
// ==========================================

'use client';

import { AlertCircle, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface IssuesHeaderProps {
  stats?: {
    pending: number;
    inProgress: number;
    resolved: number;
    closed: number;
    total: number;
  };
}

export default function IssuesHeader({ stats }: IssuesHeaderProps) {
  const statCards = [
    {
      label: 'Pending',
      value: stats?.pending || 0,
      icon: AlertCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      label: 'In Progress',
      value: stats?.inProgress || 0,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Resolved',
      value: stats?.resolved || 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Closed',
      value: stats?.closed || 0,
      icon: XCircle,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <AlertTriangle className="w-7 h-7 text-orange-600" />
          Issues Management
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Monitor and resolve user-reported issues
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statCards.map(stat => (
          <div
            key={stat.label}
            className={`${stat.bgColor} rounded-lg p-4 border border-gray-200`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
