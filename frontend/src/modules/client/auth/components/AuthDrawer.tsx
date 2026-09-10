"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/modules/client/auth/services/auth.service";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

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

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  const googleLoginRef = useRef<HTMLDivElement>(null);
  const googleRegisterRef = useRef<HTMLDivElement>(null);

  // -------------------- LOGIN STATE --------------------
  const [loginIdentity, setLoginIdentity] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // -------------------- REGISTER STATE --------------------
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

  // -------------------- FORGOT PASSWORD STATE --------------------
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


  // -------------------- LOGIN HANDLER --------------------
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginIdentity.trim() || !loginPassword.trim()) {
      setLoginError("Vui lòng điền đầy đủ thông tin đăng nhập");
      return;
    }

    setIsLoginLoading(true);
    try {
      const res = await authApi.login({
        email: loginIdentity.trim(),
        password: loginPassword,
      });

      if (res.success && res.data) {
        login(res.data.accessToken, res.data.refreshToken, res.data.user);
        toast.success("Đăng nhập thành công! Chào mừng trở lại.");
        onClose();
        if (onSuccess) {
          onSuccess();
        } else {
          router.refresh();
        }
      } else {
        setLoginError(res.message || "Tài khoản hoặc mật khẩu không chính xác");
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setLoginError(
        errorObj.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin."
      );
    } finally {
      setIsLoginLoading(false);
    }
  };

  // -------------------- REGISTER HANDLERS --------------------
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (regUsername.trim().length < 4) {
      setRegError("Tên đăng nhập tối thiểu 4 ký tự");
      return;
    }
    if (!regEmail.includes("@")) {
      setRegError("Địa chỉ email không hợp lệ");
      return;
    }
    if (regPassword.length < 8) {
      setRegError("Mật khẩu phải có tối thiểu 8 ký tự");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError("Mật khẩu xác nhận không khớp");
      return;
    }
    if (!regTermsAgreed) {
      setRegError("Vui lòng đồng ý với Điều khoản dịch vụ");
      return;
    }

    setIsRegLoading(true);
    try {
      const res = await authApi.register({
        username: regUsername.trim(),
        email: regEmail.trim(),
        password: regPassword,
      });

      if (res.success) {
        setRegStep("otp");
        setCountdown(300);
        toast.success("Mã kích hoạt OTP đã được gửi tới email của bạn!");
      } else {
        setRegError(res.message || "Đăng ký không thành công");
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setRegError(
        errorObj.response?.data?.message || "Đăng ký không thành công. Tài khoản hoặc email có thể đã tồn tại."
      );
    } finally {
      setIsRegLoading(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (regOtp.trim().length < 6) {
      setRegError("Vui lòng nhập đủ 6 chữ số OTP");
      return;
    }

    setIsRegLoading(true);
    try {
      const res = await authApi.verifyOtp({
        email: regEmail.trim(),
        otp: regOtp.trim(),
      });

      if (res.success) {
        toast.success("Xác thực tài khoản thành công! Đang đăng nhập...");
        try {
          const loginRes = await authApi.login({
            email: regEmail.trim(),
            password: regPassword,
          });
          if (loginRes.success && loginRes.data) {
            login(loginRes.data.accessToken, loginRes.data.refreshToken, loginRes.data.user);
            setTimeout(() => {
              onClose();
              if (onSuccess) onSuccess();
              else router.refresh();
            }, 200);
            return;
          }
        } catch {
          // If auto login fails, smoothly switch to login tab
        }
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

  // -------------------- FORGOT PASSWORD HANDLERS --------------------
  const handleForgotEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);

    if (!forgotEmail.trim()) {
      setForgotError("Vui lòng nhập email tài khoản của bạn");
      return;
    }

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

    if (!forgotOtp.trim()) {
      setForgotError("Vui lòng nhập mã xác thực OTP");
      return;
    }
    if (forgotNewPassword.length < 8) {
      setForgotError("Mật khẩu mới tối thiểu 8 ký tự");
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError("Mật khẩu xác nhận không khớp");
      return;
    }

    setIsForgotLoading(true);
    try {
      const res = await authApi.resetPassword({
        email: forgotEmail.trim(),
        otp: forgotOtp.trim(),
        newPassword: forgotNewPassword,
      });

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
        console.warn("[StoryVN] Chưa tải hoặc chưa cấu hình NEXT_PUBLIC_GOOGLE_CLIENT_ID trong file .env");
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
      {/* Background Click to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Dialog Wrapper (Squarer & Elevated 3D Floating Pop-up) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-4xl xl:max-w-5xl bg-white rounded-lg shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5),0_10px_25px_-5px_rgba(15,23,42,0.3)] overflow-hidden border border-slate-200 ring-1 ring-black/5 flex flex-col md:flex-row min-h-[580px] md:min-h-[660px] max-h-[92vh] animate-modalPop"
      >
        {/* ==================== LEFT COLUMN: ARTISTIC SHOWCASE ==================== */}
        <div className="hidden md:flex md:w-5/12 lg:w-1/2 relative bg-slate-950 overflow-hidden flex-col justify-between p-8 lg:p-10 text-white shrink-0">
          {/* Background Image with Soft Vignette */}
          <img
            alt="StoryVN Không Gian Văn Học Số"
            className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition-transform duration-700 hover:scale-100"
            src={
              mode === "register"
                ? "https://lh3.googleusercontent.com/aida-public/AB6AXuC448_PDwq37D1runHB47hnmR02N8d6Xm0gN5pj-fE-ODFFXwbMQwAdH1SqTLiX23nPF2O9BGTZ2T1C50RZ4RObro4DfrwMGArd0M4OPoI1VnnklZmomNcx64HK6eJLRFwfikKgy6oI_EjBe-kNHMEOhUYnFtzUq3rZFpxJ7D8Qv_KpvJWfk-VfpA8mQuZHdD1L1_xCbWaWbU9EHMvIfX5RsfsZQsX-DRHZHYcrHecaw4GJW32MptOqUA"
                : "https://lh3.googleusercontent.com/aida-public/AB6AXuDCTqBteeVbXG7NQKSeJeFGG0v_cy7L9DMzuD02zpWf09Gy7Z8W2CLcwU8oykB4tAZMHEqufNvOIALTYBX6QaikjuQZH3MxZFsRMEB-YfE1HbFX1kARbIWn2Cc8mwSXFtUE7M08mpLMLseHyzN9RLZirWCogCEI-JHXiqL4LdIC2w32CNo8FlJX_bX2gFmvSr6HGYHRJ7J1tKjuIb_Rre5FQNq16mgKwtOM_CaRylxVfwSMCCO90Shjng"
            }
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/65 to-slate-950/40" />

          {/* Top Brand Header (Clean, no Tac quyen badge) */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/30">
                S
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white">StoryVN</span>
                <p className="text-xs text-slate-300 font-normal">Nền tảng văn học số độc quyền</p>
              </div>
            </div>
          </div>

          {/* Middle Quote */}
          <div className="relative z-10 my-auto py-6 space-y-3 max-w-sm">
            <div className="inline-flex items-center gap-1.5 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[16px]">stars</span>
              <span>Hội đồng tuyển chọn StoryVN</span>
            </div>
            <p className="text-slate-100 text-base leading-relaxed italic font-light">
              &ldquo;Nơi mỗi trang viết mở ra một hành trình cảm xúc, và từng câu chữ đều mang hơi thở của văn học Việt đương đại.&rdquo;
            </p>
          </div>

          {/* Bottom Literary Stats */}
          <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-400 text-[18px]">menu_book</span>
              <span className="text-xs">50.000+ tác phẩm</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <span className="material-symbols-outlined text-[18px]">group</span>
              <span className="text-xs">120.000+ độc giả</span>
            </div>
          </div>
        </div>

        {/* ==================== RIGHT COLUMN: SPACIOUS FORM ==================== */}
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

          {/* -------------------- MODE: LOGIN -------------------- */}
          {mode === "login" && (
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

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Identity Input with Account Icon */}
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
                      onChange={(e) => setLoginIdentity(e.target.value)}
                      placeholder="vd: docgia@storyvn.vn hoặc username"
                      required
                      className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent border-none p-0 outline-none"
                    />
                  </div>
                </div>

                {/* Password Input with Lock Icon and Eye Toggle */}
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
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Nhập mật khẩu của bạn"
                      required
                      className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent border-none p-0 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
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
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-slate-600 text-xs sm:text-sm">Ghi nhớ đăng nhập</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleSwitchMode("forgot-password")}
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
                <span className="shrink-0 mx-4 text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  Hoặc
                </span>
                <div className="grow border-t border-slate-200"></div>
              </div>

              {/* ONLY Google Social Button */}
              {googleClientId ? (
                <div className="w-full flex justify-center items-center min-h-[44px]">
                  <div ref={googleLoginRef} className="w-full flex justify-center" />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSocialClick("Google")}
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
                    onClick={() => handleSwitchMode("register")}
                    className="font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer ml-1"
                  >
                    Đăng ký ngay
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* -------------------- MODE: REGISTER -------------------- */}
          {mode === "register" && (
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

                  <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                    {/* Username Input with Icon */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Tên tài khoản / Biệt danh <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative flex items-center border border-slate-300 hover:border-slate-400 rounded-lg px-3.5 py-2.5 bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                        <span className="material-symbols-outlined text-[20px] text-slate-400 mr-2.5 shrink-0">
                          person
                        </span>
                        <input
                          type="text"
                          value={regUsername}
                          onChange={(e) => setRegUsername(e.target.value)}
                          placeholder="vd: thanhphong (tối thiểu 4 ký tự)"
                          required
                          className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent border-none p-0 outline-none"
                        />
                      </div>
                    </div>

                    {/* Email Input with Icon */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Địa chỉ Email <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative flex items-center border border-slate-300 hover:border-slate-400 rounded-lg px-3.5 py-2.5 bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                        <span className="material-symbols-outlined text-[20px] text-slate-400 mr-2.5 shrink-0">
                          mail
                        </span>
                        <input
                          type="email"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="vd: bandoc@example.com"
                          required
                          className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent border-none p-0 outline-none"
                        />
                      </div>
                    </div>

                    {/* Password with Icon & Toggle */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Mật khẩu <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative flex items-center border border-slate-300 hover:border-slate-400 rounded-lg px-3.5 py-2.5 bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                        <span className="material-symbols-outlined text-[20px] text-slate-400 mr-2.5 shrink-0">
                          lock
                        </span>
                        <input
                          type={showRegPassword ? "text" : "password"}
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Tối thiểu 8 ký tự"
                          required
                          className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent border-none p-0 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="text-slate-400 hover:text-slate-600 shrink-0 cursor-pointer ml-1 p-0.5"
                          aria-label="Hiện hoặc ẩn mật khẩu"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {showRegPassword ? "visibility_off" : "visibility"}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password with Lock Reset Icon */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Xác nhận mật khẩu <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative flex items-center border border-slate-300 hover:border-slate-400 rounded-lg px-3.5 py-2.5 bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                        <span className="material-symbols-outlined text-[20px] text-slate-400 mr-2.5 shrink-0">
                          lock_reset
                        </span>
                        <input
                          type={showRegConfirmPassword ? "text" : "password"}
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          placeholder="Nhập lại mật khẩu"
                          required
                          className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent border-none p-0 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                          className="text-slate-400 hover:text-slate-600 shrink-0 cursor-pointer ml-1 p-0.5"
                          aria-label="Hiện hoặc ẩn mật khẩu xác nhận"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {showRegConfirmPassword ? "visibility_off" : "visibility"}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Terms Agreement */}
                    <label className="flex items-start gap-2.5 cursor-pointer select-none pt-1">
                      <input
                        type="checkbox"
                        checked={regTermsAgreed}
                        onChange={(e) => setRegTermsAgreed(e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                      />
                      <span className="text-xs text-slate-600 leading-tight">
                        Tôi đồng ý với{" "}
                        <span className="text-blue-600 font-medium hover:underline">Điều khoản dịch vụ</span>{" "}
                        và{" "}
                        <span className="text-blue-600 font-medium hover:underline">Quy chuẩn cộng đồng</span>.
                      </span>
                    </label>

                    {/* Submit Button */}
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
                      <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">
                        Hoặc
                      </span>
                    </div>
                  </div>

                  {/* ONLY Google Social Button */}
                  {googleClientId ? (
                    <div className="w-full flex justify-center items-center min-h-[44px]">
                      <div ref={googleRegisterRef} className="w-full flex justify-center" />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSocialClick("Google")}
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
                        onClick={() => handleSwitchMode("login")}
                        className="text-blue-600 hover:text-blue-700 font-semibold hover:underline cursor-pointer ml-1"
                      >
                        Đăng nhập ngay
                      </button>
                    </p>
                  </div>
                </>
              ) : (
                /* OTP Verification Substep with icon */
                <form onSubmit={handleOtpVerify} className="space-y-4 py-2">
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
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Mã xác thực OTP
                    </label>
                    <div className="relative flex items-center border border-slate-300 hover:border-slate-400 rounded-lg px-4 py-3 bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                      <span className="material-symbols-outlined text-[20px] text-slate-400 mr-3 shrink-0">
                        pin
                      </span>
                      <input
                        type="text"
                        maxLength={6}
                        value={regOtp}
                        onChange={(e) => setRegOtp(e.target.value)}
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
                      onClick={() => setRegStep("register")}
                      className="text-xs sm:text-sm text-slate-500 hover:text-slate-800 underline cursor-pointer"
                    >
                      Quay lại chỉnh sửa thông tin
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* -------------------- MODE: FORGOT PASSWORD -------------------- */}
          {mode === "forgot-password" && (
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
                <form onSubmit={handleForgotEmailSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email đăng ký
                    </label>
                    <div className="relative flex items-center border border-slate-300 hover:border-slate-400 rounded-lg px-3.5 py-2.5 sm:py-3 bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                      <span className="material-symbols-outlined text-[20px] text-slate-400 mr-2.5 shrink-0">
                        mail
                      </span>
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
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
                      onClick={() => handleSwitchMode("login")}
                      className="text-xs sm:text-sm text-blue-600 font-semibold hover:underline cursor-pointer inline-flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                      <span>Quay lại đăng nhập</span>
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleForgotResetSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Mã xác thực OTP</label>
                    <div className="relative flex items-center border border-slate-300 hover:border-slate-400 rounded-lg px-3.5 py-2.5 bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                      <span className="material-symbols-outlined text-[20px] text-slate-400 mr-2.5 shrink-0">
                        pin
                      </span>
                      <input
                        type="text"
                        maxLength={6}
                        value={forgotOtp}
                        onChange={(e) => setForgotOtp(e.target.value)}
                        placeholder="Nhập 6 số OTP"
                        required
                        className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent border-none p-0 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mật khẩu mới
                    </label>
                    <div className="relative flex items-center border border-slate-300 hover:border-slate-400 rounded-lg px-3.5 py-2.5 bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                      <span className="material-symbols-outlined text-[20px] text-slate-400 mr-2.5 shrink-0">
                        lock
                      </span>
                      <input
                        type={showForgotNewPassword ? "text" : "password"}
                        value={forgotNewPassword}
                        onChange={(e) => setForgotNewPassword(e.target.value)}
                        placeholder="Tối thiểu 8 ký tự"
                        required
                        className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent border-none p-0 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                        className="text-slate-400 hover:text-slate-600 shrink-0 cursor-pointer ml-1 p-0.5"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {showForgotNewPassword ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Xác nhận mật khẩu mới
                    </label>
                    <div className="relative flex items-center border border-slate-300 hover:border-slate-400 rounded-lg px-3.5 py-2.5 bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                      <span className="material-symbols-outlined text-[20px] text-slate-400 mr-2.5 shrink-0">
                        lock_reset
                      </span>
                      <input
                        type={showForgotNewPassword ? "text" : "password"}
                        value={forgotConfirmPassword}
                        onChange={(e) => setForgotConfirmPassword(e.target.value)}
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
                      onClick={() => handleSwitchMode("login")}
                      className="text-xs sm:text-sm text-blue-600 font-semibold hover:underline cursor-pointer"
                    >
                      ← Quay lại đăng nhập
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
