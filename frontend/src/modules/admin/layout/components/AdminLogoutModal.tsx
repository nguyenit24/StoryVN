"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface AdminLogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminLogoutModal({ isOpen, onClose }: AdminLogoutModalProps) {
  const { logout } = useAuth();
  const router = useRouter();

  if (!isOpen) return null;

  const handleConfirmLogout = async () => {
    try {
      await logout();
      toast.success("Đã đăng xuất khỏi cổng Quản trị!");
      onClose();
      router.push("/login");
    } catch {
      toast.error("Đã xảy ra lỗi khi đăng xuất!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[22px]">logout</span>
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-slate-900 text-base">Xác nhận đăng xuất</h3>
            <span className="text-xs text-slate-500">
              Bạn có chắc chắn muốn rời khỏi phiên quản trị StoryVN?
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
          Các tác vụ chưa hoàn thành hoặc biểu mẫu chưa lưu sẽ không được ghi nhận. Bạn sẽ cần đăng nhập lại với quyền Admin hoặc Manager để truy cập.
        </p>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleConfirmLogout}
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-all"
          >
            Đăng xuất ngay
          </button>
        </div>
      </div>
    </div>
  );
}
