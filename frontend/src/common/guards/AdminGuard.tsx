"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

/**
 * Guard bảo vệ nghiêm ngặt các route phân hệ Quản trị (/admin, /admin/*)
 * Yêu cầu:
 * 1. Bắt buộc đã đăng nhập (isAuthenticated).
 * 2. Tài khoản bắt buộc phải có vai trò ADMIN hoặc MANAGER (từ chối ĐỘC GIẢ và TÁC GIẢ).
 * 3. Tuyệt đối không cho phép truy cập tự do ở bất kỳ môi trường nào.
 */
export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    // 1. Chưa đăng nhập -> Chặn ngay và điều hướng về trang đăng nhập
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập tài khoản Quản trị viên để truy cập!", {
        id: "admin-guard-unauth",
      });
      router.replace(`/dang-nhap?redirect=${encodeURIComponent(pathname || "/admin")}`);
      return;
    }

    // 2. Đã đăng nhập nhưng không có vai trò ADMIN hoặc MANAGER (chỉ là Độc Giả / Tác Giả)
    const isAuthorized = hasRole("ADMIN", "MANAGER");
    if (!isAuthorized) {
      toast.error("Tài khoản của bạn không có quyền truy cập phân hệ Quản trị!", {
        id: "admin-guard-forbidden",
      });
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, hasRole, router, pathname]);

  // Trong lúc chờ tải trạng thái phiên đăng nhập
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent shadow-md" />
          <span className="text-xs font-semibold text-slate-500">
            Đang xác thực quyền truy cập Quản trị...
          </span>
        </div>
      </div>
    );
  }

  // Chặn tuyệt đối không hiển thị bất kỳ giao diện admin nào nếu chưa đăng nhập hoặc không đủ quyền
  if (!isAuthenticated || !hasRole("ADMIN", "MANAGER")) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-center px-4 max-w-sm">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xl">
            <span className="material-symbols-outlined text-[26px]">lock</span>
          </div>
          <h2 className="text-sm font-bold text-slate-800">
            Yêu cầu quyền Quản trị viên
          </h2>
          <p className="text-xs text-slate-500">
            Khu vực này chỉ dành riêng cho Admin và Manager. Đang chuyển hướng...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
