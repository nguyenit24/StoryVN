"use client";

import React from "react";
import { AuthMode } from "./AuthDrawer";

interface ForgotPasswordFormProps {
  forgotStep: "email" | "reset";
  forgotEmail: string;
  forgotOtp: string;
  forgotNewPassword: string;
  forgotConfirmPassword: string;
  showForgotNewPassword: boolean;
  forgotError: string | null;
  isForgotLoading: boolean;
  onEmailChange: (v: string) => void;
  onOtpChange: (v: string) => void;
  onNewPasswordChange: (v: string) => void;
  onConfirmPasswordChange: (v: string) => void;
  onToggleNewPassword: () => void;
  onEmailSubmit: (e: React.FormEvent) => void;
  onResetSubmit: (e: React.FormEvent) => void;
  onSwitchMode: (mode: AuthMode) => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  forgotStep,
  forgotEmail,
  forgotOtp,
  forgotNewPassword,
  forgotConfirmPassword,
  showForgotNewPassword,
  forgotError,
  isForgotLoading,
  onEmailChange,
  onOtpChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onToggleNewPassword,
  onEmailSubmit,
  onResetSubmit,
  onSwitchMode,
}) => {
  return (
    <div className="w-full my-auto py-2">
      <header className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Khôi phục mật khẩu</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
          {forgotStep === "email"
            ? "Nhập email của bạn để nhận mã khôi phục tài khoản"
            : `Nhập mã xác thực đã gửi tới ${forgotEmail}`}
        </p>
      </header>

      {forgotError && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 text-rose-700 text-xs sm:text-sm font-medium flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
          <span>{forgotError}</span>
        </div>
      )}

      {forgotStep === "email" ? (
        <form onSubmit={onEmailSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Email đăng ký
            </label>
            <div className="relative flex items-center border border-slate-300 hover:border-slate-400 rounded-lg px-3.5 py-2.5 sm:py-3 bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <span className="material-symbols-outlined text-[20px] text-slate-400 mr-2.5 shrink-0">mail</span>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => onEmailChange(e.target.value)}
                placeholder="vd: ban@example.com"
                required
                className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent border-none p-0 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isForgotLoading}
            className="w-full py-3 sm:py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-lg cursor-pointer transition shadow-md shadow-blue-600/20 active:scale-[0.99]"
          >
            {isForgotLoading ? "Đang gửi mã..." : "Gửi mã xác thực"}
          </button>

          <div className="text-center pt-3">
            <button
              type="button"
              onClick={() => onSwitchMode("login")}
              className="text-xs sm:text-sm text-blue-600 font-semibold hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Quay lại đăng nhập</span>
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={onResetSubmit} className="space-y-3.5">
          {/* OTP */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mã xác thực OTP</label>
            <div className="relative flex items-center border border-slate-300 hover:border-slate-400 rounded-lg px-3.5 py-2.5 bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <span className="material-symbols-outlined text-[20px] text-slate-400 mr-2.5 shrink-0">pin</span>
              <input
                type="text"
                maxLength={6}
                value={forgotOtp}
                onChange={(e) => onOtpChange(e.target.value)}
                placeholder="Nhập 6 số OTP"
                required
                className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent border-none p-0 outline-none"
              />
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mật khẩu mới</label>
            <div className="relative flex items-center border border-slate-300 hover:border-slate-400 rounded-lg px-3.5 py-2.5 bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <span className="material-symbols-outlined text-[20px] text-slate-400 mr-2.5 shrink-0">lock</span>
              <input
                type={showForgotNewPassword ? "text" : "password"}
                value={forgotNewPassword}
                onChange={(e) => onNewPasswordChange(e.target.value)}
                placeholder="Tối thiểu 8 ký tự"
                required
                className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent border-none p-0 outline-none"
              />
              <button
                type="button"
                onClick={onToggleNewPassword}
                className="text-slate-400 hover:text-slate-600 shrink-0 cursor-pointer ml-1 p-0.5"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showForgotNewPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Xác nhận mật khẩu mới</label>
            <div className="relative flex items-center border border-slate-300 hover:border-slate-400 rounded-lg px-3.5 py-2.5 bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <span className="material-symbols-outlined text-[20px] text-slate-400 mr-2.5 shrink-0">lock_reset</span>
              <input
                type={showForgotNewPassword ? "text" : "password"}
                value={forgotConfirmPassword}
                onChange={(e) => onConfirmPasswordChange(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                required
                className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent border-none p-0 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isForgotLoading}
            className="w-full py-3 sm:py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-lg cursor-pointer transition shadow-md shadow-blue-600/20 active:scale-[0.99]"
          >
            {isForgotLoading ? "Đang xử lý..." : "Lưu mật khẩu mới"}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => onSwitchMode("login")}
              className="text-xs sm:text-sm text-blue-600 font-semibold hover:underline cursor-pointer"
            >
              ← Quay lại đăng nhập
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
