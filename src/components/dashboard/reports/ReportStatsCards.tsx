// ==========================================
// components/reports/ReportStatsCards.tsx
// ==========================================

'use client';

import { ReportStats } from '@/types/report';
import { AlertTriangle, CheckCircle, XCircle, FileText } from 'lucide-react';

interface ReportStatsCardsProps {
  stats: ReportStats;
}

export function ReportStatsCards({ stats }: ReportStatsCardsProps) {
  const cards = [
    {
      title: 'Pending Reports',
      value: stats.stats.pending,
      icon: AlertTriangle,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
    },
    {
      title: 'Resolved',
      value: stats.stats.resolved,
      icon: CheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-600',
    },
    {
      title: 'Dismissed',
      value: stats.stats.dismissed,
      icon: XCircle,
      color: 'bg-gray-500',
      textColor: 'text-gray-600',
    },
    {
      title: 'Total Reports',
      value: stats.stats.total,
      icon: FileText,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  {card.title}
                </p>
                <p className={`text-3xl font-bold mt-2 ${card.textColor}`}>
                  {card.value}
                </p>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}