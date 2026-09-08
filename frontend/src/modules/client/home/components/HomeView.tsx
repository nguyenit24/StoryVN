"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthDrawer, AuthMode } from "@/components/auth/AuthDrawer";
import { getStoredUser, getAccessToken, setStoredUser, setTokens } from "@/lib/auth/token";
import { User } from "@/types/auth";
import { useAuth } from "@/context/AuthContext";
import { getFullImageUrl } from "@/common/utils/imageUrl";
import {
  HERO_FEATURED_STORY,
  HERO_CAROUSEL_ITEMS,
  HOT_STORIES_TODAY,
  NEW_RELEASES,
  LIVE_CHAPTERS,
  RANKINGS,
  TOP_AUTHORS,
  FORUM_HOT_TOPICS,
  GENRES,
  AppRole,
} from "@/features/story/mockStories";
import { LogoutConfirmModal } from "@/components/profile/LogoutConfirmModal";

interface HomeViewProps {
  initialAuthMode?: AuthMode;
  initialOpen?: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({
  initialAuthMode = "login",
  initialOpen = false,
}) => {
  const router = useRouter();

  // Auth Modal State
  const [isAuthOpen, setIsAuthOpen] = useState(initialOpen);
  const [authMode, setAuthMode] = useState<AuthMode>(initialAuthMode);
  const { user, logout: contextLogout } = useAuth();

  // Logout Modal & User Dropdown State
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [logoutModalMode, setLogoutModalMode] = useState<"current" | "all">("current");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Search & Navigation State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("Tất cả thể loại");
  const [quickFilter, setQuickFilter] = useState<string | null>(null);
  const [rankingTab, setRankingTab] = useState<"week" | "month" | "all">("week");

  // Carousel Active Index (Image 2)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

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
      } else if (path === "/forgot-password") {
        setAuthMode("forgot-password");
        setIsAuthOpen(true);
      } else {
        setIsAuthOpen(false);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const openAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    setIsAuthOpen(true);
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", `/${mode}`);
    }
  };

  const closeAuth = () => {
    setIsAuthOpen(false);
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", "/");
    }
  };

  const handleAuthSuccess = () => {
    // State được tự động đồng bộ qua AuthContext
  };

  const currentRole = (
    typeof user?.roleId === "object" && user?.roleId?.name
      ? user.roleId.name
      : user?.role || "USER"
  ).toUpperCase();

  // Filtered stories for Hot Section
  const displayedHotStories = useMemo(() => {
    return HOT_STORIES_TODAY.filter((story) => {
      const matchSearch =
        searchQuery.trim() === "" ||
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.genres.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchGenre =
        selectedGenre === "Tất cả thể loại" ||
        story.genres.some((g) => g.toLowerCase().includes(selectedGenre.toLowerCase()));

      let matchQuick = true;
      if (quickFilter === "FULL") matchQuick = story.status === "Hoàn thành" || story.badge === "FULL";
      if (quickFilter === "VIP") matchQuick = story.rating >= 4.8;
      if (quickFilter === "FREE") matchQuick = true;

      return matchSearch && matchGenre && matchQuick;
    });
  }, [searchQuery, selectedGenre, quickFilter]);

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans flex flex-col justify-between selection:bg-blue-600 selection:text-white">

      {/* ==================== 1. HEADER (EXACT MATCH TO IMAGE 2) ==================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3 transition-shadow">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 sm:gap-6">
          {/* Logo StoryVN with blue open book icon */}
          <div className="flex items-center gap-6 shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-[#1d72fe] flex items-center justify-center text-white shadow-md shadow-blue-500/25">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                StoryVN
              </span>
            </Link>

            {/* Navigation items from Image 2: Khám phá, Thể loại, Bảng xếp hạng, Diễn đàn, Tủ sách */}
            <nav className="hidden md:flex items-center gap-5 text-xs sm:text-sm font-semibold text-slate-600">
              <Link href="/" className="text-blue-600 font-bold hover:text-blue-700">
                Khám phá
              </Link>
              <button
                type="button"
                onClick={() => setSelectedGenre("Tất cả thể loại")}
                className="hover:text-slate-900 cursor-pointer"
              >
                Thể loại
              </button>
              <a href="#bang-xep-hang" className="hover:text-slate-900">
                Bảng xếp hạng
              </a>
              <Link href="/forum" className="hover:text-slate-900 flex items-center gap-1">
                <span>Diễn đàn</span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              </Link>
              <Link href="/me" className="hover:text-slate-900">
                Tủ sách
              </Link>
              {currentRole === "ADMIN" && (
                <Link
                  href="/admin"
                  className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-bold hover:bg-emerald-100 transition-colors"
                >
                  Admin Quản Trị
                </Link>
              )}
            </nav>
          </div>

          {/* Search bar with Ctrl K */}
          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-400 pointer-events-none">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Tìm kiếm truyện, tác giả, dịch giả..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100/90 border border-transparent focus:border-blue-400 focus:bg-white text-slate-800 text-xs sm:text-sm rounded-full pl-9 pr-14 py-2 outline-none transition-all placeholder:text-slate-400"
              />
              <span className="absolute right-3 px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-400 font-mono font-semibold shadow-2xs pointer-events-none">
                Ctrl K
              </span>
            </div>
          </div>

          {/* Right Action buttons: "+ Viết truyện", Bell, Avatar */}
          <div className="flex items-center gap-3 shrink-0">
            {/* "+ Viết truyện" Button */}
            <Link
              href="/me"
              onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  openAuth("login");
                }
              }}
              className="bg-[#1d72fe] hover:bg-blue-600 text-white text-xs sm:text-sm font-bold px-3.5 sm:px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <span>+ Viết truyện</span>
            </Link>

            {/* Notification Bell */}
            <button
              type="button"
              className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Thông báo"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>

            {/* User Avatar with Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-blue-400 transition-all cursor-pointer"
                >
                  <img
                    src={
                      getFullImageUrl(user.avatar) ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                    }
                    alt={user.displayName || user.username}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                  />
                </button>

                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-30 animate-fadeIn text-xs">
                      <div className="px-3 py-2 border-b border-slate-100">
                        <div className="font-bold text-slate-800 text-sm truncate">
                          {user.displayName || user.username}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                        <div className="mt-1.5 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                          {currentRole === "ADMIN"
                            ? "Quản trị viên (ADMIN)"
                            : currentRole === "AUTHOR"
                            ? "Tác giả StoryVN (AUTHOR)"
                            : "Độc giả thân thiết (USER)"}
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/me"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors font-medium"
                        >
                          <span>👤 Hồ sơ &amp; Tủ sách cá nhân</span>
                        </Link>

                        {currentRole === "USER" && (
                          <Link
                            href="/me"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-amber-700 font-bold bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors my-1"
                          >
                            <span>✍️ Nâng cấp lên Tác giả</span>
                          </Link>
                        )}

                        {currentRole === "AUTHOR" && (
                          <Link
                            href="/me"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-blue-700 font-bold bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors my-1"
                          >
                            <span>✏️ Viết truyện &amp; Studio</span>
                          </Link>
                        )}

                        {currentRole === "ADMIN" && (
                          <Link
                            href="/admin"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-purple-700 font-bold bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors my-1"
                          >
                            <span>⚙️ Quản trị hệ thống (Admin)</span>
                          </Link>
                        )}

                        <Link
                          href="/forum"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors font-medium"
                        >
                          <span>💬 Diễn đàn thảo luận</span>
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            setIsLogoutModalOpen(true);
                          }}
                          className="w-full text-left flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium cursor-pointer"
                        >
                          <span>🚪 Đăng xuất</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openAuth("login")}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer"
              >
                Đăng nhập
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ==================== MAIN CONTAINER ==================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-8 flex-1 w-full">
        {/* ==================== 2. HERO FEATURED STORY (IMAGE 2) ==================== */}
        <section className="relative rounded-3xl bg-gradient-to-r from-blue-50/90 via-indigo-50/60 to-purple-50/80 border border-blue-100/60 p-6 sm:p-10 overflow-hidden shadow-sm">
          {/* Subtle background graphic */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Badges row */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-xs">
                  <span>🏆 Top 1 Thịnh Hành</span>
                </span>
                <span className="bg-slate-800/10 text-slate-700 font-semibold text-xs px-3 py-1 rounded-full">
                  {HERO_FEATURED_STORY.genreBadge}
                </span>
                <span className="bg-blue-100 text-blue-700 font-semibold text-xs px-3 py-1 rounded-full">
                  Đang ra 2.154 chương
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                {HERO_FEATURED_STORY.title}
              </h1>

              {/* Author & Rating */}
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600">
                <span className="text-slate-800 font-bold">
                  {HERO_FEATURED_STORY.author}
                </span>
                <span>•</span>
                <span className="text-amber-500">★ 4.9 / 5.0</span>
                <span className="text-slate-400">({HERO_FEATURED_STORY.reviewCount})</span>
              </div>

              {/* Synopsis */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                {HERO_FEATURED_STORY.synopsis}
              </p>

              {/* Tags pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {["Hệ Thống", "Vô Địch Lưu", "Hài Hước", "Đặc Phái Quyền Đoàn"].map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 bg-white/80 border border-slate-200/80 rounded-lg text-xs font-medium text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => router.push("/me")}
                  className="bg-[#1d72fe] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                  <span>Đọc ngay C.1</span>
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/me")}
                  className="bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <span>Thêm vào Tủ sách</span>
                </button>

                <button
                  type="button"
                  className="w-11 h-11 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded-xl border border-slate-200/80 flex items-center justify-center shadow-xs transition-all cursor-pointer"
                  title="Chia sẻ truyện"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Side: 3D Book Cover & 3.8M Badge (4 cols) */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center relative">
              <div className="relative group">
                {/* Book cover 3D perspective mockup */}
                <div className="w-56 h-72 rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/30 border-4 border-white transform lg:rotate-2 group-hover:rotate-0 transition-transform duration-300 relative bg-slate-900">
                  <img
                    src={HERO_FEATURED_STORY.coverImage}
                    alt={HERO_FEATURED_STORY.title}
                    className="w-full h-full object-cover"
                  />
                  {/* HOT Badge */}
                  <span className="absolute top-3 left-3 bg-red-600 text-white font-black text-[10px] px-2 py-0.5 rounded shadow-md tracking-wider">
                    HOT
                  </span>
                </div>

                {/* Floating Metric Pill: 3.8M+ Lượt đọc kỳ này */}
                <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-black">
                    📊
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900">3.8M+</div>
                    <div className="text-[10px] text-slate-500 font-medium">Lượt đọc kỳ này</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Carousel Pills (Image 2) */}
          <div className="mt-8 pt-6 border-t border-slate-200/60 flex items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {HERO_CAROUSEL_ITEMS.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`px-3.5 py-1.5 rounded-full font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    currentSlideIndex === idx
                      ? "bg-white text-blue-600 shadow-xs font-bold border border-blue-200"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                  }`}
                >
                  {currentSlideIndex === idx && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  )}
                  <span>
                    {item.num}. {item.title}
                  </span>
                </button>
              ))}
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() =>
                  setCurrentSlideIndex(
                    (prev) => (prev - 1 + HERO_CAROUSEL_ITEMS.length) % HERO_CAROUSEL_ITEMS.length
                  )
                }
                className="w-8 h-8 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold transition-colors cursor-pointer"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() =>
                  setCurrentSlideIndex((prev) => (prev + 1) % HERO_CAROUSEL_ITEMS.length)
                }
                className="w-8 h-8 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold transition-colors cursor-pointer"
              >
                ›
              </button>
            </div>
          </div>
        </section>

        {/* ==================== 3. CATEGORY PILLS BAR ==================== */}
        <section className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            {GENRES.map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() => setSelectedGenre(genre)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedGenre === genre
                    ? "bg-[#1d72fe] text-white shadow-sm shadow-blue-500/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-medium">Lọc nhanh:</span>
            <button
              type="button"
              onClick={() => setQuickFilter(quickFilter === "FULL" ? null : "FULL")}
              className={`px-2.5 py-1 rounded-lg border text-xs cursor-pointer ${
                quickFilter === "FULL"
                  ? "border-blue-500 bg-blue-50 text-blue-700 font-bold"
                  : "border-slate-200 hover:bg-slate-50 text-slate-700"
              }`}
            >
              • Mới hoàn thành
            </button>
            <button
              type="button"
              onClick={() => setQuickFilter(quickFilter === "VIP" ? null : "VIP")}
              className={`px-2.5 py-1 rounded-lg border text-xs cursor-pointer ${
                quickFilter === "VIP"
                  ? "border-amber-500 bg-amber-50 text-amber-700 font-bold"
                  : "border-slate-200 hover:bg-slate-50 text-slate-700"
              }`}
            >
              • VIP
            </button>
            <button
              type="button"
              onClick={() => setQuickFilter(quickFilter === "FREE" ? null : "FREE")}
              className={`px-2.5 py-1 rounded-lg border text-xs cursor-pointer ${
                quickFilter === "FREE"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-bold"
                  : "border-slate-200 hover:bg-slate-50 text-slate-700"
              }`}
            >
              • Miễn phí
            </button>
          </div>
        </section>

        {/* ==================== 4. TWO-COLUMN MAIN GRID ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ==================== LEFT COLUMN (8 cols) ==================== */}
          <div className="lg:col-span-8 space-y-10">
            {/* --- SECTION 1: TRUYỆN HOT TRONG NGÀY --- */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-[#1d72fe] rounded-full" />
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    Truyện Hot Trong Ngày
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedGenre("Tất cả thể loại")}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>Xem tất cả</span>
                  <span>›</span>
                </button>
              </div>

              {/* 8 Cards Grid (4 cols x 2 rows) matching Image 2 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {displayedHotStories.map((story) => (
                  <div
                    key={story.id}
                    onClick={() => router.push("/me")}
                    className="group cursor-pointer bg-white rounded-2xl p-2.5 border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      {/* Cover with Badge */}
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2.5 bg-slate-100 shadow-2xs">
                        <img
                          src={story.coverImage}
                          alt={story.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {story.badge && (
                          <span
                            className={`absolute top-2 left-2 text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm ${
                              story.badge === "HOT"
                                ? "bg-red-600 text-white"
                                : "bg-blue-600 text-white"
                            }`}
                          >
                            {story.badge}
                          </span>
                        )}
                      </div>

                      {/* Genre Tag */}
                      <div className="text-[10px] font-bold tracking-wider text-blue-600 uppercase mb-1">
                        {story.genreBadge}
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-xs text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight mb-1">
                        {story.title}
                      </h3>
                    </div>

                    {/* Author & Chapter badge */}
                    <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="truncate max-w-[80px] text-slate-500 font-medium">
                        {story.author}
                      </span>
                      <span className="font-mono text-slate-600 font-semibold">
                        {story.latestChapter.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* --- SECTION 2: TRUYỆN MỚI RA MẮT --- */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded">
                    NEW
                  </span>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    Truyện Mới Ra Mắt
                  </h2>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 cursor-pointer text-xs"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 cursor-pointer text-xs"
                  >
                    ›
                  </button>
                </div>
              </div>

              {/* 3 cards matching Image 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {NEW_RELEASES.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => router.push("/me")}
                    className="bg-slate-50/70 hover:bg-white p-3 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all cursor-pointer flex gap-3 shadow-2xs"
                  >
                    <img
                      src={item.cover}
                      alt={item.title}
                      className="w-16 h-22 rounded-xl object-cover shrink-0 shadow-xs"
                    />
                    <div className="flex flex-col justify-between overflow-hidden">
                      <div>
                        <span className="text-[9px] font-bold text-blue-600 uppercase">
                          {item.genre}
                        </span>
                        <h4 className="font-bold text-xs text-slate-900 truncate">
                          {item.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                        <span className="truncate">{item.author}</span>
                        <span className="font-mono text-slate-600 font-bold">{item.chapter}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* --- SECTION 3: MỚI LÊN CHƯƠNG (TRỰC TIẾP) --- */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 text-lg">⚡</span>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    Mới Lên Chương (Trực Tiếp)
                  </h2>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Tự động cập nhật</span>
                </div>
              </div>

              {/* Live Chapter Table */}
              <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 font-semibold border-b border-slate-100">
                      <th className="py-3 px-4 uppercase text-[10px] tracking-wider w-28">Thể loại</th>
                      <th className="py-3 px-4 uppercase text-[10px] tracking-wider">Tên truyện</th>
                      <th className="py-3 px-4 uppercase text-[10px] tracking-wider">Chương mới</th>
                      <th className="py-3 px-4 uppercase text-[10px] tracking-wider hidden sm:table-cell">Tác giả / Dịch giả</th>
                      <th className="py-3 px-4 uppercase text-[10px] tracking-wider text-right">Thời gian</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {LIVE_CHAPTERS.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${row.color}`}>
                            {row.genre}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900 hover:text-blue-600 cursor-pointer">
                          {row.title}
                        </td>
                        <td className="py-3 px-4 text-blue-600 hover:underline cursor-pointer truncate max-w-[200px]">
                          {row.chapter}
                        </td>
                        <td className="py-3 px-4 text-slate-500 hidden sm:table-cell">
                          {row.author}
                        </td>
                        <td className="py-3 px-4 text-slate-400 text-right whitespace-nowrap text-[11px]">
                          {row.time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-full transition-all cursor-pointer"
                >
                  Xem thêm cập nhật ∨
                </button>
              </div>
            </section>

            {/* --- SECTION 4: VIẾT TIẾP GIẤC MƠ CÙNG STORYVN BANNER --- */}
            <section className="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                <div className="sm:col-span-8 space-y-3">
                  <span className="inline-block px-3 py-1 bg-white/10 text-blue-300 text-[10px] font-bold rounded-full tracking-wider uppercase">
                    CHƯƠNG TRÌNH ĐỘC QUYỀN 2024
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    Viết Tiếp Giấc Mơ Cùng StoryVN
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
                    Chia sẻ nhuận bút tới 75%, bảo hộ bản quyền toàn diện tại Việt Nam, cùng xây dựng hệ tác phẩm kỳ ảo đỉnh cao đưa tác giả vươn tầm.
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (user) router.push("/me");
                        else openAuth("login");
                      }}
                      className="bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      Mở Studio Tác Giả
                    </button>
                    <Link
                      href="/forum"
                      className="text-xs font-bold text-blue-300 hover:text-white transition-colors"
                    >
                      Tìm hiểu chính sách →
                    </Link>
                  </div>
                </div>

                <div className="sm:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center space-y-2">
                  <div className="text-[10px] text-slate-300 uppercase font-semibold">
                    NHUẬN BÚT ĐÃ CHI TRẢ
                  </div>
                  <div className="text-2xl font-black text-amber-400">
                    4.2 Tỷ VNĐ
                  </div>
                  {/* Mini Graphic chart wave */}
                  <div className="h-8 flex items-end justify-center gap-1.5 pt-2">
                    <span className="w-2 h-3 bg-blue-400/50 rounded-xs" />
                    <span className="w-2 h-5 bg-blue-400/60 rounded-xs" />
                    <span className="w-2 h-4 bg-blue-400/70 rounded-xs" />
                    <span className="w-2 h-6 bg-blue-400/80 rounded-xs" />
                    <span className="w-2 h-8 bg-amber-400 rounded-xs" />
                  </div>
                  <div className="text-[9px] text-slate-400">
                    Ước tính tăng trưởng 14%
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ==================== RIGHT COLUMN (4 cols) ==================== */}
          <div className="lg:col-span-4 space-y-8" id="bang-xep-hang">
            {/* --- 1. BẢNG XẾP HẠNG --- */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-amber-500 text-lg">🏆</span>
                  <h3 className="font-black text-base text-slate-900">Bảng Xếp Hạng</h3>
                </div>
                <span className="text-[11px] text-blue-600 font-bold hover:underline cursor-pointer">
                  Đọc nhiều
                </span>
              </div>

              {/* Tabs: Tuần / Tháng / Tổng */}
              <div className="grid grid-cols-3 bg-slate-100 p-1 rounded-xl text-center text-xs font-bold text-slate-600">
                <button
                  type="button"
                  onClick={() => setRankingTab("week")}
                  className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                    rankingTab === "week" ? "bg-white text-blue-600 shadow-2xs font-black" : ""
                  }`}
                >
                  Tuần
                </button>
                <button
                  type="button"
                  onClick={() => setRankingTab("month")}
                  className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                    rankingTab === "month" ? "bg-white text-blue-600 shadow-2xs font-black" : ""
                  }`}
                >
                  Tháng
                </button>
                <button
                  type="button"
                  onClick={() => setRankingTab("all")}
                  className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                    rankingTab === "all" ? "bg-white text-blue-600 shadow-2xs font-black" : ""
                  }`}
                >
                  Tổng
                </button>
              </div>

              {/* Top 1, 2, 3 with covers */}
              <div className="space-y-3 pt-1">
                {RANKINGS.slice(0, 3).map((item) => (
                  <div
                    key={item.rank}
                    onClick={() => router.push("/me")}
                    className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                        item.rank === 1
                          ? "bg-amber-400 text-slate-950 shadow-xs"
                          : item.rank === 2
                          ? "bg-slate-300 text-slate-900"
                          : "bg-amber-700/80 text-white"
                      }`}
                    >
                      {item.rank}
                    </span>
                    <img
                      src={item.cover}
                      alt={item.title}
                      className="w-11 h-15 rounded-xl object-cover shrink-0 shadow-2xs"
                    />
                    <div className="flex-1 overflow-hidden">
                      <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                        {item.title}
                      </h4>
                      <div className="text-[10px] text-slate-400 truncate">{item.author}</div>
                      <div className="text-[10px] font-bold text-blue-600 font-mono mt-0.5">
                        {item.reads}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Ranks 4 to 10 */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                {RANKINGS.slice(3).map((item) => (
                  <div
                    key={item.rank}
                    onClick={() => router.push("/me")}
                    className="flex items-center justify-between text-xs py-1 px-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className="font-mono font-bold text-slate-400 w-4 text-center">
                        {item.rank}
                      </span>
                      <span className="font-semibold text-slate-700 group-hover:text-blue-600 transition-colors truncate">
                        {item.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-medium text-slate-400 shrink-0">
                      {item.reads}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* --- 2. VIP PREMIUM CARD --- */}
            <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-zinc-900 to-black p-5 text-white space-y-3.5 shadow-xl border border-amber-500/20 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/30">
                  ★ VIP PREMIUM
                </span>
                <span className="text-[11px] text-amber-400 font-mono font-semibold">
                  Chỉ 12.450đ/tháng
                </span>
              </div>

              <div>
                <h4 className="font-black text-base text-white">
                  Đọc Vô Hạn Không Giới Hạn
                </h4>
                <ul className="text-xs text-slate-300 space-y-1.5 mt-2 font-normal">
                  <li className="flex items-center gap-2">
                    <span className="text-amber-400">✓</span> Mở khóa toàn bộ 50,000+ chương VIP
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-400">✓</span> Giảm 20% khi mua phiếu thưởng tác giả
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-400">✓</span> Tải về Offline đọc ở app di động
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => openAuth("login")}
                className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                Nâng cấp VIP ngay
              </button>
            </div>

            {/* --- 3. TÁC GIẢ NỔI BẬT --- */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 text-base">✒️</span>
                  <h3 className="font-black text-base text-slate-900">Tác Giả Nổi Bật</h3>
                </div>
                <span className="text-[11px] text-blue-600 font-bold hover:underline cursor-pointer">
                  Khám phá
                </span>
              </div>

              <div className="space-y-3">
                {TOP_AUTHORS.map((author, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={author.avatar}
                        alt={author.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="font-bold text-xs text-slate-900 flex items-center gap-1">
                          <span>{author.name}</span>
                          {author.verified && (
                            <span className="text-blue-600 text-[10px]">✓</span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          {author.followers}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="px-3 py-1 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 font-bold text-xs rounded-full border border-blue-200 transition-all cursor-pointer"
                    >
                      Theo dõi
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* --- 4. DIỄN ĐÀN SÔI NỔI --- */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-purple-600 text-base">💬</span>
                  <h3 className="font-black text-base text-slate-900">Diễn Đàn Sôi Nổi</h3>
                </div>
                <Link
                  href="/forum"
                  className="text-[11px] text-blue-600 font-bold hover:underline"
                >
                  Xem thêm
                </Link>
              </div>

              <div className="space-y-3">
                {FORUM_HOT_TOPICS.map((topic, idx) => (
                  <Link
                    key={idx}
                    href="/forum"
                    className="block p-3 rounded-2xl bg-slate-50/70 hover:bg-white border border-transparent hover:border-slate-200 transition-all space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className={`px-2 py-0.5 rounded font-bold ${topic.tagColor}`}>
                        {topic.tag}
                      </span>
                      <span className="text-slate-400">{topic.time}</span>
                    </div>
                    <h5 className="font-bold text-xs text-slate-800 line-clamp-2 hover:text-blue-600 transition-colors">
                      {topic.title}
                    </h5>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span>{topic.author}</span>
                      <span className="flex items-center gap-1">
                        <span>💬</span> {topic.replies}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ==================== 5. FOOTER (IMAGE 2) ==================== */}
      <footer className="bg-slate-50 border-t border-slate-200/80 mt-16 pt-12 pb-8 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Col 1: Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#1d72fe] flex items-center justify-center text-white font-black text-sm">
                  S
                </div>
                <span className="text-lg font-black text-slate-900">StoryVN</span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                Nền tảng xuất bản trực tuyến và cộng đồng sáng tác tiểu thuyết bản quyền hàng đầu Việt Nam. Nơi hội tụ các tác giả tài năng, độc giả đam mê và các tác phẩm kỳ ảo đỉnh cao.
              </p>
              <div className="text-[11px] text-slate-400">
                🛡️ Giấy phép cung cấp dịch vụ MXH số: 248/GP-BTTTT cấp bởi Bộ TT&amp;TT
              </div>
            </div>

            {/* Col 2: Khám phá */}
            <div className="space-y-2.5">
              <h5 className="font-bold text-slate-900 text-sm">Khám phá</h5>
              <ul className="space-y-2 text-slate-500">
                <li><a href="#" className="hover:text-blue-600">Tiên Hiệp Kỳ Ảo</a></li>
                <li><a href="#" className="hover:text-blue-600">Huyền Huyễn</a></li>
                <li><a href="#" className="hover:text-blue-600">Ngôn Tình &amp; Đô Thị</a></li>
                <li><a href="#" className="hover:text-blue-600">Trùng Sinh Hệ Thống</a></li>
                <li><a href="#" className="hover:text-blue-600">Xuyên Không Giả Tưởng</a></li>
              </ul>
            </div>

            {/* Col 3: Dành cho tác giả */}
            <div className="space-y-2.5">
              <h5 className="font-bold text-slate-900 text-sm">Dành cho tác giả</h5>
              <ul className="space-y-2 text-slate-500">
                <li><Link href="/me" className="hover:text-blue-600">Creator Studio</Link></li>
                <li><a href="#" className="hover:text-blue-600">Chính sách nhuận bút</a></li>
                <li><a href="#" className="hover:text-blue-600">Bảo vệ bản quyền</a></li>
                <li><a href="#" className="hover:text-blue-600">Quy chuẩn duyệt truyện</a></li>
                <li><Link href="/forum" className="hover:text-blue-600">Học viện sáng tác</Link></li>
              </ul>
            </div>

            {/* Col 4: Tải app */}
            <div className="space-y-3">
              <h5 className="font-bold text-slate-900 text-sm">Tải ứng dụng StoryVN</h5>
              <p className="text-slate-500 text-xs leading-relaxed">
                Trải nghiệm đọc mượt mà hơn với chế độ Offline, chế độ nghe Audio và thông báo chương mới tức thì.
              </p>
              <div className="p-3 bg-white rounded-2xl border border-slate-200/80 flex items-center gap-3">
                <div className="w-14 h-14 bg-slate-900 text-white rounded-xl flex items-center justify-center text-xs font-mono font-bold">
                  [QR]
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs">Quét để tải ứng dụng</div>
                  <div className="text-[10px] text-slate-400">Hỗ trợ iOS &amp; Android</div>
                  <div className="text-[10px] text-blue-600 font-semibold mt-1">App Store • Google Play</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
            <div>© 2024 StoryVN Corporation. Bảo lưu toàn bộ quyền tác giả và nhà phát hành.</div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:underline">Điều khoản dịch vụ</a>
              <a href="#" className="hover:underline">Chính sách bảo mật</a>
              <a href="#" className="hover:underline">Báo cáo vi phạm bản quyền</a>
              <a href="#" className="hover:underline">Liên hệ quảng cáo</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ==================== 6. MODALS ==================== */}
      <AuthDrawer
        isOpen={isAuthOpen}
        mode={authMode}
        onClose={closeAuth}
        onSwitchMode={(mode) => setAuthMode(mode)}
        onSuccess={handleAuthSuccess}
      />

      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        defaultMode={logoutModalMode}
        onClose={() => setIsLogoutModalOpen(false)}
        onSuccess={() => {
          contextLogout();
          setIsLogoutModalOpen(false);
          router.refresh();
        }}
      />
    </div>
  );
};
