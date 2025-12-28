// ==========================================
// app/reports/page.tsx
// ==========================================

'use client';

import { useState } from 'react';
import {
  useGetReportStatsQuery,
  useGetReportsQuery,
} from '@/features/reports/reportsApi';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

import { Button } from '@/components/ui/button';
import { GetReportsParams } from '@/types/report';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { ReportStatsCards } from '@/components/dashboard/reports/ReportStatsCards';
import { MostReportedStores } from '@/components/dashboard/reports/MostReportedStores';
import { ReportFilters } from '@/components/dashboard/reports/ReportFilters';
import { ReportsTable } from '@/components/dashboard/reports/ReportsTable';
import { ReportsByReason } from '@/components/dashboard/reports/ReportsByReason';

export default function ReportsPage() {
  const [filters, setFilters] = useState<GetReportsParams>({
    page: 1,
    limit: 20,
    sortBy: 'newest',
  });

  const { data: statsData, isLoading: statsLoading } = useGetReportStatsQuery();
  const { data: reportsData, isLoading: reportsLoading } =
    useGetReportsQuery(filters);

  const handleFilterChange = (newFilters: GetReportsParams) => {
    setFilters({ ...newFilters, page: 1, limit: 20 });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  if (statsLoading || reportsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-600 mt-2">
              Manage and resolve platform reports
            </p>
          </div>
{/* 
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button> */}
        </div>

        {/* Stats Cards */}
        {statsData?.data && (
          <div className="mb-8">
            <ReportStatsCards stats={statsData.data} />
          </div>
        )}

        {/* Most Reported & By Reason */}
        {statsData?.data && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <MostReportedStores stores={statsData.data.mostReported} />
            <ReportsByReason reasons={statsData.data.byReason} />
          </div>
        )}

        {/* Filters */}
        <ReportFilters onFilterChange={handleFilterChange} />

        {/* Reports Table */}
        {reportsData?.reports && (
          <>
            <ReportsTable reports={reportsData.reports} />

            {/* Pagination */}
            {reportsData.pagination && reportsData.pagination.pages > 1 && (
              <div className="flex items-center justify-between mt-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="text-sm text-gray-700">
                  Showing{' '}
                  {(reportsData.pagination.page - 1) *
                    reportsData.pagination.limit +
                    1}{' '}
                  to{' '}
                  {Math.min(
                    reportsData.pagination.page * reportsData.pagination.limit,
                    reportsData.pagination.total
                  )}{' '}
                  of {reportsData.pagination.total} reports
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handlePageChange(reportsData.pagination.page - 1)
                    }
                    disabled={reportsData.pagination.page === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from(
                      { length: reportsData.pagination.pages },
                      (_, i) => i + 1
                    )
                      .filter(
                        page =>
                          page === 1 ||
                          page === reportsData.pagination.pages ||
                          Math.abs(page - reportsData.pagination.page) <= 1
                      )
                      .map((page, index, array) => (
                        <div key={page}>
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span className="px-2 text-gray-500">...</span>
                          )}
                          <Button
                            variant={
                              page === reportsData.pagination.page
                                ? 'default'
                                : 'outline'
                            }
                            size="sm"
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </Button>
                        </div>
                      ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handlePageChange(reportsData.pagination.page + 1)
                    }
                    disabled={
                      reportsData.pagination.page ===
                      reportsData.pagination.pages
                    }
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
