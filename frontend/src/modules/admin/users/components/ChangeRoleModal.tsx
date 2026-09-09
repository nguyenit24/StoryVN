"use client";

import React, { useState } from "react";
import { SystemUserItem } from "../models/user.model";

interface ChangeRoleModalProps {
  user: SystemUserItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (userId: string, newRole: "USER" | "AUTHOR" | "ADMIN" | "MANAGER") => void;
}

const FOUR_ROLES: {
  role: "USER" | "AUTHOR" | "ADMIN" | "MANAGER";
  name: string;
  badge: string;
  badgeClass: string;
  desc: string;
  icon: string;
}[] = [
  {
    role: "USER",
    name: "Độc Giả",
    badge: "Thành viên",
    badgeClass: "bg-blue-50 text-blue-700 border border-blue-200",
    desc: "Quyền đọc truyện miễn phí & VIP, nạp xu mua chương, lưu tủ sách và thảo luận trên diễn đàn.",
    icon: "menu_book",
  },
  {
    role: "AUTHOR",
    name: "Tác Giả",
    badge: "Sáng tác & Tác quyền",
    badgeClass: "bg-amber-50 text-amber-800 border border-amber-200",
    desc: "Có studio sáng tác, đăng tải tác phẩm mới, xuất bản chương truyện và yêu cầu rút nhuận bút.",
    icon: "edit_note",
  },
  {
    role: "MANAGER",
    name: "Manager (Kiểm duyệt viên)",
    badge: "Điều hành",
    badgeClass: "bg-slate-100 text-slate-800 border border-slate-300",
    desc: "Quyền duyệt truyện mới, kiểm tra bản quyền, xử lý báo cáo diễn đàn và điều hành cộng đồng.",
    icon: "gavel",
  },
  {
    role: "ADMIN",
    name: "Admin (Quản trị viên)",
    badge: "ROOT",
    badgeClass: "bg-slate-900 text-white",
    desc: "Toàn quyền quản trị hệ sinh thái: phân quyền người dùng, cấu hình tỷ giá và quản lý tài chính.",
    icon: "admin_panel_settings",
  },
];

export default function ChangeRoleModal({
  user,
  isOpen,
  onClose,
  onConfirm,
}: ChangeRoleModalProps) {
  const [selectedRole, setSelectedRole] = useState<"USER" | "AUTHOR" | "ADMIN" | "MANAGER">(
    user?.role || "USER"
  );

  if (!isOpen || !user) return null;

  const handleSave = () => {
    onConfirm(user.id, selectedRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[22px]">security</span>
            </div>
            <div className="flex flex-col">
              <h3 className="font-bold text-slate-900 text-base">Phân quyền tài khoản</h3>
              <p className="text-xs text-slate-500">
                Thay đổi vai trò cho <span className="font-semibold text-slate-900">{user.displayName}</span> ({user.email})
              </p>
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

        {/* 4 Roles list */}
        <div className="flex flex-col gap-2.5">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Chọn 1 trong 4 vai trò hệ thống:
          </p>
          {FOUR_ROLES.map((item) => {
            const isSelected = selectedRole === item.role;
            return (
              <div
                key={item.role}
                onClick={() => setSelectedRole(item.role)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  isSelected
                    ? "bg-blue-50/70 border-blue-600 shadow-xs ring-1 ring-blue-600/30"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900">{item.name}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${item.badgeClass}`}>
                        {item.badge}
                      </span>
                    </div>
                    <input
                      type="radio"
                      name="adminRoleOption"
                      checked={isSelected}
                      onChange={() => setSelectedRole(item.role)}
                      className="text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all"
          >
            Lưu thay đổi vai trò
          </button>
        </div>
      </div>
    </div>
  );
}
