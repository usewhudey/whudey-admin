// ==========================================
// app/(dashboard)/dashboard/admins/AdminActionsMenu.tsx
// ==========================================

'use client';

import { Admin, AdminStatus } from '@/types/admin';
import {
  useToggleAdminStatusMutation,
  useChangeAdminToSellerMutation,
} from '@/features/admins/adminsApi';
import { Ban, CheckCircle, UserX, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';

interface AdminActionsMenuProps {
  admin: Admin;
  onClose: () => void;
}

export default function AdminActionsMenu({
  admin,
  onClose,
}: AdminActionsMenuProps) {
  const { success, error: showError } = useToast();

  const router = useRouter();
  const [toggleStatus] = useToggleAdminStatusMutation();
  const [changeToSeller] = useChangeAdminToSellerMutation();

  const handleToggleStatus = async () => {
    try {
      const newStatus =
        admin.status === AdminStatus.ACTIVE
          ? AdminStatus.SUSPENDED
          : AdminStatus.ACTIVE;
      await toggleStatus({
        adminId: admin.id,
        payload: { status: newStatus },
      }).unwrap();
      success(
        `Admin ${newStatus === AdminStatus.SUSPENDED ? 'suspended' : 'activated'} successfully`
      );
      onClose();
    } catch (error) {
      showError('Failed to update admin status');
    }
  };

  const handleChangeToSeller = async () => {
    if (
      !confirm(
        'Are you sure you want to change this admin to a seller? This action cannot be undone.'
      )
    ) {
      return;
    }
    try {
      await changeToSeller(admin.id).unwrap();
      success('Admin changed to seller successfully');
      onClose();
    } catch (error) {
      showError('Failed to change admin role');
    }
  };

  const handleViewDetails = () => {
    router.push(`/dashboard/admins/${admin.id}`);
    onClose();
  };

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
      <button
        onClick={handleViewDetails}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
      >
        <Eye className="w-4 h-4" />
        View Details
      </button>
      <button
        onClick={handleToggleStatus}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
      >
        {admin.status === AdminStatus.ACTIVE ? (
          <>
            <Ban className="w-4 h-4" />
            Suspend Admin
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4" />
            Activate Admin
          </>
        )}
      </button>
      <button
        onClick={handleChangeToSeller}
        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
      >
        <UserX className="w-4 h-4" />
        Change to Seller
      </button>
    </div>
  );
}
