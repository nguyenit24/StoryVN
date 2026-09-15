"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/modules/client/auth/services/auth.service";
import { useAuth } from "@/context/AuthContext";
import { envConfig } from "@/config/env.config";
import toast from "react-hot-toast";
import { AuthDrawerLeftPanel } from "./AuthDrawerLeftPanel";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

interface GoogleIdConfig {
  client_id: string;
  callback: (response: { credential?: string }) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
}

interface GoogleButtonOptions {
  type?: string;
  shape?: string;
  theme?: string;
  text?: string;
  size?: string;
  logo_alignment?: string;
  width?: number;
}

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: GoogleIdConfig) => void;
          renderButton: (parent: HTMLElement, options: GoogleButtonOptions) => void;
          prompt: (momentListener?: (notification: unknown) => void) => void;
        };
      };
    };
  }
}

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

  const googleClientId = envConfig.googleClientId || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  const googleLoginRef = useRef<HTMLDivElement>(null);
  const googleRegisterRef = useRef<HTMLDivElement>(null);

  // Login state
  const [loginIdentity, setLoginIdentity] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // Register state
  const [regStep, setRegStep] = useState<"register" | "otp">("register");
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regTermsAgreed, setRegTermsAgreed] = useState(true);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [regOtp, setRegOtp] = useState("");
  const [countdown, setCountdown] = useState(300);
  const [regError, setRegError] = useState<string | null>(null);
  const [isRegLoading, setIsRegLoading] = useState(false);

  // Forgot password state
  const [forgotStep, setForgotStep] = useState<"email" | "reset">("email");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  const clearErrors = useCallback(() => {
    setLoginError(null);
    setRegError(null);
    setForgotError(null);
  }, []);

  const handleSwitchMode = (newMode: AuthMode) => {
    clearErrors();
    onSwitchMode(newMode);
  };

  // Effects
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
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
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || mode !== "register" || regStep !== "otp" || countdown <= 0) return;
    const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [isOpen, mode, regStep, countdown]);

  const handleGoogleCredentialResponse = useCallback(
    async (response: { credential?: string }) => {
      if (!response?.credential) {
        toast.error("Không nhận được mã xác thực từ Google");
        return;
      }
      clearErrors();
      setIsLoginLoading(true);
      try {
        const res = await authApi.loginWithGoogle({ credential: response.credential });
        if (res.success && res.data) {
          toast.success("Đăng nhập với Google thành công!");
          login(res.data.accessToken, res.data.refreshToken, res.data.user);
          setTimeout(() => {
            onClose();
            if (onSuccess) onSuccess();
            else router.refresh();
          }, 200);
        } else {
          const msg = res.message || "Đăng nhập Google thất bại";
          if (mode === "register") setRegError(msg);
          else setLoginError(msg);
          toast.error(msg);
        }
      } catch (err: unknown) {
        const errorObj = err as { response?: { data?: { message?: string } } };
        const msg = errorObj.response?.data?.message || "Đăng nhập Google thất bại. Vui lòng thử lại.";
        if (mode === "register") setRegError(msg);
        else setLoginError(msg);
        toast.error(msg);
      } finally {
        setIsLoginLoading(false);
      }
    },
    [clearErrors, login, mode, onClose, onSuccess, router]
  );

  useEffect(() => {
    if (!isOpen || !googleClientId) return;
    const renderGoogleButton = () => {
      if (typeof window !== "undefined" && window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        const targetRef = mode === "register" ? googleRegisterRef.current : googleLoginRef.current;
        if (targetRef) {
          targetRef.innerHTML = "";
          window.google.accounts.id.renderButton(targetRef, {
            type: "standard",
            shape: "rectangular",
            theme: "outline",
            text: mode === "register" ? "signup_with" : "signin_with",
            size: "large",
            logo_alignment: "left",
            width: targetRef.offsetWidth > 250 ? targetRef.offsetWidth : 360,
          });
        }
      }
    };
    if (window.google?.accounts?.id) {
      renderGoogleButton();
    } else {
      const timer = setInterval(() => {
        if (window.google?.accounts?.id) {
          renderGoogleButton();
          clearInterval(timer);
        }
      }, 300);
      return () => clearInterval(timer);
    }
  }, [isOpen, mode, googleClientId, handleGoogleCredentialResponse]);

  if (!isOpen) return null;

  // Handlers
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!loginIdentity.trim() || !loginPassword.trim()) {
      setLoginError("Vui lòng điền đầy đủ thông tin đăng nhập");
      return;
    }
    setIsLoginLoading(true);
    try {
      const res = await authApi.login({ email: loginIdentity.trim(), password: loginPassword });
      if (res.success && res.data) {
        login(res.data.accessToken, res.data.refreshToken, res.data.user);
        toast.success("Đăng nhập thành công! Chào mừng trở lại.");
        onClose();
        if (onSuccess) onSuccess();
        else router.refresh();
      } else {
        setLoginError(res.message || "Tài khoản hoặc mật khẩu không chính xác");
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setLoginError(errorObj.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    if (regUsername.trim().length < 4) { setRegError("Tên đăng nhập tối thiểu 4 ký tự"); return; }
    if (!regEmail.includes("@")) { setRegError("Địa chỉ email không hợp lệ"); return; }
    if (regPassword.length < 8) { setRegError("Mật khẩu phải có tối thiểu 8 ký tự"); return; }
    if (regPassword !== regConfirmPassword) { setRegError("Mật khẩu xác nhận không khớp"); return; }
    if (!regTermsAgreed) { setRegError("Vui lòng đồng ý với Điều khoản dịch vụ"); return; }
    setIsRegLoading(true);
    try {
      const res = await authApi.register({ username: regUsername.trim(), email: regEmail.trim(), password: regPassword });
      if (res.success) {
        setRegStep("otp");
        setCountdown(300);
        toast.success("Mã kích hoạt OTP đã được gửi tới email của bạn!");
      } else {
        setRegError(res.message || "Đăng ký không thành công");
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setRegError(errorObj.response?.data?.message || "Đăng ký không thành công. Tài khoản hoặc email có thể đã tồn tại.");
    } finally {
      setIsRegLoading(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    if (regOtp.trim().length < 6) { setRegError("Vui lòng nhập đủ 6 chữ số OTP"); return; }
    setIsRegLoading(true);
    try {
      const res = await authApi.verifyOtp({ email: regEmail.trim(), otp: regOtp.trim() });
      if (res.success) {
        toast.success("Xác thực tài khoản thành công! Đang đăng nhập...");
        try {
          const loginRes = await authApi.login({ email: regEmail.trim(), password: regPassword });
          if (loginRes.success && loginRes.data) {
            login(loginRes.data.accessToken, loginRes.data.refreshToken, loginRes.data.user);
            setTimeout(() => {
              onClose();
              if (onSuccess) onSuccess();
              else router.refresh();
            }, 200);
            return;
          }
        } catch { /* If auto login fails, switch to login tab */ }
        handleSwitchMode("login");
      } else {
        setRegError(res.message || "Mã OTP không hợp lệ hoặc đã hết hạn");
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setRegError(errorObj.response?.data?.message || "Mã xác thực không hợp lệ");
    } finally {
      setIsRegLoading(false);
    }
  };

  const handleForgotEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    if (!forgotEmail.trim()) { setForgotError("Vui lòng nhập email tài khoản của bạn"); return; }
    setIsForgotLoading(true);
    try {
      const res = await authApi.forgotPassword({ email: forgotEmail.trim() });
      if (res.success) {
        setForgotStep("reset");
        toast.success("Mã xác thực khôi phục mật khẩu đã được gửi!");
      } else {
        setForgotError(res.message || "Không thể gửi mã khôi phục mật khẩu");
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setForgotError(errorObj.response?.data?.message || "Không tìm thấy tài khoản với email này.");
    } finally {
      setIsForgotLoading(false);
    }
  };

  const handleForgotResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    if (!forgotOtp.trim()) { setForgotError("Vui lòng nhập mã xác thực OTP"); return; }
    if (forgotNewPassword.length < 8) { setForgotError("Mật khẩu mới tối thiểu 8 ký tự"); return; }
    if (forgotNewPassword !== forgotConfirmPassword) { setForgotError("Mật khẩu xác nhận không khớp"); return; }
    setIsForgotLoading(true);
    try {
      const res = await authApi.resetPassword({ email: forgotEmail.trim(), otp: forgotOtp.trim(), newPassword: forgotNewPassword });
      if (res.success) {
        toast.success("Đổi mật khẩu thành công! Vui lòng đăng nhập.");
        handleSwitchMode("login");
      } else {
        setForgotError(res.message || "Đổi mật khẩu thất bại");
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setForgotError(errorObj.response?.data?.message || "Khôi phục mật khẩu thất bại.");
    } finally {
      setIsForgotLoading(false);
    }
  };

  const handleSocialClick = (provider: string) => {
    if (provider === "Google") {
      if (!googleClientId) {
        toast.error("Cổng đăng nhập Google đang được kết nối, vui lòng thử lại sau giây lát.");
        return;
      }
      if (window.google?.accounts?.id) {
        window.google.accounts.id.prompt();
      } else {
        toast("Đang kết nối cổng đăng nhập Google...", { icon: "🔗" });
      }
    } else {
      toast(`Tính năng đăng nhập với ${provider} đang được phát triển`, { icon: "ℹ️" });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 select-none animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-4xl xl:max-w-5xl bg-white rounded-lg shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5),0_10px_25px_-5px_rgba(15,23,42,0.3)] overflow-hidden border border-slate-200 ring-1 ring-black/5 flex flex-col md:flex-row min-h-[580px] md:min-h-[660px] max-h-[92vh] animate-modalPop"
      >
        {/* Left Panel */}
        <AuthDrawerLeftPanel mode={mode} />

        {/* Right Column: Form */}
        <div className="w-full md:w-7/12 lg:w-1/2 bg-white p-6 sm:p-8 md:p-10 flex flex-col justify-between relative overflow-y-auto">
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Đóng cửa sổ"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>

          {mode === "login" && (
            <LoginForm
              loginIdentity={loginIdentity}
              loginPassword={loginPassword}
              showPassword={showPassword}
              rememberMe={rememberMe}
              loginError={loginError}
              isLoginLoading={isLoginLoading}
              googleClientId={googleClientId}
              googleLoginRef={googleLoginRef}
              onIdentityChange={setLoginIdentity}
              onPasswordChange={setLoginPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
              onRememberMeChange={setRememberMe}
              onSubmit={handleLoginSubmit}
              onSwitchMode={handleSwitchMode}
              onSocialClick={handleSocialClick}
            />
          )}

          {mode === "register" && (
            <RegisterForm
              regStep={regStep}
              regUsername={regUsername}
              regEmail={regEmail}
              regPassword={regPassword}
              regConfirmPassword={regConfirmPassword}
              regTermsAgreed={regTermsAgreed}
              showRegPassword={showRegPassword}
              showRegConfirmPassword={showRegConfirmPassword}
              regOtp={regOtp}
              countdown={countdown}
              regError={regError}
              isRegLoading={isRegLoading}
              googleClientId={googleClientId}
              googleRegisterRef={googleRegisterRef}
              onUsernameChange={setRegUsername}
              onEmailChange={setRegEmail}
              onPasswordChange={setRegPassword}
              onConfirmPasswordChange={setRegConfirmPassword}
              onTermsChange={setRegTermsAgreed}
              onTogglePassword={() => setShowRegPassword(!showRegPassword)}
              onToggleConfirmPassword={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
              onOtpChange={setRegOtp}
              onRegisterSubmit={handleRegisterSubmit}
              onOtpVerify={handleOtpVerify}
              onBackToRegister={() => setRegStep("register")}
              onSwitchMode={handleSwitchMode}
              onSocialClick={handleSocialClick}
            />
          )}

          {mode === "forgot-password" && (
            <ForgotPasswordForm
              forgotStep={forgotStep}
              forgotEmail={forgotEmail}
              forgotOtp={forgotOtp}
              forgotNewPassword={forgotNewPassword}
              forgotConfirmPassword={forgotConfirmPassword}
              showForgotNewPassword={showForgotNewPassword}
              forgotError={forgotError}
              isForgotLoading={isForgotLoading}
              onEmailChange={setForgotEmail}
              onOtpChange={setForgotOtp}
              onNewPasswordChange={setForgotNewPassword}
              onConfirmPasswordChange={setForgotConfirmPassword}
              onToggleNewPassword={() => setShowForgotNewPassword(!showForgotNewPassword)}
              onEmailSubmit={handleForgotEmailSubmit}
              onResetSubmit={handleForgotResetSubmit}
              onSwitchMode={handleSwitchMode}
            />
          )}
        </div>
      </div>
    </div>
  );
};
