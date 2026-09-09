"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getFullImageUrl } from "@/common/utils/imageUrl";
import { User } from "@/modules/client/auth/models/auth.model";
import {
  PROFILE_AUTHOR_WORKS,
  AppRole,
} from "@/modules/client/story/mockStories";
import { EditProfileModal } from "./EditProfileModal";
import { ChangePasswordModal } from "./ChangePasswordModal";
import { LogoutConfirmModal } from "./LogoutConfirmModal";
import { UpgradeAuthorModal } from "./UpgradeAuthorModal";
import { ClientHeader } from "@/components/layout/ClientHeader";
import { ClientFooter } from "@/components/layout/ClientFooter";

export default function ProfilePage() {
  const router = useRouter();
  const { user: authUser, refreshUserProfile, isLoading, isAuthenticated } = useAuth();
  const [userOverride, setUserOverride] = useState<User | null>(null);
  const user = userOverride ?? authUser;
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Tab State
  const [activeTab, setActiveTab] = useState<"works" | "library" | "history" | "forum" | "badges">("works");

  // Reader settings state
  const [readingTheme, setReadingTheme] = useState<"light" | "sepia" | "green" | "dark">("light");
  const [fontSize, setFontSize] = useState<number>(18);
  const [fontFamily, setFontFamily] = useState<string>("Be Vietnam Pro (Hiện đại)");

  // Modal States
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isUpgradeAuthorOpen, setIsUpgradeAuthorOpen] = useState(false);
  const [logoutModalMode, setLogoutModalMode] = useState<"current" | "all">("current");

  const currentRole = (
    typeof user?.roleId === "object" && user?.roleId?.name
      ? user.roleId.name
      : user?.role || "USER"
  ).toUpperCase() as AppRole;

  const isAuthor = currentRole === "AUTHOR";
  const isAdmin = currentRole === "ADMIN";
  const isReader = !isAuthor && !isAdmin;

  // Lấy tên hiển thị ưu tiên bút danh nếu là tác giả, tiếp đến displayName, rồi đến username
  const displayName =
    (isAuthor && user?.authorProfile?.penName) ||
    user?.displayName ||
    user?.username ||
    "Độc giả StoryVN";

  // ID hiển thị rút gọn từ hex id MongoDB
  const rawId = user?._id || user?.id || "";
  const displayId = rawId ? rawId.slice(-6).toUpperCase() : "ST0001";

  // Bio hiển thị
  const displayBio =
    user?.bio ||
    (isAuthor
      ? "Tác giả độc quyền tại StoryVN • Chưa cập nhật lời giới thiệu sáng tác."
      : "Độc giả đồng hành cùng StoryVN • Chưa cập nhật tiểu sử.");

  // Ngày tham gia
  const joinedDateStr = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("vi-VN")
    : "Gần đây";

  const handleProfileUpdated = (updatedUser: User) => {
    setUserOverride(updatedUser);
    refreshUserProfile();
    setSuccessMsg("Cập nhật thông tin hồ sơ thành công!");
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleWithdrawRequest = () => {
    setSuccessMsg("Đã gửi yêu cầu rút 14.850.000 VNĐ về tài khoản ngân hàng của bạn!");
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      router.replace("/login?redirect=/me");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent shadow-md" />
          <span className="text-sm font-semibold text-slate-500">Đang tải hồ sơ cá nhân...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-4 border border-slate-100 animate-fadeIn">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mx-auto shadow-sm">
            🔒
          </div>
          <h2 className="text-xl font-black text-slate-800">Yêu cầu đăng nhập</h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Bạn cần đăng nhập tài khoản StoryVN để xem và quản lý hồ sơ cá nhân, tủ sách và lịch sử đọc truyện.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/"
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Về trang chủ
            </Link>
            <Link
              href="/login?redirect=/me"
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-xs sm:text-sm font-bold text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
            >
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between">
      {/* ==================== 1. SHARED UNIFIED CLIENT HEADER ==================== */}
      <ClientHeader />

      {/* Success Notification Toast */}
      {successMsg && (
        <div className="fixed top-16 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-bold animate-fadeIn flex items-center gap-2">
          <span>✓</span>
          <span>{successMsg}</span>
        </div>
      )}

      {/* ==================== 2. COVER BANNER ==================== */}
      <div className="relative w-full h-56 sm:h-72 bg-slate-900 overflow-hidden">
        <img
          src={
            user?.authorProfile?.coverImage ||
            "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1800&q=80"
          }
          alt="Cover Banner"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-transparent" />

        {/* Action button: Chỉnh sửa ảnh bìa */}
        <button
          type="button"
          onClick={() => setIsEditProfileOpen(true)}
          className="absolute top-4 right-4 sm:top-6 sm:right-8 bg-black/50 hover:bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3.5 py-2 rounded-full border border-white/20 flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
        >
          <span>📷</span>
          <span>Đổi ảnh bìa</span>
        </button>
      </div>

      {/* ==================== 3. PROFILE HEADER CARD ==================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-20 sm:-mt-24 relative z-10 w-full">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Avatar & User Info */}
            <div className="flex items-start sm:items-center gap-5">
              <div className="relative shrink-0">
                {user?.avatar ? (
                  <img
                    src={getFullImageUrl(user.avatar)}
                    alt={displayName}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white shadow-xl bg-slate-100"
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-black text-3xl sm:text-4xl flex items-center justify-center border-4 border-white shadow-xl">
                    {(displayName[0] || "U").toUpperCase()}
                  </div>
                )}

                {/* Role Badge on Avatar */}
                <span
                  className={`absolute -top-2 -left-2 text-white font-black text-[9px] px-2 py-0.5 rounded shadow-sm ${
                    isAdmin
                      ? "bg-purple-600"
                      : isAuthor
                      ? "bg-amber-600"
                      : "bg-blue-600"
                  }`}
                >
                  {isAdmin ? "ADMIN" : isAuthor ? "TÁC GIẢ" : "ĐỘC GIẢ"}
                </span>

                {/* Edit avatar button */}
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(true)}
                  className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center text-xs shadow-md border-2 border-white cursor-pointer"
                  title="Thay đổi ảnh đại diện"
                >
                  📷
                </button>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {displayName}
                  </h1>

                  {/* Badges */}
                  {isAdmin && (
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold text-xs border border-purple-200">
                      🛡️ Quản trị viên
                    </span>
                  )}

                  {isAuthor && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold text-xs border border-amber-200">
                      ✍️ Tác giả StoryVN
                    </span>
                  )}

                  {isReader && (
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200">
                      📖 Độc giả thân thiết
                    </span>
                  )}

                  <span className="text-xs font-mono font-bold text-slate-400">
                    ID: #{displayId}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                  {displayBio}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium pt-1">
                  <span>📅 Tham gia {joinedDateStr}</span>
                  <span>•</span>
                  <span>✉️ {user?.email || "Chưa có email"}</span>
                  <span>•</span>
                  <span className="text-blue-600 font-bold">
                    @{user?.username || "user"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons: Phân biệt rõ ràng theo Role */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {/* Nút riêng cho TÁC GIẢ */}
              {isAuthor && (
                <>
                  <button
                    type="button"
                    onClick={() => setSuccessMsg("Mở trình soạn thảo chương mới...")}
                    className="bg-[#1d72fe] hover:bg-blue-600 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>✏️ Soạn thảo chương mới</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSuccessMsg("Đang đồng bộ dữ liệu Studio Tác giả...")}
                    className="bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>📊 Studio tác giả</span>
                  </button>
                </>
              )}

              {/* Nút riêng cho ĐỘC GIẢ (Nâng cấp lên tác giả) */}
              {isReader && (
                <button
                  type="button"
                  onClick={() => setIsUpgradeAuthorOpen(true)}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-md shadow-orange-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>✍️ Nâng cấp lên Tác giả</span>
                </button>
              )}

              {/* Nút riêng cho ADMIN */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-md shadow-purple-500/20 flex items-center gap-1.5 transition-all"
                >
                  <span>🛡️ Quản trị hệ thống</span>
                </Link>
              )}

              {/* Nút CHỈNH SỬA HỒ SƠ */}
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(true)}
                className="bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                title="Chỉnh sửa thông tin cá nhân"
              >
                <span>✏️ Sửa hồ sơ</span>
              </button>

              {/* Nút ĐỔI MẬT KHẨU */}
              <button
                type="button"
                onClick={() => setIsChangePasswordOpen(true)}
                className="bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                title="Đổi mật khẩu tài khoản"
              >
                <span>🔑 Đổi mật khẩu</span>
              </button>
            </div>
          </div>

          {/* 4 Stat Columns: Phân hóa theo vai trò */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-100">
            {isAuthor ? (
              <>
                <div className="p-3.5 bg-slate-50 rounded-2xl space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    TÁC PHẨM XUẤT BẢN
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">4</span>
                    <span className="text-[11px] text-blue-600 font-semibold">2 đã hoàn</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    TỔNG LƯỢT ĐỌC
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">1.2M</span>
                    <span className="text-[11px] text-emerald-600 font-semibold">+14% tháng này</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    NGƯỜI THEO DÕI
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">45.8K</span>
                    <span className="text-[11px] text-blue-600 font-semibold">+412 mới</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    PHIẾU ĐỀ CỬ
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">128.4K</span>
                    <span className="text-[11px] text-amber-600 font-semibold">#Top 32 BXH</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="p-3.5 bg-slate-50 rounded-2xl space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    TỦ TRUYỆN THEO DÕI
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">32</span>
                    <span className="text-[11px] text-blue-600 font-semibold">tác phẩm</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    CHƯƠNG ĐÃ ĐỌC
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">1.450</span>
                    <span className="text-[11px] text-emerald-600 font-semibold">+82 tuần này</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    SỐ DƯ LINH THẠCH
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">1.200</span>
                    <span className="text-[11px] text-amber-600 font-semibold">LT</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    VAI TRÒ TÀI KHOẢN
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-slate-900">{currentRole}</span>
                    <span className="text-[11px] text-blue-600 font-semibold">Hoạt động</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ==================== 4. MAIN CONTENT & TABS ==================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 flex-1 w-full">
        {/* BANNER KÊU GỌI NÂNG CẤP TÁC GIẢ (CHỈ DÀNH CHO ROLE ĐỘC GIẢ USER) */}
        {isReader && (
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-orange-500/15 flex flex-col md:flex-row items-center justify-between gap-6 animate-fadeIn">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-md">
                <span>✨</span>
                <span>Cơ hội trở thành Tác giả độc quyền StoryVN</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                Bạn có niềm đam mê sáng tác văn học kỳ ảo?
              </h3>
              <p className="text-xs sm:text-sm text-orange-100 max-w-xl">
                Đăng ký bút danh và nâng cấp tài khoản lên Tác giả ngay hôm nay để xuất bản truyện, tiếp cận hàng triệu độc giả và nhận doanh thu nhuận bút hấp dẫn.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsUpgradeAuthorOpen(true)}
              className="shrink-0 px-6 py-3.5 bg-white text-orange-600 hover:bg-orange-50 font-black text-xs sm:text-sm rounded-2xl shadow-lg transition-all transform hover:scale-105 cursor-pointer flex items-center gap-2"
            >
              <span>✍️ Đăng Ký Bút Danh Tác Giả</span>
              <span>→</span>
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs sm:text-sm font-bold">
          {/* Tab Tác phẩm chỉ có khi là Tác giả */}
          {isAuthor && (
            <button
              type="button"
              onClick={() => setActiveTab("works")}
              className={`px-4 py-3 rounded-t-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === "works"
                  ? "text-blue-600 border-b-2 border-blue-600 font-black bg-blue-50/50"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <span>📚 Tác phẩm đã phát hành</span>
              <span className="px-1.5 py-0.2 bg-blue-100 text-blue-700 text-[10px] rounded-full">4</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab("library")}
            className={`px-4 py-3 rounded-t-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "library"
                ? "text-blue-600 border-b-2 border-blue-600 font-black bg-blue-50/50"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <span>📖 Tủ sách cá nhân</span>
            <span className="px-1.5 py-0.2 bg-slate-200 text-slate-700 text-[10px] rounded-full">32</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`px-4 py-3 rounded-t-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "history"
                ? "text-blue-600 border-b-2 border-blue-600 font-black bg-blue-50/50"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <span>🕒 Lịch sử đọc truyện</span>
            <span className="px-1.5 py-0.2 bg-slate-200 text-slate-700 text-[10px] rounded-full">12</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("forum")}
            className={`px-4 py-3 rounded-t-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "forum"
                ? "text-blue-600 border-b-2 border-blue-600 font-black bg-blue-50/50"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <span>💬 Bài viết diễn đàn</span>
            <span className="px-1.5 py-0.2 bg-slate-200 text-slate-700 text-[10px] rounded-full">18</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("badges")}
            className={`px-4 py-3 rounded-t-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "badges"
                ? "text-blue-600 border-b-2 border-blue-600 font-black bg-blue-50/50"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <span>🏅 Huy hiệu vinh danh</span>
            <span className="px-1.5 py-0.2 bg-slate-200 text-slate-700 text-[10px] rounded-full">12</span>
          </button>
        </div>

        {/* 2 Columns Layout: Left Content & Right Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ==================== LEFT COLUMN (8 cols) ==================== */}
          <div className="lg:col-span-8 space-y-8">
            {/* Nếu là Tác giả & Tab works: Hiển thị tác phẩm tiêu biểu */}
            {isAuthor && activeTab === "works" && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-lg text-slate-900 tracking-tight">
                    Tác phẩm tiêu biểu &amp; Đang phát hành
                  </h3>
                  <a href="#" className="text-xs font-bold text-blue-600 hover:underline">
                    Xem lịch sử xuất bản ›
                  </a>
                </div>

                {/* Featured Book */}
                <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row gap-5">
                    <div className="relative w-36 h-48 rounded-2xl overflow-hidden shadow-md shrink-0 bg-slate-900">
                      <img
                        src={PROFILE_AUTHOR_WORKS.featured.cover}
                        alt={PROFILE_AUTHOR_WORKS.featured.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 bg-blue-600 text-white font-bold text-[9px] px-2 py-0.5 rounded">
                        {PROFILE_AUTHOR_WORKS.featured.badge}
                      </span>
                      <span className="absolute bottom-2 left-2 bg-slate-900/90 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                        Tiên Hiệp
                      </span>
                    </div>

                    <div className="space-y-2.5 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="text-xl font-black text-slate-900">
                          {PROFILE_AUTHOR_WORKS.featured.title}
                        </h4>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
                          {PROFILE_AUTHOR_WORKS.featured.rankBadge}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="text-amber-500 font-bold">
                          ★ {PROFILE_AUTHOR_WORKS.featured.rating}
                        </span>
                        <span>•</span>
                        <span>{PROFILE_AUTHOR_WORKS.featured.latestChapter}</span>
                        <span>•</span>
                        <span className="text-slate-400">{PROFILE_AUTHOR_WORKS.featured.updatedAt}</span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {PROFILE_AUTHOR_WORKS.featured.synopsis}
                      </p>

                      {/* Stats 3 columns */}
                      <div className="grid grid-cols-3 bg-slate-50 rounded-2xl p-3 text-center text-xs">
                        <div>
                          <div className="font-black text-slate-900 text-base">
                            {PROFILE_AUTHOR_WORKS.featured.stats.chapters}
                          </div>
                          <div className="text-[10px] text-slate-400">Số chương</div>
                        </div>
                        <div>
                          <div className="font-black text-slate-900 text-base">
                            {PROFILE_AUTHOR_WORKS.featured.stats.words}
                          </div>
                          <div className="text-[10px] text-slate-400">Tổng chữ</div>
                        </div>
                        <div>
                          <div className="font-black text-slate-900 text-base">
                            {PROFILE_AUTHOR_WORKS.featured.stats.reads}
                          </div>
                          <div className="text-[10px] text-slate-400">Lượt đọc</div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setSuccessMsg("Mở giao diện viết tiếp Chương mới...")}
                          className="bg-[#1d72fe] hover:bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
                        >
                          Viết tiếp chương mới
                        </button>
                        <button
                          type="button"
                          onClick={() => setSuccessMsg("Hiển thị báo cáo thống kê chi tiết")}
                          className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 transition-all cursor-pointer"
                        >
                          Thống kê chi tiết
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Sub-works list */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                    {PROFILE_AUTHOR_WORKS.subWorks.map((book, idx) => (
                      <div
                        key={idx}
                        className="flex gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-100 hover:bg-white hover:border-slate-200 transition-all"
                      >
                        <div className="relative w-16 h-22 rounded-xl overflow-hidden shrink-0 shadow-2xs">
                          <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                          <span className="absolute top-1 left-1 bg-slate-900/90 text-white text-[8px] font-bold px-1 rounded">
                            {book.status}
                          </span>
                        </div>
                        <div className="flex-1 flex flex-col justify-between overflow-hidden">
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-bold text-blue-600">{book.genre}</span>
                              <span className="text-[9px] text-slate-400">{book.chapters}</span>
                            </div>
                            <h5 className="font-bold text-xs text-slate-900 truncate mt-0.5">{book.title}</h5>
                            <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">{book.desc}</p>
                          </div>
                          <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-100">
                            <span className="text-amber-500 font-bold">★ {book.rating}</span>
                            <span className="text-blue-600 font-bold hover:underline cursor-pointer">Quản lý ›</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Section: Đang theo dõi & Tủ sách cá nhân */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold text-base">📖</span>
                  <h3 className="font-black text-base text-slate-900">
                    Đang theo dõi &amp; Đọc gần đây
                  </h3>
                </div>
                <span className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">
                  Tủ sách của tôi (32 tác phẩm)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PROFILE_AUTHOR_WORKS.readingHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white rounded-2xl border border-slate-100 shadow-2xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900">{item.title}</h4>
                      <span className="text-[10px] text-slate-400">{item.progress}</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all"
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Tiến độ: {item.percent}%</span>
                      <button
                        type="button"
                        onClick={() => setSuccessMsg(`Tiếp tục đọc ${item.title}...`)}
                        className="text-blue-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <span>Đọc tiếp</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section: Huy hiệu & Thành tựu */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold text-base">🏆</span>
                  <h3 className="font-black text-base text-slate-900">
                    Huy hiệu &amp; Thành tựu vinh danh
                  </h3>
                </div>
                <span className="text-xs font-medium text-slate-400">12/20 đã đạt</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {PROFILE_AUTHOR_WORKS.achievements.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-white rounded-2xl border border-slate-100 shadow-2xs text-center space-y-1.5"
                  >
                    <div className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center text-lg ${item.color}`}>
                      {item.icon}
                    </div>
                    <h5 className="font-bold text-xs text-slate-900">{item.title}</h5>
                    <p className="text-[10px] text-slate-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ==================== RIGHT COLUMN (4 cols) ==================== */}
          <div className="lg:col-span-4 space-y-6">
            {/* Widget 1: Nhuận bút & Linh Thạch (CHỈ DÀNH CHO TÁC GIẢ) */}
            {isAuthor && (
              <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-500">💰</span>
                    <h4 className="font-black text-sm text-slate-900">Nhuận bút &amp; Linh Thạch</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                    Tháng này
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">
                    ƯỚC TÍNH DOANH THU THÁNG NÀY
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900">
                      14.850.000 <span className="text-sm font-bold text-slate-500">VNĐ</span>
                    </span>
                    <span className="text-xs font-bold text-emerald-600">↑ 16.2%</span>
                  </div>
                </div>

                {/* Sparkline Graphic wave */}
                <div className="h-10 w-full flex items-end justify-between px-1 pt-2">
                  {[20, 35, 30, 45, 40, 60, 55, 70, 65, 85, 95].map((h, i) => (
                    <div
                      key={i}
                      className="w-2 bg-blue-500/30 rounded-t-xs hover:bg-blue-600 transition-colors"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Số dư Linh Thạch: <b className="text-slate-900">84.200 LT</b></span>
                  <span className="text-[10px] text-slate-400">Đã duyệt</span>
                </div>

                <button
                  type="button"
                  onClick={handleWithdrawRequest}
                  className="w-full py-3 bg-[#1d72fe] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>💳 Yêu cầu rút nhuận bút</span>
                </button>
              </div>
            )}

            {/* Widget 1 Alternative: Túi Đồ & Điểm Tích Lũy (CHO ĐỘC GIẢ THƯỜNG) */}
            {isReader && (
              <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-500">💎</span>
                    <h4 className="font-black text-sm text-slate-900">Túi Đồ &amp; Tài Sản</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                    Ví Độc Giả
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-slate-50 rounded-2xl space-y-1">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Linh Thạch</div>
                    <div className="text-lg font-black text-blue-600">1.200 LT</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl space-y-1">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Phiếu Đề Cử</div>
                    <div className="text-lg font-black text-amber-600">15 Vé</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsUpgradeAuthorOpen(true)}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>✍️ Nâng cấp trở thành Tác giả</span>
                </button>
              </div>
            )}

            {/* Widget 2: Tùy chỉnh đọc truyện nhanh */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>⚙️</span>
                  <h4 className="font-black text-sm text-slate-900">Tùy chỉnh đọc truyện nhanh</h4>
                </div>
                <span className="text-[10px] text-slate-400">Đồng bộ</span>
              </div>

              {/* Theme selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600">Giao diện đọc</label>
                <div className="grid grid-cols-4 gap-1.5 text-xs text-center font-bold">
                  <button
                    type="button"
                    onClick={() => setReadingTheme("light")}
                    className={`py-2 rounded-xl border transition-all cursor-pointer ${
                      readingTheme === "light"
                        ? "bg-white border-blue-600 text-blue-600 shadow-xs"
                        : "bg-white border-slate-200 text-slate-700"
                    }`}
                  >
                    Sáng
                  </button>
                  <button
                    type="button"
                    onClick={() => setReadingTheme("sepia")}
                    className={`py-2 rounded-xl border transition-all cursor-pointer ${
                      readingTheme === "sepia"
                        ? "bg-[#fbf0d9] border-amber-600 text-amber-900 font-black shadow-xs"
                        : "bg-[#fbf0d9] border-amber-200 text-amber-800"
                    }`}
                  >
                    Giấy cũ
                  </button>
                  <button
                    type="button"
                    onClick={() => setReadingTheme("green")}
                    className={`py-2 rounded-xl border transition-all cursor-pointer ${
                      readingTheme === "green"
                        ? "bg-[#e8f5e9] border-emerald-600 text-emerald-900 font-black shadow-xs"
                        : "bg-[#e8f5e9] border-emerald-200 text-emerald-800"
                    }`}
                  >
                    Dịu mắt
                  </button>
                  <button
                    type="button"
                    onClick={() => setReadingTheme("dark")}
                    className={`py-2 rounded-xl border transition-all cursor-pointer ${
                      readingTheme === "dark"
                        ? "bg-slate-950 border-blue-500 text-white font-black shadow-xs"
                        : "bg-slate-900 border-slate-800 text-slate-200"
                    }`}
                  >
                    Đêm đen
                  </button>
                </div>
              </div>

              {/* Font size slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-600 font-bold">
                  <span>Cỡ chữ mặc định</span>
                  <span className="text-blue-600">{fontSize}px (Chuẩn)</span>
                </div>
                <input
                  type="range"
                  min={14}
                  max={26}
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>14px</span>
                  <span>18px (Chuẩn)</span>
                  <span>26px</span>
                </div>
              </div>

              {/* Font family selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600">Phông chữ hiển thị</label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium outline-none focus:bg-white focus:border-blue-500"
                >
                  <option>Be Vietnam Pro (Hiện đại)</option>
                  <option>Merriweather (Cổ điển có chân)</option>
                  <option>Roboto (Rõ ràng dễ đọc)</option>
                  <option>Nunito (Mềm mại)</option>
                </select>
              </div>
            </div>

            {/* Widget 3: Hỗ trợ thành viên */}
            <div className="rounded-3xl bg-blue-600 p-5 text-white flex items-center gap-4 shadow-lg shadow-blue-500/20">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl shrink-0">
                🎧
              </div>
              <div className="space-y-0.5">
                <h5 className="font-black text-xs sm:text-sm">Trung tâm trợ giúp StoryVN</h5>
                <p className="text-[11px] text-blue-100">
                  Hỗ trợ giải đáp thắc mắc tác quyền &amp; độc giả 24/7.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ==================== 5. MODALS ==================== */}
      {/* Modal Chỉnh Sửa Thông Tin Người Dùng */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        user={user}
        onClose={() => setIsEditProfileOpen(false)}
        onSuccess={handleProfileUpdated}
      />

      {/* Modal Đổi Mật Khẩu */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        onSuccess={() => {
          setIsChangePasswordOpen(false);
          setSuccessMsg("Đổi mật khẩu thành công!");
          setTimeout(() => setSuccessMsg(null), 4000);
        }}
      />

      {/* Modal Nâng Cấp Tác Giả */}
      <UpgradeAuthorModal
        isOpen={isUpgradeAuthorOpen}
        currentUser={user}
        onClose={() => setIsUpgradeAuthorOpen(false)}
        onSuccess={(updated) => {
          setUserOverride(updated);
          refreshUserProfile();
          setSuccessMsg("Chúc mừng bạn đã nâng cấp thành công lên Tác giả StoryVN!");
          setTimeout(() => setSuccessMsg(null), 5000);
        }}
      />

      {/* Modal Đăng Xuất */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        defaultMode={logoutModalMode}
        onClose={() => setIsLogoutModalOpen(false)}
        onSuccess={() => {
          setUserOverride(null);
          setIsLogoutModalOpen(false);
          router.push("/");
        }}
      />

      {/* Footer */}
      <ClientFooter />
    </div>
  );
}
