"use client";

import React from "react";
import { AuthMode } from "./AuthDrawer";

interface LoginFormProps {
  loginIdentity: string;
  loginPassword: string;
  showPassword: boolean;
  rememberMe: boolean;
  loginError: string | null;
  isLoginLoading: boolean;
  googleClientId: string;
  googleLoginRef: React.RefObject<HTMLDivElement | null>;
  onIdentityChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onTogglePassword: () => void;
  onRememberMeChange: (v: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSwitchMode: (mode: AuthMode) => void;
  onSocialClick: (provider: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  loginIdentity,
  loginPassword,
  showPassword,
  rememberMe,
  loginError,
  isLoginLoading,
  googleClientId,
  googleLoginRef,
  onIdentityChange,
  onPasswordChange,
  onTogglePassword,
  onRememberMeChange,
  onSubmit,
  onSwitchMode,
  onSocialClick,
}) => {
  return (
    <div className="w-full my-auto py-2">
      <header className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Đăng nhập</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
          Chào mừng bạn trở lại với không gian văn học số StoryVN
        </p>
      </header>

      {loginError && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-medium flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
          <span>{loginError}</span>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Identity Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Email hoặc Tên đăng nhập
          </label>
          <div className="relative flex items-center border border-slate-300 hover:border-slate-400 rounded-lg px-3.5 py-2.5 sm:py-3 bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <span className="material-symbols-outlined text-[20px] text-slate-400 mr-2.5 shrink-0">
              account_circle
            </span>
            <input
              type="text"
              value={loginIdentity}
              onChange={(e) => onIdentityChange(e.target.value)}
              placeholder="vd: docgia@storyvn.vn hoặc username"
              required
              className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent border-none p-0 outline-none"
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Mật khẩu
          </label>
          <div className="relative flex items-center border border-slate-300 hover:border-slate-400 rounded-lg px-3.5 py-2.5 sm:py-3 bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <span className="material-symbols-outlined text-[20px] text-slate-400 mr-2.5 shrink-0">
              lock
            </span>
            <input
              type={showPassword ? "text" : "password"}
              value={loginPassword}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="Nhập mật khẩu của bạn"
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
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between pt-0.5 text-xs sm:text-sm">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => onRememberMeChange(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-slate-600 text-xs sm:text-sm">Ghi nhớ đăng nhập</span>
          </label>
          <button
            type="button"
            onClick={() => onSwitchMode("forgot-password")}
            className="text-blue-600 hover:text-blue-700 font-semibold hover:underline text-xs sm:text-sm cursor-pointer"
          >
            Quên mật khẩu?
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoginLoading}
          className="w-full py-3 sm:py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs sm:text-sm rounded-lg transition shadow-md shadow-blue-600/20 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {isLoginLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Đăng nhập</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center my-5">
        <div className="grow border-t border-slate-200"></div>
        <span className="shrink-0 mx-4 text-xs text-slate-400 uppercase tracking-wider font-semibold">Hoặc</span>
        <div className="grow border-t border-slate-200"></div>
      </div>

      {/* Google Button */}
      {googleClientId ? (
        <div className="w-full flex justify-center items-center min-h-[44px]">
          <div ref={googleLoginRef} className="w-full flex justify-center" />
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
          <span>Đăng nhập với Google</span>
        </button>
      )}

      {/* Switch to Register */}
      <div className="mt-5 text-center">
        <p className="text-xs sm:text-sm text-slate-600">
          Chưa có tài khoản?{" "}
          <button
            type="button"
            onClick={() => onSwitchMode("register")}
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer ml-1"
          >
            Đăng ký ngay
          </button>
        </p>
      </div>
    </div>
  );
};
