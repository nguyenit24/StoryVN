"use client";

import React from "react";
import { AuthMode } from "./AuthDrawer";

interface RegisterFormProps {
  regStep: "register" | "otp";
  regUsername: string;
  regEmail: string;
  regPassword: string;
  regConfirmPassword: string;
  regTermsAgreed: boolean;
  showRegPassword: boolean;
  showRegConfirmPassword: boolean;
  regOtp: string;
  countdown: number;
  regError: string | null;
  isRegLoading: boolean;
  googleClientId: string;
  googleRegisterRef: React.RefObject<HTMLDivElement | null>;
  onUsernameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onConfirmPasswordChange: (v: string) => void;
  onTermsChange: (v: boolean) => void;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
  onOtpChange: (v: string) => void;
  onRegisterSubmit: (e: React.FormEvent) => void;
  onOtpVerify: (e: React.FormEvent) => void;
  onBackToRegister: () => void;
  onSwitchMode: (mode: AuthMode) => void;
  onSocialClick: (provider: string) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  regStep,
  regUsername,
  regEmail,
  regPassword,
  regConfirmPassword,
  regTermsAgreed,
  showRegPassword,
  showRegConfirmPassword,
  regOtp,
  countdown,
  regError,
  isRegLoading,
  googleClientId,
  googleRegisterRef,
  onUsernameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onTermsChange,
  onTogglePassword,
  onToggleConfirmPassword,
  onOtpChange,
  onRegisterSubmit,
  onOtpVerify,
  onBackToRegister,
  onSwitchMode,
  onSocialClick,
}) => {
  return (
    <div className="w-full my-auto py-2">
      {regStep === "register" ? (
        <>
          <header className="mb-5">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold mb-1.5">
              Thành viên mới
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Tạo tài khoản</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Gia nhập cộng đồng người đọc và tác giả StoryVN
            </p>
          </header>

          {regError && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
              <span>{regError}</span>
            </div>
          )}

          <form onSubmit={onRegisterSubmit} className="space-y-3.5">
            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tên tài khoản / Biệt danh <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center border border-slate-300 hover:border-slate-400 rounded-lg px-3.5 py-2.5 bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <span className="material-symbols-outlined text-[20px] text-slate-400 mr-2.5 shrink-0">person</span>
                <input
                  type="text"
                  value={regUsername}
                  onChange={(e) => onUsernameChange(e.target.value)}
                  placeholder="vd: thanhphong (tối thiểu 4 ký tự)"
                  required
                  className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent border-none p-0 outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Địa chỉ Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center border border-slate-300 hover:border-slate-400 rounded-lg px-3.5 py-2.5 bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <span className="material-symbols-outlined text-[20px] text-slate-400 mr-2.5 shrink-0">mail</span>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => onEmailChange(e.target.value)}
                  placeholder="vd: bandoc@example.com"
                  required
                  className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent border-none p-0 outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mật khẩu <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center border border-slate-300 hover:border-slate-400 rounded-lg px-3.5 py-2.5 bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <span className="material-symbols-outlined text-[20px] text-slate-400 mr-2.5 shrink-0">lock</span>
                <input
                  type={showRegPassword ? "text" : "password"}
                  value={regPassword}
                  onChange={(e) => onPasswordChange(e.target.value)}
                  placeholder="Tối thiểu 8 ký tự"
                  required
                  className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent border-none p-0 outline-none"
                />
                <button
                  type="button"
                  onClick={onTogglePassword}
                  className="text-slate-400 hover:text-slate-600 shrink-0 cursor-pointer ml-1 p-0.5"
                  aria-label="Hiện hoặc ẩn mật khẩu"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showRegPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Xác nhận mật khẩu <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center border border-slate-300 hover:border-slate-400 rounded-lg px-3.5 py-2.5 bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <span className="material-symbols-outlined text-[20px] text-slate-400 mr-2.5 shrink-0">lock_reset</span>
                <input
                  type={showRegConfirmPassword ? "text" : "password"}
                  value={regConfirmPassword}
                  onChange={(e) => onConfirmPasswordChange(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  required
                  className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent border-none p-0 outline-none"
                />
                <button
                  type="button"
                  onClick={onToggleConfirmPassword}
                  className="text-slate-400 hover:text-slate-600 shrink-0 cursor-pointer ml-1 p-0.5"
                  aria-label="Hiện hoặc ẩn mật khẩu xác nhận"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showRegConfirmPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2.5 cursor-pointer select-none pt-1">
              <input
                type="checkbox"
                checked={regTermsAgreed}
                onChange={(e) => onTermsChange(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
              />
              <span className="text-xs text-slate-600 leading-tight">
                Tôi đồng ý với{" "}
                <span className="text-blue-600 font-medium hover:underline">Điều khoản dịch vụ</span>{" "}
                và{" "}
                <span className="text-blue-600 font-medium hover:underline">Quy chuẩn cộng đồng</span>.
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={isRegLoading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isRegLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Đăng ký tài khoản</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative text-center my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">Hoặc</span>
            </div>
          </div>

          {/* Google Button */}
          {googleClientId ? (
            <div className="w-full flex justify-center items-center min-h-[44px]">
              <div ref={googleRegisterRef} className="w-full flex justify-center" />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onSocialClick("Google")}
              className="w-full flex items-center justify-center gap-3 py-2.5 sm:py-3 px-4 border border-slate-200 hover:border-slate-300 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-xs hover:shadow-sm cursor-pointer active:scale-[0.99]"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
              <span>Đăng ký với Google</span>
            </button>
          )}

          {/* Switch to Login */}
          <div className="pt-4 text-center">
            <p className="text-xs sm:text-sm text-slate-600">
              Đã có tài khoản?{" "}
              <button
                type="button"
                onClick={() => onSwitchMode("login")}
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline cursor-pointer ml-1"
              >
                Đăng nhập ngay
              </button>
            </p>
          </div>
        </>
      ) : (
        /* OTP Verification Step */
        <form onSubmit={onOtpVerify} className="space-y-4 py-2">
          <header>
            <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[28px]">mark_email_read</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Xác thực mã OTP</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Mã xác thực gồm 6 chữ số đã gửi tới <b>{regEmail}</b>
            </p>
          </header>

          {regError && (
            <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs sm:text-sm font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
              <span>{regError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Mã xác thực OTP</label>
            <div className="relative flex items-center border border-slate-300 hover:border-slate-400 rounded-lg px-4 py-3 bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <span className="material-symbols-outlined text-[20px] text-slate-400 mr-3 shrink-0">pin</span>
              <input
                type="text"
                maxLength={6}
                value={regOtp}
                onChange={(e) => onOtpChange(e.target.value)}
                placeholder="Nhập 6 số OTP"
                required
                className="w-full text-center text-xl tracking-widest font-mono font-bold text-slate-800 bg-transparent border-none p-0 outline-none"
              />
            </div>
          </div>

          <p className="text-xs text-slate-400 text-center">
            Thời gian còn lại:{" "}
            <span className="font-mono text-blue-600 font-bold">
              {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, "0")}
            </span>
          </p>

          <button
            type="submit"
            disabled={isRegLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg cursor-pointer transition shadow-md shadow-blue-600/20 active:scale-[0.99]"
          >
            {isRegLoading ? "Đang xác thực..." : "Kích hoạt tài khoản"}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onBackToRegister}
              className="text-xs sm:text-sm text-slate-500 hover:text-slate-800 underline cursor-pointer"
            >
              Quay lại chỉnh sửa thông tin
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
