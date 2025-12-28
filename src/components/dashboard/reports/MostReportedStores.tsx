// ==========================================
// components/reports/MostReportedStores.tsx
// ==========================================

'use client';

import { useRouter } from 'next/navigation';
import { ReportStats } from '@/types/report';
import { Button } from '@/components/ui/button';
import { Store, Eye } from 'lucide-react';

interface MostReportedStoresProps {
  stores: ReportStats['mostReported'];
}

export function MostReportedStores({ stores }: MostReportedStoresProps) {
  const router = useRouter();

  if (stores.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Most Reported Stores
        </h3>
        <p className="text-gray-500 text-center py-8">No reported stores</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <Store className="w-5 h-5 text-red-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Most Reported Stores
        </h3>
      </div>

      <div className="space-y-3">
        {stores.map((store, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <div className="flex-1">
              <p className="font-medium text-gray-900">{store.storeName}</p>
              <p className="text-sm text-gray-600">@{store.storeSlug}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 text-sm font-semibold text-red-600 bg-red-100 rounded-full">
                {store.reportCount} {store.reportCount === 1 ? 'report' : 'reports'}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/sellers/${store.storeId}`)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}