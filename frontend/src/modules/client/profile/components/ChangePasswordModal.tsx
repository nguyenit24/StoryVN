"use client";

import React, { useState } from "react";
import { ProfileService } from "../services/profile.service";
import { Button } from "@/common/components/Button";
import { Input } from "@/common/components/Input";
import { Alert } from "@/common/components/Alert";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!currentPassword) {
      setError("Vui lòng nhập mật khẩu hiện tại");
      return;
    }

    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    if (newPassword === currentPassword) {
      setError("Mật khẩu mới không được trùng với mật khẩu hiện tại");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Xác nhận mật khẩu mới không trùng khớp");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await ProfileService.changePassword({
        currentPassword,
        newPassword,
      });

      if (res.success) {
        setSuccessMsg(
          res.message ||
            "Đổi mật khẩu thành công! Các phiên đăng nhập trên thiết bị khác đã được thu hồi."
        );
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1500);
      } else {
        setError(res.message || "Không thể đổi mật khẩu.");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Đã có lỗi xảy ra khi đổi mật khẩu. Vui lòng kiểm tra lại mật khẩu hiện tại.";
      setError(message || "Đã có lỗi xảy ra khi đổi mật khẩu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg font-bold border border-amber-100">
              🔑
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-800">
                Đổi mật khẩu
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Bảo vệ tài khoản với mật khẩu mạnh mẽ
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <Alert type="error" message={error} onClose={() => setError(null)} />
          )}
          {successMsg && (
            <Alert
              type="success"
              message={successMsg}
              onClose={() => setSuccessMsg(null)}
            />
          )}

          {/* Current Password */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Mật khẩu hiện tại <span className="text-red-500">*</span>
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          {/* New Password */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <Input
              type="password"
              placeholder="Ít nhất 6 ký tự"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              helperText="Nên bao gồm chữ hoa, chữ thường và số để tăng bảo mật"
              required
            />
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Xác nhận mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <Input
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Security Notice */}
          <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
            <span className="text-sm shrink-0">⚠️</span>
            <span>
              <strong>Lưu ý:</strong> Sau khi đổi mật khẩu thành công, toàn bộ phiên đăng nhập của bạn trên các thiết bị khác sẽ tự động bị thu hồi vì lý do an toàn.
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
            >
              Cập nhật mật khẩu
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
