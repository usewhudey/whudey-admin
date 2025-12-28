// app/sellers/[id]/page.tsx
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  useGetSellerDetailsQuery,
  useSuspendSellerMutation,
  useUnsuspendSellerMutation,
  useDeleteSellerMutation,
  useResetSellerPasswordMutation,
  useMakeAdminMutation,
  useGrantSubscriptionMutation,
} from '@/features/sellers/sellersApi';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/useToast';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Package,
  DollarSign,
  Eye,
  ShoppingCart,
  MapPin,
  Globe,
  Shield,
  Ban,
  CheckCircle,
  Trash2,
  Key,
  UserCog,
  Gift,
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { DeleteSellerModal } from '@/components/dashboard/sellers/modals/DeleteSellerModal';
import { SuspendSellerModal } from '@/components/dashboard/sellers/modals/SuspendSellerModal';
import { ConfirmModal } from '@/components/dashboard/sellers/modals/ConfirmModal';
import { GrantSubscriptionModal } from '@/components/dashboard/sellers/modals/GrantSubscriptionModal';
import { useAuth } from '@/hooks/useAuth';

export default function SellerDetailsPage() {
  const { user } = useAuth();

  const params = useParams();
  const router = useRouter();
  const { success, error: showError } = useToast();
  const sellerId = params.id as string;

  // Modals state
  const [suspendModal, setSuspendModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [unsuspendModal, setUnsuspendModal] = useState(false);
  const [resetPasswordModal, setResetPasswordModal] = useState(false);
  const [makeAdminModal, setMakeAdminModal] = useState(false);
  const [grantSubscriptionModal, setGrantSubscriptionModal] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  const { data, isLoading, error } = useGetSellerDetailsQuery(sellerId);
  const [suspendSeller, { isLoading: isSuspending }] =
    useSuspendSellerMutation();
  const [unsuspendSeller, { isLoading: isUnsuspending }] =
    useUnsuspendSellerMutation();
  const [deleteSeller, { isLoading: isDeleting }] = useDeleteSellerMutation();
  const [resetPassword, { isLoading: isResetting }] =
    useResetSellerPasswordMutation();
  const [makeAdmin, { isLoading: isMakingAdmin }] = useMakeAdminMutation();
  const [grantSubscription, { isLoading: isGranting }] =
    useGrantSubscriptionMutation();

  const handleSuspendConfirm = async (reason: string, duration: string) => {
    try {
      await suspendSeller({
        sellerId,
        data: { reason, duration },
      }).unwrap();
      success('Seller suspended successfully');
      setSuspendModal(false);
    } catch (err) {
      showError('Failed to suspend seller');
    }
  };

  const handleUnsuspendConfirm = async () => {
    try {
      await unsuspendSeller(sellerId).unwrap();
      success('Seller unsuspended successfully');
      setUnsuspendModal(false);
    } catch (err) {
      showError('Failed to unsuspend seller');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteSeller(sellerId).unwrap();
      success('Seller deleted permanently');
      router.push('/dashboard/sellers');
    } catch (err) {
      showError('Failed to delete seller');
    }
  };

  const handleResetPasswordConfirm = async () => {
    try {
      const result = await resetPassword(sellerId).unwrap();
      setTempPassword(result.temporaryPassword);
      success('Password reset successfully');
      setResetPasswordModal(false);
    } catch (err) {
      showError('Failed to reset password');
    }
  };

  const handleMakeAdminConfirm = async () => {
    try {
      await makeAdmin(sellerId).unwrap();
      success('Seller promoted to admin successfully');
      router.push('/dashboard/sellers');
    } catch (err) {
      showError('Failed to promote seller to admin');
    }
  };

  const handleGrantSubscriptionConfirm = async (
    tier: string,
    months: number,
    reason: string
  ) => {
    try {
      await grantSubscription({
        sellerId,
        data: { tier: tier as 'paid' | 'premium', months, reason },
      }).unwrap();
      success(`${tier} subscription granted for ${months} month(s)`);
      setGrantSubscriptionModal(false);
    } catch (err) {
      showError('Failed to grant subscription');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg font-semibold">
            Failed to load seller details
          </p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const { seller, store, statistics, loginHistory, topProducts } = data.data;

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sellers
            </Button>

            {/* Action Buttons */}
            <div className="flex gap-2 flex-wrap">
              {seller.status === 'active' ? (
                <Button
                  variant="outline"
                  onClick={() => setSuspendModal(true)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Ban className="w-4 h-4 mr-2" />
                  Suspend
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setUnsuspendModal(true)}
                  className="text-green-600 hover:text-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Unsuspend
                </Button>
              )}

              <Button
                variant="outline"
                onClick={() => setGrantSubscriptionModal(true)}
                className="text-purple-600 hover:text-purple-700"
              >
                <Gift className="w-4 h-4 mr-2" />
                Grant Subscription
              </Button>

              <Button
                variant="outline"
                onClick={() => setResetPasswordModal(true)}
              >
                <Key className="w-4 h-4 mr-2" />
                Reset Password
              </Button>

              {user.role === 'superadmin' && (
                <Button
                  variant="outline"
                  onClick={() => setMakeAdminModal(true)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <UserCog className="w-4 h-4 mr-2" />
                  Make Admin
                </Button>
              )}

        

              <Button
                variant="outline"
                onClick={() => setDeleteModal(true)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          {/* Seller Profile Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                {seller.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={seller.avatar}
                    alt={`${seller.firstName} ${seller.lastName}`}
                    className="w-24 h-24 rounded-full"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-2xl">
                      {seller.firstName[0]}
                      {seller.lastName[0]}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {seller.firstName} {seller.lastName}
                  </h1>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      seller.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : seller.status === 'suspended'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {seller.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    {seller.email}
                    {seller.isEmailVerified && (
                      <Shield className="w-4 h-4 text-green-500" />
                    )}
                  </div>

                  {seller.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      {seller.phone}
                      {seller.isPhoneVerified && (
                        <Shield className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    Joined{' '}
                    {formatDistanceToNow(new Date(seller.createdAt), {
                      addSuffix: true,
                    })}
                  </div>

                  {seller.lastLoginAt && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      Last login{' '}
                      {formatDistanceToNow(new Date(seller.lastLoginAt), {
                        addSuffix: true,
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Store Info & Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Store Card */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Store Information
              </h2>

              {store.logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={store.logo}
                  alt={store.storeName}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Store Name</p>
                  <p className="font-medium text-gray-900">{store.storeName}</p>
                </div>

                {store.slug && (
                  <div>
                    <p className="text-sm text-gray-500">Store URL</p>
                    <a
                      href={`https://whudey.com/${store.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:underline flex items-center gap-1"
                    >
                      <Globe className="w-4 h-4" />
                      whudey.com/{store.slug}
                    </a>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="text-gray-900">{store.description}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Subscription</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        store.subscription.tier === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : store.subscription.tier === 'premium'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {store.subscription.tier.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-600">
                      ({store.subscription.productLimit} products limit)
                    </span>
                  </div>
                </div>

                {store.physicalLocation &&
                  store.physicalLocation !== 'none' && (
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <div className="flex items-center gap-1 text-gray-900">
                        <MapPin className="w-4 h-4" />
                        {store.physicalLocation}
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* Statistics Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Statistics
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-purple-500" />
                    <span className="text-sm text-gray-600">Products</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {store.productCount}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-gray-600">Total Orders</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {store.totalOrders}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-600">Total Revenue</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    ₦{store.totalRevenue.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-orange-500" />
                    <span className="text-sm text-gray-600">Total Views</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {store.totalViews}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Products & Login History */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Products */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Top Products
              </h2>

              {topProducts && topProducts.length > 0 ? (
                <div className="space-y-4">
                  {topProducts.map(product => (
                    <div
                      key={product._id}
                      className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg"
                    >
                      {product.images[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          ₦{product.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No products yet
                </p>
              )}
            </div>

            {/* Login History */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Login History
              </h2>

              {loginHistory && loginHistory.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {loginHistory.slice(0, 5).map(login => (
                    <div
                      key={login._id}
                      className="p-3 border border-gray-200 rounded-lg"
                    >
                      <p className="text-sm text-gray-600 truncate">
                        {login.userAgent}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(login.createdAt), 'PPpp')}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No login history
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SuspendSellerModal
        isOpen={suspendModal}
        onClose={() => setSuspendModal(false)}
        onConfirm={handleSuspendConfirm}
        isLoading={isSuspending}
      />

      <DeleteSellerModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        sellerName={`${seller.firstName} ${seller.lastName}`}
      />

      <ConfirmModal
        isOpen={unsuspendModal}
        onClose={() => setUnsuspendModal(false)}
        onConfirm={handleUnsuspendConfirm}
        isLoading={isUnsuspending}
        title="Unsuspend Seller"
        message="Are you sure you want to unsuspend this seller?"
        confirmText="Unsuspend"
      />

      <ConfirmModal
        isOpen={resetPasswordModal}
        onClose={() => setResetPasswordModal(false)}
        onConfirm={handleResetPasswordConfirm}
        isLoading={isResetting}
        title="Reset Password"
        message="Are you sure you want to reset this seller's password? A temporary password will be generated."
        confirmText="Reset Password"
      />

      <ConfirmModal
        isOpen={makeAdminModal}
        onClose={() => setMakeAdminModal(false)}
        onConfirm={handleMakeAdminConfirm}
        isLoading={isMakingAdmin}
        title="Make Admin"
        message="Are you sure you want to promote this seller to admin? This is a superadmin-only action."
        confirmText="Make Admin"
      />

      <GrantSubscriptionModal
        isOpen={grantSubscriptionModal}
        onClose={() => setGrantSubscriptionModal(false)}
        onConfirm={handleGrantSubscriptionConfirm}
        isLoading={isGranting}
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
