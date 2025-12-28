// ==========================================
// app/(dashboard)/dashboard/issues/IssueFiltersBar.tsx
// ==========================================

'use client';

import { IssueStatus, type IssueFilters } from '@/types/issue';
import { Filter, X } from 'lucide-react';

interface IssueFiltersBarProps {
  filters: IssueFilters;
  onFilterChange: (filters: Partial<IssueFilters>) => void;
}

export default function IssueFiltersBar({ filters, onFilterChange }: IssueFiltersBarProps) {
  const hasActiveFilters = filters.status;

  const clearFilters = () => {
    onFilterChange({ status: undefined, page: 1 });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Filter className="w-4 h-4" />
          Filters:
        </div>

        <select
          value={filters.status || ''}
          onChange={e =>
            onFilterChange({
              status: e.target.value ? (e.target.value as IssueStatus) : undefined,
            })
          }
          className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          <option value={IssueStatus.PENDING}>Pending</option>
          <option value={IssueStatus.IN_PROGRESS}>In Progress</option>
          <option value={IssueStatus.RESOLVED}>Resolved</option>
          <option value={IssueStatus.CLOSED}>Closed</option>
        </select>

        <select
          value={filters.sortBy || 'newest'}
          onChange={e => onFilterChange({ sortBy: e.target.value })}
          className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
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