"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/modules/client/auth/models/auth.model";
import { AppRole } from "@/modules/client/story/mockStories";
import { EditProfileModal } from "./EditProfileModal";
import { ChangePasswordModal } from "./ChangePasswordModal";
import { LogoutConfirmModal } from "./LogoutConfirmModal";
import { UpgradeAuthorModal } from "./UpgradeAuthorModal";
import { ProfileCoverBanner } from "./ProfileCoverBanner";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileTabs } from "./ProfileTabs";
import { ProfileAuthorWorks } from "./ProfileAuthorWorks";
import { ProfileReadingSection } from "./ProfileReadingSection";
import { ProfileSidebar } from "./ProfileSidebar";
import { ClientHeader } from "@/components/layout/ClientHeader";
import { ClientFooter } from "@/components/layout/ClientFooter";

type TabKey = "works" | "library" | "history" | "forum" | "badges";

export default function ProfilePage() {
  const router = useRouter();
  const { user: authUser, refreshUserProfile, isLoading, isAuthenticated } = useAuth();
  const [userOverride, setUserOverride] = useState<User | null>(null);
  const user = userOverride ?? authUser;
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<TabKey>("works");
  const [readingTheme, setReadingTheme] = useState<"light" | "sepia" | "green" | "dark">("light");
  const [fontSize, setFontSize] = useState<number>(18);
  const [fontFamily, setFontFamily] = useState<string>("Be Vietnam Pro (Hiện đại)");

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isUpgradeAuthorOpen, setIsUpgradeAuthorOpen] = useState(false);
  const [logoutModalMode] = useState<"current" | "all">("current");

  const currentRole = (
    typeof user?.roleId === "object" && user?.roleId?.name
      ? user.roleId.name
      : user?.role || "USER"
  ).toUpperCase() as AppRole;

  const isAuthor = currentRole === "AUTHOR";
  const isAdmin = currentRole === "ADMIN";
  const isReader = !isAuthor && !isAdmin;

  const displayName =
    (isAuthor && user?.authorProfile?.penName) ||
    user?.displayName ||
    user?.username ||
    "Độc giả StoryVN";

  const rawId = user?._id || user?.id || "";
  const displayId = rawId ? rawId.slice(-6).toUpperCase() : "ST0001";

  const displayBio =
    user?.bio ||
    (isAuthor
      ? "Tác giả độc quyền tại StoryVN • Chưa cập nhật lời giới thiệu sáng tác."
      : "Độc giả đồng hành cùng StoryVN • Chưa cập nhật tiểu sử.");

  const joinedDateStr = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("vi-VN")
    : "Gần đây";

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleProfileUpdated = (updatedUser: User) => {
    setUserOverride(updatedUser);
    refreshUserProfile();
    showSuccess("Cập nhật thông tin hồ sơ thành công!");
  };

  const handleWithdrawRequest = () => {
    showSuccess("Đã gửi yêu cầu rút 14.850.000 VNĐ về tài khoản ngân hàng của bạn!");
  };

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      router.replace("/dang-nhap?redirect=/ho-so");
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
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mx-auto shadow-sm">🔒</div>
          <h2 className="text-xl font-black text-slate-800">Yêu cầu đăng nhập</h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Bạn cần đăng nhập tài khoản StoryVN để xem và quản lý hồ sơ cá nhân, tủ sách và lịch sử đọc truyện.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link href="/" className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
              Về trang chủ
            </Link>
            <Link href="/dang-nhap?redirect=/ho-so" className="px-5 py-2.5 rounded-xl bg-blue-600 text-xs sm:text-sm font-bold text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all">
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between">
      <ClientHeader />

      {successMsg && (
        <div className="fixed top-16 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-bold animate-fadeIn flex items-center gap-2">
          <span>✓</span>
          <span>{successMsg}</span>
        </div>
      )}

      {/* Cover Banner (Author only) */}
      {isAuthor && (
        <ProfileCoverBanner
          coverImage={user?.authorProfile?.coverImage}
          onEditCover={() => setIsEditProfileOpen(true)}
        />
      )}

      {/* Profile Header Card */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-8 relative z-10 w-full ${isAuthor ? "-mt-20 sm:-mt-24" : "pt-8"}`}>
        <ProfileHeader
          user={user}
          displayName={displayName}
          displayBio={displayBio}
          displayId={displayId}
          joinedDateStr={joinedDateStr}
          currentRole={currentRole}
          isAuthor={isAuthor}
          isAdmin={isAdmin}
          isReader={isReader}
          onEditProfile={() => setIsEditProfileOpen(true)}
          onChangePassword={() => setIsChangePasswordOpen(true)}
          onUpgradeAuthor={() => setIsUpgradeAuthorOpen(true)}
          onAuthorAction={showSuccess}
        />
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 flex-1 w-full">
        {/* Upgrade banner (Reader only) */}
        {isReader && (
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-orange-500/15 flex flex-col md:flex-row items-center justify-between gap-6 animate-fadeIn">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-md">
                <span>✨</span>
                <span>Cơ hội trở thành Tác giả độc quyền StoryVN</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">Bạn có niềm đam mê sáng tác văn học kỳ ảo?</h3>
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

        <ProfileTabs activeTab={activeTab} isAuthor={isAuthor} onTabChange={setActiveTab} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-8">
            {isAuthor && activeTab === "works" && (
              <ProfileAuthorWorks onAction={showSuccess} />
            )}
            <ProfileReadingSection onAction={showSuccess} />
          </div>

          {/* Right Column (Sidebar) */}
          <ProfileSidebar
            isAuthor={isAuthor}
            isReader={isReader}
            readingTheme={readingTheme}
            fontSize={fontSize}
            fontFamily={fontFamily}
            onThemeChange={setReadingTheme}
            onFontSizeChange={setFontSize}
            onFontFamilyChange={setFontFamily}
            onWithdraw={handleWithdrawRequest}
            onUpgradeAuthor={() => setIsUpgradeAuthorOpen(true)}
          />
        </div>
      </main>

      {/* Modals */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        user={user}
        onClose={() => setIsEditProfileOpen(false)}
        onSuccess={handleProfileUpdated}
      />

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        onSuccess={() => {
          setIsChangePasswordOpen(false);
          showSuccess("Đổi mật khẩu thành công!");
        }}
      />

      <UpgradeAuthorModal
        isOpen={isUpgradeAuthorOpen}
        currentUser={user}
        onClose={() => setIsUpgradeAuthorOpen(false)}
        onSuccess={(updated) => {
          setUserOverride(updated);
          refreshUserProfile();
          showSuccess("Chúc mừng bạn đã nâng cấp thành công lên Tác giả StoryVN!");
        }}
      />

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

      <ClientFooter />
    </div>
  );
}
