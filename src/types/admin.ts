/* eslint-disable @typescript-eslint/no-explicit-any */
// ==========================================
// types/admin.ts
// ==========================================

export enum AdminRole {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
}

export enum AdminStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  DELETED = 'deleted',
}

export interface Admin {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  avatar: string;
  phone?: string;
  lastLoginAt: string;
  createdAt: string;
  activityCount?: number;
  lastActivity?: string;
}

export interface AdminActivity {
  id: string;
  admin: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  action: string;
  description: string;
  targetUser: {
    id: string;
    name: string;
    email: string;
  } | null;
  targetStore: {
    id: string;
  } | null;
  targetProduct: any | null;
  metadata: Record<string, any>;
  createdAt: string;
}

export interface AdminDetails {
  admin: Admin & {
    firstName: string;
    lastName: string;
    phone: string;
  };
  recentActivities: Omit<AdminActivity, 'admin'>[];
  activityStats: any[];
}

export interface AdminsResponse {
  message: string;
  admins: Admin[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AdminDetailsResponse {
  message: string;
  data: AdminDetails;
}

export interface ActivitiesResponse {
  message: string;
  activities: AdminActivity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AdminFilters {
  page?: number;
  limit?: number;
  status?: AdminStatus;
  role?: AdminRole;
}

export interface ToggleStatusPayload {
  status: AdminStatus;
}

export interface ToggleStatusResponse {
  message: string;
  admin: Admin & {
    firstName: string;
    lastName: string;
    phone?: string;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    isVerified: string;
    userPreferences: {
      enable2FA: boolean;
      emailNotification: boolean;
    };
    updatedAt: string;
  };
}

export interface ChangeRoleResponse {
  message: string;
  admin: Admin & {
    firstName: string;
    lastName: string;
    googleId?: string;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    isVerified: string;
    userPreferences: {
      enable2FA: boolean;
      emailNotification: boolean;
    };
    updatedAt: string;
  };
}
