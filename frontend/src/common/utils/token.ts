import { User } from "@/modules/client/auth/models/auth.model";

const ACCESS_TOKEN_KEY = "storyvn_access_token";
const REFRESH_TOKEN_KEY = "storyvn_refresh_token";
const USER_KEY = "storyvn_user";

export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY) || localStorage.getItem("token");
};

export const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem(REFRESH_TOKEN_KEY) ||
    localStorage.getItem("refreshToken") ||
    localStorage.getItem("refresh_token")
  );
};

export const setTokens = (accessToken: string, refreshToken?: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem("token", accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem("refreshToken", refreshToken);
  }
};

export const clearAuth = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("refresh_token");
};

export const getStoredUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const userJson = localStorage.getItem(USER_KEY);
  if (!userJson) return null;
  try {
    return JSON.parse(userJson) as User;
  } catch {
    return null;
  }
};

export const setStoredUser = (user: User): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};
