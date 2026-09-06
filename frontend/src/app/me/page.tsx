"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/api/auth";
import {
  clearAuth,
  getAccessToken,
  getRefreshToken,
  getStoredUser,
  setStoredUser,
} from "@/lib/auth/token";
import { User } from "@/types/auth";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    // Set initial cached user if available
    const cached = getStoredUser();
    if (cached) setUser(cached);

    // Fetch fresh profile from backend
    authApi
      .getMe()
      .then((res) => {
        if (res.success && res.data?.user) {
          setUser(res.data.user);
          setStoredUser(res.data.user);
        }
      })
      .catch((err) => {
        console.error("Lỗi khi tải thông tin cá nhân:", err);
        setError("Không thể tải thông tin mới nhất từ máy chủ.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const refreshToken = getRefreshToken() || undefined;
      await authApi.logout(refreshToken);
    } catch (err) {
      console.error("Lỗi khi đăng xuất:", err);
    } finally {
      clearAuth();
      router.push("/login");
    }
  };

  const roleName =
    typeof user?.roleId === "object" && user?.roleId?.name
      ? user.roleId.name
      : user?.role || "USER";

  const getInitials = (name?: string, fallback = "U") => {
    if (!name) return fallback;
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // State: Not logged in
  if (!isLoading && !user && !getAccessToken()) {
    return (
      <div className="min-h-screen w-full bg-zinc-100 flex flex-col items-center justify-center p-6 text-zinc-900 font-sans">
        <div className="w-full max-w-md bg-white border border-zinc-300 p-8 text-center space-y-6 shadow-sm">
          <div className="w-12 h-12 bg-zinc-950 text-white flex items-center justify-center mx-auto text-xl font-bold font-mono">
            !
          </div>
          <div>
            <h1 className="text-xl font-bold uppercase tracking-tight text-zinc-950 font-mono">
              Chưa đăng nhập
            </h1>
            <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
              Bạn cần đăng nhập để xem thông tin hồ sơ cá nhân và quản lý tài khoản StoryVN.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/login" className="flex-1">
              <Button variant="primary" fullWidth size="md">
                Đăng nhập ngay
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button variant="outline" fullWidth size="md">
                Trang chủ
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-zinc-100 text-zinc-900 font-sans flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white px-6 py-4 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-950 flex items-center justify-center text-white font-mono font-bold text-sm">
              S
            </div>
            <span className="font-bold text-base tracking-widest text-zinc-950 uppercase font-mono">
              STORYVN
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-semibold uppercase tracking-wider text-zinc-600 hover:text-zinc-950 border border-zinc-200 px-3 py-2 bg-white hover:border-zinc-400 transition-colors"
            >
              Trang chủ
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              isLoading={isLoggingOut}
            >
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {error && (
          <Alert
            type="warning"
            message={error}
            onClose={() => setError(null)}
          />
        )}

        {/* Profile Card Header */}
        <div className="bg-white border border-zinc-300 shadow-sm overflow-hidden">
          <div className="h-28 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-950 relative border-b border-zinc-200">
            <div className="absolute right-4 top-4 text-xs font-mono text-zinc-400 uppercase tracking-widest">
              HỒ SƠ THÀNH VIÊN
            </div>
          </div>

          <div className="px-6 pb-6 pt-0 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12 mb-4">
              <div className="flex items-end gap-4">
                <div className="w-24 h-24 bg-zinc-950 text-white flex items-center justify-center text-2xl font-bold font-mono border-4 border-white shadow-md select-none">
                  {getInitials(user?.displayName || user?.username)}
                </div>
                <div className="pb-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight">
                    {user?.displayName || user?.username || "Người dùng"}
                  </h1>
                  <p className="text-xs font-mono text-zinc-500">
                    @{user?.username || "unknown"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="bg-zinc-950 text-white text-[11px] font-mono px-3 py-1 font-bold uppercase tracking-wider">
                  VAI TRÒ: {roleName}
                </span>
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-mono px-3 py-1 font-bold uppercase">
                  ĐÃ XÁC THỰC
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Detailed Info Card */}
          <div className="md:col-span-2 bg-white border border-zinc-300 p-6 shadow-sm space-y-6">
            <div className="border-b border-zinc-200 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-zinc-950">
                Thông tin chi tiết tài khoản
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-zinc-50 border border-zinc-200">
                <span className="text-zinc-500 uppercase tracking-wider block font-semibold mb-1">
                  Tên hiển thị
                </span>
                <span className="text-sm font-medium text-zinc-900">
                  {user?.displayName || "Chưa thiết lập"}
                </span>
              </div>

              <div className="p-3.5 bg-zinc-50 border border-zinc-200">
                <span className="text-zinc-500 uppercase tracking-wider block font-semibold mb-1">
                  Tên đăng nhập
                </span>
                <span className="text-sm font-medium text-zinc-900 font-mono">
                  {user?.username || "—"}
                </span>
              </div>

              <div className="p-3.5 bg-zinc-50 border border-zinc-200">
                <span className="text-zinc-500 uppercase tracking-wider block font-semibold mb-1">
                  Địa chỉ Email
                </span>
                <span className="text-sm font-medium text-zinc-900">
                  {user?.email || "—"}
                </span>
              </div>

              <div className="p-3.5 bg-zinc-50 border border-zinc-200">
                <span className="text-zinc-500 uppercase tracking-wider block font-semibold mb-1">
                  Trạng thái tài khoản
                </span>
                <span className="text-sm font-medium text-emerald-700 font-semibold">
                  ● Đang hoạt động
                </span>
              </div>

              <div className="p-3.5 bg-zinc-50 border border-zinc-200">
                <span className="text-zinc-500 uppercase tracking-wider block font-semibold mb-1">
                  Mã ID người dùng
                </span>
                <span className="text-xs font-mono text-zinc-700 break-all">
                  {user?._id || user?.id || "—"}
                </span>
              </div>

              <div className="p-3.5 bg-zinc-50 border border-zinc-200">
                <span className="text-zinc-500 uppercase tracking-wider block font-semibold mb-1">
                  Đăng nhập gần nhất
                </span>
                <span className="text-xs font-mono text-zinc-700">
                  {user?.lastLoginAt
                    ? new Date(user.lastLoginAt).toLocaleString("vi-VN")
                    : "Hôm nay"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            <div className="bg-white border border-zinc-300 p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-zinc-950 border-b border-zinc-200 pb-3">
                Thao tác nhanh
              </h2>

              <div className="space-y-2">
                <Link href="/" className="block">
                  <Button variant="outline" fullWidth size="md" className="justify-between">
                    <span>Khám phá truyện</span>
                    <span>&rarr;</span>
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  fullWidth
                  size="md"
                  className="justify-between"
                  onClick={() => alert("Tính năng quản lý tác phẩm đang phát triển")}
                >
                  <span>Tủ sách của tôi</span>
                  <span>&rarr;</span>
                </Button>

                <Button
                  variant="danger"
                  fullWidth
                  size="md"
                  onClick={handleLogout}
                  isLoading={isLoggingOut}
                >
                  Đăng xuất tài khoản
                </Button>
              </div>
            </div>

            {/* Quick Tips */}
            {/* <div className="bg-zinc-50 border border-zinc-200 p-4 text-xs text-zinc-600 space-y-2">
              <div className="font-bold text-zinc-950 uppercase tracking-wider font-mono">
                Bảo mật tài khoản
              </div>
              <p className="leading-relaxed">
                Phiên đăng nhập được bảo mật bằng mã JWT và refresh token tự động. Hãy nhớ đăng xuất khi sử dụng máy tính công cộng.
              </p>
            </div> */}
          </div>
        </div>
      </main>
    </div>
  );
}
