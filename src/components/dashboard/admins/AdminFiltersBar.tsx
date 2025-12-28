// ==========================================
// app/(dashboard)/dashboard/admins/AdminFiltersBar.tsx
// ==========================================

'use client';

import { AdminRole, AdminStatus, type AdminFilters } from '@/types/admin';
import { Filter, X } from 'lucide-react';

interface AdminFiltersBarProps {
  filters: AdminFilters;
  onFilterChange: (filters: Partial<AdminFilters>) => void;
}

export default function AdminFiltersBar({ filters, onFilterChange }: AdminFiltersBarProps) {
  const hasActiveFilters = filters.status || filters.role;

  const clearFilters = () => {
    onFilterChange({ status: undefined, role: undefined, page: 1 });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Filter className="w-4 h-4" />
          Filters:
        </div>

        <select
          value={filters.role || ''}
          onChange={e =>
            onFilterChange({ role: e.target.value ? (e.target.value as AdminRole) : undefined })
          }
          className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Roles</option>
          <option value={AdminRole.SUPERADMIN}>Super Admin</option>
          <option value={AdminRole.ADMIN}>Admin</option>
        </select>

        <select
          value={filters.status || ''}
          onChange={e =>
            onFilterChange({
              status: e.target.value ? (e.target.value as AdminStatus) : undefined,
            })
          }
          className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          <option value={AdminStatus.ACTIVE}>Active</option>
          <option value={AdminStatus.SUSPENDED}>Suspended</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
