// ==========================================
// components/sellers/SellersTable.tsx
// ==========================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Seller } from '@/types/seller';
import { Button } from '@/components/ui/button';
import {
  Eye,
  MoreVertical,
  Ban,
  CheckCircle,
  Trash2,
  Mail,
  Key,
  Shield,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface SellersTableProps {
  sellers: Seller[];
  onSuspend: (sellerId: string) => void;
  onUnsuspend: (sellerId: string) => void;
  onDelete: (sellerId: string) => void;
  onResetPassword: (sellerId: string) => void;
  onMakeAdmin: (sellerId: string) => void;
}

export function SellersTable({
  sellers,
  onSuspend,
  onUnsuspend,
  onDelete,
  onResetPassword,
  onMakeAdmin,
}: SellersTableProps) {
  const router = useRouter();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-red-100 text-red-800',
      inactive: 'bg-gray-100 text-gray-800',
    };
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          styles[status as keyof typeof styles] || styles.inactive
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Seller
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Products
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Signup Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sellers.map(seller => (
              <tr key={seller._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {seller.avatar ? (
                        <img
                          className="h-10 w-10 rounded-full"
                          src={seller.avatar}
                          alt={`${seller.firstName} ${seller.lastName}`}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <span className="text-purple-600 font-medium text-sm">
                            {seller.firstName[0]}
                            {seller.lastName[0]}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {seller.firstName} {seller.lastName}
                      </div>
                      {seller.phone && (
                        <div className="text-sm text-gray-500">
                          {seller.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{seller.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(seller.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {seller.productCount}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(seller.createdAt), {
                      addSuffix: true,
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {seller.lastLoginAt
                      ? formatDistanceToNow(new Date(seller.lastLoginAt), {
                          addSuffix: true,
                        })
                      : 'Never'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        router.push(`/sellers/${seller._id}`)
                      }
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === seller._id ? null : seller._id
                          )
                        }
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>

                      {openMenuId === seller._id && (
                        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                          <div className="py-1">
                            {seller.status === 'active' ? (
                              <button
                                onClick={() => {
                                  onSuspend(seller._id);
                                  setOpenMenuId(null);
                                }}
                                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50 w-full"
                              >
                                <Ban className="w-4 h-4 mr-2" />
                                Suspend
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  onUnsuspend(seller._id);
                                  setOpenMenuId(null);
                                }}
                                className="flex items-center px-4 py-2 text-sm text-green-600 hover:bg-gray-50 w-full"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Unsuspend
                              </button>
                            )}

                            <button
                              onClick={() => {
                                onResetPassword(seller._id);
                                setOpenMenuId(null);
                              }}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full"
                            >
                              <Key className="w-4 h-4 mr-2" />
                              Reset Password
                            </button>

                            <button
                              onClick={() => {
                                onMakeAdmin(seller._id);
                                setOpenMenuId(null);
                              }}
                              className="flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-gray-50 w-full"
                            >
                              <Shield className="w-4 h-4 mr-2" />
                              Make Admin
                            </button>

                            <button
                              onClick={() => {
                                onDelete(seller._id);
                                setOpenMenuId(null);
                              }}
                              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50 w-full"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Permanently
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}