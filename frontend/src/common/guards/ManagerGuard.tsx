"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

/**
 * Guard bảo vệ các route phân hệ Quản lý Nội dung (/manager, /manager/*)
 * Yêu cầu:
 * 1. Bắt buộc đã đăng nhập (isAuthenticated).
 * 2. Tài khoản bắt buộc có vai trò MANAGER hoặc ADMIN.
 * 3. Chặn ĐỘC GIẢ và TÁC GIẢ thông thường.
 */
export default function ManagerGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    // 1. Chưa đăng nhập -> Chặn ngay và điều hướng về trang đăng nhập
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập tài khoản Quản lý nội dung để tiếp tục!", {
        id: "manager-guard-unauth",
      });
      router.replace(`/dang-nhap?redirect=${encodeURIComponent(pathname || "/manager")}`);
      return;
    }

    // 2. Không có vai trò MANAGER hoặc ADMIN
    const isAuthorized = hasRole("MANAGER", "ADMIN");
    if (!isAuthorized) {
      toast.error("Tài khoản của bạn không có quyền truy cập phân hệ Quản lý nội dung!", {
        id: "manager-guard-forbidden",
      });
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, hasRole, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent shadow-md" />
          <span className="text-xs font-semibold text-slate-500">
            Đang xác thực quyền Quản lý nội dung...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !hasRole("MANAGER", "ADMIN")) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-center px-4 max-w-sm">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xl">
            <span className="material-symbols-outlined text-[26px]">lock</span>
          </div>
          <h2 className="text-sm font-bold text-slate-800">
            Yêu cầu quyền Quản lý Nội dung (Manager)
          </h2>
          <p className="text-xs text-slate-500">
            Khu vực này chỉ dành riêng cho Ban biên tập và Quản trị viên. Đang chuyển hướng...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
