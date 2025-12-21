// ==========================================
// components/dashboard/StatsCards.tsx
// ==========================================

'use client';

import { PlatformStats } from '@/types/dashboard';
import {
  Users,
  UserCheck,
  Package,
  DollarSign,
  UserPlus,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

interface StatsCardsProps {
  stats: PlatformStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const statsData = [
    {
      title: 'Total Sellers',
      value: stats.totalSellers.count.toLocaleString(),
      icon: Users,
      growth: stats.totalSellers.growth,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Sellers',
      value: stats.activeSellers.count.toLocaleString(),
      subtitle: `${stats.activeSellers.percentage.toFixed(1)}% active`,
      icon: UserCheck,
      color: 'bg-green-500',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts.count.toLocaleString(),
      subtitle: `${stats.totalProducts.avgPerSeller.toFixed(1)} avg/seller`,
      icon: Package,
      color: 'bg-purple-500',
    },
    {
      title: 'Monthly Revenue',
      value: `₦${stats.monthlyRevenue.amount.toLocaleString()}`,
      icon: DollarSign,
      growth: stats.monthlyRevenue.growth,
      color: 'bg-emerald-500',
    },
    {
      title: 'New Signups Today',
      value: stats.newSignupsToday.count.toLocaleString(),
      icon: UserPlus,
      growth: stats.newSignupsToday.weeklyTrend,
      color: 'bg-orange-500',
    },
    {
      title: 'Conversion Rate',
      value: `${stats.paidConversionRate.rate.toFixed(1)}%`,
      subtitle: `Target: ${stats.paidConversionRate.target}%`,
      icon: TrendingUp,
      color: 'bg-pink-500',
      extraInfo: `${stats.paidConversionRate.freeUsers} free, ${stats.paidConversionRate.paidUsers} paid`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        const hasGrowth = stat.growth !== undefined;
        const isPositive = hasGrowth && stat.growth > 0;
        const isNegative = hasGrowth && stat.growth < 0;

        return (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>

                {stat.subtitle && (
                  <p className="text-sm text-gray-500 mt-1">{stat.subtitle}</p>
                )}

                {stat.extraInfo && (
                  <p className="text-xs text-gray-400 mt-1">
                    {stat.extraInfo}
                  </p>
                )}

                {hasGrowth && (
                  <div className="flex items-center mt-2">
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : isNegative ? (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    ) : null}
                    <span
                      className={`text-sm font-medium ${
                        isPositive
                          ? 'text-green-600'
                          : isNegative
                          ? 'text-red-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {stat.growth.toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>

              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
