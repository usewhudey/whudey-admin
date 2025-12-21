
// ==========================================
// app/dashboard/page.tsx
// ==========================================

'use client';

import { useGetPlatformStatsQuery } from '@/features/dashboard/dashboardApi';

import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { StatsCards } from '@/components/dashboard/dashboard/StatsCards';
import { RevenueChart } from '@/components/dashboard/dashboard/RevenueChart';
import { UserGrowthChart } from '@/components/dashboard/dashboard/UserGrowthChart';
import { RecentActivity } from '@/components/dashboard/dashboard/RecentActivity';

export default function DashboardPage() {
  const { data: statsData, isLoading, error } = useGetPlatformStatsQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg font-semibold">
            Failed to load dashboard data
          </p>
          <p className="text-gray-600 mt-2">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Here&apos;s what&apos;s happening with your whudey.
          </p>
        </div>

        {/* Stats Cards */}
        {statsData?.data && (
          <div className="mb-8">
            <StatsCards stats={statsData.data} />
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RevenueChart />
          <UserGrowthChart />
        </div>

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </div>
  );
}