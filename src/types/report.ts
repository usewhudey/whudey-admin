// ==========================================
// types/report.ts
// ==========================================

export type ReportReason =
  | 'scam'
  | 'fake_products'
  | 'non_delivery'
  | 'poor_quality'
  | 'offensive_content'
  | 'counterfeit'
  | 'misleading_info'
  | 'harassment'
  | 'spam'
  | 'other';

export type ReportStatus = 'pending' | 'resolved' | 'dismissed';

export interface Reporter {
  name: string;
  email: string;
  phone: string;
}

export interface ReportStore {
  id: string;
  name: string;
  subdomain: string;
  seller: string;
}

export interface AdminAction {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actionTakenBy: any;
  actionDate: string;
  actionNote: string;
  resolution: 'approved' | 'rejected';
}

export interface Report {
  id: string;
  store: ReportStore;
  reason: ReportReason;
  description: string;
  reporter: Reporter;
  status: ReportStatus;
  reportCount: number;
  adminAction: AdminAction | null;
  createdAt: string;
}

export interface ReportStats {
  stats: {
    pending: number;
    resolved: number;
    dismissed: number;
    total: number;
  };
  mostReported: Array<{
    storeId: string;
    storeName: string;
    storeSlug: string;
    reportCount: number;
  }>;
  byReason: Array<{
    reason: ReportReason;
    count: number;
  }>;
}

export interface StoreDetail {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  storeName: string;
  description: string;
  branding: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
  };
  contact: Record<string, string>;
  primaryContact: string;
  isSetUpCompleted: boolean;
  subscription: {
    tier: string;
    status: string;
    productLimit: number;
    autoRenew: boolean;
  };
  storeStatus: string;
  status: boolean;
  physicalLocation: string;
  productCount: number;
  templateTheme: string;
  totalViews: number;
  totalOrders: number;
  totalRevenue: number;
  previousSlugs: string[];
  createdAt: string;
  updatedAt: string;
  logo?: string;
  slug?: string;
  slugCreatedAt?: string;
  slugRenewAt?: string;
  milestones?: {
    firstProductAt?: string;
    firstSaleAt?: string;
  };
}

export interface ReportDetails extends Omit<Report, 'store'> {
  _id: string;
  store: StoreDetail;
}

export interface GetReportsParams {
  page?: number;
  limit?: number;
  status?: ReportStatus;
  sortBy?: 'newest' | 'oldest';
  reason?: ReportReason;
}

export interface ReportsResponse {
  message: string;
  reports: Report[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ReportStatsResponse {
  message: string;
  data: ReportStats;
}

export interface ReportDetailsResponse {
  message: string;
  data: ReportDetails;
}

export interface ResolveReportParams {
  resolution: 'approved' | 'rejected';
  actionNote: string;
}

export interface ResolveReportResponse {
  message: string;
  report: ReportDetails;
}
