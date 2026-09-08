import api from "@/config/api";
import { API_ROUTES } from "@/config/apiRoutes";
import { ApiResponse, User } from "@/modules/client/auth/models/auth.model";
import { AdminUsersResponse } from "../models/user.model";

export const AdminUserService = {
  getAll: async (page = 1, limit = 50): Promise<ApiResponse<AdminUsersResponse>> => {
    const res = await api.get<ApiResponse<AdminUsersResponse>>(API_ROUTES.USERS.ADMIN_LIST, {
      params: { page, limit },
    });
    return res.data;
  },

  updateRole: async (id: string, role: string): Promise<ApiResponse<{ user: User }>> => {
    const res = await api.patch<ApiResponse<{ user: User }>>(
      API_ROUTES.USERS.UPDATE_ROLE(id),
      { role }
    );
    return res.data;
  },

  updateStatus: async (id: string, isActive: boolean): Promise<ApiResponse<{ user: User }>> => {
    const res = await api.patch<ApiResponse<{ user: User }>>(
      API_ROUTES.USERS.UPDATE_STATUS(id),
      { isActive }
    );
    return res.data;
  },

  getById: async (id: string): Promise<ApiResponse<{ user: User }>> => {
    const res = await api.get<ApiResponse<{ user: User }>>(
      API_ROUTES.USERS.BY_ID(id)
    );
    return res.data;
  },

  getStats: async (): Promise<ApiResponse<Record<string, unknown>>> => {
    const res = await api.get<ApiResponse<Record<string, unknown>>>(
      API_ROUTES.USERS.ADMIN_STATS
    );
    return res.data;
  },
};

// Backward compatibility alias
export const usersApi = AdminUserService;
