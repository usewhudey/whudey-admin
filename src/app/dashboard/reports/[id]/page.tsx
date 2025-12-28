// ==========================================
// app/reports/[id]/page.tsx
// ==========================================

'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  useGetReportDetailsQuery,
  useResolveReportMutation,
} from '@/features/reports/reportsApi';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/useToast';
import {
  ArrowLeft,
  Mail,
  Phone,
  Store,
  User,
  AlertTriangle,
  CheckCircle,
  Package,
  Eye,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { ResolveReportModal } from '@/components/dashboard/reports/modals/ResolveReportModal';

const REASON_LABELS: Record<string, string> = {
  scam: 'Scam',
  fake_products: 'Fake Products',
  non_delivery: 'Non-Delivery',
  poor_quality: 'Poor Quality',
  offensive_content: 'Offensive Content',
  counterfeit: 'Counterfeit',
  misleading_info: 'Misleading Info',
  harassment: 'Harassment',
  spam: 'Spam',
  other: 'Other',
};

export default function ReportDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { success, error: showError } = useToast();
  const reportId = params.id as string;

  const [resolveModal, setResolveModal] = useState(false);

  const { data, isLoading, error } = useGetReportDetailsQuery(reportId);
  const [resolveReport, { isLoading: isResolving }] =
    useResolveReportMutation();

  const handleResolveConfirm = async (
    resolution: 'approved' | 'rejected',
    actionNote: string
  ) => {
    try {
      await resolveReport({
        reportId,
        data: { resolution, actionNote },
      }).unwrap();
      success('Report resolved successfully');
      setResolveModal(false);
    } catch (err) {
      showError('Failed to resolve report');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg font-semibold">
            Failed to load report details
          </p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const report = data.data;

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      dismissed: 'bg-gray-100 text-gray-800',
    };
    return (
      <span
        className={`px-3 py-1 text-xs font-medium rounded-full ${
          styles[status as keyof typeof styles] || styles.pending
        }`}
      >
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Reports
            </Button>

            {report.status === 'pending' && (
              <Button
                onClick={() => setResolveModal(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Resolve Report
              </Button>
            )}
          </div>

          {/* Report Overview */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Report Details
              </h1>
              <div className="flex items-center gap-3">
                {getStatusBadge(report.status)}
                <span className="flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800">
                  <AlertTriangle className="w-4 h-4" />
                  {report.reportCount}{' '}
                  {report.reportCount === 1 ? 'report' : 'reports'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Reason</p>
                <p className="text-lg font-semibold text-gray-900">
                  {REASON_LABELS[report.reason] || report.reason}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Reported</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatDistanceToNow(new Date(report.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Description</p>
              <p className="text-gray-900">{report.description}</p>
            </div>
          </div>

          {/* Store & Reporter Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Store Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Store className="w-5 h-5 text-purple-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Reported Store
                  </h2>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    router.push(`/dashboard/sellers/${report.store.user._id}`)
                  }
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Seller
                </Button>
              </div>

              <div className="space-y-3">
                {report.store.logo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={report.store.logo}
                    alt={report.store.storeName}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                )}

                <div>
                  <p className="text-sm text-gray-600">Store Name</p>
                  <p className="font-medium text-gray-900">
                    {report.store.storeName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Subdomain</p>
                  <a
                    href={`https://whudey.com/${report.store.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:underline"
                  >
                    whudey.com/{report.store.slug}
                  </a>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Products</p>
                  <p className="text-sm text-gray-900 flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    {report.store.productCount}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Owner</p>
                  <p className="text-sm text-gray-900">
                    {report.store.user.firstName} {report.store.user.lastName}
                  </p>
                  <p className="text-xs text-gray-600">
                    {report.store.user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Reporter Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Reporter Information
                </h2>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium text-gray-900">
                    {report.reporter.name}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-900">
                    {report.reporter.email}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-900">
                    {report.reporter.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Action */}
          {report.adminAction && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Admin Action
              </h2>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Resolution</p>
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                      report.adminAction.resolution === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {report.adminAction.resolution.toUpperCase()}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Action Taken By</p>
                  <p className="text-gray-900">
                    {report.adminAction.actionTakenBy.firstName}{' '}
                    {report.adminAction.actionTakenBy.lastName}
                  </p>
                  <p className="text-gray-900">
                    {report.adminAction.actionTakenBy.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Action Note</p>
                  <p className="text-gray-900">
                    {report.adminAction.actionNote}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Action Date</p>
                  <p className="text-sm text-gray-900">
                    {format(new Date(report.adminAction.actionDate), 'PPpp')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resolve Modal */}
      <ResolveReportModal
        isOpen={resolveModal}
        onClose={() => setResolveModal(false)}
        onConfirm={handleResolveConfirm}
        isLoading={isResolving}
      />
    </>
  );
}
