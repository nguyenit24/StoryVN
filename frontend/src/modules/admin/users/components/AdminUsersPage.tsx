"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useAdminUsers } from "../hooks/useAdminUsers";
import { SystemUserItem } from "../models/user.model";
import { User } from "@/modules/client/auth/models/auth.model";
import { AuthDrawer } from "@/modules/client/auth/components/AuthDrawer";
import { getFullImageUrl } from "@/common/utils/imageUrl";

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const {
    filteredUsers,
    paginatedUsers,
    totalPages,
    currentPage,
    setCurrentPage,
    pageSize,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    totalCount,
    userRoleCount,
    authorRoleCount,
    adminRoleCount,
    activeCount,
    isUsingMock,
    handleRoleChange,
    handleToggleStatus,
    refetch,
    isLoading,
  } = useAdminUsers(8);

  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register" | "forgot-password">("login");

  // Selected User Modal State
  const [selectedUser, setSelectedUser] = useState<SystemUserItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const getUserRole = (u: User | null): string => {
    if (!u) return "";
    if (typeof u.roleId === "object" && u.roleId?.name) {
      return u.roleId.name.toUpperCase();
    }
    return (u.role || "").toUpperCase();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
      {/* ==================== 1. TOP ADMIN HEADER ==================== */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#1d72fe] flex items-center justify-center text-white shadow-md shadow-blue-500/30">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black tracking-tight text-white">StoryVN</span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-black">
                    ADMIN PORTAL
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">Trang Quản Trị Hệ Thống &amp; Danh Sách User</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {currentUser && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs">
                <img
                  src={getFullImageUrl(currentUser.avatar) || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"}
                  alt={currentUser.displayName || currentUser.username}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span className="font-bold text-slate-200">{currentUser.displayName || currentUser.username}</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {getUserRole(currentUser) || "ADMIN"}
                </span>
              </div>
            )}

            <Link
              href="/"
              className="text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl border border-slate-700 transition-colors"
            >
              ← Về Trang Chủ
            </Link>

            <Link
              href="/me"
              className="text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 rounded-xl shadow-md transition-colors"
            >
              Hồ Sơ Cá Nhân
            </Link>
          </div>
        </div>
      </header>

      {/* ==================== 2. MAIN CONTENT ==================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6 flex-1 w-full">
        {/* Banner thông báo chế độ dữ liệu */}
        {isUsingMock && (
          <div className="p-4 bg-purple-950/50 border border-purple-500/40 rounded-2xl text-xs text-purple-200 flex items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">💡</span>
              <span>
                <b>Chế độ Quản Trị Trực Quan:</b> Đang hiển thị danh sách người dùng mẫu ({totalCount} tài khoản) để bạn kiểm thử toàn diện giao diện &amp; tính năng. Khi bạn thêm dữ liệu thực tế vào database, hệ thống sẽ tự động hiển thị dữ liệu thực.
              </span>
            </div>
            <button
              type="button"
              onClick={refetch}
              disabled={isLoading}
              className="shrink-0 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              {isLoading ? "Đang thử lại..." : "Thử kết nối lại DB"}
            </button>
          </div>
        )}

        {/* Header Title & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Quản Lý Người Dùng (User Management)
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Xem, phân quyền và quản lý tài khoản Độc giả (USER), Tác giả (AUTHOR) và Quản trị viên (ADMIN).
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={refetch}
              disabled={isLoading}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>🔄</span>
              <span>{isLoading ? "Đang đồng bộ..." : "Đồng bộ Backend"}</span>
            </button>
          </div>
        </div>

        {/* 5 Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          {/* Card 1: Tổng Người Dùng */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              TỔNG NGƯỜI DÙNG
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{totalCount}</span>
              <span className="text-[10px] text-emerald-400 font-bold">100%</span>
            </div>
            <div className="text-[10px] text-slate-500">Tất cả tài khoản hệ thống</div>
          </div>

          {/* Card 2: Độc giả (USER) */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-1">
            <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1">
              <span>👤</span> ĐỘC GIẢ (USER)
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-blue-400">{userRoleCount}</span>
              <span className="text-[10px] text-slate-400">
                {totalCount > 0 ? Math.round((userRoleCount / totalCount) * 100) : 0}%
              </span>
            </div>
            <div className="text-[10px] text-slate-500">Đọc truyện &amp; theo dõi</div>
          </div>

          {/* Card 3: Tác giả (AUTHOR) */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-1">
            <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
              <span>✍️</span> TÁC GIẢ (AUTHOR)
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-purple-400">{authorRoleCount}</span>
              <span className="text-[10px] text-slate-400">
                {totalCount > 0 ? Math.round((authorRoleCount / totalCount) * 100) : 0}%
              </span>
            </div>
            <div className="text-[10px] text-slate-500">Sáng tác &amp; xuất bản</div>
          </div>

          {/* Card 4: Quản trị viên (ADMIN) */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-1">
            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <span>🛡️</span> QUẢN TRỊ (ADMIN)
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-400">{adminRoleCount}</span>
              <span className="text-[10px] text-slate-400">
                {totalCount > 0 ? Math.round((adminRoleCount / totalCount) * 100) : 0}%
              </span>
            </div>
            <div className="text-[10px] text-slate-500">Toàn quyền hệ thống</div>
          </div>

          {/* Card 5: Tỷ lệ hoạt động */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-1 col-span-2 sm:col-span-1">
            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <span>⚡</span> HOẠT ĐỘNG
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-400">
                {totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 100}%
              </span>
              <span className="text-[10px] text-slate-400">({activeCount}/{totalCount})</span>
            </div>
            <div className="text-[10px] text-slate-500">Tài khoản khả dụng</div>
          </div>
        </div>

        {/* ==================== 3. SEARCH & FILTERS BAR ==================== */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                🔍
              </span>
              <input
                type="text"
                placeholder="Tìm theo tên hiển thị, username, email, bút danh..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm rounded-xl pl-9 pr-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Tabs for 3 Roles */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-700 text-xs w-full sm:w-auto overflow-x-auto">
              <button
                type="button"
                onClick={() => {
                  setRoleFilter("ALL");
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                  roleFilter === "ALL"
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Tất cả ({totalCount})
              </button>
              <button
                type="button"
                onClick={() => {
                  setRoleFilter("USER");
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                  roleFilter === "USER"
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Độc giả ({userRoleCount})
              </button>
              <button
                type="button"
                onClick={() => {
                  setRoleFilter("AUTHOR");
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                  roleFilter === "AUTHOR"
                    ? "bg-purple-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Tác giả ({authorRoleCount})
              </button>
              <button
                type="button"
                onClick={() => {
                  setRoleFilter("ADMIN");
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                  roleFilter === "ADMIN"
                    ? "bg-emerald-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Admin ({adminRoleCount})
              </button>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 text-xs shrink-0">
              <span className="text-slate-400 font-medium">Trạng thái:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as "ALL" | "ACTIVE" | "INACTIVE");
                  setCurrentPage(1);
                }}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="ACTIVE">Đang hoạt động</option>
                <option value="INACTIVE">Đã khóa</option>
              </select>
            </div>
          </div>

          {/* ==================== 4. USER MANAGEMENT TABLE ==================== */}
          <div className="border border-slate-700/80 rounded-2xl overflow-hidden bg-slate-950/70">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-900/90 text-slate-400 font-bold border-b border-slate-800 text-[11px] uppercase tracking-wider">
                    <th className="py-3.5 px-4 w-12">#</th>
                    <th className="py-3.5 px-4">Người dùng</th>
                    <th className="py-3.5 px-4">Email &amp; Trạng thái</th>
                    <th className="py-3.5 px-4">Vai trò (Role)</th>
                    <th className="py-3.5 px-4">Khả dụng</th>
                    <th className="py-3.5 px-4 hidden md:table-cell">Tham gia</th>
                    <th className="py-3.5 px-4 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-medium">
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((u, idx) => (
                      <tr key={u.id} className="hover:bg-slate-800/50 transition-colors">
                        {/* Index */}
                        <td className="py-3.5 px-4 text-slate-500 font-mono text-xs">
                          {(currentPage - 1) * pageSize + idx + 1}
                        </td>

                        {/* User Identity */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                              <img
                                src={u.avatar}
                                alt={u.displayName}
                                className="w-10 h-10 rounded-full object-cover border border-slate-700"
                              />
                              <span
                                className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-slate-950 ${
                                  u.isActive ? "bg-emerald-500" : "bg-red-500"
                                }`}
                              />
                            </div>
                            <div>
                              <div className="font-bold text-slate-100 text-sm flex items-center gap-1.5">
                                <span>{u.displayName}</span>
                                {u.penName && (
                                  <span className="text-[10px] text-purple-400 font-normal">
                                    (Bút danh: {u.penName})
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono">
                                @{u.username} • <span className="text-slate-500">{u.id}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="py-3.5 px-4 text-slate-300">
                          <div className="truncate max-w-[180px] font-mono text-xs">
                            {u.email}
                          </div>
                          <div className="mt-0.5">
                            {u.isEmailVerified ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                                <span>✓</span> Đã kích hoạt
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400">
                                <span>!</span> Chưa kích hoạt
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Role Selector */}
                        <td className="py-3.5 px-4">
                          <select
                            value={u.role}
                            onChange={(e) =>
                              handleRoleChange(u.id, e.target.value as "USER" | "AUTHOR" | "ADMIN")
                            }
                            className={`text-xs font-bold rounded-lg px-2.5 py-1 border outline-none cursor-pointer ${
                              u.role === "ADMIN"
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                : u.role === "AUTHOR"
                                ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                                : "bg-blue-500/20 text-blue-300 border-blue-500/40"
                            }`}
                          >
                            <option value="USER" className="bg-slate-900 text-white">
                              👤 Độc giả (USER)
                            </option>
                            <option value="AUTHOR" className="bg-slate-900 text-white">
                              ✍️ Tác giả (AUTHOR)
                            </option>
                            <option value="ADMIN" className="bg-slate-900 text-white">
                              🛡️ Quản trị viên (ADMIN)
                            </option>
                          </select>
                        </td>

                        {/* Status Toggle */}
                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(u.id, u.isActive)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
                              u.isActive
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                                : "bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20"
                            }`}
                          >
                            {u.isActive ? "● Hoạt động" : "✕ Đã khóa"}
                          </button>
                        </td>

                        {/* Joined Date */}
                        <td className="py-3.5 px-4 hidden md:table-cell text-slate-400 font-mono text-xs">
                          {u.joinedDate}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedUser(u);
                                setIsDetailModalOpen(true);
                              }}
                              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                              title="Xem chi tiết hồ sơ"
                            >
                              Chi tiết
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleStatus(u.id, u.isActive)}
                              className={`p-1.5 rounded-lg border text-xs cursor-pointer ${
                                u.isActive
                                  ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                                  : "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                              }`}
                              title={u.isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                            >
                              {u.isActive ? "🔒" : "🔓"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-slate-500 text-xs">
                        Không tìm thấy người dùng nào phù hợp với bộ lọc hiện tại.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div>
                  Hiển thị {(currentPage - 1) * pageSize + 1} -{" "}
                  {Math.min(currentPage * pageSize, filteredUsers.length)} trong tổng số{" "}
                  {filteredUsers.length} người dùng
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-700 cursor-pointer"
                  >
                    ← Trước
                  </button>
                  <span className="px-3 py-1.5 font-bold text-white bg-slate-800 rounded-lg">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-700 cursor-pointer"
                  >
                    Sau →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ==================== 5. USER DETAIL MODAL ==================== */}
      {isDetailModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div
            className="fixed inset-0"
            onClick={() => setIsDetailModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-slate-200 z-10 space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.displayName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-700"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-white">
                      {selectedUser.displayName}
                    </h3>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        selectedUser.role === "ADMIN"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : selectedUser.role === "AUTHOR"
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      }`}
                    >
                      {selectedUser.role}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    @{selectedUser.username}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
              <div>
                <span className="text-slate-500 block">Địa chỉ Email:</span>
                <span className="text-slate-200 font-mono font-medium truncate block">
                  {selectedUser.email}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Mã định danh ID:</span>
                <span className="text-slate-200 font-mono font-medium truncate block">
                  {selectedUser.id}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Bút danh tác giả:</span>
                <span className="text-purple-300 font-bold">
                  {selectedUser.penName || "Chưa đăng ký bút danh"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Trạng thái:</span>
                <span
                  className={`font-bold ${
                    selectedUser.isActive ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {selectedUser.isActive ? "Đang hoạt động" : "Tài khoản bị khóa"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Ngày tham gia:</span>
                <span className="text-slate-300">{selectedUser.joinedDate}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Đăng nhập gần nhất:</span>
                <span className="text-slate-300">{selectedUser.lastLogin}</span>
              </div>
            </div>

            {selectedUser.bio && (
              <div className="space-y-1 text-xs">
                <span className="text-slate-500 font-bold block">Tiểu sử cá nhân:</span>
                <p className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 text-slate-300 leading-relaxed italic">
                  &ldquo;{selectedUser.bio}&rdquo;
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  handleToggleStatus(selectedUser.id, selectedUser.isActive);
                  setIsDetailModalOpen(false);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  selectedUser.isActive
                    ? "border-red-500/40 text-red-400 hover:bg-red-500/10"
                    : "border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
                }`}
              >
                {selectedUser.isActive ? "🔒 Khóa tài khoản" : "🔓 Mở khóa tài khoản"}
              </button>

              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal if needed */}
      <AuthDrawer
        isOpen={isAuthModalOpen}
        mode={authMode}
        onSwitchMode={setAuthMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          refetch();
          setIsAuthModalOpen(false);
        }}
      />
    </div>
  );
}
