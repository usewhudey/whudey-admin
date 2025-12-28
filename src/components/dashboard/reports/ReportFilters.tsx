// ==========================================
// components/reports/ReportFilters.tsx
// ==========================================

'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GetReportsParams, ReportReason } from '@/types/report';

interface ReportFiltersProps {
  onFilterChange: (filters: GetReportsParams) => void;
}

const REASON_OPTIONS: { value: ReportReason; label: string }[] = [
  { value: 'scam', label: 'Scam' },
  { value: 'fake_products', label: 'Fake Products' },
  { value: 'non_delivery', label: 'Non-Delivery' },
  { value: 'poor_quality', label: 'Poor Quality' },
  { value: 'offensive_content', label: 'Offensive Content' },
  { value: 'counterfeit', label: 'Counterfeit' },
  { value: 'misleading_info', label: 'Misleading Info' },
  { value: 'harassment', label: 'Harassment' },
  { value: 'spam', label: 'Spam' },
  { value: 'other', label: 'Other' },
];

export function ReportFilters({ onFilterChange }: ReportFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<GetReportsParams>({
    status: undefined,
    reason: undefined,
    sortBy: 'newest',
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFilterChange = (key: keyof GetReportsParams, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: GetReportsParams = {
      status: undefined,
      reason: undefined,
      sortBy: 'newest',
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Status Filter */}
        <div className="flex-1">
          <select
            value={filters.status || ''}
            onChange={e =>
              handleFilterChange('status', e.target.value || undefined)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="flex-1">
          <select
            value={filters.sortBy}
            onChange={e => handleFilterChange('sortBy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* Filter Toggle */}
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="sm:w-auto"
        >
          <Filter className="w-4 h-4 mr-2" />
          {showFilters ? 'Hide' : 'More'} Filters
        </Button>

        {/* Clear Filters */}
        <Button variant="outline" onClick={clearFilters} className="sm:w-auto">
          <X className="w-4 h-4 mr-2" />
          Clear
        </Button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason
          </label>
          <select
            value={filters.reason || ''}
            onChange={e =>
              handleFilterChange('reason', e.target.value || undefined)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Reasons</option>
            {REASON_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
