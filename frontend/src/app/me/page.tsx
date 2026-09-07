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
import { MOCK_STORIES } from "@/features/story/mockStories";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"info" | "bookmarks" | "history" | "vip">("info");

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    const cached = getStoredUser();
    if (cached) setUser(cached);

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
        setError("Không thể đồng bộ thông tin mới nhất từ máy chủ.");
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
      : user?.role || "ĐỘC GIẢ THÂN THIẾT";

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
      <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-800 font-sans">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-xl shadow-blue-900/5 border border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-2xl font-bold">
            👤
          </div>
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-800">
              Yêu cầu đăng nhập
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Bạn cần đăng nhập để xem thông tin hồ sơ cá nhân, tủ truyện và quản lý tài khoản trên StoryVn_HCM-UTE.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link href="/login" className="flex-1">
              <Button variant="primary" fullWidth size="lg">
                Đăng nhập ngay
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button variant="outline" fullWidth size="lg">
                Về trang chủ
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Sample bookmarked stories for user library
  const bookmarkedStories = MOCK_STORIES.slice(0, 4);

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-slate-800 font-sans flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* ==================== 1. BRIGHT MODERN HEADER ==================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3.5 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex flex-col group">
            <div className="flex items-baseline gap-0.5">
              <span className="text-2xl font-black tracking-tight text-[#1d72fe]">
                Story<span className="text-[#f97316]">Vn</span>
              </span>
              <span className="text-xs font-bold text-slate-500">_HCM-UTE</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium -mt-1 hidden sm:inline">
              Hồ sơ thành viên &amp; Tủ truyện
            </span>
          </Link>

          {/* Quick Header Nav */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-600 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors"
            >
              &larr; Khám phá truyện
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
            </button>
          </div>
        </div>
      </header>

      {/* ==================== 2. MAIN PROFILE CONTAINER ==================== */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {error && (
          <Alert type="warning" message={error} onClose={() => setError(null)} />
        )}

        {/* PROFILE HERO BANNER */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative">
          {/* Gradient Cover Background */}
          <div className="h-36 sm:h-44 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 relative p-6 flex items-start justify-between">
            <div className="bg-white/20 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              THÀNH VIÊN CHÍNH THỨC
            </div>
            <div className="text-white/80 text-xs hidden sm:block">
              ID: {user?._id || user?.id || "SVN-89412"}
            </div>
          </div>

          {/* Avatar & User Info Row */}
          <div className="px-6 sm:px-8 pb-6 pt-0 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-4">
              {/* Avatar + Display Name */}
              <div className="flex items-end gap-4 sm:gap-5">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center text-3xl font-black border-4 border-white shadow-xl shadow-blue-500/20 select-none shrink-0">
                  {getInitials(user?.displayName || user?.username)}
                </div>

                <div className="pb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                      {user?.displayName || user?.username || "Độc Giả"}
                    </h1>
                    <span className="bg-blue-50 text-blue-600 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-blue-100">
                      VIP 1
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    @{user?.username || "member"} &bull; {user?.email}
                  </p>
                </div>
              </div>

              {/* Badges & Actions */}
              <div className="flex items-center gap-2 pt-2 sm:pt-0">
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Đã kích hoạt
                </span>
                <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl uppercase">
                  {roleName}
                </span>
              </div>
            </div>

            {/* Quick Stats Counter Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
              <div className="bg-slate-50 rounded-2xl p-3.5 text-center sm:text-left">
                <span className="text-xs text-slate-500 block">Số dư xu</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-lg sm:text-xl font-black text-amber-500">🪙 1,250</span>
                  <span className="text-[10px] text-slate-400">xu</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-3.5 text-center sm:text-left">
                <span className="text-xs text-slate-500 block">Tủ truyện theo dõi</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-lg sm:text-xl font-black text-blue-600">📚 12</span>
                  <span className="text-[10px] text-slate-400">bộ</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-3.5 text-center sm:text-left">
                <span className="text-xs text-slate-500 block">Chương đã đọc</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-lg sm:text-xl font-black text-indigo-600">📖 348</span>
                  <span className="text-[10px] text-slate-400">chương</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-3.5 text-center sm:text-left">
                <span className="text-xs text-slate-500 block">Phiếu đề cử</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-lg sm:text-xl font-black text-rose-500">🎟️ 5</span>
                  <span className="text-[10px] text-slate-400">phiếu</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("info")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "info"
                ? "bg-[#1d72fe] text-white shadow-sm shadow-blue-500/25"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Thông tin tài khoản
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("bookmarks")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "bookmarks"
                ? "bg-[#1d72fe] text-white shadow-sm shadow-blue-500/25"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Tủ truyện của tôi (12)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "history"
                ? "bg-[#1d72fe] text-white shadow-sm shadow-blue-500/25"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Lịch sử đọc gần đây
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("vip")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "vip"
                ? "bg-[#1d72fe] text-white shadow-sm shadow-blue-500/25"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Nạp xu &amp; Hội viên
          </button>
        </div>

        {/* TAB 1: THÔNG TIN CHI TIẾT TÀI KHOẢN */}
        {activeTab === "info" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fadeIn">
            {/* Left Col: Account Details (8 Cols) */}
            <div className="md:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-800">
                    Chi tiết hồ sơ độc giả
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Thông tin tài khoản được lưu trữ bảo mật trên StoryVn_HCM-UTE.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => alert("Chức năng cập nhật thông tin sẽ sớm ra mắt!")}
                  className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
                >
                  Chỉnh sửa
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Tên hiển thị</span>
                  <p className="text-sm font-bold text-slate-800">
                    {user?.displayName || "Chưa thiết lập"}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Tên đăng nhập (Username)</span>
                  <p className="text-sm font-bold text-slate-800 font-mono">
                    {user?.username || "—"}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Địa chỉ Email</span>
                  <p className="text-sm font-bold text-slate-800">
                    {user?.email || "—"}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Trạng thái tài khoản</span>
                  <p className="text-sm font-bold text-emerald-600 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Đang hoạt động bình thường
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Mã định danh ID</span>
                  <p className="text-xs font-mono text-slate-600 break-all">
                    {user?._id || user?.id || "SVN-89412-UTE"}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Đăng nhập gần nhất</span>
                  <p className="text-xs font-mono text-slate-700">
                    {user?.lastLoginAt
                      ? new Date(user.lastLoginAt).toLocaleString("vi-VN")
                      : "Hôm nay, 14:00"}
                  </p>
                </div>
              </div>

              {/* Security Hint */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-start gap-3 text-xs text-slate-600">
                <span className="text-base text-blue-500">🛡️</span>
                <p className="leading-relaxed">
                  Tài khoản của bạn được bảo vệ bởi xác thực OTP hai lớp. Bạn có thể sử dụng tính năng{" "}
                  <Link href="/forgot-password" className="text-blue-600 font-semibold underline">
                    Quên mật khẩu
                  </Link>{" "}
                  bất cứ lúc nào để khôi phục quyền truy cập nếu cần.
                </p>
              </div>
            </div>

            {/* Right Col: Side Actions & VIP (4 Cols) */}
            <div className="md:col-span-4 space-y-4">
              {/* VIP Card */}
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-3xl p-6 shadow-lg shadow-amber-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black tracking-wider uppercase bg-white/20 px-2.5 py-1 rounded-full">
                    GÓI ĐẶC QUYỀN
                  </span>
                  <span className="text-2xl">👑</span>
                </div>
                <h3 className="text-lg font-black leading-snug">
                  Hội viên VIP StoryVn
                </h3>
                <p className="text-xs text-amber-100 leading-relaxed">
                  Đọc trước chương VIP, không quảng cáo, mở khóa toàn bộ kho truyện dịch bản quyền chất lượng cao.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("vip")}
                  className="w-full bg-white hover:bg-amber-50 text-amber-700 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                >
                  Nâng cấp VIP ngay &rarr;
                </button>
              </div>

              {/* Quick Link Card */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Thao tác nhanh
                </h4>
                <div className="space-y-2 text-xs">
                  <Link
                    href="/"
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-semibold transition-colors"
                  >
                    <span>Khám phá truyện mới</span>
                    <span>&rarr;</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setActiveTab("bookmarks")}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-semibold transition-colors cursor-pointer"
                  >
                    <span>Mở tủ sách cá nhân</span>
                    <span>&rarr;</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-red-50/60 hover:bg-red-100 text-red-600 font-semibold transition-colors cursor-pointer"
                  >
                    <span>Đăng xuất khỏi thiết bị này</span>
                    <span>✕</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TỦ TRUYỆN CỦA TÔI */}
        {activeTab === "bookmarks" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-800">
                  Tủ truyện đang theo dõi
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Danh sách tác phẩm bạn đã đánh dấu yêu thích để nhận thông báo chương mới.
                </p>
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {bookmarkedStories.length} tác phẩm
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {bookmarkedStories.map((story, i) => (
                <div
                  key={story.id}
                  className="group bg-slate-50/80 hover:bg-white rounded-2xl p-3 border border-slate-200/80 hover:border-blue-400 hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-3/4 rounded-xl overflow-hidden mb-3">
                      <img
                        src={story.coverImage}
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 left-2 bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                        Đang đọc: C.{i * 120 + 45}
                      </span>
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-800 line-clamp-1 group-hover:text-blue-600">
                      {story.title}
                    </h3>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {story.author} &bull; {story.chaptersCount}c
                    </span>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-emerald-600 font-bold">
                      ● Cập nhật mới
                    </span>
                    <Link
                      href="/"
                      className="text-blue-600 font-bold hover:underline"
                    >
                      Đọc tiếp &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: LỊCH SỬ ĐỌC */}
        {activeTab === "history" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-800">
                Nhật ký đọc truyện gần đây
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Lưu lại tiến độ đọc chương cuối cùng của bạn trên các thiết bị.
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {MOCK_STORIES.slice(0, 5).map((story, idx) => (
                <div
                  key={`history-${story.id}`}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 px-3 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                      <img
                        src={story.coverImage}
                        alt={story.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 hover:text-blue-600 cursor-pointer">
                        {story.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Đã đọc tới: <span className="font-semibold text-blue-600">Chương {idx * 80 + 35}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 text-xs">
                    <span className="text-slate-400 font-mono text-[11px]">
                      {idx === 0 ? "10 phút trước" : `${idx * 2} giờ trước`}
                    </span>
                    <Link
                      href="/"
                      className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-3.5 py-1.5 rounded-xl font-semibold transition-colors"
                    >
                      Đọc tiếp &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: NẠP XU & HỘI VIÊN */}
        {activeTab === "vip" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-800">
                Nạp xu &amp; Gói hội viên VIP
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Ủng hộ tác giả và mở khóa các chương truyện hấp dẫn nhất.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-slate-50 hover:bg-blue-50/50 rounded-2xl p-5 border border-slate-200 hover:border-blue-300 text-center space-y-3 transition-all">
                <span className="text-2xl">🪙</span>
                <h4 className="font-bold text-slate-800">Gói Cơ Bản</h4>
                <div className="text-2xl font-black text-blue-600">
                  50.000đ
                </div>
                <p className="text-xs text-slate-500">Nhận 500 xu + 50 xu thưởng</p>
                <button
                  type="button"
                  onClick={() => alert("Cổng thanh toán MoMo / VNPay đang được kết nối!")}
                  className="w-full bg-[#1d72fe] text-white py-2 rounded-xl text-xs font-bold hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  Nạp ngay
                </button>
              </div>

              <div className="bg-gradient-to-b from-blue-50 to-indigo-50/50 rounded-2xl p-5 border-2 border-blue-500 text-center space-y-3 relative shadow-md shadow-blue-500/10">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase px-3 py-0.5 rounded-full">
                  PHỔ BIẾN NHẤT
                </span>
                <span className="text-2xl">👑</span>
                <h4 className="font-bold text-slate-800">Gói VIP Tháng</h4>
                <div className="text-2xl font-black text-blue-600">
                  99.000đ
                </div>
                <p className="text-xs text-slate-500">Đọc full không giới hạn 30 ngày</p>
                <button
                  type="button"
                  onClick={() => alert("Cổng thanh toán MoMo / VNPay đang được kết nối!")}
                  className="w-full bg-[#1d72fe] text-white py-2 rounded-xl text-xs font-bold hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  Đăng ký VIP
                </button>
              </div>

              <div className="bg-slate-50 hover:bg-blue-50/50 rounded-2xl p-5 border border-slate-200 hover:border-blue-300 text-center space-y-3 transition-all">
                <span className="text-2xl">💎</span>
                <h4 className="font-bold text-slate-800">Gói VIP Năm</h4>
                <div className="text-2xl font-black text-blue-600">
                  899.000đ
                </div>
                <p className="text-xs text-slate-500">Tiết kiệm 30% + Huy hiệu Kim Cương</p>
                <button
                  type="button"
                  onClick={() => alert("Cổng thanh toán MoMo / VNPay đang được kết nối!")}
                  className="w-full bg-[#1d72fe] text-white py-2 rounded-xl text-xs font-bold hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  Nâng cấp năm
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ==================== 3. FOOTER ==================== */}
      <footer className="border-t border-slate-100 bg-white py-6 px-6 text-xs text-slate-500 mt-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">StoryVn_HCM-UTE</span>
            <span>&bull;</span>
            <span>Trang hồ sơ độc giả và quản lý tủ truyện.</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
            <span>&bull;</span>
            <button type="button" onClick={handleLogout} className="hover:text-red-600 cursor-pointer">
              Đăng xuất
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
