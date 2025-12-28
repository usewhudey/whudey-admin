// ==========================================
// components/modals/ResolveReportModal.tsx
// ==========================================

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface ResolveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (resolution: 'approved' | 'rejected', actionNote: string) => void;
  isLoading?: boolean;
}

export function ResolveReportModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: ResolveReportModalProps) {
  const [resolution, setResolution] = useState<'approved' | 'rejected'>('approved');
  const [actionNote, setActionNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (actionNote.trim()) {
      onConfirm(resolution, actionNote);
      setResolution('approved');
      setActionNote('');
    }
  };

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Resolve Report
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
            <Label htmlFor="resolution">Resolution *</Label>
            <select
              id="resolution"
              value={resolution}
              onChange={e => setResolution(e.target.value as 'approved' | 'rejected')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="approved">Approve (Take Action)</option>
              <option value="rejected">Reject (No Action Needed)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {resolution === 'approved'
                ? 'The report is valid and action will be taken against the store'
                : 'The report is invalid or no action is needed'}
            </p>
          </div>

          <div>
            <Label htmlFor="actionNote">Action Note *</Label>
            <textarea
              id="actionNote"
              value={actionNote}
              onChange={e => setActionNote(e.target.value)}
              placeholder="Explain the action taken or reason for rejection..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[120px]"
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
              className={`flex-1 ${
                resolution === 'approved'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Resolving...' : 'Resolve Report'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}