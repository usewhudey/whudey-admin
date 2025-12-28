// ==========================================
// app/(dashboard)/dashboard/admins/AllActivitiesTab.tsx
// ==========================================

'use client';

import { useState } from 'react';
import { useGetActivitiesQuery } from '@/features/admins/adminsApi';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, ChevronLeft, ChevronRight, User, Store, Shield } from 'lucide-react';
import Link from 'next/link';

export default function AllActivitiesTab() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetActivitiesQuery({ page, limit: 20 });

  const getActionBadge = (action: string) => {
    const actionMap: Record<string, { color: string; label: string }> = {
      resolved: { color: 'bg-green-100 text-green-800', label: 'Resolved Report' },
      suspend_seller: { color: 'bg-red-100 text-red-800', label: 'Suspended Seller' },
      unsuspend_seller: { color: 'bg-blue-100 text-blue-800', label: 'Unsuspended Seller' },
      promoted_to_admin: { color: 'bg-purple-100 text-purple-800', label: 'Promoted to Admin' },
      grant_subscription: { color: 'bg-green-100 text-green-800', label: 'Granted Subscription' },
      reset_seller_password: { color: 'bg-yellow-100 text-yellow-800', label: 'Reset Password' },
    };

    const config = actionMap[action] || { color: 'bg-gray-100 text-gray-800', label: action };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="divide-y divide-gray-200">
        {data?.activities.map(activity => (
          <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-4">
              {/* Admin Avatar */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                  {activity.admin.name[0].toUpperCase()}
                </div>
              </div>

              {/* Activity Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Link
                    href={`/dashboard/admins/${activity.admin.id}`}
                    className="font-medium text-gray-900 hover:text-blue-600"
                  >
                    {activity.admin.name}
                  </Link>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                  </span>
                </div>

                <p className="text-sm text-gray-700 mb-3">{activity.description}</p>

                <div className="flex items-center gap-3 flex-wrap">
                  {getActionBadge(activity.action)}

                  {activity.targetUser && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <User className="w-3.5 h-3.5" />
                      <span>{activity.targetUser.name}</span>
                    </div>
                  )}

                  {activity.targetStore && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <Store className="w-3.5 h-3.5" />
                      <span>Store ID: {activity.targetStore.id.slice(-8)}</span>
                    </div>
                  )}
                </div>

                {/* Metadata */}
                {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-md">
                    <p className="text-xs font-medium text-gray-500 mb-1">Additional Details:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(activity.metadata).map(([key, value]) => (
                        <div key={key} className="text-xs">
                          <span className="text-gray-500 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                          </span>
                          <span className="text-gray-900 ml-1">
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {data?.pagination && data.pagination.pages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {(data.pagination.page - 1) * data.pagination.limit + 1} to{' '}
            {Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)} of{' '}
            {data.pagination.total} activities
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => p - 1)}
              disabled={data.pagination.page === 1}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-700">
              Page {data.pagination.page} of {data.pagination.pages}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={data.pagination.page === data.pagination.pages}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}