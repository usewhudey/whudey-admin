'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface GrantSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (tier: string, months: number, reason: string) => void;
  isLoading?: boolean;
}

export function GrantSubscriptionModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: GrantSubscriptionModalProps) {
  const [tier, setTier] = useState<'paid' | 'premium'>('paid');
  const [months, setMonths] = useState(1);
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim() && months > 0) {
      onConfirm(tier, months, reason);
      setTier('paid');
      setMonths(1);
      setReason('');
    }
  };

  return (
<div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Grant Subscription
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="tier">Subscription Tier *</Label>
            <select
              id="tier"
              value={tier}
              onChange={e => setTier(e.target.value as 'paid' | 'premium')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="paid">Paid (50 products)</option>
              <option value="premium">Premium (Unlimited)</option>
            </select>
          </div>

          <div>
            <Label htmlFor="months">Duration (Months) *</Label>
            <Input
              id="months"
              type="number"
              min="1"
              max="12"
              value={months}
              onChange={e => setMonths(Number(e.target.value))}
              required
            />
          </div>

          <div>
            <Label htmlFor="reason">Reason *</Label>
            <textarea
              id="reason"
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="e.g., Promotional offer for being a loyal customer"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[80px]"
              required
            />
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-purple-600 hover:bg-purple-700"
              disabled={isLoading}
            >
              {isLoading ? 'Granting...' : 'Grant Subscription'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
