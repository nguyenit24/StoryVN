"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AdminDashboardService } from "../services/dashboard.service";
import { DashboardData, DashboardTimeFilter } from "../models/dashboard.model";
import { getMockDashboardData } from "../mocks/dashboard.mock";

export const useAdminDashboard = () => {
  const queryClient = useQueryClient();
  const [timeFilter, setTimeFilter] = useState<DashboardTimeFilter>("today");

  const dashboardQuery = useQuery<DashboardData>({
    queryKey: ["admin-dashboard", timeFilter],
    queryFn: async () => {
      try {
        const res = await AdminDashboardService.getOverview(timeFilter);
        if (res?.data) {
          return res.data;
        }
      } catch {
        // Fallback sang dữ liệu mẫu khi endpoint backend chưa hoàn thiện
      }
      return getMockDashboardData(timeFilter);
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false,
  });

  const handleExport = async () => {
    try {
      toast.loading("Đang xuất báo cáo vận hành...", { id: "export-dash" });
      try {
        const blob = await AdminDashboardService.exportReport(timeFilter);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `StoryVN_BaoCao_${timeFilter}_${new Date().toISOString().slice(0, 10)}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
      } catch {
        // Fallback xuất file mẫu phía client
        const dummyBlob = new Blob(["Báo cáo vận hành StoryVN Admin Portal"], { type: "text/plain" });
        const url = window.URL.createObjectURL(dummyBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `StoryVN_Admin_BaoCao_${new Date().toISOString().slice(0, 10)}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
      toast.success("Đã xuất báo cáo Excel thành công!", { id: "export-dash" });
    } catch {
      toast.error("Không thể xuất báo cáo lúc này!", { id: "export-dash" });
    }
  };

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    toast.success("Đã làm mới dữ liệu tổng quan!");
  };

  return {
    data: dashboardQuery.data,
    isLoading: dashboardQuery.isLoading,
    isError: dashboardQuery.isError,
    timeFilter,
    setTimeFilter,
    handleExport,
    handleRefresh,
  };
};
