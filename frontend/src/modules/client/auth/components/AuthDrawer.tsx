"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { setTokens, setStoredUser } from "@/lib/auth/token";
import { Alert } from "@/components/ui/Alert";
import { useAuth } from "@/context/AuthContext";

export type AuthMode = "login" | "register" | "forgot-password";

interface AuthDrawerProps {
  isOpen: boolean;
  mode: AuthMode;
  onClose: () => void;
  onSwitchMode: (mode: AuthMode) => void;
  onSuccess?: () => void;
}

export const AuthDrawer: React.FC<AuthDrawerProps> = ({
  isOpen,
  mode,
  onClose,
  onSwitchMode,
  onSuccess,
}) => {
  const router = useRouter();
  const { login } = useAuth();

  // -------------------- LOGIN STATE --------------------
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginErrors, setLoginErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [loginGeneralError, setLoginGeneralError] = useState<string | null>(null);
  const [loginSuccessMessage, setLoginSuccessMessage] = useState<string | null>(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // -------------------- REGISTER STATE --------------------
  const [regStep, setRegStep] = useState<"register" | "otp">("register");
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regDisplayName, setRegDisplayName] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regTermsAgreed, setRegTermsAgreed] = useState(true);

  // OTP
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(300);

  const [regErrors, setRegErrors] = useState<Record<string, string>>({});
  const [regGeneralError, setRegGeneralError] = useState<string | null>(null);
  const [regSuccessMessage, setRegSuccessMessage] = useState<string | null>(null);
  const [isRegLoading, setIsRegLoading] = useState(false);

  // -------------------- FORGOT PASSWORD STATE --------------------
  const [forgotStep, setForgotStep] = useState<"email" | "reset">("email");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");
  const [forgotCountdown, setForgotCountdown] = useState(300);
  const [forgotErrors, setForgotErrors] = useState<Record<string, string>>({});
  const [forgotGeneralError, setForgotGeneralError] = useState<string | null>(null);
  const [forgotSuccessMessage, setForgotSuccessMessage] = useState<string | null>(null);
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  // -------------------- EFFECTS --------------------
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || mode !== "register" || regStep !== "otp" || countdown <= 0) return;
    const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [isOpen, mode, regStep, countdown]);

  useEffect(() => {
    if (!isOpen || mode !== "forgot-password" || forgotStep !== "reset" || forgotCountdown <= 0) return;
    const timer = setInterval(() => setForgotCountdown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [isOpen, mode, forgotStep, forgotCountdown]);

  const clearAllErrors = () => {
    setLoginGeneralError(null);
    setLoginSuccessMessage(null);
    setLoginErrors({});
    setRegGeneralError(null);
    setRegSuccessMessage(null);
    setRegErrors({});
    setForgotGeneralError(null);
    setForgotSuccessMessage(null);
    setForgotErrors({});
  };

  const handleSwitchMode = (newMode: AuthMode) => {
    clearAllErrors();
    onSwitchMode(newMode);
  };

  // -------------------- LOGIN HANDLER --------------------
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginGeneralError(null);
    setLoginSuccessMessage(null);

    const errors: { email?: string; password?: string } = {};
    if (!loginEmail.trim()) {
      errors.email = "Email / Số điện thoại không được để trống";
    }
    if (!loginPassword) {
      errors.password = "Mật khẩu không được để trống";
    }

    setLoginErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsLoginLoading(true);

    try {
      const res = await authApi.login({
        email: loginEmail.trim(),
        password: loginPassword,
      });

      if (res.success && res.data) {
        // Đồng bộ token và user vào AuthContext (tự động fetch full DB profile)
        await login(res.data.accessToken, res.data.refreshToken, res.data.user);

        setLoginSuccessMessage("Đăng nhập thành công! Đang chuyển hướng...");

        // Kiểm tra redirect query param hoặc vai trò ADMIN
        const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
        const redirectParam = searchParams?.get("redirect");
        const userRole = (res.data.user?.role || "").toUpperCase();

        setTimeout(() => {
          onClose();
          if (onSuccess) onSuccess();

          if (redirectParam) {
            router.push(redirectParam);
          } else if (userRole === "ADMIN" && typeof window !== "undefined" && window.location.pathname.includes("/login")) {
            router.push("/admin");
          } else {
            router.refresh();
          }
        }, 500);
      } else {
        setLoginGeneralError(res.message || "Đăng nhập thất bại");
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setLoginGeneralError(
        errorObj.response?.data?.message ||
          "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin."
      );
    } finally {
      setIsLoginLoading(false);
    }
  };

  // -------------------- REGISTER HANDLER --------------------
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegGeneralError(null);
    setRegSuccessMessage(null);

    const errors: Record<string, string> = {};
    if (!regUsername.trim()) errors.username = "Tên đăng nhập không được để trống";
    if (!regEmail.trim()) errors.email = "Email không được để trống";
    if (!regPassword) errors.password = "Mật khẩu không được để trống";
    if (regPassword !== regConfirmPassword) errors.confirmPassword = "Mật khẩu xác nhận không khớp";
    if (!regTermsAgreed) errors.terms = "Bạn phải đồng ý với điều khoản";

    setRegErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsRegLoading(true);

    try {
      const res = await authApi.register({
        username: regUsername.trim(),
        email: regEmail.trim(),
        displayName: regDisplayName.trim() || regUsername.trim(),
        password: regPassword,
      });

      if (res.success) {
        setRegStep("otp");
        setCountdown(300);
        setRegSuccessMessage(res.message || "Mã OTP đã được gửi đến email của bạn.");
      } else {
        setRegGeneralError(res.message || "Đăng ký thất bại");
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setRegGeneralError(
        errorObj.response?.data?.message || "Đăng ký không thành công. Vui lòng thử lại."
      );
    } finally {
      setIsRegLoading(false);
    }
  };

  // -------------------- OTP VERIFY --------------------
  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegGeneralError(null);
    setRegSuccessMessage(null);

    if (!otp.trim()) {
      setRegErrors({ otp: "Vui lòng nhập mã OTP" });
      return;
    }

    setIsRegLoading(true);

    try {
      const res = await authApi.verifyOtp({
        email: regEmail.trim(),
        otp: otp.trim(),
      });

      if (res.success) {
        setRegSuccessMessage("Xác thực email thành công! Đang chuyển sang đăng nhập...");
        setTimeout(() => {
          setLoginEmail(regEmail.trim());
          setRegStep("register");
          handleSwitchMode("login");
          setLoginSuccessMessage("Tài khoản đã kích hoạt! Hãy đăng nhập.");
        }, 1200);
      } else {
        setRegGeneralError(res.message || "Xác thực OTP thất bại");
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setRegGeneralError(
        errorObj.response?.data?.message || "Mã OTP không chính xác hoặc đã hết hạn."
      );
    } finally {
      setIsRegLoading(false);
    }
  };

  // -------------------- FORGOT PASSWORD HANDLER --------------------
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotGeneralError(null);
    setForgotSuccessMessage(null);

    if (!forgotEmail.trim()) {
      setForgotErrors({ email: "Vui lòng nhập email" });
      return;
    }

    setIsForgotLoading(true);

    try {
      const res = await authApi.forgotPassword({ email: forgotEmail.trim() });
      if (res.success) {
        setForgotStep("reset");
        setForgotCountdown(300);
        setForgotSuccessMessage("Mã OTP khôi phục đã được gửi về email của bạn.");
      } else {
        setForgotGeneralError(res.message || "Không thể gửi OTP");
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setForgotGeneralError(
        errorObj.response?.data?.message || "Không thể gửi yêu cầu quên mật khẩu."
      );
    } finally {
      setIsForgotLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotGeneralError(null);
    setForgotSuccessMessage(null);

    const errors: Record<string, string> = {};
    if (!forgotOtp.trim()) errors.otp = "Vui lòng nhập mã OTP";
    if (!forgotNewPassword) errors.newPassword = "Vui lòng nhập mật khẩu mới";
    if (forgotNewPassword !== forgotConfirmPassword) errors.confirmPassword = "Mật khẩu xác nhận không khớp";

    setForgotErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsForgotLoading(true);

    try {
      const res = await authApi.resetPassword({
        email: forgotEmail.trim(),
        otp: forgotOtp.trim(),
        newPassword: forgotNewPassword,
      });

      if (res.success) {
        setForgotSuccessMessage("Đặt lại mật khẩu thành công! Chuyển về trang đăng nhập...");
        setTimeout(() => {
          setLoginEmail(forgotEmail.trim());
          setForgotStep("email");
          handleSwitchMode("login");
          setLoginSuccessMessage("Mật khẩu đã đổi thành công. Vui lòng đăng nhập.");
        }, 1200);
      } else {
        setForgotGeneralError(res.message || "Đặt lại mật khẩu thất bại");
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setForgotGeneralError(
        errorObj.response?.data?.message || "Đặt lại mật khẩu thất bại."
      );
    } finally {
      setIsForgotLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 1. Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 transition-opacity duration-300 animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Split Screen Modal (Exact Match to Image 1) */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <div
          className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200/50 grid grid-cols-1 lg:grid-cols-12 overflow-hidden my-auto animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          {/* ==================== LEFT COLUMN: DARK NAVY BRAND HERO ==================== */}
          <div className="hidden lg:flex lg:col-span-5 bg-[#131927] text-white p-8 sm:p-10 flex-col justify-between relative overflow-hidden">
            {/* Background subtle glow effect */}
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Brand Bar */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1d72fe] flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight text-white leading-none">
                    StoryVN
                  </h3>
                  <span className="text-[10px] tracking-wider text-slate-400 font-semibold uppercase">
                    NỀN TẢNG VĂN HỌC SỐ
                  </span>
                </div>
              </div>

              {/* Tag Pill */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[11px] text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Hệ sinh thái tác quyền 4.0</span>
              </div>
            </div>

            {/* Middle: Angled Phone Mockup & Quotes */}
            <div className="relative z-10 my-8 space-y-6">
              {/* Miniature App Preview Card */}
              <div className="w-full max-w-[240px] mx-auto bg-white text-slate-800 rounded-2xl p-3.5 shadow-2xl border border-slate-200/20 transform -rotate-1 hover:rotate-0 transition-transform duration-300 text-[11px]">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 font-bold text-slate-700">
                  <span>Tài khoản</span>
                  <span className="text-slate-400 font-normal">✕</span>
                </div>
                <div className="space-y-1.5 pt-1.5">
                  <div className="text-[10px] font-semibold text-slate-600">Đăng nhập</div>
                  <div className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[9px] text-slate-500 truncate">
                    nguyenhuynh.463459@gmail.com
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[9px] text-slate-500">
                    ••••••••••••
                  </div>
                  <div className="flex items-center justify-between text-[8px] text-slate-500">
                    <span className="text-blue-600 font-medium">✓ Nhớ mật khẩu</span>
                    <span className="text-blue-500">Quên mật khẩu?</span>
                  </div>
                  <div className="w-full bg-[#1d72fe] text-white font-bold text-center py-1 rounded text-[9px]">
                    Đăng nhập
                  </div>
                  <div className="text-[8px] text-center text-slate-400 py-0.5">Hoặc đăng nhập qua</div>
                  <div className="grid grid-cols-2 gap-1 text-[8px] font-medium text-center">
                    <div className="bg-blue-600 text-white rounded py-0.5">Zalo</div>
                    <div className="bg-blue-700 text-white rounded py-0.5">Facebook</div>
                  </div>
                </div>

                {/* Floating Book Tag Over Mockup */}
                <div className="mt-2 pt-1 border-t border-slate-100 text-center">
                  <span className="inline-block px-2 py-0.5 bg-blue-600 text-white text-[8px] font-bold rounded-full">
                    Tác phẩm tiêu biểu
                  </span>
                  <div className="font-black text-slate-900 text-[11px] mt-1">
                    Huyền Thoại Trấn Giang
                  </div>
                </div>
              </div>

              {/* Gold Quote */}
              <div className="text-center space-y-2 px-2">
                <div className="text-amber-400 font-serif font-black text-3xl leading-none">
                  “
                </div>
                <p className="text-xs sm:text-sm italic text-slate-200 leading-relaxed font-normal">
                  &ldquo;Nơi hội tụ những ngòi bút tinh hoa và thế giới tưởng tượng bất tận của văn học kỳ ảo Việt Nam.&rdquo;
                </p>
                <div className="text-[11px] font-semibold text-slate-400">
                  — Hội Nhà Văn Trẻ StoryVN —
                </div>
              </div>
            </div>

            {/* Bottom: Stats & Publishing Partners */}
            <div className="relative z-10 space-y-5">
              {/* Stats Box */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 grid grid-cols-2 gap-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-400/20 flex items-center justify-center text-blue-400 shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-base font-black text-white">50.000+</div>
                    <div className="text-[10px] text-slate-400 leading-tight">Bộ tác phẩm độc quyền</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/30 border border-amber-400/20 flex items-center justify-center text-amber-300 shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-base font-black text-white">120.000+</div>
                    <div className="text-[10px] text-slate-400 leading-tight">Độc giả hàng ngày</div>
                  </div>
                </div>
              </div>

              {/* Publisher Partners Row */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] tracking-wider font-semibold text-slate-400">
                <span className="uppercase text-slate-500 font-bold">ĐỐI TÁC XUẤT BẢN</span>
                <span className="hover:text-white transition-colors">NXB KIM ĐỒNG</span>
                <span className="hover:text-white transition-colors">NHÃ NAM</span>
                <span className="hover:text-white transition-colors">TRE</span>
                <span className="hover:text-white transition-colors">PUB</span>
              </div>
            </div>
          </div>

          {/* ==================== RIGHT COLUMN: CRISP AUTH FORMS ==================== */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 flex flex-col justify-between max-h-[92vh] overflow-y-auto">
            {/* Top Close Button & Mode Switch Tabs */}
            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                {/* Tabs matching Image 1: [Đăng nhập] [Đăng ký thành viên] */}
                <div className="bg-slate-100/90 p-1 rounded-xl flex items-center gap-1 text-xs sm:text-sm font-semibold">
                  <button
                    type="button"
                    onClick={() => handleSwitchMode("login")}
                    className={`px-4 sm:px-6 py-2 rounded-lg transition-all cursor-pointer ${
                      mode === "login"
                        ? "bg-white text-blue-600 shadow-sm font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Đăng nhập
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSwitchMode("register")}
                    className={`px-4 sm:px-6 py-2 rounded-lg transition-all cursor-pointer ${
                      mode === "register"
                        ? "bg-white text-blue-600 shadow-sm font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Đăng ký thành viên
                  </button>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer text-lg shrink-0"
                  title="Đóng (Esc)"
                >
                  ✕
                </button>
              </div>

              {/* ==================== FORM 1: LOGIN MODE ==================== */}
              {mode === "login" && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="space-y-1">
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                      Chào mừng trở lại StoryVN
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Tiếp tục hành trình phiêu lưu cùng hàng ngàn tác phẩm hấp dẫn.
                    </p>
                  </div>

                  {loginGeneralError && (
                    <Alert
                      type="error"
                      message={loginGeneralError}
                      onClose={() => setLoginGeneralError(null)}
                    />
                  )}
                  {loginSuccessMessage && (
                    <Alert type="success" message={loginSuccessMessage} />
                  )}

                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    {/* Email / ID Input */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Email / Số điện thoại / StoryID
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-slate-400 pointer-events-none text-base">
                          @
                        </span>
                        <input
                          type="text"
                          placeholder="vd: tieuthuyetgia@storyvn.vn"
                          value={loginEmail}
                          onChange={(e) => {
                            setLoginEmail(e.target.value);
                            if (loginErrors.email) setLoginErrors({ ...loginErrors, email: undefined });
                          }}
                          className={`w-full bg-slate-50 border text-slate-900 text-sm rounded-xl pl-9 pr-4 py-3 outline-none transition-all placeholder:text-slate-400 focus:bg-white ${
                            loginErrors.email
                              ? "border-red-500 focus:ring-2 focus:ring-red-200"
                              : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          }`}
                        />
                      </div>
                      {loginErrors.email && (
                        <p className="text-xs text-red-500 font-medium">{loginErrors.email}</p>
                      )}
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-700">
                          Mật khẩu
                        </label>
                        <button
                          type="button"
                          onClick={() => handleSwitchMode("forgot-password")}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                        >
                          Quên mật khẩu?
                        </button>
                      </div>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-slate-400 pointer-events-none">
                          🔒
                        </span>
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Tối thiểu 8 ký tự bảo mật"
                          value={loginPassword}
                          onChange={(e) => {
                            setLoginPassword(e.target.value);
                            if (loginErrors.password) setLoginErrors({ ...loginErrors, password: undefined });
                          }}
                          className={`w-full bg-slate-50 border text-slate-900 text-sm rounded-xl pl-9 pr-10 py-3 outline-none transition-all placeholder:text-slate-400 focus:bg-white ${
                            loginErrors.password
                              ? "border-red-500 focus:ring-2 focus:ring-red-200"
                              : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
                        >
                          {showPassword ? "🙈" : "👁️"}
                        </button>
                      </div>
                      {loginErrors.password && (
                        <p className="text-xs text-red-500 font-medium">{loginErrors.password}</p>
                      )}
                    </div>

                    {/* Remember me & SSL */}
                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600 select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                        />
                        <span>Ghi nhớ đăng nhập trên máy này</span>
                      </label>
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                        🛡️ 256-bit SSL
                      </span>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoginLoading}
                      className="w-full bg-[#1d72fe] hover:bg-blue-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                    >
                      {isLoginLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Đang đăng nhập...</span>
                        </>
                      ) : (
                        <>
                          <span>Đăng nhập vào StoryVN</span>
                          <span className="text-lg">→</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Social Divider */}
                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="flex-shrink mx-4 text-xs text-slate-400 font-medium">
                      Hoặc đăng nhập nhanh qua
                    </span>
                    <div className="flex-grow border-t border-slate-200"></div>
                  </div>

                  {/* 4 Social Buttons matching Image 1 */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setLoginGeneralError("Đăng nhập Zalo ID đang được hoàn thiện. Vui lòng đăng nhập bằng Email và Mật khẩu.")}
                      className="flex items-center justify-center gap-2 bg-[#0068ff] hover:bg-blue-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      <span className="w-5 h-5 rounded-full bg-white text-[#0068ff] flex items-center justify-center font-black text-[10px]">
                        Z
                      </span>
                      <span>Zalo ID</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLoginGeneralError("Đăng nhập Google đang được hoàn thiện. Vui lòng đăng nhập bằng Email và Mật khẩu.")}
                      className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-xl border border-slate-200 transition-all shadow-xs cursor-pointer"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z" />
                        <path fill="#FBBC05" d="M5.28 14.27a7.18 7.18 0 0 1 0-4.54V6.58H1.25a11.98 11.98 0 0 0 0 10.84l4.03-3.15Z" />
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z" />
                      </svg>
                      <span>Google</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLoginGeneralError("Đăng nhập Apple ID đang được hoàn thiện. Vui lòng đăng nhập bằng Email và Mật khẩu.")}
                      className="flex items-center justify-center gap-2 bg-black hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-5.77-8.91-10.37-19.16-13.79-30.74-3.43-11.59-5.14-22.75-5.14-33.51 0-14.75 3.69-26.68 11.06-35.8 7.37-9.12 16.59-13.79 27.67-14.02 5.03 0 10.5 1.25 16.42 3.75 5.92 2.5 9.77 3.86 11.54 4.09 2.57-.45 6.72-1.93 12.44-4.44 5.73-2.51 10.86-3.69 15.4-3.53 11.83.67 21.43 4.88 28.81 12.63-10.28 6.25-15.31 14.86-15.09 25.82.22 8.48 3.52 15.7 9.89 21.64 6.37 5.95 14.08 9.38 23.13 10.3-2.24 6.7-5.03 13.5-8.38 20.39zM119.22 33.11c0-7.37 2.68-14.34 8.04-20.91 5.36-6.58 11.84-10.97 19.43-13.2 1.12 7.82-.78 15.08-5.7 21.78-4.92 6.7-11.84 10.97-20.76 12.81-.33-.16-.67-.32-1.01-.48z" />
                      </svg>
                      <span>Apple ID</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLoginGeneralError("Đăng nhập Facebook đang được hoàn thiện. Vui lòng đăng nhập bằng Email và Mật khẩu.")}
                      className="flex items-center justify-center gap-2 bg-[#1877f2] hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      <span className="font-serif font-black text-sm">f</span>
                      <span>Facebook</span>
                    </button>
                  </div>

                  {/* StoryStudio Banner Matching Image 1 */}
                  <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-800 flex items-center justify-center text-sm font-bold">
                        ✍️
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">Bạn muốn sáng tác?</div>
                        <div className="text-[11px] text-slate-500">Nhận nhuận bút &amp; phát triển độc giả</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        router.push("/me");
                      }}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 cursor-pointer whitespace-nowrap"
                    >
                      <span>StoryStudio</span>
                      <span>›</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ==================== FORM 2: REGISTER MODE ==================== */}
              {mode === "register" && (
                <div className="space-y-4 animate-fadeIn">
                  {regStep === "register" ? (
                    <>
                      <div className="space-y-1">
                        <h2 className="text-2xl font-black text-slate-900">
                          Tạo tài khoản StoryVN
                        </h2>
                        <p className="text-xs text-slate-500">
                          Tham gia cộng đồng hàng trăm ngàn độc giả và tác giả tinh hoa.
                        </p>
                      </div>

                      {regGeneralError && <Alert type="error" message={regGeneralError} />}

                      <form onSubmit={handleRegisterSubmit} className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Tên đăng nhập *
                          </label>
                          <input
                            type="text"
                            placeholder="vd: kimdung2024"
                            value={regUsername}
                            onChange={(e) => setRegUsername(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-500"
                          />
                          {regErrors.username && (
                            <p className="text-[11px] text-red-500 mt-1">{regErrors.username}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Địa chỉ Email *
                          </label>
                          <input
                            type="email"
                            placeholder="vd: author@example.com"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-500"
                          />
                          {regErrors.email && (
                            <p className="text-[11px] text-red-500 mt-1">{regErrors.email}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Mật khẩu *
                            </label>
                            <input
                              type="password"
                              placeholder="Tối thiểu 6 ký tự"
                              value={regPassword}
                              onChange={(e) => setRegPassword(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-500"
                            />
                            {regErrors.password && (
                              <p className="text-[11px] text-red-500 mt-1">{regErrors.password}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Xác nhận mật khẩu *
                            </label>
                            <input
                              type="password"
                              placeholder="Nhập lại mật khẩu"
                              value={regConfirmPassword}
                              onChange={(e) => setRegConfirmPassword(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-500"
                            />
                            {regErrors.confirmPassword && (
                              <p className="text-[11px] text-red-500 mt-1">{regErrors.confirmPassword}</p>
                            )}
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isRegLoading}
                          className="w-full bg-[#1d72fe] hover:bg-blue-600 text-white font-bold py-3 rounded-xl shadow-md text-xs cursor-pointer transition-all"
                        >
                          {isRegLoading ? "Đang xử lý..." : "Tiếp tục đăng ký →"}
                        </button>
                      </form>
                    </>
                  ) : (
                    /* OTP Verification */
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-slate-900">Xác thực mã OTP</h3>
                      <p className="text-xs text-slate-500">
                        Nhập mã xác thực 6 chữ số vừa gửi đến email <b>{regEmail}</b> ({formatTime(countdown)})
                      </p>
                      {regGeneralError && <Alert type="error" message={regGeneralError} />}
                      <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="Mã OTP 6 số"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="w-full text-center tracking-widest text-xl font-mono py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 outline-none"
                        />
                        <button
                          type="submit"
                          disabled={isRegLoading}
                          className="w-full bg-[#1d72fe] text-white font-bold py-3 rounded-xl text-xs cursor-pointer"
                        >
                          {isRegLoading ? "Đang xác thực..." : "Kích hoạt tài khoản"}
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {/* ==================== FORM 3: FORGOT PASSWORD ==================== */}
              {mode === "forgot-password" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => handleSwitchMode("login")}
                      className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 mb-2 cursor-pointer"
                    >
                      ← Quay lại đăng nhập
                    </button>
                    <h2 className="text-2xl font-black text-slate-900">
                      Khôi phục mật khẩu
                    </h2>
                    <p className="text-xs text-slate-500">
                      Nhận mã OTP bảo mật để thiết lập lại mật khẩu tài khoản của bạn.
                    </p>
                  </div>

                  {forgotGeneralError && <Alert type="error" message={forgotGeneralError} />}
                  {forgotSuccessMessage && <Alert type="success" message={forgotSuccessMessage} />}

                  {forgotStep === "email" ? (
                    <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Email đã đăng ký tài khoản
                        </label>
                        <input
                          type="email"
                          placeholder="vd: tieuthuyetgia@storyvn.vn"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-500"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isForgotLoading}
                        className="w-full bg-[#1d72fe] text-white font-bold py-3 rounded-xl text-xs cursor-pointer"
                      >
                        {isForgotLoading ? "Đang gửi..." : "Gửi mã xác thực OTP →"}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleResetPasswordSubmit} className="space-y-3">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="Nhập mã OTP 6 số"
                        value={forgotOtp}
                        onChange={(e) => setForgotOtp(e.target.value)}
                        className="w-full text-center tracking-widest text-lg font-mono py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 outline-none"
                      />
                      <input
                        type="password"
                        placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
                        value={forgotNewPassword}
                        onChange={(e) => setForgotNewPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-500"
                      />
                      <input
                        type="password"
                        placeholder="Xác nhận lại mật khẩu mới"
                        value={forgotConfirmPassword}
                        onChange={(e) => setForgotConfirmPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-500"
                      />
                      <button
                        type="submit"
                        disabled={isForgotLoading}
                        className="w-full bg-[#1d72fe] text-white font-bold py-3 rounded-xl text-xs cursor-pointer"
                      >
                        {isForgotLoading ? "Đang xử lý..." : "Hoàn tất đổi mật khẩu"}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Disclaimer matching Image 1 */}
            <div className="pt-6 mt-6 border-t border-slate-100 text-center text-[11px] text-slate-400">
              Bằng việc tiếp tục, bạn đồng ý với{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Điều khoản dịch vụ
              </a>{" "}
              và{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Chính sách bảo mật
              </a>{" "}
              của StoryVN.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
