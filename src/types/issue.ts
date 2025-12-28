// ==========================================
// types/issue.ts
// ==========================================

export enum IssueStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export interface Issue {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  description: string;
  status: IssueStatus;
  adminAction: {
    actionTakenBy: string;
    actionDate: string;
    actionNote?: string;
    resolution?: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface IssueDetails {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  description: string;
  status: IssueStatus;
  adminAction?: {
    actionTakenBy: string;
    actionDate: string;
    actionNote?: string;
    resolution?: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IssueStats {
  stats: {
    pending: number;
    inProgress: number;
    resolved: number;
    closed: number;
    total: number;
  };
  avgResolutionTimeHours: number;
}

export interface IssuesResponse {
  message: string;
  issues: Issue[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface IssueStatsResponse {
  message: string;
  data: IssueStats;
}

export interface IssueDetailsResponse {
  message: string;
  data: IssueDetails;
}

export interface IssueFilters {
  page?: number;
  limit?: number;
  status?: IssueStatus;
  priority?: string;
  sortBy?: string;
}

export interface UpdateStatusPayload {
  status: IssueStatus;
}

export interface ResolveIssuePayload {
  resolution: string;
  actionNote: string;
}

export interface UpdateStatusResponse {
  message: string;
  issue: IssueDetails;
}

export interface ResolveIssueResponse {
  message: string;
  issue: IssueDetails;
}
