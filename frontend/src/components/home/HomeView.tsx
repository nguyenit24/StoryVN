"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthDrawer } from "@/components/auth/AuthDrawer";
import { getStoredUser, getAccessToken, clearAuth } from "@/lib/auth/token";
import { User } from "@/types/auth";
import { authApi } from "@/lib/api/auth";

interface HomeViewProps {
  initialAuthMode?: "login" | "register";
  initialOpen?: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({
  initialAuthMode = "login",
  initialOpen = false,
}) => {
  const router = useRouter();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">(initialAuthMode);
  const [user, setUser] = useState<User | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Sync user state on mount
  useEffect(() => {
    setIsMounted(true);
    const token = getAccessToken();
    const stored = getStoredUser();
    if (token && stored) {
      setUser(stored);
    }

    // Trigger initial slide-in if requested via route
    if (initialOpen) {
      // Small timeout ensures the DOM is rendered with -translate-x-full before sliding in
      const timer = setTimeout(() => {
        setIsAuthOpen(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [initialOpen]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === "/login") {
        setAuthMode("login");
        setIsAuthOpen(true);
      } else if (path === "/register") {
        setAuthMode("register");
        setIsAuthOpen(true);
      } else {
        setIsAuthOpen(false);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const openAuth = (mode: "login" | "register") => {
    setAuthMode(mode);
    setIsAuthOpen(true);
    // Update URL without full page reload
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", `/${mode}`);
    }
  };

  const closeAuth = () => {
    setIsAuthOpen(false);
    // Restore root URL
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", "/");
    }
  };

  const switchAuthMode = (mode: "login" | "register") => {
    setAuthMode(mode);
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", `/${mode}`);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore error on logout
    } finally {
      clearAuth();
      setUser(null);
      router.refresh();
    }
  };

  const handleAuthSuccess = () => {
    const stored = getStoredUser();
    if (stored) {
      setUser(stored);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col justify-between text-zinc-900 font-sans relative selection:bg-zinc-900 selection:text-white">
      {/* Background architectural grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(to right, #000 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Header */}
      <header className="relative z-20 border-b border-zinc-200 bg-white/90 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-zinc-950 flex items-center justify-center text-white font-mono font-bold text-sm tracking-wider border border-zinc-950 transition-transform group-hover:scale-95">
              S
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-widest text-zinc-950 uppercase font-mono">
                STORYVN
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {isMounted && user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/me"
                  className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-800 hover:text-black border border-zinc-300 px-3 py-2 hover:border-black transition-colors bg-white"
                >
                  <div className="w-4 h-4 bg-zinc-950 text-white flex items-center justify-center text-[10px] font-mono">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.displayName || user.username}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-red-600 px-2 py-2 transition-colors cursor-pointer"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => openAuth("login")}
                  className="text-xs font-semibold uppercase tracking-wider text-zinc-800 hover:text-black border border-zinc-300 px-4 py-2 hover:border-black transition-colors cursor-pointer bg-white"
                >
                  Đăng nhập
                </button>
                <button
                  type="button"
                  onClick={() => openAuth("register")}
                  className="text-xs font-semibold uppercase tracking-wider bg-zinc-950 text-white px-4 py-2 hover:bg-black transition-colors shadow-sm cursor-pointer"
                >
                  Đăng ký
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6 my-8">
        <div className="max-w-3xl w-full bg-white border border-zinc-300 p-8 sm:p-12 shadow-sm space-y-8">
          <div className="space-y-4">
            <div className="inline-block bg-zinc-100 border border-zinc-300 text-zinc-800 text-[11px] font-mono px-3 py-1 font-bold uppercase tracking-wider">
              NỀN TẢNG TRUYỆN VIỆT NAM
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-950 uppercase font-mono leading-tight">
              Khám phá &amp; Chia sẻ thế giới truyện
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-2xl">
              StoryVN mang đến trải nghiệm đọc và sáng tác truyện trực tuyến tối giản, mượt mà và hiện đại. Đăng ký ngay hôm nay để trở thành tác giả hoặc độc giả thân thiết.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-zinc-200 pt-8">
            <button
              type="button"
              onClick={() => openAuth("login")}
              className="group p-5 bg-zinc-50 border border-zinc-300 hover:border-zinc-950 hover:bg-white transition-all text-left cursor-pointer"
            >
              <div className="text-xs font-mono font-bold text-zinc-500 uppercase">
                TRUY CẬP
              </div>
              <div className="text-base font-bold text-zinc-950 mt-1 flex items-center justify-between">
                <span>Đăng nhập</span>
                <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Đăng nhập để vào hồ sơ cá nhân /me
              </p>
            </button>

            <button
              type="button"
              onClick={() => openAuth("register")}
              className="group p-5 bg-zinc-50 border border-zinc-300 hover:border-zinc-950 hover:bg-white transition-all text-left cursor-pointer"
            >
              <div className="text-xs font-mono font-bold text-zinc-500 uppercase">
                BẮT ĐẦU
              </div>
              <div className="text-base font-bold text-zinc-950 mt-1 flex items-center justify-between">
                <span>Đăng ký</span>
                <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Tạo tài khoản mới với xác thực OTP
              </p>
            </button>

            <Link
              href="/me"
              className="group p-5 bg-zinc-50 border border-zinc-300 hover:border-zinc-950 hover:bg-white transition-all text-left"
            >
              <div className="text-xs font-mono font-bold text-zinc-500 uppercase">
                HỒ SƠ
              </div>
              <div className="text-base font-bold text-zinc-950 mt-1 flex items-center justify-between">
                <span>Trang cá nhân /me</span>
                <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Xem thông tin tài khoản và vai trò
              </p>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-200 bg-white px-6 py-4 text-center text-xs text-zinc-500">
        &copy; {new Date().getFullYear()} StoryVN. Giao diện sáng đẹp góc vuông phong cách tối giản.
      </footer>

      {/* Auth Slide-over Drawer */}
      <AuthDrawer
        isOpen={isAuthOpen}
        mode={authMode}
        onClose={closeAuth}
        onSwitchMode={switchAuthMode}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};
