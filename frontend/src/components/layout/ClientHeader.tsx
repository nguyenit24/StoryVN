"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AuthDrawer, AuthMode } from "@/modules/client/auth/components/AuthDrawer";
import { LogoutConfirmModal } from "@/modules/client/profile/components/LogoutConfirmModal";
import { User } from "@/types/auth";

export interface ClientHeaderProps {
  user?: User | null;
  onLogout?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onOpenAuth?: (mode: "login" | "register") => void;
}

const getUserInitials = (user: User | null | undefined): string => {
  if (!user) return "SVN";
  if (user.displayName) return user.displayName.slice(0, 2).toUpperCase();
  if (user.username) return user.username.slice(0, 2).toUpperCase();
  return "SVN";
};

export const ClientHeader: React.FC<ClientHeaderProps> = ({
  user: propUser,
  onLogout: propOnLogout,
  searchQuery: externalSearchQuery,
  onSearchChange: externalOnSearchChange,
  onOpenAuth: externalOnOpenAuth,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user: authUser, logout } = useAuth();
  const user = propUser !== undefined ? propUser : authUser;

  // Search state
  const [internalQuery, setInternalQuery] = useState("");
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalQuery;

  // Menu & Auth modal states
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  // Check if user is Admin or Manager
  const isAdminOrManager =
    user?.role === "ADMIN" ||
    user?.role === "MANAGER" ||
    (user as unknown as { roles?: string[] })?.roles?.includes("ADMIN") ||
    (user as unknown as { roles?: string[] })?.roles?.includes("MANAGER");

  const handleSearchChange = (val: string) => {
    if (externalOnSearchChange) {
      externalOnSearchChange(val);
    } else {
      setInternalQuery(val);
    }
  };

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      if (pathname !== "/") {
        router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      }
    }
  };

  const handleLoginClick = () => {
    if (externalOnOpenAuth) {
      externalOnOpenAuth("login");
    } else {
      setAuthMode("login");
      setIsAuthOpen(true);
    }
  };

  const isHomeActive = pathname === "/";
  const isForumActive = pathname?.startsWith("/dien-dan") || pathname?.startsWith("/forum");

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">
          {/* Left side: Brand & Desktop Navigation */}
          <div className="flex items-center gap-3 sm:gap-6 xl:gap-8 shrink-0">
            {/* Mobile hamburger menu toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 -ml-1 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Mở menu điều hướng"
            >
              <span className="material-symbols-outlined text-[24px]">
                {isMobileMenuOpen ? "close" : "menu"}
              </span>
            </button>

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 text-slate-900 font-bold text-xl sm:text-2xl tracking-tight shrink-0 whitespace-nowrap group"
            >
              <img
                src="/logo.png"
                alt="StoryVN Logo"
                className="w-9 h-9 object-contain shrink-0 group-hover:scale-105 transition-transform"
              />
              <span className="whitespace-nowrap">
                Story<span className="text-blue-600">VN</span>
              </span>
            </Link>

            {/* Desktop Nav Links (No Tủ sách) */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-sm font-medium text-slate-600 shrink-0">
              <Link
                href="/"
                className={`transition-colors whitespace-nowrap shrink-0 ${
                  isHomeActive ? "text-blue-600 font-semibold" : "hover:text-blue-600"
                }`}
              >
                Khám phá
              </Link>
              <Link
                href="/#the-loai"
                className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0"
              >
                Thể loại
              </Link>
              <Link
                href="/#bang-xep-hang"
                className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0"
              >
                Bảng xếp hạng
              </Link>
              <Link
                href="/dien-dan"
                className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                  isForumActive ? "text-blue-600 font-semibold" : "hover:text-blue-600"
                }`}
              >
                <span>Diễn đàn</span>
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-pulse shrink-0"></span>
              </Link>

              {/* Admin Quản Trị link */}
              {isAdminOrManager && (
                <Link
                  href="/admin"
                  className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md text-xs font-semibold hover:bg-emerald-100 transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    admin_panel_settings
                  </span>
                  <span>Admin Quản Trị</span>
                </Link>
              )}
            </nav>
          </div>

          {/* Right side: Search, Write button & Auth Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Search bar with keyboard shortcut (Desktop & Tablet) */}
            <div className="relative hidden md:block w-40 sm:w-48 lg:w-60 xl:w-72 transition-all">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <span className="material-symbols-outlined text-[18px]">search</span>
              </div>
              <input
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={handleSearchSubmit}
                className="w-full pl-9 pr-12 lg:pr-14 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs sm:text-sm rounded-full border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 text-slate-800 placeholder-slate-400 transition-all outline-none"
                placeholder="Tìm kiếm truyện, tác giả..."
                type="text"
              />
              <div className="absolute inset-y-0 right-0 pr-3 hidden lg:flex items-center pointer-events-none">
                <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 rounded shadow-2xs whitespace-nowrap">
                  Ctrl K
                </kbd>
              </div>
            </div>

            {/* Write Button */}
            <Link
              href="/ho-so"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-full transition-all active:scale-95 whitespace-nowrap shrink-0"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span className="whitespace-nowrap">Viết truyện</span>
            </Link>

            {/* User Profile / Single Login Button */}
            <div className="flex items-center relative shrink-0">
              {user ? (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-slate-200 transition-all cursor-pointer"
                    type="button"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-red-500 p-0.5 flex items-center justify-center shadow-xs">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        {getUserInitials(user)}
                      </span>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fadeIn">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {user.displayName || user.username}
                        </p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-50 text-blue-700">
                          {user.role || "ĐỘC GIẢ"}
                        </span>
                      </div>

                      <Link
                        href="/ho-so"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px] text-slate-400">
                          person
                        </span>
                        <span>Hồ sơ & Tủ sách</span>
                      </Link>

                      {isAdminOrManager && (
                        <Link
                          href="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px] text-emerald-600">
                            admin_panel_settings
                          </span>
                          <span>Trang Quản Trị Hệ Thống</span>
                        </Link>
                      )}

                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            if (propOnLogout) {
                              propOnLogout();
                            } else {
                              setIsLogoutModalOpen(true);
                            }
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">logout</span>
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Single Login button pressed to the right */
                <button
                  type="button"
                  onClick={handleLoginClick}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/20 transition-all active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Đăng nhập
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Drawer Navigation (Responsive) */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-md px-4 pt-3 pb-5 space-y-3 shadow-lg animate-fadeIn">
            {/* Mobile Search input */}
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <span className="material-symbols-outlined text-[18px]">search</span>
              </div>
              <input
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={handleSearchSubmit}
                className="w-full pl-9 pr-4 py-2 bg-slate-100 text-sm rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 text-slate-800 placeholder-slate-400 outline-none"
                placeholder="Tìm kiếm truyện, tác giả..."
                type="text"
              />
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col space-y-1 text-sm font-medium text-slate-700">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg hover:bg-slate-50 ${
                  isHomeActive ? "text-blue-600 font-semibold" : ""
                }`}
              >
                Khám phá
              </Link>
              <Link
                href="/#the-loai"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-50"
              >
                Thể loại
              </Link>
              <Link
                href="/#bang-xep-hang"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-50"
              >
                Bảng xếp hạng
              </Link>
              <Link
                href="/dien-dan"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between ${
                  isForumActive ? "text-blue-600 font-semibold" : ""
                }`}
              >
                <span>Diễn đàn</span>
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-pulse"></span>
              </Link>

              {isAdminOrManager && (
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 font-semibold flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    admin_panel_settings
                  </span>
                  <span>Admin Quản Trị Hệ Thống</span>
                </Link>
              )}

              <Link
                href="/ho-so"
                onClick={() => setIsMobileMenuOpen(false)}
                className="sm:hidden px-3 py-2 rounded-lg bg-blue-50 text-blue-600 font-semibold flex items-center gap-1.5 mt-2"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Viết truyện</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Internal Auth & Logout modals if opened directly */}
      {!externalOnOpenAuth && (
        <AuthDrawer
          isOpen={isAuthOpen}
          mode={authMode}
          onClose={() => setIsAuthOpen(false)}
          onSwitchMode={(mode) => setAuthMode(mode)}
          onSuccess={() => {
            setIsAuthOpen(false);
            router.refresh();
          }}
        />
      )}

      {!propOnLogout && (
        <LogoutConfirmModal
          isOpen={isLogoutModalOpen}
          defaultMode="current"
          onClose={() => setIsLogoutModalOpen(false)}
          onSuccess={() => {
            logout();
            setIsLogoutModalOpen(false);
            router.refresh();
          }}
        />
      )}
    </>
  );
};
