// ==========================================
// app/(dashboard)/dashboard/issues/page.tsx
// ==========================================

'use client';

import { useState } from 'react';
import {
  useGetIssuesQuery,
  useGetIssueStatsQuery,
} from '@/features/issues/issuesApi';
import {  type IssueFilters } from '@/types/issue';

import { Loader2 } from 'lucide-react';
import IssuesHeader from '@/components/dashboard/issues/IssuesHeader';
import IssueFiltersBar from '@/components/dashboard/issues/IssueFiltersBar';
import IssuesTable from '@/components/dashboard/issues/IssuesTable';

export default function IssuesPage() {
  const [filters, setFilters] = useState<IssueFilters>({
    page: 1,
    limit: 20,
    sortBy: 'newest',
  });

  const { data: statsData } = useGetIssueStatsQuery();
  const { data, isLoading, error } = useGetIssuesQuery(filters);

  const handleFilterChange = (newFilters: Partial<IssueFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page !== undefined ? newFilters.page : 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 font-medium">Failed to load issues</p>
          <p className="text-sm text-gray-500 mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <IssuesHeader stats={statsData?.data.stats} />

      <IssueFiltersBar filters={filters} onFilterChange={handleFilterChange} />

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <IssuesTable
          issues={data?.issues || []}
          pagination={data?.pagination}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
