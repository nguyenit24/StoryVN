"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/modules/client/auth/services/auth.service";
import { clearAuth } from "@/common/utils/token";
import { Button } from "@/common/components/Button";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "current" | "all";
  onSuccess?: () => void;
}

interface LogoutConfirmDialogProps {
  defaultMode: "current" | "all";
  onClose: () => void;
  onSuccess?: () => void;
}

const LogoutConfirmDialog: React.FC<LogoutConfirmDialogProps> = ({
  defaultMode,
  onClose,
  onSuccess,
}) => {
  const router = useRouter();
  const { logout } = useAuth();
  const [mode, setMode] = useState<"current" | "all">(defaultMode);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmLogout = async () => {
    setIsLoading(true);
    try {
      if (mode === "current") {
        // Chức năng 1: Gửi refreshToken hiện tại để backend chỉ blacklist thiết bị này
        await authApi.logoutCurrentSession();
        toast.success("Đã đăng xuất khỏi thiết bị này!");
      } else {
        // Chức năng 2: Không gửi refreshToken (payload {}) để backend tăng tokenVersion, thu hồi tất cả thiết bị
        await authApi.logoutAllSessions();
        toast.success("Đã đăng xuất khỏi tất cả các thiết bị thành công!");
      }
    } catch (err) {
      console.warn("Lỗi khi gọi API đăng xuất:", err);
    } finally {
      logout();
      setIsLoading(false);
      onSuccess?.();
      onClose();
      router.push("/dang-nhap");
    }
  };

  return (
    <div
      className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Modal Header */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-lg font-bold border border-red-100">
            🚪
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-800">
              Xác nhận đăng xuất
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Vui lòng chọn phạm vi đăng xuất tài khoản StoryVN
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Đóng"
        >
          ✕
        </button>
      </div>

      {/* Modal Content / Options */}
      <div className="p-6 space-y-4">
        <p className="text-xs sm:text-sm text-slate-600">
          Bạn muốn đăng xuất khỏi riêng trình duyệt này hay muốn kết thúc phiên trên tất cả các thiết bị khác?
        </p>

        <div className="space-y-3">
          {/* OPTION 1: CHỈ THIẾT BỊ NÀY */}
          <div
            onClick={() => setMode("current")}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
              mode === "current"
                ? "border-blue-500 bg-blue-50/40 shadow-sm"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            <input
              type="radio"
              name="logoutMode"
              checked={mode === "current"}
              onChange={() => setMode("current")}
              className="mt-1 w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-800">
                  Đăng xuất thiết bị này
                </span>
                <span className="text-[11px] font-semibold text-blue-600 bg-blue-100/70 px-2 py-0.5 rounded-full">
                  Phiên hiện tại
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Chỉ đóng phiên đăng nhập trên trình duyệt này. Các thiết bị khác (điện thoại, máy tính bảng) của bạn vẫn duy trì đăng nhập bình thường.
              </p>
            </div>
          </div>

          {/* OPTION 2: TẤT CẢ THIẾT BỊ */}
          <div
            onClick={() => setMode("all")}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
              mode === "all"
                ? "border-red-500 bg-red-50/40 shadow-sm"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            <input
              type="radio"
              name="logoutMode"
              checked={mode === "all"}
              onChange={() => setMode("all")}
              className="mt-1 w-4 h-4 text-red-600 border-slate-300 focus:ring-red-500 cursor-pointer"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-800">
                  Đăng xuất tất cả thiết bị
                </span>
                <span className="text-[11px] font-semibold text-red-600 bg-red-100/70 px-2 py-0.5 rounded-full">
                  Bảo mật tối đa
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Thu hồi toàn bộ token đăng nhập trên tất cả máy tính, điện thoại. Bạn sẽ phải đăng nhập lại từ đầu trên mọi thiết bị. Thích hợp khi bạn vừa dùng máy công cộng hoặc nghi ngờ tài khoản bị lộ.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Actions */}
      <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={onClose}
          disabled={isLoading}
        >
          Hủy bỏ
        </Button>
        <Button
          type="button"
          variant={mode === "all" ? "danger" : "primary"}
          size="md"
          isLoading={isLoading}
          onClick={handleConfirmLogout}
        >
          {mode === "all" ? "Đăng xuất tất cả" : "Đăng xuất thiết bị này"}
        </Button>
      </div>
    </div>
  );
};

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  onClose,
  defaultMode = "current",
  onSuccess,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <LogoutConfirmDialog
        key={defaultMode}
        defaultMode={defaultMode}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    </div>
  );
};
