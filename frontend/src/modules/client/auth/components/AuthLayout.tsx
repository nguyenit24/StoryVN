"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  const pathname = usePathname();
  const isLogin = pathname?.includes("/dang-nhap") || pathname?.includes("/login");
  const isRegister = pathname?.includes("/dang-ky") || pathname?.includes("/register");

  return (
    <div className="min-h-screen w-full bg-zinc-100 flex flex-col justify-between text-zinc-900 font-sans relative selection:bg-zinc-900 selection:text-white">
      {/* Background architectural grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(to right, #000 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Header bar */}
      <header className="relative z-10 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="StoryVN Logo"
              className="w-8 h-8 object-contain shrink-0 transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-widest text-zinc-950 uppercase font-mono">
                STORYVN
              </span>
              <span className="text-[10px] text-zinc-500 tracking-wider uppercase font-mono">
                Reader & Creator
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="text-xs font-semibold uppercase tracking-wider text-zinc-600 hover:text-zinc-950 transition-colors border border-zinc-200 bg-white px-3 py-1.5 hover:border-zinc-400"
          >
            Trang chủ &rarr;
          </Link>
        </div>
      </header>

      {/* Main Form Center */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10 my-4">
        <div className="w-full max-w-md bg-white border border-zinc-300 shadow-xl shadow-zinc-200/50">
          {/* Top decorative accent line */}
          <div className="h-1 bg-zinc-950 w-full" />

          {/* Navigation Tab: Login vs Register */}
          <div className="grid grid-cols-2 border-b border-zinc-200 text-xs font-bold uppercase tracking-wider text-center">
            <Link
              href="/dang-nhap"
              className={`py-3.5 border-r border-zinc-200 transition-colors ${isLogin
                  ? "bg-zinc-950 text-white font-bold"
                  : "bg-zinc-50 text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100"
                }`}
            >
              Đăng nhập
            </Link>
            <Link
              href="/dang-ky"
              className={`py-3.5 transition-colors ${isRegister
                  ? "bg-zinc-950 text-white font-bold"
                  : "bg-zinc-50 text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100"
                }`}
            >
              Đăng ký
            </Link>
          </div>

          <div className="p-6 sm:p-8">
            <div className="mb-6 text-left">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 uppercase font-mono">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>

            {children}
          </div>
        </div>
      </main>

      {/* Footer bar */}
      <footer className="relative z-10 w-full border-t border-zinc-200 bg-white px-6 py-4 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} StoryVN. Bảo lưu mọi quyền.</span>
          <div className="flex items-center gap-4 text-[11px] uppercase tracking-wider">
            <a href="#" className="hover:text-zinc-950 transition-colors">
              Điều khoản
            </a>
            <span className="text-zinc-300">&bull;</span>
            <a href="#" className="hover:text-zinc-950 transition-colors">
              Bảo mật
            </a>
            <span className="text-zinc-300">&bull;</span>
            <a href="#" className="hover:text-zinc-950 transition-colors">
              Hỗ trợ
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
