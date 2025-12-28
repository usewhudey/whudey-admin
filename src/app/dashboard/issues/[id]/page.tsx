// ==========================================
// app/(dashboard)/dashboard/issues/[id]/page.tsx
// ==========================================

'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  useGetIssueByIdQuery,
  useUpdateIssueStatusMutation,
  useResolveIssueMutation,
} from '@/features/issues/issuesApi';
import { IssueStatus } from '@/types/issue';
import { formatDistanceToNow } from 'date-fns';
import {
  Loader2,
  ArrowLeft,
  Mail,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/useToast';

export default function IssueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const issueId = params.id as string;
  const { success, error: showError } = useToast();

  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolution, setResolution] = useState('');
  const [actionNote, setActionNote] = useState('');

  const { data, isLoading, error } = useGetIssueByIdQuery(issueId);
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateIssueStatusMutation();
  const [resolveIssue, { isLoading: isResolving }] = useResolveIssueMutation();

  const handleStatusChange = async (newStatus: IssueStatus) => {
    try {
      await updateStatus({
        issueId,
        payload: { status: newStatus },
      }).unwrap();
      success('Issue status updated successfully');
    } catch (error) {
      showError('Failed to update issue status');
    }
  };

  const handleResolve = async () => {
    if (!resolution.trim() || !actionNote.trim()) {
      showError('Please provide both resolution and action note');
      return;
    }

    try {
      await resolveIssue({
        issueId,
        payload: { resolution, actionNote },
      }).unwrap();
      success('Issue resolved successfully');
      setShowResolveModal(false);
      setResolution('');
      setActionNote('');
    } catch (error) {
      showError('Failed to resolve issue');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 font-medium">Failed to load issue details</p>
          <Link
            href="/dashboard/issues"
            className="text-sm text-blue-600 hover:underline mt-2 inline-block"
          >
            Back to Issues
          </Link>
        </div>
      </div>
    );
  }

  const issue = data.data;

  const getStatusBadge = (status: IssueStatus) => {
    const statusConfig = {
      [IssueStatus.PENDING]: {
        icon: AlertCircle,
        color: 'bg-yellow-100 text-yellow-800',
        label: 'Pending',
      },
      [IssueStatus.IN_PROGRESS]: {
        icon: Clock,
        color: 'bg-blue-100 text-blue-800',
        label: 'In Progress',
      },
      [IssueStatus.RESOLVED]: {
        icon: CheckCircle,
        color: 'bg-green-100 text-green-800',
        label: 'Resolved',
      },
      [IssueStatus.CLOSED]: {
        icon: XCircle,
        color: 'bg-gray-100 text-gray-800',
        label: 'Closed',
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
      >
        <Icon className="w-4 h-4" />
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/issues"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Issues</span>
        </Link>

        <div className="flex items-center gap-3">
          {issue.status !== IssueStatus.IN_PROGRESS && (
            <button
              onClick={() => handleStatusChange(IssueStatus.IN_PROGRESS)}
              disabled={isUpdatingStatus}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors disabled:opacity-50"
            >
              {isUpdatingStatus ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Clock className="w-4 h-4" />
              )}
              Mark In Progress
            </button>
          )}

          {issue.status !== IssueStatus.RESOLVED && (
            <button
              onClick={() => setShowResolveModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              Resolve Issue
            </button>
          )}

          {issue.status !== IssueStatus.CLOSED && (
            <button
              onClick={() => handleStatusChange(IssueStatus.CLOSED)}
              disabled={isUpdatingStatus}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {isUpdatingStatus ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              Close Issue
            </button>
          )}
        </div>
      </div>

      {/* Issue Details Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Issue Details</h1>
            {getStatusBadge(issue.status)}
          </div>
        </div>

        <div className="space-y-6">
          {/* User Info */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Reported By</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                {issue.user.firstName[0].toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {issue.user.firstName} {issue.user.lastName}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {issue.user.email}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
            <p className="text-gray-900 whitespace-pre-wrap">{issue.description}</p>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <div>
                <p className="text-xs text-gray-500">Reported</p>
                <p className="text-sm font-medium">
                  {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <div>
                <p className="text-xs text-gray-500">Last Updated</p>
                <p className="text-sm font-medium">
                  {formatDistanceToNow(new Date(issue.updatedAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>

          {/* Admin Action */}
          {issue.adminAction && (
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Admin Action</h3>
              <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>
                    Action taken {formatDistanceToNow(new Date(issue.adminAction.actionDate), { addSuffix: true })}
                  </span>
                </div>
                {issue.adminAction.actionNote && (
                  <div>
                    <p className="text-xs font-medium text-gray-500">Action Note:</p>
                    <p className="text-sm text-gray-900 mt-1">{issue.adminAction.actionNote}</p>
                  </div>
                )}
                {issue.adminAction.resolution && (
                  <div>
                    <p className="text-xs font-medium text-gray-500">Resolution:</p>
                    <p className="text-sm text-gray-900 mt-1">{issue.adminAction.resolution}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resolve Modal */}
      {showResolveModal && (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Resolve Issue</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resolution Message
                </label>
                <textarea
                  value={resolution}
                  onChange={e => setResolution(e.target.value)}
                  placeholder="Provide a detailed resolution message for the user..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action Note (Internal)
                </label>
                <textarea
                  value={actionNote}
                  onChange={e => setActionNote(e.target.value)}
                  placeholder="Internal note about the action taken..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleResolve}
                disabled={isResolving || !resolution.trim() || !actionNote.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isResolving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Resolving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Resolve Issue
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowResolveModal(false);
                  setResolution('');
                  setActionNote('');
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}