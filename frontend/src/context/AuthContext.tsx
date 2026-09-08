"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import api from "@/config/api";
import { API_ROUTES } from "@/config/apiRoutes";
import {
  getAccessToken,
  getStoredUser,
  setTokens,
  clearAuth,
  setStoredUser,
} from "@/common/utils/token";
import { User, Role } from "@/modules/client/auth/models/auth.model";

interface DecodedTokenPayload {
  id?: string;
  sub?: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, refreshToken?: string, initialUser?: User) => Promise<void>;
  logout: () => void;
  hasPermission: (resource: string, action: string) => boolean;
  hasRole: (...roles: (Role | string)[]) => boolean;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUserProfile = useCallback(async (authToken: string) => {
    try {
      let decoded: DecodedTokenPayload = {};
      try {
        decoded = jwtDecode<DecodedTokenPayload>(authToken);
      } catch {
        // Token có thể không phải chuẩn JWT decode client
      }

      // Gắn rõ ràng header Authorization để đảm bảo không phụ thuộc timing của interceptor
      const res = await api.get(API_ROUTES.AUTH.ME, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const serverUser = res.data?.data?.user || res.data?.user || res.data;

      const rawRole =
        typeof serverUser?.roleId === "object" && serverUser?.roleId?.name
          ? serverUser.roleId.name
          : serverUser?.role || decoded?.role || "USER";

      const fullUser: User = {
        ...serverUser,
        id: serverUser?._id || serverUser?.id || decoded?.id || decoded?.sub,
        displayName: serverUser?.displayName || serverUser?.username || "Độc giả StoryVN",
        role: rawRole,
        permissions: serverUser?.permissions || [],
      };

      setUser(fullUser);
      setStoredUser(fullUser);
      return fullUser;
    } catch (error) {
      console.warn("Lỗi khi tải thông tin hồ sơ:", error);
      const cached = getStoredUser();
      if (cached) {
        setUser(cached);
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedToken = getAccessToken();
    const storedUser = getStoredUser();
    if (savedToken) {
      setToken(savedToken);
      if (storedUser) {
        setUser(storedUser);
      }
      api.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
      void fetchUserProfile(savedToken);
    } else {
      setIsLoading(false);
    }
  }, [fetchUserProfile]);

  const login = async (newToken: string, refreshToken?: string, initialUser?: User) => {
    setTokens(newToken, refreshToken);
    setToken(newToken);

    if (initialUser) {
      const rawRole = (
        typeof initialUser.roleId === "object" && initialUser.roleId?.name
          ? initialUser.roleId.name
          : initialUser.role || "USER"
      ).toUpperCase();

      const optimisticUser: User = {
        ...initialUser,
        id: initialUser.id || initialUser._id,
        role: rawRole,
      };
      setUser(optimisticUser);
      setStoredUser(optimisticUser);
    }

    // Gắn ngay Authorization header mặc định cho Axios
    api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

    await fetchUserProfile(newToken);
  };

  const logout = () => {
    clearAuth();
    delete api.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
    setIsLoading(false);
  };

  const refreshUserProfile = async () => {
    const currentToken = getAccessToken();
    if (currentToken) {
      api.defaults.headers.common["Authorization"] = `Bearer ${currentToken}`;
      await fetchUserProfile(currentToken);
    }
  };

  const hasPermission = (resource: string, action: string) => {
    if (!user) return false;
    const roleStr = (
      typeof user.roleId === "object" && user.roleId?.name
        ? user.roleId.name
        : user.role || ""
    ).toUpperCase();

    if (roleStr === "ADMIN") return true;
    return (
      user.permissions?.some(
        (p) =>
          p.resource.toLowerCase() === resource.toLowerCase() &&
          p.action.toLowerCase() === action.toLowerCase()
      ) || false
    );
  };

  const hasRole = (...roles: (Role | string)[]) => {
    if (!user) return false;
    const userRole = (
      typeof user.roleId === "object" && user.roleId?.name
        ? user.roleId.name
        : user.role || "USER"
    ).toUpperCase();

    const targetRoles = roles.map((r) => r.toUpperCase());
    return targetRoles.includes(userRole);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        hasPermission,
        hasRole,
        refreshUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được sử dụng bên trong AuthProvider");
  }
  return context;
};
