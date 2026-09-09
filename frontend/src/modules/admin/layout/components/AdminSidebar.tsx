"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminLogoutModal from "./AdminLogoutModal";

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string | number;
  badgeColor?: string;
  isExact?: boolean;
}

const MAIN_NAV_ITEMS: NavItem[] = [
  {
    label: "Tổng quan",
    href: "/admin",
    icon: "dashboard",
    isExact: true,
  },
  {
    label: "Quản lý tác phẩm",
    href: "/admin/stories",
    icon: "auto_stories",
    badge: 9,
    badgeColor: "bg-red-100 text-red-700",
  },
  {
    label: "Quản lý người dùng",
    href: "/admin/users",
    icon: "group",
    badge: "382.9k",
    badgeColor: "text-slate-400 font-medium",
  },
  {
    label: "Doanh thu & Nạp Xu",
    href: "/admin/finance",
    icon: "payments",
  },
  {
    label: "Diễn đàn & Cộng đồng",
    href: "/admin/forum",
    icon: "forum",
  },
];

const SYSTEM_NAV_ITEMS: NavItem[] = [
  {
    label: "Cấu hình & Tỷ giá",
    href: "/admin/settings",
    icon: "tune",
  },
  {
    label: "Cài đặt bảo mật",
    href: "/admin/security",
    icon: "settings",
  },
];

interface AdminSidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function AdminSidebar({
  isMobileOpen,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const isItemActive = (item: NavItem) => {
    if (item.isExact || item.href === "/admin") {
      return pathname === "/admin";
    }
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Aside container: co giãn linh hoạt w-64 khi mở và w-20 khi thu gọn chỉ còn icon */}
      <aside
        className={`fixed inset-y-0 left-0 bg-white border-r border-slate-200 z-40 flex flex-col justify-between transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-20" : "w-64"
        } ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Header */}
          <div
            className={`h-16 flex items-center border-b border-slate-100 transition-all duration-300 ${
              isCollapsed ? "px-0 justify-center" : "px-5 justify-between"
            }`}
          >
            <Link
              href="/admin"
              className={`flex items-center gap-3 group ${isCollapsed ? "justify-center" : ""}`}
              title="StoryVN Admin Portal"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
                S
              </div>
              {!isCollapsed && (
                <div className="flex flex-col overflow-hidden whitespace-nowrap">
                  <span className="font-bold text-slate-900 text-base leading-tight">StoryVN</span>
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                    Admin Portal
                  </span>
                </div>
              )}
            </Link>

            {/* Desktop toggle collapse icon inside sidebar header (when expanded) */}
            {!isCollapsed && onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Thu gọn menu chỉ còn icon"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
            )}

            {/* Mobile close button */}
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Đóng thanh điều hướng"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Navigation Menu */}
          <div
            className={`flex-1 px-3 py-4 space-y-6 ${
              isCollapsed ? "overflow-visible" : "overflow-y-auto"
            }`}
          >
            {/* Main Navigation */}
            <div>
              {!isCollapsed ? (
                <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Điều hướng chính
                </p>
              ) : (
                <div className="w-8 h-px bg-slate-200 mx-auto my-2" />
              )}
              <nav className="space-y-1.5">
                {MAIN_NAV_ITEMS.map((item) => {
                  const active = isItemActive(item);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onCloseMobile}
                      title={item.label}
                      className={`relative flex items-center rounded-xl text-sm transition-all duration-200 group ${
                        isCollapsed
                          ? "w-11 h-11 mx-auto justify-center"
                          : "justify-between px-3 py-2.5"
                      } ${
                        active
                          ? "bg-blue-50 text-blue-700 font-semibold"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium"
                      }`}
                    >
                      <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
                        <span
                          className={`material-symbols-outlined text-[22px] flex-shrink-0 ${
                            active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                          }`}
                        >
                          {item.icon}
                        </span>
                        {!isCollapsed && <span className="truncate">{item.label}</span>}
                      </div>

                      {/* Expanded Badge */}
                      {!isCollapsed && item.badge && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${
                            item.badgeColor || "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}

                      {/* Collapsed dot when badge exists */}
                      {isCollapsed && item.badge && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
                      )}

                      {/* Hover Tooltip in collapsed mode */}
                      {isCollapsed && (
                        <div className="hidden lg:group-hover:flex items-center absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none animate-fadeIn">
                          <span>{item.label}</span>
                          {item.badge && (
                            <span className="ml-1.5 px-1.5 py-0.2 bg-red-500 text-white rounded text-[10px] font-bold">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* System Settings Navigation */}
            <div>
              {!isCollapsed ? (
                <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Hệ thống
                </p>
              ) : (
                <div className="w-8 h-px bg-slate-200 mx-auto my-2" />
              )}
              <nav className="space-y-1.5">
                {SYSTEM_NAV_ITEMS.map((item) => {
                  const active = isItemActive(item);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onCloseMobile}
                      title={item.label}
                      className={`relative flex items-center rounded-xl text-sm transition-all duration-200 group ${
                        isCollapsed
                          ? "w-11 h-11 mx-auto justify-center"
                          : "gap-3 px-3 py-2"
                      } ${
                        active
                          ? "bg-blue-50 text-blue-700 font-semibold"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium"
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-[22px] flex-shrink-0 ${
                          active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                        }`}
                      >
                        {item.icon}
                      </span>
                      {!isCollapsed && <span className="truncate">{item.label}</span>}

                      {/* Hover Tooltip in collapsed mode */}
                      {isCollapsed && (
                        <div className="hidden lg:group-hover:flex items-center absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none animate-fadeIn">
                          <span>{item.label}</span>
                        </div>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Sidebar Footer Logout */}
          <div className="p-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsLogoutModalOpen(true)}
              title="Đăng xuất khỏi hệ thống"
              className={`flex items-center rounded-xl bg-slate-50 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-700 border border-slate-200 text-sm font-medium transition-colors shadow-2xs ${
                isCollapsed
                  ? "w-11 h-11 mx-auto justify-center p-0"
                  : "w-full justify-center gap-2 py-2.5 px-3"
              }`}
            >
              <span className="material-symbols-outlined text-[20px] flex-shrink-0">logout</span>
              {!isCollapsed && <span>Đăng xuất</span>}
            </button>
          </div>
        </div>
      </aside>

      <AdminLogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </>
  );
}
