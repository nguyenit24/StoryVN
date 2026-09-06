"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { setTokens, setStoredUser } from "@/lib/auth/token";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

interface AuthDrawerProps {
  isOpen: boolean;
  mode: "login" | "register";
  onClose: () => void;
  onSwitchMode: (mode: "login" | "register") => void;
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

  // Lock body scroll when drawer is open
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

  // Timer countdown for OTP
  useEffect(() => {
    let interval: any;
    if (isOpen && mode === "register" && regStep === "otp" && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, mode, regStep, countdown]);

  // Reset errors when mode changes
  useEffect(() => {
    setLoginGeneralError(null);
    setLoginSuccessMessage(null);
    setLoginErrors({});
    setRegGeneralError(null);
    setRegSuccessMessage(null);
    setRegErrors({});
  }, [mode]);

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
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
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
    } catch (err: any) {
      setRegGeneralError(
        err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại sau."
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
            onSwitchMode("login");
            setLoginEmail(regEmail);
          }, 800);
        }
      } else {
        setRegGeneralError(verifyRes.message || "Mã OTP không chính xác");
      }
    } catch (err: any) {
      setRegGeneralError(
        err.response?.data?.message || "Xác thực OTP thất bại. Vui lòng thử lại."
      );
    } finally {
      setIsRegLoading(false);
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
        className={`fixed inset-0 bg-zinc-950/40 backdrop-blur-xs z-40 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Slide-Over Panel (From Left to Right) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-full sm:max-w-md bg-white border-r border-zinc-300 shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Cửa sổ đăng nhập và đăng ký"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Accent Line */}
        <div className="h-1 bg-zinc-950 w-full shrink-0" />

        {/* Drawer Header Bar */}
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-zinc-950 flex items-center justify-center text-white font-mono font-bold text-xs tracking-wider">
              S
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-widest text-zinc-950 uppercase font-mono leading-none">
                STORYVN
              </span>
              <span className="text-[10px] text-zinc-500 tracking-wider uppercase font-mono mt-0.5">
                Tài khoản độc giả
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 border border-transparent hover:border-zinc-300 transition-colors cursor-pointer text-base"
            title="Đóng cửa sổ (Esc)"
          >
            <span className="text-xl font-light leading-none">&times;</span>
          </button>
        </div>

        {/* Segmented Tab Bar */}
        <div className="grid grid-cols-2 border-b border-zinc-200 text-xs font-bold uppercase tracking-wider text-center shrink-0">
          <button
            type="button"
            onClick={() => onSwitchMode("login")}
            className={`py-3.5 border-r border-zinc-200 transition-colors cursor-pointer font-mono ${
              mode === "login"
                ? "bg-zinc-950 text-white font-bold"
                : "bg-zinc-50 text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100"
            }`}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => onSwitchMode("register")}
            className={`py-3.5 transition-colors cursor-pointer font-mono ${
              mode === "register"
                ? "bg-zinc-950 text-white font-bold"
                : "bg-zinc-50 text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100"
            }`}
          >
            Đăng ký
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-6">
          {mode === "login" ? (
            /* ==================== LOGIN FORM ==================== */
            <div className="space-y-6 animate-fadeIn">
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
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
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
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
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

                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Tính năng quên mật khẩu đang được phát triển.");
                    }}
                    className="font-medium text-zinc-600 hover:text-zinc-950 underline underline-offset-2"
                  >
                    Quên mật khẩu?
                  </a>
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

                <div className="pt-4 border-t border-zinc-200 text-center text-xs text-zinc-600">
                  Chưa có tài khoản?{" "}
                  <button
                    type="button"
                    onClick={() => onSwitchMode("register")}
                    className="font-bold text-zinc-950 underline underline-offset-4 hover:text-zinc-700 cursor-pointer"
                  >
                    Đăng ký tài khoản mới &rarr;
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* ==================== REGISTER FORM ==================== */
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-zinc-950 uppercase font-mono">
                  {regStep === "register" ? "Tạo tài khoản" : "Xác thực OTP"}
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
                        <a href="#" className="font-semibold underline text-zinc-950">
                          Điều khoản dịch vụ
                        </a>{" "}
                        và{" "}
                        <a href="#" className="font-semibold underline text-zinc-950">
                          Chính sách bảo mật
                        </a>
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
                      onClick={() => onSwitchMode("login")}
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
                      Nếu đang thử nghiệm local, hãy xem log ở terminal backend.
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
          )}
        </div>

        {/* Footer info bar inside drawer */}
        <div className="px-6 py-3 border-t border-zinc-200 bg-zinc-50 text-[11px] text-zinc-500 flex items-center justify-between shrink-0">
          <span>&copy; StoryVN Platform</span>
          <span className="font-mono text-[10px] text-zinc-400">ESC để đóng</span>
        </div>
      </aside>
    </>
  );
};
