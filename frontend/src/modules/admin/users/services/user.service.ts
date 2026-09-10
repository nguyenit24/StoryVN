import api from "@/config/api";
import { API_ROUTES } from "@/config/apiRoutes";
import { ApiResponse, User } from "@/modules/client/auth/models/auth.model";
import { AdminUsersResponse } from "../models/user.model";

export interface AdminGetUsersFilters {
  role?: string;
  search?: string;
  status?: string;
}

/**
 * Service tầng gọi API Quản lý Người dùng & Tác giả (Admin User Service)
 * Tuân thủ quy chuẩn Clean Architecture: Service thuần túy là lớp gọi API qua Axios, gửi params và trả về response data.
 */
export const AdminUserService = {
  // Lấy danh sách tài khoản phân trang kèm điều kiện lọc
  getAll: async (
    page = 1,
    limit = 50,
    filters?: AdminGetUsersFilters
  ): Promise<ApiResponse<AdminUsersResponse>> => {
    const res = await api.get<ApiResponse<AdminUsersResponse>>(API_ROUTES.USERS.ADMIN_LIST, {
      params: { page, limit, ...filters },
    });
    return res.data;
  },

  // Cập nhật vai trò tài khoản (Chỉ chấp nhận 4 role: USER, AUTHOR, MANAGER, ADMIN)
  updateRole: async (id: string, role: string): Promise<ApiResponse<{ user: User }>> => {
    const res = await api.patch<ApiResponse<{ user: User }>>(
      API_ROUTES.USERS.UPDATE_ROLE(id),
      { role }
    );
    return res.data;
  },

  // Cập nhật trạng thái mở khóa / tạm khóa tài khoản
  updateStatus: async (id: string, isActive: boolean): Promise<ApiResponse<{ user: User }>> => {
    const res = await api.patch<ApiResponse<{ user: User }>>(
      API_ROUTES.USERS.UPDATE_STATUS(id),
      { isActive }
    );
    return res.data;
  },

  // Lấy thông tin chi tiết một tài khoản theo định danh ID
  getById: async (id: string): Promise<ApiResponse<{ user: User }>> => {
    const res = await api.get<ApiResponse<{ user: User }>>(
      API_ROUTES.USERS.BY_ID(id)
    );
    return res.data;
  },

  // Lấy dữ liệu thống kê tổng quan người dùng
  getStats: async (): Promise<ApiResponse<Record<string, unknown>>> => {
    const res = await api.get<ApiResponse<Record<string, unknown>>>(
      API_ROUTES.USERS.ADMIN_STATS
    );
    return res.data;
  },
};

// Backward compatibility alias
export const usersApi = AdminUserService;
