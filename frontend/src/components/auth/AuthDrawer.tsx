"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { setTokens, setStoredUser } from "@/lib/auth/token";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

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

  // -------------------- LOGIN STATE --------------------
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
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
  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
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

  // Timer countdown for Register OTP
  useEffect(() => {
    if (!isOpen || mode !== "register" || regStep !== "otp" || countdown <= 0) {
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, mode, regStep, countdown]);

  // Timer countdown for Forgot Password OTP
  useEffect(() => {
    if (
      !isOpen ||
      mode !== "forgot-password" ||
      forgotStep !== "reset" ||
      forgotCountdown <= 0
    ) {
      return;
    }
    const timer = setInterval(() => {
      setForgotCountdown((prev) => prev - 1);
    }, 1000);
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
  const validateLogin = (): boolean => {
    const errors: { email?: string; password?: string } = {};
    if (!loginEmail.trim()) {
      errors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail)) {
      errors.email = "Định dạng email không hợp lệ";
    }

    if (!loginPassword) {
      errors.password = "Mật khẩu không được để trống";
    }

    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginGeneralError(null);
    setLoginSuccessMessage(null);

    if (!validateLogin()) return;

    setIsLoginLoading(true);

    try {
      const response = await authApi.login({
        email: loginEmail.trim(),
        password: loginPassword,
      });

      if (response.success && response.data) {
        const { accessToken, refreshToken, user } = response.data;
        setTokens(accessToken, refreshToken);
        setStoredUser(user);

        setLoginSuccessMessage("Đăng nhập thành công! Đang chuyển hướng...");

        if (onSuccess) onSuccess();

        setTimeout(() => {
          onClose();
          router.push("/me");
        }, 500);
      } else {
        setLoginGeneralError(response.message || "Đăng nhập thất bại");
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      const message =
        errorObj.response?.data?.message ||
        "Không thể kết nối đến máy chủ. Vui lòng thử lại sau.";
      setLoginGeneralError(message);
    } finally {
      setIsLoginLoading(false);
    }
  };

  // -------------------- REGISTER HANDLER --------------------
  const validateRegister = (): boolean => {
    const errors: Record<string, string> = {};

    if (!regUsername.trim()) {
      errors.username = "Tên đăng nhập không được để trống";
    } else if (regUsername.length < 3 || regUsername.length > 30) {
      errors.username = "Tên đăng nhập phải từ 3 đến 30 ký tự";
    } else if (!/^[a-zA-Z0-9_]+$/.test(regUsername)) {
      errors.username = "Chỉ chấp nhận chữ cái, chữ số và dấu gạch dưới (_)";
    }

    if (!regEmail.trim()) {
      errors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail)) {
      errors.email = "Địa chỉ email không đúng định dạng";
    }

    if (!regPassword) {
      errors.password = "Mật khẩu không được để trống";
    } else if (regPassword.length < 6) {
      errors.password = "Mật khẩu phải có tối thiểu 6 ký tự";
    }

    if (regPassword !== regConfirmPassword) {
      errors.confirmPassword = "Mật khẩu nhập lại không khớp";
    }

    if (!regTermsAgreed) {
      errors.terms = "Vui lòng đồng ý với điều khoản dịch vụ";
    }

    setRegErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegGeneralError(null);
    setRegSuccessMessage(null);

    if (!validateRegister()) return;

    setIsRegLoading(true);

    try {
      const res = await authApi.register({
        username: regUsername.trim(),
        email: regEmail.trim(),
        password: regPassword,
        displayName: regDisplayName.trim() || undefined,
      });

      if (res.success) {
        setRegStep("otp");
        setCountdown(300);
        setRegSuccessMessage(
          res.message || "Mã OTP đã được gửi đến email của bạn. Vui lòng xác thực."
        );
      } else {
        setRegGeneralError(res.message || "Đăng ký thất bại");
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setRegGeneralError(
        errorObj.response?.data?.message ||
          "Đăng ký thất bại. Vui lòng thử lại sau."
      );
    } finally {
      setIsRegLoading(false);
    }
  };

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
      const verifyRes = await authApi.verifyOtp({
        email: regEmail.trim(),
        otp: otp.trim(),
      });

      if (verifyRes.success) {
        setRegSuccessMessage("Xác thực OTP thành công! Đang tự động đăng nhập...");

        // Auto login for seamless experience
        try {
          const loginRes = await authApi.login({
            email: regEmail.trim(),
            password: regPassword,
          });

          if (loginRes.success && loginRes.data) {
            setTokens(loginRes.data.accessToken, loginRes.data.refreshToken);
            setStoredUser(loginRes.data.user);
            if (onSuccess) onSuccess();
            setTimeout(() => {
              onClose();
              router.push("/me");
            }, 600);
            return;
          }
        } catch {
          // If auto login fails, switch to login tab
          setTimeout(() => {
            handleSwitchMode("login");
            setLoginEmail(regEmail);
          }, 800);
        }
      } else {
        setRegGeneralError(verifyRes.message || "Mã OTP không chính xác");
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setRegGeneralError(
        errorObj.response?.data?.message ||
          "Xác thực OTP thất bại. Vui lòng thử lại."
      );
    } finally {
      setIsRegLoading(false);
    }
  };

  // -------------------- FORGOT PASSWORD HANDLERS --------------------
  const handleForgotEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotGeneralError(null);
    setForgotSuccessMessage(null);

    const email = forgotEmail.trim();
    if (!email) {
      setForgotErrors({ email: "Vui lòng nhập email tài khoản của bạn" });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setForgotErrors({ email: "Địa chỉ email không đúng định dạng" });
      return;
    }

    setForgotErrors({});
    setIsForgotLoading(true);

    try {
      const res = await authApi.forgotPassword({ email });
      if (res.success) {
        setForgotStep("reset");
        setForgotCountdown(300);
        setForgotSuccessMessage(
          res.message || "Mã OTP đặt lại mật khẩu đã được gửi về email của bạn."
        );
      } else {
        setForgotGeneralError(res.message || "Không thể gửi yêu cầu quên mật khẩu");
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setForgotGeneralError(
        errorObj.response?.data?.message ||
          "Gửi mã OTP thất bại. Vui lòng kiểm tra lại email hoặc thử lại sau."
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
    if (!forgotOtp.trim()) {
      errors.otp = "Vui lòng nhập mã OTP gồm 6 chữ số";
    } else if (forgotOtp.trim().length !== 6) {
      errors.otp = "Mã OTP phải có đúng 6 chữ số";
    }

    if (!forgotNewPassword) {
      errors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (forgotNewPassword.length < 6) {
      errors.newPassword = "Mật khẩu mới phải có tối thiểu 6 ký tự";
    }

    if (forgotNewPassword !== forgotConfirmPassword) {
      errors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

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
        setForgotSuccessMessage(
          "Đặt lại mật khẩu thành công! Đang chuyển sang màn hình đăng nhập..."
        );
        setTimeout(() => {
          setLoginEmail(forgotEmail.trim());
          setForgotStep("email");
          setForgotOtp("");
          setForgotNewPassword("");
          setForgotConfirmPassword("");
          handleSwitchMode("login");
          setLoginSuccessMessage("Mật khẩu đã được cập nhật. Vui lòng đăng nhập.");
        }, 1200);
      } else {
        setForgotGeneralError(res.message || "Đặt lại mật khẩu không thành công");
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setForgotGeneralError(
        errorObj.response?.data?.message ||
          "Đặt lại mật khẩu thất bại. Mã OTP có thể đã hết hạn hoặc không đúng."
      );
    } finally {
      setIsForgotLoading(false);
    }
  };

  const handleResendForgotOtp = async () => {
    if (forgotCountdown > 0 || isForgotLoading) return;
    setForgotGeneralError(null);
    setIsForgotLoading(true);
    try {
      const res = await authApi.forgotPassword({ email: forgotEmail.trim() });
      if (res.success) {
        setForgotCountdown(300);
        setForgotSuccessMessage("Đã gửi lại mã OTP mới về email của bạn.");
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setForgotGeneralError(
        errorObj.response?.data?.message || "Không thể gửi lại mã OTP. Vui lòng thử lại."
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

  return (
    <>
      {/* 1. Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-zinc-950/60 backdrop-blur-xs z-50 transition-opacity duration-200 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Centered Modal Dialog (Centered In Viewport) */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto transition-all duration-200 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden my-auto transform transition-all duration-200 ease-out ${
            isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-2"
          }`}
          aria-label="Cửa sổ tài khoản StoryVn_HCM-UTE"
          role="dialog"
          aria-modal="true"
        >
          {/* Modal Header Bar */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-0.5">
                <span className="text-xl font-black tracking-tight text-[#1d72fe]">
                  Story<span className="text-[#f97316]">Vn</span>
                </span>
                <span className="text-xs font-bold text-slate-500">_HCM-UTE</span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                {mode === "forgot-password"
                  ? "Khôi phục mật khẩu tài khoản"
                  : mode === "login"
                  ? "Đăng nhập tài khoản độc giả"
                  : "Đăng ký thành viên mới"}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer text-base"
              title="Đóng cửa sổ (Esc)"
            >
              <span className="text-xl font-light leading-none">&times;</span>
            </button>
          </div>

          {/* Navigation / Segmented Tab Bar */}
          {mode === "forgot-password" ? (
            <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs shrink-0">
              <button
                type="button"
                onClick={() => handleSwitchMode("login")}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <span>&larr; Quay lại đăng nhập</span>
              </button>
              <span className="text-[11px] text-slate-400">
                {forgotStep === "email" ? "Bước 1/2" : "Bước 2/2"}
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-2 border-b border-slate-100 text-xs font-bold text-center shrink-0">
              <button
                type="button"
                onClick={() => handleSwitchMode("login")}
                className={`py-3.5 transition-colors cursor-pointer ${
                  mode === "login"
                    ? "text-blue-600 border-b-2 border-blue-600 font-bold bg-blue-50/40"
                    : "text-slate-500 hover:text-slate-900 bg-white"
                }`}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => handleSwitchMode("register")}
                className={`py-3.5 transition-colors cursor-pointer ${
                  mode === "register"
                    ? "text-blue-600 border-b-2 border-blue-600 font-bold bg-blue-50/40"
                    : "text-slate-500 hover:text-slate-900 bg-white"
                }`}
              >
                Đăng ký
              </button>
            </div>
          )}

          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-5">
            {mode === "login" ? (
              /* ==================== LOGIN FORM ==================== */
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-zinc-950 uppercase font-mono">
                    Chào mừng trở lại
                  </h2>
                  <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
                    Nhập email và mật khẩu của bạn để tiếp tục khám phá thế giới truyện.
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
                  <Input
                    label="Địa chỉ Email"
                    type="email"
                    placeholder="name@example.com"
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      if (loginErrors.email) {
                        setLoginErrors({ ...loginErrors, email: undefined });
                      }
                    }}
                    error={loginErrors.email}
                    autoComplete="email"
                    disabled={isLoginLoading}
                    leftIcon={
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                    }
                  />

                  <Input
                    label="Mật khẩu"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      if (loginErrors.password) {
                        setLoginErrors({ ...loginErrors, password: undefined });
                      }
                    }}
                    error={loginErrors.password}
                    autoComplete="current-password"
                    disabled={isLoginLoading}
                    leftIcon={
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    }
                  />

                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-zinc-600 hover:text-zinc-900">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded-none w-3.5 h-3.5 border-zinc-300 text-zinc-900 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-zinc-950"
                      />
                      <span>Ghi nhớ đăng nhập</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => handleSwitchMode("forgot-password")}
                      className="font-medium text-zinc-600 hover:text-zinc-950 underline underline-offset-2 cursor-pointer"
                    >
                      Quên mật khẩu?
                    </button>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      isLoading={isLoginLoading}
                    >
                      Đăng nhập ngay &rarr;
                    </Button>
                  </div>

                  <div className="pt-3 border-t border-zinc-200 text-center text-xs text-zinc-600">
                    Chưa có tài khoản?{" "}
                    <button
                      type="button"
                      onClick={() => handleSwitchMode("register")}
                      className="font-bold text-zinc-950 underline underline-offset-4 hover:text-zinc-700 cursor-pointer"
                    >
                      Đăng ký tài khoản mới &rarr;
                    </button>
                  </div>
                </form>
              </div>
            ) : mode === "register" ? (
              /* ==================== REGISTER FORM ==================== */
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-zinc-950 uppercase font-mono">
                    {regStep === "register" ? "Tạo tài khoản mới" : "Xác thực OTP"}
                  </h2>
                  <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
                    {regStep === "register"
                      ? "Tham gia cộng đồng StoryVN để thỏa sức đọc và sáng tác."
                      : `Nhập mã 6 chữ số đã gửi tới ${regEmail}`}
                  </p>
                </div>

                {regGeneralError && (
                  <Alert
                    type="error"
                    message={regGeneralError}
                    onClose={() => setRegGeneralError(null)}
                  />
                )}

                {regSuccessMessage && (
                  <Alert type="success" message={regSuccessMessage} />
                )}

                {regStep === "register" ? (
                  <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                    <Input
                      label="Tên đăng nhập *"
                      placeholder="vd: nguyenvana (không dấu)"
                      value={regUsername}
                      onChange={(e) => {
                        setRegUsername(e.target.value);
                        if (regErrors.username) {
                          setRegErrors({ ...regErrors, username: "" });
                        }
                      }}
                      error={regErrors.username}
                      disabled={isRegLoading}
                    />

                    <Input
                      label="Địa chỉ Email *"
                      type="email"
                      placeholder="vd: name@example.com"
                      value={regEmail}
                      onChange={(e) => {
                        setRegEmail(e.target.value);
                        if (regErrors.email) {
                          setRegErrors({ ...regErrors, email: "" });
                        }
                      }}
                      error={regErrors.email}
                      disabled={isRegLoading}
                    />

                    <Input
                      label="Tên hiển thị (Tùy chọn)"
                      placeholder="vd: Nguyễn Văn A"
                      value={regDisplayName}
                      onChange={(e) => setRegDisplayName(e.target.value)}
                      disabled={isRegLoading}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label="Mật khẩu *"
                        type="password"
                        placeholder="Tối thiểu 6 ký tự"
                        value={regPassword}
                        onChange={(e) => {
                          setRegPassword(e.target.value);
                          if (regErrors.password) {
                            setRegErrors({ ...regErrors, password: "" });
                          }
                        }}
                        error={regErrors.password}
                        disabled={isRegLoading}
                      />

                      <Input
                        label="Xác nhận mật khẩu *"
                        type="password"
                        placeholder="Nhập lại mật khẩu"
                        value={regConfirmPassword}
                        onChange={(e) => {
                          setRegConfirmPassword(e.target.value);
                          if (regErrors.confirmPassword) {
                            setRegErrors({ ...regErrors, confirmPassword: "" });
                          }
                        }}
                        error={regErrors.confirmPassword}
                        disabled={isRegLoading}
                      />
                    </div>

                    <div className="pt-1">
                      <label className="flex items-start gap-2 cursor-pointer select-none text-xs text-zinc-600">
                        <input
                          type="checkbox"
                          checked={regTermsAgreed}
                          onChange={(e) => {
                            setRegTermsAgreed(e.target.checked);
                            if (regErrors.terms) {
                              setRegErrors({ ...regErrors, terms: "" });
                            }
                          }}
                          className="mt-0.5 rounded-none w-3.5 h-3.5 border-zinc-300 text-zinc-900 focus:ring-0 cursor-pointer accent-zinc-950"
                        />
                        <span>
                          Tôi đồng ý với{" "}
                          <span className="font-semibold underline text-zinc-950">
                            Điều khoản dịch vụ
                          </span>{" "}
                          và{" "}
                          <span className="font-semibold underline text-zinc-950">
                            Chính sách bảo mật
                          </span>
                        </span>
                      </label>
                      {regErrors.terms && (
                        <p className="text-xs text-red-600 mt-1">{regErrors.terms}</p>
                      )}
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        isLoading={isRegLoading}
                      >
                        Tiếp tục: Nhận mã OTP &rarr;
                      </Button>
                    </div>

                    <div className="pt-3 border-t border-zinc-200 text-center text-xs text-zinc-600">
                      Đã có tài khoản?{" "}
                      <button
                        type="button"
                        onClick={() => handleSwitchMode("login")}
                        className="font-bold text-zinc-950 underline underline-offset-4 hover:text-zinc-700 cursor-pointer"
                      >
                        Đăng nhập ngay
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Step 2: OTP Verification */
                  <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
                    <div className="p-3 bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 space-y-1">
                      <p className="font-medium text-zinc-900">💡 Hướng dẫn OTP:</p>
                      <p>
                        Mã xác thực có hiệu lực trong vòng{" "}
                        <span className="font-bold text-zinc-950">
                          {formatTime(countdown)}
                        </span>
                        .
                      </p>
                      <p className="text-[11px] text-zinc-500 italic">
                        Nếu đang thử nghiệm local, hãy xem mã OTP trong log terminal backend.
                      </p>
                    </div>

                    <Input
                      label="Mã OTP (6 chữ số) *"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                        if (regErrors.otp) {
                          setRegErrors({ ...regErrors, otp: "" });
                        }
                      }}
                      error={regErrors.otp}
                      maxLength={6}
                      className="text-center tracking-[0.4em] font-mono text-lg font-bold"
                      disabled={isRegLoading}
                      autoFocus
                    />

                    <div className="pt-2 flex flex-col gap-2">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        isLoading={isRegLoading}
                      >
                        Xác thực &amp; Hoàn tất &rarr;
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="md"
                        fullWidth
                        disabled={isRegLoading}
                        onClick={() => setRegStep("register")}
                      >
                        &larr; Thay đổi thông tin đăng ký
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              /* ==================== FORGOT PASSWORD FORM ==================== */
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-zinc-950 uppercase font-mono">
                    {forgotStep === "email" ? "Quên mật khẩu" : "Đặt lại mật khẩu mới"}
                  </h2>
                  <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
                    {forgotStep === "email"
                      ? "Nhập email tài khoản của bạn để nhận mã OTP khôi phục mật khẩu."
                      : `Nhập mã OTP gửi tới ${forgotEmail} và tạo mật khẩu mới.`}
                  </p>
                </div>

                {forgotGeneralError && (
                  <Alert
                    type="error"
                    message={forgotGeneralError}
                    onClose={() => setForgotGeneralError(null)}
                  />
                )}

                {forgotSuccessMessage && (
                  <Alert type="success" message={forgotSuccessMessage} />
                )}

                {forgotStep === "email" ? (
                  /* Step 1: Send OTP to email */
                  <form onSubmit={handleForgotEmailSubmit} className="space-y-4">
                    <Input
                      label="Địa chỉ Email tài khoản *"
                      type="email"
                      placeholder="name@example.com"
                      value={forgotEmail}
                      onChange={(e) => {
                        setForgotEmail(e.target.value);
                        if (forgotErrors.email) {
                          setForgotErrors({ ...forgotErrors, email: "" });
                        }
                      }}
                      error={forgotErrors.email}
                      autoComplete="email"
                      disabled={isForgotLoading}
                      autoFocus
                      leftIcon={
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                          />
                        </svg>
                      }
                    />

                    <div className="pt-2">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        isLoading={isForgotLoading}
                      >
                        Gửi mã xác thực OTP &rarr;
                      </Button>
                    </div>

                    <div className="pt-3 border-t border-zinc-200 text-center text-xs text-zinc-600">
                      Nhớ lại mật khẩu rồi?{" "}
                      <button
                        type="button"
                        onClick={() => handleSwitchMode("login")}
                        className="font-bold text-zinc-950 underline underline-offset-4 hover:text-zinc-700 cursor-pointer"
                      >
                        Đăng nhập ngay &rarr;
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Step 2: Enter OTP and Reset Password */
                  <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                    <div className="p-3 bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-zinc-900">💡 Mã OTP hiệu lực:</span>
                        <span className="font-mono font-bold text-zinc-950">
                          {formatTime(forgotCountdown)}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500">
                        Kiểm tra hòm thư đến hoặc mục thư rác (spam) của email{" "}
                        <span className="font-semibold text-zinc-800">{forgotEmail}</span>.
                      </p>
                    </div>

                    <Input
                      label="Mã xác thực OTP (6 chữ số) *"
                      placeholder="123456"
                      value={forgotOtp}
                      onChange={(e) => {
                        setForgotOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                        if (forgotErrors.otp) {
                          setForgotErrors({ ...forgotErrors, otp: "" });
                        }
                      }}
                      error={forgotErrors.otp}
                      maxLength={6}
                      className="text-center tracking-[0.4em] font-mono text-lg font-bold"
                      disabled={isForgotLoading}
                      autoFocus
                    />

                    <Input
                      label="Mật khẩu mới *"
                      type="password"
                      placeholder="Tối thiểu 6 ký tự"
                      value={forgotNewPassword}
                      onChange={(e) => {
                        setForgotNewPassword(e.target.value);
                        if (forgotErrors.newPassword) {
                          setForgotErrors({ ...forgotErrors, newPassword: "" });
                        }
                      }}
                      error={forgotErrors.newPassword}
                      disabled={isForgotLoading}
                      leftIcon={
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      }
                    />

                    <Input
                      label="Xác nhận mật khẩu mới *"
                      type="password"
                      placeholder="Nhập lại mật khẩu mới"
                      value={forgotConfirmPassword}
                      onChange={(e) => {
                        setForgotConfirmPassword(e.target.value);
                        if (forgotErrors.confirmPassword) {
                          setForgotErrors({ ...forgotErrors, confirmPassword: "" });
                        }
                      }}
                      error={forgotErrors.confirmPassword}
                      disabled={isForgotLoading}
                    />

                    <div className="flex items-center justify-between text-xs pt-1">
                      <button
                        type="button"
                        onClick={handleResendForgotOtp}
                        disabled={forgotCountdown > 0 || isForgotLoading}
                        className="text-zinc-600 hover:text-zinc-950 underline underline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {forgotCountdown > 0
                          ? `Gửi lại mã sau ${formatTime(forgotCountdown)}`
                          : "Gửi lại mã OTP"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setForgotStep("email");
                          setForgotOtp("");
                        }}
                        className="text-zinc-500 hover:text-zinc-800 cursor-pointer"
                      >
                        Đổi email khác
                      </button>
                    </div>

                    <div className="pt-2 flex flex-col gap-2">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        isLoading={isForgotLoading}
                      >
                        Cập nhật mật khẩu mới &rarr;
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="md"
                        fullWidth
                        disabled={isForgotLoading}
                        onClick={() => handleSwitchMode("login")}
                      >
                        &larr; Hủy &amp; Quay lại đăng nhập
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Footer bar inside modal */}
          <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between shrink-0">
            <span>&copy; StoryVn_HCM-UTE Platform</span>
            <span className="font-mono text-[10px] text-slate-400">ESC để đóng</span>
          </div>
        </div>
      </div>
    </>
  );
};
