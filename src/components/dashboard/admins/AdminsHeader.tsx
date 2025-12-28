// ==========================================
// app/(dashboard)/dashboard/admins/AdminsHeader.tsx
// ==========================================

'use client';

import { Shield, Users } from 'lucide-react';

interface AdminsHeaderProps {
  totalAdmins: number;
}

export default function AdminsHeader({ totalAdmins }: AdminsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Shield className="w-7 h-7 text-blue-600" />
          Admin Management
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage administrator accounts and permissions
        </p>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
        <Users className="w-5 h-5 text-blue-600" />
        <div>
          <p className="text-xs text-gray-600">Total Admins</p>
          <p className="text-lg font-bold text-gray-900">{totalAdmins}</p>
        </div>
      </div>
    </div>
  );
}
