"use client";

import React from "react";
import { SystemUserItem } from "../models/user.model";
import ModalPortal from "@/common/components/ModalPortal";

interface UserDetailModalProps {
  user: SystemUserItem | null;
  isOpen: boolean;
  onClose: () => void;
  onChangeRoleClick: (user: SystemUserItem) => void;
  onToggleStatusClick: (userId: string, currentStatus: boolean) => void;
}

export default function UserDetailModal({
  user,
  isOpen,
  onClose,
  onChangeRoleClick,
  onToggleStatusClick,
}: UserDetailModalProps) {
  if (!isOpen || !user) return null;

  const isLocked = !user.isActive;

  const getRoleBadgeDisplay = () => {
    switch (user.role) {
      case "ADMIN":
        return { name: "Admin (Quản trị)", badgeClass: "bg-slate-900 text-white" };
      case "MANAGER":
        return { name: "Manager (Kiểm duyệt)", badgeClass: "bg-amber-100 text-amber-900 border border-amber-200" };
      case "AUTHOR":
        return { name: "Tác Giả (Sáng tác)", badgeClass: "bg-blue-50 text-blue-700 border border-blue-200" };
      case "USER":
      default:
        return { name: "Độc Giả (Bạn đọc)", badgeClass: "bg-slate-100 text-slate-700 border border-slate-200" };
    }
  };

  const roleInfo = getRoleBadgeDisplay();

  return (
    <ModalPortal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 flex flex-col gap-4 animate-modalPop relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.displayName}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs aspect-square"
              />
              <span
                className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                  isLocked ? "bg-rose-500" : "bg-emerald-500"
                }`}
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-bold text-slate-900 text-base">{user.displayName}</h3>
                {user.penName && (
                  <span className="text-xs font-semibold text-blue-600">({user.penName})</span>
                )}
              </div>
              <span className="text-xs text-slate-400 font-mono">
                @{user.username}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Roles & Status Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${roleInfo.badgeClass}`}>
            {roleInfo.name}
          </span>

          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              isLocked
                ? "bg-rose-50 text-rose-700 border border-rose-200"
                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
            }`}
          >
            {isLocked ? "Tạm khóa" : "Đang hoạt động"}
          </span>
        </div>

        {/* Info Grid directly mapped to MongoDB fields */}
        <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Mã định danh (ID):</span>
            <span className="font-mono text-slate-800 font-medium truncate block">{user.id}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Email liên hệ:</span>
            <span className="text-slate-800 font-medium truncate block">{user.email}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Ngày đăng ký:</span>
            <span className="text-slate-800 font-medium">{user.joinedDate}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Hoạt động gần nhất:</span>
            <span className="text-slate-800 font-medium">{user.lastLogin}</span>
          </div>
        </div>

        {/* Social Links if available */}
        {user.socialLinks && (user.socialLinks.facebook || user.socialLinks.twitter) && (
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-400 font-medium">Mạng xã hội:</span>
            {user.socialLinks.facebook && (
              <a
                href={user.socialLinks.facebook}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>Facebook</span>
              </a>
            )}
            {user.socialLinks.twitter && (
              <a
                href={user.socialLinks.twitter}
                target="_blank"
                rel="noreferrer"
                className="text-sky-500 hover:underline flex items-center gap-1"
              >
                <span>Twitter / X</span>
              </a>
            )}
          </div>
        )}

        {/* Bio */}
        {user.bio && (
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Tiểu sử:
            </span>
            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed italic">
              &ldquo;{user.bio}&rdquo;
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => onToggleStatusClick(user.id, user.isActive)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              user.isActive
                ? "bg-rose-50 text-rose-700 hover:bg-rose-100"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {user.isActive ? "lock" : "lock_open"}
            </span>
            <span>{user.isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onChangeRoleClick(user);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-2xs flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">manage_accounts</span>
              <span>Đổi vai trò</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
