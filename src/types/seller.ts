// ==========================================
// types/seller.ts
// ==========================================

export interface Seller {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store?: any;
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'active' | 'suspended' | 'inactive';
  createdAt: string;
  lastLoginAt?: string;
  phone?: string;
  productCount: number;
  role?: string;
  avatar?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  isVerified?: string;
  googleId?: string;
  userPreferences?: {
    enable2FA: boolean;
    emailNotification: boolean;
  };
}

export interface Store {
  _id: string;
  user: string;
  storeName: string;
  description: string;
  branding: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
  };
  contact: {
    telegram?: string;
    whatsapp?: string;
    email?: string;
  };
  primaryContact: string;
  isSetUpCompleted: boolean;
  subscription: {
    tier: 'free' | 'paid' | 'premium';
    status: 'active' | 'inactive' | 'expired';
    productLimit: number;
    autoRenew: boolean;
    startDate?: string;
    expiryDate?: string;
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
  coverImage?: string;
  slug?: string;
  slugCreatedAt?: string;
  slugRenewAt?: string;
  milestones?: {
    firstProductAt?: string;
    firstSaleAt?: string;
  };
}

export interface LoginHistory {
  _id: string;
  userId: string;
  userAgent: string;
  createdAt: string;
  expiredAt: string;
}

export interface TopProduct {
  _id: string;
  name: string;
  price: number;
  images: Array<{
    url: string;
    publicId: string;
    order: number;
  }>;
}

export interface SellerDetails {
  seller: Seller;
  store: Store;
  statistics: {
    productCount: number;
    totalRevenue: number;
    totalVisits: number;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscriptionHistory: any[];
  loginHistory: LoginHistory[];
  topProducts: TopProduct[];
}

export interface GetSellersParams {
  page?: number;
  limit?: number;
  search?: string;
  subscription?: 'free' | 'paid' | 'premium';
  status?: 'active' | 'suspended' | 'inactive';
  signupDateFrom?: string;
  signupDateTo?: string;
  lastLoginFrom?: string;
  lastLoginTo?: string;
  sortBy?: string;
}

export interface SellersResponse {
  message: string;
  sellers: Seller[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface SellerDetailsResponse {
  message: string;
  data: SellerDetails;
}

export interface SuspendSellerParams {
  reason: string;
  duration: string;
}

export interface SuspendSellerResponse {
  message: string;
  seller: {
    _id: string;
    email: string;
    status: string;
  };
}

export interface UnsuspendSellerResponse {
  message: string;
  seller: {
    _id: string;
    email: string;
    status: string;
  };
}

export interface GrantSubscriptionParams {
  tier: 'free' | 'paid' | 'premium';
  months: number;
  reason: string;
}

export interface GrantSubscriptionResponse {
  message: string;
  subscription: {
    tier: string;
    status: string;
    productLimit: number;
    startDate: string;
    expiryDate: string;
    autoRenew: boolean;
  };
}

export interface BulkEmailParams {
  sellerIds: string[];
  subject: string;
  message: string;
}

export interface BulkEmailResponse {
  message: string;
  recipientCount: number;
}

export interface ResetPasswordResponse {
  message: string;
  temporaryPassword: string;
}

export interface MakeAdminResponse {
  message: string;
  user: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    previousRole: string;
  };
}
