// ==========================================
// app/(dashboard)/dashboard/issues/IssueActionsMenu.tsx
// ==========================================

'use client';

import { Issue, IssueStatus } from '@/types/issue';
import { useUpdateIssueStatusMutation } from '@/features/issues/issuesApi';
import { Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface IssueActionsMenuProps {
  issue: Issue;
  onClose: () => void;
}

export default function IssueActionsMenu({ issue, onClose }: IssueActionsMenuProps) {
  const router = useRouter();
  const [updateStatus] = useUpdateIssueStatusMutation();

  const handleStatusChange = async (newStatus: IssueStatus) => {
    try {
      await updateStatus({
        issueId: issue.id,
        payload: { status: newStatus },
      }).unwrap();
      toast.success('Issue status updated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to update issue status');
    }
  };

  const handleViewDetails = () => {
    router.push(`/dashboard/issues/${issue.id}`);
    onClose();
  };

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
      <button
        onClick={handleViewDetails}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
      >
        <Eye className="w-4 h-4" />
        View Details
      </button>
      {issue.status !== IssueStatus.IN_PROGRESS && (
        <button
          onClick={() => handleStatusChange(IssueStatus.IN_PROGRESS)}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
        >
          <Clock className="w-4 h-4" />
          Mark In Progress
        </button>
      )}
      {issue.status !== IssueStatus.CLOSED && (
        <button
          onClick={() => handleStatusChange(IssueStatus.CLOSED)}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
        >
          <XCircle className="w-4 h-4" />
          Close Issue
        </button>
      )}
      <button
        onClick={handleViewDetails}
        className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
      >
        <CheckCircle className="w-4 h-4" />
        Resolve Issue
      </button>
    </div>
  );
}