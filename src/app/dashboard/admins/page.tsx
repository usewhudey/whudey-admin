// ==========================================
// app/(dashboard)/dashboard/admins/page.tsx
// ==========================================

'use client';

import { useState } from 'react';
import { useGetAdminsQuery } from '@/features/admins/adminsApi';
import { AdminRole, AdminStatus, type AdminFilters } from '@/types/admin';

import { Loader2, Users, Activity } from 'lucide-react';
import AdminFiltersBar from '@/components/dashboard/admins/AdminFiltersBar';
import AdminsTable from '@/components/dashboard/admins/AdminsTable';
import AllActivitiesTab from '@/components/dashboard/admins/AllActivitiesTab';
import AdminsHeader from '@/components/dashboard/admins/AdminsHeader';

export default function AdminsPage() {
  const [activeTab, setActiveTab] = useState<'admins' | 'activities'>('admins');
  const [filters, setFilters] = useState<AdminFilters>({
    page: 1,
    limit: 20,
  });

  const { data, isLoading, error } = useGetAdminsQuery(filters);

  const handleFilterChange = (newFilters: Partial<AdminFilters>) => {
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
          <p className="text-red-600 font-medium">Failed to load admins</p>
          <p className="text-sm text-gray-500 mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminsHeader totalAdmins={data?.pagination.total || 0} />

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('admins')}
            className={`${
              activeTab === 'admins'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
          >
            <Users className="w-4 h-4" />
            All Admins
          </button>
          <button
            onClick={() => setActiveTab('activities')}
            className={`${
              activeTab === 'activities'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
          >
            <Activity className="w-4 h-4" />
            All Activities
          </button>
        </nav>
      </div>

      {activeTab === 'admins' ? (
        <>
          <AdminFiltersBar filters={filters} onFilterChange={handleFilterChange} />

          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <AdminsTable
              admins={data?.admins || []}
              pagination={data?.pagination}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <AllActivitiesTab />
      )}
    </div>
  );
}