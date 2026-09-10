"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

interface ManagerHeaderProps {
  onToggleMobileSidebar: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function ManagerHeader({
  onToggleMobileSidebar,
  isCollapsed,
  onToggleCollapse,
}: ManagerHeaderProps) {
  const { user } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

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
    toast("Bạn không có thông báo mới nào.", {
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
    if (user?.displayName) {
      const parts = user.displayName.trim().split(" ");
      return parts[parts.length - 1].charAt(0).toUpperCase();
    }
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return "M";
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4 transition-all">
      {/* Left items: Mobile toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Mở thanh điều hướng"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title={isCollapsed ? "Mở rộng menu" : "Thu gọn menu"}
          >
            <span className="material-symbols-outlined text-[22px]">
              {isCollapsed ? "menu_open" : "menu"}
            </span>
          </button>
        )}

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            Manager Portal
          </span>
        </div>
      </div>

      {/* Right items: Quick actions & Profile */}
      <div className="flex items-center gap-3">
        {/* View Main Site */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Xem trang độc giả ngoài trang chủ"
        >
          <span className="material-symbols-outlined text-[18px]">open_in_new</span>
          <span>Xem web</span>
        </Link>

        {/* Notifications */}
        <button
          type="button"
          onClick={handleNotificationClick}
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Thông báo"
        >
          <span className="material-symbols-outlined text-[22px]">notifications</span>
        </button>

        <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

        {/* Profile Dropdown */}
        <div className="relative" ref={profileMenuRef}>
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white font-bold text-sm flex items-center justify-center shadow-xs">
              {getUserInitials()}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 leading-tight">
                {user?.displayName || user?.username || "Manager"}
              </span>
              <span className="text-[11px] font-medium text-indigo-600">
                Quản lý nội dung
              </span>
            </div>
            <span className="material-symbols-outlined text-slate-400 text-[18px] hidden md:block">
              expand_more
            </span>
          </button>

          {/* Profile Menu Popover */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fadeIn">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {user?.displayName || user?.username}
                </p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
              </div>

              <div className="py-1">
                <Link
                  href="/ho-so"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-slate-400">person</span>
                  <span>Hồ sơ cá nhân</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
