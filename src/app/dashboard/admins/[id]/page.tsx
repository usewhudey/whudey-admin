// ==========================================
// app/(dashboard)/dashboard/admins/[id]/page.tsx
// ==========================================

'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGetAdminByIdQuery, useToggleAdminStatusMutation, useChangeAdminToSellerMutation } from '@/features/admins/adminsApi';
import { AdminStatus, AdminRole } from '@/types/admin';
import { formatDistanceToNow } from 'date-fns';
import {
  Loader2,
  ArrowLeft,
  Shield,
  ShieldAlert,
  Mail,
  Phone,
  Calendar,
  Clock,
  Ban,
  CheckCircle,
  UserX,
  Activity,
  User,
  Store,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function AdminDetailPage() {
  const params = useParams();
  const router = useRouter();
  const adminId = params.id as string;

  const { data, isLoading, error } = useGetAdminByIdQuery(adminId);
  const [toggleStatus, { isLoading: isTogglingStatus }] = useToggleAdminStatusMutation();
  const [changeToSeller, { isLoading: isChangingRole }] = useChangeAdminToSellerMutation();

  const handleToggleStatus = async () => {
    if (!data?.data.admin) return;
    try {
      const newStatus =
        data.data.admin.status === AdminStatus.ACTIVE ? AdminStatus.SUSPENDED : AdminStatus.ACTIVE;
      await toggleStatus({
        adminId,
        payload: { status: newStatus },
      }).unwrap();
      toast.success(
        `Admin ${newStatus === AdminStatus.SUSPENDED ? 'suspended' : 'activated'} successfully`
      );
    } catch (error) {
      toast.error('Failed to update admin status');
    }
  };

  const handleChangeToSeller = async () => {
    if (!confirm('Are you sure you want to change this admin to a seller? This action cannot be undone.')) {
      return;
    }
    try {
      await changeToSeller(adminId).unwrap();
      toast.success('Admin changed to seller successfully');
      router.push('/dashboard/admins');
    } catch (error) {
      toast.error('Failed to change admin role');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 font-medium">Failed to load admin details</p>
          <Link href="/dashboard/admins" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
            Back to Admins
          </Link>
        </div>
      </div>
    );
  }

  const { admin, recentActivities } = data.data;

  const getRoleBadge = (role: AdminRole) => {
    if (role === AdminRole.SUPERADMIN) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
          <ShieldAlert className="w-4 h-4" />
          Super Admin
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
        <Shield className="w-4 h-4" />
        Admin
      </span>
    );
  };

  const getStatusBadge = (status: AdminStatus) => {
    if (status === AdminStatus.ACTIVE) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-4 h-4" />
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
        <Ban className="w-4 h-4" />
        Suspended
      </span>
    );
  };

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
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/admins"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Admins</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleStatus}
            disabled={isTogglingStatus}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              admin.status === AdminStatus.ACTIVE
                ? 'bg-red-50 text-red-700 hover:bg-red-100'
                : 'bg-green-50 text-green-700 hover:bg-green-100'
            } disabled:opacity-50`}
          >
            {isTogglingStatus ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : admin.status === AdminStatus.ACTIVE ? (
              <Ban className="w-4 h-4" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            {admin.status === AdminStatus.ACTIVE ? 'Suspend Admin' : 'Activate Admin'}
          </button>

          <button
            onClick={handleChangeToSeller}
            disabled={isChangingRole}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isChangingRole ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserX className="w-4 h-4" />}
            Change to Seller
          </button>
        </div>
      </div>

      {/* Admin Info Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start gap-6">
          {admin.avatar ? (
            <img src={admin.avatar} alt={admin.firstName} className="w-24 h-24 rounded-full" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
              {admin.firstName[0].toUpperCase()}
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {admin.firstName} {admin.lastName}
              </h1>
              {getRoleBadge(admin.role)}
              {getStatusBadge(admin.status)}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{admin.email}</span>
              </div>
              {admin.phone && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{admin.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Joined {new Date(admin.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm">
                  Last login {formatDistanceToNow(new Date(admin.lastLoginAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Activities
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {recentActivities.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No recent activities</div>
          ) : (
            recentActivities.map(activity => (
              <div key={activity.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
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

                      {/* {activity.targetStore && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <Store className="w-3.5 h-3.5" />
                          <span>Store ID: {activity.targetStore.id.slice(-8)}</span>
                        </div>
                      )} */}
                    </div>

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
            ))
          )}
        </div>
      </div>
    </div>
  );
}