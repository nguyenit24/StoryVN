import api from "@/config/api";
import { API_ROUTES } from "@/config/apiRoutes";
import { ApiResponse } from "@/modules/client/auth/models/auth.model";
import { DashboardData, DashboardTimeFilter } from "../models/dashboard.model";

/**
 * Service tầng gọi API cho Admin Dashboard (Bảng điều khiển)
 * Tuân thủ quy chuẩn Clean Architecture: Service chỉ chịu trách nhiệm gọi API, truyền params/payload và trả về dữ liệu từ server.
 */
export const AdminDashboardService = {
  // Gọi API lấy dữ liệu tổng quan thống kê
  getOverview: async (filter: DashboardTimeFilter = "today"): Promise<ApiResponse<DashboardData>> => {
    const res = await api.get<ApiResponse<DashboardData>>(API_ROUTES.ADMIN.DASHBOARD_OVERVIEW, {
      params: { filter },
    });
    return res.data;
  },

  // Gọi API xuất báo cáo vận hành dạng file nhị phân (Excel blob)
  exportReport: async (filter: DashboardTimeFilter = "today"): Promise<Blob> => {
    const res = await api.get(API_ROUTES.ADMIN.DASHBOARD_EXPORT, {
      params: { filter },
      responseType: "blob",
    });
    return res.data;
  },
};
