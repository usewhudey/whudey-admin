// app/sellers/page.tsx
'use client';

import { useState } from 'react';
import {
  useGetSellersQuery,
  useSuspendSellerMutation,
  useUnsuspendSellerMutation,
  useDeleteSellerMutation,
  useResetSellerPasswordMutation,
  useMakeAdminMutation,
  useSendBulkEmailMutation,
} from '@/features/sellers/sellersApi';
import { SellerFilters } from '@/components/sellers/SellerFilters';
import { SellersTable } from '@/components/sellers/SellersTable';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { GetSellersParams } from '@/types/seller';
import { useToast } from '@/hooks/useToast';
import { ChevronLeft, ChevronRight, Mail } from 'lucide-react';
import { SuspendSellerModal } from '@/components/sellers/modals/SuspendSellerModal';
import { DeleteSellerModal } from '@/components/sellers/modals/DeleteSellerModal';
import { ConfirmModal } from '@/components/sellers/modals/ConfirmModal';
import { BulkEmailModal } from '@/components/sellers/modals/BulkEmailModal';

export default function SellersPage() {
  const { success, error: showError } = useToast();
  const [filters, setFilters] = useState<GetSellersParams>({
    page: 1,
    limit: 20,
  });

  // Modals state
  const [suspendModal, setSuspendModal] = useState<{
    isOpen: boolean;
    sellerId: string | null;
  }>({ isOpen: false, sellerId: null });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    sellerId: string | null;
    sellerName: string;
  }>({ isOpen: false, sellerId: null, sellerName: '' });

  const [unsuspendModal, setUnsuspendModal] = useState<{
    isOpen: boolean;
    sellerId: string | null;
  }>({ isOpen: false, sellerId: null });

  const [resetPasswordModal, setResetPasswordModal] = useState<{
    isOpen: boolean;
    sellerId: string | null;
  }>({ isOpen: false, sellerId: null });

  const [makeAdminModal, setMakeAdminModal] = useState<{
    isOpen: boolean;
    sellerId: string | null;
  }>({ isOpen: false, sellerId: null });

  const [bulkEmailModal, setBulkEmailModal] = useState(false);
  const [selectedSellers, setSelectedSellers] = useState<string[]>([]);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  const { data, isLoading, error } = useGetSellersQuery(filters);
  const [suspendSeller, { isLoading: isSuspending }] =
    useSuspendSellerMutation();
  const [unsuspendSeller, { isLoading: isUnsuspending }] =
    useUnsuspendSellerMutation();
  const [deleteSeller, { isLoading: isDeleting }] = useDeleteSellerMutation();
  const [resetPassword, { isLoading: isResetting }] =
    useResetSellerPasswordMutation();
  const [makeAdmin, { isLoading: isMakingAdmin }] = useMakeAdminMutation();
  const [sendBulkEmail, { isLoading: isSendingEmail }] =
    useSendBulkEmailMutation();

  const handleFilterChange = (newFilters: GetSellersParams) => {
    setFilters({ ...newFilters, page: 1, limit: 20 });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  const handleSuspendConfirm = async (reason: string, duration: string) => {
    if (!suspendModal.sellerId) return;

    try {
      await suspendSeller({
        sellerId: suspendModal.sellerId,
        data: { reason, duration },
      }).unwrap();
      success('Seller suspended successfully');
      setSuspendModal({ isOpen: false, sellerId: null });
    } catch (err) {
      showError('Failed to suspend seller');
    }
  };

  const handleUnsuspendConfirm = async () => {
    if (!unsuspendModal.sellerId) return;

    try {
      await unsuspendSeller(unsuspendModal.sellerId).unwrap();
      success('Seller unsuspended successfully');
      setUnsuspendModal({ isOpen: false, sellerId: null });
    } catch (err) {
      showError('Failed to unsuspend seller');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.sellerId) return;

    try {
      await deleteSeller(deleteModal.sellerId).unwrap();
      success('Seller deleted permanently');
      setDeleteModal({ isOpen: false, sellerId: null, sellerName: '' });
    } catch (err) {
      showError('Failed to delete seller');
    }
  };

  const handleResetPasswordConfirm = async () => {
    if (!resetPasswordModal.sellerId) return;

    try {
      const result = await resetPassword(resetPasswordModal.sellerId).unwrap();
      setTempPassword(result.temporaryPassword);
      success('Password reset successfully');
      setResetPasswordModal({ isOpen: false, sellerId: null });
    } catch (err) {
      showError('Failed to reset password');
    }
  };

  const handleMakeAdminConfirm = async () => {
    if (!makeAdminModal.sellerId) return;

    try {
      await makeAdmin(makeAdminModal.sellerId).unwrap();
      success('Seller promoted to admin successfully');
      setMakeAdminModal({ isOpen: false, sellerId: null });
    } catch (err) {
      showError('Failed to promote seller to admin');
    }
  };

  const handleBulkEmailConfirm = async (
    sellerIds: string[],
    subject: string,
    message: string
  ) => {
    try {
      await sendBulkEmail({ sellerIds, subject, message }).unwrap();
      success(`Email queued for ${sellerIds.length} seller(s)`);
      setBulkEmailModal(false);
      setSelectedSellers([]);
    } catch (err) {
      showError('Failed to send bulk email');
    }
  };

  const handleOpenBulkEmail = () => {
    if (data?.sellers) {
      const allSellerIds = data.sellers.map(seller => seller._id);
      setSelectedSellers(allSellerIds);
      setBulkEmailModal(true);
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
    <>
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
              <Button variant="outline" onClick={handleOpenBulkEmail}>
                <Mail className="w-4 h-4 mr-2" />
                Bulk Email ({data?.sellers?.length || 0})
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
                onSuspend={sellerId =>
                  setSuspendModal({ isOpen: true, sellerId })
                }
                onUnsuspend={sellerId =>
                  setUnsuspendModal({ isOpen: true, sellerId })
                }
                onDelete={(sellerId, sellerName) =>
                  setDeleteModal({ isOpen: true, sellerId, sellerName })
                }
                onResetPassword={sellerId =>
                  setResetPasswordModal({ isOpen: true, sellerId })
                }
                onMakeAdmin={sellerId =>
                  setMakeAdminModal({ isOpen: true, sellerId })
                }
              />

              {/* Pagination */}
              {data.pagination && data.pagination.pages > 1 && (
                <div className="flex items-center justify-between mt-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="text-sm text-gray-700">
                    Showing{' '}
                    {(data.pagination.page - 1) * data.pagination.limit + 1} to{' '}
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
                      {Array.from(
                        { length: data.pagination.pages },
                        (_, i) => i + 1
                      )
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
                                page === data.pagination.page
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

      {/* Modals */}
      <SuspendSellerModal
        isOpen={suspendModal.isOpen}
        onClose={() => setSuspendModal({ isOpen: false, sellerId: null })}
        onConfirm={handleSuspendConfirm}
        isLoading={isSuspending}
      />

      <DeleteSellerModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, sellerId: null, sellerName: '' })
        }
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        sellerName={deleteModal.sellerName}
      />

      <ConfirmModal
        isOpen={unsuspendModal.isOpen}
        onClose={() => setUnsuspendModal({ isOpen: false, sellerId: null })}
        onConfirm={handleUnsuspendConfirm}
        isLoading={isUnsuspending}
        title="Unsuspend Seller"
        message="Are you sure you want to unsuspend this seller?"
        confirmText="Unsuspend"
      />

      <ConfirmModal
        isOpen={resetPasswordModal.isOpen}
        onClose={() => setResetPasswordModal({ isOpen: false, sellerId: null })}
        onConfirm={handleResetPasswordConfirm}
        isLoading={isResetting}
        title="Reset Password"
        message="Are you sure you want to reset this seller's password? A temporary password will be generated."
        confirmText="Reset Password"
      />

      <ConfirmModal
        isOpen={makeAdminModal.isOpen}
        onClose={() => setMakeAdminModal({ isOpen: false, sellerId: null })}
        onConfirm={handleMakeAdminConfirm}
        isLoading={isMakingAdmin}
        title="Make Admin"
        message="Are you sure you want to promote this seller to admin? This is a superadmin-only action."
        confirmText="Make Admin"
      />

      <BulkEmailModal
        isOpen={bulkEmailModal}
        onClose={() => setBulkEmailModal(false)}
        onConfirm={handleBulkEmailConfirm}
        isLoading={isSendingEmail}
        selectedSellers={selectedSellers}
      />

      {/* Temporary Password Display */}
      {tempPassword && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Temporary Password
            </h2>
            <p className="text-gray-700 mb-4">
              Please share this password with the seller securely:
            </p>
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <code className="text-lg font-mono font-bold text-purple-600">
                {tempPassword}
              </code>
            </div>
            <Button onClick={() => setTempPassword(null)} className="w-full">
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
