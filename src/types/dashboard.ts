// ==========================================
// types/dashboard.ts
// ==========================================

export interface PlatformStats {
  totalSellers: {
    count: number;
    growth: number;
  };
  activeSellers: {
    count: number;
    percentage: number;
  };
  totalProducts: {
    count: number;
    avgPerSeller: number;
  };
  monthlyRevenue: {
    amount: number;
    growth: number;
  };
  newSignupsToday: {
    count: number;
    weeklyTrend: number;
  };
  paidConversionRate: {
    rate: number;
    target: number;
    freeUsers: number;
    paidUsers: number;
  };
}

export interface RevenueChartData {
  period: {
    year: number;
    month?: number;
    week?: number;
    day?: number;
  };
  revenue: number;
  transactions: number;
}

export interface UserGrowthData {
  date: string;
  free: number;
  paid: number;
}

export interface RecentActivity {
  type: 'signup' | 'upgrade' | 'cancellation' | 'suspension';
  description: string;
  metadata: {
    email?: string;
    tier?: string;
    amount?: number;
  };
  timestamp: string | Date;
}

export type RevenuePeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface RevenueChartParams {
  period?: RevenuePeriod;
  days?: number;
}

export interface UserGrowthParams {
  days?: number;
}

export interface RecentActivityParams {
  limit?: number;
}

export interface DashboardStatsResponse {
  message: string;
  data: PlatformStats;
}

export interface RevenueChartResponse {
  message: string;
  data: RevenueChartData[];
}

export interface UserGrowthResponse {
  message: string;
  data: UserGrowthData[];
}

export interface RecentActivityResponse {
  message: string;
  data: RecentActivity[];
}