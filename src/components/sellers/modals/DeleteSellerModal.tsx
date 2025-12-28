// ==========================================
// components/modals/DeleteSellerModal.tsx
// ==========================================

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, AlertTriangle } from 'lucide-react';

interface DeleteSellerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  sellerName: string;
}

export function DeleteSellerModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  sellerName,
}: DeleteSellerModalProps) {
  const [confirmation, setConfirmation] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmation === 'DELETE') {
      onConfirm();
      setConfirmation('');
    }
  };

  return (
<div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-red-600 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Delete Seller
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-700 mb-2">
            You are about to permanently delete <strong>{sellerName}</strong>.
          </p>
          <p className="text-red-600 text-sm font-medium">
            This action cannot be undone. All data will be lost forever.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="confirmation">
              Type <strong>DELETE</strong> to confirm
            </Label>
            <Input
              id="confirmation"
              value={confirmation}
              onChange={e => setConfirmation(e.target.value)}
              placeholder="DELETE"
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
              className="flex-1 bg-red-600 hover:bg-red-700"
              disabled={isLoading || confirmation !== 'DELETE'}
            >
              {isLoading ? 'Deleting...' : 'Delete Permanently'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}