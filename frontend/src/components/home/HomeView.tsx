"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthDrawer, AuthMode } from "@/components/auth/AuthDrawer";
import { getStoredUser, getAccessToken, clearAuth } from "@/lib/auth/token";
import { User } from "@/types/auth";
import { authApi } from "@/lib/api/auth";
import {
  MOCK_STORIES,
  FEATURED_BANNER_STORIES,
  GENRES,
  Story,
} from "@/features/story/mockStories";

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
  const [user, setUser] = useState<User | null>(null);

  // Search & Navigation State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStoryTab, setActiveStoryTab] = useState<"hot" | "featured" | "new" | "full">("hot");
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string>("Tất cả");

  // Carousel Active Index (3D Coverflow)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Read stored user on client
  useEffect(() => {
    const token = getAccessToken();
    const stored = getStoredUser();
    if (token && stored) {
      setUser(stored);
    }
  }, []);

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

  // Auto rotate banner slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % FEATURED_BANNER_STORIES.length);
    }, 5000);
    return () => clearInterval(timer);
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

  const switchAuthMode = (mode: AuthMode) => {
    setAuthMode(mode);
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", `/${mode}`);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore error
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

  // Filtered stories for grid
  const displayedStories = useMemo(() => {
    return MOCK_STORIES.filter((story) => {
      const matchSearch =
        searchQuery.trim() === "" ||
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.genres.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchGenre =
        selectedGenre === "Tất cả" || story.genres.includes(selectedGenre);

      let matchTab = true;
      if (activeStoryTab === "hot") matchTab = !!story.isHot;
      else if (activeStoryTab === "featured") matchTab = story.rating >= 4.8;
      else if (activeStoryTab === "new") matchTab = story.status === "Đang ra";
      else if (activeStoryTab === "full") matchTab = story.status === "Hoàn thành";

      return matchSearch && matchGenre && matchTab;
    });
  }, [searchQuery, selectedGenre, activeStoryTab]);

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* ==================== 1. BRIGHT HEADER ==================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3 transition-shadow">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 sm:gap-6">
          {/* Logo StoryVn_HCM-UTE with subtitle */}
          <div className="flex flex-col shrink-0">
            <Link href="/" className="flex items-baseline gap-0.5 group">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#1d72fe]">
                Story<span className="text-[#f97316]">Vn</span>
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-500">_HCM-UTE</span>
            </Link>
            <span className="text-[10px] text-slate-500 font-medium -mt-1 hidden sm:inline">
              Đọc truyện &amp; sách online{" "}
              <span className="text-[#f97316] font-semibold underline underline-offset-2">
                bản quyền
              </span>
            </span>
          </div>

          {/* Genre Dropdown & Search Bar */}
          <div className="flex-1 max-w-xl flex items-center gap-3">
            {/* Genre Button */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:text-blue-600 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span>Thể loại</span>
                <svg
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                    isGenreDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Genre Dropdown Popover */}
              {isGenreDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setIsGenreDropdownOpen(false)}
                  />
                  <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 z-30 grid grid-cols-2 gap-1.5 animate-fadeIn">
                    {GENRES.map((genre) => (
                      <button
                        key={genre}
                        type="button"
                        onClick={() => {
                          setSelectedGenre(genre);
                          setIsGenreDropdownOpen(false);
                        }}
                        className={`text-left px-3 py-2 text-xs rounded-xl transition-colors cursor-pointer ${
                          selectedGenre === genre
                            ? "bg-blue-50 text-blue-600 font-bold"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Pill Search Input */}
            <div className="flex-1 relative">
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Tìm truyện..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-100/90 border border-transparent focus:border-blue-400 focus:bg-white text-slate-800 text-xs sm:text-sm rounded-full pl-9 pr-8 py-2 outline-none transition-all placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
                  >
                    &times;
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Controls: Nạp xu, Dark/Light Mode, User Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Nạp xu button */}
            <button
              type="button"
              onClick={() => openAuth("login")}
              className="bg-[#1d72fe] hover:bg-blue-600 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>Nạp xu</span>
            </button>

            {/* Light/Dark Mode Switcher Mock */}
            <button
              type="button"
              title="Đổi giao diện"
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-amber-500 transition-colors cursor-pointer"
            >
              <span className="text-sm">☀️</span>
            </button>

            {/* Account / Login button */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/me"
                  className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-blue-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full transition-all"
                >
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">
                    {user.displayName || user.username}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs text-slate-400 hover:text-red-500 transition-colors p-1"
                  title="Đăng xuất"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openAuth("login")}
                className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-blue-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-full transition-all cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-700 flex items-center justify-center text-xs">
                  👤
                </div>
                <span>Tài khoản</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ==================== 2. 3D COVERFLOW HERO CAROUSEL ==================== */}
      <section className="relative overflow-hidden py-6 sm:py-8 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-4 relative">
          {/* 3D Coverflow Container */}
          <div className="relative h-[220px] sm:h-[300px] md:h-[340px] flex items-center justify-center perspective-[1000px]">
            {FEATURED_BANNER_STORIES.map((story, index) => {
              // Calculate relative offset from active index (-2, -1, 0, 1, 2)
              const total = FEATURED_BANNER_STORIES.length;
              let diff = (index - currentSlideIndex + total) % total;
              if (diff > total / 2) diff -= total;

              // Only render items within -2 to +2
              const isVisible = Math.abs(diff) <= 2;
              if (!isVisible) return null;

              const isCenter = diff === 0;
              const isLeft1 = diff === -1;
              const isRight1 = diff === 1;
              const isLeft2 = diff === -2;
              const isRight2 = diff === 2;

              let transformClasses = "";
              let zIndex = 10;
              let opacity = "opacity-100";

              if (isCenter) {
                transformClasses = "scale-100 z-30 translate-x-0 shadow-2xl";
                zIndex = 30;
              } else if (isLeft1) {
                transformClasses = "scale-[0.88] z-20 -translate-x-[45%] sm:-translate-x-[50%] brightness-[0.85] shadow-xl";
                zIndex = 20;
              } else if (isRight1) {
                transformClasses = "scale-[0.88] z-20 translate-x-[45%] sm:translate-x-[50%] brightness-[0.85] shadow-xl";
                zIndex = 20;
              } else if (isLeft2) {
                transformClasses = "scale-[0.76] z-10 -translate-x-[85%] sm:-translate-x-[95%] brightness-[0.6] opacity-70";
                zIndex = 10;
              } else if (isRight2) {
                transformClasses = "scale-[0.76] z-10 translate-x-[85%] sm:translate-x-[95%] brightness-[0.6] opacity-70";
                zIndex = 10;
              }

              return (
                <div
                  key={story.id}
                  onClick={() => setCurrentSlideIndex(index)}
                  className={`absolute w-[280px] sm:w-[480px] md:w-[580px] h-full rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-out select-none border-2 border-white/60 ${transformClasses} ${opacity}`}
                  style={{ zIndex }}
                >
                  {/* Banner Image & Gradient Overlay */}
                  <img
                    src={story.bannerImage || story.coverImage}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" />

                  {/* Artwork UI Mockup Overlay for center slide */}
                  {isCenter && (
                    <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-between text-white">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="bg-amber-500 text-zinc-950 font-black text-[10px] px-2 py-0.5 rounded-sm uppercase tracking-wider">
                            HOT SPOTLIGHT
                          </span>
                          <span className="bg-black/50 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-full border border-white/20">
                            {story.genres[0]}
                          </span>
                        </div>
                        <div className="bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] text-amber-300 font-bold border border-white/10 flex items-center gap-1">
                          <span>★ {story.rating}</span>
                          <span className="text-white/60">({story.reviewCount})</span>
                        </div>
                      </div>

                      {/* Main Title Graphic */}
                      <div className="space-y-1 sm:space-y-2">
                        <span className="text-[11px] sm:text-xs text-amber-300 font-medium tracking-wide drop-shadow-md block">
                          Tác giả: {story.author}
                        </span>
                        <h2 className="text-base sm:text-2xl md:text-3xl font-black uppercase text-white drop-shadow-lg leading-tight line-clamp-2">
                          {story.title}
                        </h2>
                        <p className="text-[11px] sm:text-xs text-slate-200 line-clamp-2 drop-shadow-md max-w-lg hidden sm:block">
                          {story.synopsis}
                        </p>
                      </div>

                      {/* Bottom Slide Indicators */}
                      <div className="flex items-center justify-center gap-1.5 pt-1">
                        {FEATURED_BANNER_STORIES.map((_, dotIdx) => (
                          <button
                            key={dotIdx}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentSlideIndex(dotIdx);
                            }}
                            className={`h-1.5 rounded-full transition-all ${
                              dotIdx === currentSlideIndex
                                ? "w-6 bg-white"
                                : "w-1.5 bg-white/40 hover:bg-white/70"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Simple Title on Flanking Cards */}
                  {!isCenter && (
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-bold text-xs sm:text-sm drop-shadow-md truncate">
                        {story.title}
                      </h3>
                      <span className="text-[10px] text-amber-300">{story.genres[0]}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Prev/Next Controls */}
          <button
            type="button"
            onClick={() =>
              setCurrentSlideIndex(
                (prev) => (prev - 1 + FEATURED_BANNER_STORIES.length) % FEATURED_BANNER_STORIES.length
              )
            }
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center text-slate-700 hover:text-blue-600 transition-all cursor-pointer"
            aria-label="Truyện trước"
          >
            &larr;
          </button>
          <button
            type="button"
            onClick={() =>
              setCurrentSlideIndex((prev) => (prev + 1) % FEATURED_BANNER_STORIES.length)
            }
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center text-slate-700 hover:text-blue-600 transition-all cursor-pointer"
            aria-label="Truyện sau"
          >
            &rarr;
          </button>
        </div>
      </section>

      {/* ==================== 3. FOUR ACTION BUTTONS ==================== */}
      <section className="max-w-6xl mx-auto w-full px-4 my-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* 1. Nạp xu */}
          <button
            type="button"
            onClick={() => openAuth("login")}
            className="flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-400 rounded-xl text-slate-700 font-semibold text-xs sm:text-sm shadow-2xs hover:shadow-md transition-all cursor-pointer"
          >
            <span className="text-xl">🪙</span>
            <span>Nạp xu</span>
          </button>

          {/* 2. Mua hội viên (Highlight Blue) */}
          <button
            type="button"
            onClick={() => openAuth("login")}
            className="flex items-center justify-center gap-2.5 py-3.5 px-4 bg-[#1d72fe] hover:bg-blue-600 text-white rounded-xl font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/20 hover:shadow-lg transition-all cursor-pointer"
          >
            <span className="text-xl">👑</span>
            <span>Mua hội viên</span>
          </button>

          {/* 3. Lịch sử đọc */}
          <button
            type="button"
            onClick={() => openAuth("login")}
            className="flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-400 rounded-xl text-slate-700 font-semibold text-xs sm:text-sm shadow-2xs hover:shadow-md transition-all cursor-pointer"
          >
            <span className="text-xl text-blue-500">🕒</span>
            <span>Lịch sử đọc</span>
          </button>

          {/* 4. Tủ truyện */}
          <button
            type="button"
            onClick={() => openAuth("login")}
            className="flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-400 rounded-xl text-slate-700 font-semibold text-xs sm:text-sm shadow-2xs hover:shadow-md transition-all cursor-pointer"
          >
            <span className="text-xl text-blue-500">📚</span>
            <span>Tủ truyện</span>
          </button>
        </div>
      </section>

      {/* ==================== 4. STORY TABS & BOOK GRID ==================== */}
      <main className="max-w-6xl mx-auto w-full px-4 py-6 flex-1">
        {/* Navigation Tab Bar: Truyện hot / Đề cử / Truyện mới / Đã hoàn thành */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-6">
          <div className="flex items-center gap-6 sm:gap-8">
            <button
              type="button"
              onClick={() => setActiveStoryTab("hot")}
              className={`text-sm sm:text-base font-bold pb-2 -mb-3 transition-colors relative cursor-pointer ${
                activeStoryTab === "hot"
                  ? "text-blue-600"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Truyện hot
              {activeStoryTab === "hot" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveStoryTab("featured")}
              className={`text-sm sm:text-base font-bold pb-2 -mb-3 transition-colors relative cursor-pointer ${
                activeStoryTab === "featured"
                  ? "text-blue-600"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Đề cử
              {activeStoryTab === "featured" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveStoryTab("new")}
              className={`text-sm sm:text-base font-bold pb-2 -mb-3 transition-colors relative cursor-pointer ${
                activeStoryTab === "new"
                  ? "text-blue-600"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Truyện mới
              {activeStoryTab === "new" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveStoryTab("full")}
              className={`text-sm sm:text-base font-bold pb-2 -mb-3 transition-colors relative cursor-pointer ${
                activeStoryTab === "full"
                  ? "text-blue-600"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Đã hoàn
              {activeStoryTab === "full" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          </div>

          {selectedGenre !== "Tất cả" && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full font-medium">
                {selectedGenre}
              </span>
              <button
                type="button"
                onClick={() => setSelectedGenre("Tất cả")}
                className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕ Xóa lọc
              </button>
            </div>
          )}
        </div>

        {/* Book Cover Cards Grid (7 columns like reference image) */}
        {displayedStories.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl p-10 text-center text-slate-500">
            Không tìm thấy truyện nào trong mục này.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4 sm:gap-5">
            {displayedStories.map((story) => (
              <div
                key={story.id}
                onClick={() => openAuth("login")}
                className="group flex flex-col cursor-pointer"
              >
                {/* Book Cover Container */}
                <div className="relative aspect-3/4 w-full rounded-xl overflow-hidden shadow-sm group-hover:shadow-xl group-hover:-translate-y-1.5 transition-all duration-300 bg-slate-100">
                  {/* Image */}
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient bottom overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Diagonal Corner Ribbon "ĐÃ HOÀN" (Matches reference image!) */}
                  {story.badge === "ĐÃ HOÀN" && (
                    <div className="absolute -left-7 top-3 w-28 bg-[#38bdf8] text-white text-[9px] font-black uppercase text-center py-0.5 -rotate-45 shadow-sm tracking-wider">
                      ĐÃ HOÀN
                    </div>
                  )}
                  {story.badge === "HOT" && (
                    <div className="absolute -left-7 top-3 w-28 bg-[#ef4444] text-white text-[9px] font-black uppercase text-center py-0.5 -rotate-45 shadow-sm tracking-wider">
                      HOT
                    </div>
                  )}

                  {/* Title overlay on cover */}
                  <div className="absolute bottom-2 left-2 right-2 text-white">
                    <h3 className="font-bold text-xs sm:text-sm drop-shadow-md text-center leading-snug line-clamp-2">
                      {story.title}
                    </h3>
                  </div>
                </div>

                {/* Info below cover */}
                <div className="mt-2 text-center sm:text-left">
                  <h4 className="font-semibold text-xs sm:text-sm text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {story.title}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-0.5">
                    <span>{story.genres[0]}</span>
                    <span>{story.chaptersCount}c</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ==================== 5. BRIGHT CLEAN FOOTER ==================== */}
      <footer className="border-t border-slate-100 bg-slate-50/80 py-8 px-6 text-xs text-slate-500 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <span className="font-bold text-slate-800">StoryVn_HCM-UTE</span>
            <span>&bull;</span>
            <span>Trang đọc truyện online bản quyền hàng đầu Việt Nam.</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <button
              type="button"
              onClick={() => openAuth("login")}
              className="hover:text-blue-600 cursor-pointer"
            >
              Đăng nhập
            </button>
            <span>&bull;</span>
            <button
              type="button"
              onClick={() => openAuth("register")}
              className="hover:text-blue-600 cursor-pointer"
            >
              Đăng ký
            </button>
            <span>&bull;</span>
            <button
              type="button"
              onClick={() => openAuth("forgot-password")}
              className="hover:text-blue-600 cursor-pointer"
            >
              Quên mật khẩu
            </button>
          </div>
        </div>
      </footer>

      {/* ==================== 6. CENTERED AUTH MODAL ==================== */}
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
