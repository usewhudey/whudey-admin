export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "Whudey",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api",
  frontendUrl: process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",
  cloudinaryCloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
};

export const SUBSCRIPTION_TIERS = {
  FREE: {
    name: "Free",
    productLimit: 10,
    price: 0,
    features: ["1-10 products", "Basic analytics", "Whudey branding"],
  },
  PAID: {
    name: "Professional",
    productLimit: 50,
    price: 5000,
    features: [
      "1-50 products",
      "Advanced analytics",
      "Remove branding",
      "Product variants",
      "Priority support",
    ],
  },
} as const;

export const TEMPLATE_THEMES = {
  TYPE_1: "type_1",
  TYPE_2: "type_2",
} as const;

export const MAX_PRODUCT_IMAGES = 4;
export const MAX_IMAGE_SIZE_MB = 5;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  VERIFY_EMAIL: "/verify-email",

  // Dashboard
  DASHBOARD: "/dashboard",
  PRODUCTS: "/dashboard/products",
  ORDERS: "/dashboard/orders",
  ANALYTICS: "/dashboard/analytics",
  STOREFRONT: "/dashboard/storefront",
  SETTINGS: "/dashboard/settings",
  SUBSCRIPTION: "/dashboard/subscription",

  // Storefront
  STORE: (slug: string) => `/${slug}`,
  PRODUCT: (storeSlug: string, productId: string) => `/${storeSlug}/${productId}`,
} as const;
