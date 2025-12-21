// ==========================================
// app/sellers/page.tsx
// ==========================================

'use client';

import { useState } from 'react';
import { useGetSellersQuery } from '@/features/sellers/sellersApi';
import { useSuspendSellerMutation, useUnsuspendSellerMutation, useDeleteSellerMutation, useResetSellerPasswordMutation, useMakeAdminMutation } from '@/features/sellers/sellersApi';
import { SellerFilters } from '@/components/sellers/SellerFilters';
import { SellersTable } from '@/components/sellers/SellersTable';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { GetSellersParams } from '@/types/seller';
import { useToast } from '@/hooks/useToast';
import { ChevronLeft, ChevronRight, Mail, Download } from 'lucide-react';

export default function SellersPage() {
  const { success, error: showError } = useToast();
  const [filters, setFilters] = useState<GetSellersParams>({
    page: 1,
    limit: 20,
  });

  const { data, isLoading, error } = useGetSellersQuery(filters);
  const [suspendSeller] = useSuspendSellerMutation();
  const [unsuspendSeller] = useUnsuspendSellerMutation();
  const [deleteSeller] = useDeleteSellerMutation();
  const [resetPassword] = useResetSellerPasswordMutation();
  const [makeAdmin] = useMakeAdminMutation();

  const handleFilterChange = (newFilters: GetSellersParams) => {
    setFilters({ ...newFilters, page: 1, limit: 20 });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  const handleSuspend = async (sellerId: string) => {
    if (!confirm('Are you sure you want to suspend this seller?')) return;

    const reason = prompt('Enter suspension reason:');
    if (!reason) return;

    const duration = prompt('Enter duration (e.g., "30days", "permanent"):');
    if (!duration) return;

    try {
      await suspendSeller({
        sellerId,
        data: { reason, duration },
      }).unwrap();
      success('Seller suspended successfully');
    } catch (err) {
      showError('Failed to suspend seller');
    }
  };

  const handleUnsuspend = async (sellerId: string) => {
    if (!confirm('Are you sure you want to unsuspend this seller?')) return;

    try {
      await unsuspendSeller(sellerId).unwrap();
      success('Seller unsuspended successfully');
    } catch (err) {
      showError('Failed to unsuspend seller');
    }
  };

  const handleDelete = async (sellerId: string) => {
    if (
      !confirm(
        'Are you sure you want to PERMANENTLY delete this seller? This action cannot be undone!'
      )
    )
      return;

    const confirmation = prompt('Type "DELETE" to confirm:');
    if (confirmation !== 'DELETE') return;

    try {
      await deleteSeller(sellerId).unwrap();
      success('Seller deleted permanently');
    } catch (err) {
      showError('Failed to delete seller');
    }
  };

  const handleResetPassword = async (sellerId: string) => {
    if (!confirm('Are you sure you want to reset this seller\'s password?'))
      return;

    try {
      const result = await resetPassword(sellerId).unwrap();
      alert(`Temporary Password: ${result.temporaryPassword}\nPlease share this with the seller securely.`);
      success('Password reset successfully');
    } catch (err) {
      showError('Failed to reset password');
    }
  };

  const handleMakeAdmin = async (sellerId: string) => {
    if (
      !confirm(
        'Are you sure you want to promote this seller to admin? This is a superadmin-only action.'
      )
    )
      return;

    try {
      await makeAdmin(sellerId).unwrap();
      success('Seller promoted to admin successfully');
    } catch (err) {
      showError('Failed to promote seller to admin');
    }
  };

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
            Failed to load sellers
          </p>
          <p className="text-gray-600 mt-2">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sellers</h1>
            <p className="text-gray-600 mt-2">
              Manage all sellers on your platform
            </p>
          </div>

          <div className="flex gap-3 mt-4 sm:mt-0">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <SellerFilters onFilterChange={handleFilterChange} />

        {/* Sellers Table */}
        {data?.sellers && data.sellers.length > 0 ? (
          <>
            <SellersTable
              sellers={data.sellers}
              onSuspend={handleSuspend}
              onUnsuspend={handleUnsuspend}
              onDelete={handleDelete}
              onResetPassword={handleResetPassword}
              onMakeAdmin={handleMakeAdmin}
            />

            {/* Pagination */}
            {data.pagination && data.pagination.pages > 1 && (
              <div className="flex items-center justify-between mt-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="text-sm text-gray-700">
                  Showing {((data.pagination.page - 1) * data.pagination.limit) + 1} to{' '}
                  {Math.min(
                    data.pagination.page * data.pagination.limit,
                    data.pagination.total
                  )}{' '}
                  of {data.pagination.total} sellers
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(data.pagination.page - 1)}
                    disabled={data.pagination.page === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: data.pagination.pages }, (_, i) => i + 1)
                      .filter(
                        page =>
                          page === 1 ||
                          page === data.pagination.pages ||
                          Math.abs(page - data.pagination.page) <= 1
                      )
                      .map((page, index, array) => (
                        <div key={page}>
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span className="px-2 text-gray-500">...</span>
                          )}
                          <Button
                            variant={
                              page === data.pagination.page ? 'default' : 'outline'
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
                    onClick={() => handlePageChange(data.pagination.page + 1)}
                    disabled={data.pagination.page === data.pagination.pages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500 text-lg">No sellers found</p>
            <p className="text-gray-400 mt-2">
              Try adjusting your filters or search criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}