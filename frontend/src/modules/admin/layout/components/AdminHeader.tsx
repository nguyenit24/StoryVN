"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

interface AdminHeaderProps {
  onToggleMobileSidebar: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function AdminHeader({
  onToggleMobileSidebar,
  isCollapsed,
  onToggleCollapse,
}: AdminHeaderProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut: Ctrl + K / Cmd + K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Outside click to close profile menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = () => {
    toast("Có 14 yêu cầu kiểm duyệt và phản ánh đang chờ xử lý!", {
      icon: "🔔",
      style: {
        background: "#0f172a",
        color: "#ffffff",
        borderRadius: "10px",
        fontSize: "13px",
      },
    });
  };

  const getUserInitials = () => {
    if (!user) return "AD";
    const name = user.displayName || user.username || "Admin";
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getRoleBadge = () => {
    if (!user) return "ADMIN";
    const rawRole = (
      typeof user.roleId === "object" && user.roleId?.name
        ? user.roleId.name
        : user.role || "ADMIN"
    ).toUpperCase();

    if (rawRole === "ADMIN") return "ADMIN";
    if (rawRole === "MANAGER") return "MANAGER";
    if (rawRole === "AUTHOR") return "TÁC GIẢ";
    return "ĐỘC GIẢ";
  };

  const displayName = user?.displayName || user?.username || "Admin Superuser";
  const displayEmail = user?.email || "admin@storyvn.vn";

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between">
      {/* Search bar & Mobile menu toggle */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-lg">
        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
          title="Mở menu điều hướng"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>

        {/* Desktop sidebar collapse toggle button */}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors items-center justify-center"
            title={isCollapsed ? "Mở rộng thanh menu" : "Thu gọn thanh menu chỉ còn icon"}
          >
            <span className="material-symbols-outlined text-[22px]">
              {isCollapsed ? "menu" : "menu_open"}
            </span>
          </button>
        )}

        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none">
            search
          </span>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm tác phẩm, tác giả, mã giao dịch..."
            className="w-full pl-9 pr-14 py-2 bg-slate-100 border-none rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
          />
          <kbd className="hidden sm:inline-flex absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-white border border-slate-200 rounded shadow-xs select-none">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Quick Actions & Profile */}
      <div className="flex items-center gap-3 sm:gap-4">

        {/* Go to Website Button */}
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">open_in_new</span>
          <span className="hidden sm:inline">Về trang chủ StoryVN</span>
        </Link>

        {/* Notification Icon */}
        <button
          type="button"
          onClick={handleNotificationClick}
          className="relative p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
          title="Thông báo hệ thống"
        >
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="h-6 w-px bg-slate-200 mx-1"></div>

        {/* User Profile Dropdown info */}
        <div className="relative" ref={profileMenuRef}>
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            className="flex items-center gap-3 p-1 rounded-lg hover:bg-slate-100 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-semibold text-xs flex items-center justify-center">
              {getUserInitials()}
            </div>
            <div className="hidden lg:flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-slate-800 leading-tight">
                  {displayName}
                </span>
                <span className="px-1 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">
                  {getRoleBadge()}
                </span>
              </div>
              <span className="text-xs text-slate-400 leading-none">{displayEmail}</span>
            </div>
          </button>

          {/* Profile Dropdown */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-200 p-1.5 z-50 animate-fadeIn">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-semibold text-slate-800 truncate">{displayName}</p>
                <p className="text-[11px] text-slate-400 truncate">{displayEmail}</p>
              </div>

              <Link
                href="/me"
                onClick={() => setIsProfileMenuOpen(false)}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined text-[17px] text-slate-400">person</span>
                <span>Hồ sơ cá nhân</span>
              </Link>

              <Link
                href="/admin/users"
                onClick={() => setIsProfileMenuOpen(false)}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined text-[17px] text-slate-400">group</span>
                <span>Quản lý người dùng</span>
              </Link>

              <div className="border-t border-slate-100 my-1"></div>

              <Link
                href="/"
                onClick={() => setIsProfileMenuOpen(false)}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined text-[17px] text-slate-400">home</span>
                <span>Về trang chủ</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
