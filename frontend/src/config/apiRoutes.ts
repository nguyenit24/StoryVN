export const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    VERIFY_OTP: "/auth/verify-otp",
    REFRESH: "/auth/refresh",
    ME: "/users/profile",
    PERMISSIONS: "/auth/permissions",
    LOGOUT: "/auth/logout",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    GOOGLE: "/auth/google",
  },
  USERS: {
    PROFILE: "/users/profile",
    CHANGE_PASSWORD: "/users/change-password",
    BY_ID: (id: string) => `/users/${id}`,
    ADMIN_LIST: "/users",
    ADMIN_STATS: "/users/stats/overview",
    UPDATE_ROLE: (id: string) => `/users/${id}/role`,
    UPDATE_STATUS: (id: string) => `/users/${id}/status`,
  },
  AUTHORS: {
    UPGRADE: "/authors/upgrade",
    ME: "/authors/me",
  },
  UPLOAD: {
    IMAGE: "/upload/image",
  },
  ADMIN: {
    DASHBOARD_OVERVIEW: "/admin/dashboard/overview",
    DASHBOARD_EXPORT: "/admin/dashboard/export",
  },
  CATEGORIES: {
    LIST: "/categories",
    CREATE: "/categories",
    SEED: "/categories/seed",
    UPDATE: (id: string) => `/categories/${id}`,
    DELETE: (id: string) => `/categories/${id}`,
  },
  TAGS: {
    LIST: "/tags",
    CREATE: "/tags",
    SEED: "/tags/seed",
    UPDATE: (id: string) => `/tags/${id}`,
    DELETE: (id: string) => `/tags/${id}`,
  },
  STORIES: {
    ADMIN_LIST: "/stories",
    DELETE: (id: string) => `/stories/${id}`,
    MY_LIST: "/stories/my",
    MY_BY_SLUG: (slug: string) => `/stories/my/${slug}`,
  },
} as const;
