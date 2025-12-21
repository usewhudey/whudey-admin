// ==========================================
// components/dashboard/RecentActivity.tsx
// ==========================================

'use client';

import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { UserPlus, ArrowUpCircle, XCircle, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useGetRecentActivityQuery } from '@/features/dashboard/dashboardApi';

export function RecentActivity() {
  const { data, isLoading, error } = useGetRecentActivityQuery({ limit: 50 });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'signup':
        return <UserPlus className="w-5 h-5 text-blue-500" />;
      case 'upgrade':
        return <ArrowUpCircle className="w-5 h-5 text-green-500" />;
      case 'cancellation':
        return <XCircle className="w-5 h-5 text-orange-500" />;
      case 'suspension':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'signup':
        return 'bg-blue-50 border-blue-100';
      case 'upgrade':
        return 'bg-green-50 border-green-100';
      case 'cancellation':
        return 'bg-orange-50 border-orange-100';
      case 'suspension':
        return 'bg-red-50 border-red-100';
      default:
        return 'bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Recent Activity
      </h2>

      {isLoading ? (
        <div className="h-96 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="h-96 flex items-center justify-center text-red-500">
          Failed to load recent activity
        </div>
      ) : !data?.data || data.data.length === 0 ? (
        <div className="h-96 flex items-center justify-center text-gray-500">
          No recent activity
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {data.data.map((activity, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 p-4 rounded-lg border ${getActivityColor(
                activity.type
              )}`}
            >
              <div className="mt-0.5">{getActivityIcon(activity.type)}</div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.description}
                </p>

                {activity.metadata.email && (
                  <p className="text-xs text-gray-600 mt-1">
                    {activity.metadata.email}
                  </p>
                )}

                {activity.metadata.tier && (
                  <p className="text-xs text-gray-600 mt-1">
                    Tier: {activity.metadata.tier}
                    {activity.metadata.amount && ` • ₦${activity.metadata.amount.toLocaleString()}`}
                  </p>
                )}

                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(activity.timestamp), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}