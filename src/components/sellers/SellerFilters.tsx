// ==========================================
// components/sellers/SellerFilters.tsx
// ==========================================

'use client';

import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GetSellersParams } from '@/types/seller';

interface SellerFiltersProps {
  onFilterChange: (filters: GetSellersParams) => void;
}

export function SellerFilters({ onFilterChange }: SellerFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<GetSellersParams>({
    search: '',
    subscription: undefined,
    status: undefined,
    signupDateFrom: '',
    signupDateTo: '',
    lastLoginFrom: '',
    lastLoginTo: '',
    sortBy: 'newest',
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFilterChange = (key: keyof GetSellersParams, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: GetSellersParams = {
      search: '',
      subscription: undefined,
      status: undefined,
      signupDateFrom: '',
      signupDateTo: '',
      lastLoginFrom: '',
      lastLoginTo: '',
      sortBy: 'newest',
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              value={filters.search}
              onChange={e => handleFilterChange('search', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filter Toggle */}
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="sm:w-auto"
        >
          <Filter className="w-4 h-4 mr-2" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>

        {/* Clear Filters */}
        <Button variant="outline" onClick={clearFilters} className="sm:w-auto">
          <X className="w-4 h-4 mr-2" />
          Clear
        </Button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
          {/* Subscription Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subscription
            </label>
            <select
              value={filters.subscription || ''}
              onChange={e =>
                handleFilterChange('subscription', e.target.value || undefined)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.status || ''}
              onChange={e =>
                handleFilterChange('status', e.target.value || undefined)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="deleted">Deleted</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={e => handleFilterChange('sortBy', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="most_products">Most Product</option>
              <option value="most_revenue">Most Revenue</option>
            </select>
          </div>

          {/* Signup Date From */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Signup From
            </label>
            <Input
              type="date"
              value={filters.signupDateFrom}
              onChange={e =>
                handleFilterChange('signupDateFrom', e.target.value)
              }
            />
          </div>

          {/* Signup Date To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Signup To
            </label>
            <Input
              type="date"
              value={filters.signupDateTo}
              onChange={e => handleFilterChange('signupDateTo', e.target.value)}
            />
          </div>

          {/* Last Login From */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Login From
            </label>
            <Input
              type="date"
              value={filters.lastLoginFrom}
              onChange={e =>
                handleFilterChange('lastLoginFrom', e.target.value)
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
