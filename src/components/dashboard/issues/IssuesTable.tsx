// ==========================================
// app/(dashboard)/dashboard/issues/IssuesTable.tsx
// ==========================================

'use client';

import { useState } from 'react';
import { Issue, IssueStatus } from '@/types/issue';
import { formatDistanceToNow } from 'date-fns';
import {
  MoreVertical,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import IssueActionsMenu from './IssueActionsMenu';

interface IssuesTableProps {
  issues: Issue[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  onPageChange: (page: number) => void;
}

export default function IssuesTable({ issues, pagination, onPageChange }: IssuesTableProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

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
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reported
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {issues.map(issue => (
              <tr key={issue.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p className="font-medium text-gray-900">{issue.user.name}</p>
                    <p className="text-sm text-gray-500">{issue.user.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-700 line-clamp-2 max-w-md">
                    {issue.description}
                  </p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(issue.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatDistanceToNow(new Date(issue.updatedAt), { addSuffix: true })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/dashboard/issues/${issue.id}`}
                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-5 h-5 text-blue-600" />
                    </Link>
                    <div className="relative">
                      <button
                        onClick={() =>
                          setActiveMenuId(activeMenuId === issue.id ? null : issue.id)
                        }
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>
                      {activeMenuId === issue.id && (
                        <IssueActionsMenu
                          issue={issue}
                          onClose={() => setActiveMenuId(null)}
                        />
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && pagination.pages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}{' '}
            issues
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-700">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}