// ==========================================
// components/modals/SuspendSellerModal.tsx
// ==========================================

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface SuspendSellerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, duration: string) => void;
  isLoading?: boolean;
}

export function SuspendSellerModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: SuspendSellerModalProps) {
  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState('30days');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim()) {
      onConfirm(reason, duration);
      setReason('');
      setDuration('30days');
    }
  };

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Suspend Seller
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
            <Label htmlFor="reason">Suspension Reason *</Label>
            <Input
              id="reason"
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="e.g., Violating terms of service"
              required
            />
          </div>

          <div>
            <Label htmlFor="duration">Duration *</Label>
            <select
              id="duration"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="7days">7 days</option>
              <option value="14days">14 days</option>
              <option value="30days">30 days</option>
              <option value="60days">60 days</option>
              <option value="90days">90 days</option>
              <option value="permanent">Permanent</option>
            </select>
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
              className="flex-1 bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading ? 'Suspending...' : 'Suspend'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
