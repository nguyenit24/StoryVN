"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import ModalPortal from "@/common/components/ModalPortal";

interface ManagerLogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ManagerLogoutModal({
  isOpen,
  onClose,
}: ManagerLogoutModalProps) {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!isOpen) return null;

  const handleConfirmLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      toast.success("Đã đăng xuất khỏi Manager Portal thành công!");
      onClose();
    } catch {
      toast.error("Đã xảy ra lỗi khi đăng xuất!");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <ModalPortal isOpen={isOpen} onClose={isLoggingOut ? undefined : onClose}>
      <div
        className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-modalPop relative z-10"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-[28px]">logout</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Xác nhận đăng xuất
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Bạn có chắc chắn muốn đăng xuất khỏi cổng Quản lý nội dung StoryVN?
          </p>
        </div>

        <div className="px-6 pb-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoggingOut}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleConfirmLogout}
            disabled={isLoggingOut}
            className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
          >
            {isLoggingOut && (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            <span>{isLoggingOut ? "Đang xử lý..." : "Đăng xuất"}</span>
          </button>
        </div>
      </div>
    </ModalPortal>
  );
}
