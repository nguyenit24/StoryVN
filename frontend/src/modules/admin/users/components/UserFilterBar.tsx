"use client";

import React from "react";
import { AdminUserRole, AdminUserStatus } from "../models/user.model";

interface UserFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  roleFilter: AdminUserRole;
  onRoleFilterChange: (role: AdminUserRole) => void;
  statusFilter: AdminUserStatus;
  onStatusFilterChange: (status: AdminUserStatus) => void;
  isMaskedPrivacy: boolean;
  onTogglePrivacy: () => void;
  totalCount: number;
}

export default function UserFilterBar({
  searchQuery,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
  isMaskedPrivacy,
  onTogglePrivacy,
  totalCount,
}: UserFilterBarProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col gap-3.5">
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Search bar */}
        <div className="sm:col-span-6 relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[19px] pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm theo Tên hiển thị, Username, Bút danh, Email..."
            className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600/20 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              title="Xóa tìm kiếm"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Role Dropdown: 4 roles only! */}
        <div className="sm:col-span-3">
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => onRoleFilterChange(e.target.value as AdminUserRole)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2 pl-3 pr-8 rounded-lg text-xs font-medium outline-none cursor-pointer focus:border-blue-600 focus:bg-white transition-all"
            >
              <option value="ALL">Tất cả vai trò</option>
              <option value="USER">Độc Giả</option>
              <option value="AUTHOR">Tác Giả</option>
              <option value="MANAGER">Manager (Kiểm duyệt)</option>
              <option value="ADMIN">Admin (Quản trị)</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[18px]">
              expand_more
            </span>
          </div>
        </div>

        {/* Status Dropdown */}
        <div className="sm:col-span-3">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value as AdminUserStatus)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2 pl-3 pr-8 rounded-lg text-xs font-medium outline-none cursor-pointer focus:border-blue-600 focus:bg-white transition-all"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="ACTIVE">Đang hoạt động</option>
              <option value="LOCKED">Tạm khóa tài khoản</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[18px]">
              expand_more
            </span>
          </div>
        </div>
      </div>

      {/* Quick tags & Privacy mask toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-medium text-slate-400 mr-1">Lọc nhanh:</span>
          <button
            type="button"
            onClick={() => {
              onRoleFilterChange("ALL");
              onStatusFilterChange("ALL");
            }}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors shadow-2xs ${
              roleFilter === "ALL" && statusFilter === "ALL"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Tất cả ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => {
              onRoleFilterChange("USER");
              onStatusFilterChange("ALL");
            }}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              roleFilter === "USER"
                ? "bg-blue-600 text-white font-semibold shadow-2xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Độc Giả
          </button>
          <button
            type="button"
            onClick={() => {
              onRoleFilterChange("AUTHOR");
              onStatusFilterChange("ALL");
            }}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              roleFilter === "AUTHOR"
                ? "bg-emerald-600 text-white font-semibold shadow-2xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Tác Giả
          </button>
          <button
            type="button"
            onClick={() => {
              onRoleFilterChange("ADMIN");
              onStatusFilterChange("ALL");
            }}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              roleFilter === "ADMIN"
                ? "bg-purple-600 text-white font-semibold shadow-2xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Ban Quản Trị
          </button>
          <button
            type="button"
            onClick={() => {
              onRoleFilterChange("ALL");
              onStatusFilterChange("LOCKED");
            }}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              statusFilter === "LOCKED"
                ? "bg-rose-600 text-white font-semibold shadow-2xs"
                : "bg-rose-50 hover:bg-rose-100 text-rose-700"
            }`}
          >
            Tài khoản tạm khóa
          </button>
        </div>

        {/* Privacy toggle button */}
        <button
          type="button"
          onClick={onTogglePrivacy}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-[11px] font-medium transition-colors"
        >
          <span className="material-symbols-outlined text-[15px] text-slate-500">
            {isMaskedPrivacy ? "visibility" : "visibility_off"}
          </span>
          <span>{isMaskedPrivacy ? "Hiện đầy đủ email" : "Ẩn email nhạy cảm"}</span>
        </button>
      </div>
    </div>
  );
}
