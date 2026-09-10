"use client";

import React, { useState } from "react";
import { SystemUserItem } from "../models/user.model";
import UserDetailModal from "./UserDetailModal";
import ChangeRoleModal from "./ChangeRoleModal";

interface UsersTableProps {
  users: SystemUserItem[];
  selectedUserIds: string[];
  onSelectUser: (userId: string) => void;
  onSelectAll: (checked: boolean) => void;
  isMaskedPrivacy: boolean;
  totalFilteredCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onRoleChange: (userId: string, newRole: "USER" | "AUTHOR" | "ADMIN" | "MANAGER") => void;
  onToggleStatus: (userId: string, currentStatus: boolean) => void;
}

export default function UsersTable({
  users,
  selectedUserIds,
  onSelectUser,
  onSelectAll,
  isMaskedPrivacy,
  totalFilteredCount,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onRoleChange,
  onToggleStatus,
}: UsersTableProps) {
  // Modal states
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<SystemUserItem | null>(null);
  const [selectedUserForRole, setSelectedUserForRole] = useState<SystemUserItem | null>(null);

  if (users.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-xs">
        <span className="material-symbols-outlined text-slate-300 text-5xl mb-3 block">
          search_off
        </span>
        <h3 className="font-bold text-slate-800 text-sm">Không tìm thấy tài khoản nào</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Vui lòng thử thay đổi từ khóa tìm kiếm hoặc chọn lại các tiêu chí lọc vai trò/trạng thái.
        </p>
      </div>
    );
  }

  const allSelected = users.length > 0 && users.every((u) => selectedUserIds.includes(u.id));
  const startEntry = (currentPage - 1) * pageSize + 1;
  const endEntry = Math.min(currentPage * pageSize, totalFilteredCount);

  const maskEmail = (email: string) => {
    if (!isMaskedPrivacy) return email;
    return email.replace(/(.{3})(.*)(@.*)/, "$1****$3");
  };

  const getRoleBadge = (role: "USER" | "AUTHOR" | "ADMIN" | "MANAGER") => {
    switch (role) {
      case "ADMIN":
        return {
          label: "Admin",
          badgeClass: "bg-slate-900 text-white font-semibold",
          dotClass: "bg-purple-400",
        };
      case "MANAGER":
        return {
          label: "Manager",
          badgeClass: "bg-amber-100 text-amber-900 font-semibold border border-amber-200",
          dotClass: "bg-amber-500",
        };
      case "AUTHOR":
        return {
          label: "Tác Giả",
          badgeClass: "bg-blue-50 text-blue-700 font-semibold border border-blue-200",
          dotClass: "bg-blue-500",
        };
      case "USER":
      default:
        return {
          label: "Độc Giả",
          badgeClass: "bg-slate-100 text-slate-700 font-medium border border-slate-200",
          dotClass: "bg-slate-400",
        };
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-[11.5px] font-semibold uppercase tracking-wider">
              <th className="py-3 px-4 w-10 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer w-3.5 h-3.5"
                />
              </th>
              <th className="py-3 px-3 w-12 text-center">STT</th>
              <th className="py-3 px-4">Người dùng &amp; Bút danh</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Vai trò</th>
              <th className="py-3 px-4">Ngày tham gia</th>
              <th className="py-3 px-4">Đăng nhập cuối</th>
              <th className="py-3 px-4">Trạng thái</th>
              <th className="py-3 px-4 text-right">Thao tác nhanh</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
            {users.map((u, index) => {
              const stt = (currentPage - 1) * pageSize + index + 1;
              const isSelected = selectedUserIds.includes(u.id);
              const isLocked = !u.isActive;
              const roleInfo = getRoleBadge(u.role);

              return (
                <tr
                  key={u.id}
                  className={`transition-colors ${
                    isLocked
                      ? "bg-rose-50/20 hover:bg-rose-50/40"
                      : "hover:bg-slate-50/70"
                  }`}
                >
                  {/* Checkbox */}
                  <td className="py-3.5 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onSelectUser(u.id)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer w-3.5 h-3.5"
                    />
                  </td>

                  {/* STT */}
                  <td className="py-3.5 px-3 text-center font-mono text-xs text-slate-400 font-semibold">
                    {stt}
                  </td>

                  {/* User & Pen name */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        <img
                          src={u.avatar}
                          alt={u.displayName}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-2xs aspect-square"
                        />
                        <span
                          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                            isLocked ? "bg-rose-500" : "bg-emerald-500"
                          }`}
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`font-semibold text-[13px] ${
                              isLocked ? "text-slate-500 line-through" : "text-slate-900"
                            }`}
                          >
                            {u.displayName}
                          </span>

                          {u.penName && (
                            <span className="font-medium text-xs text-blue-600">
                              ({u.penName})
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          @{u.username}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="py-3.5 px-4 font-mono text-slate-700 whitespace-nowrap">
                    {maskEmail(u.email)}
                  </td>

                  {/* Role (4 roles only) */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] ${roleInfo.badgeClass}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${roleInfo.dotClass}`}></span>
                      {roleInfo.label}
                    </span>
                  </td>

                  {/* Joined Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-700">
                    {u.joinedDate}
                  </td>

                  {/* Last Login */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                    {u.lastLogin}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {isLocked ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[11px] font-semibold border border-rose-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        Tạm khóa
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-medium border border-emerald-200/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Đang hoạt động
                      </span>
                    )}
                  </td>

                  {/* Quick actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedUserForDetail(u)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors inline-flex items-center gap-1"
                        title="Xem chi tiết tài khoản"
                      >
                        <span className="material-symbols-outlined text-[15px]">visibility</span>
                        <span>Chi tiết</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedUserForRole(u)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Đổi vai trò phân quyền"
                      >
                        <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onToggleStatus(u.id, u.isActive)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          u.isActive
                            ? "text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            : "text-rose-600 hover:text-emerald-600 hover:bg-emerald-50"
                        }`}
                        title={u.isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {u.isActive ? "lock" : "lock_open"}
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 bg-slate-50/70 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          Hiển thị <span className="font-semibold text-slate-800">{startEntry}</span> -{" "}
          <span className="font-semibold text-slate-800">{endEntry}</span> trên tổng số{" "}
          <span className="font-semibold text-slate-800">{totalFilteredCount}</span> tài khoản
        </div>

        {/* Pagination buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-600 transition-colors"
            title="Trang trước"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                currentPage === pageNum
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-600 transition-colors"
            title="Trang tiếp theo"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Detail Modal */}
      <UserDetailModal
        user={selectedUserForDetail}
        isOpen={!!selectedUserForDetail}
        onClose={() => setSelectedUserForDetail(null)}
        onChangeRoleClick={(user) => {
          setSelectedUserForDetail(null);
          setSelectedUserForRole(user);
        }}
        onToggleStatusClick={(userId, status) => {
          onToggleStatus(userId, status);
          setSelectedUserForDetail((prev) => (prev ? { ...prev, isActive: !status } : null));
        }}
      />

      {/* Change Role Modal */}
      <ChangeRoleModal
        user={selectedUserForRole}
        isOpen={!!selectedUserForRole}
        onClose={() => setSelectedUserForRole(null)}
        onConfirm={(userId, newRole) => {
          onRoleChange(userId, newRole);
          setSelectedUserForRole(null);
        }}
      />
    </div>
  );
}
